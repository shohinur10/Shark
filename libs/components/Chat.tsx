import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack, IconButton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import ReplyIcon from '@mui/icons-material/Reply';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert, sweetTopSmallSuccessAlert } from '../sweetAlert';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member | null | undefined;
	messageId?: string;
	replyTo?: string; // ID of the message being replied to
	replyToText?: string; // Text of the message being replied to
	replyToMember?: Member | null | undefined; // Member who sent the original message
	timestamp?: number;
}

interface ReplyState {
	messageId: string;
	text: string;
	memberData: Member | null | undefined;
}
  
  interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member | null | undefined;
	action: string;
  }

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const [replyingTo, setReplyingTo] = useState<ReplyState | null>(null);
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);

	// Check if user can view messages (only TRAINER and ADMIN)
	const canViewMessages = user?.memberType === 'TRAINER' || user?.memberType === 'ADMIN';
	// All authenticated users can send messages
	const canSendMessages = !!user?._id;

	/** LIFECYCLES **/

	useEffect(() => {
		if (!socket) return;

		const handleMessage = (msg: MessageEvent) => {
			try {
				const data = JSON.parse(msg.data);
				console.log('Websocket message:', data);
				switch (data.event) {
					case 'info':
						const newInfo: InfoPayload = data;
						setOnlineUsers(newInfo.totalClients);
						break;
					case 'getMessages':
						const list: MessagePayload[] = data.list || [];
						// Only show messages if user is TRAINER or ADMIN
						if (canViewMessages) {
							setMessagesList(list);
						}
						break;
					case 'message':
						const newMessage: MessagePayload = data;
						// Only add message to list if user can view messages
						if (canViewMessages) {
							setMessagesList((prevMessages) => [...prevMessages, newMessage]);
						}
						break;
				}
			} catch (error) {
				console.error('Error parsing WebSocket message:', error);
			}
		};

		socket.onmessage = handleMessage;

		// Request messages from backend when socket opens and user can view
		const requestMessages = () => {
			if (socket.readyState === WebSocket.OPEN && canViewMessages) {
				socket.send(JSON.stringify({ event: 'getMessages' }));
			}
		};

		// Request messages immediately if socket is already open
		if (socket.readyState === WebSocket.OPEN) {
			requestMessages();
		} else {
			// Wait for socket to open, then request messages
			socket.addEventListener('open', requestMessages);
		}

		// Cleanup function
		return () => {
			if (socket) {
				socket.removeEventListener('open', requestMessages);
				socket.onmessage = null;
			}
		};
	}, [socket, canViewMessages]);
	useEffect(() => {
		// Only show chat button if user can send messages
		if (canSendMessages) {
			const timeoutId = setTimeout(() => {
				setOpenButton(true);
			}, 100);
			return () => clearTimeout(timeoutId);
		} else {
			setOpenButton(false);
		}
	}, [canSendMessages]);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	/** HANDLERS **/
	const handleOpenChat = () => {
		const newOpenState = !open;
		setOpen(newOpenState);
		
		// Request messages when chat is opened and user can view them
		if (newOpenState && socket && socket.readyState === WebSocket.OPEN && canViewMessages) {
			socket.send(JSON.stringify({ event: 'getMessages' }));
		}
	};

	const getInputMessageHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const text = e.target.value;
		setMessageInput(text);
	}, []);

	const getKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		try {
			if (e.key === 'Enter') {
				onClickHandler();
			}
		} catch (err: any) {
			console.error('Error in getKeyHandler:', err);
		}
	};

	const onClickHandler = () => {
		if (!canSendMessages) {
			sweetErrorAlert('You must be logged in to send messages.');
			return;
		}

		if (!messageInput.trim()) {
			sweetErrorAlert(Messages.error4);
			return;
		}
		
		if (!socket || socket.readyState !== WebSocket.OPEN) {
			sweetErrorAlert('Chat connection is not available. Please try again later.');
			return;
		}

		try {
			const messageData: any = {
				event: 'message',
				data: messageInput.trim(),
				memberId: user?._id,
				memberType: user?.memberType,
			};

			// Add reply information if replying to a message
			if (replyingTo) {
				messageData.replyTo = replyingTo.messageId;
				messageData.replyToText = replyingTo.text;
				messageData.replyToMember = replyingTo.memberData;
			}

			socket.send(JSON.stringify(messageData));
			const sentMessage = messageInput.trim();
			setMessageInput('');
			setReplyingTo(null);

			// Show feedback for non-TRAINER/ADMIN users
			if (!canViewMessages) {
				sweetTopSmallSuccessAlert('Message sent! Trainers and admins will see your message and respond here.', 3000);
			} else if (replyingTo) {
				sweetTopSmallSuccessAlert('Reply sent!', 1500);
			}
		} catch (error) {
			console.error('Error sending message:', error);
			sweetErrorAlert('Failed to send message. Please try again.');
		}
	};

	const handleReplyClick = (message: MessagePayload) => {
		// Only TRAINER and ADMIN can reply to messages
		if (!canViewMessages) {
			sweetErrorAlert('Only trainers and admins can reply to messages.');
			return;
		}

		// Can't reply to own messages
		if (message.memberData?._id === user?._id) {
			sweetErrorAlert('You cannot reply to your own messages.');
			return;
		}

		// Need messageId to reply
		if (!message.messageId) {
			sweetErrorAlert('Cannot reply to this message. Message ID is missing.');
			return;
		}

		// Set the reply state
		setReplyingTo({
			messageId: message.messageId,
			text: message.text,
			memberData: message.memberData,
		});

		// Scroll to input area to focus on reply
		setTimeout(() => {
			const inputElement = document.querySelector('.msg-input') as HTMLInputElement;
			if (inputElement) {
				inputElement.focus();
			}
		}, 100);
	};

	const handleCancelReply = () => {
		setReplyingTo(null);
	};

	return (
		<Stack className="chatting">
			{openButton ? (
				<button className="chat-button" onClick={handleOpenChat}>
					{open ? <CloseFullscreenIcon /> : <MarkChatUnreadIcon />}
				</button>
			) : null}
			<Stack className={`chat-frame ${open ? 'open' : ''}`}>
				<Box className={'chat-top'} component={'div'}>
					<div style={{ fontFamily: 'Nunito' }}>
						{canViewMessages ? 'Support Chat (Trainer/Admin View)' : 'Support Chat'}
					</div>
					{canViewMessages && (
						<RippleBadge style={{ margin: '-18px 0 0 21px' }} badgeContent={onlineUsers} />
					)}
				</Box>
				<Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
								<div className={'welcome'}>
									{canViewMessages 
										? 'Welcome to Live chat! You can view and respond to all messages.' 
										: 'Welcome to Live chat! Your messages will be sent to trainers and admins. They will respond here.'}
								</div>
							</Box>
							{!canViewMessages && messagesList.length === 0 && (
								<Box sx={{ textAlign: 'center', py: 3, px: 2 }}>
									<Typography sx={{ fontSize: '14px', color: '#6B6B6B', fontStyle: 'italic', mb: 1 }}>
										Your messages are being sent to our support team. Only trainers and admins can view and respond to messages.
									</Typography>
									<Typography sx={{ fontSize: '12px', color: '#9E9E9E', fontStyle: 'italic' }}>
										When a trainer or admin responds, you'll see their message here.
									</Typography>
								</Box>
							)}
							{canViewMessages && messagesList.length === 0 && (
								<Box sx={{ textAlign: 'center', py: 3, px: 2 }}>
									<Typography sx={{ fontSize: '14px', color: '#6B6B6B', fontStyle: 'italic' }}>
										No messages yet. All user messages will appear here for you to respond.
									</Typography>
								</Box>
							)}
							{messagesList.map((ele: MessagePayload, index: number) => {
								const { text, memberData, replyTo, replyToText, replyToMember } = ele;
								const memberImage = memberData?.memberImage
									? `${REACT_APP_API_URL}/${memberData.memberImage}`
									: '/img/profile/defaultUser.svg';
								const messageKey = ele.messageId || (memberData?._id ? `${memberData._id}-${index}` : `message-${index}`);
								const isOwnMessage = memberData?._id === user?._id;
								
								return isOwnMessage ? (
									<Box
										key={messageKey}
										component={'div'}
										flexDirection={'row'}
										style={{ display: 'flex' }}
										alignItems={'flex-end'}
										justifyContent={'flex-end'}
										sx={{ m: '10px 0px' }}
									>
										<Box sx={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
											{replyTo && replyToText && (
												<Box
													sx={{
														mb: 0.5,
														p: 1,
														borderRadius: 1,
														backgroundColor: 'rgba(0, 0, 0, 0.05)',
														borderLeft: '3px solid #E10600',
														width: '100%',
													}}
												>
													<Typography variant="caption" sx={{ fontSize: '10px', color: '#757575', display: 'block' }}>
														{replyToMember?.memberNick || replyToMember?.memberFullName || 'User'}
													</Typography>
													<Typography variant="body2" sx={{ fontSize: '11px', color: '#616161', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
														{replyToText}
													</Typography>
												</Box>
											)}
											<div className={'msg-right'}>{text}</div>
										</Box>
									</Box>
								) : (
									<Box key={messageKey} flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px', position: 'relative' }} component={'div'}>
										<Avatar alt={memberData?.memberNick || 'User'} src={memberImage} />
										<Box sx={{ ml: 1, maxWidth: '70%', flex: 1 }}>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
												<Typography variant="caption" sx={{ fontSize: '11px', color: '#757575', fontWeight: 600 }}>
													{memberData?.memberNick || memberData?.memberFullName || 'User'}
												</Typography>
												{memberData?.memberType && (
													<Box
														sx={{
															px: 0.5,
															py: 0.25,
															borderRadius: 0.5,
															backgroundColor: memberData.memberType === 'ADMIN' ? '#E10600' : '#1976D2',
															color: '#FFFFFF',
															fontSize: '9px',
															fontWeight: 600,
														}}
													>
														{memberData.memberType}
													</Box>
												)}
											</Box>
											{replyTo && replyToText && (
												<Box
													sx={{
														mb: 0.5,
														p: 1,
														borderRadius: 1,
														backgroundColor: 'rgba(0, 0, 0, 0.05)',
														borderLeft: '3px solid #E10600',
													}}
												>
													<Typography variant="caption" sx={{ fontSize: '10px', color: '#757575', display: 'block' }}>
														{replyToMember?.memberNick || replyToMember?.memberFullName || 'User'}
													</Typography>
													<Typography variant="body2" sx={{ fontSize: '11px', color: '#616161', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
														{replyToText}
													</Typography>
												</Box>
											)}
											<div className={'msg-left'}>{text}</div>
										</Box>
										{/* Only show reply button to TRAINER and ADMIN users */}
										{canViewMessages && (
											<IconButton
												size="small"
												onClick={() => handleReplyClick(ele)}
												sx={{
													position: 'absolute',
													right: 0,
													top: 0,
													padding: '4px',
													color: '#757575',
													'&:hover': { color: '#E10600', backgroundColor: 'rgba(225, 6, 0, 0.1)' },
												}}
												title="Reply to this message"
											>
												<ReplyIcon fontSize="small" />
											</IconButton>
										)}
									</Box>
								);
							})}
						</Stack>
					</ScrollableFeed>
				</Box>
				<Box className={'chat-bott'} component={'div'}>
					{/* Reply Preview */}
					{replyingTo && (
						<Box
							sx={{
								p: 1.5,
								mb: 1,
								backgroundColor: 'rgba(225, 6, 0, 0.08)',
								borderLeft: '3px solid #E10600',
								borderRadius: 1,
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<Box sx={{ flex: 1, minWidth: 0 }}>
								<Typography variant="caption" sx={{ fontSize: '11px', color: '#757575', display: 'block', fontWeight: 600 }}>
									Replying to {replyingTo.memberData?.memberNick || replyingTo.memberData?.memberFullName || 'User'}
								</Typography>
								<Typography
									variant="body2"
									sx={{
										fontSize: '12px',
										color: '#616161',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
										mt: 0.5,
									}}
								>
									{replyingTo.text}
								</Typography>
							</Box>
							<IconButton
								size="small"
								onClick={handleCancelReply}
								sx={{
									color: '#757575',
									'&:hover': { color: '#E10600', backgroundColor: 'rgba(225, 6, 0, 0.1)' },
								}}
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						</Box>
					)}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<input
							type={'text'}
							name={'message'}
							className={'msg-input'}
							placeholder={replyingTo ? 'Type your reply...' : 'Type message'}
							value={messageInput}
							onChange={getInputMessageHandler}
							onKeyDown={getKeyHandler}
						/>
						<button className={'send-msg-btn'} onClick={onClickHandler}>
							<SendIcon style={{ color: '#fff' }} />
						</button>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Chat;

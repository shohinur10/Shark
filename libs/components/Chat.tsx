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
import { sweetErrorAlert } from '../sweetAlert';

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
						const list: MessagePayload[] = data.list;
						setMessagesList(list);
						break;
					case 'message':
						const newMessage: MessagePayload = data;
						setMessagesList((prevMessages) => [...prevMessages, newMessage]);
						break;
				}
			} catch (error) {
				console.error('Error parsing WebSocket message:', error);
			}
		};

		socket.onmessage = handleMessage;

		// Cleanup function
		return () => {
			if (socket) {
				socket.onmessage = null;
			}
		};
	}, [socket]);
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prevState) => !prevState);
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
		if (!messageInput) {
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
				data: messageInput,
			};

			// Add reply information if replying to a message
			if (replyingTo) {
				messageData.replyTo = replyingTo.messageId;
				messageData.replyToText = replyingTo.text;
				messageData.replyToMember = replyingTo.memberData;
			}

			socket.send(JSON.stringify(messageData));
			setMessageInput('');
			setReplyingTo(null);
		} catch (error) {
			console.error('Error sending message:', error);
			sweetErrorAlert('Failed to send message. Please try again.');
		}
	};

	const handleReplyClick = (message: MessagePayload) => {
		if (message.memberData?._id === user?._id) return; // Can't reply to own messages
		if (message.messageId) {
			setReplyingTo({
				messageId: message.messageId,
				text: message.text,
				memberData: message.memberData,
			});
		}
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
					<div style={{ fontFamily: 'Nunito' }}>Online Chat</div>
					<RippleBadge style={{ margin: '-18px 0 0 21px' }} badgeContent={onlineUsers} />
				</Box>
				<Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
								<div className={'welcome'}>Welcome to Live chat!</div>
							</Box>
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
										>
											<ReplyIcon fontSize="small" />
										</IconButton>
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

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { GET_NOTIFICATIONS, GET_UNREAD_NOTIFICATION_COUNT } from '../../apollo/user/query';
import { MARK_NOTIFICATION_AS_READ, MARK_ALL_NOTIFICATIONS_AS_READ, DELETE_NOTIFICATION } from '../../apollo/user/mutation';
import { Notification } from '../types/notification/notification';
import { NotificationInquiry } from '../types/notification/notification.input';
import { NotificationStatus, NotificationType } from '../enums/notification.enum';
import { Box, Stack, Menu, MenuItem, Badge, Typography, IconButton, Divider, Button } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import moment from 'moment';
import { REACT_APP_API_URL } from '../config';

const StyledMenu = styled((props: any) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: 12,
		marginTop: theme.spacing(1),
		minWidth: 380,
		maxWidth: 420,
		maxHeight: 500,
		color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '8px 0',
		},
		'& .MuiMenuItem-root': {
			'&:active': {
				backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
			},
		},
	},
}));

const NotificationItem = styled(Box)(({ theme }) => ({
	padding: '12px 16px',
	cursor: 'pointer',
	transition: 'background-color 0.2s',
	'&:hover': {
		backgroundColor: alpha(theme.palette.primary.main, 0.08),
	},
	'&.unread': {
		backgroundColor: alpha(theme.palette.primary.main, 0.04),
		borderLeft: `3px solid ${theme.palette.primary.main}`,
		paddingLeft: '13px',
	},
}));

interface NotificationDropdownProps {
	anchorEl: HTMLElement | null;
	open: boolean;
	onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ anchorEl, open, onClose }) => {
	const router = useRouter();
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState<number>(0);

	const inquiry: NotificationInquiry = {
		page: 1,
		limit: 20,
	};

	const { data: notificationsData, loading: notificationsLoading, refetch: refetchNotifications } = useQuery(GET_NOTIFICATIONS, {
		variables: { input: inquiry },
		skip: !open,
		pollInterval: open ? 30000 : 0, // Poll every 30 seconds when open
	});

	const { data: unreadCountData, refetch: refetchUnreadCount } = useQuery(GET_UNREAD_NOTIFICATION_COUNT, {
		pollInterval: 60000, // Poll every minute for unread count
	});

	const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);
	const [markAllAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ);
	const [deleteNotification] = useMutation(DELETE_NOTIFICATION);

	useEffect(() => {
		if (notificationsData?.getMyNotifications) {
			setNotifications(notificationsData.getMyNotifications.list || []);
			// Use unreadCount from metaCounter if available, otherwise fall back to separate query
			if (notificationsData.getMyNotifications.metaCounter?.unreadCount !== undefined) {
				setUnreadCount(notificationsData.getMyNotifications.metaCounter.unreadCount);
			}
		}
	}, [notificationsData]);

	useEffect(() => {
		if (unreadCountData?.getUnreadNotificationCount !== undefined) {
			setUnreadCount(unreadCountData.getUnreadNotificationCount || 0);
		}
	}, [unreadCountData]);

	const handleNotificationClick = async (notification: Notification) => {
		try {
			// Mark as read if unread
			if (notification.notificationStatus === NotificationStatus.WAIT) {
				await markAsRead({
					variables: { input: { notificationId: notification._id } },
				});
				await refetchNotifications();
				await refetchUnreadCount();
			}

			// Navigate to notification URL if available
			if (notification.notificationUrl) {
				router.push(notification.notificationUrl);
				onClose();
			} else {
				// Fallback: implement navigation logic based on notificationGroup and notificationRefId
				onClose();
			}
		} catch (error) {
			console.error('Error handling notification click:', error);
		}
	};

	const handleMarkAllAsRead = async () => {
		try {
			await markAllAsRead();
			await refetchNotifications();
			await refetchUnreadCount();
		} catch (error) {
			console.error('Error marking all as read:', error);
		}
	};

	const handleDeleteNotification = async (e: React.MouseEvent, notificationId: string) => {
		e.stopPropagation();
		try {
			await deleteNotification({
				variables: { input: { notificationId } },
			});
			await refetchNotifications();
			await refetchUnreadCount();
		} catch (error) {
			console.error('Error deleting notification:', error);
		}
	};

	const getNotificationIcon = (type: NotificationType) => {
		switch (type) {
			case NotificationType.COMMENT:
				return <CommentIcon sx={{ fontSize: 20, color: '#1976d2' }} />;
			case NotificationType.LIKE:
				return <FavoriteIcon sx={{ fontSize: 20, color: '#e91e63' }} />;
			case NotificationType.FOLLOW:
				return <PersonAddIcon sx={{ fontSize: 20, color: '#4caf50' }} />;
			case NotificationType.BOOKING:
				return <EventIcon sx={{ fontSize: 20, color: '#ff9800' }} />;
			case NotificationType.ACHIEVEMENT:
				return <EmojiEventsIcon sx={{ fontSize: 20, color: '#ffc107' }} />;
			case NotificationType.MESSAGE:
				return <MessageIcon sx={{ fontSize: 20, color: '#9c27b0' }} />;
			default:
				return <NotificationsIcon sx={{ fontSize: 20, color: '#757575' }} />;
		}
	};

	const formatNotificationTime = (date: Date) => {
		const now = moment();
		const notificationDate = moment(date);
		const diffMinutes = now.diff(notificationDate, 'minutes');

		if (diffMinutes < 1) return 'Just now';
		if (diffMinutes < 60) return `${diffMinutes}m ago`;
		if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
		if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)}d ago`;
		return notificationDate.format('MMM D, YYYY');
	};

	return (
		<StyledMenu
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
		>
			<Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600 }}>
					Notifications
				</Typography>
				{unreadCount > 0 && (
					<Button
						size="small"
						onClick={handleMarkAllAsRead}
						startIcon={<CheckCircleIcon />}
						sx={{ fontSize: 12, textTransform: 'none' }}
					>
						Mark all read
					</Button>
				)}
			</Box>
			<Divider />
			<Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
				{notificationsLoading ? (
					<Box sx={{ p: 3, textAlign: 'center' }}>
						<Typography variant="body2" color="text.secondary">
							Loading notifications...
						</Typography>
					</Box>
				) : notifications.length === 0 ? (
					<Box sx={{ p: 3, textAlign: 'center' }}>
						<NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
						<Typography variant="body2" color="text.secondary">
							No notifications
						</Typography>
					</Box>
				) : (
					notifications.map((notification) => (
						<NotificationItem
							key={notification._id}
							className={notification.notificationStatus === NotificationStatus.WAIT ? 'unread' : ''}
							onClick={() => handleNotificationClick(notification)}
						>
							<Stack direction="row" spacing={2} alignItems="flex-start">
								<Box sx={{ mt: 0.5 }}>
									{(notification.actionMemberData?.memberImage || notification.authorData?.memberImage) ? (
										<Box
											component="img"
											src={`${REACT_APP_API_URL}/${notification.actionMemberData?.memberImage || notification.authorData?.memberImage}`}
											alt={notification.actionMemberData?.memberNick || notification.authorData?.memberNick || 'User'}
											sx={{
												width: 40,
												height: 40,
												borderRadius: '50%',
												objectFit: 'cover',
											}}
										/>
									) : (
										<Box
											sx={{
												width: 40,
												height: 40,
												borderRadius: '50%',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												bgcolor: 'primary.light',
												color: 'primary.contrastText',
											}}
										>
											{getNotificationIcon(notification.notificationType)}
										</Box>
									)}
								</Box>
								<Box sx={{ flex: 1, minWidth: 0 }}>
									<Typography
										variant="body2"
										sx={{
											fontWeight: notification.notificationStatus === NotificationStatus.WAIT ? 600 : 400,
											mb: 0.5,
											lineHeight: 1.4,
										}}
									>
										{notification.notificationMessage || notification.notificationTitle}
									</Typography>
									{notification.notificationDesc && notification.notificationMessage && (
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{
												fontSize: 13,
												mb: 0.5,
											}}
										>
											{notification.notificationDesc}
										</Typography>
									)}
									{notification.relatedCommentData && (
										<Box
											sx={{
												mt: 1,
												p: 1,
												bgcolor: 'grey.100',
												borderRadius: 1,
												borderLeft: '3px solid',
												borderColor: 'primary.main',
											}}
										>
											<Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mb: 0.5 }}>
												{notification.relatedCommentData.memberData?.memberNick || 'Someone'} commented:
											</Typography>
											<Typography variant="body2" sx={{ fontSize: 13 }}>
												"{notification.relatedCommentData.commentContent}"
											</Typography>
										</Box>
									)}
									<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
										{formatNotificationTime(new Date(notification.createdAt))}
									</Typography>
								</Box>
								<IconButton
									size="small"
									onClick={(e) => handleDeleteNotification(e, notification._id)}
									sx={{ mt: 0.5 }}
								>
									<DeleteIcon sx={{ fontSize: 18 }} />
								</IconButton>
							</Stack>
						</NotificationItem>
					))
				)}
			</Box>
		</StyledMenu>
	);
};

export default NotificationDropdown;








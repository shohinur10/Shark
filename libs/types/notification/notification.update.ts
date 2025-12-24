import { NotificationType, NotificationStatus, NotificationGroup } from '../../enums/notification.enum';

export interface NotificationUpdate {
	_id: string;
	notificationType?: NotificationType;
	notificationStatus?: NotificationStatus;
	notificationGroup?: NotificationGroup;
	notificationTitle?: string;
	notificationDesc?: string;
	authorId?: string;
	receiverId?: string;
	memberId?: string;
	actionMemberId?: string;
	propertyId?: string;
	articleId?: string;
	notificationRefId?: string;
	notificationMessage?: string;
	notificationUrl?: string;
}

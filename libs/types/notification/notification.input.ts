import { NotificationType, NotificationStatus, NotificationGroup } from '../../enums/notification.enum';
import { Direction } from '../../enums/common.enum';

export interface NotificationInput {
	notificationType: NotificationType;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc?: string;
	authorId: string;
	receiverId: string;
	propertyId?: string;
	articleId?: string;
	notificationRefId?: string;
	notificationMessage?: string;
	notificationUrl?: string;
	memberId?: string;
	actionMemberId?: string;
	commentId?: string;
}

interface NotificationSearch {
	receiverId?: string;
	authorId?: string;
	notificationType?: NotificationType;
	notificationStatus?: NotificationStatus;
	notificationGroup?: NotificationGroup;
}

export interface NotificationsInquiry {
	page?: number;
	limit?: number;
	sort?: string;
	direction?: Direction;
	search?: NotificationSearch;
	receiverId?: string;
	notificationStatus?: NotificationStatus;
}

// Alias for backward compatibility
export type NotificationInquiry = NotificationsInquiry;

export interface NotificationMarkAsReadInput {
	notificationId: string;
}

export interface NotificationDeleteInput {
	notificationId: string;
}


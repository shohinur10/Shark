import { NotificationType, NotificationStatus, NotificationGroup } from '../../enums/notification.enum';
import { Member } from '../member/member';
import { Comment } from '../comment/comment';
import { TotalCounter } from '../property/property';

export interface NotificationCounter {
	totalCount?: number;
	unreadCount?: number;
	total?: number; // For backward compatibility
}

export interface Notification {
	_id: string;
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc?: string;
	notificationRefId?: string;
	notificationMessage?: string;
	notificationUrl?: string;
	authorId: string;
	receiverId: string;
	memberId?: string;
	actionMemberId?: string;
	propertyId?: string;
	articleId?: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation */
	authorData?: Member;
	memberData?: Member;
	actionMemberData?: Member;
	relatedCommentData?: Comment;
}

export interface Notifications {
	list: Notification[];
	metaCounter: (NotificationCounter | TotalCounter)[];
}


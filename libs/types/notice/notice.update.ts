import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

export interface NoticeUpdate {
	_id: string;
	noticeCategory?: NoticeCategory;
	noticeStatus?: NoticeStatus;
	noticeTitle?: string;
	noticeContent?: string;
	noticeImage?: string;
	noticeUrl?: string;
	displayOrder?: number;
	startDate?: Date;
	endDate?: Date;
}




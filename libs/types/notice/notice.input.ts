import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { Direction } from '../../enums/common.enum';

export interface NoticeInput {
	noticeCategory: NoticeCategory;
	noticeTitle: string;
	noticeContent: string;
	noticeImage?: string;
	noticeUrl?: string;
	noticeStatus?: NoticeStatus;
	displayOrder?: number;
	startDate?: Date;
	endDate?: Date;
	createdBy?: string;
}

interface NoticeSearch {
	noticeCategory?: NoticeCategory;
	noticeStatus?: NoticeStatus;
	text?: string;
}

export interface NoticesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: NoticeSearch;
	noticeStatus?: NoticeStatus;
	noticeCategory?: NoticeCategory;
}








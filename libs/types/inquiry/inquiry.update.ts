import { InquiryCategory, InquiryPriority, InquiryStatus } from '../../enums/inquiry.enum';

export interface InquiryUpdate {
	_id: string;
	inquiryCategory?: InquiryCategory;
	inquiryStatus?: InquiryStatus;
	inquiryPriority?: InquiryPriority;
	subject?: string;
	question?: string;
	aiResponse?: string;
	humanResponse?: string;
	respondedBy?: string;
	respondedAt?: Date;
	resolvedAt?: Date;
	closedAt?: Date;
}







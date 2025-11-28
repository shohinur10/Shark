import { InquiryCategory, InquiryStatus } from '../../enums/inquiry.enum';
import { Direction } from '../../enums/common.enum';

export interface InquiryInput {
	inquiryCategory: InquiryCategory;
	subject: string;
	question: string;
	userId?: string;
}

interface IISearch {
	inquiryStatus?: InquiryStatus;
	inquiryCategory?: InquiryCategory;
}

export interface InquiriesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: IISearch;
}

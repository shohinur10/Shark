import { InquiryCategory, InquiryPriority, InquiryStatus } from '../../enums/inquiry.enum';
import { Direction } from '../../enums/common.enum';

export interface ConversationMessageInput {
	sender?: string;
	message?: string;
	isAI?: boolean;
	timestamp?: Date;
}

export interface InquiryInput {
	inquiryCategory: string;
	subject: string;
	question: string;
	userId?: string;
	inquiryStatus?: string;
	inquiryPriority?: string;
	aiResponse?: string;
	aiConfidence?: number;
	wasAiHelpful?: boolean;
	suggestedFaqs?: string[];
	humanResponse?: string;
	respondedBy?: string;
	respondedAt?: Date;
	conversation?: ConversationMessageInput[];
	resolvedAt?: Date;
	closedAt?: Date;
}

export interface InquirySearch {
	inquiryStatus?: string;
	inquiryCategory?: string;
}

export interface InquiriesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: InquirySearch;
}

export interface RespondToInquiryInput {
	inquiryId: string;
	response: string;
}

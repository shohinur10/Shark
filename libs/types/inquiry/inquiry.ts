import { InquiryCategory, InquiryPriority, InquiryStatus } from '../../enums/inquiry.enum';
import { Faq } from '../faq/faq';
import { TotalCounter } from "../common"';

export interface ConversationMessage {
	sender: string;
	message: string;
	isAI: boolean;
	timestamp: Date;
}

export interface Inquiry {
	_id: string;
	userId: string;
	inquiryCategory: InquiryCategory;
	inquiryStatus: InquiryStatus;
	inquiryPriority: InquiryPriority;
	subject: string;
	question: string;
	aiResponse?: string;
	aiConfidence?: number;
	wasAiHelpful?: boolean;
	suggestedFaqs: string[];
	humanResponse?: string;
	respondedBy?: string;
	respondedAt?: Date;
	conversation: ConversationMessage[];
	resolvedAt?: Date;
	closedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface Inquiries {
	list: Inquiry[];
	metaCounter: TotalCounter[];
}

// Smart response object
export interface SmartResponse {
	answer: string;
	confidence: number;
	suggestedFaqs?: Faq[];
	needsHumanSupport: boolean;
}

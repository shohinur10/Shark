import { Direction } from '../../enums/common.enum';
import { FaqCategory, FaqStatus } from '../../enums/faq.enum';

export interface FaqInput {
	faqCategory: FaqCategory;
	question: string;
	answer: string;
	keywords?: string[];
	relatedWorkouts?: string[];
	relatedMealPlans?: string[];
	faqStatus?: FaqStatus;
	displayOrder?: number;
	createdBy?: string;
}

interface FaqSearch {
	faqCategory?: FaqCategory;
	faqStatus?: FaqStatus;
	text?: string;
}

export interface FaqsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	faqCategory?: FaqCategory;
	faqStatus?: FaqStatus;
	text?: string;
	search?: FaqSearch;
}

// For user asking questions
export interface AskQuestionInput {
	question: string;
	category?: FaqCategory;
	context?: string;
	language?: string;
}

import { Direction } from '../../enums/common.enum';
import { FaqCategory } from '../../enums/faq.enum';

export interface FaqInput {
	faqCategory: FaqCategory;
	question: string;
	answer: string;
	keywords?: string[];
	relatedWorkouts?: string[];
	relatedMealPlans?: string[];
	createdBy?: string;
}

interface FISearch {
	faqCategory?: FaqCategory;
	text?: string;
}

export interface FaqsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: FISearch;
}

export interface AskQuestionInput {
	question: string;
	category?: FaqCategory;
}


import { FaqCategory, FaqStatus } from '../../enums/faq.enum';
import { TotalCounter } from "../common"';

export interface Faq {
	_id: string;
	faqCategory: FaqCategory;
	faqStatus: FaqStatus;
	question: string;
	answer: string;
	keywords: string[];
	relatedWorkouts: string[];
	relatedMealPlans: string[];
	viewCount: number;
	helpfulCount: number;
	notHelpfulCount: number;
	createdBy: string;
	displayOrder: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface Faqs {
	list: Faq[];
	metaCounter: TotalCounter[];
}

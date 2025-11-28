import { FaqCategory, FaqStatus } from '../../enums/faq.enum';

export interface FaqUpdate {
	_id: string;
	faqCategory?: FaqCategory;
	faqStatus?: FaqStatus;
	question?: string;
	answer?: string;
	keywords?: string[];
	relatedWorkouts?: string[];
	relatedMealPlans?: string[];
	displayOrder?: number;
}


import { Direction } from '../../enums/common.enum';

export interface SupplementInput {
	name: string;
	category: string;
	description?: string;
	recommendedDosage?: string;
	keyBenefits?: string[];
	bestFor?: string[];
	rating?: number;
	usageNotes?: string;
}

interface SupplementInquirySearch {
	category?: string;
	text?: string;
}

export interface SupplementsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	category?: string;
	search?: SupplementInquirySearch;
}

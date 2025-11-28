import { Direction } from '../../enums/common.enum';
import { ReviewGroup } from '../../enums/review.enum';

export interface ReviewInput {
	reviewGroup: ReviewGroup;
	reviewRefId: string;
	rating: number;
	reviewTitle: string;
	reviewContent: string;
	reviewImages?: string[];
	reviewerId?: string;
}

interface RISearch {
	reviewerId?: string;
	reviewGroup?: ReviewGroup;
	propertyId?: string;
	trainerId?: string;
	rating?: number;
}

export interface ReviewsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: RISearch;
}

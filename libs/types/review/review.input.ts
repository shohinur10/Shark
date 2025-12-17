import { Direction } from '../../enums/common.enum';
import { ReviewGroup, ReviewStatus } from '../../enums/review.enum';

export interface ReviewInput {
	reviewGroup: string;
	reviewRefId?: string;
	propertyId?: string;
	trainerId?: string;
	workoutId?: string;
	mealPlanId?: string;
	bookingId?: string;
	rating: number;
	reviewTitle: string;
	reviewContent: string;
	reviewImages?: string[];
	reviewerId?: string;
	reviewStatus?: string;
}

export interface RISearch {
	reviewerId?: string;
	reviewGroup?: string;
	propertyId?: string;
	trainerId?: string;
	rating?: number;
}

export interface ReviewsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	reviewerId?: string;
	reviewGroup?: string;
	propertyId?: string;
	trainerId?: string;
	workoutId?: string;
	mealPlanId?: string;
	bookingId?: string;
	status?: string;
	reviewStatus?: string;
	search?: RISearch;
}

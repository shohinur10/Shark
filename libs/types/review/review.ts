import { ReviewGroup, ReviewStatus } from '../../enums/review.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../property/property';

export interface ReviewResponse {
	responderId: string;
	responseText: string;
	respondedAt: Date;
}

export interface Review {
	_id: string;
	reviewGroup: ReviewGroup;
	reviewStatus: ReviewStatus;
	reviewerId: string;
	propertyId?: string;
	trainerId?: string;
	workoutId?: string;
	mealPlanId?: string;
	bookingId?: string;
	rating: number;
	reviewTitle: string;
	reviewContent: string;
	reviewImages: string[];
	helpfulCount: number;
	notHelpfulCount: number;
	response?: ReviewResponse;
	flaggedCount: number;
	flagReason?: string;
	moderatedBy?: string;
	moderatedAt?: Date;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation */
	memberData?: Member;
}

export interface Reviews {
	list: Review[];
	metaCounter: TotalCounter[];
}

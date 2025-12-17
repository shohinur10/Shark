import { ReviewStatus } from '../../enums/review.enum';

export interface ReviewUpdate {
	_id: string;
	rating?: number;
	reviewTitle?: string;
	reviewContent?: string;
	reviewImages?: string[];
	reviewStatus?: string;
	flagReason?: string;
	deletedAt?: Date;
}

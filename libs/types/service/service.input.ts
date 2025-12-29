import { BookingType, ServiceStatus } from '../../enums/booking.enum';
import { WorkoutDifficulty } from '../../enums/workout.enum';
import { Direction } from '../../enums/common.enum';

export interface ServiceInput {
	title: string;
	description?: string;
	bookingType: BookingType;
	difficulty?: WorkoutDifficulty; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
	pricePerHour?: number;
	fixedPrice?: number;
	durationOptions: number[]; // Array of minutes
	status?: ServiceStatus;
}

interface ServiceInquirySearch {
	bookingType?: BookingType;
	status?: ServiceStatus;
	difficulty?: WorkoutDifficulty;
	text?: string;
}

export interface ServicesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	bookingType?: BookingType;
	status?: ServiceStatus;
	search?: ServiceInquirySearch;
}
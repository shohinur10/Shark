import { BookingType, ServiceStatus } from '../../enums/booking.enum';
import { Direction } from '../../enums/common.enum';

export interface ServiceInput {
	title: string;
	description?: string;
	bookingType: BookingType;
	pricePerHour?: number;
	fixedPrice?: number;
	durationOptions: number[]; // Array of minutes
	status?: ServiceStatus;
}

interface ServiceInquirySearch {
	bookingType?: BookingType;
	status?: ServiceStatus;
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
import { BookingStatus, BookingType, SessionDuration } from '../../enums/booking.enum';
import { Direction } from '../../enums/common.enum';

export interface BookingInput {
	bookingType: BookingType;
	providerId: string;
	propertyId?: string;
	serviceId?: string; // Recommended for server-side validation
	bookingDate: Date | string; // ISO date string or Date object
	bookingTime: string; // HH:mm format (24-hour)
	sessionDuration: number; // Duration in minutes
	bookingPrice: number;
	bookingNotes?: string; // Optional, 5-500 characters if provided
	meetingLink?: string; // Optional, required for ONLINE_SESSION type
	clientId?: string; // Optional, will be derived from auth token if not provided
}

interface BISearch {
	clientId?: string;
	providerId?: string;
	bookingStatus?: BookingStatus;
	bookingType?: BookingType;
}

export interface BookingsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	clientId?: string;
	providerId?: string;
	bookingStatus?: BookingStatus;
	bookingType?: BookingType;
	search?: BISearch;
}

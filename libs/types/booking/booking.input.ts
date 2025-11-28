import { BookingStatus, BookingType, SessionDuration } from '../../enums/booking.enum';
import { Direction } from '../../enums/common.enum';

export interface BookingInput {
	bookingType: BookingType;
	providerId: string;
	propertyId?: string;
	bookingDate: Date;
	bookingTime: string;
	sessionDuration: SessionDuration;
	bookingPrice: number;
	bookingNotes?: string;
	clientId?: string;
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
	search: BISearch;
}


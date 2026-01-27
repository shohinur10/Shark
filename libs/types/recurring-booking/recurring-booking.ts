import { BookingType } from '../../enums/booking.enum';
import { Booking } from '../booking/booking';
import { Member } from '../member/member';
import { TotalCounter } from '../common';

export interface RecurringBooking {
	_id: string;
	bookingType: BookingType;
	clientId: string;
	providerId: string;
	propertyId?: string;
	serviceId?: string;
	recurrencePattern: string; // 'WEEKLY', 'BI_WEEKLY', 'MONTHLY'
	dayOfWeek: number; // 0-6 (Sunday-Saturday)
	startTime: string; // HH:mm format
	sessionDuration: number; // minutes
	bookingPrice: number;
	startDate: Date;
	endDate?: Date;
	occurrences?: number;
	status: string; // 'ACTIVE', 'PAUSED', 'CANCELLED', 'COMPLETED'
	bookingNotes?: string;
	meetingLink?: string;
	exceptionDates: Date[];
	generatedBookingIds: string[];
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation */
	clientData?: Member;
	providerData?: Member;
	generatedBookings?: Booking[];
}

export interface RecurringBookings {
	list: RecurringBooking[];
	metaCounter: TotalCounter[];
}

import { BookingType } from '../../enums/booking.enum';

export interface RecurringBookingInput {
	bookingType: BookingType;
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
	bookingNotes?: string;
	meetingLink?: string;
	exceptionDates?: Date[];
}

export interface RecurringBookingUpdate {
	recurringBookingId: string;
	status?: string; // 'ACTIVE', 'PAUSED', 'CANCELLED'
	endDate?: Date;
	exceptionDates?: Date[];
	bookingNotes?: string;
	meetingLink?: string;
}

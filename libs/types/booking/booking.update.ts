import { BookingStatus } from '../../enums/booking.enum';

export interface BookingUpdate {
	_id?: string;
	bookingId?: string;
	bookingStatus?: BookingStatus;
	bookingDate?: Date;
	bookingTime?: string;
	sessionDuration?: number;
	bookingPrice?: number;
	bookingNotes?: string;
	providerNotes?: string;
	meetingLink?: string;
	cancellationReason?: string;
	cancelledAt?: Date;
	completedAt?: Date;
	cancelledBy?: string;
}

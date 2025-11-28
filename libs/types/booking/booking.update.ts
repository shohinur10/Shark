import { BookingStatus } from '../../enums/booking.enum';

export interface BookingUpdate {
	_id: string;
	bookingStatus?: BookingStatus;
	bookingDate?: Date;
	bookingTime?: string;
	providerNotes?: string;
	meetingLink?: string;
	cancellationReason?: string;
	cancelledAt?: Date;
	completedAt?: Date;
	cancelledBy?: string;
}


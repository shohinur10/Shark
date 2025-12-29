import { BookingStatus, BookingType, SessionDuration } from '../../enums/booking.enum';
import { Member } from '../member/member';
import { TotalCounter } from "../common"';

export interface Booking {
	_id: string;
	bookingType: BookingType;
	bookingStatus: BookingStatus;
	clientId: string;
	providerId: string;
	propertyId?: string;
	serviceId?: string; // Service ID (MongoDB ObjectId)
	bookingDate: Date;
	bookingTime: string;
	sessionDuration: SessionDuration;
	bookingPrice: number;
	paymentId?: string;
	bookingNotes?: string;
	providerNotes?: string;
	meetingLink?: string;
	cancellationReason?: string;
	cancelledBy?: string;
	cancelledAt?: Date;
	completedAt?: Date;
	reviewId?: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation */
	memberData?: Member;
}

export interface Bookings {
	list: Booking[];
	metaCounter: TotalCounter[];
}

import { Booking } from '../booking/booking';
import { Member } from '../member/member';
import { TotalCounter } from '../common';

export interface Waitlist {
	_id: string;
	bookingId: string;
	clientId: string;
	priority: number;
	status: string; // 'WAITING', 'NOTIFIED', 'CONVERTED', 'CANCELLED'
	notifiedAt?: Date;
	convertedAt?: Date;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation */
	bookingData?: Booking;
	clientData?: Member;
}

export interface Waitlists {
	list: Waitlist[];
	metaCounter: TotalCounter[];
}

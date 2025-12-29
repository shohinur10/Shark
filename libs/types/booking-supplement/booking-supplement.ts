import { Booking } from '../booking/booking';
import { Member } from '../member/member';
import { Supplement } from '../supplement/supplement';
import { TotalCounter } from "../common"';

export interface BookingSupplement {
	_id: string;
	bookingId: string;
	supplementId: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	notes?: string;
	recommendedBy?: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation */
	bookingData?: Booking;
	supplementData?: Supplement;
	recommenderData?: Member;
}

export interface BookingSupplements {
	list: BookingSupplement[];
	metaCounter: TotalCounter[];
}

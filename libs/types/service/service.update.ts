import { BookingType, ServiceStatus } from '../../enums/booking.enum';

export interface ServiceUpdate {
	_id?: string;
	serviceId?: string;
	title?: string;
	description?: string;
	bookingType?: BookingType;
	pricePerHour?: number;
	fixedPrice?: number;
	durationOptions?: number[]; // Array of minutes
	status?: ServiceStatus;
}


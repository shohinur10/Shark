import { BookingType, ServiceStatus } from '../../enums/booking.enum';
import { TotalCounter } from '../property/property';

export interface Service {
	_id: string;
	title: string;
	description?: string;
	bookingType: BookingType;
	pricePerHour?: number;
	fixedPrice?: number;
	durationOptions: number[]; // Array of minutes
	status: ServiceStatus;
	createdAt: Date;
	updatedAt: Date;
}

export interface Services {
	list: Service[];
	metaCounter: TotalCounter[];
}

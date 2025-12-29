import { BookingType, ServiceStatus } from '../../enums/booking.enum';
import { WorkoutDifficulty } from '../../enums/workout.enum';
import { TotalCounter } from "../common"';

export interface Service {
	_id: string;
	title: string;
	description?: string;
	bookingType: BookingType;
	difficulty?: WorkoutDifficulty; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
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

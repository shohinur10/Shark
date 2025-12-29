import { Booking } from '../booking/booking';
import { Member } from '../member/member';

export interface TrainerAvailabilitySlot {
	_id: string;
	trainerId: string;
	dayOfWeek?: number; // 0-6 (Sunday-Saturday)
	specificDate?: Date;
	startTime: string; // HH:mm format
	endTime: string; // HH:mm format
	availabilityType: string; // 'WEEKLY' or 'SPECIFIC'
	isBlocked: boolean;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation */
	trainerData?: Member;
}

export interface TrainerSchedule {
	trainerId: string;
	startDate: Date;
	endDate: Date;
	availabilitySlots: TrainerAvailabilitySlot[];
	bookings?: Booking[]; // Existing bookings in the date range
}

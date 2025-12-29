export interface TrainerAvailabilitySlotInput {
	trainerId: string;
	dayOfWeek?: number; // 0-6 (Sunday-Saturday)
	specificDate?: Date;
	startTime: string; // HH:mm format
	endTime: string; // HH:mm format
	availabilityType: string; // 'WEEKLY' or 'SPECIFIC'
	isBlocked?: boolean;
	notes?: string;
}

export interface TrainerScheduleInput {
	trainerId: string;
	startDate: Date;
	endDate: Date;
}

export interface BookingStatsInput {
	trainerId?: string;
	startDate: string; // YYYY-MM-DD format
	endDate: string; // YYYY-MM-DD format
}

export interface BookingStats {
	totalBookings: number;
	totalRevenue: number;
	confirmedBookings: number;
	cancelledBookings: number;
	completedBookings: number;
	cancellationRate: number; // Percentage
	averageBookingValue: number;
	popularTimeSlots: string[]; // Array of time slots like "09:00", "10:00"
	noShowCount: number;
	noShowRate: number; // Percentage
}

export interface ServiceStats {
	serviceId: string;
	serviceTitle: string;
	bookingCount: number;
	totalRevenue: number;
	averageBookingValue: number;
}

export interface TrainerStats {
	trainerId: string;
	totalBookings: number;
	totalRevenue: number;
	averageRating?: number;
	completedBookings: number;
	cancelledBookings: number;
	clientRetentionRate: number; // Percentage
}

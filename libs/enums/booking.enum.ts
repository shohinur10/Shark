
export enum BookingStatus {
	PENDING = 'PENDING',           // Waiting for confirmation
	CONFIRMED = 'CONFIRMED',       // Confirmed by trainer/gym
	CANCELLED = 'CANCELLED',       // Cancelled
	COMPLETED = 'COMPLETED',       // Session completed
	NO_SHOW = 'NO_SHOW',          // Client didn't show up
	REFUNDED = 'REFUNDED',        // Refunded
}

// Booking type
export enum BookingType {
	PERSONAL_TRAINING = 'PERSONAL_TRAINING',  // 1-on-1 training
	GROUP_CLASS = 'GROUP_CLASS',              // Group fitness class
	GYM_ACCESS = 'GYM_ACCESS',               // Gym day pass
	FACILITY_RENTAL = 'FACILITY_RENTAL',     // Rent a studio/space
	ONLINE_SESSION = 'ONLINE_SESSION',       // Virtual training
	CONSULTATION = 'CONSULTATION',           // Fitness consultation
}


// Session duration
export enum SessionDuration {
	THIRTY_MIN = 'THIRTY_MIN',      // 30 minutes
	FORTY_FIVE_MIN = 'FORTY_FIVE_MIN', // 45 minutes
	SIXTY_MIN = 'SIXTY_MIN',        // 60 minutes
	NINETY_MIN = 'NINETY_MIN',      // 90 minutes
	FULL_DAY = 'FULL_DAY',          // Full day access
}



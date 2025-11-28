// FAQ categories for fitness
export enum FaqCategory {
	GENERAL = 'GENERAL',                     // General platform questions
	WORKOUT = 'WORKOUT',                     // Workout-related questions
	NUTRITION = 'NUTRITION',                 // Nutrition & diet questions
	SUBSCRIPTION = 'SUBSCRIPTION',           // Subscription & payment questions
	BOOKING = 'BOOKING',                     // Booking & scheduling questions
	EQUIPMENT = 'EQUIPMENT',                 // Equipment questions
	PROGRESS = 'PROGRESS',                   // Progress tracking questions
	TECHNICAL = 'TECHNICAL',                 // Technical issues
	SAFETY = 'SAFETY',                       // Safety & health questions
}


// FAQ status
export enum FaqStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	DELETED = 'DELETED',
}

// Auto-response confidence level
export enum ConfidenceLevel {
	HIGH = 'HIGH',           // 80%+ match - auto send
	MEDIUM = 'MEDIUM',       // 50-80% match - suggest answers
	LOW = 'LOW',             // <50% match - create inquiry
}


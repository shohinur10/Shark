// User inquiry/support request status
export enum InquiryStatus {
	PENDING = 'PENDING',           // Waiting for response
	AI_RESPONDED = 'AI_RESPONDED', // AI bot responded
	IN_PROGRESS = 'IN_PROGRESS',   // Trainer/admin handling
	RESOLVED = 'RESOLVED',         // Resolved
	CLOSED = 'CLOSED',             // Closed
}


// Inquiry category
export enum InquiryCategory {
	WORKOUT_HELP = 'WORKOUT_HELP',
	NUTRITION_HELP = 'NUTRITION_HELP',
	BOOKING_ISSUE = 'BOOKING_ISSUE',
	PAYMENT_ISSUE = 'PAYMENT_ISSUE',
	TECHNICAL_ISSUE = 'TECHNICAL_ISSUE',
	GENERAL_QUESTION = 'GENERAL_QUESTION',
	COMPLAINT = 'COMPLAINT',
	OTHER = 'OTHER',
}


// Priority
export enum InquiryPriority {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
	URGENT = 'URGENT',
}



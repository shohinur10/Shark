
// Payment status
export enum PaymentStatus {
	PENDING = 'PENDING',               // Payment pending
	PROCESSING = 'PROCESSING',         // Being processed
	COMPLETED = 'COMPLETED',           // Payment successful
	FAILED = 'FAILED',                 // Payment failed
	CANCELLED = 'CANCELLED',           // Payment cancelled
	REFUNDED = 'REFUNDED',            // Refunded
	PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED', // Partially refunded
}


// Payment method
export enum PaymentMethod {
	CREDIT_CARD = 'CREDIT_CARD',
	DEBIT_CARD = 'DEBIT_CARD',
	PAYPAL = 'PAYPAL',
	STRIPE = 'STRIPE',
	BANK_TRANSFER = 'BANK_TRANSFER',
	CASH = 'CASH',
	CRYPTOCURRENCY = 'CRYPTOCURRENCY',
	APPLE_PAY = 'APPLE_PAY',
	GOOGLE_PAY = 'GOOGLE_PAY',
	SAMSUNG_PAY = 'SAMSUNG_PAY',
}


// Transaction type
export enum TransactionType {
	SUBSCRIPTION = 'SUBSCRIPTION',     // Subscription payment
	BOOKING = 'BOOKING',              // Booking payment
	EQUIPMENT_PURCHASE = 'EQUIPMENT_PURCHASE', // Equipment purchase
	MEMBERSHIP = 'MEMBERSHIP',        // Gym membership
	TRAINING_SESSION = 'TRAINING_SESSION', // Personal training session
	MEAL_PLAN = 'MEAL_PLAN',         // Meal plan purchase
	REFUND = 'REFUND',               // Refund transaction
	TIP = 'TIP',                     // Tip for trainer
}


// Currency
export enum Currency {
	USD = 'USD',  // US Dollar
	EUR = 'EUR',  // Euro
	GBP = 'GBP',  // British Pound
	KRW = 'KRW',  // Korean Won
	JPY = 'JPY',  // Japanese Yen
	CNY = 'CNY',  // Chinese Yuan
	AUD = 'AUD',  // Australian Dollar
	CAD = 'CAD',  // Canadian Dollar
}



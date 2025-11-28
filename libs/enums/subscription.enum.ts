// Subscription plan types
export enum SubscriptionPlan {
	FREE = 'FREE',                     // Free tier
	BASIC = 'BASIC',                   // Basic membership
	PREMIUM = 'PREMIUM',               // Premium membership
	PRO = 'PRO',                       // Professional membership
	ENTERPRISE = 'ENTERPRISE',         // For gym owners/trainers
}

// Subscription status
export enum SubscriptionStatus {
	ACTIVE = 'ACTIVE',                 // Active subscription
	CANCELLED = 'CANCELLED',           // Cancelled
	EXPIRED = 'EXPIRED',               // Expired
	PAUSED = 'PAUSED',                 // Temporarily paused
	TRIAL = 'TRIAL',                   // Trial period
	PENDING_PAYMENT = 'PENDING_PAYMENT', // Waiting for payment
}


// Subscription period
export enum SubscriptionPeriod {
	DAILY = 'DAILY',                   // Daily pass - No discount
	WEEKLY = 'WEEKLY',                 // Weekly - No discount
	MONTHLY = 'MONTHLY',               // Monthly - No discount
	QUARTERLY = 'QUARTERLY',           // Quarterly (3 months) - No discount
	SEMI_ANNUAL = 'SEMI_ANNUAL',      // Semi-annual (6 months) - 15% discount
	ANNUAL = 'ANNUAL',                 // Annual (12 months) - 30% discount
	LIFETIME = 'LIFETIME',             // Lifetime access - Special pricing
}


// Subscription discount tiers
export enum SubscriptionDiscount {
	NONE = 'NONE',                     // 0% - Daily, Weekly, Monthly, Quarterly
	SEMI_ANNUAL = 'SEMI_ANNUAL',      // 15% - 6 months subscription
	ANNUAL = 'ANNUAL',                 // 30% - 12 months subscription
	LIFETIME = 'LIFETIME',             // Custom pricing - Lifetime access
}


// Discount percentage values (for reference in business logic)
export const DISCOUNT_PERCENTAGES = {
	NONE: 0,
	SEMI_ANNUAL: 15,      // 15% off for 6+ months
	ANNUAL: 30,           // 30% off for 1+ year
	LIFETIME: 0,          // Custom pricing
} as const;


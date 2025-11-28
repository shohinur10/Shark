// Review status
export enum ReviewStatus {
	PENDING = 'PENDING',               // Awaiting moderation
	APPROVED = 'APPROVED',             // Approved and visible
	REJECTED = 'REJECTED',             // Rejected by moderator
	FLAGGED = 'FLAGGED',              // Flagged for review
	DELETED = 'DELETED',              // Deleted
}


// What can be reviewed
export enum ReviewGroup {
	GYM = 'GYM',                      // Gym facility review
	TRAINER = 'TRAINER',              // Personal trainer review
	EQUIPMENT = 'EQUIPMENT',          // Equipment review
	CLASS = 'CLASS',                  // Fitness class review
	WORKOUT_PLAN = 'WORKOUT_PLAN',   // Workout plan review
	MEAL_PLAN = 'MEAL_PLAN',         // Meal plan review
}


// Rating scale (1-5 stars)
export enum RatingValue {
	ONE = 1,
	TWO = 2,
	THREE = 3,
	FOUR = 4,
	FIVE = 5,
}



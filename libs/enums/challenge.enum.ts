// Challenge types
export enum ChallengeType {
	WORKOUT_STREAK = 'WORKOUT_STREAK',        // Consecutive workout days
	EXERCISE_COUNT = 'EXERCISE_COUNT',        // Complete X exercises
	DISTANCE = 'DISTANCE',                     // Run/walk X distance
	CALORIE_BURN = 'CALORIE_BURN',            // Burn X calories
	WEIGHT_LOSS = 'WEIGHT_LOSS',              // Lose X weight
	MUSCLE_GAIN = 'MUSCLE_GAIN',              // Gain X muscle
	TIME_BASED = 'TIME_BASED',                // Exercise for X time
	CUSTOM = 'CUSTOM',                         // Custom challenge
	COMMUNITY = 'COMMUNITY',                   // Community challenge
}


// Challenge status
export enum ChallengeStatus {
	UPCOMING = 'UPCOMING',             // Not started yet
	ACTIVE = 'ACTIVE',                 // Currently active
	COMPLETED = 'COMPLETED',           // Completed
	FAILED = 'FAILED',                 // Failed to complete
	CANCELLED = 'CANCELLED',           // Cancelled
}


// Challenge difficulty
export enum ChallengeDifficulty {
	EASY = 'EASY',
	MEDIUM = 'MEDIUM',
	HARD = 'HARD',
	EXTREME = 'EXTREME',
}


// Achievement/Badge types
export enum AchievementType {
	FIRST_WORKOUT = 'FIRST_WORKOUT',           // First workout completed
	WEEK_STREAK = 'WEEK_STREAK',              // 7-day streak
	MONTH_STREAK = 'MONTH_STREAK',            // 30-day streak
	HUNDRED_WORKOUTS = 'HUNDRED_WORKOUTS',    // 100 workouts
	WEIGHT_MILESTONE = 'WEIGHT_MILESTONE',    // Weight loss milestone
	STRENGTH_MILESTONE = 'STRENGTH_MILESTONE', // Strength milestone
	SOCIAL_BUTTERFLY = 'SOCIAL_BUTTERFLY',    // Follow 50 people
	INFLUENCER = 'INFLUENCER',                // 100 followers
	EARLY_BIRD = 'EARLY_BIRD',                // Morning workouts
	NIGHT_OWL = 'NIGHT_OWL',                  // Evening workouts
	CHALLENGE_MASTER = 'CHALLENGE_MASTER',    // Complete 10 challenges
	CUSTOM = 'CUSTOM',                         // Custom achievement
}


// Achievement status
export enum AchievementStatus {
	LOCKED = 'LOCKED',                 // Not yet unlocked
	UNLOCKED = 'UNLOCKED',             // Unlocked
	IN_PROGRESS = 'IN_PROGRESS',       // Working towards it
}



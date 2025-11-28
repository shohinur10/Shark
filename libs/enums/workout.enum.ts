// Workout difficulty levels
export enum WorkoutDifficulty {
	BEGINNER = 'BEGINNER',
	INTERMEDIATE = 'INTERMEDIATE',
	ADVANCED = 'ADVANCED',
	EXPERT = 'EXPERT',
}


// Workout categories/types
export enum WorkoutCategory {
	STRENGTH = 'STRENGTH',           // Weight training
	CARDIO = 'CARDIO',              // Cardiovascular exercises
	FLEXIBILITY = 'FLEXIBILITY',     // Stretching, yoga
	HIIT = 'HIIT',                  // High-intensity interval training
	CROSSFIT = 'CROSSFIT',          // CrossFit workouts
	PILATES = 'PILATES',            // Pilates
	YOGA = 'YOGA',                  // Yoga
	CALISTHENICS = 'CALISTHENICS',  // Bodyweight exercises
	SPORTS = 'SPORTS',              // Sport-specific training
	MARTIAL_ARTS = 'MARTIAL_ARTS',  // Boxing, MMA, etc.
	DANCE = 'DANCE',                // Dance fitness
	SWIMMING = 'SWIMMING',          // Swimming workouts
	REHABILITATION = 'REHABILITATION', // Rehab exercises
}


// Workout status
export enum WorkoutStatus {
	DRAFT = 'DRAFT',               // Draft workout
	PUBLISHED = 'PUBLISHED',       // Published workout
	ARCHIVED = 'ARCHIVED',         // Archived workout
	DELETED = 'DELETED',           // Deleted workout
}


// Workout duration
export enum WorkoutDuration {
	SHORT = 'SHORT',               // 0-15 minutes
	MEDIUM = 'MEDIUM',             // 15-30 minutes
	LONG = 'LONG',                 // 30-60 minutes
	EXTENDED = 'EXTENDED',         // 60+ minutes
}


// Equipment needed
export enum WorkoutEquipment {
	NONE = 'NONE',                 // No equipment needed
	BODYWEIGHT = 'BODYWEIGHT',     // Bodyweight only
	DUMBBELLS = 'DUMBBELLS',       // Dumbbells
	BARBELL = 'BARBELL',           // Barbell
	KETTLEBELL = 'KETTLEBELL',     // Kettlebell
	RESISTANCE_BAND = 'RESISTANCE_BAND', // Resistance bands
	PULL_UP_BAR = 'PULL_UP_BAR',   // Pull-up bar
	FULL_GYM = 'FULL_GYM',         // Full gym equipment
	CARDIO_MACHINE = 'CARDIO_MACHINE', // Treadmill, bike, etc.
	YOGA_MAT = 'YOGA_MAT',         // Yoga mat
	FOAM_ROLLER = 'FOAM_ROLLER',   // Foam roller
}


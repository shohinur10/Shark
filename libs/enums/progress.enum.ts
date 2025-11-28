
// Progress tracking types
export enum ProgressType {
	WEIGHT = 'WEIGHT',                 // Body weight
	BODY_FAT = 'BODY_FAT',            // Body fat percentage
	MUSCLE_MASS = 'MUSCLE_MASS',      // Muscle mass
	BMI = 'BMI',                       // Body Mass Index
	MEASUREMENTS = 'MEASUREMENTS',     // Body measurements (chest, waist, etc.)
	PHOTOS = 'PHOTOS',                 // Progress photos
	WORKOUT_LOG = 'WORKOUT_LOG',      // Workout completion
	STRENGTH_PR = 'STRENGTH_PR',      // Personal record for strength
	ENDURANCE = 'ENDURANCE',          // Endurance metrics
	CALORIES = 'CALORIES',            // Calorie tracking
	STEPS = 'STEPS',                  // Daily steps
	SLEEP = 'SLEEP',                  // Sleep tracking
}


// Measurement units
export enum MeasurementUnit {
	KG = 'KG',                        // Kilograms
	LBS = 'LBS',                      // Pounds
	CM = 'CM',                        // Centimeters
	INCHES = 'INCHES',                // Inches
	PERCENTAGE = 'PERCENTAGE',        // Percentage
	REPS = 'REPS',                    // Repetitions
	SECONDS = 'SECONDS',              // Seconds
	MINUTES = 'MINUTES',              // Minutes
	CALORIES = 'CALORIES',            // Calories
	STEPS = 'STEPS',                  // Steps count
}


// Goal types
export enum GoalType {
	LOSE_WEIGHT = 'LOSE_WEIGHT',
	GAIN_MUSCLE = 'GAIN_MUSCLE',
	GET_FIT = 'GET_FIT',
	IMPROVE_STRENGTH = 'IMPROVE_STRENGTH',
	IMPROVE_ENDURANCE = 'IMPROVE_ENDURANCE',
	FLEXIBILITY = 'FLEXIBILITY',
	MAINTAIN_WEIGHT = 'MAINTAIN_WEIGHT',
	SPORT_SPECIFIC = 'SPORT_SPECIFIC',
	REHABILITATION = 'REHABILITATION',
}


// Goal status
export enum GoalStatus {
	ACTIVE = 'ACTIVE',
	ACHIEVED = 'ACHIEVED',
	ABANDONED = 'ABANDONED',
	ON_HOLD = 'ON_HOLD',
}


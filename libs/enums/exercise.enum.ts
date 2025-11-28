// Target muscle groups
export enum MuscleGroup {
	CHEST = 'CHEST',
	BACK = 'BACK',
	SHOULDERS = 'SHOULDERS',
	BICEPS = 'BICEPS',
	TRICEPS = 'TRICEPS',
	FOREARMS = 'FOREARMS',
	ABS = 'ABS',
	OBLIQUES = 'OBLIQUES',
	QUADRICEPS = 'QUADRICEPS',
	HAMSTRINGS = 'HAMSTRINGS',
	GLUTES = 'GLUTES',
	CALVES = 'CALVES',
	FULL_BODY = 'FULL_BODY',
	CARDIO = 'CARDIO',
}


// Exercise types
export enum ExerciseType {
	STRENGTH = 'STRENGTH',
	CARDIO = 'CARDIO',
	FLEXIBILITY = 'FLEXIBILITY',
	BALANCE = 'BALANCE',
	PLYOMETRIC = 'PLYOMETRIC',      // Explosive movements
	ISOMETRIC = 'ISOMETRIC',        // Static holds
	COMPOUND = 'COMPOUND',          // Multi-joint exercises
	ISOLATION = 'ISOLATION',        // Single-joint exercises
}


// Exercise status
export enum ExerciseStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	PENDING_REVIEW = 'PENDING_REVIEW',
	DELETED = 'DELETED',
}


// Fitness Listing Types: Gyms, Studios, Equipment, Personal Trainers
export enum PropertyType {
	YOGA = 'YOGA',                         // Yoga room
	RUNNING = 'RUNNING',                    // Running/treadmill room
	DEADLIFT = 'DEADLIFT',                  // Deadlift area
	SQUAT = 'SQUAT',                        // Squat rack area
	BENCH_PRESS = 'BENCH_PRESS',            // Bench press area
	CARDIO = 'CARDIO',                      // Cardio room
	PILATES = 'PILATES',                    // Pilates room
	DANCE = 'DANCE',                        // Dance studio
	BOXING = 'BOXING',                      // Boxing ring/area
	SWIMMING = 'SWIMMING',                  // Swimming pool
	MARTIAL_ARTS = 'MARTIAL_ARTS',          // Martial arts room
	SPINNING = 'SPINNING',                  // Spinning/cycling room
	CROSSFIT = 'CROSSFIT',                  // CrossFit area
	STRETCHING = 'STRETCHING',              // Stretching area
	PERSONAL_TRAINING = 'PERSONAL_TRAINING', // Personal training room
}


export enum PropertyStatus {
	AVAILABLE = 'AVAILABLE',   // Available/Open for use
	CLOSE = 'CLOSE',           // Closed/Unavailable
	DELETE = 'DELETE',         // Deleted (admin only)
}


// Korean Cities + Major Global Fitness Hubs
export enum PropertyLocation {
	INCHEON = 'INCHEON',
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	DAEGU = 'DAEGU',
	DAEJON = 'DAEJON',
	GWANGJU = 'GWANGJU',
	ULSAN = 'ULSAN',
	SUWON = 'SUWON',
	CHANGWON = 'CHANGWON',
	GYEONGJU = 'GYEONGJU',
	JEJU = 'JEJU',
	ANSAN = 'ANSAN',
}

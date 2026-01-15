import { Direction } from '../../enums/common.enum';
import { WorkoutCategory, WorkoutDifficulty, WorkoutDuration, WorkoutEquipment, WorkoutStatus } from '../../enums/workout.enum';

export interface WorkoutInput {
	workoutTitle: string;
	workoutCategory: WorkoutCategory;
	workoutDifficulty: WorkoutDifficulty;
	workoutDuration: string;
	workoutEquipment?: string[];
	workoutStatus?: string;
	workoutDesc: string;
	workoutImage?: string | string[];
	workoutVideo?: string;
	workoutExercises?: string[];
	workoutCaloriesBurn?: number;
	workoutTags?: string[];
	isPremium?: boolean;
	createdBy?: string;
}

export interface WISearch {
	createdBy?: string;
	categoryList?: WorkoutCategory[];
	difficultyList?: WorkoutDifficulty[];
	durationList?: WorkoutDuration[];
	equipmentList?: WorkoutEquipment[];
	text?: string;
	workoutStatus?: string;
	isPremium?: boolean;
}

export interface WorkoutsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	workoutStatus?: string;
	isPremium?: boolean;
	search?: WISearch;
}

export interface TrainerWorkoutsSearch {
	workoutStatus?: string;
}

export interface TrainerWorkoutsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	trainerId?: string;
	workoutStatus?: string;
	search?: TrainerWorkoutsSearch;
}

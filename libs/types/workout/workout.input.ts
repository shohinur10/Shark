import { Direction } from '../../enums/common.enum';
import { WorkoutCategory, WorkoutDifficulty, WorkoutDuration, WorkoutEquipment, WorkoutStatus } from '../../enums/workout.enum';

export interface WorkoutInput {
	workoutTitle: string;
	workoutCategory: WorkoutCategory;
	workoutDifficulty: WorkoutDifficulty;
	workoutDuration: WorkoutDuration;
	workoutEquipment?: WorkoutEquipment[];
	workoutDesc: string;
	workoutImage?: string;
	workoutVideo?: string;
	workoutExercises?: string[];
	workoutCaloriesBurn?: number;
	workoutTags?: string[];
	isPremium?: boolean;
	createdBy?: string;
}

interface WISearch {
	createdBy?: string;
	categoryList?: WorkoutCategory[];
	difficultyList?: WorkoutDifficulty[];
	durationList?: WorkoutDuration[];
	equipmentList?: WorkoutEquipment[];
	text?: string;
}

export interface WorkoutsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: WISearch;
}

interface TWISearch {
	workoutStatus?: WorkoutStatus;
}

export interface TrainerWorkoutsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: TWISearch;
}


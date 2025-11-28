import { WorkoutCategory, WorkoutDifficulty, WorkoutDuration, WorkoutEquipment, WorkoutStatus } from '../../enums/workout.enum';

export interface WorkoutUpdate {
	_id: string;
	workoutTitle?: string;
	workoutCategory?: WorkoutCategory;
	workoutDifficulty?: WorkoutDifficulty;
	workoutDuration?: WorkoutDuration;
	workoutEquipment?: WorkoutEquipment[];
	workoutStatus?: WorkoutStatus;
	workoutDesc?: string;
	workoutImage?: string;
	workoutVideo?: string;
	workoutExercises?: string[];
	workoutCaloriesBurn?: number;
	workoutTags?: string[];
	isPremium?: boolean;
	deletedAt?: Date;
}


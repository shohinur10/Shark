import { WorkoutCategory, WorkoutDifficulty, WorkoutStatus } from '../../enums/workout.enum';

export interface WorkoutUpdate {
	_id: string;
	workoutTitle?: string;
	workoutCategory?: WorkoutCategory;
	workoutDifficulty?: WorkoutDifficulty;
	workoutDuration?: string;
	workoutEquipment?: string[];
	workoutStatus?: string;
	workoutDesc?: string;
	workoutImage?: string;
	workoutVideo?: string;
	workoutExercises?: string[];
	workoutCaloriesBurn?: number;
	workoutTags?: string[];
	isPremium?: boolean;
	deletedAt?: Date;
}

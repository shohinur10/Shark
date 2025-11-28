import { WorkoutCategory, WorkoutDifficulty, WorkoutDuration, WorkoutEquipment, WorkoutStatus } from '../../enums/workout.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../property/property';

export interface Workout {
	_id: string;
    workoutTitle: string;
    workoutCategory: WorkoutCategory;
    workoutDifficulty: WorkoutDifficulty;
    workoutDuration: WorkoutDuration;
    workoutEquipment: WorkoutEquipment[];
    workoutStatus: WorkoutStatus;
    workoutDesc: string;
    workoutImage?: string;
    workoutVideo?: string;
	workoutExercises: string[];
    workoutCaloriesBurn: number;
    workoutViews: number;
    workoutLikes: number;
    workoutComments: number;
    workoutRating: number;
    workoutCompletions: number;
    workoutRank: number;
	createdBy: string;
    workoutTags: string[];
    isPremium: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
	/** from aggregation **/
    memberData?: Member;
}

export interface Workouts {
	list: Workout[];
	metaCounter: TotalCounter[];
}


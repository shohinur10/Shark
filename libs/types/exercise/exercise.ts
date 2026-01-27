import { ExerciseStatus, ExerciseType, MuscleGroup } from '../../enums/exercise.enum';
import { WorkoutEquipment } from '../../enums/workout.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../common';

export interface Exercise {
	_id: string;
	exerciseName: string;
	exerciseType: ExerciseType;
	exerciseStatus: ExerciseStatus;
	targetMuscles: MuscleGroup[];
	secondaryMuscles: MuscleGroup[];
	exerciseDesc: string;
	exerciseInstructions: string[];
	exerciseEquipment: WorkoutEquipment[];
	exerciseImage?: string;
	exerciseVideo?: string;
	exerciseGif?: string;
	exerciseDifficulty: number;
	exerciseViews: number;
	exerciseLikes: number;
	exerciseRating: number;
	exerciseTips: string[];
	exerciseWarnings: string[];
	commonMistakes: string[];
	createdBy?: string;
	exerciseTags: string[];
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation */
	memberData?: Member;
}

export interface Exercises {
	list: Exercise[];
	metaCounter: TotalCounter[];
}

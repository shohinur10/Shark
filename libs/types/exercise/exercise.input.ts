import { Direction } from '../../enums/common.enum';
import { ExerciseType, MuscleGroup } from '../../enums/exercise.enum';
import { WorkoutEquipment } from '../../enums/workout.enum';

export interface ExerciseInput {
	exerciseName: string;
	exerciseType: ExerciseType;
	targetMuscles: MuscleGroup[];
	secondaryMuscles?: MuscleGroup[];
	exerciseDesc: string;
	exerciseInstructions: string[];
	exerciseEquipment?: WorkoutEquipment[];
	exerciseImage?: string;
	exerciseVideo?: string;
	exerciseDifficulty?: number;
	exerciseTips?: string[];
	exerciseWarnings?: string[];
	exerciseTags?: string[];
}

interface EISearch {
	targetMuscles?: MuscleGroup[];
	exerciseType?: ExerciseType;
	equipmentList?: WorkoutEquipment[];
	text?: string;
}

export interface ExercisesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: EISearch;
}


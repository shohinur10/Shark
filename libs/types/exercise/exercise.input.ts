import { Direction } from '../../enums/common.enum';
import { ExerciseStatus, ExerciseType, MuscleGroup } from '../../enums/exercise.enum';
import { WorkoutEquipment } from '../../enums/workout.enum';

export interface ExerciseInput {
	exerciseName: string;
	exerciseType: ExerciseType;
	exerciseStatus?: ExerciseStatus;
	targetMuscles: MuscleGroup[];
	secondaryMuscles?: MuscleGroup[];
	exerciseDesc: string;
	exerciseInstructions: string[];
	exerciseEquipment?: WorkoutEquipment[];
	exerciseImage?: string;
	exerciseVideo?: string;
	exerciseGif?: string;
	exerciseDifficulty?: string;
	exerciseTips?: string[];
	exerciseWarnings?: string[];
	commonMistakes?: string[];
	exerciseTags?: string[];
}

interface EISearch {
	targetMuscles?: MuscleGroup[];
	exerciseType?: string[];
	equipmentList?: WorkoutEquipment[];
	text?: string;
	exerciseDifficulty?: string;
}

export interface ExercisesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	targetMuscles?: MuscleGroup[];
	exerciseType?: string[];
	equipmentList?: WorkoutEquipment[];
	text?: string;
	exerciseDifficulty?: string;
	search?: string | EISearch;
}

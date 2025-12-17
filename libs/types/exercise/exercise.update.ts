import { ExerciseStatus, ExerciseType, MuscleGroup } from '../../enums/exercise.enum';
import { WorkoutEquipment } from '../../enums/workout.enum';

export interface ExerciseUpdate {
	_id?: string;
	exerciseId?: string;
	exerciseName?: string;
	exerciseType?: ExerciseType;
	exerciseStatus?: ExerciseStatus;
	targetMuscles?: MuscleGroup[];
	secondaryMuscles?: MuscleGroup[];
	exerciseDesc?: string;
	exerciseInstructions?: string[];
	exerciseEquipment?: WorkoutEquipment[];
	exerciseImage?: string;
	exerciseVideo?: string;
	exerciseGif?: string;
	exerciseDifficulty?: string;
	exerciseTips?: string[];
	exerciseWarnings?: string[];
	commonMistakes?: string[];
	exerciseTags?: string[];
	deletedAt?: Date;
}

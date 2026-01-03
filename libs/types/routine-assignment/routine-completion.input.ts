import { Direction } from '../../enums/common.enum';
import { RoutineType } from './routine-assignment';

export interface MarkRoutineCompleteInput {
	routineId: string;
	routineType: RoutineType; // MEAL_PLAN or WORKOUT
	completionPercentage?: number; // 0-100
	notes?: string;
	rating?: number; // 1-5
}

export interface RoutineCompletionsInput {
	page?: number; // default: 1
	limit?: number; // default: 10
	routineType?: RoutineType; // MEAL_PLAN or WORKOUT
}

// Keep old interface for backward compatibility
export interface RoutineCompletionsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	userId?: string;
	trainerId?: string;
	routineType?: RoutineType;
	search?: {
		userId?: string;
		trainerId?: string;
		routineType?: RoutineType;
	};
}


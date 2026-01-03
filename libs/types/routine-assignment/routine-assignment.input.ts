import { Direction } from '../../enums/common.enum';
import { AssignmentStatus, RoutineType } from './routine-assignment';

export interface AssignRoutineInput {
	userId: string;
	routineId: string; // Meal plan ID or Workout ID
	startDate?: Date | string;
	endDate?: Date | string;
	trainerNotes?: string;
	priority?: number; // 1-5
}

// Keep old interfaces for backward compatibility
export interface AssignMealPlanInput {
	userId: string;
	mealPlanId: string;
	startDate: Date | string;
	endDate?: Date | string;
	priority?: number; // 1-5
	trainerNotes?: string;
}

export interface AssignWorkoutInput {
	userId: string;
	workoutId: string;
	startDate: Date | string;
	endDate?: Date | string;
	priority?: number; // 1-5
	trainerNotes?: string;
}

export interface MarkRoutineCompleteInput {
	assignmentId: string;
	completionDate?: Date | string;
	rating?: number; // 1-5
	notes?: string;
}

export interface UserRoutineInquiry {
	userId?: string; // If not provided, uses authenticated user
	routineType?: RoutineType; // MEAL_PLAN or WORKOUT
	status?: AssignmentStatus; // ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
	page?: number; // default: 1
	limit?: number; // default: 10
}

export interface RoutineAssignmentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	userId?: string;
	trainerId?: string;
	routineType?: RoutineType;
	status?: AssignmentStatus;
	search?: {
		userId?: string;
		trainerId?: string;
		routineType?: RoutineType;
		status?: AssignmentStatus;
	};
}


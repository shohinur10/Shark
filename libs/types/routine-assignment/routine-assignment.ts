import { Member } from '../member/member';
import { MealPlan } from '../mealplan/mealplan';
import { Workout } from '../workout/workout';
import { TotalCounter } from '../common';

export enum RoutineType {
	MEAL_PLAN = 'MEAL_PLAN',
	WORKOUT = 'WORKOUT',
}

export enum AssignmentStatus {
	ASSIGNED = 'ASSIGNED',
	IN_PROGRESS = 'IN_PROGRESS',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}

export interface RoutineAssignment {
	_id: string;
	userId: string;
	trainerId: string;
	routineType: RoutineType;
	mealPlanId?: string;
	workoutId?: string;
	startDate: Date;
	endDate?: Date;
	priority: number; // 1-5
	trainerNotes?: string;
	status: AssignmentStatus;
	progressPercentage: number;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation */
	userData?: Member;
	trainerData?: Member;
	mealPlanData?: MealPlan;
	workoutData?: Workout;
}

export interface RoutineAssignments {
	list: RoutineAssignment[];
	metaCounter: TotalCounter[];
}


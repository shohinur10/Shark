import { Member } from '../member/member';
import { MealPlan } from '../mealplan/mealplan';
import { Workout } from '../workout/workout';
import { TotalCounter } from '../common';
import { RoutineType } from './routine-assignment';

export interface RoutineCompletion {
	_id: string;
	assignmentId: string;
	userId: string;
	trainerId: string;
	routineType: RoutineType;
	mealPlanId?: string;
	workoutId?: string;
	completionDate: Date;
	rating?: number; // 1-5
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation */
	userData?: Member;
	trainerData?: Member;
	mealPlanData?: MealPlan;
	workoutData?: Workout;
}

export interface RoutineCompletions {
	list: RoutineCompletion[];
	metaCounter: TotalCounter[];
}


import { Member } from '../member/member';
import { TotalCounter } from '../common';

export enum BonusType {
	DUAL_ROUTINE = 'DUAL_ROUTINE', // Completed both meal plan and workout on same day
	STREAK = 'STREAK', // Completed routines for X days in a row
	MILESTONE = 'MILESTONE', // Completed X total routines
}

export interface BonusReward {
	_id: string;
	userId: string;
	trainerId: string;
	earnedDate: Date;
	bonusType: BonusType;
	pointsAwarded: number;
	description?: string;
	mealPlanCompletionId?: string;
	workoutCompletionId?: string;
	claimed: boolean;
	claimedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation */
	userData?: Member;
	trainerData?: Member;
}

export interface BonusRewards {
	list: BonusReward[];
	metaCounter: TotalCounter[];
}


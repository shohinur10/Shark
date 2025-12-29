import { GoalStatus, GoalType, MeasurementUnit } from '../../enums/progress.enum';
import { TotalCounter } from "../common"';

export interface Milestone {
	value: number;
	achieved: boolean;
	achievedAt?: Date;
}

export interface Goal {
	_id: string;
	memberId: string;
	goalType: GoalType;
	goalStatus: GoalStatus;
	goalTitle: string;
	goalDesc?: string;
	targetValue: number;
	currentValue: number;
	unit: MeasurementUnit;
	startDate: Date;
	targetDate: Date;
	achievedAt?: Date;
	progressPercentage: number;
	milestones: Milestone[];
	createdAt: Date;
	updatedAt: Date;
}

export interface Goals {
	list: Goal[];
	metaCounter: TotalCounter[];
}

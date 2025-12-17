import { Direction } from '../../enums/common.enum';
import { GoalStatus, GoalType, MeasurementUnit } from '../../enums/progress.enum';

export interface MilestoneInput {
	value: number;
	achieved?: boolean;
	achievedAt?: Date;
}

export interface GoalInput {
	goalType: GoalType;
	goalTitle: string;
	goalDesc?: string;
	targetValue: number;
	unit: string;
	startDate?: Date;
	targetDate: Date;
	currentValue?: number;
	goalStatus?: GoalStatus;
	milestones?: MilestoneInput[];
	memberId?: string;
}

interface GISearch {
	goalStatus?: GoalStatus;
	goalType?: GoalType;
}

export interface GoalsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	memberId?: string;
	goalStatus?: GoalStatus;
	goalType?: GoalType;
	search?: GISearch;
}

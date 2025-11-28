import { Direction } from '../../enums/common.enum';
import { GoalStatus, GoalType, MeasurementUnit } from '../../enums/progress.enum';

export interface MilestoneInput {
    value: number;
}

export interface GoalInput {
	goalType: GoalType;
	goalTitle: string;
	goalDesc?: string;
	targetValue: number;
	unit: MeasurementUnit;
	targetDate: Date;
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
	search: GISearch;
}


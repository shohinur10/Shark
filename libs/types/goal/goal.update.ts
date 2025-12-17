import { GoalStatus, GoalType, MeasurementUnit } from '../../enums/progress.enum';

export interface GoalUpdate {
	_id?: string;
	goalId?: string;
	goalTitle?: string;
	goalDesc?: string;
	goalType?: GoalType;
	targetValue?: number;
	currentValue?: number;
	unit?: string;
	startDate?: Date;
	targetDate?: Date;
	goalStatus?: GoalStatus;
	achievedAt?: Date;
	progressPercentage?: number;
}

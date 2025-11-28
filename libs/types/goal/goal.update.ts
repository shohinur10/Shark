import { GoalStatus } from '../../enums/progress.enum';

export interface GoalUpdate {
	_id: string;
	currentValue?: number;
	goalStatus?: GoalStatus;
	achievedAt?: Date;
	progressPercentage?: number;
}


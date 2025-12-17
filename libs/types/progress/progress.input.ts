import { Direction } from '../../enums/common.enum';
import { MeasurementUnit, ProgressType } from '../../enums/progress.enum';

export interface BodyMeasurementsInput {
	chest?: number;
	waist?: number;
	hips?: number;
	biceps?: number;
	thighs?: number;
	calves?: number;
}

export interface ProgressInput {
	progressType: ProgressType;
	value: number;
	unit: string;
	photoUrl?: string;
	workoutId?: string;
	exerciseId?: string;
	notes?: string;
	measurementDate?: Date;
	bodyMeasurements?: BodyMeasurementsInput;
	memberId?: string;
}

export interface ProgressSearch {
	progressType?: ProgressType;
}

export interface ProgressesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	memberId?: string;
	progressType?: ProgressType;
	search?: ProgressSearch;
}

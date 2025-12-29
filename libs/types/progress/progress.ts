import { MeasurementUnit, ProgressType } from '../../enums/progress.enum';
import { TotalCounter } from "../common"';

export interface BodyMeasurements {
	chest?: number;
	waist?: number;
	hips?: number;
	biceps?: number;
	thighs?: number;
	calves?: number;
}

export interface Progress {
	_id: string;
	memberId: string;
	progressType: ProgressType;
	value: number;
	unit: MeasurementUnit;
	photoUrl?: string;
	workoutId?: string;
	exerciseId?: string;
	notes?: string;
	measurementDate: Date;
	bodyMeasurements?: BodyMeasurements;
	createdAt: Date;
	updatedAt: Date;
}

export interface Progresses {
	list: Progress[];
	metaCounter: TotalCounter[];
}

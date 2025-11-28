import { MeasurementUnit, ProgressType } from '../../enums/progress.enum';
import { BodyMeasurementsInput } from './progress.input';

export interface ProgressUpdate {
	_id: string;
	progressType?: ProgressType;
	value?: number;
	unit?: MeasurementUnit;
	photoUrl?: string;
	workoutId?: string;
	exerciseId?: string;
	notes?: string;
	measurementDate?: Date;
	bodyMeasurements?: BodyMeasurementsInput;
}


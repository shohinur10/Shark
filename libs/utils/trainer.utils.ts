import { TrainersInquiry } from '../../libs/types/member/member.input';
import { TrainerWorkoutsInquiry } from '../../libs/types/workout/workout.input';
import { Direction } from '../../libs/enums/common.enum';

/**
 * Builds a clean inquiry input object by merging pagination, filters, and search,
 * and removing undefined keys before sending to GraphQL query variables.
 */
export function buildTrainersInquiryInput(
	pagination: { page: number; limit: number },
	filters: { sort?: string; direction?: Direction },
	search: { text?: string }
): TrainersInquiry {
	const input: TrainersInquiry = {
		page: pagination.page,
		limit: pagination.limit,
		search: {},
	};

	// Add sort and direction if provided
	if (filters.sort) {
		input.sort = filters.sort;
	}
	if (filters.direction) {
		input.direction = filters.direction;
	}

	// Add search text if provided
	if (search.text && search.text.trim()) {
		input.search = { text: search.text.trim() };
	}

	// Remove undefined values
	return removeUndefinedKeys(input) as TrainersInquiry;
}

/**
 * Builds a clean trainer workouts inquiry input object.
 */
export function buildTrainerWorkoutsInquiryInput(
	trainerId: string,
	pagination: { page: number; limit: number },
	filters: { sort?: string; direction?: Direction; workoutStatus?: string }
): TrainerWorkoutsInquiry {
	const input: TrainerWorkoutsInquiry = {
		trainerId,
		page: pagination.page,
		limit: pagination.limit,
	};

	// Add optional filters
	if (filters.sort) {
		input.sort = filters.sort;
	}
	if (filters.direction) {
		input.direction = filters.direction;
	}
	if (filters.workoutStatus) {
		input.workoutStatus = filters.workoutStatus;
	}

	// Remove undefined values
	return removeUndefinedKeys(input) as TrainerWorkoutsInquiry;
}

/**
 * Removes undefined keys from an object recursively.
 * This ensures GraphQL queries don't receive undefined values.
 */
function removeUndefinedKeys<T extends Record<string, any>>(obj: T): Partial<T> {
	const cleaned: any = {};

	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const value = obj[key];
			if (value !== undefined) {
				if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value as any instanceof Date)) {
					const cleanedNested = removeUndefinedKeys(value);
					if (Object.keys(cleanedNested).length > 0) {
						cleaned[key] = cleanedNested;
					}
				} else {
					cleaned[key] = value;
				}
			}
		}
	}

	return cleaned;
}





















































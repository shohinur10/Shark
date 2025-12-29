import { useQuery } from '@apollo/client';
import { GET_TRAINER_AVAILABILITY } from '../../apollo/user/query';
import { useMemo } from 'react';
import moment from 'moment';

/**
 * Hook to fetch trainer availability for a specific date
 * Query is gated and will NOT run until both trainerId and bookingDate are valid
 * 
 * @param trainerId - Trainer ID (MongoDB ObjectId, must be 24-character hex string)
 * @param bookingDate - Date string in ISO format (YYYY-MM-DD)
 * 
 * Requirements:
 * - trainerId must be a valid MongoDB ObjectId (24-character hex string)
 * - bookingDate must be a valid ISO date string (YYYY-MM-DD format)
 */
export const useTrainerAvailability = (
	trainerId: string | null,
	bookingDate: string | null // ISO string format: YYYY-MM-DD
) => {
	// Validate and format bookingDate (must be YYYY-MM-DD)
	const availabilityDate = useMemo(() => {
		if (!bookingDate) return null;
		// Validate the date string format strictly (YYYY-MM-DD)
		if (!moment(bookingDate, 'YYYY-MM-DD', true).isValid()) {
			return null;
		}
		return bookingDate;
	}, [bookingDate]);

	// Validate trainerId is a valid MongoDB ObjectId (24-character hex string)
	const isValidTrainerId = useMemo(() => {
		if (!trainerId) return false;
		// MongoDB ObjectId is a 24-character hexadecimal string
		return /^[0-9a-fA-F]{24}$/.test(trainerId);
	}, [trainerId]);

	// Determine if query should be skipped
	// Query should ONLY run when BOTH trainerId and bookingDate are valid
	const shouldSkip = useMemo(() => {
		return !isValidTrainerId || !availabilityDate;
	}, [isValidTrainerId, availabilityDate]);

	// Only pass variables when query will run (when not skipped)
	const queryVariables = useMemo(() => {
		// Only create variables when both are valid (equivalent to !shouldSkip)
		if (!isValidTrainerId || !availabilityDate) {
			return undefined;
		}
		return {
			trainerId: trainerId!,
			date: availabilityDate!,
		};
	}, [isValidTrainerId, availabilityDate, trainerId]);

	// Log in dev mode for debugging
	if (process.env.NODE_ENV === 'development') {
		// eslint-disable-next-line no-console
		console.log('[useTrainerAvailability]', {
			trainerId: trainerId ? `${trainerId.substring(0, 8)}...` : null,
			bookingDate,
			availabilityDate,
			isValidTrainerId,
			shouldSkip,
			variables: queryVariables ? {
				trainerId: queryVariables.trainerId.substring(0, 8) + '...',
				date: queryVariables.date,
			} : undefined,
		});
	}

	const { data, loading, error, refetch } = useQuery(GET_TRAINER_AVAILABILITY, {
		// When skip is true, variables are ignored, but we only pass them when valid
		variables: shouldSkip ? undefined : (queryVariables as { trainerId: string; date: string }),
		skip: shouldSkip,
		fetchPolicy: 'network-only', // Always fetch fresh data
		errorPolicy: 'all', // Return partial data even if there's an error
	});

	// Log errors in dev mode
	if (error && process.env.NODE_ENV === 'development') {
		// eslint-disable-next-line no-console
		console.error('[useTrainerAvailability] Query error:', {
			message: error.message,
			graphQLErrors: error.graphQLErrors,
			networkError: error.networkError,
			variables: queryVariables,
		});
	}

	const availableSlots = useMemo(() => {
		return data?.getTrainerAvailability?.availableSlots || [];
	}, [data]);

	return {
		availableSlots,
		loading,
		error,
		refetch,
	};
};




import { useQuery } from '@apollo/client';
import { GET_TRAINER_AVAILABILITY } from '../../apollo/user/query';
import { useMemo } from 'react';
import moment from 'moment';

/**
 * Hook to fetch trainer availability for a specific date
 */
export const useTrainerAvailability = (
	trainerId: string | null,
	bookingDate: Date | null
) => {
	// Format date for availability query (YYYY-MM-DD)
	const availabilityDate = useMemo(() => {
		if (!bookingDate) return null;
		return moment(bookingDate).format('YYYY-MM-DD');
	}, [bookingDate]);

	const { data, loading, error, refetch } = useQuery(GET_TRAINER_AVAILABILITY, {
		variables: {
			trainerId: trainerId || '',
			date: availabilityDate || '',
		},
		skip: !trainerId || !availabilityDate,
		fetchPolicy: 'network-only', // Always fetch fresh data
	});

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


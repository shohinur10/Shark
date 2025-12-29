import { useQuery } from '@apollo/client';
import { GET_BOOKINGS } from '../../apollo/user/query';
import { BookingsInquiry } from '../types/booking/booking.input';
import { Booking } from '../types/booking/booking';

interface UseBookingsQueryResult {
	bookings: Booking[];
	total: number;
	loading: boolean;
	error: any;
	refetch: () => void;
}

export const useBookingsQuery = (input: BookingsInquiry): UseBookingsQueryResult => {
	const { loading, data, error, refetch } = useQuery(GET_BOOKINGS, {
		fetchPolicy: 'cache-and-network',
		variables: { input },
		notifyOnNetworkStatusChange: true,
	});

	const bookings = (data?.getBookings?.list || []) as Booking[];
	const total = data?.getBookings?.metaCounter?.[0]?.total || 0;

	return {
		bookings,
		total,
		loading,
		error,
		refetch: () => refetch({ input }),
	};
};


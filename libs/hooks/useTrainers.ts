import { useQuery } from '@apollo/client';
import { GET_TRAINERS } from '../apollo/user/query';
import { Member } from '../types/member/member';

interface UseTrainersResult {
	trainers: Member[];
	loading: boolean;
	error: any;
	refetch: () => void;
}

export const useTrainers = (): UseTrainersResult => {
	const { loading, data, error, refetch } = useQuery(GET_TRAINERS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 100,
			},
		},
		notifyOnNetworkStatusChange: true,
	});

	const trainers = (data?.getTrainers?.list || []) as Member[];

	return {
		trainers,
		loading,
		error,
		refetch: () => refetch(),
	};
};








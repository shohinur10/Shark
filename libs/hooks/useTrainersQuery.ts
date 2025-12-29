import { useQuery } from '@apollo/client';
import { GET_TRAINERS } from '../../apollo/user/query';
import { TrainersInquiry } from '../types/member/member.input';
import { Member } from '../types/member/member';
import { T } from '../types/common';

interface UseTrainersQueryResult {
	trainers: Member[];
	total: number;
	loading: boolean;
	error: any;
	refetch: () => void;
}

export const useTrainersQuery = (input: TrainersInquiry): UseTrainersQueryResult => {
	const { loading, data, error, refetch } = useQuery(GET_TRAINERS, {
		fetchPolicy: 'cache-and-network',
		variables: { input },
		notifyOnNetworkStatusChange: true,
	});

	const trainers = (data?.getTrainers?.list || []) as Member[];
	const total = data?.getTrainers?.metaCounter?.[0]?.total || 0;

	return {
		trainers,
		total,
		loading,
		error,
		refetch: () => refetch({ input }),
	};
};














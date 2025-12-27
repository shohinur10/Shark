import { useQuery } from '@apollo/client';
import { GET_TRAINER_WORKOUTS } from '../../apollo/user/query';
import { TrainerWorkoutsInquiry } from '../types/workout/workout.input';
import { Workout } from '../types/workout/workout';

interface UseTrainerWorkoutsQueryResult {
	workouts: Workout[];
	total: number;
	loading: boolean;
	error: any;
	refetch: () => void;
}

export const useTrainerWorkoutsQuery = (input: TrainerWorkoutsInquiry): UseTrainerWorkoutsQueryResult => {
	const { loading, data, error, refetch } = useQuery(GET_TRAINER_WORKOUTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input },
		notifyOnNetworkStatusChange: true,
		skip: !input.trainerId, // Skip query if no trainerId
	});

	const workouts = (data?.getTrainerWorkouts?.list || []) as Workout[];
	const total = data?.getTrainerWorkouts?.metaCounter?.[0]?.total || 0;

	return {
		workouts,
		total,
		loading,
		error,
		refetch: () => refetch({ input }),
	};
};










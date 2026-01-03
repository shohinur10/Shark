import { useQuery } from '@apollo/client';
import { GET_ROUTINE_COMPLETIONS } from '../../apollo/user/query';
import { RoutineCompletionsInput } from '../types/routine-assignment/routine-completion.input';
import { RoutineCompletion } from '../types/routine-assignment/routine-completion';

interface UseRoutineCompletionsResult {
	completions: RoutineCompletion[];
	total: number;
	loading: boolean;
	error: any;
	refetch: () => void;
}

export const useRoutineCompletions = (input: RoutineCompletionsInput): UseRoutineCompletionsResult => {
	const { loading, data, error, refetch } = useQuery(GET_ROUTINE_COMPLETIONS, {
		fetchPolicy: 'cache-and-network',
		variables: { input },
		notifyOnNetworkStatusChange: true,
	});

	const completions = (data?.getRoutineCompletions?.list || []) as RoutineCompletion[];
	const total = Array.isArray(data?.getRoutineCompletions?.metaCounter) 
		? data?.getRoutineCompletions?.metaCounter[0]?.total || 0
		: data?.getRoutineCompletions?.metaCounter || 0;

	return {
		completions,
		total,
		loading,
		error,
		refetch: () => refetch({ input }),
	};
};


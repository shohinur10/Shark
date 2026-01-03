import { useQuery } from '@apollo/client';
import { GET_USER_ASSIGNED_ROUTINES } from '../../apollo/user/query';
import { UserRoutineInquiry } from '../types/routine-assignment/routine-assignment.input';
import { RoutineAssignment } from '../types/routine-assignment/routine-assignment';

interface UseAssignedRoutinesResult {
	assignments: RoutineAssignment[];
	total: number;
	loading: boolean;
	error: any;
	refetch: () => void;
}

export const useAssignedRoutines = (input: UserRoutineInquiry): UseAssignedRoutinesResult => {
	const { loading, data, error, refetch } = useQuery(GET_USER_ASSIGNED_ROUTINES, {
		fetchPolicy: 'cache-and-network',
		variables: { input },
		notifyOnNetworkStatusChange: true,
	});

	const assignments = (data?.getUserAssignedRoutines?.list || []) as RoutineAssignment[];
	const total = Array.isArray(data?.getUserAssignedRoutines?.metaCounter) 
		? data?.getUserAssignedRoutines?.metaCounter[0]?.total || 0
		: data?.getUserAssignedRoutines?.metaCounter || 0;

	return {
		assignments,
		total,
		loading,
		error,
		refetch: () => refetch({ input }),
	};
};


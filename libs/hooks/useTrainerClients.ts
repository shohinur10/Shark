import { useQuery } from '@apollo/client';
import { GET_TRAINER_CLIENTS } from '../../apollo/user/query';

interface TrainerClient {
	_id: string;
	userId: string;
	assignmentsCount: number;
	activeAssignments: number;
	completedAssignments: number;
	lastAssignment?: Date;
	userData?: {
		_id: string;
		memberNick: string;
		memberImage?: string;
		memberFullName?: string;
		memberEmail?: string;
		memberPhone?: string;
	};
}

interface UseTrainerClientsResult {
	clients: TrainerClient[];
	loading: boolean;
	error: any;
	refetch: () => void;
}

export const useTrainerClients = (): UseTrainerClientsResult => {
	const { loading, data, error, refetch } = useQuery(GET_TRAINER_CLIENTS, {
		fetchPolicy: 'cache-and-network',
		notifyOnNetworkStatusChange: true,
	});

	const clients = (data?.getTrainerClients || []) as TrainerClient[];

	return {
		clients,
		loading,
		error,
		refetch,
	};
};


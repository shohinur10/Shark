import { useQuery } from '@apollo/client';
import { GET_BONUS_REWARDS } from '../../apollo/user/query';
import { BonusRewardsInput } from '../types/bonus-reward/bonus-reward.input';
import { BonusReward } from '../types/bonus-reward/bonus-reward';

interface UseBonusRewardsResult {
	bonuses: BonusReward[];
	total: number;
	loading: boolean;
	error: any;
	refetch: () => void;
}

export const useBonusRewards = (input: BonusRewardsInput): UseBonusRewardsResult => {
	const { loading, data, error, refetch } = useQuery(GET_BONUS_REWARDS, {
		fetchPolicy: 'cache-and-network',
		variables: { input },
		notifyOnNetworkStatusChange: true,
	});

	const bonuses = (data?.getBonusRewards?.list || []) as BonusReward[];
	const total = Array.isArray(data?.getBonusRewards?.metaCounter) 
		? data?.getBonusRewards?.metaCounter[0]?.total || 0
		: data?.getBonusRewards?.metaCounter || 0;

	return {
		bonuses,
		total,
		loading,
		error,
		refetch: () => refetch({ input }),
	};
};


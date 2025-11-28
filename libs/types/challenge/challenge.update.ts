import { ChallengeDifficulty, ChallengeStatus, ChallengeType } from '../../enums/challenge.enum';

export interface ChallengeUpdate {
	_id: string;
	challengeTitle?: string;
	challengeType?: ChallengeType;
	challengeStatus?: ChallengeStatus;
	challengeDifficulty?: ChallengeDifficulty;
	challengeDesc?: string;
	challengeImage?: string;
	targetValue?: number;
	targetUnit?: string;
	startDate?: Date;
	endDate?: Date;
	challengeRules?: string[];
	isCommunity?: boolean;
	rewardBadge?: string;
	rewardPoints?: number;
	deletedAt?: Date;
}


import { ChallengeDifficulty, ChallengeStatus, ChallengeType } from '../../enums/challenge.enum';
import { Direction } from '../../enums/common.enum';

export interface ChallengeInput {
	challengeTitle: string;
	challengeType: string;
	challengeDifficulty: string;
	challengeDesc: string;
	challengeImage?: string;
	targetValue: number;
	targetUnit: string;
	startDate: Date;
	endDate: Date;
	challengeRules?: string[];
	isCommunity?: boolean;
	rewardPoints?: number;
	createdBy?: string;
}

export interface ChallengeSearch {
	challengeType?: ChallengeType;
	challengeStatus?: ChallengeStatus;
}

export interface ChallengesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	challengeStatus?: ChallengeStatus;
	isCommunity?: boolean;
	search?: ChallengeSearch;
}

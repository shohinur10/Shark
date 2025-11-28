import { ChallengeDifficulty, ChallengeType } from '../../enums/challenge.enum';
import { Direction } from '../../enums/common.enum';

export interface ChallengeInput {
	challengeTitle: string;
	challengeType: ChallengeType;
	challengeDifficulty: ChallengeDifficulty;
	challengeDesc: string;
	challengeImage?: string;
	targetValue: number;
	targetUnit: string;
	startDate: Date;
	endDate: Date;
	challengeRules?: string[];
	isCommunity?: boolean;
	createdBy?: string;
}

interface CISearch {
	challengeType?: ChallengeType;
}

export interface ChallengesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: CISearch;
}


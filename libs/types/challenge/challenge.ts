import { ChallengeDifficulty, ChallengeStatus, ChallengeType } from '../../enums/challenge.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../common';

export interface Participant {
	memberId: string;
	joinedAt: Date;
	currentProgress: number;
	completed: boolean;
	completedAt?: Date;
}

export interface Challenge {
	_id: string;
	challengeTitle: string;
	challengeType: ChallengeType;
	challengeStatus: ChallengeStatus;
	challengeDifficulty: ChallengeDifficulty;
	challengeDesc: string;
	challengeImage?: string;
	targetValue: number;
	targetUnit: string;
	startDate: Date;
	endDate: Date;
	createdBy: string;
	participants: Participant[];
	participantCount: number;
	completionCount: number;
	rewardBadge?: string;
	rewardPoints: number;
	isCommunity: boolean;
	challengeRules: string[];
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation */
	memberData?: Member;
}

export interface Challenges {
	list: Challenge[];
	metaCounter: TotalCounter[];
}

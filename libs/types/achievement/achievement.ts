import { AchievementStatus, AchievementType } from '../../enums/challenge.enum';
import { Member } from '../member/member';
import { MeLiked, TotalCounter } from '../property/property';

export interface Achievement {
	_id: string;
	memberId: string;
    achievementType: AchievementType;
    achievementStatus: AchievementStatus;
    achievementTitle: string;
    achievementDesc?: string;
    achievementBadge?: string;
    targetValue?: number;
    currentValue: number;
    progressPercentage: number;
    points: number;
	challengeId?: string;
    unlockedAt?: Date;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Achievements {
	list: Achievement[];
	metaCounter: TotalCounter[];
}


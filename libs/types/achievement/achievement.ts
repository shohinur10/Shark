import { AchievementStatus, AchievementType } from '../../enums/challenge.enum';
import { Member } from '../member/member';
import { MeLiked, TotalCounter } from "../common"';

export interface Achievement {
	_id: string;
	achievementType: AchievementType;
	achievementStatus: AchievementStatus;
	achievementTitle: string;
	achievementDesc?: string;
	targetValue?: number;
	currentValue?: number;
	points?: number;
	challengeId?: string;
	memberId?: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	memberData?: Member;
}

export interface Achievements {
	list: Achievement[];
	metaCounter: TotalCounter[];
}

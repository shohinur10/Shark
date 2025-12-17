import { AchievementStatus, AchievementType } from '../../enums/challenge.enum';
import { Direction } from '../../enums/common.enum';

export interface AchievementInput {
	achievementType: AchievementType;
	achievementTitle: string;
	achievementDesc?: string;
	targetValue?: number;
	currentValue?: number;
	points?: number;
	achievementStatus?: AchievementStatus;
	challengeId?: string;
	memberId?: string;
}

interface AchievementSearch {
	achievementType?: AchievementType;
	achievementStatus?: AchievementStatus;
}

export interface AchievementsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: AchievementSearch;
	// Support flattened structure for backward compatibility
	achievementType?: AchievementType;
	achievementStatus?: AchievementStatus;
}

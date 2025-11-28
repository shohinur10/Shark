import { AchievementType } from '../../enums/challenge.enum';
import { Direction } from '../../enums/common.enum';

export interface AchievementInput {
	achievementType: AchievementType;
	achievementTitle: string;
	achievementDesc?: string;
	targetValue?: number;
	memberId?: string;
}

interface AISearch {
	achievementType?: AchievementType;
}

export interface AchievementsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AISearch;
}


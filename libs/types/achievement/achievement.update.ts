import { AchievementStatus, AchievementType } from '../../enums/challenge.enum';

export interface AchievementUpdate {
	_id: string;
	achievementType?: AchievementType;
	achievementStatus?: AchievementStatus;
	achievementTitle?: string;
	achievementDesc?: string;
	achievementBadge?: string;
	targetValue?: number;
	currentValue?: number;
	progressPercentage?: number;
	points?: number;
	challengeId?: string;
	unlockedAt?: Date;
	expiresAt?: Date;
}

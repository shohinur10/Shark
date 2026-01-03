export interface BonusRewardsInput {
	page?: number; // default: 1
	limit?: number; // default: 10
}

// Keep old interface for backward compatibility
import { Direction } from '../../enums/common.enum';
import { BonusType } from './bonus-reward';

export interface BonusRewardsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	userId?: string;
	trainerId?: string;
	bonusType?: BonusType;
	search?: {
		userId?: string;
		trainerId?: string;
		bonusType?: BonusType;
	};
}


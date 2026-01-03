import { Direction } from '../../enums/common.enum';

export interface TrainerClientsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	trainerId?: string;
	search?: {
		trainerId?: string;
		text?: string;
	};
}


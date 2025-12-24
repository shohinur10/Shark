import { Direction } from '../../enums/common.enum';

export interface SupplementsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	category?: string;
}


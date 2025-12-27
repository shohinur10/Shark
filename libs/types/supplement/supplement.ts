import { TotalCounter } from '../property/property';

export interface Supplement {
	_id: string;
	name: string;
	category: string;
	description?: string;
	recommendedDosage?: string;
	keyBenefits: string[];
	bestFor: string[];
	rating: number;
	usageNotes?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Supplements {
	list: Supplement[];
	metaCounter: TotalCounter[];
}


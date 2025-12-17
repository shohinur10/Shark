import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Property {
	_id: string;
	propertyType: PropertyType;
	propertyStatus: PropertyStatus;
	propertyLocation: PropertyLocation;
	propertyAddress: string;
	propertyTitle: string;
	propertyPrice: number;
	priceType?: string;
	womenDiscountPercent?: number;
	childrenDiscountPercent?: number;
	childrenAgeLimit?: number;
	extraClassDiscountPercent?: number;
	perClassPrice?: number;
	propertyCapacity?: number;
	propertyEquipmentList?: string[];
	propertyAmenities?: string[];
	propertyOperatingHours?: string;
	propertyRating?: number;
	propertyViews: number;
	propertyLikes: number;
	propertyComments: number;
	propertyRank: number;
	propertyImages?: string[];
	propertyDesc?: string;
	propertyRent: boolean;
	propertyCondition?: string;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt?: Date;
	memberId: string;
	/** from aggregation */
	memberData?: Member;
}

export interface Properties {
	list: Property[];
	metaCounter: TotalCounter[];
}

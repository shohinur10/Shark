import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';

export interface PropertyUpdate {
	_id: string;
	propertyType?: PropertyType;
	propertyStatus?: PropertyStatus;
	propertyLocation?: PropertyLocation;
	propertyAddress?: string;
	propertyTitle?: string;
	propertyPrice?: number;
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
	propertyCondition?: string;
	propertyImages?: string[];
	propertyDesc?: string;
	propertyRent?: boolean;
	deletedAt?: Date;
}

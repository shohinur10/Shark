import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { Direction } from '../../enums/common.enum';

export interface PropertyInput {
	propertyType: PropertyType;
	propertyStatus?: PropertyStatus;
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
	propertyCondition?: string;
	propertyImages?: string[];
	propertyDesc?: string;
	propertyRent?: boolean;
	memberId?: string;
}

export interface PricesRange {
	start: number;
	end: number;
}

export interface PeriodsRange {
	start: Date;
	end: Date;
}

interface PISearch {
	memberId?: string;
	locationList?: PropertyLocation[];
	typeList?: PropertyType[];
	options?: string[];
	pricesRange?: PricesRange;
	periodsRange?: PeriodsRange;
	text?: string;
}

export interface PropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	propertyStatus?: PropertyStatus;
}

export interface MyPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: APISearch;
}

interface ALPISearch {
	propertyStatus?: PropertyStatus;
	propertyLocationList?: PropertyLocation[];
}

export interface AllPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: ALPISearch;
}

export interface OrdinaryInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
}

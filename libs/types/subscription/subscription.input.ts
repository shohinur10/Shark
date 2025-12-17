import { Direction } from '../../enums/common.enum';
import { SubscriptionPeriod, SubscriptionPlan, SubscriptionStatus, SubscriptionDiscount } from '../../enums/subscription.enum';

export interface SubscriptionInput {
	subscriptionPlan: string;
	subscriptionPeriod: string;
	paymentMethodId?: string;
	memberId?: string;
	subscriptionStatus?: string;
	subscriptionDiscount?: string;
	basePrice?: number;
	discountPercentage?: number;
	finalPrice?: number;
	startDate?: Date;
	endDate?: Date;
	trialEndDate?: Date;
	cancelledAt?: Date;
	lastPaymentDate?: Date;
	nextPaymentDate?: Date;
	autoRenewal?: boolean;
	subscriptionNotes?: string;
}

export interface SISearch {
	memberId?: string;
	subscriptionStatus?: string;
	subscriptionPlan?: string;
}

export interface SubscriptionsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	memberId?: string;
	subscriptionStatus?: string;
	subscriptionPlan?: string;
	search?: SISearch;
}

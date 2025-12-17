import { SubscriptionStatus, SubscriptionPlan, SubscriptionPeriod, SubscriptionDiscount } from '../../enums/subscription.enum';

export interface SubscriptionUpdate {
	_id?: string;
	subscriptionId?: string;
	subscriptionStatus?: string;
	subscriptionPlan?: string;
	subscriptionPeriod?: string;
	subscriptionDiscount?: string;
	basePrice?: number;
	discountPercentage?: number;
	finalPrice?: number;
	autoRenewal?: boolean;
	paymentMethodId?: string;
	subscriptionNotes?: string;
	cancelledAt?: Date;
	startDate?: Date;
	endDate?: Date;
	trialEndDate?: Date;
	lastPaymentDate?: Date;
	nextPaymentDate?: Date;
}

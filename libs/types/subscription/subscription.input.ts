import { Direction } from '../../enums/common.enum';
import { SubscriptionPeriod, SubscriptionPlan, SubscriptionStatus } from '../../enums/subscription.enum';

export interface SubscriptionInput {
	subscriptionPlan: SubscriptionPlan;
	subscriptionPeriod: SubscriptionPeriod;
	paymentMethodId?: string;
	memberId?: string;
}

interface SISearch {
	memberId?: string;
	subscriptionStatus?: SubscriptionStatus;
	subscriptionPlan?: SubscriptionPlan;
}

export interface SubscriptionsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: SISearch;
}

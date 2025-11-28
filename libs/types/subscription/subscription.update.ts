import { SubscriptionStatus } from '../../enums/subscription.enum';

export interface SubscriptionUpdate {
	_id: string;
	subscriptionStatus?: SubscriptionStatus;
	autoRenewal?: boolean;
	paymentMethodId?: string;
	subscriptionNotes?: string;
	cancelledAt?: Date;
}

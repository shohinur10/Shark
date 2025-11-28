import { SubscriptionDiscount, SubscriptionPeriod, SubscriptionPlan, SubscriptionStatus } from '../../enums/subscription.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../property/property';

export interface Subscription {
	_id: string;
	memberId: string;
    subscriptionPlan: SubscriptionPlan;
    subscriptionPeriod: SubscriptionPeriod;
    subscriptionStatus: SubscriptionStatus;
    subscriptionDiscount: SubscriptionDiscount;
    basePrice: number;
    discountPercentage: number;
    finalPrice: number;
    startDate: Date;
    endDate: Date;
    trialEndDate?: Date;
    cancelledAt?: Date;
    lastPaymentDate?: Date;
    nextPaymentDate?: Date;
    autoRenewal: boolean;
    paymentMethodId?: string;
    subscriptionNotes?: string;
    createdAt: Date;
    updatedAt: Date;
	/** from aggregation **/
    memberData?: Member;
}

export interface Subscriptions {
	list: Subscription[];
	metaCounter: TotalCounter[];
}

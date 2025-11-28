import { Currency, PaymentMethod, PaymentStatus, TransactionType } from '../../enums/payment.enum';
import { TotalCounter } from '../property/property';

export interface Payment {
	_id: string;
	memberId: string;
    transactionType: TransactionType;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    amount: number;
    currency: Currency;
	subscriptionId?: string;
	bookingId?: string;
	propertyId?: string;
	mealPlanId?: string;
    stripePaymentId?: string;
    paypalTransactionId?: string;
    receiptUrl?: string;
    invoiceNumber?: string;
    refundAmount: number;
    refundReason?: string;
    refundedAt?: Date;
    description?: string;
    paidAt?: Date;
    failedAt?: Date;
    failureReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Payments {
	list: Payment[];
	metaCounter: TotalCounter[];
}

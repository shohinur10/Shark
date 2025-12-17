import { Direction } from '../../enums/common.enum';
import { Currency, PaymentMethod, TransactionType } from '../../enums/payment.enum';

export interface PaymentInput {
	transactionType: string;
	paymentMethod: string;
	amount: number;
	currency?: Currency;
	subscriptionId?: string;
	bookingId?: string;
	description?: string;
	memberId?: string;
}

export interface PaymentSearch {
	transactionType?: TransactionType;
}

export interface PaymentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: PaymentSearch;
}

import { PaymentMethod } from '../../enums/payment.enum';

export interface ProcessBookingPaymentInput {
	bookingId: string;
	paymentMethodId: string; // Payment method token/ID from payment gateway
	paymentMethod?: PaymentMethod; // Optional: payment method type
	description?: string;
}

export interface RefundBookingInput {
	bookingId: string;
	reason: string;
	refundAmount?: number; // Optional: if not provided, refund full amount
}

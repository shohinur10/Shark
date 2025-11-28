import { PaymentStatus } from '../../enums/payment.enum';

export interface PaymentUpdate {
	_id: string;
	paymentStatus?: PaymentStatus;
	refundAmount?: number;
	refundReason?: string;
	refundedAt?: Date;
	paidAt?: Date;
	failedAt?: Date;
	failureReason?: string;
}


export interface BookingSupplementInput {
	bookingId: string;
	supplementId: string;
	quantity: number;
	unitPrice?: number; // If not provided, will fetch from supplement
	notes?: string;
	recommendedBy?: string;
}

export interface RecommendedSupplementsInput {
	bookingType: string;
	trainerId?: string;
}

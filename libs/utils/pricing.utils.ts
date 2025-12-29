import { Service } from '../types/service/service';

export interface PriceBreakdown {
	basePrice: number;
	discount: number;
	tax: number;
	total: number;
	currency: string;
}

/**
 * Calculate booking price based on service and duration
 * 
 * Derived selector that computes price from service data:
 * - Uses service.fixedPrice if available
 * - OR calculates: service.pricePerHour * (durationMinutes / 60)
 * 
 * Future enhancements (when discount fields are added to Service type):
 * - Apply discountPercentage or discountAmount if available
 * - Fallback to bookingPrice from backend response if provided
 * 
 * @param service - Service object with pricing information (fixedPrice or pricePerHour)
 * @param durationMinutes - Duration in minutes
 * @returns Calculated price (0 if invalid inputs)
 */
export const calculateServicePrice = (
	service: Service | null,
	durationMinutes: number
): number => {
	if (!service || durationMinutes === 0) return 0;

	// If service has a fixed price, use it
	if (service.fixedPrice !== undefined && service.fixedPrice !== null) {
		return service.fixedPrice;
	}

	// Otherwise, calculate: pricePerHour * (durationMinutes / 60)
	if (service.pricePerHour) {
		const total = service.pricePerHour * (durationMinutes / 60);
		return Math.round(total * 100) / 100; // Round to 2 decimal places
	}

	return 0;
};

/**
 * Calculate full price breakdown including discounts and taxes
 * This is a placeholder for future enhancements
 */
export const calculatePriceBreakdown = (
	service: Service | null,
	durationMinutes: number,
	discountPercentage: number = 0,
	taxRate: number = 0
): PriceBreakdown => {
	const basePrice = calculateServicePrice(service, durationMinutes);
	const discount = (basePrice * discountPercentage) / 100;
	const subtotal = basePrice - discount;
	const tax = (subtotal * taxRate) / 100;
	const total = subtotal + tax;

	return {
		basePrice: Math.round(basePrice * 100) / 100,
		discount: Math.round(discount * 100) / 100,
		tax: Math.round(tax * 100) / 100,
		total: Math.round(total * 100) / 100,
		currency: 'USD', // TODO: Get from service or user preferences
	};
};

/**
 * Format price for display
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency,
	}).format(price);
};




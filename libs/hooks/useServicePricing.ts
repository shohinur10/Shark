import { useMemo } from 'react';
import { Service } from '../types/service/service';
import { calculateServicePrice } from '../utils/pricing.utils';

/**
 * Hook to calculate service pricing based on service and duration
 * 
 * Derived selector that computes totalPrice from:
 * - service.fixedPrice (if available)
 * - OR service.pricePerHour * (durationMinutes / 60)
 * 
 * Future enhancements:
 * - Add discount support if service has discountPercentage/discountAmount fields
 * - Add fallback to bookingPrice from backend response if available
 * 
 * @param service - Service object with pricing information
 * @param durationMinutes - Duration in minutes
 * @returns Calculated total price (0 if invalid inputs)
 */
export const useServicePricing = (
	service: Service | null,
	durationMinutes: number
): number => {
	return useMemo(() => {
		return calculateServicePrice(service, durationMinutes);
	}, [service, durationMinutes]);
};




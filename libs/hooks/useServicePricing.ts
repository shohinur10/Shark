import { useMemo } from 'react';
import { Service } from '../types/service/service';
import { calculateServicePrice } from '../utils/pricing.utils';

/**
 * Hook to calculate service pricing based on service and duration
 */
export const useServicePricing = (
	service: Service | null,
	durationMinutes: number
): number => {
	return useMemo(() => {
		return calculateServicePrice(service, durationMinutes);
	}, [service, durationMinutes]);
};


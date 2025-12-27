import moment from 'moment';
import { BookingInput } from '../types/booking/booking.input';
import { BookingType } from '../enums/booking.enum';
import { Service } from '../types/service/service';

/**
 * Format date for GraphQL (YYYY-MM-DD)
 */
export const formatDateForGraphQL = (date: Date | null): string | null => {
	if (!date) return null;
	return moment(date).format('YYYY-MM-DD');
};

/**
 * Format time for display (h:mm A)
 */
export const formatTimeForDisplay = (time: string | null): string => {
	if (!time) return '';
	return moment(time, 'HH:mm').format('h:mm A');
};

/**
 * Format date for display (MMMM DD, YYYY)
 */
export const formatDateForDisplay = (date: Date | null): string => {
	if (!date) return '—';
	return moment(date).format('MMMM DD, YYYY');
};

/**
 * Format date and time together for display
 */
export const formatDateTimeForDisplay = (date: Date | null, time: string | null): string => {
	if (!date && !time) return '—';
	if (!date) return `— ${formatTimeForDisplay(time)}`;
	if (!time) return `${formatDateForDisplay(date)} —`;
	return `${formatDateForDisplay(date)} ${formatTimeForDisplay(time)}`;
};

/**
 * Format duration for display
 */
export const formatDurationForDisplay = (minutes: number): string => {
	if (!minutes || minutes === 0) return '—';
	if (minutes === 30) return '30 minutes';
	if (minutes === 60) return '1 hour';
	if (minutes === 90) return '1.5 hours';
	if (minutes === 120) return '2 hours';
	return `${minutes} minutes`;
};

/**
 * Get minimum booking date (today)
 */
export const getMinBookingDate = (): string => {
	return moment().format('YYYY-MM-DD');
};

/**
 * Validate if a date is in the future
 */
export const isDateInFuture = (date: Date | null): boolean => {
	if (!date) return false;
	return moment(date).isAfter(moment(), 'day');
};

/**
 * Validate if a date is today or in the future
 */
export const isDateValid = (date: Date | null): boolean => {
	if (!date) return false;
	return moment(date).isSameOrAfter(moment(), 'day');
};

/**
 * Prepare booking input for GraphQL mutation
 */
export const prepareBookingInput = (
	service: Service | null,
	trainerId: string | null,
	bookingDate: Date | null,
	bookingTime: string | null,
	durationMinutes: number,
	bookingPrice: number,
	clientId: string,
	notes?: string,
	locationType?: string
): BookingInput | null => {
	if (!service || !trainerId || !bookingDate || !bookingTime || !clientId || durationMinutes === 0) {
		return null;
	}

	const formattedDate = formatDateForGraphQL(bookingDate);
	if (!formattedDate) return null;

	return {
		bookingType: service.bookingType || BookingType.PERSONAL_TRAINING,
		providerId: trainerId,
		bookingDate: formattedDate as any, // GraphQL Date scalar
		bookingTime: bookingTime,
		sessionDuration: durationMinutes,
		bookingPrice: bookingPrice,
		bookingNotes: notes || undefined,
		meetingLink: locationType === 'online' ? '' : undefined,
		clientId: clientId,
	};
};


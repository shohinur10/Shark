import moment from 'moment';
import { BookingInput } from '../types/booking/booking.input';
import { BookingType, SessionDuration } from '../enums/booking.enum';
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
 * Format duration for display (generic - works with any number of minutes)
 * Converts minutes to human-readable format (e.g., 30 -> "30 minutes", 60 -> "1 hour", 90 -> "1.5 hours")
 * @param minutes - Number of minutes
 * @returns Formatted string representation
 */
export const formatDurationForDisplay = (minutes: number): string => {
	if (!minutes || minutes === 0) return '—';
	
	// Handle common cases with friendly labels
	if (minutes === 30) return '30 minutes';
	if (minutes === 45) return '45 minutes';
	if (minutes === 60) return '1 hour';
	if (minutes === 90) return '1.5 hours';
	if (minutes === 120) return '2 hours';
	
	// Handle full day (24 hours = 1440 minutes)
	if (minutes === 1440) return 'Full Day';
	
	// Handle hours (multiples of 60)
	if (minutes % 60 === 0) {
		const hours = minutes / 60;
		return hours === 1 ? '1 hour' : `${hours} hours`;
	}
	
	// Handle hours with minutes (e.g., 90 = 1.5 hours)
	if (minutes % 30 === 0 && minutes > 60) {
		const hours = minutes / 60;
		return `${hours} hours`;
	}
	
	// Generic fallback
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
 * Matches backend requirements exactly:
 * - bookingDate: ISO format "YYYY-MM-DD" (string)
 * - bookingTime: "HH:mm" format (24-hour, 2-digit)
 * - sessionDuration: number (minutes)
 * - providerId: MongoDB ObjectId (24-char hex string)
 * - serviceId: MongoDB ObjectId (recommended for validation)
 * 
 * @param service - Selected service object
 * @param trainerId - Trainer ID (MongoDB ObjectId)
 * @param bookingDate - Date string in ISO format (YYYY-MM-DD)
 * @param bookingTime - Time string in HH:mm format (24-hour)
 * @param durationMinutes - Duration in minutes
 * @param bookingPrice - Calculated price
 * @param clientId - Client ID (MongoDB ObjectId)
 * @param notes - Optional booking notes (5-500 characters)
 * @param locationType - Booking type (BookingType enum)
 */
export const prepareBookingInput = (
	service: Service | null,
	trainerId: string | null,
	bookingDate: string | null, // ISO string format: YYYY-MM-DD
	bookingTime: string | null, // HH:mm format (24-hour)
	durationMinutes: number,
	bookingPrice: number,
	clientId: string,
	notes?: string,
	locationType?: string
): BookingInput | null => {
	if (!service || !trainerId || !bookingDate || !bookingTime || !clientId || durationMinutes === 0) {
		return null;
	}

	// Validate bookingDate is in YYYY-MM-DD format
	if (!moment(bookingDate, 'YYYY-MM-DD', true).isValid()) {
		return null;
	}

	// Validate bookingTime is in HH:mm format (24-hour)
	if (!moment(bookingTime, 'HH:mm', true).isValid()) {
		return null;
	}

	// Validate trainerId is a valid MongoDB ObjectId (24-char hex string)
	if (!/^[0-9a-fA-F]{24}$/.test(trainerId)) {
		return null;
	}

	// Use bookingType from service (real backend data) as primary source
	// Fallback to locationType if provided, otherwise use service.bookingType
	let finalBookingType: BookingType;
	if (locationType && Object.values(BookingType).includes(locationType as BookingType)) {
		finalBookingType = locationType as BookingType;
	} else if (service.bookingType) {
		finalBookingType = service.bookingType;
	} else {
		// Last resort fallback (should not happen if service data is correct)
		finalBookingType = BookingType.PERSONAL_TRAINING;
	}

	// Validate duration is in service's durationOptions
	if (service.durationOptions && !service.durationOptions.includes(durationMinutes)) {
		return null;
	}

	// Validate notes length if provided (5-500 characters)
	if (notes && (notes.length < 5 || notes.length > 500)) {
		return null;
	}

	// Round price to 2 decimal places
	const roundedPrice = Math.round(bookingPrice * 100) / 100;

	return {
		bookingType: finalBookingType,
		providerId: trainerId, // MongoDB ObjectId (24-char hex string)
		serviceId: service._id, // Recommended for server-side validation
		bookingDate: bookingDate, // ISO format "YYYY-MM-DD" (string)
		bookingTime: bookingTime, // "HH:mm" format (24-hour)
		sessionDuration: durationMinutes, // Number (minutes)
		bookingPrice: roundedPrice, // Number, rounded to 2 decimal places
		bookingNotes: notes && notes.length >= 5 ? notes : undefined, // Optional, 5-500 characters
		meetingLink: finalBookingType === BookingType.ONLINE_SESSION ? undefined : undefined, // Optional, for ONLINE_SESSION
		clientId: clientId, // Optional, will be derived from auth token if not provided
	};
};



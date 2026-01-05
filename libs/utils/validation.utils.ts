export interface ValidationErrors {
	trainerId?: string;
	serviceId?: string;
	bookingType?: string;
	date?: string;
	time?: string;
	duration?: string;
	price?: string;
	location?: string;
}

export interface BookingFormData {
	trainerId: string | null;
	serviceId: string | null;
	bookingDate: string | null; // ISO string format: YYYY-MM-DD
	bookingTime: string | null;
	durationMinutes: number;
	locationType?: string;
}

/**
 * Validate booking form data
 * Matches backend validation requirements exactly
 */
export const validateBookingForm = (formData: BookingFormData): ValidationErrors => {
	const errors: ValidationErrors = {};

	// Validate trainerId
	if (!formData.trainerId) {
		errors.trainerId = 'Please select a trainer';
	} else if (!isValidObjectId(formData.trainerId)) {
		errors.trainerId = 'Invalid trainer ID format: must be a 24 character hex string';
	}

	// Validate serviceId
	if (!formData.serviceId) {
		errors.serviceId = 'Please select a service';
	} else if (!isValidObjectId(formData.serviceId)) {
		errors.serviceId = 'Invalid service ID format: must be a 24 character hex string';
	}

	// Validate bookingDate
	if (!formData.bookingDate) {
		errors.date = 'Please select a date';
	} else {
		// Validate date format (YYYY-MM-DD)
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		if (!dateRegex.test(formData.bookingDate)) {
			errors.date = 'Invalid date format. Expected YYYY-MM-DD';
		} else {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const selectedDate = new Date(formData.bookingDate);
			selectedDate.setHours(0, 0, 0, 0);
			
			// Check if date is in the past
			if (selectedDate < today) {
				errors.date = 'Booking date cannot be in the past';
			}
			
			// Check if date is more than 90 days in advance
			const maxDate = new Date();
			maxDate.setDate(maxDate.getDate() + 90);
			if (selectedDate > maxDate) {
				errors.date = 'Booking date cannot be more than 90 days in advance';
			}
		}
	}

	// Validate bookingTime
	if (!formData.bookingTime) {
		errors.time = 'Please select a time';
	} else {
		// Validate time format (HH:mm, 24-hour)
		const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
		if (!timeRegex.test(formData.bookingTime)) {
			errors.time = 'Invalid booking time format. Expected HH:mm (24-hour format)';
		} else if (formData.bookingDate) {
			// Check if booking is at least 2 hours in advance
			const now = new Date();
			const bookingDateTime = new Date(`${formData.bookingDate}T${formData.bookingTime}:00`);
			const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
			
			if (hoursUntilBooking < 2) {
				errors.time = 'Booking must be at least 2 hours in advance';
			}
		}
	}

	// Validate duration
	if (!formData.durationMinutes || formData.durationMinutes === 0) {
		errors.duration = 'Please select a duration';
	} else if (formData.durationMinutes < 0) {
		errors.duration = 'Duration must be a positive number';
	}

	return errors;
};

/**
 * Check if form is valid
 */
export const isBookingFormValid = (
	formData: BookingFormData,
	userId?: string | null
): boolean => {
	if (!userId) return false;

	const errors = validateBookingForm(formData);
	return Object.keys(errors).length === 0;
};

/**
 * Clear specific validation error
 */
export const clearValidationError = (
	errors: ValidationErrors,
	field: keyof ValidationErrors
): ValidationErrors => {
	const newErrors = { ...errors };
	delete newErrors[field];
	return newErrors;
};

/**
 * Validates if a string is a valid MongoDB ObjectId format (24 character hex string)
 */
export const isValidObjectId = (id: string | null | undefined): boolean => {
	if (!id || typeof id !== 'string') return false;
	// MongoDB ObjectId is a 24-character hexadecimal string
	return /^[0-9a-fA-F]{24}$/.test(id);
};




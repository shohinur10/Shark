export interface ValidationErrors {
	trainerId?: string;
	serviceId?: string;
	date?: string;
	time?: string;
	duration?: string;
	location?: string;
}

export interface BookingFormData {
	trainerId: string | null;
	serviceId: string | null;
	bookingDate: Date | null;
	bookingTime: string | null;
	durationMinutes: number;
	locationType?: string;
}

/**
 * Validate booking form data
 */
export const validateBookingForm = (formData: BookingFormData): ValidationErrors => {
	const errors: ValidationErrors = {};

	if (!formData.trainerId) {
		errors.trainerId = 'Please select a trainer';
	}

	if (!formData.serviceId) {
		errors.serviceId = 'Please select a service';
	}

	if (!formData.bookingDate) {
		errors.date = 'Please select a date';
	} else {
		// Check if date is in the past
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const selectedDate = new Date(formData.bookingDate);
		selectedDate.setHours(0, 0, 0, 0);
		
		if (selectedDate < today) {
			errors.date = 'Please select a date in the future';
		}
	}

	if (!formData.bookingTime) {
		errors.time = 'Please select a time';
	}

	if (!formData.durationMinutes || formData.durationMinutes === 0) {
		errors.duration = 'Please select a duration';
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


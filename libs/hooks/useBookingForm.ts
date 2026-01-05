import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { useReactiveVar } from '@apollo/client';
import moment from 'moment';
import { GET_TRAINERS, GET_ALL_SERVICES, GET_BOOKINGS } from '../../apollo/user/query';
import { CREATE_BOOKING } from '../../apollo/user/mutation';
import { userVar } from '../../apollo/store';
import { Direction } from '../enums/common.enum';
import { ServiceStatus, BookingType } from '../enums/booking.enum';
import { Service } from '../types/service/service';
import { BookingInput } from '../types/booking/booking.input';
import { ServicesInquiry } from '../types/service/service.input';
import { sweetErrorAlert, sweetMixinSuccessAlert } from '../sweetAlert';
import { useServicePricing } from './useServicePricing';
import { useTrainerAvailability } from './useTrainerAvailability';
import { validateBookingForm, isBookingFormValid, ValidationErrors, isValidObjectId } from '../utils/validation.utils';
import { prepareBookingInput } from '../utils/booking.utils';

export interface BookingFormState {
	trainerId: string | null;
	serviceId: string | null; // Optional - kept for backward compatibility
	bookingDate: string | null; // ISO string format: YYYY-MM-DD
	bookingTime: string | null;
	durationMinutes: number;
	bookingType: BookingType | null; // Manual booking type selection
	bookingPrice: number; // Manual price input
	notes: string;
}

export interface UseBookingFormReturn {
	// State
	state: BookingFormState;
	validationErrors: ValidationErrors;
	
	// Data
	trainers: any[];
	services: Service[]; // Kept for backward compatibility but not required
	availableSlots: string[];
	selectedTrainer: any | null;
	selectedService: Service | null; // Kept for backward compatibility
	totalPrice: number;
	
	// Loading states
	trainersLoading: boolean;
	servicesLoading: boolean;
	availabilityLoading: boolean;
	creatingBooking: boolean;
	
	// Errors
	trainersError: any;
	servicesError: any;
	availabilityError: any;
	
	// Validation
	isFormValid: boolean;
	
	// Handlers
	setTrainerId: (trainerId: string | null) => void;
	setServiceId: (serviceId: string | null) => void; // Kept for backward compatibility
	setBookingDate: (date: Date | null) => void;
	setBookingTime: (time: string | null) => void;
	setDuration: (duration: number) => void;
	setBookingType: (bookingType: BookingType | null) => void;
	setBookingPrice: (price: number) => void;
	setNotes: (notes: string) => void;
	submit: () => Promise<void>;
	clearValidationError: (field: keyof ValidationErrors) => void;
}

/**
 * Main hook for booking form management
 */
export const useBookingForm = (initialTrainerId?: string | string[]): UseBookingFormReturn => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	
	// Form state - all values start as null/empty
	const [state, setState] = useState<BookingFormState>({
		trainerId: null,
		serviceId: null,
		bookingDate: null, // ISO string format: YYYY-MM-DD
		bookingTime: null,
		durationMinutes: 0,
		bookingType: BookingType.PERSONAL_TRAINING, // Default booking type
		bookingPrice: 0,
		notes: '',
	});

	const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
	const [showValidation, setShowValidation] = useState(false);

	// Set initial trainer ID from URL param (only if it's a valid ObjectId)
	useEffect(() => {
		if (initialTrainerId) {
			const trainerId = typeof initialTrainerId === 'string' ? initialTrainerId : initialTrainerId[0];
			// Only set trainerId if it's a valid MongoDB ObjectId format
			if (isValidObjectId(trainerId)) {
				setState(prev => ({ ...prev, trainerId }));
			}
			// If invalid, just ignore it (don't set it) to avoid errors
		}
	}, [initialTrainerId]);

	// Fetch trainers - requires authentication (backend uses @AuthMember)
	const { data: trainersData, loading: trainersLoading, error: trainersError } = useQuery(GET_TRAINERS, {
		variables: {
			input: {
				page: 1, // Required, minimum 1
				limit: 50, // Required, minimum 1
				sort: 'trainerRating', // Optional, e.g., "trainerRating", "createdAt"
				direction: Direction.DESC, // Optional, "ASC" | "DESC", defaults to DESC
				// search is optional - can include { text?: string } for searching memberNick
			},
		},
		skip: false,
		fetchPolicy: 'cache-and-network', // Always fetch fresh data
		// Authentication is handled by Apollo client (authLink in apollo/client.ts)
		onCompleted: (data) => {
			console.log('✅ GET_TRAINERS query completed:', {
				trainersCount: data?.getTrainers?.list?.length || 0,
				total: data?.getTrainers?.metaCounter?.total || 0,
				trainers: data?.getTrainers?.list || [],
			});
		},
		onError: (error) => {
			console.error('❌ GET_TRAINERS query error:', {
				message: error.message,
				graphQLErrors: error.graphQLErrors,
				networkError: error.networkError,
			});
		},
	});

	// Fetch services - only ACTIVE services (optional, kept for backward compatibility)
	const servicesQuery: ServicesInquiry = useMemo(() => ({
		page: 1,
		limit: 100,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			status: ServiceStatus.ACTIVE,
		},
	}), []);

	const { data: servicesData, loading: servicesLoading, error: servicesError } = useQuery(GET_ALL_SERVICES, {
		variables: {
			input: servicesQuery,
		},
		fetchPolicy: 'cache-and-network',
		skip: true, // Skip service fetching - we're using manual inputs instead
		onCompleted: (data) => {
			console.log('✅ GET_ALL_SERVICES query completed:', {
				servicesCount: data?.getAllServices?.list?.length || 0,
				total: data?.getAllServices?.metaCounter?.total || 0,
				services: data?.getAllServices?.list || [],
			});
		},
		onError: (error) => {
			// Silently handle errors since services are optional now
			console.log('Services query skipped (using manual inputs)');
		},
	});

	// Get trainer availability
	const { availableSlots, loading: availabilityLoading, error: availabilityError } = useTrainerAvailability(
		state.trainerId,
		state.bookingDate
	);

	// Create booking mutation
	const [createBooking, { loading: creatingBooking }] = useMutation(CREATE_BOOKING, {
		refetchQueries: user?._id
			? [
					{
						query: GET_BOOKINGS,
						variables: {
							input: {
								page: 1,
								limit: 50,
								clientId: user._id,
							},
						},
					},
			  ]
			: [],
		onCompleted: async (data) => {
			if (data?.createBooking) {
				await sweetMixinSuccessAlert('Booking created successfully!');
				// Store booking ID for reference
				const bookingId = data.createBooking._id;
				console.log('Booking created with ID:', bookingId);
				router.push('/bookings');
			}
		},
		onError: (error) => {
			console.error('Error creating booking:', error);
			// Error handling is done in try-catch block in submit function
			// This is a fallback for errors not caught in try-catch
			if (!error.graphQLErrors || error.graphQLErrors.length === 0) {
				sweetErrorAlert(error.message || 'Failed to create booking. Please try again.');
			}
		},
	});

	// Get trainers list
	const trainers = useMemo(() => {
		const trainersList = trainersData?.getTrainers?.list || [];
		console.log('📋 Trainers list from useMemo:', {
			count: trainersList.length,
			trainers: trainersList.map((t: any) => ({
				id: t._id,
				name: t.memberFullName || t.memberNick,
				rating: t.trainerRating,
			})),
		});
		return trainersList;
	}, [trainersData]);

	// Get active services list
	const services = useMemo(() => {
		const servicesList = servicesData?.getAllServices?.list || [];
		const activeServices = servicesList.filter(
			(service: Service) => service.status === ServiceStatus.ACTIVE
		);
		console.log('📋 Services list from useMemo:', {
			total: servicesList.length,
			active: activeServices.length,
			services: activeServices.map((s: Service) => ({
				id: s._id,
				title: s.title,
				status: s.status,
				bookingType: s.bookingType,
			})),
		});
		return activeServices;
	}, [servicesData]);

	// Get selected trainer
	const selectedTrainer = useMemo(() => {
		if (!state.trainerId || !trainers.length) return null;
		return trainers.find((t: any) => t._id === state.trainerId) || null;
	}, [state.trainerId, trainers]);

	// Validate trainerId exists in trainers list after trainers are loaded
	useEffect(() => {
		if (state.trainerId && trainers.length > 0) {
			const trainerExists = trainers.some((t: any) => t._id === state.trainerId);
			if (!trainerExists) {
				// Trainer ID doesn't exist in the list, clear it
				setState(prev => ({ ...prev, trainerId: null }));
			}
		}
	}, [state.trainerId, trainers]);

	// Get selected service (kept for backward compatibility)
	const selectedService = useMemo(() => {
		if (!state.serviceId || !services.length) return null;
		return services.find((s: Service) => s._id === state.serviceId) || null;
	}, [state.serviceId, services]);

	// Use manual booking price, fallback to service pricing if service is selected
	const servicePrice = useServicePricing(selectedService, state.durationMinutes);
	const totalPrice = useMemo(() => {
		if (state.bookingPrice > 0) {
			return state.bookingPrice;
		}
		// Fallback to service pricing if service is selected
		return servicePrice;
	}, [state.bookingPrice, servicePrice]);

	// Reset time when trainer or date changes
	useEffect(() => {
		setState(prev => ({ ...prev, bookingTime: null }));
	}, [state.trainerId, state.bookingDate]);

	// Form validation - updated to use bookingType instead of serviceId
	const isFormValid = useMemo(() => {
		return !!(
			state.trainerId &&
			state.bookingType &&
			state.bookingDate &&
			state.bookingTime &&
			state.durationMinutes > 0 &&
			state.bookingPrice > 0 &&
			user?._id
		);
	}, [state, user?._id]);

	// Update validation errors when fields change
	useEffect(() => {
		if (showValidation) {
			const errors: ValidationErrors = {};
			if (!state.trainerId) errors.trainerId = 'Please select a trainer';
			if (!state.bookingType) errors.bookingType = 'Please select a booking type';
			if (!state.bookingDate) errors.date = 'Please select a date';
			if (!state.bookingTime) errors.time = 'Please select a time';
			if (!state.durationMinutes || state.durationMinutes <= 0) errors.duration = 'Please select a duration';
			if (!state.bookingPrice || state.bookingPrice <= 0) errors.price = 'Please enter a valid price';
			setValidationErrors(errors);
		}
	}, [state, showValidation]);

	// Handlers
	const setTrainerId = useCallback((trainerId: string | null) => {
		setState(prev => {
			// Reset time when trainer changes
			return { ...prev, trainerId, bookingTime: null };
		});
		if (validationErrors.trainerId) {
			setValidationErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors.trainerId;
				return newErrors;
			});
		}
	}, [validationErrors.trainerId]);

	const setServiceId = useCallback((serviceId: string | null) => {
		setState(prev => {
			// Reset duration when service changes
			// If new service has duration options, don't reset to 0, let user choose
			return { ...prev, serviceId, durationMinutes: 0 };
		});
		if (validationErrors.serviceId) {
			setValidationErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors.serviceId;
				return newErrors;
			});
		}
	}, [validationErrors.serviceId]);

	const setBookingDate = useCallback((date: Date | null) => {
		// Convert Date to ISO string (YYYY-MM-DD) for storage
		const dateString = date ? moment(date).format('YYYY-MM-DD') : null;
		setState(prev => ({ ...prev, bookingDate: dateString, bookingTime: null }));
		if (validationErrors.date) {
			setValidationErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors.date;
				return newErrors;
			});
		}
	}, [validationErrors.date]);

	const setBookingTime = useCallback((time: string | null) => {
		setState(prev => ({ ...prev, bookingTime: time }));
		if (validationErrors.time) {
			setValidationErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors.time;
				return newErrors;
			});
		}
	}, [validationErrors.time]);

	const setDuration = useCallback((duration: number) => {
		setState(prev => ({ ...prev, durationMinutes: duration }));
		if (validationErrors.duration) {
			setValidationErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors.duration;
				return newErrors;
			});
		}
	}, [validationErrors.duration]);

	const setBookingType = useCallback((bookingType: BookingType | null) => {
		setState(prev => ({ ...prev, bookingType: bookingType || BookingType.PERSONAL_TRAINING }));
		if (validationErrors.bookingType) {
			setValidationErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors.bookingType;
				return newErrors;
			});
		}
	}, [validationErrors.bookingType]);

	const setBookingPrice = useCallback((price: number) => {
		setState(prev => ({ ...prev, bookingPrice: price }));
		if (validationErrors.price) {
			setValidationErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors.price;
				return newErrors;
			});
		}
	}, [validationErrors.price]);

	const setNotes = useCallback((notes: string) => {
		setState(prev => ({ ...prev, notes }));
	}, []);

	const clearValidationError = useCallback((field: keyof ValidationErrors) => {
		setValidationErrors(prev => {
			const newErrors = { ...prev };
			delete newErrors[field];
			return newErrors;
		});
	}, []);

	// Submit handler
	const submit = useCallback(async () => {
		// Check if user is logged in
		if (!user?._id) {
			sweetErrorAlert('Please login to book a session');
			router.push('/account/login');
			return;
		}

		// Validate form
		const errors: ValidationErrors = {};
		if (!state.trainerId) errors.trainerId = 'Please select a trainer';
		if (!state.bookingType) errors.bookingType = 'Please select a booking type';
		if (!state.bookingDate) errors.date = 'Please select a date';
		if (!state.bookingTime) errors.time = 'Please select a time';
		if (!state.durationMinutes || state.durationMinutes <= 0) errors.duration = 'Please select a duration';
		if (!state.bookingPrice || state.bookingPrice <= 0) errors.price = 'Please enter a valid price';

		setValidationErrors(errors);
		setShowValidation(true);

		// If there are errors, don't submit
		if (Object.keys(errors).length > 0) {
			return;
		}

		// Prepare booking input - service is now optional
		const bookingInput = prepareBookingInput(
			selectedService, // Optional - can be null
			state.trainerId,
			state.bookingDate,
			state.bookingTime,
			state.durationMinutes,
			state.bookingPrice || totalPrice, // Use manual price or calculated price
			user._id,
			state.notes,
			state.bookingType || undefined // Pass booking type directly
		);

		if (!bookingInput) {
			sweetErrorAlert('Invalid booking data. Please check your selections.');
			return;
		}

		try {
			await createBooking({
				variables: { input: bookingInput },
			});
		} catch (error: any) {
			// Error is already handled in onError callback, but log for debugging
			console.error('Booking submission error:', error);
			
			// Extract specific error messages from GraphQL errors
			if (error.graphQLErrors && error.graphQLErrors.length > 0) {
				const graphQLError = error.graphQLErrors[0];
				const errorMessage = graphQLError.message;
				
				// Map backend error messages to user-friendly messages
				if (errorMessage.includes('Trainer not found')) {
					sweetErrorAlert('Trainer not found or not available');
				} else if (errorMessage.includes('Service not found')) {
					sweetErrorAlert('Service not found or inactive');
				} else if (errorMessage.includes('duration') || errorMessage.includes('Duration')) {
					sweetErrorAlert(`Session duration ${state.durationMinutes} minutes is not available for this service`);
				} else if (errorMessage.includes('time format') || errorMessage.includes('HH:mm')) {
					sweetErrorAlert('Invalid booking time format. Expected HH:mm (24-hour format)');
				} else if (errorMessage.includes('2 hours') || errorMessage.includes('advance')) {
					sweetErrorAlert('Booking must be at least 2 hours in advance');
				} else if (errorMessage.includes('past')) {
					sweetErrorAlert('Booking date cannot be in the past');
				} else if (errorMessage.includes('already booked') || errorMessage.includes('conflict')) {
					sweetErrorAlert('Time slot already booked. Please select another time.');
				} else if (errorMessage.includes('bookingType')) {
					sweetErrorAlert('Service bookingType does not match selected booking type');
				} else {
					// Use the error message from backend
					sweetErrorAlert(errorMessage || 'Failed to create booking. Please try again.');
				}
			} else if (error.networkError) {
				sweetErrorAlert('Network error. Please check your connection and try again.');
			} else {
				sweetErrorAlert(error.message || 'Failed to create booking. Please try again.');
			}
		}
	}, [state, selectedService, totalPrice, user, createBooking, router]);

	return {
		// State
		state,
		validationErrors,
		
		// Data
		trainers,
		services,
		availableSlots,
		selectedTrainer,
		selectedService,
		totalPrice,
		
		// Loading states
		trainersLoading,
		servicesLoading,
		availabilityLoading,
		creatingBooking,
		
		// Errors
		trainersError,
		servicesError,
		availabilityError,
		
		// Validation
		isFormValid,
		
		// Handlers
		setTrainerId,
		setServiceId,
		setBookingDate,
		setBookingTime,
		setDuration,
		setBookingType,
		setBookingPrice,
		setNotes,
		submit,
		clearValidationError,
	};
};



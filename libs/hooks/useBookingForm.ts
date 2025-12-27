import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { useReactiveVar } from '@apollo/client';
import { GET_TRAINERS, GET_ALL_SERVICES, GET_BOOKINGS } from '../../apollo/user/query';
import { CREATE_BOOKING } from '../../apollo/user/mutation';
import { userVar } from '../../apollo/store';
import { Direction } from '../enums/common.enum';
import { ServiceStatus } from '../enums/booking.enum';
import { Service } from '../types/service/service';
import { BookingInput } from '../types/booking/booking.input';
import { ServicesInquiry } from '../types/service/service.input';
import { sweetErrorAlert, sweetMixinSuccessAlert } from '../sweetAlert';
import { useServicePricing } from './useServicePricing';
import { useTrainerAvailability } from './useTrainerAvailability';
import { validateBookingForm, isBookingFormValid, ValidationErrors } from '../utils/validation.utils';
import { prepareBookingInput } from '../utils/booking.utils';

export interface BookingFormState {
	trainerId: string | null;
	serviceId: string | null;
	bookingDate: Date | null;
	bookingTime: string | null;
	durationMinutes: number;
	locationType: string;
	notes: string;
}

export interface UseBookingFormReturn {
	// State
	state: BookingFormState;
	validationErrors: ValidationErrors;
	
	// Data
	trainers: any[];
	services: Service[];
	availableSlots: string[];
	selectedTrainer: any | null;
	selectedService: Service | null;
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
	setServiceId: (serviceId: string | null) => void;
	setBookingDate: (date: Date | null) => void;
	setBookingTime: (time: string | null) => void;
	setDuration: (duration: number) => void;
	setLocationType: (location: string) => void;
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
	
	// Form state
	const [state, setState] = useState<BookingFormState>({
		trainerId: null,
		serviceId: null,
		bookingDate: null,
		bookingTime: null,
		durationMinutes: 0,
		locationType: 'in-person',
		notes: '',
	});

	const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
	const [showValidation, setShowValidation] = useState(false);

	// Set initial trainer ID from URL param
	useEffect(() => {
		if (initialTrainerId) {
			const trainerId = typeof initialTrainerId === 'string' ? initialTrainerId : initialTrainerId[0];
			setState(prev => ({ ...prev, trainerId }));
		}
	}, [initialTrainerId]);

	// Fetch trainers
	const { data: trainersData, loading: trainersLoading, error: trainersError } = useQuery(GET_TRAINERS, {
		variables: {
			input: {
				page: 1,
				limit: 50,
				sort: 'trainerRating',
				direction: Direction.DESC,
				search: {},
			},
		},
		skip: false,
	});

	// Fetch services - only ACTIVE services
	const servicesQuery: ServicesInquiry = useMemo(() => ({
		page: 1,
		limit: 100,
		sort: 'createdAt',
		direction: Direction.DESC,
		status: ServiceStatus.ACTIVE,
	}), []);

	const { data: servicesData, loading: servicesLoading, error: servicesError } = useQuery(GET_ALL_SERVICES, {
		variables: {
			input: servicesQuery,
		},
		fetchPolicy: 'cache-and-network',
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
				router.push('/bookings');
			}
		},
		onError: (error) => {
			console.error('Error creating booking:', error);
			sweetErrorAlert(error.message || 'Failed to create booking. Please try again.');
		},
	});

	// Get trainers list
	const trainers = useMemo(() => {
		return trainersData?.getTrainers?.list || [];
	}, [trainersData]);

	// Get active services list
	const services = useMemo(() => {
		if (!servicesData?.getAllServices?.list) return [];
		return servicesData.getAllServices.list.filter(
			(service: Service) => service.status === ServiceStatus.ACTIVE
		);
	}, [servicesData]);

	// Get selected trainer
	const selectedTrainer = useMemo(() => {
		if (!state.trainerId || !trainers.length) return null;
		return trainers.find((t: any) => t._id === state.trainerId) || null;
	}, [state.trainerId, trainers]);

	// Get selected service
	const selectedService = useMemo(() => {
		if (!state.serviceId || !services.length) return null;
		const service = services.find((s: Service) => s._id === state.serviceId);
		
		// Reset duration if current duration is not in service's options
		if (service && service.durationOptions && !service.durationOptions.includes(state.durationMinutes)) {
			setState(prev => ({ ...prev, durationMinutes: 0 }));
		}
		
		return service || null;
	}, [state.serviceId, state.durationMinutes, services]);

	// Calculate total price
	const totalPrice = useServicePricing(selectedService, state.durationMinutes);

	// Reset time when trainer or date changes
	useEffect(() => {
		setState(prev => ({ ...prev, bookingTime: null }));
	}, [state.trainerId, state.bookingDate]);

	// Form validation
	const isFormValid = useMemo(() => {
		return isBookingFormValid(
			{
				trainerId: state.trainerId,
				serviceId: state.serviceId,
				bookingDate: state.bookingDate,
				bookingTime: state.bookingTime,
				durationMinutes: state.durationMinutes,
				locationType: state.locationType,
			},
			user?._id
		);
	}, [state, user?._id]);

	// Update validation errors when fields change
	useEffect(() => {
		if (showValidation) {
			const errors = validateBookingForm({
				trainerId: state.trainerId,
				serviceId: state.serviceId,
				bookingDate: state.bookingDate,
				bookingTime: state.bookingTime,
				durationMinutes: state.durationMinutes,
				locationType: state.locationType,
			});
			setValidationErrors(errors);
		}
	}, [state, showValidation]);

	// Handlers
	const setTrainerId = useCallback((trainerId: string | null) => {
		setState(prev => ({ ...prev, trainerId }));
		if (validationErrors.trainerId) {
			setValidationErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors.trainerId;
				return newErrors;
			});
		}
	}, [validationErrors.trainerId]);

	const setServiceId = useCallback((serviceId: string | null) => {
		setState(prev => ({ ...prev, serviceId, durationMinutes: 0 }));
		if (validationErrors.serviceId) {
			setValidationErrors(prev => {
				const newErrors = { ...prev };
				delete newErrors.serviceId;
				return newErrors;
			});
		}
	}, [validationErrors.serviceId]);

	const setBookingDate = useCallback((date: Date | null) => {
		setState(prev => ({ ...prev, bookingDate: date, bookingTime: null }));
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

	const setLocationType = useCallback((location: string) => {
		setState(prev => ({ ...prev, locationType: location }));
	}, []);

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
		const errors = validateBookingForm({
			trainerId: state.trainerId,
			serviceId: state.serviceId,
			bookingDate: state.bookingDate,
			bookingTime: state.bookingTime,
			durationMinutes: state.durationMinutes,
			locationType: state.locationType,
		});

		setValidationErrors(errors);
		setShowValidation(true);

		// If there are errors, don't submit
		if (Object.keys(errors).length > 0) {
			return;
		}

		// Prepare booking input
		const bookingInput = prepareBookingInput(
			selectedService,
			state.trainerId,
			state.bookingDate,
			state.bookingTime,
			state.durationMinutes,
			totalPrice,
			user._id,
			state.notes,
			state.locationType
		);

		if (!bookingInput) {
			sweetErrorAlert('Invalid booking data. Please check your selections.');
			return;
		}

		try {
			await createBooking({
				variables: { input: bookingInput },
			});
		} catch (error) {
			// Error is already handled in onError callback
			console.error('Booking submission error:', error);
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
		setLocationType,
		setNotes,
		submit,
		clearValidationError,
	};
};


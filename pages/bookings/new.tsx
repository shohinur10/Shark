import { NextPage } from 'next';
import { useRouter } from 'next/router';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TRAINERS, GET_ALL_SERVICES, GET_TRAINER_AVAILABILITY, GET_BOOKINGS } from '../../apollo/user/query';
import { CREATE_BOOKING } from '../../apollo/user/mutation';
import { BookingInput } from '../../libs/types/booking/booking.input';
import { BookingType, ServiceStatus } from '../../libs/enums/booking.enum';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Direction } from '../../libs/enums/common.enum';
import { sweetErrorAlert, sweetMixinSuccessAlert } from '../../libs/sweetAlert';
import moment from 'moment';
import BookingPage from '../../libs/components/booking/BookingPage';
import { Service } from '../../libs/types/service/service';
import { ServicesInquiry } from '../../libs/types/service/service.input';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const NewBookingPage: NextPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { trainerId: trainerIdParam } = router.query;
	
	const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
	const [selectedTrainer, setSelectedTrainer] = useState<any | null>(null);
	const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
	const [selectedService, setSelectedService] = useState<Service | null>(null);
	const [bookingDate, setBookingDate] = useState<Date | null>(null);
	const [bookingTime, setBookingTime] = useState<string | null>(null);
	const [durationMinutes, setDurationMinutes] = useState<number>(0);
	const [locationType, setLocationType] = useState<string>('');
	const [notes, setNotes] = useState<string>('');
	const [validationErrors, setValidationErrors] = useState<{
		trainerId?: string;
		serviceId?: string;
		date?: string;
		time?: string;
		duration?: string;
	}>({});
	const [showValidation, setShowValidation] = useState(false);

	// Get minimum date (today)
	const minDate = useMemo(() => {
		return moment().format('YYYY-MM-DD');
	}, []);

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

	// Format date for availability query (YYYY-MM-DD)
	const availabilityDate = useMemo(() => {
		if (!bookingDate) return null;
		return moment(bookingDate).format('YYYY-MM-DD');
	}, [bookingDate]);

	// Fetch trainer availability when trainerId and date are selected
	const { data: availabilityData, loading: availabilityLoading, error: availabilityError } = useQuery(
		GET_TRAINER_AVAILABILITY,
		{
			variables: {
				trainerId: selectedTrainerId || '',
				date: availabilityDate || '',
			},
			skip: !selectedTrainerId || !availabilityDate,
		}
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
				await sweetMixinSuccessAlert('Booking created');
				router.push('/bookings');
			}
		},
		onError: (error) => {
			console.error('Error creating booking:', error);
			sweetErrorAlert(error.message || 'Failed to create booking. Please try again.');
		},
	});

	// Set trainer ID from URL param if available
	useEffect(() => {
		if (trainerIdParam && typeof trainerIdParam === 'string') {
			setSelectedTrainerId(trainerIdParam);
		}
	}, [trainerIdParam]);

	// Update selectedTrainer when selectedTrainerId or trainersData changes
	useEffect(() => {
		if (trainersData?.getTrainers?.list && selectedTrainerId) {
			const trainer = trainersData.getTrainers.list.find((t: any) => t._id === selectedTrainerId);
			setSelectedTrainer(trainer || null);
		} else {
			setSelectedTrainer(null);
		}
	}, [trainersData, selectedTrainerId]);

	// Get active services list
	const activeServices = useMemo(() => {
		if (!servicesData?.getAllServices?.list) return [];
		// Filter for active services (client-side filter as backup)
		return servicesData.getAllServices.list.filter(
			(service: Service) => service.status === ServiceStatus.ACTIVE
		);
	}, [servicesData]);

	// Update selectedService when selectedServiceId or servicesData changes
	useEffect(() => {
		if (activeServices && selectedServiceId) {
			const service = activeServices.find((s: Service) => s._id === selectedServiceId);
			setSelectedService(service || null);
			// Reset duration when service changes if current duration is not in new service's options
			if (service && service.durationOptions && !service.durationOptions.includes(durationMinutes)) {
				setDurationMinutes(0);
			}
		} else {
			setSelectedService(null);
		}
	}, [activeServices, selectedServiceId, durationMinutes]);

	// Reset time when trainer or date changes
	useEffect(() => {
		setBookingTime(null);
	}, [selectedTrainerId, bookingDate]);

	// Handle trainer selection
	const handleTrainerChange = (trainerId: string) => {
		setSelectedTrainerId(trainerId || null);
		if (trainerId && trainersData?.getTrainers?.list) {
			const trainer = trainersData.getTrainers.list.find((t: any) => t._id === trainerId);
			setSelectedTrainer(trainer || null);
		} else {
			setSelectedTrainer(null);
		}
		// Clear validation error when field is updated
		if (validationErrors.trainerId) {
			setValidationErrors({ ...validationErrors, trainerId: undefined });
		}
	};

	// Validate required fields
	const isFormValid = useMemo(() => {
		return !!(
			user?._id &&
			selectedTrainerId &&
			selectedServiceId &&
			bookingDate &&
			bookingTime &&
			durationMinutes > 0
		);
	}, [user?._id, selectedTrainerId, selectedServiceId, bookingDate, bookingTime, durationMinutes]);

	// Validate form and return errors
	const validateForm = () => {
		const errors: typeof validationErrors = {};
		
		if (!selectedTrainerId) {
			errors.trainerId = 'Please select a trainer';
		}
		if (!selectedServiceId) {
			errors.serviceId = 'Please select a service';
		}
		if (!bookingDate) {
			errors.date = 'Please select a date';
		}
		if (!bookingTime) {
			errors.time = 'Please select a time';
		}
		if (!durationMinutes || durationMinutes === 0) {
			errors.duration = 'Please select a duration';
		}
		
		return errors;
	};

	const handleSubmit = async () => {
		// Check if user is logged in
		if (!user?._id) {
			sweetErrorAlert('Please login to book a session');
			router.push('/account/login');
			return;
		}

		// Validate form
		const errors = validateForm();
		setValidationErrors(errors);
		setShowValidation(true);

		// If there are errors, don't submit
		if (Object.keys(errors).length > 0) {
			return;
		}

		// Format bookingDate as YYYY-MM-DD string for GraphQL
		// GraphQL Date scalar will serialize this properly
		const formattedDate = moment(bookingDate).format('YYYY-MM-DD');
		
		// bookingTime is already in HH:mm format from the time input

		// Prepare booking input
		// Note: GraphQL Date scalar accepts ISO strings, but we format as YYYY-MM-DD as requested
		// Use bookingType directly from service (already enum type)
		const bookingInput: BookingInput = {
			bookingType: selectedService?.bookingType || BookingType.PERSONAL_TRAINING,
			providerId: selectedTrainerId!, // trainerId
			bookingDate: formattedDate as any, // Format as YYYY-MM-DD string for backend
			bookingTime: bookingTime!, // Already in HH:mm format
			sessionDuration: durationMinutes, // durationMinutes
			bookingPrice: totalPrice,
			bookingNotes: notes || undefined, // notes (optional)
			meetingLink: locationType === 'online' ? '' : undefined,
			clientId: user._id, // memberId from authenticated user context
		};

		try {
			await createBooking({
				variables: { input: bookingInput },
			});
		} catch (error) {
			// Error is already handled in onError callback
			console.error('Booking error:', error);
		}
	};

	// Calculate total price based on service and duration
	// Formula: total = service.pricePerHour * (durationMinutes / 60)
	// If service has fixedPrice, use fixedPrice instead
	const calculateTotalPrice = (service: Service | null, durationMinutes: number): number => {
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

	// Get total price for current booking
	const totalPrice = useMemo(() => {
		return calculateTotalPrice(selectedService, durationMinutes);
	}, [selectedService, durationMinutes]);

	// Handle service selection
	const handleServiceChange = (serviceId: string) => {
		setSelectedServiceId(serviceId || null);
		setDurationMinutes(0); // Reset duration when service changes
		// Clear validation error when field is updated
		if (validationErrors.serviceId) {
			setValidationErrors({ ...validationErrors, serviceId: undefined });
		}
	};

	// Clear validation errors when fields change
	useEffect(() => {
		if (showValidation) {
			const errors: typeof validationErrors = {};
			if (!selectedTrainerId) errors.trainerId = 'Please select a trainer';
			if (!selectedServiceId) errors.serviceId = 'Please select a service';
			if (!bookingDate) errors.date = 'Please select a date';
			if (!bookingTime) errors.time = 'Please select a time';
			if (!durationMinutes || durationMinutes === 0) errors.duration = 'Please select a duration';
			setValidationErrors(errors);
		}
	}, [selectedTrainerId, selectedServiceId, bookingDate, bookingTime, durationMinutes, showValidation]);

	return (
		<BookingPage
			selectedTrainerId={selectedTrainerId}
			selectedTrainer={selectedTrainer}
			selectedServiceId={selectedServiceId}
			selectedService={selectedService}
			bookingDate={bookingDate}
			bookingTime={bookingTime}
			durationMinutes={durationMinutes}
			locationType={locationType}
			notes={notes}
			trainerIdParam={trainerIdParam}
			trainersLoading={trainersLoading}
			trainersError={trainersError}
			trainersData={trainersData}
			servicesData={activeServices}
			servicesLoading={servicesLoading}
			servicesError={servicesError}
			availableSlots={availabilityData?.getTrainerAvailability?.availableSlots || []}
			availabilityLoading={availabilityLoading}
			availabilityError={availabilityError}
			validationErrors={validationErrors}
			minDate={minDate}
			totalPrice={totalPrice}
			user={user}
			creatingBooking={creatingBooking}
			isFormValid={isFormValid}
			onTrainerChange={handleTrainerChange}
			onServiceChange={handleServiceChange}
			onBookingDateChange={(date) => {
				setBookingDate(date);
				if (validationErrors.date) {
					setValidationErrors({ ...validationErrors, date: undefined });
				}
			}}
			onBookingTimeChange={(time) => {
				setBookingTime(time);
				if (validationErrors.time) {
					setValidationErrors({ ...validationErrors, time: undefined });
				}
			}}
			onDurationChange={(duration) => {
				setDurationMinutes(duration);
				if (validationErrors.duration) {
					setValidationErrors({ ...validationErrors, duration: undefined });
				}
			}}
			onLocationChange={setLocationType}
			onNotesChange={setNotes}
			onSubmit={handleSubmit}
		/>
	);
};

export default withLayoutBasic(NewBookingPage);






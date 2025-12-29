import React, { useState, useMemo, useEffect } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Stack,
	Box,
	Typography,
	IconButton,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	CircularProgress,
	Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_BOOKING } from '../../../apollo/user/mutation';
import { GET_ALL_SERVICES, GET_TRAINER_AVAILABILITY } from '../../../apollo/user/query';
import { BookingType, ServiceStatus } from '../../../libs/enums/booking.enum';
import { Direction } from '../../../libs/enums/common.enum';
import { sweetTopSmallSuccessAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Service } from '../../../libs/types/service/service';
import { ServicesInquiry } from '../../../libs/types/service/service.input';
import { useServicePricing } from '../../../libs/hooks/useServicePricing';
import { prepareBookingInput } from '../../../libs/utils/booking.utils';
import moment from 'moment';

interface BookingModalProps {
	open: boolean;
	onClose: () => void;
	trainerId: string;
	trainerName: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ open, onClose, trainerId, trainerName }) => {
	const user = useReactiveVar(userVar);
	const [createBooking, { loading: creatingBooking }] = useMutation(CREATE_BOOKING);
	const [formData, setFormData] = useState({
		serviceId: '',
		bookingDate: '',
		bookingTime: '',
		sessionDuration: 0,
		bookingNotes: '',
	});

	// Fetch services for this trainer
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
		variables: { input: servicesQuery },
		fetchPolicy: 'cache-and-network',
		skip: !open || !trainerId || typeof window === 'undefined', // Skip during SSR to avoid hydration errors
		onError: (error) => {
			// Improved error logging with proper serialization
			const errorDetails = {
				message: error.message,
				graphQLErrors: error.graphQLErrors?.map((err: any) => ({
					message: err.message,
					locations: err.locations,
					path: err.path,
					extensions: err.extensions,
				})),
				networkError: error.networkError ? {
					name: error.networkError.name,
					message: error.networkError.message,
					statusCode: (error.networkError as any)?.statusCode,
					result: (error.networkError as any)?.result,
				} : null,
			};
			console.error('❌ GET_ALL_SERVICES query error (BookingModal):', JSON.stringify(errorDetails, null, 2));
			console.error('Full error object:', error);
		},
	});

	// Get available services
	const services = useMemo(() => {
		if (!servicesData?.getAllServices?.list) return [];
		return servicesData.getAllServices.list.filter(
			(service: Service) => service.status === ServiceStatus.ACTIVE
		);
	}, [servicesData]);

	// Get selected service
	const selectedService = useMemo(() => {
		if (!formData.serviceId || !services.length) return null;
		return services.find((s: Service) => s._id === formData.serviceId) || null;
	}, [formData.serviceId, services]);

	// Fetch trainer availability when date is selected
	const { data: availabilityData, loading: availabilityLoading } = useQuery(GET_TRAINER_AVAILABILITY, {
		variables: {
			trainerId: trainerId,
			date: formData.bookingDate,
		},
		skip: !formData.bookingDate || !trainerId,
		fetchPolicy: 'network-only',
	});

	const availableSlots = availabilityData?.getTrainerAvailability?.availableSlots || [];

	// Calculate price using real service data
	const totalPrice = useServicePricing(selectedService, formData.sessionDuration);

	// Update duration options when service changes
	useEffect(() => {
		if (selectedService && selectedService.durationOptions && selectedService.durationOptions.length > 0) {
			// Set first duration option as default if current duration is not in options
			if (!selectedService.durationOptions.includes(formData.sessionDuration)) {
				setFormData(prev => ({ ...prev, sessionDuration: selectedService.durationOptions[0] }));
			}
		}
	}, [selectedService, formData.sessionDuration]);

	const handleSubmit = async () => {
		try {
			if (!user._id) {
				sweetErrorHandling({ message: 'Please login to book a session' });
				return;
			}

			if (!selectedService) {
				sweetErrorHandling({ message: 'Please select a service' });
				return;
			}

			if (!formData.bookingDate || !formData.bookingTime) {
				sweetErrorHandling({ message: 'Please select date and time' });
				return;
			}

			if (!formData.sessionDuration || formData.sessionDuration === 0) {
				sweetErrorHandling({ message: 'Please select session duration' });
				return;
			}

			// Prepare booking input using real service data
			const bookingInput = prepareBookingInput(
				selectedService,
				trainerId,
				formData.bookingDate,
				formData.bookingTime,
				formData.sessionDuration,
				totalPrice,
				user._id,
				formData.bookingNotes,
				selectedService.bookingType
			);

			if (!bookingInput) {
				sweetErrorHandling({ message: 'Invalid booking data. Please check your selections.' });
				return;
			}

			await createBooking({
				variables: { input: bookingInput },
			});

			await sweetTopSmallSuccessAlert('Booking created successfully!', 2000);
			onClose();
			setFormData({
				serviceId: '',
				bookingDate: '',
				bookingTime: '',
				sessionDuration: 0,
				bookingNotes: '',
			});
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const handleClose = () => {
		onClose();
		setFormData({
			serviceId: '',
			bookingDate: '',
			bookingTime: '',
			sessionDuration: 0,
			bookingNotes: '',
		});
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Typography variant="h6" sx={{ fontWeight: 600 }}>
						Book a Session with {trainerName}
					</Typography>
					<IconButton onClick={handleClose} size="small">
						<CloseIcon />
					</IconButton>
				</Stack>
			</DialogTitle>
			<DialogContent>
				<Stack spacing={3} sx={{ mt: 1 }}>
					{/* Service Selection */}
					<FormControl fullWidth>
						<InputLabel>Select Service</InputLabel>
						<Select
							value={formData.serviceId}
							label="Select Service"
							onChange={(e) => setFormData({ ...formData, serviceId: e.target.value, sessionDuration: 0 })}
							disabled={servicesLoading}
						>
							{servicesLoading ? (
								<MenuItem disabled>
									<CircularProgress size={20} sx={{ mr: 2 }} />
									Loading services...
								</MenuItem>
							) : servicesError ? (
								<MenuItem disabled>Error loading services</MenuItem>
							) : services.length > 0 ? (
								services.map((service: Service) => (
									<MenuItem key={service._id} value={service._id}>
										<Box>
											<Typography variant="body1" sx={{ fontWeight: 500 }}>
												{service.title}
											</Typography>
											{service.description && (
												<Typography variant="caption" sx={{ color: '#616161' }}>
													{service.description.substring(0, 50)}...
												</Typography>
											)}
										</Box>
									</MenuItem>
								))
							) : (
								<MenuItem disabled>No services available</MenuItem>
							)}
						</Select>
					</FormControl>

					{selectedService && (
						<Alert severity="info" sx={{ mb: 1 }}>
							<Typography variant="body2">
								<strong>{selectedService.title}</strong>
								{selectedService.description && ` - ${selectedService.description}`}
							</Typography>
							{selectedService.fixedPrice ? (
								<Typography variant="body2" sx={{ mt: 0.5 }}>
									Price: ${selectedService.fixedPrice.toFixed(2)}
								</Typography>
							) : selectedService.pricePerHour ? (
								<Typography variant="body2" sx={{ mt: 0.5 }}>
									Price: ${selectedService.pricePerHour.toFixed(2)}/hour
								</Typography>
							) : null}
						</Alert>
					)}

					{/* Date Picker */}
					<TextField
						label="Date"
						type="date"
						value={formData.bookingDate}
						onChange={(e) => {
							setFormData({ ...formData, bookingDate: e.target.value, bookingTime: '' });
						}}
						InputLabelProps={{ shrink: true }}
						fullWidth
						inputProps={{ min: new Date().toISOString().split('T')[0] }}
						disabled={!selectedService}
					/>

					{/* Time Select - from real availability */}
					<FormControl fullWidth>
						<InputLabel>Time</InputLabel>
						<Select
							value={formData.bookingTime}
							label="Time"
							onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
							disabled={!formData.bookingDate || availabilityLoading}
						>
							{!formData.bookingDate ? (
								<MenuItem disabled>Select date first</MenuItem>
							) : availabilityLoading ? (
								<MenuItem disabled>
									<CircularProgress size={20} sx={{ mr: 2 }} />
									Loading available times...
								</MenuItem>
							) : availableSlots.length > 0 ? (
								availableSlots.map((slot: string) => (
									<MenuItem key={slot} value={slot}>
										{moment(slot, 'HH:mm').format('h:mm A')}
									</MenuItem>
								))
							) : (
								<MenuItem disabled>No available times for this date</MenuItem>
							)}
						</Select>
					</FormControl>

					{/* Duration - from real service data */}
					<FormControl fullWidth>
						<InputLabel>Duration</InputLabel>
						<Select
							value={formData.sessionDuration}
							label="Duration"
							onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value as number })}
							disabled={!selectedService || !selectedService.durationOptions?.length}
						>
							{!selectedService ? (
								<MenuItem disabled>Select a service first</MenuItem>
							) : selectedService.durationOptions && selectedService.durationOptions.length > 0 ? (
								selectedService.durationOptions.map((minutes: number) => (
									<MenuItem key={minutes} value={minutes}>
										{minutes === 30 ? '30 minutes' :
										 minutes === 45 ? '45 minutes' :
										 minutes === 60 ? '1 hour' :
										 minutes === 90 ? '1.5 hours' :
										 minutes === 120 ? '2 hours' :
										 `${minutes} minutes`}
									</MenuItem>
								))
							) : (
								<MenuItem disabled>No duration options available</MenuItem>
							)}
						</Select>
					</FormControl>

					{/* Price Display */}
					{selectedService && formData.sessionDuration > 0 && totalPrice > 0 && (
						<Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
							<Typography variant="body2" sx={{ color: '#616161', mb: 0.5 }}>
								Total Price
							</Typography>
							<Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
								${totalPrice.toFixed(2)}
							</Typography>
						</Box>
					)}

					{/* Notes */}
					<TextField
						label="Notes (optional)"
						multiline
						rows={4}
						value={formData.bookingNotes}
						onChange={(e) => setFormData({ ...formData, bookingNotes: e.target.value })}
						placeholder="Any special requests or information..."
						fullWidth
					/>
				</Stack>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 3 }}>
				<Button onClick={handleClose} sx={{ color: '#616161' }}>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit}
					disabled={creatingBooking || !selectedService || !formData.bookingDate || !formData.bookingTime || !formData.sessionDuration}
					sx={{
						backgroundColor: '#212121',
						color: '#FFFFFF',
						fontWeight: 600,
						textTransform: 'none',
						px: 3,
						'&:hover': {
							backgroundColor: '#424242',
						},
					}}
				>
					{creatingBooking ? (
						<>
							<CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />
							Booking...
						</>
					) : (
						'Book Session'
					)}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default BookingModal;


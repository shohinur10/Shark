import { NextPage } from 'next';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
	Box,
	Container,
	Typography,
	Button,
	Stepper,
	Step,
	StepLabel,
	Card,
	CardContent,
	Grid,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	FormHelperText,
	CircularProgress,
	Avatar,
	Stack,
	Divider,
	Chip,
	Alert,
	Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useBookingForm } from '../../libs/hooks/useBookingForm';
import { formatDateForDisplay, formatTimeForDisplay, formatDurationForDisplay } from '../../libs/utils/booking.utils';
import { BookingType } from '../../libs/enums/booking.enum';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DatePicker = dynamic(
	() => import('@mui/x-date-pickers/DatePicker').then((mod) => mod.DatePicker),
	{ ssr: false }
);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const steps = ['Select Trainer', 'Choose Service', 'Pick Date & Time', 'Review & Confirm'];

const NewBookingPage: NextPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { trainerId: trainerIdParam } = router.query;
	const [activeStep, setActiveStep] = useState(0);

	const bookingForm = useBookingForm(trainerIdParam);

	// Debug: Log trainer data status
	useMemo(() => {
		console.log('🔍 Booking Page - Trainer Data Status:', {
			loading: bookingForm.trainersLoading,
			error: bookingForm.trainersError ? {
				message: bookingForm.trainersError.message,
				hasGraphQLErrors: !!bookingForm.trainersError.graphQLErrors,
				hasNetworkError: !!bookingForm.trainersError.networkError,
			} : null,
			trainersCount: bookingForm.trainers.length,
			selectedTrainerId: bookingForm.state.trainerId,
			trainerIdParam: trainerIdParam,
		});
	}, [bookingForm.trainersLoading, bookingForm.trainersError, bookingForm.trainers.length, bookingForm.state.trainerId, trainerIdParam]);
	
	// Debug: Log services data status
	useMemo(() => {
		console.log('🔍 Booking Page - Services Data Status:', {
			loading: bookingForm.servicesLoading,
			error: bookingForm.servicesError ? {
				message: bookingForm.servicesError.message,
				hasGraphQLErrors: !!bookingForm.servicesError.graphQLErrors,
				hasNetworkError: !!bookingForm.servicesError.networkError,
			} : null,
			servicesCount: bookingForm.services.length,
			selectedServiceId: bookingForm.state.serviceId,
		});
	}, [bookingForm.servicesLoading, bookingForm.servicesError, bookingForm.services.length, bookingForm.state.serviceId]);
	const minDate = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return today;
	}, []);

	const handleNext = () => {
		if (activeStep === 0 && !bookingForm.state.trainerId) {
			return;
		}
		if (activeStep === 1 && !bookingForm.state.serviceId) {
			return;
		}
		if (activeStep === 2 && (!bookingForm.state.bookingDate || !bookingForm.state.bookingTime || !bookingForm.state.durationMinutes)) {
			return;
		}
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleSubmit = async () => {
		await bookingForm.submit();
	};

	const getBookingTypeLabel = (type: BookingType): string => {
		switch (type) {
			case BookingType.PERSONAL_TRAINING:
				return 'Personal Training';
			case BookingType.ONLINE_SESSION:
				return 'Online Session';
			case BookingType.GROUP_CLASS:
				return 'Group Class';
			case BookingType.CONSULTATION:
				return 'Consultation';
			case BookingType.GYM_ACCESS:
				return 'Gym Access';
			case BookingType.FACILITY_RENTAL:
				return 'Facility Rental';
			default:
				return type;
		}
	};

	return (
		<Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', py: 4 }}>
			<Container maxWidth="lg">
				{/* Header */}
				<Box sx={{ mb: 4 }}>
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => router.back()}
						sx={{ mb: 2, color: '#616161' }}
					>
						Back
					</Button>
					<Typography variant="h3" sx={{ fontWeight: 700, color: '#212121', mb: 1 }}>
						Book Your Training Session
					</Typography>
					<Typography variant="body1" sx={{ color: '#616161' }}>
						Follow the steps below to schedule your session
					</Typography>
				</Box>

				{/* Stepper */}
				<Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, backgroundColor: '#fff' }}>
					<Stepper activeStep={activeStep} alternativeLabel>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>
				</Paper>

				<Grid container spacing={4}>
					{/* Main Form Section */}
					<Grid item xs={12} md={8}>
						<Card elevation={0} sx={{ borderRadius: 2 }}>
							<CardContent sx={{ p: 4 }}>
								{/* Step 1: Select Trainer */}
								{activeStep === 0 && (
									<Box>
										<Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#212121' }}>
											Select Your Trainer
										</Typography>
										
										{bookingForm.validationErrors.trainerId && (
											<Alert severity="error" sx={{ mb: 2 }}>
												{bookingForm.validationErrors.trainerId}
											</Alert>
										)}

										{bookingForm.trainersLoading ? (
											<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
												<CircularProgress />
												<Typography variant="body1" sx={{ ml: 2, color: '#616161' }}>
													Loading trainers...
												</Typography>
											</Box>
										) : bookingForm.trainersError ? (
											<Alert severity="error" sx={{ mb: 2 }}>
												<Box>
													<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
														Error loading trainers
													</Typography>
													<Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
														{bookingForm.trainersError.message || 'Unknown error occurred'}
													</Typography>
													{bookingForm.trainersError.graphQLErrors && bookingForm.trainersError.graphQLErrors.length > 0 && (
														<Typography variant="caption" sx={{ display: 'block', color: '#d32f2f' }}>
															{bookingForm.trainersError.graphQLErrors.map((err: any, idx: number) => (
																<span key={idx}>{err.message}</span>
															))}
														</Typography>
													)}
													{bookingForm.trainersError.networkError && (
														<Typography variant="caption" sx={{ display: 'block', color: '#d32f2f' }}>
															Network error: {bookingForm.trainersError.networkError.message}
														</Typography>
													)}
												</Box>
											</Alert>
										) : bookingForm.trainers.length > 0 ? (
											<Grid container spacing={2}>
												{bookingForm.trainers.map((trainer: any) => {
													const isSelected = bookingForm.state.trainerId === trainer._id;
													return (
														<Grid item xs={12} sm={6} md={4} key={trainer._id}>
															<Card
																elevation={isSelected ? 4 : 1}
																onClick={() => {
																	if (!trainerIdParam && !bookingForm.trainersLoading) {
																		bookingForm.setTrainerId(isSelected ? null : trainer._id);
																	}
																}}
																sx={{
																	cursor: trainerIdParam || bookingForm.trainersLoading ? 'default' : 'pointer',
																	transition: 'all 0.3s ease',
																	border: isSelected ? '2px solid #1976d2' : '2px solid transparent',
																	backgroundColor: isSelected ? '#e3f2fd' : '#fff',
																	'&:hover': {
																		transform: trainerIdParam || bookingForm.trainersLoading ? 'none' : 'translateY(-4px)',
																		boxShadow: trainerIdParam || bookingForm.trainersLoading ? 1 : 4,
																		borderColor: trainerIdParam || bookingForm.trainersLoading ? 'transparent' : '#1976d2',
																	},
																	opacity: trainerIdParam && trainer._id !== trainerIdParam ? 0.5 : 1,
																	position: 'relative',
																}}
															>
																<CardContent sx={{ p: 2.5 }}>
																	<Stack direction="row" spacing={2} alignItems="flex-start">
																		<Avatar
																			src={trainer.memberImage ? `${process.env.NEXT_PUBLIC_API_URL || ''}${trainer.memberImage}` : undefined}
																			sx={{ width: 56, height: 56 }}
																		>
																			<PersonIcon />
																		</Avatar>
																		<Box sx={{ flex: 1, minWidth: 0 }}>
																			<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
																				<Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
																					{trainer.memberFullName || trainer.memberNick}
																				</Typography>
																				{isSelected && (
																					<CheckCircleIcon sx={{ color: '#1976d2', fontSize: 20 }} />
																				)}
																			</Stack>
																			{trainer.trainerRating && (
																				<Chip
																					icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
																					label={`${trainer.trainerRating.toFixed(1)} Rating`}
																					size="small"
																					sx={{ 
																						height: 20, 
																						fontSize: '0.7rem',
																						mb: 0.5,
																						backgroundColor: isSelected ? '#fff' : '#f5f5f5',
																					}}
																				/>
																			)}
																			{trainer.trainerExperience && (
																				<Typography variant="caption" sx={{ color: '#616161', display: 'block', mb: 0.5 }}>
																					{trainer.trainerExperience} years experience
																				</Typography>
																			)}
																			{trainer.trainerSpecialties && trainer.trainerSpecialties.length > 0 && (
																				<Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
																					{trainer.trainerSpecialties.slice(0, 2).map((specialty: string, idx: number) => (
																						<Chip
																							key={idx}
																							label={specialty}
																							size="small"
																							variant="outlined"
																							sx={{ 
																								height: 20, 
																								fontSize: '0.65rem',
																								borderColor: '#e0e0e0',
																							}}
																						/>
																					))}
																					{trainer.trainerSpecialties.length > 2 && (
																						<Chip
																							label={`+${trainer.trainerSpecialties.length - 2}`}
																							size="small"
																							variant="outlined"
																							sx={{ 
																								height: 20, 
																								fontSize: '0.65rem',
																								borderColor: '#e0e0e0',
																							}}
																						/>
																					)}
																				</Box>
																			)}
																		</Box>
																	</Stack>
																</CardContent>
															</Card>
														</Grid>
													);
												})}
											</Grid>
										) : (
											<Alert severity="info" sx={{ mb: 2 }}>
												<Box>
													<Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
														No trainers available
													</Typography>
													<Typography variant="caption" sx={{ display: 'block' }}>
														{bookingForm.trainersLoading 
															? 'Loading...' 
															: bookingForm.trainersError 
																? 'Error occurred while loading trainers'
																: 'No trainers found. Please check back later or contact support.'}
													</Typography>
													{process.env.NODE_ENV === 'development' && (
														<Typography variant="caption" sx={{ display: 'block', mt: 1, fontFamily: 'monospace', fontSize: '0.7rem' }}>
															Debug: Loading={String(bookingForm.trainersLoading)}, 
															Error={bookingForm.trainersError ? 'Yes' : 'No'}, 
															Count={bookingForm.trainers.length}
														</Typography>
													)}
												</Box>
											</Alert>
										)}

										{bookingForm.selectedTrainer && (
											<Paper
												elevation={0}
												sx={{
													mt: 3,
													p: 3,
													backgroundColor: '#f5f5f5',
													borderRadius: 2,
													border: '1px solid #e0e0e0',
												}}
											>
												<Stack direction="row" spacing={2}>
													<Avatar
														src={bookingForm.selectedTrainer.memberImage ? `${process.env.NEXT_PUBLIC_API_URL || ''}${bookingForm.selectedTrainer.memberImage}` : undefined}
														sx={{ width: 60, height: 60 }}
													>
														<PersonIcon />
													</Avatar>
													<Box sx={{ flex: 1 }}>
														<Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
															{bookingForm.selectedTrainer.memberFullName || bookingForm.selectedTrainer.memberNick}
														</Typography>
														{bookingForm.selectedTrainer.trainerRating && (
															<Chip
																icon={<CheckCircleIcon />}
																label={`Rating: ${bookingForm.selectedTrainer.trainerRating.toFixed(1)}`}
																size="small"
																sx={{ mr: 1, mb: 1 }}
															/>
														)}
														{bookingForm.selectedTrainer.trainerExperience && (
															<Chip
																label={`${bookingForm.selectedTrainer.trainerExperience} years experience`}
																size="small"
																sx={{ mr: 1, mb: 1 }}
															/>
														)}
														{bookingForm.selectedTrainer.trainerSpecialties && bookingForm.selectedTrainer.trainerSpecialties.length > 0 && (
															<Box sx={{ mt: 1 }}>
																{bookingForm.selectedTrainer.trainerSpecialties.slice(0, 3).map((specialty: string, idx: number) => (
																	<Chip
																		key={idx}
																		label={specialty}
																		size="small"
																		variant="outlined"
																		sx={{ mr: 0.5, mb: 0.5 }}
																	/>
																))}
															</Box>
														)}
													</Box>
												</Stack>
											</Paper>
										)}
									</Box>
								)}

								{/* Step 2: Choose Service */}
								{activeStep === 1 && (
									<Box>
										<Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#212121' }}>
											Choose Your Service
										</Typography>
										
										{/* Debug info in development */}
										{process.env.NODE_ENV === 'development' && (
											<Alert severity="info" sx={{ mb: 2 }}>
												<Box>
													<Typography variant="caption" sx={{ display: 'block', fontFamily: 'monospace', fontSize: '0.7rem' }}>
														Services Debug: Loading={String(bookingForm.servicesLoading)}, 
														Error={bookingForm.servicesError ? 'Yes' : 'No'}, 
														Count={bookingForm.services.length}
													</Typography>
													{bookingForm.servicesError && (
														<Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#d32f2f', fontFamily: 'monospace', fontSize: '0.7rem' }}>
															Error: {bookingForm.servicesError.message || 'Unknown error'}
														</Typography>
													)}
												</Box>
											</Alert>
										)}
										
										{bookingForm.servicesError && (
											<Alert severity="error" sx={{ mb: 2 }}>
												<Box>
													<Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
														Error loading services
													</Typography>
													<Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
														{bookingForm.servicesError.message || 'Unknown error occurred'}
													</Typography>
													{bookingForm.servicesError.graphQLErrors && bookingForm.servicesError.graphQLErrors.length > 0 && (
														<Typography variant="caption" sx={{ display: 'block', color: '#d32f2f' }}>
															{bookingForm.servicesError.graphQLErrors.map((err: any, idx: number) => (
																<span key={idx}>{err.message}</span>
															))}
														</Typography>
													)}
													{bookingForm.servicesError.networkError && (
														<Typography variant="caption" sx={{ display: 'block', color: '#d32f2f' }}>
															Network error: {bookingForm.servicesError.networkError.message}
														</Typography>
													)}
												</Box>
											</Alert>
										)}
										
										<FormControl fullWidth error={!!bookingForm.validationErrors.serviceId} sx={{ mb: 3 }}>
											<InputLabel>Select Service</InputLabel>
											<Select
												value={bookingForm.state.serviceId || ''}
												onChange={(e) => bookingForm.setServiceId(e.target.value || null)}
												label="Select Service"
												disabled={bookingForm.servicesLoading}
											>
												{bookingForm.servicesLoading ? (
													<MenuItem disabled>
														<CircularProgress size={20} sx={{ mr: 2 }} />
														Loading services...
													</MenuItem>
												) : bookingForm.servicesError ? (
													<MenuItem disabled>Error loading services</MenuItem>
												) : bookingForm.services.length > 0 ? (
													bookingForm.services.map((service: any) => (
														<MenuItem key={service._id} value={service._id}>
															<Box>
																<Typography variant="body1" sx={{ fontWeight: 500 }}>
																	{service.title}
																</Typography>
																{service.description && (
																	<Typography variant="caption" sx={{ color: '#616161' }}>
																		{service.description.substring(0, 60)}...
																	</Typography>
																)}
															</Box>
														</MenuItem>
													))
												) : (
													<MenuItem disabled>No services available</MenuItem>
												)}
											</Select>
											{bookingForm.validationErrors.serviceId && (
												<FormHelperText>{bookingForm.validationErrors.serviceId}</FormHelperText>
											)}
										</FormControl>

										{bookingForm.selectedService && (
											<Paper
												elevation={0}
												sx={{
													p: 3,
													backgroundColor: '#f5f5f5',
													borderRadius: 2,
													border: '1px solid #e0e0e0',
												}}
											>
												<Stack spacing={2}>
													<Box>
														<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
															{bookingForm.selectedService.title}
														</Typography>
														{bookingForm.selectedService.description && (
															<Typography variant="body2" sx={{ color: '#616161', mb: 2 }}>
																{bookingForm.selectedService.description}
															</Typography>
														)}
													</Box>
													<Divider />
													<Grid container spacing={2}>
														<Grid item xs={6}>
															<Typography variant="caption" sx={{ color: '#616161' }}>
																Session Type
															</Typography>
															<Typography variant="body2" sx={{ fontWeight: 500 }}>
																{getBookingTypeLabel(bookingForm.selectedService.bookingType)}
															</Typography>
														</Grid>
														<Grid item xs={6}>
															<Typography variant="caption" sx={{ color: '#616161' }}>
																Available Durations
															</Typography>
															<Typography variant="body2" sx={{ fontWeight: 500 }}>
																{bookingForm.selectedService.durationOptions?.map((d: number) => formatDurationForDisplay(d)).join(', ') || 'N/A'}
															</Typography>
														</Grid>
													</Grid>
												</Stack>
											</Paper>
										)}
									</Box>
								)}

								{/* Step 3: Pick Date & Time */}
								{activeStep === 2 && (
									<Box>
										<Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#212121' }}>
											Schedule Your Session
										</Typography>
										<Grid container spacing={3}>
											{/* Date Picker */}
											<Grid item xs={12} sm={6}>
												<LocalizationProvider dateAdapter={AdapterDateFns}>
													<DatePicker
														label="Select Date"
														value={bookingForm.state.bookingDate ? moment(bookingForm.state.bookingDate, 'YYYY-MM-DD').toDate() : null}
														onChange={(newValue: any) => {
															bookingForm.setBookingDate(newValue);
															bookingForm.setBookingTime(null);
														}}
			minDate={minDate}
														renderInput={(params: any) => (
															<TextField
																{...params}
																fullWidth
																error={!!bookingForm.validationErrors.date}
																helperText={bookingForm.validationErrors.date}
															/>
														)}
													/>
												</LocalizationProvider>
											</Grid>

											{/* Time Select */}
											<Grid item xs={12} sm={6}>
												<FormControl fullWidth error={!!bookingForm.validationErrors.time}>
													<InputLabel>Select Time</InputLabel>
													<Select
														value={bookingForm.state.bookingTime || ''}
														onChange={(e) => bookingForm.setBookingTime(e.target.value || null)}
														label="Select Time"
														disabled={!bookingForm.state.trainerId || !bookingForm.state.bookingDate || bookingForm.availabilityLoading}
													>
														{!bookingForm.state.trainerId || !bookingForm.state.bookingDate ? (
															<MenuItem disabled>Select trainer and date first</MenuItem>
														) : bookingForm.availabilityLoading ? (
															<MenuItem disabled>
																<CircularProgress size={20} sx={{ mr: 2 }} />
																Loading available times...
															</MenuItem>
														) : bookingForm.availableSlots.length > 0 ? (
															bookingForm.availableSlots.map((slot: string) => (
																<MenuItem key={slot} value={slot}>
																	{formatTimeForDisplay(slot)}
																</MenuItem>
															))
														) : (
															<MenuItem disabled>No slots available for this date</MenuItem>
														)}
													</Select>
													{bookingForm.validationErrors.time && (
														<FormHelperText>{bookingForm.validationErrors.time}</FormHelperText>
													)}
												</FormControl>
											</Grid>

											{/* Duration Select */}
											<Grid item xs={12} sm={6}>
												<FormControl fullWidth error={!!bookingForm.validationErrors.duration}>
													<InputLabel>Session Duration</InputLabel>
													<Select
														value={bookingForm.state.durationMinutes || ''}
														onChange={(e) => bookingForm.setDuration(Number(e.target.value))}
														label="Session Duration"
														disabled={!bookingForm.selectedService || !bookingForm.selectedService.durationOptions?.length}
													>
														{!bookingForm.selectedService ? (
															<MenuItem disabled>Select a service first</MenuItem>
														) : bookingForm.selectedService.durationOptions && bookingForm.selectedService.durationOptions.length > 0 ? (
															bookingForm.selectedService.durationOptions.map((minutes: number) => (
																<MenuItem key={minutes} value={minutes}>
																	{formatDurationForDisplay(minutes)}
																</MenuItem>
															))
														) : (
															<MenuItem disabled>No duration options available</MenuItem>
														)}
													</Select>
													{bookingForm.validationErrors.duration && (
														<FormHelperText>{bookingForm.validationErrors.duration}</FormHelperText>
													)}
												</FormControl>
											</Grid>

											{/* Notes */}
											<Grid item xs={12}>
												<TextField
													fullWidth
													label="Additional Notes (Optional)"
													multiline
													rows={4}
													value={bookingForm.state.notes}
													onChange={(e) => bookingForm.setNotes(e.target.value)}
													placeholder="Any special requests or information for your trainer..."
												/>
											</Grid>
										</Grid>
									</Box>
								)}

								{/* Step 4: Review & Confirm */}
								{activeStep === 3 && (
									<Box>
										<Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#212121' }}>
											Review Your Booking
										</Typography>
										<Paper elevation={0} sx={{ p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
											<Stack spacing={3}>
												{/* Trainer Info */}
												<Box>
													<Typography variant="caption" sx={{ color: '#616161', textTransform: 'uppercase', letterSpacing: 1 }}>
														Trainer
													</Typography>
													<Typography variant="h6" sx={{ mt: 0.5, fontWeight: 600 }}>
														{bookingForm.selectedTrainer?.memberFullName || bookingForm.selectedTrainer?.memberNick || '—'}
													</Typography>
												</Box>
												<Divider />
												{/* Service Info */}
												<Box>
													<Typography variant="caption" sx={{ color: '#616161', textTransform: 'uppercase', letterSpacing: 1 }}>
														Service
													</Typography>
													<Typography variant="h6" sx={{ mt: 0.5, fontWeight: 600 }}>
														{bookingForm.selectedService?.title || '—'}
													</Typography>
												</Box>
												<Divider />
												{/* Date & Time */}
												<Box>
													<Typography variant="caption" sx={{ color: '#616161', textTransform: 'uppercase', letterSpacing: 1 }}>
														Date & Time
													</Typography>
													<Typography variant="body1" sx={{ mt: 0.5 }}>
														{bookingForm.state.bookingDate && formatDateForDisplay(new Date(bookingForm.state.bookingDate))}
														{bookingForm.state.bookingTime && ` at ${formatTimeForDisplay(bookingForm.state.bookingTime)}`}
													</Typography>
												</Box>
												<Divider />
												{/* Duration */}
												<Box>
													<Typography variant="caption" sx={{ color: '#616161', textTransform: 'uppercase', letterSpacing: 1 }}>
														Duration
													</Typography>
													<Typography variant="body1" sx={{ mt: 0.5 }}>
														{formatDurationForDisplay(bookingForm.state.durationMinutes)}
													</Typography>
												</Box>
												<Divider />
												{/* Total Price */}
												<Box sx={{ textAlign: 'center', pt: 2 }}>
													<Typography variant="caption" sx={{ color: '#616161', textTransform: 'uppercase', letterSpacing: 1 }}>
														Total Price
													</Typography>
													<Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: '#1976d2' }}>
														${bookingForm.totalPrice.toFixed(2)}
													</Typography>
												</Box>
											</Stack>
										</Paper>
									</Box>
								)}

								{/* Navigation Buttons */}
								<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
									<Button
										disabled={activeStep === 0}
										onClick={handleBack}
										sx={{ color: '#616161' }}
									>
										Back
									</Button>
									{activeStep < steps.length - 1 ? (
										<Button
											variant="contained"
											onClick={handleNext}
											disabled={
												(activeStep === 0 && !bookingForm.state.trainerId) ||
												(activeStep === 1 && !bookingForm.state.serviceId) ||
												(activeStep === 2 && (!bookingForm.state.bookingDate || !bookingForm.state.bookingTime || !bookingForm.state.durationMinutes))
											}
										>
											Next
										</Button>
									) : (
										<Button
											variant="contained"
											onClick={handleSubmit}
											disabled={!bookingForm.isFormValid || bookingForm.creatingBooking}
											sx={{ backgroundColor: '#1976d2' }}
										>
											{bookingForm.creatingBooking ? (
												<>
													<CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />
													Creating...
												</>
											) : (
												'Confirm Booking'
											)}
										</Button>
									)}
								</Box>
							</CardContent>
						</Card>
					</Grid>

					{/* Summary Sidebar */}
					<Grid item xs={12} md={4}>
						<Card elevation={0} sx={{ borderRadius: 2, position: 'sticky', top: 20 }}>
							<CardContent sx={{ p: 3 }}>
								<Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#212121' }}>
									Booking Summary
								</Typography>
								<Stack spacing={2}>
									<Box>
										<Typography variant="caption" sx={{ color: '#616161' }}>
											Trainer
										</Typography>
										<Typography variant="body2" sx={{ fontWeight: 500 }}>
											{bookingForm.selectedTrainer?.memberFullName || bookingForm.selectedTrainer?.memberNick || 'Not selected'}
										</Typography>
									</Box>
									<Divider />
									<Box>
										<Typography variant="caption" sx={{ color: '#616161' }}>
											Service
										</Typography>
										<Typography variant="body2" sx={{ fontWeight: 500 }}>
											{bookingForm.selectedService?.title || 'Not selected'}
										</Typography>
									</Box>
									<Divider />
									<Box>
										<Typography variant="caption" sx={{ color: '#616161' }}>
											Date & Time
										</Typography>
										<Typography variant="body2" sx={{ fontWeight: 500 }}>
											{bookingForm.state.bookingDate && bookingForm.state.bookingTime
												? `${formatDateForDisplay(new Date(bookingForm.state.bookingDate))} at ${formatTimeForDisplay(bookingForm.state.bookingTime)}`
												: 'Not selected'}
										</Typography>
									</Box>
									<Divider />
									<Box>
										<Typography variant="caption" sx={{ color: '#616161' }}>
											Duration
										</Typography>
										<Typography variant="body2" sx={{ fontWeight: 500 }}>
											{bookingForm.state.durationMinutes ? formatDurationForDisplay(bookingForm.state.durationMinutes) : 'Not selected'}
										</Typography>
									</Box>
									<Divider />
									<Box sx={{ pt: 2 }}>
										<Typography variant="caption" sx={{ color: '#616161', display: 'block', mb: 1 }}>
											Total Price
										</Typography>
										<Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2' }}>
											${bookingForm.totalPrice.toFixed(2)}
										</Typography>
									</Box>
								</Stack>
								{!user?._id && (
									<Alert severity="warning" sx={{ mt: 3 }}>
										Please login to complete your booking
									</Alert>
								)}
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default withLayoutBasic(NewBookingPage);

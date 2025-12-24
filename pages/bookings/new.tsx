import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Grid, Divider, InputAdornment, Alert, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TRAINERS } from '../../apollo/user/query';
import { CREATE_BOOKING } from '../../apollo/user/mutation';
import { BookingInput } from '../../libs/types/booking/booking.input';
import { BookingType, SessionDuration } from '../../libs/enums/booking.enum';
import { REACT_APP_API_URL } from '../../libs/config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { sweetErrorAlert } from '../../libs/sweetAlert';
import moment from 'moment';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const NewBookingPage: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { trainerId: trainerIdParam } = router.query;
	
	const [bookingData, setBookingData] = useState({
		trainerId: '',
		serviceType: '',
		date: '',
		time: '',
		duration: '60',
		location: 'in-person',
		notes: '',
		price: 50,
	});

	// Get minimum date (today)
	const minDate = useMemo(() => {
		return moment().format('YYYY-MM-DD');
	}, []);

	// Fetch trainers
	const { data: trainersData, loading: trainersLoading } = useQuery(GET_TRAINERS, {
		variables: {
			input: {
				page: 1,
				limit: 100,
			},
		},
		skip: false,
	});

	// Create booking mutation
	const [createBooking, { loading: creatingBooking }] = useMutation(CREATE_BOOKING, {
		onCompleted: (data) => {
			if (data?.createBooking) {
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
			setBookingData(prev => ({ ...prev, trainerId: trainerIdParam }));
		}
	}, [trainerIdParam]);

	// Get selected trainer data
	const selectedTrainer = useMemo(() => {
		if (!trainersData?.getTrainers?.list || !bookingData.trainerId) return null;
		return trainersData.getTrainers.list.find((t: any) => t._id === bookingData.trainerId);
	}, [trainersData, bookingData.trainerId]);

	const handleSubmit = async () => {
		// Validation
		if (!user?._id) {
			sweetErrorAlert('Please login to book a session');
			router.push('/account/login');
			return;
		}

		if (!bookingData.trainerId) {
			sweetErrorAlert('Please select a trainer');
			return;
		}

		if (!bookingData.serviceType) {
			sweetErrorAlert('Please select a service type');
			return;
		}

		if (!bookingData.date) {
			sweetErrorAlert('Please select a date');
			return;
		}

		if (!bookingData.time) {
			sweetErrorAlert('Please select a time');
			return;
		}

		// Map service type to BookingType enum
		const bookingTypeMap: Record<string, BookingType> = {
			'personal': BookingType.PERSONAL_TRAINING,
			'group': BookingType.GROUP_CLASS,
			'consultation': BookingType.CONSULTATION,
			'online': BookingType.ONLINE_SESSION,
		};

		// Map duration to SessionDuration enum (in minutes)
		const durationMap: Record<string, number> = {
			'30': 30,
			'60': 60,
			'90': 90,
			'120': 120,
		};

		// Prepare booking input
		const bookingInput: BookingInput = {
			bookingType: bookingTypeMap[bookingData.serviceType] || BookingType.PERSONAL_TRAINING,
			providerId: bookingData.trainerId,
			bookingDate: new Date(`${bookingData.date}T${bookingData.time}`),
			bookingTime: bookingData.time,
			sessionDuration: durationMap[bookingData.duration] || 60,
			bookingPrice: bookingData.price,
			bookingNotes: bookingData.notes || undefined,
			meetingLink: bookingData.location === 'online' ? '' : undefined,
			clientId: user._id,
		};

		try {
			await createBooking({
				variables: { input: bookingInput },
			});
		} catch (error) {
			console.error('Booking error:', error);
		}
	};

	// Format date for display
	const formatDate = (dateStr: string) => {
		if (!dateStr) return 'Not selected';
		return moment(dateStr).format('MMMM DD, YYYY');
	};

	// Format time for display
	const formatTime = (timeStr: string) => {
		if (!timeStr) return '';
		return moment(timeStr, 'HH:mm').format('h:mm A');
	};

	if (device === 'mobile') {
		return <div>MOBILE NEW BOOKING</div>;
	} else {
		return (
			<Stack className={'new-booking-page'}>
				<Stack className={'container'}>
					<Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 3 }}>
						Back
					</Button>

					<Typography variant="h3" className={'page-title'} sx={{ mb: 4 }}>
						Book a Session
					</Typography>

					<Grid container spacing={4}>
						<Grid item xs={12} md={8}>
							<Card>
								<CardContent>
									<Stack spacing={3}>
										<FormControl fullWidth>
											<InputLabel>Select Trainer</InputLabel>
											<Select
												value={bookingData.trainerId}
												onChange={(e) => setBookingData({ ...bookingData, trainerId: e.target.value })}
												label="Select Trainer"
												disabled={!!trainerIdParam}
											>
												{trainersLoading ? (
													<MenuItem disabled>Loading trainers...</MenuItem>
												) : trainersData?.getTrainers?.list?.length > 0 ? (
													trainersData.getTrainers.list.map((trainer: any) => (
														<MenuItem key={trainer._id} value={trainer._id}>
															{trainer.memberFullName || trainer.memberNick} {trainer.trainerRating ? `⭐ ${trainer.trainerRating.toFixed(1)}` : ''}
														</MenuItem>
													))
												) : (
													<MenuItem disabled>No trainers available</MenuItem>
												)}
											</Select>
										</FormControl>

										<FormControl fullWidth>
											<InputLabel>Service Type</InputLabel>
											<Select
												value={bookingData.serviceType}
												onChange={(e) => setBookingData({ ...bookingData, serviceType: e.target.value })}
												label="Service Type"
											>
												<MenuItem value="personal">Personal Training</MenuItem>
												<MenuItem value="group">Group Class</MenuItem>
												<MenuItem value="consultation">Consultation</MenuItem>
												<MenuItem value="online">Online Session</MenuItem>
											</Select>
										</FormControl>

										<Grid container spacing={2}>
											<Grid item xs={12} sm={6}>
												<TextField
													fullWidth
													label="Date"
													type="date"
													value={bookingData.date}
													onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
													InputLabelProps={{ shrink: true }}
													inputProps={{
														min: minDate,
													}}
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<CalendarTodayIcon sx={{ color: 'text.secondary' }} />
															</InputAdornment>
														),
													}}
													required
												/>
											</Grid>
											<Grid item xs={12} sm={6}>
												<TextField
													fullWidth
													label="Time"
													type="time"
													value={bookingData.time}
													onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
													InputLabelProps={{ shrink: true }}
													inputProps={{
														step: 300, // 5 minute intervals
													}}
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<AccessTimeIcon sx={{ color: 'text.secondary' }} />
															</InputAdornment>
														),
													}}
													required
												/>
											</Grid>
										</Grid>

										<FormControl fullWidth>
											<InputLabel>Duration</InputLabel>
											<Select
												value={bookingData.duration}
												onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
												label="Duration"
											>
												<MenuItem value="30">30 minutes</MenuItem>
												<MenuItem value="60">1 hour</MenuItem>
												<MenuItem value="90">1.5 hours</MenuItem>
												<MenuItem value="120">2 hours</MenuItem>
											</Select>
										</FormControl>

										<FormControl fullWidth>
											<InputLabel>Location</InputLabel>
											<Select
												value={bookingData.location}
												onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
												label="Location"
											>
												<MenuItem value="in-person">In-Person</MenuItem>
												<MenuItem value="online">Online</MenuItem>
											</Select>
										</FormControl>

										<TextField
											fullWidth
											label="Additional Notes (Optional)"
											multiline
											rows={4}
											value={bookingData.notes}
											onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
										/>
									</Stack>
								</CardContent>
							</Card>
						</Grid>

						<Grid item xs={12} md={4}>
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Booking Summary
									</Typography>
									<Stack spacing={2} sx={{ mt: 2 }}>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Trainer
											</Typography>
											<Typography variant="body1">
												{selectedTrainer ? (selectedTrainer.memberFullName || selectedTrainer.memberNick) : 'Not selected'}
											</Typography>
										</Box>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Service
											</Typography>
											<Typography variant="body1">
												{bookingData.serviceType === 'personal' ? 'Personal Training' :
												 bookingData.serviceType === 'group' ? 'Group Class' :
												 bookingData.serviceType === 'consultation' ? 'Consultation' :
												 bookingData.serviceType === 'online' ? 'Online Session' :
												 'Not selected'}
											</Typography>
										</Box>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Date & Time
											</Typography>
											<Typography variant="body1">
												{formatDate(bookingData.date)} {formatTime(bookingData.time)}
											</Typography>
										</Box>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Location
											</Typography>
											<Typography variant="body1">
												{bookingData.location === 'in-person' ? 'In-Person' : 'Online'}
											</Typography>
										</Box>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Duration
											</Typography>
											<Typography variant="body1">{bookingData.duration} minutes</Typography>
										</Box>
										<Divider />
										<Box>
											<Typography variant="h6">Total</Typography>
											<Typography variant="h5" color="primary">
												${bookingData.price.toFixed(2)}
											</Typography>
										</Box>
									</Stack>
									{!user?._id && (
										<Alert severity="warning" sx={{ mt: 2 }}>
											Please login to confirm your booking
										</Alert>
									)}
									<Button 
										variant="contained" 
										fullWidth 
										size="large" 
										sx={{ mt: 3 }} 
										onClick={handleSubmit}
										disabled={creatingBooking || !user?._id || !bookingData.trainerId || !bookingData.serviceType || !bookingData.date || !bookingData.time}
									>
										{creatingBooking ? (
											<>
												<CircularProgress size={20} sx={{ mr: 1 }} />
												Creating Booking...
											</>
										) : (
											'Confirm Booking'
										)}
									</Button>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(NewBookingPage);






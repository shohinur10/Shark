import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent, Grid } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const NewBookingPage: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [bookingData, setBookingData] = useState({
		trainerId: '',
		serviceType: '',
		date: '',
		time: '',
		duration: '60',
		location: 'in-person',
		notes: '',
	});

	const handleSubmit = () => {
		// TODO: Create booking
		router.push('/bookings');
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
											>
												<MenuItem value="1">Trainer 1</MenuItem>
												<MenuItem value="2">Trainer 2</MenuItem>
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
												<MenuItem value="group">Group Session</MenuItem>
												<MenuItem value="consultation">Consultation</MenuItem>
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
													InputProps={{
														startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />,
													}}
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
													InputProps={{
														startAdornment: <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
													}}
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
											<Typography variant="body1">Selected trainer name</Typography>
										</Box>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Service
											</Typography>
											<Typography variant="body1">{bookingData.serviceType || 'Not selected'}</Typography>
										</Box>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Date & Time
											</Typography>
											<Typography variant="body1">
												{bookingData.date || 'Not selected'} {bookingData.time || ''}
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
												$50.00
											</Typography>
										</Box>
									</Stack>
									<Button variant="contained" fullWidth size="large" sx={{ mt: 3 }} onClick={handleSubmit}>
										Confirm Booking
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






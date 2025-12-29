import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Tabs, Tab, Chip, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useBookingsQuery } from '../../libs/hooks/useBookingsQuery';
import { BookingsInquiry } from '../../libs/types/booking/booking.input';
import { BookingStatus, BookingType } from '../../libs/enums/booking.enum';
import { Direction } from '../../libs/enums/common.enum';
import { Booking } from '../../libs/types/booking/booking';
import { formatDateForDisplay, formatTimeForDisplay, formatDurationForDisplay } from '../../libs/utils/booking.utils';
import moment from 'moment';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const BookingsPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [tabValue, setTabValue] = useState(0);

	// Determine which bookings to show based on tab
	const bookingStatusFilter = useMemo(() => {
		switch (tabValue) {
			case 0: // Upcoming - PENDING and CONFIRMED
				return [BookingStatus.PENDING, BookingStatus.CONFIRMED];
			case 1: // History - COMPLETED
				return [BookingStatus.COMPLETED];
			case 2: // Cancelled - CANCELLED
				return [BookingStatus.CANCELLED];
			default:
				return [];
		}
	}, [tabValue]);

	// Build inquiry for bookings query
	const bookingsInquiry: BookingsInquiry = useMemo(() => ({
		page: 1,
		limit: 100,
		sort: 'bookingDate',
		direction: Direction.DESC,
		clientId: user?._id || undefined,
	}), [user?._id]);

	// Fetch all bookings
	const { bookings, loading, error, refetch } = useBookingsQuery(bookingsInquiry);

	// Calculate counts for each tab
	const tabCounts = useMemo(() => {
		if (!bookings || bookings.length === 0) return { upcoming: 0, history: 0, cancelled: 0 };

		const upcoming = bookings.filter((booking: Booking) => {
			if (![BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(booking.bookingStatus)) return false;
			const bookingDateTime = moment(`${booking.bookingDate} ${booking.bookingTime}`, 'YYYY-MM-DD HH:mm');
			return bookingDateTime.isAfter(moment());
		}).length;

		const history = bookings.filter((booking: Booking) => 
			booking.bookingStatus === BookingStatus.COMPLETED
		).length;

		const cancelled = bookings.filter((booking: Booking) => 
			booking.bookingStatus === BookingStatus.CANCELLED
		).length;

		return { upcoming, history, cancelled };
	}, [bookings]);

	// Filter bookings by status and date
	const filteredBookings = useMemo(() => {
		if (!bookings || bookings.length === 0) return [];

		let filtered = bookings.filter((booking: Booking) => {
			// Filter by status
			if (!bookingStatusFilter.includes(booking.bookingStatus)) {
				return false;
			}

			// For upcoming tab, only show future bookings
			if (tabValue === 0) {
				const bookingDateTime = moment(`${booking.bookingDate} ${booking.bookingTime}`, 'YYYY-MM-DD HH:mm');
				return bookingDateTime.isAfter(moment());
			}

			return true;
		});

		// Sort upcoming by date ascending (soonest first), others by date descending
		if (tabValue === 0) {
			filtered.sort((a, b) => {
				const dateA = moment(`${a.bookingDate} ${a.bookingTime}`, 'YYYY-MM-DD HH:mm');
				const dateB = moment(`${b.bookingDate} ${b.bookingTime}`, 'YYYY-MM-DD HH:mm');
				return dateA.diff(dateB);
			});
		} else {
			filtered.sort((a, b) => {
				const dateA = moment(`${a.bookingDate} ${a.bookingTime}`, 'YYYY-MM-DD HH:mm');
				const dateB = moment(`${b.bookingDate} ${b.bookingTime}`, 'YYYY-MM-DD HH:mm');
				return dateB.diff(dateA);
			});
		}

		return filtered;
	}, [bookings, bookingStatusFilter, tabValue]);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const getStatusColor = (status: BookingStatus): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
		switch (status) {
			case BookingStatus.CONFIRMED:
				return 'success';
			case BookingStatus.PENDING:
				return 'warning';
			case BookingStatus.COMPLETED:
				return 'info';
			case BookingStatus.CANCELLED:
				return 'error';
			default:
				return 'default';
		}
	};

	const getStatusLabel = (status: BookingStatus): string => {
		switch (status) {
			case BookingStatus.CONFIRMED:
				return 'Confirmed';
			case BookingStatus.PENDING:
				return 'Pending';
			case BookingStatus.COMPLETED:
				return 'Completed';
			case BookingStatus.CANCELLED:
				return 'Cancelled';
			case BookingStatus.NO_SHOW:
				return 'No Show';
			case BookingStatus.REFUNDED:
				return 'Refunded';
			default:
				return status;
		}
	};

	const getBookingTypeLabel = (type: BookingType): string => {
		switch (type) {
			case BookingType.PERSONAL_TRAINING:
				return 'Personal Training';
			case BookingType.GROUP_CLASS:
				return 'Group Class';
			case BookingType.GYM_ACCESS:
				return 'Gym Access';
			case BookingType.FACILITY_RENTAL:
				return 'Facility Rental';
			case BookingType.ONLINE_SESSION:
				return 'Online Session';
			case BookingType.CONSULTATION:
				return 'Consultation';
			default:
				return type;
		}
	};

	const formatBookingDateTime = (booking: Booking): string => {
		const date = booking.bookingDate ? new Date(booking.bookingDate) : null;
		const formattedDate = formatDateForDisplay(date);
		const formattedTime = formatTimeForDisplay(booking.bookingTime);
		
		// Calculate end time
		if (booking.bookingTime && booking.sessionDuration) {
			const startTime = moment(booking.bookingTime, 'HH:mm');
			const durationMinutes = typeof booking.sessionDuration === 'string' 
				? parseInt(booking.sessionDuration) || 60
				: booking.sessionDuration;
			const endTime = startTime.add(durationMinutes, 'minutes');
			const formattedEndTime = endTime.format('h:mm A');
			return `${formattedDate} • ${formattedTime} - ${formattedEndTime}`;
		}
		
		return `${formattedDate} • ${formattedTime}`;
	};

	const getDurationMinutes = (sessionDuration: any): number => {
		if (typeof sessionDuration === 'number') return sessionDuration;
		if (typeof sessionDuration === 'string') {
			// Try to parse if it's a number string
			const parsed = parseInt(sessionDuration);
			if (!isNaN(parsed)) return parsed;
			
			// Handle enum values
			switch (sessionDuration) {
				case 'THIRTY_MIN': return 30;
				case 'FORTY_FIVE_MIN': return 45;
				case 'SIXTY_MIN': return 60;
				case 'NINETY_MIN': return 90;
				case 'FULL_DAY': return 1440;
				default: return 60;
			}
		}
		return 60; // Default
	};

	if (device === 'mobile') {
		return (
			<Stack className={'bookings-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Bookings</Typography>
					<div>MOBILE BOOKINGS PAGE</div>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'bookings-page'} sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
			<Stack className={'container'} sx={{ py: 4, maxWidth: '1200px', mx: 'auto', px: 2 }}>
				{/* Page Header */}
				<Stack 
					className={'page-header'} 
					direction="row" 
					justifyContent="space-between" 
					alignItems="center" 
					sx={{ mb: 4 }}
				>
					<Box>
						<Typography variant="h3" className={'page-title'} sx={{ fontWeight: 700, mb: 1 }}>
							My Bookings
						</Typography>
						<Typography variant="body1" className={'page-subtitle'} sx={{ color: '#616161' }}>
							Manage your trainer sessions and gym visits
						</Typography>
					</Box>
					<Button 
						variant="contained" 
						startIcon={<AddIcon />}
						onClick={() => router.push('/bookings/new')}
						sx={{ 
							backgroundColor: '#1976d2',
							'&:hover': { backgroundColor: '#1565c0' }
						}}
					>
						Book New Session
					</Button>
				</Stack>

				{/* Tabs */}
				<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
					<Tabs value={tabValue} onChange={handleTabChange}>
						<Tab label={`Upcoming (${tabCounts.upcoming})`} />
						<Tab label={`History (${tabCounts.history})`} />
						<Tab label={`Cancelled (${tabCounts.cancelled})`} />
					</Tabs>
				</Box>

				{/* Loading State */}
				{loading && (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
						<CircularProgress />
					</Box>
				)}

				{/* Error State */}
				{error && !loading && (
					<Box sx={{ textAlign: 'center', py: 4 }}>
						<Typography variant="body1" color="error" sx={{ mb: 2 }}>
							Error loading bookings: {error.message}
						</Typography>
						<Button variant="outlined" onClick={() => refetch()}>
							Retry
						</Button>
					</Box>
				)}

				{/* No Bookings State */}
				{!loading && !error && filteredBookings.length === 0 && (
					<Box className={'empty-bookings-placeholder'} sx={{ textAlign: 'center', py: 8 }}>
						<Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
							No {tabValue === 0 ? 'upcoming' : tabValue === 1 ? 'completed' : 'cancelled'} bookings
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							{tabValue === 0 
								? 'Start by booking your first training session'
								: tabValue === 1
								? 'Your completed sessions will appear here'
								: 'No cancelled bookings'}
						</Typography>
						{tabValue === 0 && (
							<Button 
								variant="contained" 
								startIcon={<AddIcon />} 
								onClick={() => router.push('/bookings/new')}
								sx={{ mt: 2 }}
							>
								Book New Session
							</Button>
						)}
					</Box>
				)}

				{/* Bookings Grid */}
				{!loading && !error && filteredBookings.length > 0 && (
					<Grid container spacing={3}>
						{filteredBookings.map((booking: Booking) => (
							<Grid item xs={12} md={6} key={booking._id}>
								<Card 
									className={'booking-card'} 
									sx={{ 
										height: '100%',
										boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
										transition: 'transform 0.2s, box-shadow 0.2s',
										'&:hover': {
											transform: 'translateY(-4px)',
											boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
										}
									}}
								>
									<CardContent sx={{ p: 3 }}>
										{/* Header with Status */}
										<Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
											<Box sx={{ flex: 1 }}>
												<Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
													{getBookingTypeLabel(booking.bookingType)}
												</Typography>
												{booking.memberData && (
													<Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
														<PersonIcon fontSize="small" sx={{ color: '#616161' }} />
														<Typography variant="body2" color="text.secondary">
															{booking.memberData.memberFullName || booking.memberData.memberNick || 'Trainer'}
														</Typography>
													</Stack>
												)}
											</Box>
											<Chip 
												label={getStatusLabel(booking.bookingStatus)} 
												color={getStatusColor(booking.bookingStatus)} 
												size="small"
												icon={booking.bookingStatus === BookingStatus.COMPLETED ? <CheckCircleIcon /> : undefined}
											/>
										</Stack>

										{/* Booking Details */}
										<Stack spacing={1.5} sx={{ mb: 3 }}>
											<Stack direction="row" alignItems="center" spacing={1.5}>
												<CalendarTodayIcon fontSize="small" sx={{ color: '#616161' }} />
												<Typography variant="body2" sx={{ color: '#424242' }}>
													{formatBookingDateTime(booking)}
												</Typography>
											</Stack>
											
											<Stack direction="row" alignItems="center" spacing={1.5}>
												<AccessTimeIcon fontSize="small" sx={{ color: '#616161' }} />
												<Typography variant="body2" sx={{ color: '#424242' }}>
													{formatDurationForDisplay(getDurationMinutes(booking.sessionDuration))}
												</Typography>
											</Stack>

											{booking.bookingType === BookingType.ONLINE_SESSION || booking.bookingType === BookingType.ONLINE ? (
												<Stack direction="row" alignItems="center" spacing={1.5}>
													<VideoCallIcon fontSize="small" sx={{ color: '#616161' }} />
													<Typography variant="body2" sx={{ color: '#424242' }}>
														{booking.meetingLink ? (
															<a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
																Join Meeting
															</a>
														) : (
															'Online Session'
														)}
													</Typography>
												</Stack>
											) : (
												<Stack direction="row" alignItems="center" spacing={1.5}>
													<LocationOnIcon fontSize="small" sx={{ color: '#616161' }} />
													<Typography variant="body2" sx={{ color: '#424242' }}>
														In-person Session
													</Typography>
												</Stack>
											)}

											<Stack direction="row" alignItems="center" spacing={1.5}>
												<AttachMoneyIcon fontSize="small" sx={{ color: '#616161' }} />
												<Typography variant="body2" sx={{ color: '#424242', fontWeight: 600 }}>
													${booking.bookingPrice?.toFixed(2) || '0.00'}
												</Typography>
											</Stack>
										</Stack>

										{/* Notes */}
										{booking.bookingNotes && (
											<Box sx={{ mb: 2, p: 1.5, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
												<Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
													Notes:
												</Typography>
												<Typography variant="body2" sx={{ color: '#616161' }}>
													{booking.bookingNotes}
												</Typography>
											</Box>
										)}

										{/* Actions */}
										<Stack direction="row" spacing={2} sx={{ mt: 2 }}>
											{tabValue === 0 && booking.bookingStatus !== BookingStatus.CANCELLED && (
												<Button 
													variant="outlined" 
													size="small" 
													startIcon={<CancelIcon />}
													color="error"
												>
													Cancel
												</Button>
											)}
											{tabValue === 1 && !booking.reviewId && (
												<Button variant="outlined" size="small">
													Leave Review
												</Button>
											)}
											<Button variant="contained" size="small" sx={{ ml: 'auto' }}>
												View Details
											</Button>
										</Stack>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(BookingsPage);

import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import {
	Pagination,
	Stack,
	Typography,
	Card,
	Box,
	Chip,
	Button,
	Divider,
} from '@mui/material';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';
import { Booking } from '../../types/booking/booking';
import { GET_BOOKINGS } from '../../../apollo/user/query';
import { BookingsInquiry } from '../../types/booking/booking.input';
import { Direction } from '../../enums/common.enum';
import Link from 'next/link';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { REACT_APP_API_URL } from '../../config';

const MyBookings: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [searchBookings, setSearchBookings] = useState<BookingsInquiry>({
		...initialInput,
		clientId: user._id,
	});
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: bookingsLoading,
		data: bookingsData,
		error: getBookingsError,
		refetch: bookingsRefetch,
	} = useQuery(GET_BOOKINGS, {
		fetchPolicy: 'network-only',
		variables: { input: searchBookings },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBookings(data?.getBookings?.list || []);
			setTotalCount(data?.getBookings?.metaCounter?.[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchBookings({ ...searchBookings, page: value });
	};

	if (device === 'mobile') {
		return <>BOOKINGS PAGE MOBILE</>;
	} else
		return (
			<div id="my-bookings-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Bookings</Typography>
						<Typography className="sub-title">Manage your training sessions and appointments</Typography>
					</Stack>
				</Stack>
				<Stack spacing={3} sx={{ mt: 3 }}>
					{bookingsLoading ? (
						<Box component="div" sx={{ textAlign: 'center', py: 4 }}>
							<Typography sx={{ color: '#6B6B6B' }}>Loading bookings...</Typography>
						</Box>
					) : bookings?.length > 0 ? (
						<>
							{bookings.map((booking: Booking) => (
								<Card
									key={booking._id}
									elevation={0}
									sx={{
										border: '1px solid #E5E5E5',
										borderRadius: '16px',
										padding: '24px',
										transition: 'all 0.2s',
										'&:hover': {
											borderColor: '#E10600',
											boxShadow: '0 4px 12px rgba(225, 6, 0, 0.1)',
										},
									}}
								>
									<Stack spacing={2}>
										<Stack direction="row" alignItems="center" justifyContent="space-between">
											<Stack direction="row" alignItems="center" spacing={1.5}>
												<EventIcon sx={{ fontSize: '24px', color: '#E10600' }} />
												<Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111111' }}>
													{booking.bookingType?.replace(/_/g, ' ') || 'Booking'}
												</Typography>
											</Stack>
											<Chip
												label={booking.bookingStatus}
												size="small"
												sx={{
													height: '24px',
													fontSize: '12px',
													backgroundColor:
														booking.bookingStatus === 'CONFIRMED'
															? '#E8F5E9'
															: booking.bookingStatus === 'PENDING'
															? '#FFF3E0'
															: '#FFEBEE',
													color:
														booking.bookingStatus === 'CONFIRMED'
															? '#2E7D32'
															: booking.bookingStatus === 'PENDING'
															? '#E65100'
															: '#C62828',
													fontWeight: 600,
												}}
											/>
										</Stack>
										<Divider sx={{ borderColor: '#E5E5E5' }} />
										{booking.memberData && (
											<Stack direction="row" alignItems="center" spacing={1}>
												<Typography sx={{ fontSize: '14px', color: '#6B6B6B' }}>
													<strong>Trainer:</strong> {booking.memberData.memberFullName || booking.memberData.memberNick}
												</Typography>
											</Stack>
										)}
										<Stack direction="row" spacing={1} alignItems="center">
											<CalendarTodayIcon sx={{ fontSize: '16px', color: '#6B6B6B' }} />
											<Typography sx={{ fontSize: '14px', color: '#6B6B6B' }}>
												{new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}
											</Typography>
										</Stack>
										{booking.bookingNotes && (
											<Typography sx={{ fontSize: '14px', color: '#6B6B6B', fontStyle: 'italic' }}>
												{booking.bookingNotes}
											</Typography>
										)}
									</Stack>
								</Card>
							))}
						</>
					) : (
						<Box
							component="div"
							sx={{
								textAlign: 'center',
								py: 6,
								borderRadius: '16px',
								backgroundColor: '#FAFAFA',
								border: '1px dashed #E5E5E5',
							}}
						>
							<EventIcon sx={{ fontSize: '64px', color: '#E5E5E5', mb: 2 }} />
							<Typography sx={{ fontSize: '18px', color: '#6B6B6B', mb: 1, fontWeight: 600 }}>
								No bookings found!
							</Typography>
							<Typography sx={{ fontSize: '14px', color: '#6B6B6B', mb: 3 }}>
								Start booking training sessions with your trainers
							</Typography>
							<Button
								component={Link}
								href="/trainer"
								variant="contained"
								sx={{
									backgroundColor: '#E10600',
									color: '#FFFFFF',
									textTransform: 'none',
									'&:hover': { backgroundColor: '#C10500' },
								}}
							>
								Book a Session
							</Button>
						</Box>
					)}
				</Stack>

				{bookings?.length > 0 && (
					<Stack className="pagination-conf" sx={{ mt: 4 }}>
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(totalCount / (searchBookings.limit || 6))}
								page={searchBookings.page || 1}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total">
							<Typography>Total {totalCount ?? 0} booking(s) available</Typography>
						</Stack>
					</Stack>
				)}
			</div>
		);
};

MyBookings.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: Direction.DESC,
		clientId: '',
	},
};

export default MyBookings;


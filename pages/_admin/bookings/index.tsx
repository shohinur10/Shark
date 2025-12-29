import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, InputAdornment, List, ListItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { BookingsInquiry } from '../../../libs/types/booking/booking.input';
import { Booking } from '../../../libs/types/booking/booking';
import { BookingStatus, BookingType } from '../../../libs/enums/booking.enum';
import { useQuery } from '@apollo/client';
import { GET_ALL_BOOKINGS_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { format } from 'date-fns';

const AdminBookings: NextPage = ({ initialInquiry, ...props }: any) => {
	const [bookingsInquiry, setBookingsInquiry] = useState<BookingsInquiry>(initialInquiry);
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [bookingsTotal, setBookingsTotal] = useState<number>(0);
	const [value, setValue] = useState<string>('ALL');
	const [searchText, setSearchText] = useState('');
	const [bookingTypeFilter, setBookingTypeFilter] = useState<string>('ALL');

	const {
		loading: getAllBookingsByAdminLoading,
		data: getAllBookingsByAdminData,
		error: getAllBookingsByAdminError,
		refetch: getAllBookingsByAdminRefetch,
	} = useQuery(GET_ALL_BOOKINGS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: bookingsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBookings(data?.getAllBookingsByAdmin?.list || []);
			setBookingsTotal(data?.getAllBookingsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		getAllBookingsByAdminRefetch({ input: bookingsInquiry }).then();
	}, [bookingsInquiry]);

	const changePageHandler = async (event: unknown, newPage: number) => {
		bookingsInquiry.page = newPage + 1;
		setBookingsInquiry({ ...bookingsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		bookingsInquiry.limit = parseInt(event.target.value, 10);
		bookingsInquiry.page = 1;
		setBookingsInquiry({ ...bookingsInquiry });
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		setSearchText('');

		const newInquiry = { ...bookingsInquiry, page: 1, sort: 'createdAt' };

		if (newValue !== 'ALL') {
			newInquiry.bookingStatus = newValue as BookingStatus;
		} else {
			delete newInquiry.bookingStatus;
		}

		setBookingsInquiry(newInquiry);
	};

	const textHandler = useCallback((value: string) => {
		try {
			setSearchText(value);
		} catch (err: any) {
			console.log('textHandler: ', err.message);
		}
	}, []);

	const searchTextHandler = () => {
		try {
			setBookingsInquiry({
				...bookingsInquiry,
				page: 1,
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const bookingTypeHandler = async (newValue: string) => {
		try {
			setBookingTypeFilter(newValue);

			const newInquiry = { ...bookingsInquiry, page: 1, sort: 'createdAt' };

			if (newValue !== 'ALL') {
				newInquiry.bookingType = newValue as BookingType;
			} else {
				delete newInquiry.bookingType;
			}

			setBookingsInquiry(newInquiry);
		} catch (err: any) {
			console.log('bookingTypeHandler: ', err.message);
		}
	};

	const getStatusClass = (status: BookingStatus) => {
		switch (status) {
			case BookingStatus.CONFIRMED:
			case BookingStatus.COMPLETED:
				return 'success';
			case BookingStatus.PENDING:
				return 'warning';
			case BookingStatus.CANCELLED:
				return 'error';
			default:
				return '';
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Bookings Management
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<Box component={'div'}>
						<List className={'tab-menu'}>
							<ListItem onClick={(e: any) => tabChangeHandler(e, 'ALL')} value="ALL" className={value === 'ALL' ? 'li on' : 'li'}>
								All
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, BookingStatus.PENDING)} value={BookingStatus.PENDING} className={value === BookingStatus.PENDING ? 'li on' : 'li'}>
								Pending
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, BookingStatus.CONFIRMED)} value={BookingStatus.CONFIRMED} className={value === BookingStatus.CONFIRMED ? 'li on' : 'li'}>
								Confirmed
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, BookingStatus.COMPLETED)} value={BookingStatus.COMPLETED} className={value === BookingStatus.COMPLETED ? 'li on' : 'li'}>
								Completed
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, BookingStatus.CANCELLED)} value={BookingStatus.CANCELLED} className={value === BookingStatus.CANCELLED ? 'li on' : 'li'}>
								Cancelled
							</ListItem>
						</List>
						<Divider />
						<Stack className={'search-area'} sx={{ m: '24px' }} direction="row" spacing={2}>
							<OutlinedInput
								value={searchText}
								onChange={(e: any) => textHandler(e.target.value)}
								sx={{ flex: 1 }}
								className={'search'}
								placeholder="Search by booking ID or client name"
								onKeyDown={(event) => {
									if (event.key == 'Enter') searchTextHandler();
								}}
								endAdornment={
									<>
										{searchText && (
											<CancelRoundedIcon
												style={{ cursor: 'pointer' }}
												onClick={async () => {
													setSearchText('');
													await getAllBookingsByAdminRefetch({ input: bookingsInquiry });
												}}
											/>
										)}
										<InputAdornment position="end" onClick={() => searchTextHandler()}>
											<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
										</InputAdornment>
									</>
								}
							/>
							<Select sx={{ width: '200px' }} value={bookingTypeFilter} onChange={(e) => bookingTypeHandler(e.target.value)}>
								<MenuItem value={'ALL'}>All Types</MenuItem>
								{Object.values(BookingType).map((type) => (
									<MenuItem key={type} value={type}>
										{type.replace(/_/g, ' ')}
									</MenuItem>
								))}
							</Select>
						</Stack>
						<Divider />
					</Box>

					{getAllBookingsByAdminLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
							<Typography>Loading...</Typography>
						</Box>
					) : getAllBookingsByAdminError ? (
						<Box sx={{ p: 3 }}>
							<Typography color="error">Error loading bookings: {getAllBookingsByAdminError.message}</Typography>
						</Box>
					) : (
						<>
							<TableContainer>
								<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
									<TableHead>
										<TableRow>
											<TableCell>Booking ID</TableCell>
											<TableCell>Client</TableCell>
											<TableCell>Trainer/Provider</TableCell>
											<TableCell>Type</TableCell>
											<TableCell>Date & Time</TableCell>
											<TableCell>Duration</TableCell>
											<TableCell>Price</TableCell>
											<TableCell>Status</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{bookings.length === 0 && (
											<TableRow>
												<TableCell align="center" colSpan={8}>
													<span className={'no-data'}>data not found!</span>
												</TableCell>
											</TableRow>
										)}

										{bookings.length !== 0 &&
											bookings.map((booking: Booking) => (
												<TableRow hover key={booking?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
													<TableCell align="left">{booking._id.substring(0, 8)}...</TableCell>
													<TableCell align="left">
														{booking.memberData?.memberNick || booking.clientId || '-'}
													</TableCell>
													<TableCell align="left">{booking.providerId || '-'}</TableCell>
													<TableCell align="left">{booking.bookingType?.replace(/_/g, ' ')}</TableCell>
													<TableCell align="left">
														{booking.bookingDate ? format(new Date(booking.bookingDate), 'MMM dd, yyyy') : '-'}
														<br />
														{booking.bookingTime || '-'}
													</TableCell>
													<TableCell align="left">
														{typeof booking.sessionDuration === 'number' ? `${booking.sessionDuration} min` : booking.sessionDuration || '-'}
													</TableCell>
													<TableCell align="left">${((booking.bookingPrice || 0) / 100).toFixed(2)}</TableCell>
													<TableCell align="center">
														<Button className={`badge ${getStatusClass(booking.bookingStatus)}`} sx={{ textTransform: 'none' }}>
															{booking.bookingStatus}
														</Button>
													</TableCell>
												</TableRow>
											))}
									</TableBody>
								</Table>
							</TableContainer>

							<TablePagination
								rowsPerPageOptions={[10, 20, 40, 60]}
								component="div"
								count={bookingsTotal}
								rowsPerPage={bookingsInquiry?.limit}
								page={bookingsInquiry?.page - 1}
								onPageChange={changePageHandler}
								onRowsPerPageChange={changeRowsPerPageHandler}
							/>
						</>
					)}
				</Box>
			</Box>
		</Box>
	);
};

AdminBookings.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
	},
};

export default withAdminLayout(AdminBookings);

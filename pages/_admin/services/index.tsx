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
import { ServicesInquiry } from '../../../libs/types/service/service.input';
import { Service } from '../../../libs/types/service/service';
import { ServiceStatus, BookingType } from '../../../libs/enums/booking.enum';
import { useQuery } from '@apollo/client';
import { GET_ALL_SERVICES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { format } from 'date-fns';

const AdminServices: NextPage = ({ initialInquiry, ...props }: any) => {
	const [servicesInquiry, setServicesInquiry] = useState<ServicesInquiry>(initialInquiry);
	const [services, setServices] = useState<Service[]>([]);
	const [servicesTotal, setServicesTotal] = useState<number>(0);
	const [value, setValue] = useState<string>('ALL');
	const [searchText, setSearchText] = useState('');
	const [bookingTypeFilter, setBookingTypeFilter] = useState<string>('ALL');

	const {
		loading: getAllServicesByAdminLoading,
		data: getAllServicesByAdminData,
		error: getAllServicesByAdminError,
		refetch: getAllServicesByAdminRefetch,
	} = useQuery(GET_ALL_SERVICES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: servicesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setServices(data?.getAllServicesByAdmin?.list || []);
			setServicesTotal(data?.getAllServicesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		getAllServicesByAdminRefetch({ input: servicesInquiry }).then();
	}, [servicesInquiry]);

	const changePageHandler = async (event: unknown, newPage: number) => {
		servicesInquiry.page = newPage + 1;
		setServicesInquiry({ ...servicesInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		servicesInquiry.limit = parseInt(event.target.value, 10);
		servicesInquiry.page = 1;
		setServicesInquiry({ ...servicesInquiry });
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		setSearchText('');

		const newInquiry = { ...servicesInquiry, page: 1, sort: 'createdAt' };

		if (newValue !== 'ALL') {
			newInquiry.status = newValue as ServiceStatus;
		} else {
			delete newInquiry.status;
		}

		setServicesInquiry(newInquiry);
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
			setServicesInquiry({
				...servicesInquiry,
				page: 1,
				search: {
					...servicesInquiry.search,
					text: searchText,
				},
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const bookingTypeHandler = async (newValue: string) => {
		try {
			setBookingTypeFilter(newValue);

			const newInquiry = { ...servicesInquiry, page: 1, sort: 'createdAt' };

			if (newValue !== 'ALL') {
				newInquiry.bookingType = newValue as BookingType;
			} else {
				delete newInquiry.bookingType;
			}

			setServicesInquiry(newInquiry);
		} catch (err: any) {
			console.log('bookingTypeHandler: ', err.message);
		}
	};

	const getStatusClass = (status: ServiceStatus) => {
		switch (status) {
			case ServiceStatus.ACTIVE:
				return 'success';
			case ServiceStatus.INACTIVE:
				return '';
			default:
				return '';
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Services Management
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<Box component={'div'}>
						<List className={'tab-menu'}>
							<ListItem onClick={(e: any) => tabChangeHandler(e, 'ALL')} value="ALL" className={value === 'ALL' ? 'li on' : 'li'}>
								All
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, ServiceStatus.ACTIVE)} value={ServiceStatus.ACTIVE} className={value === ServiceStatus.ACTIVE ? 'li on' : 'li'}>
								Active
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, ServiceStatus.INACTIVE)} value={ServiceStatus.INACTIVE} className={value === ServiceStatus.INACTIVE ? 'li on' : 'li'}>
								Inactive
							</ListItem>
						</List>
						<Divider />
						<Stack className={'search-area'} sx={{ m: '24px' }} direction="row" spacing={2}>
							<OutlinedInput
								value={searchText}
								onChange={(e: any) => textHandler(e.target.value)}
								sx={{ flex: 1 }}
								className={'search'}
								placeholder="Search services"
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
													setServicesInquiry({
														...servicesInquiry,
														search: {
															...servicesInquiry.search,
															text: '',
														},
													});
													await getAllServicesByAdminRefetch({ input: servicesInquiry });
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

					{getAllServicesByAdminLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
							<Typography>Loading...</Typography>
						</Box>
					) : getAllServicesByAdminError ? (
						<Box sx={{ p: 3 }}>
							<Typography color="error">Error loading services: {getAllServicesByAdminError.message}</Typography>
						</Box>
					) : (
						<>
							<TableContainer>
								<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
									<TableHead>
										<TableRow>
											<TableCell>Service ID</TableCell>
											<TableCell>Title</TableCell>
											<TableCell>Description</TableCell>
											<TableCell>Booking Type</TableCell>
											<TableCell>Price</TableCell>
											<TableCell>Duration Options</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Created Date</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{services.length === 0 && (
											<TableRow>
												<TableCell align="center" colSpan={8}>
													<span className={'no-data'}>data not found!</span>
												</TableCell>
											</TableRow>
										)}

										{services.length !== 0 &&
											services.map((service: Service) => (
												<TableRow hover key={service?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
													<TableCell align="left">{service._id.substring(0, 8)}...</TableCell>
													<TableCell align="left">
														<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
															{service.title}
														</Typography>
													</TableCell>
													<TableCell align="left">
														<Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
															{service.description || '-'}
														</Typography>
													</TableCell>
													<TableCell align="left">{service.bookingType?.replace(/_/g, ' ')}</TableCell>
													<TableCell align="left">
														{service.fixedPrice ? `$${(service.fixedPrice / 100).toFixed(2)}` : service.pricePerHour ? `$${(service.pricePerHour / 100).toFixed(2)}/hr` : '-'}
													</TableCell>
													<TableCell align="left">
														{service.durationOptions && service.durationOptions.length > 0
															? service.durationOptions.map((d) => `${d} min`).join(', ')
															: '-'}
													</TableCell>
													<TableCell align="center">
														<Button className={`badge ${getStatusClass(service.status)}`} sx={{ textTransform: 'none' }}>
															{service.status}
														</Button>
													</TableCell>
													<TableCell align="left">{service.createdAt ? format(new Date(service.createdAt), 'MMM dd, yyyy') : '-'}</TableCell>
												</TableRow>
											))}
									</TableBody>
								</Table>
							</TableContainer>

							<TablePagination
								rowsPerPageOptions={[10, 20, 40, 60]}
								component="div"
								count={servicesTotal}
								rowsPerPage={servicesInquiry?.limit}
								page={servicesInquiry?.page - 1}
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

AdminServices.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
	},
};

export default withAdminLayout(AdminServices);


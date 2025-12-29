import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, InputAdornment, List, ListItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, MenuItem, Avatar } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useQuery } from '@apollo/client';
import { GET_ALL_PROPERTIES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { format } from 'date-fns';
import { REACT_APP_API_URL } from '../../../libs/config';

interface Property {
	_id: string;
	propertyType: string;
	propertyStatus: string;
	propertyLocation?: string;
	propertyAddress?: string;
	propertyTitle: string;
	propertyPrice: number;
	priceType?: string;
	propertyRating: number;
	propertyViews: number;
	propertyLikes: number;
	propertyComments: number;
	propertyImages?: string[];
	propertyDesc?: string;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
}

interface AllPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: string;
	search?: {
		propertyType?: string;
		propertyStatus?: string;
		text?: string;
	};
}

const AdminProperties: NextPage = ({ initialInquiry, ...props }: any) => {
	const [propertiesInquiry, setPropertiesInquiry] = useState<AllPropertiesInquiry>(initialInquiry);
	const [properties, setProperties] = useState<Property[]>([]);
	const [propertiesTotal, setPropertiesTotal] = useState<number>(0);
	const [value, setValue] = useState<string>('ALL');
	const [searchText, setSearchText] = useState('');
	const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('ALL');

	const {
		loading: getAllPropertiesByAdminLoading,
		data: getAllPropertiesByAdminData,
		error: getAllPropertiesByAdminError,
		refetch: getAllPropertiesByAdminRefetch,
	} = useQuery(GET_ALL_PROPERTIES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: propertiesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProperties(data?.getAllPropertiesByAdmin?.list || []);
			setPropertiesTotal(data?.getAllPropertiesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		getAllPropertiesByAdminRefetch({ input: propertiesInquiry }).then();
	}, [propertiesInquiry]);

	const changePageHandler = async (event: unknown, newPage: number) => {
		propertiesInquiry.page = newPage + 1;
		setPropertiesInquiry({ ...propertiesInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		propertiesInquiry.limit = parseInt(event.target.value, 10);
		propertiesInquiry.page = 1;
		setPropertiesInquiry({ ...propertiesInquiry });
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		setSearchText('');

		const newInquiry = { ...propertiesInquiry, page: 1, sort: 'createdAt' };

		if (newValue !== 'ALL') {
			newInquiry.search = { ...newInquiry.search, propertyStatus: newValue };
		} else {
			if (newInquiry.search) {
				delete newInquiry.search.propertyStatus;
			}
		}

		setPropertiesInquiry(newInquiry);
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
			setPropertiesInquiry({
				...propertiesInquiry,
				page: 1,
				search: {
					...propertiesInquiry.search,
					text: searchText,
				},
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const propertyTypeHandler = async (newValue: string) => {
		try {
			setPropertyTypeFilter(newValue);

			const newInquiry = { ...propertiesInquiry, page: 1, sort: 'createdAt' };

			if (newValue !== 'ALL') {
				newInquiry.search = { ...newInquiry.search, propertyType: newValue };
			} else {
				if (newInquiry.search) {
					delete newInquiry.search.propertyType;
				}
			}

			setPropertiesInquiry(newInquiry);
		} catch (err: any) {
			console.log('propertyTypeHandler: ', err.message);
		}
	};

	const getStatusClass = (status: string) => {
		switch (status) {
			case 'ACTIVE':
				return 'success';
			case 'INACTIVE':
				return '';
			default:
				return '';
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Properties Management
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<Box component={'div'}>
						<List className={'tab-menu'}>
							<ListItem onClick={(e: any) => tabChangeHandler(e, 'ALL')} value="ALL" className={value === 'ALL' ? 'li on' : 'li'}>
								All
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, 'ACTIVE')} value="ACTIVE" className={value === 'ACTIVE' ? 'li on' : 'li'}>
								Active
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, 'INACTIVE')} value="INACTIVE" className={value === 'INACTIVE' ? 'li on' : 'li'}>
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
								placeholder="Search properties"
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
													setPropertiesInquiry({
														...propertiesInquiry,
														search: {
															...propertiesInquiry.search,
															text: '',
														},
													});
													await getAllPropertiesByAdminRefetch({ input: propertiesInquiry });
												}}
											/>
										)}
										<InputAdornment position="end" onClick={() => searchTextHandler()}>
											<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
										</InputAdornment>
									</>
								}
							/>
							<Select sx={{ width: '200px' }} value={propertyTypeFilter} onChange={(e) => propertyTypeHandler(e.target.value)}>
								<MenuItem value={'ALL'}>All Types</MenuItem>
								{/* Add property types as needed */}
							</Select>
						</Stack>
						<Divider />
					</Box>

					{getAllPropertiesByAdminLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
							<Typography>Loading...</Typography>
						</Box>
					) : getAllPropertiesByAdminError ? (
						<Box sx={{ p: 3 }}>
							<Typography color="error">Error loading properties: {getAllPropertiesByAdminError.message}</Typography>
						</Box>
					) : (
						<>
							<TableContainer>
								<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
									<TableHead>
										<TableRow>
											<TableCell>Image</TableCell>
											<TableCell>Title</TableCell>
											<TableCell>Address</TableCell>
											<TableCell>Type</TableCell>
											<TableCell>Price</TableCell>
											<TableCell>Rating</TableCell>
											<TableCell>Views</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Created Date</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{properties.length === 0 && (
											<TableRow>
												<TableCell align="center" colSpan={9}>
													<span className={'no-data'}>data not found!</span>
												</TableCell>
											</TableRow>
										)}

										{properties.length !== 0 &&
											properties.map((property: Property) => {
												const propertyImage =
													property.propertyImages && property.propertyImages.length > 0
														? `${REACT_APP_API_URL}/${property.propertyImages[0]}`
														: '/img/property/default.png';

												return (
													<TableRow hover key={property?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
														<TableCell align="left">
															<Avatar src={propertyImage} variant="rounded" sx={{ width: 56, height: 56 }} />
														</TableCell>
														<TableCell align="left">
															<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
																{property.propertyTitle}
															</Typography>
														</TableCell>
														<TableCell align="left">
															<Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
																{property.propertyAddress || property.propertyLocation || '-'}
															</Typography>
														</TableCell>
														<TableCell align="left">{property.propertyType || '-'}</TableCell>
														<TableCell align="left">${((property.propertyPrice || 0) / 100).toFixed(2)}</TableCell>
														<TableCell align="left">{property.propertyRating?.toFixed(1) || '-'}</TableCell>
														<TableCell align="left">{property.propertyViews || 0}</TableCell>
														<TableCell align="center">
															<Button className={`badge ${getStatusClass(property.propertyStatus)}`} sx={{ textTransform: 'none' }}>
																{property.propertyStatus}
															</Button>
														</TableCell>
														<TableCell align="left">{property.createdAt ? format(new Date(property.createdAt), 'MMM dd, yyyy') : '-'}</TableCell>
													</TableRow>
												);
											})}
									</TableBody>
								</Table>
							</TableContainer>

							<TablePagination
								rowsPerPageOptions={[10, 20, 40, 60]}
								component="div"
								count={propertiesTotal}
								rowsPerPage={propertiesInquiry?.limit}
								page={propertiesInquiry?.page - 1}
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

AdminProperties.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

export default withAdminLayout(AdminProperties);


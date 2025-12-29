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
import { SubscriptionsInquiry } from '../../../libs/types/subscription/subscription.input';
import { Subscription } from '../../../libs/types/subscription/subscription';
import { SubscriptionStatus, SubscriptionPlan, SubscriptionPeriod } from '../../../libs/enums/subscription.enum';
import { useQuery } from '@apollo/client';
import { GET_SUBSCRIPTIONS_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { format } from 'date-fns';

const AdminSubscriptions: NextPage = ({ initialInquiry, ...props }: any) => {
	const [subscriptionsInquiry, setSubscriptionsInquiry] = useState<SubscriptionsInquiry>(initialInquiry);
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
	const [subscriptionsTotal, setSubscriptionsTotal] = useState<number>(0);
	const [value, setValue] = useState<string>('ALL');
	const [searchText, setSearchText] = useState('');
	const [planFilter, setPlanFilter] = useState<string>('ALL');

	const {
		loading: getSubscriptionsByAdminLoading,
		data: getSubscriptionsByAdminData,
		error: getSubscriptionsByAdminError,
		refetch: getSubscriptionsByAdminRefetch,
	} = useQuery(GET_SUBSCRIPTIONS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: subscriptionsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setSubscriptions(data?.getSubscriptionsByAdmin?.list || []);
			setSubscriptionsTotal(data?.getSubscriptionsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		getSubscriptionsByAdminRefetch({ input: subscriptionsInquiry }).then();
	}, [subscriptionsInquiry]);

	const changePageHandler = async (event: unknown, newPage: number) => {
		subscriptionsInquiry.page = newPage + 1;
		setSubscriptionsInquiry({ ...subscriptionsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		subscriptionsInquiry.limit = parseInt(event.target.value, 10);
		subscriptionsInquiry.page = 1;
		setSubscriptionsInquiry({ ...subscriptionsInquiry });
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		setSearchText('');

		const newInquiry = { ...subscriptionsInquiry, page: 1, sort: 'createdAt' };

		if (newValue !== 'ALL') {
			newInquiry.search = { ...newInquiry.search, subscriptionStatus: newValue as SubscriptionStatus };
		} else {
			if (newInquiry.search) {
				delete newInquiry.search.subscriptionStatus;
			}
		}

		setSubscriptionsInquiry(newInquiry);
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
			setSubscriptionsInquiry({
				...subscriptionsInquiry,
				page: 1,
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const planHandler = async (newValue: string) => {
		try {
			setPlanFilter(newValue);

			const newInquiry = { ...subscriptionsInquiry, page: 1, sort: 'createdAt' };

			if (newValue !== 'ALL') {
				newInquiry.search = { ...newInquiry.search, subscriptionPlan: newValue as SubscriptionPlan };
			} else {
				if (newInquiry.search) {
					delete newInquiry.search.subscriptionPlan;
				}
			}

			setSubscriptionsInquiry(newInquiry);
		} catch (err: any) {
			console.log('planHandler: ', err.message);
		}
	};

	const getStatusClass = (status: SubscriptionStatus) => {
		switch (status) {
			case SubscriptionStatus.ACTIVE:
				return 'success';
			case SubscriptionStatus.EXPIRED:
				return 'warning';
			case SubscriptionStatus.CANCELLED:
				return 'error';
			default:
				return '';
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Subscriptions Management
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<Box component={'div'}>
						<List className={'tab-menu'}>
							<ListItem onClick={(e: any) => tabChangeHandler(e, 'ALL')} value="ALL" className={value === 'ALL' ? 'li on' : 'li'}>
								All
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, SubscriptionStatus.ACTIVE)} value={SubscriptionStatus.ACTIVE} className={value === SubscriptionStatus.ACTIVE ? 'li on' : 'li'}>
								Active
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, SubscriptionStatus.EXPIRED)} value={SubscriptionStatus.EXPIRED} className={value === SubscriptionStatus.EXPIRED ? 'li on' : 'li'}>
								Expired
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, SubscriptionStatus.CANCELLED)} value={SubscriptionStatus.CANCELLED} className={value === SubscriptionStatus.CANCELLED ? 'li on' : 'li'}>
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
								placeholder="Search subscriptions"
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
													await getSubscriptionsByAdminRefetch({ input: subscriptionsInquiry });
												}}
											/>
										)}
										<InputAdornment position="end" onClick={() => searchTextHandler()}>
											<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
										</InputAdornment>
									</>
								}
							/>
							<Select sx={{ width: '200px' }} value={planFilter} onChange={(e) => planHandler(e.target.value)}>
								<MenuItem value={'ALL'}>All Plans</MenuItem>
								{Object.values(SubscriptionPlan).map((plan) => (
									<MenuItem key={plan} value={plan}>
										{plan}
									</MenuItem>
								))}
							</Select>
						</Stack>
						<Divider />
					</Box>

					{getSubscriptionsByAdminLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
							<Typography>Loading...</Typography>
						</Box>
					) : getSubscriptionsByAdminError ? (
						<Box sx={{ p: 3 }}>
							<Typography color="error">Error loading subscriptions: {getSubscriptionsByAdminError.message}</Typography>
						</Box>
					) : (
						<>
							<TableContainer>
								<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
									<TableHead>
										<TableRow>
											<TableCell>Subscription ID</TableCell>
											<TableCell>Member ID</TableCell>
											<TableCell>Plan</TableCell>
											<TableCell>Period</TableCell>
											<TableCell>Base Price</TableCell>
											<TableCell>Discount</TableCell>
											<TableCell>Final Price</TableCell>
											<TableCell>Start Date</TableCell>
											<TableCell>End Date</TableCell>
											<TableCell>Auto Renewal</TableCell>
											<TableCell>Status</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{subscriptions.length === 0 && (
											<TableRow>
												<TableCell align="center" colSpan={11}>
													<span className={'no-data'}>data not found!</span>
												</TableCell>
											</TableRow>
										)}

										{subscriptions.length !== 0 &&
											subscriptions.map((subscription: Subscription) => (
												<TableRow hover key={subscription?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
													<TableCell align="left">{subscription._id.substring(0, 8)}...</TableCell>
													<TableCell align="left">{subscription.memberId?.substring(0, 8)}...</TableCell>
													<TableCell align="left">{subscription.subscriptionPlan}</TableCell>
													<TableCell align="left">{subscription.subscriptionPeriod}</TableCell>
													<TableCell align="left">${((subscription.basePrice || 0) / 100).toFixed(2)}</TableCell>
													<TableCell align="left">
														{subscription.discountPercentage ? `${subscription.discountPercentage}%` : '-'}
													</TableCell>
													<TableCell align="left">
														<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
															${((subscription.finalPrice || 0) / 100).toFixed(2)}
														</Typography>
													</TableCell>
													<TableCell align="left">{subscription.startDate ? format(new Date(subscription.startDate), 'MMM dd, yyyy') : '-'}</TableCell>
													<TableCell align="left">{subscription.endDate ? format(new Date(subscription.endDate), 'MMM dd, yyyy') : '-'}</TableCell>
													<TableCell align="center">
														{subscription.autoRenewal ? (
															<Button className={'badge success'} sx={{ textTransform: 'none' }}>
																Yes
															</Button>
														) : (
															<Button className={'badge'} sx={{ textTransform: 'none' }}>
																No
															</Button>
														)}
													</TableCell>
													<TableCell align="center">
														<Button className={`badge ${getStatusClass(subscription.subscriptionStatus)}`} sx={{ textTransform: 'none' }}>
															{subscription.subscriptionStatus}
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
								count={subscriptionsTotal}
								rowsPerPage={subscriptionsInquiry?.limit}
								page={subscriptionsInquiry?.page - 1}
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

AdminSubscriptions.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

export default withAdminLayout(AdminSubscriptions);


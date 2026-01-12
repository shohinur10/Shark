import React, { ChangeEvent, useEffect, useState, useMemo } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination, Typography, Grid, Card, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Alert, Skeleton } from '@mui/material';
import TrainerCard from '../../libs/components/common/TrainerCard';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { T } from '../../libs/types/common';
import { GET_TRAINERS } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import { userVar } from '../../apollo/store';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TrainerList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [trainers, setTrainers] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');
	const [sortBy, setSortBy] = useState<'createdAt' | 'memberLikes' | 'memberViews'>('createdAt');

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const {
		loading: getTrainersLoading,
		data: getTrainersData,
		error: getTrainersError,
		refetch: getTrainersRefetch,
	} = useQuery(GET_TRAINERS, {
		fetchPolicy: 'network-only',
		variables: { 
			input: {
				...searchFilter,
				sort: sortBy,
				direction: sortBy === 'createdAt' ? 'DESC' : 'DESC',
				search: {
					...searchFilter.search,
					text: searchText || undefined,
				},
			},
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrainers(data?.getTrainers?.list);
			setTotal(data?.getTrainers?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const input_obj = JSON.parse(router?.query?.input as string);
			setSearchFilter(input_obj);
		} else
			router.replace(`/trainer?input=${JSON.stringify(searchFilter)}`, `/trainer?input=${JSON.stringify(searchFilter)}`);

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** HANDLERS **/
	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/trainer?input=${JSON.stringify(searchFilter)}`, `/trainer?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	const likeMemberHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: { memberId: id },
			});

			await getTrainersRefetch({ input: searchFilter });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Error, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handleSortChange = (newSort: 'createdAt' | 'memberLikes' | 'memberViews') => {
		setSortBy(newSort);
		setCurrentPage(1);
	};

	const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setCurrentPage(1);
			getTrainersRefetch();
		}
	};

	if (device === 'mobile') {
		return <h1>TRAINERS PAGE MOBILE</h1>;
	} else {
		return (
			<Stack className={'trainer-list-page'} sx={{ p: 4 }}>
				<Stack className={'container'} sx={{ maxWidth: 1200, mx: 'auto' }}>
					{/* Header with Create Buttons for Trainers */}
					{(user?.memberType === 'TRAINER' || user?.memberType === 'ADMIN') && (
						<Box sx={{ mb: 4 }}>
							<Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
								Trainer Dashboard
							</Typography>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<Card
										sx={{
											cursor: 'pointer',
											transition: 'transform 0.2s, box-shadow 0.2s',
											'&:hover': {
												transform: 'translateY(-4px)',
												boxShadow: 4,
											},
											height: '100%',
										}}
										onClick={() => router.push('/trainer/workouts/create')}
									>
										<CardContent>
											<Stack direction="row" spacing={2} alignItems="center">
												<Box
													sx={{
														p: 2,
														borderRadius: 2,
														backgroundColor: '#E0F7FA',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													<FitnessCenterIcon sx={{ fontSize: 40, color: '#4ECDC4' }} />
												</Box>
												<Box sx={{ flex: 1 }}>
													<Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
														Create Workout
													</Typography>
													<Typography variant="body2" color="text.secondary">
														Design a comprehensive workout routine
													</Typography>
												</Box>
												<AddIcon sx={{ color: 'text.secondary' }} />
											</Stack>
										</CardContent>
									</Card>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Card
										sx={{
											cursor: 'pointer',
											transition: 'transform 0.2s, box-shadow 0.2s',
											'&:hover': {
												transform: 'translateY(-4px)',
												boxShadow: 4,
											},
											height: '100%',
										}}
										onClick={() => router.push('/trainer/meal-plans/create')}
									>
										<CardContent>
											<Stack direction="row" spacing={2} alignItems="center">
												<Box
													sx={{
														p: 2,
														borderRadius: 2,
														backgroundColor: '#FFE5E5',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													<RestaurantIcon sx={{ fontSize: 40, color: '#FF6B6B' }} />
												</Box>
												<Box sx={{ flex: 1 }}>
													<Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
														Create Meal Plan
													</Typography>
													<Typography variant="body2" color="text.secondary">
														Design a comprehensive meal plan
													</Typography>
												</Box>
												<AddIcon sx={{ color: 'text.secondary' }} />
											</Stack>
										</CardContent>
									</Card>
								</Grid>
							</Grid>
						</Box>
					)}

					{/* Trainer Cards Section */}
					<Box sx={{ mb: 3 }}>
						<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
							<Typography variant="h5" sx={{ fontWeight: 600 }}>
								All Trainers
							</Typography>
						</Stack>
						
						{/* Search and Sort */}
						<Stack direction="row" spacing={2} sx={{ mb: 3 }}>
							<TextField
								placeholder="Search for a trainer"
								value={searchText}
								onChange={(e: any) => setSearchText(e.target.value)}
								onKeyDown={handleSearch}
								sx={{ flex: 1 }}
								InputProps={{
									startAdornment: <SearchIcon sx={{ color: '#9E9E9E', mr: 1 }} />,
								}}
							/>
							<FormControl sx={{ minWidth: 200 }}>
								<InputLabel>Sort by</InputLabel>
								<Select value={sortBy} label="Sort by" onChange={(e) => handleSortChange(e.target.value as any)}>
									<MenuItem value="createdAt">Recent</MenuItem>
									<MenuItem value="memberLikes">Most Liked</MenuItem>
									<MenuItem value="memberViews">Most Viewed</MenuItem>
								</Select>
							</FormControl>
						</Stack>
						</Box>

					{/* Loading State */}
					{getTrainersLoading ? (
						<Grid container spacing={3}>
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<Grid item xs={12} sm={6} md={4} key={i}>
									<Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
								</Grid>
							))}
						</Grid>
					) : getTrainersError ? (
						<Alert severity="error" sx={{ mb: 2 }}>
							Error loading trainers. Please try again.
							<Button onClick={() => getTrainersRefetch()} sx={{ ml: 2 }}>
								Retry
								</Button>
						</Alert>
					) : (
						<>
					<Stack className={'card-wrap'}>
						{trainers?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Trainers found!</p>
							</div>
						) : (
							trainers.map((trainer: Member) => {
										return <TrainerCard trainer={trainer} key={trainer._id} likeMemberHandler={likeMemberHandler} />;
							})
						)}
					</Stack>

							<Stack className={'pagination'} sx={{ mt: 4 }}>
						<Stack className="pagination-box">
							{trainers.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
								<Stack className="pagination-box">
									<Pagination
										page={currentPage}
										count={Math.ceil(total / searchFilter.limit)}
										onChange={paginationChangeHandler}
										shape="circular"
										color="primary"
									/>
								</Stack>
							)}
						</Stack>

						{trainers.length !== 0 && (
							<span>
								Total {total} trainer{total > 1 ? 's' : ''} available
							</span>
						)}
					</Stack>
						</>
					)}
				</Stack>
			</Stack>
		);
	}
};

TrainerList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(TrainerList);

import React, { useState, ChangeEvent } from 'react';
import { NextPage } from 'next';
import {
	Stack,
	Box,
	Typography,
	Button,
	Grid,
	Card,
	CardContent,
	CardMedia,
	TextField,
	InputAdornment,
	Chip,
	Pagination,
	CircularProgress,
	Tabs,
	Tab,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_MEAL_PLANS } from '../../../apollo/user/query';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Direction } from '../../../libs/types/enums/common.enum';
import { MealPlanStatus } from '../../../libs/enums/nutrition.enum';
import { format } from 'date-fns';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TrainerMealPlans: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const trainerId = user?._id;
	const [searchText, setSearchText] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [filterStatus, setFilterStatus] = useState<MealPlanStatus | 'all'>('all');
	const limit = 12;

	// Fetch meal plans
	const { data: mealPlansData, loading: mealPlansLoading, refetch: refetchMealPlans } = useQuery(GET_MEAL_PLANS, {
		skip: !trainerId,
		variables: {
			input: {
				page: currentPage,
				limit: limit,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					createdBy: trainerId,
					text: searchText || undefined,
				},
			},
		},
	});

	const mealPlans = mealPlansData?.getMealPlans?.list || [];
	const totalMealPlans = mealPlansData?.getMealPlans?.metaCounter[0]?.total || 0;

	// Filter by status
	const filteredMealPlans = mealPlans.filter((plan: any) => {
		if (filterStatus === 'all') return true;
		return plan.mealPlanStatus === filterStatus;
	});

	const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setCurrentPage(1);
			refetchMealPlans();
		}
	};

	const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
	};

	const handleStatusFilter = (event: React.SyntheticEvent, newValue: MealPlanStatus | 'all') => {
		setFilterStatus(newValue);
		setCurrentPage(1);
	};

	const getStatusColor = (status: MealPlanStatus) => {
		switch (status) {
			case MealPlanStatus.PUBLISHED:
				return 'success';
			case MealPlanStatus.DRAFT:
				return 'warning';
			case MealPlanStatus.ARCHIVED:
				return 'default';
			default:
				return 'default';
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'trainer-meal-plans-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">My Meal Plans</Typography>
					<div>MOBILE MEAL PLANS PAGE</div>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'trainer-meal-plans-page'}>
			<Stack className={'container'}>
				{/* Page Header */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
					<Box>
						<Typography variant="h3" className={'page-title'}>
							My Meal Plans
						</Typography>
						<Typography variant="body1" className={'page-subtitle'}>
							Create and manage your meal plans
						</Typography>
					</Box>
					<Link href="/trainer/meal-plans/create">
						<Button variant="contained" startIcon={<AddIcon />} size="large">
							Create Meal Plan
						</Button>
					</Link>
				</Stack>

				{/* Filters and Search */}
				<Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center" justifyContent="space-between">
					<TextField
						placeholder="Search meal plans..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={handleSearch}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
						sx={{ flexGrow: 1, maxWidth: 400 }}
					/>
					<Tabs value={filterStatus} onChange={handleStatusFilter}>
						<Tab label="All" value="all" />
						<Tab label="Published" value={MealPlanStatus.PUBLISHED} />
						<Tab label="Draft" value={MealPlanStatus.DRAFT} />
						<Tab label="Archived" value={MealPlanStatus.ARCHIVED} />
					</Tabs>
				</Stack>

				{/* Meal Plans Grid */}
				{mealPlansLoading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
						<CircularProgress />
					</Box>
				) : filteredMealPlans.length === 0 ? (
					<Card>
						<CardContent>
							<Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
								<RestaurantIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
								<Typography variant="h6" color="text.secondary">
									No meal plans found
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{searchText ? 'Try adjusting your search' : 'Create your first meal plan to get started'}
								</Typography>
								<Link href="/trainer/meal-plans/create">
									<Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }}>
										Create Meal Plan
									</Button>
								</Link>
							</Stack>
						</CardContent>
					</Card>
				) : (
					<>
						<Grid container spacing={3} sx={{ mb: 4 }}>
							{filteredMealPlans.map((plan: any) => (
								<Grid item xs={12} sm={6} md={4} lg={3} key={plan._id}>
									<Card
										sx={{
											cursor: 'pointer',
											transition: 'transform 0.2s, box-shadow 0.2s',
											'&:hover': {
												transform: 'translateY(-4px)',
												boxShadow: 4,
											},
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
										}}
									>
										{plan.mealPlanImage && (
											<CardMedia
												component="img"
												height="200"
												image={plan.mealPlanImage}
												alt={plan.mealPlanTitle}
											/>
										)}
										<CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
											<Stack spacing={2}>
												<Box>
													<Typography variant="h6" gutterBottom noWrap>
														{plan.mealPlanTitle}
													</Typography>
													<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
														{plan.mealPlanDesc || 'No description'}
													</Typography>
												</Box>
												<Stack direction="row" spacing={1} flexWrap="wrap">
													<Chip
														label={plan.mealPlanStatus}
														color={getStatusColor(plan.mealPlanStatus)}
														size="small"
													/>
													{plan.isPremium && (
														<Chip label="Premium" color="primary" size="small" variant="outlined" />
													)}
												</Stack>
												<Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
													<Typography variant="caption" color="text.secondary">
														{plan.mealPlanViews || 0} views
													</Typography>
													<Typography variant="caption" color="text.secondary">
														{plan.mealPlanLikes || 0} likes
													</Typography>
													{plan.mealPlanRating > 0 && (
														<Typography variant="caption" color="text.secondary">
															⭐ {plan.mealPlanRating.toFixed(1)}
														</Typography>
													)}
												</Stack>
												<Stack direction="row" spacing={1} sx={{ mt: 2 }}>
													<Button
														variant="outlined"
														size="small"
														fullWidth
														startIcon={<VisibilityIcon />}
														onClick={(e) => {
															e.stopPropagation();
															router.push(`/trainer/meal-plans/${plan._id}`);
														}}
													>
														View
													</Button>
													<Button
														variant="outlined"
														size="small"
														startIcon={<EditIcon />}
														onClick={(e) => {
															e.stopPropagation();
															router.push(`/trainer/meal-plans/${plan._id}/edit`);
														}}
													>
														Edit
													</Button>
												</Stack>
											</Stack>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>

						{/* Pagination */}
						{Math.ceil(totalMealPlans / limit) > 1 && (
							<Stack alignItems="center" sx={{ mt: 4 }}>
								<Pagination
									count={Math.ceil(totalMealPlans / limit)}
									page={currentPage}
									onChange={handlePageChange}
									color="primary"
									size="large"
								/>
							</Stack>
						)}
					</>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(TrainerMealPlans);


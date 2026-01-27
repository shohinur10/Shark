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
import { MealPlan } from '../../types/mealplan/mealplan';
import { GET_MEAL_PLANS } from '../../../apollo/user/query';
import { MealPlansInquiry } from '../../types/mealplan/mealplan.input';
import { Direction } from '../../enums/common.enum';
import Link from 'next/link';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { REACT_APP_API_URL } from '../../config';

const MyMealPlans: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [searchMealPlans, setSearchMealPlans] = useState<MealPlansInquiry>({
		...initialInput,
		search: {} as any,
	});
	const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: mealPlansLoading,
		data: mealPlansData,
		error: getMealPlansError,
		refetch: mealPlansRefetch,
	} = useQuery(GET_MEAL_PLANS, {
		fetchPolicy: 'network-only',
		variables: { input: searchMealPlans },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			const allMealPlans = data?.getMealPlans?.list || [];
			const userMealPlans = allMealPlans.filter((mealPlan: MealPlan) => mealPlan.createdBy === user._id);
			setMealPlans(userMealPlans);
			setTotalCount(data?.getMealPlans?.metaCounter?.[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchMealPlans({ ...searchMealPlans, page: value });
	};

	if (device === 'mobile') {
		return <>MEAL PLANS PAGE MOBILE</>;
	} else
		return (
			<div id="my-meal-plans-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Meal Plan Routines</Typography>
						<Typography className="sub-title">Manage and view your meal plan routines</Typography>
					</Stack>
				</Stack>
				<Stack spacing={3} sx={{ mt: 3 }}>
					{mealPlansLoading ? (
						<Box component="div" sx={{ textAlign: 'center', py: 4 }}>
							<Typography sx={{ color: '#6B6B6B' }}>Loading meal plans...</Typography>
						</Box>
					) : mealPlans?.length > 0 ? (
						<>
							{mealPlans.map((mealPlan: MealPlan) => (
								<Card
									key={mealPlan._id}
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
												<RestaurantIcon sx={{ fontSize: '24px', color: '#E10600' }} />
												<Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111111' }}>
													{mealPlan.mealPlanTitle}
												</Typography>
											</Stack>
											<Button
												component={Link}
												href={`/nutrition/meal-plans/${mealPlan._id}`}
												variant="outlined"
												size="small"
												endIcon={<ArrowForwardIcon />}
												sx={{
													textTransform: 'none',
													borderColor: '#E10600',
													color: '#E10600',
													'&:hover': {
														borderColor: '#C10500',
														backgroundColor: 'rgba(225, 6, 0, 0.08)',
													},
												}}
											>
												View Details
											</Button>
										</Stack>
										<Divider sx={{ borderColor: '#E5E5E5' }} />
										{mealPlan.mealPlanDesc && (
											<Typography sx={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.6 }}>
												{mealPlan.mealPlanDesc.length > 200
													? `${mealPlan.mealPlanDesc.substring(0, 200)}...`
													: mealPlan.mealPlanDesc}
											</Typography>
										)}
										<Stack direction="row" spacing={1} flexWrap="wrap">
											<Chip
												label={mealPlan.nutritionGoal?.replace(/_/g, ' ') || 'N/A'}
												size="small"
												sx={{
													height: '24px',
													fontSize: '12px',
													backgroundColor: '#F5F5F5',
													color: '#616161',
												}}
											/>
											{mealPlan.duration && (
												<Chip
													label={`${mealPlan.duration} days`}
													size="small"
													sx={{
														height: '24px',
														fontSize: '12px',
														backgroundColor: '#F5F5F5',
														color: '#616161',
													}}
												/>
											)}
											{mealPlan.calorieTarget && (
												<Chip
													label={`${mealPlan.calorieTarget} cal`}
													size="small"
													sx={{
														height: '24px',
														fontSize: '12px',
														backgroundColor: '#F5F5F5',
														color: '#616161',
													}}
												/>
											)}
											{mealPlan.macros && (
												<Chip
													label={`P: ${mealPlan.macros.protein}g | C: ${mealPlan.macros.carbs}g | F: ${mealPlan.macros.fats}g`}
													size="small"
													sx={{
														height: '24px',
														fontSize: '12px',
														backgroundColor: '#F5F5F5',
														color: '#616161',
													}}
												/>
											)}
										</Stack>
										<Stack direction="row" spacing={2} sx={{ pt: 1 }}>
											<Typography sx={{ fontSize: '13px', color: '#6B6B6B' }}>
												<strong>Views:</strong> {mealPlan.mealPlanViews || 0}
											</Typography>
											<Typography sx={{ fontSize: '13px', color: '#6B6B6B' }}>
												<strong>Likes:</strong> {mealPlan.mealPlanLikes || 0}
											</Typography>
											<Typography sx={{ fontSize: '13px', color: '#6B6B6B' }}>
												<strong>Followers:</strong> {mealPlan.mealPlanFollowers || 0}
											</Typography>
										</Stack>
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
							<RestaurantIcon sx={{ fontSize: '64px', color: '#E5E5E5', mb: 2 }} />
							<Typography sx={{ fontSize: '18px', color: '#6B6B6B', mb: 1, fontWeight: 600 }}>
								No meal plan routines found!
							</Typography>
							<Typography sx={{ fontSize: '14px', color: '#6B6B6B', mb: 3 }}>
								Start creating your meal plan routines or connect with a trainer
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
								Connect with Trainer
							</Button>
						</Box>
					)}
				</Stack>

				{mealPlans?.length > 0 && (
					<Stack className="pagination-conf" sx={{ mt: 4 }}>
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(totalCount / (searchMealPlans.limit || 6))}
								page={searchMealPlans.page || 1}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total">
							<Typography>Total {totalCount ?? 0} meal plan(s) available</Typography>
						</Stack>
					</Stack>
				)}
			</div>
		);
};

MyMealPlans.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	},
};

export default MyMealPlans;


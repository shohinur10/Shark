import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Chip, Divider, LinearProgress, IconButton, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useQuery } from '@apollo/client';
import { GET_MEAL_PLAN } from '../../../apollo/user/query';
import { MealPlan } from '../../../libs/types/mealplan/mealplan';
import { T } from '../../../libs/types/common';
import { NutritionGoal, DietaryPreference, MealType } from '../../../libs/enums/nutrition.enum';

export const getServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MealPlanDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const device = useDeviceDetect();

	// Fetch meal plan data
	const {
		loading,
		data: mealPlanData,
		error: mealPlanError,
	} = useQuery(GET_MEAL_PLAN, {
		skip: !id || typeof id !== 'string',
		fetchPolicy: 'cache-and-network',
		variables: { input: id as string },
		onCompleted: (data: T) => {
			// Data is available in mealPlanData
		},
	});

	const mealPlan: MealPlan | null = mealPlanData?.getMealPlan || null;

	const formatNutritionGoal = (goal: NutritionGoal): string => {
		return goal.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const formatDietaryPreference = (pref: DietaryPreference): string => {
		return pref.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const formatMealType = (type: MealType): string => {
		return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	if (device === 'mobile') {
		if (loading) {
			return (
				<Stack className={'meal-plan-detail-page'}>
					<Stack className={'container'}>
						<Box display="flex" justifyContent="center" p={4}>
							<CircularProgress />
						</Box>
					</Stack>
				</Stack>
			);
		}

		if (!mealPlan) {
			return (
				<Stack className={'meal-plan-detail-page'}>
					<Stack className={'container'}>
						<Typography variant="h6" color="error">Meal plan not found</Typography>
					</Stack>
				</Stack>
			);
		}

		return (
			<Stack className={'meal-plan-detail-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">{mealPlan.mealPlanTitle}</Typography>
					<Typography variant="body1" color="text.secondary">
						{mealPlan.mealPlanDesc || 'No description available.'}
					</Typography>
					<Button variant="contained" fullWidth startIcon={<PlayArrowIcon />} sx={{ mt: 2 }}>
						Start This Plan
					</Button>
				</Stack>
			</Stack>
		);
	} else {
		if (loading) {
			return (
				<Stack className={'meal-plan-detail-page'}>
					<Stack className={'container'}>
						<Box display="flex" justifyContent="center" p={4}>
							<CircularProgress />
						</Box>
					</Stack>
				</Stack>
			);
		}

		if (!mealPlan) {
			return (
				<Stack className={'meal-plan-detail-page'}>
					<Stack className={'container'}>
						<Typography variant="h4" color="error">Meal plan not found</Typography>
						<Typography variant="body1" color="text.secondary">
							The meal plan you're looking for doesn't exist or has been removed.
						</Typography>
					</Stack>
				</Stack>
			);
		}

		// Group meals by day
		const mealsByDay = mealPlan.meals?.reduce((acc: any, meal) => {
			if (!acc[meal.day]) {
				acc[meal.day] = [];
			}
			acc[meal.day].push(meal);
			return acc;
		}, {}) || {};

		return (
			<Stack className={'meal-plan-detail-page'}>
				<Stack className={'container'}>
					{/* Hero Header */}
					<Box className={'meal-plan-hero'}>
						<Box
							className={'meal-plan-hero-image'}
							style={{
								backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/img/bodybuilders/pexels-gabflicks-13122470.jpg')`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						>
							<Box className={'hero-overlay'}>
								<Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
									<Chip label={formatNutritionGoal(mealPlan.nutritionGoal)} className={'goal-chip-hero'} />
									<Chip label={`${mealPlan.duration} days`} className={'duration-chip-hero'} />
									{mealPlan.mealPlanRating > 0 && (
										<Chip 
											icon={<StarIcon />} 
											label={mealPlan.mealPlanRating.toFixed(1)} 
											className={'rating-chip-hero'} 
										/>
									)}
									{mealPlan.isPremium && (
										<Chip label="Premium" color="warning" className={'premium-chip-hero'} />
									)}
									{mealPlan.dietaryPreference && mealPlan.dietaryPreference.length > 0 && (
										mealPlan.dietaryPreference.map((pref, idx) => (
											<Chip 
												key={idx}
												label={formatDietaryPreference(pref)} 
												className={'diet-chip-hero'} 
											/>
										))
									)}
								</Stack>
								<Typography variant="h2" className={'meal-plan-hero-title'}>
									{mealPlan.mealPlanTitle}
								</Typography>
								<Typography variant="body1" className={'meal-plan-hero-description'}>
									{mealPlan.mealPlanDesc || 'A comprehensive meal plan designed to help you achieve your nutrition goals.'}
								</Typography>
								{mealPlan.memberData && (
									<Typography variant="body2" className={'meal-plan-creator'} mt={1}>
										By {mealPlan.memberData.memberFullName || mealPlan.memberData.memberNick}
									</Typography>
								)}
								<Stack direction="row" spacing={2} mt={3}>
									<Button variant="contained" size="large" startIcon={<PlayArrowIcon />} className={'start-plan-btn-hero'}>
										Start This Plan
									</Button>
									<Button variant="outlined" size="large" startIcon={<ShoppingCartIcon />} className={'shopping-list-btn'}>
										Download Shopping List
									</Button>
									<IconButton className={'action-icon-btn'}>
										<FavoriteBorderIcon />
									</IconButton>
									<IconButton className={'action-icon-btn'}>
										<ShareIcon />
									</IconButton>
								</Stack>
							</Box>
						</Box>
					</Box>

					{/* Nutrition Stats */}
					<Box className={'nutrition-stats-section'}>
						<Typography variant="h5" className={'section-title'} gutterBottom>
							Daily Nutrition Targets
						</Typography>
						<Grid container spacing={3} mt={1}>
							<Grid item xs={12} md={3}>
								<Card className={'nutrition-stat-card'}>
									<CardContent>
										<Stack direction="row" alignItems="center" spacing={1} mb={2}>
											<LocalFireDepartmentIcon className={'stat-icon'} />
											<Typography variant="body2" className={'stat-label'}>
												Calories
											</Typography>
										</Stack>
										<Typography variant="h3" className={'stat-value'}>
											{mealPlan.calorieTarget}
										</Typography>
										<Typography variant="caption" className={'stat-unit'}>
											per day
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							{mealPlan.macros && (
								<>
									<Grid item xs={12} md={3}>
										<Card className={'nutrition-stat-card protein'}>
											<CardContent>
												<Stack direction="row" alignItems="center" spacing={1} mb={2}>
													<RestaurantIcon className={'stat-icon'} />
													<Typography variant="body2" className={'stat-label'}>
														Protein
													</Typography>
												</Stack>
												<Typography variant="h3" className={'stat-value'}>
													{mealPlan.macros.protein}g
												</Typography>
												<LinearProgress variant="determinate" value={85} className={'stat-progress'} />
											</CardContent>
										</Card>
									</Grid>
									<Grid item xs={12} md={3}>
										<Card className={'nutrition-stat-card carbs'}>
											<CardContent>
												<Stack direction="row" alignItems="center" spacing={1} mb={2}>
													<RestaurantIcon className={'stat-icon'} />
													<Typography variant="body2" className={'stat-label'}>
														Carbs
													</Typography>
												</Stack>
												<Typography variant="h3" className={'stat-value'}>
													{mealPlan.macros.carbs}g
												</Typography>
												<LinearProgress variant="determinate" value={75} className={'stat-progress'} />
											</CardContent>
										</Card>
									</Grid>
									<Grid item xs={12} md={3}>
										<Card className={'nutrition-stat-card fats'}>
											<CardContent>
												<Stack direction="row" alignItems="center" spacing={1} mb={2}>
													<RestaurantIcon className={'stat-icon'} />
													<Typography variant="body2" className={'stat-label'}>
														Fats
													</Typography>
												</Stack>
												<Typography variant="h3" className={'stat-value'}>
													{mealPlan.macros.fats}g
												</Typography>
												<LinearProgress variant="determinate" value={70} className={'stat-progress'} />
											</CardContent>
										</Card>
									</Grid>
								</>
							)}
						</Grid>
					</Box>

					{/* Daily Meals */}
					{mealPlan.meals && mealPlan.meals.length > 0 && (
						<Box className={'daily-meals-section'}>
							<Typography variant="h5" className={'section-title'} gutterBottom>
								Meal Breakdown
							</Typography>
							{Object.keys(mealsByDay).length > 0 ? (
								Object.keys(mealsByDay).map((day) => (
									<Box key={day} mb={4}>
										<Typography variant="h6" className={'day-title'} gutterBottom>
											Day {day}
										</Typography>
										<Grid container spacing={3} mt={1}>
											{mealsByDay[day].map((meal: any, index: number) => (
												<Grid item xs={12} md={6} key={index}>
													<Card className={'meal-card'}>
														<CardContent>
															<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
																<Typography variant="h6" className={'meal-type'}>
																	{formatMealType(meal.mealType)}
																</Typography>
																<Chip
																	icon={<LocalFireDepartmentIcon />}
																	label={`${meal.calories} cal`}
																	size="small"
																	className={'meal-calorie-chip'}
																/>
															</Stack>
															<Typography variant="h6" className={'meal-name'} mb={2}>
																{meal.mealName}
															</Typography>
															<Grid container spacing={2} mb={2}>
																<Grid item xs={4}>
																	<Box className={'meal-macro'}>
																		<Typography variant="caption" color="text.secondary">
																			Protein
																		</Typography>
																		<Typography variant="body2" fontWeight={600}>
																			{meal.protein}g
																		</Typography>
																	</Box>
																</Grid>
																<Grid item xs={4}>
																	<Box className={'meal-macro'}>
																		<Typography variant="caption" color="text.secondary">
																			Carbs
																		</Typography>
																		<Typography variant="body2" fontWeight={600}>
																			{meal.carbs}g
																		</Typography>
																	</Box>
																</Grid>
																<Grid item xs={4}>
																	<Box className={'meal-macro'}>
																		<Typography variant="caption" color="text.secondary">
																			Fats
																		</Typography>
																		<Typography variant="body2" fontWeight={600}>
																			{meal.fats}g
																		</Typography>
																	</Box>
																</Grid>
															</Grid>
															{meal.ingredients && meal.ingredients.length > 0 && (
																<>
																	<Divider sx={{ my: 2 }} />
																	<Typography variant="body2" className={'meal-items-label'} gutterBottom>
																		Ingredients:
																	</Typography>
																	<Stack spacing={1}>
																		{meal.ingredients.map((ingredient: string, idx: number) => (
																			<Stack key={idx} direction="row" alignItems="center" spacing={1}>
																				<CheckCircleIcon className={'check-icon'} fontSize="small" />
																				<Typography variant="body2">{ingredient}</Typography>
																			</Stack>
																		))}
																	</Stack>
																</>
															)}
															{meal.instructions && (
																<>
																	<Divider sx={{ my: 2 }} />
																	<Typography variant="body2" className={'meal-items-label'} gutterBottom>
																		Instructions:
																	</Typography>
																	<Typography variant="body2" color="text.secondary">
																		{meal.instructions}
																	</Typography>
																</>
															)}
														</CardContent>
													</Card>
												</Grid>
											))}
										</Grid>
									</Box>
								))
							) : (
								<Grid container spacing={3} mt={1}>
									{mealPlan.meals.map((meal, index) => (
										<Grid item xs={12} md={6} key={index}>
											<Card className={'meal-card'}>
												<CardContent>
													<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
														<Typography variant="h6" className={'meal-type'}>
															{formatMealType(meal.mealType)}
														</Typography>
														<Chip
															icon={<LocalFireDepartmentIcon />}
															label={`${meal.calories} cal`}
															size="small"
															className={'meal-calorie-chip'}
														/>
													</Stack>
													<Typography variant="h6" className={'meal-name'} mb={2}>
														{meal.mealName}
													</Typography>
													<Grid container spacing={2} mb={2}>
														<Grid item xs={4}>
															<Box className={'meal-macro'}>
																<Typography variant="caption" color="text.secondary">
																	Protein
																</Typography>
																<Typography variant="body2" fontWeight={600}>
																	{meal.protein}g
																</Typography>
															</Box>
														</Grid>
														<Grid item xs={4}>
															<Box className={'meal-macro'}>
																<Typography variant="caption" color="text.secondary">
																	Carbs
																</Typography>
																<Typography variant="body2" fontWeight={600}>
																	{meal.carbs}g
																</Typography>
															</Box>
														</Grid>
														<Grid item xs={4}>
															<Box className={'meal-macro'}>
																<Typography variant="caption" color="text.secondary">
																	Fats
																</Typography>
																<Typography variant="body2" fontWeight={600}>
																	{meal.fats}g
																</Typography>
															</Box>
														</Grid>
													</Grid>
													{meal.ingredients && meal.ingredients.length > 0 && (
														<>
															<Divider sx={{ my: 2 }} />
															<Typography variant="body2" className={'meal-items-label'} gutterBottom>
																Ingredients:
															</Typography>
															<Stack spacing={1}>
																{meal.ingredients.map((ingredient: string, idx: number) => (
																	<Stack key={idx} direction="row" alignItems="center" spacing={1}>
																		<CheckCircleIcon className={'check-icon'} fontSize="small" />
																		<Typography variant="body2">{ingredient}</Typography>
																	</Stack>
																))}
															</Stack>
														</>
													)}
													{meal.instructions && (
														<>
															<Divider sx={{ my: 2 }} />
															<Typography variant="body2" className={'meal-items-label'} gutterBottom>
																Instructions:
															</Typography>
															<Typography variant="body2" color="text.secondary">
																{meal.instructions}
															</Typography>
														</>
													)}
												</CardContent>
											</Card>
										</Grid>
									))}
								</Grid>
							)}
						</Box>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(MealPlanDetailPage);






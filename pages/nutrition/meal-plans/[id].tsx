import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Chip, Divider, LinearProgress, IconButton } from '@mui/material';
import useDeviceDetect from '../../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../../libs/components/layout/LayoutBasic';
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

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MealPlanDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const device = useDeviceDetect();
	const [mealPlan, setMealPlan] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (id) {
			setLoading(false);
		}
	}, [id]);

	if (device === 'mobile') {
		return <div>MOBILE MEAL PLAN DETAIL</div>;
	} else {
		// Sample data for demonstration
		const sampleMealPlan = {
			name: 'Muscle Gain Meal Plan',
			goal: 'Muscle Gain',
			duration: 30,
			calories: 2800,
			protein: 200,
			carbs: 300,
			fats: 100,
			rating: 4.8,
			views: 1250,
			description: 'A comprehensive 30-day meal plan designed to support muscle growth and recovery. This plan includes high-protein meals, balanced macros, and nutrient-dense foods to fuel your workouts and maximize gains.',
			image: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
		};

		const dailyMeals = [
			{ type: 'Breakfast', calories: 650, protein: 45, carbs: 80, fats: 15, items: ['Oatmeal with berries', 'Greek yogurt', 'Scrambled eggs', 'Whole grain toast'] },
			{ type: 'Lunch', calories: 750, protein: 55, carbs: 90, fats: 20, items: ['Grilled chicken breast', 'Brown rice', 'Steamed vegetables', 'Avocado'] },
			{ type: 'Dinner', calories: 850, protein: 60, carbs: 100, fats: 25, items: ['Salmon fillet', 'Sweet potato', 'Broccoli', 'Quinoa salad'] },
			{ type: 'Snacks', calories: 550, protein: 40, carbs: 30, fats: 40, items: ['Protein shake', 'Almonds', 'Banana', 'Protein bar'] },
		];

		return (
			<Stack className={'meal-plan-detail-page'}>
				<Stack className={'container'}>
					{/* Hero Header */}
					<Box className={'meal-plan-hero'}>
						<Box
							className={'meal-plan-hero-image'}
							style={{
								backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${sampleMealPlan.image})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						>
							<Box className={'hero-overlay'}>
								<Stack direction="row" spacing={2} mb={2}>
									<Chip label={sampleMealPlan.goal} className={'goal-chip-hero'} />
									<Chip label={`${sampleMealPlan.duration} days`} className={'duration-chip-hero'} />
									<Chip icon={<StarIcon />} label={sampleMealPlan.rating} className={'rating-chip-hero'} />
								</Stack>
								<Typography variant="h2" className={'meal-plan-hero-title'}>
									{sampleMealPlan.name}
								</Typography>
								<Typography variant="body1" className={'meal-plan-hero-description'}>
									{sampleMealPlan.description}
								</Typography>
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
											{sampleMealPlan.calories}
										</Typography>
										<Typography variant="caption" className={'stat-unit'}>
											per day
										</Typography>
									</CardContent>
								</Card>
							</Grid>
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
											{sampleMealPlan.protein}g
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
											{sampleMealPlan.carbs}g
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
											{sampleMealPlan.fats}g
										</Typography>
										<LinearProgress variant="determinate" value={70} className={'stat-progress'} />
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</Box>

					{/* Daily Meals */}
					<Box className={'daily-meals-section'}>
						<Typography variant="h5" className={'section-title'} gutterBottom>
							Daily Meal Breakdown
						</Typography>
						<Grid container spacing={3} mt={1}>
							{dailyMeals.map((meal, index) => (
								<Grid item xs={12} md={6} key={index}>
									<Card className={'meal-card'}>
										<CardContent>
											<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
												<Typography variant="h6" className={'meal-type'}>
													{meal.type}
												</Typography>
												<Chip
													icon={<LocalFireDepartmentIcon />}
													label={`${meal.calories} cal`}
													size="small"
													className={'meal-calorie-chip'}
												/>
											</Stack>
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
											<Divider sx={{ my: 2 }} />
											<Typography variant="body2" className={'meal-items-label'} gutterBottom>
												Meal Items:
											</Typography>
											<Stack spacing={1}>
												{meal.items.map((item, idx) => (
													<Stack key={idx} direction="row" alignItems="center" spacing={1}>
														<CheckCircleIcon className={'check-icon'} fontSize="small" />
														<Typography variant="body2">{item}</Typography>
													</Stack>
												))}
											</Stack>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(MealPlanDetailPage);






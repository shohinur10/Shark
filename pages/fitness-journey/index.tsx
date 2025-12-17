import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Tabs, Tab, Chip, LinearProgress, IconButton } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIconOutlined from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import StraightenIcon from '@mui/icons-material/Straighten';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import StarIcon from '@mui/icons-material/Star';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import Link from 'next/link';
import { ProgressType, MeasurementUnit } from '../../libs/enums/progress.enum';
import { BodyMeasurements } from '../../libs/types/progress/progress';
import { NutritionGoal, DietaryPreference } from '../../libs/enums/nutrition.enum';
import { MealPlan } from '../../libs/types/mealplan/mealplan';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Combined Why It Matters - Enhanced Data
const whyFitnessJourneyData = [
	{
		stat: '80%',
		title: 'Nutrition Impact',
		description: 'Proper nutrition accounts for 80% of your fitness results, making it the foundation of success',
		icon: <RestaurantIcon />,
		color: '#4caf50',
	},
	{
		stat: '75%',
		title: 'Goal Achievement',
		description: 'People who track both progress and nutrition are 75% more likely to achieve their fitness goals',
		icon: <CheckCircleIcon />,
		color: '#2196f3',
	},
	{
		stat: '3x',
		title: 'Faster Results',
		description: 'Combining progress tracking with proper nutrition leads to 3x faster results',
		icon: <TrendingUpIconOutlined />,
		color: '#ff9800',
	},
	{
		stat: '90%',
		title: 'Stay Motivated',
		description: '90% of users report increased motivation when they see both progress and nutrition data together',
		icon: <WhatshotIcon />,
		color: '#f44336',
	},
];

// Enhanced motivation content
const motivationContent = [
	{
		id: '1',
		type: 'video',
		thumbnail: '/img/videos/4443524-hd_1080_1614_25fps.mp4',
		title: 'Transform Your Body',
		category: 'Motivation',
	},
	{
		id: '2',
		type: 'image',
		thumbnail: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
		title: 'Success Stories',
		category: 'Inspiration',
	},
	{
		id: '3',
		type: 'image',
		thumbnail: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
		title: 'Fitness Journey',
		category: 'Progress',
	},
];

// Sample meal plans
const sampleMealPlans: Partial<MealPlan>[] = [
	{
		_id: '1',
		mealPlanTitle: 'Muscle Gain Meal Plan',
		nutritionGoal: NutritionGoal.MUSCLE_GAIN,
		dietaryPreference: [DietaryPreference.HIGH_PROTEIN],
		duration: 30,
		calorieTarget: 2800,
		macros: { protein: 200, carbs: 300, fats: 100 },
		mealPlanViews: 1250,
		mealPlanLikes: 89,
		mealPlanRating: 4.8,
		isPremium: false,
		price: 0,
	},
	{
		_id: '2',
		mealPlanTitle: 'Weight Loss Program',
		nutritionGoal: NutritionGoal.WEIGHT_LOSS,
		dietaryPreference: [DietaryPreference.LOW_CARB],
		duration: 21,
		calorieTarget: 1500,
		macros: { protein: 120, carbs: 100, fats: 60 },
		mealPlanViews: 2100,
		mealPlanLikes: 156,
		mealPlanRating: 4.9,
		isPremium: true,
		price: 29.99,
	},
];

const FitnessJourneyPage: NextPage = () => {
	const device = useDeviceDetect();
	const [tabValue, setTabValue] = useState(0);
	const [currentStats] = useState({
		weight: 75.5,
		targetWeight: 70,
		bodyFat: 18.5,
		muscleMass: 58.2,
		bmi: 24.2,
		lastUpdated: '2024-01-15',
	});
	const [todayNutrition] = useState({
		calories: 1450,
		targetCalories: 2000,
		protein: 120,
		targetProtein: 150,
		carbs: 180,
		targetCarbs: 250,
		fats: 45,
		targetFats: 65,
	});
	const [bodyMeasurements] = useState<BodyMeasurements>({
		chest: 102,
		waist: 85,
		hips: 95,
		biceps: 35,
		thighs: 58,
		calves: 38,
	});

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const calculateProgress = (current: number, target: number) => {
		return Math.min((current / target) * 100, 100);
	};

	const formatGoal = (goal: string) => {
		return goal.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	if (device === 'mobile') {
		return (
			<Stack className={'fitness-journey-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Fitness Journey</Typography>
					<div>MOBILE FITNESS JOURNEY PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'fitness-journey-page'}>
				<Stack className={'container'}>
					{/* Enhanced Page Header */}
					<Stack className={'page-header'}>
						<Typography variant="h2" className={'page-title'}>
							Your Fitness Journey
						</Typography>
						<Typography variant="h6" className={'page-subtitle'}>
							Track your progress, fuel your body, and achieve your goals
						</Typography>
					</Stack>

					{/* Hero Section with Video */}
					<Box className={'hero-section'}>
						<Grid container spacing={3}>
							<Grid item xs={12} md={8}>
								<Box className={'hero-video'}>
									<video
										className={'motivation-video'}
										poster="/img/bodybuilders/pexels-gabflicks-13122470.jpg"
										controls
										autoPlay
										muted
										loop
									>
										<source src="/img/videos/4443524-hd_1080_1614_25fps.mp4" type="video/mp4" />
									</video>
									<Box className={'video-overlay'}>
										<Typography variant="h3" className={'video-title'}>
											Your Transformation Starts Here
										</Typography>
										<Typography variant="body1" className={'video-subtitle'}>
											Track every milestone, fuel your body right, celebrate every victory
										</Typography>
									</Box>
								</Box>
							</Grid>
							<Grid item xs={12} md={4}>
								<Box className={'motivation-grid'}>
									{motivationContent.slice(1).map((item) => (
										<Box key={item.id} className={'motivation-item'}>
											<Box
												className={'motivation-thumbnail'}
												style={{
													backgroundImage: `url(${item.thumbnail})`,
													backgroundSize: 'cover',
													backgroundPosition: 'center',
												}}
											>
												<Box className={'thumbnail-overlay'}>
													<IconButton className={'play-btn'}>
														<PlayArrowIcon />
													</IconButton>
												</Box>
											</Box>
											<Box className={'motivation-info'}>
												<Chip label={item.category} size="small" className={'category-chip'} />
												<Typography variant="body2" className={'motivation-title'}>
													{item.title}
												</Typography>
											</Box>
										</Box>
									))}
								</Box>
							</Grid>
						</Grid>
					</Box>

					{/* Why It Matters Section - Enhanced */}
					<Box className={'why-matters-section'}>
						<Typography variant="h4" className={'section-title'} gutterBottom>
							Why Track Your Fitness Journey?
						</Typography>
						<Typography variant="body1" className={'section-description'} paragraph>
							Combining progress tracking with proper nutrition creates a powerful synergy. When you monitor both your body's changes and what you fuel it with, you unlock the full potential of your fitness transformation.
						</Typography>
						<Grid container spacing={3} className={'stats-grid'}>
							{whyFitnessJourneyData.map((item, index) => (
								<Grid item xs={12} sm={6} md={3} key={index}>
									<Card className={'stat-card'} style={{ borderTop: `4px solid ${item.color}` }}>
										<CardContent>
											<Box className={'stat-icon'} style={{ color: item.color }}>
												{item.icon}
											</Box>
											<Typography variant="h3" className={'stat-number'}>
												{item.stat}
											</Typography>
											<Typography variant="h6" className={'stat-title'}>
												{item.title}
											</Typography>
											<Typography variant="body2" className={'stat-description'}>
												{item.description}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					</Box>

					{/* Unified Dashboard - Progress & Nutrition Side by Side */}
					<Box className={'unified-dashboard'}>
						<Typography variant="h5" className={'dashboard-title'} gutterBottom>
							Today's Overview
						</Typography>
						<Grid container spacing={3}>
							{/* Progress Metrics */}
							<Grid item xs={12} md={6}>
								<Card className={'dashboard-card progress-card'}>
									<CardContent>
										<Stack direction="row" alignItems="center" spacing={1} mb={3}>
											<FitnessCenterIcon className={'section-icon'} />
											<Typography variant="h6" className={'card-title'}>
												Progress Metrics
											</Typography>
										</Stack>
										<Grid container spacing={2}>
											<Grid item xs={6}>
												<Box className={'metric-box'}>
													<Stack direction="row" alignItems="center" spacing={1} mb={1}>
														<MonitorWeightIcon className={'metric-icon'} />
														<Typography variant="body2" className={'metric-label'}>
															Weight
														</Typography>
													</Stack>
													<Typography variant="h5" className={'metric-value'}>
														{currentStats.weight} kg
													</Typography>
													<Typography variant="caption" className={'metric-target'}>
														Target: {currentStats.targetWeight} kg
													</Typography>
													<LinearProgress
														variant="determinate"
														value={calculateProgress(currentStats.weight, currentStats.targetWeight)}
														className={'metric-progress'}
													/>
												</Box>
											</Grid>
											<Grid item xs={6}>
												<Box className={'metric-box'}>
													<Stack direction="row" alignItems="center" spacing={1} mb={1}>
														<StraightenIcon className={'metric-icon'} />
														<Typography variant="body2" className={'metric-label'}>
															Body Fat
														</Typography>
													</Stack>
													<Typography variant="h5" className={'metric-value'}>
														{currentStats.bodyFat}%
													</Typography>
													<Typography variant="caption" className={'metric-target'}>
														Last updated: {currentStats.lastUpdated}
													</Typography>
													<LinearProgress
														variant="determinate"
														value={currentStats.bodyFat}
														className={'metric-progress'}
													/>
												</Box>
											</Grid>
											<Grid item xs={6}>
												<Box className={'metric-box'}>
													<Stack direction="row" alignItems="center" spacing={1} mb={1}>
														<FitnessCenterIcon className={'metric-icon'} />
														<Typography variant="body2" className={'metric-label'}>
															Muscle Mass
														</Typography>
													</Stack>
													<Typography variant="h5" className={'metric-value'}>
														{currentStats.muscleMass} kg
													</Typography>
													<Typography variant="caption" className={'metric-target'}>
														Healthy range: 50-65 kg
													</Typography>
													<LinearProgress
														variant="determinate"
														value={(currentStats.muscleMass / 65) * 100}
														className={'metric-progress'}
													/>
												</Box>
											</Grid>
											<Grid item xs={6}>
												<Box className={'metric-box'}>
													<Stack direction="row" alignItems="center" spacing={1} mb={1}>
														<TrendingUpIcon className={'metric-icon'} />
														<Typography variant="body2" className={'metric-label'}>
															BMI
														</Typography>
													</Stack>
													<Typography variant="h5" className={'metric-value'}>
														{currentStats.bmi}
													</Typography>
													<Typography variant="caption" className={'metric-target'}>
														Normal range: 18.5-24.9
													</Typography>
													<LinearProgress
														variant="determinate"
														value={(currentStats.bmi / 30) * 100}
														className={'metric-progress'}
													/>
												</Box>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>

							{/* Nutrition Metrics */}
							<Grid item xs={12} md={6}>
								<Card className={'dashboard-card nutrition-card'}>
									<CardContent>
										<Stack direction="row" alignItems="center" spacing={1} mb={3}>
											<RestaurantIcon className={'section-icon'} />
											<Typography variant="h6" className={'card-title'}>
												Today's Nutrition
											</Typography>
										</Stack>
										{/* Calories */}
										<Box className={'nutrition-progress-section'} mb={3}>
											<Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
												<Typography variant="body1" className={'macro-label'}>
													<LocalFireDepartmentIcon className={'calorie-icon'} />
													Calories
												</Typography>
												<Typography variant="h6" className={'macro-value'}>
													{todayNutrition.calories} / {todayNutrition.targetCalories}
												</Typography>
											</Stack>
											<LinearProgress
												variant="determinate"
												value={(todayNutrition.calories / todayNutrition.targetCalories) * 100}
												className={'calorie-progress'}
											/>
										</Box>
										{/* Macros */}
										<Grid container spacing={2}>
											<Grid item xs={4}>
												<Box className={'macro-card protein'}>
													<Typography variant="h5" className={'macro-amount'}>
														{todayNutrition.protein}g
													</Typography>
													<Typography variant="body2" className={'macro-target'}>
														of {todayNutrition.targetProtein}g
													</Typography>
													<LinearProgress
														variant="determinate"
														value={(todayNutrition.protein / todayNutrition.targetProtein) * 100}
														className={'macro-progress'}
													/>
													<Typography variant="caption" className={'macro-name'}>
														Protein
													</Typography>
												</Box>
											</Grid>
											<Grid item xs={4}>
												<Box className={'macro-card carbs'}>
													<Typography variant="h5" className={'macro-amount'}>
														{todayNutrition.carbs}g
													</Typography>
													<Typography variant="body2" className={'macro-target'}>
														of {todayNutrition.targetCarbs}g
													</Typography>
													<LinearProgress
														variant="determinate"
														value={(todayNutrition.carbs / todayNutrition.targetCarbs) * 100}
														className={'macro-progress'}
													/>
													<Typography variant="caption" className={'macro-name'}>
														Carbs
													</Typography>
												</Box>
											</Grid>
											<Grid item xs={4}>
												<Box className={'macro-card fats'}>
													<Typography variant="h5" className={'macro-amount'}>
														{todayNutrition.fats}g
													</Typography>
													<Typography variant="body2" className={'macro-target'}>
														of {todayNutrition.targetFats}g
													</Typography>
													<LinearProgress
														variant="determinate"
														value={(todayNutrition.fats / todayNutrition.targetFats) * 100}
														className={'macro-progress'}
													/>
													<Typography variant="caption" className={'macro-name'}>
														Fats
													</Typography>
												</Box>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</Box>

					{/* Enhanced Tabs */}
					<Box className={'journey-tabs'}>
						<Tabs value={tabValue} onChange={handleTabChange} className={'custom-tabs'}>
							<Tab label="Overview" icon={<TrendingUpIcon />} iconPosition="start" />
							<Tab label="Body Measurements" icon={<AssessmentIcon />} iconPosition="start" />
							<Tab label="Meal Plans" icon={<MenuBookIcon />} iconPosition="start" />
							<Tab label="Progress Photos" icon={<PhotoCameraIcon />} iconPosition="start" />
						</Tabs>
					</Box>

					{/* Tab Content */}
					{tabValue === 0 && (
						<Card className={'overview-card'}>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Progress Charts & Nutrition Trends
								</Typography>
								<Box className={'charts-placeholder'} sx={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
									<Typography variant="body2" color="text.secondary">
										Combined progress and nutrition charts will appear here
									</Typography>
								</Box>
							</CardContent>
						</Card>
					)}

					{/* Body Measurements Tab */}
					{tabValue === 1 && (
						<Card className={'measurements-card'}>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
									<Typography variant="h5" className={'section-title'}>
										Body Measurements
									</Typography>
									<Button variant="contained" startIcon={<AddIcon />} className={'add-btn'}>
										Add Measurement
									</Button>
								</Stack>
								<Grid container spacing={3}>
									{Object.entries(bodyMeasurements).map(([key, value]) => (
										<Grid item xs={12} sm={6} md={4} key={key}>
											<Card className={'measurement-item'}>
												<CardContent>
													<Typography variant="body2" className={'measurement-label'} gutterBottom>
														{key.charAt(0).toUpperCase() + key.slice(1)}
													</Typography>
													<Typography variant="h4" className={'measurement-value'}>
														{value} cm
													</Typography>
													<Box className={'measurement-trend'}>
														<TrendingUpIcon className={'trend-icon'} />
														<Typography variant="caption" className={'trend-text'}>
															+2.5 cm this month
														</Typography>
													</Box>
												</CardContent>
											</Card>
										</Grid>
									))}
								</Grid>
							</CardContent>
						</Card>
					)}

					{/* Meal Plans Tab */}
					{tabValue === 2 && (
						<Box className={'meal-plans-section'}>
							<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
								<Box>
									<Typography variant="h5" className={'section-title'} gutterBottom>
										Recommended Meal Plans
									</Typography>
									<Typography variant="body1" className={'section-description'}>
										Structured meal plans designed to support your fitness goals
									</Typography>
								</Box>
								<Button variant="contained" className={'browse-all-btn'}>
									Browse All Meal Plans
								</Button>
							</Stack>
							<Grid container spacing={3}>
								{sampleMealPlans.map((plan, index) => (
									<Grid item xs={12} md={6} key={plan._id}>
										<Link href={`/nutrition/meal-plans/${plan._id}`}>
											<Card className={'meal-plan-card'}>
												<CardContent
													style={{
														backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${index === 0 ? '/img/bodybuilders/pexels-gabflicks-13122470.jpg' : '/img/bodybuilders/pexels-kuiyibo-13958866.jpg'})`,
														backgroundSize: 'cover',
														backgroundPosition: 'center',
														minHeight: 300,
														display: 'flex',
														flexDirection: 'column',
														justifyContent: 'space-between',
														color: '#ffffff',
													}}
												>
													<Box>
														{plan.isPremium && (
															<Chip label="Premium" className={'premium-badge'} size="small" />
														)}
													</Box>
													<Box>
														<Typography variant="h5" className={'meal-plan-title'} gutterBottom>
															{plan.mealPlanTitle}
														</Typography>
														<Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
															<Chip label={formatGoal(plan.nutritionGoal || '')} size="small" className={'goal-chip'} />
															{plan.dietaryPreference && plan.dietaryPreference.length > 0 && (
																<Chip
																	label={formatGoal(plan.dietaryPreference[0])}
																	size="small"
																	className={'diet-chip'}
																/>
															)}
														</Stack>
														<Stack direction="row" spacing={2} mb={2}>
															<Box>
																<Typography variant="caption" style={{ opacity: 0.9 }}>
																	Duration
																</Typography>
																<Typography variant="body2" fontWeight={600}>
																	{plan.duration} days
																</Typography>
															</Box>
															<Box>
																<Typography variant="caption" style={{ opacity: 0.9 }}>
																	Calories/Day
																</Typography>
																<Typography variant="body2" fontWeight={600}>
																	{plan.calorieTarget}
																</Typography>
															</Box>
														</Stack>
														<Stack direction="row" justifyContent="space-between" alignItems="center">
															<Stack direction="row" spacing={1} alignItems="center">
																<StarIcon style={{ color: '#ffa726' }} />
																<Typography variant="body2">{plan.mealPlanRating?.toFixed(1)}</Typography>
															</Stack>
															{plan.isPremium && (
																<Typography variant="h6" className={'price'}>
																	${plan.price}
																</Typography>
															)}
														</Stack>
													</Box>
												</CardContent>
											</Card>
										</Link>
									</Grid>
								))}
							</Grid>
						</Box>
					)}

					{/* Progress Photos Tab */}
					{tabValue === 3 && (
						<Card>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
									<Typography variant="h6">Progress Photos</Typography>
									<Button variant="contained" startIcon={<AddIcon />}>
										Upload Photo
									</Button>
								</Stack>
								<Box className={'photos-placeholder'} sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
									<Typography variant="body2" color="text.secondary">
										No photos uploaded yet
									</Typography>
								</Box>
							</CardContent>
						</Card>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(FitnessJourneyPage);










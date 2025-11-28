import { NextPage } from 'next';
import { Stack, Box, Typography, Tabs, Tab, Button, Grid, Card, CardContent, CardMedia, Chip, LinearProgress, IconButton, TextField, Select, MenuItem, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, FormLabel, Divider } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIconOutlined from '@mui/icons-material/TrendingUp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CalculateIcon from '@mui/icons-material/Calculate';
import Link from 'next/link';
import { NutritionGoal, DietaryPreference } from '../../libs/enums/nutrition.enum';
import { MealPlan } from '../../libs/types/mealplan/mealplan';
import { Recipe, RecipeTag } from '../../libs/types/recipe/recipe';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Why Nutrition Matters - Compelling Data
const whyNutritionMattersData = [
	{
		stat: '80%',
		title: 'Faster Results',
		description: 'Proper nutrition accounts for 80% of your fitness results, making it the most important factor',
		icon: <TrendingUpIconOutlined />,
	},
	{
		stat: '3x',
		title: 'Better Recovery',
		description: 'Optimal nutrition leads to 3x faster muscle recovery and improved performance',
		icon: <FitnessCenterIcon />,
	},
	{
		stat: '90%',
		title: 'Energy Boost',
		description: '90% of users report increased energy levels and better focus with proper meal planning',
		icon: <WhatshotIcon />,
	},
	{
		stat: '2.5x',
		title: 'Goal Achievement',
		description: 'People following structured meal plans achieve their goals 2.5x faster than those who don\'t',
		icon: <CheckCircleIcon />,
	},
];

// Sample nutrition inspiration content
const nutritionContent = [
	{
		id: '1',
		type: 'video',
		thumbnail: '/img/videos/4443524-hd_1080_1614_25fps.mp4',
		title: 'Transform Through Nutrition',
		category: 'Motivation',
	},
	{
		id: '2',
		type: 'image',
		thumbnail: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
		title: 'Healthy Recipes',
		category: 'Recipes',
	},
	{
		id: '3',
		type: 'image',
		thumbnail: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
		title: 'Meal Prep Success',
		category: 'Meal Plans',
	},
];

// Sample vitamins data - in production, this would come from API
const vitaminsData = [
	{
		id: '1',
		name: 'Vitamin D3',
		benefits: ['Bone Health', 'Immune Support', 'Mood Enhancement'],
		dosage: '1000 IU',
		image: '/img/vitamins/vitamin-d3.jpg',
		category: 'Essential Vitamins',
		rating: 4.8,
	},
	{
		id: '2',
		name: 'Omega-3 Fish Oil',
		benefits: ['Heart Health', 'Brain Function', 'Anti-Inflammatory'],
		dosage: '1000mg',
		image: '/img/vitamins/omega-3.jpg',
		category: 'Fatty Acids',
		rating: 4.9,
	},
	{
		id: '3',
		name: 'Multivitamin Complex',
		benefits: ['Daily Nutrition', 'Energy Support', 'Overall Wellness'],
		dosage: '1 Tablet',
		image: '/img/vitamins/multivitamin.jpg',
		category: 'Multivitamins',
		rating: 4.7,
	},
	{
		id: '4',
		name: 'Vitamin B12',
		benefits: ['Energy Production', 'Nerve Health', 'Red Blood Cells'],
		dosage: '500mcg',
		image: '/img/vitamins/vitamin-b12.jpg',
		category: 'B Vitamins',
		rating: 4.6,
	},
	{
		id: '5',
		name: 'Magnesium',
		benefits: ['Muscle Function', 'Sleep Quality', 'Stress Relief'],
		dosage: '400mg',
		image: '/img/vitamins/magnesium.jpg',
		category: 'Minerals',
		rating: 4.8,
	},
	{
		id: '6',
		name: 'Probiotics',
		benefits: ['Digestive Health', 'Gut Flora', 'Immune System'],
		dosage: '10 Billion CFU',
		image: '/img/vitamins/probiotics.jpg',
		category: 'Supplements',
		rating: 4.7,
	},
];

// Sample meal plans data
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
	{
		_id: '3',
		mealPlanTitle: 'Keto Diet Plan',
		nutritionGoal: NutritionGoal.WEIGHT_LOSS,
		dietaryPreference: [DietaryPreference.KETO],
		duration: 14,
		calorieTarget: 1800,
		macros: { protein: 140, carbs: 30, fats: 140 },
		mealPlanViews: 980,
		mealPlanLikes: 72,
		mealPlanRating: 4.6,
		isPremium: false,
		price: 0,
	},
];

const NutritionPage: NextPage = () => {
	const device = useDeviceDetect();
	const [tabValue, setTabValue] = useState(0);
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

	// Calorie Calculator State
	const [calorieInputs, setCalorieInputs] = useState({
		age: '',
		gender: 'male',
		weight: '',
		height: '',
		activityLevel: 'moderate',
		goal: 'maintenance',
	});
	const [calculatedCalories, setCalculatedCalories] = useState<number | null>(null);

	// Macro Calculator State
	const [macroInputs, setMacroInputs] = useState({
		calories: '',
		goal: 'maintenance',
		proteinRatio: 30,
		carbsRatio: 40,
		fatsRatio: 30,
	});
	const [calculatedMacros, setCalculatedMacros] = useState<{ protein: number; carbs: number; fats: number } | null>(null);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	// Calculate Daily Calorie Needs (Mifflin-St Jeor Equation)
	const calculateCalories = () => {
		const age = parseFloat(calorieInputs.age);
		const weight = parseFloat(calorieInputs.weight);
		const height = parseFloat(calorieInputs.height);

		if (!age || !weight || !height) {
			alert('Please fill in all fields');
			return;
		}

		// BMR Calculation (Mifflin-St Jeor Equation)
		let bmr = 10 * weight + 6.25 * height - 5 * age;
		if (calorieInputs.gender === 'male') {
			bmr += 5;
		} else {
			bmr -= 161;
		}

		// Activity Multipliers
		const activityMultipliers: { [key: string]: number } = {
			sedentary: 1.2,
			light: 1.375,
			moderate: 1.55,
			active: 1.725,
			veryActive: 1.9,
		};

		const tdee = bmr * activityMultipliers[calorieInputs.activityLevel];

		// Goal Adjustments
		const goalAdjustments: { [key: string]: number } = {
			weightLoss: -500,
			maintenance: 0,
			muscleGain: 300,
		};

		const finalCalories = Math.round(tdee + goalAdjustments[calorieInputs.goal]);
		setCalculatedCalories(finalCalories);
	};

	// Calculate Macros
	const calculateMacros = () => {
		const calories = parseFloat(macroInputs.calories);
		if (!calories || calories <= 0) {
			alert('Please enter a valid calorie target');
			return;
		}

		// Validate ratios sum to 100
		const totalRatio = macroInputs.proteinRatio + macroInputs.carbsRatio + macroInputs.fatsRatio;
		if (Math.abs(totalRatio - 100) > 0.1) {
			alert('Macro ratios must sum to 100%');
			return;
		}

		// Calculate macros (1g protein = 4 cal, 1g carbs = 4 cal, 1g fats = 9 cal)
		const proteinCalories = (calories * macroInputs.proteinRatio) / 100;
		const carbsCalories = (calories * macroInputs.carbsRatio) / 100;
		const fatsCalories = (calories * macroInputs.fatsRatio) / 100;

		const protein = Math.round(proteinCalories / 4);
		const carbs = Math.round(carbsCalories / 4);
		const fats = Math.round(fatsCalories / 9);

		setCalculatedMacros({ protein, carbs, fats });
	};

	const formatGoal = (goal: string) => {
		return goal.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	if (device === 'mobile') {
		return (
			<Stack className={'nutrition-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Nutrition</Typography>
					<div>MOBILE NUTRITION PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'nutrition-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'}>
						<Typography variant="h3" className={'page-title'}>
							Nutrition & Meal Planning
						</Typography>
						<Typography variant="body1" className={'page-subtitle'}>
							Fuel your body with personalized meal plans and recipes
						</Typography>
					</Stack>

					{/* Nutrition Hero Section */}
					<Box className={'nutrition-hero'}>
						<Grid container spacing={3}>
							<Grid item xs={12} md={8}>
								<Box className={'hero-video'}>
									<video
										className={'nutrition-video'}
										poster="/img/bodybuilders/pexels-gabflicks-13122470.jpg"
										controls
										autoPlay
										muted
										loop
									>
										<source src="/img/videos/4443524-hd_1080_1614_25fps.mp4" type="video/mp4" />
									</video>
									<Box className={'video-overlay'}>
										<Typography variant="h4" className={'video-title'}>
											Transform Your Body Through Nutrition
										</Typography>
										<Typography variant="body1" className={'video-subtitle'}>
											Discover the power of proper nutrition and meal planning
										</Typography>
									</Box>
								</Box>
							</Grid>
							<Grid item xs={12} md={4}>
								<Box className={'nutrition-grid'}>
									{nutritionContent.slice(1).map((item) => (
										<Box key={item.id} className={'nutrition-item'}>
											<Box
												className={'nutrition-thumbnail'}
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
											<Box className={'nutrition-info'}>
												<Chip label={item.category} size="small" className={'category-chip'} />
												<Typography variant="body2" className={'nutrition-title'}>
													{item.title}
												</Typography>
											</Box>
										</Box>
									))}
								</Box>
							</Grid>
						</Grid>
					</Box>

					{/* Why Nutrition Matters Section */}
					<Box className={'why-nutrition-section'}>
						<Typography variant="h4" className={'section-title'} gutterBottom>
							Why Nutrition Matters?
						</Typography>
						<Typography variant="body1" className={'section-description'} paragraph>
							Nutrition is the foundation of your fitness journey. It's not just about what you eat—it's about fueling your body for optimal performance, recovery, and results. Here's what the science shows:
						</Typography>
						<Grid container spacing={3} className={'stats-grid'}>
							{whyNutritionMattersData.map((item, index) => (
								<Grid item xs={12} sm={6} md={3} key={index}>
									<Card className={'stat-card'}>
										<CardContent>
											<Box className={'stat-icon'}>{item.icon}</Box>
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

					{/* Tabs */}
					<Box className={'nutrition-tabs'}>
						<Tabs value={tabValue} onChange={handleTabChange} className={'custom-tabs'}>
							<Tab label="My Nutrition" icon={<TrendingUpIcon />} iconPosition="start" />
							<Tab label="Calorie Calculator" icon={<CalculateIcon />} iconPosition="start" />
							<Tab label="Macro Calculator" icon={<CalculateIcon />} iconPosition="start" />
							<Tab label="Vitamins & Supplements" icon={<StarIcon />} iconPosition="start" />
							<Tab label="Meal Plans" icon={<MenuBookIcon />} iconPosition="start" />
							<Tab label="Recipes" icon={<LocalDiningIcon />} iconPosition="start" />
						</Tabs>
					</Box>

					{/* Tab Content */}
					{tabValue === 0 && (
						<Grid container spacing={3}>
							<Grid item xs={12} md={8}>
								<Card className={'nutrition-card'}>
									<CardContent>
										<Typography variant="h5" className={'section-title'} gutterBottom>
											Today's Nutrition
										</Typography>
										
										{/* Calories Progress */}
										<Box className={'nutrition-progress-section'}>
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

										{/* Macros Breakdown */}
										<Box className={'macros-section'}>
											<Typography variant="h6" className={'macros-title'} gutterBottom>
												Macros Breakdown
											</Typography>
											<Grid container spacing={3}>
												<Grid item xs={12} sm={4}>
													<Box className={'macro-card protein'}>
														<Typography variant="h4" className={'macro-amount'}>
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
												<Grid item xs={12} sm={4}>
													<Box className={'macro-card carbs'}>
														<Typography variant="h4" className={'macro-amount'}>
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
												<Grid item xs={12} sm={4}>
													<Box className={'macro-card fats'}>
														<Typography variant="h4" className={'macro-amount'}>
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
										</Box>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} md={4}>
								<Card className={'active-plan-card'}>
									<CardContent>
										<Typography variant="h6" className={'section-title'} gutterBottom>
											Active Meal Plan
										</Typography>
										<Box className={'meal-plan-placeholder'}>
											<Typography variant="body2" color="text.secondary" mb={2}>
												No active meal plan
											</Typography>
											<Button variant="contained" fullWidth className={'browse-btn'}>
												Browse Meal Plans
											</Button>
										</Box>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					)}

					{/* Calorie Calculator Tab */}
					{tabValue === 1 && (
						<Box className={'calculator-section'}>
							<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
								<Box>
									<Typography variant="h5" className={'section-title'} gutterBottom>
										Daily Calorie Calculator
									</Typography>
									<Typography variant="body1" className={'section-description'}>
										Calculate your daily calorie needs based on your body metrics and goals
									</Typography>
								</Box>
							</Stack>
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<Card className={'calculator-card'}>
										<CardContent>
											<Typography variant="h6" className={'calculator-title'} gutterBottom>
												Enter Your Information
											</Typography>
											<Grid container spacing={3} mt={1}>
												<Grid item xs={12} sm={6}>
													<TextField
														fullWidth
														label="Age"
														type="number"
														value={calorieInputs.age}
														onChange={(e) => setCalorieInputs({ ...calorieInputs, age: e.target.value })}
														variant="outlined"
													/>
												</Grid>
												<Grid item xs={12} sm={6}>
													<FormControl fullWidth>
														<InputLabel>Gender</InputLabel>
														<Select
															value={calorieInputs.gender}
															label="Gender"
															onChange={(e) => setCalorieInputs({ ...calorieInputs, gender: e.target.value })}
														>
															<MenuItem value="male">Male</MenuItem>
															<MenuItem value="female">Female</MenuItem>
														</Select>
													</FormControl>
												</Grid>
												<Grid item xs={12} sm={6}>
													<TextField
														fullWidth
														label="Weight (kg)"
														type="number"
														value={calorieInputs.weight}
														onChange={(e) => setCalorieInputs({ ...calorieInputs, weight: e.target.value })}
														variant="outlined"
													/>
												</Grid>
												<Grid item xs={12} sm={6}>
													<TextField
														fullWidth
														label="Height (cm)"
														type="number"
														value={calorieInputs.height}
														onChange={(e) => setCalorieInputs({ ...calorieInputs, height: e.target.value })}
														variant="outlined"
													/>
												</Grid>
												<Grid item xs={12}>
													<FormControl component="fieldset">
														<FormLabel component="legend">Activity Level</FormLabel>
														<RadioGroup
															value={calorieInputs.activityLevel}
															onChange={(e) => setCalorieInputs({ ...calorieInputs, activityLevel: e.target.value })}
														>
															<FormControlLabel value="sedentary" control={<Radio />} label="Sedentary (little or no exercise)" />
															<FormControlLabel value="light" control={<Radio />} label="Light (exercise 1-3 days/week)" />
															<FormControlLabel value="moderate" control={<Radio />} label="Moderate (exercise 3-5 days/week)" />
															<FormControlLabel value="active" control={<Radio />} label="Active (exercise 6-7 days/week)" />
															<FormControlLabel value="veryActive" control={<Radio />} label="Very Active (hard exercise daily)" />
														</RadioGroup>
													</FormControl>
												</Grid>
												<Grid item xs={12}>
													<FormControl component="fieldset">
														<FormLabel component="legend">Goal</FormLabel>
														<RadioGroup
															value={calorieInputs.goal}
															onChange={(e) => setCalorieInputs({ ...calorieInputs, goal: e.target.value })}
														>
															<FormControlLabel value="weightLoss" control={<Radio />} label="Weight Loss (-500 cal/day)" />
															<FormControlLabel value="maintenance" control={<Radio />} label="Maintenance" />
															<FormControlLabel value="muscleGain" control={<Radio />} label="Muscle Gain (+300 cal/day)" />
														</RadioGroup>
													</FormControl>
												</Grid>
												<Grid item xs={12}>
													<Button variant="contained" fullWidth size="large" onClick={calculateCalories} className={'calculate-btn'}>
														Calculate Daily Calories
													</Button>
												</Grid>
											</Grid>
										</CardContent>
									</Card>
								</Grid>
								<Grid item xs={12} md={6}>
									<Card className={'calculator-result-card'}>
										<CardContent>
											<Typography variant="h6" className={'calculator-title'} gutterBottom>
												Your Daily Calorie Target
											</Typography>
											{calculatedCalories ? (
												<Box className={'result-display'}>
													<Typography variant="h2" className={'result-value'}>
														{calculatedCalories}
													</Typography>
													<Typography variant="body1" className={'result-label'}>
														calories per day
													</Typography>
													<Divider sx={{ my: 3 }} />
													<Box className={'result-breakdown'}>
														<Typography variant="body2" color="text.secondary" gutterBottom>
															This is your Total Daily Energy Expenditure (TDEE) adjusted for your goal.
														</Typography>
														<Typography variant="body2" color="text.secondary" gutterBottom>
															• Weight Loss: {calculatedCalories - 500} cal/day
														</Typography>
														<Typography variant="body2" color="text.secondary" gutterBottom>
															• Maintenance: {calculatedCalories} cal/day
														</Typography>
														<Typography variant="body2" color="text.secondary">
															• Muscle Gain: {calculatedCalories + 300} cal/day
														</Typography>
													</Box>
												</Box>
											) : (
												<Box className={'result-placeholder'}>
													<Typography variant="body1" color="text.secondary" align="center">
														Enter your information and click "Calculate" to see your daily calorie needs
													</Typography>
												</Box>
											)}
										</CardContent>
									</Card>
								</Grid>
							</Grid>
						</Box>
					)}

					{/* Macro Calculator Tab */}
					{tabValue === 2 && (
						<Box className={'calculator-section'}>
							<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
								<Box>
									<Typography variant="h5" className={'section-title'} gutterBottom>
										Macro Calculator
									</Typography>
									<Typography variant="body1" className={'section-description'}>
										Calculate your optimal macronutrient breakdown based on your calorie target
									</Typography>
								</Box>
							</Stack>
							<Grid container spacing={3}>
								<Grid item xs={12} md={6}>
									<Card className={'calculator-card'}>
										<CardContent>
											<Typography variant="h6" className={'calculator-title'} gutterBottom>
												Enter Your Information
											</Typography>
											<Grid container spacing={3} mt={1}>
												<Grid item xs={12}>
													<TextField
														fullWidth
														label="Daily Calorie Target"
														type="number"
														value={macroInputs.calories}
														onChange={(e) => setMacroInputs({ ...macroInputs, calories: e.target.value })}
														variant="outlined"
														helperText="Enter your daily calorie target from the calorie calculator"
													/>
												</Grid>
												<Grid item xs={12}>
													<FormControl component="fieldset">
														<FormLabel component="legend">Goal</FormLabel>
														<RadioGroup
															value={macroInputs.goal}
															onChange={(e) => {
																const goal = e.target.value;
																setMacroInputs({
																	...macroInputs,
																	goal,
																	proteinRatio: goal === 'muscleGain' ? 35 : goal === 'weightLoss' ? 40 : 30,
																	carbsRatio: goal === 'muscleGain' ? 40 : goal === 'weightLoss' ? 30 : 40,
																	fatsRatio: goal === 'muscleGain' ? 25 : goal === 'weightLoss' ? 30 : 30,
																});
															}}
														>
															<FormControlLabel value="weightLoss" control={<Radio />} label="Weight Loss (40% Protein, 30% Carbs, 30% Fats)" />
															<FormControlLabel value="maintenance" control={<Radio />} label="Maintenance (30% Protein, 40% Carbs, 30% Fats)" />
															<FormControlLabel value="muscleGain" control={<Radio />} label="Muscle Gain (35% Protein, 40% Carbs, 25% Fats)" />
														</RadioGroup>
													</FormControl>
												</Grid>
												<Grid item xs={12}>
													<Typography variant="body2" gutterBottom>
														Custom Macro Ratios (%)
													</Typography>
													<Grid container spacing={2}>
														<Grid item xs={4}>
															<TextField
																fullWidth
																label="Protein"
																type="number"
																value={macroInputs.proteinRatio}
																onChange={(e) => {
																	const val = parseFloat(e.target.value);
																	if (!isNaN(val) && val >= 0 && val <= 100) {
																		setMacroInputs({ ...macroInputs, proteinRatio: val });
																	}
																}}
																variant="outlined"
																size="small"
															/>
														</Grid>
														<Grid item xs={4}>
															<TextField
																fullWidth
																label="Carbs"
																type="number"
																value={macroInputs.carbsRatio}
																onChange={(e) => {
																	const val = parseFloat(e.target.value);
																	if (!isNaN(val) && val >= 0 && val <= 100) {
																		setMacroInputs({ ...macroInputs, carbsRatio: val });
																	}
																}}
																variant="outlined"
																size="small"
															/>
														</Grid>
														<Grid item xs={4}>
															<TextField
																fullWidth
																label="Fats"
																type="number"
																value={macroInputs.fatsRatio}
																onChange={(e) => {
																	const val = parseFloat(e.target.value);
																	if (!isNaN(val) && val >= 0 && val <= 100) {
																		setMacroInputs({ ...macroInputs, fatsRatio: val });
																	}
																}}
																variant="outlined"
																size="small"
															/>
														</Grid>
													</Grid>
													<Typography variant="caption" color={Math.abs(macroInputs.proteinRatio + macroInputs.carbsRatio + macroInputs.fatsRatio - 100) > 0.1 ? 'error' : 'text.secondary'}>
														Total: {macroInputs.proteinRatio + macroInputs.carbsRatio + macroInputs.fatsRatio}% (must equal 100%)
													</Typography>
												</Grid>
												<Grid item xs={12}>
													<Button variant="contained" fullWidth size="large" onClick={calculateMacros} className={'calculate-btn'}>
														Calculate Macros
													</Button>
												</Grid>
											</Grid>
										</CardContent>
									</Card>
								</Grid>
								<Grid item xs={12} md={6}>
									<Card className={'calculator-result-card'}>
										<CardContent>
											<Typography variant="h6" className={'calculator-title'} gutterBottom>
												Your Daily Macro Targets
											</Typography>
											{calculatedMacros ? (
												<Box className={'result-display'}>
													<Grid container spacing={3} mt={1}>
														<Grid item xs={12}>
															<Box className={'macro-result-card protein'}>
																<Typography variant="h4" className={'macro-result-value'}>
																	{calculatedMacros.protein}g
																</Typography>
																<Typography variant="body1" className={'macro-result-label'}>
																	Protein ({macroInputs.proteinRatio}%)
																</Typography>
																<Typography variant="caption" color="text.secondary">
																	{Math.round((calculatedMacros.protein * 4))} calories
																</Typography>
															</Box>
														</Grid>
														<Grid item xs={12}>
															<Box className={'macro-result-card carbs'}>
																<Typography variant="h4" className={'macro-result-value'}>
																	{calculatedMacros.carbs}g
																</Typography>
																<Typography variant="body1" className={'macro-result-label'}>
																	Carbs ({macroInputs.carbsRatio}%)
																</Typography>
																<Typography variant="caption" color="text.secondary">
																	{Math.round((calculatedMacros.carbs * 4))} calories
																</Typography>
															</Box>
														</Grid>
														<Grid item xs={12}>
															<Box className={'macro-result-card fats'}>
																<Typography variant="h4" className={'macro-result-value'}>
																	{calculatedMacros.fats}g
																</Typography>
																<Typography variant="body1" className={'macro-result-label'}>
																	Fats ({macroInputs.fatsRatio}%)
																</Typography>
																<Typography variant="caption" color="text.secondary">
																	{Math.round((calculatedMacros.fats * 9))} calories
																</Typography>
															</Box>
														</Grid>
														<Grid item xs={12}>
															<Divider sx={{ my: 2 }} />
															<Typography variant="body2" color="text.secondary" align="center">
																Total: {Math.round((calculatedMacros.protein * 4) + (calculatedMacros.carbs * 4) + (calculatedMacros.fats * 9))} calories
															</Typography>
														</Grid>
													</Grid>
												</Box>
											) : (
												<Box className={'result-placeholder'}>
													<Typography variant="body1" color="text.secondary" align="center">
														Enter your calorie target and macro ratios, then click "Calculate" to see your daily macro breakdown
													</Typography>
												</Box>
											)}
										</CardContent>
									</Card>
								</Grid>
							</Grid>
						</Box>
					)}

					{/* Vitamins & Supplements Tab */}
					{tabValue === 3 && (
						<Box className={'vitamins-section'}>
							<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
								<Box>
									<Typography variant="h5" className={'section-title'} gutterBottom>
										Vitamins & Supplements
									</Typography>
									<Typography variant="body1" className={'section-description'}>
										Essential nutrients for optimal health, performance, and recovery
									</Typography>
								</Box>
							</Stack>
							<Grid container spacing={3}>
								{vitaminsData.map((vitamin) => (
									<Grid item xs={12} sm={6} md={4} key={vitamin.id}>
										<Card className={'vitamin-card'}>
											<CardMedia
												component="div"
												className={'vitamin-image'}
												style={{
													backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url(${vitamin.image || '/img/bodybuilders/pexels-gabflicks-13122470.jpg'})`,
													backgroundSize: 'cover',
													backgroundPosition: 'center',
													height: 250,
												}}
											>
												<Box className={'vitamin-overlay'}>
													<Chip label={vitamin.category} size="small" className={'category-chip'} />
													<Box className={'rating-badge'}>
														<StarIcon className={'star-icon'} />
														<Typography variant="body2" className={'rating-text'}>
															{vitamin.rating}
														</Typography>
													</Box>
												</Box>
											</CardMedia>
											<CardContent>
												<Typography variant="h6" className={'vitamin-name'} gutterBottom>
													{vitamin.name}
												</Typography>
												<Typography variant="body2" className={'vitamin-dosage'} color="text.secondary" mb={2}>
													<strong>Recommended:</strong> {vitamin.dosage} daily
												</Typography>
												<Box className={'benefits-section'}>
													<Typography variant="caption" className={'benefits-label'} gutterBottom>
														Key Benefits:
													</Typography>
													<Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
														{vitamin.benefits.map((benefit, idx) => (
															<Chip key={idx} label={benefit} size="small" className={'benefit-chip'} />
														))}
													</Stack>
												</Box>
												<Stack direction="row" spacing={1} mt={3}>
													<Button variant="outlined" size="small" startIcon={<FavoriteBorderIcon />} fullWidth>
														Save
													</Button>
													<Button variant="outlined" size="small" startIcon={<ShareIcon />} fullWidth>
														Share
													</Button>
												</Stack>
											</CardContent>
										</Card>
									</Grid>
								))}
							</Grid>
						</Box>
					)}

					{/* Meal Plans Tab */}
					{tabValue === 4 && (
						<Box className={'meal-plans-section'}>
							<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
								<Box>
									<Typography variant="h5" className={'section-title'} gutterBottom>
										Meal Plans
									</Typography>
									<Typography variant="body1" className={'section-description'}>
										Structured meal plans designed to help you achieve your nutrition goals
									</Typography>
								</Box>
								<Button variant="contained" className={'browse-all-btn'}>
									Browse All Meal Plans
								</Button>
							</Stack>
							<Grid container spacing={3}>
								{sampleMealPlans.map((plan, index) => (
									<Grid item xs={12} md={6} lg={4} key={plan._id}>
										<Link href={`/nutrition/meal-plans/${plan._id}`}>
											<Card className={'meal-plan-card'}>
												<CardMedia
													component="div"
													className={'meal-plan-image'}
													style={{
														backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url(${index === 0 ? '/img/bodybuilders/pexels-gabflicks-13122470.jpg' : index === 1 ? '/img/bodybuilders/pexels-kuiyibo-13958866.jpg' : '/img/bodybuilders/pexels-leonmart-1552108.jpg'})`,
														backgroundSize: 'cover',
														backgroundPosition: 'center',
														height: 250,
													}}
												>
													{plan.isPremium && (
														<Chip label="Premium" className={'premium-badge'} size="small" />
													)}
													<Box className={'meal-plan-overlay'}>
														<Stack direction="row" spacing={1} alignItems="center">
															<StarIcon className={'star-icon-white'} />
															<Typography variant="body2" className={'rating-text-white'}>
																{plan.mealPlanRating?.toFixed(1)}
															</Typography>
														</Stack>
													</Box>
												</CardMedia>
												<CardContent>
													<Typography variant="h6" className={'meal-plan-title'} gutterBottom>
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
													<Grid container spacing={2} mb={2}>
														<Grid item xs={4}>
															<Box className={'meal-plan-stat'}>
																<Typography variant="caption" color="text.secondary">
																	Duration
																</Typography>
																<Typography variant="body2" fontWeight={600}>
																	{plan.duration} days
																</Typography>
															</Box>
														</Grid>
														<Grid item xs={4}>
															<Box className={'meal-plan-stat'}>
																<Typography variant="caption" color="text.secondary">
																	Calories
																</Typography>
																<Typography variant="body2" fontWeight={600}>
																	{plan.calorieTarget}
																</Typography>
															</Box>
														</Grid>
														<Grid item xs={4}>
															<Box className={'meal-plan-stat'}>
																<Typography variant="caption" color="text.secondary">
																	Views
																</Typography>
																<Typography variant="body2" fontWeight={600}>
																	{plan.mealPlanViews}
																</Typography>
															</Box>
														</Grid>
													</Grid>
													{plan.isPremium && (
														<Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
															<Typography variant="h6" className={'price'}>
																${plan.price}
															</Typography>
															<Button variant="contained" size="small" className={'start-plan-btn'}>
																Start Plan
															</Button>
														</Stack>
													)}
												</CardContent>
											</Card>
										</Link>
									</Grid>
								))}
							</Grid>
						</Box>
					)}

					{/* Recipes Tab */}
					{tabValue === 5 && (
						<Box className={'recipes-section'}>
							<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
								<Box>
									<Typography variant="h5" className={'section-title'} gutterBottom>
										Recipe Library
									</Typography>
									<Typography variant="body1" className={'section-description'}>
										Discover delicious, nutritious recipes to fuel your fitness journey
									</Typography>
								</Box>
								<Button variant="contained" className={'browse-all-btn'}>
									Browse All Recipes
								</Button>
							</Stack>
							<Grid container spacing={3}>
								{([
									{ 
										id: 1, 
										name: 'Grilled Chicken & Quinoa Bowl', 
										calories: 450, 
										time: 30, 
										tags: [RecipeTag.HIGH_PROTEIN, RecipeTag.EASY, RecipeTag.LUNCH], 
										image: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
										macros: { protein: 45, carbs: 50, fats: 12 }
									},
									{ 
										id: 2, 
										name: 'Salmon Power Salad', 
										calories: 380, 
										time: 25, 
										tags: [RecipeTag.LOW_CARB, RecipeTag.HIGH_PROTEIN, RecipeTag.LUNCH], 
										image: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
										macros: { protein: 35, carbs: 20, fats: 18 }
									},
									{ 
										id: 3, 
										name: 'Protein Smoothie Bowl', 
										calories: 320, 
										time: 10, 
										tags: [RecipeTag.QUICK, RecipeTag.HIGH_PROTEIN, RecipeTag.BREAKFAST, RecipeTag.POST_WORKOUT], 
										image: '/img/bodybuilders/pexels-leonmart-1552108.jpg',
										macros: { protein: 30, carbs: 40, fats: 8 }
									},
									{ 
										id: 4, 
										name: 'Lean Beef Stir Fry', 
										calories: 420, 
										time: 20, 
										tags: [RecipeTag.HIGH_PROTEIN, RecipeTag.QUICK, RecipeTag.DINNER], 
										image: '/img/bodybuilders/pexels-mralpha-13451637.jpg',
										macros: { protein: 40, carbs: 35, fats: 15 }
									},
									{ 
										id: 5, 
										name: 'Veggie Power Wrap', 
										calories: 350, 
										time: 15, 
										tags: [RecipeTag.VEGETARIAN, RecipeTag.EASY, RecipeTag.LUNCH, RecipeTag.MEAL_PREP], 
										image: '/img/bodybuilders/pexels-mralpha-24809802.jpg',
										macros: { protein: 15, carbs: 45, fats: 12 }
									},
									{ 
										id: 6, 
										name: 'Greek Yogurt Parfait', 
										calories: 280, 
										time: 5, 
										tags: [RecipeTag.QUICK, RecipeTag.HIGH_PROTEIN, RecipeTag.BREAKFAST, RecipeTag.SNACK], 
										image: '/img/bodybuilders/pexels-oscar-machado-937103-3014237.jpg',
										macros: { protein: 25, carbs: 30, fats: 8 }
									},
									{ 
										id: 7, 
										name: 'Keto Avocado Egg Bowl', 
										calories: 320, 
										time: 15, 
										tags: [RecipeTag.KETO, RecipeTag.LOW_CARB, RecipeTag.HIGH_PROTEIN, RecipeTag.BREAKFAST], 
										image: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
										macros: { protein: 20, carbs: 8, fats: 24 }
									},
									{ 
										id: 8, 
										name: 'Vegan Buddha Bowl', 
										calories: 400, 
										time: 25, 
										tags: [RecipeTag.VEGAN, RecipeTag.EASY, RecipeTag.LUNCH, RecipeTag.MEAL_PREP], 
										image: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
										macros: { protein: 18, carbs: 55, fats: 12 }
									},
								] as any[]).map((recipe) => (
									<Grid item xs={12} sm={6} md={4} key={recipe.id}>
										<Link href={`/nutrition/recipes/${recipe.id}`}>
											<Card className={'recipe-card'}>
												<CardMedia
													component="div"
													className={'recipe-image'}
													style={{
														backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url(${recipe.image})`,
														backgroundSize: 'cover',
														backgroundPosition: 'center',
														height: 250,
													}}
												>
													<Box className={'recipe-overlay'}>
														<Stack direction="row" spacing={2}>
															<Chip 
																icon={<LocalFireDepartmentIcon />} 
																label={`${recipe.calories} cal`} 
																size="small" 
																className={'recipe-calorie-chip'} 
															/>
															<Chip 
																icon={<RestaurantIcon />} 
																label={`${recipe.time} min`} 
																size="small" 
																className={'recipe-time-chip'} 
															/>
														</Stack>
													</Box>
												</CardMedia>
												<CardContent>
													<Typography variant="h6" className={'recipe-title'} gutterBottom>
														{recipe.name}
													</Typography>
													{recipe.macros && (
														<Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
															<Chip 
																label={`P: ${recipe.macros.protein}g`} 
																size="small" 
																className={'recipe-macro-chip protein'} 
															/>
															<Chip 
																label={`C: ${recipe.macros.carbs}g`} 
																size="small" 
																className={'recipe-macro-chip carbs'} 
															/>
															<Chip 
																label={`F: ${recipe.macros.fats}g`} 
																size="small" 
																className={'recipe-macro-chip fats'} 
															/>
														</Stack>
													)}
													<Stack direction="row" spacing={1} flexWrap="wrap">
														{recipe.tags.map((tag: string, idx: number) => (
															<Chip key={idx} label={tag.replace(/_/g, ' ')} size="small" className={'recipe-tag'} />
														))}
													</Stack>
												</CardContent>
											</Card>
										</Link>
									</Grid>
								))}
							</Grid>
						</Box>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(NutritionPage);






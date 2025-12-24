import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardMedia, Chip, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert, Pagination, Slider, Tooltip } from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MEAL_PLANS } from '../../../apollo/user/query';
import { MealPlan, Macros } from '../../../libs/types/mealplan/mealplan';
import { MealPlansInquiry } from '../../../libs/types/mealplan/mealplan.input';
import { NutritionGoal, DietaryPreference, MealPlanStatus, MealType } from '../../../libs/enums/nutrition.enum';
import { Direction } from '../../../libs/enums/common.enum';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination as SwiperPagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarIcon from '@mui/icons-material/Star';
import CalculateIcon from '@mui/icons-material/Calculate';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import InsightsIcon from '@mui/icons-material/Insights';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Helper function to format nutrition goal
const formatNutritionGoal = (goal: NutritionGoal): string => {
	return goal.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
};

// Helper function to format dietary preference
const formatDietaryPreference = (pref: DietaryPreference): string => {
	return pref.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
};

// Helper function to format popularity number
const formatPopularity = (count: number): string => {
	if (count >= 1000000) {
		return `${(count / 1000000).toFixed(1)}M users`;
	} else if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}k users`;
	}
	return `${count} users`;
};

// Calculate Nutrition Fit Score (0-100)
const calculateNutritionFitScore = (
	plan: MealPlan,
	selectedGoal: NutritionGoal | 'ALL',
	selectedDiet: DietaryPreference | 'ALL',
	caloriesRange: number[]
): number => {
	let score = 0;

	// Goal match (40 points)
	if (selectedGoal !== 'ALL' && plan.nutritionGoal === selectedGoal) {
		score += 40;
	} else if (selectedGoal === 'ALL') {
		// If no goal filter, give partial points based on plan quality
		score += 20;
	}

	// Diet match (30 points)
	if (selectedDiet !== 'ALL' && plan.dietaryPreference && plan.dietaryPreference.length > 0) {
		if (plan.dietaryPreference.includes(selectedDiet)) {
			score += 30;
		}
	} else if (selectedDiet === 'ALL') {
		// If no diet filter, give partial points
		score += 15;
	}

	// Calories range match (30 points)
	const calorieTarget = plan.calorieTarget;
	const rangeMin = caloriesRange[0];
	const rangeMax = caloriesRange[1];
	const rangeMid = (rangeMin + rangeMax) / 2;
	const rangeSize = rangeMax - rangeMin;

	if (calorieTarget >= rangeMin && calorieTarget <= rangeMax) {
		// Within range - calculate how close to middle
		const distanceFromMid = Math.abs(calorieTarget - rangeMid);
		const maxDistance = rangeSize / 2;
		const proximityScore = 1 - (distanceFromMid / maxDistance);
		score += Math.round(30 * proximityScore);
	} else {
		// Outside range - give points based on how close
		const distance = calorieTarget < rangeMin 
			? rangeMin - calorieTarget 
			: calorieTarget - rangeMax;
		const maxDistance = rangeSize;
		if (distance <= maxDistance) {
			const proximityScore = 1 - (distance / maxDistance);
			score += Math.round(30 * proximityScore * 0.5); // Reduced points for being outside
		}
	}

	return Math.min(100, Math.max(0, score));
};

// Helper function to calculate meals per day from meals array
const calculateMealsPerDay = (meals: any[]): number => {
	if (!meals || meals.length === 0) return 0;
	const uniqueDays = new Set(meals.map(meal => meal.day));
	if (uniqueDays.size === 0) return 0;
	const mealsOnFirstDay = meals.filter(meal => meal.day === Math.min(...Array.from(uniqueDays))).length;
	return mealsOnFirstDay;
};

// Get image URL
const getMealPlanImageUrl = (index: number) => {
	const images = [
		'/img/bodybuilders/pexels-gabflicks-13122470.jpg',
		'/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
		'/img/bodybuilders/pexels-leonmart-1552108.jpg',
	];
	return images[index % images.length];
};

// Reusable Meal Plan Card Component
const MealPlanCard = ({ 
	plan, 
	index, 
	horizontal = false,
	selectedGoal,
	selectedDiet,
	caloriesRange,
}: { 
	plan: MealPlan; 
	index: number; 
	horizontal?: boolean;
	selectedGoal?: NutritionGoal | 'ALL';
	selectedDiet?: DietaryPreference | 'ALL';
	caloriesRange?: number[];
}) => {
	const mealsPerDay = plan.meals && plan.meals.length > 0 ? calculateMealsPerDay(plan.meals) : 0;
	const popularityCount = plan.mealPlanFollowers || plan.mealPlanViews || 0;
	const hasImage = true; // Can be enhanced to check if image exists

	// Calculate Nutrition Fit Score
	const fitScore = useMemo(() => {
		if (selectedGoal && selectedDiet && caloriesRange) {
			return calculateNutritionFitScore(plan, selectedGoal, selectedDiet, caloriesRange);
		}
		return null;
	}, [plan, selectedGoal, selectedDiet, caloriesRange]);

	// Only show score if filters are active
	const showFitScore = fitScore !== null && (
		selectedGoal !== 'ALL' || 
		selectedDiet !== 'ALL' || 
		(caloriesRange && (caloriesRange[0] !== 1500 || caloriesRange[1] !== 3200))
	);

	const handlePreviewClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		// Navigate to preview or open modal
		window.location.href = `/nutrition/meal-plans/${plan._id}?preview=true`;
	};

	const handleCardClick = (e: React.MouseEvent) => {
		// Only navigate if clicking on the card itself, not buttons
		if ((e.target as HTMLElement).closest('.meal-plan-actions')) {
			return;
		}
		window.location.href = `/nutrition/meal-plans/${plan._id}`;
	};

	return (
		<Card 
			className={`meal-plan-card ${horizontal ? 'horizontal' : ''}`}
			onClick={handleCardClick}
			sx={{ cursor: 'pointer' }}
		>
			{hasImage ? (
				<CardMedia
					component="div"
					className={'meal-plan-image'}
					style={{
						backgroundImage: `url(${getMealPlanImageUrl(index)})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				/>
			) : (
				<Box className={'meal-plan-image-icon'}>
					<RestaurantIcon className={'icon-placeholder'} />
				</Box>
			)}
			<Box className={'meal-plan-content'}>
				{/* Plan Name and Fit Score */}
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
					<Typography className={'meal-plan-title'} sx={{ flex: 1 }}>
						{plan.mealPlanTitle}
					</Typography>
					{showFitScore && fitScore !== null && (
						<Tooltip 
							title="Based on your goal and calorie preference"
							arrow
							placement="top"
						>
							<Box className={'nutrition-fit-score'}>
								<Typography className={'fit-score-label'}>Nutrition Fit:</Typography>
								<Typography className={'fit-score-value'}>{fitScore}%</Typography>
							</Box>
						</Tooltip>
					)}
				</Box>

				{/* Badges */}
				<Stack direction="row" spacing={1} className={'meal-plan-badges'} flexWrap="wrap">
					<Chip 
						label={formatNutritionGoal(plan.nutritionGoal)} 
						size="small" 
						className={'goal-badge'}
					/>
					{plan.dietaryPreference && plan.dietaryPreference.length > 0 && (
						<Chip
							label={formatDietaryPreference(plan.dietaryPreference[0])}
							size="small"
							className={'diet-badge'}
						/>
					)}
				</Stack>

				{/* Stats Grid - Compact Row for Horizontal Cards */}
				<Box className={`meal-plan-stats ${horizontal ? 'compact-row' : ''}`}>
					<Box className={'stat-item'}>
						<LocalFireDepartmentIcon className={'stat-icon'} />
						<Box className={'stat-content'}>
							<Typography className={'stat-label'}>Calories</Typography>
							<Typography className={'stat-value'}>{plan.calorieTarget}</Typography>
						</Box>
					</Box>
					<Box className={'stat-item'}>
						<RestaurantIcon className={'stat-icon'} />
						<Box className={'stat-content'}>
							<Typography className={'stat-label'}>Meals/Day</Typography>
							<Typography className={'stat-value'}>{mealsPerDay || 'N/A'}</Typography>
						</Box>
					</Box>
					<Box className={'stat-item'}>
						<CalendarTodayIcon className={'stat-icon'} />
						<Box className={'stat-content'}>
							<Typography className={'stat-label'}>Duration</Typography>
							<Typography className={'stat-value'}>{plan.duration} days</Typography>
						</Box>
					</Box>
				</Box>

				{/* Popularity Indicator */}
				{popularityCount > 0 && (
					<Box className={'meal-plan-popularity'}>
						<PeopleIcon className={'popularity-icon'} />
						<Typography className={'popularity-text'}>
							{formatPopularity(popularityCount)}
						</Typography>
					</Box>
				)}

				{/* Actions */}
				<Box className={'meal-plan-actions'} onClick={(e) => e.stopPropagation()}>
					<Button 
						className={'view-plan-button'} 
						fullWidth
						onClick={(e) => {
							e.stopPropagation();
							window.location.href = `/nutrition/meal-plans/${plan._id}`;
						}}
					>
						View Plan
					</Button>
					<Button 
						className={'preview-meals-button'} 
						fullWidth
						variant="outlined"
						onClick={handlePreviewClick}
					>
						Preview Meals
					</Button>
				</Box>
			</Box>
		</Card>
	);
};

// Mock data generator that matches backend schema exactly
const generateMockMealPlans = (): MealPlan[] => {
	const goals: NutritionGoal[] = [NutritionGoal.WEIGHT_LOSS, NutritionGoal.MUSCLE_GAIN, NutritionGoal.MAINTENANCE];
	const diets: DietaryPreference[][] = [
		[DietaryPreference.HIGH_PROTEIN],
		[DietaryPreference.KETO],
		[DietaryPreference.VEGAN],
		[DietaryPreference.NONE],
	];
	const durations = [7, 14, 30];
	const calorieRanges = [
		{ min: 1500, max: 2000 }, // Weight Loss
		{ min: 2500, max: 3200 }, // Muscle Gain
		{ min: 2000, max: 2500 }, // Maintenance
	];

	const mockPlans: MealPlan[] = [];

	for (let i = 0; i < 15; i++) {
		const goal = goals[i % goals.length];
		const diet = diets[i % diets.length];
		const duration = durations[i % durations.length];
		const calorieRange = calorieRanges[goals.indexOf(goal)];
		const calorieTarget = Math.floor(Math.random() * (calorieRange.max - calorieRange.min + 1)) + calorieRange.min;
		const mealsPerDay = Math.floor(Math.random() * 4) + 3; // 3-6 meals per day

		// Calculate macros based on calorie target
		const proteinGrams = Math.floor(calorieTarget * 0.3 / 4); // 30% calories from protein
		const carbsGrams = Math.floor(calorieTarget * 0.4 / 4); // 40% calories from carbs
		const fatsGrams = Math.floor(calorieTarget * 0.3 / 9); // 30% calories from fats

		const macros: Macros = {
			protein: proteinGrams,
			carbs: carbsGrams,
			fats: fatsGrams,
		};

		// Generate meals array
		const meals = [];
		for (let day = 1; day <= duration; day++) {
			const mealTypes = [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER];
			if (mealsPerDay > 3) mealTypes.push(MealType.SNACK);
			if (mealsPerDay > 4) mealTypes.push(MealType.PRE_WORKOUT);
			if (mealsPerDay > 5) mealTypes.push(MealType.POST_WORKOUT);

			mealTypes.slice(0, mealsPerDay).forEach((mealType, mealIndex) => {
				const mealCalories = Math.floor(calorieTarget / mealsPerDay);
				meals.push({
					day,
					mealType,
					mealName: `${mealType} - Day ${day}`,
					ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'],
					instructions: 'Cook and serve.',
					calories: mealCalories,
					protein: Math.floor(mealCalories * 0.3 / 4),
					carbs: Math.floor(mealCalories * 0.4 / 4),
					fats: Math.floor(mealCalories * 0.3 / 9),
				});
			});
		}

		const planTitles = [
			'Lean Body Transformation',
			'Muscle Building Program',
			'Balanced Nutrition Plan',
			'Fat Loss Accelerator',
			'Strength & Performance',
			'Healthy Lifestyle Plan',
			'Keto Transformation',
			'High Protein Power',
			'Vegan Wellness Program',
			'Rapid Fat Loss',
			'Bulking Nutrition',
			'Maintenance Mastery',
			'Cutting Edge Plan',
			'Mass Building',
			'Wellness Journey',
		];

		const planDescriptions = [
			'A comprehensive nutrition plan designed to help you achieve your fitness goals with balanced macronutrients.',
			'Structured meal plan focused on muscle growth and recovery with optimal protein intake.',
			'Well-rounded nutrition program that supports overall health and wellness.',
			'Calorie-controlled plan designed to maximize fat loss while preserving muscle mass.',
			'Performance-focused nutrition to fuel your workouts and enhance recovery.',
			'A sustainable approach to healthy eating that fits your lifestyle.',
			'Low-carb, high-fat nutrition plan for metabolic optimization.',
			'High protein diet plan to support muscle maintenance and growth.',
			'Plant-based nutrition program for optimal health and performance.',
			'Intensive fat loss program with precise calorie control.',
			'Mass gaining nutrition plan with strategic macro distribution.',
			'Maintenance nutrition to sustain your current physique.',
			'Advanced cutting protocol for competition prep.',
			'Muscle mass building with surplus calories.',
			'Long-term wellness and health optimization.',
		];

		mockPlans.push({
			_id: `mock-plan-${i + 1}`,
			mealPlanTitle: planTitles[i % planTitles.length],
			mealPlanStatus: MealPlanStatus.PUBLISHED,
			mealPlanDesc: planDescriptions[i % planDescriptions.length],
			nutritionGoal: goal,
			dietaryPreference: diet,
			duration,
			calorieTarget,
			macros,
			meals,
			createdBy: 'mock-user-id',
			mealPlanViews: Math.floor(Math.random() * 5000) + 100,
			mealPlanLikes: Math.floor(Math.random() * 500) + 10,
			mealPlanRating: Math.random() * 2 + 3.5, // 3.5-5.5 rating
			mealPlanFollowers: Math.floor(Math.random() * 200) + 5,
			isPremium: i % 3 === 0, // Every 3rd plan is premium
			price: i % 3 === 0 ? Math.floor(Math.random() * 50) + 20 : 0,
			createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
			updatedAt: new Date(),
			memberData: {
				_id: 'mock-member-id',
				memberNick: `Nutrition Expert ${i + 1}`,
				memberFullName: `Expert ${i + 1}`,
			} as any,
		});
	}

	return mockPlans;
};

const MealPlansPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [allMealPlans, setAllMealPlans] = useState<MealPlan[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedGoal, setSelectedGoal] = useState<NutritionGoal | 'ALL'>('ALL');
	const [selectedDiet, setSelectedDiet] = useState<DietaryPreference | 'ALL'>('ALL');
	const [caloriesRange, setCaloriesRange] = useState<number[]>([1500, 3200]);
	const [sortBy, setSortBy] = useState<string>('mealPlanViews');
	const [page, setPage] = useState(1);
	const limit = 12;
	const [activeSection, setActiveSection] = useState<string>('meal-plans');

	// Detect current route and set active section
	useEffect(() => {
		const path = router.pathname;
		if (path.includes('/nutrition/meal-plans')) {
			setActiveSection('meal-plans');
		} else if (path.includes('/nutrition/supplements')) {
			setActiveSection('supplements');
		} else if (path.includes('/nutrition/calorie-calculator')) {
			setActiveSection('calorie-calculator');
		}
	}, [router.pathname]);

	// Check if any filters are active
	const hasActiveFilters = useMemo(() => {
		return searchQuery.trim() !== '' || 
			selectedGoal !== 'ALL' || 
			selectedDiet !== 'ALL' || 
			caloriesRange[0] !== 1500 || 
			caloriesRange[1] !== 3200 ||
			sortBy !== 'mealPlanViews';
	}, [searchQuery, selectedGoal, selectedDiet, caloriesRange, sortBy]);

	// Query for Browse by Goal sections
	const weightLossQuery: MealPlansInquiry = useMemo(() => ({
		page: 1,
		limit: 3,
		sort: 'mealPlanViews',
		direction: Direction.DESC,
		search: { nutritionGoal: NutritionGoal.WEIGHT_LOSS },
	}), []);

	const muscleGainQuery: MealPlansInquiry = useMemo(() => ({
		page: 1,
		limit: 3,
		sort: 'mealPlanViews',
		direction: Direction.DESC,
		search: { nutritionGoal: NutritionGoal.MUSCLE_GAIN },
	}), []);

	const maintenanceQuery: MealPlansInquiry = useMemo(() => ({
		page: 1,
		limit: 3,
		sort: 'mealPlanViews',
		direction: Direction.DESC,
		search: { nutritionGoal: NutritionGoal.MAINTENANCE },
	}), []);

	// Query for All Meal Plans (with filters)
	const allPlansQuery: MealPlansInquiry = useMemo(() => {
		const search: any = {};
		
		if (selectedGoal !== 'ALL') {
			search.nutritionGoal = selectedGoal;
		}
		
		if (selectedDiet !== 'ALL') {
			search.dietaryPreferenceList = [selectedDiet];
		}
		
		if (searchQuery.trim()) {
			search.text = searchQuery.trim();
		}

		return {
			page,
			limit,
			sort: sortBy,
			direction: Direction.DESC,
			search: Object.keys(search).length > 0 ? search : undefined,
		};
	}, [page, selectedGoal, selectedDiet, searchQuery, sortBy]);

	// Fetch Weight Loss plans
	const { data: weightLossData } = useQuery(GET_MEAL_PLANS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: weightLossQuery },
		skip: false,
	});

	// Fetch Muscle Gain plans
	const { data: muscleGainData } = useQuery(GET_MEAL_PLANS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: muscleGainQuery },
		skip: false,
	});

	// Fetch Maintenance plans
	const { data: maintenanceData } = useQuery(GET_MEAL_PLANS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: maintenanceQuery },
		skip: false,
	});

	// Fetch All Meal Plans
	const {
		loading: allPlansLoading,
		data: allPlansData,
		error: allPlansError,
	} = useQuery(GET_MEAL_PLANS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: allPlansQuery },
		skip: false,
	});

	// Process data with fallback to mock
	const getPlansWithFallback = (data: any, mockGenerator: () => MealPlan[]): MealPlan[] => {
		if (data?.getMealPlans?.list && data.getMealPlans.list.length > 0) {
			return data.getMealPlans.list.filter((plan: MealPlan) => plan.mealPlanStatus === MealPlanStatus.PUBLISHED);
		}
		return mockGenerator().filter(plan => plan.mealPlanStatus === MealPlanStatus.PUBLISHED);
	};

	const weightLossPlans = useMemo(() => {
		const allPlans = getPlansWithFallback(weightLossData, () => 
			generateMockMealPlans().filter(p => p.nutritionGoal === NutritionGoal.WEIGHT_LOSS)
		);
		return allPlans.slice(0, 3);
	}, [weightLossData]);

	const muscleGainPlans = useMemo(() => {
		const allPlans = getPlansWithFallback(muscleGainData, () => 
			generateMockMealPlans().filter(p => p.nutritionGoal === NutritionGoal.MUSCLE_GAIN)
		);
		return allPlans.slice(0, 3);
	}, [muscleGainData]);

	const maintenancePlans = useMemo(() => {
		const allPlans = getPlansWithFallback(maintenanceData, () => 
			generateMockMealPlans().filter(p => p.nutritionGoal === NutritionGoal.MAINTENANCE)
		);
		return allPlans.slice(0, 3);
	}, [maintenanceData]);

	// Update all meal plans and apply client-side filters
	useEffect(() => {
		let plans: MealPlan[] = [];
		
		if (allPlansData?.getMealPlans?.list && allPlansData.getMealPlans.list.length > 0) {
			plans = allPlansData.getMealPlans.list.filter((plan: MealPlan) => plan.mealPlanStatus === MealPlanStatus.PUBLISHED);
		} else if (!allPlansLoading && !allPlansError) {
			plans = generateMockMealPlans().filter(plan => plan.mealPlanStatus === MealPlanStatus.PUBLISHED);
		}

		// Apply client-side filtering
		plans = plans.filter(plan => {
			// Calories range filter
			const inCalorieRange = plan.calorieTarget >= caloriesRange[0] && plan.calorieTarget <= caloriesRange[1];
			
			// Search filter (as fallback if backend doesn't handle it)
			const matchesSearch = !searchQuery.trim() || 
				plan.mealPlanTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(plan.mealPlanDesc && plan.mealPlanDesc.toLowerCase().includes(searchQuery.toLowerCase()));

			return inCalorieRange && matchesSearch;
		});

		// Apply sorting
		plans = [...plans].sort((a, b) => {
			switch (sortBy) {
				case 'mealPlanViews':
					return (b.mealPlanViews || 0) - (a.mealPlanViews || 0);
				case 'createdAt':
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				case 'calorieTarget':
					return a.calorieTarget - b.calorieTarget;
				default:
					return 0;
			}
		});

		setAllMealPlans(plans);
		setPage(1); // Reset to first page when filters change
	}, [allPlansData, allPlansLoading, allPlansError, caloriesRange, sortBy, searchQuery]);

	const totalPages = Math.ceil(allMealPlans.length / limit);

	// Reset all filters
	const handleResetFilters = () => {
		setSearchQuery('');
		setSelectedGoal('ALL');
		setSelectedDiet('ALL');
		setCaloriesRange([1500, 3200]);
		setSortBy('mealPlanViews');
	};

	// Remove individual filter
	const handleRemoveFilter = (type: 'search' | 'goal' | 'diet' | 'calories' | 'sort') => {
		switch (type) {
			case 'search':
				setSearchQuery('');
				break;
			case 'goal':
				setSelectedGoal('ALL');
				break;
			case 'diet':
				setSelectedDiet('ALL');
				break;
			case 'calories':
				setCaloriesRange([1500, 3200]);
				break;
			case 'sort':
				setSortBy('mealPlanViews');
				break;
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'meal-plans-page'}>
				<Stack className={'container'}>
					<Typography variant="h4" className={'page-title'} sx={{ mb: 3 }}>
						Meal Plans
					</Typography>
					{allPlansLoading ? (
						<Box display="flex" justifyContent="center" p={4}>
							<CircularProgress />
						</Box>
					) : allPlansError ? (
						<Alert severity="error">Error loading meal plans. Please try again later.</Alert>
					) : allMealPlans.length === 0 ? (
						<Box className={'empty-state'}>
							<Typography className={'empty-title'}>No meal plans found</Typography>
							<Typography className={'empty-description'}>
								Check back soon for new meal plans!
							</Typography>
						</Box>
					) : (
						<Stack spacing={2}>
							{allMealPlans.map((plan, index) => (
								<MealPlanCard 
									key={plan._id} 
									plan={plan} 
									index={index}
									selectedGoal={selectedGoal}
									selectedDiet={selectedDiet}
									caloriesRange={caloriesRange}
								/>
							))}
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'meal-plans-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'}>
						<Typography variant="h2" className={'page-title'}>
							Meal Plans
						</Typography>
						<Typography variant="h6" className={'page-subtitle'}>
							Structured nutrition plans designed to match your goals and lifestyle.
						</Typography>
					</Stack>

					{/* Section Navigation Bar */}
					<Box className={'nutrition-section-navbar'}>
						<Box className={'section-navbar-container'}>
							<Box
								className={`section-nav-item ${activeSection === 'meal-plans' ? 'active' : ''}`}
								onClick={() => {
									setActiveSection('meal-plans');
									router.push('/nutrition/meal-plans');
								}}
							>
								<MenuBookIcon className={'nav-icon'} />
								<Typography variant="body2" className={'nav-label'}>
									Meal Plans
								</Typography>
							</Box>
							<Box
								className={`section-nav-item ${activeSection === 'supplements' ? 'active' : ''}`}
								onClick={() => {
									setActiveSection('supplements');
									router.push('/nutrition/supplements');
								}}
							>
								<StarIcon className={'nav-icon'} />
								<Typography variant="body2" className={'nav-label'}>
									Vitamins & Supplements
								</Typography>
							</Box>
							<Box
								className={`section-nav-item ${activeSection === 'calorie-calculator' ? 'active' : ''}`}
								onClick={() => {
									setActiveSection('calorie-calculator');
									router.push('/nutrition/calorie-calculator');
								}}
							>
								<CalculateIcon className={'nav-icon'} />
								<Typography variant="body2" className={'nav-label'}>
									Calorie Calculator
								</Typography>
							</Box>
							<Box
								className={`section-nav-item ${activeSection === 'daily-nutrition' ? 'active' : ''}`}
								onClick={() => {
									setActiveSection('daily-nutrition');
									router.push('/nutrition#daily-nutrition-section');
								}}
							>
								<LocalFireDepartmentOutlinedIcon className={'nav-icon'} />
								<Typography variant="body2" className={'nav-label'}>
									Daily Nutrition
								</Typography>
							</Box>
							<Box
								className={`section-nav-item ${activeSection === 'insights' ? 'active' : ''}`}
								onClick={() => {
									setActiveSection('insights');
									router.push('/nutrition#insights-section');
								}}
							>
								<InsightsIcon className={'nav-icon'} />
								<Typography variant="body2" className={'nav-label'}>
									Insights
								</Typography>
							</Box>
						</Box>
					</Box>

					{/* Browse by Goal Section */}
					<Box className={'section-browse-goals'} sx={{ mb: 6 }}>
						<Box className={'section-header'}>
							<Typography variant="h4" className={'section-title'}>
								Browse by Goal
							</Typography>
							<Typography variant="body2" className={'section-subtitle'}>
								Find meal plans tailored to your specific nutrition goals
							</Typography>
						</Box>

						{/* Fat Loss */}
						{weightLossPlans.length > 0 && (
							<Box className={'goal-section'} sx={{ mb: 4 }}>
								<Typography variant="h5" className={'goal-section-title'}>
									Fat Loss
								</Typography>
								<Grid container spacing={3}>
									{weightLossPlans.map((plan, index) => (
										<Grid item xs={12} sm={6} md={4} key={plan._id}>
											<MealPlanCard 
												plan={plan} 
												index={index}
												selectedGoal={selectedGoal}
												selectedDiet={selectedDiet}
												caloriesRange={caloriesRange}
											/>
										</Grid>
									))}
								</Grid>
							</Box>
						)}

						{/* Muscle Gain */}
						{muscleGainPlans.length > 0 && (
							<Box className={'goal-section'} sx={{ mb: 4 }}>
								<Typography variant="h5" className={'goal-section-title'}>
									Muscle Gain
								</Typography>
								<Grid container spacing={3}>
									{muscleGainPlans.map((plan, index) => (
										<Grid item xs={12} sm={6} md={4} key={plan._id}>
											<MealPlanCard 
												plan={plan} 
												index={index}
												selectedGoal={selectedGoal}
												selectedDiet={selectedDiet}
												caloriesRange={caloriesRange}
											/>
										</Grid>
									))}
								</Grid>
							</Box>
						)}

						{/* Maintenance */}
						{maintenancePlans.length > 0 && (
							<Box className={'goal-section'} sx={{ mb: 4 }}>
								<Typography variant="h5" className={'goal-section-title'}>
									Maintenance
								</Typography>
								<Grid container spacing={3}>
									{maintenancePlans.map((plan, index) => (
										<Grid item xs={12} sm={6} md={4} key={plan._id}>
											<MealPlanCard 
												plan={plan} 
												index={index}
												selectedGoal={selectedGoal}
												selectedDiet={selectedDiet}
												caloriesRange={caloriesRange}
											/>
										</Grid>
									))}
								</Grid>
							</Box>
						)}
					</Box>

					{/* Search and Filters */}
					<Box className={'filters-section'} sx={{ mb: 4 }}>
						<Grid container spacing={2} alignItems="flex-start">
							{/* Search */}
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									placeholder="Search meal plans..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									InputProps={{
										startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
									}}
								/>
							</Grid>

							{/* Goal */}
							<Grid item xs={12} sm={6} md={2}>
								<FormControl fullWidth>
									<InputLabel>Goal</InputLabel>
									<Select
										value={selectedGoal}
										label="Goal"
										onChange={(e) => setSelectedGoal(e.target.value as NutritionGoal | 'ALL')}
									>
										<MenuItem value="ALL">All Goals</MenuItem>
										{Object.values(NutritionGoal).map((goal) => (
											<MenuItem key={goal} value={goal}>
												{formatNutritionGoal(goal)}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							{/* Diet Type */}
							<Grid item xs={12} sm={6} md={2}>
								<FormControl fullWidth>
									<InputLabel>Diet Type</InputLabel>
									<Select
										value={selectedDiet}
										label="Diet Type"
										onChange={(e) => setSelectedDiet(e.target.value as DietaryPreference | 'ALL')}
									>
										<MenuItem value="ALL">All Diets</MenuItem>
										{Object.values(DietaryPreference).map((diet) => (
											<MenuItem key={diet} value={diet}>
												{formatDietaryPreference(diet)}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							{/* Calories Range */}
							<Grid item xs={12} md={3}>
								<Box>
									<Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontSize: '12px' }}>
										Calories: {caloriesRange[0]} - {caloriesRange[1]}
									</Typography>
									<Slider
										value={caloriesRange}
										onChange={(e, newValue) => setCaloriesRange(newValue as number[])}
										valueLabelDisplay="auto"
										min={1500}
										max={3200}
										step={50}
										sx={{ mt: 1 }}
									/>
								</Box>
							</Grid>

							{/* Sort By */}
							<Grid item xs={12} sm={6} md={1}>
								<FormControl fullWidth>
									<InputLabel>Sort</InputLabel>
									<Select
										value={sortBy}
										label="Sort"
										onChange={(e) => setSortBy(e.target.value)}
									>
										<MenuItem value="mealPlanViews">Most Popular</MenuItem>
										<MenuItem value="createdAt">Newest</MenuItem>
										<MenuItem value="calorieTarget">Lowest Calories</MenuItem>
									</Select>
								</FormControl>
							</Grid>
						</Grid>

						{/* Active Filter Chips */}
						{hasActiveFilters && (
							<Box className={'active-filters'} sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
								{searchQuery.trim() && (
									<Chip
										label={`Search: "${searchQuery}"`}
										onDelete={() => handleRemoveFilter('search')}
										deleteIcon={<CloseIcon />}
										size="small"
										className={'filter-chip'}
									/>
								)}
								{selectedGoal !== 'ALL' && (
									<Chip
										label={`Goal: ${formatNutritionGoal(selectedGoal)}`}
										onDelete={() => handleRemoveFilter('goal')}
										deleteIcon={<CloseIcon />}
										size="small"
										className={'filter-chip'}
									/>
								)}
								{selectedDiet !== 'ALL' && (
									<Chip
										label={`Diet: ${formatDietaryPreference(selectedDiet)}`}
										onDelete={() => handleRemoveFilter('diet')}
										deleteIcon={<CloseIcon />}
										size="small"
										className={'filter-chip'}
									/>
								)}
								{(caloriesRange[0] !== 1500 || caloriesRange[1] !== 3200) && (
									<Chip
										label={`Calories: ${caloriesRange[0]}-${caloriesRange[1]}`}
										onDelete={() => handleRemoveFilter('calories')}
										deleteIcon={<CloseIcon />}
										size="small"
										className={'filter-chip'}
									/>
								)}
								{sortBy !== 'mealPlanViews' && (
									<Chip
										label={`Sort: ${sortBy === 'createdAt' ? 'Newest' : sortBy === 'calorieTarget' ? 'Lowest Calories' : 'Most Popular'}`}
										onDelete={() => handleRemoveFilter('sort')}
										deleteIcon={<CloseIcon />}
										size="small"
										className={'filter-chip'}
									/>
								)}
								<Button
									variant="text"
									size="small"
									onClick={handleResetFilters}
									sx={{ ml: 'auto', textTransform: 'none', fontSize: '12px' }}
									className={'reset-filters-button'}
								>
									Reset All
								</Button>
							</Box>
						)}
					</Box>

					{/* Error Banner */}
					{allPlansError && (
						<Alert severity="warning" sx={{ mb: 3 }}>
							Unable to connect to server. Please try again later.
						</Alert>
					)}

					{/* All Meal Plans Section */}
					<Box className={'section-all-plans'}>
						<Box className={'section-header'}>
							<Typography variant="h4" className={'section-title'}>
								All Meal Plans
							</Typography>
						</Box>
						{allPlansLoading && allMealPlans.length === 0 ? (
							<Box display="flex" justifyContent="center" p={4}>
								<CircularProgress />
							</Box>
						) : allMealPlans.length === 0 ? (
							<>
								{/* Empty State with Message and Buttons */}
								<Box className={'empty-state'}>
									<Typography className={'empty-title'}>
										No meal plans match your filters
									</Typography>
									<Typography className={'empty-description'}>
										Try adjusting calories or diet type.
									</Typography>
									<Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
										<Button
											variant="contained"
											onClick={handleResetFilters}
											className={'empty-state-button'}
										>
											Reset Filters
										</Button>
										<Button
											variant="outlined"
											onClick={() => {
												handleResetFilters();
												window.scrollTo({ top: 0, behavior: 'smooth' });
											}}
											className={'empty-state-button-outlined'}
										>
											View Popular Plans
										</Button>
									</Stack>
								</Box>

								{/* Show Popular Plans Below Empty State */}
								{(() => {
									// Get popular plans from all available plans sorted by views
									const allAvailablePlans = allPlansData?.getMealPlans?.list 
										? allPlansData.getMealPlans.list.filter((p: MealPlan) => p.mealPlanStatus === MealPlanStatus.PUBLISHED)
										: generateMockMealPlans().filter(p => p.mealPlanStatus === MealPlanStatus.PUBLISHED);
									
									const popularPlansToShow = [...allAvailablePlans]
										.sort((a, b) => (b.mealPlanViews || 0) - (a.mealPlanViews || 0))
										.slice(0, 3);

									return popularPlansToShow.length > 0 ? (
										<Box className={'empty-state-popular'} sx={{ mt: 6 }}>
											<Typography variant="h5" className={'popular-section-title'} sx={{ mb: 3 }}>
												Popular Meal Plans
											</Typography>
											<Grid container spacing={3}>
												{popularPlansToShow.map((plan, index) => (
													<Grid item xs={12} sm={6} md={4} key={plan._id}>
														<MealPlanCard 
															plan={plan} 
															index={index}
															selectedGoal={selectedGoal}
															selectedDiet={selectedDiet}
															caloriesRange={caloriesRange}
														/>
													</Grid>
												))}
											</Grid>
										</Box>
									) : null;
								})()}
							</>
						) : (
							<>
								<Grid container spacing={3} sx={{ mb: 4 }}>
									{allMealPlans.slice((page - 1) * limit, page * limit).map((plan, index) => (
										<Grid item xs={12} sm={6} md={4} key={plan._id}>
											<MealPlanCard 
												plan={plan} 
												index={index}
												selectedGoal={selectedGoal}
												selectedDiet={selectedDiet}
												caloriesRange={caloriesRange}
											/>
										</Grid>
									))}
								</Grid>
								{totalPages > 1 && (
									<Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
										<Pagination
											count={totalPages}
											page={page}
											onChange={(e, value) => setPage(value)}
											color="primary"
										/>
									</Box>
								)}
							</>
						)}
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(MealPlansPage);

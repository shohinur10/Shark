import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, CardMedia, Chip, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import StarIcon from '@mui/icons-material/Star';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Recipe, RecipeTag } from '../../../libs/types/recipe/recipe';
import { DietaryPreference } from '../../../libs/enums/nutrition.enum';
import { REACT_APP_API_URL } from '../../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Helper function to format recipe tag
const formatRecipeTag = (tag: RecipeTag | string): string => {
	return tag.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
};

// Default recipes data (for when backend is not connected)
const defaultRecipes: Recipe[] = [
	{
		_id: 'default-1',
		name: 'Grilled Chicken & Quinoa Bowl',
		description: 'A protein-packed bowl with grilled chicken, quinoa, and fresh vegetables',
		prepTime: 15,
		cookTime: 20,
		totalTime: 35,
		servings: 2,
		calories: 450,
		macros: { protein: 45, carbs: 50, fats: 12 },
		ingredients: ['Chicken breast', 'Quinoa', 'Bell peppers', 'Broccoli', 'Olive oil'],
		instructions: ['Cook quinoa', 'Grill chicken', 'Sauté vegetables', 'Assemble bowl'],
		imageUrl: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
		tags: [RecipeTag.HIGH_PROTEIN, RecipeTag.EASY, RecipeTag.LUNCH],
		rating: 4.8,
		views: 1250,
		likes: 189,
	},
	{
		_id: 'default-2',
		name: 'Salmon Power Salad',
		description: 'Nutrient-rich salad with grilled salmon, leafy greens, and healthy fats',
		prepTime: 10,
		cookTime: 15,
		totalTime: 25,
		servings: 2,
		calories: 380,
		macros: { protein: 35, carbs: 20, fats: 18 },
		ingredients: ['Salmon fillet', 'Mixed greens', 'Avocado', 'Cherry tomatoes', 'Lemon vinaigrette'],
		instructions: ['Season and grill salmon', 'Prepare salad base', 'Add toppings', 'Drizzle dressing'],
		imageUrl: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
		tags: [RecipeTag.LOW_CARB, RecipeTag.HIGH_PROTEIN, RecipeTag.LUNCH],
		rating: 4.9,
		views: 980,
		likes: 156,
	},
	{
		_id: 'default-3',
		name: 'Protein Smoothie Bowl',
		description: 'Quick and delicious smoothie bowl packed with protein and nutrients',
		prepTime: 5,
		cookTime: 0,
		totalTime: 5,
		servings: 1,
		calories: 320,
		macros: { protein: 30, carbs: 40, fats: 8 },
		ingredients: ['Greek yogurt', 'Protein powder', 'Banana', 'Berries', 'Granola'],
		instructions: ['Blend base ingredients', 'Pour into bowl', 'Top with berries and granola'],
		imageUrl: '/img/bodybuilders/pexels-leonmart-1552108.jpg',
		tags: [RecipeTag.QUICK, RecipeTag.HIGH_PROTEIN, RecipeTag.BREAKFAST, RecipeTag.POST_WORKOUT],
		rating: 4.7,
		views: 2100,
		likes: 324,
	},
	{
		_id: 'default-4',
		name: 'Lean Beef Stir Fry',
		description: 'Quick and flavorful beef stir fry with vegetables and brown rice',
		prepTime: 10,
		cookTime: 12,
		totalTime: 22,
		servings: 2,
		calories: 420,
		macros: { protein: 40, carbs: 35, fats: 15 },
		ingredients: ['Lean beef strips', 'Mixed vegetables', 'Brown rice', 'Soy sauce', 'Ginger'],
		instructions: ['Cook rice', 'Stir fry beef', 'Add vegetables', 'Season and serve'],
		imageUrl: '/img/bodybuilders/pexels-mralpha-13451637.jpg',
		tags: [RecipeTag.HIGH_PROTEIN, RecipeTag.QUICK, RecipeTag.DINNER],
		rating: 4.6,
		views: 890,
		likes: 134,
	},
	{
		_id: 'default-5',
		name: 'Veggie Power Wrap',
		description: 'Fresh and healthy wrap loaded with vegetables and hummus',
		prepTime: 10,
		cookTime: 0,
		totalTime: 10,
		servings: 1,
		calories: 350,
		macros: { protein: 15, carbs: 45, fats: 12 },
		ingredients: ['Whole wheat tortilla', 'Hummus', 'Fresh vegetables', 'Spinach', 'Feta cheese'],
		instructions: ['Spread hummus', 'Add vegetables', 'Roll tightly', 'Cut and serve'],
		imageUrl: '/img/bodybuilders/pexels-mralpha-24809802.jpg',
		tags: [RecipeTag.VEGETARIAN, RecipeTag.EASY, RecipeTag.LUNCH, RecipeTag.MEAL_PREP],
		rating: 4.5,
		views: 567,
		likes: 98,
	},
	{
		_id: 'default-6',
		name: 'Greek Yogurt Parfait',
		description: 'Creamy Greek yogurt layered with fresh fruits and granola',
		prepTime: 5,
		cookTime: 0,
		totalTime: 5,
		servings: 1,
		calories: 280,
		macros: { protein: 25, carbs: 30, fats: 8 },
		ingredients: ['Greek yogurt', 'Honey', 'Fresh berries', 'Granola', 'Nuts'],
		instructions: ['Layer yogurt', 'Add fruits', 'Top with granola', 'Drizzle honey'],
		imageUrl: '/img/bodybuilders/pexels-oscar-machado-937103-3014237.jpg',
		tags: [RecipeTag.QUICK, RecipeTag.HIGH_PROTEIN, RecipeTag.BREAKFAST, RecipeTag.SNACK],
		rating: 4.8,
		views: 1450,
		likes: 267,
	},
	{
		_id: 'default-7',
		name: 'Keto Avocado Egg Bowl',
		description: 'Low-carb breakfast bowl with avocado, eggs, and bacon',
		prepTime: 5,
		cookTime: 10,
		totalTime: 15,
		servings: 1,
		calories: 320,
		macros: { protein: 20, carbs: 8, fats: 24 },
		ingredients: ['Avocado', 'Eggs', 'Bacon', 'Cheese', 'Hot sauce'],
		instructions: ['Cook eggs', 'Fry bacon', 'Mash avocado', 'Assemble bowl'],
		imageUrl: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
		tags: [RecipeTag.KETO, RecipeTag.LOW_CARB, RecipeTag.HIGH_PROTEIN, RecipeTag.BREAKFAST],
		rating: 4.7,
		views: 1120,
		likes: 178,
	},
	{
		_id: 'default-8',
		name: 'Vegan Buddha Bowl',
		description: 'Colorful plant-based bowl with grains, vegetables, and tahini dressing',
		prepTime: 15,
		cookTime: 20,
		totalTime: 35,
		servings: 2,
		calories: 400,
		macros: { protein: 18, carbs: 55, fats: 12 },
		ingredients: ['Quinoa', 'Chickpeas', 'Roasted vegetables', 'Kale', 'Tahini dressing'],
		instructions: ['Cook quinoa', 'Roast vegetables', 'Prepare dressing', 'Assemble bowl'],
		imageUrl: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
		tags: [RecipeTag.VEGAN, RecipeTag.EASY, RecipeTag.LUNCH, RecipeTag.MEAL_PREP],
		rating: 4.6,
		views: 890,
		likes: 145,
	},
];

const RecipesPage: NextPage = () => {
	const device = useDeviceDetect();
	const [recipes, setRecipes] = useState<Recipe[]>(defaultRecipes);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTag, setSelectedTag] = useState<RecipeTag | 'ALL'>('ALL');
	const [selectedMealType, setSelectedMealType] = useState<string>('ALL');
	const [sortBy, setSortBy] = useState<string>('views');

	// Filter and sort recipes
	const filteredRecipes = useMemo(() => {
		let filtered = [...recipes];

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(recipe) =>
					recipe.name.toLowerCase().includes(query) ||
					recipe.description?.toLowerCase().includes(query) ||
					recipe.ingredients.some((ing) => ing.toLowerCase().includes(query))
			);
		}

		// Tag filter
		if (selectedTag !== 'ALL') {
			filtered = filtered.filter((recipe) => recipe.tags.includes(selectedTag));
		}

		// Meal type filter (breakfast, lunch, dinner, snack)
		if (selectedMealType !== 'ALL') {
			filtered = filtered.filter((recipe) => recipe.tags.includes(selectedMealType as RecipeTag));
		}

		// Sort
		filtered.sort((a, b) => {
			switch (sortBy) {
				case 'views':
					return (b.views || 0) - (a.views || 0);
				case 'likes':
					return (b.likes || 0) - (a.likes || 0);
				case 'rating':
					return (b.rating || 0) - (a.rating || 0);
				case 'time':
					return a.totalTime - b.totalTime;
				case 'calories':
					return a.calories - b.calories;
				default:
					return 0;
			}
		});

		return filtered;
	}, [recipes, searchQuery, selectedTag, selectedMealType, sortBy]);

	// Get image URL
	const getRecipeImageUrl = (recipe: Recipe, index: number) => {
		if (recipe.imageUrl) {
			if (recipe.imageUrl.startsWith('http')) return recipe.imageUrl;
			return `${REACT_APP_API_URL}/${recipe.imageUrl}`;
		}
		const images = [
			'/img/bodybuilders/pexels-gabflicks-13122470.jpg',
			'/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
			'/img/bodybuilders/pexels-leonmart-1552108.jpg',
			'/img/bodybuilders/pexels-mralpha-13451637.jpg',
		];
		return images[index % images.length];
	};

	if (device === 'mobile') {
		return (
			<Stack className={'recipes-page'}>
				<Stack className={'container'}>
					<Typography variant="h4" className={'page-title'} sx={{ mb: 3 }}>
						Recipes
					</Typography>
					{filteredRecipes.length === 0 ? (
						<Box className={'empty-state'} p={4} textAlign="center">
							<Typography variant="h6">No recipes found</Typography>
							<Typography variant="body2" color="text.secondary" mt={1}>
								Try adjusting your filters!
							</Typography>
						</Box>
					) : (
						<Stack spacing={2}>
							{filteredRecipes.map((recipe, index) => (
								<Link key={recipe._id} href={`/nutrition/recipes/${recipe._id}`}>
									<Card>
										<CardMedia
											component="div"
											style={{
												height: 200,
												backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${getRecipeImageUrl(recipe, index)})`,
												backgroundSize: 'cover',
												backgroundPosition: 'center',
											}}
										/>
										<CardContent>
											<Typography variant="h6">{recipe.name}</Typography>
											<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
												{recipe.description || 'No description available.'}
											</Typography>
										</CardContent>
									</Card>
								</Link>
							))}
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'recipes-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'} sx={{ mb: 4 }}>
						<Typography variant="h2" className={'page-title'}>
							Recipe Library
						</Typography>
						<Typography variant="h6" className={'page-subtitle'}>
							Discover delicious, nutritious recipes to fuel your fitness journey
						</Typography>
					</Stack>

					{/* Search and Filters */}
					<Box className={'filters-section'} sx={{ mb: 4 }}>
						<Grid container spacing={2} alignItems="center">
							<Grid item xs={12} md={4}>
								<TextField
									fullWidth
									placeholder="Search recipes, ingredients..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									InputProps={{
										startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
									}}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={2}>
								<FormControl fullWidth>
									<InputLabel>Category</InputLabel>
									<Select
										value={selectedTag}
										label="Category"
										onChange={(e) => setSelectedTag(e.target.value as RecipeTag | 'ALL')}
									>
										<MenuItem value="ALL">All Categories</MenuItem>
										<MenuItem value={RecipeTag.HIGH_PROTEIN}>High Protein</MenuItem>
										<MenuItem value={RecipeTag.LOW_CARB}>Low Carb</MenuItem>
										<MenuItem value={RecipeTag.VEGAN}>Vegan</MenuItem>
										<MenuItem value={RecipeTag.VEGETARIAN}>Vegetarian</MenuItem>
										<MenuItem value={RecipeTag.KETO}>Keto</MenuItem>
										<MenuItem value={RecipeTag.QUICK}>Quick</MenuItem>
										<MenuItem value={RecipeTag.EASY}>Easy</MenuItem>
										<MenuItem value={RecipeTag.MEAL_PREP}>Meal Prep</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6} md={2}>
								<FormControl fullWidth>
									<InputLabel>Meal Type</InputLabel>
									<Select
										value={selectedMealType}
										label="Meal Type"
										onChange={(e) => setSelectedMealType(e.target.value)}
									>
										<MenuItem value="ALL">All Meals</MenuItem>
										<MenuItem value={RecipeTag.BREAKFAST}>Breakfast</MenuItem>
										<MenuItem value={RecipeTag.LUNCH}>Lunch</MenuItem>
										<MenuItem value={RecipeTag.DINNER}>Dinner</MenuItem>
										<MenuItem value={RecipeTag.SNACK}>Snack</MenuItem>
										<MenuItem value={RecipeTag.PRE_WORKOUT}>Pre-Workout</MenuItem>
										<MenuItem value={RecipeTag.POST_WORKOUT}>Post-Workout</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6} md={2}>
								<FormControl fullWidth>
									<InputLabel>Sort By</InputLabel>
									<Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
										<MenuItem value="views">Most Viewed</MenuItem>
										<MenuItem value="likes">Most Liked</MenuItem>
										<MenuItem value="rating">Highest Rated</MenuItem>
										<MenuItem value="time">Quickest</MenuItem>
										<MenuItem value="calories">Lowest Calories</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={2}>
								<Button
									fullWidth
									variant="outlined"
									startIcon={<FilterListIcon />}
									onClick={() => {
										setSearchQuery('');
										setSelectedTag('ALL');
										setSelectedMealType('ALL');
										setSortBy('views');
									}}
								>
									Reset
								</Button>
							</Grid>
						</Grid>
					</Box>

					{/* Recipes Grid */}
					<Box className={'recipes-section'}>
						{filteredRecipes.length === 0 ? (
							<Box className={'empty-state'} p={6} textAlign="center">
								<Typography variant="h5" gutterBottom>
									No recipes found
								</Typography>
								<Typography variant="body1" color="text.secondary">
									Try adjusting your filters or search terms!
								</Typography>
							</Box>
						) : (
							<Grid container spacing={3}>
								{filteredRecipes.map((recipe, index) => (
									<Grid item xs={12} sm={6} md={4} key={recipe._id}>
										<Link href={`/nutrition/recipes/${recipe._id}`}>
											<Card
												className={'recipe-card'}
												sx={{
													height: '100%',
													display: 'flex',
													flexDirection: 'column',
													cursor: 'pointer',
													transition: 'transform 0.2s, box-shadow 0.2s',
													'&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
												}}
											>
												<CardMedia
													component="div"
													className={'recipe-image'}
													style={{
														backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url(${getRecipeImageUrl(recipe, index)})`,
														backgroundSize: 'cover',
														backgroundPosition: 'center',
														height: 250,
														position: 'relative',
													}}
												>
													<Box
														sx={{
															position: 'absolute',
															bottom: 8,
															left: 8,
															right: 8,
															display: 'flex',
															justifyContent: 'space-between',
															alignItems: 'center',
														}}
													>
														<Stack direction="row" spacing={1}>
															<Chip
																icon={<LocalFireDepartmentIcon sx={{ color: '#ff6b35' }} />}
																label={`${recipe.calories} cal`}
																size="small"
																sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', fontWeight: 600 }}
															/>
															<Chip
																icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
																label={`${recipe.totalTime} min`}
																size="small"
																sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', fontWeight: 600 }}
															/>
														</Stack>
														{recipe.rating && recipe.rating > 0 && (
															<Box
																sx={{
																	display: 'flex',
																	alignItems: 'center',
																	gap: 0.5,
																	backgroundColor: 'rgba(0,0,0,0.5)',
																	borderRadius: 1,
																	px: 1,
																	py: 0.5,
																}}
															>
																<StarIcon sx={{ color: '#ffc107', fontSize: 18 }} />
																<Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
																	{recipe.rating.toFixed(1)}
																</Typography>
															</Box>
														)}
													</Box>
												</CardMedia>
												<CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
													<Typography variant="h6" className={'recipe-title'} gutterBottom>
														{recipe.name}
													</Typography>
													{recipe.description && (
														<Typography
															variant="body2"
															color="text.secondary"
															mb={2}
															sx={{ flexGrow: 1 }}
														>
															{recipe.description.length > 100
																? `${recipe.description.substring(0, 100)}...`
																: recipe.description}
														</Typography>
													)}
													{recipe.macros && (
														<Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
															<Chip
																label={`P: ${recipe.macros.protein}g`}
																size="small"
																sx={{ backgroundColor: '#e3f2fd' }}
															/>
															<Chip
																label={`C: ${recipe.macros.carbs}g`}
																size="small"
																sx={{ backgroundColor: '#fff3e0' }}
															/>
															<Chip
																label={`F: ${recipe.macros.fats}g`}
																size="small"
																sx={{ backgroundColor: '#f3e5f5' }}
															/>
														</Stack>
													)}
													<Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
														{recipe.tags.slice(0, 3).map((tag, idx) => (
															<Chip
																key={idx}
																label={formatRecipeTag(tag)}
																size="small"
																variant="outlined"
															/>
														))}
														{recipe.tags.length > 3 && (
															<Chip label={`+${recipe.tags.length - 3}`} size="small" variant="outlined" />
														)}
													</Stack>
													<Grid container spacing={2} mt="auto">
														<Grid item xs={6}>
															<Box textAlign="center">
																<Typography variant="caption" color="text.secondary">
																	<RestaurantIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} /> Servings
																</Typography>
																<Typography variant="body2" fontWeight={600}>
																	{recipe.servings}
																</Typography>
															</Box>
														</Grid>
														<Grid item xs={6}>
															<Box textAlign="center">
																<Typography variant="caption" color="text.secondary">
																	Views
																</Typography>
																<Typography variant="body2" fontWeight={600}>
																	{recipe.views || 0}
																</Typography>
															</Box>
														</Grid>
													</Grid>
												</CardContent>
											</Card>
										</Link>
									</Grid>
								))}
							</Grid>
						)}
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(RecipesPage);









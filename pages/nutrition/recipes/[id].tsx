import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Chip, List, ListItem, ListItemText, LinearProgress, IconButton, Divider } from '@mui/material';
import useDeviceDetect from '../../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Recipe, RecipeTag } from '../../../../libs/types/recipe/recipe';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const RecipeDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const device = useDeviceDetect();
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (id) {
			// In production, fetch recipe from API
			// For now, use sample data
			const sampleRecipe: Recipe = {
				_id: id as string,
				name: 'Grilled Chicken & Quinoa Power Bowl',
				description: 'A nutrient-dense power bowl packed with lean protein, complex carbs, and healthy fats. Perfect for post-workout recovery or a satisfying lunch that keeps you energized throughout the day.',
				prepTime: 15,
				cookTime: 20,
				totalTime: 35,
				servings: 2,
				calories: 450,
				macros: {
					protein: 45,
					carbs: 50,
					fats: 12,
				},
				ingredients: [
					'2 boneless, skinless chicken breasts (6 oz each)',
					'1 cup cooked quinoa',
					'1 cup cherry tomatoes, halved',
					'1/2 cup cucumber, diced',
					'1/4 cup red onion, thinly sliced',
					'1/2 avocado, sliced',
					'2 tbsp olive oil',
					'1 tbsp lemon juice',
					'Salt and pepper to taste',
					'Fresh herbs (parsley, cilantro)',
				],
				instructions: [
					'Season chicken breasts with salt, pepper, and your favorite spices.',
					'Heat a grill or grill pan over medium-high heat.',
					'Cook chicken for 6-7 minutes per side until internal temperature reaches 165°F.',
					'While chicken cooks, prepare quinoa according to package instructions.',
					'In a large bowl, combine quinoa, tomatoes, cucumber, and red onion.',
					'Drizzle with olive oil and lemon juice, then toss to combine.',
					'Slice the cooked chicken and arrange over the quinoa mixture.',
					'Top with avocado slices and fresh herbs.',
					'Serve immediately and enjoy!',
				],
				imageUrl: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
				tags: [RecipeTag.HIGH_PROTEIN, RecipeTag.EASY, RecipeTag.LUNCH],
				rating: 4.8,
				views: 1250,
				likes: 89,
			};
			setRecipe(sampleRecipe);
			setLoading(false);
		}
	}, [id]);

	if (device === 'mobile') {
		return <div>MOBILE RECIPE DETAIL</div>;
	} else {
		if (!recipe) {
			return <div>Loading...</div>;
		}

		return (
			<Stack className={'recipe-detail-page'}>
				<Stack className={'container'}>
					{/* Hero Section */}
					<Box className={'recipe-hero'}>
						<Box
							className={'recipe-hero-image'}
							style={{
								backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${recipe.imageUrl || '/img/bodybuilders/pexels-gabflicks-13122470.jpg'})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						>
							<Box className={'recipe-hero-overlay'}>
								<Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
									<Chip icon={<AccessTimeIcon />} label={`${recipe.prepTime} min prep`} className={'recipe-info-chip'} />
									<Chip icon={<AccessTimeIcon />} label={`${recipe.cookTime} min cook`} className={'recipe-info-chip'} />
									<Chip icon={<LocalFireDepartmentIcon />} label={`${recipe.calories} calories`} className={'recipe-info-chip'} />
									<Chip icon={<RestaurantIcon />} label={`${recipe.servings} servings`} className={'recipe-info-chip'} />
									{recipe.rating && <Chip icon={<StarIcon />} label={recipe.rating} className={'recipe-rating-chip'} />}
								</Stack>
								<Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
									{recipe.tags.map((tag, idx) => (
										<Chip key={idx} label={tag.replace(/_/g, ' ')} size="small" className={'recipe-tag-hero'} />
									))}
								</Stack>
								<Typography variant="h2" className={'recipe-hero-title'}>
									{recipe.name}
								</Typography>
								{recipe.description && (
									<Typography variant="body1" className={'recipe-hero-description'}>
										{recipe.description}
									</Typography>
								)}
								<Stack direction="row" spacing={2} mt={3}>
									<Button variant="contained" size="large" startIcon={<PlayArrowIcon />} className={'cook-now-btn'}>
										Start Cooking
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

					<Grid container spacing={4} mt={2}>
						<Grid item xs={12} md={8}>
							{/* Ingredients */}
							<Card className={'ingredients-card'} sx={{ mb: 3 }}>
								<CardContent>
									<Typography variant="h5" className={'section-title'} gutterBottom>
										Ingredients
									</Typography>
									<List>
										{recipe.ingredients.map((ingredient: string, index: number) => (
											<ListItem key={index} className={'ingredient-item'}>
												<CheckCircleIcon className={'check-icon'} fontSize="small" />
												<ListItemText primary={ingredient} className={'ingredient-text'} />
											</ListItem>
										))}
									</List>
								</CardContent>
							</Card>

							{/* Instructions */}
							<Card className={'instructions-card'}>
								<CardContent>
									<Typography variant="h5" className={'section-title'} gutterBottom>
										Cooking Instructions
									</Typography>
									<List>
										{recipe.instructions.map((instruction: string, index: number) => (
											<ListItem key={index} className={'instruction-item'}>
												<Box className={'instruction-number'}>{index + 1}</Box>
												<ListItemText primary={instruction} className={'instruction-text'} />
											</ListItem>
										))}
									</List>
								</CardContent>
							</Card>
						</Grid>

						<Grid item xs={12} md={4}>
							<Card className={'nutrition-facts-card'} sx={{ position: 'sticky', top: 20 }}>
								<CardContent>
									<Typography variant="h6" className={'section-title'} gutterBottom>
										Nutrition Facts
									</Typography>
									<Stack spacing={3} mt={2}>
										<Box className={'nutrition-fact-item'}>
											<Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
												<Typography variant="body2" className={'nutrition-label'}>
													<LocalFireDepartmentIcon className={'nutrition-icon'} fontSize="small" />
													Calories
												</Typography>
												<Typography variant="h5" className={'nutrition-value'}>
													{recipe.calories}
												</Typography>
											</Stack>
											<LinearProgress variant="determinate" value={75} className={'nutrition-progress'} />
										</Box>
										<Box className={'nutrition-fact-item protein'}>
											<Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
												<Typography variant="body2" className={'nutrition-label'}>
													<RestaurantIcon className={'nutrition-icon'} fontSize="small" />
													Protein
												</Typography>
												<Typography variant="h5" className={'nutrition-value'}>
													{recipe.macros.protein}g
												</Typography>
											</Stack>
											<LinearProgress variant="determinate" value={85} className={'nutrition-progress'} />
										</Box>
										<Box className={'nutrition-fact-item carbs'}>
											<Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
												<Typography variant="body2" className={'nutrition-label'}>
													<RestaurantIcon className={'nutrition-icon'} fontSize="small" />
													Carbs
												</Typography>
												<Typography variant="h5" className={'nutrition-value'}>
													{recipe.macros.carbs}g
												</Typography>
											</Stack>
											<LinearProgress variant="determinate" value={70} className={'nutrition-progress'} />
										</Box>
										<Box className={'nutrition-fact-item fats'}>
											<Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
												<Typography variant="body2" className={'nutrition-label'}>
													<RestaurantIcon className={'nutrition-icon'} fontSize="small" />
													Fats
												</Typography>
												<Typography variant="h5" className={'nutrition-value'}>
													{recipe.macros.fats}g
												</Typography>
											</Stack>
											<LinearProgress variant="determinate" value={60} className={'nutrition-progress'} />
										</Box>
									</Stack>
									<Divider sx={{ my: 3 }} />
									<Box className={'recipe-tips'}>
										<Typography variant="body2" className={'tips-label'} gutterBottom>
											💡 Pro Tip
										</Typography>
										<Typography variant="body2" className={'tips-text'}>
											Marinate the chicken for at least 30 minutes before grilling for maximum flavor and tenderness.
										</Typography>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(RecipeDetailPage);






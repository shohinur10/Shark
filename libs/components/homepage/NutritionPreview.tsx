import React from 'react';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, CardMedia, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarIcon from '@mui/icons-material/Star';

const nutritionFeatures = [
	{
		id: 'meal-plans',
		title: 'Meal Plans',
		description: 'Structured nutrition plans for every goal',
		icon: <MenuBookIcon />,
		image: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
		count: 50,
		rating: 4.8,
	},
	{
		id: 'recipes',
		title: 'Healthy Recipes',
		description: 'Delicious, nutritious recipes',
		icon: <LocalDiningIcon />,
		image: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
		count: 200,
		rating: 4.9,
	},
	{
		id: 'tracking',
		title: 'Nutrition Tracking',
		description: 'Track macros, calories, and progress',
		icon: <RestaurantIcon />,
		image: '/img/bodybuilders/pexels-leonmart-1552108.jpg',
		count: null,
		rating: null,
	},
];

const NutritionPreview = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'nutrition-preview'}>
				<Stack className={'container'}>
					<Typography variant="h4" className={'section-title'}>
						Nutrition & Meal Planning
					</Typography>
					<Grid container spacing={2}>
						{nutritionFeatures.map((feature) => (
							<Grid item xs={12} key={feature.id}>
								<Link href={`/nutrition${feature.id !== 'tracking' ? `/${feature.id}` : ''}`}>
									<Card className={'nutrition-card'}>
										<CardMedia
											component="div"
											className={'nutrition-image'}
											style={{
												backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${feature.image})`,
											}}
										>
											<Box className={'nutrition-content'}>
												<Box className={'nutrition-icon'}>{feature.icon}</Box>
												<Typography variant="h6" className={'nutrition-title'}>
													{feature.title}
												</Typography>
											</Box>
										</CardMedia>
									</Card>
								</Link>
							</Grid>
						))}
					</Grid>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'nutrition-preview'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Box>
							<Typography variant="h3" className={'section-title'}>
								Fuel Your Body Right
							</Typography>
							<Typography variant="body1" className={'section-subtitle'}>
								Nutrition is 80% of your fitness success. Plan meals, track macros, achieve your goals.
							</Typography>
						</Box>
						<Link href="/nutrition">
							<Button variant="outlined" className={'view-all-btn'}>
								Explore Nutrition
							</Button>
						</Link>
					</Stack>
					<Grid container spacing={3}>
						{nutritionFeatures.map((feature) => (
							<Grid item xs={12} md={4} key={feature.id}>
								<Link href={`/nutrition${feature.id !== 'tracking' ? `/${feature.id}` : ''}`}>
									<Card className={'nutrition-card'}>
										<CardMedia
											component="div"
											className={'nutrition-image'}
											style={{
												backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(${feature.image})`,
											}}
										>
											{feature.rating && (
												<Chip
													icon={<StarIcon />}
													label={feature.rating}
													size="small"
													className={'rating-chip'}
												/>
											)}
										</CardMedia>
										<CardContent>
											<Stack direction="row" alignItems="center" spacing={1} mb={1}>
												<Box className={'nutrition-icon-small'}>{feature.icon}</Box>
												<Typography variant="h5" className={'nutrition-title'}>
													{feature.title}
												</Typography>
											</Stack>
											<Typography variant="body2" className={'nutrition-description'} mb={2}>
												{feature.description}
											</Typography>
											{feature.count && (
												<Typography variant="body2" className={'nutrition-count'}>
													{feature.count} {feature.id === 'meal-plans' ? 'plans' : 'recipes'} available
												</Typography>
											)}
										</CardContent>
									</Card>
								</Link>
							</Grid>
						))}
					</Grid>
				</Stack>
			</Stack>
		);
	}
};

export default NutritionPreview;





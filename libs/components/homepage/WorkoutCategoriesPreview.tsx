import React from 'react';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PoolIcon from '@mui/icons-material/Pool';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';

const workoutCategories = [
	{
		id: 'strength',
		title: 'Strength Training',
		description: 'Build muscle and power',
		icon: <FitnessCenterIcon />,
		image: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
		count: 120,
	},
	{
		id: 'cardio',
		title: 'Cardio',
		description: 'Burn calories, boost endurance',
		icon: <LocalFireDepartmentIcon />,
		image: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
		count: 85,
	},
	{
		id: 'hiit',
		title: 'HIIT',
		description: 'High-intensity interval training',
		icon: <DirectionsRunIcon />,
		image: '/img/bodybuilders/pexels-leonmart-1552108.jpg',
		count: 65,
	},
	{
		id: 'yoga',
		title: 'Yoga & Flexibility',
		description: 'Find balance and flexibility',
		icon: <SelfImprovementIcon />,
		image: '/img/bodybuilders/pexels-mralpha-13451637.jpg',
		count: 45,
	},
	{
		id: 'swimming',
		title: 'Swimming',
		description: 'Full-body low-impact workout',
		icon: <PoolIcon />,
		image: '/img/bodybuilders/pexels-mralpha-24809802.jpg',
		count: 30,
	},
	{
		id: 'functional',
		title: 'Functional Fitness',
		description: 'Real-world movement patterns',
		icon: <SportsGymnasticsIcon />,
		image: '/img/bodybuilders/pexels-oscar-machado-937103-3014237.jpg',
		count: 55,
	},
];

const WorkoutCategoriesPreview = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'workout-categories-preview'}>
				<Stack className={'container'}>
					<Typography variant="h4" className={'section-title'}>
						Workout Categories
					</Typography>
					<Grid container spacing={2}>
						{workoutCategories.slice(0, 4).map((category) => (
							<Grid item xs={6} key={category.id}>
								<Link href={`/workouts?category=${category.id}`}>
									<Card className={'category-card'}>
										<CardMedia
											component="div"
											className={'category-image'}
											style={{
												backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${category.image})`,
											}}
										>
											<Box className={'category-icon'}>{category.icon}</Box>
											<Typography variant="h6" className={'category-title'}>
												{category.title}
											</Typography>
											<Typography variant="body2" className={'category-count'}>
												{category.count} workouts
											</Typography>
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
			<Stack className={'workout-categories-preview'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Box>
							<Typography variant="h3" className={'section-title'}>
								Workout Categories
							</Typography>
							<Typography variant="body1" className={'section-subtitle'}>
								Explore diverse workout styles to find what works for you
							</Typography>
						</Box>
						<Link href="/workouts">
							<Button variant="outlined" className={'view-all-btn'}>
								View All Workouts
							</Button>
						</Link>
					</Stack>
					<Grid container spacing={3}>
						{workoutCategories.map((category) => (
							<Grid item xs={12} sm={6} md={4} key={category.id}>
								<Link href={`/workouts?category=${category.id}`}>
									<Card className={'category-card'}>
										<CardMedia
											component="div"
											className={'category-image'}
											style={{
												backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(${category.image})`,
											}}
										>
											<Box className={'category-content'}>
												<Box className={'category-icon'}>{category.icon}</Box>
												<Typography variant="h5" className={'category-title'}>
													{category.title}
												</Typography>
												<Typography variant="body2" className={'category-description'}>
													{category.description}
												</Typography>
												<Typography variant="body2" className={'category-count'}>
													{category.count} workouts available
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
	}
};

export default WorkoutCategoriesPreview;










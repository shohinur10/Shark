import React from 'react';
import { Stack, Box, Typography, Grid } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SchoolIcon from '@mui/icons-material/School';

const WhyChooseShark = () => {
	const device = useDeviceDetect();

	const features = [
		{
			icon: <FitnessCenterIcon />,
			title: '500+ Workout Plans',
			description: 'From beginner to advanced, find workouts for every fitness level and goal.',
		},
		{
			icon: <RestaurantIcon />,
			title: 'Meal Planning Made Easy',
			description: 'Personalized meal plans with shopping lists and prep guides to fuel your body right.',
		},
		{
			icon: <TrendingUpIcon />,
			title: 'Track Your Progress',
			description: 'Monitor your fitness journey with detailed analytics, charts, and progress photos.',
		},
		{
			icon: <PeopleIcon />,
			title: 'Expert Trainers',
			description: 'Connect with certified trainers for personalized guidance and support.',
		},
		{
			icon: <LocalFireDepartmentIcon />,
			title: 'Challenges & Achievements',
			description: 'Stay motivated with daily challenges, unlock achievements, and compete with friends.',
		},
		{
			icon: <SchoolIcon />,
			title: 'Exercise Library',
			description: 'Access 1000+ exercises with step-by-step instructions and video demonstrations.',
		},
	];

	if (device === 'mobile') {
		return (
			<Stack className={'why-choose-shark'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Typography variant="h4" className={'section-title'}>
							Why Choose Shark?
						</Typography>
						<Typography variant="body2" className={'section-subtitle'}>
							Everything you need for your fitness journey in one place
						</Typography>
					</Stack>
					<Stack spacing={3}>
						{features.map((feature, index) => (
							<Box key={index} className={'feature-card'}>
								<Box className={'feature-icon'}>{feature.icon}</Box>
								<Box className={'feature-content'}>
									<Typography variant="h6" className={'feature-title'}>
										{feature.title}
									</Typography>
									<Typography variant="body2" className={'feature-description'}>
										{feature.description}
									</Typography>
								</Box>
							</Box>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'why-choose-shark'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Typography variant="h3" className={'section-title'}>
							Why Choose Shark?
						</Typography>
						<Typography variant="h6" className={'section-subtitle'}>
							Everything you need for your fitness journey in one place
						</Typography>
					</Stack>
					<Grid container spacing={4}>
						{features.map((feature, index) => (
							<Grid item xs={12} sm={6} md={4} key={index}>
								<Box className={'feature-card'}>
									<Box className={'feature-icon'}>{feature.icon}</Box>
									<Typography variant="h6" className={'feature-title'}>
										{feature.title}
									</Typography>
									<Typography variant="body2" className={'feature-description'}>
										{feature.description}
									</Typography>
								</Box>
							</Grid>
						))}
					</Grid>
				</Stack>
			</Stack>
		);
	}
};

export default WhyChooseShark;







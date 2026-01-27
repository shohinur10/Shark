import React from 'react';
import { Stack, Box, Typography, Grid, Card, CardContent } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const features = [
	{
		id: 'workouts',
		title: '500+ Workout Plans',
		description: 'Access hundreds of professionally designed workout routines for all fitness levels',
		icon: <FitnessCenterIcon />,
		color: '#2196f3',
	},
	{
		id: 'nutrition',
		title: 'Meal Planning & Tracking',
		description: 'Plan meals, track macros, and achieve your nutrition goals with ease',
		icon: <RestaurantIcon />,
		color: '#4caf50',
	},
	{
		id: 'progress',
		title: 'Progress Tracking',
		description: 'Monitor your body measurements, weight, and fitness metrics over time',
		icon: <AssessmentIcon />,
		color: '#ff9800',
	},
	{
		id: 'trainers',
		title: 'Expert Trainers',
		description: 'Connect with certified fitness professionals for personalized guidance',
		icon: <PeopleIcon />,
		color: '#9c27b0',
	},
	{
		id: 'analytics',
		title: 'Advanced Analytics',
		description: 'Get insights into your fitness journey with detailed charts and reports',
		icon: <TrendingUpIcon />,
		color: '#f44336',
	},
	{
		id: 'mobile',
		title: 'Mobile App',
		description: 'Access your workouts and nutrition plans anywhere, anytime',
		icon: <SmartphoneIcon />,
		color: '#00bcd4',
	},
	{
		id: 'sync',
		title: 'Cloud Sync',
		description: 'Your data syncs across all devices automatically',
		icon: <CloudSyncIcon />,
		color: '#607d8b',
	},
	{
		id: 'reminders',
		title: 'Smart Reminders',
		description: 'Never miss a workout or meal with personalized notifications',
		icon: <NotificationsActiveIcon />,
		color: '#e91e63',
	},
];

const AppFeatures = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'app-features'}>
				<Stack className={'container'}>
					<Typography variant="h4" className={'section-title'}>
						Platform Features
					</Typography>
					<Grid container spacing={2}>
						{features.slice(0, 4).map((feature) => (
							<Grid item xs={6} key={feature.id}>
								<Card className={'feature-card'}>
									<CardContent>
										<Box component="div" className={'feature-icon'} style={{ color: feature.color }}>
											{feature.icon}
										</Box>
										<Typography variant="h6" className={'feature-title'}>
											{feature.title}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'app-features'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Box component="div">
							<Typography variant="h3" className={'section-title'}>
								Everything You Need to Succeed
							</Typography>
							<Typography variant="body1" className={'section-subtitle'}>
								Powerful features designed to help you achieve your fitness goals faster
							</Typography>
						</Box>
					</Stack>
					<Grid container spacing={3}>
						{features.map((feature) => (
							<Grid item xs={12} sm={6} md={3} key={feature.id}>
								<Card className={'feature-card'}>
									<CardContent>
										<Box component="div" className={'feature-icon'} style={{ color: feature.color }}>
											{feature.icon}
										</Box>
										<Typography variant="h6" className={'feature-title'}>
											{feature.title}
										</Typography>
										<Typography variant="body2" className={'feature-description'}>
											{feature.description}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Stack>
			</Stack>
		);
	}
};

export default AppFeatures;










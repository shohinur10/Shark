import React from 'react';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';

const pricingPlans = [
	{
		id: 'free',
		name: 'Free',
		price: '$0',
		period: 'forever',
		description: 'Perfect for getting started',
		features: [
			'Access to basic workouts',
			'Nutrition tracking',
			'Progress photos',
			'Community support',
		],
		popular: false,
	},
	{
		id: 'premium',
		name: 'Premium',
		price: '$19.99',
		period: 'per month',
		description: 'Most popular choice',
		features: [
			'All free features',
			'500+ premium workouts',
			'Meal plans & recipes',
			'Expert trainer access',
			'Advanced analytics',
			'Priority support',
		],
		popular: true,
	},
	{
		id: 'pro',
		name: 'Pro',
		price: '$39.99',
		period: 'per month',
		description: 'For serious athletes',
		features: [
			'All premium features',
			'1-on-1 trainer sessions',
			'Custom meal plans',
			'Personalized coaching',
			'Early access to features',
			'24/7 support',
		],
		popular: false,
	},
];

const PricingTeaser = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'pricing-teaser'}>
				<Stack className={'container'}>
					<Typography variant="h4" className={'section-title'}>
						Choose Your Plan
					</Typography>
					<Stack spacing={2}>
						{pricingPlans.map((plan) => (
							<Card key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
								<CardContent>
									{plan.popular && (
										<Chip label="Most Popular" className={'popular-badge'} icon={<StarIcon />} />
									)}
									<Typography variant="h5" className={'plan-name'}>
										{plan.name}
									</Typography>
									<Typography variant="h3" className={'plan-price'}>
										{plan.price}
									</Typography>
									<Typography variant="body2" className={'plan-period'}>
										{plan.period}
									</Typography>
									<Link href="/pricing">
										<Button variant={plan.popular ? 'contained' : 'outlined'} fullWidth className={'plan-button'}>
											Get Started
										</Button>
									</Link>
								</CardContent>
							</Card>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'pricing-teaser'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Box>
							<Typography variant="h3" className={'section-title'}>
								Simple, Transparent Pricing
							</Typography>
							<Typography variant="body1" className={'section-subtitle'}>
								Choose the plan that fits your fitness journey. Start free, upgrade anytime.
							</Typography>
						</Box>
						<Link href="/pricing">
							<Button variant="outlined" className={'view-all-btn'}>
								View Full Pricing
							</Button>
						</Link>
					</Stack>
					<Grid container spacing={3} justifyContent="center">
						{pricingPlans.map((plan) => (
							<Grid item xs={12} md={4} key={plan.id}>
								<Card className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
									{plan.popular && (
										<Chip label="Most Popular" className={'popular-badge'} icon={<StarIcon />} />
									)}
									<CardContent>
										<Typography variant="h5" className={'plan-name'}>
											{plan.name}
										</Typography>
										<Typography variant="body2" className={'plan-description'} mb={2}>
											{plan.description}
										</Typography>
										<Box className={'plan-price-container'}>
											<Typography variant="h2" className={'plan-price'}>
												{plan.price}
											</Typography>
											<Typography variant="body2" className={'plan-period'}>
												/{plan.period === 'forever' ? 'forever' : 'month'}
											</Typography>
										</Box>
										<List className={'plan-features'}>
											{plan.features.map((feature, index) => (
												<ListItem key={index} disablePadding>
													<ListItemIcon>
														<CheckCircleIcon className={'feature-check'} />
													</ListItemIcon>
													<ListItemText primary={feature} className={'feature-text'} />
												</ListItem>
											))}
										</List>
										<Link href="/pricing">
											<Button
												variant={plan.popular ? 'contained' : 'outlined'}
												fullWidth
												size="large"
												className={'plan-button'}
											>
												Get Started
											</Button>
										</Link>
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

export default PricingTeaser;










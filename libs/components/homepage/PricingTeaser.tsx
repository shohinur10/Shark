import React from 'react';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
	return (
		<Stack className={'pricing-teaser'}>
			<Stack className={'container'}>
				<Stack className={'section-header'}>
					<Box component="div">
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
				<Grid container spacing={2.5} justifyContent="center" className={'pricing-grid'}>
					{pricingPlans.map((plan) => (
						<Grid item xs={12} sm={6} md={4} key={plan.id} className={'pricing-grid-item'}>
							<Card className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
								{plan.popular && (
									<Box component="div" className={'popular-badge-wrapper'}>
										<Chip label="Most Popular" className={'popular-badge'} size="small" />
									</Box>
								)}
								<CardContent className={'card-content'}>
									<Typography variant="h6" className={'plan-name'}>
										{plan.name}
									</Typography>
									<Typography variant="caption" className={'plan-description'}>
										{plan.description}
									</Typography>
									<Box component="div" className={'plan-price-container'}>
										<Typography variant="h3" className={'plan-price'}>
											{plan.price}
										</Typography>
										<Typography variant="body2" className={'plan-period'}>
											/{plan.period === 'forever' ? 'forever' : 'month'}
										</Typography>
									</Box>
									<List className={'plan-features'} dense>
										{plan.features.map((feature, index) => (
											<ListItem key={index} disablePadding className={'feature-item'}>
												<ListItemIcon className={'feature-icon-wrapper'}>
													<CheckCircleIcon className={'feature-check'} />
												</ListItemIcon>
												<ListItemText 
													primary={feature} 
													className={'feature-text'}
													primaryTypographyProps={{
														variant: 'body2',
														className: 'feature-text-primary'
													}}
												/>
											</ListItem>
										))}
									</List>
									<Link href="/pricing" style={{ width: '100%', marginTop: 'auto' }}>
										<Button
											variant={plan.popular ? 'contained' : plan.id === 'free' ? 'outlined' : 'outlined'}
											fullWidth
											className={`plan-button ${plan.popular ? 'button-primary' : plan.id === 'free' ? 'button-outline' : 'button-dark'}`}
											sx={{
												height: '44px',
												textTransform: 'none',
												fontWeight: 600,
											}}
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
};

export default PricingTeaser;










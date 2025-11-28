import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, List, ListItem, ListItemIcon, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, ToggleButtonGroup, ToggleButton } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PricingPage: NextPage = () => {
	const device = useDeviceDetect();
	const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

	const handleBillingPeriodChange = (event: React.MouseEvent<HTMLElement>, newPeriod: 'monthly' | 'yearly' | null) => {
		if (newPeriod !== null) {
			setBillingPeriod(newPeriod);
		}
	};

	// Pricing plans
	const plans = [
		{
			id: 'free',
			name: 'Free',
			monthlyPrice: 0,
			yearlyPrice: 0,
			description: 'Perfect for getting started',
			features: [
				{ name: 'Access to basic workouts', included: true },
				{ name: 'Progress tracking', included: true },
				{ name: 'Community access', included: true },
				{ name: 'Basic meal plans', included: true },
				{ name: 'Ad-free experience', included: false },
				{ name: 'Premium workouts', included: false },
				{ name: 'Personalized meal plans', included: false },
				{ name: 'Trainer consultations', included: false },
				{ name: 'Advanced analytics', included: false },
				{ name: 'Priority support', included: false },
			],
			popular: false,
			buttonText: 'Start Free',
		},
		{
			id: 'monthly',
			name: 'Monthly',
			monthlyPrice: 19.99,
			yearlyPrice: 199.99, // $16.67/month when billed yearly (30% discount)
			description: 'Full access, billed monthly',
			features: [
				{ name: 'Access to basic workouts', included: true },
				{ name: 'Progress tracking', included: true },
				{ name: 'Community access', included: true },
				{ name: 'Basic meal plans', included: true },
				{ name: 'Ad-free experience', included: true },
				{ name: 'Premium workouts', included: true },
				{ name: 'Personalized meal plans', included: true },
				{ name: 'Trainer consultations', included: true },
				{ name: 'Advanced analytics', included: true },
				{ name: 'Priority support', included: true },
			],
			popular: true,
			buttonText: 'Start Now',
		},
		{
			id: 'yearly',
			name: 'Yearly',
			monthlyPrice: 19.99,
			yearlyPrice: 199.99, // $16.67/month when billed yearly (30% discount)
			description: 'Best value - Save 30%',
			features: [
				{ name: 'Access to basic workouts', included: true },
				{ name: 'Progress tracking', included: true },
				{ name: 'Community access', included: true },
				{ name: 'Basic meal plans', included: true },
				{ name: 'Ad-free experience', included: true },
				{ name: 'Premium workouts', included: true },
				{ name: 'Personalized meal plans', included: true },
				{ name: 'Trainer consultations', included: true },
				{ name: 'Advanced analytics', included: true },
				{ name: 'Priority support', included: true },
			],
			popular: false,
			buttonText: 'Start Now',
			discount: '30% OFF',
		},
		{
			id: 'trainer',
			name: 'Trainer',
			monthlyPrice: 49.99,
			yearlyPrice: 499.99, // $41.67/month when billed yearly
			description: 'For fitness professionals',
			features: [
				{ name: 'Access to basic workouts', included: true },
				{ name: 'Progress tracking', included: true },
				{ name: 'Community access', included: true },
				{ name: 'Basic meal plans', included: true },
				{ name: 'Ad-free experience', included: true },
				{ name: 'Premium workouts', included: true },
				{ name: 'Personalized meal plans', included: true },
				{ name: 'Trainer consultations', included: true },
				{ name: 'Advanced analytics', included: true },
				{ name: 'Priority support', included: true },
				{ name: 'Client management tools', included: true },
				{ name: 'Custom branding', included: true },
				{ name: 'Revenue sharing', included: true },
			],
			popular: false,
			buttonText: 'Start Now',
		},
	];

	// Comparison features
	const comparisonFeatures = [
		{ name: 'Access to basic workouts', free: true, monthly: true, yearly: true, trainer: true },
		{ name: 'Progress tracking', free: true, monthly: true, yearly: true, trainer: true },
		{ name: 'Community access', free: true, monthly: true, yearly: true, trainer: true },
		{ name: 'Basic meal plans', free: true, monthly: true, yearly: true, trainer: true },
		{ name: 'Ad-free experience', free: false, monthly: true, yearly: true, trainer: true },
		{ name: 'Premium workouts', free: false, monthly: true, yearly: true, trainer: true },
		{ name: 'Personalized meal plans', free: false, monthly: true, yearly: true, trainer: true },
		{ name: 'Trainer consultations', free: false, monthly: true, yearly: true, trainer: true },
		{ name: 'Advanced analytics', free: false, monthly: true, yearly: true, trainer: true },
		{ name: 'Priority support', free: false, monthly: true, yearly: true, trainer: true },
		{ name: 'Client management tools', free: false, monthly: false, yearly: false, trainer: true },
		{ name: 'Custom branding', free: false, monthly: false, yearly: false, trainer: true },
		{ name: 'Revenue sharing', free: false, monthly: false, yearly: false, trainer: true },
	];

	if (device === 'mobile') {
		return (
			<Stack className={'pricing-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Pricing</Typography>
					<div>MOBILE PRICING PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		// Filter plans based on billing period
		const displayPlans = plans.filter(plan => {
			if (plan.id === 'free') return true;
			if (plan.id === 'monthly') return billingPeriod === 'monthly';
			if (plan.id === 'yearly') return billingPeriod === 'yearly';
			if (plan.id === 'trainer') return true;
			return false;
		});

		return (
			<Stack className={'pricing-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'} sx={{ textAlign: 'center', mb: 6 }}>
						<Typography variant="h3" className={'page-title'}>
							Simple, Transparent Pricing
						</Typography>
						<Typography variant="body1" className={'page-subtitle'}>
							Choose the plan that works best for you
						</Typography>
					</Stack>

					{/* Billing Period Toggle */}
					<Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
						<ToggleButtonGroup
							value={billingPeriod}
							exclusive
							onChange={handleBillingPeriodChange}
							aria-label="billing period"
							sx={{
								'& .MuiToggleButton-root': {
									padding: '8px 24px',
									fontWeight: 600,
									textTransform: 'none',
								},
							}}
						>
							<ToggleButton value="monthly" aria-label="monthly">
								Monthly
							</ToggleButton>
							<ToggleButton value="yearly" aria-label="yearly">
								Yearly <Chip label="Save 30%" size="small" color="success" sx={{ ml: 1, height: 20 }} />
							</ToggleButton>
						</ToggleButtonGroup>
					</Box>

					{/* Pricing Cards */}
					<Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
						{displayPlans.map((plan) => {
							const price = billingPeriod === 'yearly' && plan.id !== 'free' ? plan.yearlyPrice : plan.monthlyPrice;
							const monthlyEquivalent = plan.id === 'yearly' ? (plan.yearlyPrice / 12).toFixed(2) : null;

							return (
								<Grid item xs={12} sm={6} md={plan.id === 'free' || plan.id === 'trainer' ? 6 : 6} key={plan.id}>
									<Card
										className={'pricing-card'}
										sx={{
											height: '100%',
											position: 'relative',
											border: plan.popular ? '2px solid' : '1px solid',
											borderColor: plan.popular ? 'primary.main' : 'divider',
											transition: 'all 0.3s ease',
											'&:hover': {
												transform: 'translateY(-4px)',
												boxShadow: 4,
											},
										}}
									>
										{plan.popular && (
											<Chip
												label="MOST POPULAR"
												color="primary"
												sx={{
													position: 'absolute',
													top: -12,
													left: '50%',
													transform: 'translateX(-50%)',
													fontWeight: 600,
													fontSize: '0.7rem',
												}}
											/>
										)}
										{plan.discount && (
											<Chip
												label={plan.discount}
												color="success"
												sx={{
													position: 'absolute',
													top: 16,
													right: 16,
													fontWeight: 600,
												}}
											/>
										)}
										<CardContent sx={{ p: 4 }}>
											<Typography variant="h5" gutterBottom align="center" fontWeight={600}>
												{plan.name}
											</Typography>
											<Typography variant="body2" color="text.secondary" align="center" gutterBottom>
												{plan.description}
											</Typography>
											<Box sx={{ textAlign: 'center', my: 3 }}>
												{plan.id === 'free' ? (
													<>
														<Typography variant="h2" component="span" fontWeight={700}>
															Free
														</Typography>
														<Typography variant="body2" color="text.secondary" display="block" mt={1}>
															Forever
														</Typography>
													</>
												) : (
													<>
														<Typography variant="h2" component="span" fontWeight={700}>
															${price}
														</Typography>
														<Typography variant="body2" color="text.secondary" component="span" ml={1}>
															/{billingPeriod === 'yearly' ? 'year' : 'month'}
														</Typography>
														{monthlyEquivalent && (
															<Typography variant="body2" color="text.secondary" display="block" mt={1}>
																${monthlyEquivalent}/month when billed yearly
															</Typography>
														)}
													</>
												)}
											</Box>
											<List sx={{ mb: 3 }}>
												{plan.features.map((feature, idx) => (
													<ListItem key={idx} sx={{ px: 0, py: 0.75 }}>
														<ListItemIcon sx={{ minWidth: 32 }}>
															{feature.included ? (
																<CheckCircleIcon color="success" fontSize="small" />
															) : (
																<CloseIcon color="disabled" fontSize="small" />
															)}
														</ListItemIcon>
														<Typography variant="body2" sx={{ textDecoration: feature.included ? 'none' : 'line-through', opacity: feature.included ? 1 : 0.5 }}>
															{feature.name}
														</Typography>
													</ListItem>
												))}
											</List>
											<Button
												variant={plan.popular ? 'contained' : 'outlined'}
												fullWidth
												size="large"
												className={'start-now-btn'}
												sx={{
													mt: 2,
													py: 1.5,
													fontWeight: 600,
													textTransform: 'none',
												}}
											>
												{plan.buttonText}
											</Button>
										</CardContent>
									</Card>
								</Grid>
							);
						})}
					</Grid>

					{/* Comparison Chart */}
					<Box className={'comparison-section'}>
						<Typography variant="h4" className={'section-title'} align="center" gutterBottom>
							Compare Plans
						</Typography>
						<Typography variant="body2" color="text.secondary" align="center" paragraph sx={{ mb: 4 }}>
							See what's included in each plan
						</Typography>
						<TableContainer component={Paper} variant="outlined">
							<Table>
								<TableHead>
									<TableRow>
										<TableCell><strong>Feature</strong></TableCell>
										<TableCell align="center"><strong>Free</strong></TableCell>
										<TableCell align="center"><strong>Monthly</strong></TableCell>
										<TableCell align="center"><strong>Yearly</strong></TableCell>
										<TableCell align="center"><strong>Trainer</strong></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{comparisonFeatures.map((feature, index) => (
										<TableRow key={index} hover>
											<TableCell component="th" scope="row">
												{feature.name}
											</TableCell>
											<TableCell align="center">
												{feature.free ? <CheckCircleIcon color="success" /> : <CloseIcon color="disabled" />}
											</TableCell>
											<TableCell align="center">
												{feature.monthly ? <CheckCircleIcon color="success" /> : <CloseIcon color="disabled" />}
											</TableCell>
											<TableCell align="center">
												{feature.yearly ? <CheckCircleIcon color="success" /> : <CloseIcon color="disabled" />}
											</TableCell>
											<TableCell align="center">
												{feature.trainer ? <CheckCircleIcon color="success" /> : <CloseIcon color="disabled" />}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(PricingPage);






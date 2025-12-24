import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, List, ListItem, ListItemIcon, Chip, ToggleButtonGroup, ToggleButton, Divider } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
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

	// Pricing plans - Redesigned with equal heights and visual balance
	const plans = [
		{
			id: 'free',
			name: 'Starter',
			monthlyPrice: 0,
			yearlyPrice: 0,
			tagline: 'Build your habit',
			features: [
				'Basic workouts',
				'Progress tracking',
				'Community access',
				'Basic meal plans',
			],
			popular: false,
			buttonText: 'Start Free',
			buttonVariant: 'outlined' as const,
		},
		{
			id: 'monthly',
			name: 'Member',
			monthlyPrice: 19.99,
			yearlyPrice: 199.99, // $16.67/month when billed yearly (30% discount)
			tagline: 'Consistency with structure',
			features: [
				'Everything in Starter',
				'Premium workouts',
				'Personalized meal plans',
				'Trainer consultations',
				'Advanced analytics',
				'Ad-free experience',
			],
			popular: true,
			popularBadge: 'Most Chosen',
			buttonText: 'Start Training',
			buttonVariant: 'contained' as const,
		},
		{
			id: 'yearly',
			name: 'Member',
			monthlyPrice: 19.99,
			yearlyPrice: 199.99, // $16.67/month when billed yearly (30% discount)
			tagline: 'Consistency with structure',
			features: [
				'Everything in Starter',
				'Premium workouts',
				'Personalized meal plans',
				'Trainer consultations',
				'Advanced analytics',
				'Ad-free experience',
			],
			popular: false,
			buttonText: 'Start Training',
			buttonVariant: 'contained' as const,
			discount: 'Save 30%',
		},
		{
			id: 'trainer',
			name: 'For Coaches',
			monthlyPrice: 49.99,
			yearlyPrice: 499.99, // $41.67/month when billed yearly
			tagline: 'Train others professionally',
			features: [
				'Client management',
				'Trainer analytics',
				'Program publishing',
				'Priority support',
			],
			popular: false,
			buttonText: 'Become a Trainer',
			buttonVariant: 'outlined' as const,
		},
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
			<Box
				className={'pricing-page'}
				sx={{
					backgroundColor: '#F7F7F7',
					minHeight: '100vh',
					paddingTop: '100px',
					paddingBottom: '80px',
				}}
			>
				<Stack className={'container'} spacing={6}>
					{/* Premium Hero Section */}
					<Card
						elevation={0}
						sx={{
							backgroundColor: '#FFFFFF',
							borderRadius: '24px',
							border: '1px solid #E5E5E5',
							padding: { xs: '48px 32px', md: '80px 48px' },
							background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
							position: 'relative',
							overflow: 'hidden',
							'&::after': {
								content: '""',
								position: 'absolute',
								bottom: 0,
								left: 0,
								right: 0,
								height: '1px',
								background: 'linear-gradient(90deg, transparent 0%, #E5E5E5 20%, #E5E5E5 80%, transparent 100%)',
							},
						}}
					>
						<Stack spacing={4} alignItems="center" textAlign="center">
							{/* Title */}
							<Typography
								variant="h1"
								sx={{
									fontSize: { xs: '40px', md: '56px' },
									fontWeight: 700,
									color: '#111111',
									lineHeight: 1.2,
									letterSpacing: '-0.8px',
									maxWidth: '800px',
								}}
							>
								Choose Your Training Path
							</Typography>

							{/* Subtitle */}
							<Typography
								sx={{
									fontSize: { xs: '18px', md: '22px' },
									color: '#6B6B6B',
									lineHeight: 1.6,
									maxWidth: '700px',
									fontWeight: 400,
								}}
							>
								Only pay for the level of guidance you actually need.
							</Typography>

							{/* Trust Microcopy */}
							<Typography
								sx={{
									fontSize: '15px',
									color: '#6B6B6B',
									fontWeight: 400,
									lineHeight: 1.6,
									letterSpacing: '0.2px',
								}}
							>
								No contracts • Cancel anytime • Used by 12,000+ active members
							</Typography>

							{/* Motivation Line */}
							<Box
								sx={{
									mt: 2,
									pt: 3,
									borderTop: '1px solid #E5E5E5',
									width: '100%',
									maxWidth: '600px',
								}}
							>
								<Typography
									sx={{
										fontSize: '15px',
										color: '#6B6B6B',
										fontWeight: 400,
										fontStyle: 'italic',
										lineHeight: 1.6,
									}}
								>
									Most members upgrade after 14 days of consistency.
								</Typography>
							</Box>
						</Stack>
					</Card>

					{/* Billing Period Toggle */}
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<Card
							elevation={0}
							sx={{
								backgroundColor: '#FFFFFF',
								borderRadius: '16px',
								border: '1px solid #E5E5E5',
								padding: '8px',
								display: 'inline-flex',
							}}
						>
							<ToggleButtonGroup
								value={billingPeriod}
								exclusive
								onChange={handleBillingPeriodChange}
								aria-label="billing period"
								sx={{
									'& .MuiToggleButton-root': {
										padding: '10px 32px',
										fontWeight: 600,
										textTransform: 'none',
										fontSize: '15px',
										border: 'none',
										borderRadius: '12px',
										color: '#6B6B6B',
										'&.Mui-selected': {
											backgroundColor: '#E10600',
											color: '#FFFFFF',
											'&:hover': {
												backgroundColor: '#C10500',
											},
										},
										'&:hover': {
											backgroundColor: 'rgba(225, 6, 0, 0.08)',
										},
									},
								}}
							>
								<ToggleButton value="monthly" aria-label="monthly">
									Monthly
								</ToggleButton>
								<ToggleButton value="yearly" aria-label="yearly">
									Yearly
									<Chip
										label="Save 30%"
										size="small"
										sx={{
											ml: 1.5,
											height: '22px',
											backgroundColor: 'rgba(76, 175, 80, 0.1)',
											color: '#4CAF50',
											fontSize: '11px',
											fontWeight: 700,
											'& .MuiChip-label': {
												padding: '0 8px',
											},
										}}
									/>
								</ToggleButton>
							</ToggleButtonGroup>
						</Card>
					</Box>

					{/* Pricing Cards */}
					<Grid container spacing={4} justifyContent="center" sx={{ alignItems: 'stretch' }}>
						{displayPlans.map((plan) => {
							const price = billingPeriod === 'yearly' && plan.id !== 'free' ? plan.yearlyPrice : plan.monthlyPrice;
							const monthlyEquivalent = plan.id === 'yearly' ? (plan.yearlyPrice / 12).toFixed(2) : null;
							const isPopular = plan.popular;

							return (
								<Grid item xs={12} sm={6} md={4} key={plan.id} sx={{ display: 'flex' }}>
									<Card
										className={'pricing-card'}
										elevation={0}
										sx={{
											width: '100%',
											height: '100%',
											position: 'relative',
											backgroundColor: '#FFFFFF',
											borderRadius: '16px',
											border: isPopular ? '2px solid #E10600' : '1px solid #E5E5E5',
											borderTop: isPopular ? '3px solid #E10600' : undefined,
											boxShadow: isPopular
												? '0 8px 24px rgba(225, 6, 0, 0.15), 0 0 0 1px rgba(225, 6, 0, 0.1), inset 0 3px 0 0 rgba(225, 6, 0, 0.2)'
												: '0 2px 8px rgba(0, 0, 0, 0.08)',
											transition: 'all 0.3s ease',
											overflow: 'visible',
											display: 'flex',
											flexDirection: 'column',
											...(isPopular && {
												transform: 'translateY(-4px)',
											}),
											'&:hover': {
												transform: isPopular ? 'translateY(-8px)' : 'translateY(-4px)',
												boxShadow: isPopular
													? '0 16px 48px rgba(225, 6, 0, 0.25), 0 0 0 1px rgba(225, 6, 0, 0.15), inset 0 3px 0 0 rgba(225, 6, 0, 0.3)'
													: '0 8px 24px rgba(0, 0, 0, 0.12)',
											},
										}}
									>
										{/* Popular Badge */}
										{isPopular && plan.popularBadge && (
											<Chip
												label={plan.popularBadge}
												sx={{
													position: 'absolute',
													top: -12,
													left: '50%',
													transform: 'translateX(-50%)',
													backgroundColor: '#E10600',
													color: '#FFFFFF',
													fontWeight: 700,
													fontSize: '11px',
													height: '24px',
													px: 2,
													boxShadow: '0 4px 12px rgba(225, 6, 0, 0.3)',
													textTransform: 'uppercase',
													letterSpacing: '0.5px',
												}}
											/>
										)}
										{plan.discount && (
											<Chip
												label={plan.discount}
												sx={{
													position: 'absolute',
													top: 16,
													right: 16,
													backgroundColor: 'rgba(76, 175, 80, 0.1)',
													color: '#4CAF50',
													fontWeight: 700,
													fontSize: '11px',
													height: '24px',
												}}
											/>
										)}
										<CardContent
											sx={{
												p: { xs: 3, md: 4 },
												height: '100%',
												display: 'flex',
												flexDirection: 'column',
												flex: 1,
											}}
										>
											{/* Plan Name & Tagline */}
											<Stack spacing={1} mb={3}>
												<Typography
													variant="h4"
													sx={{
														fontSize: '24px',
														fontWeight: 700,
														color: '#111111',
														lineHeight: 1.2,
													}}
												>
													{plan.name}
												</Typography>
												<Typography
													sx={{
														fontSize: '15px',
														color: '#6B6B6B',
														fontWeight: 400,
														lineHeight: 1.5,
													}}
												>
													{plan.tagline}
												</Typography>
											</Stack>

											{/* Price */}
											<Box sx={{ mb: 3 }}>
												{plan.id === 'free' ? (
													<Stack spacing={0.5}>
														<Typography
															variant="h2"
															sx={{
																fontSize: '42px',
																fontWeight: 700,
																color: '#111111',
																lineHeight: 1,
															}}
														>
															Free
														</Typography>
														<Typography
															sx={{
																fontSize: '14px',
																color: '#6B6B6B',
																fontWeight: 400,
															}}
														>
															/ Forever
														</Typography>
													</Stack>
												) : (
													<Stack spacing={0.5}>
														<Stack direction="row" alignItems="baseline" spacing={1}>
															<Typography
																variant="h2"
																sx={{
																	fontSize: '42px',
																	fontWeight: 700,
																	color: '#111111',
																	lineHeight: 1,
																}}
															>
																${price}
															</Typography>
															<Typography
																sx={{
																	fontSize: '16px',
																	color: '#6B6B6B',
																	fontWeight: 400,
																}}
															>
																/ {billingPeriod === 'yearly' ? 'year' : 'month'}
															</Typography>
														</Stack>
														{monthlyEquivalent && (
															<Typography
																sx={{
																	fontSize: '13px',
																	color: '#4CAF50',
																	fontWeight: 600,
																	mt: 0.5,
																}}
															>
																${monthlyEquivalent}/month when billed yearly
															</Typography>
														)}
													</Stack>
												)}
											</Box>

											<Divider sx={{ mb: 3, borderColor: '#E5E5E5' }} />

											{/* Features - Grouped, not long list */}
											<Stack spacing={2} sx={{ mb: 4, flex: 1 }}>
												{plan.features.map((feature, idx) => (
													<Stack key={idx} direction="row" spacing={1.5} alignItems="flex-start">
														<CheckCircleIcon
															sx={{
																fontSize: '18px',
																color: '#4CAF50',
																mt: 0.25,
																flexShrink: 0,
															}}
														/>
														<Typography
															sx={{
																fontSize: '15px',
																color: '#111111',
																fontWeight: 400,
																lineHeight: 1.6,
															}}
														>
															{feature}
														</Typography>
													</Stack>
												))}
											</Stack>

											{/* CTA Button */}
											<Button
												variant={plan.buttonVariant}
												fullWidth
												size="large"
												sx={{
													mt: 'auto',
													py: 1.75,
													fontWeight: 600,
													textTransform: 'none',
													fontSize: '15px',
													borderRadius: '12px',
													...(plan.buttonVariant === 'contained'
														? {
																backgroundColor: '#111111',
																color: '#FFFFFF',
																boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
																'&:hover': {
																	backgroundColor: '#000000',
																	boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
																	transform: 'translateY(-1px)',
																},
														  }
														: {
																borderColor: '#E5E5E5',
																borderWidth: '1.5px',
																color: '#111111',
																'&:hover': {
																	borderColor: '#111111',
																	backgroundColor: 'rgba(0, 0, 0, 0.04)',
																	color: '#111111',
																},
														  }),
													transition: 'all 0.2s ease',
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

					{/* Who This Plan Is Best For Section */}
					<Box sx={{ mt: 6 }}>
						<Typography
							sx={{
								fontSize: '24px',
								fontWeight: 700,
								color: '#111111',
								textAlign: 'center',
								mb: 4,
							}}
						>
							Who This Plan Is Best For
						</Typography>
						<Grid container spacing={3}>
							{/* Starter Plan */}
							<Grid item xs={12} md={4}>
								<Card
									elevation={0}
									sx={{
										backgroundColor: '#FFFFFF',
										borderRadius: '16px',
										border: '1px solid #E5E5E5',
										padding: { xs: '24px', md: '32px' },
										height: '100%',
										transition: 'all 0.3s ease',
										'&:hover': {
											boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
											transform: 'translateY(-2px)',
										},
									}}
								>
									<Stack spacing={2}>
										<Typography
											sx={{
												fontSize: '18px',
												fontWeight: 700,
												color: '#111111',
												mb: 1,
											}}
										>
											Starter
										</Typography>
										<Typography
											sx={{
												fontSize: '15px',
												color: '#6B6B6B',
												lineHeight: 1.7,
												fontWeight: 400,
											}}
										>
											Best if you are just starting and want to build consistency without pressure.
										</Typography>
									</Stack>
								</Card>
							</Grid>

							{/* Member Plan */}
							<Grid item xs={12} md={4}>
								<Card
									elevation={0}
									sx={{
										backgroundColor: '#FFFFFF',
										borderRadius: '16px',
										border: '1px solid #E10600',
										borderTop: '3px solid #E10600',
										padding: { xs: '24px', md: '32px' },
										height: '100%',
										boxShadow: '0 4px 16px rgba(225, 6, 0, 0.1)',
										transition: 'all 0.3s ease',
										'&:hover': {
											boxShadow: '0 8px 24px rgba(225, 6, 0, 0.15)',
											transform: 'translateY(-2px)',
										},
									}}
								>
									<Stack spacing={2}>
										<Typography
											sx={{
												fontSize: '18px',
												fontWeight: 700,
												color: '#111111',
												mb: 1,
											}}
										>
											Member
										</Typography>
										<Typography
											sx={{
												fontSize: '15px',
												color: '#6B6B6B',
												lineHeight: 1.7,
												fontWeight: 400,
											}}
										>
											Best if you train 3–5 times per week and want visible progress.
										</Typography>
									</Stack>
								</Card>
							</Grid>

							{/* Trainer Plan */}
							<Grid item xs={12} md={4}>
								<Card
									elevation={0}
									sx={{
										backgroundColor: '#FFFFFF',
										borderRadius: '16px',
										border: '1px solid #E5E5E5',
										padding: { xs: '24px', md: '32px' },
										height: '100%',
										transition: 'all 0.3s ease',
										'&:hover': {
											boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
											transform: 'translateY(-2px)',
										},
									}}
								>
									<Stack spacing={2}>
										<Typography
											sx={{
												fontSize: '18px',
												fontWeight: 700,
												color: '#111111',
												mb: 1,
											}}
										>
											For Coaches
										</Typography>
										<Typography
											sx={{
												fontSize: '15px',
												color: '#6B6B6B',
												lineHeight: 1.7,
												fontWeight: 400,
											}}
										>
											Best if fitness is your profession or side business.
										</Typography>
									</Stack>
								</Card>
							</Grid>
						</Grid>
					</Box>

					{/* Reassurance Section */}
					<Card
						elevation={0}
						sx={{
							backgroundColor: '#FAFAFA',
							borderRadius: '20px',
							border: '1px solid #E5E5E5',
							padding: { xs: '40px 32px', md: '56px 48px' },
							mt: 6,
						}}
					>
						<Stack spacing={4} alignItems="center" textAlign="center">
							<Typography
								sx={{
									fontSize: { xs: '28px', md: '32px' },
									fontWeight: 600,
									color: '#111111',
									lineHeight: 1.3,
								}}
							>
								Train with confidence
							</Typography>
							<Grid container spacing={3} justifyContent="center" sx={{ maxWidth: '800px' }}>
								<Grid item xs={12} sm={6} md={3}>
									<Stack spacing={1.5} alignItems="center" textAlign="center">
										<CheckCircleIcon
											sx={{
												fontSize: '28px',
												color: '#4CAF50',
											}}
										/>
										<Typography
											sx={{
												fontSize: '15px',
												color: '#6B6B6B',
												fontWeight: 400,
												lineHeight: 1.6,
											}}
										>
											Cancel anytime
										</Typography>
									</Stack>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Stack spacing={1.5} alignItems="center" textAlign="center">
										<CheckCircleIcon
											sx={{
												fontSize: '28px',
												color: '#4CAF50',
											}}
										/>
										<Typography
											sx={{
												fontSize: '15px',
												color: '#6B6B6B',
												fontWeight: 400,
												lineHeight: 1.6,
											}}
										>
											No hidden fees
										</Typography>
									</Stack>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Stack spacing={1.5} alignItems="center" textAlign="center">
										<CheckCircleIcon
											sx={{
												fontSize: '28px',
												color: '#4CAF50',
											}}
										/>
										<Typography
											sx={{
												fontSize: '15px',
												color: '#6B6B6B',
												fontWeight: 400,
												lineHeight: 1.6,
											}}
										>
											Progress data stays yours
										</Typography>
									</Stack>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									<Stack spacing={1.5} alignItems="center" textAlign="center">
										<CheckCircleIcon
											sx={{
												fontSize: '28px',
												color: '#4CAF50',
											}}
										/>
										<Typography
											sx={{
												fontSize: '15px',
												color: '#6B6B6B',
												fontWeight: 400,
												lineHeight: 1.6,
											}}
										>
											Upgrade or downgrade anytime
										</Typography>
									</Stack>
								</Grid>
							</Grid>
						</Stack>
					</Card>

					{/* Trust Section */}
					<Card
						elevation={0}
						sx={{
							backgroundColor: '#FFFFFF',
							borderRadius: '20px',
							border: '1px solid #E5E5E5',
							padding: { xs: '32px', md: '48px' },
							mt: 4,
						}}
					>
						<Stack spacing={3} alignItems="center" textAlign="center">
							<Typography
								sx={{
									fontSize: '24px',
									fontWeight: 700,
									color: '#111111',
									mb: 1,
								}}
							>
								Join thousands transforming their fitness
							</Typography>
							<Typography
								sx={{
									fontSize: '16px',
									color: '#6B6B6B',
									maxWidth: '600px',
									lineHeight: 1.6,
								}}
							>
								Every journey starts with a single step. Whether you're exploring fitness for the first time or ready to commit to transformation, we're here to support you every step of the way.
							</Typography>
							<Stack direction="row" spacing={4} mt={2} flexWrap="wrap" justifyContent="center">
								<Stack spacing={0.5} alignItems="center">
									<Typography
										sx={{
											fontSize: '32px',
											fontWeight: 700,
											color: '#E10600',
											lineHeight: 1,
										}}
									>
										50K+
									</Typography>
									<Typography
										sx={{
											fontSize: '14px',
											color: '#6B6B6B',
											fontWeight: 500,
										}}
									>
										Active Members
									</Typography>
								</Stack>
								<Stack spacing={0.5} alignItems="center">
									<Typography
										sx={{
											fontSize: '32px',
											fontWeight: 700,
											color: '#E10600',
											lineHeight: 1,
										}}
									>
										4.9/5
									</Typography>
									<Typography
										sx={{
											fontSize: '14px',
											color: '#6B6B6B',
											fontWeight: 500,
										}}
									>
										Member Rating
									</Typography>
								</Stack>
								<Stack spacing={0.5} alignItems="center">
									<Typography
										sx={{
											fontSize: '32px',
											fontWeight: 700,
											color: '#E10600',
											lineHeight: 1,
										}}
									>
										99.9%
									</Typography>
									<Typography
										sx={{
											fontSize: '14px',
											color: '#6B6B6B',
											fontWeight: 500,
										}}
									>
										Uptime
									</Typography>
								</Stack>
							</Stack>
						</Stack>
					</Card>
				</Stack>
			</Box>
		);
	}
};

export default withLayoutBasic(PricingPage);






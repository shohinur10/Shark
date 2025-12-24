import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack, Typography, TextField, Button, Grid, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Chip, Divider } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import HelpIcon from '@mui/icons-material/Help';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PolicyIcon from '@mui/icons-material/Policy';
import BuildIcon from '@mui/icons-material/Build';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { InquiryCategory } from '../../libs/enums/inquiry.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const SupportPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [contactForm, setContactForm] = useState({
		name: '',
		email: '',
		category: 'account',
		message: '',
	});
	const [expandedTroubleshooting, setExpandedTroubleshooting] = useState<string | false>(false);
	const [issueFeedback, setIssueFeedback] = useState<Record<string, 'yes' | 'no' | null>>({});

	// Smart Help Context - Detect user activity and show relevant help
	const getSmartHelpContext = () => {
		// In a real app, this would check user activity from API/localStorage
		// For now, we'll simulate based on common scenarios
		// You can replace this with actual user activity detection
		
		// Check localStorage for recent activity indicators
		const recentPaymentFailure = typeof window !== 'undefined' ? localStorage.getItem('recent_payment_failure') : null;
		const missedWorkouts = typeof window !== 'undefined' ? localStorage.getItem('missed_workouts_count') : null;
		const isNewUser = typeof window !== 'undefined' ? localStorage.getItem('is_new_user') : null;
		
		if (recentPaymentFailure === 'true') {
			return {
				message: 'Having trouble with billing?',
				action: 'Check our payment troubleshooting guide',
				link: 'troubleshooting',
				highlight: 'payment',
			};
		}
		
		if (missedWorkouts && parseInt(missedWorkouts) > 2) {
			return {
				message: 'Need help staying consistent?',
				action: 'Explore our workout tips',
				link: 'faq',
				highlight: 'workouts',
			};
		}
		
		if (isNewUser === 'true') {
			return {
				message: 'New here? Start with these guides.',
				action: 'Get started',
				link: 'faq',
				highlight: 'welcome',
			};
		}
		
		// Default: no context (don't show card)
		return null;
	};

	const smartHelpContext = getSmartHelpContext();

	/** HANDLERS **/
	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/support',
				query: { tab: tab },
			},
			undefined,
			{ scroll: false },
		);
	};

	const handleContactSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		console.log('Contact form submitted:', contactForm);
		alert('Thank you for contacting us! We will get back to you soon.');
		setContactForm({
			name: '',
			email: '',
			category: 'account',
			message: '',
		});
	};

	const handleTroubleshootingChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpandedTroubleshooting(isExpanded ? panel : false);
	};

	const handleIssueFeedback = (issueId: string, solved: boolean) => {
		setIssueFeedback({ ...issueFeedback, [issueId]: solved ? 'yes' : 'no' });
	};

	const tab = router.query.tab ?? 'faq';

	// Troubleshooting guide data with step-by-step solutions
	const troubleshootingGuides = [
		{
			id: 'trouble-1',
			title: 'Workout videos not loading',
			steps: [
				'Check your internet connection - make sure you\'re connected to WiFi or have good data signal',
				'Refresh the page (press F5 or click the refresh button)',
				'Clear your browser cache - go to Settings > Privacy > Clear browsing data',
				'Try a different browser (Chrome, Firefox, or Safari)',
				'If you\'re on mobile, close and reopen the app completely',
			],
		},
		{
			id: 'trouble-2',
			title: 'Progress not saving',
			steps: [
				'Make sure you\'re logged in - check the top right corner for your profile',
				'Verify your internet connection is active',
				'Wait a few seconds after completing a workout - it saves automatically',
				'Try logging out and back in to refresh your session',
				'Check if you see a "Saved" confirmation message',
			],
		},
		{
			id: 'trouble-3',
			title: 'Payment issues',
			steps: [
				'Double-check your card number, expiry date, and CVV are correct',
				'Make sure your card has sufficient funds or credit limit',
				'Try a different payment method (another card or PayPal)',
				'Contact your bank to ensure the card isn\'t blocked for online purchases',
				'Wait a few minutes and try again - sometimes payments take a moment to process',
			],
		},
		{
			id: 'trouble-4',
			title: 'App crashes or freezes',
			steps: [
				'Close the app completely and reopen it',
				'Update to the latest version from the App Store or Google Play',
				'Restart your device (turn it off and on again)',
				'Clear the app cache: Settings > Apps > [App Name] > Clear Cache',
				'If it still crashes, uninstall and reinstall the app (your data is saved in the cloud)',
			],
		},
		{
			id: 'trouble-5',
			title: 'Can\'t access premium features',
			steps: [
				'Go to Account Settings and check your subscription status',
				'Make sure your payment went through - check your email for confirmation',
				'Log out completely and log back in to refresh your account',
				'Wait 5-10 minutes - sometimes it takes a moment for premium access to activate',
				'Check if your subscription expired - you might need to renew',
			],
		},
		{
			id: 'trouble-6',
			title: 'Meal plan not working',
			steps: [
				'Make sure all required fields are filled in (age, weight, height, activity level)',
				'Check your internet connection is stable',
				'Refresh the page and try again',
				'Clear your browser cache and cookies',
				'Try using the meal plan on a different device to see if it\'s device-specific',
			],
		},
	];

	// Policy pages data
	const policyPages = [
		{
			id: 'privacy',
			title: 'Privacy Policy',
			description: 'We only collect what we need to make your experience better. Your data stays safe and we never sell it to third parties.',
			tags: ['Easy to understand', 'No hidden rules'],
		},
		{
			id: 'terms',
			title: 'Terms of Service',
			description: 'Simple rules for using our platform. We want you to have a great experience while keeping things fair for everyone.',
			tags: ['Easy to understand', 'No hidden rules'],
		},
		{
			id: 'refund',
			title: 'Refund Policy',
			description: 'Not happy? Get a full refund within 30 days, no questions asked. Cancel your subscription anytime with just a few clicks.',
			tags: ['Cancel anytime', 'No hidden rules'],
		},
		{
			id: 'cookie',
			title: 'Cookie Policy',
			description: 'We use cookies to remember your preferences and improve the app. You can control which cookies we use in your settings.',
			tags: ['Easy to understand', 'No hidden rules'],
		},
	];

	if (device === 'mobile') {
		return <h1>SUPPORT PAGE MOBILE</h1>;
	} else {
		return (
			<Stack className={'support-page'}>
				<Stack className={'container'}>
					<Box component={'div'} className={'support-header'}>
						<Box component={'div'} className={'header-info'}>
							<Typography variant="h3" className={'page-title'}>
								Support Center
							</Typography>
							<Typography variant="body1" className={'page-subtitle'}>
								We're here to help answer your questions
							</Typography>
						</Box>
						<Box component={'div'} className={'tab-navigation'}>
							<button
								className={`tab-button ${tab === 'faq' ? 'active' : ''}`}
								onClick={() => changeTabHandler('faq')}
							>
								<HelpIcon className="tab-icon" />
								<span>FAQ</span>
							</button>
							<button
								className={`tab-button ${tab === 'contact' ? 'active' : ''}`}
								onClick={() => changeTabHandler('contact')}
							>
								<ContactMailIcon className="tab-icon" />
								<span>Contact</span>
							</button>
							<button
								className={`tab-button ${tab === 'policies' ? 'active' : ''}`}
								onClick={() => changeTabHandler('policies')}
							>
								<PolicyIcon className="tab-icon" />
								<span>Policies</span>
							</button>
							<button
								className={`tab-button ${tab === 'troubleshooting' ? 'active' : ''}`}
								onClick={() => changeTabHandler('troubleshooting')}
							>
								<BuildIcon className="tab-icon" />
								<span>Troubleshooting</span>
							</button>
						</Box>
					</Box>

					<Box component={'div'} className={'support-content'}>
						{smartHelpContext && (
							<Box className={'smart-help-context'}>
								<Card className={'smart-help-card'}>
									<CardContent className={'smart-help-content'}>
										<LightbulbIcon className={'smart-help-icon'} />
										<Box className={'smart-help-text'}>
											<Typography variant="body2" className={'smart-help-message'}>
												{smartHelpContext.message}
											</Typography>
											<Button
												size="small"
												className={'smart-help-action'}
												onClick={() => changeTabHandler(smartHelpContext.link)}
											>
												{smartHelpContext.action} →
											</Button>
										</Box>
									</CardContent>
								</Card>
							</Box>
						)}

						{tab === 'faq' && (
							<Box className={'section-container'}>
								<Faq />
							</Box>
						)}

						{tab === 'contact' && (
							<Box className={'section-container contact-section'}>
								<Box className={'contact-header'}>
									<Typography variant="h4" className={'contact-title'}>
										Contact Support
									</Typography>
									<Typography variant="body1" className={'contact-subtitle'}>
										We usually respond within 24 hours.
									</Typography>
								</Box>
								<Card className={'contact-form-card'}>
									<CardContent className={'contact-form-content'}>
										<form onSubmit={handleContactSubmit} className={'contact-form'}>
											<Grid container spacing={3}>
												<Grid item xs={12} sm={6}>
													<TextField
														fullWidth
														label="Name"
														required
														value={contactForm.name}
														onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
														variant="outlined"
														className={'contact-field'}
														size="medium"
													/>
												</Grid>
												<Grid item xs={12} sm={6}>
													<TextField
														fullWidth
														label="Email"
														type="email"
														required
														value={contactForm.email}
														onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
														variant="outlined"
														className={'contact-field'}
														size="medium"
													/>
												</Grid>
												<Grid item xs={12}>
													<TextField
														fullWidth
														select
														label="Category"
														required
														value={contactForm.category}
														onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
														variant="outlined"
														className={'contact-field'}
														size="medium"
														SelectProps={{
															native: true,
														}}
													>
														<option value="account">Account</option>
														<option value="billing">Billing</option>
														<option value="workouts">Workouts</option>
														<option value="technical">Technical</option>
													</TextField>
												</Grid>
												<Grid item xs={12}>
													<TextField
														fullWidth
														label="Message"
														required
														multiline
														rows={6}
														value={contactForm.message}
														onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
														variant="outlined"
														placeholder="Tell us how we can help..."
														className={'contact-field'}
													/>
												</Grid>
												<Grid item xs={12}>
													<Box className={'contact-form-footer'}>
														<Button
															type="submit"
															variant="contained"
															size="large"
															startIcon={<SendIcon />}
															className={'contact-submit-button'}
															fullWidth
														>
															Send Message
														</Button>
														<Typography variant="body2" className={'trust-microcopy'}>
															Your message goes directly to our support team.
														</Typography>
														<Box className={'contact-info'}>
															<Typography variant="body2" className={'response-time'}>
																Estimated response time: <strong>24 hours</strong>
															</Typography>
															{/* Optional: Add premium badge here if user is premium */}
															{/* <Chip label="Priority Support" size="small" className={'priority-badge'} /> */}
														</Box>
													</Box>
												</Grid>
											</Grid>
										</form>
									</CardContent>
								</Card>
							</Box>
						)}

						{tab === 'policies' && (
							<Box className={'section-container policies-section'}>
								<Box className={'section-header'}>
									<Typography variant="h4" className={'section-title'}>
										Our Policies
									</Typography>
									<Typography variant="body1" className={'section-description'}>
										Clear, simple, and transparent. No legal jargon, just straight talk.
									</Typography>
								</Box>
								<Grid container spacing={3} className={'policies-grid'}>
									{policyPages.map((policy) => (
										<Grid item xs={12} md={6} key={policy.id}>
											<Card className={'policy-card'}>
												<CardContent className={'policy-card-content'}>
													<Typography variant="h5" className={'policy-title'} gutterBottom>
														{policy.title}
													</Typography>
													<Typography variant="body1" className={'policy-description'} paragraph>
														{policy.description}
													</Typography>
													<Box className={'policy-tags'}>
														{policy.tags.map((tag, index) => (
															<Chip
																key={index}
																label={tag}
																size="small"
																className={'transparency-tag'}
															/>
														))}
													</Box>
													<Button 
														variant="outlined" 
														size="medium" 
														className={'policy-button'}
														fullWidth
													>
														Read Full Policy
													</Button>
												</CardContent>
											</Card>
										</Grid>
									))}
								</Grid>
							</Box>
						)}

						{tab === 'troubleshooting' && (
							<Box className={'section-container troubleshooting-section'}>
								<Box className={'section-header'}>
									<Typography variant="h4" className={'section-title'}>
										Troubleshooting Guide
									</Typography>
									<Typography variant="body1" className={'section-description'}>
										Fix common issues in seconds
									</Typography>
								</Box>
								<Box className={'troubleshooting-list'}>
									{troubleshootingGuides.map((guide) => (
										<Accordion
											key={guide.id}
											expanded={expandedTroubleshooting === guide.id}
											onChange={handleTroubleshootingChange(guide.id)}
											className={'troubleshooting-card'}
										>
											<AccordionSummary expandIcon={<ExpandMoreIcon className={'accordion-icon'} />}>
												<Typography variant="h6" className={'troubleshooting-title'}>
													{guide.title}
												</Typography>
											</AccordionSummary>
											<AccordionDetails className={'troubleshooting-details'}>
												<Box className={'troubleshooting-solution'}>
													<Typography variant="body2" className={'solution-intro'}>
														Follow these steps in order:
													</Typography>
													<Box component="ol" className={'solution-steps'}>
														{guide.steps.map((step, index) => (
															<Typography key={index} component="li" variant="body1" className={'solution-step'}>
																{step}
															</Typography>
														))}
													</Box>
													{expandedTroubleshooting === guide.id && (
														<Box className={'issue-feedback'}>
															<Typography variant="body2" className={'feedback-question'}>
																Did this solve your issue?
															</Typography>
															<Box className={'feedback-buttons'}>
																{issueFeedback[guide.id] !== 'yes' && (
																	<Button
																		variant="contained"
																		size="small"
																		className={'feedback-button feedback-yes'}
																		onClick={() => handleIssueFeedback(guide.id, true)}
																		startIcon={<span>👍</span>}
																	>
																		Yes
																	</Button>
																)}
																{issueFeedback[guide.id] !== 'no' && (
																	<Button
																		variant="outlined"
																		size="small"
																		className={'feedback-button feedback-no'}
																		onClick={() => handleIssueFeedback(guide.id, false)}
																		startIcon={<span>👎</span>}
																	>
																		No
																	</Button>
																)}
															</Box>
															{issueFeedback[guide.id] === 'yes' && (
																<Typography variant="body2" className={'feedback-success'}>
																	Great! Glad we could help. 🎉
																</Typography>
															)}
															{issueFeedback[guide.id] === 'no' && (
																<Box className={'contact-support-cta'}>
																	<Typography variant="body2" className={'feedback-message'}>
																		No worries! Let's get you in touch with our support team.
																	</Typography>
																	<Button
																		variant="contained"
																		size="medium"
																		className={'contact-support-button'}
																		onClick={() => changeTabHandler('contact')}
																	>
																		Contact Support
																	</Button>
																</Box>
															)}
														</Box>
													)}
												</Box>
											</AccordionDetails>
										</Accordion>
									))}
								</Box>
							</Box>
						)}
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(SupportPage);






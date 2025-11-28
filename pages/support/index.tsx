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
		category: InquiryCategory.GENERAL_QUESTION,
		subject: '',
		message: '',
	});
	const [expandedTroubleshooting, setExpandedTroubleshooting] = useState<string | false>(false);

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
			category: InquiryCategory.GENERAL_QUESTION,
			subject: '',
			message: '',
		});
	};

	const handleTroubleshootingChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpandedTroubleshooting(isExpanded ? panel : false);
	};

	const tab = router.query.tab ?? 'faq';

	// Troubleshooting guide data
	const troubleshootingGuides = [
		{
			id: 'trouble-1',
			title: 'Workout videos not loading',
			content: 'Try clearing your browser cache, check your internet connection, or try using a different browser. If the issue persists, contact support.',
		},
		{
			id: 'trouble-2',
			title: 'Progress not saving',
			content: 'Make sure you are logged in and have an active internet connection. Try refreshing the page or logging out and back in.',
		},
		{
			id: 'trouble-3',
			title: 'Payment issues',
			content: 'Check your payment method, ensure sufficient funds, and verify your card details. Contact your bank if the issue continues.',
		},
		{
			id: 'trouble-4',
			title: 'App crashes or freezes',
			content: 'Update to the latest version, clear app cache, restart your device, or reinstall the app if problems persist.',
		},
		{
			id: 'trouble-5',
			title: 'Can\'t access premium features',
			content: 'Verify your subscription status in account settings. If you have an active subscription, try logging out and back in.',
		},
		{
			id: 'trouble-6',
			title: 'Meal plan calculator not working',
			content: 'Ensure all fields are filled correctly, check your internet connection, and try refreshing the page.',
		},
	];

	// Policy pages data
	const policyPages = [
		{
			id: 'privacy',
			title: 'Privacy Policy',
			description: 'How we collect, use, and protect your personal information',
			content: 'Our Privacy Policy outlines how we collect, use, store, and protect your personal information. We are committed to protecting your privacy and ensuring the security of your data...',
		},
		{
			id: 'terms',
			title: 'Terms of Service',
			description: 'Terms and conditions for using our platform',
			content: 'By using our platform, you agree to our Terms of Service. These terms govern your use of our services, including workouts, meal plans, and community features...',
		},
		{
			id: 'refund',
			title: 'Refund Policy',
			description: 'Information about refunds and cancellations',
			content: 'We offer a 30-day money-back guarantee for all subscriptions. Refunds are processed within 5-7 business days. Cancellations can be made at any time...',
		},
		{
			id: 'cookie',
			title: 'Cookie Policy',
			description: 'How we use cookies and tracking technologies',
			content: 'We use cookies to enhance your experience, analyze site usage, and assist in marketing efforts. You can manage cookie preferences in your browser settings...',
		},
	];

	if (device === 'mobile') {
		return <h1>SUPPORT PAGE MOBILE</h1>;
	} else {
		return (
			<Stack className={'support-page'}>
				<Stack className={'container'}>
					<Box component={'div'} className={'support-main-info'}>
						<Box component={'div'} className={'info'}>
							<span>Support Center</span>
							<p>We're here to help answer your questions</p>
						</Box>
						<Box component={'div'} className={'btns'}>
							<div
								className={tab == 'faq' ? 'active' : ''}
								onClick={() => {
									changeTabHandler('faq');
								}}
							>
								<HelpIcon sx={{ mr: 1 }} />
								FAQ
							</div>
							<div
								className={tab == 'contact' ? 'active' : ''}
								onClick={() => {
									changeTabHandler('contact');
								}}
							>
								<ContactMailIcon sx={{ mr: 1 }} />
								Contact
							</div>
							<div
								className={tab == 'policies' ? 'active' : ''}
								onClick={() => {
									changeTabHandler('policies');
								}}
							>
								<PolicyIcon sx={{ mr: 1 }} />
								Policies
							</div>
							<div
								className={tab == 'troubleshooting' ? 'active' : ''}
								onClick={() => {
									changeTabHandler('troubleshooting');
								}}
							>
								<BuildIcon sx={{ mr: 1 }} />
								Troubleshooting
							</div>
						</Box>
					</Box>

					<Box component={'div'} className={'support-content'}>
						{tab === 'faq' && <Faq />}

						{tab === 'contact' && (
							<Box className={'contact-form-section'}>
								<Typography variant="h5" className={'section-title'} gutterBottom>
									Contact Us
								</Typography>
								<Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4 }}>
									Have a question or need help? Fill out the form below and we'll get back to you as soon as possible.
								</Typography>
								<Card className={'contact-form-card'}>
									<CardContent>
										<form onSubmit={handleContactSubmit}>
											<Grid container spacing={3}>
												<Grid item xs={12} sm={6}>
													<TextField
														fullWidth
														label="Your Name"
														required
														value={contactForm.name}
														onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
														variant="outlined"
													/>
												</Grid>
												<Grid item xs={12} sm={6}>
													<TextField
														fullWidth
														label="Email Address"
														type="email"
														required
														value={contactForm.email}
														onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
														variant="outlined"
													/>
												</Grid>
												<Grid item xs={12}>
													<TextField
														fullWidth
														select
														label="Category"
														required
														value={contactForm.category}
														onChange={(e) => setContactForm({ ...contactForm, category: e.target.value as InquiryCategory })}
														variant="outlined"
														SelectProps={{
															native: true,
														}}
													>
														<option value={InquiryCategory.GENERAL_QUESTION}>General Question</option>
														<option value={InquiryCategory.WORKOUT_HELP}>Workout Help</option>
														<option value={InquiryCategory.NUTRITION_HELP}>Nutrition Help</option>
														<option value={InquiryCategory.BOOKING_ISSUE}>Booking Issue</option>
														<option value={InquiryCategory.PAYMENT_ISSUE}>Payment Issue</option>
														<option value={InquiryCategory.TECHNICAL_ISSUE}>Technical Issue</option>
														<option value={InquiryCategory.COMPLAINT}>Complaint</option>
														<option value={InquiryCategory.OTHER}>Other</option>
													</TextField>
												</Grid>
												<Grid item xs={12}>
													<TextField
														fullWidth
														label="Subject"
														required
														value={contactForm.subject}
														onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
														variant="outlined"
													/>
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
														placeholder="Please describe your question or issue in detail..."
													/>
												</Grid>
												<Grid item xs={12}>
													<Button
														type="submit"
														variant="contained"
														size="large"
														startIcon={<SendIcon />}
														className={'submit-btn'}
														fullWidth
													>
														Send Message
													</Button>
												</Grid>
											</Grid>
										</form>
									</CardContent>
								</Card>
							</Box>
						)}

						{tab === 'policies' && (
							<Box className={'policies-section'}>
								<Typography variant="h5" className={'section-title'} gutterBottom>
									Policy Pages
								</Typography>
								<Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4 }}>
									Review our policies to understand how we operate and protect your rights
								</Typography>
								<Grid container spacing={3}>
									{policyPages.map((policy) => (
										<Grid item xs={12} md={6} key={policy.id}>
											<Card className={'policy-card'}>
												<CardContent>
													<Typography variant="h6" className={'policy-title'} gutterBottom>
														{policy.title}
													</Typography>
													<Typography variant="body2" color="text.secondary" paragraph>
														{policy.description}
													</Typography>
													<Typography variant="body2" paragraph>
														{policy.content}
													</Typography>
													<Button variant="outlined" size="small" sx={{ mt: 2 }}>
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
							<Box className={'troubleshooting-section'}>
								<Typography variant="h5" className={'section-title'} gutterBottom>
									Troubleshooting Guide
								</Typography>
								<Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 4 }}>
									Common issues and their solutions
								</Typography>
								<Box className={'troubleshooting-accordions'}>
									{troubleshootingGuides.map((guide) => (
										<Accordion
											key={guide.id}
											expanded={expandedTroubleshooting === guide.id}
											onChange={handleTroubleshootingChange(guide.id)}
											className={'troubleshooting-accordion'}
										>
											<AccordionSummary expandIcon={<ExpandMoreIcon />}>
												<Typography variant="h6" className={'troubleshooting-title'}>
													{guide.title}
												</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<Typography variant="body2" color="text.secondary">
													{guide.content}
												</Typography>
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






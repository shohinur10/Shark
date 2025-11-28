import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, TextField, Button, Link, Alert, Card, CardContent } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ForgotPasswordPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			setError('Please enter your email address');
			return;
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError('Please enter a valid email address');
			return;
		}

		setLoading(true);
		setError('');

		try {
			// In production, this would call an API endpoint
			// await requestPasswordReset(email);
			
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
			
			setSuccess(true);
		} catch (err: any) {
			setError(err.message || 'Failed to send reset email. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'forgot-password-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Forgot Password</Typography>
					<div>MOBILE FORGOT PASSWORD PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'forgot-password-page'}>
				<Stack className={'container'}>
					<Box className={'forgot-password-container'}>
						<Card className={'forgot-password-card'}>
							<CardContent sx={{ p: 4 }}>
								<Button
									startIcon={<ArrowBackIcon />}
									onClick={() => router.push('/account/login')}
									sx={{ mb: 3 }}
									className={'back-button'}
								>
									Back to Login
								</Button>

								{!success ? (
									<>
										<Box className={'forgot-password-header'}>
											<Typography variant="h3" className={'page-title'}>
												Forgot Password?
											</Typography>
											<Typography variant="body1" className={'page-subtitle'}>
												No worries! Enter your email address and we'll send you instructions to reset your password.
											</Typography>
										</Box>

										<form onSubmit={handleSubmit}>
											{error && (
												<Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
													{error}
												</Alert>
											)}

											<TextField
												fullWidth
												label="Email Address"
												type="email"
												variant="outlined"
												value={email}
												onChange={(e) => {
													setEmail(e.target.value);
													setError('');
												}}
												required
												className={'form-input'}
												InputProps={{
													startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
												}}
												sx={{ mb: 3 }}
											/>

											<Button
												type="submit"
												variant="contained"
												fullWidth
												size="large"
												disabled={loading || !email}
												className={'submit-button'}
											>
												{loading ? 'Sending...' : 'Send Reset Instructions'}
											</Button>
										</form>
									</>
								) : (
									<Box className={'success-message'}>
										<CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
										<Typography variant="h5" className={'success-title'} gutterBottom>
											Check Your Email
										</Typography>
										<Typography variant="body1" color="text.secondary" paragraph>
											We've sent password reset instructions to <strong>{email}</strong>
										</Typography>
										<Typography variant="body2" color="text.secondary" paragraph>
											Didn't receive the email? Check your spam folder or try again.
										</Typography>
										<Button
											variant="outlined"
											fullWidth
											onClick={() => {
												setSuccess(false);
												setEmail('');
											}}
											sx={{ mt: 2 }}
										>
											Resend Email
										</Button>
										<Button
											variant="text"
											fullWidth
											onClick={() => router.push('/account/login')}
											sx={{ mt: 1 }}
										>
											Back to Login
										</Button>
									</Box>
								)}
							</CardContent>
						</Card>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(ForgotPasswordPage);





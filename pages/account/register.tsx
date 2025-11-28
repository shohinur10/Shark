import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, TextField, Button, Link, Checkbox, FormControlLabel, Alert, Grid } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const RegisterPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [formData, setFormData] = useState({
		nick: '',
		password: '',
		confirmPassword: '',
		phone: '',
		type: 'USER',
		agreeToTerms: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setError('');
	};

	const validateForm = () => {
		if (!formData.nick || !formData.password || !formData.phone) {
			setError('Please fill in all required fields');
			return false;
		}

		if (formData.password.length < 6) {
			setError('Password must be at least 6 characters long');
			return false;
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return false;
		}

		if (!formData.agreeToTerms) {
			setError('Please agree to the terms and conditions');
			return false;
		}

		return true;
	};

	const handleRegister = useCallback(async () => {
		if (!validateForm()) {
			return;
		}

		setLoading(true);
		setError('');

		try {
			await signUp(formData.nick, formData.password, formData.phone, formData.type);
			await router.push((router.query.referrer as string) || '/dashboard');
		} catch (err: any) {
			setError(err.message || 'Registration failed. Please try again.');
			await sweetMixinErrorAlert(err.message || 'Registration failed');
		} finally {
			setLoading(false);
		}
	}, [formData, router]);

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleRegister();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'register-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Register</Typography>
					<div>MOBILE REGISTER PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'register-page'}>
				<Stack className={'container'}>
					<Box className={'register-container'}>
						<Box className={'register-left'}>
							<Box className={'register-header'}>
								<Box className={'logo-section'}>
									<img src="/img/logo/logoText.svg" alt="Shark" className={'logo-img'} />
									<Typography variant="h4" className={'logo-text'}>
										Shark
									</Typography>
								</Box>
								<Typography variant="h3" className={'register-title'}>
									Create Account
								</Typography>
								<Typography variant="body1" className={'register-subtitle'}>
									Join thousands of fitness enthusiasts
								</Typography>
							</Box>

							<Box className={'register-form'}>
								{error && (
									<Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
										{error}
									</Alert>
								)}

								<TextField
									fullWidth
									label="Username"
									variant="outlined"
									value={formData.nick}
									onChange={(e) => handleInputChange('nick', e.target.value)}
									onKeyPress={handleKeyPress}
									required
									className={'form-input'}
									InputProps={{
										startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
									}}
									sx={{ mb: 3 }}
								/>

								<Grid container spacing={2} sx={{ mb: 3 }}>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Password"
											type={showPassword ? 'text' : 'password'}
											variant="outlined"
											value={formData.password}
											onChange={(e) => handleInputChange('password', e.target.value)}
											onKeyPress={handleKeyPress}
											required
											className={'form-input'}
											InputProps={{
												startAdornment: <LockOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} />,
												endAdornment: (
													<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
														{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
													</IconButton>
												),
											}}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Confirm Password"
											type={showConfirmPassword ? 'text' : 'password'}
											variant="outlined"
											value={formData.confirmPassword}
											onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
											onKeyPress={handleKeyPress}
											required
											className={'form-input'}
											InputProps={{
												startAdornment: <LockOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} />,
												endAdornment: (
													<IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
														{showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
													</IconButton>
												),
											}}
										/>
									</Grid>
								</Grid>

								<TextField
									fullWidth
									label="Phone Number"
									variant="outlined"
									value={formData.phone}
									onChange={(e) => handleInputChange('phone', e.target.value)}
									onKeyPress={handleKeyPress}
									required
									className={'form-input'}
									InputProps={{
										startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
									}}
									sx={{ mb: 3 }}
								/>

								<Box className={'user-type-selection'} sx={{ mb: 3 }}>
									<Typography variant="body2" color="text.secondary" gutterBottom>
										I want to register as:
									</Typography>
									<Box sx={{ display: 'flex', gap: 2 }}>
										<FormControlLabel
											control={
												<Checkbox
													checked={formData.type === 'USER'}
													onChange={() => handleInputChange('type', 'USER')}
												/>
											}
											label="User"
										/>
										<FormControlLabel
											control={
												<Checkbox
													checked={formData.type === 'AGENT'}
													onChange={() => handleInputChange('type', 'AGENT')}
												/>
											}
											label="Trainer"
										/>
									</Box>
								</Box>

								<FormControlLabel
									control={
										<Checkbox
											checked={formData.agreeToTerms}
											onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
										/>
									}
									label={
										<Typography variant="body2">
											I agree to the{' '}
											<Link href="/support?tab=policies" target="_blank">
												Terms of Service
											</Link>{' '}
											and{' '}
											<Link href="/support?tab=policies" target="_blank">
												Privacy Policy
											</Link>
										</Typography>
									}
									sx={{ mb: 3 }}
								/>

								<Button
									variant="contained"
									fullWidth
									size="large"
									onClick={handleRegister}
									disabled={loading}
									className={'register-button'}
									sx={{ mb: 2 }}
								>
									{loading ? 'Creating Account...' : 'Create Account'}
								</Button>

								<Box className={'login-link'}>
									<Typography variant="body2" color="text.secondary">
										Already have an account?{' '}
										<Link href="/account/login" className={'link-text'}>
											Sign in
										</Link>
									</Typography>
								</Box>
							</Box>
						</Box>

						<Box className={'register-right'}>
							<Box
								className={'register-image'}
								style={{
									backgroundImage: 'url(/img/banner/joinBg.svg)',
									backgroundSize: 'cover',
									backgroundPosition: 'center',
								}}
							/>
						</Box>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(RegisterPage);





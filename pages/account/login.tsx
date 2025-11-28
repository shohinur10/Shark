import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, TextField, Button, Link, Checkbox, FormControlLabel, Alert } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { logIn } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const LoginPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [formData, setFormData] = useState({
		nick: '',
		password: '',
		rememberMe: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setError('');
	};

	const handleLogin = useCallback(async () => {
		if (!formData.nick || !formData.password) {
			setError('Please fill in all fields');
			return;
		}

		setLoading(true);
		setError('');

		try {
			await logIn(formData.nick, formData.password);
			await router.push((router.query.referrer as string) || '/dashboard');
		} catch (err: any) {
			setError(err.message || 'Login failed. Please check your credentials.');
			await sweetMixinErrorAlert(err.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	}, [formData, router]);

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleLogin();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'login-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Login</Typography>
					<div>MOBILE LOGIN PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'login-page'}>
				<Stack className={'container'}>
					<Box className={'login-container'}>
						<Box className={'login-left'}>
							<Box className={'login-header'}>
								<Box className={'logo-section'}>
									<img src="/img/logo/logoText.svg" alt="Shark" className={'logo-img'} />
									<Typography variant="h4" className={'logo-text'}>
										Shark
									</Typography>
								</Box>
								<Typography variant="h3" className={'login-title'}>
									Welcome Back
								</Typography>
								<Typography variant="body1" className={'login-subtitle'}>
									Sign in to continue your fitness journey
								</Typography>
							</Box>

							<Box className={'login-form'}>
								{error && (
									<Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
										{error}
									</Alert>
								)}

								<TextField
									fullWidth
									label="Username or Email"
									variant="outlined"
									value={formData.nick}
									onChange={(e) => handleInputChange('nick', e.target.value)}
									onKeyPress={handleKeyPress}
									required
									className={'form-input'}
									InputProps={{
										startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
									}}
									sx={{ mb: 3 }}
								/>

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
									sx={{ mb: 2 }}
								/>

								<Box className={'login-options'}>
									<FormControlLabel
										control={
											<Checkbox
												checked={formData.rememberMe}
												onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
											/>
										}
										label="Remember me"
									/>
									<Link href="/account/forgot-password" className={'forgot-link'}>
										Forgot password?
									</Link>
								</Box>

								<Button
									variant="contained"
									fullWidth
									size="large"
									onClick={handleLogin}
									disabled={loading || !formData.nick || !formData.password}
									className={'login-button'}
									sx={{ mt: 3, mb: 2 }}
								>
									{loading ? 'Signing in...' : 'Sign In'}
								</Button>

								<Box className={'signup-link'}>
									<Typography variant="body2" color="text.secondary">
										Don't have an account?{' '}
										<Link href="/account/register" className={'link-text'}>
											Sign up
										</Link>
									</Typography>
								</Box>
							</Box>
						</Box>

						<Box className={'login-right'}>
							<Box
								className={'login-image'}
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

export default withLayoutBasic(LoginPage);





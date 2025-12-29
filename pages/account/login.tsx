import React, { useCallback, useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
	Stack,
	Box,
	Typography,
	TextField,
	Button,
	Link,
	Checkbox,
	FormControlLabel,
	Alert,
	CircularProgress,
	InputAdornment,
} from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { logIn } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

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
	const [fieldErrors, setFieldErrors] = useState<{ nick?: string; password?: string }>({});
	const [isEmail, setIsEmail] = useState(false);

	useEffect(() => {
		// Check if input is email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		setIsEmail(emailRegex.test(formData.nick));
	}, [formData.nick]);

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setError('');
		if (fieldErrors[field as keyof typeof fieldErrors]) {
			setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const validateForm = () => {
		const errors: { nick?: string; password?: string } = {};
		let isValid = true;

		if (!formData.nick.trim()) {
			errors.nick = 'Username or email is required';
			isValid = false;
		}

		if (!formData.password) {
			errors.password = 'Password is required';
			isValid = false;
		} else if (formData.password.length < 6) {
			errors.password = 'Password must be at least 6 characters';
			isValid = false;
		}

		setFieldErrors(errors);
		return isValid;
	};

	const handleLogin = useCallback(async () => {
		if (!validateForm()) {
			return;
		}

		setLoading(true);
		setError('');

		try {
			await logIn(formData.nick, formData.password);
			await router.push((router.query.referrer as string) || '/dashboard');
		} catch (err: any) {
			const errorMessage = err.message || 'Login failed. Please check your credentials.';
			setError(errorMessage);
			await sweetMixinErrorAlert(errorMessage);
		} finally {
			setLoading(false);
		}
	}, [formData, router]);

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleLogin();
		}
	};


	const mobileView = (
		<Stack className={'login-page mobile'}>
			<Box className={'mobile-container'}>
				<Box className={'mobile-header'}>
					<Typography variant="h4" className={'mobile-title'}>
						Welcome back
					</Typography>
					<Typography variant="body2" className={'mobile-subtitle'}>
						Let's continue your training.
					</Typography>
				</Box>

				<Box className={'mobile-form'}>
					{error && (
						<Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
							{error}
						</Alert>
					)}

					<TextField
						fullWidth
						label="Nickname or Email"
						variant="outlined"
						value={formData.nick}
						onChange={(e) => handleInputChange('nick', e.target.value)}
						onKeyPress={handleKeyPress}
						error={!!fieldErrors.nick}
						helperText={fieldErrors.nick}
						required
						className={'form-input'}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									{isEmail ? <EmailIcon sx={{ color: 'text.secondary' }} /> : <PersonIcon sx={{ color: 'text.secondary' }} />}
								</InputAdornment>
							),
						}}
						sx={{ mb: 2.5 }}
					/>

					<TextField
						fullWidth
						label="Password"
						type={showPassword ? 'text' : 'password'}
						variant="outlined"
						value={formData.password}
						onChange={(e) => handleInputChange('password', e.target.value)}
						onKeyPress={handleKeyPress}
						error={!!fieldErrors.password}
						helperText={fieldErrors.password}
						required
						className={'form-input'}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<LockOutlinedIcon sx={{ color: 'text.secondary' }} />
								</InputAdornment>
							),
							endAdornment: (
								<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
									{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
								</IconButton>
							),
						}}
						sx={{ mb: 2.5 }}
					/>

					<Box className={'mobile-options'}>
						<FormControlLabel
							control={
								<Checkbox
									checked={formData.rememberMe}
									onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
									size="small"
								/>
							}
							label={<Typography variant="body2">Remember me</Typography>}
						/>
						<Link href="/account/forgot-password" className={'forgot-link'}>
							<Typography variant="body2">Forgot password?</Typography>
						</Link>
					</Box>

					<Button
						variant="contained"
						fullWidth
						size="large"
						onClick={handleLogin}
						disabled={loading || !formData.nick || !formData.password}
						className={'login-button'}
						sx={{ mt: 3, mb: 3 }}
					>
						{loading ? (
							<>
								<CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
								Signing in...
							</>
						) : (
							'Continue Training'
						)}
					</Button>

					<Typography variant="caption" className={'security-microcopy'}>
						Your progress is saved securely.
					</Typography>

					<Box className={'signup-link'}>
						<Typography variant="body2" color="text.secondary" textAlign="center">
							New here?{' '}
							<Link href="/account/register" className={'link-text'}>
								Create an account
							</Link>
						</Typography>
					</Box>
				</Box>
			</Box>
		</Stack>
	);

	const desktopView = (
		<Stack className={'login-page'}>
			<Stack className={'container'}>
				<Box className={'login-container'}>
					<Box className={'login-card'}>
						<Box className={'login-header'}>
							<Box className={'logo-section'}>
								<img 
									src="/img/logo/ChatGPT Image Nov 25, 2025, 11_45_12 PM.png" 
									alt="Shark Logo" 
									className={'logo-img'}
								/>
								<Typography variant="h5" className={'logo-text'}>
									Shark Fitness
								</Typography>
							</Box>
							<FitnessCenterIcon className={'fitness-icon'} />
							<Typography variant="h3" className={'login-title'}>
								Welcome Back!
							</Typography>
							<Typography variant="body1" className={'login-subtitle'}>
								Continue your fitness transformation and track your progress
							</Typography>
						</Box>

						<Box className={'login-form'}>
							{error && (
								<Alert
									severity="error"
									sx={{ mb: 3, borderRadius: 2 }}
									onClose={() => setError('')}
									className={'error-alert'}
								>
									{error}
								</Alert>
							)}

							<TextField
								fullWidth
								label="Nickname or Email"
								variant="outlined"
								value={formData.nick}
								onChange={(e) => handleInputChange('nick', e.target.value)}
								onKeyPress={handleKeyPress}
								error={!!fieldErrors.nick}
								helperText={fieldErrors.nick}
								required
								className={'form-input'}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											{isEmail ? <EmailIcon sx={{ color: 'text.secondary' }} /> : <PersonIcon sx={{ color: 'text.secondary' }} />}
										</InputAdornment>
									),
								}}
								sx={{ mb: 2.5 }}
							/>

							<TextField
								fullWidth
								label="Password"
								type={showPassword ? 'text' : 'password'}
								variant="outlined"
								value={formData.password}
								onChange={(e) => handleInputChange('password', e.target.value)}
								onKeyPress={handleKeyPress}
								error={!!fieldErrors.password}
								helperText={fieldErrors.password}
								required
								className={'form-input'}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LockOutlinedIcon sx={{ color: 'text.secondary' }} />
										</InputAdornment>
									),
									endAdornment: (
										<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
											{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
										</IconButton>
									),
								}}
								sx={{ mb: 2.5 }}
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
								sx={{ mt: 3, mb: 3 }}
							>
								{loading ? (
									<>
										<CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
										Signing in...
									</>
								) : (
									'Continue Training'
								)}
							</Button>

							<Typography variant="caption" className={'security-microcopy'}>
								Your progress is saved securely.
							</Typography>

							<Box className={'signup-link'}>
								<Typography variant="body2" color="text.secondary" textAlign="center">
									New here?{' '}
									<Link href="/account/register" className={'link-text'}>
										Create an account
									</Link>
								</Typography>
							</Box>
						</Box>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);

	return device === 'mobile' ? mobileView : desktopView;
};

export default withLayoutBasic(LoginPage);







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
	Grid,
	Divider,
	CircularProgress,
	InputAdornment,
	LinearProgress,
	Radio,
	RadioGroup,
	FormControl,
	FormLabel,
	Chip,
} from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

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
	const [fieldErrors, setFieldErrors] = useState<{
		nick?: string;
		password?: string;
		confirmPassword?: string;
		phone?: string;
	}>({});
	const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak');
	const [passwordStrengthValue, setPasswordStrengthValue] = useState(0);

	const calculatePasswordStrength = (password: string): { strength: PasswordStrength; value: number } => {
		let score = 0;
		if (password.length >= 6) score += 1;
		if (password.length >= 8) score += 1;
		if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
		if (/\d/.test(password)) score += 1;
		if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

		if (score <= 1) return { strength: 'weak', value: 25 };
		if (score === 2) return { strength: 'fair', value: 50 };
		if (score === 3 || score === 4) return { strength: 'good', value: 75 };
		return { strength: 'strong', value: 100 };
	};

	useEffect(() => {
		if (formData.password) {
			const { strength, value } = calculatePasswordStrength(formData.password);
			setPasswordStrength(strength);
			setPasswordStrengthValue(value);
		} else {
			setPasswordStrength('weak');
			setPasswordStrengthValue(0);
		}
	}, [formData.password]);

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setError('');
		if (fieldErrors[field as keyof typeof fieldErrors]) {
			setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const validateForm = () => {
		const errors: typeof fieldErrors = {};
		let isValid = true;

		if (!formData.nick.trim()) {
			errors.nick = 'Username is required';
			isValid = false;
		} else if (formData.nick.length < 3) {
			errors.nick = 'Username must be at least 3 characters';
			isValid = false;
		}

		if (!formData.password) {
			errors.password = 'Password is required';
			isValid = false;
		} else if (formData.password.length < 6) {
			errors.password = 'Password must be at least 6 characters long';
			isValid = false;
		}

		if (!formData.confirmPassword) {
			errors.confirmPassword = 'Please confirm your password';
			isValid = false;
		} else if (formData.password !== formData.confirmPassword) {
			errors.confirmPassword = 'Passwords do not match';
			isValid = false;
		}

		if (!formData.phone.trim()) {
			errors.phone = 'Phone number is required';
			isValid = false;
		} else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
			errors.phone = 'Please enter a valid phone number';
			isValid = false;
		}

		if (!formData.agreeToTerms) {
			setError('Please agree to the terms and conditions');
			isValid = false;
		}

		setFieldErrors(errors);
		return isValid;
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

	const handleSocialSignup = (provider: 'google' | 'facebook') => {
		// TODO: Implement social signup
		console.log(`${provider} signup clicked`);
	};

	const getPasswordStrengthColor = () => {
		switch (passwordStrength) {
			case 'weak':
				return '#f44336';
			case 'fair':
				return '#ff9800';
			case 'good':
				return '#2196f3';
			case 'strong':
				return '#4caf50';
			default:
				return '#e0e0e0';
		}
	};

	const passwordRequirements = [
		{ label: 'At least 6 characters', met: formData.password.length >= 6 },
		{ label: 'At least 8 characters (recommended)', met: formData.password.length >= 8 },
		{ label: 'Contains uppercase and lowercase', met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) },
		{ label: 'Contains a number', met: /\d/.test(formData.password) },
	];

	const mobileView = (
		<Stack className={'register-page mobile'}>
			<Box className={'mobile-container'}>
				<Box className={'mobile-header'}>
					<Box className={'logo-section'}>
						<PersonAddIcon className={'logo-icon'} />
						<Typography variant="h5" className={'logo-text'}>
							Shark
						</Typography>
					</Box>
					<Typography variant="h4" className={'mobile-title'}>
						Create Account
					</Typography>
					<Typography variant="body2" className={'mobile-subtitle'}>
						Join thousands of fitness enthusiasts
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
						label="Username"
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
									<PersonIcon sx={{ color: 'text.secondary' }} />
								</InputAdornment>
							),
						}}
						sx={{ mb: 2 }}
					/>

					<TextField
						fullWidth
						label="Password"
						type={showPassword ? 'text' : 'password'}
						variant="outlined"
						value={formData.password}
						onChange={(e) => handleInputChange('password', e.target.value)}
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
						sx={{ mb: 1 }}
					/>

					{formData.password && (
						<Box sx={{ mb: 2 }}>
							<LinearProgress
								variant="determinate"
								value={passwordStrengthValue}
								sx={{
									height: 6,
									borderRadius: 3,
									backgroundColor: '#e0e0e0',
									'& .MuiLinearProgress-bar': {
										backgroundColor: getPasswordStrengthColor(),
									},
								}}
							/>
							<Typography variant="caption" sx={{ mt: 0.5, color: getPasswordStrengthColor(), display: 'block' }}>
								Password strength: {passwordStrength.toUpperCase()}
							</Typography>
						</Box>
					)}

					<TextField
						fullWidth
						label="Confirm Password"
						type={showConfirmPassword ? 'text' : 'password'}
						variant="outlined"
						value={formData.confirmPassword}
						onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
						onKeyPress={handleKeyPress}
						error={!!fieldErrors.confirmPassword}
						helperText={fieldErrors.confirmPassword}
						required
						className={'form-input'}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<LockOutlinedIcon sx={{ color: 'text.secondary' }} />
								</InputAdornment>
							),
							endAdornment: (
								<IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
									{showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
								</IconButton>
							),
						}}
						sx={{ mb: 2 }}
					/>

					<TextField
						fullWidth
						label="Phone Number"
						variant="outlined"
						value={formData.phone}
						onChange={(e) => handleInputChange('phone', e.target.value)}
						onKeyPress={handleKeyPress}
						error={!!fieldErrors.phone}
						helperText={fieldErrors.phone || 'Format: +1234567890'}
						required
						className={'form-input'}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<PhoneIcon sx={{ color: 'text.secondary' }} />
								</InputAdornment>
							),
						}}
						sx={{ mb: 2 }}
					/>

					<FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
						<FormLabel component="legend" sx={{ mb: 1 }}>
							I want to register as:
						</FormLabel>
						<RadioGroup
							row
							value={formData.type}
							onChange={(e) => handleInputChange('type', e.target.value)}
						>
							<FormControlLabel value="USER" control={<Radio />} label="User" />
							<FormControlLabel value="AGENT" control={<Radio />} label="Trainer" />
						</RadioGroup>
					</FormControl>

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
						sx={{ mb: 2 }}
					/>

					<Button
						variant="contained"
						fullWidth
						size="large"
						onClick={handleRegister}
						disabled={loading}
						className={'register-button'}
						sx={{ mt: 1, mb: 2 }}
					>
						{loading ? (
							<>
								<CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
								Creating Account...
							</>
						) : (
							'Create Account'
						)}
					</Button>

					<Divider sx={{ my: 2 }}>
						<Typography variant="body2" color="text.secondary">
							OR
						</Typography>
					</Divider>

					<Box className={'social-buttons'}>
						<Button
							variant="outlined"
							fullWidth
							startIcon={<GoogleIcon />}
							onClick={() => handleSocialSignup('google')}
							className={'social-button google'}
							sx={{ mb: 1.5 }}
						>
							Sign up with Google
						</Button>
						<Button
							variant="outlined"
							fullWidth
							startIcon={<FacebookIcon />}
							onClick={() => handleSocialSignup('facebook')}
							className={'social-button facebook'}
						>
							Sign up with Facebook
						</Button>
					</Box>

					<Box className={'login-link'}>
						<Typography variant="body2" color="text.secondary" textAlign="center">
							Already have an account?{' '}
							<Link href="/account/login" className={'link-text'}>
								Sign in
							</Link>
						</Typography>
					</Box>
				</Box>
			</Box>
		</Stack>
	);

	if (device === 'mobile') {
		return mobileView;
	} else {
	const desktopView = (
		<Stack className={'register-page'}>
			<Stack className={'container'}>
				<Box className={'register-container'}>
					<Box className={'register-left'}>
						<Box className={'register-header'}>
							<Box className={'logo-section'}>
								<FitnessCenterIcon className={'fitness-icon'} />
								<Typography variant="h4" className={'logo-text'}>
									Shark
								</Typography>
							</Box>
							<Typography variant="h3" className={'register-title'}>
								Create Your Account
							</Typography>
							<Typography variant="body1" className={'register-subtitle'}>
								Join thousands of fitness enthusiasts and start your transformation journey today
							</Typography>
						</Box>

						<Box className={'register-form'}>
							{error && (
								<Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>
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
								error={!!fieldErrors.nick}
								helperText={fieldErrors.nick || 'Choose a unique username'}
								required
								className={'form-input'}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PersonIcon sx={{ color: 'text.secondary' }} />
										</InputAdornment>
									),
								}}
								sx={{ mb: 2.5 }}
							/>

							<Grid container spacing={2} sx={{ mb: 2 }}>
								<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										label="Password"
										type={showPassword ? 'text' : 'password'}
										variant="outlined"
										value={formData.password}
										onChange={(e) => handleInputChange('password', e.target.value)}
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
										error={!!fieldErrors.confirmPassword}
										helperText={fieldErrors.confirmPassword}
										required
										className={'form-input'}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<LockOutlinedIcon sx={{ color: 'text.secondary' }} />
												</InputAdornment>
											),
											endAdornment: (
												<IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
													{showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
												</IconButton>
											),
										}}
									/>
								</Grid>
							</Grid>

							{formData.password && (
								<Box sx={{ mb: 2.5 }}>
									<LinearProgress
										variant="determinate"
										value={passwordStrengthValue}
										sx={{
											height: 8,
											borderRadius: 4,
											backgroundColor: '#e0e0e0',
											mb: 1,
											'& .MuiLinearProgress-bar': {
												backgroundColor: getPasswordStrengthColor(),
											},
										}}
									/>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
										<Chip
											label={`Strength: ${passwordStrength.toUpperCase()}`}
											size="small"
											sx={{
												backgroundColor: getPasswordStrengthColor(),
												color: 'white',
												fontWeight: 600,
											}}
										/>
										<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
											{passwordRequirements.map((req, idx) => (
												<Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
													{req.met ? (
														<CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50' }} />
													) : (
														<CancelIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
													)}
													<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
														{req.label}
													</Typography>
												</Box>
											))}
										</Box>
									</Box>
								</Box>
							)}

							<TextField
								fullWidth
								label="Phone Number"
								variant="outlined"
								value={formData.phone}
								onChange={(e) => handleInputChange('phone', e.target.value)}
								onKeyPress={handleKeyPress}
								error={!!fieldErrors.phone}
								helperText={fieldErrors.phone || 'Format: +1234567890'}
								required
								className={'form-input'}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PhoneIcon sx={{ color: 'text.secondary' }} />
										</InputAdornment>
									),
								}}
								sx={{ mb: 2.5 }}
							/>

							<Box className={'user-type-selection'}>
								<FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
									<FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
										I want to register as:
									</FormLabel>
									<RadioGroup
										row
										value={formData.type}
										onChange={(e) => handleInputChange('type', e.target.value)}
									>
										<FormControlLabel
											value="USER"
											control={<Radio />}
											label={
												<Box>
													<Typography variant="body1" fontWeight={600}>
														User
													</Typography>
													<Typography variant="caption" color="text.secondary">
														Track workouts and progress
													</Typography>
												</Box>
											}
											sx={{ mr: 3 }}
										/>
										<FormControlLabel
											value="AGENT"
											control={<Radio />}
											label={
												<Box>
													<Typography variant="body1" fontWeight={600}>
														Trainer
													</Typography>
													<Typography variant="caption" color="text.secondary">
														Create and sell programs
													</Typography>
												</Box>
											}
										/>
									</RadioGroup>
								</FormControl>
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
										<Link href="/support?tab=policies" target="_blank" className={'terms-link'}>
											Terms of Service
										</Link>{' '}
										and{' '}
										<Link href="/support?tab=policies" target="_blank" className={'terms-link'}>
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
								disabled={loading || !formData.agreeToTerms}
								className={'register-button'}
								sx={{ mb: 2 }}
							>
								{loading ? (
									<>
										<CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
										Creating Account...
									</>
								) : (
									'Create Account'
								)}
							</Button>

							<Divider sx={{ my: 3 }}>
								<Typography variant="body2" color="text.secondary">
									OR
								</Typography>
							</Divider>

							<Box className={'social-buttons'}>
								<Button
									variant="outlined"
									fullWidth
									startIcon={<GoogleIcon />}
									onClick={() => handleSocialSignup('google')}
									className={'social-button google'}
									sx={{ mb: 1.5 }}
								>
									Sign up with Google
								</Button>
								<Button
									variant="outlined"
									fullWidth
									startIcon={<FacebookIcon />}
									onClick={() => handleSocialSignup('facebook')}
									className={'social-button facebook'}
								>
									Sign up with Facebook
								</Button>
							</Box>

							<Box className={'login-link'}>
								<Typography variant="body2" color="text.secondary" textAlign="center">
									Already have an account?{' '}
									<Link href="/account/login" className={'link-text'}>
										Sign in
									</Link>
								</Typography>
							</Box>
						</Box>
					</Box>

					<Box className={'register-right'}>
						<Box className={'register-image-wrapper'}>
							<Box
								className={'register-image'}
								style={{
									backgroundImage: 'url(/img/banner/joinBg.svg)',
									backgroundSize: 'cover',
									backgroundPosition: 'center',
								}}
							/>
							<Box className={'image-overlay'}>
								<Box className={'overlay-content'}>
									<FitnessCenterIcon className={'overlay-icon'} />
									<Typography variant="h4" className={'overlay-title'}>
										Start Your Journey
									</Typography>
									<Typography variant="body1" className={'overlay-text'}>
										Access personalized workouts, nutrition plans, and expert trainers
									</Typography>
									<Box className={'benefits-list'}>
										<Box className={'benefit-item'}>
											<CheckCircleIcon className={'benefit-icon'} />
											<Typography variant="body2">Unlimited workout plans</Typography>
										</Box>
										<Box className={'benefit-item'}>
											<CheckCircleIcon className={'benefit-icon'} />
											<Typography variant="body2">Progress tracking</Typography>
										</Box>
										<Box className={'benefit-item'}>
											<CheckCircleIcon className={'benefit-icon'} />
											<Typography variant="body2">Expert trainers</Typography>
										</Box>
									</Box>
								</Box>
							</Box>
						</Box>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);

	return device === 'mobile' ? mobileView : desktopView;
};

export default withLayoutBasic(RegisterPage);







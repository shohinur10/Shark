import React, { useCallback, useState } from 'react';
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
	Radio,
	RadioGroup,
	FormControl,
	FormLabel,
	FormHelperText,
} from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
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
		phone: '',
		password: '',
		confirmPassword: '',
		userType: 'USER',
		agreeToTerms: false,
		motivationTips: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [fieldErrors, setFieldErrors] = useState<{
		nick?: string;
		phone?: string;
		password?: string;
		confirmPassword?: string;
	}>({});

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
			errors.nick = 'Nickname is required';
			isValid = false;
		} else if (formData.nick.length < 3) {
			errors.nick = 'Nickname must be at least 3 characters';
			isValid = false;
		}

		if (!formData.phone.trim()) {
			errors.phone = 'Phone is required';
			isValid = false;
		} else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(formData.phone.replace(/\s/g, ''))) {
			errors.phone = 'Please enter a valid phone number';
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
			await signUp(formData.nick, formData.password, formData.phone, formData.userType);
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


	const mobileView = (
		<Stack className={'register-page mobile'}>
			<Box className={'mobile-container'}>
				<Box className={'mobile-header'}>
					<Typography variant="h4" className={'mobile-title'}>
						Start your journey
					</Typography>
					<Typography variant="body2" className={'mobile-subtitle'}>
						Create your account and begin building consistency.
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
						label="Nickname"
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
						label="Phone"
						type="tel"
						variant="outlined"
						value={formData.phone}
						onChange={(e) => handleInputChange('phone', e.target.value)}
						onKeyPress={handleKeyPress}
						error={!!fieldErrors.phone}
						helperText={fieldErrors.phone}
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
						sx={{ mb: 2 }}
					/>

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

					<FormControl component="fieldset" className={'role-selection'} sx={{ mb: 2.5 }}>
						<FormLabel component="legend" className={'role-label'}>
							Choose your account type
						</FormLabel>
						<RadioGroup
							row
							value={formData.userType}
							onChange={(e) => handleInputChange('userType', e.target.value)}
							className={'role-radio-group'}
						>
							<FormControlLabel
								value="USER"
								control={<Radio />}
								label="User"
								className={'role-option'}
							/>
							<FormControlLabel
								value="TRAINER"
								control={<Radio />}
								label="Trainer"
								className={'role-option'}
							/>
						</RadioGroup>
						<FormHelperText className={'role-helper-text'}>
							{formData.userType === 'USER' 
								? 'User: Train, track progress, and join the community'
								: 'Trainer: Manage clients and publish programs'}
						</FormHelperText>
					</FormControl>

					<FormControlLabel
						control={
							<Checkbox
								checked={formData.motivationTips}
								onChange={(e) => handleInputChange('motivationTips', e.target.checked)}
							/>
						}
						label={
							<Typography variant="body2">
								I want to receive motivation tips and reminders
							</Typography>
						}
						sx={{ mb: 2 }}
					/>

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
						sx={{ mb: 2.5 }}
					/>

					<Button
						variant="contained"
						fullWidth
						size="large"
						onClick={handleRegister}
						disabled={loading || !formData.agreeToTerms}
						className={'register-button'}
						sx={{ mt: 1, mb: 2 }}
					>
						{loading ? (
							<>
								<CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
								Creating Account...
							</>
						) : (
							'Create My Account'
						)}
					</Button>

					<Typography variant="body2" className={'progress-line'} sx={{ mb: 3, textAlign: 'center' }}>
						Most members see progress within their first 14 days.
					</Typography>

					<Box className={'login-link'}>
						<Typography variant="body2" color="text.secondary" textAlign="center">
							Already have an account?{' '}
							<Link href="/account/login" className={'link-text'}>
								Log in
							</Link>
						</Typography>
					</Box>

					<Typography variant="caption" className={'pressure-microcopy'}>
						No pressure. Cancel anytime.
					</Typography>
				</Box>
			</Box>
		</Stack>
	);

	const desktopView = (
		<Stack className={'register-page'}>
			<Stack className={'container'}>
				<Box className={'register-container'}>
					<Box className={'register-card'}>
						<Box className={'register-header'}>
							<Typography variant="h3" className={'register-title'}>
								Start your journey
							</Typography>
							<Typography variant="body1" className={'register-subtitle'}>
								Create your account and begin building consistency.
							</Typography>
						</Box>

						<Box className={'register-form'}>
							{error && (
								<Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
									{error}
								</Alert>
							)}

							<TextField
								fullWidth
								label="Nickname"
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
								sx={{ mb: 2.5 }}
							/>

							<TextField
								fullWidth
								label="Phone"
								type="tel"
								variant="outlined"
								value={formData.phone}
								onChange={(e) => handleInputChange('phone', e.target.value)}
								onKeyPress={handleKeyPress}
								error={!!fieldErrors.phone}
								helperText={fieldErrors.phone}
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
								sx={{ mb: 2.5 }}
							/>

							<FormControl component="fieldset" className={'role-selection'} sx={{ mb: 2.5 }}>
								<FormLabel component="legend" className={'role-label'}>
									Choose your account type
								</FormLabel>
								<RadioGroup
									row
									value={formData.userType}
									onChange={(e) => handleInputChange('userType', e.target.value)}
									className={'role-radio-group'}
								>
									<FormControlLabel
										value="USER"
										control={<Radio />}
										label="User"
										className={'role-option'}
									/>
									<FormControlLabel
										value="TRAINER"
										control={<Radio />}
										label="Trainer"
										className={'role-option'}
									/>
								</RadioGroup>
								<FormHelperText className={'role-helper-text'}>
									{formData.userType === 'USER' 
										? 'User: Train, track progress, and join the community'
										: 'Trainer: Manage clients and publish programs'}
								</FormHelperText>
							</FormControl>

							<FormControlLabel
								control={
									<Checkbox
										checked={formData.motivationTips}
										onChange={(e) => handleInputChange('motivationTips', e.target.checked)}
									/>
								}
								label={
									<Typography variant="body2" className={'motivation-checkbox-label'}>
										I want to receive motivation tips and reminders
									</Typography>
								}
								sx={{ mb: 2 }}
							/>

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
								sx={{ mt: 1, mb: 2 }}
							>
								{loading ? (
									<>
										<CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
										Creating Account...
									</>
								) : (
									'Create My Account'
								)}
							</Button>

							<Typography variant="body2" className={'progress-line'}>
								Most members see progress within their first 14 days.
							</Typography>

							<Box className={'login-link'}>
								<Typography variant="body2" color="text.secondary" textAlign="center">
									Already have an account?{' '}
									<Link href="/account/login" className={'link-text'}>
										Log in
									</Link>
								</Typography>
							</Box>

							<Typography variant="caption" className={'pressure-microcopy'}>
								No pressure. Cancel anytime.
							</Typography>
						</Box>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);

	return device === 'mobile' ? mobileView : desktopView;
};

export default withLayoutBasic(RegisterPage);







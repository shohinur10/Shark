import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) {
			const value = e.target.name;
			handleInput('type', value);
		} else {
			handleInput('type', 'USER');
		}
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		console.warn(input);
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		console.warn(input);
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	if (device === 'mobile') {
		return <div>LOGIN MOBILE</div>;
	} else {
		return (
			<Stack className={'join-page'}>
				<Stack className={'container'}>
					<Stack className={'main'}>
						<Stack className={'left'}>
							{/* Logo Section */}
							<Box className={'logo-section'}>
								<img src="/img/logo/ChatGPT Image Nov 25, 2025, 11_45_12 PM.png" alt="Shark Logo" className={'logo-img'} />
								<Typography variant="h4" className={'logo-text'}>
									Shark Fitness
								</Typography>
							</Box>

							{/* Header */}
							<Box className={'header-section'}>
								<FitnessCenterIcon className={'fitness-icon'} />
								<Typography variant="h3" className={'main-title'}>
									{loginView ? 'Welcome Back!' : 'Start Your Journey'}
								</Typography>
								<Typography variant="body1" className={'subtitle'}>
									{loginView
										? 'Continue your fitness transformation and track your progress'
										: 'Join thousands of members achieving their fitness goals'}
								</Typography>
							</Box>

							{/* Form */}
							<Box className={'form-section'}>
								<div className={'input-box'}>
									<PersonIcon className={'input-icon'} />
									<input
										type="text"
										placeholder={'Nickname or Email'}
										value={input.nick}
										onChange={(e) => handleInput('nick', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter' && loginView) doLogin();
											if (event.key == 'Enter' && !loginView) doSignUp();
										}}
										className={'fitness-input'}
									/>
								</div>
								<div className={'input-box'}>
									<LockIcon className={'input-icon'} />
									<input
										type="password"
										placeholder={'Password'}
										value={input.password}
										onChange={(e) => handleInput('password', e.target.value)}
										required={true}
										onKeyDown={(event) => {
											if (event.key == 'Enter' && loginView) doLogin();
											if (event.key == 'Enter' && !loginView) doSignUp();
										}}
										className={'fitness-input'}
										autoComplete={loginView ? 'current-password' : 'new-password'}
									/>
								</div>
								{!loginView && (
									<div className={'input-box'}>
										<PhoneIcon className={'input-icon'} />
										<input
											type="text"
											placeholder={'Phone Number'}
											value={input.phone}
											onChange={(e) => handleInput('phone', e.target.value)}
											required={true}
											onKeyDown={(event) => {
												if (event.key == 'Enter') doSignUp();
											}}
											className={'fitness-input'}
										/>
									</div>
								)}
							</Box>

							{/* Options */}
							<Box className={'options-section'}>
								{!loginView && (
									<div className={'type-selection'}>
										<Typography variant="body2" className={'type-label'}>
											I want to join as:
										</Typography>
										<div className={'type-buttons'}>
											<button
												className={`type-btn ${input.type === 'USER' ? 'active' : ''}`}
												onClick={() => handleInput('type', 'USER')}
											>
												<PersonIcon />
												<span>User</span>
											</button>
											<button
												className={`type-btn ${input.type === 'TRAINER' ? 'active' : ''}`}
												onClick={() => handleInput('type', 'TRAINER')}
											>
												<FitnessCenterIcon />
												<span>Trainer</span>
											</button>
										</div>
									</div>
								)}

								{loginView && (
									<div className={'remember-section'}>
										<FormGroup>
											<FormControlLabel
												control={<Checkbox defaultChecked size="small" className={'fitness-checkbox'} />}
												label="Remember me"
												className={'remember-label'}
											/>
										</FormGroup>
										<a href="/account/forgot-password" className={'forgot-link'}>
											Forgot password?
										</a>
									</div>
								)}
							</Box>

							{/* Action Button */}
							<Button
								variant="contained"
								className={'action-button'}
								disabled={
									loginView
										? input.nick == '' || input.password == ''
										: input.nick == '' || input.password == '' || input.phone == '' || input.type == ''
								}
								onClick={loginView ? doLogin : doSignUp}
								endIcon={<ArrowForwardIcon />}
							>
								{loginView ? 'Continue Training' : 'Start Your Journey'}
							</Button>

							{/* Switch View */}
							<Box className={'switch-section'}>
								<Typography variant="body2" className={'switch-text'}>
									{loginView ? "Don't have an account? " : 'Already have an account? '}
									<button
										className={'switch-button'}
										onClick={() => {
											viewChangeHandler(!loginView);
										}}
									>
										{loginView ? 'Sign Up' : 'Log In'}
									</button>
								</Typography>
							</Box>
						</Stack>

						{/* Right Side - Visual */}
						<Stack className={'right'}>
							<div className={'image-overlay'}></div>
							<div className={'content-overlay'}>
								<FitnessCenterIcon className={'overlay-icon'} />
								<Typography variant="h4" className={'overlay-title'}>
									Transform Your Body
								</Typography>
								<Typography variant="body1" className={'overlay-text'}>
									Join our community of fitness enthusiasts and achieve your goals with personalized training programs
								</Typography>
								<div className={'features-list'}>
									<div className={'feature-item'}>
										<FitnessCenterIcon />
										<span>Personalized Workouts</span>
									</div>
									<div className={'feature-item'}>
										<FitnessCenterIcon />
										<span>Expert Trainers</span>
									</div>
									<div className={'feature-item'}>
										<FitnessCenterIcon />
										<span>Track Progress</span>
									</div>
								</div>
							</div>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(Join);

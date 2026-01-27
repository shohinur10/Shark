import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import moment from 'moment';

const Footer = () => {
	const device = useDeviceDetect();
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);
		if (emailError && value) {
			setEmailError('');
		}
	};

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			setEmailError('Email is required');
			return;
		}
		if (!validateEmail(email)) {
			setEmailError('Please enter a valid email address');
			return;
		}
		// TODO: Add backend call here
		setEmailError('');
		setEmail('');
	};

	return (
		<Stack className={'footer-container'}>
			<Stack className={'main'}>
				{/* Column 1: Brand & Support */}
				<Box component="div" className={'column brand-column'}>
					<Box component="div" className={'brand-section'}>
						<img src="/img/logo/ChatGPT Image Nov 25, 2025, 11_45_12 PM.png" alt="Shark Logo" className={'logo'} />
						<p className={'tagline'}>Transform your body, elevate your mind.</p>
					</Box>
					<Box component="div" className={'support-section'}>
						<div className={'support-item'}>
							<span className={'support-label'}>Phone</span>
							<p className={'support-value'}>+82 10 4867 2909</p>
						</div>
						<div className={'support-item'}>
							<span className={'support-label'}>Hours</span>
							<p className={'support-value'}>Mon-Fri: 9AM-6PM</p>
						</div>
						<div className={'support-item'}>
							<span className={'support-label'}>Email</span>
							<p className={'support-value'}>support@shark.com</p>
						</div>
					</Box>
					<Box component="div" className={'social-section'}>
						<div className={'media-box'}>
							<FacebookOutlinedIcon />
							<TelegramIcon />
							<InstagramIcon />
							<TwitterIcon />
						</div>
					</Box>
				</Box>

				{/* Column 2: Popular Workouts */}
				<Box component="div" className={'column links-column'}>
					<strong className={'column-title'}>Popular Workouts</strong>
					<Stack className={'links-list'}>
						<span className={'link-item'}>Strength Training</span>
						<span className={'link-item'}>Cardio Workouts</span>
						<span className={'link-item'}>Yoga & Flexibility</span>
						<span className={'link-item'}>HIIT Training</span>
					</Stack>
				</Box>

				{/* Column 3: Quick Links */}
				<Box component="div" className={'column links-column'}>
					<strong className={'column-title'}>Quick Links</strong>
					<Stack className={'links-list'}>
						<span className={'link-item'}>Terms of Use</span>
						<span className={'link-item'}>Privacy Policy</span>
						<span className={'link-item'}>Pricing Plans</span>
						<span className={'link-item'}>Our Services</span>
						<span className={'link-item'}>Contact Support</span>
						<span className={'link-item'}>FAQs</span>
					</Stack>
				</Box>

				{/* Column 4: Explore + Newsletter */}
				<Box component="div" className={'column newsletter-column'}>
					<Box component="div" className={'explore-section'}>
						<strong className={'column-title'}>Explore</strong>
						<Stack className={'links-list'}>
							<span className={'link-item'}>Workouts</span>
							<span className={'link-item'}>Nutrition Plans</span>
							<span className={'link-item'}>Trainers</span>
							<span className={'link-item'}>Gyms & Studios</span>
						</Stack>
					</Box>
					<Box component="div" className={'newsletter-card'}>
						<h3 className={'newsletter-title'}>Get weekly training + nutrition tips</h3>
						<p className={'newsletter-subtitle'}>No spam. Just real workouts, meal plans, and coaching insights.</p>
						<form onSubmit={handleSubscribe} className={'newsletter-form'}>
							<TextField
								type="email"
								placeholder="Your email"
								value={email}
								onChange={handleEmailChange}
								error={!!emailError}
								helperText={emailError}
								className={'newsletter-input'}
								variant="outlined"
								fullWidth
								sx={{
									'& .MuiOutlinedInput-root': {
										backgroundColor: 'transparent',
										'& fieldset': {
											borderColor: 'rgba(255, 255, 255, 0.1)',
										},
										'&:hover fieldset': {
											borderColor: 'rgba(255, 255, 255, 0.2)',
										},
										'&.Mui-focused fieldset': {
											borderColor: 'rgba(255, 255, 255, 0.3)',
										},
									},
									'& .MuiInputBase-input': {
										color: '#fff',
										fontSize: '14px',
										padding: '10px 14px',
									},
									'& .MuiInputBase-input::placeholder': {
										color: 'rgba(255, 255, 255, 0.5)',
										opacity: 1,
									},
									'& .MuiFormHelperText-root': {
										marginTop: '4px',
										fontSize: '12px',
										color: 'rgba(255, 255, 255, 0.6)',
									},
								}}
							/>
							<Button 
								type="submit" 
								className={'newsletter-button'}
								sx={{
									textTransform: 'none',
									fontWeight: 600,
									fontSize: '14px',
									padding: '10px 24px',
									marginTop: '12px',
									backgroundColor: '#fff',
									color: '#181a20',
									'&:hover': {
										backgroundColor: 'rgba(255, 255, 255, 0.9)',
									},
								}}
							>
								Subscribe
							</Button>
						</form>
					</Box>
				</Box>
			</Stack>

			{/* Bottom Bar */}
			<Stack className={'bottom-bar'}>
				<span className={'copyright'}>© Shark - All rights reserved. Shark {moment().year()}</span>
				<span className={'bottom-links'}>Privacy · Terms · Sitemap</span>
			</Stack>
		</Stack>
	);
};

export default Footer;

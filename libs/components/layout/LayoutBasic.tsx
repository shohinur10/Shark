import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			// Get the base path without query params
			const basePath = router.pathname.split('?')[0];

			switch (basePath) {
				case '/mypage':
					title = 'My Page';
					desc = 'Manage your profile and settings';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/community':
					title = 'Community';
					desc = 'Train together. Stay consistent. Push your limits.';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'View and engage with posts';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/workouts':
					title = 'Workouts';
					desc = 'Discover and follow your favorite workout plans';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/workouts/[id]':
					title = 'Workout Details';
					desc = 'Start your fitness journey';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/workouts/[id]/start':
					title = 'Start Workout';
					desc = 'Ready to transform your body';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/exercises':
					title = 'Exercises';
					desc = 'Explore our exercise library';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/exercises/[id]':
					title = 'Exercise Details';
					desc = 'Learn proper form and technique';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/exercises/create':
					title = 'Create Exercise';
					desc = 'Add a new exercise to the library';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/nutrition':
					title = 'Nutrition';
					desc = 'Fuel your body with proper nutrition';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/nutrition/meal-plans':
					title = 'Meal Plans';
					desc = 'Customized meal plans for your goals';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/nutrition/meal-plans/[id]':
					title = 'Meal Plan Details';
					desc = 'Discover delicious and healthy meals';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/nutrition/recipes':
					title = 'Recipes';
					desc = 'Healthy recipes for every meal';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/nutrition/recipes/[id]':
					title = 'Recipe Details';
					desc = 'Cook delicious and nutritious meals';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/nutrition/supplements':
					title = 'Supplements';
					desc = 'Enhance your nutrition with supplements';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/nutrition/calorie-calculator':
					title = 'Calorie Calculator';
					desc = 'Calculate your daily calorie needs';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/nutrition/macro-guide':
					title = 'Macro Guide';
					desc = 'Understand macronutrients for optimal nutrition';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/trainer':
					title = 'Trainers';
					desc = 'Find expert trainers to guide your journey';
					bgImage = '/img/banner/header2.svg';
					break;
			case '/trainer/[id]':
				title = 'Trainer Profile';
				desc = 'Meet your personal trainer';
				bgImage = '/img/banner/header2.svg';
				break;
			case '/trainer/workouts/create':
				title = 'Create Workout';
				desc = 'Design your custom workout program';
				bgImage = '/img/banner/header2.svg';
				break;
			case '/trainer/meal-plans/create':
				title = 'Create Meal Plan';
				desc = 'Design your custom meal plan';
				bgImage = '/img/banner/header2.svg';
				break;
			case '/trainer/create':
				title = 'Create Workout';
				desc = 'Design your custom workout program';
				bgImage = '/img/banner/header2.svg';
				break;
			case '/trainer/meal-plan':
				title = 'Create Meal Plan';
				desc = 'Design your custom meal plan';
				bgImage = '/img/banner/header2.svg';
				break;
				case '/coaching':
					title = 'Coaching';
					desc = 'Get personalized coaching and guidance';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/progress':
					title = 'Progress';
					desc = 'Track your fitness journey and achievements';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/pricing':
					title = 'Pricing';
					desc = 'Choose the plan that fits your goals';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/support':
					title = 'Support';
					desc = 'We are here to help you';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/goals':
					title = 'Goals';
					desc = 'Set and achieve your fitness goals';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/goals/create':
					title = 'Create Goal';
					desc = 'Define your fitness objectives';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/goals/challenges/[id]':
					title = 'Challenge Details';
					desc = 'Join the community challenge';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/gyms':
					title = 'Gyms';
					desc = 'Find gyms near you';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/gyms/[id]':
					title = 'Gym Details';
					desc = 'Explore gym facilities and amenities';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/bookings':
					title = 'Bookings';
					desc = 'Manage your appointments and sessions';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/bookings/new':
					title = 'New Booking';
					desc = 'Schedule your training session';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/fitness-journey':
					title = 'Fitness Journey';
					desc = 'Document your transformation story';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/dashboard':
					title = 'Dashboard';
					desc = 'Overview of your fitness activity';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/about':
					title = 'About';
					desc = 'Learn more about Shark Fitness';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/cs':
					title = 'Customer Service';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/header2.svg';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Authentication Process';
					bgImage = '/img/banner/header2.svg';
					setAuthHeader(true);
					break;
				case '/account/login':
					title = 'Login';
					desc = 'Welcome back to Shark Fitness';
					bgImage = '/img/banner/header2.svg';
					setAuthHeader(true);
					break;
				case '/account/register':
					title = 'Register';
					desc = 'Join the Shark Fitness community';
					bgImage = '/img/banner/header2.svg';
					setAuthHeader(true);
					break;
				case '/account/forgot-password':
					title = 'Forgot Password';
					desc = 'Reset your password';
					bgImage = '/img/banner/header2.svg';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Member information and settings';
					bgImage = '/img/banner/header2.svg';
					break;
				default:
					// For any unmatched route, provide default header
					if (!bgImage && basePath !== '/') {
						title = basePath.split('/').pop()?.replace(/-/g, ' ') || 'Page';
						desc = 'Welcome to Shark Fitness';
						bgImage = '/img/banner/header2.svg';
					}
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Shark</title>
						<meta name={'title'} content={`Shark`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Shark</title>
						<meta name={'title'} content={`Shark`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						{memoizedValues.bgImage && (
							<Stack
								className={`header-basic ${authHeader && 'auth'}`}
								style={{
									backgroundImage: `url(${memoizedValues.bgImage})`,
									backgroundSize: 'cover',
									boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
								}}
							>
								<Stack className={'container'}>
									<strong>{t(memoizedValues.title)}</strong>
									<span>{t(memoizedValues.desc)}</span>
								</Stack>
							</Stack>
						)}

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;

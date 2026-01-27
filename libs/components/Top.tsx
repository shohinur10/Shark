import React, { useCallback, useEffect, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import { GET_UNREAD_NOTIFICATION_COUNT } from '../../apollo/user/query';
import NotificationDropdown from './NotificationDropdown';
import { Badge } from '@mui/material';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [currentPath, setCurrentPath] = useState<string>('');
	const [nutritionAnchor, setNutritionAnchor] = useState<null | HTMLElement>(null);
	const nutritionOpen = Boolean(nutritionAnchor);
	const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
	const notificationOpen = Boolean(notificationAnchor);

	// Get unread notification count
	const { data: unreadCountData } = useQuery(GET_UNREAD_NOTIFICATION_COUNT, {
		skip: !user?._id,
		pollInterval: 60000, // Poll every minute
	});
	const unreadCount = unreadCountData?.getUnreadNotificationCount || 0;

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/property/detail':
				setBgColor(true);
				break;
			default:
				setBgColor(false);
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	// ✅ Add scroll event listener safely
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY >= 50) {
				setColorChange(true);
			} else {
				setColorChange(false);
			}
		};

		window.addEventListener('scroll', handleScroll);

		// Cleanup on unmount
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	// ✅ Update current path when route changes
	useEffect(() => {
		setCurrentPath(router.asPath.split('?')[0]); // Remove query params for matching
	}, [router.asPath]);

	/** MENU CONFIGURATION **/
	const menuItems = [
		{ href: '/', key: 'Home', exact: true },
		{ href: '/workouts', key: 'Workouts' },
		{ href: '/coaching', key: 'Coaching' },
		{ href: '/trainer', key: 'Trainer' },
		{ href: '/nutrition', key: 'Nutrition', hasDropdown: true },
		{ href: '/progress', key: 'Progress' },
		{ href: '/community?articleCategory=FREE', key: 'Community' },
		{ href: '/pricing', key: 'Pricing' },
		{ href: '/mypage', key: 'My Page', requiresAuth: true },
		{ href: '/support', key: 'Support' },
	];

	// Nutrition dropdown items
	const nutritionMenuItems = [
		{ href: '/nutrition/meal-plans', key: 'Meal Plans' },
		{ href: '/nutrition/recipes', key: 'Recipes' },
		{ href: '/nutrition/calorie-calculator', key: 'Calorie Calculator' },
		{ href: '/nutrition/macro-guide', key: 'Macro Guide' },
		{ href: '/nutrition/supplements', key: 'Supplements' },
	];

	const isActive = (item: typeof menuItems[0]) => {
		if (item.exact) {
			return currentPath === item.href;
		}
		const pathWithoutQuery = item.href.split('?')[0];
		return currentPath.startsWith(pathWithoutQuery);
	};

	// Check if any nutrition sub-item is active
	const isNutritionActive = () => {
		return nutritionMenuItems.some((subItem) => {
			const pathWithoutQuery = subItem.href.split('?')[0];
			return currentPath.startsWith(pathWithoutQuery);
		}) || currentPath === '/nutrition';
	};

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const handleNutritionClick = (event: React.MouseEvent<HTMLElement>) => {
		setNutritionAnchor(event.currentTarget);
	};

	const handleNutritionClose = () => {
		setNutritionAnchor(null);
	};

	const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
		setNotificationAnchor(event.currentTarget);
	};

	const handleNotificationClose = () => {
		setNotificationAnchor(null);
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

		if (device === 'mobile') {
			return (
				<Stack className={'top'}>
					<Link href={'/'}><div>{t('Home')}</div></Link>
					<Link href={'/workouts'}><div>{t('Workouts')}</div></Link>
					<Link href={'/coaching'}><div>{t('Coaching')}</div></Link>
					<Link href={'/trainer'}><div>{t('Trainer')}</div></Link>
					<Box component="div" sx={{ position: 'relative' }}>
						<Box
							component="div"
							onClick={handleNutritionClick}
							sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
						>
							{t('Nutrition')}
							<CaretDown size={14} color="currentColor" weight="fill" />
						</Box>
						<StyledMenu
							anchorEl={nutritionAnchor}
							open={nutritionOpen}
							onClose={handleNutritionClose}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
							transformOrigin={{ vertical: 'top', horizontal: 'left' }}
						>
							{nutritionMenuItems.map((subItem) => (
								<MenuItem
									key={subItem.key}
									onClick={() => {
										handleNutritionClose();
										router.push(subItem.href);
									}}
									disableRipple
								>
									{t(subItem.key)}
								</MenuItem>
							))}
						</StyledMenu>
					</Box>
					<Link href={'/progress'}><div>{t('Progress')}</div></Link>
					<Link href={'/community?articleCategory=FREE'}><div>{t('Community')}</div></Link>
					<Link href={'/pricing'}><div>{t('Pricing')}</div></Link>
					{user?._id && <Link href={'/mypage'}><div>{t('My Page')}</div></Link>}
					<Link href={'/support'}><div>{t('Support')}</div></Link>
				</Stack>
			);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>
						<Box component="div" className={'logo-box'}>
							<Link href={'/'}>
								<div className="logo-container">
									<img src="/img/logo/ChatGPT Image Nov 25, 2025, 11_45_12 PM.png" alt="Shark Logo" />
								</div>
							</Link>
						</Box>
						<Box component="div" className={'router-box'}>
							{menuItems.map((item) => {
								// Skip auth-required items if user is not logged in
								if (item.requiresAuth && !user?._id) {
									return null;
								}
								
								// Handle Nutrition with dropdown
								if (item.hasDropdown && item.key === 'Nutrition') {
									return (
										<Box key={item.key} component="div" sx={{ position: 'relative' }}>
											<Box
												component="div"
												className={isActive(item) || isNutritionActive() ? 'active' : ''}
												onClick={handleNutritionClick}
												sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
											>
												{t(item.key)}
												<CaretDown size={14} color="currentColor" weight="fill" />
											</Box>
											<StyledMenu
												anchorEl={nutritionAnchor}
												open={nutritionOpen}
												onClose={handleNutritionClose}
												anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
												transformOrigin={{ vertical: 'top', horizontal: 'left' }}
											>
												{nutritionMenuItems.map((subItem) => (
													<MenuItem
														key={subItem.key}
														onClick={() => {
															handleNutritionClose();
															router.push(subItem.href);
														}}
														disableRipple
													>
														{t(subItem.key)}
													</MenuItem>
												))}
											</StyledMenu>
										</Box>
									);
								}
								
								return (
									<Link key={item.key} href={item.href}>
										<div className={isActive(item) ? 'active' : ''}>{t(item.key)}</div>
									</Link>
								);
							})}
						</Box>
						<Box component="div" className={'user-box'}>
							{user?._id ? (
								<>
									<div className={'login-user'} onClick={(e: any) => setLogoutAnchor(e.currentTarget)}>
										<img
											src={
												user?.memberImage
													? `${REACT_APP_API_URL}/${user?.memberImage}`
													: '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
									</div>
									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => setLogoutAnchor(null)}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										<AccountCircleOutlinedIcon />
										<span>{t('Login')} / {t('Register')}</span>
									</div>
								</Link>
							)}

							<div className={'lan-box'}>
								{user?._id && (
									<>
										<Badge
											badgeContent={unreadCount}
											color="error"
											max={99}
											sx={{
												marginRight: '16px',
												'& .MuiBadge-badge': {
													fontSize: '10px',
													height: '18px',
													minWidth: '18px',
												},
											}}
										>
											<Box
												component="div"
												onClick={handleNotificationClick}
												sx={{
													cursor: 'pointer',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<NotificationsOutlinedIcon className={'notification-icon'} />
											</Box>
										</Badge>
										<NotificationDropdown
											anchorEl={notificationAnchor}
											open={notificationOpen}
											onClose={handleNotificationClose}
										/>
									</>
								)}
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
								>
									<Box component="div" className={'flag'}>
										<img src={`/img/flag/lang${lang || 'en'}.png`} alt="language" />
									</Box>
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img className="img-flag" src={'/img/flag/langen.png'} id="en" alt="English" />
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img className="img-flag" src={'/img/flag/langkr.png'} id="kr" alt="Korean" />
										{t('Korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img className="img-flag" src={'/img/flag/langru.png'} id="ru" alt="Russian" />
										{t('Russian')}
									</MenuItem>
								</StyledMenu>
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);

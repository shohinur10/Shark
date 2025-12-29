import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ChatsCircle, Headset, User, UserCircleGear, SquaresFour, Calendar, Star, Wrench, CreditCard, Barbell, Trophy } from 'phosphor-react';
import cookies from 'js-cookie';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const AdminMenuList = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [mobileLayout, setMobileLayout] = useState(false);
	const [openSubMenu, setOpenSubMenu] = useState('Users');
	const [openMenu, setOpenMenu] = useState(typeof window === 'object' ? cookies.get('admin_menu') === 'true' : false);
	const [clickMenu, setClickMenu] = useState<any>([]);
	const [clickSubMenu, setClickSubMenu] = useState('');

	const pathnames = router.pathname.split('/').filter((x: any) => x);

	/** LIFECYCLES **/
	useEffect(() => {
		if (device === 'mobile') setMobileLayout(true);

		switch (pathnames[1]) {
			case 'dashboard':
				setClickMenu([]);
				setClickSubMenu('');
				break;
			case 'users':
				setClickMenu(['Members']);
				break;
			case 'bookings':
			case 'reviews':
			case 'services':
			case 'properties':
			case 'subscriptions':
			case 'workouts':
			case 'exercises':
			case 'challenges':
				setClickMenu([]);
				setClickSubMenu('');
				break;
			case 'community':
				setClickMenu(['Community']);
				break;
			case 'cs':
				setClickMenu(['Cs']);
				break;
			default:
				setClickMenu([]);
				setClickSubMenu('');
				break;
		}

		switch (pathnames[2]) {
			case 'logs':
				setClickSubMenu('Logs');
				break;
			case 'inquiry':
				setClickSubMenu('1:1 Inquiry');
				break;
			case 'notice':
				setClickSubMenu('Notice');
				break;
			case 'faq':
				setClickSubMenu('FAQ');
				break;
			case 'board_create':
				setClickSubMenu('Board Create');
				break;
			default:
				setClickSubMenu('List');
				break;
		}
	}, []);

	/** HANDLERS **/
	const subMenuChangeHandler = (target: string) => {
		if (clickMenu.find((item: string) => item === target)) {
			// setOpenSubMenu('');
			setClickMenu(clickMenu.filter((menu: string) => target !== menu));
		} else {
			// setOpenSubMenu(target);
			setClickMenu([...clickMenu, target]);
		}
	};

	const menu_set: any[] = [
		{
			title: 'Dashboard',
			icon: <SquaresFour size={20} color="#bdbdbd" weight="fill" />,
			url: '/_admin/dashboard',
			isLink: true,
		},
		{
			title: 'Members',
			icon: <User size={20} color="#bdbdbd" weight="fill" />,
			on_click: () => subMenuChangeHandler('Members'),
		},
		{
			title: 'Bookings',
			icon: <Calendar size={20} color="#bdbdbd" weight="fill" />,
			url: '/_admin/bookings',
			isLink: true,
		},
		{
			title: 'Reviews',
			icon: <Star size={20} color="#bdbdbd" weight="fill" />,
			url: '/_admin/reviews',
			isLink: true,
		},
		{
			title: 'Services',
			icon: <Wrench size={20} color="#bdbdbd" weight="fill" />,
			url: '/_admin/services',
			isLink: true,
		},
		{
			title: 'Properties',
			icon: <UserCircleGear size={20} color="#bdbdbd" weight="fill" />,
			url: '/_admin/properties',
			isLink: true,
		},
		{
			title: 'Subscriptions',
			icon: <CreditCard size={20} color="#bdbdbd" weight="fill" />,
			url: '/_admin/subscriptions',
			isLink: true,
		},
		{
			title: 'Workouts',
			icon: <Barbell size={20} color="#bdbdbd" weight="fill" />,
			url: '/_admin/workouts',
			isLink: true,
		},
		{
			title: 'Exercises',
			icon: <Barbell size={20} color="#bdbdbd" weight="fill" />,
			url: '/_admin/exercises',
			isLink: true,
		},
		{
			title: 'Challenges',
			icon: <Trophy size={20} color="#bdbdbd" weight="fill" />,
			url: '/_admin/challenges',
			isLink: true,
		},
		{
			title: 'Community',
			icon: <ChatsCircle size={20} color="#bdbdbd" weight="fill" />,
			on_click: () => subMenuChangeHandler('Community'),
		},
		{
			title: 'Cs',
			icon: <Headset size={20} color="#bdbdbd" weight="fill" />,
			on_click: () => subMenuChangeHandler('Cs'),
		},
	];

	const sub_menu_set: any = {
		Members: [{ title: 'List', url: '/_admin/users' }],
		Community: [{ title: 'List', url: '/_admin/community' }],
		Cs: [
			{ title: 'FAQ', url: '/_admin/cs/faq' },
			{ title: 'Notice', url: '/_admin/cs/notice' },
			{ title: '1:1 Inquiry', url: '/_admin/cs/inquiry' },
		],
	};

	return (
		<>
			{menu_set.map((item, index) => {
				if (item.isLink && item.url) {
					const isActive = router.pathname === item.url || router.pathname.startsWith(item.url + '/');
					return (
						<Link href={item.url} key={index}>
							<List className={'menu_wrap'} disablePadding>
								<ListItemButton
									component={'li'}
									className={isActive ? 'menu on' : 'menu'}
									sx={{
										minHeight: 48,
										justifyContent: openMenu ? 'initial' : 'center',
										px: 2.5,
									}}
								>
									<ListItemIcon
										sx={{
											minWidth: 0,
											mr: openMenu ? 3 : 'auto',
											justifyContent: 'center',
										}}
									>
										{item.icon}
									</ListItemIcon>
									<ListItemText>{item.title}</ListItemText>
								</ListItemButton>
							</List>
						</Link>
					);
				}

				return (
					<List className={'menu_wrap'} key={index} disablePadding>
						<ListItemButton
							onClick={item.on_click}
							component={'li'}
							className={clickMenu.find((menu: string) => menu === item.title) ? 'menu on' : 'menu'}
							sx={{
								minHeight: 48,
								justifyContent: openMenu ? 'initial' : 'center',
								px: 2.5,
							}}
						>
							<ListItemIcon
								sx={{
									minWidth: 0,
									mr: openMenu ? 3 : 'auto',
									justifyContent: 'center',
								}}
							>
								{item.icon}
							</ListItemIcon>
							<ListItemText>{item.title}</ListItemText>
							{clickMenu.find((menu: string) => item.title === menu) ? <ExpandLess /> : <ExpandMore />}
						</ListItemButton>
						<Collapse
							in={!!clickMenu.find((menu: string) => menu === item.title)}
							className="menu"
							timeout="auto"
							component="li"
							unmountOnExit
						>
							<List className="menu-list" disablePadding>
								{sub_menu_set[item.title] &&
									sub_menu_set[item.title].map((sub: any, i: number) => (
										<Link href={sub.url} shallow={true} replace={true} key={i}>
											<ListItemButton
												component="li"
												className={clickMenu.find((menu: string) => menu === item.title) && clickSubMenu === sub.title ? 'li on' : 'li'}
											>
												<Typography variant={sub.title} component={'span'}>
													{sub.title}
												</Typography>
											</ListItemButton>
										</Link>
									))}
							</List>
						</Collapse>
					</List>
				);
			})}
		</>
	);
};

export default AdminMenuList;

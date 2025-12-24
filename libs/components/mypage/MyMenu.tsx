import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, List, ListItem, Divider, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert, sweetMixinErrorAlert } from '../../sweetAlert';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArticleIcon from '@mui/icons-material/Article';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const pathname = router.query.category ?? 'myProfile';
	const category: any = router.query?.category ?? 'myProfile';
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const logoutHandler = async () => {
		try {
			if (await sweetConfirmAlert('Do you want to logout?')) logOut();
		} catch (err: any) {
			console.log('ERROR, logoutHandler:', err.message);
		}
	};

	if (device === 'mobile') {
		return <div>MY MENU</div>;
	} else {
		const isMyPage = category === 'myProfile' || !category || category === '';
		
		return (
			<Stack width={'100%'} padding={'24px'} className={'my-menu-container'}>
				{/* My Page Highlight */}
				<Box
					sx={{
						mb: 3,
						p: 2,
						borderRadius: '12px',
						backgroundColor: isMyPage ? 'rgba(225, 6, 0, 0.08)' : 'transparent',
						border: isMyPage ? '1px solid #E10600' : '1px solid transparent',
						transition: 'all 0.2s ease',
					}}
				>
					<Link
						href={{
							pathname: '/mypage',
							query: { category: 'myProfile' },
						}}
						scroll={false}
						style={{ textDecoration: 'none' }}
					>
						<Stack direction="row" alignItems="center" spacing={1.5}>
							<DashboardIcon
								sx={{
									fontSize: '24px',
									color: isMyPage ? '#E10600' : '#6B6B6B',
								}}
							/>
							<Typography
								sx={{
									fontSize: '16px',
									fontWeight: isMyPage ? 700 : 600,
									color: isMyPage ? '#E10600' : '#111111',
								}}
							>
								My Page
							</Typography>
						</Stack>
					</Link>
				</Box>

				<Stack className={'profile'}>
					<Box component={'div'} className={'profile-img'}>
						<img
							src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt={'member-photo'}
						/>
					</Box>
					<Stack className={'user-info'}>
						<Typography className={'user-name'}>{user?.memberNick || 'User'}</Typography>
						<Box component={'div'} className={'user-phone'}>
							<img src={'/img/icons/call.svg'} alt={'icon'} />
							<Typography className={'p-number'}>{user?.memberPhone || 'No phone'}</Typography>
						</Box>
						{user?.memberType === 'ADMIN' ? (
							<a href="/_admin/users" target={'_blank'} style={{ textDecoration: 'none' }}>
								<Chip
									label={user.memberType}
									size="small"
									sx={{
										backgroundColor: '#E10600',
										color: '#FFFFFF',
										fontSize: '10px',
										fontWeight: 600,
										height: '20px',
										mt: 0.5,
									}}
								/>
							</a>
						) : (
							<Chip
								label={user?.memberType || 'MEMBER'}
								size="small"
								sx={{
									backgroundColor: '#F0F0F0',
									color: '#6B6B6B',
									fontSize: '10px',
									fontWeight: 600,
									height: '20px',
									mt: 0.5,
								}}
							/>
						)}
					</Stack>
				</Stack>
				<Divider sx={{ borderColor: '#E5E5E5', my: 2 }} />
				<Stack className={'sections'}>
					<Stack className={'section'}>
						<Typography className="title" variant={'h5'}>
							MANAGE LISTINGS
						</Typography>
						<List className={'sub-section'}>
							{user.memberType === 'AGENT' && (
								<>
									<ListItem className={pathname === 'addProperty' ? 'focus' : ''}>
										<Link
											href={{
												pathname: '/mypage',
												query: { category: 'addProperty' },
											}}
											scroll={false}
										>
											<div className={'flex-box'}>
												<EditNoteIcon
													sx={{
														fontSize: '20px',
														color: category === 'addProperty' ? '#E10600' : '#6B6B6B',
													}}
												/>
												<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
													Add Property
												</Typography>
											</div>
										</Link>
									</ListItem>
									<ListItem className={pathname === 'myProperties' ? 'focus' : ''}>
										<Link
											href={{
												pathname: '/mypage',
												query: { category: 'myProperties' },
											}}
											scroll={false}
										>
											<div className={'flex-box'}>
												<HomeIcon
													sx={{
														fontSize: '20px',
														color: category === 'myProperties' ? '#E10600' : '#6B6B6B',
													}}
												/>
												<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
													My Properties
												</Typography>
											</div>
										</Link>
									</ListItem>
								</>
							)}
							<ListItem className={pathname === 'myFavorites' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'myFavorites' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<FavoriteIcon
											sx={{
												fontSize: '20px',
												color: category === 'myFavorites' ? '#E10600' : '#6B6B6B',
											}}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Favorites
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'recentlyVisited' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'recentlyVisited' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<HistoryIcon
											sx={{
												fontSize: '20px',
												color: category === 'recentlyVisited' ? '#E10600' : '#6B6B6B',
											}}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Recently Visited
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'followers' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'followers' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<PeopleIcon
											sx={{
												fontSize: '20px',
												color: category === 'followers' ? '#E10600' : '#6B6B6B',
											}}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Followers
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'followings' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'followings' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<PersonAddIcon
											sx={{
												fontSize: '20px',
												color: category === 'followings' ? '#E10600' : '#6B6B6B',
											}}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Followings
										</Typography>
									</div>
								</Link>
							</ListItem>
						</List>
					</Stack>
					<Stack className={'section'} sx={{ marginTop: '16px' }}>
						<Typography className="title" variant={'h5'}>
							Community
						</Typography>
						<List className={'sub-section'}>
							<ListItem className={pathname === 'myArticles' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'myArticles' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<ArticleIcon
											sx={{
												fontSize: '20px',
												color: category === 'myArticles' ? '#E10600' : '#6B6B6B',
											}}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Articles
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'writeArticle' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'writeArticle' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<EditNoteIcon
											sx={{
												fontSize: '20px',
												color: category === 'writeArticle' ? '#E10600' : '#6B6B6B',
											}}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											Write Article
										</Typography>
									</div>
								</Link>
							</ListItem>
						</List>
					</Stack>
					<Divider sx={{ borderColor: '#E5E5E5', my: 2 }} />
					<Stack className={'section'}>
						<Typography className="title" variant={'h5'}>
							MANAGE ACCOUNT
						</Typography>
						<List className={'sub-section'}>
							<ListItem className={pathname === 'myProfile' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'myProfile' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<PersonIcon
											sx={{
												fontSize: '20px',
												color: category === 'myProfile' ? '#E10600' : '#6B6B6B',
											}}
										/>
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											My Profile
										</Typography>
									</div>
								</Link>
							</ListItem>
							<ListItem 
								onClick={logoutHandler}
								sx={{ 
									cursor: 'pointer',
									borderRadius: '12px',
									'&:hover': {
										backgroundColor: 'rgba(225, 6, 0, 0.08)',
									}
								}}
							>
								<div className={'flex-box'}>
									<LogoutIcon
										sx={{
											fontSize: '20px',
											color: '#6B6B6B',
										}}
									/>
									<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
										Logout
									</Typography>
								</div>
							</ListItem>
						</List>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default MyMenu;

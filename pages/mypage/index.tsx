import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import {
	Stack,
	Box,
	Card,
	Typography,
	Avatar,
	Grid,
	Button,
	Chip,
	Divider,
} from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyProfile from '../../libs/components/mypage/MyProfile';
import MyArticles from '../../libs/components/mypage/MyArticles';
import { useMutation, useReactiveVar, useQuery } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { GET_WORKOUTS, GET_MEAL_PLANS, GET_BOOKINGS } from '../../apollo/user/query';
import { WorkoutsInquiry } from '../../libs/types/workout/workout.input';
import { MealPlansInquiry } from '../../libs/types/mealplan/mealplan.input';
import { BookingsInquiry } from '../../libs/types/booking/booking.input';
import { Workout } from '../../libs/types/workout/workout';
import { MealPlan } from '../../libs/types/mealplan/mealplan';
import { Booking } from '../../libs/types/booking/booking';
import { Direction } from '../../libs/enums/common.enum';
import Link from 'next/link';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EventIcon from '@mui/icons-material/Event';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MyMenu from '../../libs/components/mypage/MyMenu';
import WriteArticle from '../../libs/components/mypage/WriteArticle';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsightsIcon from '@mui/icons-material/Insights';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArticleIcon from '@mui/icons-material/Article';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MirrorIcon from '@mui/icons-material/Visibility';
import Moment from 'react-moment';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyPage: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const [category, setCategory] = useState<string>('dashboard');
	const [mounted, setMounted] = useState(false);

	// Handle category from query params (client-side only to avoid hydration mismatch)
	useEffect(() => {
		setMounted(true);
		if (router.query?.category) {
			setCategory(router.query.category as string);
		} else {
			// Default to dashboard if no category specified
			setCategory('dashboard');
		}
	}, [router.query?.category]);

	/** APOLLO REQUESTS **/

	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	// Fetch user's workout routines
	const userWorkoutsQuery: WorkoutsInquiry = useMemo(
		() => ({
			page: 1,
			limit: 6,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {
				createdBy: user?._id,
			},
		}),
		[user?._id],
	);

	const { data: workoutsData, loading: workoutsLoading } = useQuery(GET_WORKOUTS, {
		variables: { input: userWorkoutsQuery },
		fetchPolicy: 'cache-and-network',
		skip: !user?._id,
	});

	// Fetch user's meal plan routines
	const userMealPlansQuery: MealPlansInquiry = useMemo(
		() => ({
			page: 1,
			limit: 100, // Get more to filter client-side
			sort: 'createdAt',
			direction: Direction.DESC,
		}),
		[],
	);

	const { data: mealPlansData, loading: mealPlansLoading } = useQuery(GET_MEAL_PLANS, {
		variables: { input: userMealPlansQuery },
		fetchPolicy: 'cache-and-network',
		skip: !user?._id,
	});

	// Fetch user's bookings
	const userBookingsQuery: BookingsInquiry = useMemo(
		() => ({
			page: 1,
			limit: 6,
			sort: 'createdAt',
			direction: Direction.DESC,
			clientId: user?._id,
		}),
		[user?._id],
	);

	const { data: bookingsData, loading: bookingsLoading } = useQuery(GET_BOOKINGS, {
		variables: { input: userBookingsQuery },
		fetchPolicy: 'cache-and-network',
		skip: !user?._id,
	});

	const userWorkouts = useMemo(() => {
		const allWorkouts = (workoutsData?.getWorkouts?.list || []) as Workout[];
		return allWorkouts.filter((workout) => workout.createdBy === user?._id);
	}, [workoutsData, user?._id]);

	const userMealPlans = useMemo(() => {
		const allMealPlans = (mealPlansData?.getMealPlans?.list || []) as MealPlan[];
		return allMealPlans.filter((mealPlan) => mealPlan.createdBy === user?._id);
	}, [mealPlansData, user?._id]);

	const userBookings = (bookingsData?.getBookings?.list || []) as Booking[];
	
	/** LIFECYCLES **/
	useEffect(() => {
		if (!user._id) router.push('/').then();
	}, [user]);

	/** HANDLERS **/
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			console.log('id: ', id);
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await subscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Subscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await unsubscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Unsubscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};
	const likeMemberHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetMember({ variables: { memberId: id } });

			await sweetTopSmallSuccessAlert('Success!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	// Activity Timeline data - use useMemo to ensure consistent dates between server and client
	const activityTimeline = useMemo(() => {
		if (!mounted) {
			// Return static dates during SSR to avoid hydration mismatch
			const baseTime = new Date('2024-01-01T00:00:00Z').getTime();
			return [
				{
					type: 'challenge',
					title: 'Completed Day 7 of 30-Day Fitness Challenge',
					time: new Date(baseTime - 2 * 60 * 60 * 1000),
					icon: CheckCircleIcon,
					color: '#4CAF50',
				},
				{
					type: 'post',
					title: 'Posted in Community Feed',
					time: new Date(baseTime - 5 * 60 * 60 * 1000),
					icon: ArticleIcon,
					color: '#2196F3',
				},
				{
					type: 'like',
					title: 'Liked 5 posts',
					time: new Date(baseTime - 24 * 60 * 60 * 1000),
					icon: ThumbUpIcon,
					color: '#E10600',
				},
			];
		}
		// Use real dates on client-side
		return [
			{
				type: 'challenge',
				title: 'Completed Day 7 of 30-Day Fitness Challenge',
				time: new Date(Date.now() - 2 * 60 * 60 * 1000),
				icon: CheckCircleIcon,
				color: '#4CAF50',
			},
			{
				type: 'post',
				title: 'Posted in Community Feed',
				time: new Date(Date.now() - 5 * 60 * 60 * 1000),
				icon: ArticleIcon,
				color: '#2196F3',
			},
			{
				type: 'like',
				title: 'Liked 5 posts',
				time: new Date(Date.now() - 24 * 60 * 60 * 1000),
				icon: ThumbUpIcon,
				color: '#E10600',
			},
		];
	}, [mounted]);

	if (device === 'mobile') {
		return <div>MY PAGE</div>;
	} else {

		// Consistency Mirror insights
		const consistencyInsights = [
			{
				icon: CalendarTodayIcon,
				text: 'You train most consistently on Mondays',
				change: null,
			},
			{
				icon: TrendingUpIcon,
				text: 'You are',
				change: '+23%',
				changeText: 'more active than last week',
			},
			{
				icon: AnalyticsIcon,
				text: 'You engage more when challenges are active',
				change: null,
			},
		];

		// Personal Insights calculations
		const getPersonalInsights = () => {
			const insights = [];
			const articles = user?.memberArticles || 0;
			const followers = (user as any)?.memberFollowers || 0;
			const workouts = (user as any)?.memberWorkouts || 0;
			const points = user?.memberPoints || 0;

			if (articles > 0) {
				insights.push({
					type: 'strength',
					title: 'Content Creator',
					description: `You've published ${articles} article${articles > 1 ? 's' : ''}. Keep sharing your knowledge!`,
					icon: ArticleIcon,
				});
			}

			if (followers > 10) {
				insights.push({
					type: 'influence',
					title: 'Community Leader',
					description: `${followers} people follow you. You're inspiring others on their fitness journey.`,
					icon: PeopleIcon,
				});
			}

			if (workouts > 0) {
				insights.push({
					type: 'consistency',
					title: 'Active Member',
					description: `You've completed ${workouts} workout${workouts > 1 ? 's' : ''}. Consistency is key!`,
					icon: FitnessCenterIcon,
				});
			}

			if (points > 100) {
				insights.push({
					type: 'achievement',
					title: 'Point Collector',
					description: `You've earned ${points} points. Great progress!`,
					icon: EmojiEventsIcon,
				});
			}

			if (insights.length === 0) {
				insights.push({
					type: 'motivation',
					title: 'Getting Started',
					description: 'Start your fitness journey! Complete workouts, share posts, and engage with the community.',
					icon: TrendingUpIcon,
				});
			}

			return insights;
		};

		// Personal Fitness Hub Dashboard (default view)
		const renderPersonalFitnessHub = () => (
			<Stack spacing={3}>
				{/* 1) Profile Overview Card */}
				<Card
					elevation={0}
					sx={{
						backgroundColor: '#FFFFFF',
						borderRadius: '16px',
						border: '1px solid #E5E5E5',
						padding: '32px',
						background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
					}}
				>
					<Stack direction="row" spacing={3} alignItems="flex-start">
						<Avatar
							sx={{
								width: 120,
								height: 120,
								bgcolor: '#E10600',
								fontSize: '42px',
								fontWeight: 700,
								border: '4px solid #FFFFFF',
								boxShadow: '0 4px 16px rgba(225, 6, 0, 0.2)',
							}}
							src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : undefined}
						>
							{!user?.memberImage && (user?.memberNick?.charAt(0)?.toUpperCase() || 'U')}
						</Avatar>
						<Stack spacing={2} sx={{ flex: 1 }}>
							<Stack spacing={1}>
								<Stack direction="row" alignItems="center" spacing={2}>
									<Typography
										variant="h4"
										sx={{
											fontSize: '32px',
											fontWeight: 700,
											color: '#111111',
											lineHeight: 1.2,
										}}
									>
										{user?.memberNick || 'User'}
									</Typography>
									{user?.memberType && (
										<Chip
											label={user.memberType}
											size="small"
											sx={{
												backgroundColor: user.memberType === 'ADMIN' ? '#E10600' : '#6B6B6B',
												color: '#FFFFFF',
												fontSize: '12px',
												fontWeight: 600,
												height: '26px',
												paddingX: 1,
											}}
										/>
									)}
								</Stack>
								<Typography
									sx={{
										fontSize: '16px',
										color: '#6B6B6B',
										fontStyle: 'italic',
										fontWeight: 500,
										lineHeight: 1.5,
									}}
								>
									"Consistency beats motivation"
								</Typography>
							</Stack>
							<Stack direction="row" spacing={2}>
								<Button
									variant="outlined"
									startIcon={<EditIcon />}
									onClick={() => router.push('/mypage?category=myProfile')}
									sx={{
										borderColor: '#E5E5E5',
										color: '#111111',
										borderRadius: '10px',
										padding: '10px 20px',
										fontSize: '14px',
										fontWeight: 600,
										textTransform: 'none',
										'&:hover': {
											borderColor: '#E10600',
											backgroundColor: 'rgba(225, 6, 0, 0.08)',
											color: '#E10600',
										},
									}}
								>
									Edit Profile
								</Button>
								<Button
									variant="contained"
									startIcon={<VisibilityIcon />}
									onClick={() => router.push(`/member?memberId=${user?._id}`)}
									sx={{
										backgroundColor: '#E10600',
										color: '#FFFFFF',
										borderRadius: '10px',
										padding: '10px 20px',
										fontSize: '14px',
										fontWeight: 600,
										textTransform: 'none',
										boxShadow: '0 2px 8px rgba(225, 6, 0, 0.2)',
										'&:hover': {
											backgroundColor: '#C10500',
											boxShadow: '0 4px 12px rgba(225, 6, 0, 0.3)',
										},
									}}
								>
									View Public Profile
								</Button>
							</Stack>
						</Stack>
					</Stack>
				</Card>

				{/* 2) Stats Grid - Make User Feel PROUD */}
				<Grid container spacing={3}>
					{/* Workouts Completed - Key Metric (Red) */}
					<Grid item xs={12} sm={6} md={3}>
						<Card
							elevation={0}
							sx={{
								backgroundColor: '#FFFFFF',
								borderRadius: '16px',
								border: '1px solid #E5E5E5',
								padding: '28px 24px',
								textAlign: 'center',
								transition: 'all 0.3s ease',
								position: 'relative',
								overflow: 'hidden',
								'&:hover': {
									transform: 'translateY(-4px)',
									boxShadow: '0 8px 24px rgba(225, 6, 0, 0.15)',
									borderColor: '#E10600',
								},
							}}
						>
							<FitnessCenterIcon
								sx={{
									fontSize: '28px',
									color: '#6B6B6B',
									mb: 1.5,
									opacity: 0.7,
								}}
							/>
							<Typography
								sx={{
									fontSize: '48px',
									fontWeight: 700,
									color: '#E10600',
									lineHeight: 1,
									mb: 0.5,
									letterSpacing: '-1px',
								}}
							>
								128
							</Typography>
							<Typography
								sx={{
									fontSize: '14px',
									color: '#6B6B6B',
									fontWeight: 600,
									textTransform: 'uppercase',
									letterSpacing: '0.5px',
								}}
							>
								Workouts Completed
							</Typography>
						</Card>
					</Grid>

					{/* Active Streak - Key Metric (Red) */}
					<Grid item xs={12} sm={6} md={3}>
						<Card
							elevation={0}
							sx={{
								backgroundColor: '#FFFFFF',
								borderRadius: '16px',
								border: '1px solid #E5E5E5',
								padding: '28px 24px',
								textAlign: 'center',
								transition: 'all 0.3s ease',
								position: 'relative',
								overflow: 'hidden',
								'&:hover': {
									transform: 'translateY(-4px)',
									boxShadow: '0 8px 24px rgba(225, 6, 0, 0.15)',
									borderColor: '#E10600',
								},
							}}
						>
							<WhatshotIcon
								sx={{
									fontSize: '28px',
									color: '#6B6B6B',
									mb: 1.5,
									opacity: 0.7,
								}}
							/>
							<Typography
								sx={{
									fontSize: '48px',
									fontWeight: 700,
									color: '#E10600',
									lineHeight: 1,
									mb: 0.5,
									letterSpacing: '-1px',
								}}
							>
								12
							</Typography>
							<Typography
								sx={{
									fontSize: '14px',
									color: '#6B6B6B',
									fontWeight: 600,
									textTransform: 'uppercase',
									letterSpacing: '0.5px',
								}}
							>
								Active Streak (days)
							</Typography>
						</Card>
					</Grid>

					{/* Challenges Joined - Neutral */}
					<Grid item xs={12} sm={6} md={3}>
						<Card
							elevation={0}
							sx={{
								backgroundColor: '#FFFFFF',
								borderRadius: '16px',
								border: '1px solid #E5E5E5',
								padding: '28px 24px',
								textAlign: 'center',
								transition: 'all 0.3s ease',
								'&:hover': {
									transform: 'translateY(-4px)',
									boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
								},
							}}
						>
							<EmojiEventsIcon
								sx={{
									fontSize: '28px',
									color: '#6B6B6B',
									mb: 1.5,
									opacity: 0.7,
								}}
							/>
							<Typography
								sx={{
									fontSize: '48px',
									fontWeight: 700,
									color: '#111111',
									lineHeight: 1,
									mb: 0.5,
									letterSpacing: '-1px',
								}}
							>
								6
							</Typography>
							<Typography
								sx={{
									fontSize: '14px',
									color: '#6B6B6B',
									fontWeight: 600,
									textTransform: 'uppercase',
									letterSpacing: '0.5px',
								}}
							>
								Challenges Joined
							</Typography>
						</Card>
					</Grid>

					{/* Community Posts - Neutral */}
					<Grid item xs={12} sm={6} md={3}>
						<Card
							elevation={0}
							sx={{
								backgroundColor: '#FFFFFF',
								borderRadius: '16px',
								border: '1px solid #E5E5E5',
								padding: '28px 24px',
								textAlign: 'center',
								transition: 'all 0.3s ease',
								'&:hover': {
									transform: 'translateY(-4px)',
									boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
								},
							}}
						>
							<ArticleIcon
								sx={{
									fontSize: '28px',
									color: '#6B6B6B',
									mb: 1.5,
									opacity: 0.7,
								}}
							/>
							<Typography
								sx={{
									fontSize: '48px',
									fontWeight: 700,
									color: '#111111',
									lineHeight: 1,
									mb: 0.5,
									letterSpacing: '-1px',
								}}
							>
								14
							</Typography>
							<Typography
								sx={{
									fontSize: '14px',
									color: '#6B6B6B',
									fontWeight: 600,
									textTransform: 'uppercase',
									letterSpacing: '0.5px',
								}}
							>
								Community Posts
							</Typography>
						</Card>
					</Grid>
				</Grid>

				{/* My Routines & Bookings Section */}
				<Grid container spacing={3} sx={{ mb: 3 }}>
					{/* My Workout Routines */}
					<Grid item xs={12} md={4}>
						<Card
							elevation={0}
							sx={{
								backgroundColor: '#FFFFFF',
								borderRadius: '16px',
								border: '1px solid #E5E5E5',
								padding: '24px',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
								<Stack direction="row" alignItems="center" spacing={1.5}>
									<FitnessCenterIcon sx={{ fontSize: '24px', color: '#E10600' }} />
									<Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111111' }}>
										My Workout Routines
									</Typography>
								</Stack>
								{userWorkouts.length > 0 && (
									<Button
										component={Link}
										href="/workouts"
										size="small"
										endIcon={<ArrowForwardIcon />}
										sx={{
											textTransform: 'none',
											color: '#E10600',
											fontWeight: 600,
											'&:hover': { backgroundColor: 'rgba(225, 6, 0, 0.08)' },
										}}
									>
										View All
									</Button>
								)}
							</Stack>
							<Divider sx={{ borderColor: '#E5E5E5', mb: 2 }} />
							{workoutsLoading ? (
								<Box sx={{ textAlign: 'center', py: 4 }}>
									<Typography sx={{ color: '#6B6B6B' }}>Loading...</Typography>
								</Box>
							) : userWorkouts.length === 0 ? (
								<Box sx={{ textAlign: 'center', py: 4, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
									<FitnessCenterIcon sx={{ fontSize: '48px', color: '#E5E5E5', mb: 2 }} />
									<Typography sx={{ color: '#6B6B6B', mb: 2 }}>No workout routines yet</Typography>
									<Button
										component={Link}
										href="/trainer"
										variant="outlined"
										size="small"
										sx={{
											borderColor: '#E10600',
											color: '#E10600',
											textTransform: 'none',
											'&:hover': { borderColor: '#C10500', backgroundColor: 'rgba(225, 6, 0, 0.08)' },
										}}
									>
										Connect with Trainer
									</Button>
								</Box>
							) : (
								<Stack spacing={2} sx={{ flex: 1 }}>
									{userWorkouts.slice(0, 3).map((workout) => (
										<Card
											key={workout._id}
											elevation={0}
											sx={{
												border: '1px solid #E5E5E5',
												borderRadius: '12px',
												padding: '16px',
												transition: 'all 0.2s',
												'&:hover': {
													borderColor: '#E10600',
													boxShadow: '0 4px 12px rgba(225, 6, 0, 0.1)',
												},
											}}
										>
											<Button
												component={Link}
												href={`/workouts/${workout._id}`}
												fullWidth
												sx={{
													textAlign: 'left',
													textTransform: 'none',
													padding: 0,
													justifyContent: 'flex-start',
													color: '#111111',
													'&:hover': { backgroundColor: 'transparent' },
												}}
											>
												<Stack spacing={1} sx={{ width: '100%' }}>
													<Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#111111' }}>
														{workout.workoutTitle}
													</Typography>
													<Stack direction="row" spacing={1} flexWrap="wrap">
														<Chip
															label={workout.workoutCategory.replace(/_/g, ' ')}
															size="small"
															sx={{
																height: '20px',
																fontSize: '11px',
																backgroundColor: '#F5F5F5',
																color: '#616161',
															}}
														/>
														<Chip
															label={workout.workoutDifficulty}
															size="small"
															sx={{
																height: '20px',
																fontSize: '11px',
																backgroundColor: '#F5F5F5',
																color: '#616161',
															}}
														/>
													</Stack>
												</Stack>
											</Button>
										</Card>
									))}
								</Stack>
							)}
						</Card>
					</Grid>

					{/* My Meal Plan Routines */}
					<Grid item xs={12} md={4}>
						<Card
							elevation={0}
							sx={{
								backgroundColor: '#FFFFFF',
								borderRadius: '16px',
								border: '1px solid #E5E5E5',
								padding: '24px',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
								<Stack direction="row" alignItems="center" spacing={1.5}>
									<RestaurantIcon sx={{ fontSize: '24px', color: '#E10600' }} />
									<Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111111' }}>
										My Meal Plan Routines
									</Typography>
								</Stack>
								{userMealPlans.length > 0 && (
									<Button
										component={Link}
										href="/nutrition/meal-plans"
										size="small"
										endIcon={<ArrowForwardIcon />}
										sx={{
											textTransform: 'none',
											color: '#E10600',
											fontWeight: 600,
											'&:hover': { backgroundColor: 'rgba(225, 6, 0, 0.08)' },
										}}
									>
										View All
									</Button>
								)}
							</Stack>
							<Divider sx={{ borderColor: '#E5E5E5', mb: 2 }} />
							{mealPlansLoading ? (
								<Box sx={{ textAlign: 'center', py: 4 }}>
									<Typography sx={{ color: '#6B6B6B' }}>Loading...</Typography>
								</Box>
							) : userMealPlans.length === 0 ? (
								<Box sx={{ textAlign: 'center', py: 4, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
									<RestaurantIcon sx={{ fontSize: '48px', color: '#E5E5E5', mb: 2 }} />
									<Typography sx={{ color: '#6B6B6B', mb: 2 }}>No meal plan routines yet</Typography>
									<Button
										component={Link}
										href="/trainer"
										variant="outlined"
										size="small"
										sx={{
											borderColor: '#E10600',
											color: '#E10600',
											textTransform: 'none',
											'&:hover': { borderColor: '#C10500', backgroundColor: 'rgba(225, 6, 0, 0.08)' },
										}}
									>
										Connect with Trainer
									</Button>
								</Box>
							) : (
								<Stack spacing={2} sx={{ flex: 1 }}>
									{userMealPlans.slice(0, 3).map((mealPlan) => (
										<Card
											key={mealPlan._id}
											elevation={0}
											sx={{
												border: '1px solid #E5E5E5',
												borderRadius: '12px',
												padding: '16px',
												transition: 'all 0.2s',
												'&:hover': {
													borderColor: '#E10600',
													boxShadow: '0 4px 12px rgba(225, 6, 0, 0.1)',
												},
											}}
										>
											<Button
												component={Link}
												href={`/nutrition/meal-plans/${mealPlan._id}`}
												fullWidth
												sx={{
													textAlign: 'left',
													textTransform: 'none',
													padding: 0,
													justifyContent: 'flex-start',
													color: '#111111',
													'&:hover': { backgroundColor: 'transparent' },
												}}
											>
												<Stack spacing={1} sx={{ width: '100%' }}>
													<Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#111111' }}>
														{mealPlan.mealPlanTitle}
													</Typography>
													<Stack direction="row" spacing={1} flexWrap="wrap">
														<Chip
															label={mealPlan.nutritionGoal.replace(/_/g, ' ')}
															size="small"
															sx={{
																height: '20px',
																fontSize: '11px',
																backgroundColor: '#F5F5F5',
																color: '#616161',
															}}
														/>
														<Chip
															label={`${mealPlan.calorieTarget} cal`}
															size="small"
															sx={{
																height: '20px',
																fontSize: '11px',
																backgroundColor: '#F5F5F5',
																color: '#616161',
															}}
														/>
													</Stack>
												</Stack>
											</Button>
										</Card>
									))}
								</Stack>
							)}
						</Card>
					</Grid>

					{/* My Bookings */}
					<Grid item xs={12} md={4}>
						<Card
							elevation={0}
							sx={{
								backgroundColor: '#FFFFFF',
								borderRadius: '16px',
								border: '1px solid #E5E5E5',
								padding: '24px',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
								<Stack direction="row" alignItems="center" spacing={1.5}>
									<EventIcon sx={{ fontSize: '24px', color: '#E10600' }} />
									<Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111111' }}>
										My Bookings
									</Typography>
								</Stack>
								{userBookings.length > 0 && (
									<Button
										component={Link}
										href="/bookings"
										size="small"
										endIcon={<ArrowForwardIcon />}
										sx={{
											textTransform: 'none',
											color: '#E10600',
											fontWeight: 600,
											'&:hover': { backgroundColor: 'rgba(225, 6, 0, 0.08)' },
										}}
									>
										View All
									</Button>
								)}
							</Stack>
							<Divider sx={{ borderColor: '#E5E5E5', mb: 2 }} />
							{bookingsLoading ? (
								<Box sx={{ textAlign: 'center', py: 4 }}>
									<Typography sx={{ color: '#6B6B6B' }}>Loading...</Typography>
								</Box>
							) : userBookings.length === 0 ? (
								<Box sx={{ textAlign: 'center', py: 4, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
									<EventIcon sx={{ fontSize: '48px', color: '#E5E5E5', mb: 2 }} />
									<Typography sx={{ color: '#6B6B6B', mb: 2 }}>No bookings yet</Typography>
									<Button
										component={Link}
										href="/trainer"
										variant="outlined"
										size="small"
										sx={{
											borderColor: '#E10600',
											color: '#E10600',
											textTransform: 'none',
											'&:hover': { borderColor: '#C10500', backgroundColor: 'rgba(225, 6, 0, 0.08)' },
										}}
									>
										Book a Session
									</Button>
								</Box>
							) : (
								<Stack spacing={2} sx={{ flex: 1 }}>
									{userBookings.slice(0, 3).map((booking) => (
										<Card
											key={booking._id}
											elevation={0}
											sx={{
												border: '1px solid #E5E5E5',
												borderRadius: '12px',
												padding: '16px',
												transition: 'all 0.2s',
												'&:hover': {
													borderColor: '#E10600',
													boxShadow: '0 4px 12px rgba(225, 6, 0, 0.1)',
												},
											}}
										>
											<Stack spacing={1}>
												<Stack direction="row" alignItems="center" justifyContent="space-between">
													<Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#111111' }}>
														{booking.bookingType.replace(/_/g, ' ')}
													</Typography>
													<Chip
														label={booking.bookingStatus}
														size="small"
														sx={{
															height: '20px',
															fontSize: '11px',
															backgroundColor:
																booking.bookingStatus === 'CONFIRMED'
																	? '#E8F5E9'
																	: booking.bookingStatus === 'PENDING'
																	? '#FFF3E0'
																	: '#FFEBEE',
															color:
																booking.bookingStatus === 'CONFIRMED'
																	? '#2E7D32'
																	: booking.bookingStatus === 'PENDING'
																	? '#E65100'
																	: '#C62828',
														}}
													/>
												</Stack>
												{booking.memberData && (
													<Typography sx={{ fontSize: '13px', color: '#6B6B6B' }}>
														Trainer: {booking.memberData.memberFullName || booking.memberData.memberNick}
													</Typography>
												)}
												<Stack direction="row" spacing={1} alignItems="center">
													<CalendarTodayIcon sx={{ fontSize: '14px', color: '#6B6B6B' }} />
													<Typography sx={{ fontSize: '12px', color: '#6B6B6B' }}>
														{new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}
													</Typography>
												</Stack>
											</Stack>
										</Card>
									))}
								</Stack>
							)}
						</Card>
					</Grid>
				</Grid>

				{/* 3) Activity Timeline - Vertical Timeline Style */}
				<Card
					elevation={0}
					sx={{
						backgroundColor: '#FFFFFF',
						borderRadius: '16px',
						border: '1px solid #E5E5E5',
						padding: '24px',
					}}
				>
					<Stack spacing={2}>
						<Stack direction="row" alignItems="center" spacing={1}>
							<TimelineIcon sx={{ fontSize: '24px', color: '#E10600' }} />
							<Typography
								sx={{
									fontSize: '18px',
									fontWeight: 700,
									color: '#111111',
								}}
							>
								Activity Timeline
							</Typography>
						</Stack>
						<Divider sx={{ borderColor: '#E5E5E5' }} />
						<Stack spacing={0} sx={{ position: 'relative', pl: 3 }}>
							{/* Vertical line */}
							<Box
								sx={{
									position: 'absolute',
									left: '19px',
									top: '20px',
									bottom: '20px',
									width: '2px',
									backgroundColor: '#E5E5E5',
								}}
							/>
							{activityTimeline.map((activity, index) => {
								const IconComponent = activity.icon;
								const isLast = index === activityTimeline.length - 1;
								return (
									<Stack
										key={index}
										direction="row"
										spacing={2}
										sx={{
											position: 'relative',
											paddingBottom: isLast ? 0 : 3,
										}}
									>
										{/* Timeline dot */}
										<Box
											sx={{
												position: 'absolute',
												left: '-35px',
												top: '4px',
												width: '40px',
												height: '40px',
												borderRadius: '50%',
												backgroundColor: '#FFFFFF',
												border: '3px solid',
												borderColor: activity.color,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												zIndex: 1,
											}}
										>
											<IconComponent sx={{ fontSize: '18px', color: activity.color }} />
										</Box>
										<Stack spacing={0.5} sx={{ flex: 1, pt: 0.5 }}>
											<Typography
												sx={{
													fontSize: '15px',
													fontWeight: 600,
													color: '#111111',
													lineHeight: 1.4,
												}}
											>
												{activity.title}
											</Typography>
											<Stack direction="row" alignItems="center" spacing={0.5}>
												<AccessTimeIcon sx={{ fontSize: '13px', color: '#6B6B6B' }} />
												<Typography sx={{ fontSize: '13px', color: '#6B6B6B' }}>
													<Moment fromNow>{activity.time}</Moment>
												</Typography>
											</Stack>
										</Stack>
									</Stack>
								);
							})}
						</Stack>
					</Stack>
				</Card>

				{/* 4) Personal Consistency Mirror - UNUSUAL FEATURE */}
				<Card
					elevation={0}
					sx={{
						backgroundColor: '#FFFFFF',
						borderRadius: '16px',
						border: '1px solid #E5E5E5',
						padding: '32px',
						background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
					}}
				>
					<Stack spacing={3}>
						<Stack spacing={1}>
							<Stack direction="row" alignItems="center" spacing={1.5}>
								<MirrorIcon sx={{ fontSize: '28px', color: '#6B6B6B' }} />
								<Typography
									sx={{
										fontSize: '20px',
										fontWeight: 700,
										color: '#111111',
										letterSpacing: '-0.3px',
									}}
								>
									Your Consistency Mirror
								</Typography>
							</Stack>
							<Typography
								sx={{
									fontSize: '14px',
									color: '#6B6B6B',
									fontWeight: 400,
									lineHeight: 1.5,
								}}
							>
								Reflecting your fitness patterns and behaviors
							</Typography>
						</Stack>
						<Divider sx={{ borderColor: '#E5E5E5' }} />
						<Stack spacing={3}>
							{consistencyInsights.map((insight, index) => {
								const IconComponent = insight.icon;
								return (
									<Stack
										key={index}
										direction="row"
										spacing={2}
										alignItems="flex-start"
										sx={{
											padding: '16px',
											borderRadius: '12px',
											backgroundColor: '#FFFFFF',
											border: '1px solid #F0F0F0',
											transition: 'all 0.2s ease',
											'&:hover': {
												borderColor: '#E5E5E5',
												boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
											},
										}}
									>
										<Box
											sx={{
												width: 40,
												height: 40,
												borderRadius: '10px',
												backgroundColor: '#F7F7F7',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												flexShrink: 0,
											}}
										>
											<IconComponent sx={{ fontSize: '20px', color: '#6B6B6B' }} />
										</Box>
										<Stack spacing={0.5} sx={{ flex: 1, pt: 0.5 }}>
											<Typography
												sx={{
													fontSize: '15px',
													color: '#111111',
													lineHeight: 1.6,
													fontWeight: 400,
												}}
											>
												{insight.text}
												{insight.change && (
													<>
														{' '}
														<span
															style={{
																fontWeight: 700,
																color: '#E10600',
															}}
														>
															{insight.change}
														</span>
													</>
												)}
												{insight.changeText && ` ${insight.changeText}`}
											</Typography>
										</Stack>
									</Stack>
								);
							})}
						</Stack>
					</Stack>
				</Card>
			</Stack>
		);

		return (
			<Box
				id="my-page"
				sx={{
					backgroundColor: '#F7F7F7',
					minHeight: '100vh',
					paddingTop: '100px',
					paddingBottom: '60px',
				}}
			>
				<div className="container">
					<Stack direction="row" spacing={3} className={'my-page'}>
						{/* Left Sidebar */}
						<Card
							className={'left-config'}
							elevation={0}
							sx={{
								width: '280px',
								height: 'fit-content',
								backgroundColor: '#FFFFFF',
								borderRadius: '16px',
								border: '1px solid #E5E5E5',
								position: 'sticky',
								top: '120px',
							}}
						>
							<MyMenu />
						</Card>

						{/* Main Content */}
						<Stack className="main-config" sx={{ flex: 1, minWidth: 0 }} spacing={3}>
							{category === 'dashboard' ? (
								renderPersonalFitnessHub()
							) : (
								<Stack className={'list-config'}>
									{category === 'myProfile' && <MyProfile />}
									{category === 'myArticles' && <MyArticles />}
									{category === 'writeArticle' && <WriteArticle />}
									{category === 'followers' && (
										<MemberFollowers
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
									{category === 'followings' && (
										<MemberFollowings
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
								</Stack>
							)}
						</Stack>
					</Stack>
				</div>
			</Box>
		);
	}
};

export default withLayoutBasic(MyPage);

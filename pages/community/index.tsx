import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
	Stack,
	Tab,
	Typography,
	Button,
	Pagination,
	Grid,
	Card,
	CardContent,
	CardMedia,
	Chip,
	Box,
	Avatar,
	IconButton,
	Divider,
	LinearProgress,
} from '@mui/material';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Message } from '../../libs/enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Messages } from '../../libs/config';
import { Challenge } from '../../libs/types/challenge/challenge';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FeedIcon from '@mui/icons-material/DynamicFeed';
import ProgressIcon from '@mui/icons-material/TrendingUp';
import TipsIcon from '@mui/icons-material/Lightbulb';
import MotivationIcon from '@mui/icons-material/EmojiEvents';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import NewsIcon from '@mui/icons-material/Article';
import HumorIcon from '@mui/icons-material/SentimentVerySatisfied';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Link from 'next/link';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [showChallenges, setShowChallenges] = useState(true);
	const [challengeStatus, setChallengeStatus] = useState<{ [key: string]: 'not_joined' | 'joined' | 'completed' }>({
		'1': 'not_joined',
		'2': 'joined',
		'3': 'not_joined',
	});
	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	// Sample challenges data (in production, this would come from API)
	const [communityChallenges] = useState<Partial<Challenge>[]>([
		{
			_id: '1',
			challengeTitle: '30-Day Fitness Challenge',
			challengeType: 'WORKOUT_STREAK' as any,
			challengeDifficulty: 'MEDIUM' as any,
			challengeDesc: 'Complete 30 consecutive days of workouts to build a strong fitness habit',
			challengeImage: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
			participantCount: 1250,
			completionCount: 342,
			rewardPoints: 500,
			startDate: new Date('2024-01-01'),
			endDate: new Date('2024-01-31'),
		},
		{
			_id: '2',
			challengeTitle: 'Summer Body Transformation',
			challengeType: 'WEIGHT_LOSS' as any,
			challengeDifficulty: 'HARD' as any,
			challengeDesc: 'Lose 5kg in 8 weeks through consistent training and nutrition',
			challengeImage: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
			participantCount: 890,
			completionCount: 156,
			rewardPoints: 750,
			startDate: new Date('2024-02-01'),
			endDate: new Date('2024-03-31'),
		},
		{
			_id: '3',
			challengeTitle: '10K Steps Daily',
			challengeType: 'DISTANCE' as any,
			challengeDifficulty: 'EASY' as any,
			challengeDesc: 'Walk 10,000 steps every day for 2 weeks to boost your daily activity',
			challengeImage: '/img/bodybuilders/pexels-leonmart-1552108.jpg',
			participantCount: 2100,
			completionCount: 892,
			rewardPoints: 300,
			startDate: new Date('2024-01-15'),
			endDate: new Date('2024-01-29'),
		},
	]);

	// Handler for challenge actions
	const handleChallengeAction = (challengeId: string, currentStatus: string) => {
		if (currentStatus === 'not_joined') {
			setChallengeStatus({ ...challengeStatus, [challengeId]: 'joined' });
			router.push(`/goals/challenges/${challengeId}`);
		} else if (currentStatus === 'joined') {
			router.push(`/goals/challenges/${challengeId}`);
		}
		// Completed status doesn't need action
	};

	// Get progress percentage (mocked)
	const getProgress = (challengeId: string, status: string) => {
		if (status === 'not_joined') return 0;
		if (status === 'completed') return 100;
		// Mock progress for joined challenges
		const progressMap: { [key: string]: number } = {
			'1': 45,
			'2': 68,
			'3': 92,
		};
		return progressMap[challengeId] || 50;
	};

	// Get difficulty color
	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty?.toUpperCase()) {
			case 'EASY':
				return '#4CAF50';
			case 'MEDIUM':
				return '#FF9800';
			case 'HARD':
				return '#E10600';
			default:
				return '#6B6B6B';
		}
	};

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: boardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory) {
			setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: 'FREE' as BoardArticleCategory } });
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: 'FREE' },
				},
				router.pathname,
				{ shallow: true },
			);
		}
	}, []);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		console.log(value);

		setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: value as BoardArticleCategory } });
		await router.push(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			router.pathname,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};
	const likeArticleHandler = async (e: any, user: T, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({
				variables: { input: id },
			});

			await boardArticlesRefetch({ input: searchCommunity });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Error, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	// Navigation items with icons
	const navItems = [
		{ value: 'FREE', label: 'Feed', icon: FeedIcon },
		{ value: 'SUCCESS_STORY', label: 'Progress', icon: ProgressIcon },
		{ value: 'WORKOUT_TIPS', label: 'Tips', icon: TipsIcon },
		{ value: 'NUTRITION', label: 'Nutrition', icon: RestaurantIcon },
		{ value: 'MOTIVATION', label: 'Motivation', icon: MotivationIcon },
		{ value: 'QUESTION', label: 'Q&A', icon: QuestionAnswerIcon },
		{ value: 'EQUIPMENT_REVIEW', label: 'Equipment', icon: FitnessCenterIcon },
		{ value: 'GYM_REVIEW', label: 'Gym Reviews', icon: LocationOnIcon },
		{ value: 'NEWS', label: 'News', icon: NewsIcon },
		{ value: 'HUMOR', label: 'Humor', icon: HumorIcon },
	];

	const getSectionTitle = () => {
		const category = searchCommunity.search?.articleCategory || 'FREE';
		const titles: { [key: string]: { title: string; subtitle: string } } = {
			FREE: { title: 'Community Feed', subtitle: 'Express your opinions freely here without content restrictions' },
			SUCCESS_STORY: { title: 'Progress Stories', subtitle: 'Share your transformation journey and inspire others' },
			WORKOUT_TIPS: { title: 'Workout Tips', subtitle: 'Share workout tips, techniques, and advice' },
			NUTRITION: { title: 'Nutrition', subtitle: 'Share diet tips, meal plans, and nutrition advice' },
			MOTIVATION: { title: 'Motivation', subtitle: 'Get motivated and stay inspired on your fitness journey' },
			QUESTION: { title: 'Questions & Answers', subtitle: 'Ask questions and get answers from the community' },
			EQUIPMENT_REVIEW: { title: 'Equipment Reviews', subtitle: 'Review and discuss gym equipment, gear, and accessories' },
			GYM_REVIEW: { title: 'Gym Reviews', subtitle: 'Share your experiences and reviews of gyms and fitness studios' },
			NEWS: { title: 'News', subtitle: 'Stay updated with the latest fitness news and trends' },
			HUMOR: { title: 'Humor', subtitle: 'Share funny moments and lighten up the community' },
		};
		return titles[category] || titles.FREE;
	};

	if (device === 'mobile') {
		return <h1>COMMUNITY PAGE MOBILE</h1>;
	} else {
		const sectionInfo = getSectionTitle();
		return (
			<Box
				id="community-list-page"
				sx={{
					backgroundColor: '#F7F7F7',
					minHeight: '100vh',
					paddingTop: '100px',
					paddingBottom: '60px',
				}}
			>
				<div className="container">
					{/* Community Header Section */}
					<Card
						elevation={0}
						sx={{
							backgroundColor: '#FFFFFF',
							borderRadius: '16px',
							border: '1px solid #E5E5E5',
							padding: { xs: '32px 24px', md: '48px 40px' },
							marginBottom: '32px',
							background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
							position: 'relative',
							overflow: 'hidden',
							'&::after': {
								content: '""',
								position: 'absolute',
								bottom: 0,
								left: 0,
								right: 0,
								height: '1px',
								background: 'linear-gradient(90deg, transparent 0%, #E5E5E5 20%, #E5E5E5 80%, transparent 100%)',
							},
						}}
					>
						<Stack
							direction={{ xs: 'column', md: 'row' }}
							justifyContent="space-between"
							alignItems={{ xs: 'flex-start', md: 'center' }}
							spacing={{ xs: 3, md: 4 }}
						>
							{/* Title and Subtitle */}
							<Stack spacing={1} sx={{ flex: 1 }}>
								<Typography
									variant="h1"
									sx={{
										fontSize: { xs: '32px', md: '40px' },
										fontWeight: 700,
										color: '#111111',
										lineHeight: 1.2,
										letterSpacing: '-0.5px',
									}}
								>
									Community
								</Typography>
								<Typography
									sx={{
										fontSize: { xs: '16px', md: '18px' },
										color: '#6B6B6B',
										lineHeight: 1.6,
										maxWidth: '600px',
									}}
								>
									Train together. Stay consistent. Push your limits.
								</Typography>
							</Stack>

							{/* Action Buttons */}
							<Stack
								direction={{ xs: 'column', md: 'row' }}
								spacing={2}
								sx={{
									width: { xs: '100%', md: 'auto' },
									'& > *': {
										width: { xs: '100%', md: 'auto' },
										minWidth: { xs: '100%', md: '160px' },
									},
								}}
							>
								<Button
									variant="contained"
									startIcon={<EditNoteIcon />}
									onClick={() =>
										router.push({
											pathname: '/mypage',
											query: { category: 'writeArticle' },
										})
									}
									sx={{
										backgroundColor: '#E10600',
										color: '#FFFFFF',
										borderRadius: '12px',
										padding: { xs: '12px 24px', md: '14px 28px' },
										fontSize: '15px',
										fontWeight: 600,
										textTransform: 'none',
										boxShadow: '0 2px 8px rgba(225, 6, 0, 0.2)',
										'&:hover': {
											backgroundColor: '#C10500',
											boxShadow: '0 4px 12px rgba(225, 6, 0, 0.3)',
											transform: 'translateY(-1px)',
										},
										transition: 'all 0.2s ease',
									}}
								>
									Write Post
								</Button>
								<Button
									variant="outlined"
									startIcon={<ProgressIcon />}
									onClick={() =>
										router.push({
											pathname: '/community',
											query: { articleCategory: 'SUCCESS_STORY' },
										})
									}
									sx={{
										borderColor: '#E5E5E5',
										color: '#111111',
										borderRadius: '12px',
										padding: { xs: '12px 24px', md: '14px 28px' },
										fontSize: '15px',
										fontWeight: 600,
										textTransform: 'none',
										'&:hover': {
											borderColor: '#E10600',
											backgroundColor: 'rgba(225, 6, 0, 0.08)',
											color: '#E10600',
										},
										transition: 'all 0.2s ease',
									}}
								>
									My Progress
								</Button>
								<Button
									variant="outlined"
									startIcon={<EmojiEventsIcon />}
									onClick={() => router.push('/goals/challenges')}
									sx={{
										borderColor: '#E5E5E5',
										color: '#111111',
										borderRadius: '12px',
										padding: { xs: '12px 24px', md: '14px 28px' },
										fontSize: '15px',
										fontWeight: 600,
										textTransform: 'none',
										'&:hover': {
											borderColor: '#E10600',
											backgroundColor: 'rgba(225, 6, 0, 0.08)',
											color: '#E10600',
										},
										transition: 'all 0.2s ease',
									}}
								>
									Explore Challenges
								</Button>
							</Stack>
						</Stack>
					</Card>

					<TabContext value={searchCommunity.search?.articleCategory || 'FREE'}>
						<Stack direction="row" spacing={3} className="main-box">
							{/* Left Sidebar Navigation */}
							<Card
								className="left-config"
								elevation={0}
								sx={{
									width: '280px',
									height: 'fit-content',
									backgroundColor: '#FFFFFF',
									borderRadius: '16px',
									border: '1px solid #E5E5E5',
									padding: '24px',
									position: 'sticky',
									top: '120px',
								}}
							>
								<Stack spacing={3}>
									{/* Community Header */}
									<Stack spacing={2}>
										<Stack direction="row" alignItems="center" spacing={2}>
											<Avatar
												sx={{
													width: 56,
													height: 56,
													bgcolor: '#E10600',
													fontSize: '20px',
													fontWeight: 700,
												}}
											>
												S
											</Avatar>
											<Stack>
												<Typography
													sx={{
														fontSize: '18px',
														fontWeight: 700,
														color: '#111111',
														lineHeight: 1.2,
													}}
												>
													Shark Community
												</Typography>
												<Typography
													sx={{
														fontSize: '13px',
														color: '#6B6B6B',
														lineHeight: 1.4,
													}}
												>
													Fitness Together
												</Typography>
											</Stack>
										</Stack>
									</Stack>

									<Divider sx={{ borderColor: '#E5E5E5' }} />

									{/* Navigation Tabs */}
									<TabList
										orientation="vertical"
										TabIndicatorProps={{ style: { display: 'none' } }}
										onChange={tabChangeHandler}
										sx={{
											'& .MuiTabs-root': {
												minHeight: 'auto',
											},
										}}
									>
										{navItems.map((item) => {
											const IconComponent = item.icon;
											const isActive = (searchCommunity.search?.articleCategory || 'FREE') === item.value;
											return (
												<Tab
													key={item.value}
													value={item.value}
													icon={
														<IconComponent
															sx={{
																fontSize: '20px',
																mr: 1.5,
																color: isActive ? '#E10600' : '#6B6B6B',
															}}
														/>
													}
													iconPosition="start"
													label={item.label}
													className={`tab-button ${isActive ? 'active' : ''}`}
													sx={{
														minHeight: '48px',
														textTransform: 'none',
														fontSize: '15px',
														fontWeight: isActive ? 600 : 500,
														color: isActive ? '#E10600' : '#6B6B6B',
														backgroundColor: isActive ? 'rgba(225, 6, 0, 0.08)' : 'transparent',
														borderRadius: '12px',
														mb: 0.5,
														justifyContent: 'flex-start',
														'&:hover': {
															backgroundColor: 'rgba(225, 6, 0, 0.08)',
														},
													}}
												/>
											);
										})}
									</TabList>
								</Stack>
							</Card>
							{/* Main Content Area */}
							<Stack className="right-config" sx={{ flex: 1, minWidth: 0 }}>
								<Stack className="panel-config" spacing={4}>
									{/* Section Header - Shows current category context */}
									<Box
										sx={{
											paddingBottom: '24px',
										}}
									>
										<Typography
											variant="h4"
											sx={{
												fontSize: '24px',
												fontWeight: 700,
												color: '#111111',
												lineHeight: 1.2,
												mb: 1,
											}}
										>
											{sectionInfo.title}
										</Typography>
										<Typography
											sx={{
												fontSize: '15px',
												color: '#6B6B6B',
												lineHeight: 1.6,
											}}
										>
											{sectionInfo.subtitle}
										</Typography>
									</Box>

									{/* Challenges Section - Show on Feed tab */}
									{(searchCommunity.search?.articleCategory || 'FREE') === 'FREE' && showChallenges && (
										<Box className={'challenges-section'}>
											<Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
												<Typography
													variant="h5"
													sx={{
														fontSize: '24px',
														fontWeight: 700,
														color: '#111111',
													}}
												>
													Community Challenges
												</Typography>
												<Button
													variant="text"
													endIcon={<ArrowForwardIcon />}
													onClick={() => router.push('/goals/challenges')}
													sx={{
														color: '#E10600',
														fontSize: '15px',
														fontWeight: 600,
														textTransform: 'none',
														'&:hover': {
															backgroundColor: 'rgba(225, 6, 0, 0.08)',
														},
													}}
												>
													View All
												</Button>
											</Stack>
											<Grid container spacing={3}>
												{communityChallenges.map((challenge) => {
													const status = challengeStatus[challenge._id || ''] || 'not_joined';
													const progress = getProgress(challenge._id || '', status);
													const difficultyColor = getDifficultyColor(challenge.challengeDifficulty || '');
													
													return (
														<Grid item xs={12} md={4} key={challenge._id}>
															<Card
																className={'challenge-card'}
																elevation={0}
																sx={{
																	backgroundColor: '#FFFFFF',
																	borderRadius: '16px',
																	border: '1px solid #E5E5E5',
																	overflow: 'hidden',
																	height: '100%',
																	display: 'flex',
																	flexDirection: 'column',
																	transition: 'all 0.3s ease',
																	cursor: 'pointer',
																	'&:hover': {
																		transform: 'translateY(-4px)',
																		boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
																		borderColor: '#E10600',
																	},
																}}
															>
																{/* Image with Dark Overlay */}
																<CardMedia
																	component="div"
																	sx={{
																		height: 220,
																		backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${challenge.challengeImage || '/img/bodybuilders/pexels-gabflicks-13122470.jpg'})`,
																		backgroundSize: 'cover',
																		backgroundPosition: 'center',
																		position: 'relative',
																	}}
																>
																	{/* Difficulty Badge - Top Left */}
																	<Chip
																		label={challenge.challengeDifficulty || 'MEDIUM'}
																		size="small"
																		sx={{
																			position: 'absolute',
																			top: 16,
																			left: 16,
																			backgroundColor: difficultyColor,
																			color: '#FFFFFF',
																			fontWeight: 700,
																			fontSize: '11px',
																			textTransform: 'uppercase',
																			letterSpacing: '0.5px',
																			height: '24px',
																			boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
																		}}
																	/>
																</CardMedia>

																{/* Content Section */}
																<CardContent
																	sx={{
																		flex: 1,
																		display: 'flex',
																		flexDirection: 'column',
																		padding: '24px',
																	}}
																>
																	{/* Title */}
																	<Typography
																		variant="h6"
																		sx={{
																			fontSize: '20px',
																			fontWeight: 700,
																			color: '#111111',
																			mb: 1.5,
																			lineHeight: 1.3,
																		}}
																	>
																		{challenge.challengeTitle}
																	</Typography>

																	{/* Description */}
																	<Typography
																		variant="body2"
																		sx={{
																			fontSize: '14px',
																			color: '#6B6B6B',
																			mb: 2.5,
																			lineHeight: 1.6,
																			flex: 1,
																		}}
																	>
																		{challenge.challengeDesc}
																	</Typography>

																	{/* Stats Row */}
																	<Stack direction="row" spacing={2} mb={2.5}>
																		<Stack direction="row" alignItems="center" spacing={0.5}>
																			<PeopleIcon sx={{ fontSize: '16px', color: '#6B6B6B' }} />
																			<Typography
																				sx={{
																					fontSize: '13px',
																					color: '#6B6B6B',
																					fontWeight: 600,
																				}}
																			>
																				{challenge.participantCount?.toLocaleString()} joined
																			</Typography>
																		</Stack>
																		<Stack direction="row" alignItems="center" spacing={0.5}>
																			<EmojiEventsIcon sx={{ fontSize: '16px', color: '#FFC107' }} />
																			<Typography
																				sx={{
																					fontSize: '13px',
																					color: '#6B6B6B',
																					fontWeight: 600,
																				}}
																			>
																				{challenge.rewardPoints} pts
																			</Typography>
																		</Stack>
																	</Stack>

																	{/* Progress Bar */}
																	<Box sx={{ mb: 2.5 }}>
																		<Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
																			<Typography
																				sx={{
																					fontSize: '12px',
																					color: '#6B6B6B',
																					fontWeight: 600,
																				}}
																			>
																				Progress
																			</Typography>
																			<Typography
																				sx={{
																					fontSize: '12px',
																					color: '#111111',
																					fontWeight: 700,
																				}}
																			>
																				{progress}%
																			</Typography>
																		</Stack>
																		<LinearProgress
																			variant="determinate"
																			value={progress}
																			sx={{
																				height: 8,
																				borderRadius: 4,
																				backgroundColor: '#E5E5E5',
																				'& .MuiLinearProgress-bar': {
																					borderRadius: 4,
																					backgroundColor: status === 'completed' ? '#4CAF50' : '#E10600',
																				},
																			}}
																		/>
																	</Box>

																	{/* CTA Button - Bottom Right */}
																	<Stack direction="row" justifyContent="flex-end">
																		<Button
																			variant={status === 'completed' ? 'outlined' : 'contained'}
																			size="medium"
																			onClick={(e: React.SyntheticEvent) => {
																				e.stopPropagation();
																				handleChallengeAction(challenge._id || '', status);
																			}}
																			sx={{
																				backgroundColor: status === 'completed' ? 'transparent' : '#E10600',
																				color: status === 'completed' ? '#4CAF50' : '#FFFFFF',
																				borderColor: status === 'completed' ? '#4CAF50' : 'transparent',
																				borderRadius: '10px',
																				fontSize: '14px',
																				fontWeight: 600,
																				textTransform: 'none',
																				padding: '10px 24px',
																				minWidth: '140px',
																				'&:hover': {
																					backgroundColor: status === 'completed' ? 'rgba(76, 175, 80, 0.08)' : '#C10500',
																					borderColor: status === 'completed' ? '#4CAF50' : 'transparent',
																				},
																			}}
																		>
																			{status === 'not_joined'
																				? 'Join Challenge'
																				: status === 'joined'
																				? 'Continue'
																				: 'Completed ✔'}
																		</Button>
																	</Stack>
																</CardContent>
															</Card>
														</Grid>
													);
												})}
											</Grid>
										</Box>
									)}

									{/* Community Feed Section */}
									<Box>
										<TabPanel value="FREE" sx={{ padding: 0 }}>
											<Stack spacing={3}>
												{/* Consistency Pulse Widget */}
												<Card
													elevation={0}
													sx={{
														backgroundColor: '#FAFAFA',
														borderRadius: '16px',
														border: '1px solid #E5E5E5',
														padding: '20px 24px',
													}}
												>
													<Stack direction="row" alignItems="center" spacing={1} mb={2}>
														<LocalFireDepartmentIcon sx={{ fontSize: '24px', color: '#E10600' }} />
														<Typography
															sx={{
																fontSize: '16px',
																fontWeight: 700,
																color: '#111111',
															}}
														>
															Community Pulse Today
														</Typography>
													</Stack>
													<Grid container spacing={3}>
														<Grid item xs={4}>
															<Stack spacing={0.5}>
																<Typography
																	sx={{
																		fontSize: '28px',
																		fontWeight: 700,
																		color: '#E10600',
																		lineHeight: 1,
																	}}
																>
																	142
																</Typography>
																<Typography
																	sx={{
																		fontSize: '13px',
																		color: '#6B6B6B',
																		fontWeight: 500,
																	}}
																>
																	workouts logged
																</Typography>
															</Stack>
														</Grid>
														<Grid item xs={4}>
															<Stack spacing={0.5}>
																<Typography
																	sx={{
																		fontSize: '28px',
																		fontWeight: 700,
																		color: '#E10600',
																		lineHeight: 1,
																	}}
																>
																	87
																</Typography>
																<Typography
																	sx={{
																		fontSize: '13px',
																		color: '#6B6B6B',
																		fontWeight: 500,
																	}}
																>
																	posts shared
																</Typography>
															</Stack>
														</Grid>
														<Grid item xs={4}>
															<Stack spacing={0.5}>
																<Typography
																	sx={{
																		fontSize: '28px',
																		fontWeight: 700,
																		color: '#E10600',
																		lineHeight: 1,
																	}}
																>
																	310
																</Typography>
																<Typography
																	sx={{
																		fontSize: '13px',
																		color: '#6B6B6B',
																		fontWeight: 500,
																	}}
																>
																	likes given
																</Typography>
															</Stack>
														</Grid>
													</Grid>
												</Card>

												{/* Feed Header */}
												<Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={3}>
													<Stack spacing={1} sx={{ flex: 1 }}>
														<Typography
															variant="h4"
															sx={{
																fontSize: '24px',
																fontWeight: 700,
																color: '#111111',
																lineHeight: 1.2,
															}}
														>
															Community Feed
														</Typography>
														<Typography
															sx={{
																fontSize: '15px',
																color: '#6B6B6B',
																lineHeight: 1.6,
															}}
														>
															Share progress, ask questions, motivate others
														</Typography>
													</Stack>
													<Button
														variant="contained"
														startIcon={<EditNoteIcon />}
														onClick={() =>
															router.push({
																pathname: '/mypage',
																query: { category: 'writeArticle' },
															})
														}
														sx={{
															backgroundColor: '#E10600',
															color: '#FFFFFF',
															borderRadius: '12px',
															padding: '12px 24px',
															fontSize: '15px',
															fontWeight: 600,
															textTransform: 'none',
															boxShadow: '0 2px 8px rgba(225, 6, 0, 0.2)',
															'&:hover': {
																backgroundColor: '#C10500',
																boxShadow: '0 4px 12px rgba(225, 6, 0, 0.3)',
															},
														}}
													>
														Write Post
													</Button>
												</Stack>

												{/* Feed Posts */}
												{totalCount && totalCount > 0 ? (
													<Stack className="list-box" spacing={2}>
														{boardArticles?.map((boardArticle: BoardArticle) => {
															return (
																<CommunityCard
																	boardArticle={boardArticle}
																	key={boardArticle?._id}
																	likeArticleHandler={likeArticleHandler}
																/>
															);
														})}
													</Stack>
												) : (
													<Card
														elevation={0}
														sx={{
															backgroundColor: '#FFFFFF',
															borderRadius: '16px',
															border: '1px solid #E5E5E5',
															padding: '60px 40px',
															textAlign: 'center',
														}}
													>
														<Stack spacing={3} alignItems="center">
															<Typography
																variant="h5"
																sx={{
																	fontSize: '24px',
																	fontWeight: 700,
																	color: '#111111',
																}}
															>
																Welcome to the Community! 🎉
															</Typography>
															<Typography
																sx={{
																	fontSize: '16px',
																	color: '#6B6B6B',
																	maxWidth: '500px',
																	lineHeight: 1.6,
																}}
															>
																Be the first to share your journey and inspire others. Your story matters!
															</Typography>
															<Stack spacing={2} sx={{ width: '100%', maxWidth: '400px', mt: 2 }}>
																<Box
																	sx={{
																		padding: '16px',
																		backgroundColor: '#FAFAFA',
																		borderRadius: '12px',
																		border: '1px solid #E5E5E5',
																	}}
																>
																	<Typography
																		sx={{
																			fontSize: '14px',
																			color: '#111111',
																			fontWeight: 600,
																			mb: 0.5,
																		}}
																	>
																		💪 Share Progress
																	</Typography>
																	<Typography
																		sx={{
																			fontSize: '13px',
																			color: '#6B6B6B',
																		}}
																	>
																		Document your fitness journey and milestones
																	</Typography>
																</Box>
																<Box
																	sx={{
																		padding: '16px',
																		backgroundColor: '#FAFAFA',
																		borderRadius: '12px',
																		border: '1px solid #E5E5E5',
																	}}
																>
																	<Typography
																		sx={{
																			fontSize: '14px',
																			color: '#111111',
																			fontWeight: 600,
																			mb: 0.5,
																		}}
																	>
																		❓ Ask a Question
																	</Typography>
																	<Typography
																		sx={{
																			fontSize: '13px',
																			color: '#6B6B6B',
																		}}
																	>
																		Get advice from experienced community members
																	</Typography>
																</Box>
																<Box
																	sx={{
																		padding: '16px',
																		backgroundColor: '#FAFAFA',
																		borderRadius: '12px',
																		border: '1px solid #E5E5E5',
																	}}
																>
																	<Typography
																		sx={{
																			fontSize: '14px',
																			color: '#111111',
																			fontWeight: 600,
																			mb: 0.5,
																		}}
																	>
																		🔥 Motivate Others
																	</Typography>
																	<Typography
																		sx={{
																			fontSize: '13px',
																			color: '#6B6B6B',
																		}}
																	>
																		Share tips and inspire others on their journey
																	</Typography>
																</Box>
															</Stack>
															<Button
																variant="contained"
																startIcon={<EditNoteIcon />}
																onClick={() =>
																	router.push({
																		pathname: '/mypage',
																		query: { category: 'writeArticle' },
																	})
																}
																sx={{
																	backgroundColor: '#E10600',
																	color: '#FFFFFF',
																	borderRadius: '12px',
																	padding: '14px 32px',
																	fontSize: '16px',
																	fontWeight: 600,
																	textTransform: 'none',
																	mt: 2,
																	boxShadow: '0 4px 12px rgba(225, 6, 0, 0.3)',
																	'&:hover': {
																		backgroundColor: '#C10500',
																		boxShadow: '0 6px 16px rgba(225, 6, 0, 0.4)',
																		transform: 'translateY(-2px)',
																	},
																	transition: 'all 0.2s ease',
																}}
															>
																Create First Post
															</Button>
														</Stack>
													</Card>
												)}
											</Stack>
										</TabPanel>
										<TabPanel value="SUCCESS_STORY" sx={{ padding: 0 }}>
											<Stack className="list-box" spacing={2}>
												{totalCount ? (
													boardArticles?.map((boardArticle: BoardArticle) => {
														return (
															<CommunityCard
																boardArticle={boardArticle}
																key={boardArticle?._id}
																likeArticleHandler={likeArticleHandler}
															/>
														);
													})
												) : (
													<Card
														elevation={0}
														sx={{
															backgroundColor: '#FFFFFF',
															borderRadius: '16px',
															border: '1px solid #E5E5E5',
															padding: '60px 32px',
															textAlign: 'center',
														}}
													>
														<Typography sx={{ fontSize: '15px', color: '#6B6B6B' }}>
															No progress stories yet! Share your transformation journey.
														</Typography>
													</Card>
												)}
											</Stack>
										</TabPanel>
										<TabPanel value="WORKOUT_TIPS" sx={{ padding: 0 }}>
											<Stack className="list-box" spacing={2}>
												{totalCount ? (
													boardArticles?.map((boardArticle: BoardArticle) => {
														return (
															<CommunityCard
																boardArticle={boardArticle}
																key={boardArticle?._id}
																likeArticleHandler={likeArticleHandler}
															/>
														);
													})
												) : (
													<Card
														elevation={0}
														sx={{
															backgroundColor: '#FFFFFF',
															borderRadius: '16px',
															border: '1px solid #E5E5E5',
															padding: '60px 32px',
															textAlign: 'center',
														}}
													>
														<Typography sx={{ fontSize: '15px', color: '#6B6B6B' }}>
															No tips shared yet! Share your workout wisdom.
														</Typography>
													</Card>
												)}
											</Stack>
										</TabPanel>
										<TabPanel value="MOTIVATION" sx={{ padding: 0 }}>
											<Stack className="list-box" spacing={2}>
												{totalCount ? (
													boardArticles?.map((boardArticle: BoardArticle) => {
														return (
															<CommunityCard
																boardArticle={boardArticle}
																key={boardArticle?._id}
																likeArticleHandler={likeArticleHandler}
															/>
														);
													})
												) : (
													<Card
														elevation={0}
														sx={{
															backgroundColor: '#FFFFFF',
															borderRadius: '16px',
															border: '1px solid #E5E5E5',
															padding: '60px 32px',
															textAlign: 'center',
														}}
													>
														<Typography sx={{ fontSize: '15px', color: '#6B6B6B' }}>
															No motivational content yet! Inspire the community.
														</Typography>
													</Card>
												)}
											</Stack>
										</TabPanel>
										<TabPanel value="QUESTION" sx={{ padding: 0 }}>
											<Stack className="list-box" spacing={2}>
												{totalCount ? (
													boardArticles?.map((boardArticle: BoardArticle) => {
														return (
															<CommunityCard
																boardArticle={boardArticle}
																key={boardArticle?._id}
																likeArticleHandler={likeArticleHandler}
															/>
														);
													})
												) : (
													<Card
														elevation={0}
														sx={{
															backgroundColor: '#FFFFFF',
															borderRadius: '16px',
															border: '1px solid #E5E5E5',
															padding: '60px 32px',
															textAlign: 'center',
														}}
													>
														<Typography sx={{ fontSize: '15px', color: '#6B6B6B' }}>
															No questions yet! Ask the community anything.
														</Typography>
													</Card>
												)}
											</Stack>
										</TabPanel>
										<TabPanel value="NEWS" sx={{ padding: 0 }}>
											<Stack className="list-box" spacing={2}>
												{totalCount ? (
													boardArticles?.map((boardArticle: BoardArticle) => {
														return (
															<CommunityCard
																boardArticle={boardArticle}
																key={boardArticle?._id}
																likeArticleHandler={likeArticleHandler}
															/>
														);
													})
												) : (
													<Card
														elevation={0}
														sx={{
															backgroundColor: '#FFFFFF',
															borderRadius: '16px',
															border: '1px solid #E5E5E5',
															padding: '60px 32px',
															textAlign: 'center',
														}}
													>
														<Typography sx={{ fontSize: '15px', color: '#6B6B6B' }}>
															No news articles found!
														</Typography>
													</Card>
												)}
											</Stack>
										</TabPanel>
										<TabPanel value="HUMOR" sx={{ padding: 0 }}>
											<Stack className="list-box" spacing={2}>
												{totalCount ? (
													boardArticles?.map((boardArticle: BoardArticle) => {
														return (
															<CommunityCard
																boardArticle={boardArticle}
																key={boardArticle?._id}
																likeArticleHandler={likeArticleHandler}
															/>
														);
													})
												) : (
													<Card
														elevation={0}
														sx={{
															backgroundColor: '#FFFFFF',
															borderRadius: '16px',
															border: '1px solid #E5E5E5',
															padding: '60px 32px',
															textAlign: 'center',
														}}
													>
														<Typography sx={{ fontSize: '15px', color: '#6B6B6B' }}>
															No humor posts found!
														</Typography>
													</Card>
												)}
											</Stack>
										</TabPanel>
										<TabPanel value="NUTRITION" sx={{ padding: 0 }}>
											<Stack className="list-box" spacing={2}>
												{totalCount ? (
													boardArticles?.map((boardArticle: BoardArticle) => {
														return (
															<CommunityCard
																boardArticle={boardArticle}
																key={boardArticle?._id}
																likeArticleHandler={likeArticleHandler}
															/>
														);
													})
												) : (
													<Card
														elevation={0}
														sx={{
															backgroundColor: '#FFFFFF',
															borderRadius: '16px',
															border: '1px solid #E5E5E5',
															padding: '60px 32px',
															textAlign: 'center',
														}}
													>
														<Typography sx={{ fontSize: '15px', color: '#6B6B6B' }}>
															No nutrition posts yet! Share your diet tips and meal plans.
														</Typography>
													</Card>
												)}
											</Stack>
										</TabPanel>
										<TabPanel value="EQUIPMENT_REVIEW" sx={{ padding: 0 }}>
											<Stack className="list-box" spacing={2}>
												{totalCount ? (
													boardArticles?.map((boardArticle: BoardArticle) => {
														return (
															<CommunityCard
																boardArticle={boardArticle}
																key={boardArticle?._id}
																likeArticleHandler={likeArticleHandler}
															/>
														);
													})
												) : (
													<Card
														elevation={0}
														sx={{
															backgroundColor: '#FFFFFF',
															borderRadius: '16px',
															border: '1px solid #E5E5E5',
															padding: '60px 32px',
															textAlign: 'center',
														}}
													>
														<Typography sx={{ fontSize: '15px', color: '#6B6B6B' }}>
															No equipment reviews yet! Share your experience with gym equipment.
														</Typography>
													</Card>
												)}
											</Stack>
										</TabPanel>
										<TabPanel value="GYM_REVIEW" sx={{ padding: 0 }}>
											<Stack className="list-box" spacing={2}>
												{totalCount ? (
													boardArticles?.map((boardArticle: BoardArticle) => {
														return (
															<CommunityCard
																boardArticle={boardArticle}
																key={boardArticle?._id}
																likeArticleHandler={likeArticleHandler}
															/>
														);
													})
												) : (
													<Card
														elevation={0}
														sx={{
															backgroundColor: '#FFFFFF',
															borderRadius: '16px',
															border: '1px solid #E5E5E5',
															padding: '60px 32px',
															textAlign: 'center',
														}}
													>
														<Typography sx={{ fontSize: '15px', color: '#6B6B6B' }}>
															No gym reviews yet! Share your experience with gyms and studios.
														</Typography>
													</Card>
												)}
											</Stack>
										</TabPanel>
									</Box>

									{/* Pagination */}
									{totalCount > 0 && (
										<Stack
											direction="row"
											justifyContent="space-between"
											alignItems="center"
											sx={{
												mt: 4,
												pt: 4,
												borderTop: '1px solid #E5E5E5',
											}}
										>
											<Typography
												sx={{
													fontSize: '14px',
													color: '#6B6B6B',
												}}
											>
												Total {totalCount} article{totalCount > 1 ? 's' : ''} available
											</Typography>
											<Pagination
												count={Math.ceil(totalCount / (searchCommunity.limit || 6))}
												page={searchCommunity.page || 1}
												shape="rounded"
												onChange={paginationHandler}
												sx={{
													'& .MuiPaginationItem-root': {
														color: '#6B6B6B',
														'&.Mui-selected': {
															backgroundColor: '#E10600',
															color: '#FFFFFF',
															'&:hover': {
																backgroundColor: '#C10500',
															},
														},
														'&:hover': {
															backgroundColor: 'rgba(225, 6, 0, 0.08)',
														},
													},
												}}
											/>
										</Stack>
									)}
								</Stack>
							</Stack>
						</Stack>
					</TabContext>
				</div>
			</Box>
		);
	}
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			articleCategory: 'FREE',
		},
	},
};

export default withLayoutBasic(Community);
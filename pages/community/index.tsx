import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination, Grid, Card, CardContent, CardMedia, Chip, Box, Avatar, IconButton } from '@mui/material';
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
	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	// Sample challenges data (in production, this would come from API)
	const [communityChallenges] = useState<Partial<Challenge>[]>([
		{
			_id: '1',
			challengeTitle: '30-Day Fitness Challenge',
			challengeType: 'WORKOUT_STREAK',
			challengeDifficulty: 'MEDIUM',
			challengeDesc: 'Complete 30 consecutive days of workouts',
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
			challengeType: 'WEIGHT_LOSS',
			challengeDifficulty: 'HARD',
			challengeDesc: 'Lose 5kg in 8 weeks',
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
			challengeType: 'DISTANCE',
			challengeDifficulty: 'EASY',
			challengeDesc: 'Walk 10,000 steps every day for 2 weeks',
			challengeImage: '/img/bodybuilders/pexels-leonmart-1552108.jpg',
			participantCount: 2100,
			completionCount: 892,
			rewardPoints: 300,
			startDate: new Date('2024-01-15'),
			endDate: new Date('2024-01-29'),
		},
	]);

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

	if (device === 'mobile') {
		return <h1>COMMUNITY PAGE MOBILE</h1>;
	} else {
		return (
			<div id="community-list-page">
				<div className="container">
					<TabContext value={searchCommunity.search.articleCategory}>
						<Stack className="main-box">
							<Stack className="left-config">
								<Stack className={'image-info'}>
									<img src={'/img/logo/logoText.svg'} />
									<Stack className={'community-name'}>
										<Typography className={'name'}>Shark Community</Typography>
									</Stack>
								</Stack>

								<TabList
									orientation="vertical"
									aria-label="lab API tabs example"
									TabIndicatorProps={{
										style: { display: 'none' },
									}}
									onChange={tabChangeHandler}
								>
									<Tab
										value={'FREE'}
										label={'Feed'}
										className={`tab-button ${searchCommunity.search.articleCategory == 'FREE' ? 'active' : ''}`}
									/>
									<Tab
										value={'SUCCESS_STORY'}
										label={'Progress'}
										className={`tab-button ${searchCommunity.search.articleCategory == 'SUCCESS_STORY' ? 'active' : ''}`}
									/>
									<Tab
										value={'WORKOUT_TIPS'}
										label={'Tips'}
										className={`tab-button ${searchCommunity.search.articleCategory == 'WORKOUT_TIPS' ? 'active' : ''}`}
									/>
									<Tab
										value={'MOTIVATION'}
										label={'Motivation'}
										className={`tab-button ${searchCommunity.search.articleCategory == 'MOTIVATION' ? 'active' : ''}`}
									/>
									<Tab
										value={'QUESTION'}
										label={'Q&A'}
										className={`tab-button ${searchCommunity.search.articleCategory == 'QUESTION' ? 'active' : ''}`}
									/>
									<Tab
										value={'NEWS'}
										label={'News'}
										className={`tab-button ${searchCommunity.search.articleCategory == 'NEWS' ? 'active' : ''}`}
									/>
									<Tab
										value={'HUMOR'}
										label={'Humor'}
										className={`tab-button ${searchCommunity.search.articleCategory == 'HUMOR' ? 'active' : ''}`}
									/>
								</TabList>
							</Stack>
							<Stack className="right-config">
								<Stack className="panel-config">
									{/* Challenges Section - Show on Feed tab */}
									{searchCommunity.search.articleCategory === 'FREE' && showChallenges && (
										<Box className={'challenges-section'} sx={{ mb: 4 }}>
											<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
												<Typography variant="h5" className={'section-title'}>
													Community Challenges
												</Typography>
												<Button
													variant="outlined"
													size="small"
													onClick={() => router.push('/goals/challenges')}
												>
													View All
												</Button>
											</Stack>
											<Grid container spacing={3}>
												{communityChallenges.map((challenge) => (
													<Grid item xs={12} md={4} key={challenge._id}>
														<Card className={'challenge-card'}>
															<CardMedia
																component="div"
																className={'challenge-image'}
																style={{
																	backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${challenge.challengeImage || '/img/bodybuilders/pexels-gabflicks-13122470.jpg'})`,
																	backgroundSize: 'cover',
																	backgroundPosition: 'center',
																	height: 200,
																}}
															>
																<Box className={'challenge-overlay'}>
																	<Chip
																		label={challenge.challengeDifficulty}
																		size="small"
																		className={'difficulty-chip'}
																	/>
																	<Stack direction="row" spacing={1} mt={2}>
																		<Chip
																			icon={<PeopleIcon />}
																			label={`${challenge.participantCount} participants`}
																			size="small"
																			className={'participant-chip'}
																		/>
																		<Chip
																			icon={<EmojiEventsIcon />}
																			label={`${challenge.rewardPoints} pts`}
																			size="small"
																			className={'reward-chip'}
																		/>
																	</Stack>
																</Box>
															</CardMedia>
															<CardContent>
																<Typography variant="h6" className={'challenge-title'} gutterBottom>
																	{challenge.challengeTitle}
																</Typography>
																<Typography variant="body2" color="text.secondary" paragraph>
																	{challenge.challengeDesc}
																</Typography>
																<Stack direction="row" justifyContent="space-between" alignItems="center">
																	<Typography variant="caption" color="text.secondary">
																		{challenge.completionCount} completed
																	</Typography>
																	<Button
																		variant="contained"
																		size="small"
																		onClick={() => router.push(`/goals/challenges/${challenge._id}`)}
																	>
																		Join Challenge
																	</Button>
																</Stack>
															</CardContent>
														</Card>
													</Grid>
												))}
											</Grid>
										</Box>
									)}

									<Stack className="title-box">
										<Stack className="left">
											<Typography className="title">
												{searchCommunity.search.articleCategory === 'FREE' ? 'Community Feed' :
												 searchCommunity.search.articleCategory === 'SUCCESS_STORY' ? 'Progress Stories' :
												 searchCommunity.search.articleCategory === 'WORKOUT_TIPS' ? 'Workout Tips' :
												 searchCommunity.search.articleCategory === 'MOTIVATION' ? 'Motivation' :
												 searchCommunity.search.articleCategory === 'QUESTION' ? 'Questions & Answers' :
												 searchCommunity.search.articleCategory} BOARD
											</Typography>
											<Typography className="sub-title">
												{searchCommunity.search.articleCategory === 'SUCCESS_STORY' ? 'Share your transformation journey and inspire others' :
												 searchCommunity.search.articleCategory === 'WORKOUT_TIPS' ? 'Share workout tips, techniques, and advice' :
												 searchCommunity.search.articleCategory === 'MOTIVATION' ? 'Get motivated and stay inspired on your fitness journey' :
												 searchCommunity.search.articleCategory === 'QUESTION' ? 'Ask questions and get answers from the community' :
												 'Express your opinions freely here without content restrictions'}
											</Typography>
										</Stack>
										<Button
											onClick={() =>
												router.push({
													pathname: '/mypage',
													query: {
														category: 'writeArticle',
													},
												})
											}
											className="right"
										>
											Write Post
										</Button>
									</Stack>

									<TabPanel value="FREE">
										<Stack className="list-box">
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
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No posts found! Be the first to share something.</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="SUCCESS_STORY">
										<Stack className="list-box">
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
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No progress stories yet! Share your transformation journey.</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="WORKOUT_TIPS">
										<Stack className="list-box">
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
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No tips shared yet! Share your workout wisdom.</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="MOTIVATION">
										<Stack className="list-box">
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
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No motivational content yet! Inspire the community.</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="QUESTION">
										<Stack className="list-box">
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
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No questions yet! Ask the community anything.</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="NEWS">
										<Stack className="list-box">
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
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No news articles found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="HUMOR">
										<Stack className="list-box">
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
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>No humor posts found!</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
								</Stack>
							</Stack>
						</Stack>
					</TabContext>

					{totalCount > 0 && (
						<Stack className="pagination-config">
							<Stack className="pagination-box">
								<Pagination
									count={Math.ceil(totalCount / searchCommunity.limit)}
									page={searchCommunity.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
							</Stack>
							<Stack className="total-result">
								<Typography>
									Total {totalCount} article{totalCount > 1 ? 's' : ''} available
								</Typography>
							</Stack>
						</Stack>
					)}
				</div>
			</div>
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
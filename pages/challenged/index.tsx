import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import {
	Container,
	Grid,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	Stack,
	Box,
	Typography,
	Pagination,
	Alert,
	Skeleton,
	Chip,
	Card,
	CardContent,
	CardMedia,
	LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_CHALLENGES } from '../../apollo/user/query';
import { ChallengesInquiry } from '../../libs/types/challenge/challenge.input';
import { Challenge, Participant } from '../../libs/types/challenge/challenge';
import { Direction } from '../../libs/enums/common.enum';
import { ChallengeStatus, ChallengeType, ChallengeDifficulty } from '../../libs/enums/challenge.enum';
import { userVar } from '../../apollo/store';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../libs/config';
import moment from 'moment';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ChallengedPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<ChallengeStatus | 'ALL'>('ALL');
	const [typeFilter, setTypeFilter] = useState<ChallengeType | 'ALL'>('ALL');
	const [page, setPage] = useState(1);
	const limit = 12;

	const inquiryInput: ChallengesInquiry = useMemo(
		() => ({
			page,
			limit: 100, // Get more to filter client-side
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {
				challengeStatus: statusFilter !== 'ALL' ? statusFilter : undefined,
				challengeType: typeFilter !== 'ALL' ? typeFilter : undefined,
			},
		}),
		[page, statusFilter, typeFilter],
	);

	const { data: challengesData, loading, error, refetch } = useQuery(GET_CHALLENGES, {
		variables: { input: inquiryInput },
		fetchPolicy: 'cache-and-network',
		skip: typeof window === 'undefined' || !user?._id,
		onError: (error) => {
			const errorDetails = {
				message: error.message,
				graphQLErrors: error.graphQLErrors?.map((err: any) => ({
					message: err.message,
					locations: err.locations,
					path: err.path,
				})),
				networkError: error.networkError ? {
					name: error.networkError.name,
					message: error.networkError.message,
				} : null,
			};
			console.error('❌ GET_CHALLENGES query error:', JSON.stringify(errorDetails, null, 2));
		},
	});

	// Filter challenges where user is a participant
	const myChallenges = useMemo(() => {
		if (!challengesData?.getChallenges?.list || !user?._id) return [];
		return challengesData.getChallenges.list.filter((challenge: Challenge) => {
			return challenge.participants?.some((p: Participant) => p.memberId === user._id);
		});
	}, [challengesData, user?._id]);

	// Apply search filter
	const filteredChallenges = useMemo(() => {
		let filtered = [...myChallenges];

		if (searchText) {
			const searchLower = searchText.toLowerCase();
			filtered = filtered.filter(
				(challenge: Challenge) =>
					challenge.challengeTitle.toLowerCase().includes(searchLower) ||
					challenge.challengeDesc.toLowerCase().includes(searchLower)
			);
		}

		return filtered;
	}, [myChallenges, searchText]);

	// Paginate filtered challenges
	const paginatedChallenges = useMemo(() => {
		const start = (page - 1) * limit;
		return filteredChallenges.slice(start, start + limit);
	}, [filteredChallenges, page, limit]);

	const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const getStatusColor = (status: ChallengeStatus) => {
		switch (status) {
			case ChallengeStatus.ACTIVE:
				return 'success';
			case ChallengeStatus.UPCOMING:
				return 'info';
			case ChallengeStatus.COMPLETED:
				return 'default';
			case ChallengeStatus.FAILED:
				return 'error';
			default:
				return 'default';
		}
	};

	const getDifficultyColor = (difficulty: ChallengeDifficulty) => {
		switch (difficulty) {
			case ChallengeDifficulty.EASY:
				return '#4CAF50';
			case ChallengeDifficulty.MEDIUM:
				return '#FF9800';
			case ChallengeDifficulty.HARD:
				return '#F44336';
			case ChallengeDifficulty.EXTREME:
				return '#9C27B0';
			default:
				return '#757575';
		}
	};

	const getDaysRemaining = (endDate: Date) => {
		const end = moment(endDate);
		const now = moment();
		const days = end.diff(now, 'days');
		return days > 0 ? days : 0;
	};

	const getMyProgress = (challenge: Challenge): Participant | null => {
		if (!user?._id || !challenge.participants) return null;
		return challenge.participants.find((p: Participant) => p.memberId === user._id) || null;
	};

	const getProgressPercentage = (challenge: Challenge): number => {
		const myProgress = getMyProgress(challenge);
		if (!myProgress || !challenge.targetValue) return 0;
		return Math.min(100, (myProgress.currentProgress / challenge.targetValue) * 100);
	};

	if (!user?._id) {
		return (
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Alert severity="info" sx={{ mb: 3 }}>
					Please login to view your challenges
				</Alert>
				<Button variant="contained" onClick={() => router.push('/account/login')}>
					Login
				</Button>
			</Container>
		);
	}

	if (device === 'mobile') {
		return (
			<Container maxWidth="sm" sx={{ py: 3 }}>
				<Box sx={{ mb: 3 }}>
					<Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#212121' }}>
						My Challenges
					</Typography>
					<Typography variant="body2" sx={{ color: '#757575' }}>
						Track your progress and achievements
					</Typography>
				</Box>

				<Stack spacing={2} sx={{ mb: 3 }}>
					<TextField
						fullWidth
						placeholder="Search challenges..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						InputProps={{
							startAdornment: <SearchIcon sx={{ color: '#9E9E9E', mr: 1 }} />,
						}}
					/>
					<Stack direction="row" spacing={1}>
						<FormControl fullWidth size="small">
							<InputLabel>Status</InputLabel>
							<Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value as any)}>
								<MenuItem value="ALL">All Status</MenuItem>
								<MenuItem value={ChallengeStatus.ACTIVE}>Active</MenuItem>
								<MenuItem value={ChallengeStatus.UPCOMING}>Upcoming</MenuItem>
								<MenuItem value={ChallengeStatus.COMPLETED}>Completed</MenuItem>
							</Select>
						</FormControl>
					</Stack>
				</Stack>

				{loading ? (
					<Stack spacing={2}>
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
						))}
					</Stack>
				) : error ? (
					<Alert severity="error">
						Error loading challenges. Please try again.
						<Button onClick={() => refetch()} sx={{ ml: 2 }}>
							Retry
						</Button>
					</Alert>
				) : paginatedChallenges.length === 0 ? (
					<Box sx={{ textAlign: 'center', py: 4 }}>
						<Typography variant="body1" sx={{ mb: 2, color: '#757575' }}>
							{myChallenges.length === 0
								? "You haven't joined any challenges yet"
								: 'No challenges match your filters'}
						</Typography>
						{myChallenges.length === 0 && (
							<Button variant="contained" onClick={() => router.push('/challenges')}>
								Browse Challenges
							</Button>
						)}
					</Box>
				) : (
					<>
						<Stack spacing={2}>
							{paginatedChallenges.map((challenge: Challenge) => {
								const imageUrl = challenge.challengeImage
									? `${REACT_APP_API_URL}/${challenge.challengeImage}`
									: '/img/challenge-default.jpg';
								const daysRemaining = getDaysRemaining(challenge.endDate);
								const myProgress = getMyProgress(challenge);
								const progressPercent = getProgressPercentage(challenge);
								const isCompleted = myProgress?.completed || false;

								return (
									<Card
										key={challenge._id}
										sx={{
											cursor: 'pointer',
											'&:hover': { boxShadow: 4 },
										}}
										onClick={() => router.push(`/goals/challenges/${challenge._id}`)}
									>
										<CardContent>
											<Stack spacing={2}>
												<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
													<Typography variant="h6">{challenge.challengeTitle}</Typography>
													<Stack direction="row" spacing={1}>
														{isCompleted && <CheckCircleIcon sx={{ color: '#4CAF50' }} />}
														<Chip
															label={challenge.challengeStatus}
															color={getStatusColor(challenge.challengeStatus) as any}
															size="small"
														/>
													</Stack>
												</Stack>
												<Typography variant="body2" color="text.secondary">
													{challenge.challengeDesc}
												</Typography>

												{/* Progress Bar */}
												<Box>
													<Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
														<Typography variant="body2" sx={{ fontWeight: 600 }}>
															Progress
														</Typography>
														<Typography variant="body2" sx={{ color: '#757575' }}>
															{myProgress?.currentProgress || 0} / {challenge.targetValue} {challenge.targetUnit}
														</Typography>
													</Stack>
													<LinearProgress
														variant="determinate"
														value={progressPercent}
														sx={{
															height: 8,
															borderRadius: 4,
															backgroundColor: '#E0E0E0',
															'& .MuiLinearProgress-bar': {
																backgroundColor: isCompleted ? '#4CAF50' : '#E10600',
															},
														}}
													/>
												</Box>

												<Stack direction="row" spacing={1} flexWrap="wrap">
													<Chip
														label={challenge.challengeDifficulty}
														size="small"
														sx={{ backgroundColor: getDifficultyColor(challenge.challengeDifficulty), color: 'white' }}
													/>
													<Chip label={challenge.challengeType.replace('_', ' ')} size="small" />
												</Stack>
												<Stack direction="row" spacing={2}>
													<Stack direction="row" alignItems="center" spacing={0.5}>
														<PeopleIcon fontSize="small" />
														<Typography variant="body2">{challenge.participantCount || 0}</Typography>
													</Stack>
													<Stack direction="row" alignItems="center" spacing={0.5}>
														<AccessTimeIcon fontSize="small" />
														<Typography variant="body2">{daysRemaining} days left</Typography>
													</Stack>
												</Stack>
											</Stack>
										</CardContent>
									</Card>
								);
							})}
						</Stack>
						{Math.ceil(filteredChallenges.length / limit) > 1 && (
							<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
								<Pagination
									count={Math.ceil(filteredChallenges.length / limit)}
									page={page}
									onChange={handlePageChange}
								/>
							</Box>
						)}
					</>
				)}
			</Container>
		);
	}

	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
			{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
					<Box>
						<Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: '#212121' }}>
							My Challenges
						</Typography>
						<Typography variant="body1" sx={{ color: '#757575' }}>
							Track your progress and achievements in challenges you've joined
						</Typography>
					</Box>
					<Button
						variant="outlined"
						onClick={() => router.push('/challenges')}
						sx={{
							borderColor: '#E10600',
							color: '#E10600',
							textTransform: 'none',
							fontWeight: 600,
							'&:hover': {
								borderColor: '#C10500',
								backgroundColor: 'rgba(225, 6, 0, 0.08)',
							},
						}}
					>
						Browse All Challenges
					</Button>
				</Stack>

				{/* Search and Filters */}
				<Stack direction="row" spacing={2} sx={{ mb: 3 }}>
					<TextField
						placeholder="Search challenges..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						sx={{ flex: 1 }}
						InputProps={{
							startAdornment: <SearchIcon sx={{ color: '#9E9E9E', mr: 1 }} />,
						}}
					/>
					<FormControl sx={{ minWidth: 150 }}>
						<InputLabel>Status</InputLabel>
						<Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value as any)}>
							<MenuItem value="ALL">All Status</MenuItem>
							<MenuItem value={ChallengeStatus.ACTIVE}>Active</MenuItem>
							<MenuItem value={ChallengeStatus.UPCOMING}>Upcoming</MenuItem>
							<MenuItem value={ChallengeStatus.COMPLETED}>Completed</MenuItem>
						</Select>
					</FormControl>
					<FormControl sx={{ minWidth: 150 }}>
						<InputLabel>Type</InputLabel>
						<Select value={typeFilter} label="Type" onChange={(e) => setTypeFilter(e.target.value as any)}>
							<MenuItem value="ALL">All Types</MenuItem>
							<MenuItem value={ChallengeType.WORKOUT_STREAK}>Workout Streak</MenuItem>
							<MenuItem value={ChallengeType.EXERCISE_COUNT}>Exercise Count</MenuItem>
							<MenuItem value={ChallengeType.DISTANCE}>Distance</MenuItem>
							<MenuItem value={ChallengeType.CALORIE_BURN}>Calorie Burn</MenuItem>
							<MenuItem value={ChallengeType.TIME_BASED}>Time Based</MenuItem>
						</Select>
					</FormControl>
				</Stack>
			</Box>

			{/* Content */}
			{loading ? (
				<Grid container spacing={3}>
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Grid item xs={12} sm={6} md={4} key={i}>
							<Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
						</Grid>
					))}
				</Grid>
			) : error ? (
				<Alert severity="error" sx={{ mb: 2 }}>
					Error loading challenges. Please try again.
					<Button onClick={() => refetch()} sx={{ ml: 2 }}>
						Retry
					</Button>
				</Alert>
			) : paginatedChallenges.length === 0 ? (
				<Box sx={{ textAlign: 'center', py: 8 }}>
					<Typography variant="h6" sx={{ mb: 2, color: '#212121' }}>
						{myChallenges.length === 0 ? "You haven't joined any challenges yet" : 'No challenges match your filters'}
					</Typography>
					<Typography variant="body2" sx={{ mb: 3, color: '#757575' }}>
						{myChallenges.length === 0
							? 'Browse available challenges and join ones that interest you'
							: 'Try adjusting your filters or search criteria'}
					</Typography>
					{myChallenges.length === 0 && (
						<Button
							variant="contained"
							onClick={() => router.push('/challenges')}
							sx={{
								backgroundColor: '#E10600',
								'&:hover': { backgroundColor: '#C10500' },
								textTransform: 'none',
								fontWeight: 600,
							}}
						>
							Browse Challenges
						</Button>
					)}
				</Box>
			) : (
				<>
					<Grid container spacing={3}>
						{paginatedChallenges.map((challenge: Challenge) => {
							const imageUrl = challenge.challengeImage
								? `${REACT_APP_API_URL}/${challenge.challengeImage}`
								: '/img/challenge-default.jpg';
							const daysRemaining = getDaysRemaining(challenge.endDate);
							const myProgress = getMyProgress(challenge);
							const progressPercent = getProgressPercentage(challenge);
							const isCompleted = myProgress?.completed || false;

							return (
								<Grid item xs={12} sm={6} md={4} key={challenge._id}>
									<Card
										sx={{
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
											borderRadius: 2,
											border: '1px solid #E5E5E5',
											backgroundColor: '#FFFFFF',
											transition: 'all 0.3s ease',
											cursor: 'pointer',
											overflow: 'hidden',
											'&:hover': {
												borderColor: isCompleted ? '#4CAF50' : '#E10600',
												boxShadow: `0 8px 24px rgba(${isCompleted ? '76, 175, 80' : '225, 6, 0'}, 0.12)`,
												transform: 'translateY(-4px)',
											},
										}}
										onClick={() => router.push(`/goals/challenges/${challenge._id}`)}
									>
										{/* Challenge Image */}
										<CardMedia
											component="div"
											sx={{
												height: 200,
												backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${imageUrl})`,
												backgroundSize: 'cover',
												backgroundPosition: 'center',
												position: 'relative',
											}}
										>
											<Stack
												direction="row"
												spacing={1}
												sx={{
													position: 'absolute',
													top: 12,
													left: 12,
													right: 12,
													justifyContent: 'space-between',
												}}
											>
												<Stack direction="row" spacing={1}>
													{isCompleted && (
														<Chip
															icon={<CheckCircleIcon />}
															label="Completed"
															size="small"
															sx={{ backgroundColor: '#4CAF50', color: 'white' }}
														/>
													)}
													<Chip
														label={challenge.challengeStatus}
														color={getStatusColor(challenge.challengeStatus) as any}
														size="small"
														sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
													/>
												</Stack>
												<Chip
													label={challenge.challengeDifficulty}
													size="small"
													sx={{
														backgroundColor: getDifficultyColor(challenge.challengeDifficulty),
														color: 'white',
													}}
												/>
											</Stack>
										</CardMedia>

										<CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
											{/* Title and Type */}
											<Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#212121' }}>
												{challenge.challengeTitle}
											</Typography>
											<Chip
												label={challenge.challengeType.replace(/_/g, ' ')}
												size="small"
												sx={{ mb: 1.5, height: 24, fontSize: '11px' }}
											/>

											{/* Description */}
											<Typography
												variant="body2"
												sx={{
													color: '#757575',
													mb: 2,
													display: '-webkit-box',
													WebkitLineClamp: 2,
													WebkitBoxOrient: 'vertical',
													overflow: 'hidden',
													flex: 1,
												}}
											>
												{challenge.challengeDesc}
											</Typography>

											{/* Progress Section */}
											<Box sx={{ mb: 2, p: 1.5, backgroundColor: '#F5F5F5', borderRadius: 1 }}>
												<Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
													<Typography variant="body2" sx={{ fontWeight: 600, color: '#212121' }}>
														Your Progress
													</Typography>
													<Typography variant="body2" sx={{ fontWeight: 600, color: '#E10600' }}>
														{progressPercent.toFixed(0)}%
													</Typography>
												</Stack>
												<LinearProgress
													variant="determinate"
													value={progressPercent}
													sx={{
														height: 10,
														borderRadius: 5,
														backgroundColor: '#E0E0E0',
														mb: 1,
														'& .MuiLinearProgress-bar': {
															backgroundColor: isCompleted ? '#4CAF50' : '#E10600',
															borderRadius: 5,
														},
													}}
												/>
												<Stack direction="row" alignItems="center" spacing={1}>
													<TrendingUpIcon sx={{ fontSize: 16, color: '#E10600' }} />
													<Typography variant="body2" sx={{ fontSize: '12px', color: '#757575' }}>
														{myProgress?.currentProgress || 0} / {challenge.targetValue} {challenge.targetUnit}
													</Typography>
												</Stack>
											</Box>

											{/* Stats */}
											<Stack direction="row" spacing={2} sx={{ mb: 2 }}>
												<Stack direction="row" alignItems="center" spacing={0.5}>
													<PeopleIcon sx={{ fontSize: 18, color: '#757575' }} />
													<Typography variant="body2" sx={{ color: '#757575' }}>
														{challenge.participantCount || 0}
													</Typography>
												</Stack>
												<Stack direction="row" alignItems="center" spacing={0.5}>
													<AccessTimeIcon sx={{ fontSize: 18, color: '#757575' }} />
													<Typography variant="body2" sx={{ color: '#757575' }}>
														{daysRemaining} days left
													</Typography>
												</Stack>
												{challenge.rewardPoints > 0 && (
													<Stack direction="row" alignItems="center" spacing={0.5}>
														<EmojiEventsIcon sx={{ fontSize: 18, color: '#FFD700' }} />
														<Typography variant="body2" sx={{ color: '#757575' }}>
															{challenge.rewardPoints} pts
														</Typography>
													</Stack>
												)}
											</Stack>
										</CardContent>
									</Card>
								</Grid>
							);
						})}
					</Grid>
					{Math.ceil(filteredChallenges.length / limit) > 1 && (
						<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
							<Pagination
								count={Math.ceil(filteredChallenges.length / limit)}
								page={page}
								onChange={handlePageChange}
							/>
						</Box>
					)}
				</>
			)}
		</Container>
	);
};

export default withLayoutBasic(ChallengedPage);


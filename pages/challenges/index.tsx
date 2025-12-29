import React, { useState, useMemo, useEffect } from 'react';
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
import FilterListIcon from '@mui/icons-material/FilterList';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { GET_CHALLENGES, GET_CHALLENGE } from '../../apollo/user/query';
import { JOIN_CHALLENGE } from '../../apollo/user/mutation';
import { ChallengesInquiry } from '../../libs/types/challenge/challenge.input';
import { Challenge, Participant } from '../../libs/types/challenge/challenge';
import { Direction } from '../../libs/enums/common.enum';
import { ChallengeStatus, ChallengeType, ChallengeDifficulty } from '../../libs/enums/challenge.enum';
import { userVar } from '../../apollo/store';
import { useRouter } from 'next/router';
import { sweetMixinSuccessAlert, sweetErrorHandling } from '../../libs/sweetAlert';
import { REACT_APP_API_URL } from '../../libs/config';
import moment from 'moment';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ChallengesPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<ChallengeStatus | 'ALL'>('ALL');
	const [typeFilter, setTypeFilter] = useState<ChallengeType | 'ALL'>('ALL');
	const [difficultyFilter, setDifficultyFilter] = useState<ChallengeDifficulty | 'ALL'>('ALL');
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState<'createdAt' | 'participantCount' | 'startDate'>('createdAt');

	const limit = 12;

	const inquiryInput: ChallengesInquiry = useMemo(
		() => ({
			page,
			limit,
			sort: sortBy,
			direction: Direction.DESC,
			search: {
				challengeStatus: statusFilter !== 'ALL' ? statusFilter : undefined,
				challengeType: typeFilter !== 'ALL' ? typeFilter : undefined,
			},
		}),
		[page, limit, sortBy, statusFilter, typeFilter],
	);

	const { data: challengesData, loading, error, refetch } = useQuery(GET_CHALLENGES, {
		variables: { input: inquiryInput },
		fetchPolicy: 'cache-and-network',
		skip: typeof window === 'undefined',
		onError: (error) => {
			console.error('❌ GET_CHALLENGES query error:', error);
		},
	});

	const [joinChallenge] = useMutation(JOIN_CHALLENGE, {
		onCompleted: () => {
			sweetMixinSuccessAlert('Successfully joined the challenge!');
			refetch();
		},
		onError: (error) => {
			sweetErrorHandling(error);
		},
	});

	const challenges = challengesData?.getChallenges?.list || [];
	const total = challengesData?.getChallenges?.metaCounter?.[0]?.total || 0;

	// Filter challenges by difficulty and search text
	const filteredChallenges = useMemo(() => {
		return challenges.filter((challenge: Challenge) => {
			// Difficulty filter
			if (difficultyFilter !== 'ALL' && challenge.challengeDifficulty !== difficultyFilter) {
				return false;
			}

			// Search text filter
			if (searchText) {
				const searchLower = searchText.toLowerCase();
				return (
					challenge.challengeTitle.toLowerCase().includes(searchLower) ||
					challenge.challengeDesc.toLowerCase().includes(searchLower)
				);
			}

			return true;
		});
	}, [challenges, difficultyFilter, searchText]);

	const handleJoinChallenge = async (challengeId: string) => {
		if (!user?._id) {
			router.push('/account/login');
			return;
		}

		try {
			await joinChallenge({
				variables: { input: challengeId },
			});
		} catch (err: any) {
			console.error('Error joining challenge:', err);
		}
	};

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

	if (device === 'mobile') {
		return (
			<Container maxWidth="sm" sx={{ py: 3 }}>
				<Box sx={{ mb: 3 }}>
					<Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#212121' }}>
						Challenges
					</Typography>
					<Typography variant="body2" sx={{ color: '#757575' }}>
						Join challenges and push your limits
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
						<FormControl fullWidth size="small">
							<InputLabel>Difficulty</InputLabel>
							<Select value={difficultyFilter} label="Difficulty" onChange={(e) => setDifficultyFilter(e.target.value as any)}>
								<MenuItem value="ALL">All</MenuItem>
								<MenuItem value={ChallengeDifficulty.EASY}>Easy</MenuItem>
								<MenuItem value={ChallengeDifficulty.MEDIUM}>Medium</MenuItem>
								<MenuItem value={ChallengeDifficulty.HARD}>Hard</MenuItem>
								<MenuItem value={ChallengeDifficulty.EXTREME}>Extreme</MenuItem>
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
				) : filteredChallenges.length === 0 ? (
					<Box sx={{ textAlign: 'center', py: 4 }}>
						<Typography variant="body1" sx={{ mb: 2, color: '#757575' }}>
							No challenges found
						</Typography>
					</Box>
				) : (
					<>
						<Stack spacing={2}>
							{filteredChallenges.map((challenge: Challenge) => (
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
												<Chip label={challenge.challengeStatus} color={getStatusColor(challenge.challengeStatus) as any} size="small" />
											</Stack>
											<Typography variant="body2" color="text.secondary">
												{challenge.challengeDesc}
											</Typography>
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
													<Typography variant="body2">{getDaysRemaining(challenge.endDate)} days left</Typography>
												</Stack>
											</Stack>
											<Button
												variant="contained"
												fullWidth
												onClick={(e) => {
													e.stopPropagation();
													handleJoinChallenge(challenge._id);
												}}
											>
												Join Challenge
											</Button>
										</Stack>
									</CardContent>
								</Card>
							))}
						</Stack>
						{Math.ceil(total / limit) > 1 && (
							<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
								<Pagination count={Math.ceil(total / limit)} page={page} onChange={handlePageChange} />
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
							Challenges
						</Typography>
						<Typography variant="body1" sx={{ color: '#757575' }}>
							Join challenges, push your limits, and earn rewards
						</Typography>
					</Box>
					{user?.memberType === 'TRAINER' && (
						<Button
							variant="contained"
							onClick={() => router.push('/goals/create')}
							sx={{
								backgroundColor: '#E10600',
								'&:hover': { backgroundColor: '#C10500' },
								textTransform: 'none',
								fontWeight: 600,
							}}
						>
							Create Challenge
						</Button>
					)}
				</Stack>

				{/* Search, Sort, Filters */}
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
						<InputLabel>Difficulty</InputLabel>
						<Select value={difficultyFilter} label="Difficulty" onChange={(e) => setDifficultyFilter(e.target.value as any)}>
							<MenuItem value="ALL">All</MenuItem>
							<MenuItem value={ChallengeDifficulty.EASY}>Easy</MenuItem>
							<MenuItem value={ChallengeDifficulty.MEDIUM}>Medium</MenuItem>
							<MenuItem value={ChallengeDifficulty.HARD}>Hard</MenuItem>
							<MenuItem value={ChallengeDifficulty.EXTREME}>Extreme</MenuItem>
						</Select>
					</FormControl>
					<FormControl sx={{ minWidth: 200 }}>
						<InputLabel>Sort by</InputLabel>
						<Select value={sortBy} label="Sort by" onChange={(e) => setSortBy(e.target.value as any)}>
							<MenuItem value="createdAt">Newest</MenuItem>
							<MenuItem value="participantCount">Most Popular</MenuItem>
							<MenuItem value="startDate">Starting Soon</MenuItem>
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
			) : filteredChallenges.length === 0 ? (
				<Box sx={{ textAlign: 'center', py: 8 }}>
					<Typography variant="h6" sx={{ mb: 2, color: '#212121' }}>
						No challenges found
					</Typography>
					<Typography variant="body2" sx={{ mb: 3, color: '#757575' }}>
						Try adjusting your filters or search criteria
					</Typography>
				</Box>
			) : (
				<>
					<Grid container spacing={3}>
						{filteredChallenges.map((challenge: Challenge) => {
							const imageUrl = challenge.challengeImage
								? `${REACT_APP_API_URL}/${challenge.challengeImage}`
								: '/img/challenge-default.jpg';
							const daysRemaining = getDaysRemaining(challenge.endDate);
							const isJoined = challenge.participants?.some((p: Participant) => p.memberId === user?._id);

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
												borderColor: '#E10600',
												boxShadow: '0 8px 24px rgba(225, 6, 0, 0.12)',
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
												<Chip
													label={challenge.challengeStatus}
													color={getStatusColor(challenge.challengeStatus) as any}
													size="small"
													sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
												/>
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

											{/* Target */}
											<Box sx={{ mb: 2, p: 1.5, backgroundColor: '#F5F5F5', borderRadius: 1 }}>
												<Stack direction="row" alignItems="center" spacing={1}>
													<TrendingUpIcon sx={{ fontSize: 18, color: '#E10600' }} />
													<Typography variant="body2" sx={{ fontWeight: 600 }}>
														Target: {challenge.targetValue} {challenge.targetUnit}
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

											{/* Join Button */}
											<Button
												variant={isJoined ? 'outlined' : 'contained'}
												fullWidth
												onClick={(e) => {
													e.stopPropagation();
													if (!isJoined) {
														handleJoinChallenge(challenge._id);
													}
												}}
												sx={{
													mt: 'auto',
													backgroundColor: isJoined ? 'transparent' : '#E10600',
													color: isJoined ? '#E10600' : 'white',
													borderColor: '#E10600',
													'&:hover': {
														backgroundColor: isJoined ? 'rgba(225, 6, 0, 0.08)' : '#C10500',
														borderColor: '#E10600',
													},
													textTransform: 'none',
													fontWeight: 600,
												}}
											>
												{isJoined ? 'Joined' : 'Join Challenge'}
											</Button>
										</CardContent>
									</Card>
								</Grid>
							);
						})}
					</Grid>
					{Math.ceil(total / limit) > 1 && (
						<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
							<Pagination count={Math.ceil(total / limit)} page={page} onChange={handlePageChange} />
						</Box>
					)}
				</>
			)}
		</Container>
	);
};

export default withLayoutBasic(ChallengesPage);


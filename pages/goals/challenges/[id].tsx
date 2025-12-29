import React, { useMemo } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
	Stack,
	Box,
	Typography,
	Button,
	Card,
	CardContent,
	CardMedia,
	LinearProgress,
	Chip,
	Grid,
	Avatar,
	Alert,
	Skeleton,
	Container,
} from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { GET_CHALLENGE } from '../../../apollo/user/query';
import { JOIN_CHALLENGE } from '../../../apollo/user/mutation';
import { Challenge, Participant } from '../../../libs/types/challenge/challenge';
import { ChallengeStatus, ChallengeDifficulty } from '../../../libs/enums/challenge.enum';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../../libs/config';
import { sweetMixinSuccessAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import moment from 'moment';

export const getServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ChallengeDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	// Fetch challenge data
	const { data: challengeData, loading, error, refetch } = useQuery(GET_CHALLENGE, {
		variables: { input: id as string },
		fetchPolicy: 'cache-and-network',
		skip: !id || typeof window === 'undefined',
		onError: (error) => {
			console.error('❌ GET_CHALLENGE query error:', error);
		},
	});

	const challenge = challengeData?.getChallenge as Challenge | undefined;

	// Join challenge mutation
	const [joinChallenge, { loading: joinLoading }] = useMutation(JOIN_CHALLENGE, {
		onCompleted: () => {
			sweetMixinSuccessAlert('Successfully joined the challenge!');
			refetch();
		},
		onError: (error) => {
			sweetErrorHandling(error);
		},
	});

	// Check if user is already a participant
	const myProgress = useMemo(() => {
		if (!user?._id || !challenge?.participants) return null;
		return challenge.participants.find((p: Participant) => p.memberId === user._id) || null;
	}, [challenge, user?._id]);

	const isJoined = !!myProgress;

	// Calculate progress percentage
	const progressPercentage = useMemo(() => {
		if (!myProgress || !challenge?.targetValue) return 0;
		return Math.min(100, (myProgress.currentProgress / challenge.targetValue) * 100);
	}, [myProgress, challenge]);

	// Calculate days remaining
	const daysRemaining = useMemo(() => {
		if (!challenge?.endDate) return 0;
		const end = moment(challenge.endDate);
		const now = moment();
		const days = end.diff(now, 'days');
		return days > 0 ? days : 0;
	}, [challenge]);

	// Get status color
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

	// Get difficulty color
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

	// Handle join challenge
	const handleJoinChallenge = async () => {
		if (!user?._id) {
			router.push('/account/login');
			return;
		}

		if (!challenge?._id) return;

		try {
			await joinChallenge({
				variables: { input: challenge._id },
			});
		} catch (err: any) {
			console.error('Error joining challenge:', err);
		}
	};

	if (device === 'mobile') {
		return (
			<Container maxWidth="sm" sx={{ py: 3 }}>
				{loading ? (
					<Stack spacing={2}>
						<Skeleton variant="rectangular" height={200} />
						<Skeleton variant="rectangular" height={300} />
					</Stack>
				) : error || !challenge ? (
					<Alert severity="error">
						{error ? 'Error loading challenge. Please try again.' : 'Challenge not found'}
						<Button onClick={() => refetch()} sx={{ ml: 2 }}>
							Retry
						</Button>
					</Alert>
				) : (
					<Stack spacing={3}>
						<Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/challenges')}>
							Back to Challenges
						</Button>
						<Card>
							<CardContent>
								<Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
									{challenge.challengeTitle}
								</Typography>
								<Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
									<Chip label={challenge.challengeStatus} color={getStatusColor(challenge.challengeStatus) as any} size="small" />
									<Chip
										label={challenge.challengeDifficulty}
										size="small"
										sx={{ backgroundColor: getDifficultyColor(challenge.challengeDifficulty), color: 'white' }}
									/>
									<Chip label={challenge.challengeType.replace(/_/g, ' ')} size="small" />
								</Stack>
								<Typography variant="body1" sx={{ mb: 2 }}>
									{challenge.challengeDesc}
								</Typography>
							</CardContent>
						</Card>
						{isJoined && myProgress && (
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Your Progress
									</Typography>
									<Box sx={{ mt: 2 }}>
										<Stack direction="row" justifyContent="space-between" mb={1}>
											<Typography variant="body2">
												{myProgress.currentProgress} / {challenge.targetValue} {challenge.targetUnit}
											</Typography>
											<Typography variant="body2">{Math.round(progressPercentage)}%</Typography>
										</Stack>
										<LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 10, borderRadius: 5 }} />
									</Box>
								</CardContent>
							</Card>
						)}
						{!isJoined && (
							<Button variant="contained" fullWidth onClick={handleJoinChallenge} disabled={joinLoading}>
								{joinLoading ? 'Joining...' : 'Join Challenge'}
							</Button>
						)}
					</Stack>
				)}
			</Container>
		);
	}

	// Desktop view
	if (loading) {
		return (
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Stack spacing={3}>
					<Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
					<Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
				</Stack>
			</Container>
		);
	}

	if (error || !challenge) {
		return (
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Alert severity="error" sx={{ mb: 3 }}>
					{error ? 'Error loading challenge. Please try again.' : 'Challenge not found'}
					<Button onClick={() => refetch()} sx={{ ml: 2 }}>
						Retry
					</Button>
				</Alert>
				<Button variant="contained" onClick={() => router.push('/challenges')}>
					Back to Challenges
				</Button>
			</Container>
		);
	}

	const imageUrl = challenge.challengeImage ? `${REACT_APP_API_URL}/${challenge.challengeImage}` : '/img/challenge-default.jpg';

	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
			<Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/challenges')} sx={{ mb: 3 }}>
				Back to Challenges
			</Button>

			{/* Challenge Image Header */}
			<Card sx={{ mb: 4, overflow: 'hidden' }}>
				<CardMedia
					component="div"
					sx={{
						height: 400,
						backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${imageUrl})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						position: 'relative',
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
							p: 4,
							background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
						}}
					>
						<Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
							{challenge.challengeTitle}
						</Typography>
						<Stack direction="row" spacing={1} flexWrap="wrap">
							<Chip
								label={challenge.challengeStatus}
								color={getStatusColor(challenge.challengeStatus) as any}
								size="small"
								sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
							/>
							<Chip
								label={challenge.challengeDifficulty}
								size="small"
								sx={{ backgroundColor: getDifficultyColor(challenge.challengeDifficulty), color: 'white' }}
							/>
							<Chip label={challenge.challengeType.replace(/_/g, ' ')} size="small" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }} />
						</Stack>
					</Box>
				</CardMedia>
			</Card>

			<Grid container spacing={3}>
				{/* Main Content */}
				<Grid item xs={12} md={8}>
					{/* Description */}
					<Card sx={{ mb: 3 }}>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								About This Challenge
							</Typography>
							<Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
								{challenge.challengeDesc}
							</Typography>
							{challenge.challengeRules && challenge.challengeRules.length > 0 && (
								<Box sx={{ mt: 3 }}>
									<Typography variant="h6" gutterBottom>
										Rules
									</Typography>
									<Stack component="ul" spacing={1} sx={{ pl: 2 }}>
										{challenge.challengeRules.map((rule: string, index: number) => (
											<Typography key={index} component="li" variant="body2">
												{rule}
											</Typography>
										))}
									</Stack>
								</Box>
							)}
						</CardContent>
					</Card>

					{/* Progress (if joined) */}
					{isJoined && myProgress && (
						<Card sx={{ mb: 3 }}>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Your Progress
								</Typography>
								<Box sx={{ mt: 2 }}>
									<Stack direction="row" justifyContent="space-between" mb={1}>
										<Typography variant="body1" sx={{ fontWeight: 600 }}>
											{myProgress.currentProgress} / {challenge.targetValue} {challenge.targetUnit}
										</Typography>
										<Typography variant="body1" sx={{ fontWeight: 600 }}>
											{Math.round(progressPercentage)}%
										</Typography>
									</Stack>
									<LinearProgress
										variant="determinate"
										value={progressPercentage}
										sx={{ height: 12, borderRadius: 6, backgroundColor: '#E0E0E0' }}
									/>
									{myProgress.completed && (
										<Typography variant="body2" sx={{ mt: 1, color: 'success.main', fontWeight: 600 }}>
											✓ Challenge Completed!
										</Typography>
									)}
								</Box>
							</CardContent>
						</Card>
					)}
				</Grid>

				{/* Sidebar */}
				<Grid item xs={12} md={4}>
					<Card sx={{ mb: 3 }}>
						<CardContent>
							<Stack spacing={3}>
								<Stack direction="row" alignItems="center" spacing={2}>
									<PeopleIcon sx={{ fontSize: 32, color: '#E10600' }} />
									<Box>
										<Typography variant="h5">{challenge.participantCount || 0}</Typography>
										<Typography variant="body2" color="text.secondary">
											Participants
										</Typography>
									</Box>
								</Stack>
								<Stack direction="row" alignItems="center" spacing={2}>
									<AccessTimeIcon sx={{ fontSize: 32, color: '#E10600' }} />
									<Box>
										<Typography variant="h5">{daysRemaining}</Typography>
										<Typography variant="body2" color="text.secondary">
											Days Remaining
										</Typography>
									</Box>
								</Stack>
								<Stack direction="row" alignItems="center" spacing={2}>
									<TrendingUpIcon sx={{ fontSize: 32, color: '#E10600' }} />
									<Box>
										<Typography variant="h5">
											{challenge.targetValue} {challenge.targetUnit}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Target Goal
										</Typography>
									</Box>
								</Stack>
								{(challenge.rewardPoints > 0 || challenge.rewardBadge) && (
									<Stack direction="row" alignItems="center" spacing={2}>
										<EmojiEventsIcon sx={{ fontSize: 32, color: '#FFD700' }} />
										<Box>
											<Typography variant="h5">
												{challenge.rewardPoints > 0 && `${challenge.rewardPoints} pts`}
												{challenge.rewardPoints > 0 && challenge.rewardBadge && ' + '}
												{challenge.rewardBadge && 'Badge'}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												Rewards
											</Typography>
										</Box>
									</Stack>
								)}
							</Stack>
						</CardContent>
					</Card>

					{/* Join Button */}
					{!isJoined && (
						<Button
							variant="contained"
							size="large"
							fullWidth
							onClick={handleJoinChallenge}
							disabled={joinLoading}
							sx={{
								backgroundColor: '#E10600',
								'&:hover': { backgroundColor: '#C10500' },
								py: 1.5,
								fontSize: '16px',
								fontWeight: 600,
							}}
						>
							{joinLoading ? 'Joining...' : 'Join Challenge'}
						</Button>
					)}
					{isJoined && (
						<Button
							variant="outlined"
							size="large"
							fullWidth
							disabled
							sx={{
								borderColor: '#E10600',
								color: '#E10600',
								py: 1.5,
								fontSize: '16px',
								fontWeight: 600,
							}}
						>
							Joined ✓
						</Button>
					)}
				</Grid>
			</Grid>
		</Container>
	);
};

export default withLayoutBasic(ChallengeDetailPage);

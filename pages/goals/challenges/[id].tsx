import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, Card, CardContent, LinearProgress, Chip, Grid, Avatar } from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const getServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ChallengeDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const device = useDeviceDetect();
	const [challenge, setChallenge] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (id) {
			setLoading(false);
		}
	}, [id]);

	if (device === 'mobile') {
		return <div>MOBILE CHALLENGE DETAIL</div>;
	} else {
		if (loading) return <div>Loading...</div>;
		if (!challenge) return <div>Challenge not found</div>;

		return (
			<Stack className={'challenge-detail-page'}>
				<Stack className={'container'}>
					<Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 3 }}>
						Back to Challenges
					</Button>

					{/* Header */}
					<Card sx={{ mb: 4 }}>
						<CardContent>
							<Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
								<Box>
									<Typography variant="h3" className={'challenge-title'}>
										30-Day Fitness Challenge
									</Typography>
									<Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
										<Chip label="Active" color="success" size="small" />
										<Chip label="30 Days" size="small" />
										<Chip label="Beginner" size="small" />
									</Stack>
									<Typography variant="body1" sx={{ mb: 2 }}>
										Complete 30 workouts in 30 days and transform your fitness! This challenge is designed to build
										consistency and momentum in your fitness journey.
									</Typography>
								</Box>
							</Stack>

							<Grid container spacing={3}>
								<Grid item xs={12} md={4}>
									<Stack direction="row" alignItems="center" spacing={2}>
										<PeopleIcon />
										<Box>
											<Typography variant="h6">150</Typography>
											<Typography variant="body2" color="text.secondary">
												Participants
											</Typography>
										</Box>
									</Stack>
								</Grid>
								<Grid item xs={12} md={4}>
									<Stack direction="row" alignItems="center" spacing={2}>
										<AccessTimeIcon />
										<Box>
											<Typography variant="h6">15 days left</Typography>
											<Typography variant="body2" color="text.secondary">
												Time Remaining
											</Typography>
										</Box>
									</Stack>
								</Grid>
								<Grid item xs={12} md={4}>
									<Stack direction="row" alignItems="center" spacing={2}>
										<EmojiEventsIcon />
										<Box>
											<Typography variant="h6">Badge + Points</Typography>
											<Typography variant="body2" color="text.secondary">
												Rewards
											</Typography>
										</Box>
									</Stack>
								</Grid>
							</Grid>
						</CardContent>
					</Card>

					{/* Progress */}
					<Card sx={{ mb: 4 }}>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Your Progress
							</Typography>
							<Box sx={{ mt: 2 }}>
								<Stack direction="row" justifyContent="space-between" mb={1}>
									<Typography variant="body2">15 / 30 workouts completed</Typography>
									<Typography variant="body2">50%</Typography>
								</Stack>
								<LinearProgress variant="determinate" value={50} sx={{ height: 10, borderRadius: 5 }} />
							</Box>
						</CardContent>
					</Card>

					{/* Leaderboard */}
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Leaderboard
							</Typography>
							<Stack spacing={2} sx={{ mt: 2 }}>
								{[1, 2, 3, 4, 5].map((rank) => (
									<Stack key={rank} direction="row" alignItems="center" spacing={2}>
										<Typography variant="h6" sx={{ minWidth: 40 }}>
											#{rank}
										</Typography>
										<Avatar />
										<Box flex={1}>
											<Typography variant="body1">User Name {rank}</Typography>
											<Typography variant="body2" color="text.secondary">
												{30 - rank} workouts completed
											</Typography>
										</Box>
										{rank === 1 && <EmojiEventsIcon sx={{ color: '#FFD700' }} />}
									</Stack>
								))}
							</Stack>
						</CardContent>
					</Card>

					<Button variant="contained" size="large" fullWidth sx={{ mt: 4 }}>
						Join Challenge
					</Button>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(ChallengeDetailPage);






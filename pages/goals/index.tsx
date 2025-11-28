import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Tabs, Tab, LinearProgress, Chip } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const GoalsPage: NextPage = () => {
	const device = useDeviceDetect();
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'goals-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Goals</Typography>
					<div>MOBILE GOALS PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'goals-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'} direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
						<Box>
							<Typography variant="h3" className={'page-title'}>
								Goals & Achievements
							</Typography>
							<Typography variant="body1" className={'page-subtitle'}>
								Set goals, unlock achievements, and track your progress
							</Typography>
						</Box>
						<Button variant="contained" startIcon={<AddIcon />}>
							Create Goal
						</Button>
					</Stack>

					{/* Tabs */}
					<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
						<Tabs value={tabValue} onChange={handleTabChange}>
							<Tab label="Goals" icon={<TrendingUpIcon />} iconPosition="start" />
							<Tab label="Achievements" icon={<EmojiEventsIcon />} iconPosition="start" />
							<Tab label="Challenges" icon={<MilitaryTechIcon />} iconPosition="start" />
						</Tabs>
					</Box>

					{/* Tab Content - Goals */}
					{tabValue === 0 && (
						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<Card className={'goal-card'}>
									<CardContent>
										<Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
											<Box>
												<Typography variant="h6">Lose Weight</Typography>
												<Typography variant="body2" color="text.secondary">
													Target: 70kg by Dec 31, 2024
												</Typography>
											</Box>
											<Chip label="Active" color="primary" size="small" />
										</Stack>
										<Box sx={{ mt: 2 }}>
											<Stack direction="row" justifyContent="space-between" mb={1}>
												<Typography variant="body2">Progress</Typography>
												<Typography variant="body2">65%</Typography>
											</Stack>
											<LinearProgress variant="determinate" value={65} sx={{ height: 8, borderRadius: 4 }} />
										</Box>
										<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
											Current: 75kg • Target: 70kg • 15 days remaining
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} md={6}>
								<Card className={'goal-card'}>
									<CardContent>
										<Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
											<Box>
												<Typography variant="h6">Run 5K</Typography>
												<Typography variant="body2" color="text.secondary">
													Target: Run 5K without stopping
												</Typography>
											</Box>
											<Chip label="In Progress" color="warning" size="small" />
										</Stack>
										<Box sx={{ mt: 2 }}>
											<Stack direction="row" justifyContent="space-between" mb={1}>
												<Typography variant="body2">Progress</Typography>
												<Typography variant="body2">40%</Typography>
											</Stack>
											<LinearProgress variant="determinate" value={40} sx={{ height: 8, borderRadius: 4 }} />
										</Box>
										<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
											Current: 3K • Target: 5K
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12}>
								<Box className={'empty-goals-placeholder'} sx={{ textAlign: 'center', py: 4 }}>
									<Typography variant="body2" color="text.secondary" gutterBottom>
										No more active goals. Create a new one!
									</Typography>
									<Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }}>
										Create New Goal
									</Button>
								</Box>
							</Grid>
						</Grid>
					)}

					{/* Tab Content - Achievements */}
					{tabValue === 1 && (
						<Grid container spacing={3}>
							{/* Achievement Cards */}
							{[1, 2, 3, 4, 5, 6].map((item) => (
								<Grid item xs={12} sm={6} md={4} key={item}>
									<Card className={'achievement-card'}>
										<CardContent>
											<Stack direction="column" alignItems="center" spacing={2}>
												<Box className={'achievement-icon'} sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'primary.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
													<EmojiEventsIcon sx={{ fontSize: 40, color: 'white' }} />
												</Box>
												<Typography variant="h6" align="center">
													Achievement Name
												</Typography>
												<Typography variant="body2" color="text.secondary" align="center">
													{item % 2 === 0 ? 'Unlocked!' : 'Locked'}
												</Typography>
											</Stack>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					)}

					{/* Tab Content - Challenges */}
					{tabValue === 2 && (
						<Grid container spacing={3}>
							{[1, 2, 3].map((item) => (
								<Grid item xs={12} md={4} key={item}>
									<Card className={'challenge-card'}>
										<CardContent>
											<Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
												<Typography variant="h6">30-Day Challenge</Typography>
												<Chip label="Active" color="success" size="small" />
											</Stack>
											<Typography variant="body2" color="text.secondary" gutterBottom>
												Complete 30 workouts in 30 days
											</Typography>
											<Box sx={{ mt: 2 }}>
												<Stack direction="row" justifyContent="space-between" mb={1}>
													<Typography variant="body2">Progress</Typography>
													<Typography variant="body2">15/30</Typography>
												</Stack>
												<LinearProgress variant="determinate" value={50} sx={{ height: 8, borderRadius: 4 }} />
											</Box>
											<Stack direction="row" spacing={2} sx={{ mt: 2 }}>
												<Typography variant="caption" color="text.secondary">
													150 participants
												</Typography>
												<Typography variant="caption" color="text.secondary">
													15 days left
												</Typography>
											</Stack>
										</CardContent>
									</Card>
								</Grid>
							))}
							<Grid item xs={12} md={4}>
								<Card className={'challenge-card'} sx={{ border: '2px dashed', borderColor: 'divider' }}>
									<CardContent>
										<Stack direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{ minHeight: 200 }}>
											<AddIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
											<Typography variant="body2" color="text.secondary" align="center">
												Browse Available Challenges
											</Typography>
											<Button variant="outlined">View All</Button>
										</Stack>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(GoalsPage);






import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, LinearProgress, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const DashboardPage: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	if (device === 'mobile') {
		return (
			<Stack className={'dashboard-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Dashboard</Typography>
					<div>MOBILE DASHBOARD</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'dashboard-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'}>
						<Typography variant="h3" className={'page-title'}>
							Welcome back{user?.memberFullName ? `, ${user.memberFullName}` : ''}!
						</Typography>
						<Typography variant="body1" className={'page-subtitle'}>
							Here's your fitness overview for today
						</Typography>
					</Stack>

					{/* Stats Overview */}
					<Grid container spacing={3} sx={{ mb: 4 }}>
						<Grid item xs={12} sm={6} md={3}>
							<Card className={'stat-card'}>
								<CardContent>
									<Typography variant="body2" color="text.secondary" gutterBottom>
										Today's Workouts
									</Typography>
									<Typography variant="h4">0</Typography>
									<Typography variant="caption" color="text.secondary">
										Target: 1 workout
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Card className={'stat-card'}>
								<CardContent>
									<Typography variant="body2" color="text.secondary" gutterBottom>
										Calories Burned
									</Typography>
									<Typography variant="h4">0</Typography>
									<Typography variant="caption" color="text.secondary">
										Target: 500 cal
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Card className={'stat-card'}>
								<CardContent>
									<Typography variant="body2" color="text.secondary" gutterBottom>
										Active Goals
									</Typography>
									<Typography variant="h4">0</Typography>
									<Typography variant="caption" color="text.secondary">
										Keep pushing!
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Card className={'stat-card'}>
								<CardContent>
									<Typography variant="body2" color="text.secondary" gutterBottom>
										Current Streak
									</Typography>
									<Typography variant="h4">0 days</Typography>
									<Typography variant="caption" color="text.secondary">
										Start your streak!
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>

					<Grid container spacing={3}>
						{/* Today's Workout */}
						<Grid item xs={12} md={8}>
							<Card className={'widget-card'}>
								<CardContent>
									<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
										<Typography variant="h5">
											<FitnessCenterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
											Today's Workout
										</Typography>
										<Button size="small" startIcon={<AddIcon />}>
											Choose Workout
										</Button>
									</Stack>
									<Box className={'today-workout-placeholder'}>
										<Typography variant="body1" color="text.secondary" gutterBottom>
											No workout scheduled for today
										</Typography>
										<Link href="/workouts">
											<Button variant="contained" startIcon={<PlayArrowIcon />}>
												Browse Workouts
											</Button>
										</Link>
									</Box>
								</CardContent>
							</Card>
						</Grid>

						{/* Quick Actions */}
						<Grid item xs={12} md={4}>
							<Card className={'widget-card'}>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Quick Actions
									</Typography>
									<Stack spacing={2}>
										<Link href="/workouts">
											<Button variant="outlined" fullWidth startIcon={<PlayArrowIcon />}>
												Start Workout
											</Button>
										</Link>
										<Link href="/nutrition">
											<Button variant="outlined" fullWidth startIcon={<RestaurantIcon />}>
												Log Meal
											</Button>
										</Link>
										<Link href="/progress">
											<Button variant="outlined" fullWidth startIcon={<TrendingUpIcon />}>
												Track Progress
											</Button>
										</Link>
										<Link href="/bookings">
											<Button variant="outlined" fullWidth startIcon={<CalendarTodayIcon />}>
												Book Session
											</Button>
										</Link>
									</Stack>
								</CardContent>
							</Card>
						</Grid>

						{/* Nutrition Today */}
						<Grid item xs={12} md={6}>
							<Card className={'widget-card'}>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										<RestaurantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
										Nutrition Today
									</Typography>
									<Box sx={{ mt: 3 }}>
										<Typography variant="body2" gutterBottom>
											Calories: 0 / 2000
										</Typography>
										<LinearProgress variant="determinate" value={0} sx={{ height: 10, borderRadius: 5 }} />
										<Grid container spacing={2} sx={{ mt: 2 }}>
											<Grid item xs={4}>
												<Typography variant="caption" display="block">
													Protein
												</Typography>
												<Typography variant="h6">0g</Typography>
											</Grid>
											<Grid item xs={4}>
												<Typography variant="caption" display="block">
													Carbs
												</Typography>
												<Typography variant="h6">0g</Typography>
											</Grid>
											<Grid item xs={4}>
												<Typography variant="caption" display="block">
													Fats
												</Typography>
												<Typography variant="h6">0g</Typography>
											</Grid>
										</Grid>
									</Box>
								</CardContent>
							</Card>
						</Grid>

						{/* Active Goals */}
						<Grid item xs={12} md={6}>
							<Card className={'widget-card'}>
								<CardContent>
									<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
										<Typography variant="h6">
											<TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
											Active Goals
										</Typography>
										<Link href="/goals">
											<Button size="small">View All</Button>
										</Link>
									</Stack>
									<Box className={'goals-placeholder'}>
										<Typography variant="body2" color="text.secondary">
											No active goals. Create one to get started!
										</Typography>
										<Link href="/goals/create">
											<Button variant="outlined" size="small" sx={{ mt: 2 }}>
												Create Goal
											</Button>
										</Link>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(DashboardPage);






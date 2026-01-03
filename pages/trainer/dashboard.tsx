import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import {
	GET_TRAINER_CLIENTS,
	GET_USER_ASSIGNED_ROUTINES,
	GET_ROUTINE_COMPLETIONS,
	GET_BONUS_REWARDS,
	GET_BOOKINGS,
} from '../../apollo/user/query';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarsIcon from '@mui/icons-material/Stars';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Direction } from '../../libs/types/enums/common.enum';
import { format } from 'date-fns';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TrainerDashboard: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const [stats, setStats] = useState({
		totalClients: 0,
		activeAssignments: 0,
		completedThisWeek: 0,
		totalBonusPoints: 0,
		upcomingBookings: 0,
	});

	// Get trainer ID from user
	const trainerId = user?._id;

	// Fetch clients
	const { data: clientsData, loading: clientsLoading } = useQuery(GET_TRAINER_CLIENTS, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 1,
				trainerId: trainerId,
			},
		},
	});

	// Fetch active assignments
	const { data: assignmentsData, loading: assignmentsLoading } = useQuery(GET_USER_ASSIGNED_ROUTINES, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 100,
				trainerId: trainerId,
				sort: 'createdAt',
				direction: Direction.DESC,
			},
		},
	});

	// Fetch completions this week
	const weekStart = new Date();
	weekStart.setDate(weekStart.getDate() - 7);
	const { data: completionsData, loading: completionsLoading } = useQuery(GET_ROUTINE_COMPLETIONS, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 100,
				trainerId: trainerId,
				sort: 'completionDate',
				direction: Direction.DESC,
			},
		},
	});

	// Fetch bonus rewards
	const { data: bonusData, loading: bonusLoading } = useQuery(GET_BONUS_REWARDS, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 100,
				trainerId: trainerId,
				sort: 'earnedDate',
				direction: Direction.DESC,
			},
		},
	});

	// Fetch upcoming bookings
	const { data: bookingsData, loading: bookingsLoading } = useQuery(GET_BOOKINGS, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 10,
				providerId: trainerId,
				sort: 'bookingDate',
				direction: Direction.ASC,
			},
		},
	});

	useEffect(() => {
		if (clientsData?.getTrainerClients) {
			setStats((prev) => ({
				...prev,
				totalClients: clientsData.getTrainerClients.metaCounter[0]?.total || 0,
			}));
		}
	}, [clientsData]);

	useEffect(() => {
		if (assignmentsData?.getUserAssignedRoutines) {
			const active = assignmentsData.getUserAssignedRoutines.list.filter(
				(assignment: any) => assignment.status === 'IN_PROGRESS' || assignment.status === 'ASSIGNED'
			).length;
			setStats((prev) => ({
				...prev,
				activeAssignments: active,
			}));
		}
	}, [assignmentsData]);

	useEffect(() => {
		if (completionsData?.getRoutineCompletions) {
			const weekCompletions = completionsData.getRoutineCompletions.list.filter((completion: any) => {
				const completionDate = new Date(completion.completionDate);
				return completionDate >= weekStart;
			}).length;
			setStats((prev) => ({
				...prev,
				completedThisWeek: weekCompletions,
			}));
		}
	}, [completionsData]);

	useEffect(() => {
		if (bonusData?.getBonusRewards) {
			const totalPoints = bonusData.getBonusRewards.list.reduce(
				(sum: number, bonus: any) => sum + (bonus.pointsAwarded || 0),
				0
			);
			setStats((prev) => ({
				...prev,
				totalBonusPoints: totalPoints,
			}));
		}
	}, [bonusData]);

	useEffect(() => {
		if (bookingsData?.getBookings) {
			const upcoming = bookingsData.getBookings.list.filter((booking: any) => {
				const bookingDate = new Date(booking.bookingDate);
				return bookingDate >= new Date() && booking.bookingStatus !== 'CANCELLED';
			}).length;
			setStats((prev) => ({
				...prev,
				upcomingBookings: upcoming,
			}));
		}
	}, [bookingsData]);

	if (device === 'mobile') {
		return (
			<Stack className={'trainer-dashboard-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Trainer Dashboard</Typography>
					<div>MOBILE DASHBOARD</div>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'trainer-dashboard-page'}>
			<Stack className={'container'}>
				{/* Page Header */}
				<Stack className={'page-header'} sx={{ mb: 4 }}>
					<Typography variant="h3" className={'page-title'}>
						Trainer Dashboard
					</Typography>
					<Typography variant="body1" className={'page-subtitle'}>
						Manage your clients, routines, and track progress
					</Typography>
				</Stack>

				{/* Stats Cards */}
				<Grid container spacing={3} sx={{ mb: 4 }}>
					<Grid item xs={12} sm={6} md={4} lg={2.4}>
						<Card className={'stat-card'} sx={{ height: '100%' }}>
							<CardContent>
								<Stack direction="row" alignItems="center" spacing={2} mb={1}>
									<PeopleIcon color="primary" sx={{ fontSize: 40 }} />
									<Box>
										<Typography variant="body2" color="text.secondary" gutterBottom>
											Total Clients
										</Typography>
										<Typography variant="h4">
											{clientsLoading ? <CircularProgress size={24} /> : stats.totalClients}
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} md={4} lg={2.4}>
						<Card className={'stat-card'} sx={{ height: '100%' }}>
							<CardContent>
								<Stack direction="row" alignItems="center" spacing={2} mb={1}>
									<AssignmentIcon color="primary" sx={{ fontSize: 40 }} />
									<Box>
										<Typography variant="body2" color="text.secondary" gutterBottom>
											Active Assignments
										</Typography>
										<Typography variant="h4">
											{assignmentsLoading ? <CircularProgress size={24} /> : stats.activeAssignments}
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} md={4} lg={2.4}>
						<Card className={'stat-card'} sx={{ height: '100%' }}>
							<CardContent>
								<Stack direction="row" alignItems="center" spacing={2} mb={1}>
									<CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
									<Box>
										<Typography variant="body2" color="text.secondary" gutterBottom>
											Completed This Week
										</Typography>
										<Typography variant="h4">
											{completionsLoading ? <CircularProgress size={24} /> : stats.completedThisWeek}
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} md={4} lg={2.4}>
						<Card className={'stat-card'} sx={{ height: '100%' }}>
							<CardContent>
								<Stack direction="row" alignItems="center" spacing={2} mb={1}>
									<StarsIcon sx={{ fontSize: 40, color: '#FFD700' }} />
									<Box>
										<Typography variant="body2" color="text.secondary" gutterBottom>
											Bonus Points Awarded
										</Typography>
										<Typography variant="h4">
											{bonusLoading ? <CircularProgress size={24} /> : stats.totalBonusPoints}
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} md={4} lg={2.4}>
						<Card className={'stat-card'} sx={{ height: '100%' }}>
							<CardContent>
								<Stack direction="row" alignItems="center" spacing={2} mb={1}>
									<CalendarTodayIcon color="primary" sx={{ fontSize: 40 }} />
									<Box>
										<Typography variant="body2" color="text.secondary" gutterBottom>
											Upcoming Bookings
										</Typography>
										<Typography variant="h4">
											{bookingsLoading ? <CircularProgress size={24} /> : stats.upcomingBookings}
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				{/* Quick Actions */}
				<Grid container spacing={3}>
					<Grid item xs={12} md={8}>
						<Card className={'widget-card'}>
							<CardContent>
								<Typography variant="h5" gutterBottom>
									Quick Actions
								</Typography>
								<Grid container spacing={2} sx={{ mt: 2 }}>
									<Grid item xs={12} sm={6} md={3}>
										<Link href="/trainer/meal-plans/create">
											<Button variant="contained" fullWidth startIcon={<AddIcon />} size="large">
												Create Meal Plan
											</Button>
										</Link>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Link href="/trainer/workouts/create">
											<Button variant="contained" fullWidth startIcon={<AddIcon />} size="large">
												Create Workout
											</Button>
										</Link>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Link href="/trainer/assign-routine">
											<Button variant="outlined" fullWidth startIcon={<AssignmentIcon />} size="large">
												Assign Routine
											</Button>
										</Link>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Link href="/trainer/clients">
											<Button variant="outlined" fullWidth startIcon={<PeopleIcon />} size="large">
												View Clients
											</Button>
										</Link>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs={12} md={4}>
						<Card className={'widget-card'}>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Recent Activity
								</Typography>
								<Stack spacing={2} sx={{ mt: 2 }}>
									{completionsData?.getRoutineCompletions?.list?.slice(0, 5).map((completion: any) => (
										<Box key={completion._id} sx={{ p: 1, borderLeft: '3px solid', borderColor: 'primary.main' }}>
											<Typography variant="body2" fontWeight="bold">
												{completion.userData?.memberFullName || 'Client'} completed{' '}
												{completion.routineType === 'MEAL_PLAN' ? 'Meal Plan' : 'Workout'}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												{format(new Date(completion.completionDate), 'MMM dd, yyyy')}
											</Typography>
										</Box>
									))}
									{(!completionsData?.getRoutineCompletions?.list || completionsData.getRoutineCompletions.list.length === 0) && (
										<Typography variant="body2" color="text.secondary">
											No recent activity
										</Typography>
									)}
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(TrainerDashboard);


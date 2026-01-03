import React, { useState } from 'react';
import { NextPage } from 'next';
import {
	Stack,
	Box,
	Typography,
	Grid,
	Card,
	CardContent,
	CircularProgress,
	Tabs,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { useQuery } from '@apollo/client';
import {
	GET_TRAINER_CLIENTS,
	GET_USER_ASSIGNED_ROUTINES,
	GET_ROUTINE_COMPLETIONS,
	GET_BONUS_REWARDS,
	GET_TRAINER_WORKOUTS,
	GET_MEAL_PLANS,
} from '../../apollo/user/query';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarsIcon from '@mui/icons-material/Stars';
import { Direction } from '../../libs/types/enums/common.enum';
import { RoutineType } from '../../libs/types/routine-assignment/routine-assignment';
import { format } from 'date-fns';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TrainerAnalytics: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const trainerId = user?._id;
	const [activeTab, setActiveTab] = useState(0);

	// Fetch all data for analytics
	const { data: clientsData, loading: clientsLoading } = useQuery(GET_TRAINER_CLIENTS, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 1000,
				trainerId: trainerId,
			},
		},
	});

	const { data: assignmentsData, loading: assignmentsLoading } = useQuery(GET_USER_ASSIGNED_ROUTINES, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 1000,
				trainerId: trainerId,
			},
		},
	});

	const { data: completionsData, loading: completionsLoading } = useQuery(GET_ROUTINE_COMPLETIONS, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 1000,
				trainerId: trainerId,
			},
		},
	});

	const { data: bonusData, loading: bonusLoading } = useQuery(GET_BONUS_REWARDS, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 1000,
				trainerId: trainerId,
			},
		},
	});

	const { data: workoutsData, loading: workoutsLoading } = useQuery(GET_TRAINER_WORKOUTS, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 1000,
				createdBy: trainerId,
			},
		},
	});

	const { data: mealPlansData, loading: mealPlansLoading } = useQuery(GET_MEAL_PLANS, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 1000,
				search: {
					createdBy: trainerId,
				},
			},
		},
	});

	// Calculate statistics
	const totalClients = clientsData?.getTrainerClients?.metaCounter[0]?.total || 0;
	const assignments = assignmentsData?.getUserAssignedRoutines?.list || [];
	const completions = completionsData?.getRoutineCompletions?.list || [];
	const bonuses = bonusData?.getBonusRewards?.list || [];
	const workouts = workoutsData?.getTrainerWorkouts?.list || [];
	const mealPlans = mealPlansData?.getMealPlans?.list || [];

	// Calculate completion rate
	const totalAssignments = assignments.length;
	const completedAssignments = completions.length;
	const completionRate = totalAssignments > 0 ? ((completedAssignments / totalAssignments) * 100).toFixed(1) : '0';

	// Calculate dual-routine completion rate
	const dualRoutineBonuses = bonuses.filter((b: any) => b.bonusType === 'DUAL_ROUTINE').length;
	const totalBonuses = bonuses.length;
	const dualRoutineRate = totalBonuses > 0 ? ((dualRoutineBonuses / totalBonuses) * 100).toFixed(1) : '0';

	// Most assigned routines
	const mealPlanAssignments = assignments.filter((a: any) => a.routineType === RoutineType.MEAL_PLAN);
	const workoutAssignments = assignments.filter((a: any) => a.routineType === RoutineType.WORKOUT);

	const mealPlanCounts: Record<string, number> = {};
	mealPlanAssignments.forEach((a: any) => {
		const id = a.mealPlanId;
		mealPlanCounts[id] = (mealPlanCounts[id] || 0) + 1;
	});

	const workoutCounts: Record<string, number> = {};
	workoutAssignments.forEach((a: any) => {
		const id = a.workoutId;
		workoutCounts[id] = (workoutCounts[id] || 0) + 1;
	});

	const topMealPlans = Object.entries(mealPlanCounts)
		.map(([id, count]) => {
			const plan = mealPlans.find((p: any) => p._id === id);
			return { id, count, plan };
		})
		.filter((item) => item.plan)
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);

	const topWorkouts = Object.entries(workoutCounts)
		.map(([id, count]) => {
			const workout = workouts.find((w: any) => w._id === id);
			return { id, count, workout };
		})
		.filter((item) => item.workout)
		.sort((a, b) => b.count - a.count)
		.slice(0, 5);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'trainer-analytics-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Analytics</Typography>
					<div>MOBILE ANALYTICS PAGE</div>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'trainer-analytics-page'}>
			<Stack className={'container'}>
				{/* Page Header */}
				<Stack className={'page-header'} sx={{ mb: 4 }}>
					<Typography variant="h3" className={'page-title'}>
						Analytics & Reports
					</Typography>
					<Typography variant="body1" className={'page-subtitle'}>
						Track your performance and client engagement
					</Typography>
				</Stack>

				{/* Overview Stats */}
				<Grid container spacing={3} sx={{ mb: 4 }}>
					<Grid item xs={12} sm={6} md={3}>
						<Card>
							<CardContent>
								<Stack direction="row" alignItems="center" spacing={2}>
									<PeopleIcon color="primary" sx={{ fontSize: 40 }} />
									<Box>
										<Typography variant="body2" color="text.secondary">
											Total Clients
										</Typography>
										<Typography variant="h4">
											{clientsLoading ? <CircularProgress size={24} /> : totalClients}
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Card>
							<CardContent>
								<Stack direction="row" alignItems="center" spacing={2}>
									<CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
									<Box>
										<Typography variant="body2" color="text.secondary">
											Completion Rate
										</Typography>
										<Typography variant="h4">
											{assignmentsLoading || completionsLoading ? (
												<CircularProgress size={24} />
											) : (
												`${completionRate}%`
											)}
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Card>
							<CardContent>
								<Stack direction="row" alignItems="center" spacing={2}>
									<StarsIcon sx={{ fontSize: 40, color: '#FFD700' }} />
									<Box>
										<Typography variant="body2" color="text.secondary">
											Total Bonuses
										</Typography>
										<Typography variant="h4">
											{bonusLoading ? <CircularProgress size={24} /> : totalBonuses}
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Card>
							<CardContent>
								<Stack direction="row" alignItems="center" spacing={2}>
									<TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />
									<Box>
										<Typography variant="body2" color="text.secondary">
											Dual Routine Rate
										</Typography>
										<Typography variant="h4">
											{bonusLoading ? <CircularProgress size={24} /> : `${dualRoutineRate}%`}
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				{/* Tabs */}
				<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
					<Tabs value={activeTab} onChange={handleTabChange}>
						<Tab label="Client Engagement" />
						<Tab label="Content Performance" />
						<Tab label="Bonus Rewards" />
					</Tabs>
				</Box>

				{/* Client Engagement Tab */}
				{activeTab === 0 && (
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Active Clients Over Time
									</Typography>
									<Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<Typography color="text.secondary">Chart visualization would go here</Typography>
									</Box>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} md={6}>
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Assignment Completion Rate
									</Typography>
									<Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<Typography color="text.secondary">Chart visualization would go here</Typography>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				)}

				{/* Content Performance Tab */}
				{activeTab === 1 && (
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Most Assigned Meal Plans
									</Typography>
									{mealPlansLoading || assignmentsLoading ? (
										<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
											<CircularProgress />
										</Box>
									) : topMealPlans.length === 0 ? (
										<Typography color="text.secondary" sx={{ p: 2 }}>
											No meal plans assigned yet
										</Typography>
									) : (
										<TableContainer>
											<Table>
												<TableHead>
													<TableRow>
														<TableCell>Meal Plan</TableCell>
														<TableCell align="right">Assignments</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{topMealPlans.map((item) => (
														<TableRow key={item.id}>
															<TableCell>{item.plan.mealPlanTitle}</TableCell>
															<TableCell align="right">{item.count}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									)}
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} md={6}>
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Most Assigned Workouts
									</Typography>
									{workoutsLoading || assignmentsLoading ? (
										<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
											<CircularProgress />
										</Box>
									) : topWorkouts.length === 0 ? (
										<Typography color="text.secondary" sx={{ p: 2 }}>
											No workouts assigned yet
										</Typography>
									) : (
										<TableContainer>
											<Table>
												<TableHead>
													<TableRow>
														<TableCell>Workout</TableCell>
														<TableCell align="right">Assignments</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{topWorkouts.map((item) => (
														<TableRow key={item.id}>
															<TableCell>{item.workout.workoutTitle}</TableCell>
															<TableCell align="right">{item.count}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									)}
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				)}

				{/* Bonus Rewards Tab */}
				{activeTab === 2 && (
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Bonus Rewards Statistics
									</Typography>
									<Stack spacing={2} sx={{ mt: 2 }}>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Total Bonuses Awarded
											</Typography>
											<Typography variant="h4">{totalBonuses}</Typography>
										</Box>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Dual-Routine Completions
											</Typography>
											<Typography variant="h4">{dualRoutineBonuses}</Typography>
										</Box>
										<Box>
											<Typography variant="body2" color="text.secondary">
												Total Points Awarded
											</Typography>
											<Typography variant="h4">
												{bonuses.reduce((sum: number, b: any) => sum + (b.pointsAwarded || 0), 0)}
											</Typography>
										</Box>
									</Stack>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} md={6}>
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Recent Bonus Awards
									</Typography>
									{bonusLoading ? (
										<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
											<CircularProgress />
										</Box>
									) : bonuses.length === 0 ? (
										<Typography color="text.secondary" sx={{ p: 2 }}>
											No bonuses awarded yet
										</Typography>
									) : (
										<TableContainer>
											<Table size="small">
												<TableHead>
													<TableRow>
														<TableCell>Date</TableCell>
														<TableCell>Type</TableCell>
														<TableCell align="right">Points</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{bonuses.slice(0, 10).map((bonus: any) => (
														<TableRow key={bonus._id}>
															<TableCell>{format(new Date(bonus.earnedDate), 'MMM dd, yyyy')}</TableCell>
															<TableCell>{bonus.bonusType}</TableCell>
															<TableCell align="right">+{bonus.pointsAwarded}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									)}
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(TrainerAnalytics);


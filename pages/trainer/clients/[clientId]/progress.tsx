import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import {
	Stack,
	Box,
	Typography,
	Button,
	Grid,
	Card,
	CardContent,
	Avatar,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Tabs,
	Tab,
	CircularProgress,
} from '@mui/material';
import useDeviceDetect from '../../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../../apollo/store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import {
	GET_MEMBER,
	GET_USER_ASSIGNED_ROUTINES,
	GET_ROUTINE_COMPLETIONS,
	GET_BONUS_REWARDS,
} from '../../../../apollo/user/query';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarsIcon from '@mui/icons-material/Stars';
import { Direction } from '../../../../libs/types/enums/common.enum';
import { RoutineType } from '../../../../libs/types/routine-assignment/routine-assignment';
import { format } from 'date-fns';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ClientProgress: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const { clientId } = router.query;
	const trainerId = user?._id;
	const [activeTab, setActiveTab] = useState(0);

	// Fetch client data
	const { data: clientData, loading: clientLoading } = useQuery(GET_MEMBER, {
		skip: !clientId || typeof clientId !== 'string',
		variables: {
			input: clientId as string,
		},
	});

	// Fetch assigned routines
	const { data: assignmentsData, loading: assignmentsLoading } = useQuery(GET_USER_ASSIGNED_ROUTINES, {
		skip: !clientId || !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 100,
				userId: clientId as string,
				trainerId: trainerId,
				sort: 'createdAt',
				direction: Direction.DESC,
			},
		},
	});

	// Fetch completions
	const { data: completionsData, loading: completionsLoading } = useQuery(GET_ROUTINE_COMPLETIONS, {
		skip: !clientId || !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 100,
				userId: clientId as string,
				trainerId: trainerId,
				sort: 'completionDate',
				direction: Direction.DESC,
			},
		},
	});

	// Fetch bonus rewards
	const { data: bonusData, loading: bonusLoading } = useQuery(GET_BONUS_REWARDS, {
		skip: !clientId || !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 100,
				userId: clientId as string,
				trainerId: trainerId,
				sort: 'earnedDate',
				direction: Direction.DESC,
			},
		},
	});

	const client = clientData?.getMember;
	const assignments = assignmentsData?.getUserAssignedRoutines?.list || [];
	const completions = completionsData?.getRoutineCompletions?.list || [];
	const bonuses = bonusData?.getBonusRewards?.list || [];

	const activeAssignments = assignments.filter(
		(a: any) => a.status === 'ASSIGNED' || a.status === 'IN_PROGRESS'
	);
	const completedAssignments = assignments.filter((a: any) => a.status === 'COMPLETED');

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'client-progress-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Client Progress</Typography>
					<div>MOBILE CLIENT PROGRESS PAGE</div>
				</Stack>
			</Stack>
		);
	}

	if (clientLoading) {
		return (
			<Stack className={'client-progress-page'}>
				<Stack className={'container'}>
					<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
						<CircularProgress />
					</Box>
				</Stack>
			</Stack>
		);
	}

	if (!client) {
		return (
			<Stack className={'client-progress-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Client not found</Typography>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'client-progress-page'}>
			<Stack className={'container'}>
				{/* Back Button */}
				<Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/trainer/clients')} sx={{ mb: 2 }}>
					Back to Clients
				</Button>

				{/* Client Info Card */}
				<Card sx={{ mb: 4 }}>
					<CardContent>
						<Stack direction="row" spacing={3} alignItems="center">
							<Avatar
								src={client.memberImage}
								alt={client.memberFullName || client.memberNick}
								sx={{ width: 100, height: 100 }}
							>
								{client.memberFullName?.[0] || client.memberNick?.[0] || 'C'}
							</Avatar>
							<Box sx={{ flexGrow: 1 }}>
								<Typography variant="h4" gutterBottom>
									{client.memberFullName || client.memberNick || 'Unknown Client'}
								</Typography>
								<Typography variant="body1" color="text.secondary" gutterBottom>
									{client.memberDesc || 'No description'}
								</Typography>
								<Stack direction="row" spacing={2} sx={{ mt: 2 }}>
									<Chip label={`${client.memberPoints || 0} Points`} color="primary" />
									<Chip label={`${activeAssignments.length} Active Assignments`} color="success" />
									<Chip label={`${completedAssignments.length} Completed`} color="default" />
									<Chip label={`${bonuses.length} Bonuses Earned`} sx={{ bgcolor: '#FFD700', color: 'black' }} />
								</Stack>
							</Box>
							<Stack spacing={2}>
								<Link href={`/trainer/assign-routine?clientId=${clientId}`}>
									<Button variant="contained" startIcon={<AssignmentIcon />}>
										Assign Routine
									</Button>
								</Link>
							</Stack>
						</Stack>
					</CardContent>
				</Card>

				{/* Tabs */}
				<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
					<Tabs value={activeTab} onChange={handleTabChange}>
						<Tab label="Active Assignments" />
						<Tab label="Completion History" />
						<Tab label="Bonus Rewards" />
					</Tabs>
				</Box>

				{/* Active Assignments Tab */}
				{activeTab === 0 && (
					<Card>
						<CardContent>
							{assignmentsLoading ? (
								<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
									<CircularProgress />
								</Box>
							) : activeAssignments.length === 0 ? (
								<Box sx={{ textAlign: 'center', p: 4 }}>
									<AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
									<Typography variant="h6" color="text.secondary">
										No active assignments
									</Typography>
									<Link href={`/trainer/assign-routine?clientId=${clientId}`}>
										<Button variant="contained" sx={{ mt: 2 }}>
											Assign a Routine
										</Button>
									</Link>
								</Box>
							) : (
								<TableContainer>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Type</TableCell>
												<TableCell>Routine</TableCell>
												<TableCell>Start Date</TableCell>
												<TableCell>End Date</TableCell>
												<TableCell>Progress</TableCell>
												<TableCell>Status</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{activeAssignments.map((assignment: any) => (
												<TableRow key={assignment._id}>
													<TableCell>
														<Chip
															label={assignment.routineType === RoutineType.MEAL_PLAN ? 'Meal Plan' : 'Workout'}
															color={assignment.routineType === RoutineType.MEAL_PLAN ? 'primary' : 'secondary'}
															size="small"
														/>
													</TableCell>
													<TableCell>
														{assignment.mealPlanData?.mealPlanTitle || assignment.workoutData?.workoutTitle || 'N/A'}
													</TableCell>
													<TableCell>{format(new Date(assignment.startDate), 'MMM dd, yyyy')}</TableCell>
													<TableCell>
														{assignment.endDate ? format(new Date(assignment.endDate), 'MMM dd, yyyy') : 'Ongoing'}
													</TableCell>
													<TableCell>
														<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
															<Box sx={{ width: 100, bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
																<Box
																	sx={{
																		width: `${assignment.progressPercentage || 0}%`,
																		bgcolor: 'primary.main',
																		height: 8,
																		borderRadius: 1,
																	}}
																/>
															</Box>
															<Typography variant="body2">{assignment.progressPercentage || 0}%</Typography>
														</Box>
													</TableCell>
													<TableCell>
														<Chip
															label={assignment.status}
															color={
																assignment.status === 'COMPLETED'
																	? 'success'
																	: assignment.status === 'IN_PROGRESS'
																	? 'warning'
																	: 'default'
															}
															size="small"
														/>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							)}
						</CardContent>
					</Card>
				)}

				{/* Completion History Tab */}
				{activeTab === 1 && (
					<Card>
						<CardContent>
							{completionsLoading ? (
								<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
									<CircularProgress />
								</Box>
							) : completions.length === 0 ? (
								<Box sx={{ textAlign: 'center', p: 4 }}>
									<CheckCircleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
									<Typography variant="h6" color="text.secondary">
										No completions yet
									</Typography>
								</Box>
							) : (
								<TableContainer>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Date</TableCell>
												<TableCell>Type</TableCell>
												<TableCell>Routine</TableCell>
												<TableCell>Rating</TableCell>
												<TableCell>Notes</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{completions.map((completion: any) => (
												<TableRow key={completion._id}>
													<TableCell>{format(new Date(completion.completionDate), 'MMM dd, yyyy')}</TableCell>
													<TableCell>
														<Chip
															label={completion.routineType === RoutineType.MEAL_PLAN ? 'Meal Plan' : 'Workout'}
															color={completion.routineType === RoutineType.MEAL_PLAN ? 'primary' : 'secondary'}
															size="small"
														/>
													</TableCell>
													<TableCell>
														{completion.mealPlanData?.mealPlanTitle || completion.workoutData?.workoutTitle || 'N/A'}
													</TableCell>
													<TableCell>
														{completion.rating ? (
															<Chip
																icon={<StarsIcon />}
																label={completion.rating}
																color="primary"
																size="small"
															/>
														) : (
															'-'
														)}
													</TableCell>
													<TableCell>{completion.notes || '-'}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							)}
						</CardContent>
					</Card>
				)}

				{/* Bonus Rewards Tab */}
				{activeTab === 2 && (
					<Card>
						<CardContent>
							{bonusLoading ? (
								<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
									<CircularProgress />
								</Box>
							) : bonuses.length === 0 ? (
								<Box sx={{ textAlign: 'center', p: 4 }}>
									<StarsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
									<Typography variant="h6" color="text.secondary">
										No bonus rewards yet
									</Typography>
								</Box>
							) : (
								<Grid container spacing={2}>
									{bonuses.map((bonus: any) => (
										<Grid item xs={12} sm={6} md={4} key={bonus._id}>
											<Card
												sx={{
													bgcolor: bonus.bonusType === 'DUAL_ROUTINE' ? '#FFD700' : 'background.paper',
													border: bonus.bonusType === 'DUAL_ROUTINE' ? '2px solid #FFD700' : '1px solid',
													borderColor: 'divider',
												}}
											>
												<CardContent>
													<Stack direction="row" alignItems="center" spacing={2} mb={1}>
														<StarsIcon sx={{ color: bonus.bonusType === 'DUAL_ROUTINE' ? 'black' : 'primary.main' }} />
														<Typography variant="h6">
															{bonus.bonusType === 'DUAL_ROUTINE' ? 'Dual Routine Bonus' : bonus.bonusType}
														</Typography>
													</Stack>
													<Typography variant="h4" color="primary" gutterBottom>
														+{bonus.pointsAwarded} Points
													</Typography>
													<Typography variant="body2" color="text.secondary">
														{format(new Date(bonus.earnedDate), 'MMM dd, yyyy')}
													</Typography>
													{bonus.description && (
														<Typography variant="body2" sx={{ mt: 1 }}>
															{bonus.description}
														</Typography>
													)}
												</CardContent>
											</Card>
										</Grid>
									))}
								</Grid>
							)}
						</CardContent>
					</Card>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(ClientProgress);


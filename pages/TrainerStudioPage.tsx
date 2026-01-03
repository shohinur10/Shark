import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import {
	Container,
	Box,
	Typography,
	Button,
	Stack,
	Card,
	CardContent,
	Chip,
	Alert,
	Grid,
	Tabs,
	Tab,
	Avatar,
	LinearProgress,
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Divider,
	Paper,
	Skeleton,
	Tooltip,
	Badge,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import {
	GET_USER_ASSIGNED_ROUTINES,
	GET_ROUTINE_COMPLETIONS,
	GET_TRAINER_CLIENTS,
} from '../apollo/user/query';
import {
	RoutineAssignment,
	AssignmentStatus,
	RoutineType,
} from '../libs/types/routine-assignment/routine-assignment';
import { RoutineCompletion } from '../libs/types/routine-assignment/routine-completion';
import { Direction } from '../libs/enums/common.enum';
import { format, isAfter, isBefore, startOfWeek, endOfWeek } from 'date-fns';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TrainerStudioPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [tabValue, setTabValue] = useState(0);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedAssignment, setSelectedAssignment] = useState<RoutineAssignment | null>(null);

	// Redirect if not trainer
	React.useEffect(() => {
		if (user?.memberType !== 'TRAINER') {
			router.push('/trainer');
		}
	}, [user, router]);

	const trainerId = user?._id || '';

	// Build query input based on selected tab
	const assignmentsInput = useMemo(
		() => {
			const baseInput: any = {
				page: 1,
				limit: 100,
				trainerId: trainerId,
				sort: 'createdAt',
				direction: Direction.DESC,
			};

			// Tab 0: All
			// Tab 1: Active (ASSIGNED, IN_PROGRESS)
			// Tab 2: Completed
			// Tab 3: Meal Plans
			// Tab 4: Workouts

			if (tabValue === 2) {
				return { ...baseInput, status: AssignmentStatus.COMPLETED };
			} else if (tabValue === 3) {
				return { ...baseInput, routineType: RoutineType.MEAL_PLAN };
			} else if (tabValue === 4) {
				return { ...baseInput, routineType: RoutineType.WORKOUT };
			}

			return baseInput;
		},
		[trainerId, tabValue],
	);

	// Fetch routine assignments
	const {
		data: assignmentsData,
		loading: assignmentsLoading,
		error: assignmentsError,
		refetch: refetchAssignments,
	} = useQuery(GET_USER_ASSIGNED_ROUTINES, {
		variables: { input: assignmentsInput },
		fetchPolicy: 'cache-and-network',
		skip: !trainerId,
	});

	// Fetch routine completions with trainerId
	const completionsInput = useMemo(
		() => ({
			page: 1,
			limit: 100,
			trainerId: trainerId,
			sort: 'completionDate',
			direction: Direction.DESC,
		}),
		[trainerId],
	);

	const {
		data: completionsData,
		loading: completionsLoading,
		error: completionsError,
	} = useQuery(GET_ROUTINE_COMPLETIONS, {
		variables: { input: completionsInput },
		fetchPolicy: 'cache-and-network',
		skip: !trainerId,
	});

	// Fetch trainer clients
	const {
		data: clientsData,
		loading: clientsLoading,
		error: clientsError,
	} = useQuery(GET_TRAINER_CLIENTS, {
		skip: !trainerId,
	});

	// Process assignments data
	const assignments = (assignmentsData?.getUserAssignedRoutines?.list || []) as RoutineAssignment[];
	const totalAssignments = Array.isArray(assignmentsData?.getUserAssignedRoutines?.metaCounter)
		? assignmentsData?.getUserAssignedRoutines?.metaCounter[0]?.total || 0
		: assignmentsData?.getUserAssignedRoutines?.metaCounter || 0;

	// Filter assignments based on tab
	const filteredAssignments = useMemo(() => {
		if (tabValue === 1) {
			// Active assignments
			return assignments.filter(
				(assignment) =>
					assignment.status === AssignmentStatus.ASSIGNED ||
					assignment.status === AssignmentStatus.IN_PROGRESS,
			);
		}
		return assignments;
	}, [assignments, tabValue]);

	// Process completions data
	const completions = (completionsData?.getRoutineCompletions?.list || []) as RoutineCompletion[];

	// Process clients data
	const clients = clientsData?.getTrainerClients || [];

	// Calculate stats
	const stats = useMemo(() => {
		const activeAssignments = assignments.filter(
			(a) => a.status === AssignmentStatus.ASSIGNED || a.status === AssignmentStatus.IN_PROGRESS,
		).length;
		const completedAssignments = assignments.filter(
			(a) => a.status === AssignmentStatus.COMPLETED,
		).length;
		const totalClients = Array.isArray(clients) ? clients.length : 0;

		// Calculate this week's completions
		const now = new Date();
		const weekStart = startOfWeek(now, { weekStartsOn: 1 });
		const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
		const thisWeekCompletions = completions.filter((c) => {
			const completionDate = new Date(c.completionDate);
			return isAfter(completionDate, weekStart) && isBefore(completionDate, weekEnd);
		}).length;

		return {
			totalClients,
			activeAssignments,
			completedAssignments,
			thisWeekCompletions,
		};
	}, [assignments, completions, clients]);

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, assignment: RoutineAssignment) => {
		setAnchorEl(event.currentTarget);
		setSelectedAssignment(assignment);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedAssignment(null);
	};

	const getStatusColor = (status: AssignmentStatus): 'success' | 'info' | 'warning' | 'error' | 'default' => {
		switch (status) {
			case AssignmentStatus.COMPLETED:
				return 'success';
			case AssignmentStatus.IN_PROGRESS:
				return 'info';
			case AssignmentStatus.ASSIGNED:
				return 'warning';
			case AssignmentStatus.CANCELLED:
				return 'error';
			default:
				return 'default';
		}
	};

	const getStatusIcon = (status: AssignmentStatus) => {
		switch (status) {
			case AssignmentStatus.COMPLETED:
				return <CheckCircleIcon fontSize="small" />;
			case AssignmentStatus.IN_PROGRESS:
				return <PlayArrowIcon fontSize="small" />;
			case AssignmentStatus.ASSIGNED:
				return <PendingIcon fontSize="small" />;
			case AssignmentStatus.CANCELLED:
				return <CancelIcon fontSize="small" />;
			default:
				return null;
		}
	};

	const getDaysRemaining = (endDate?: Date | string): number | null => {
		if (!endDate) return null;
		const end = new Date(endDate);
		const now = new Date();
		const diffTime = end.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	if (user?.memberType !== 'TRAINER') {
		return (
			<Container>
				<Alert severity="warning">You must be a trainer to access this page.</Alert>
			</Container>
		);
	}

	// Show errors if any
	if (assignmentsError || completionsError || clientsError) {
		return (
			<Container>
				<Alert severity="error" sx={{ mb: 2 }}>
					Error loading data. Please try refreshing the page.
				</Alert>
				<Button variant="contained" onClick={() => window.location.reload()}>
					Refresh Page
				</Button>
			</Container>
		);
	}

	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
			{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 700, color: '#212121', mb: 1 }}>
							Trainer Studio
						</Typography>
						<Typography variant="body2" sx={{ color: '#757575' }}>
							Manage your routine assignments and track client progress
						</Typography>
					</Box>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={() => router.push('/trainer/assign-routine')}
						sx={{
							backgroundColor: '#E10600',
							'&:hover': { backgroundColor: '#C10500' },
							textTransform: 'none',
							fontWeight: 600,
							px: 3,
							py: 1.5,
						}}
					>
						Assign Routine
					</Button>
				</Stack>

				{/* Stats Cards */}
				<Grid container spacing={3} sx={{ mb: 4 }}>
					<Grid item xs={12} sm={6} md={3}>
						<Card
							sx={{
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								color: 'white',
								height: '100%',
								transition: 'transform 0.2s',
								'&:hover': { transform: 'translateY(-4px)' },
							}}
						>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Box>
										<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
											{clientsLoading ? '...' : stats.totalClients}
										</Typography>
										<Typography variant="body2" sx={{ opacity: 0.9 }}>
											Total Clients
										</Typography>
									</Box>
									<PeopleIcon sx={{ fontSize: 48, opacity: 0.3 }} />
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Card
							sx={{
								background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
								color: 'white',
								height: '100%',
								transition: 'transform 0.2s',
								'&:hover': { transform: 'translateY(-4px)' },
							}}
						>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Box>
										<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
											{assignmentsLoading ? '...' : stats.activeAssignments}
										</Typography>
										<Typography variant="body2" sx={{ opacity: 0.9 }}>
											Active Assignments
										</Typography>
									</Box>
									<AssignmentIcon sx={{ fontSize: 48, opacity: 0.3 }} />
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Card
							sx={{
								background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
								color: 'white',
								height: '100%',
								transition: 'transform 0.2s',
								'&:hover': { transform: 'translateY(-4px)' },
							}}
						>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Box>
										<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
											{assignmentsLoading ? '...' : stats.completedAssignments}
										</Typography>
										<Typography variant="body2" sx={{ opacity: 0.9 }}>
											Completed
										</Typography>
									</Box>
									<CheckCircleIcon sx={{ fontSize: 48, opacity: 0.3 }} />
								</Stack>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Card
							sx={{
								background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
								color: 'white',
								height: '100%',
								transition: 'transform 0.2s',
								'&:hover': { transform: 'translateY(-4px)' },
							}}
						>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center">
									<Box>
										<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
											{completionsLoading ? '...' : stats.thisWeekCompletions}
										</Typography>
										<Typography variant="body2" sx={{ opacity: 0.9 }}>
											This Week
										</Typography>
									</Box>
									<TrendingUpIcon sx={{ fontSize: 48, opacity: 0.3 }} />
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Box>

			{/* Tabs */}
			<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
				<Tabs
					value={tabValue}
					onChange={(_e: React.SyntheticEvent, newValue: number) => setTabValue(newValue)}
					variant="scrollable"
					scrollButtons="auto"
				>
					<Tab label="All Routines" />
					<Tab
						label={
							<Badge badgeContent={stats.activeAssignments} color="error">
								Active
							</Badge>
						}
					/>
					<Tab label="Completed" />
					<Tab label="Meal Plans" />
					<Tab label="Workouts" />
				</Tabs>
			</Box>

			{/* Routines List */}
			{assignmentsLoading ? (
				<Grid container spacing={3}>
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Grid item xs={12} md={6} lg={4} key={i}>
							<Card>
								<CardContent>
									<Skeleton variant="text" width="60%" height={32} />
									<Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
									<Skeleton variant="rectangular" width="100%" height={120} />
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			) : filteredAssignments.length === 0 ? (
				<Box sx={{ textAlign: 'center', py: 8 }}>
					<AssignmentIcon sx={{ fontSize: 64, color: '#BDBDBD', mb: 2 }} />
					<Typography variant="h6" sx={{ mb: 2, color: '#757575' }}>
						No routine assignments found
					</Typography>
					<Typography variant="body2" sx={{ mb: 3, color: '#9E9E9E' }}>
						{tabValue === 1
							? 'No active assignments at the moment'
							: tabValue === 2
							? 'No completed assignments yet'
							: 'Start by assigning a routine to one of your clients'}
					</Typography>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={() => router.push('/trainer/assign-routine')}
						sx={{
							backgroundColor: '#E10600',
							'&:hover': { backgroundColor: '#C10500' },
							textTransform: 'none',
						}}
					>
						Assign Your First Routine
					</Button>
				</Box>
			) : (
				<Grid container spacing={3}>
					{filteredAssignments.map((assignment) => {
						const routineTitle =
							assignment.routineType === RoutineType.MEAL_PLAN
								? assignment.mealPlanData?.mealPlanTitle
								: assignment.workoutData?.workoutTitle;
						const routineDesc =
							assignment.routineType === RoutineType.MEAL_PLAN
								? assignment.mealPlanData?.mealPlanDesc
								: assignment.workoutData?.workoutDesc;
						const daysRemaining = getDaysRemaining(assignment.endDate);

						return (
							<Grid item xs={12} md={6} lg={4} key={assignment._id}>
								<Card
									sx={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										transition: 'all 0.3s ease',
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: 6,
										},
									}}
								>
									<CardContent sx={{ flexGrow: 1, p: 3 }}>
										{/* Header with Icon and Title */}
										<Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
											<Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
												<Box
													sx={{
														p: 1.5,
														borderRadius: 2,
														backgroundColor:
															assignment.routineType === RoutineType.MEAL_PLAN
																? '#FFE5E5'
																: '#E0F7FA',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													{assignment.routineType === RoutineType.MEAL_PLAN ? (
														<RestaurantIcon
															sx={{
																color: '#FF6B6B',
																fontSize: 32,
															}}
														/>
													) : (
														<FitnessCenterIcon
															sx={{
																color: '#4ECDC4',
																fontSize: 32,
															}}
														/>
													)}
												</Box>
												<Box sx={{ flex: 1, minWidth: 0 }}>
													<Typography
														variant="h6"
														sx={{
															fontWeight: 700,
															mb: 0.5,
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															whiteSpace: 'nowrap',
														}}
													>
														{routineTitle || 'Untitled Routine'}
													</Typography>
													<Chip
														label={assignment.routineType === RoutineType.MEAL_PLAN ? 'Meal Plan' : 'Workout'}
														size="small"
														sx={{
															backgroundColor:
																assignment.routineType === RoutineType.MEAL_PLAN
																	? '#FFE5E5'
																	: '#E0F7FA',
															color: assignment.routineType === RoutineType.MEAL_PLAN ? '#FF6B6B' : '#4ECDC4',
															fontWeight: 600,
															height: 24,
														}}
													/>
												</Box>
											</Stack>
											<IconButton
												size="small"
												onClick={(e: React.MouseEvent<HTMLElement>) => handleMenuOpen(e, assignment)}
												sx={{ ml: 1 }}
											>
												<MoreVertIcon />
											</IconButton>
										</Stack>

										{/* Client Info */}
										{assignment.userData && (
											<Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
												<Avatar
													src={assignment.userData.memberImage}
													sx={{ width: 36, height: 36 }}
												>
													<PersonIcon />
												</Avatar>
												<Box sx={{ flex: 1, minWidth: 0 }}>
													<Typography
														variant="body2"
														sx={{
															color: '#757575',
															fontWeight: 600,
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															whiteSpace: 'nowrap',
														}}
													>
														{assignment.userData.memberNick || assignment.userData.memberFullName || 'Client'}
													</Typography>
												</Box>
											</Stack>
										)}

										{/* Description */}
										{routineDesc && (
											<Typography
												variant="body2"
												sx={{
													color: '#616161',
													mb: 2,
													display: '-webkit-box',
													WebkitLineClamp: 2,
													WebkitBoxOrient: 'vertical',
													overflow: 'hidden',
													minHeight: 40,
												}}
											>
												{routineDesc}
											</Typography>
										)}

										{/* Status and Progress */}
										<Stack spacing={1.5} sx={{ mb: 2 }}>
											<Stack direction="row" justifyContent="space-between" alignItems="center">
												<Chip
													icon={getStatusIcon(assignment.status)}
													label={assignment.status.replace('_', ' ')}
													color={getStatusColor(assignment.status)}
													size="small"
													sx={{ fontWeight: 600 }}
												/>
												{assignment.priority && (
													<Tooltip title={`Priority Level: ${assignment.priority}/5`}>
														<Stack direction="row" spacing={0.5} alignItems="center">
															<StarIcon sx={{ fontSize: 16, color: '#FFD700' }} />
															<Typography variant="caption" sx={{ color: '#757575', fontWeight: 600 }}>
																{assignment.priority}
															</Typography>
														</Stack>
													</Tooltip>
												)}
											</Stack>

											{assignment.status === AssignmentStatus.IN_PROGRESS && (
												<Box>
													<Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
														<Typography variant="caption" sx={{ color: '#757575', fontWeight: 500 }}>
															Progress
														</Typography>
														<Typography variant="caption" sx={{ color: '#757575', fontWeight: 700 }}>
															{assignment.progressPercentage || 0}%
														</Typography>
													</Stack>
													<LinearProgress
														variant="determinate"
														value={assignment.progressPercentage || 0}
														sx={{
															height: 10,
															borderRadius: 5,
															backgroundColor: '#E0E0E0',
															'& .MuiLinearProgress-bar': {
																borderRadius: 5,
																backgroundColor: '#4ECDC4',
															},
														}}
													/>
												</Box>
											)}
										</Stack>

										{/* Dates and Time Remaining */}
										<Stack spacing={1} sx={{ mb: 2 }}>
											<Stack direction="row" spacing={1} alignItems="center">
												<CalendarTodayIcon sx={{ fontSize: 18, color: '#9E9E9E' }} />
												<Typography variant="caption" sx={{ color: '#757575' }}>
													Start: {format(new Date(assignment.startDate), 'MMM dd, yyyy')}
												</Typography>
											</Stack>
											{assignment.endDate && (
												<Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
													<Stack direction="row" spacing={1} alignItems="center">
														<CalendarTodayIcon sx={{ fontSize: 18, color: '#9E9E9E' }} />
														<Typography variant="caption" sx={{ color: '#757575' }}>
															End: {format(new Date(assignment.endDate), 'MMM dd, yyyy')}
														</Typography>
													</Stack>
													{daysRemaining !== null && (
														<Chip
															icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
															label={`${daysRemaining > 0 ? daysRemaining : 0} days left`}
															size="small"
															color={daysRemaining < 7 ? 'error' : daysRemaining < 14 ? 'warning' : 'default'}
															sx={{ height: 22, fontSize: '0.7rem' }}
														/>
													)}
												</Stack>
											)}
										</Stack>

										{/* Trainer Notes */}
										{assignment.trainerNotes && (
											<Paper
												sx={{
													mt: 2,
													p: 1.5,
													backgroundColor: '#F5F5F5',
													borderLeft: '3px solid #E10600',
													borderRadius: 1,
												}}
											>
												<Typography
													variant="caption"
													sx={{ color: '#616161', fontWeight: 600, display: 'block', mb: 0.5 }}
												>
													Trainer Notes:
												</Typography>
												<Typography variant="body2" sx={{ color: '#757575', fontSize: '0.85rem' }}>
													{assignment.trainerNotes}
												</Typography>
											</Paper>
										)}
									</CardContent>
								</Card>
							</Grid>
						);
					})}
				</Grid>
			)}

			{/* Context Menu */}
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
				<MenuItem
					onClick={() => {
						if (selectedAssignment) {
							router.push(`/trainer/clients/${selectedAssignment.userId}/progress`);
						}
						handleMenuClose();
					}}
				>
					<ListItemIcon>
						<TrendingUpIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>View Progress</ListItemText>
				</MenuItem>
				<MenuItem
					onClick={() => {
						if (selectedAssignment) {
							router.push(`/trainer/clients/${selectedAssignment.userId}`);
						}
						handleMenuClose();
					}}
				>
					<ListItemIcon>
						<PersonIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>View Client</ListItemText>
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleMenuClose}>
					<ListItemIcon>
						<CancelIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText>Cancel</ListItemText>
				</MenuItem>
			</Menu>
		</Container>
	);
};

export default withLayoutBasic(TrainerStudioPage);

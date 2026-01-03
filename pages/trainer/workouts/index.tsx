import React, { useState, ChangeEvent } from 'react';
import { NextPage } from 'next';
import {
	Stack,
	Box,
	Typography,
	Button,
	Grid,
	Card,
	CardContent,
	CardMedia,
	TextField,
	InputAdornment,
	Chip,
	Pagination,
	CircularProgress,
	Tabs,
	Tab,
} from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_TRAINER_WORKOUTS } from '../../../apollo/user/query';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Direction } from '../../../libs/types/enums/common.enum';
import { WorkoutStatus } from '../../../libs/enums/workout.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TrainerWorkouts: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const trainerId = user?._id;
	const [searchText, setSearchText] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [filterStatus, setFilterStatus] = useState<WorkoutStatus | 'all'>('all');
	const limit = 12;

	// Fetch workouts
	const { data: workoutsData, loading: workoutsLoading, refetch: refetchWorkouts } = useQuery(GET_TRAINER_WORKOUTS, {
		skip: !trainerId,
		variables: {
			input: {
				page: currentPage,
				limit: limit,
				createdBy: trainerId,
				sort: 'createdAt',
				direction: Direction.DESC,
			},
		},
	});

	const workouts = workoutsData?.getTrainerWorkouts?.list || [];
	const totalWorkouts = workoutsData?.getTrainerWorkouts?.metaCounter[0]?.total || 0;

	// Filter by status
	const filteredWorkouts = workouts.filter((workout: any) => {
		if (filterStatus === 'all') return true;
		return workout.workoutStatus === filterStatus;
	});

	const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setCurrentPage(1);
			refetchWorkouts();
		}
	};

	const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
	};

	const handleStatusFilter = (event: React.SyntheticEvent, newValue: WorkoutStatus | 'all') => {
		setFilterStatus(newValue);
		setCurrentPage(1);
	};

	const getStatusColor = (status: WorkoutStatus) => {
		switch (status) {
			case WorkoutStatus.PUBLISHED:
				return 'success';
			case WorkoutStatus.DRAFT:
				return 'warning';
			case WorkoutStatus.ARCHIVED:
				return 'default';
			default:
				return 'default';
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'trainer-workouts-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">My Workouts</Typography>
					<div>MOBILE WORKOUTS PAGE</div>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'trainer-workouts-page'}>
			<Stack className={'container'}>
				{/* Page Header */}
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
					<Box>
						<Typography variant="h3" className={'page-title'}>
							My Workouts
						</Typography>
						<Typography variant="body1" className={'page-subtitle'}>
							Create and manage your workout routines
						</Typography>
					</Box>
					<Link href="/trainer/workouts/create">
						<Button variant="contained" startIcon={<AddIcon />} size="large">
							Create Workout
						</Button>
					</Link>
				</Stack>

				{/* Filters and Search */}
				<Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center" justifyContent="space-between">
					<TextField
						placeholder="Search workouts..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={handleSearch}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
						sx={{ flexGrow: 1, maxWidth: 400 }}
					/>
					<Tabs value={filterStatus} onChange={handleStatusFilter}>
						<Tab label="All" value="all" />
						<Tab label="Published" value={WorkoutStatus.PUBLISHED} />
						<Tab label="Draft" value={WorkoutStatus.DRAFT} />
						<Tab label="Archived" value={WorkoutStatus.ARCHIVED} />
					</Tabs>
				</Stack>

				{/* Workouts Grid */}
				{workoutsLoading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
						<CircularProgress />
					</Box>
				) : filteredWorkouts.length === 0 ? (
					<Card>
						<CardContent>
							<Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
								<FitnessCenterIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
								<Typography variant="h6" color="text.secondary">
									No workouts found
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{searchText ? 'Try adjusting your search' : 'Create your first workout to get started'}
								</Typography>
								<Link href="/trainer/workouts/create">
									<Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }}>
										Create Workout
									</Button>
								</Link>
							</Stack>
						</CardContent>
					</Card>
				) : (
					<>
						<Grid container spacing={3} sx={{ mb: 4 }}>
							{filteredWorkouts.map((workout: any) => (
								<Grid item xs={12} sm={6} md={4} lg={3} key={workout._id}>
									<Card
										sx={{
											cursor: 'pointer',
											transition: 'transform 0.2s, box-shadow 0.2s',
											'&:hover': {
												transform: 'translateY(-4px)',
												boxShadow: 4,
											},
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
										}}
									>
										{workout.workoutImage && (
											<CardMedia
												component="img"
												height="200"
												image={workout.workoutImage}
												alt={workout.workoutTitle}
											/>
										)}
										<CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
											<Stack spacing={2}>
												<Box>
													<Typography variant="h6" gutterBottom noWrap>
														{workout.workoutTitle}
													</Typography>
													<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
														{workout.workoutDesc || 'No description'}
													</Typography>
												</Box>
												<Stack direction="row" spacing={1} flexWrap="wrap">
													<Chip
														label={workout.workoutStatus}
														color={getStatusColor(workout.workoutStatus)}
														size="small"
													/>
													{workout.workoutCategory && (
														<Chip label={workout.workoutCategory} size="small" variant="outlined" />
													)}
													{workout.isPremium && (
														<Chip label="Premium" color="primary" size="small" variant="outlined" />
													)}
												</Stack>
												<Stack direction="row" spacing={2}>
													{workout.workoutDuration && (
														<Typography variant="caption" color="text.secondary">
															⏱ {workout.workoutDuration} min
														</Typography>
													)}
													{workout.workoutCaloriesBurn && (
														<Typography variant="caption" color="text.secondary">
															🔥 {workout.workoutCaloriesBurn} cal
														</Typography>
													)}
												</Stack>
												<Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
													<Typography variant="caption" color="text.secondary">
														{workout.workoutViews || 0} views
													</Typography>
													<Typography variant="caption" color="text.secondary">
														{workout.workoutLikes || 0} likes
													</Typography>
													{workout.workoutRating > 0 && (
														<Typography variant="caption" color="text.secondary">
															⭐ {workout.workoutRating.toFixed(1)}
														</Typography>
													)}
												</Stack>
												<Stack direction="row" spacing={1} sx={{ mt: 2 }}>
													<Button
														variant="outlined"
														size="small"
														fullWidth
														startIcon={<VisibilityIcon />}
														onClick={(e) => {
															e.stopPropagation();
															router.push(`/trainer/workouts/${workout._id}`);
														}}
													>
														View
													</Button>
													<Button
														variant="outlined"
														size="small"
														startIcon={<EditIcon />}
														onClick={(e) => {
															e.stopPropagation();
															router.push(`/trainer/workouts/${workout._id}/edit`);
														}}
													>
														Edit
													</Button>
												</Stack>
											</Stack>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>

						{/* Pagination */}
						{Math.ceil(totalWorkouts / limit) > 1 && (
							<Stack alignItems="center" sx={{ mt: 4 }}>
								<Pagination
									count={Math.ceil(totalWorkouts / limit)}
									page={currentPage}
									onChange={handlePageChange}
									color="primary"
									size="large"
								/>
							</Stack>
						)}
					</>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(TrainerWorkouts);


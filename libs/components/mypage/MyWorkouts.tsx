import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import {
	Pagination,
	Stack,
	Typography,
	Card,
	Box,
	Chip,
	Button,
	Divider,
} from '@mui/material';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';
import { Workout } from '../../types/workout/workout';
import { GET_WORKOUTS } from '../../../apollo/user/query';
import { WorkoutsInquiry } from '../../types/workout/workout.input';
import { Direction } from '../../enums/common.enum';
import Link from 'next/link';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { REACT_APP_API_URL } from '../../config';

const MyWorkouts: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [searchWorkouts, setSearchWorkouts] = useState<WorkoutsInquiry>({
		...initialInput,
		search: {
			createdBy: user._id,
		},
	});
	const [workouts, setWorkouts] = useState<Workout[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: workoutsLoading,
		data: workoutsData,
		error: getWorkoutsError,
		refetch: workoutsRefetch,
	} = useQuery(GET_WORKOUTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchWorkouts },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			const allWorkouts = data?.getWorkouts?.list || [];
			const userWorkouts = allWorkouts.filter((workout: Workout) => workout.createdBy === user._id);
			setWorkouts(userWorkouts);
			setTotalCount(data?.getWorkouts?.metaCounter?.[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchWorkouts({ ...searchWorkouts, page: value });
	};

	if (device === 'mobile') {
		return <>WORKOUTS PAGE MOBILE</>;
	} else
		return (
			<div id="my-workouts-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Workout Routines</Typography>
						<Typography className="sub-title">Manage and view your workout routines</Typography>
					</Stack>
				</Stack>
				<Stack spacing={3} sx={{ mt: 3 }}>
					{workoutsLoading ? (
						<Box component="div" sx={{ textAlign: 'center', py: 4 }}>
							<Typography sx={{ color: '#6B6B6B' }}>Loading workouts...</Typography>
						</Box>
					) : workouts?.length > 0 ? (
						<>
							{workouts.map((workout: Workout) => (
								<Card
									key={workout._id}
									elevation={0}
									sx={{
										border: '1px solid #E5E5E5',
										borderRadius: '16px',
										padding: '24px',
										transition: 'all 0.2s',
										'&:hover': {
											borderColor: '#E10600',
											boxShadow: '0 4px 12px rgba(225, 6, 0, 0.1)',
										},
									}}
								>
									<Stack spacing={2}>
										<Stack direction="row" alignItems="center" justifyContent="space-between">
											<Stack direction="row" alignItems="center" spacing={1.5}>
												<FitnessCenterIcon sx={{ fontSize: '24px', color: '#E10600' }} />
												<Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111111' }}>
													{workout.workoutTitle}
												</Typography>
											</Stack>
											<Button
												component={Link}
												href={`/workouts/${workout._id}`}
												variant="outlined"
												size="small"
												endIcon={<ArrowForwardIcon />}
												sx={{
													textTransform: 'none',
													borderColor: '#E10600',
													color: '#E10600',
													'&:hover': {
														borderColor: '#C10500',
														backgroundColor: 'rgba(225, 6, 0, 0.08)',
													},
												}}
											>
												View Details
											</Button>
										</Stack>
										<Divider sx={{ borderColor: '#E5E5E5' }} />
										{workout.workoutDesc && (
											<Typography sx={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.6 }}>
												{workout.workoutDesc.length > 200
													? `${workout.workoutDesc.substring(0, 200)}...`
													: workout.workoutDesc}
											</Typography>
										)}
										<Stack direction="row" spacing={1} flexWrap="wrap">
											<Chip
												label={workout.workoutCategory?.replace(/_/g, ' ') || 'N/A'}
												size="small"
												sx={{
													height: '24px',
													fontSize: '12px',
													backgroundColor: '#F5F5F5',
													color: '#616161',
												}}
											/>
											<Chip
												label={workout.workoutDifficulty || 'N/A'}
												size="small"
												sx={{
													height: '24px',
													fontSize: '12px',
													backgroundColor: '#F5F5F5',
													color: '#616161',
												}}
											/>
											{workout.workoutDuration && (
												<Chip
													label={`${workout.workoutDuration} min`}
													size="small"
													sx={{
														height: '24px',
														fontSize: '12px',
														backgroundColor: '#F5F5F5',
														color: '#616161',
													}}
												/>
											)}
											{workout.workoutCaloriesBurn && (
												<Chip
													label={`${workout.workoutCaloriesBurn} cal`}
													size="small"
													sx={{
														height: '24px',
														fontSize: '12px',
														backgroundColor: '#F5F5F5',
														color: '#616161',
													}}
												/>
											)}
										</Stack>
										<Stack direction="row" spacing={2} sx={{ pt: 1 }}>
											<Typography sx={{ fontSize: '13px', color: '#6B6B6B' }}>
												<strong>Views:</strong> {workout.workoutViews || 0}
											</Typography>
											<Typography sx={{ fontSize: '13px', color: '#6B6B6B' }}>
												<strong>Likes:</strong> {workout.workoutLikes || 0}
											</Typography>
											<Typography sx={{ fontSize: '13px', color: '#6B6B6B' }}>
												<strong>Completions:</strong> {workout.workoutCompletions || 0}
											</Typography>
										</Stack>
									</Stack>
								</Card>
							))}
						</>
					) : (
						<Box
							component="div"
							sx={{
								textAlign: 'center',
								py: 6,
								borderRadius: '16px',
								backgroundColor: '#FAFAFA',
								border: '1px dashed #E5E5E5',
							}}
						>
							<FitnessCenterIcon sx={{ fontSize: '64px', color: '#E5E5E5', mb: 2 }} />
							<Typography sx={{ fontSize: '18px', color: '#6B6B6B', mb: 1, fontWeight: 600 }}>
								No workout routines found!
							</Typography>
							<Typography sx={{ fontSize: '14px', color: '#6B6B6B', mb: 3 }}>
								Start creating your workout routines or connect with a trainer
							</Typography>
							<Button
								component={Link}
								href="/trainer"
								variant="contained"
								sx={{
									backgroundColor: '#E10600',
									color: '#FFFFFF',
									textTransform: 'none',
									'&:hover': { backgroundColor: '#C10500' },
								}}
							>
								Connect with Trainer
							</Button>
						</Box>
					)}
				</Stack>

				{workouts?.length > 0 && (
					<Stack className="pagination-conf" sx={{ mt: 4 }}>
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(totalCount / (searchWorkouts.limit || 6))}
								page={searchWorkouts.page || 1}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total">
							<Typography>Total {totalCount ?? 0} workout(s) available</Typography>
						</Stack>
					</Stack>
				)}
			</div>
		);
};

MyWorkouts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			createdBy: '',
		},
	},
};

export default MyWorkouts;


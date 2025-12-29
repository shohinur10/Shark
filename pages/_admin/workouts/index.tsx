import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, InputAdornment, List, ListItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { WorkoutsInquiry } from '../../../libs/types/workout/workout.input';
import { Workout } from '../../../libs/types/workout/workout';
import { WorkoutStatus, WorkoutDifficulty, WorkoutCategory } from '../../../libs/enums/workout.enum';
import { useQuery } from '@apollo/client';
import { GET_ALL_WORKOUTS_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { format } from 'date-fns';
import { REACT_APP_API_URL } from '../../../libs/config';
import Avatar from '@mui/material/Avatar';

const AdminWorkouts: NextPage = ({ initialInquiry, ...props }: any) => {
	const [workoutsInquiry, setWorkoutsInquiry] = useState<WorkoutsInquiry>(initialInquiry);
	const [workouts, setWorkouts] = useState<Workout[]>([]);
	const [workoutsTotal, setWorkoutsTotal] = useState<number>(0);
	const [value, setValue] = useState<string>('ALL');
	const [searchText, setSearchText] = useState('');

	const {
		loading: getAllWorkoutsByAdminLoading,
		data: getAllWorkoutsByAdminData,
		error: getAllWorkoutsByAdminError,
		refetch: getAllWorkoutsByAdminRefetch,
	} = useQuery(GET_ALL_WORKOUTS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: workoutsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setWorkouts(data?.getAllWorkoutsByAdmin?.list || []);
			setWorkoutsTotal(data?.getAllWorkoutsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		getAllWorkoutsByAdminRefetch({ input: workoutsInquiry }).then();
	}, [workoutsInquiry]);

	const changePageHandler = async (event: unknown, newPage: number) => {
		workoutsInquiry.page = newPage + 1;
		setWorkoutsInquiry({ ...workoutsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		workoutsInquiry.limit = parseInt(event.target.value, 10);
		workoutsInquiry.page = 1;
		setWorkoutsInquiry({ ...workoutsInquiry });
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		setSearchText('');

		const newInquiry = { ...workoutsInquiry, page: 1, sort: 'createdAt' };

		if (newValue !== 'ALL') {
			newInquiry.workoutStatus = newValue as WorkoutStatus;
		} else {
			delete newInquiry.workoutStatus;
		}

		setWorkoutsInquiry(newInquiry);
	};

	const textHandler = useCallback((value: string) => {
		try {
			setSearchText(value);
		} catch (err: any) {
			console.log('textHandler: ', err.message);
		}
	}, []);

	const searchTextHandler = () => {
		try {
			setWorkoutsInquiry({
				...workoutsInquiry,
				page: 1,
				search: {
					...workoutsInquiry.search,
					text: searchText,
				},
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const getStatusClass = (status: WorkoutStatus) => {
		switch (status) {
			case WorkoutStatus.ACTIVE:
				return 'success';
			case WorkoutStatus.INACTIVE:
				return '';
			default:
				return '';
		}
	};

	const getDifficultyClass = (difficulty: WorkoutDifficulty) => {
		switch (difficulty) {
			case WorkoutDifficulty.BEGINNER:
				return 'success';
			case WorkoutDifficulty.INTERMEDIATE:
				return 'warning';
			case WorkoutDifficulty.ADVANCED:
				return 'error';
			default:
				return '';
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Workouts Management
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<Box component={'div'}>
						<List className={'tab-menu'}>
							<ListItem onClick={(e: any) => tabChangeHandler(e, 'ALL')} value="ALL" className={value === 'ALL' ? 'li on' : 'li'}>
								All
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, WorkoutStatus.ACTIVE)} value={WorkoutStatus.ACTIVE} className={value === WorkoutStatus.ACTIVE ? 'li on' : 'li'}>
								Active
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, WorkoutStatus.INACTIVE)} value={WorkoutStatus.INACTIVE} className={value === WorkoutStatus.INACTIVE ? 'li on' : 'li'}>
								Inactive
							</ListItem>
						</List>
						<Divider />
						<Stack className={'search-area'} sx={{ m: '24px' }} direction="row" spacing={2}>
							<OutlinedInput
								value={searchText}
								onChange={(e: any) => textHandler(e.target.value)}
								sx={{ flex: 1 }}
								className={'search'}
								placeholder="Search workouts"
								onKeyDown={(event) => {
									if (event.key == 'Enter') searchTextHandler();
								}}
								endAdornment={
									<>
										{searchText && (
											<CancelRoundedIcon
												style={{ cursor: 'pointer' }}
												onClick={async () => {
													setSearchText('');
													setWorkoutsInquiry({
														...workoutsInquiry,
														search: {
															...workoutsInquiry.search,
															text: '',
														},
													});
													await getAllWorkoutsByAdminRefetch({ input: workoutsInquiry });
												}}
											/>
										)}
										<InputAdornment position="end" onClick={() => searchTextHandler()}>
											<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
										</InputAdornment>
									</>
								}
							/>
						</Stack>
						<Divider />
					</Box>

					{getAllWorkoutsByAdminLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
							<Typography>Loading...</Typography>
						</Box>
					) : getAllWorkoutsByAdminError ? (
						<Box sx={{ p: 3 }}>
							<Typography color="error">Error loading workouts: {getAllWorkoutsByAdminError.message}</Typography>
						</Box>
					) : (
						<>
							<TableContainer>
								<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
									<TableHead>
										<TableRow>
											<TableCell>Image</TableCell>
											<TableCell>Title</TableCell>
											<TableCell>Category</TableCell>
											<TableCell>Difficulty</TableCell>
											<TableCell>Duration</TableCell>
											<TableCell>Creator</TableCell>
											<TableCell>Views</TableCell>
											<TableCell>Likes</TableCell>
											<TableCell>Rating</TableCell>
											<TableCell>Premium</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Created Date</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{workouts.length === 0 && (
											<TableRow>
												<TableCell align="center" colSpan={12}>
													<span className={'no-data'}>data not found!</span>
												</TableCell>
											</TableRow>
										)}

										{workouts.length !== 0 &&
											workouts.map((workout: Workout) => {
												const workoutImage = workout.workoutImage
													? `${REACT_APP_API_URL}/${workout.workoutImage}`
													: '/img/workouts/default.png';

												return (
													<TableRow hover key={workout?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
														<TableCell align="left">
															<Avatar src={workoutImage} variant="rounded" sx={{ width: 56, height: 56 }} />
														</TableCell>
														<TableCell align="left">
															<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
																{workout.workoutTitle}
															</Typography>
														</TableCell>
														<TableCell align="left">{workout.workoutCategory?.replace(/_/g, ' ')}</TableCell>
														<TableCell align="center">
															<Button className={`badge ${getDifficultyClass(workout.workoutDifficulty)}`} sx={{ textTransform: 'none' }}>
																{workout.workoutDifficulty}
															</Button>
														</TableCell>
														<TableCell align="left">{workout.workoutDuration?.replace(/_/g, ' ')}</TableCell>
														<TableCell align="left">{workout.memberData?.memberNick || '-'}</TableCell>
														<TableCell align="left">{workout.workoutViews || 0}</TableCell>
														<TableCell align="left">{workout.workoutLikes || 0}</TableCell>
														<TableCell align="left">{workout.workoutRating?.toFixed(1) || '-'}</TableCell>
														<TableCell align="center">
															{workout.isPremium ? (
																<Button className={'badge warning'} sx={{ textTransform: 'none' }}>
																	Yes
																</Button>
															) : (
																<Button className={'badge'} sx={{ textTransform: 'none' }}>
																	No
																</Button>
															)}
														</TableCell>
														<TableCell align="center">
															<Button className={`badge ${getStatusClass(workout.workoutStatus)}`} sx={{ textTransform: 'none' }}>
																{workout.workoutStatus}
															</Button>
														</TableCell>
														<TableCell align="left">{workout.createdAt ? format(new Date(workout.createdAt), 'MMM dd, yyyy') : '-'}</TableCell>
													</TableRow>
												);
											})}
									</TableBody>
								</Table>
							</TableContainer>

							<TablePagination
								rowsPerPageOptions={[10, 20, 40, 60]}
								component="div"
								count={workoutsTotal}
								rowsPerPage={workoutsInquiry?.limit}
								page={workoutsInquiry?.page - 1}
								onPageChange={changePageHandler}
								onRowsPerPageChange={changeRowsPerPageHandler}
							/>
						</>
					)}
				</Box>
			</Box>
		</Box>
	);
};

AdminWorkouts.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

export default withAdminLayout(AdminWorkouts);


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
import { ExercisesInquiry } from '../../../libs/types/exercise/exercise.input';
import { Exercise } from '../../../libs/types/exercise/exercise';
import { ExerciseStatus, ExerciseType } from '../../../libs/enums/exercise.enum';
import { useQuery } from '@apollo/client';
import { GET_ALL_EXERCISES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { format } from 'date-fns';
import { REACT_APP_API_URL } from '../../../libs/config';
import Avatar from '@mui/material/Avatar';

const AdminExercises: NextPage = ({ initialInquiry, ...props }: any) => {
	const [exercisesInquiry, setExercisesInquiry] = useState<ExercisesInquiry>(initialInquiry);
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [exercisesTotal, setExercisesTotal] = useState<number>(0);
	const [value, setValue] = useState<string>('ALL');
	const [searchText, setSearchText] = useState('');

	const {
		loading: getAllExercisesByAdminLoading,
		data: getAllExercisesByAdminData,
		error: getAllExercisesByAdminError,
		refetch: getAllExercisesByAdminRefetch,
	} = useQuery(GET_ALL_EXERCISES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: exercisesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setExercises(data?.getAllExercisesByAdmin?.list || []);
			setExercisesTotal(data?.getAllExercisesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		getAllExercisesByAdminRefetch({ input: exercisesInquiry }).then();
	}, [exercisesInquiry]);

	const changePageHandler = async (event: unknown, newPage: number) => {
		exercisesInquiry.page = newPage + 1;
		setExercisesInquiry({ ...exercisesInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		exercisesInquiry.limit = parseInt(event.target.value, 10);
		exercisesInquiry.page = 1;
		setExercisesInquiry({ ...exercisesInquiry });
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		setSearchText('');

		const newInquiry = { ...exercisesInquiry, page: 1, sort: 'createdAt' };

		if (newValue !== 'ALL') {
			newInquiry.exerciseStatus = newValue;
		} else {
			delete newInquiry.exerciseStatus;
		}

		setExercisesInquiry(newInquiry);
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
			setExercisesInquiry({
				...exercisesInquiry,
				page: 1,
				search: typeof exercisesInquiry.search === 'object' ? { ...exercisesInquiry.search, text: searchText } : { text: searchText },
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const getStatusClass = (status: ExerciseStatus) => {
		switch (status) {
			case ExerciseStatus.ACTIVE:
				return 'success';
			case ExerciseStatus.INACTIVE:
				return '';
			default:
				return '';
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Exercises Management
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<Box component={'div'}>
						<List className={'tab-menu'}>
							<ListItem onClick={(e: any) => tabChangeHandler(e, 'ALL')} value="ALL" className={value === 'ALL' ? 'li on' : 'li'}>
								All
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, ExerciseStatus.ACTIVE)} value={ExerciseStatus.ACTIVE} className={value === ExerciseStatus.ACTIVE ? 'li on' : 'li'}>
								Active
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, ExerciseStatus.INACTIVE)} value={ExerciseStatus.INACTIVE} className={value === ExerciseStatus.INACTIVE ? 'li on' : 'li'}>
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
								placeholder="Search exercises"
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
													setExercisesInquiry({
														...exercisesInquiry,
														search: typeof exercisesInquiry.search === 'object' ? { ...exercisesInquiry.search, text: '' } : {},
													});
													await getAllExercisesByAdminRefetch({ input: exercisesInquiry });
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

					{getAllExercisesByAdminLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
							<Typography>Loading...</Typography>
						</Box>
					) : getAllExercisesByAdminError ? (
						<Box sx={{ p: 3 }}>
							<Typography color="error">Error loading exercises: {getAllExercisesByAdminError.message}</Typography>
						</Box>
					) : (
						<>
							<TableContainer>
								<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
									<TableHead>
										<TableRow>
											<TableCell>Image</TableCell>
											<TableCell>Exercise Name</TableCell>
											<TableCell>Type</TableCell>
											<TableCell>Target Muscles</TableCell>
											<TableCell>Creator</TableCell>
											<TableCell>Views</TableCell>
											<TableCell>Likes</TableCell>
											<TableCell>Rating</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Created Date</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{exercises.length === 0 && (
											<TableRow>
												<TableCell align="center" colSpan={10}>
													<span className={'no-data'}>data not found!</span>
												</TableCell>
											</TableRow>
										)}

										{exercises.length !== 0 &&
											exercises.map((exercise: Exercise) => {
												const exerciseImage = exercise.exerciseImage
													? `${REACT_APP_API_URL}/${exercise.exerciseImage}`
													: '/img/exercises/default.png';

												return (
													<TableRow hover key={exercise?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
														<TableCell align="left">
															<Avatar src={exerciseImage} variant="rounded" sx={{ width: 56, height: 56 }} />
														</TableCell>
														<TableCell align="left">
															<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
																{exercise.exerciseName}
															</Typography>
														</TableCell>
														<TableCell align="left">{exercise.exerciseType?.replace(/_/g, ' ')}</TableCell>
														<TableCell align="left">
															{exercise.targetMuscles && exercise.targetMuscles.length > 0
																? exercise.targetMuscles.map((m) => m.replace(/_/g, ' ')).join(', ')
																: '-'}
														</TableCell>
														<TableCell align="left">{exercise.memberData?.memberNick || '-'}</TableCell>
														<TableCell align="left">{exercise.exerciseViews || 0}</TableCell>
														<TableCell align="left">{exercise.exerciseLikes || 0}</TableCell>
														<TableCell align="left">{exercise.exerciseRating?.toFixed(1) || '-'}</TableCell>
														<TableCell align="center">
															<Button className={`badge ${getStatusClass(exercise.exerciseStatus)}`} sx={{ textTransform: 'none' }}>
																{exercise.exerciseStatus}
															</Button>
														</TableCell>
														<TableCell align="left">{exercise.createdAt ? format(new Date(exercise.createdAt), 'MMM dd, yyyy') : '-'}</TableCell>
													</TableRow>
												);
											})}
									</TableBody>
								</Table>
							</TableContainer>

							<TablePagination
								rowsPerPageOptions={[10, 20, 40, 60]}
								component="div"
								count={exercisesTotal}
								rowsPerPage={exercisesInquiry?.limit}
								page={exercisesInquiry?.page - 1}
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

AdminExercises.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

export default withAdminLayout(AdminExercises);


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
import { ChallengesInquiry } from '../../../libs/types/challenge/challenge.input';
import { Challenge } from '../../../libs/types/challenge/challenge';
import { ChallengeStatus, ChallengeDifficulty, ChallengeType } from '../../../libs/enums/challenge.enum';
import { useQuery } from '@apollo/client';
import { GET_ALL_CHALLENGES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { format } from 'date-fns';
import { REACT_APP_API_URL } from '../../../libs/config';
import Avatar from '@mui/material/Avatar';

const AdminChallenges: NextPage = ({ initialInquiry, ...props }: any) => {
	const [challengesInquiry, setChallengesInquiry] = useState<ChallengesInquiry>(initialInquiry);
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const [challengesTotal, setChallengesTotal] = useState<number>(0);
	const [value, setValue] = useState<string>('ALL');
	const [searchText, setSearchText] = useState('');

	const {
		loading: getAllChallengesByAdminLoading,
		data: getAllChallengesByAdminData,
		error: getAllChallengesByAdminError,
		refetch: getAllChallengesByAdminRefetch,
	} = useQuery(GET_ALL_CHALLENGES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: challengesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setChallenges(data?.getAllChallengesByAdmin?.list || []);
			setChallengesTotal(data?.getAllChallengesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		getAllChallengesByAdminRefetch({ input: challengesInquiry }).then();
	}, [challengesInquiry]);

	const changePageHandler = async (event: unknown, newPage: number) => {
		challengesInquiry.page = newPage + 1;
		setChallengesInquiry({ ...challengesInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		challengesInquiry.limit = parseInt(event.target.value, 10);
		challengesInquiry.page = 1;
		setChallengesInquiry({ ...challengesInquiry });
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		setSearchText('');

		const newInquiry = { ...challengesInquiry, page: 1, sort: 'createdAt' };

		if (newValue !== 'ALL') {
			newInquiry.challengeStatus = newValue as ChallengeStatus;
		} else {
			delete newInquiry.challengeStatus;
		}

		setChallengesInquiry(newInquiry);
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
			setChallengesInquiry({
				...challengesInquiry,
				page: 1,
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const getStatusClass = (status: ChallengeStatus) => {
		switch (status) {
			case ChallengeStatus.ACTIVE:
				return 'success';
			case ChallengeStatus.UPCOMING:
				return 'warning';
			case ChallengeStatus.COMPLETED:
				return '';
			default:
				return '';
		}
	};

	const getDifficultyClass = (difficulty: ChallengeDifficulty) => {
		switch (difficulty) {
			case ChallengeDifficulty.EASY:
				return 'success';
			case ChallengeDifficulty.MEDIUM:
				return 'warning';
			case ChallengeDifficulty.HARD:
				return 'error';
			default:
				return '';
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Challenges Management
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<Box component={'div'}>
						<List className={'tab-menu'}>
							<ListItem onClick={(e: any) => tabChangeHandler(e, 'ALL')} value="ALL" className={value === 'ALL' ? 'li on' : 'li'}>
								All
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, ChallengeStatus.ACTIVE)} value={ChallengeStatus.ACTIVE} className={value === ChallengeStatus.ACTIVE ? 'li on' : 'li'}>
								Active
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, ChallengeStatus.UPCOMING)} value={ChallengeStatus.UPCOMING} className={value === ChallengeStatus.UPCOMING ? 'li on' : 'li'}>
								Upcoming
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, ChallengeStatus.COMPLETED)} value={ChallengeStatus.COMPLETED} className={value === ChallengeStatus.COMPLETED ? 'li on' : 'li'}>
								Completed
							</ListItem>
						</List>
						<Divider />
						<Stack className={'search-area'} sx={{ m: '24px' }} direction="row" spacing={2}>
							<OutlinedInput
								value={searchText}
								onChange={(e: any) => textHandler(e.target.value)}
								sx={{ flex: 1 }}
								className={'search'}
								placeholder="Search challenges"
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
													await getAllChallengesByAdminRefetch({ input: challengesInquiry });
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

					{getAllChallengesByAdminLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
							<Typography>Loading...</Typography>
						</Box>
					) : getAllChallengesByAdminError ? (
						<Box sx={{ p: 3 }}>
							<Typography color="error">Error loading challenges: {getAllChallengesByAdminError.message}</Typography>
						</Box>
					) : (
						<>
							<TableContainer>
								<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
									<TableHead>
										<TableRow>
											<TableCell>Image</TableCell>
											<TableCell>Challenge Title</TableCell>
											<TableCell>Type</TableCell>
											<TableCell>Difficulty</TableCell>
											<TableCell>Creator</TableCell>
											<TableCell>Participants</TableCell>
											<TableCell>Completions</TableCell>
											<TableCell>Start Date</TableCell>
											<TableCell>End Date</TableCell>
											<TableCell>Reward Points</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Created Date</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{challenges.length === 0 && (
											<TableRow>
												<TableCell align="center" colSpan={12}>
													<span className={'no-data'}>data not found!</span>
												</TableCell>
											</TableRow>
										)}

										{challenges.length !== 0 &&
											challenges.map((challenge: Challenge) => {
												const challengeImage = challenge.challengeImage
													? `${REACT_APP_API_URL}/${challenge.challengeImage}`
													: '/img/challenges/default.png';

												return (
													<TableRow hover key={challenge?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
														<TableCell align="left">
															<Avatar src={challengeImage} variant="rounded" sx={{ width: 56, height: 56 }} />
														</TableCell>
														<TableCell align="left">
															<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
																{challenge.challengeTitle}
															</Typography>
														</TableCell>
														<TableCell align="left">{challenge.challengeType?.replace(/_/g, ' ')}</TableCell>
														<TableCell align="center">
															<Button className={`badge ${getDifficultyClass(challenge.challengeDifficulty)}`} sx={{ textTransform: 'none' }}>
																{challenge.challengeDifficulty}
															</Button>
														</TableCell>
														<TableCell align="left">{challenge.memberData?.memberNick || '-'}</TableCell>
														<TableCell align="left">{challenge.participantCount || 0}</TableCell>
														<TableCell align="left">{challenge.completionCount || 0}</TableCell>
														<TableCell align="left">{challenge.startDate ? format(new Date(challenge.startDate), 'MMM dd, yyyy') : '-'}</TableCell>
														<TableCell align="left">{challenge.endDate ? format(new Date(challenge.endDate), 'MMM dd, yyyy') : '-'}</TableCell>
														<TableCell align="left">{challenge.rewardPoints || 0}</TableCell>
														<TableCell align="center">
															<Button className={`badge ${getStatusClass(challenge.challengeStatus)}`} sx={{ textTransform: 'none' }}>
																{challenge.challengeStatus}
															</Button>
														</TableCell>
														<TableCell align="left">{challenge.createdAt ? format(new Date(challenge.createdAt), 'MMM dd, yyyy') : '-'}</TableCell>
													</TableRow>
												);
											})}
									</TableBody>
								</Table>
							</TableContainer>

							<TablePagination
								rowsPerPageOptions={[10, 20, 40, 60]}
								component="div"
								count={challengesTotal}
								rowsPerPage={challengesInquiry?.limit}
								page={challengesInquiry?.page - 1}
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

AdminChallenges.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

export default withAdminLayout(AdminChallenges);


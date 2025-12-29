import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, InputAdornment, List, ListItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Avatar, Rating, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { ReviewsInquiry } from '../../../libs/types/review/review.input';
import { Review } from '../../../libs/types/review/review';
import { ReviewStatus, ReviewGroup } from '../../../libs/enums/review.enum';
import { useQuery } from '@apollo/client';
import { GET_ALL_REVIEWS_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';
import { format } from 'date-fns';
import { REACT_APP_API_URL } from '../../../libs/config';

const AdminReviews: NextPage = ({ initialInquiry, ...props }: any) => {
	const [reviewsInquiry, setReviewsInquiry] = useState<ReviewsInquiry>(initialInquiry);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [reviewsTotal, setReviewsTotal] = useState<number>(0);
	const [value, setValue] = useState<string>('ALL');
	const [searchText, setSearchText] = useState('');
	const [reviewGroupFilter, setReviewGroupFilter] = useState<string>('ALL');
	const [ratingFilter, setRatingFilter] = useState<string>('ALL');

	const {
		loading: getAllReviewsByAdminLoading,
		data: getAllReviewsByAdminData,
		error: getAllReviewsByAdminError,
		refetch: getAllReviewsByAdminRefetch,
	} = useQuery(GET_ALL_REVIEWS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: reviewsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setReviews(data?.getAllReviewsByAdmin?.list || []);
			setReviewsTotal(data?.getAllReviewsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		getAllReviewsByAdminRefetch({ input: reviewsInquiry }).then();
	}, [reviewsInquiry]);

	const changePageHandler = async (event: unknown, newPage: number) => {
		reviewsInquiry.page = newPage + 1;
		setReviewsInquiry({ ...reviewsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		reviewsInquiry.limit = parseInt(event.target.value, 10);
		reviewsInquiry.page = 1;
		setReviewsInquiry({ ...reviewsInquiry });
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		setSearchText('');

		const newInquiry = { ...reviewsInquiry, page: 1, sort: 'createdAt' };

		if (newValue !== 'ALL') {
			newInquiry.reviewStatus = newValue as ReviewStatus;
		} else {
			delete newInquiry.reviewStatus;
		}

		setReviewsInquiry(newInquiry);
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
			setReviewsInquiry({
				...reviewsInquiry,
				page: 1,
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const reviewGroupHandler = async (newValue: string) => {
		try {
			setReviewGroupFilter(newValue);

			const newInquiry = { ...reviewsInquiry, page: 1, sort: 'createdAt' };

			if (newValue !== 'ALL') {
				newInquiry.reviewGroup = newValue as ReviewGroup;
			} else {
				delete newInquiry.reviewGroup;
			}

			setReviewsInquiry(newInquiry);
		} catch (err: any) {
			console.log('reviewGroupHandler: ', err.message);
		}
	};

	const ratingHandler = async (newValue: string) => {
		try {
			setRatingFilter(newValue);

			const newInquiry = { ...reviewsInquiry, page: 1, sort: 'createdAt' };

			if (newValue !== 'ALL') {
				newInquiry.search = { ...reviewsInquiry.search, rating: parseInt(newValue) };
			} else {
				if (newInquiry.search) {
					delete newInquiry.search.rating;
				}
			}

			setReviewsInquiry(newInquiry);
		} catch (err: any) {
			console.log('ratingHandler: ', err.message);
		}
	};

	const getStatusClass = (status: ReviewStatus) => {
		switch (status) {
			case ReviewStatus.APPROVED:
				return 'success';
			case ReviewStatus.PENDING:
				return 'warning';
			case ReviewStatus.FLAGGED:
			case ReviewStatus.REJECTED:
				return 'error';
			default:
				return '';
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Reviews Moderation
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<Box component={'div'}>
						<List className={'tab-menu'}>
							<ListItem onClick={(e: any) => tabChangeHandler(e, 'ALL')} value="ALL" className={value === 'ALL' ? 'li on' : 'li'}>
								All
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, ReviewStatus.PENDING)} value={ReviewStatus.PENDING} className={value === ReviewStatus.PENDING ? 'li on' : 'li'}>
								Pending
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, ReviewStatus.APPROVED)} value={ReviewStatus.APPROVED} className={value === ReviewStatus.APPROVED ? 'li on' : 'li'}>
								Approved
							</ListItem>
							<ListItem onClick={(e: any) => tabChangeHandler(e, ReviewStatus.FLAGGED)} value={ReviewStatus.FLAGGED} className={value === ReviewStatus.FLAGGED ? 'li on' : 'li'}>
								Flagged
							</ListItem>
						</List>
						<Divider />
						<Stack className={'search-area'} sx={{ m: '24px' }} direction="row" spacing={2}>
							<OutlinedInput
								value={searchText}
								onChange={(e: any) => textHandler(e.target.value)}
								sx={{ flex: 1 }}
								className={'search'}
								placeholder="Search reviews"
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
													await getAllReviewsByAdminRefetch({ input: reviewsInquiry });
												}}
											/>
										)}
										<InputAdornment position="end" onClick={() => searchTextHandler()}>
											<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
										</InputAdornment>
									</>
								}
							/>
							<Select sx={{ width: '200px' }} value={reviewGroupFilter} onChange={(e) => reviewGroupHandler(e.target.value)}>
								<MenuItem value={'ALL'}>All Groups</MenuItem>
								{Object.values(ReviewGroup).map((group) => (
									<MenuItem key={group} value={group}>
										{group.replace(/_/g, ' ')}
									</MenuItem>
								))}
							</Select>
							<Select sx={{ width: '150px' }} value={ratingFilter} onChange={(e) => ratingHandler(e.target.value)}>
								<MenuItem value={'ALL'}>All Ratings</MenuItem>
								<MenuItem value={'5'}>5 Stars</MenuItem>
								<MenuItem value={'4'}>4 Stars</MenuItem>
								<MenuItem value={'3'}>3 Stars</MenuItem>
								<MenuItem value={'2'}>2 Stars</MenuItem>
								<MenuItem value={'1'}>1 Star</MenuItem>
							</Select>
						</Stack>
						<Divider />
					</Box>

					{getAllReviewsByAdminLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
							<Typography>Loading...</Typography>
						</Box>
					) : getAllReviewsByAdminError ? (
						<Box sx={{ p: 3 }}>
							<Typography color="error">Error loading reviews: {getAllReviewsByAdminError.message}</Typography>
						</Box>
					) : (
						<>
							<TableContainer>
								<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
									<TableHead>
										<TableRow>
											<TableCell>Reviewer</TableCell>
											<TableCell>Rating</TableCell>
											<TableCell>Review Title</TableCell>
											<TableCell>Content</TableCell>
											<TableCell>Review Group</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Flag Reason</TableCell>
											<TableCell>Date</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{reviews.length === 0 && (
											<TableRow>
												<TableCell align="center" colSpan={8}>
													<span className={'no-data'}>data not found!</span>
												</TableCell>
											</TableRow>
										)}

										{reviews.length !== 0 &&
											reviews.map((review: Review) => {
												const reviewerImage = review.memberData?.memberImage
													? `${REACT_APP_API_URL}/${review.memberData.memberImage}`
													: '/img/profile/defaultUser.svg';

												return (
													<TableRow hover key={review?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
														<TableCell align="left" className={'name'}>
															<Stack direction="row" alignItems="center" spacing={1}>
																<Avatar src={reviewerImage} sx={{ width: 32, height: 32 }} />
																<Typography variant="body2">{review.memberData?.memberNick || '-'}</Typography>
															</Stack>
														</TableCell>
														<TableCell align="left">
															<Rating value={review.rating} readOnly size="small" />
														</TableCell>
														<TableCell align="left">
															<Typography variant="body2" sx={{ fontWeight: 500 }}>
																{review.reviewTitle || '-'}
															</Typography>
														</TableCell>
														<TableCell align="left">
															<Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
																{review.reviewContent || '-'}
															</Typography>
														</TableCell>
														<TableCell align="left">{review.reviewGroup?.replace(/_/g, ' ')}</TableCell>
														<TableCell align="center">
															<Button className={`badge ${getStatusClass(review.reviewStatus)}`} sx={{ textTransform: 'none' }}>
																{review.reviewStatus}
															</Button>
														</TableCell>
														<TableCell align="left">
															{review.flagReason ? (
																<Typography variant="body2" className={'error-txt'}>
																	{review.flagReason}
																</Typography>
															) : (
																'-'
															)}
														</TableCell>
														<TableCell align="left">{review.createdAt ? format(new Date(review.createdAt), 'MMM dd, yyyy') : '-'}</TableCell>
													</TableRow>
												);
											})}
									</TableBody>
								</Table>
							</TableContainer>

							<TablePagination
								rowsPerPageOptions={[10, 20, 40, 60]}
								component="div"
								count={reviewsTotal}
								rowsPerPage={reviewsInquiry?.limit}
								page={reviewsInquiry?.page - 1}
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

AdminReviews.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
	},
};

export default withAdminLayout(AdminReviews);

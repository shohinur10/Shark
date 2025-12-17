import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Avatar, Rating } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { Member } from '../../libs/types/member/member';
import { TrainersInquiry } from '../../libs/types/member/member.input';
import { GET_TRAINERS } from '../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../libs/types/common';
import { Direction } from '../../libs/enums/common.enum';
import Link from 'next/link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import { REACT_APP_API_URL } from '../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TrainersPage: NextPage = () => {
	const device = useDeviceDetect();
	const [trainers, setTrainers] = useState<Member[]>([]);
	const [filters, setFilters] = useState<TrainersInquiry>({
		page: 1,
		limit: 20,
		sort: 'memberRank',
		direction: Direction.DESC,
		search: {},
	});

	const {
		loading: getTrainersLoading,
		data: getTrainersData,
		error: getTrainersError,
		refetch: getTrainersRefetch,
	} = useQuery(GET_TRAINERS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: filters },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrainers(data?.getTrainers?.list || []);
		},
	});

	if (device === 'mobile') {
		return (
			<Stack className={'trainers-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Trainers</Typography>
					<div>MOBILE TRAINERS PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trainers-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'}>
						<Typography variant="h3" className={'page-title'}>
							Expert Trainers
						</Typography>
						<Typography variant="body1" className={'page-subtitle'}>
							Find certified fitness professionals to guide your journey
						</Typography>
					</Stack>

					{/* Trainers Grid */}
					<Stack className={'trainers-content'}>
						{trainers.length === 0 ? (
							<Box className={'empty-state'}>
								<Typography variant="h6">No trainers found</Typography>
								<Typography variant="body2">Check back later for new trainers.</Typography>
							</Box>
						) : (
							<Grid container spacing={3}>
								{trainers.map((trainer) => (
									<Grid item xs={12} sm={6} md={4} lg={3} key={trainer._id}>
										<Link href={`/trainers/${trainer._id}`}>
											<Card className={'trainer-card'}>
												<CardContent>
													<Stack direction="column" alignItems="center" spacing={2}>
														<Avatar
															src={trainer.memberImage ? `${REACT_APP_API_URL}/${trainer.memberImage}` : undefined}
															sx={{ width: 120, height: 120 }}
														>
															{trainer.memberFullName?.charAt(0) || trainer.memberNick?.charAt(0) || 'T'}
														</Avatar>
														<Typography variant="h6" className={'trainer-name'}>
															{trainer.memberFullName || trainer.memberNick}
														</Typography>
														{trainer.memberAddress && (
															<Stack direction="row" alignItems="center" spacing={0.5}>
																<LocationOnIcon fontSize="small" color="action" />
																<Typography variant="body2" color="text.secondary">
																	{trainer.memberAddress}
																</Typography>
															</Stack>
														)}
														<Stack direction="row" alignItems="center" spacing={1}>
															<Rating value={trainer.memberRank / 10 || 0} readOnly precision={0.5} size="small" />
															<Typography variant="body2" color="text.secondary">
																({trainer.memberLikes || 0} reviews)
															</Typography>
														</Stack>
														{trainer.memberDesc && (
															<Typography variant="body2" color="text.secondary" className={'trainer-desc'}>
																{trainer.memberDesc}
															</Typography>
														)}
														<Button variant="contained" fullWidth>
															View Profile
														</Button>
													</Stack>
												</CardContent>
											</Card>
										</Link>
									</Grid>
								))}
							</Grid>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(TrainersPage);


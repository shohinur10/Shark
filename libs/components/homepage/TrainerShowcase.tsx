import React, { useState } from 'react';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Avatar, Rating, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { Member } from '../../types/member/member';
import { TrainersInquiry } from '../../types/member/member.input';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { GET_TRAINERS } from '../../../apollo/user/query';
import { REACT_APP_API_URL } from '../../../libs/config';
import { Direction } from '../../enums/common.enum';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const TrainerShowcase = () => {
	const device = useDeviceDetect();
	const [trainers, setTrainers] = useState<Member[]>([]);

	const filters: TrainersInquiry = {
		page: 1,
		limit: 4,
		sort: 'memberRank',
		direction: Direction.DESC,
		search: {},
	};

	const {
		loading: getTrainersLoading,
		data: getTrainersData,
		error: getTrainersError,
	} = useQuery(GET_TRAINERS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: filters },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrainers(data?.getTrainers?.list?.slice(0, 4) || []);
		},
	});

	// Fallback sample trainers if API returns empty
	const sampleTrainers = [
		{
			_id: '1',
			memberFullName: 'Alex Johnson',
			memberNick: 'alex_fitness',
			memberImage: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
			memberRank: 50,
			memberLikes: 1250,
			memberAddress: 'New York, USA',
			memberDesc: 'Certified personal trainer specializing in strength training and body transformation',
		},
		{
			_id: '2',
			memberFullName: 'Sarah Martinez',
			memberNick: 'sarah_yoga',
			memberImage: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
			memberRank: 48,
			memberLikes: 980,
			memberAddress: 'Los Angeles, USA',
			memberDesc: 'Yoga instructor and nutrition expert with 10+ years of experience',
		},
		{
			_id: '3',
			memberFullName: 'Mike Chen',
			memberNick: 'mike_hiit',
			memberImage: '/img/bodybuilders/pexels-leonmart-1552108.jpg',
			memberRank: 45,
			memberLikes: 750,
			memberAddress: 'Chicago, USA',
			memberDesc: 'HIIT specialist helping clients achieve rapid fitness results',
		},
		{
			_id: '4',
			memberFullName: 'Emma Wilson',
			memberNick: 'emma_nutrition',
			memberImage: '/img/bodybuilders/pexels-mralpha-13451637.jpg',
			memberRank: 47,
			memberLikes: 1100,
			memberAddress: 'Miami, USA',
			memberDesc: 'Nutrition coach and meal planning expert for sustainable results',
		},
	];

	const displayTrainers = trainers.length > 0 ? trainers : sampleTrainers;

	// Helper function to get the correct image URL
	const getTrainerImageUrl = (trainer: any) => {
		if (!trainer.memberImage) {
			return '/img/profile/defaultUser.svg';
		}
		// If it's already a full URL or starts with /img/, use it as is (sample trainers)
		if (trainer.memberImage.startsWith('http') || trainer.memberImage.startsWith('/img/')) {
			return trainer.memberImage;
		}
		// Otherwise, it's a relative path from the API, prepend the API URL
		return `${REACT_APP_API_URL}/${trainer.memberImage}`;
	};

	if (device === 'mobile') {
		return (
			<Stack className={'trainer-showcase'}>
				<Stack className={'container'}>
					<Typography variant="h4" className={'section-title'}>
						Expert Trainers
					</Typography>
					<Grid container spacing={2}>
						{displayTrainers.slice(0, 2).map((trainer: any) => (
							<Grid item xs={6} key={trainer._id}>
								<Link href={`/trainer/${trainer._id}`}>
									<Card className={'trainer-card'}>
										<CardContent>
											<Stack direction="column" alignItems="center" spacing={1}>
												<Avatar
													src={getTrainerImageUrl(trainer)}
													sx={{ width: 80, height: 80 }}
												>
													{(trainer.memberFullName || trainer.memberNick)?.charAt(0) || 'T'}
												</Avatar>
												<Typography variant="h6" className={'trainer-name'}>
													{trainer.memberFullName || trainer.memberNick}
												</Typography>
												<Rating value={(trainer.memberRank || 0) / 10} readOnly precision={0.5} size="small" />
											</Stack>
										</CardContent>
									</Card>
								</Link>
							</Grid>
						))}
					</Grid>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trainer-showcase'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Box>
							<Typography variant="h3" className={'section-title'}>
								Meet Our Expert Trainers
							</Typography>
							<Typography variant="body1" className={'section-subtitle'}>
								Connect with certified fitness professionals ready to guide your transformation
							</Typography>
						</Box>
						<Link href="/trainer">
							<Button variant="outlined" className={'view-all-btn'}>
								View All Trainers
							</Button>
						</Link>
					</Stack>
					<Grid container spacing={3}>
						{displayTrainers.map((trainer: any) => (
							<Grid item xs={12} sm={6} md={3} key={trainer._id}>
								<Link href={`/trainer/${trainer._id}`}>
									<Card className={'trainer-card'}>
										<Box
											className={'trainer-image'}
											style={{
												backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(${getTrainerImageUrl(trainer)})`,
											}}
										>
											<Chip
												icon={<StarIcon />}
												label={`${((trainer.memberRank || 0) / 10).toFixed(1)}`}
												size="small"
												className={'rating-chip'}
											/>
										</Box>
										<CardContent>
											<Stack direction="column" alignItems="center" spacing={1}>
												<Typography variant="h6" className={'trainer-name'}>
													{trainer.memberFullName || trainer.memberNick}
												</Typography>
												{trainer.memberAddress && (
													<Stack direction="row" alignItems="center" spacing={0.5}>
														<LocationOnIcon fontSize="small" color="action" />
														<Typography variant="caption" color="text.secondary">
															{trainer.memberAddress}
														</Typography>
													</Stack>
												)}
												{trainer.memberDesc && (
													<Typography variant="body2" color="text.secondary" className={'trainer-desc'} textAlign="center">
														{trainer.memberDesc}
													</Typography>
												)}
												<Stack direction="row" alignItems="center" spacing={1} mt={1}>
													<FitnessCenterIcon fontSize="small" color="action" />
													<Typography variant="caption" color="text.secondary">
														{trainer.memberLikes || 0} clients
													</Typography>
												</Stack>
												<Button variant="contained" fullWidth size="small" className={'view-profile-btn'}>
													View Profile
												</Button>
											</Stack>
										</CardContent>
									</Card>
								</Link>
							</Grid>
						))}
					</Grid>
				</Stack>
			</Stack>
		);
	}
};

export default TrainerShowcase;










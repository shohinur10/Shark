import React, { useState } from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import Link from 'next/link';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Workout } from '../../types/workout/workout';
import { WorkoutsInquiry } from '../../types/workout/workout.input';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { Direction } from '../../enums/common.enum';

interface FeaturedWorkoutsProps {
	initialInput?: WorkoutsInquiry;
}

const FeaturedWorkouts = (props: FeaturedWorkoutsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [featuredWorkouts, setFeaturedWorkouts] = useState<Workout[]>([]);

	const defaultInput: WorkoutsInquiry = {
		page: 1,
		limit: 8,
		sort: 'workoutViews',
		direction: Direction.DESC,
		search: {},
	};

	/** APOLLO REQUESTS **/
	// TODO: Add GET_WORKOUTS query when backend is ready
	// For now, using placeholder data structure
	// const {
	// 	loading: getWorkoutsLoading,
	// 	data: getWorkoutsData,
	// 	error: getWorkoutsError,
	// 	refetch: getWorkoutsRefetch,
	// } = useQuery(GET_WORKOUTS, {
	// 	fetchPolicy: 'cache-and-network',
	// 	variables: { input: initialInput || defaultInput },
	// 	notifyOnNetworkStatusChange: true,
	// 	onCompleted: (data: T) => {
	// 		setFeaturedWorkouts(data?.getWorkouts?.list || []);
	// 	},
	// });

	// Placeholder data until queries are ready
	React.useEffect(() => {
		// This will be replaced with actual query data
		setFeaturedWorkouts([]);
	}, []);

	if (device === 'mobile') {
		return (
			<Stack className={'featured-workouts'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Typography variant="h4" className={'section-title'}>
							Featured Workouts
						</Typography>
						<Typography variant="body2" className={'section-subtitle'}>
							Popular workouts to get you started
						</Typography>
					</Stack>
					<Stack className={'workouts-grid'}>
						<Swiper
							className={'featured-workouts-swiper'}
							slidesPerView={'auto'}
							spaceBetween={16}
							modules={[Autoplay]}
						>
							{featuredWorkouts.map((workout: Workout) => {
								return (
									<SwiperSlide key={workout._id} className={'workout-card'}>
										<Link href={`/workouts/${workout._id}`}>
											<Box component="div" className={'workout-card-inner'}>
												<Box component="div" className={'workout-image'}>
													{workout.workoutImage ? (
														<img src={workout.workoutImage} alt={workout.workoutTitle} />
													) : (
														<div className={'image-placeholder'}>Workout Image</div>
													)}
													{workout.isPremium && (
														<Box component="div" className={'premium-badge'}>Premium</Box>
													)}
												</Box>
												<Box component="div" className={'workout-info'}>
													<Typography variant="h6" className={'workout-title'}>
														{workout.workoutTitle}
													</Typography>
													<Stack direction="row" spacing={2} className={'workout-meta'}>
														<span>{workout.workoutDuration}</span>
														<span>•</span>
														<span>{workout.workoutDifficulty}</span>
														<span>•</span>
														<span>{workout.workoutCaloriesBurn} cal</span>
													</Stack>
												</Box>
											</Box>
										</Link>
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'featured-workouts'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Box component="div" className={'header-left'}>
							<Typography variant="h3" className={'section-title'}>
								Featured Workouts
							</Typography>
							<Typography variant="body1" className={'section-subtitle'}>
								Popular workouts to get you started on your fitness journey
							</Typography>
						</Box>
						<Box component="div" className={'header-right'}>
							<Link href="/workouts">
								<Button variant="outlined" className={'view-all-btn'}>
									View All Workouts
								</Button>
							</Link>
						</Box>
					</Stack>
					<Stack className={'workouts-grid'}>
						<Box component="div" className={'navigation-prev'}>
							<WestIcon className={'swiper-featured-prev'} />
						</Box>
						<Swiper
							className={'featured-workouts-swiper'}
							slidesPerView={'auto'}
							spaceBetween={24}
							modules={[Autoplay, Navigation]}
							navigation={{
								nextEl: '.swiper-featured-next',
								prevEl: '.swiper-featured-prev',
							}}
						>
							{featuredWorkouts.map((workout: Workout) => {
								return (
									<SwiperSlide key={workout._id} className={'workout-card'}>
										<Link href={`/workouts/${workout._id}`}>
											<Box component="div" className={'workout-card-inner'}>
												<Box component="div" className={'workout-image'}>
													{workout.workoutImage ? (
														<img src={workout.workoutImage} alt={workout.workoutTitle} />
													) : (
														<div className={'image-placeholder'}>Workout Image</div>
													)}
													{workout.isPremium && (
														<Box component="div" className={'premium-badge'}>Premium</Box>
													)}
													<Box component="div" className={'workout-overlay'}>
														<Button variant="contained" size="small" className={'play-btn'}>
															View Details
														</Button>
													</Box>
												</Box>
												<Box component="div" className={'workout-info'}>
													<Typography variant="h6" className={'workout-title'}>
														{workout.workoutTitle}
													</Typography>
													<Typography variant="body2" className={'workout-category'}>
														{workout.workoutCategory}
													</Typography>
													<Stack direction="row" spacing={2} className={'workout-meta'}>
														<span>{workout.workoutDuration}</span>
														<span>•</span>
														<span>{workout.workoutDifficulty}</span>
														<span>•</span>
														<span>{workout.workoutCaloriesBurn} cal</span>
													</Stack>
													<Stack direction="row" spacing={1} className={'workout-rating'}>
														<span>⭐ {workout.workoutRating || 0}</span>
														<span>({workout.workoutViews || 0} views)</span>
													</Stack>
												</Box>
											</Box>
										</Link>
									</SwiperSlide>
								);
							})}
						</Swiper>
						<Box component="div" className={'navigation-next'}>
							<EastIcon className={'swiper-featured-next'} />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default FeaturedWorkouts;


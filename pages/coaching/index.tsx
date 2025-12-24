import React from 'react';
import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, CardMedia, Chip, Avatar, Rating, Tabs, Tab, CircularProgress } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import Link from 'next/link';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import BusinessIcon from '@mui/icons-material/Business';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TRAINERS } from '../../apollo/user/query';
import { CREATE_BOOKING } from '../../apollo/user/mutation';
import { Member } from '../../libs/types/member/member';
import { TrainersInquiry } from '../../libs/types/member/member.input';
import { Direction } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { userVar } from '../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken } from '../../libs/auth';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Trainer Interface
interface Trainer {
	id: string;
	name: string;
	photo: string;
	experience: string;
	certifications: string[];
	specialization: string[];
	pricePerSession: number;
	packagePrice: number;
	packageSessions: number;
	availability: string;
	rating: number;
	reviews: number;
	location?: string;
	isOnline: boolean;
	isVerified: boolean;
}

// Online Coaching Plan Interface
interface CoachingPlan {
	id: string;
	name: string;
	duration: string;
	price: number;
	features: string[];
	popular?: boolean;
}

// Gym Partner Interface
interface GymPartner {
	id: string;
	name: string;
	logo: string;
	location: string;
	rating: number;
	specialties: string[];
	priceRange: string;
}

// Sample Data
const trainers: Trainer[] = [
	{
		id: '1',
		name: 'John Smith',
		photo: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
		experience: '10+ years',
		certifications: ['NASM-CPT', 'ACE Certified', 'Nutrition Specialist'],
		specialization: ['Strength Training', 'Weight Loss', 'Bodybuilding'],
		pricePerSession: 75,
		packagePrice: 600,
		packageSessions: 10,
		availability: 'Available Now',
		rating: 4.9,
		reviews: 127,
		location: 'New York, NY',
		isOnline: true,
		isVerified: true,
	},
	{
		id: '2',
		name: 'Sarah Johnson',
		photo: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
		experience: '8+ years',
		certifications: ['ACSM-CPT', 'Yoga Instructor', 'Pilates Certified'],
		specialization: ['Yoga', 'Pilates', 'Flexibility', 'Rehabilitation'],
		pricePerSession: 65,
		packagePrice: 550,
		packageSessions: 10,
		availability: 'Available in 2 hours',
		rating: 4.8,
		reviews: 89,
		location: 'Los Angeles, CA',
		isOnline: true,
		isVerified: true,
	},
	{
		id: '3',
		name: 'Mike Davis',
		photo: '/img/bodybuilders/pexels-leonmart-1552108.jpg',
		experience: '12+ years',
		certifications: ['NSCA-CSCS', 'Olympic Lifting', 'Powerlifting Coach'],
		specialization: ['Powerlifting', 'Olympic Lifting', 'Strength', 'Athletic Performance'],
		pricePerSession: 90,
		packagePrice: 800,
		packageSessions: 10,
		availability: 'Available Tomorrow',
		rating: 5.0,
		reviews: 203,
		location: 'Chicago, IL',
		isOnline: false,
		isVerified: true,
	},
	{
		id: '4',
		name: 'Emily Chen',
		photo: '/img/bodybuilders/pexels-mralpha-13451637.jpg',
		experience: '6+ years',
		certifications: ['ACE-CPT', 'HIIT Specialist', 'Nutrition Coach'],
		specialization: ['HIIT', 'Cardio', 'Weight Loss', 'Metabolic Training'],
		pricePerSession: 60,
		packagePrice: 500,
		packageSessions: 10,
		availability: 'Available Now',
		rating: 4.7,
		reviews: 156,
		location: 'Miami, FL',
		isOnline: true,
		isVerified: true,
	},
	{
		id: '5',
		name: 'David Wilson',
		photo: '/img/bodybuilders/pexels-mralpha-24809802.jpg',
		experience: '15+ years',
		certifications: ['ISSA-CPT', 'Corrective Exercise', 'Senior Fitness'],
		specialization: ['Corrective Exercise', 'Senior Fitness', 'Injury Rehabilitation'],
		pricePerSession: 85,
		packagePrice: 750,
		packageSessions: 10,
		availability: 'Available in 1 hour',
		rating: 4.9,
		reviews: 98,
		location: 'Boston, MA',
		isOnline: true,
		isVerified: true,
	},
	{
		id: '6',
		name: 'Lisa Martinez',
		photo: '/img/bodybuilders/pexels-oscar-machado-937103-3014237.jpg',
		experience: '7+ years',
		certifications: ['NASM-CPT', 'Pre/Post Natal', 'Group Fitness'],
		specialization: ['Pre/Post Natal', 'Women\'s Fitness', 'Group Training'],
		pricePerSession: 70,
		packagePrice: 600,
		packageSessions: 10,
		availability: 'Available Now',
		rating: 4.8,
		reviews: 142,
		location: 'Seattle, WA',
		isOnline: true,
		isVerified: true,
	},
];

const coachingPlans: CoachingPlan[] = [
	{
		id: '1',
		name: 'Starter Plan',
		duration: '1 Month',
		price: 99,
		features: [
			'2 Live Sessions per Week',
			'Custom Workout Plan',
			'Nutrition Guidance',
			'Progress Tracking',
			'Email Support',
		],
	},
	{
		id: '2',
		name: 'Premium Plan',
		duration: '3 Months',
		price: 249,
		features: [
			'3 Live Sessions per Week',
			'Custom Workout & Meal Plans',
			'24/7 Chat Support',
			'Video Form Checks',
			'Monthly Progress Reviews',
			'Access to Premium Content',
		],
		popular: true,
	},
	{
		id: '3',
		name: 'Elite Plan',
		duration: '6 Months',
		price: 449,
		features: [
			'Unlimited Live Sessions',
			'Fully Customized Programs',
			'Priority Support',
			'Weekly Check-ins',
			'Advanced Analytics',
			'Exclusive Community Access',
			'Supplement Recommendations',
		],
	},
];

const gymPartners: GymPartner[] = [
	{
		id: '1',
		name: 'Elite Fitness Center',
		logo: '/img/gym.img/pexels-cavemantraining-682087.jpg',
		location: 'New York, NY',
		rating: 4.8,
		specialties: ['Full Gym', 'Group Classes', 'Personal Training'],
		priceRange: '$50-100/month',
	},
	{
		id: '2',
		name: 'Powerhouse Gym',
		logo: '/img/gym.img/pexels-cavemantraining-682087.jpg',
		location: 'Los Angeles, CA',
		rating: 4.6,
		specialties: ['Powerlifting', 'Bodybuilding', 'Cardio Equipment'],
		priceRange: '$40-80/month',
	},
	{
		id: '3',
		name: 'Flex Fitness Studio',
		logo: '/img/gym.img/pexels-cavemantraining-682087.jpg',
		location: 'Chicago, IL',
		rating: 4.9,
		specialties: ['Yoga', 'Pilates', 'HIIT Classes'],
		priceRange: '$60-120/month',
	},
];

// Map API trainers to Trainer interface - defined outside component
const mapTrainerFromMember = (member: Member): Trainer => {
	return {
		id: member._id,
		name: member.memberFullName || member.memberNick,
		photo: member.memberImage || '/img/profile/defaultUser.svg',
		experience: member.trainerExperience 
			? `${member.trainerExperience} years` 
			: member.memberWorkouts 
				? `${member.memberWorkouts} workouts created` 
				: 'Experienced trainer',
		certifications: member.trainerCertifications || [],
		specialization: member.trainerSpecialties || [],
		pricePerSession: 75, // Default price, should come from trainer settings or subscription
		packagePrice: 600,
		packageSessions: 10,
		availability: 'Available Now', // Could be calculated from booking availability
		rating: member.trainerRating || 0,
		reviews: member.memberComments || 0, // Using memberComments as review count
		location: member.memberAddress || 'Location not specified',
		isOnline: true, // Could be determined from subscription or settings
		isVerified: member.memberStatus === 'ACTIVE' && (member.memberRank > 0 || (member.trainerRating && member.trainerRating > 0)),
	};
};

const CoachingPage: NextPage = () => {
	const device = useDeviceDetect();
	const [tabValue, setTabValue] = useState(0);
	const [apiTrainers, setApiTrainers] = useState<Member[]>([]);
	const user = useReactiveVar(userVar);
	const isLoggedIn = !!getJwtToken() && !!user._id;

	// Prepare trainers query input
	const trainersQueryInput: TrainersInquiry = {
		page: 1,
		limit: 20,
		sort: 'trainerRating',
		direction: Direction.DESC,
		search: {},
	};

	// Fetch trainers if logged in
	const {
		loading: trainersLoading,
		data: trainersData,
		error: trainersError,
	} = useQuery(GET_TRAINERS, {
		skip: !isLoggedIn,
		fetchPolicy: 'cache-and-network',
		variables: { input: trainersQueryInput },
		onCompleted: (data: T) => {
			setApiTrainers(data?.getTrainers?.list || []);
		},
	});

	// Note: Gym partners will use hardcoded data for now
	// In the future, this can be connected to a properties query

	// Create booking mutation
	const [createBooking, { loading: bookingLoading }] = useMutation(CREATE_BOOKING);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const handleBookSession = async (trainerId: string) => {
		if (!isLoggedIn) {
			// Redirect to login if not logged in
			window.location.href = `/account/login?redirect=/coaching`;
			return;
		}

		// Navigate to booking page
		window.location.href = `/bookings/new?trainerId=${trainerId}`;
	};


	// Use API data if logged in, otherwise use hardcoded data
	const displayTrainers = isLoggedIn && apiTrainers.length > 0 
		? apiTrainers.map(mapTrainerFromMember)
		: trainers;

	// Gym partners use hardcoded data for now (can be connected to properties API later)
	const displayGymPartners = gymPartners;

	if (device === 'mobile') {
		return (
			<Stack className={'coaching-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Coaching</Typography>
					<div>MOBILE COACHING PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'coaching-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'}>
						<Typography variant="h2" className={'page-title'}>
							Premium Coaching Services
						</Typography>
						<Typography variant="h6" className={'page-subtitle'}>
							Work with certified trainers and achieve your fitness goals faster
						</Typography>
					</Stack>

					{/* Tabs */}
					<Box className={'coaching-tabs-section'}>
						<Tabs value={tabValue} onChange={handleTabChange} className={'coaching-tabs'}>
							<Tab label="Personal Trainers" />
							<Tab label="Online Coaching Plans" />
							<Tab label="Gym Partners" />
						</Tabs>
					</Box>

					{/* Personal Trainers Section */}
					{tabValue === 0 && (
						<Box className={'trainers-section'}>
							{isLoggedIn && trainersLoading ? (
								<Box display="flex" justifyContent="center" p={4}>
									<CircularProgress />
								</Box>
							) : displayTrainers.length === 0 ? (
								<Box className={'empty-state'} p={4}>
									<Typography variant="h6">No trainers found</Typography>
									<Typography variant="body2" color="text.secondary">
										{isLoggedIn ? 'Try adjusting your search.' : 'Please log in to see available trainers.'}
									</Typography>
								</Box>
							) : (
								<Grid container spacing={3}>
									{displayTrainers.map((trainer) => (
										<Grid item xs={12} sm={6} md={4} key={trainer.id}>
											<Card className={'trainer-card'}>
												<Box className={'trainer-header'}>
												<CardMedia
													component="div"
													className={'trainer-photo'}
													style={{
														backgroundImage: `url(${trainer.photo})`,
														backgroundSize: 'cover',
														backgroundPosition: 'center',
													}}
												>
													{trainer.isVerified && (
														<Box className={'verified-badge'}>
															<VerifiedIcon />
														</Box>
													)}
													{trainer.isOnline && (
														<Chip
															icon={<VideoCallIcon />}
															label="Online"
															size="small"
															className={'online-badge'}
														/>
													)}
												</CardMedia>
												</Box>
												<CardContent>
												<Stack spacing={1.5}>
													<Box>
														<Typography variant="h5" className={'trainer-name'}>
															{trainer.name}
														</Typography>
														<Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
															<Rating value={trainer.rating} readOnly precision={0.1} size="small" />
															<Typography variant="body2" className={'rating-text'}>
																{trainer.rating} ({trainer.reviews} reviews)
															</Typography>
														</Stack>
													</Box>

													<Box className={'trainer-experience'}>
														<AccessTimeIcon className={'icon'} />
														<Typography variant="body2">{trainer.experience} Experience</Typography>
													</Box>

													{trainer.location && (
														<Box className={'trainer-location'}>
															<LocationOnIcon className={'icon'} />
															<Typography variant="body2">{trainer.location}</Typography>
														</Box>
													)}

													<Box className={'trainer-specialization'}>
														<Typography variant="caption" className={'label'}>
															Specialization:
														</Typography>
														<Stack direction="row" spacing={0.5} flexWrap="wrap" mt={0.5}>
															{trainer.specialization.map((spec, idx) => (
																<Chip key={idx} label={spec} size="small" className={'spec-chip'} />
															))}
														</Stack>
													</Box>

													<Box className={'trainer-certifications'}>
														<Typography variant="caption" className={'label'}>
															Certifications:
														</Typography>
														<Typography variant="body2" className={'certs-text'}>
															{trainer.certifications.length > 0 
																? trainer.certifications.join(', ') 
																: 'Certifications coming soon'}
														</Typography>
													</Box>
													{/* Additional trainer info from API - using all available data */}
													{(() => {
														const apiTrainer = apiTrainers.find(t => t._id === trainer.id);
														if (!apiTrainer) return null;
														
														return (
															<>
																{(apiTrainer.trainerBio || apiTrainer.memberDesc) && (
																	<Box className={'trainer-bio'} mt={1}>
																		<Typography variant="caption" className={'label'}>
																			About:
																		</Typography>
																		<Typography variant="body2" className={'bio-text'}>
																			{apiTrainer.trainerBio || apiTrainer.memberDesc}
																		</Typography>
																	</Box>
																)}
																<Box className={'trainer-stats'} mt={1}>
																	<Stack direction="row" spacing={2} flexWrap="wrap">
																		{apiTrainer.memberWorkouts > 0 && (
																			<Typography variant="caption" color="text.secondary">
																				{apiTrainer.memberWorkouts} Workouts
																			</Typography>
																		)}
																		{apiTrainer.memberFollowers && apiTrainer.memberFollowers > 0 && (
																			<Typography variant="caption" color="text.secondary">
																				{apiTrainer.memberFollowers} Followers
																			</Typography>
																		)}
																		{apiTrainer.memberPoints > 0 && (
																			<Typography variant="caption" color="text.secondary">
																				{apiTrainer.memberPoints} Points
																			</Typography>
																		)}
																	</Stack>
																</Box>
															</>
														);
													})()}

													<Box className={'trainer-availability'}>
														<CalendarTodayIcon className={'icon'} />
														<Typography variant="body2" className={'availability-text'}>
															{trainer.availability}
														</Typography>
													</Box>

													<Box className={'trainer-pricing'}>
														<Stack direction="row" justifyContent="space-between" alignItems="center">
															<Box>
																<Typography variant="h6" className={'price'}>
																	${trainer.pricePerSession}
																</Typography>
																<Typography variant="caption" className={'price-label'}>
																	per session
																</Typography>
															</Box>
															<Box className={'package-info'}>
																<Typography variant="body2" className={'package-price'}>
																	${trainer.packagePrice} for {trainer.packageSessions} sessions
																</Typography>
																<Typography variant="caption" className={'package-savings'}>
																	Save ${trainer.pricePerSession * trainer.packageSessions - trainer.packagePrice}
																</Typography>
															</Box>
														</Stack>
													</Box>

													<Button
														variant="contained"
														fullWidth
														className={'book-session-btn'}
														onClick={() => handleBookSession(trainer.id)}
														startIcon={<CalendarTodayIcon />}
													>
														Book Session
													</Button>
												</Stack>
											</CardContent>
											</Card>
										</Grid>
									))}
								</Grid>
							)}
						</Box>
					)}

					{/* Online Coaching Plans Section */}
					{tabValue === 1 && (
						<Box className={'coaching-plans-section'}>
							<Grid container spacing={3}>
								{coachingPlans.map((plan) => (
									<Grid item xs={12} md={4} key={plan.id}>
										<Card className={`plan-card ${plan.popular ? 'popular' : ''}`}>
											{plan.popular && (
												<Box className={'popular-badge'}>
													<Typography variant="caption">Most Popular</Typography>
												</Box>
											)}
											<CardContent>
												<Stack spacing={2}>
													<Box>
														<Typography variant="h5" className={'plan-name'}>
															{plan.name}
														</Typography>
														<Typography variant="body2" className={'plan-duration'}>
															{plan.duration}
														</Typography>
													</Box>

													<Box className={'plan-price'}>
														<Typography variant="h3" className={'price-amount'}>
															${plan.price}
														</Typography>
														<Typography variant="body2" className={'price-period'}>
															per {plan.duration.toLowerCase()}
														</Typography>
													</Box>

													<Box className={'plan-features'}>
														<Typography variant="subtitle2" className={'features-title'}>
															What's Included:
														</Typography>
														<Stack spacing={1} mt={1}>
															{plan.features.map((feature, idx) => (
																<Stack key={idx} direction="row" alignItems="center" spacing={1}>
																	<StarIcon className={'feature-icon'} />
																	<Typography variant="body2" className={'feature-text'}>
																		{feature}
																	</Typography>
																</Stack>
															))}
														</Stack>
													</Box>

													<Button
														variant="contained"
														fullWidth
														className={'select-plan-btn'}
														size="large"
													>
														Select Plan
													</Button>
												</Stack>
											</CardContent>
										</Card>
									</Grid>
								))}
							</Grid>
						</Box>
					)}

					{/* Gym Partners Section */}
					{tabValue === 2 && (
						<Box className={'gym-partners-section'}>
							<Grid container spacing={3}>
								{displayGymPartners.map((gym) => (
									<Grid item xs={12} sm={6} md={4} key={gym.id}>
										<Card className={'gym-card'}>
											<CardMedia
												component="div"
												className={'gym-logo'}
												style={{
													backgroundImage: `url(${gym.logo})`,
													backgroundSize: 'cover',
													backgroundPosition: 'center',
												}}
											/>
											<CardContent>
												<Stack spacing={1.5}>
													<Box>
														<Typography variant="h5" className={'gym-name'}>
															{gym.name}
														</Typography>
														<Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
															<LocationOnIcon className={'icon'} />
															<Typography variant="body2">{gym.location}</Typography>
														</Stack>
													</Box>

													<Stack direction="row" alignItems="center" spacing={1}>
														<Rating value={gym.rating} readOnly precision={0.1} size="small" />
														<Typography variant="body2" className={'rating-text'}>
															{gym.rating}
														</Typography>
													</Stack>

													<Box className={'gym-specialties'}>
														<Typography variant="caption" className={'label'}>
															Specialties:
														</Typography>
														<Stack direction="row" spacing={0.5} flexWrap="wrap" mt={0.5}>
															{gym.specialties.map((specialty, idx) => (
																<Chip key={idx} label={specialty} size="small" className={'specialty-chip'} />
															))}
														</Stack>
													</Box>

													<Box className={'gym-pricing'}>
														<BusinessIcon className={'icon'} />
														<Typography variant="body2" className={'price-range'}>
															{gym.priceRange}
														</Typography>
													</Box>

													<Button
														variant="outlined"
														fullWidth
														className={'view-gym-btn'}
													>
														View Details
													</Button>
												</Stack>
											</CardContent>
										</Card>
									</Grid>
								))}
							</Grid>
						</Box>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(CoachingPage);










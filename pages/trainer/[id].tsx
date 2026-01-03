import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
	Container,
	Box,
	Typography,
	Stack,
	Tabs,
	Tab,
	Grid,
	Card,
	CardContent,
	CardMedia,
	Chip,
	Rating,
	Button,
	Alert,
	Skeleton,
	Pagination,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_MEMBER, GET_TRAINER_WORKOUTS, GET_ALL_SERVICES, GET_REVIEWS } from '../../apollo/user/query';
import { userVar } from '../../apollo/store';
import TrainerProfileHeader from '../../libs/components/trainer/TrainerProfileHeader';
import TrainerWorkoutsGrid from '../../libs/components/trainer/TrainerWorkoutsGrid';
import BookingModal from '../../libs/components/trainer/BookingModal';
import { Member } from '../../libs/types/member/member';
import { Workout } from '../../libs/types/workout/workout';
import { Service } from '../../libs/types/service/service';
import { Review } from '../../libs/types/review/review';
import { TrainerWorkoutsInquiry } from '../../libs/types/workout/workout.input';
import { ServicesInquiry } from '../../libs/types/service/service.input';
import { ReviewsInquiry } from '../../libs/types/review/review.input';
import { Direction } from '../../libs/enums/common.enum';
import { ServiceStatus } from '../../libs/enums/booking.enum';
import { REACT_APP_API_URL } from '../../libs/config';
import { CustomJwtPayload } from '../../libs/types/customJwtPayload';
import moment from 'moment';

export const getServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;
	return (
		<div role="tabpanel" hidden={value !== index} id={`trainer-tabpanel-${index}`} aria-labelledby={`trainer-tab-${index}`} {...other}>
			{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
		</div>
	);
}

const TrainerProfilePage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar) as CustomJwtPayload | null;
	const { id } = router.query;

	const [tabValue, setTabValue] = useState(0);
	const [bookingModalOpen, setBookingModalOpen] = useState(false);
	const [workoutsPage, setWorkoutsPage] = useState(1);
	const [servicesPage, setServicesPage] = useState(1);
	const [reviewsPage, setReviewsPage] = useState(1);

	const limit = 12;

	// Fetch trainer profile
	const { data: trainerData, loading: trainerLoading, error: trainerError, refetch: refetchTrainer } = useQuery(GET_MEMBER, {
		variables: { input: id as string },
		fetchPolicy: 'cache-and-network',
		skip: !id,
		onError: (error) => {
			console.error('❌ GET_MEMBER query error:', error);
		},
	});

	const trainer = trainerData?.getMember as Member | undefined;

	// Fetch trainer workouts
	const workoutsInquiry: TrainerWorkoutsInquiry = useMemo(
		() => ({
			trainerId: id as string,
			page: workoutsPage,
			limit,
			sort: 'createdAt',
			direction: Direction.DESC,
		}),
		[id, workoutsPage, limit]
	);

	const { data: workoutsData, loading: workoutsLoading, error: workoutsError } = useQuery(GET_TRAINER_WORKOUTS, {
		variables: { input: workoutsInquiry },
		fetchPolicy: 'cache-and-network',
		skip: !id,
		onError: (error) => {
			const errorDetails = {
				message: error.message,
				graphQLErrors: error.graphQLErrors?.map((err: any) => ({
					message: err.message,
					locations: err.locations,
					path: err.path,
				})),
				networkError: error.networkError ? {
					name: error.networkError.name,
					message: error.networkError.message,
				} : null,
			};
			console.error('❌ GET_TRAINER_WORKOUTS query error:', JSON.stringify(errorDetails, null, 2));
		},
	});

	const workouts = (workoutsData?.getTrainerWorkouts?.list || []) as Workout[];
	const workoutsTotal = workoutsData?.getTrainerWorkouts?.metaCounter?.[0]?.total || 0;

	// Fetch trainer services
	const servicesInquiry: ServicesInquiry = useMemo(
		() => ({
			page: servicesPage,
			limit,
			sort: 'createdAt',
			direction: Direction.DESC,
			search: {
				status: ServiceStatus.ACTIVE,
			},
		}),
		[servicesPage, limit]
	);

	const { data: servicesData, loading: servicesLoading, error: servicesError } = useQuery(GET_ALL_SERVICES, {
		variables: { input: servicesInquiry },
		fetchPolicy: 'cache-and-network',
		skip: !id,
		onError: (error) => {
			const errorDetails = {
				message: error.message,
				graphQLErrors: error.graphQLErrors?.map((err: any) => ({
					message: err.message,
					locations: err.locations,
					path: err.path,
				})),
				networkError: error.networkError ? {
					name: error.networkError.name,
					message: error.networkError.message,
				} : null,
			};
			console.error('❌ GET_ALL_SERVICES query error (Trainer Profile):', JSON.stringify(errorDetails, null, 2));
		},
	});

	// Filter services by trainer
	// Note: Service type doesn't have createdBy field, so we show all active services
	// In a real app, you'd filter by trainerId if the service schema includes it
	const allServices = (servicesData?.getAllServices?.list || []) as Service[];
	const services = useMemo(() => {
		// Filter only active services
		// TODO: Add trainerId filtering when service schema supports it
		return allServices.filter((s: Service) => s.status === ServiceStatus.ACTIVE);
	}, [allServices]);

	const servicesTotal = servicesData?.getAllServices?.metaCounter?.[0]?.total || 0;

	// Fetch reviews
	const reviewsInquiry: ReviewsInquiry = useMemo(
		() => ({
			page: reviewsPage,
			limit,
			sort: 'createdAt',
			direction: Direction.DESC,
			trainerId: id as string,
		}),
		[id, reviewsPage, limit]
	);

	const { data: reviewsData, loading: reviewsLoading, error: reviewsError } = useQuery(GET_REVIEWS, {
		variables: { input: reviewsInquiry },
		fetchPolicy: 'cache-and-network',
		skip: !id,
		onError: (error) => {
			const errorDetails = {
				message: error.message,
				graphQLErrors: error.graphQLErrors?.map((err: any) => ({
					message: err.message,
					locations: err.locations,
					path: err.path,
				})),
				networkError: error.networkError ? {
					name: error.networkError.name,
					message: error.networkError.message,
				} : null,
			};
			console.error('❌ GET_REVIEWS query error:', JSON.stringify(errorDetails, null, 2));
		},
	});

	const reviews = (reviewsData?.getReviews?.list || []) as Review[];
	const reviewsTotal = reviewsData?.getReviews?.metaCounter?.[0]?.total || 0;

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const handleBookSession = () => {
		if (!user?._id) {
			router.push('/account/login');
			return;
		}
		setBookingModalOpen(true);
	};

	if (trainerLoading) {
		return (
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Stack spacing={3}>
					<Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
					<Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
				</Stack>
			</Container>
		);
	}

	if (trainerError || !trainer) {
		return (
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Alert severity="error" sx={{ mb: 3 }}>
					Trainer not found or error loading trainer profile.
				</Alert>
				<Button variant="contained" onClick={() => router.push('/trainers')}>
					Back to Trainers
				</Button>
			</Container>
		);
	}

	if (device === 'mobile') {
		return (
			<Container maxWidth="sm" sx={{ py: 3 }}>
				{/* Trainer Profile Header */}
				<TrainerProfileHeader trainer={trainer} onBookSession={handleBookSession} onRefetch={refetchTrainer} />

				{/* Tabs */}
				<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
					<Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
						<Tab label="Workouts" icon={<FitnessCenterIcon />} iconPosition="start" />
						<Tab label="Services" icon={<LocalOfferIcon />} iconPosition="start" />
						<Tab label="Reviews" icon={<StarIcon />} iconPosition="start" />
					</Tabs>
				</Box>

				{/* Tab Panels */}
				<TabPanel value={tabValue} index={0}>
					{workoutsLoading ? (
						<Stack spacing={2}>
							{[1, 2, 3].map((i) => (
								<Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
							))}
						</Stack>
				) : workoutsError ? (
					<Alert severity="error">Error loading workouts. Please try again.</Alert>
				) : workouts.length === 0 ? (
					<Alert severity="info">No workouts available yet.</Alert>
				) : (
					<TrainerWorkoutsGrid workouts={workouts} loading={workoutsLoading} />
				)}
				</TabPanel>

				<TabPanel value={tabValue} index={1}>
					{servicesLoading ? (
						<Stack spacing={2}>
							{[1, 2, 3].map((i) => (
								<Skeleton key={i} variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
							))}
						</Stack>
				) : servicesError ? (
					<Alert severity="error">Error loading services. Please try again.</Alert>
				) : services.length === 0 ? (
					<Alert severity="info">No services available yet.</Alert>
				) : (
						<Stack spacing={2}>
							{services.map((service: Service) => (
								<Card key={service._id} sx={{ borderRadius: 2, border: '1px solid #E5E5E5' }}>
									<CardContent>
										<Stack spacing={2}>
											<Typography variant="h6" sx={{ fontWeight: 600 }}>
												{service.title}
											</Typography>
											{service.description && (
												<Typography variant="body2" sx={{ color: '#757575' }}>
													{service.description}
												</Typography>
											)}
											<Stack direction="row" spacing={1} flexWrap="wrap">
												<Chip label={service.bookingType} size="small" />
												{service.difficulty && <Chip label={service.difficulty} size="small" />}
											</Stack>
											<Stack direction="row" alignItems="center" spacing={2}>
												{service.fixedPrice ? (
													<Typography variant="h6" sx={{ color: '#E10600', fontWeight: 700 }}>
														${service.fixedPrice.toFixed(2)}
													</Typography>
												) : service.pricePerHour ? (
													<Typography variant="h6" sx={{ color: '#E10600', fontWeight: 700 }}>
														${service.pricePerHour.toFixed(2)}/hour
													</Typography>
												) : null}
											</Stack>
										</Stack>
									</CardContent>
								</Card>
							))}
						</Stack>
					)}
				</TabPanel>

				<TabPanel value={tabValue} index={2}>
					{reviewsLoading ? (
						<Stack spacing={2}>
							{[1, 2, 3].map((i) => (
								<Skeleton key={i} variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
							))}
						</Stack>
				) : reviewsError ? (
					<Alert severity="error">Error loading reviews. Please try again.</Alert>
				) : reviews.length === 0 ? (
					<Alert severity="info">No reviews yet.</Alert>
				) : (
						<Stack spacing={2}>
							{reviews.map((review: Review) => (
								<Card key={review._id} sx={{ borderRadius: 2, border: '1px solid #E5E5E5' }}>
									<CardContent>
										<Stack spacing={1.5}>
											<Stack direction="row" alignItems="center" spacing={1}>
												<Rating value={review.rating} readOnly size="small" />
												<Typography variant="body2" sx={{ color: '#757575' }}>
													{moment(review.createdAt).format('MMM DD, YYYY')}
												</Typography>
											</Stack>
											{review.reviewTitle && (
												<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
													{review.reviewTitle}
												</Typography>
											)}
											{review.reviewContent && (
												<Typography variant="body2" sx={{ color: '#616161' }}>
													{review.reviewContent}
												</Typography>
											)}
										</Stack>
									</CardContent>
								</Card>
							))}
						</Stack>
					)}
				</TabPanel>

				{/* Booking Modal */}
				{bookingModalOpen && trainer && (
					<BookingModal
						open={bookingModalOpen}
						onClose={() => setBookingModalOpen(false)}
						trainerId={trainer._id}
						trainerName={trainer.memberFullName || trainer.memberNick || 'Trainer'}
					/>
				)}
			</Container>
		);
	}

	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
			{/* Trainer Profile Header */}
			<TrainerProfileHeader trainer={trainer} onBookSession={handleBookSession} onRefetch={refetchTrainer} />

			{/* Tabs */}
			<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
				<Tabs value={tabValue} onChange={handleTabChange} aria-label="trainer profile tabs">
					<Tab label="Workouts" icon={<FitnessCenterIcon />} iconPosition="start" />
					<Tab label="Services" icon={<LocalOfferIcon />} iconPosition="start" />
					<Tab label="Reviews" icon={<StarIcon />} iconPosition="start" />
				</Tabs>
			</Box>

			{/* Tab Panels */}
			<TabPanel value={tabValue} index={0}>
				{workoutsLoading ? (
					<Grid container spacing={3}>
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<Grid item xs={12} sm={6} md={4} key={i}>
								<Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
							</Grid>
						))}
					</Grid>
			) : workoutsError ? (
				<Alert severity="error" sx={{ mb: 3 }}>
					Error loading workouts. Please try again.
				</Alert>
			) : workouts.length === 0 ? (
				<Alert severity="info" sx={{ mb: 3 }}>
					No workouts available yet.
				</Alert>
			) : (
					<>
						<TrainerWorkoutsGrid workouts={workouts} loading={workoutsLoading} />
						{Math.ceil(workoutsTotal / limit) > 1 && (
							<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
								<Pagination
									count={Math.ceil(workoutsTotal / limit)}
									page={workoutsPage}
									onChange={(_e, value) => setWorkoutsPage(value)}
								/>
							</Box>
						)}
					</>
				)}
			</TabPanel>

			<TabPanel value={tabValue} index={1}>
				{servicesLoading ? (
					<Grid container spacing={3}>
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<Grid item xs={12} sm={6} md={4} key={i}>
								<Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
							</Grid>
						))}
					</Grid>
			) : servicesError ? (
				<Alert severity="error" sx={{ mb: 3 }}>
					Error loading services. Please try again.
				</Alert>
			) : services.length === 0 ? (
				<Alert severity="info" sx={{ mb: 3 }}>
					No services available yet.
				</Alert>
			) : (
					<>
						<Grid container spacing={3}>
							{services.map((service: Service) => (
								<Grid item xs={12} sm={6} md={4} key={service._id}>
									<Card
										sx={{
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
											borderRadius: 2,
											border: '1px solid #E5E5E5',
											transition: 'all 0.3s ease',
											cursor: 'pointer',
											'&:hover': {
												borderColor: '#E10600',
												boxShadow: '0 8px 24px rgba(225, 6, 0, 0.12)',
												transform: 'translateY(-4px)',
											},
										}}
									>
										<CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
											<Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#212121' }}>
												{service.title}
											</Typography>
											{service.description && (
												<Typography
													variant="body2"
													sx={{
														color: '#757575',
														mb: 2,
														display: '-webkit-box',
														WebkitLineClamp: 2,
														WebkitBoxOrient: 'vertical',
														overflow: 'hidden',
														flex: 1,
													}}
												>
													{service.description}
												</Typography>
											)}
											<Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
												<Chip label={service.bookingType} size="small" />
												{service.difficulty && <Chip label={service.difficulty} size="small" />}
											</Stack>
											{service.durationOptions && service.durationOptions.length > 0 && (
												<Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 2 }}>
													<AccessTimeIcon sx={{ fontSize: 18, color: '#757575' }} />
													<Typography variant="body2" sx={{ color: '#757575' }}>
														{service.durationOptions.join(', ')} min
													</Typography>
												</Stack>
											)}
											<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 'auto' }}>
												{service.fixedPrice ? (
													<Typography variant="h6" sx={{ color: '#E10600', fontWeight: 700 }}>
														${service.fixedPrice.toFixed(2)}
													</Typography>
												) : service.pricePerHour ? (
													<Typography variant="h6" sx={{ color: '#E10600', fontWeight: 700 }}>
														${service.pricePerHour.toFixed(2)}/hour
													</Typography>
												) : (
													<Typography variant="body2" sx={{ color: '#757575' }}>
														Contact for pricing
													</Typography>
												)}
												<Button
													variant="contained"
													size="small"
													onClick={handleBookSession}
													sx={{
														backgroundColor: '#E10600',
														'&:hover': { backgroundColor: '#C10500' },
														textTransform: 'none',
														fontWeight: 600,
													}}
												>
													Book Now
												</Button>
											</Stack>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
						{Math.ceil(servicesTotal / limit) > 1 && (
							<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
								<Pagination
									count={Math.ceil(servicesTotal / limit)}
									page={servicesPage}
									onChange={(_e, value) => setServicesPage(value)}
								/>
							</Box>
						)}
					</>
				)}
			</TabPanel>

			<TabPanel value={tabValue} index={2}>
				{reviewsLoading ? (
					<Grid container spacing={3}>
						{[1, 2, 3].map((i) => (
							<Grid item xs={12} key={i}>
								<Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
							</Grid>
						))}
					</Grid>
			) : reviewsError ? (
				<Alert severity="error" sx={{ mb: 3 }}>
					Error loading reviews. Please try again.
				</Alert>
			) : reviews.length === 0 ? (
				<Alert severity="info" sx={{ mb: 3 }}>
					No reviews yet. Be the first to review this trainer!
				</Alert>
			) : (
					<>
						<Stack spacing={3}>
							{reviews.map((review: Review) => (
								<Card key={review._id} sx={{ borderRadius: 2, border: '1px solid #E5E5E5' }}>
									<CardContent>
										<Stack spacing={2}>
											<Stack direction="row" alignItems="center" justifyContent="space-between">
												<Stack direction="row" alignItems="center" spacing={1.5}>
													<Rating value={review.rating} readOnly size="small" />
													<Typography variant="body2" sx={{ color: '#757575' }}>
														{moment(review.createdAt).format('MMMM DD, YYYY')}
													</Typography>
												</Stack>
												{review.helpfulCount > 0 && (
													<Typography variant="body2" sx={{ color: '#757575' }}>
														{review.helpfulCount} helpful
													</Typography>
												)}
											</Stack>
											{review.reviewTitle && (
												<Typography variant="h6" sx={{ fontWeight: 600, color: '#212121' }}>
													{review.reviewTitle}
												</Typography>
											)}
											{review.reviewContent && (
												<Typography variant="body1" sx={{ color: '#616161', lineHeight: 1.7 }}>
													{review.reviewContent}
												</Typography>
											)}
											{review.reviewImages && review.reviewImages.length > 0 && (
												<Stack direction="row" spacing={1} flexWrap="wrap">
													{review.reviewImages.map((img: string, idx: number) => (
														<Box
															key={idx}
															component="img"
															src={`${REACT_APP_API_URL}/${img}`}
															sx={{
																width: 100,
																height: 100,
																objectFit: 'cover',
																borderRadius: 1,
																border: '1px solid #E5E5E5',
															}}
														/>
													))}
												</Stack>
											)}
										</Stack>
									</CardContent>
								</Card>
							))}
						</Stack>
						{Math.ceil(reviewsTotal / limit) > 1 && (
							<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
								<Pagination
									count={Math.ceil(reviewsTotal / limit)}
									page={reviewsPage}
									onChange={(_e, value) => setReviewsPage(value)}
								/>
							</Box>
						)}
					</>
				)}
			</TabPanel>

			{/* Booking Modal */}
			{bookingModalOpen && trainer && (
				<BookingModal
					open={bookingModalOpen}
					onClose={() => setBookingModalOpen(false)}
					trainerId={trainer._id}
					trainerName={trainer.memberFullName || trainer.memberNick || 'Trainer'}
				/>
			)}
		</Container>
	);
};

export default withLayoutBasic(TrainerProfilePage);


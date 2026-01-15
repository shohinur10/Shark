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
	Alert,
	Skeleton,
	Pagination,
	Avatar,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import StarIcon from '@mui/icons-material/Star';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery } from '@apollo/client';
import { GET_MEMBER, GET_TRAINER_WORKOUTS } from '../../apollo/user/query';
import { Member } from '../../libs/types/member/member';
import { Workout } from '../../libs/types/workout/workout';
import { TrainerWorkoutsInquiry } from '../../libs/types/workout/workout.input';
import { Direction } from '../../libs/enums/common.enum';
import { REACT_APP_API_URL } from '../../libs/config';
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

// Helper function to validate MongoDB ObjectId format
const isValidObjectId = (id: string): boolean => {
	// MongoDB ObjectId is 24 hex characters
	return /^[0-9a-fA-F]{24}$/.test(id);
};

// Known routes that should not be treated as trainer IDs
const knownRoutes = ['meal-plans', 'workouts', 'create', 'index'];

const TrainerProfilePage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { id } = router.query;

	const [tabValue, setTabValue] = useState(0);
	const [workoutsPage, setWorkoutsPage] = useState(1);

	const limit = 12;
	
	// Validate that the ID is a valid ObjectId and not a known route
	const isValidId = typeof id === 'string' && 
		isValidObjectId(id) && 
		!knownRoutes.includes(id.toLowerCase());
	
	const trainerId = isValidId ? id : undefined;

	// Fetch trainer profile
	const { data: trainerData, loading: trainerLoading, error: trainerError } = useQuery(GET_MEMBER, {
		variables: { input: trainerId! },
		fetchPolicy: 'cache-and-network',
		skip: !trainerId,
	});

	const trainer = trainerData?.getMember as Member | undefined;

	// Fetch trainer workouts
	const workoutsInquiry: TrainerWorkoutsInquiry | null = useMemo(
		() => {
			if (!trainerId) return null;
			return {
				trainerId: trainerId,
				page: workoutsPage,
				limit,
				sort: 'createdAt',
				direction: Direction.DESC,
			};
		},
		[trainerId, workoutsPage, limit]
	);

	const { data: workoutsData, loading: workoutsLoading } = useQuery(GET_TRAINER_WORKOUTS, {
		variables: { input: workoutsInquiry! },
		fetchPolicy: 'cache-and-network',
		skip: !trainerId || !workoutsInquiry,
	});

	const workouts = (workoutsData?.getTrainerWorkouts?.list || []) as Workout[];
	const workoutsTotal = workoutsData?.getTrainerWorkouts?.metaCounter?.[0]?.total || 0;

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	// Check if ID is invalid format or a known route FIRST (before loading check)
	// This prevents unnecessary API calls with invalid IDs
	if (typeof id === 'string' && (!isValidObjectId(id) || knownRoutes.includes(id.toLowerCase()))) {
		// If it's a known route, don't treat it as a trainer ID
		// This prevents errors when navigating to routes like /trainer/meal-plans
		return (
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Alert severity="info" sx={{ mb: 3 }}>
					This page requires a valid trainer ID. Please check the URL.
				</Alert>
			</Container>
		);
	}

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
			</Container>
		);
	}

	const trainerImage = trainer.memberImage ? `${REACT_APP_API_URL}/${trainer.memberImage}` : '/img/profile/defaultUser.svg';

	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
			{/* Trainer Profile Header */}
			<Card sx={{ mb: 4, borderRadius: 2 }}>
				<CardContent>
					<Stack direction="row" spacing={3} alignItems="center">
						<Avatar
							src={trainerImage}
							sx={{ width: 120, height: 120 }}
						>
							{trainer.memberFullName?.[0] || trainer.memberNick?.[0] || 'T'}
						</Avatar>
						<Box sx={{ flex: 1 }}>
							<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
								{trainer.memberFullName || trainer.memberNick || 'Trainer'}
							</Typography>
							<Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
								Certified Trainer
							</Typography>
							<Stack direction="row" spacing={2}>
								<Typography variant="body2" color="text.secondary">
									👁 {trainer.memberViews || 0} views
								</Typography>
								<Typography variant="body2" color="text.secondary">
									❤️ {trainer.memberLikes || 0} likes
								</Typography>
							</Stack>
						</Box>
					</Stack>
				</CardContent>
			</Card>

			{/* Tabs */}
			<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
				<Tabs value={tabValue} onChange={handleTabChange} aria-label="trainer profile tabs">
					<Tab label="Workouts" icon={<FitnessCenterIcon />} iconPosition="start" />
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
				) : workouts.length === 0 ? (
					<Alert severity="info" sx={{ mb: 3 }}>
						No workouts available yet.
					</Alert>
				) : (
					<>
						<Grid container spacing={3}>
							{workouts.map((workout: Workout) => (
								<Grid item xs={12} sm={6} md={4} key={workout._id}>
									<Card
										sx={{
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
											cursor: 'pointer',
											transition: 'transform 0.2s, box-shadow 0.2s',
											'&:hover': {
												transform: 'translateY(-4px)',
												boxShadow: 4,
											},
										}}
										onClick={() => router.push(`/workouts/${workout._id}`)}
									>
										{workout.workoutImage && (
											<CardMedia
												component="img"
												height="200"
												image={`${REACT_APP_API_URL}/${workout.workoutImage}`}
												alt={workout.workoutTitle}
											/>
										)}
										<CardContent sx={{ flexGrow: 1 }}>
											<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
												{workout.workoutTitle}
											</Typography>
											<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
												{workout.workoutDesc}
											</Typography>
											<Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
												<Chip label={workout.workoutCategory} size="small" />
												<Chip label={workout.workoutDifficulty} size="small" />
											</Stack>
											<Stack direction="row" spacing={2}>
												<Typography variant="caption" color="text.secondary">
													👁 {workout.workoutViews || 0}
												</Typography>
												<Typography variant="caption" color="text.secondary">
													❤️ {workout.workoutLikes || 0}
												</Typography>
												{workout.workoutRating > 0 && (
													<Stack direction="row" spacing={0.5} alignItems="center">
														<StarIcon sx={{ fontSize: 16, color: '#FFD700' }} />
														<Typography variant="caption" color="text.secondary">
															{workout.workoutRating.toFixed(1)}
														</Typography>
													</Stack>
												)}
											</Stack>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
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
		</Container>
	);
};

export default withLayoutBasic(TrainerProfilePage);

import React, { useState } from 'react';
import {
	Drawer,
	Box,
	Typography,
	IconButton,
	Avatar,
	Rating,
	Chip,
	Stack,
	Tab,
	Tabs,
	Card,
	CardContent,
	CardMedia,
	Button,
	Skeleton,
	Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Member } from '../../types/member/member';
import { Workout } from '../../types/workout/workout';
import { useTrainerWorkoutsQuery } from '../../hooks/useTrainerWorkoutsQuery';
import { TrainerWorkoutsInquiry } from '../../types/workout/workout.input';
import { Direction } from '../../enums/common.enum';
import { REACT_APP_API_URL } from '../../config';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface TrainerProfileDrawerProps {
	open: boolean;
	onClose: () => void;
	trainer: Member | null;
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div role="tabpanel" hidden={value !== index} id={`trainer-tabpanel-${index}`} aria-labelledby={`trainer-tab-${index}`} {...other}>
			{value === index && <Box sx={{ py: 3 }}>{children}</Box>}
		</div>
	);
}

const TrainerProfileDrawer: React.FC<TrainerProfileDrawerProps> = ({ open, onClose, trainer }) => {
	const router = useRouter();
	const [tabValue, setTabValue] = useState(0);

	const trainerWorkoutsInput: TrainerWorkoutsInquiry = {
		page: 1,
		limit: 20,
		trainerId: trainer?._id || '',
		workoutStatus: 'PUBLISHED',
	};

	const { workouts, loading: workoutsLoading, error: workoutsError, refetch: refetchWorkouts } = useTrainerWorkoutsQuery(
		trainerWorkoutsInput,
	);

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	if (!trainer) return null;

	const imageUrl = trainer.memberImage ? `${REACT_APP_API_URL}/${trainer.memberImage}` : '/img/profile/defaultUser.svg';
	const name = trainer.memberFullName || trainer.memberNick || 'Trainer';
	const rating = trainer.trainerRating || (trainer.memberRank ? trainer.memberRank / 10 : 0);
	const experience = trainer.trainerExperience || 0;
	const specialties = trainer.trainerSpecialties || [];
	const bio = trainer.trainerBio || trainer.memberDesc || '';
	const certifications = trainer.trainerCertifications || [];

	const getWorkoutImageUrl = (workoutImage?: string) => {
		if (!workoutImage) return '/img/gym.img/pexels-cavemantraining-682087.jpg';
		if (workoutImage.startsWith('http')) return workoutImage;
		return `${REACT_APP_API_URL}/${workoutImage}`;
	};

	return (
		<Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 600 } } }}>
			<Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
				{/* Header */}
				<Box sx={{ p: 3, borderBottom: '1px solid #E5E5E5', position: 'sticky', top: 0, backgroundColor: '#FFFFFF', zIndex: 1 }}>
					<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
						<Typography variant="h5" sx={{ fontWeight: 700, color: '#212121' }}>
							Trainer Profile
						</Typography>
						<IconButton onClick={onClose}>
							<CloseIcon />
						</IconButton>
					</Stack>

					{/* Trainer Info */}
					<Stack direction="row" spacing={2}>
						<Avatar src={imageUrl} sx={{ width: 80, height: 80, border: '3px solid #F5F5F5' }}>
							{name.charAt(0).toUpperCase()}
						</Avatar>
						<Box sx={{ flex: 1 }}>
							<Typography variant="h6" sx={{ fontWeight: 700, color: '#212121', mb: 0.5 }}>
								{name}
							</Typography>
							<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
								<Rating value={rating} readOnly precision={0.5} size="small" />
								<Typography variant="body2" sx={{ color: '#757575' }}>
									{rating.toFixed(1)} ({trainer.memberComments || 0} reviews)
								</Typography>
							</Stack>
							{experience > 0 && (
								<Typography variant="body2" sx={{ color: '#757575' }}>
									{experience} years experience
								</Typography>
							)}
						</Box>
					</Stack>
				</Box>

				{/* Tabs */}
				<Box sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 180, backgroundColor: '#FFFFFF', zIndex: 1 }}>
					<Tabs value={tabValue} onChange={handleTabChange} aria-label="trainer profile tabs">
						<Tab label="About" />
						<Tab label={`Workouts (${workouts.length})`} />
					</Tabs>
				</Box>

				{/* Content */}
				<Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
					<TabPanel value={tabValue} index={0}>
						{/* Bio */}
						{bio && (
							<Box sx={{ mb: 3 }}>
								<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#212121' }}>
									About
								</Typography>
								<Typography variant="body2" sx={{ color: '#616161', lineHeight: 1.7 }}>
									{bio}
								</Typography>
							</Box>
						)}

						{/* Specialties */}
						{specialties.length > 0 && (
							<Box sx={{ mb: 3 }}>
								<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#212121' }}>
									Specialties
								</Typography>
								<Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
									{specialties.map((specialty: string, idx: number) => (
										<Chip key={idx} label={specialty} size="small" sx={{ backgroundColor: '#F5F5F5', color: '#616161' }} />
									))}
								</Stack>
							</Box>
						)}

						{/* Certifications */}
						{certifications.length > 0 && (
							<Box sx={{ mb: 3 }}>
								<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#212121' }}>
									Certifications
								</Typography>
								<Stack spacing={1}>
									{certifications.map((cert: string, idx: number) => (
										<Typography key={idx} variant="body2" sx={{ color: '#616161' }}>
											• {cert}
										</Typography>
									))}
								</Stack>
							</Box>
						)}

						{/* Stats */}
						<Box>
							<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#212121' }}>
								Stats
							</Typography>
							<Stack direction="row" spacing={4}>
								<Box>
									<Typography variant="h6" sx={{ fontWeight: 700, color: '#212121' }}>
										{trainer.memberWorkouts || 0}
									</Typography>
									<Typography variant="caption" sx={{ color: '#757575' }}>
										Workouts
									</Typography>
								</Box>
								<Box>
									<Typography variant="h6" sx={{ fontWeight: 700, color: '#212121' }}>
										{trainer.memberFollowers || 0}
									</Typography>
									<Typography variant="caption" sx={{ color: '#757575' }}>
										Followers
									</Typography>
								</Box>
								<Box>
									<Typography variant="h6" sx={{ fontWeight: 700, color: '#212121' }}>
										{trainer.memberLikes || 0}
									</Typography>
									<Typography variant="caption" sx={{ color: '#757575' }}>
										Likes
									</Typography>
								</Box>
							</Stack>
						</Box>
					</TabPanel>

					<TabPanel value={tabValue} index={1}>
						{workoutsLoading ? (
							<Stack spacing={2}>
								{[1, 2, 3].map((i) => (
									<Card key={i} sx={{ borderRadius: 2 }}>
										<Skeleton variant="rectangular" height={150} />
										<CardContent>
											<Skeleton variant="text" height={24} />
											<Skeleton variant="text" height={20} width="60%" />
										</CardContent>
									</Card>
								))}
							</Stack>
						) : workoutsError ? (
							<Alert severity="error" sx={{ mb: 2 }}>
								Error loading workouts. Please try again.
							</Alert>
						) : workouts.length === 0 ? (
							<Box sx={{ textAlign: 'center', py: 4 }}>
								<Typography variant="body1" sx={{ color: '#757575' }}>
									No workouts available yet.
								</Typography>
							</Box>
						) : (
							<Stack spacing={2}>
								{workouts.map((workout: Workout) => (
									<Card key={workout._id} sx={{ borderRadius: 2, border: '1px solid #E5E5E5' }}>
										<Link href={`/workouts/${workout._id}`} style={{ textDecoration: 'none' }}>
											<CardMedia
												component="div"
												sx={{
													height: 150,
													backgroundImage: `url(${getWorkoutImageUrl(workout.workoutImage)})`,
													backgroundSize: 'cover',
													backgroundPosition: 'center',
												}}
											/>
										</Link>
										<CardContent>
											<Typography variant="h6" sx={{ fontWeight: 700, color: '#212121', mb: 1 }}>
												{workout.workoutTitle}
											</Typography>
											<Stack direction="row" spacing={1} sx={{ mb: 1 }}>
												<Chip label={workout.workoutCategory} size="small" sx={{ fontSize: '11px' }} />
												<Chip label={workout.workoutDifficulty} size="small" sx={{ fontSize: '11px' }} />
											</Stack>
											<Typography variant="body2" sx={{ color: '#757575', mb: 2 }}>
												{workout.workoutDesc?.substring(0, 100)}...
											</Typography>
											<Button
												variant="contained"
												size="small"
												onClick={() => {
													router.push(`/workouts/${workout._id}`);
													onClose();
												}}
												sx={{
													backgroundColor: '#E10600',
													'&:hover': { backgroundColor: '#C10500' },
													textTransform: 'none',
												}}
											>
												View Workout
											</Button>
										</CardContent>
									</Card>
								))}
							</Stack>
						)}
					</TabPanel>
				</Box>
			</Box>
		</Drawer>
	);
};

export default TrainerProfileDrawer;








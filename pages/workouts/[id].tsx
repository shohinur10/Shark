import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, Chip, Divider, Card, CardContent, Grid, CircularProgress, IconButton, LinearProgress } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import { Workout } from '../../libs/types/workout/workout';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useQuery } from '@apollo/client';
import { GET_WORKOUT, GET_EXERCISE } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { WorkoutDifficulty, WorkoutCategory, WorkoutDuration } from '../../libs/enums/workout.enum';
import { Exercise } from '../../libs/types/exercise/exercise';
import Link from 'next/link';

export const getServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const WorkoutDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const device = useDeviceDetect();

	// Fetch workout data
	const {
		loading,
		data: getWorkoutData,
		error: getWorkoutError,
	} = useQuery(GET_WORKOUT, {
		skip: !id || typeof id !== 'string',
		fetchPolicy: 'cache-and-network',
		variables: { input: id as string },
		onCompleted: (data: T) => {
			// Data is available in getWorkoutData
		},
	});

	const workout: Workout | null = getWorkoutData?.getWorkout || null;

	const handleStartWorkout = () => {
		// Navigate to workout execution page
		if (id) {
			router.push(`/workouts/${id}/start`);
		}
	};

	const formatDifficulty = (difficulty: WorkoutDifficulty) => {
		return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
	};

	const formatCategory = (category: WorkoutCategory) => {
		return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const formatDuration = (duration: WorkoutDuration) => {
		return duration.charAt(0) + duration.slice(1).toLowerCase();
	};

	if (device === 'mobile') {
		if (loading) {
			return (
				<Stack className={'workout-detail-page'}>
					<Stack className={'container'}>
						<Box display="flex" justifyContent="center" p={4}>
							<CircularProgress />
						</Box>
					</Stack>
				</Stack>
			);
		}

		if (!workout) {
			return (
				<Stack className={'workout-detail-page'}>
					<Stack className={'container'}>
						<Typography variant="h6" color="error">Workout not found</Typography>
					</Stack>
				</Stack>
			);
		}

		return (
			<Stack className={'workout-detail-page'}>
				<Stack className={'container'}>
					<Typography variant="h4" className={'workout-title'}>
						{workout.workoutTitle}
					</Typography>
					{workout.workoutImage && (
						<Box className={'workout-media'} mb={2}>
							<img src={workout.workoutImage} alt={workout.workoutTitle} style={{ width: '100%', borderRadius: 8 }} />
						</Box>
					)}
					<Typography variant="body1" className={'workout-description'} mb={2}>
						{workout.workoutDesc || 'No description available.'}
					</Typography>
					<Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
						<Chip label={formatCategory(workout.workoutCategory)} size="small" />
						<Chip label={formatDifficulty(workout.workoutDifficulty)} size="small" />
						<Chip label={formatDuration(workout.workoutDuration)} size="small" />
						{workout.isPremium && <Chip label="Premium" color="warning" size="small" />}
					</Stack>
					<Button
						variant="contained"
						fullWidth
						startIcon={<PlayArrowIcon />}
						onClick={handleStartWorkout}
						className={'start-btn'}
					>
						Start Workout
					</Button>
				</Stack>
			</Stack>
		);
	} else {
		if (loading) {
			return (
				<Stack className={'workout-detail-page'}>
					<Stack className={'container'}>
						<Box display="flex" justifyContent="center" p={4}>
							<CircularProgress />
						</Box>
					</Stack>
				</Stack>
			);
		}

		if (!workout) {
			return (
				<Stack className={'workout-detail-page'}>
					<Stack className={'container'}>
						<Typography variant="h4" color="error">Workout not found</Typography>
						<Typography variant="body1" color="text.secondary">
							The workout you're looking for doesn't exist or has been removed.
						</Typography>
					</Stack>
				</Stack>
			);
		}

		return (
			<Stack className={'workout-detail-page'}>
				<Stack className={'container'}>
					{/* Hero Section */}
					<Box className={'workout-hero'}>
						<Box
							className={'workout-hero-image'}
							style={{
								backgroundImage: workout.workoutImage 
									? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${workout.workoutImage})`
									: 'linear-gradient(135deg, #E10600 0%, #C10500 100%)',
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						>
							{workout.workoutVideo && (
								<Box className={'video-overlay'}>
									<video
										controls
										poster={workout.workoutImage}
										className={'workout-video-hero'}
									>
										<source src={workout.workoutVideo} type="video/mp4" />
									</video>
								</Box>
							)}
							<Box className={'hero-overlay'}>
								<Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
									{workout.isPremium && (
										<Chip label="Premium" className={'premium-chip-hero'} />
									)}
									<Chip label={formatCategory(workout.workoutCategory)} className={'category-chip-hero'} />
									<Chip label={formatDifficulty(workout.workoutDifficulty)} className={'difficulty-chip-hero'} />
									<Chip label={formatDuration(workout.workoutDuration)} className={'duration-chip-hero'} />
									{workout.workoutRating > 0 && (
										<Chip 
											icon={<StarIcon />} 
											label={workout.workoutRating.toFixed(1)} 
											className={'rating-chip-hero'} 
										/>
									)}
								</Stack>
								<Typography variant="h2" className={'workout-hero-title'}>
									{workout.workoutTitle}
								</Typography>
								<Typography variant="body1" className={'workout-hero-description'}>
									{workout.workoutDesc || 'A comprehensive workout designed to help you achieve your fitness goals.'}
								</Typography>
								{workout.memberData && (
									<Typography variant="body2" className={'workout-creator'} mt={1}>
										By {workout.memberData.memberFullName || workout.memberData.memberNick}
									</Typography>
								)}
								<Stack direction="row" spacing={2} mt={3}>
									<Button 
										variant="contained" 
										size="large" 
										startIcon={<PlayArrowIcon />} 
										className={'start-workout-btn-hero'}
										onClick={handleStartWorkout}
									>
										Start Workout
									</Button>
									<Button 
										variant="outlined" 
										size="large" 
										startIcon={<FavoriteBorderIcon />}
										className={'save-workout-btn'}
									>
										Save
									</Button>
									<IconButton className={'action-icon-btn'}>
										<ShareIcon />
									</IconButton>
								</Stack>
							</Box>
						</Box>
					</Box>

					{/* Workout Stats Section */}
					<Box className={'workout-stats-section'}>
						<Typography variant="h5" className={'section-title'} gutterBottom>
							Workout Overview
						</Typography>
						<Grid container spacing={3} mt={1}>
							<Grid item xs={12} sm={6} md={3}>
								<Card className={'workout-stat-card duration'}>
									<CardContent>
										<Stack direction="row" alignItems="center" spacing={1} mb={2}>
											<AccessTimeIcon className={'stat-icon'} />
											<Typography variant="body2" className={'stat-label'}>
												Duration
											</Typography>
										</Stack>
										<Typography variant="h3" className={'stat-value'}>
											{formatDuration(workout.workoutDuration)}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<Card className={'workout-stat-card calories'}>
									<CardContent>
										<Stack direction="row" alignItems="center" spacing={1} mb={2}>
											<LocalFireDepartmentIcon className={'stat-icon'} />
											<Typography variant="body2" className={'stat-label'}>
												Calories Burn
											</Typography>
										</Stack>
										<Typography variant="h3" className={'stat-value'}>
											{workout.workoutCaloriesBurn || 0}
										</Typography>
										<Typography variant="caption" className={'stat-unit'}>
											estimated
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<Card className={'workout-stat-card exercises'}>
									<CardContent>
										<Stack direction="row" alignItems="center" spacing={1} mb={2}>
											<FitnessCenterIcon className={'stat-icon'} />
											<Typography variant="body2" className={'stat-label'}>
												Exercises
											</Typography>
										</Stack>
										<Typography variant="h3" className={'stat-value'}>
											{workout.workoutExercises?.length || 0}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<Card className={'workout-stat-card rating'}>
									<CardContent>
										<Stack direction="row" alignItems="center" spacing={1} mb={2}>
											<StarIcon className={'stat-icon'} />
											<Typography variant="body2" className={'stat-label'}>
												Rating
											</Typography>
										</Stack>
										<Typography variant="h3" className={'stat-value'}>
											{workout.workoutRating?.toFixed(1) || '0.0'}
										</Typography>
										<Typography variant="caption" className={'stat-unit'}>
											({workout.workoutCompletions || 0} completions)
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</Box>

					{/* Description Section */}
					{workout.workoutDesc && (
						<Box className={'workout-description-section'}>
							<Typography variant="h5" className={'section-title'} gutterBottom>
								About This Workout
							</Typography>
							<Typography variant="body1" className={'description-text'}>
								{workout.workoutDesc}
							</Typography>
						</Box>
					)}

					{/* Exercises Breakdown */}
					{workout.workoutExercises && workout.workoutExercises.length > 0 && (
						<Box className={'exercises-breakdown-section'}>
							<Typography variant="h5" className={'section-title'} gutterBottom>
								Exercise Breakdown ({workout.workoutExercises.length})
							</Typography>
							<Grid container spacing={3} mt={1}>
								{workout.workoutExercises.map((exerciseId, index) => (
									<Grid item xs={12} md={6} key={exerciseId || index}>
										<ExerciseCard exerciseId={exerciseId} index={index} />
									</Grid>
								))}
							</Grid>
						</Box>
					)}

					{/* Equipment & Tags Section */}
					{(workout.workoutEquipment?.length > 0 || workout.workoutTags?.length > 0) && (
						<Grid container spacing={3} mt={2}>
							{workout.workoutEquipment && workout.workoutEquipment.length > 0 && (
								<Grid item xs={12} md={6}>
									<Box className={'workout-equipment-section'}>
										<Typography variant="h6" className={'section-subtitle'} gutterBottom>
											Equipment Required
										</Typography>
										<Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
											{workout.workoutEquipment.map((equipment, index) => (
												<Chip 
													key={index} 
													label={equipment.replace(/_/g, ' ')} 
													className={'equipment-chip'}
													icon={<FitnessCenterIcon />}
												/>
											))}
										</Stack>
									</Box>
								</Grid>
							)}
							{workout.workoutTags && workout.workoutTags.length > 0 && (
								<Grid item xs={12} md={6}>
									<Box className={'workout-tags-section'}>
										<Typography variant="h6" className={'section-subtitle'} gutterBottom>
											Tags
										</Typography>
										<Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
											{workout.workoutTags.map((tag, index) => (
												<Chip key={index} label={tag} className={'tag-chip'} />
											))}
										</Stack>
									</Box>
								</Grid>
							)}
						</Grid>
					)}

					{/* Engagement Stats */}
					<Box className={'engagement-stats-section'} mt={4}>
						<Grid container spacing={2}>
							<Grid item xs={6} sm={3}>
								<Box className={'engagement-stat'}>
									<VisibilityIcon className={'engagement-icon'} />
									<Typography variant="h6" className={'engagement-value'}>
										{workout.workoutViews || 0}
									</Typography>
									<Typography variant="caption" className={'engagement-label'}>
										Views
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={6} sm={3}>
								<Box className={'engagement-stat'}>
									<FavoriteIcon className={'engagement-icon'} />
									<Typography variant="h6" className={'engagement-value'}>
										{workout.workoutLikes || 0}
									</Typography>
									<Typography variant="caption" className={'engagement-label'}>
										Likes
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={6} sm={3}>
								<Box className={'engagement-stat'}>
									<CheckCircleIcon className={'engagement-icon'} />
									<Typography variant="h6" className={'engagement-value'}>
										{workout.workoutCompletions || 0}
									</Typography>
									<Typography variant="caption" className={'engagement-label'}>
										Completions
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={6} sm={3}>
								<Box className={'engagement-stat'}>
									<StarIcon className={'engagement-icon'} />
									<Typography variant="h6" className={'engagement-value'}>
										{workout.workoutRating?.toFixed(1) || '0.0'}
									</Typography>
									<Typography variant="caption" className={'engagement-label'}>
										Rating
									</Typography>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

// Component to fetch and display individual exercise details as a card
const ExerciseCard = ({ exerciseId, index }: { exerciseId: string; index: number }) => {
	const { data, loading, error } = useQuery(GET_EXERCISE, {
		skip: !exerciseId || typeof exerciseId !== 'string',
		variables: { input: exerciseId },
		fetchPolicy: 'cache-and-network',
	});

	const exercise: Exercise | null = data?.getExercise || null;

	if (loading) {
		return (
			<Card className={'exercise-card'}>
				<CardContent>
					<Box display="flex" justifyContent="center" alignItems="center" minHeight={150}>
						<CircularProgress size={30} />
					</Box>
				</CardContent>
			</Card>
		);
	}

	if (error || !exercise) {
		return (
			<Card className={'exercise-card'}>
				<CardContent>
					<Stack direction="row" alignItems="center" spacing={2} mb={2}>
						<Box className={'exercise-number'}>
							<Typography variant="h5" className={'exercise-number-text'}>
								{index + 1}
							</Typography>
						</Box>
						<Typography variant="h6" className={'exercise-name'}>
							Exercise {index + 1}
						</Typography>
					</Stack>
					<Typography variant="body2" color="text.secondary">
						Unable to load exercise details
					</Typography>
				</CardContent>
			</Card>
		);
	}

	return (
		<Link href={`/exercises/${exercise._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
			<Card className={'exercise-card'}>
				<CardContent>
					<Stack direction="row" alignItems="center" spacing={2} mb={2}>
						<Box className={'exercise-number'}>
							<Typography variant="h5" className={'exercise-number-text'}>
								{index + 1}
							</Typography>
						</Box>
						<Typography variant="h6" className={'exercise-name'}>
							{exercise.exerciseName}
						</Typography>
					</Stack>
					<Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
						{exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
							<Chip
								label={exercise.targetMuscles[0].replace(/_/g, ' ')}
								size="small"
								className={'exercise-muscle-chip'}
							/>
						)}
						{exercise.exerciseType && (
							<Chip
								label={exercise.exerciseType.replace(/_/g, ' ')}
								size="small"
								className={'exercise-type-chip'}
							/>
						)}
					</Stack>
					{exercise.exerciseDifficulty && (
						<Box mt={1}>
							<Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
								<Typography variant="caption" color="text.secondary">
									Difficulty
								</Typography>
								<Typography variant="caption" fontWeight={600}>
									{exercise.exerciseDifficulty}/10
								</Typography>
							</Stack>
							<LinearProgress 
								variant="determinate" 
								value={(exercise.exerciseDifficulty / 10) * 100} 
								className={'exercise-difficulty-progress'}
							/>
						</Box>
					)}
					<Box mt={2} display="flex" justifyContent="flex-end">
						<FitnessCenterIcon className={'exercise-icon'} />
					</Box>
				</CardContent>
			</Card>
		</Link>
	);
};

export default withLayoutBasic(WorkoutDetailPage);






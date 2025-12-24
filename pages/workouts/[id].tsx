import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, Chip, Divider, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
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
import { useQuery } from '@apollo/client';
import { GET_WORKOUT } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { WorkoutDifficulty, WorkoutCategory, WorkoutDuration } from '../../libs/enums/workout.enum';

export const getStaticProps = async ({ locale }: any) => ({
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
					{/* Header Section */}
					<Stack className={'workout-header'}>
						<Box className={'workout-media'}>
							{workout.workoutVideo ? (
								<video
									controls
									poster={workout.workoutImage}
									className={'workout-video'}
								>
									<source src={workout.workoutVideo} type="video/mp4" />
								</video>
							) : workout.workoutImage ? (
								<img src={workout.workoutImage} alt={workout.workoutTitle} className={'workout-image'} />
							) : (
								<Box className={'media-placeholder'}>
									<FitnessCenterIcon sx={{ fontSize: 80, color: '#ccc' }} />
								</Box>
							)}
						</Box>
						<Box className={'workout-header-info'}>
							<Stack direction="row" spacing={1} className={'workout-badges'}>
								{workout.isPremium && <Chip label="Premium" color="warning" size="small" />}
								<Chip label={formatCategory(workout.workoutCategory)} size="small" />
								<Chip label={formatDifficulty(workout.workoutDifficulty)} size="small" />
								<Chip label={formatDuration(workout.workoutDuration)} size="small" />
							</Stack>
							<Typography variant="h3" className={'workout-title'}>
								{workout.workoutTitle}
							</Typography>
							{workout.memberData && (
								<Typography variant="body2" className={'workout-trainer'}>
									By {workout.memberData.memberFullName || workout.memberData.memberNick}
								</Typography>
							)}
							<Stack direction="row" spacing={3} className={'workout-stats'}>
								<Box className={'stat-item'}>
									<AccessTimeIcon />
									<span>{formatDuration(workout.workoutDuration)}</span>
								</Box>
								<Box className={'stat-item'}>
									<LocalFireDepartmentIcon />
									<span>{workout.workoutCaloriesBurn || 0} calories</span>
								</Box>
								<Box className={'stat-item'}>
									<span>⭐ {workout.workoutRating?.toFixed(1) || '0.0'}</span>
									<span>({workout.workoutCompletions || 0} completions)</span>
								</Box>
								<Box className={'stat-item'}>
									<span>👁️ {workout.workoutViews || 0} views</span>
								</Box>
								<Box className={'stat-item'}>
									<span>❤️ {workout.workoutLikes || 0} likes</span>
								</Box>
							</Stack>
							<Stack direction="row" spacing={2} className={'workout-actions'}>
								<Button
									variant="contained"
									size="large"
									startIcon={<PlayArrowIcon />}
									onClick={handleStartWorkout}
									className={'start-btn'}
								>
									Start Workout
								</Button>
								<Button variant="outlined" startIcon={<FavoriteBorderIcon />}>
									Save
								</Button>
								<Button variant="outlined" startIcon={<ShareIcon />}>
									Share
								</Button>
							</Stack>
						</Box>
					</Stack>

					<Divider sx={{ my: 4 }} />

					{/* Description */}
					<Box className={'workout-description'}>
						<Typography variant="h5" gutterBottom>
							Description
						</Typography>
						<Typography variant="body1" className={'description-text'}>
							{workout.workoutDesc || 'No description available.'}
						</Typography>
					</Box>

					<Divider sx={{ my: 4 }} />

					{/* Exercises List */}
					<Box className={'workout-exercises'}>
						<Typography variant="h5" gutterBottom>
							Exercises ({workout.workoutExercises?.length || 0})
						</Typography>
						{workout.workoutExercises && workout.workoutExercises.length > 0 ? (
							<List>
								{workout.workoutExercises.map((exerciseId, index) => (
									<ListItem key={exerciseId || index} className={'exercise-item'}>
										<ListItemText
											primary={`Exercise ${index + 1}`}
											secondary={exerciseId ? `Exercise ID: ${exerciseId}` : 'Exercise details coming soon'}
										/>
										{/* TODO: Fetch and display actual exercise details using GET_EXERCISE query */}
									</ListItem>
								))}
							</List>
						) : (
							<Typography variant="body2" color="text.secondary">
								No exercises added to this workout yet.
							</Typography>
						)}
					</Box>

					{/* Equipment Required */}
					{workout.workoutEquipment && workout.workoutEquipment.length > 0 && (
						<Box className={'workout-equipment'} mt={4}>
							<Typography variant="h6" gutterBottom>
								Equipment Required
							</Typography>
							<Stack direction="row" spacing={1} flexWrap="wrap">
								{workout.workoutEquipment.map((equipment, index) => (
									<Chip 
										key={index} 
										label={equipment.replace(/_/g, ' ')} 
										size="small"
										icon={<FitnessCenterIcon />}
									/>
								))}
							</Stack>
						</Box>
					)}

					{/* Tags */}
					{workout.workoutTags && workout.workoutTags.length > 0 && (
						<Box className={'workout-tags'}>
							<Typography variant="h6" gutterBottom>
								Tags
							</Typography>
							<Stack direction="row" spacing={1} flexWrap="wrap">
								{workout.workoutTags.map((tag, index) => (
									<Chip key={index} label={tag} size="small" />
								))}
							</Stack>
						</Box>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(WorkoutDetailPage);






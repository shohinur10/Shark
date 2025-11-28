import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, Chip, Divider, List, ListItem, ListItemText } from '@mui/material';
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

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const WorkoutDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const device = useDeviceDetect();
	const [workout, setWorkout] = useState<Workout | null>(null);
	const [loading, setLoading] = useState(true);

	// TODO: Replace with actual GET_WORKOUT query
	// const { data, loading, error } = useQuery(GET_WORKOUT, {
	// 	variables: { workoutId: id }
	// });

	useEffect(() => {
		if (id) {
			// Fetch workout data
			setLoading(false);
		}
	}, [id]);

	const handleStartWorkout = () => {
		// Navigate to workout execution page
		router.push(`/workouts/${id}/start`);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'workout-detail-page'}>
				<Stack className={'container'}>
					<div>MOBILE WORKOUT DETAIL</div>
				</Stack>
			</Stack>
		);
	} else {
		if (loading) {
			return <div>Loading...</div>;
		}

		if (!workout) {
			return <div>Workout not found</div>;
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
								<Chip label={workout.workoutCategory} size="small" />
								<Chip label={workout.workoutDifficulty} size="small" />
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
									<span>{workout.workoutDuration}</span>
								</Box>
								<Box className={'stat-item'}>
									<LocalFireDepartmentIcon />
									<span>{workout.workoutCaloriesBurn} calories</span>
								</Box>
								<Box className={'stat-item'}>
									<span>⭐ {workout.workoutRating || 0}</span>
									<span>({workout.workoutCompletions || 0} completions)</span>
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
									<ListItem key={index} className={'exercise-item'}>
										<ListItemText
											primary={`Exercise ${index + 1}`}
											secondary={`Exercise ID: ${exerciseId}`}
										/>
										{/* TODO: Fetch and display actual exercise details */}
									</ListItem>
								))}
							</List>
						) : (
							<Typography variant="body2" color="text.secondary">
								No exercises added yet.
							</Typography>
						)}
					</Box>

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






import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, Card, CardContent, LinearProgress, List, ListItem, ListItemText } from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const WorkoutStartPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const device = useDeviceDetect();
	const [workout, setWorkout] = useState<any>(null);
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

	useEffect(() => {
		if (id) {
			// TODO: Fetch workout data
		}
	}, [id]);

	const handleCompleteExercise = (index: number) => {
		setCompletedExercises((prev) => new Set([...prev, index]));
		if (index < (workout?.exercises?.length || 0) - 1) {
			setCurrentExerciseIndex(index + 1);
		}
	};

	const handleFinishWorkout = () => {
		// TODO: Save workout completion
		router.push(`/workouts/${id}`);
	};

	const progress = workout?.exercises ? ((completedExercises.size / workout.exercises.length) * 100) : 0;

	if (device === 'mobile') {
		return (
			<Stack className={'workout-start-page'}>
				<Stack className={'container'}>
					<div>MOBILE WORKOUT EXECUTION</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'workout-start-page'}>
				<Stack className={'container'}>
					{/* Header */}
					<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
						<Button startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
							Back
						</Button>
						<Box flex={1}>
							<Typography variant="h4">{workout?.title || 'Workout Title'}</Typography>
							<Typography variant="body2" color="text.secondary">
								Exercise {currentExerciseIndex + 1} of {workout?.exercises?.length || 0}
							</Typography>
						</Box>
						<Button variant="outlined" onClick={handleFinishWorkout}>
							Finish Workout
						</Button>
					</Stack>

					{/* Progress Bar */}
					<Box sx={{ mb: 4 }}>
						<Stack direction="row" justifyContent="space-between" mb={1}>
							<Typography variant="body2">Progress</Typography>
							<Typography variant="body2">{Math.round(progress)}%</Typography>
						</Stack>
						<LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
					</Box>

					{/* Current Exercise */}
					<Card sx={{ mb: 4 }}>
						<CardContent>
							<Typography variant="h5" gutterBottom>
								{workout?.exercises?.[currentExerciseIndex]?.name || 'Exercise Name'}
							</Typography>
							{workout?.exercises?.[currentExerciseIndex]?.instructions && (
								<Typography variant="body1" sx={{ mb: 3 }}>
									{workout.exercises[currentExerciseIndex].instructions}
								</Typography>
							)}
							<Box sx={{ mb: 3 }}>
								{workout?.exercises?.[currentExerciseIndex]?.video ? (
									<video controls style={{ width: '100%', maxHeight: 400 }}>
										<source src={workout.exercises[currentExerciseIndex].video} type="video/mp4" />
									</video>
								) : (
									<Box sx={{ width: '100%', height: 300, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<Typography variant="body2" color="text.secondary">
											Exercise Video/GIF
										</Typography>
									</Box>
								)}
							</Box>
							<Button
								variant="contained"
								size="large"
								fullWidth
								startIcon={completedExercises.has(currentExerciseIndex) ? <CheckCircleIcon /> : <PlayArrowIcon />}
								onClick={() => handleCompleteExercise(currentExerciseIndex)}
								disabled={completedExercises.has(currentExerciseIndex)}
							>
								{completedExercises.has(currentExerciseIndex) ? 'Completed' : 'Mark as Complete'}
							</Button>
						</CardContent>
					</Card>

					{/* Exercise List */}
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Workout Exercises
							</Typography>
							<List>
								{workout?.exercises?.map((exercise: any, index: number) => (
									<ListItem
										key={index}
										button
										onClick={() => setCurrentExerciseIndex(index)}
										selected={index === currentExerciseIndex}
										secondaryAction={
											completedExercises.has(index) ? (
												<CheckCircleIcon color="success" />
											) : null
										}
									>
										<ListItemText
											primary={exercise.name || `Exercise ${index + 1}`}
											secondary={`${exercise.sets || 0} sets × ${exercise.reps || 0} reps`}
										/>
									</ListItem>
								)) || (
									<ListItem>
										<ListItemText primary="No exercises available" />
									</ListItem>
								)}
							</List>
						</CardContent>
					</Card>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(WorkoutStartPage);






import React, { useState, useRef, useCallback, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
	Stack,
	Box,
	Typography,
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	IconButton,
	Alert,
	Grid,
	Card,
	CardContent,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	List,
	ListItem,
	ListItemText,
	Checkbox,
	CircularProgress,
} from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { CREATE_WORKOUT } from '../../../apollo/user/mutation';
import { GET_EXERCISES } from '../../../apollo/user/query';
import { WorkoutInput } from '../../../libs/types/workout/workout.input';
import { WorkoutCategory, WorkoutDifficulty, WorkoutDuration, WorkoutEquipment, WorkoutStatus } from '../../../libs/enums/workout.enum';
import { ExercisesInquiry } from '../../../libs/types/exercise/exercise.input';
import { Exercise } from '../../../libs/types/exercise/exercise';
import { Direction } from '../../../libs/enums/common.enum';
import { userVar } from '../../../apollo/store';
import { getJwtToken } from '../../../libs/auth';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../../libs/sweetAlert';
import { REACT_APP_API_URL } from '../../../libs/config';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AIWorkoutGenerator from '../../../libs/components/trainer/AIWorkoutGenerator';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CreateWorkoutPage: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const token = getJwtToken();

	const imageInputRef = useRef<HTMLInputElement>(null);
	const videoInputRef = useRef<HTMLInputElement>(null);

	const [workoutData, setWorkoutData] = useState<Partial<WorkoutInput>>({
		workoutTitle: '',
		workoutCategory: WorkoutCategory.STRENGTH,
		workoutDifficulty: WorkoutDifficulty.BEGINNER,
		workoutDuration: '30',
		workoutEquipment: [],
		workoutStatus: WorkoutStatus.DRAFT,
		workoutDesc: '',
		workoutImage: undefined,
		workoutVideo: undefined,
		workoutExercises: [],
		workoutCaloriesBurn: 0,
		workoutTags: [],
		isPremium: false,
	});

	const [currentTag, setCurrentTag] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false);
	const [exerciseSearchText, setExerciseSearchText] = useState('');
	const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);

	const [createWorkout] = useMutation(CREATE_WORKOUT);

	// Fetch exercises for selection
	const exerciseInquiry: ExercisesInquiry = {
		page: 1,
		limit: 100,
		sort: 'createdAt',
		direction: Direction.DESC,
		exerciseStatus: 'PUBLISHED',
	};

	const { data: exercisesData, loading: exercisesLoading } = useQuery(GET_EXERCISES, {
		variables: { input: exerciseInquiry },
		skip: !exerciseDialogOpen,
	});

	const exercises = exercisesData?.getExercises?.list || [];
	const selectedExercises = exercises.filter((ex: Exercise) => workoutData.workoutExercises?.includes(ex._id));

	// Check if user is trainer
	useEffect(() => {
		if (user?.memberType !== 'TRAINER' && user?.memberType !== 'ADMIN') {
			router.push('/trainer/workouts');
		}
	}, [user, router]);

	// Upload single file
	const uploadSingleFile = async (file: File, target: 'workout'): Promise<string> => {
		try {
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: target,
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', file);

			const graphQLUrl = process.env.NEXT_PUBLIC_API_GRAPHQL_URL || process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:3005/graphql';
			const response = await axios.post(graphQLUrl, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			return response.data.data.imageUploader;
		} catch (err: any) {
			console.log('Error uploading file:', err);
			throw new Error(err.message || 'Failed to upload file');
		}
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = e.target.files?.[0];
			if (!file) return;

			const uploadedPath = await uploadSingleFile(file, 'workout');
			setWorkoutData({ ...workoutData, workoutImage: uploadedPath });
		} catch (err: any) {
			setError(err.message || 'Failed to upload image');
		}
	};

	const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = e.target.files?.[0];
			if (!file) return;

			const uploadedPath = await uploadSingleFile(file, 'workout');
			setWorkoutData({ ...workoutData, workoutVideo: uploadedPath });
		} catch (err: any) {
			setError(err.message || 'Failed to upload video');
		}
	};

	const toggleArrayItem = (field: 'workoutEquipment', value: string) => {
		const currentArray = workoutData[field] || [];
		const index = currentArray.indexOf(value);
		if (index > -1) {
			setWorkoutData({
				...workoutData,
				[field]: currentArray.filter((_, i) => i !== index),
			});
		} else {
			setWorkoutData({
				...workoutData,
				[field]: [...currentArray, value],
			});
		}
	};

	const addTag = () => {
		if (!currentTag.trim()) return;
		setWorkoutData({
			...workoutData,
			workoutTags: [...(workoutData.workoutTags || []), currentTag.trim()],
		});
		setCurrentTag('');
	};

	const removeTag = (index: number) => {
		const tags = workoutData.workoutTags || [];
		setWorkoutData({
			...workoutData,
			workoutTags: tags.filter((_, i) => i !== index),
		});
	};

	const toggleExercise = (exerciseId: string) => {
		const currentExercises = workoutData.workoutExercises || [];
		const index = currentExercises.indexOf(exerciseId);
		if (index > -1) {
			setWorkoutData({
				...workoutData,
				workoutExercises: currentExercises.filter((_, i) => i !== index),
			});
		} else {
			setWorkoutData({
				...workoutData,
				workoutExercises: [...currentExercises, exerciseId],
			});
		}
	};

	const removeExercise = (exerciseId: string) => {
		const currentExercises = workoutData.workoutExercises || [];
		setWorkoutData({
			...workoutData,
			workoutExercises: currentExercises.filter((id) => id !== exerciseId),
		});
	};

	const filteredExercises = exercises.filter((exercise: Exercise) =>
		exercise.exerciseName.toLowerCase().includes(exerciseSearchText.toLowerCase())
	);

	const validateForm = (): boolean => {
		if (!workoutData.workoutTitle?.trim()) {
			setError('Workout title is required');
			return false;
		}
		if (!workoutData.workoutDesc?.trim()) {
			setError('Workout description is required');
			return false;
		}
		if (!workoutData.workoutCategory) {
			setError('Workout category is required');
			return false;
		}
		if (!workoutData.workoutDifficulty) {
			setError('Workout difficulty is required');
			return false;
		}
		if (!workoutData.workoutDuration) {
			setError('Workout duration is required');
			return false;
		}
		if (!workoutData.workoutExercises || workoutData.workoutExercises.length === 0) {
			setError('Please add at least one exercise');
			return false;
		}
		return true;
	};

	const handleSubmit = useCallback(async () => {
		try {
			setError('');
			if (!validateForm()) return;

			setIsSubmitting(true);

			const input: WorkoutInput = {
				workoutTitle: workoutData.workoutTitle!.trim(),
				workoutCategory: workoutData.workoutCategory!,
				workoutDifficulty: workoutData.workoutDifficulty!,
				workoutDuration: workoutData.workoutDuration!,
				workoutEquipment: workoutData.workoutEquipment || [],
				workoutStatus: workoutData.workoutStatus || WorkoutStatus.DRAFT,
				workoutDesc: workoutData.workoutDesc!.trim(),
				workoutExercises: workoutData.workoutExercises || [],
				workoutCaloriesBurn: workoutData.workoutCaloriesBurn || 0,
				workoutTags: workoutData.workoutTags || [],
				isPremium: workoutData.isPremium || false,
			};

			if (workoutData.workoutImage) input.workoutImage = workoutData.workoutImage;
			if (workoutData.workoutVideo) input.workoutVideo = workoutData.workoutVideo;

			const result = await createWorkout({
				variables: { input },
			});

			await sweetMixinSuccessAlert('Workout created successfully!');
			router.push(`/trainer/workouts`);
		} catch (err: any) {
			setError(err.message || 'Failed to create workout');
			sweetErrorHandling(err).then();
		} finally {
			setIsSubmitting(false);
		}
	}, [workoutData, createWorkout, router]);

	const formatEnumName = (str: string): string => {
		return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	if (device === 'mobile') {
		return <div>CREATE WORKOUT MOBILE PAGE</div>;
	}

	if (user?.memberType !== 'TRAINER' && user?.memberType !== 'ADMIN') {
		return (
			<Stack className="create-workout-page" sx={{ p: 4 }}>
				<Alert severity="error">You must be a trainer to create workouts.</Alert>
			</Stack>
		);
	}

	return (
		<Stack className="create-workout-page" sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
			<Stack className="page-header" sx={{ mb: 4 }}>
				<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
					<Box>
						<Typography variant="h3" className="page-title" sx={{ mb: 1 }}>
							Create New Workout
						</Typography>
						<Typography variant="body1" className="page-subtitle" color="text.secondary">
							Design a comprehensive workout routine for your clients
						</Typography>
					</Box>
					<Button
						variant="outlined"
						startIcon={<AutoAwesomeIcon />}
						onClick={() => setAiGeneratorOpen(true)}
						sx={{
							borderColor: '#E10600',
							color: '#E10600',
							'&:hover': {
								borderColor: '#C10500',
								backgroundColor: 'rgba(225, 6, 0, 0.08)',
							},
						}}
					>
						AI Generate
					</Button>
				</Stack>
			</Stack>

			{error && (
				<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
					{error}
				</Alert>
			)}

			<Stack spacing={4}>
				{/* Basic Information */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Basic Information
					</Typography>

					<Stack spacing={3}>
						<TextField
							fullWidth
							label="Workout Title *"
							value={workoutData.workoutTitle}
							onChange={(e) => setWorkoutData({ ...workoutData, workoutTitle: e.target.value })}
							required
						/>

						<TextField
							fullWidth
							multiline
							rows={4}
							label="Workout Description *"
							value={workoutData.workoutDesc}
							onChange={(e) => setWorkoutData({ ...workoutData, workoutDesc: e.target.value })}
							required
						/>

						<Grid container spacing={2}>
							<Grid item xs={12} sm={4}>
								<FormControl fullWidth>
									<InputLabel>Category *</InputLabel>
									<Select
										value={workoutData.workoutCategory}
										label="Category *"
										onChange={(e) => setWorkoutData({ ...workoutData, workoutCategory: e.target.value as WorkoutCategory })}
									>
										{Object.values(WorkoutCategory).map((category) => (
											<MenuItem key={category} value={category}>
												{formatEnumName(category)}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={4}>
								<FormControl fullWidth>
									<InputLabel>Difficulty *</InputLabel>
									<Select
										value={workoutData.workoutDifficulty}
										label="Difficulty *"
										onChange={(e) => setWorkoutData({ ...workoutData, workoutDifficulty: e.target.value as WorkoutDifficulty })}
									>
										{Object.values(WorkoutDifficulty).map((difficulty) => (
											<MenuItem key={difficulty} value={difficulty}>
												{formatEnumName(difficulty)}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={4}>
								<TextField
									fullWidth
									label="Duration (minutes) *"
									type="number"
									value={workoutData.workoutDuration}
									onChange={(e) => setWorkoutData({ ...workoutData, workoutDuration: e.target.value })}
									inputProps={{ min: 1 }}
									required
								/>
							</Grid>
						</Grid>

						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Estimated Calories Burn"
									type="number"
									value={workoutData.workoutCaloriesBurn}
									onChange={(e) => setWorkoutData({ ...workoutData, workoutCaloriesBurn: parseInt(e.target.value) || 0 })}
									inputProps={{ min: 0 }}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel>Status</InputLabel>
									<Select
										value={workoutData.workoutStatus}
										label="Status"
										onChange={(e) => setWorkoutData({ ...workoutData, workoutStatus: e.target.value as WorkoutStatus })}
									>
										{Object.values(WorkoutStatus).map((status) => (
											<MenuItem key={status} value={status}>
												{formatEnumName(status)}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</Stack>
				</Box>

				{/* Equipment */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Equipment Needed
					</Typography>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
						{Object.values(WorkoutEquipment).map((equipment) => (
							<Chip
								key={equipment}
								label={formatEnumName(equipment)}
								onClick={() => toggleArrayItem('workoutEquipment', equipment)}
								color={workoutData.workoutEquipment?.includes(equipment) ? 'primary' : 'default'}
								variant={workoutData.workoutEquipment?.includes(equipment) ? 'filled' : 'outlined'}
							/>
						))}
					</Box>
				</Box>

				{/* Exercises */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Exercises ({workoutData.workoutExercises?.length || 0} selected)
					</Typography>

					<Button
						variant="outlined"
						startIcon={<AddIcon />}
						onClick={() => setExerciseDialogOpen(true)}
						sx={{ mb: 2 }}
					>
						Add Exercises
					</Button>

					{workoutData.workoutExercises && workoutData.workoutExercises.length > 0 && (
						<Stack spacing={2}>
							{selectedExercises.map((exercise: Exercise) => (
								<Card key={exercise._id} variant="outlined">
									<CardContent>
										<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
											<Box sx={{ flex: 1 }}>
												<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
													{exercise.exerciseName}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													{exercise.exerciseDesc}
												</Typography>
												{exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
													<Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
														{exercise.targetMuscles.map((muscle, idx) => (
															<Chip key={idx} label={formatEnumName(muscle)} size="small" variant="outlined" />
														))}
													</Box>
												)}
											</Box>
											<IconButton size="small" onClick={() => removeExercise(exercise._id)} color="error">
												<DeleteIcon />
											</IconButton>
										</Stack>
									</CardContent>
								</Card>
							))}
						</Stack>
					)}
				</Box>

				{/* Tags */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Tags (Optional)
					</Typography>
					<Stack spacing={2}>
						<Stack direction="row" spacing={1}>
							<TextField
								fullWidth
								placeholder="Add tag"
								value={currentTag}
								onChange={(e) => setCurrentTag(e.target.value)}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										addTag();
									}
								}}
							/>
							<Button variant="outlined" startIcon={<AddIcon />} onClick={addTag}>
								Add
							</Button>
						</Stack>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
							{workoutData.workoutTags?.map((tag, index) => (
								<Chip key={index} label={tag} onDelete={() => removeTag(index)} size="small" />
							))}
						</Box>
					</Stack>
				</Box>

				{/* Premium */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Premium Settings
					</Typography>
					<FormControl fullWidth>
						<InputLabel>Premium Workout</InputLabel>
						<Select
							value={workoutData.isPremium ? 'yes' : 'no'}
							label="Premium Workout"
							onChange={(e) => setWorkoutData({ ...workoutData, isPremium: e.target.value === 'yes' })}
						>
							<MenuItem value="no">Free</MenuItem>
							<MenuItem value="yes">Premium</MenuItem>
						</Select>
					</FormControl>
				</Box>

				{/* Media Uploads */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Media (Optional)
					</Typography>
					<Stack spacing={3}>
						{/* Image Upload */}
						<Box>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
								Workout Image
							</Typography>
							<Stack direction="row" spacing={2} alignItems="center">
								<Button variant="outlined" component="label" onClick={() => imageInputRef.current?.click()}>
									Upload Image
									<input ref={imageInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload} />
								</Button>
								{workoutData.workoutImage && (
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<img
											src={`${REACT_APP_API_URL}/${workoutData.workoutImage}`}
											alt="Workout"
											style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
										/>
										<IconButton size="small" onClick={() => setWorkoutData({ ...workoutData, workoutImage: undefined })}>
											<CloseIcon />
										</IconButton>
									</Box>
								)}
							</Stack>
						</Box>

						{/* Video Upload */}
						<Box>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
								Workout Video
							</Typography>
							<Stack direction="row" spacing={2} alignItems="center">
								<Button variant="outlined" component="label" onClick={() => videoInputRef.current?.click()}>
									Upload Video
									<input ref={videoInputRef} type="file" hidden accept="video/*" onChange={handleVideoUpload} />
								</Button>
								{workoutData.workoutVideo && (
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<Typography variant="body2" color="success.main">
											✓ Video uploaded
										</Typography>
										<IconButton size="small" onClick={() => setWorkoutData({ ...workoutData, workoutVideo: undefined })}>
											<CloseIcon />
										</IconButton>
									</Box>
								)}
							</Stack>
						</Box>
					</Stack>
				</Box>

				{/* Submit Button */}
				<Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
					<Button variant="outlined" onClick={() => router.back()} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button variant="contained" onClick={handleSubmit} disabled={isSubmitting} size="large">
						{isSubmitting ? 'Creating...' : 'Create Workout'}
					</Button>
				</Stack>
			</Stack>

			{/* Exercise Selection Dialog */}
			<Dialog open={exerciseDialogOpen} onClose={() => setExerciseDialogOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle>
					<Stack direction="row" spacing={2} alignItems="center">
						<FitnessCenterIcon />
						<Typography variant="h6">Select Exercises</Typography>
					</Stack>
				</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						placeholder="Search exercises..."
						value={exerciseSearchText}
						onChange={(e) => setExerciseSearchText(e.target.value)}
						InputProps={{
							startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
						}}
						sx={{ mb: 2 }}
					/>

					{exercisesLoading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
							<CircularProgress />
						</Box>
					) : (
						<List>
							{filteredExercises.map((exercise: Exercise) => (
								<ListItem
									key={exercise._id}
									button
									onClick={() => toggleExercise(exercise._id)}
									sx={{
										border: '1px solid',
										borderColor: workoutData.workoutExercises?.includes(exercise._id) ? 'primary.main' : 'divider',
										borderRadius: 1,
										mb: 1,
									}}
								>
									<Checkbox checked={workoutData.workoutExercises?.includes(exercise._id) || false} />
									<ListItemText
										primary={exercise.exerciseName}
										secondary={
											<>
												{exercise.exerciseDesc}
												{exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
													<Box sx={{ mt: 0.5 }}>
														{exercise.targetMuscles.map((muscle, idx) => (
															<Chip key={idx} label={formatEnumName(muscle)} size="small" sx={{ mr: 0.5 }} />
														))}
													</Box>
												)}
											</>
										}
									/>
								</ListItem>
							))}
						</List>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setExerciseDialogOpen(false)}>Done</Button>
				</DialogActions>
			</Dialog>

			{/* AI Workout Generator Dialog */}
			<AIWorkoutGenerator
				open={aiGeneratorOpen}
				onClose={() => setAiGeneratorOpen(false)}
				onGenerate={(generatedWorkout) => {
					setWorkoutData({
						...workoutData,
						...generatedWorkout,
						// Keep existing exercises if any, or use generated ones
						workoutExercises: generatedWorkout.workoutExercises || workoutData.workoutExercises || [],
					});
				}}
			/>
		</Stack>
	);
};

export default withLayoutBasic(CreateWorkoutPage);


import React, { useState, useRef, useCallback, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Alert } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useReactiveVar } from '@apollo/client';
import { CREATE_EXERCISE } from '../../apollo/user/mutation';
import { ExerciseInput } from '../../libs/types/exercise/exercise.input';
import { ExerciseType, ExerciseStatus, MuscleGroup } from '../../libs/enums/exercise.enum';
import { WorkoutEquipment } from '../../libs/enums/workout.enum';
import { userVar } from '../../apollo/store';
import { getJwtToken } from '../../libs/auth';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../libs/sweetAlert';
import { REACT_APP_API_URL } from '../../libs/config';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CreateExercisePage: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const token = getJwtToken();
    const imageInputRef = useRef<HTMLInputElement>(null);
	const videoInputRef = useRef<HTMLInputElement>(null);
	const gifInputRef = useRef<HTMLInputElement>(null);

	const [exerciseData, setExerciseData] = useState<ExerciseInput>({
		exerciseName: '',
		exerciseType: ExerciseType.STRENGTH,
		exerciseStatus: ExerciseStatus.PENDING_REVIEW,
        targetMuscles: [],
		secondaryMuscles: [],
		exerciseDesc: '',
		exerciseInstructions: [],
		exerciseEquipment: [],
		exerciseImage: undefined,
		exerciseVideo: undefined,
		exerciseGif: undefined,
		exerciseDifficulty: '1',
		exerciseTips: [],
		exerciseWarnings: [],
		commonMistakes: [],
		exerciseTags: [],
	});

	const [currentInstruction, setCurrentInstruction] = useState('');
	const [currentTip, setCurrentTip] = useState('');
	const [currentWarning, setCurrentWarning] = useState('');
	const [currentMistake, setCurrentMistake] = useState('');
	const [currentTag, setCurrentTag] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	const [createExercise] = useMutation(CREATE_EXERCISE);

	// Check if user is trainer
	useEffect(() => {
		if (user?.memberType !== 'TRAINER' && user?.memberType !== 'ADMIN') {
			router.push('/exercises');
		}
	}, [user, router]);

	// Upload single image/video/gif
	const uploadSingleFile = async (file: File, target: 'exercise'): Promise<string> => {
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

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
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
			
			const uploadedPath = await uploadSingleFile(file, 'exercise');
			setExerciseData({ ...exerciseData, exerciseImage: uploadedPath });
		} catch (err: any) {
			setError(err.message || 'Failed to upload image');
		}
	};

	const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = e.target.files?.[0];
			if (!file) return;

			const uploadedPath = await uploadSingleFile(file, 'exercise');
			setExerciseData({ ...exerciseData, exerciseVideo: uploadedPath });
        } catch (err: any) {
			setError(err.message || 'Failed to upload video');
		}
	};

	const handleGifUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = e.target.files?.[0];
			if (!file) return;
			
			const uploadedPath = await uploadSingleFile(file, 'exercise');
			setExerciseData({ ...exerciseData, exerciseGif: uploadedPath });
		} catch (err: any) {
			setError(err.message || 'Failed to upload GIF');
		}
	};

	const addToArray = (field: 'exerciseInstructions' | 'exerciseTips' | 'exerciseWarnings' | 'commonMistakes' | 'exerciseTags', value: string) => {
		if (!value.trim()) return;
		setExerciseData({
			...exerciseData,
			[field]: [...(exerciseData[field] || []), value.trim()],
		});
		if (field === 'exerciseInstructions') setCurrentInstruction('');
		if (field === 'exerciseTips') setCurrentTip('');
		if (field === 'exerciseWarnings') setCurrentWarning('');
		if (field === 'commonMistakes') setCurrentMistake('');
		if (field === 'exerciseTags') setCurrentTag('');
	};

	const removeFromArray = (field: 'exerciseInstructions' | 'exerciseTips' | 'exerciseWarnings' | 'commonMistakes' | 'exerciseTags' | 'targetMuscles' | 'secondaryMuscles' | 'exerciseEquipment', index: number) => {
		const currentArray = exerciseData[field] || [];
		setExerciseData({
			...exerciseData,
			[field]: currentArray.filter((_, i) => i !== index),
		});
	};

	const toggleArrayItem = (field: 'targetMuscles' | 'secondaryMuscles' | 'exerciseEquipment', value: string) => {
		const currentArray = (exerciseData[field] || []) as (MuscleGroup | WorkoutEquipment)[];
		const index = currentArray.indexOf(value as MuscleGroup | WorkoutEquipment);
		if (index > -1) {
			setExerciseData({
				...exerciseData,
				[field]: currentArray.filter((_, i) => i !== index) as any,
            });
        } else {
			setExerciseData({
				...exerciseData,
				[field]: [...currentArray, value as MuscleGroup | WorkoutEquipment] as any,
			});
		}
	};

	const validateForm = (): boolean => {
		if (!exerciseData.exerciseName.trim()) {
			setError('Exercise name is required');
			return false;
		}
		if (exerciseData.targetMuscles.length === 0) {
			setError('At least one target muscle group is required');
			return false;
		}
		if (!exerciseData.exerciseDesc.trim()) {
			setError('Exercise description is required');
			return false;
		}
		if (exerciseData.exerciseInstructions.length === 0) {
			setError('At least one instruction is required');
			return false;
		}
		return true;
	};

	const handleSubmit = useCallback(async () => {
		try {
			setError('');
			if (!validateForm()) return;

			setIsSubmitting(true);

			// Prepare input data
			const input: ExerciseInput = {
				exerciseName: exerciseData.exerciseName.trim(),
				exerciseType: exerciseData.exerciseType,
				exerciseStatus: exerciseData.exerciseStatus || ExerciseStatus.PENDING_REVIEW,
				targetMuscles: exerciseData.targetMuscles,
				secondaryMuscles: exerciseData.secondaryMuscles || [],
				exerciseDesc: exerciseData.exerciseDesc.trim(),
				exerciseInstructions: exerciseData.exerciseInstructions,
				exerciseEquipment: exerciseData.exerciseEquipment || [],
				exerciseDifficulty: exerciseData.exerciseDifficulty || '1',
				exerciseTips: exerciseData.exerciseTips || [],
                exerciseWarnings: exerciseData.exerciseWarnings || [],
				commonMistakes: exerciseData.commonMistakes || [],
				exerciseTags: exerciseData.exerciseTags || [],
			};

			if (exerciseData.exerciseImage) input.exerciseImage = exerciseData.exerciseImage;
			if (exerciseData.exerciseVideo) input.exerciseVideo = exerciseData.exerciseVideo;
			if (exerciseData.exerciseGif) input.exerciseGif = exerciseData.exerciseGif;

			const result = await createExercise({
				variables: { input },
			});

			await sweetMixinSuccessAlert('Exercise created successfully!');
			router.push(`/exercises/${result.data?.createExercise?._id || ''}`);
		} catch (err: any) {
			setError(err.message || 'Failed to create exercise');
			sweetErrorHandling(err).then();
		} finally {
			setIsSubmitting(false);
		}
	}, [exerciseData, createExercise, router]);

	const formatEnumName = (str: string): string => {
		return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	if (device === 'mobile') {
		return <div>CREATE EXERCISE MOBILE PAGE</div>;
	}

	if (user?.memberType !== 'TRAINER' && user?.memberType !== 'ADMIN') {
		return (
			<Stack className="create-exercise-page" sx={{ p: 4 }}>
				<Alert severity="error">You must be a trainer to create exercises.</Alert>
			</Stack>
		);
	}

	return (
		<Stack className="create-exercise-page" sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
			<Stack className="page-header" sx={{ mb: 4 }}>
				<Typography variant="h3" className="page-title" sx={{ mb: 1 }}>
					Create New Exercise
				</Typography>
				<Typography variant="body1" className="page-subtitle" color="text.secondary">
					Add a new exercise to the library
                    </Typography>
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
							label="Exercise Name *"
							value={exerciseData.exerciseName}
							onChange={(e) => setExerciseData({ ...exerciseData, exerciseName: e.target.value })}
							required
						/>

						<Stack direction="row" spacing={2}>
							<FormControl fullWidth>
								<InputLabel>Exercise Type *</InputLabel>
								<Select
									value={exerciseData.exerciseType}
									label="Exercise Type *"
									onChange={(e) => setExerciseData({ ...exerciseData, exerciseType: e.target.value as ExerciseType })}
								>
									{Object.values(ExerciseType).map((type) => (
										<MenuItem key={type} value={type}>
											{formatEnumName(type)}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl fullWidth>
								<InputLabel>Difficulty (1-10)</InputLabel>
								<Select
									value={exerciseData.exerciseDifficulty}
									label="Difficulty (1-10)"
                                    onChange={(e) => setExerciseData({ ...exerciseData, exerciseDifficulty: e.target.value })}
                                    >
                                         {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <MenuItem key={num} value={String(num)}>
                                                {num}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
    
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Exercise Description *"
                                value={exerciseData.exerciseDesc}
                                onChange={(e) => setExerciseData({ ...exerciseData, exerciseDesc: e.target.value })}
                                required
                            />
                        </Stack>
                    </Box>
    
                    {/* Target & Secondary Muscles */}
                    <Box className="form-section">
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Muscle Groups
                        </Typography>
    
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Target Muscles * (Select at least one)
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {Object.values(MuscleGroup).map((muscle) => (
                                        <Chip
                                            key={muscle}
                                            label={formatEnumName(muscle)}
                                            onClick={() => toggleArrayItem('targetMuscles', muscle)}
                                            color={exerciseData.targetMuscles.includes(muscle) ? 'primary' : 'default'}
                                            variant={exerciseData.targetMuscles.includes(muscle) ? 'filled' : 'outlined'}
                                        />
                                    ))}
                                </Box>
                            </Box>

						<Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
								Secondary Muscles (Optional)
							</Typography>
							<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
								{Object.values(MuscleGroup).map((muscle) => (
									<Chip
										key={muscle}
										label={formatEnumName(muscle)}
										onClick={() => toggleArrayItem('secondaryMuscles', muscle)}
										color={exerciseData.secondaryMuscles?.includes(muscle) ? 'primary' : 'default'}
										variant={exerciseData.secondaryMuscles?.includes(muscle) ? 'filled' : 'outlined'}
									/>
								))}
							</Box>
						</Box>
					</Stack>
				</Box>

				{/* Equipment */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Equipment
					</Typography>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
						{Object.values(WorkoutEquipment).map((equipment) => (
							<Chip
								key={equipment}
								label={formatEnumName(equipment)}
								onClick={() => toggleArrayItem('exerciseEquipment', equipment)}
								color={exerciseData.exerciseEquipment?.includes(equipment) ? 'primary' : 'default'}
								variant={exerciseData.exerciseEquipment?.includes(equipment) ? 'filled' : 'outlined'}
							/>
						))}
					</Box>
				</Box>

				{/* Instructions */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Instructions *
					</Typography>
					<Stack spacing={2}>
						<Stack direction="row" spacing={1}>
							<TextField
								fullWidth
								placeholder="Add instruction step"
								value={currentInstruction}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentInstruction(e.target.value)}
								onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
									if (e.key === 'Enter') {
										addToArray('exerciseInstructions', currentInstruction);
									}
								}}
							/>
							<Button
								variant="outlined"
								startIcon={<AddIcon />}
								onClick={() => addToArray('exerciseInstructions', currentInstruction)}
							>
								Add
							</Button>
						</Stack>
						<Stack spacing={1}>
							{exerciseData.exerciseInstructions.map((instruction, index) => (
								<Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
									<Typography variant="body2" sx={{ flex: 1 }}>
										{index + 1}. {instruction}
									</Typography>
									<IconButton size="small" onClick={() => removeFromArray('exerciseInstructions', index)}>
										<DeleteIcon fontSize="small" />
									</IconButton>
								</Box>
							))}
						</Stack>
					</Stack>
				</Box>

				{/* Tips */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Tips (Optional)
					</Typography>
					<Stack spacing={2}>
						<Stack direction="row" spacing={1}>
							<TextField
								fullWidth
								placeholder="Add tip"
								value={currentTip}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentTip(e.target.value)}
								onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
									if (e.key === 'Enter') {
										addToArray('exerciseTips', currentTip);
									}
								}}
							/>
							<Button
								variant="outlined"
								startIcon={<AddIcon />}
								onClick={() => addToArray('exerciseTips', currentTip)}
							>
								Add
							</Button>
						</Stack>
						<Stack spacing={1}>
							{exerciseData.exerciseTips?.map((tip, index) => (
								<Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
									<Typography variant="body2" sx={{ flex: 1 }}>
										• {tip}
									</Typography>
									<IconButton size="small" onClick={() => removeFromArray('exerciseTips', index)}>
										<DeleteIcon fontSize="small" />
									</IconButton>
								</Box>
							))}
						</Stack>
					</Stack>
				</Box>

				{/* Warnings */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Warnings (Optional)
					</Typography>
					<Stack spacing={2}>
						<Stack direction="row" spacing={1}>
							<TextField
								fullWidth
								placeholder="Add warning"
								value={currentWarning}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentWarning(e.target.value)}
								onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
									if (e.key === 'Enter') {
										addToArray('exerciseWarnings', currentWarning);
									}
								}}
							/>
							<Button
								variant="outlined"
								startIcon={<AddIcon />}
								onClick={() => addToArray('exerciseWarnings', currentWarning)}
							>
								Add
							</Button>
						</Stack>
						<Stack spacing={1}>
							{exerciseData.exerciseWarnings?.map((warning, index) => (
								<Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
									<Typography variant="body2" sx={{ flex: 1, color: 'warning.main' }}>
										⚠ {warning}
									</Typography>
									<IconButton size="small" onClick={() => removeFromArray('exerciseWarnings', index)}>
										<DeleteIcon fontSize="small" />
									</IconButton>
								</Box>
							))}
						</Stack>
					</Stack>
				</Box>

				{/* Common Mistakes */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Common Mistakes (Optional)
					</Typography>
					<Stack spacing={2}>
						<Stack direction="row" spacing={1}>
							<TextField
								fullWidth
								placeholder="Add common mistake"
								value={currentMistake}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentMistake(e.target.value)}
								onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
									if (e.key === 'Enter') {
										addToArray('commonMistakes', currentMistake);
									}
								}}
							/>
							<Button
								variant="outlined"
								startIcon={<AddIcon />}
								onClick={() => addToArray('commonMistakes', currentMistake)}
							>
								Add
							</Button>
						</Stack>
						<Stack spacing={1}>
							{exerciseData.commonMistakes?.map((mistake, index) => (
								<Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
									<Typography variant="body2" sx={{ flex: 1 }}>
										✗ {mistake}
									</Typography>
									<IconButton size="small" onClick={() => removeFromArray('commonMistakes', index)}>
										<DeleteIcon fontSize="small" />
									</IconButton>
								</Box>
							))}
						</Stack>
					</Stack>
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
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentTag(e.target.value)}
								onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
									if (e.key === 'Enter') {
										addToArray('exerciseTags', currentTag);
									}
								}}
							/>
							<Button
								variant="outlined"
								startIcon={<AddIcon />}
								onClick={() => addToArray('exerciseTags', currentTag)}
							>
								Add
							</Button>
						</Stack>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
							{exerciseData.exerciseTags?.map((tag, index) => (
								<Chip
									key={index}
									label={tag}
									onDelete={() => removeFromArray('exerciseTags', index)}
									color="primary"
									variant="outlined"
								/>
							))}
						</Box>
					</Stack>
				</Box>

				{/* Media Upload */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Media (Optional)
					</Typography>
					<Stack spacing={3}>
						{/* Image Upload */}
						<Box>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
								Exercise Image
							</Typography>
							<Stack direction="row" spacing={2} alignItems="center">
								<input
									ref={imageInputRef}
									type="file"
									accept="image/*"
									style={{ display: 'none' }}
									onChange={handleImageUpload}
								/>
								<Button
									variant="outlined"
									onClick={() => imageInputRef.current?.click()}
									disabled={isSubmitting}
								>
									{exerciseData.exerciseImage ? 'Change Image' : 'Upload Image'}
								</Button>
								{exerciseData.exerciseImage && (
									<>
										<Typography variant="body2" color="success.main">
											Image uploaded
										</Typography>
										<IconButton
											size="small"
											onClick={() => setExerciseData({ ...exerciseData, exerciseImage: undefined })}
										>
											<CloseIcon fontSize="small" />
										</IconButton>
									</>
								)}
							</Stack>
						</Box>

						{/* Video Upload */}
						<Box>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
								Exercise Video
							</Typography>
							<Stack direction="row" spacing={2} alignItems="center">
								<input
									ref={videoInputRef}
									type="file"
									accept="video/*"
									style={{ display: 'none' }}
									onChange={handleVideoUpload}
								/>
								<Button
									variant="outlined"
									onClick={() => videoInputRef.current?.click()}
									disabled={isSubmitting}
								>
									{exerciseData.exerciseVideo ? 'Change Video' : 'Upload Video'}
								</Button>
								{exerciseData.exerciseVideo && (
									<>
										<Typography variant="body2" color="success.main">
											Video uploaded
										</Typography>
										<IconButton
											size="small"
											onClick={() => setExerciseData({ ...exerciseData, exerciseVideo: undefined })}
										>
											<CloseIcon fontSize="small" />
										</IconButton>
									</>
								)}
							</Stack>
						</Box>

						{/* GIF Upload */}
						<Box>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
								Exercise GIF
							</Typography>
							<Stack direction="row" spacing={2} alignItems="center">
								<input
									ref={gifInputRef}
									type="file"
									accept="image/gif"
									style={{ display: 'none' }}
									onChange={handleGifUpload}
								/>
								<Button
									variant="outlined"
									onClick={() => gifInputRef.current?.click()}
									disabled={isSubmitting}
								>
									{exerciseData.exerciseGif ? 'Change GIF' : 'Upload GIF'}
								</Button>
								{exerciseData.exerciseGif && (
									<>
										<Typography variant="body2" color="success.main">
											GIF uploaded
										</Typography>
										<IconButton
											size="small"
											onClick={() => setExerciseData({ ...exerciseData, exerciseGif: undefined })}
										>
											<CloseIcon fontSize="small" />
										</IconButton>
									</>
								)}
							</Stack>
						</Box>
					</Stack>
				</Box>

				{/* Submit Button */}
				<Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
					<Button
						variant="outlined"
						onClick={() => router.back()}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						onClick={handleSubmit}
						disabled={isSubmitting}
						size="large"
					>
						{isSubmitting ? 'Creating...' : 'Create Exercise'}
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(CreateExercisePage);

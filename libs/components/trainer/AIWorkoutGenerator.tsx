import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Stack,
	Box,
	Typography,
	Alert,
	CircularProgress,
	Chip,
	Slider,
	Autocomplete,
} from '@mui/material';
import { WorkoutCategory, WorkoutDifficulty, WorkoutDuration, WorkoutEquipment } from '../../enums/workout.enum';
import { useAIRoutineGenerator, WorkoutGenerationParams } from '../../hooks/useAIRoutineGenerator';
import { WorkoutInput } from '../../types/workout/workout.input';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';

interface AIWorkoutGeneratorProps {
	open: boolean;
	onClose: () => void;
	onGenerate: (workout: Partial<WorkoutInput>) => void;
}

const AIWorkoutGenerator: React.FC<AIWorkoutGeneratorProps> = ({ open, onClose, onGenerate }) => {
	const { generateWorkout, loading, error } = useAIRoutineGenerator();
	
	const [params, setParams] = useState<WorkoutGenerationParams>({
		goal: '',
		difficulty: WorkoutDifficulty.INTERMEDIATE,
		duration: '30',
		category: WorkoutCategory.STRENGTH,
		equipment: [],
		experience: 'intermediate',
		limitations: '',
	});

	const goalOptions = [
		'weight loss',
		'muscle gain',
		'endurance',
		'strength',
		'flexibility',
		'general fitness',
		'athletic performance',
		'rehabilitation',
	];

	const handleGenerate = async () => {
		if (!params.goal.trim()) {
			return;
		}

		const generated = await generateWorkout(params);
		if (generated) {
			onGenerate(generated);
			onClose();
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>
				<Stack direction="row" alignItems="center" spacing={2}>
					<AutoAwesomeIcon sx={{ color: '#E10600' }} />
					<Typography variant="h6">AI Workout Generator</Typography>
				</Stack>
			</DialogTitle>
			<DialogContent>
				<Stack spacing={3} sx={{ mt: 1 }}>
					<Alert severity="info">
						Let AI create a personalized workout routine based on your preferences. You can edit the generated workout before saving.
					</Alert>

					{error && (
						<Alert severity="warning">
							{error}. Using fallback generation method.
						</Alert>
					)}

					{/* Goal */}
					<Autocomplete
						options={goalOptions}
						freeSolo
						value={params.goal}
						onChange={(_, newValue) => setParams({ ...params, goal: newValue || '' })}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Fitness Goal *"
								placeholder="e.g., weight loss, muscle gain, endurance"
								required
							/>
						)}
					/>

					{/* Difficulty */}
					<FormControl fullWidth>
						<InputLabel>Difficulty Level *</InputLabel>
						<Select
							value={params.difficulty}
							label="Difficulty Level *"
							onChange={(e) => setParams({ ...params, difficulty: e.target.value as WorkoutDifficulty })}
						>
							<MenuItem value={WorkoutDifficulty.BEGINNER}>Beginner</MenuItem>
							<MenuItem value={WorkoutDifficulty.INTERMEDIATE}>Intermediate</MenuItem>
							<MenuItem value={WorkoutDifficulty.EXPERT}>Expert</MenuItem>
						</Select>
					</FormControl>

					{/* Duration */}
					<Box component="div">
						<Typography gutterBottom>Duration: {params.duration} minutes</Typography>
						<Slider
							value={parseInt(params.duration)}
							onChange={(_, value) => setParams({ ...params, duration: value.toString() })}
							min={10}
							max={120}
							step={5}
							marks={[
								{ value: 15, label: '15min' },
								{ value: 30, label: '30min' },
								{ value: 45, label: '45min' },
								{ value: 60, label: '60min' },
								{ value: 90, label: '90min' },
							]}
						/>
					</Box>

					{/* Category */}
					<FormControl fullWidth>
						<InputLabel>Workout Category</InputLabel>
						<Select
							value={params.category || WorkoutCategory.STRENGTH}
							label="Workout Category"
							onChange={(e) => setParams({ ...params, category: e.target.value as WorkoutCategory })}
						>
							<MenuItem value={WorkoutCategory.STRENGTH}>Strength</MenuItem>
							<MenuItem value={WorkoutCategory.CARDIO}>Cardio</MenuItem>
							<MenuItem value={WorkoutCategory.HIIT}>HIIT</MenuItem>
							<MenuItem value={WorkoutCategory.FLEXIBILITY}>Flexibility</MenuItem>
							<MenuItem value={WorkoutCategory.CALISTHENICS}>Calisthenics</MenuItem>
							<MenuItem value={WorkoutCategory.YOGA}>Yoga</MenuItem>
							<MenuItem value={WorkoutCategory.PILATES}>Pilates</MenuItem>
							<MenuItem value={WorkoutCategory.CROSSFIT}>CrossFit</MenuItem>
						</Select>
					</FormControl>

					{/* Equipment */}
					<Autocomplete
						multiple
						options={Object.values(WorkoutEquipment)}
						value={params.equipment || []}
						onChange={(_, newValue) => setParams({ ...params, equipment: newValue })}
						renderInput={(params) => (
							<TextField {...params} label="Available Equipment" placeholder="Select equipment" />
						)}
						renderTags={(value, getTagProps) =>
							value.map((option, index) => (
								<Chip label={option} {...getTagProps({ index })} key={option} />
							))
						}
					/>

					{/* Experience Level */}
					<FormControl fullWidth>
						<InputLabel>Experience Level</InputLabel>
						<Select
							value={params.experience || 'intermediate'}
							label="Experience Level"
							onChange={(e) => setParams({ ...params, experience: e.target.value })}
						>
							<MenuItem value="beginner">Beginner</MenuItem>
							<MenuItem value="intermediate">Intermediate</MenuItem>
							<MenuItem value="advanced">Advanced</MenuItem>
							<MenuItem value="expert">Expert</MenuItem>
						</Select>
					</FormControl>

					{/* Limitations */}
					<TextField
						label="Injuries or Limitations (Optional)"
						multiline
						rows={2}
						value={params.limitations}
						onChange={(e) => setParams({ ...params, limitations: e.target.value })}
						placeholder="e.g., knee injury, lower back pain, etc."
					/>
				</Stack>
			</DialogContent>
			<DialogActions sx={{ p: 3 }}>
				<Button onClick={onClose} startIcon={<CloseIcon />}>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleGenerate}
					disabled={loading || !params.goal.trim()}
					startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
					sx={{ backgroundColor: '#E10600', '&:hover': { backgroundColor: '#C10500' } }}
				>
					{loading ? 'Generating...' : 'Generate Workout'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AIWorkoutGenerator;


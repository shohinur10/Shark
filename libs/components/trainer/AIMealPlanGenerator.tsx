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
import { NutritionGoal, DietaryPreference } from '../../enums/nutrition.enum';
import { useAIRoutineGenerator, MealPlanGenerationParams } from '../../hooks/useAIRoutineGenerator';
import { MealPlanInput } from '../../types/mealplan/mealplan.input';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';

interface AIMealPlanGeneratorProps {
	open: boolean;
	onClose: () => void;
	onGenerate: (mealPlan: Partial<MealPlanInput>) => void;
}

const AIMealPlanGenerator: React.FC<AIMealPlanGeneratorProps> = ({ open, onClose, onGenerate }) => {
	const { generateMealPlan, loading, error } = useAIRoutineGenerator();
	
	const [params, setParams] = useState<MealPlanGenerationParams>({
		goal: NutritionGoal.MAINTENANCE,
		duration: 7,
		calorieTarget: 2000,
		dietaryPreferences: [],
		allergies: [],
		mealFrequency: 3,
		specialRequirements: '',
	});

	const [allergyInput, setAllergyInput] = useState('');

	const handleGenerate = async () => {
		const generated = await generateMealPlan(params);
		if (generated) {
			onGenerate(generated);
			onClose();
		}
	};

	const addAllergy = () => {
		if (!allergyInput.trim()) return;
		setParams({
			...params,
			allergies: [...(params.allergies || []), allergyInput.trim()],
		});
		setAllergyInput('');
	};

	const removeAllergy = (index: number) => {
		setParams({
			...params,
			allergies: params.allergies?.filter((_, i) => i !== index) || [],
		});
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>
				<Stack direction="row" alignItems="center" spacing={2}>
					<AutoAwesomeIcon sx={{ color: '#E10600' }} />
					<Typography variant="h6">AI Meal Plan Generator</Typography>
				</Stack>
			</DialogTitle>
			<DialogContent>
				<Stack spacing={3} sx={{ mt: 1 }}>
					<Alert severity="info">
						Let AI create a personalized meal plan based on your preferences. You can edit the generated meal plan before saving.
					</Alert>

					{error && (
						<Alert severity="warning">
							{error}. Using fallback generation method.
						</Alert>
					)}

					{/* Nutrition Goal */}
					<FormControl fullWidth>
						<InputLabel>Nutrition Goal *</InputLabel>
						<Select
							value={params.goal}
							label="Nutrition Goal *"
							onChange={(e) => setParams({ ...params, goal: e.target.value as NutritionGoal })}
						>
							<MenuItem value={NutritionGoal.WEIGHT_LOSS}>Weight Loss</MenuItem>
							<MenuItem value={NutritionGoal.MUSCLE_GAIN}>Muscle Gain</MenuItem>
							<MenuItem value={NutritionGoal.LEAN_MUSCLE}>Lean Muscle</MenuItem>
							<MenuItem value={NutritionGoal.MAINTENANCE}>Maintenance</MenuItem>
							<MenuItem value={NutritionGoal.PERFORMANCE}>Performance</MenuItem>
							<MenuItem value={NutritionGoal.HEALTH}>Health</MenuItem>
						</Select>
					</FormControl>

					{/* Duration */}
					<Box>
						<Typography gutterBottom>Duration: {params.duration} days</Typography>
						<Slider
							value={params.duration}
							onChange={(_: any, value: number | number[]) => setParams({ ...params, duration: value as number })}
							min={3}
							max={30}
							step={1}
							marks={[
								{ value: 7, label: '7 days' },
								{ value: 14, label: '14 days' },
								{ value: 21, label: '21 days' },
								{ value: 30, label: '30 days' },
							]}
						/>
					</Box>

					{/* Calorie Target */}
					<Box>
						<Typography gutterBottom>Daily Calorie Target: {params.calorieTarget} kcal</Typography>
						<Slider
							value={params.calorieTarget}
							onChange={(_: any, value: number | number[]) => setParams({ ...params, calorieTarget: value as number })}
							min={1200}
							max={4000}
							step={50}
							marks={[
								{ value: 1500, label: '1500' },
								{ value: 2000, label: '2000' },
								{ value: 2500, label: '2500' },
								{ value: 3000, label: '3000' },
							]}
						/>
					</Box>

					{/* Meal Frequency */}
					<FormControl fullWidth>
						<InputLabel>Meals Per Day</InputLabel>
						<Select
							value={params.mealFrequency || 3}
							label="Meals Per Day"
							onChange={(e) => setParams({ ...params, mealFrequency: e.target.value as number })}
						>
							<MenuItem value={3}>3 Meals</MenuItem>
							<MenuItem value={4}>4 Meals</MenuItem>
							<MenuItem value={5}>5 Meals</MenuItem>
							<MenuItem value={6}>6 Meals</MenuItem>
						</Select>
					</FormControl>

					{/* Dietary Preferences */}
					<Autocomplete
						multiple
						options={Object.values(DietaryPreference)}
						value={params.dietaryPreferences || []}
						onChange={(_, newValue) => setParams({ ...params, dietaryPreferences: newValue })}
						renderInput={(params) => (
							<TextField {...params} label="Dietary Preferences" placeholder="Select preferences" />
						)}
						renderTags={(value, getTagProps) =>
							value.map((option, index) => (
								<Chip label={option.replace(/_/g, ' ')} {...getTagProps({ index })} key={option} />
							))
						}
					/>

					{/* Allergies */}
					<Box>
						<Typography variant="body2" sx={{ mb: 1 }}>Allergies</Typography>
						<Stack direction="row" spacing={1} sx={{ mb: 1 }}>
							<TextField
								fullWidth
								placeholder="Add allergy (e.g., peanuts, dairy)"
								value={allergyInput}
								onChange={(e) => setAllergyInput(e.target.value)}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										addAllergy();
									}
								}}
								size="small"
							/>
							<Button variant="outlined" onClick={addAllergy}>
								Add
							</Button>
						</Stack>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
							{params.allergies?.map((allergy, index) => (
								<Chip
									key={index}
									label={allergy}
									onDelete={() => removeAllergy(index)}
									size="small"
								/>
							))}
						</Box>
					</Box>

					{/* Special Requirements */}
					<TextField
						label="Special Requirements (Optional)"
						multiline
						rows={3}
						value={params.specialRequirements}
						onChange={(e) => setParams({ ...params, specialRequirements: e.target.value })}
						placeholder="e.g., high protein, low carb, meal prep friendly, etc."
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
					disabled={loading}
					startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
					sx={{ backgroundColor: '#E10600', '&:hover': { backgroundColor: '#C10500' } }}
				>
					{loading ? 'Generating...' : 'Generate Meal Plan'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AIMealPlanGenerator;


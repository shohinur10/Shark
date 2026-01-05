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
	Divider,
} from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useReactiveVar } from '@apollo/client';
import { CREATE_MEAL_PLAN } from '../../../apollo/user/mutation';
import { MealPlanInput, MealInput, MacrosInput } from '../../../libs/types/mealplan/mealplan.input';
import { NutritionGoal, MealPlanStatus, MealType, DietaryPreference } from '../../../libs/enums/nutrition.enum';
import { userVar } from '../../../apollo/store';
import { getJwtToken } from '../../../libs/auth';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../../libs/sweetAlert';
import { REACT_APP_API_URL } from '../../../libs/config';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CreateMealPlanPage: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const token = getJwtToken();

	const imageInputRef = useRef<HTMLInputElement>(null);

	const [mealPlanData, setMealPlanData] = useState<Partial<MealPlanInput>>({
		mealPlanTitle: '',
		mealPlanStatus: MealPlanStatus.DRAFT,
		mealPlanDesc: '',
		nutritionGoal: NutritionGoal.MAINTENANCE,
		dietaryPreference: [],
		duration: 7,
		calorieTarget: 2000,
		macros: {
			protein: 150,
			carbs: 200,
			fats: 65,
		},
		meals: [],
		isPremium: false,
		price: 0,
	});

	const [currentMeal, setCurrentMeal] = useState<Partial<MealInput>>({
		day: 1,
		mealType: MealType.BREAKFAST,
		mealName: '',
		ingredients: [] as string[],
		instructions: [] as string[],
		calories: 0,
		protein: 0,
		carbs: 0,
		fats: 0,
	});

	const [currentIngredient, setCurrentIngredient] = useState('');
	const [currentInstruction, setCurrentInstruction] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	const [createMealPlan] = useMutation(CREATE_MEAL_PLAN);

	// Check if user is trainer
	useEffect(() => {
		if (user?.memberType !== 'TRAINER' && user?.memberType !== 'ADMIN') {
			router.push('/trainer/meal-plans');
		}
	}, [user, router]);

	// Upload image
	const uploadImage = async (file: File): Promise<string> => {
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
						target: 'mealplan',
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
			console.log('Error uploading image:', err);
			throw new Error(err.message || 'Failed to upload image');
		}
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = e.target.files?.[0];
			if (!file) return;

			const uploadedPath = await uploadImage(file);
			setCurrentMeal({ ...currentMeal, imageUrl: uploadedPath });
		} catch (err: any) {
			setError(err.message || 'Failed to upload image');
		}
	};

	const addToArray = (field: 'ingredients' | 'instructions', value: string) => {
		if (!value.trim()) return;
		const currentArray = (currentMeal[field] as string[]) || [];
		setCurrentMeal({
			...currentMeal,
			[field]: [...currentArray, value.trim()] as string[],
		});
		if (field === 'ingredients') setCurrentIngredient('');
		if (field === 'instructions') setCurrentInstruction('');
	};

	const removeFromArray = (field: 'ingredients' | 'instructions', index: number) => {
		const currentArray = (currentMeal[field] as string[]) || [];
		setCurrentMeal({
			...currentMeal,
			[field]: currentArray.filter((_: string, i: number) => i !== index) as string[],
		});
	};

	const toggleDietaryPreference = (preference: DietaryPreference) => {
		const current = mealPlanData.dietaryPreference || [];
		const index = current.indexOf(preference);
		if (index > -1) {
			setMealPlanData({
				...mealPlanData,
				dietaryPreference: current.filter((_, i) => i !== index),
			});
		} else {
			setMealPlanData({
				...mealPlanData,
				dietaryPreference: [...current, preference],
			});
		}
	};

	const addMeal = () => {
		if (!currentMeal.mealName || !currentMeal.mealType) {
			setError('Please fill in meal name and type');
			return;
		}
		if (currentMeal.calories === 0) {
			setError('Please enter calories for the meal');
			return;
		}

		const newMeal: MealInput = {
			day: currentMeal.day || 1,
			mealType: currentMeal.mealType!,
			mealName: currentMeal.mealName!,
			ingredients: (currentMeal.ingredients as string[]) || [],
			instructions: (currentMeal.instructions as string[]) || [],
			calories: currentMeal.calories || 0,
			protein: currentMeal.protein || 0,
			carbs: currentMeal.carbs || 0,
			fats: currentMeal.fats || 0,
			imageUrl: currentMeal.imageUrl,
		};

		setMealPlanData({
			...mealPlanData,
			meals: [...(mealPlanData.meals || []), newMeal],
		});

		// Reset current meal
		setCurrentMeal({
			day: currentMeal.day,
			mealType: MealType.BREAKFAST,
			mealName: '',
			ingredients: [] as string[],
			instructions: [] as string[],
			calories: 0,
			protein: 0,
			carbs: 0,
			fats: 0,
		});
	};

	const removeMeal = (index: number) => {
		const meals = mealPlanData.meals || [];
		setMealPlanData({
			...mealPlanData,
			meals: meals.filter((_, i) => i !== index),
		});
	};

	const validateForm = (): boolean => {
		if (!mealPlanData.mealPlanTitle?.trim()) {
			setError('Meal plan title is required');
			return false;
		}
		if (!mealPlanData.mealPlanDesc?.trim()) {
			setError('Meal plan description is required');
			return false;
		}
		if (!mealPlanData.nutritionGoal) {
			setError('Nutrition goal is required');
			return false;
		}
		if (!mealPlanData.duration || mealPlanData.duration < 1) {
			setError('Duration must be at least 1 day');
			return false;
		}
		if (!mealPlanData.calorieTarget || mealPlanData.calorieTarget < 1) {
			setError('Calorie target is required');
			return false;
		}
		if (!mealPlanData.macros) {
			setError('Macros are required');
			return false;
		}
		if (!mealPlanData.meals || mealPlanData.meals.length === 0) {
			setError('Please add at least one meal');
			return false;
		}
		return true;
	};

	const handleSubmit = useCallback(async () => {
		try {
			setError('');
			if (!validateForm()) return;

			setIsSubmitting(true);

			const input: MealPlanInput = {
				mealPlanTitle: mealPlanData.mealPlanTitle!.trim(),
				mealPlanStatus: mealPlanData.mealPlanStatus || MealPlanStatus.DRAFT,
				mealPlanDesc: mealPlanData.mealPlanDesc!.trim(),
				nutritionGoal: mealPlanData.nutritionGoal!,
				dietaryPreference: mealPlanData.dietaryPreference || [],
				duration: mealPlanData.duration!,
				calorieTarget: mealPlanData.calorieTarget!,
				macros: mealPlanData.macros!,
				meals: mealPlanData.meals!,
				isPremium: mealPlanData.isPremium || false,
				price: mealPlanData.price || 0,
			};

			const result = await createMealPlan({
				variables: { input },
			});

			await sweetMixinSuccessAlert('Meal plan created successfully!');
			router.push(`/trainer/meal-plans`);
		} catch (err: any) {
			setError(err.message || 'Failed to create meal plan');
			sweetErrorHandling(err).then();
		} finally {
			setIsSubmitting(false);
		}
	}, [mealPlanData, createMealPlan, router]);

	const formatEnumName = (str: string): string => {
		return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const getMealsByDay = (day: number) => {
		return mealPlanData.meals?.filter((meal) => meal.day === day) || [];
	};

	if (device === 'mobile') {
		return <div>CREATE MEAL PLAN MOBILE PAGE</div>;
	}

	if (user?.memberType !== 'TRAINER' && user?.memberType !== 'ADMIN') {
		return (
			<Stack className="create-meal-plan-page" sx={{ p: 4 }}>
				<Alert severity="error">You must be a trainer to create meal plans.</Alert>
			</Stack>
		);
	}

	return (
		<Stack className="create-meal-plan-page" sx={{ p: 4, maxWidth: 1400, mx: 'auto' }}>
			<Stack className="page-header" sx={{ mb: 4 }}>
				<Typography variant="h3" className="page-title" sx={{ mb: 1 }}>
					Create New Meal Plan
				</Typography>
				<Typography variant="body1" className="page-subtitle" color="text.secondary">
					Design a comprehensive meal plan for your clients
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
							label="Meal Plan Title *"
							value={mealPlanData.mealPlanTitle}
							onChange={(e) => setMealPlanData({ ...mealPlanData, mealPlanTitle: e.target.value })}
							required
						/>

						<TextField
							fullWidth
							multiline
							rows={4}
							label="Description *"
							value={mealPlanData.mealPlanDesc}
							onChange={(e) => setMealPlanData({ ...mealPlanData, mealPlanDesc: e.target.value })}
							required
						/>

						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel>Nutrition Goal *</InputLabel>
									<Select
										value={mealPlanData.nutritionGoal}
										label="Nutrition Goal *"
										onChange={(e) => setMealPlanData({ ...mealPlanData, nutritionGoal: e.target.value as NutritionGoal })}
									>
										{Object.values(NutritionGoal).map((goal) => (
											<MenuItem key={goal} value={goal}>
												{formatEnumName(goal)}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel>Status</InputLabel>
									<Select
										value={mealPlanData.mealPlanStatus}
										label="Status"
										onChange={(e) => setMealPlanData({ ...mealPlanData, mealPlanStatus: e.target.value as MealPlanStatus })}
									>
										{Object.values(MealPlanStatus).map((status) => (
											<MenuItem key={status} value={status}>
												{formatEnumName(status)}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>

						<Box>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
								Dietary Preferences (Optional)
							</Typography>
							<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
								{Object.values(DietaryPreference).map((pref) => (
									<Chip
										key={pref}
										label={formatEnumName(pref)}
										onClick={() => toggleDietaryPreference(pref)}
										color={mealPlanData.dietaryPreference?.includes(pref) ? 'primary' : 'default'}
										variant={mealPlanData.dietaryPreference?.includes(pref) ? 'filled' : 'outlined'}
									/>
								))}
							</Box>
						</Box>
					</Stack>
				</Box>

				{/* Duration & Calories */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Duration & Targets
					</Typography>

					<Grid container spacing={2}>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								type="number"
								label="Duration (days) *"
								value={mealPlanData.duration}
								onChange={(e) => setMealPlanData({ ...mealPlanData, duration: parseInt(e.target.value) || 7 })}
								inputProps={{ min: 1 }}
								required
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								type="number"
								label="Daily Calorie Target *"
								value={mealPlanData.calorieTarget}
								onChange={(e) => setMealPlanData({ ...mealPlanData, calorieTarget: parseInt(e.target.value) || 2000 })}
								inputProps={{ min: 1 }}
								required
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<FormControl fullWidth>
								<InputLabel>Premium Plan</InputLabel>
								<Select
									value={mealPlanData.isPremium ? 'yes' : 'no'}
									label="Premium Plan"
									onChange={(e) => setMealPlanData({ ...mealPlanData, isPremium: e.target.value === 'yes' })}
								>
									<MenuItem value="no">Free</MenuItem>
									<MenuItem value="yes">Premium</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					</Grid>

					{mealPlanData.isPremium && (
						<TextField
							fullWidth
							type="number"
							label="Price"
							value={mealPlanData.price}
							onChange={(e) => setMealPlanData({ ...mealPlanData, price: parseFloat(e.target.value) || 0 })}
							sx={{ mt: 2 }}
							inputProps={{ min: 0, step: 0.01 }}
						/>
					)}
				</Box>

				{/* Macros */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Daily Macros (grams)
					</Typography>

					<Grid container spacing={2}>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								type="number"
								label="Protein (g) *"
								value={mealPlanData.macros?.protein}
								onChange={(e) =>
									setMealPlanData({
										...mealPlanData,
										macros: { ...mealPlanData.macros!, protein: parseFloat(e.target.value) || 0 },
									})
								}
								inputProps={{ min: 0 }}
								required
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								type="number"
								label="Carbs (g) *"
								value={mealPlanData.macros?.carbs}
								onChange={(e) =>
									setMealPlanData({
										...mealPlanData,
										macros: { ...mealPlanData.macros!, carbs: parseFloat(e.target.value) || 0 },
									})
								}
								inputProps={{ min: 0 }}
								required
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								fullWidth
								type="number"
								label="Fats (g) *"
								value={mealPlanData.macros?.fats}
								onChange={(e) =>
									setMealPlanData({
										...mealPlanData,
										macros: { ...mealPlanData.macros!, fats: parseFloat(e.target.value) || 0 },
									})
								}
								inputProps={{ min: 0 }}
								required
							/>
						</Grid>
					</Grid>
				</Box>

				{/* Add Meal */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Add Meal
					</Typography>

					<Card variant="outlined" sx={{ p: 2 }}>
						<Stack spacing={2}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={3}>
									<TextField
										fullWidth
										type="number"
										label="Day"
										value={currentMeal.day}
										onChange={(e) => setCurrentMeal({ ...currentMeal, day: parseInt(e.target.value) || 1 })}
										inputProps={{ min: 1, max: mealPlanData.duration || 7 }}
									/>
								</Grid>
								<Grid item xs={12} sm={3}>
									<FormControl fullWidth>
										<InputLabel>Meal Type *</InputLabel>
										<Select
											value={currentMeal.mealType}
											label="Meal Type *"
											onChange={(e) => setCurrentMeal({ ...currentMeal, mealType: e.target.value as MealType })}
										>
											{Object.values(MealType).map((type) => (
												<MenuItem key={type} value={type}>
													{formatEnumName(type)}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										fullWidth
										label="Meal Name *"
										value={currentMeal.mealName}
										onChange={(e) => setCurrentMeal({ ...currentMeal, mealName: e.target.value })}
										required
									/>
								</Grid>
							</Grid>

							<Grid container spacing={2}>
								<Grid item xs={12} sm={3}>
									<TextField
										fullWidth
										type="number"
										label="Calories *"
										value={currentMeal.calories}
										onChange={(e) => setCurrentMeal({ ...currentMeal, calories: parseFloat(e.target.value) || 0 })}
										inputProps={{ min: 0 }}
										required
									/>
								</Grid>
								<Grid item xs={12} sm={3}>
									<TextField
										fullWidth
										type="number"
										label="Protein (g)"
										value={currentMeal.protein}
										onChange={(e) => setCurrentMeal({ ...currentMeal, protein: parseFloat(e.target.value) || 0 })}
										inputProps={{ min: 0 }}
									/>
								</Grid>
								<Grid item xs={12} sm={3}>
									<TextField
										fullWidth
										type="number"
										label="Carbs (g)"
										value={currentMeal.carbs}
										onChange={(e) => setCurrentMeal({ ...currentMeal, carbs: parseFloat(e.target.value) || 0 })}
										inputProps={{ min: 0 }}
									/>
								</Grid>
								<Grid item xs={12} sm={3}>
									<TextField
										fullWidth
										type="number"
										label="Fats (g)"
										value={currentMeal.fats}
										onChange={(e) => setCurrentMeal({ ...currentMeal, fats: parseFloat(e.target.value) || 0 })}
										inputProps={{ min: 0 }}
									/>
								</Grid>
							</Grid>

							<Stack direction="row" spacing={1}>
								<TextField
									fullWidth
									placeholder="Add ingredient"
									value={currentIngredient}
									onChange={(e) => setCurrentIngredient(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === 'Enter') {
											addToArray('ingredients', currentIngredient);
										}
									}}
								/>
								<Button variant="outlined" startIcon={<AddIcon />} onClick={() => addToArray('ingredients', currentIngredient)}>
									Add
								</Button>
							</Stack>

							{currentMeal.ingredients && currentMeal.ingredients.length > 0 && (
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
									{currentMeal.ingredients.map((ingredient, index) => (
										<Chip
											key={index}
											label={ingredient}
											onDelete={() => removeFromArray('ingredients', index)}
											size="small"
										/>
									))}
								</Box>
							)}

							<Stack direction="row" spacing={1}>
								<TextField
									fullWidth
									placeholder="Add instruction step"
									value={currentInstruction}
									onChange={(e) => setCurrentInstruction(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === 'Enter') {
											addToArray('instructions', currentInstruction);
										}
									}}
								/>
								<Button variant="outlined" startIcon={<AddIcon />} onClick={() => addToArray('instructions', currentInstruction)}>
									Add
								</Button>
							</Stack>

							{currentMeal.instructions && Array.isArray(currentMeal.instructions) && currentMeal.instructions.length > 0 && (
								<Stack spacing={1}>
									{(currentMeal.instructions as string[]).map((instruction: string, index: number) => (
										<Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
											<Typography variant="body2" sx={{ flex: 1 }}>
												{index + 1}. {instruction}
											</Typography>
											<IconButton size="small" onClick={() => removeFromArray('instructions', index)}>
												<DeleteIcon fontSize="small" />
											</IconButton>
										</Box>
									))}
								</Stack>
							)}

							<Button variant="contained" startIcon={<AddIcon />} onClick={addMeal} fullWidth>
								Add Meal to Plan
							</Button>
						</Stack>
					</Card>
				</Box>

				{/* Meals List */}
				{mealPlanData.meals && mealPlanData.meals.length > 0 && (
					<Box className="form-section">
						<Typography variant="h5" sx={{ mb: 2 }}>
							Meals ({mealPlanData.meals.length} total)
						</Typography>

						{Array.from({ length: mealPlanData.duration || 7 }, (_, i) => i + 1).map((day) => {
							const dayMeals = getMealsByDay(day);
							if (dayMeals.length === 0) return null;

							return (
								<Card key={day} variant="outlined" sx={{ mb: 2 }}>
									<CardContent>
										<Typography variant="h6" sx={{ mb: 2 }}>
											Day {day}
										</Typography>
										<Stack spacing={2}>
											{dayMeals.map((meal, index) => {
												const mealIndex = mealPlanData.meals!.findIndex((m) => m === meal);
												return (
													<Box key={index}>
														<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
															<Box sx={{ flex: 1 }}>
																<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
																	{formatEnumName(meal.mealType)}: {meal.mealName}
																</Typography>
																<Typography variant="body2" color="text.secondary">
																	{meal.calories} cal | P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g
																</Typography>
																{meal.ingredients && meal.ingredients.length > 0 && (
																	<Box sx={{ mt: 1 }}>
																		<Typography variant="caption" color="text.secondary">
																			Ingredients: {meal.ingredients.join(', ')}
																		</Typography>
																	</Box>
																)}
															</Box>
															<IconButton size="small" onClick={() => removeMeal(mealIndex)} color="error">
																<DeleteIcon />
															</IconButton>
														</Stack>
														{index < dayMeals.length - 1 && <Divider sx={{ mt: 2 }} />}
													</Box>
												);
											})}
										</Stack>
									</CardContent>
								</Card>
							);
						})}
					</Box>
				)}

				{/* Submit Button */}
				<Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
					<Button variant="outlined" onClick={() => router.back()} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button variant="contained" onClick={handleSubmit} disabled={isSubmitting} size="large">
						{isSubmitting ? 'Creating...' : 'Create Meal Plan'}
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(CreateMealPlanPage);


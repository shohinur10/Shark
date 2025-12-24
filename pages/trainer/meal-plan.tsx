import React, { useState, useCallback, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Alert, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useReactiveVar } from '@apollo/client';
import { CREATE_MEAL_PLAN } from '../../apollo/user/mutation';
import { MealPlanInput, MealInput, MacrosInput } from '../../libs/types/mealplan/mealplan.input';
import { NutritionGoal, MealPlanStatus, DietaryPreference, MealType } from '../../libs/enums/nutrition.enum';
import { userVar } from '../../apollo/store';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../libs/sweetAlert';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CreateMealPlanPage: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	const [mealPlanData, setMealPlanData] = useState<MealPlanInput>({
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

	const [currentIngredient, setCurrentIngredient] = useState<{ day: number; mealIndex: number; value: string } | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	const [createMealPlan] = useMutation(CREATE_MEAL_PLAN);

	// Check if user is trainer
	useEffect(() => {
		if (user?.memberType !== 'TRAINER' && user?.memberType !== 'ADMIN') {
			router.push('/nutrition/meal-plans');
		}
	}, [user, router]);

	// Initialize meals based on duration
	useEffect(() => {
		setMealPlanData((prev) => {
			const days = prev.duration;
			const calorieTarget = prev.calorieTarget;
			const macros = prev.macros;
			const existingDays = new Set(prev.meals.map(m => m.day));
			const newMeals: MealInput[] = [];

			for (let day = 1; day <= days; day++) {
				if (!existingDays.has(day)) {
					// Default meals per day
					[MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER].forEach(mealType => {
						newMeals.push({
							day,
							mealType,
							mealName: `${mealType} - Day ${day}`,
							ingredients: [],
							instructions: '',
							calories: Math.floor(calorieTarget / 3),
							protein: Math.floor(macros.protein / 3),
							carbs: Math.floor(macros.carbs / 3),
							fats: Math.floor(macros.fats / 3),
						});
					});
				}
			}
			if (newMeals.length > 0) {
				return {
					...prev,
					meals: [...prev.meals, ...newMeals].sort((a, b) => {
						if (a.day !== b.day) return a.day - b.day;
						const order = [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER, MealType.SNACK, MealType.PRE_WORKOUT, MealType.POST_WORKOUT];
						return order.indexOf(a.mealType) - order.indexOf(b.mealType);
					}),
				};
			}
			return prev;
		});
	}, [mealPlanData.duration, mealPlanData.calorieTarget, mealPlanData.macros.protein, mealPlanData.macros.carbs, mealPlanData.macros.fats]);

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

	const updateMeal = (day: number, mealIndex: number, updates: Partial<MealInput>) => {
		const meals = mealPlanData.meals.map((meal, idx) => {
			if (meal.day === day) {
				const dayMeals = mealPlanData.meals.filter(m => m.day === day);
				const actualIndex = dayMeals.findIndex(m => m === meal);
				if (actualIndex === mealIndex) {
					return { ...meal, ...updates };
				}
			}
			return meal;
		});
		setMealPlanData({ ...mealPlanData, meals });
	};

	const addIngredientToMeal = (day: number, mealIndex: number, ingredient: string) => {
		if (!ingredient.trim()) return;
		const meals = mealPlanData.meals.map((meal, idx) => {
			if (meal.day === day) {
                const dayMeals = mealPlanData.meals.filter(m => m.day === day);
				const actualIndex = dayMeals.findIndex(m => m === meal);
				if (actualIndex === mealIndex) {
					return {
						...meal,
						ingredients: [...(meal.ingredients || []), ingredient.trim()],
					};
				}
			}
			return meal;
		});
		setMealPlanData({ ...mealPlanData, meals });
		setCurrentIngredient(null);
	};

	const removeIngredientFromMeal = (day: number, mealIndex: number, ingredientIndex: number) => {
		const meals = mealPlanData.meals.map((meal) => {
			if (meal.day === day) {
				const dayMeals = mealPlanData.meals.filter(m => m.day === day);
				const actualIndex = dayMeals.findIndex(m => m === meal);
				if (actualIndex === mealIndex) {
					return {
						...meal,
						ingredients: (meal.ingredients || []).filter((_, i) => i !== ingredientIndex),
					};
				}
			}
			return meal;
		});
		setMealPlanData({ ...mealPlanData, meals });
	};

	const addMealToDay = (day: number, mealType: MealType) => {
		const dayMeals = mealPlanData.meals.filter(m => m.day === day);
		const caloriesPerMeal = Math.floor(mealPlanData.calorieTarget / (dayMeals.length + 1));
		
		const newMeal: MealInput = {
			day,
			mealType,
			mealName: `${mealType} - Day ${day}`,
			ingredients: [],
			instructions: '',
			calories: caloriesPerMeal,
			protein: Math.floor(mealPlanData.macros.protein / (dayMeals.length + 1)),
			carbs: Math.floor(mealPlanData.macros.carbs / (dayMeals.length + 1)),
			fats: Math.floor(mealPlanData.macros.fats / (dayMeals.length + 1)),
		};
        const allMeals = [...mealPlanData.meals, newMeal].sort((a, b) => {
			if (a.day !== b.day) return a.day - b.day;
			const order = [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER, MealType.SNACK, MealType.PRE_WORKOUT, MealType.POST_WORKOUT];
			return order.indexOf(a.mealType) - order.indexOf(b.mealType);
		});

		setMealPlanData({ ...mealPlanData, meals: allMeals });
	};

	const removeMealFromDay = (day: number, mealIndex: number) => {
		const meals = mealPlanData.meals.filter((meal, idx) => {
			if (meal.day === day) {
				const dayMeals = mealPlanData.meals.filter(m => m.day === day);
				const actualIndex = dayMeals.findIndex(m => m === meal);
				return actualIndex !== mealIndex;
			}
			return true;
		});
		setMealPlanData({ ...mealPlanData, meals });
	};

	const validateForm = (): boolean => {
		if (!mealPlanData.mealPlanTitle.trim()) {
			setError('Meal plan title is required');
			return false;
		}
		if (!mealPlanData.mealPlanDesc?.trim()) {
			setError('Meal plan description is required');
			return false;
		}
		if (mealPlanData.meals.length === 0) {
			setError('At least one meal is required');
			return false;
		}
		if (mealPlanData.isPremium && (!mealPlanData.price || mealPlanData.price <= 0)) {
			setError('Premium meal plans must have a price');
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
				mealPlanTitle: mealPlanData.mealPlanTitle.trim(),
				mealPlanStatus: mealPlanData.mealPlanStatus || MealPlanStatus.DRAFT,
				mealPlanDesc: mealPlanData.mealPlanDesc?.trim() || '',
				nutritionGoal: mealPlanData.nutritionGoal,
				dietaryPreference: mealPlanData.dietaryPreference || [],
				duration: mealPlanData.duration,
				calorieTarget: mealPlanData.calorieTarget,
				macros: mealPlanData.macros,
				meals: mealPlanData.meals,
				isPremium: mealPlanData.isPremium || false,
				price: mealPlanData.price || 0,
			};

			const result = await createMealPlan({
				variables: { input },
			});

			await sweetMixinSuccessAlert('Meal plan created successfully!');
			router.push(`/nutrition/meal-plans/${result.data?.createMealPlan?._id || ''}`);
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

	const getDayMeals = (day: number): MealInput[] => {
		return mealPlanData.meals.filter(m => m.day === day);
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
					Design a comprehensive nutrition plan for your clients
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

						<Stack direction="row" spacing={2}>
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

							<TextField
								fullWidth
								type="number"
								label="Duration (days) *"
								value={mealPlanData.duration}
								onChange={(e) => setMealPlanData({ ...mealPlanData, duration: parseInt(e.target.value) || 7 })}
								inputProps={{ min: 1, max: 90 }}
								required
							/>

							<TextField
								fullWidth
								type="number"
								label="Calorie Target *"
								value={mealPlanData.calorieTarget}
								onChange={(e) => setMealPlanData({ ...mealPlanData, calorieTarget: parseInt(e.target.value) || 2000 })}
								inputProps={{ min: 1000, max: 5000 }}
								required
							/>
						</Stack>

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

				{/* Macros */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Macronutrient Targets (grams per day)
					</Typography>
					<Stack direction="row" spacing={2}>
						<TextField
							fullWidth
							type="number"
							label="Protein (g)"
							value={mealPlanData.macros.protein}
							onChange={(e) => setMealPlanData({
								...mealPlanData,
								macros: { ...mealPlanData.macros, protein: parseInt(e.target.value) || 0 },
							})}
							inputProps={{ min: 0 }}
						/>
						<TextField
							fullWidth
							type="number"
							label="Carbs (g)"
							value={mealPlanData.macros.carbs}
							onChange={(e) => setMealPlanData({
								...mealPlanData,
								macros: { ...mealPlanData.macros, carbs: parseInt(e.target.value) || 0 },
							})}
							inputProps={{ min: 0 }}
						/>
						<TextField
							fullWidth
							type="number"
							label="Fats (g)"
							value={mealPlanData.macros.fats}
							onChange={(e) => setMealPlanData({
								...mealPlanData,
								macros: { ...mealPlanData.macros, fats: parseInt(e.target.value) || 0 },
							})}
                            inputProps={{ min: 0 }}
						/>
					</Stack>
				</Box>

				{/* Premium Options */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Premium Options
					</Typography>
					<Stack spacing={2}>
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

						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<FormControl>
								<Select
									value={mealPlanData.isPremium ? 'premium' : 'free'}
									onChange={(e) => setMealPlanData({
										...mealPlanData,
										isPremium: e.target.value === 'premium',
										price: e.target.value === 'premium' ? mealPlanData.price : 0,
									})}
								>
									<MenuItem value="free">Free</MenuItem>
									<MenuItem value="premium">Premium</MenuItem>
								</Select>
							</FormControl>
							{mealPlanData.isPremium && (
								<TextField
									type="number"
									label="Price ($)"
									value={mealPlanData.price}
									onChange={(e) => setMealPlanData({ ...mealPlanData, price: parseFloat(e.target.value) || 0 })}
									inputProps={{ min: 0, step: 0.01 }}
                                    />
							)}
						</Box>
					</Stack>
				</Box>

				{/* Meals by Day */}
				<Box className="form-section">
					<Typography variant="h5" sx={{ mb: 2 }}>
						Meals
					</Typography>
					<Stack spacing={2}>
						{Array.from({ length: mealPlanData.duration }, (_, dayIndex) => {
							const day = dayIndex + 1;
							const dayMeals = getDayMeals(day);
							return (
								<Accordion key={day} defaultExpanded={day === 1}>
									<AccordionSummary expandIcon={<ExpandMoreIcon />}>
										<Typography variant="h6">Day {day}</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Stack spacing={3}>
											{dayMeals.map((meal, mealIndex) => (
												<Box key={mealIndex} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
													<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
														<Typography variant="h6">{formatEnumName(meal.mealType)}</Typography>
														<IconButton size="small" onClick={() => removeMealFromDay(day, mealIndex)} color="error">
															<DeleteIcon />
														</IconButton>
													</Stack>

													<Stack spacing={2}>
														<TextField
															fullWidth
															label="Meal Name"
															value={meal.mealName}
															onChange={(e) => updateMeal(day, mealIndex, { mealName: e.target.value })}
														/>

														<Grid container spacing={2}>
															<Grid item xs={3}>
																<TextField
																	fullWidth
																	type="number"
																	label="Calories"
																	value={meal.calories}
                                                                    onChange={(e) => updateMeal(day, mealIndex, { calories: parseInt(e.target.value) || 0 })}
																/>
															</Grid>
															<Grid item xs={3}>
																<TextField
																	fullWidth
																	type="number"
																	label="Protein (g)"
																	value={meal.protein}
																	onChange={(e) => updateMeal(day, mealIndex, { protein: parseInt(e.target.value) || 0 })}
																/>
															</Grid>
															<Grid item xs={3}>
																<TextField
																	fullWidth
																	type="number"
																	label="Carbs (g)"
																	value={meal.carbs}
																	onChange={(e) => updateMeal(day, mealIndex, { carbs: parseInt(e.target.value) || 0 })}
																/>
															</Grid>
															<Grid item xs={3}>
																<TextField
																	fullWidth
																	type="number"
																	label="Fats (g)"
																	value={meal.fats}
																	onChange={(e) => updateMeal(day, mealIndex, { fats: parseInt(e.target.value) || 0 })}
																/>
															</Grid>
														</Grid>

														{/* Ingredients */}
														<Box>
															<Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
																Ingredients
															</Typography>
															<Stack direction="row" spacing={1} sx={{ mb: 1 }}>
																<TextField
																	fullWidth
																	size="small"
																	placeholder="Add ingredient"
																	value={currentIngredient?.day === day && currentIngredient?.mealIndex === mealIndex ? currentIngredient.value : ''}
																	onChange={(e) => setCurrentIngredient({ day, mealIndex, value: e.target.value })}
																	onKeyPress={(e) => {
																		if (e.key === 'Enter') {
																			addIngredientToMeal(day, mealIndex, currentIngredient?.value || '');
																		}
																	}}
																/>
																<Button
																	variant="outlined"
																	size="small"
																	startIcon={<AddIcon />}
																	onClick={() => {
																		if (currentIngredient?.day === day && currentIngredient?.mealIndex === mealIndex) {
																			addIngredientToMeal(day, mealIndex, currentIngredient.value);
																		}
																	}}
																>
																	Add
																</Button>
															</Stack>
															<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
																{(meal.ingredients || []).map((ingredient, ingredientIndex) => (
																	<Chip
																		key={ingredientIndex}
																		label={ingredient}
																		onDelete={() => removeIngredientFromMeal(day, mealIndex, ingredientIndex)}
																		size="small"
																	/>
																))}
															</Box>
														</Box>

														{/* Instructions */}
														<TextField
															fullWidth
															multiline
															rows={3}
															label="Instructions"
															value={meal.instructions || ''}
															onChange={(e) => updateMeal(day, mealIndex, { 
																instructions: e.target.value
															})}
															placeholder="Enter instructions"
														/>
													</Stack>
												</Box>
											))}

											{/* Add Meal Button */}
											<Button
												variant="outlined"
												startIcon={<AddIcon />}
												onClick={() => {
													const availableTypes = Object.values(MealType).filter(
														type => !getDayMeals(day).some(m => m.mealType === type)
													);
													if (availableTypes.length > 0) {
														addMealToDay(day, availableTypes[0]);
													}
												}}
											>
												Add Meal
											</Button>
										</Stack>
									</AccordionDetails>
								</Accordion>
							);
						})}
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
						{isSubmitting ? 'Creating...' : 'Create Meal Plan'}
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(CreateMealPlanPage); 
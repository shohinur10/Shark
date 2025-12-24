import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, FormLabel, Divider, Alert, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MacroGuidePage: NextPage = () => {
	const device = useDeviceDetect();
	const [inputs, setInputs] = useState({
		calories: '',
		goal: 'maintenance',
		proteinRatio: 30,
		carbsRatio: 40,
		fatsRatio: 30,
	});

	const [calculatedMacros, setCalculatedMacros] = useState<{
		protein: number;
		carbs: number;
		fats: number;
		proteinCal: number;
		carbsCal: number;
		fatsCal: number;
	} | null>(null);

	// Calculate Macros
	const calculateMacros = () => {
		const calories = parseFloat(inputs.calories);
		if (!calories || calories <= 0 || calories > 10000) {
			alert('Please enter a valid calorie target between 1 and 10000');
			return;
		}

		// Validate ratios sum to 100
		const totalRatio = inputs.proteinRatio + inputs.carbsRatio + inputs.fatsRatio;
		if (Math.abs(totalRatio - 100) > 0.1) {
			alert('Macro ratios must sum to 100%');
			return;
		}

		// Calculate macros (1g protein = 4 cal, 1g carbs = 4 cal, 1g fats = 9 cal)
		const proteinCalories = (calories * inputs.proteinRatio) / 100;
		const carbsCalories = (calories * inputs.carbsRatio) / 100;
		const fatsCalories = (calories * inputs.fatsRatio) / 100;

		const protein = Math.round(proteinCalories / 4);
		const carbs = Math.round(carbsCalories / 4);
		const fats = Math.round(fatsCalories / 9);

		setCalculatedMacros({
			protein,
			carbs,
			fats,
			proteinCal: Math.round(proteinCalories),
			carbsCal: Math.round(carbsCalories),
			fatsCal: Math.round(fatsCalories),
		});
	};

	// Preset macro ratios for common goals
	const presetMacros: { [key: string]: { protein: number; carbs: number; fats: number; name: string } } = {
		weightLoss: { protein: 40, carbs: 30, fats: 30, name: 'Weight Loss (High Protein)' },
		maintenance: { protein: 30, carbs: 40, fats: 30, name: 'Balanced (Maintenance)' },
		muscleGain: { protein: 35, carbs: 40, fats: 25, name: 'Muscle Gain' },
		keto: { protein: 25, carbs: 5, fats: 70, name: 'Ketogenic (Keto)' },
		highCarb: { protein: 20, carbs: 60, fats: 20, name: 'High Carb' },
		custom: { protein: inputs.proteinRatio, carbs: inputs.carbsRatio, fats: inputs.fatsRatio, name: 'Custom' },
	};

	const applyPreset = (preset: string) => {
		if (preset === 'custom') return;
		const presetValues = presetMacros[preset];
		setInputs({
			...inputs,
			proteinRatio: presetValues.protein,
			carbsRatio: presetValues.carbs,
			fatsRatio: presetValues.fats,
		});
	};

	if (device === 'mobile') {
		return (
			<Stack className={'macro-guide-page'}>
				<Stack className={'container'}>
					<Typography variant="h4" className={'page-title'} sx={{ mb: 3 }}>
						Macro Guide
					</Typography>

					<Card sx={{ mb: 3 }}>
						<CardContent>
							<Stack spacing={3}>
								<TextField
									fullWidth
									label="Daily Calorie Target"
									type="number"
									value={inputs.calories}
									onChange={(e) => setInputs({ ...inputs, calories: e.target.value })}
									variant="outlined"
									helperText="Enter your daily calorie target from the calorie calculator"
								/>

								<FormControl component="fieldset">
									<FormLabel component="legend">Goal</FormLabel>
									<RadioGroup
										value={inputs.goal}
										onChange={(e) => {
											const goal = e.target.value;
											applyPreset(goal);
											setInputs({ ...inputs, goal });
										}}
									>
										<FormControlLabel value="weightLoss" control={<Radio />} label="Weight Loss" />
										<FormControlLabel value="maintenance" control={<Radio />} label="Maintenance" />
										<FormControlLabel value="muscleGain" control={<Radio />} label="Muscle Gain" />
									</RadioGroup>
								</FormControl>

								<Grid container spacing={2}>
									<Grid item xs={4}>
										<TextField
											fullWidth
											label="Protein %"
											type="number"
											value={inputs.proteinRatio}
											onChange={(e) => {
												const val = parseFloat(e.target.value);
												if (!isNaN(val) && val >= 0 && val <= 100) {
													setInputs({ ...inputs, proteinRatio: val });
												}
											}}
											variant="outlined"
											size="small"
										/>
									</Grid>
									<Grid item xs={4}>
										<TextField
											fullWidth
											label="Carbs %"
											type="number"
											value={inputs.carbsRatio}
											onChange={(e) => {
												const val = parseFloat(e.target.value);
												if (!isNaN(val) && val >= 0 && val <= 100) {
													setInputs({ ...inputs, carbsRatio: val });
												}
											}}
											variant="outlined"
											size="small"
										/>
									</Grid>
									<Grid item xs={4}>
										<TextField
											fullWidth
											label="Fats %"
											type="number"
											value={inputs.fatsRatio}
											onChange={(e) => {
												const val = parseFloat(e.target.value);
												if (!isNaN(val) && val >= 0 && val <= 100) {
													setInputs({ ...inputs, fatsRatio: val });
												}
											}}
											variant="outlined"
											size="small"
										/>
									</Grid>
								</Grid>

								<Typography variant="caption" color={Math.abs(inputs.proteinRatio + inputs.carbsRatio + inputs.fatsRatio - 100) > 0.1 ? 'error' : 'text.secondary'}>
									Total: {inputs.proteinRatio + inputs.carbsRatio + inputs.fatsRatio}% (must equal 100%)
								</Typography>

								<Button
									variant="contained"
									fullWidth
									size="large"
									onClick={calculateMacros}
									startIcon={<CalculateIcon />}
									sx={{ mt: 2 }}
								>
									Calculate Macros
								</Button>
							</Stack>
						</CardContent>
					</Card>

					{calculatedMacros && (
						<Card>
							<CardContent>
								<Typography variant="h5" gutterBottom>
									Your Daily Macro Targets
								</Typography>
								<Stack spacing={2}>
									<Box>
										<Typography variant="h4">{calculatedMacros.protein}g</Typography>
										<Typography variant="body2" color="text.secondary">
											Protein ({inputs.proteinRatio}%)
										</Typography>
									</Box>
									<Box>
										<Typography variant="h4">{calculatedMacros.carbs}g</Typography>
										<Typography variant="body2" color="text.secondary">
											Carbs ({inputs.carbsRatio}%)
										</Typography>
									</Box>
									<Box>
										<Typography variant="h4">{calculatedMacros.fats}g</Typography>
										<Typography variant="body2" color="text.secondary">
											Fats ({inputs.fatsRatio}%)
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					)}
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'macro-guide-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'} sx={{ mb: 4 }}>
						<Typography variant="h2" className={'page-title'}>
							Macro Guide & Calculator
						</Typography>
						<Typography variant="h6" className={'page-subtitle'}>
							Calculate your optimal macronutrient breakdown based on your calorie target and fitness goals
						</Typography>
					</Stack>

					<Grid container spacing={4}>
						{/* Calculator Section */}
						<Grid item xs={12} md={6}>
							<Card>
								<CardContent>
									<Stack direction="row" alignItems="center" spacing={1} mb={3}>
										<CalculateIcon color="primary" />
										<Typography variant="h5" className={'section-title'}>
											Macro Calculator
										</Typography>
									</Stack>

									<Stack spacing={3}>
										<TextField
											fullWidth
											label="Daily Calorie Target"
											type="number"
											value={inputs.calories}
											onChange={(e) => setInputs({ ...inputs, calories: e.target.value })}
											variant="outlined"
											helperText="Enter your daily calorie target from the calorie calculator"
											required
										/>

										<FormControl component="fieldset">
											<FormLabel component="legend">Preset Macro Ratios</FormLabel>
											<RadioGroup
												value={inputs.goal}
												onChange={(e) => {
													const goal = e.target.value;
													applyPreset(goal);
													setInputs({ ...inputs, goal });
												}}
											>
												<FormControlLabel
													value="weightLoss"
													control={<Radio />}
													label="Weight Loss (40% Protein, 30% Carbs, 30% Fats)"
												/>
												<FormControlLabel
													value="maintenance"
													control={<Radio />}
													label="Balanced/Maintenance (30% Protein, 40% Carbs, 30% Fats)"
												/>
												<FormControlLabel
													value="muscleGain"
													control={<Radio />}
													label="Muscle Gain (35% Protein, 40% Carbs, 25% Fats)"
												/>
											</RadioGroup>
										</FormControl>

										<Box>
											<Typography variant="body2" gutterBottom>
												Custom Macro Ratios (%)
											</Typography>
											<Grid container spacing={2}>
												<Grid item xs={4}>
													<TextField
														fullWidth
														label="Protein"
														type="number"
														value={inputs.proteinRatio}
														onChange={(e) => {
															const val = parseFloat(e.target.value);
															if (!isNaN(val) && val >= 0 && val <= 100) {
																setInputs({ ...inputs, proteinRatio: val });
															}
														}}
														variant="outlined"
														size="small"
													/>
												</Grid>
												<Grid item xs={4}>
													<TextField
														fullWidth
														label="Carbs"
														type="number"
														value={inputs.carbsRatio}
														onChange={(e) => {
															const val = parseFloat(e.target.value);
															if (!isNaN(val) && val >= 0 && val <= 100) {
																setInputs({ ...inputs, carbsRatio: val });
															}
														}}
														variant="outlined"
														size="small"
													/>
												</Grid>
												<Grid item xs={4}>
													<TextField
														fullWidth
														label="Fats"
														type="number"
														value={inputs.fatsRatio}
														onChange={(e) => {
															const val = parseFloat(e.target.value);
															if (!isNaN(val) && val >= 0 && val <= 100) {
																setInputs({ ...inputs, fatsRatio: val });
															}
														}}
														variant="outlined"
														size="small"
													/>
												</Grid>
											</Grid>
											<Typography
												variant="caption"
												color={Math.abs(inputs.proteinRatio + inputs.carbsRatio + inputs.fatsRatio - 100) > 0.1 ? 'error' : 'text.secondary'}
												sx={{ mt: 1, display: 'block' }}
											>
												Total: {inputs.proteinRatio + inputs.carbsRatio + inputs.fatsRatio}% (must equal 100%)
											</Typography>
										</Box>

										<Button
											variant="contained"
											fullWidth
											size="large"
											onClick={calculateMacros}
											startIcon={<CalculateIcon />}
											sx={{ mt: 2, py: 1.5 }}
										>
											Calculate Macros
										</Button>
									</Stack>
								</CardContent>
							</Card>
						</Grid>

						{/* Results Section */}
						<Grid item xs={12} md={6}>
							{calculatedMacros ? (
								<Card sx={{ position: 'sticky', top: 100 }}>
									<CardContent>
										<Stack spacing={3}>
											<Box>
												<Typography variant="h5" gutterBottom>
													Your Daily Macro Targets
												</Typography>
											</Box>

											{/* Protein */}
											<Card variant="outlined" sx={{ backgroundColor: '#e3f2fd' }}>
												<CardContent>
													<Stack direction="row" justifyContent="space-between" alignItems="center">
														<Box>
															<Stack direction="row" alignItems="center" spacing={1}>
																<RestaurantIcon color="primary" />
																<Typography variant="h6">Protein</Typography>
															</Stack>
															<Typography variant="caption" color="text.secondary">
																{inputs.proteinRatio}% of calories
															</Typography>
														</Box>
														<Box textAlign="right">
															<Typography variant="h4">{calculatedMacros.protein}g</Typography>
															<Typography variant="caption" color="text.secondary">
																{calculatedMacros.proteinCal} cal
															</Typography>
														</Box>
													</Stack>
												</CardContent>
											</Card>

											{/* Carbs */}
											<Card variant="outlined" sx={{ backgroundColor: '#fff3e0' }}>
												<CardContent>
													<Stack direction="row" justifyContent="space-between" alignItems="center">
														<Box>
															<Stack direction="row" alignItems="center" spacing={1}>
																<LocalFireDepartmentIcon sx={{ color: '#ff6b35' }} />
																<Typography variant="h6">Carbohydrates</Typography>
															</Stack>
															<Typography variant="caption" color="text.secondary">
																{inputs.carbsRatio}% of calories
															</Typography>
														</Box>
														<Box textAlign="right">
															<Typography variant="h4">{calculatedMacros.carbs}g</Typography>
															<Typography variant="caption" color="text.secondary">
																{calculatedMacros.carbsCal} cal
															</Typography>
														</Box>
													</Stack>
												</CardContent>
											</Card>

											{/* Fats */}
											<Card variant="outlined" sx={{ backgroundColor: '#f3e5f5' }}>
												<CardContent>
													<Stack direction="row" justifyContent="space-between" alignItems="center">
														<Box>
															<Typography variant="h6">Fats</Typography>
															<Typography variant="caption" color="text.secondary">
																{inputs.fatsRatio}% of calories
															</Typography>
														</Box>
														<Box textAlign="right">
															<Typography variant="h4">{calculatedMacros.fats}g</Typography>
															<Typography variant="caption" color="text.secondary">
																{calculatedMacros.fatsCal} cal
															</Typography>
														</Box>
													</Stack>
												</CardContent>
											</Card>

											<Divider />

											<Box>
												<Typography variant="body2" color="text.secondary" align="center">
													Total: {calculatedMacros.proteinCal + calculatedMacros.carbsCal + calculatedMacros.fatsCal} calories
												</Typography>
											</Box>
										</Stack>
									</CardContent>
								</Card>
							) : (
								<Card>
									<CardContent>
										<Box textAlign="center" py={4}>
											<CalculateIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
											<Typography variant="h6" color="text.secondary" gutterBottom>
												Your Results Will Appear Here
											</Typography>
											<Typography variant="body2" color="text.secondary">
												Enter your calorie target and macro ratios, then click "Calculate Macros" to see your daily macro breakdown.
											</Typography>
										</Box>
									</CardContent>
								</Card>
							)}
						</Grid>
					</Grid>

					{/* Macro Guide Information */}
					<Box sx={{ mt: 6 }}>
						<Typography variant="h4" gutterBottom>
							Macronutrient Guide
						</Typography>
						<Grid container spacing={3} mt={1}>
							<Grid item xs={12} md={4}>
								<Accordion>
									<AccordionSummary expandIcon={<ExpandMoreIcon />}>
										<Stack direction="row" alignItems="center" spacing={1}>
											<RestaurantIcon color="primary" />
											<Typography variant="h6">Protein</Typography>
										</Stack>
									</AccordionSummary>
									<AccordionDetails>
										<Stack spacing={2}>
											<Typography variant="body2">
												<strong>Calories per gram:</strong> 4 calories
											</Typography>
											<Typography variant="body2">
												<strong>Role:</strong> Essential for muscle repair, growth, and maintenance. Also supports immune function and hormone production.
											</Typography>
											<Typography variant="body2">
												<strong>Recommended intake:</strong> 0.8-2.2g per kg of body weight depending on activity level and goals.
											</Typography>
											<Typography variant="body2">
												<strong>Best sources:</strong> Chicken, fish, eggs, lean beef, Greek yogurt, legumes, protein powder.
											</Typography>
										</Stack>
									</AccordionDetails>
								</Accordion>
							</Grid>

							<Grid item xs={12} md={4}>
								<Accordion>
									<AccordionSummary expandIcon={<ExpandMoreIcon />}>
										<Stack direction="row" alignItems="center" spacing={1}>
											<LocalFireDepartmentIcon sx={{ color: '#ff6b35' }} />
											<Typography variant="h6">Carbohydrates</Typography>
										</Stack>
									</AccordionSummary>
									<AccordionDetails>
										<Stack spacing={2}>
											<Typography variant="body2">
												<strong>Calories per gram:</strong> 4 calories
											</Typography>
											<Typography variant="body2">
												<strong>Role:</strong> Primary energy source for your body and brain. Essential for high-intensity workouts and recovery.
											</Typography>
											<Typography variant="body2">
												<strong>Recommended intake:</strong> 3-7g per kg of body weight depending on activity level and goals.
											</Typography>
											<Typography variant="body2">
												<strong>Best sources:</strong> Oats, brown rice, sweet potatoes, quinoa, fruits, vegetables, whole grains.
											</Typography>
										</Stack>
									</AccordionDetails>
								</Accordion>
							</Grid>

							<Grid item xs={12} md={4}>
								<Accordion>
									<AccordionSummary expandIcon={<ExpandMoreIcon />}>
										<Typography variant="h6">Fats</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Stack spacing={2}>
											<Typography variant="body2">
												<strong>Calories per gram:</strong> 9 calories
											</Typography>
											<Typography variant="body2">
												<strong>Role:</strong> Essential for hormone production, vitamin absorption, brain health, and long-term energy storage.
											</Typography>
											<Typography variant="body2">
												<strong>Recommended intake:</strong> 0.5-1.5g per kg of body weight (20-35% of total calories).
											</Typography>
											<Typography variant="body2">
												<strong>Best sources:</strong> Avocado, nuts, seeds, olive oil, fatty fish, egg yolks, nut butter.
											</Typography>
										</Stack>
									</AccordionDetails>
								</Accordion>
							</Grid>
						</Grid>
					</Box>

					{/* Tips Section */}
					<Box sx={{ mt: 4 }}>
						<Card>
							<CardContent>
								<Typography variant="h5" gutterBottom>
									<InfoIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
									Macro Tracking Tips
								</Typography>
								<Grid container spacing={3} mt={1}>
									<Grid item xs={12} md={6}>
										<Typography variant="body1" fontWeight={600} gutterBottom>
											✓ Start with protein
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Prioritize hitting your protein target first, as it's crucial for muscle maintenance and satiety.
										</Typography>
									</Grid>
									<Grid item xs={12} md={6}>
										<Typography variant="body1" fontWeight={600} gutterBottom>
											✓ Track consistently
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Use a food tracking app to log your meals and stay within your macro targets.
										</Typography>
									</Grid>
									<Grid item xs={12} md={6}>
										<Typography variant="body1" fontWeight={600} gutterBottom>
											✓ Adjust based on results
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Monitor your progress weekly and adjust macros if you're not seeing desired results.
										</Typography>
									</Grid>
									<Grid item xs={12} md={6}>
										<Typography variant="body1" fontWeight={600} gutterBottom>
											✓ Focus on whole foods
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Get most of your macros from nutrient-dense whole foods rather than processed options.
										</Typography>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(MacroGuidePage);









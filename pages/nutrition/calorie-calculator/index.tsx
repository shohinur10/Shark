import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, FormLabel, Divider, Alert, Chip } from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoIcon from '@mui/icons-material/Info';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CalorieCalculatorPage: NextPage = () => {
	const device = useDeviceDetect();
	const [inputs, setInputs] = useState({
		age: '',
		gender: 'male',
		weight: '',
		height: '',
		activityLevel: 'moderate',
		goal: 'maintenance',
	});

	const [calculatedCalories, setCalculatedCalories] = useState<{
		bmr: number;
		tdee: number;
		weightLoss: number;
		maintenance: number;
		muscleGain: number;
	} | null>(null);

	// Calculate Daily Calorie Needs (Mifflin-St Jeor Equation)
	const calculateCalories = () => {
		const age = parseFloat(inputs.age);
		const weight = parseFloat(inputs.weight);
		const height = parseFloat(inputs.height);

		if (!age || !weight || !height || age <= 0 || weight <= 0 || height <= 0) {
			alert('Please fill in all fields with valid numbers');
			return;
		}

		if (age < 10 || age > 100) {
			alert('Please enter a valid age between 10 and 100');
			return;
		}

		if (weight < 30 || weight > 300) {
			alert('Please enter a valid weight between 30kg and 300kg');
			return;
		}

		if (height < 100 || height > 250) {
			alert('Please enter a valid height between 100cm and 250cm');
			return;
		}

		// BMR Calculation (Mifflin-St Jeor Equation)
		// BMR (men) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
		// BMR (women) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161
		let bmr = 10 * weight + 6.25 * height - 5 * age;
		if (inputs.gender === 'male') {
			bmr += 5;
		} else {
			bmr -= 161;
		}

		// Activity Multipliers
		const activityMultipliers: { [key: string]: number } = {
			sedentary: 1.2, // Little or no exercise
			light: 1.375, // Light exercise 1-3 days/week
			moderate: 1.55, // Moderate exercise 3-5 days/week
			active: 1.725, // Hard exercise 6-7 days/week
			veryActive: 1.9, // Very hard exercise, physical job
		};

		const tdee = bmr * activityMultipliers[inputs.activityLevel];

		// Goal Adjustments
		const goalAdjustments: { [key: string]: number } = {
			weightLoss: -500, // 1 lb per week
			extremeWeightLoss: -1000, // 2 lbs per week (max safe)
			maintenance: 0,
			muscleGain: 300, // Moderate muscle gain
			aggressiveGain: 500, // Aggressive muscle gain
		};

		setCalculatedCalories({
			bmr: Math.round(bmr),
			tdee: Math.round(tdee),
			weightLoss: Math.round(tdee + goalAdjustments.weightLoss),
			maintenance: Math.round(tdee),
			muscleGain: Math.round(tdee + goalAdjustments.muscleGain),
		});
	};

	const getActivityDescription = (level: string) => {
		const descriptions: { [key: string]: string } = {
			sedentary: 'Little or no exercise, desk job',
			light: 'Light exercise 1-3 days/week',
			moderate: 'Moderate exercise 3-5 days/week',
			active: 'Hard exercise 6-7 days/week',
			veryActive: 'Very hard exercise, physical job, training 2x/day',
		};
		return descriptions[level] || '';
	};

	const getGoalDescription = (goal: string) => {
		const descriptions: { [key: string]: string } = {
			weightLoss: 'Lose 0.5kg (1lb) per week',
			extremeWeightLoss: 'Lose 1kg (2lbs) per week (max safe)',
			maintenance: 'Maintain current weight',
			muscleGain: 'Gain muscle gradually',
			aggressiveGain: 'Gain muscle aggressively',
		};
		return descriptions[goal] || '';
	};

	if (device === 'mobile') {
		return (
			<Stack className={'calorie-calculator-page'}>
				<Stack className={'container'}>
					<Typography variant="h4" className={'page-title'} sx={{ mb: 3 }}>
						Calorie Calculator
					</Typography>

					<Card sx={{ mb: 3 }}>
						<CardContent>
							<Stack spacing={3}>
								<TextField
									fullWidth
									label="Age"
									type="number"
									value={inputs.age}
									onChange={(e) => setInputs({ ...inputs, age: e.target.value })}
									variant="outlined"
									inputProps={{ min: 10, max: 100 }}
								/>

								<FormControl fullWidth>
									<InputLabel>Gender</InputLabel>
									<Select
										value={inputs.gender}
										label="Gender"
										onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
									>
										<MenuItem value="male">Male</MenuItem>
										<MenuItem value="female">Female</MenuItem>
									</Select>
								</FormControl>

								<TextField
									fullWidth
									label="Weight (kg)"
									type="number"
									value={inputs.weight}
									onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
									variant="outlined"
									inputProps={{ min: 30, max: 300, step: 0.1 }}
								/>

								<TextField
									fullWidth
									label="Height (cm)"
									type="number"
									value={inputs.height}
									onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
									variant="outlined"
									inputProps={{ min: 100, max: 250 }}
								/>

								<FormControl component="fieldset">
									<FormLabel component="legend">Activity Level</FormLabel>
									<RadioGroup
										value={inputs.activityLevel}
										onChange={(e) => setInputs({ ...inputs, activityLevel: e.target.value })}
									>
										<FormControlLabel value="sedentary" control={<Radio />} label="Sedentary" />
										<FormControlLabel value="light" control={<Radio />} label="Light" />
										<FormControlLabel value="moderate" control={<Radio />} label="Moderate" />
										<FormControlLabel value="active" control={<Radio />} label="Active" />
										<FormControlLabel value="veryActive" control={<Radio />} label="Very Active" />
									</RadioGroup>
								</FormControl>

								<FormControl component="fieldset">
									<FormLabel component="legend">Goal</FormLabel>
									<RadioGroup
										value={inputs.goal}
										onChange={(e) => setInputs({ ...inputs, goal: e.target.value })}
									>
										<FormControlLabel value="weightLoss" control={<Radio />} label="Weight Loss" />
										<FormControlLabel value="maintenance" control={<Radio />} label="Maintenance" />
										<FormControlLabel value="muscleGain" control={<Radio />} label="Muscle Gain" />
									</RadioGroup>
								</FormControl>

								<Button
									variant="contained"
									fullWidth
									size="large"
									onClick={calculateCalories}
									startIcon={<CalculateIcon />}
									sx={{ mt: 2 }}
								>
									Calculate Calories
								</Button>
							</Stack>
						</CardContent>
					</Card>

					{calculatedCalories && (
						<Card>
							<CardContent>
								<Typography variant="h5" gutterBottom>
									Your Daily Calorie Needs
								</Typography>
								<Typography variant="h3" color="primary" sx={{ mb: 2 }}>
									{calculatedCalories[inputs.goal as keyof typeof calculatedCalories] || calculatedCalories.maintenance} cal/day
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{getGoalDescription(inputs.goal)}
								</Typography>
							</CardContent>
						</Card>
					)}
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'calorie-calculator-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'} sx={{ mb: 4 }}>
						<Typography variant="h2" className={'page-title'}>
							Daily Calorie Calculator
						</Typography>
						<Typography variant="h6" className={'page-subtitle'}>
							Calculate your daily calorie needs based on your body metrics, activity level, and fitness goals
						</Typography>
					</Stack>

					<Grid container spacing={4}>
						{/* Input Section */}
						<Grid item xs={12} md={6}>
							<Card>
								<CardContent>
									<Stack direction="row" alignItems="center" spacing={1} mb={3}>
										<CalculateIcon color="primary" />
										<Typography variant="h5" className={'section-title'}>
											Enter Your Information
										</Typography>
									</Stack>

									<Stack spacing={3}>
										<Grid container spacing={2}>
											<Grid item xs={12} sm={6}>
												<TextField
													fullWidth
													label="Age"
													type="number"
													value={inputs.age}
													onChange={(e) => setInputs({ ...inputs, age: e.target.value })}
													variant="outlined"
													inputProps={{ min: 10, max: 100 }}
													required
												/>
											</Grid>
											<Grid item xs={12} sm={6}>
												<FormControl fullWidth>
													<InputLabel>Gender</InputLabel>
													<Select
														value={inputs.gender}
														label="Gender"
														onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
													>
														<MenuItem value="male">Male</MenuItem>
														<MenuItem value="female">Female</MenuItem>
													</Select>
												</FormControl>
											</Grid>
										</Grid>

										<Grid container spacing={2}>
											<Grid item xs={12} sm={6}>
												<TextField
													fullWidth
													label="Weight (kg)"
													type="number"
													value={inputs.weight}
													onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
													variant="outlined"
													inputProps={{ min: 30, max: 300, step: 0.1 }}
													required
												/>
											</Grid>
											<Grid item xs={12} sm={6}>
												<TextField
													fullWidth
													label="Height (cm)"
													type="number"
													value={inputs.height}
													onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
													variant="outlined"
													inputProps={{ min: 100, max: 250 }}
													required
												/>
											</Grid>
										</Grid>

										<FormControl component="fieldset">
											<FormLabel component="legend">
												Activity Level
												<Chip
													icon={<InfoIcon />}
													label={getActivityDescription(inputs.activityLevel)}
													size="small"
													sx={{ ml: 1, verticalAlign: 'middle' }}
												/>
											</FormLabel>
											<RadioGroup
												value={inputs.activityLevel}
												onChange={(e) => setInputs({ ...inputs, activityLevel: e.target.value })}
											>
												<FormControlLabel
													value="sedentary"
													control={<Radio />}
													label="Sedentary - Little or no exercise, desk job"
												/>
												<FormControlLabel
													value="light"
													control={<Radio />}
													label="Light - Light exercise 1-3 days/week"
												/>
												<FormControlLabel
													value="moderate"
													control={<Radio />}
													label="Moderate - Moderate exercise 3-5 days/week"
												/>
												<FormControlLabel
													value="active"
													control={<Radio />}
													label="Active - Hard exercise 6-7 days/week"
												/>
												<FormControlLabel
													value="veryActive"
													control={<Radio />}
													label="Very Active - Very hard exercise, physical job, training 2x/day"
												/>
											</RadioGroup>
										</FormControl>

										<FormControl component="fieldset">
											<FormLabel component="legend">Fitness Goal</FormLabel>
											<RadioGroup
												value={inputs.goal}
												onChange={(e) => setInputs({ ...inputs, goal: e.target.value })}
											>
												<FormControlLabel
													value="weightLoss"
													control={<Radio />}
													label="Weight Loss - Lose 0.5kg (1lb) per week"
												/>
												<FormControlLabel
													value="extremeWeightLoss"
													control={<Radio />}
													label="Extreme Weight Loss - Lose 1kg (2lbs) per week (max safe)"
												/>
												<FormControlLabel
													value="maintenance"
													control={<Radio />}
													label="Maintenance - Maintain current weight"
												/>
												<FormControlLabel
													value="muscleGain"
													control={<Radio />}
													label="Muscle Gain - Gain muscle gradually (+300 cal)"
												/>
												<FormControlLabel
													value="aggressiveGain"
													control={<Radio />}
													label="Aggressive Gain - Gain muscle aggressively (+500 cal)"
												/>
											</RadioGroup>
										</FormControl>

										<Button
											variant="contained"
											fullWidth
											size="large"
											onClick={calculateCalories}
											startIcon={<CalculateIcon />}
											sx={{ mt: 2, py: 1.5 }}
										>
											Calculate Daily Calories
										</Button>
									</Stack>
								</CardContent>
							</Card>
						</Grid>

						{/* Results Section */}
						<Grid item xs={12} md={6}>
							{calculatedCalories ? (
								<Card sx={{ position: 'sticky', top: 100 }}>
									<CardContent>
										<Stack spacing={3}>
											<Box>
												<Typography variant="h5" gutterBottom>
													Your Daily Calorie Target
												</Typography>
												<Typography
													variant="h2"
													color="primary"
													sx={{ fontWeight: 700, mb: 1 }}
												>
													{calculatedCalories[inputs.goal as keyof typeof calculatedCalories] || calculatedCalories.maintenance}
												</Typography>
												<Typography variant="h6" color="text.secondary">
													calories per day
												</Typography>
												<Chip
													icon={<LocalFireDepartmentIcon />}
													label={getGoalDescription(inputs.goal)}
													color="primary"
													sx={{ mt: 2 }}
												/>
											</Box>

											<Divider />

											<Box>
												<Typography variant="h6" gutterBottom>
													Calorie Breakdown
												</Typography>
												<Grid container spacing={2}>
													<Grid item xs={12}>
														<Card variant="outlined">
															<CardContent>
																<Typography variant="body2" color="text.secondary" gutterBottom>
																	BMR (Basal Metabolic Rate)
																</Typography>
																<Typography variant="h5">{calculatedCalories.bmr} cal/day</Typography>
																<Typography variant="caption" color="text.secondary">
																	Calories burned at rest
																</Typography>
															</CardContent>
														</Card>
													</Grid>
													<Grid item xs={12}>
														<Card variant="outlined">
															<CardContent>
																<Typography variant="body2" color="text.secondary" gutterBottom>
																	TDEE (Total Daily Energy Expenditure)
																</Typography>
																<Typography variant="h5">{calculatedCalories.tdee} cal/day</Typography>
																<Typography variant="caption" color="text.secondary">
																	Calories burned with activity
																</Typography>
															</CardContent>
														</Card>
													</Grid>
												</Grid>
											</Box>

											<Divider />

											<Box>
												<Typography variant="h6" gutterBottom>
													All Goal Options
												</Typography>
												<Stack spacing={2}>
													<Box>
														<Stack direction="row" justifyContent="space-between" alignItems="center">
															<Typography variant="body1">Weight Loss</Typography>
															<Typography variant="h6" color="success.main">
																{calculatedCalories.weightLoss} cal
															</Typography>
														</Stack>
														<Typography variant="caption" color="text.secondary">
															Lose 0.5kg per week
														</Typography>
													</Box>
													<Box>
														<Stack direction="row" justifyContent="space-between" alignItems="center">
															<Typography variant="body1">Maintenance</Typography>
															<Typography variant="h6" color="primary.main">
																{calculatedCalories.maintenance} cal
															</Typography>
														</Stack>
														<Typography variant="caption" color="text.secondary">
															Maintain current weight
														</Typography>
													</Box>
													<Box>
														<Stack direction="row" justifyContent="space-between" alignItems="center">
															<Typography variant="body1">Muscle Gain</Typography>
															<Typography variant="h6" color="warning.main">
																{calculatedCalories.muscleGain} cal
															</Typography>
														</Stack>
														<Typography variant="caption" color="text.secondary">
															Gain muscle gradually
														</Typography>
													</Box>
												</Stack>
											</Box>

											<Alert severity="info" icon={<InfoIcon />}>
												These calculations are estimates. Adjust based on your progress and consult with a nutritionist for personalized advice.
											</Alert>
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
												Fill in your information and click "Calculate Daily Calories" to see your personalized calorie needs.
											</Typography>
										</Box>
									</CardContent>
								</Card>
							)}
						</Grid>
					</Grid>

					{/* Information Section */}
					<Box sx={{ mt: 6 }}>
						<Card>
							<CardContent>
								<Typography variant="h5" gutterBottom>
									<InfoIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
									How It Works
								</Typography>
								<Grid container spacing={3} mt={1}>
									<Grid item xs={12} md={4}>
										<Box>
											<Typography variant="h6" gutterBottom>
												<LocalFireDepartmentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
												BMR (Basal Metabolic Rate)
											</Typography>
											<Typography variant="body2" color="text.secondary">
												This is the number of calories your body burns at rest to maintain basic functions like breathing, circulation, and cell production.
											</Typography>
										</Box>
									</Grid>
									<Grid item xs={12} md={4}>
										<Box>
											<Typography variant="h6" gutterBottom>
												<TrendingUpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
												TDEE (Total Daily Energy Expenditure)
											</Typography>
											<Typography variant="body2" color="text.secondary">
												This is your BMR multiplied by an activity factor. It represents the total calories you burn in a day including all activities.
											</Typography>
										</Box>
									</Grid>
									<Grid item xs={12} md={4}>
										<Box>
											<Typography variant="h6" gutterBottom>
												<CalculateIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
												Goal Adjustments
											</Typography>
											<Typography variant="body2" color="text.secondary">
												Based on your goal, we adjust your TDEE. Weight loss requires a deficit, while muscle gain requires a surplus.
											</Typography>
										</Box>
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

export default withLayoutBasic(CalorieCalculatorPage);









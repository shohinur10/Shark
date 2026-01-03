import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import {
	Stack,
	Box,
	Typography,
	Button,
	Card,
	CardContent,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Slider,
	Alert,
	CircularProgress,
} from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import {
	GET_TRAINER_CLIENTS,
	GET_TRAINER_WORKOUTS,
	GET_MEAL_PLANS,
} from '../../apollo/user/query';
import {
	ASSIGN_MEAL_PLAN_TO_USER,
	ASSIGN_WORKOUT_TO_USER,
} from '../../apollo/user/mutation';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Direction } from '../../libs/types/enums/common.enum';
import { RoutineType } from '../../libs/types/routine-assignment/routine-assignment';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../../libs/sweetAlert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AssignRoutine: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const trainerId = user?._id;
	const { clientId } = router.query;

	const [formData, setFormData] = useState({
		userId: (clientId as string) || '',
		routineType: RoutineType.WORKOUT,
		mealPlanId: '',
		workoutId: '',
		startDate: new Date(),
		endDate: null as Date | null,
		priority: 3,
		trainerNotes: '',
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	// Fetch clients
	const { data: clientsData, loading: clientsLoading } = useQuery(GET_TRAINER_CLIENTS, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 100,
				trainerId: trainerId,
			},
		},
	});

	// Fetch workouts
	const { data: workoutsData, loading: workoutsLoading } = useQuery(GET_TRAINER_WORKOUTS, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 100,
				createdBy: trainerId,
			},
		},
	});

	// Fetch meal plans
	const { data: mealPlansData, loading: mealPlansLoading } = useQuery(GET_MEAL_PLANS, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 100,
				createdBy: trainerId,
			},
		},
	});

	const [assignMealPlan, { loading: assigningMealPlan }] = useMutation(ASSIGN_MEAL_PLAN_TO_USER);
	const [assignWorkout, { loading: assigningWorkout }] = useMutation(ASSIGN_WORKOUT_TO_USER);

	useEffect(() => {
		if (clientId) {
			setFormData((prev) => ({ ...prev, userId: clientId as string }));
		}
	}, [clientId]);

	const clients = clientsData?.getTrainerClients?.list || [];
	const workouts = workoutsData?.getTrainerWorkouts?.list || [];
	const mealPlans = mealPlansData?.getMealPlans?.list || [];

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.userId) {
			newErrors.userId = 'Please select a client';
		}
		if (formData.routineType === RoutineType.MEAL_PLAN && !formData.mealPlanId) {
			newErrors.mealPlanId = 'Please select a meal plan';
		}
		if (formData.routineType === RoutineType.WORKOUT && !formData.workoutId) {
			newErrors.workoutId = 'Please select a workout';
		}
		if (!formData.startDate) {
			newErrors.startDate = 'Please select a start date';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		try {
			const input: any = {
				userId: formData.userId,
				startDate: formData.startDate.toISOString(),
				priority: formData.priority,
			};

			if (formData.endDate) {
				input.endDate = formData.endDate.toISOString();
			}
			if (formData.trainerNotes) {
				input.trainerNotes = formData.trainerNotes;
			}

			if (formData.routineType === RoutineType.MEAL_PLAN) {
				input.mealPlanId = formData.mealPlanId;
				await assignMealPlan({
					variables: { input },
				});
			} else {
				input.workoutId = formData.workoutId;
				await assignWorkout({
					variables: { input },
				});
			}

			await sweetTopSmallSuccessAlert('Routine assigned successfully!', 2000);
			
			// Redirect based on whether we came from client page
			if (clientId) {
				router.push(`/trainer/clients/${clientId}/progress`);
			} else {
				router.push('/trainer/clients');
			}
		} catch (err: any) {
			console.error('Error assigning routine:', err);
			sweetMixinErrorAlert(err.message || 'Failed to assign routine').then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'assign-routine-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Assign Routine</Typography>
					<div>MOBILE ASSIGN ROUTINE PAGE</div>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'assign-routine-page'}>
			<Stack className={'container'} sx={{ maxWidth: 800, mx: 'auto' }}>
				{/* Back Button */}
				<Button
					startIcon={<ArrowBackIcon />}
					onClick={() => {
						if (clientId) {
							router.push(`/trainer/clients/${clientId}/progress`);
						} else {
							router.push('/trainer/clients');
						}
					}}
					sx={{ mb: 2 }}
				>
					Back
				</Button>

				{/* Page Header */}
				<Stack className={'page-header'} sx={{ mb: 4 }}>
					<Typography variant="h3" className={'page-title'}>
						Assign Routine to Client
					</Typography>
					<Typography variant="body1" className={'page-subtitle'}>
						Assign a meal plan or workout routine to a client
					</Typography>
				</Stack>

				<Card>
					<CardContent>
						<form onSubmit={handleSubmit}>
							<Stack spacing={3}>
								{/* Client Selection */}
								<FormControl fullWidth error={!!errors.userId}>
									<InputLabel>Select Client *</InputLabel>
									<Select
										value={formData.userId}
										label="Select Client *"
										onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
										disabled={!!clientId || clientsLoading}
									>
										{clients.map((client: any) => (
											<MenuItem key={client._id} value={client._id}>
												{client.memberFullName || client.memberNick || 'Unknown'}
											</MenuItem>
										))}
									</Select>
									{errors.userId && <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>{errors.userId}</Typography>}
								</FormControl>

								{/* Routine Type */}
								<FormControl fullWidth>
									<InputLabel>Routine Type *</InputLabel>
									<Select
										value={formData.routineType}
										label="Routine Type *"
										onChange={(e) =>
											setFormData({
												...formData,
												routineType: e.target.value as RoutineType,
												mealPlanId: '',
												workoutId: '',
											})
										}
									>
										<MenuItem value={RoutineType.MEAL_PLAN}>Meal Plan</MenuItem>
										<MenuItem value={RoutineType.WORKOUT}>Workout</MenuItem>
									</Select>
								</FormControl>

								{/* Meal Plan Selection */}
								{formData.routineType === RoutineType.MEAL_PLAN && (
									<FormControl fullWidth error={!!errors.mealPlanId}>
										<InputLabel>Select Meal Plan *</InputLabel>
										<Select
											value={formData.mealPlanId}
											label="Select Meal Plan *"
											onChange={(e) => setFormData({ ...formData, mealPlanId: e.target.value })}
											disabled={mealPlansLoading}
										>
											{mealPlans.map((plan: any) => (
												<MenuItem key={plan._id} value={plan._id}>
													{plan.mealPlanTitle} {plan.duration ? `(${plan.duration} days)` : ''}
												</MenuItem>
											))}
										</Select>
										{errors.mealPlanId && (
											<Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
												{errors.mealPlanId}
											</Typography>
										)}
									</FormControl>
								)}

								{/* Workout Selection */}
								{formData.routineType === RoutineType.WORKOUT && (
									<FormControl fullWidth error={!!errors.workoutId}>
										<InputLabel>Select Workout *</InputLabel>
										<Select
											value={formData.workoutId}
											label="Select Workout *"
											onChange={(e) => setFormData({ ...formData, workoutId: e.target.value })}
											disabled={workoutsLoading}
										>
											{workouts.map((workout: any) => (
												<MenuItem key={workout._id} value={workout._id}>
													{workout.workoutTitle} {workout.workoutDuration ? `(${workout.workoutDuration} min)` : ''}
												</MenuItem>
											))}
										</Select>
										{errors.workoutId && (
											<Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
												{errors.workoutId}
											</Typography>
										)}
									</FormControl>
								)}

								{/* Date Pickers */}
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										label="Start Date *"
										value={formData.startDate}
										onChange={(newValue) => {
											if (newValue) {
												setFormData({ ...formData, startDate: newValue });
											}
										}}
										slotProps={{
											textField: {
												fullWidth: true,
												error: !!errors.startDate,
												helperText: errors.startDate,
											},
										}}
									/>
									<DatePicker
										label="End Date (Optional)"
										value={formData.endDate}
										onChange={(newValue) => {
											setFormData({ ...formData, endDate: newValue });
										}}
										slotProps={{
											textField: {
												fullWidth: true,
											},
										}}
									/>
								</LocalizationProvider>

								{/* Priority Slider */}
								<Box>
									<Typography gutterBottom>Priority Level: {formData.priority}</Typography>
									<Slider
										value={formData.priority}
										onChange={(e, value) => setFormData({ ...formData, priority: value as number })}
										min={1}
										max={5}
										marks
										step={1}
									/>
									<Stack direction="row" justifyContent="space-between">
										<Typography variant="caption">Low</Typography>
										<Typography variant="caption">High</Typography>
									</Stack>
								</Box>

								{/* Trainer Notes */}
								<TextField
									label="Trainer Notes (Optional)"
									multiline
									rows={4}
									value={formData.trainerNotes}
									onChange={(e) => setFormData({ ...formData, trainerNotes: e.target.value })}
									placeholder="Add any notes or instructions for the client..."
								/>

								{/* Submit Button */}
								<Button
									type="submit"
									variant="contained"
									size="large"
									fullWidth
									disabled={assigningMealPlan || assigningWorkout}
								>
									{assigningMealPlan || assigningWorkout ? (
										<>
											<CircularProgress size={20} sx={{ mr: 1 }} />
											Assigning...
										</>
									) : (
										'Assign Routine'
									)}
								</Button>
							</Stack>
						</form>
					</CardContent>
				</Card>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(AssignRoutine);


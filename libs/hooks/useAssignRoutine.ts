import { useMutation } from '@apollo/client';
import { ASSIGN_MEAL_PLAN_TO_USER, ASSIGN_WORKOUT_TO_USER } from '../../apollo/user/mutation';
import { AssignRoutineInput } from '../types/routine-assignment/routine-assignment.input';
import { RoutineAssignment } from '../types/routine-assignment/routine-assignment';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../sweetAlert';

interface UseAssignRoutineResult {
	assignMealPlan: (input: AssignRoutineInput) => Promise<RoutineAssignment | null>;
	assignWorkout: (input: AssignRoutineInput) => Promise<RoutineAssignment | null>;
	loading: boolean;
	error: any;
}

export const useAssignRoutine = (): UseAssignRoutineResult => {
	const [assignMealPlanMutation, { loading: mealPlanLoading, error: mealPlanError }] = useMutation(ASSIGN_MEAL_PLAN_TO_USER);
	const [assignWorkoutMutation, { loading: workoutLoading, error: workoutError }] = useMutation(ASSIGN_WORKOUT_TO_USER);

	const assignMealPlan = async (input: AssignRoutineInput): Promise<RoutineAssignment | null> => {
		try {
			const { data } = await assignMealPlanMutation({
				variables: { input },
			});
			await sweetTopSmallSuccessAlert('Meal plan assigned successfully!', 2000);
			return data?.assignMealPlanToUser as RoutineAssignment;
		} catch (err: any) {
			console.error('Error assigning meal plan:', err);
			await sweetMixinErrorAlert(err.message || 'Failed to assign meal plan');
			return null;
		}
	};

	const assignWorkout = async (input: AssignRoutineInput): Promise<RoutineAssignment | null> => {
		try {
			const { data } = await assignWorkoutMutation({
				variables: { input },
			});
			await sweetTopSmallSuccessAlert('Workout assigned successfully!', 2000);
			return data?.assignWorkoutToUser as RoutineAssignment;
		} catch (err: any) {
			console.error('Error assigning workout:', err);
			await sweetMixinErrorAlert(err.message || 'Failed to assign workout');
			return null;
		}
	};

	return {
		assignMealPlan,
		assignWorkout,
		loading: mealPlanLoading || workoutLoading,
		error: mealPlanError || workoutError,
	};
};


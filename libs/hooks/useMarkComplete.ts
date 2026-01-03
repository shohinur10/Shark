import { useMutation } from '@apollo/client';
import { MARK_ROUTINE_COMPLETE } from '../../apollo/user/mutation';
import { MarkRoutineCompleteInput } from '../types/routine-assignment/routine-completion.input';
import { RoutineCompletion } from '../types/routine-assignment/routine-completion';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../sweetAlert';

interface UseMarkCompleteResult {
	markComplete: (input: MarkRoutineCompleteInput) => Promise<RoutineCompletion | null>;
	loading: boolean;
	error: any;
}

export const useMarkComplete = (): UseMarkCompleteResult => {
	const [markCompleteMutation, { loading, error }] = useMutation(MARK_ROUTINE_COMPLETE);

	const markComplete = async (input: MarkRoutineCompleteInput): Promise<RoutineCompletion | null> => {
		try {
			const { data } = await markCompleteMutation({
				variables: { input },
			});
			const completion = data?.markRoutineComplete as RoutineCompletion;
			
			if (completion?.eligibleForBonus) {
				await sweetTopSmallSuccessAlert('Routine completed! You earned a bonus reward! 🎉', 3000);
			} else {
				await sweetTopSmallSuccessAlert('Routine completed successfully!', 2000);
			}
			
			return completion;
		} catch (err: any) {
			console.error('Error marking routine complete:', err);
			await sweetMixinErrorAlert(err.message || 'Failed to mark routine as complete');
			return null;
		}
	};

	return {
		markComplete,
		loading,
		error,
	};
};


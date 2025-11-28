import { DietaryPreference, MealPlanStatus, NutritionGoal } from '../../enums/nutrition.enum';
import { MacrosInput, MealInput } from './mealplan.input';

export interface MealPlanUpdate {
	_id: string;
	mealPlanTitle?: string;
	mealPlanStatus?: MealPlanStatus;
	mealPlanDesc?: string;
	nutritionGoal?: NutritionGoal;
	dietaryPreference?: DietaryPreference[];
	duration?: number;
	calorieTarget?: number;
	macros?: MacrosInput;
	meals?: MealInput[];
	isPremium?: boolean;
	price?: number;
	deletedAt?: Date;
}


import { Direction } from '../../enums/common.enum';
import { DietaryPreference, MealPlanStatus, MealType, NutritionGoal } from '../../enums/nutrition.enum';

export interface MacrosInput {
	protein: number;
	carbs: number;
	fats: number;
}

export interface MealInput {
	day: number;
	mealType: MealType;
	mealName: string;
	ingredients?: string[];
	instructions?: string[];
	calories: number;
	protein: number;
	carbs: number;
	fats: number;
	imageUrl?: string;
}

export interface MealPlanInput {
	mealPlanTitle: string;
	mealPlanStatus?: MealPlanStatus;
	mealPlanDesc?: string;
	nutritionGoal: NutritionGoal;
	dietaryPreference?: DietaryPreference[];
	duration: number;
	calorieTarget: number;
	macros: MacrosInput;
	meals: MealInput[];
	isPremium?: boolean;
	price?: number;
	createdBy?: string;
	mealPlanImage?: string | string[];
}

export interface MPISearch {
	nutritionGoal?: NutritionGoal;
	dietaryPreferenceList?: DietaryPreference[];
	text?: string;
}

export interface MealPlansInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	mealPlanStatus?: MealPlanStatus;
	search?: MPISearch;
}

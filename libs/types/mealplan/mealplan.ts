import { DietaryPreference, MealPlanStatus, MealType, NutritionGoal } from '../../enums/nutrition.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../property/property';

export interface Macros {
	protein: number;
	carbs: number;
	fats: number;
}

export interface Meal {
	day: number;
	mealType: MealType;
	mealName: string;
	ingredients: string[];
	instructions: string;
	calories: number;
	protein: number;
	carbs: number;
	fats: number;
	imageUrl?: string;
}

export interface MealPlan {
	_id: string;
	mealPlanTitle: string;
	mealPlanStatus: MealPlanStatus;
	mealPlanDesc?: string;
	nutritionGoal: NutritionGoal;
	dietaryPreference: DietaryPreference[];
	duration: number;
	calorieTarget: number;
	macros: Macros;
	meals: Meal[];
	createdBy: string;
	mealPlanViews: number;
	mealPlanLikes: number;
	mealPlanRating: number;
	mealPlanFollowers: number;
	isPremium: boolean;
	price: number;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation */
	memberData?: Member;
}

export interface MealPlans {
	list: MealPlan[];
	metaCounter: TotalCounter[];
}

import { DietaryPreference } from '../../enums/nutrition.enum';

export interface Macros {
	protein: number;
	carbs: number;
	fats: number;
}

export enum RecipeTag {
	VEGAN = 'VEGAN',
	VEGETARIAN = 'VEGETARIAN',
	LOW_CARB = 'LOW_CARB',
	HIGH_PROTEIN = 'HIGH_PROTEIN',
	KETO = 'KETO',
	GLUTEN_FREE = 'GLUTEN_FREE',
	DAIRY_FREE = 'DAIRY_FREE',
	QUICK = 'QUICK',
	EASY = 'EASY',
	MEAL_PREP = 'MEAL_PREP',
	POST_WORKOUT = 'POST_WORKOUT',
	PRE_WORKOUT = 'PRE_WORKOUT',
	BREAKFAST = 'BREAKFAST',
	LUNCH = 'LUNCH',
	DINNER = 'DINNER',
	SNACK = 'SNACK',
}

export interface Recipe {
	_id: string;
	name: string;
	description?: string;
	prepTime: number; // in minutes
	cookTime: number; // in minutes
	totalTime: number; // in minutes
	servings: number;
	calories: number;
	macros: Macros;
	ingredients: string[];
	instructions: string[];
	imageUrl?: string;
	tags: string[]; // Array of RecipeTag values
	dietaryPreference?: DietaryPreference[];
	rating?: number;
	views?: number;
	likes?: number;
	createdAt?: Date;
	updatedAt?: Date;
}


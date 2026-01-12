import { useState } from 'react';
import axios from 'axios';
import { WorkoutInput } from '../types/workout/workout.input';
import { MealPlanInput } from '../types/mealplan/mealplan.input';
import { WorkoutCategory, WorkoutDifficulty, WorkoutDuration, WorkoutEquipment } from '../enums/workout.enum';
import { NutritionGoal, DietaryPreference, MealType } from '../enums/nutrition.enum';

export interface WorkoutGenerationParams {
	goal: string; // e.g., "weight loss", "muscle gain", "endurance"
	difficulty: WorkoutDifficulty;
	duration: string; // minutes
	category?: WorkoutCategory;
	equipment?: string[];
	experience?: string;
	limitations?: string; // injuries, restrictions
}

export interface MealPlanGenerationParams {
	goal: NutritionGoal;
	duration: number; // days
	calorieTarget: number;
	dietaryPreferences?: DietaryPreference[];
	allergies?: string[];
	mealFrequency?: number; // meals per day
	specialRequirements?: string;
}

interface UseAIRoutineGeneratorResult {
	generateWorkout: (params: WorkoutGenerationParams) => Promise<Partial<WorkoutInput> | null>;
	generateMealPlan: (params: MealPlanGenerationParams) => Promise<Partial<MealPlanInput> | null>;
	loading: boolean;
	error: string | null;
}

export const useAIRoutineGenerator = (): UseAIRoutineGeneratorResult => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const generateWorkout = async (params: WorkoutGenerationParams): Promise<Partial<WorkoutInput> | null> => {
		setLoading(true);
		setError(null);

		try {
			// Check if OpenAI API key is configured
			const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
			
			if (!apiKey) {
				// Fallback: Generate a structured workout based on parameters
				return generateWorkoutFallback(params);
			}

			// Use OpenAI API
			const prompt = buildWorkoutPrompt(params);
			
			const response = await axios.post(
				'https://api.openai.com/v1/chat/completions',
				{
					model: 'gpt-4',
					messages: [
						{
							role: 'system',
							content: 'You are a professional fitness trainer. Generate structured workout routines in JSON format.',
						},
						{
							role: 'user',
							content: prompt,
						},
					],
					temperature: 0.7,
					max_tokens: 2000,
				},
				{
					headers: {
						'Authorization': `Bearer ${apiKey}`,
						'Content-Type': 'application/json',
					},
				}
			);

			const content = response.data.choices[0]?.message?.content;
			if (!content) {
				throw new Error('No response from AI');
			}

			// Parse JSON from response
			const jsonMatch = content.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error('Invalid response format');
			}

			const workoutData = JSON.parse(jsonMatch[0]);
			return formatWorkoutResponse(workoutData, params);

		} catch (err: any) {
			console.error('Error generating workout:', err);
			setError(err.message || 'Failed to generate workout');
			// Fallback to rule-based generation
			return generateWorkoutFallback(params);
		} finally {
			setLoading(false);
		}
	};

	const generateMealPlan = async (params: MealPlanGenerationParams): Promise<Partial<MealPlanInput> | null> => {
		setLoading(true);
		setError(null);

		try {
			const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
			
			if (!apiKey) {
				return generateMealPlanFallback(params);
			}

			const prompt = buildMealPlanPrompt(params);
			
			const response = await axios.post(
				'https://api.openai.com/v1/chat/completions',
				{
					model: 'gpt-4',
					messages: [
						{
							role: 'system',
							content: 'You are a professional nutritionist. Generate structured meal plans in JSON format.',
						},
						{
							role: 'user',
							content: prompt,
						},
					],
					temperature: 0.7,
					max_tokens: 3000,
				},
				{
					headers: {
						'Authorization': `Bearer ${apiKey}`,
						'Content-Type': 'application/json',
					},
				}
			);

			const content = response.data.choices[0]?.message?.content;
			if (!content) {
				throw new Error('No response from AI');
			}

			const jsonMatch = content.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error('Invalid response format');
			}

			const mealPlanData = JSON.parse(jsonMatch[0]);
			return formatMealPlanResponse(mealPlanData, params);

		} catch (err: any) {
			console.error('Error generating meal plan:', err);
			setError(err.message || 'Failed to generate meal plan');
			return generateMealPlanFallback(params);
		} finally {
			setLoading(false);
		}
	};

	return {
		generateWorkout,
		generateMealPlan,
		loading,
		error,
	};
};

// Prompt builders
function buildWorkoutPrompt(params: WorkoutGenerationParams): string {
	return `Create a detailed workout routine with the following requirements:
- Goal: ${params.goal}
- Difficulty: ${params.difficulty}
- Duration: ${params.duration} minutes
- Category: ${params.category || 'general fitness'}
- Equipment: ${params.equipment?.join(', ') || 'bodyweight'}
- Experience level: ${params.experience || 'intermediate'}
- Limitations: ${params.limitations || 'none'}

Return a JSON object with this structure:
{
  "workoutTitle": "string",
  "workoutDesc": "string",
  "workoutCategory": "STRENGTH|CARDIO|HIIT|FLEXIBILITY|etc",
  "workoutDifficulty": "BEGINNER|INTERMEDIATE|EXPERT",
  "workoutDuration": "number as string",
  "workoutEquipment": ["array of equipment"],
  "workoutExercises": ["array of exercise names"],
  "workoutCaloriesBurn": number,
  "workoutTags": ["array of tags"],
  "exercises": [
    {
      "name": "string",
      "sets": number,
      "reps": "string",
      "rest": "string",
      "notes": "string"
    }
  ]
}`;
}

function buildMealPlanPrompt(params: MealPlanGenerationParams): string {
	return `Create a detailed meal plan with the following requirements:
- Nutrition Goal: ${params.goal}
- Duration: ${params.duration} days
- Calorie Target: ${params.calorieTarget} calories per day
- Dietary Preferences: ${params.dietaryPreferences?.join(', ') || 'none'}
- Allergies: ${params.allergies?.join(', ') || 'none'}
- Meals per day: ${params.mealFrequency || 3}
- Special Requirements: ${params.specialRequirements || 'none'}

Return a JSON object with this structure:
{
  "mealPlanTitle": "string",
  "mealPlanDesc": "string",
  "nutritionGoal": "WEIGHT_LOSS|WEIGHT_GAIN|MAINTENANCE|MUSCLE_GAIN|etc",
  "dietaryPreference": ["array of preferences"],
  "duration": number,
  "calorieTarget": number,
  "macros": {
    "protein": number,
    "carbs": number,
    "fats": number
  },
  "meals": [
    {
      "day": number,
      "mealType": "BREAKFAST|LUNCH|DINNER|SNACK",
      "mealName": "string",
      "ingredients": ["array of ingredients"],
      "instructions": ["array of cooking steps"],
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number
    }
  ]
}`;
}

// Response formatters
function formatWorkoutResponse(data: any, params: WorkoutGenerationParams): Partial<WorkoutInput> {
	return {
		workoutTitle: data.workoutTitle || `AI Generated ${params.goal} Workout`,
		workoutDesc: data.workoutDesc || `A ${params.difficulty} workout designed for ${params.goal}`,
		workoutCategory: (data.workoutCategory as WorkoutCategory) || params.category || WorkoutCategory.STRENGTH,
		workoutDifficulty: (data.workoutDifficulty as WorkoutDifficulty) || params.difficulty,
		workoutDuration: data.workoutDuration || params.duration,
		workoutEquipment: data.workoutEquipment || params.equipment || [],
		workoutExercises: data.workoutExercises || data.exercises?.map((e: any) => e.name) || [],
		workoutCaloriesBurn: data.workoutCaloriesBurn || estimateCalories(params.duration, params.difficulty),
		workoutTags: data.workoutTags || [params.goal, params.difficulty.toLowerCase()],
	};
}

function formatMealPlanResponse(data: any, params: MealPlanGenerationParams): Partial<MealPlanInput> {
	return {
		mealPlanTitle: data.mealPlanTitle || `AI Generated ${params.goal} Meal Plan`,
		mealPlanDesc: data.mealPlanDesc || `A ${params.duration}-day meal plan for ${params.goal}`,
		nutritionGoal: (data.nutritionGoal as NutritionGoal) || params.goal,
		dietaryPreference: data.dietaryPreference || params.dietaryPreferences || [],
		duration: data.duration || params.duration,
		calorieTarget: data.calorieTarget || params.calorieTarget,
		macros: data.macros || calculateMacros(params.calorieTarget, params.goal),
		meals: data.meals || [],
	};
}

// Fallback generators (rule-based)
function generateWorkoutFallback(params: WorkoutGenerationParams): Partial<WorkoutInput> {
	const exercises = getExercisesByCategory(params.category || WorkoutCategory.STRENGTH, params.difficulty);
	const estimatedCalories = estimateCalories(parseInt(params.duration), params.difficulty);

	return {
		workoutTitle: `${params.goal.charAt(0).toUpperCase() + params.goal.slice(1)} ${params.difficulty} Workout`,
		workoutDesc: `A ${params.duration}-minute ${params.difficulty.toLowerCase()} workout designed for ${params.goal}. This routine includes a variety of exercises to help you achieve your fitness goals.`,
		workoutCategory: params.category || WorkoutCategory.STRENGTH,
		workoutDifficulty: params.difficulty,
		workoutDuration: params.duration,
		workoutEquipment: params.equipment || ['Bodyweight'],
		workoutExercises: exercises,
		workoutCaloriesBurn: estimatedCalories,
		workoutTags: [params.goal, params.difficulty.toLowerCase(), 'ai-generated'],
	};
}

function generateMealPlanFallback(params: MealPlanGenerationParams): Partial<MealPlanInput> {
	const macros = calculateMacros(params.calorieTarget, params.goal);
	const mealsPerDay = params.mealFrequency || 3;
	const meals: any[] = [];

	// Generate meals for each day
	for (let day = 1; day <= params.duration; day++) {
		const mealTypes = mealsPerDay === 3 
			? [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER]
			: [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER, MealType.SNACK];

		mealTypes.forEach((mealType, index) => {
			const mealCalories = Math.floor(params.calorieTarget / mealsPerDay);
			meals.push({
				day,
				mealType,
				mealName: `${mealType} - Day ${day}`,
				ingredients: getDefaultIngredients(mealType, params.goal),
				instructions: ['Prepare according to your preferences', 'Season to taste'],
				calories: mealCalories,
				protein: Math.floor(macros.protein / mealsPerDay),
				carbs: Math.floor(macros.carbs / mealsPerDay),
				fats: Math.floor(macros.fats / mealsPerDay),
			});
		});
	}

	return {
		mealPlanTitle: `${params.goal} Meal Plan - ${params.duration} Days`,
		mealPlanDesc: `A ${params.duration}-day meal plan designed for ${params.goal} with ${params.calorieTarget} calories per day.`,
		nutritionGoal: params.goal,
		dietaryPreference: params.dietaryPreferences || [],
		duration: params.duration,
		calorieTarget: params.calorieTarget,
		macros,
		meals,
	};
}

// Helper functions
function estimateCalories(duration: number, difficulty: WorkoutDifficulty): number {
	const baseCalories = duration * 8; // Base 8 cal/min
	const multiplier = {
		[WorkoutDifficulty.BEGINNER]: 0.7,
		[WorkoutDifficulty.INTERMEDIATE]: 1.0,
		[WorkoutDifficulty.EXPERT]: 1.5,
	};
	return Math.round(baseCalories * (multiplier[difficulty] || 1));
}

function calculateMacros(calories: number, goal: NutritionGoal): { protein: number; carbs: number; fats: number } {
	let proteinRatio = 0.3;
	let carbRatio = 0.4;
	let fatRatio = 0.3;

	if (goal === NutritionGoal.WEIGHT_LOSS) {
		proteinRatio = 0.35;
		carbRatio = 0.35;
		fatRatio = 0.3;
	} else if (goal === NutritionGoal.MUSCLE_GAIN || goal === NutritionGoal.WEIGHT_GAIN) {
		proteinRatio = 0.3;
		carbRatio = 0.45;
		fatRatio = 0.25;
	}

	return {
		protein: Math.round((calories * proteinRatio) / 4), // 4 cal per gram
		carbs: Math.round((calories * carbRatio) / 4),
		fats: Math.round((calories * fatRatio) / 9), // 9 cal per gram
	};
}

function getExercisesByCategory(category: WorkoutCategory, difficulty: WorkoutDifficulty): string[] {
	const exerciseMap: Record<WorkoutCategory, string[]> = {
		[WorkoutCategory.STRENGTH]: ['Squats', 'Push-ups', 'Deadlifts', 'Bench Press', 'Rows'],
		[WorkoutCategory.CARDIO]: ['Running', 'Jumping Jacks', 'Burpees', 'Mountain Climbers', 'High Knees'],
		[WorkoutCategory.HIIT]: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'Plank', 'High Knees'],
		[WorkoutCategory.FLEXIBILITY]: ['Stretches', 'Yoga Poses', 'Pilates Moves', 'Dynamic Warm-up'],
		[WorkoutCategory.CALISTHENICS]: ['Pull-ups', 'Push-ups', 'Dips', 'Plank', 'L-sit'],
		[WorkoutCategory.YOGA]: ['Downward Dog', 'Warrior Pose', 'Tree Pose', 'Child\'s Pose'],
		[WorkoutCategory.PILATES]: ['Hundred', 'Roll Up', 'Single Leg Stretch', 'Criss Cross'],
		[WorkoutCategory.CROSSFIT]: ['Thrusters', 'Box Jumps', 'Kettlebell Swings', 'Wall Balls'],
		[WorkoutCategory.SPORTS]: ['Agility Drills', 'Speed Training', 'Sport-Specific Movements'],
		[WorkoutCategory.MARTIAL_ARTS]: ['Punches', 'Kicks', 'Blocks', 'Stances'],
		[WorkoutCategory.DANCE]: ['Dance Moves', 'Cardio Dance', 'Zumba Steps'],
		[WorkoutCategory.SWIMMING]: ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly'],
		[WorkoutCategory.REHABILITATION]: ['Gentle Stretches', 'Range of Motion', 'Therapeutic Exercises'],
	};

	return exerciseMap[category] || exerciseMap[WorkoutCategory.STRENGTH];
}

function getDefaultIngredients(mealType: MealType, goal: NutritionGoal): string[] {
	const baseIngredients: Record<MealType, string[]> = {
		[MealType.BREAKFAST]: ['Eggs', 'Whole grain bread', 'Vegetables'],
		[MealType.LUNCH]: ['Lean protein', 'Complex carbs', 'Vegetables'],
		[MealType.DINNER]: ['Protein source', 'Vegetables', 'Healthy fats'],
		[MealType.SNACK]: ['Nuts', 'Fruits', 'Yogurt'],
	};

	return baseIngredients[mealType] || ['Protein', 'Vegetables', 'Healthy carbs'];
}


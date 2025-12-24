import React from 'react';
import { Box, Typography, Grid, Chip } from '@mui/material';
import { Member } from '../../../libs/types/member/member';
import { Workout } from '../../../libs/types/workout/workout';
import { WorkoutCategory } from '../../../libs/enums/workout.enum';

interface TrainerProgramMapProps {
	trainer: Member;
	workouts?: Workout[];
	onCategoryClick?: (category: WorkoutCategory) => void;
}

const TrainerProgramMap: React.FC<TrainerProgramMapProps> = ({ trainer, workouts = [], onCategoryClick }) => {
	// Group workouts by category and spread across 4 weeks
	const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'] as const;
	
	// Group workouts by category
	const workoutsByCategory: { [key in WorkoutCategory]?: Workout[] } = {};
	workouts.forEach((workout) => {
		const category = workout.workoutCategory;
		if (!workoutsByCategory[category]) {
			workoutsByCategory[category] = [];
		}
		workoutsByCategory[category]!.push(workout);
	});

	// Distribute workouts across 4 weeks (3-5 tiles per week)
	const weekTiles: { [key: number]: Array<Workout & { category: WorkoutCategory }> } = { 0: [], 1: [], 2: [], 3: [] };
	
	let weekIndex = 0;
	(Object.keys(workoutsByCategory) as WorkoutCategory[]).forEach((category) => {
		const categoryWorkouts = workoutsByCategory[category];
		if (categoryWorkouts) {
			categoryWorkouts.forEach((workout, idx) => {
				const targetWeek = (weekIndex + idx) % 4;
				if (weekTiles[targetWeek].length < 5) {
					weekTiles[targetWeek].push({ ...workout, category });
				}
			});
			weekIndex = (weekIndex + categoryWorkouts.length) % 4;
		}
	});

	// If not enough workouts, fill with placeholder tiles
	weeks.forEach((_, weekIdx) => {
		while (weekTiles[weekIdx].length < 3 && workouts.length > 0) {
			const workout = workouts[weekTiles[weekIdx].length % workouts.length];
			if (!weekTiles[weekIdx].find((w) => w._id === workout._id)) {
				weekTiles[weekIdx].push({ ...workout, category: workout.workoutCategory });
			} else {
				break;
			}
		}
	});

	const getCategoryColor = (category: WorkoutCategory): string => {
		const colors: { [key in WorkoutCategory]?: string } = {
			[WorkoutCategory.STRENGTH]: '#f17742',
			[WorkoutCategory.CARDIO]: '#33c1c1',
			[WorkoutCategory.HIIT]: '#4caf50',
			[WorkoutCategory.FLEXIBILITY]: '#9E9E9E',
			[WorkoutCategory.YOGA]: '#616161',
			[WorkoutCategory.PILATES]: '#E91E63',
			[WorkoutCategory.CROSSFIT]: '#FF9800',
		};
		return colors[category] || '#E5E5E5';
	};

	const handleTileClick = (category: WorkoutCategory) => {
		if (onCategoryClick) {
			onCategoryClick(category);
		}
	};

	return (
		<Box
			className="trainer-program-map"
			sx={{
				padding: 3,
				backgroundColor: '#FFFFFF',
				borderRadius: 2,
				border: '1px solid #E5E5E5',
			}}
		>
			<Typography
				variant="h6"
				sx={{
					fontSize: '18px',
					fontWeight: 600,
					color: '#212121',
					marginBottom: 3,
				}}
			>
				Program Map
			</Typography>

			{workouts.length === 0 ? (
				<Typography variant="body2" sx={{ fontSize: '13px', color: '#9E9E9E', fontStyle: 'italic', textAlign: 'center', py: 4 }}>
					No workouts available to create program map
				</Typography>
			) : (
				<Grid container spacing={2}>
					{weeks.map((week, weekIdx) => (
						<Grid item xs={12} sm={6} md={3} key={weekIdx}>
							<Box>
								<Typography
									variant="subtitle2"
									sx={{
										fontSize: '13px',
										fontWeight: 600,
										color: '#616161',
										marginBottom: 1.5,
									}}
								>
									{week}
								</Typography>
								<Stack spacing={1}>
									{weekTiles[weekIdx].map((tile, tileIdx) => (
										<Box
											key={tileIdx}
											onClick={() => handleTileClick(tile.category)}
											sx={{
												padding: 1.5,
												backgroundColor: getCategoryColor(tile.category),
												borderRadius: 1,
												cursor: 'pointer',
												transition: 'all 0.2s ease',
												'&:hover': {
													transform: 'translateY(-2px)',
													boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
												},
											}}
										>
											<Typography
												variant="body2"
												sx={{
													fontSize: '12px',
													fontWeight: 600,
													color: '#FFFFFF',
													mb: 0.5,
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
												}}
											>
												{tile.workoutTitle}
											</Typography>
											<Chip
												label={tile.category.replace('_', ' ')}
												size="small"
												sx={{
													height: 18,
													fontSize: '9px',
													fontWeight: 500,
													backgroundColor: 'rgba(255,255,255,0.2)',
													color: '#FFFFFF',
													border: 'none',
												}}
											/>
										</Box>
									))}
									{weekTiles[weekIdx].length === 0 && (
										<Box
											sx={{
												padding: 1.5,
												backgroundColor: '#F5F5F5',
												borderRadius: 1,
												textAlign: 'center',
											}}
										>
											<Typography variant="body2" sx={{ fontSize: '11px', color: '#9E9E9E' }}>
												Rest day
											</Typography>
										</Box>
									)}
								</Stack>
							</Box>
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
};

export default TrainerProgramMap;

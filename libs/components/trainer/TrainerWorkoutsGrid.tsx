import React, { useState, useMemo } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Stack, Chip, Rating, Tabs, Tab, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { RECORD_VIEW } from '../../../apollo/user/mutation';
import { Workout } from '../../../libs/types/workout/workout';
import { WorkoutCategory, WorkoutDifficulty, WorkoutDuration } from '../../../libs/enums/workout.enum';

// Helper to convert WorkoutDuration enum to display minutes
const getDurationMinutes = (duration: WorkoutDuration): string => {
	const durationMap: { [key in WorkoutDuration]: string } = {
		[WorkoutDuration.SHORT]: '15 min',
		[WorkoutDuration.MEDIUM]: '30 min',
		[WorkoutDuration.LONG]: '45 min',
		[WorkoutDuration.EXTENDED]: '60+ min',
	};
	return durationMap[duration] || duration;
};

interface TrainerWorkoutsGridProps {
	workouts: Workout[];
	loading?: boolean;
}

const TrainerWorkoutsGrid: React.FC<TrainerWorkoutsGridProps> = ({ workouts, loading }) => {
	const router = useRouter();
	const [selectedCategory, setSelectedCategory] = useState<string | WorkoutCategory>('ALL');
	const [selectedDifficulty, setSelectedDifficulty] = useState<string | WorkoutDifficulty>('ALL');
	const [sortBy, setSortBy] = useState<'newest' | 'duration' | 'rating'>('newest');
	const [recordView] = useMutation(RECORD_VIEW);

	// Extract unique categories from workouts
	const categories = useMemo(() => {
		const cats = new Set<WorkoutCategory>();
		workouts.forEach((w) => {
			if (w.workoutCategory) cats.add(w.workoutCategory);
		});
		return ['ALL' as const, ...Array.from(cats).sort()];
	}, [workouts]);

	// Filter and sort workouts
	const filteredWorkouts = useMemo(() => {
		let filtered = [...workouts];

		// Filter by category
		if (selectedCategory !== 'ALL') {
			filtered = filtered.filter((w) => w.workoutCategory === selectedCategory);
		}

		// Filter by difficulty
		if (selectedDifficulty !== 'ALL') {
			filtered = filtered.filter((w) => w.workoutDifficulty === selectedDifficulty);
		}

		// Sort
		if (sortBy === 'newest') {
			filtered.sort((a, b) => (b.workoutViews || 0) - (a.workoutViews || 0));
		} else if (sortBy === 'duration') {
			// Sort by duration enum order
			const durationOrder: { [key in WorkoutDuration]: number } = {
				[WorkoutDuration.SHORT]: 1,
				[WorkoutDuration.MEDIUM]: 2,
				[WorkoutDuration.LONG]: 3,
				[WorkoutDuration.EXTENDED]: 4,
			};
			filtered.sort((a, b) => (durationOrder[a.workoutDuration] || 0) - (durationOrder[b.workoutDuration] || 0));
		} else if (sortBy === 'rating') {
			filtered.sort((a, b) => (b.workoutRating || 0) - (a.workoutRating || 0));
		}

		return filtered;
	}, [workouts, selectedCategory, selectedDifficulty, sortBy]);

	const handleWorkoutClick = async (workoutId: string) => {
		try {
			await recordView({
				variables: {
					input: {
						viewRefId: workoutId,
						viewGroup: 'WORKOUT',
					},
				},
			});
		} catch (err) {
			console.error('Error recording view:', err);
		}
		router.push(`/workout/${workoutId}`);
	};

	if (loading) {
		return (
			<Grid container spacing={2}>
				{[...Array(6)].map((_, idx) => (
					<Grid item xs={12} sm={6} md={4} key={idx}>
						<Card sx={{ borderRadius: 2, border: '1px solid #E5E5E5' }}>
							<Box sx={{ height: 160, backgroundColor: '#F5F5F5' }} />
							<CardContent>
								<Box sx={{ height: 20, backgroundColor: '#F5F5F5', borderRadius: 1, mb: 1 }} />
								<Box sx={{ height: 16, backgroundColor: '#F5F5F5', borderRadius: 1, width: '60%' }} />
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		);
	}

	if (workouts.length === 0) {
		return (
			<Box
				sx={{
					padding: 4,
					textAlign: 'center',
					backgroundColor: '#FFFFFF',
					borderRadius: 2,
					border: '1px solid #E5E5E5',
				}}
			>
				<Typography variant="body2" sx={{ fontSize: '14px', color: '#9E9E9E' }}>
					No workouts from this trainer yet
				</Typography>
			</Box>
		);
	}

	return (
		<Box>
			{/* Filters Row */}
			<Stack
				direction="row"
				spacing={2}
				sx={{
					mb: 3,
					flexWrap: 'wrap',
					alignItems: 'center',
					padding: 2,
					backgroundColor: '#FFFFFF',
					borderRadius: 2,
					border: '1px solid #E5E5E5',
				}}
			>
				{/* Category Tabs */}
				<Box sx={{ flex: 1, minWidth: 200 }}>
					<Tabs
						value={selectedCategory}
						onChange={(_, value) => setSelectedCategory(value)}
						variant="scrollable"
						scrollButtons="auto"
						sx={{
							minHeight: 40,
							'& .MuiTab-root': {
								fontSize: '12px',
								fontWeight: 500,
								textTransform: 'none',
								minHeight: 40,
								padding: '6px 12px',
								color: '#757575',
								'&.Mui-selected': {
									color: '#212121',
									fontWeight: 600,
								},
							},
							'& .MuiTabs-indicator': {
								backgroundColor: '#f17742',
								height: 2,
							},
						}}
					>
						{categories.map((cat) => (
							<Tab key={cat} label={cat === 'ALL' ? 'All' : cat.replace('_', ' ')} value={cat} />
						))}
					</Tabs>
				</Box>

				{/* Difficulty Dropdown */}
				<FormControl size="small" sx={{ minWidth: 140 }}>
					<InputLabel>Difficulty</InputLabel>
					<Select
						value={selectedDifficulty}
						label="Difficulty"
						onChange={(e) => setSelectedDifficulty(e.target.value)}
						sx={{ backgroundColor: '#FAFAFA' }}
					>
						<MenuItem value="ALL">All</MenuItem>
						<MenuItem value="BEGINNER">Beginner</MenuItem>
						<MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
						<MenuItem value="ADVANCED">Advanced</MenuItem>
						<MenuItem value="EXPERT">Expert</MenuItem>
					</Select>
				</FormControl>

				{/* Duration Sort */}
				<FormControl size="small" sx={{ minWidth: 140 }}>
					<InputLabel>Sort by</InputLabel>
					<Select
						value={sortBy}
						label="Sort by"
						onChange={(e) => setSortBy(e.target.value)}
						sx={{ backgroundColor: '#FAFAFA' }}
					>
						<MenuItem value="newest">Newest</MenuItem>
						<MenuItem value="duration">Duration</MenuItem>
						<MenuItem value="rating">Rating</MenuItem>
					</Select>
				</FormControl>
			</Stack>

			{/* Workouts Grid */}
			{filteredWorkouts.length === 0 ? (
				<Box
					sx={{
						padding: 4,
						textAlign: 'center',
						backgroundColor: '#FFFFFF',
						borderRadius: 2,
						border: '1px solid #E5E5E5',
					}}
				>
					<Typography variant="body2" sx={{ fontSize: '14px', color: '#9E9E9E' }}>
						No workouts match the selected filters
					</Typography>
				</Box>
			) : (
				<Grid container spacing={2}>
					{filteredWorkouts.map((workout) => (
						<Grid item xs={12} sm={6} md={4} key={workout._id}>
							<Card
								onClick={() => handleWorkoutClick(workout._id)}
								sx={{
									borderRadius: 2,
									border: '1px solid #E5E5E5',
									overflow: 'hidden',
									transition: 'all 0.2s ease',
									cursor: 'pointer',
									'&:hover': {
										borderColor: '#f17742',
										boxShadow: '0 4px 12px rgba(241, 119, 66, 0.15)',
										transform: 'translateY(-2px)',
									},
								}}
							>
								<CardMedia
									component="div"
									sx={{
										height: 160,
										backgroundColor: '#F5F5F5',
										backgroundImage: workout.workoutImage ? `url(${workout.workoutImage})` : 'none',
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										position: 'relative',
									}}
								>
									{workout.isPremium && (
										<Chip
											label="Premium"
											size="small"
											sx={{
												position: 'absolute',
												top: 8,
												right: 8,
												height: 20,
												fontSize: '10px',
												fontWeight: 600,
												backgroundColor: '#f17742',
												color: '#FFFFFF',
											}}
										/>
									)}
									<Chip
										label={workout.workoutDifficulty}
										size="small"
										sx={{
											position: 'absolute',
											top: 8,
											left: 8,
											height: 20,
											fontSize: '10px',
											fontWeight: 500,
											backgroundColor: 'rgba(0, 0, 0, 0.6)',
											color: '#FFFFFF',
										}}
									/>
								</CardMedia>
								<CardContent>
									<Typography
										variant="h6"
										sx={{
											fontSize: '15px',
											fontWeight: 600,
											color: '#212121',
											marginBottom: 1,
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
										}}
									>
										{workout.workoutTitle}
									</Typography>
									<Stack direction="row" spacing={1.5} sx={{ mb: 1 }}>
										<Stack direction="row" alignItems="center" spacing={0.5}>
											<AccessTimeIcon sx={{ fontSize: 14, color: '#9E9E9E' }} />
											<Typography variant="body2" sx={{ fontSize: '12px', color: '#757575' }}>
												{getDurationMinutes(workout.workoutDuration)}
											</Typography>
										</Stack>
										<Stack direction="row" alignItems="center" spacing={0.5}>
											<LocalFireDepartmentIcon sx={{ fontSize: 14, color: '#f17742' }} />
											<Typography variant="body2" sx={{ fontSize: '12px', color: '#757575' }}>
												{workout.workoutCaloriesBurn} cal
											</Typography>
										</Stack>
									</Stack>
									<Stack direction="row" alignItems="center" justifyContent="space-between">
										<Rating value={workout.workoutRating || 0} readOnly size="small" sx={{ fontSize: '14px' }} />
										<Typography variant="body2" sx={{ fontSize: '12px', color: '#9E9E9E' }}>
											{workout.workoutViews || 0} views
										</Typography>
									</Stack>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
};

export default TrainerWorkoutsGrid;

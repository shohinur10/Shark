import { NextPage } from 'next';
import { Stack, Box, Typography, Grid, Chip, Button, IconButton } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import { MuscleGroup, ExerciseType } from '../../libs/enums/exercise.enum';
import { WorkoutEquipment } from '../../libs/enums/workout.enum';
import { Exercise } from '../../libs/types/exercise/exercise';
import Link from 'next/link';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ExercisesPage: NextPage = () => {
	const device = useDeviceDetect();
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [loading, setLoading] = useState(false);
	const [muscleGroupExpanded, setMuscleGroupExpanded] = useState(false);
	const [filters, setFilters] = useState({
		search: '',
		muscleGroup: '',
		exerciseType: '',
		equipment: '',
	});

	// TODO: Replace with actual GET_EXERCISES query
	// const { data, loading, error } = useQuery(GET_EXERCISES, {
	// 	variables: { input: { ...filters } }
	// });

	const handleFilterChange = (field: string, value: string) => {
		setFilters((prev) => ({ ...prev, [field]: value === prev[field as keyof typeof prev] ? '' : value }));
	};

	const handleClearFilters = () => {
		setFilters({
			search: '',
			muscleGroup: '',
			exerciseType: '',
			equipment: '',
		});
	};

	const getActiveFiltersCount = () => {
		return Object.values(filters).filter((value) => value !== '').length;
	};

	const formatMuscleGroupName = (muscle: string) => {
		return muscle.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const formatExerciseTypeName = (type: string) => {
		return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const formatEquipmentName = (equipment: string) => {
		return equipment.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	if (device === 'mobile') {
		return (
			<Stack className={'exercises-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Exercises</Typography>
					<div>MOBILE EXERCISES PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'exercises-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'}>
						<Typography variant="h3" className={'page-title'}>
							Exercise Library
						</Typography>
						<Typography variant="body1" className={'page-subtitle'}>
							Browse 1000+ exercises with detailed instructions
						</Typography>
					</Stack>

					{/* Search & Filter Box */}
					<Box className={'search-filter-box'}>
						<Box className={'search-box-main'}>
							{/* Search Input */}
							<Box className={'search-input-box'}>
								<SearchIcon className={'search-icon'} />
								<input
									type="text"
									className={'search-input'}
									placeholder="Search exercises..."
									value={filters.search}
									onChange={(e) => handleFilterChange('search', e.target.value)}
								/>
								{filters.search && (
									<IconButton
										size="small"
										onClick={() => handleFilterChange('search', '')}
										className={'clear-search-btn'}
									>
										<ClearIcon fontSize="small" />
									</IconButton>
								)}
							</Box>

							{/* Filter Selectors */}
							<Box className={'select-box'}>
								{/* Muscle Group Selector */}
								<Box
									className={`filter-box ${filters.muscleGroup ? 'active' : ''}`}
									onClick={() => setMuscleGroupExpanded(!muscleGroupExpanded)}
									sx={{ cursor: 'pointer' }}
								>
									<span>
										{filters.muscleGroup ? formatMuscleGroupName(filters.muscleGroup) : 'Muscle Group'}
									</span>
									<ExpandMoreIcon className={`expand-icon ${muscleGroupExpanded ? 'expanded' : ''}`} />
								</Box>

								{/* Exercise Type Selector */}
								<Box
									className={`filter-box ${filters.exerciseType ? 'active' : ''}`}
									onClick={() => {
										const types = Object.values(ExerciseType);
										const currentIndex = types.indexOf(filters.exerciseType as ExerciseType);
										const nextIndex = (currentIndex + 1) % (types.length + 1);
										handleFilterChange('exerciseType', nextIndex === 0 ? '' : types[nextIndex - 1]);
									}}
									sx={{ cursor: 'pointer' }}
								>
									<span>
										{filters.exerciseType ? formatExerciseTypeName(filters.exerciseType) : 'Type'}
									</span>
									<ExpandMoreIcon />
								</Box>

								{/* Equipment Selector */}
								<Box
									className={`filter-box ${filters.equipment ? 'active' : ''}`}
									onClick={() => {
										const equipmentList = Object.values(WorkoutEquipment);
										const currentIndex = equipmentList.indexOf(filters.equipment as WorkoutEquipment);
										const nextIndex = (currentIndex + 1) % (equipmentList.length + 1);
										handleFilterChange('equipment', nextIndex === 0 ? '' : equipmentList[nextIndex - 1]);
									}}
									sx={{ cursor: 'pointer' }}
								>
									<span>{filters.equipment ? formatEquipmentName(filters.equipment) : 'Equipment'}</span>
									<ExpandMoreIcon />
								</Box>
							</Box>

							{/* Search Button */}
							<Box className={'search-btn'} sx={{ cursor: 'pointer' }}>
								<SearchIcon />
							</Box>
						</Box>

						{/* Muscle Group Filter Dropdown */}
						<Box className={`filter-dropdown ${muscleGroupExpanded ? 'on' : ''}`}>
							<Box className={'filter-dropdown-content'}>
								{Object.values(MuscleGroup).map((muscle) => (
									<Box
										key={muscle}
										className={`filter-option ${filters.muscleGroup === muscle ? 'selected' : ''}`}
										onClick={() => {
											handleFilterChange('muscleGroup', muscle);
											setMuscleGroupExpanded(false);
										}}
										sx={{ cursor: 'pointer' }}
									>
										<span>{formatMuscleGroupName(muscle)}</span>
									</Box>
								))}
							</Box>
						</Box>

						{/* Active Filters & Clear */}
						{getActiveFiltersCount() > 0 && (
							<Box className={'active-filters-bar'}>
								<Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
									<Typography variant="body2" className={'active-filters-label'}>
										Active Filters:
									</Typography>
									{filters.muscleGroup && (
										<Chip
											label={formatMuscleGroupName(filters.muscleGroup)}
											onDelete={() => handleFilterChange('muscleGroup', '')}
											size="small"
											className={'active-filter-chip'}
										/>
									)}
									{filters.exerciseType && (
										<Chip
											label={formatExerciseTypeName(filters.exerciseType)}
											onDelete={() => handleFilterChange('exerciseType', '')}
											size="small"
											className={'active-filter-chip'}
										/>
									)}
									{filters.equipment && (
										<Chip
											label={formatEquipmentName(filters.equipment)}
											onDelete={() => handleFilterChange('equipment', '')}
											size="small"
											className={'active-filter-chip'}
										/>
									)}
									<Button
										variant="text"
										size="small"
										onClick={handleClearFilters}
										className={'clear-all-btn'}
									>
										Clear All
									</Button>
								</Stack>
							</Box>
						)}
					</Box>

					{/* Exercises Grid */}
					<Stack className={'exercises-content'}>
						{exercises.length === 0 ? (
							<Box className={'empty-state'}>
								<Typography variant="h6">No exercises found</Typography>
								<Typography variant="body2">Try adjusting your filters or check back later.</Typography>
							</Box>
						) : (
							<Grid container spacing={3}>
								{exercises.map((exercise) => (
									<Grid item xs={12} sm={6} md={4} lg={3} key={exercise._id}>
										<Link href={`/exercises/${exercise._id}`}>
											<Box className={'exercise-card'}>
												<Box className={'exercise-image'}>
													{exercise.exerciseImage ? (
														<img src={exercise.exerciseImage} alt={exercise.exerciseName} />
													) : exercise.exerciseGif ? (
														<img src={exercise.exerciseGif} alt={exercise.exerciseName} />
													) : (
														<div className={'image-placeholder'}>Exercise</div>
													)}
												</Box>
												<Box className={'exercise-info'}>
												<Typography variant="h6" className={'exercise-name'}>
														{exercise.exerciseName}
												</Typography>
													<Stack direction="row" spacing={1} flexWrap="wrap" className={'exercise-tags'}>
														{exercise.targetMuscles.slice(0, 2).map((muscle, idx) => (
															<Chip
																key={idx}
																label={formatMuscleGroupName(muscle)}
																size="small"
																className={'exercise-tag'}
															/>
														))}
														{exercise.exerciseType && (
															<Chip
																label={formatExerciseTypeName(exercise.exerciseType)}
																size="small"
																className={'exercise-tag type'}
															/>
														)}
													</Stack>
													<Stack direction="row" spacing={1} className={'exercise-meta'}>
														<span>⭐ {exercise.exerciseRating?.toFixed(1) || '0.0'}</span>
														<span>•</span>
														<span>{exercise.exerciseViews || 0} views</span>
													</Stack>
												</Box>
											</Box>
										</Link>
									</Grid>
								))}
							</Grid>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(ExercisesPage);






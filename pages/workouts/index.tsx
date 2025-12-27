import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Chip, Tabs, Tab, Card, CardContent, CardMedia, IconButton, CircularProgress, Alert, Skeleton, TextField, InputAdornment, Container, Pagination, Drawer, Checkbox, FormControlLabel, Divider, Collapse, Autocomplete, Avatar } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HomeIcon from '@mui/icons-material/Home';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PersonIcon from '@mui/icons-material/Person';
import { WorkoutDifficulty, WorkoutEquipment, WorkoutCategory, WorkoutDuration } from '../../libs/enums/workout.enum';
import { MuscleGroup } from '../../libs/enums/exercise.enum';
import { Direction } from '../../libs/enums/common.enum';
import { useQuery, useMutation } from '@apollo/client';
import { GET_WORKOUTS } from '../../apollo/user/query';
import { LIKE_TARGET_WORKOUT } from '../../apollo/user/mutation';
import { Workout } from '../../libs/types/workout/workout';
import { WorkoutsInquiry, WISearch } from '../../libs/types/workout/workout.input';
import { T } from '../../libs/types/common';
import { REACT_APP_API_URL } from '../../libs/config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { MemberType } from '../../libs/enums/member.enum';
import { formatEnumLabel } from '../../libs/utils/format.utils';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Helper functions for filter mapping
const goalToCategories: Record<string, WorkoutCategory[]> = {
	'FAT_LOSS': [WorkoutCategory.CARDIO, WorkoutCategory.HIIT],
	'MUSCLE_GAIN': [WorkoutCategory.STRENGTH],
	'STRENGTH': [WorkoutCategory.STRENGTH, WorkoutCategory.CROSSFIT],
	'MOBILITY': [WorkoutCategory.FLEXIBILITY, WorkoutCategory.YOGA, WorkoutCategory.PILATES],
	'ENDURANCE': [WorkoutCategory.CARDIO, WorkoutCategory.HIIT],
};

const bodyFocusToMuscleGroups: Record<string, MuscleGroup[]> = {
	'FULL_BODY': [MuscleGroup.FULL_BODY],
	'UPPER': [MuscleGroup.CHEST, MuscleGroup.BACK, MuscleGroup.SHOULDERS, MuscleGroup.BICEPS, MuscleGroup.TRICEPS],
	'LOWER': [MuscleGroup.QUADRICEPS, MuscleGroup.HAMSTRINGS, MuscleGroup.GLUTES, MuscleGroup.CALVES],
	'CORE': [MuscleGroup.ABS, MuscleGroup.OBLIQUES],
};

const durationToTimeRanges: Record<string, { min: number; max: number }> = {
	'10-20': { min: 10, max: 20 },
	'20-30': { min: 20, max: 30 },
	'30-45': { min: 30, max: 45 },
	'45+': { min: 45, max: Infinity },
};

const durationEnumToMinutes: Record<WorkoutDuration, { min: number; max: number }> = {
	[WorkoutDuration.SHORT]: { min: 0, max: 15 },
	[WorkoutDuration.MEDIUM]: { min: 15, max: 30 },
	[WorkoutDuration.LONG]: { min: 30, max: 60 },
	[WorkoutDuration.EXTENDED]: { min: 60, max: Infinity },
};

// Helper to check if workout is home-based
const isHomeWorkout = (equipment: WorkoutEquipment[]): boolean => {
	return equipment.length === 0 || 
		equipment.every(eq => 
			eq === WorkoutEquipment.NONE || 
			eq === WorkoutEquipment.BODYWEIGHT || 
			eq === WorkoutEquipment.YOGA_MAT ||
			eq === WorkoutEquipment.RESISTANCE_BAND ||
			eq === WorkoutEquipment.FOAM_ROLLER
		);
};

// Helper to check if workout requires gym
const isGymWorkout = (equipment: WorkoutEquipment[]): boolean => {
	return equipment.includes(WorkoutEquipment.FULL_GYM) ||
		equipment.some(eq => 
			eq === WorkoutEquipment.CARDIO_MACHINE ||
			eq === WorkoutEquipment.LAT_PULLDOWN_MACHINE ||
			eq === WorkoutEquipment.CABLE_MACHINE ||
			eq === WorkoutEquipment.SMITH_MACHINE ||
			eq === WorkoutEquipment.LEG_PRESS_MACHINE ||
			eq === WorkoutEquipment.CHEST_PRESS_MACHINE
		);
};

// Filter state interface
interface FilterState {
	goals: WorkoutCategory[];
	location: ('HOME' | 'GYM')[];
	levels: WorkoutDifficulty[];
	durations: WorkoutDuration[];
	equipment: WorkoutEquipment[];
	bodyFocus: MuscleGroup[];
	trainer: string | null;
	minRating: number | null;
}

const WorkoutsPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	
	// Filter state with multi-select support
	const [filters, setFilters] = useState<FilterState>({
		goals: [],
		location: [],
		levels: [],
		durations: [],
		equipment: [],
		bodyFocus: [],
		trainer: null,
		minRating: null,
	});
	
	// Applied filters (what's actually being used in the query)
	const [appliedFilters, setAppliedFilters] = useState<FilterState>({
		goals: [],
		location: [],
		levels: [],
		durations: [],
		equipment: [],
		bodyFocus: [],
		trainer: null,
		minRating: null,
	});
	
	// UI state
	const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
	const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
		goals: true,
		location: true,
		levels: true,
		durations: true,
		equipment: true,
		bodyFocus: true,
		trainer: true,
		rating: true,
	});
	const [tabValue, setTabValue] = useState(0);
	const [page, setPage] = useState(1);
	const [likedWorkouts, setLikedWorkouts] = useState<Set<string>>(new Set());
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
	const limit = 12;

	// Debounce search input (500ms)
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
			setPage(1); // Reset to first page when search changes
		}, 500);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Prepare query input with proper filtering (using debounced search)
	const queryInput: WorkoutsInquiry = useMemo(() => {
		const search: WISearch = {
			...(debouncedSearchQuery.trim() && { text: debouncedSearchQuery.trim() }),
			...(appliedFilters.goals.length > 0 && { categoryList: appliedFilters.goals }),
			...(appliedFilters.levels.length > 0 && { difficultyList: appliedFilters.levels }),
			...(appliedFilters.durations.length > 0 && { durationList: appliedFilters.durations }),
			...(appliedFilters.equipment.length > 0 && { equipmentList: appliedFilters.equipment }),
			...(appliedFilters.trainer && { createdBy: appliedFilters.trainer }),
		};

		return {
			page,
			limit,
			sort: 'workoutViews',
			direction: Direction.DESC,
			workoutStatus: 'PUBLISHED',
			search: Object.keys(search).length > 0 ? search : undefined,
		};
	}, [page, appliedFilters, debouncedSearchQuery, limit]);

	// Fetch workouts
	const {
		loading: getWorkoutsLoading,
		data: getWorkoutsData,
		error: getWorkoutsError,
		refetch: getWorkoutsRefetch,
	} = useQuery(GET_WORKOUTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: queryInput },
		notifyOnNetworkStatusChange: true,
		onError: (error) => {
			console.error('Error fetching workouts:', error);
		},
	});

	// Like workout mutation
	const [likeWorkout, { loading: likeLoading }] = useMutation(LIKE_TARGET_WORKOUT, {
		onCompleted: (data) => {
			if (data?.likeTargetWorkout) {
				const workoutId = data.likeTargetWorkout._id;
				setLikedWorkouts((prev) => {
					const newSet = new Set(prev);
					if (newSet.has(workoutId)) {
						newSet.delete(workoutId);
					} else {
						newSet.add(workoutId);
					}
					return newSet;
				});
				// Refetch to update like count
				getWorkoutsRefetch();
			}
		},
		onError: (error) => {
			console.error('Error liking workout:', error);
		},
	});

	// Extract workouts from data
	const workouts = useMemo(() => {
		const workoutList = getWorkoutsData?.getWorkouts?.list ?? [];
		console.log('Workouts fetched:', workoutList?.length);
		return workoutList;
	}, [getWorkoutsData]);

	// Get total count for pagination
	const totalCount = useMemo(() => {
		return getWorkoutsData?.getWorkouts?.metaCounter?.[0]?.total || 0;
	}, [getWorkoutsData]);

	const totalPages = Math.ceil(totalCount / limit);

	// Handle like workout
	const handleLikeWorkout = async (e: React.MouseEvent, workoutId: string) => {
		e.preventDefault();
		e.stopPropagation();
		if (!user?._id) {
			router.push('/account/login');
			return;
		}
		try {
			await likeWorkout({ variables: { input: workoutId } });
		} catch (error) {
			console.error('Failed to like workout:', error);
		}
	};

	// Filter management functions
	const handleFilterChange = <K extends keyof FilterState>(
		filterKey: K,
		value: FilterState[K]
	) => {
		setFilters(prev => ({
			...prev,
			[filterKey]: value,
		}));
	};

	const handleApplyFilters = () => {
		setAppliedFilters(filters);
		setPage(1);
		setFilterDrawerOpen(false);
	};

	const handleClearAllFilters = () => {
		const emptyFilters: FilterState = {
			goals: [],
			location: [],
			levels: [],
			durations: [],
			equipment: [],
			bodyFocus: [],
			trainer: null,
			minRating: null,
		};
		setFilters(emptyFilters);
		setAppliedFilters(emptyFilters);
		setPage(1);
		setTabValue(0);
	};

	const handleRemoveFilter = (filterType: keyof FilterState, value: any) => {
		if (filterType === 'trainer' || filterType === 'minRating') {
			const newFilters = { ...appliedFilters, [filterType]: null };
			setAppliedFilters(newFilters);
			setFilters(newFilters);
		} else {
			const newFilters = {
				...appliedFilters,
				[filterType]: (appliedFilters[filterType] as any[]).filter((item: any) => item !== value),
			};
			setAppliedFilters(newFilters);
			setFilters(newFilters);
		}
		setPage(1);
	};

	const toggleSection = (section: string) => {
		setExpandedSections(prev => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	// Generate filter chips for display
	const getFilterChips = () => {
		const chips: Array<{ label: string; type: keyof FilterState; value: any }> = [];
		
		appliedFilters.goals.forEach(goal => {
			chips.push({ label: formatEnumLabel(goal), type: 'goals', value: goal });
		});
		
		appliedFilters.location.forEach(loc => {
			chips.push({ label: loc === 'HOME' ? 'Home' : 'Gym', type: 'location', value: loc });
		});
		
		appliedFilters.levels.forEach(level => {
			chips.push({ label: formatDifficulty(level), type: 'levels', value: level });
		});
		
		appliedFilters.durations.forEach(duration => {
			chips.push({ label: formatDuration(duration), type: 'durations', value: duration });
		});
		
		appliedFilters.equipment.forEach(eq => {
			chips.push({ label: formatEquipment([eq]), type: 'equipment', value: eq });
		});
		
		appliedFilters.bodyFocus.forEach(focus => {
			chips.push({ label: formatEnumLabel(focus), type: 'bodyFocus', value: focus });
		});
		
		if (appliedFilters.trainer) {
			chips.push({ label: `Trainer: ${appliedFilters.trainer}`, type: 'trainer', value: appliedFilters.trainer });
		}
		
		if (appliedFilters.minRating) {
			chips.push({ label: `Rating: ${appliedFilters.minRating}+`, type: 'minRating', value: appliedFilters.minRating });
		}
		
		return chips;
	};

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
		setPage(1);
		
		// Update goal filter based on tab
		let newGoals: WorkoutCategory[] = [];
		if (newValue === 1) newGoals = goalToCategories['FAT_LOSS'] || [];
		else if (newValue === 2) newGoals = goalToCategories['MUSCLE_GAIN'] || [];
		else if (newValue === 3) newGoals = goalToCategories['STRENGTH'] || [];
		else if (newValue === 4) {
			// Home - filter by location
			const newFilters = { ...appliedFilters, location: ['HOME' as const] };
			setAppliedFilters(newFilters);
			setFilters(newFilters);
			return;
		} else if (newValue === 5) {
			// Gym - filter by location
			const newFilters = { ...appliedFilters, location: ['GYM' as const] };
			setAppliedFilters(newFilters);
			setFilters(newFilters);
			return;
		}
		
		const newFilters = { ...appliedFilters, goals: newGoals };
		setAppliedFilters(newFilters);
		setFilters(newFilters);
	};

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// Note: Apollo automatically refetches when queryInput changes, so no manual refetch needed

	const formatCategory = (category: WorkoutCategory) => {
		return formatEnumLabel(category);
	};

	const formatDifficulty = (difficulty: WorkoutDifficulty) => {
		return formatEnumLabel(difficulty);
	};

	const formatEquipment = (equipment: WorkoutEquipment[]) => {
		if (!equipment || equipment.length === 0) return 'No Equipment';
		if (equipment.length === 1) return formatEnumLabel(equipment[0]);
		return `${equipment.length} types`;
	};

	// Get image URL with proper API URL
	const getWorkoutImageUrl = (workoutImage?: string) => {
		if (!workoutImage) return '/img/gym.img/pexels-cavemantraining-682087.jpg';
		if (workoutImage.startsWith('http')) return workoutImage;
		return `${REACT_APP_API_URL}/${workoutImage}`;
	};

	// Format calories
	const formatCalories = (calories?: number) => {
		if (!calories) return '0';
		return calories.toLocaleString();
	};

	const formatDuration = (duration: WorkoutDuration) => {
		return formatEnumLabel(duration);
	};

	const formatDurationMinutes = (duration: WorkoutDuration) => {
		const durationMap: Record<WorkoutDuration, string> = {
			[WorkoutDuration.SHORT]: '10-15',
			[WorkoutDuration.MEDIUM]: '15-30',
			[WorkoutDuration.LONG]: '30-60',
			[WorkoutDuration.EXTENDED]: '60+',
		};
		return durationMap[duration] || 'N/A';
	};

	const getTrainerAvatarUrl = (memberData?: any) => {
		if (!memberData?.memberImage) return '/img/profile/defaultUser.svg';
		if (memberData.memberImage.startsWith('http')) return memberData.memberImage;
		return `${REACT_APP_API_URL}/${memberData.memberImage}`;
	};

	const formatEquipmentCompact = (equipment: WorkoutEquipment[]) => {
		if (!equipment || equipment.length === 0) return 'None';
		if (equipment.length === 1) {
			return formatEnumLabel(equipment[0]);
		}
		return `${equipment.length} items`;
	};

	// Trainer Programs Section Component
	const TrainerProgramsSection = () => {
		const trainerWorkoutsQuery: WorkoutsInquiry = useMemo(
			() => ({
				page: 1,
				limit: 8,
				sort: 'workoutViews',
				direction: Direction.DESC,
				workoutStatus: 'PUBLISHED',
				search: undefined, // We'll filter client-side for trainer workouts
			}),
			[],
		);

		const {
			data: trainerWorkoutsData,
			loading: trainerWorkoutsLoading,
		} = useQuery(GET_WORKOUTS, {
			variables: { input: trainerWorkoutsQuery },
			fetchPolicy: 'cache-and-network',
		});

		const allWorkouts = (trainerWorkoutsData?.getWorkouts?.list || []) as Workout[];
		
		// Filter workouts created by trainers
		const trainerWorkouts = useMemo(() => {
			return allWorkouts.filter((workout) => {
				// Check if createdBy matches a trainer or memberData.memberType is TRAINER
				return workout.memberData?.memberType === MemberType.TRAINER || 
				       (workout.createdBy && workout.memberData?.memberType === 'TRAINER');
			}).slice(0, 8);
		}, [allWorkouts]);

		if (trainerWorkoutsLoading || trainerWorkouts.length === 0) {
			return null; // Don't show section if loading or no trainer workouts
		}

		return (
			<Box sx={{ mb: 4 }}>
				<Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#212121' }}>
					Trainer Programs
				</Typography>
				<Box
					sx={{
						display: 'flex',
						gap: 2,
						overflowX: 'auto',
						pb: 2,
						'&::-webkit-scrollbar': {
							height: 8,
						},
						'&::-webkit-scrollbar-thumb': {
							backgroundColor: '#E5E5E5',
							borderRadius: 4,
						},
					}}
				>
					{trainerWorkouts.map((workout: Workout) => {
						const workoutImageUrl = getWorkoutImageUrl(workout.workoutImage);
						return (
							<Card
								key={workout._id}
								sx={{
									minWidth: 280,
									maxWidth: 320,
									height: 320,
									borderRadius: 2,
									border: '1px solid #E5E5E5',
									overflow: 'hidden',
									transition: 'all 0.3s ease',
									cursor: 'pointer',
									'&:hover': {
										borderColor: '#E10600',
										boxShadow: '0 8px 24px rgba(225, 6, 0, 0.12)',
										transform: 'translateY(-4px)',
									},
								}}
							>
								<Link href={`/workouts/${workout._id}`} style={{ textDecoration: 'none' }}>
									<CardMedia
										component="div"
										sx={{
											height: 150,
											backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), url(${workoutImageUrl})`,
											backgroundSize: 'cover',
											backgroundPosition: 'center',
											position: 'relative',
										}}
									>
										<Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
											<Chip
												label={formatCategory(workout.workoutCategory)}
												size="small"
												sx={{
													backgroundColor: '#E10600',
													color: '#FFFFFF',
													fontWeight: 600,
													fontSize: '11px',
													height: 24,
												}}
											/>
										</Box>
									</CardMedia>
								</Link>
								<CardContent sx={{ p: 2, height: 170, display: 'flex', flexDirection: 'column' }}>
									<Typography
										variant="h6"
										sx={{
											fontWeight: 700,
											color: '#212121',
											fontSize: '16px',
											lineHeight: 1.3,
											mb: 1,
											display: '-webkit-box',
											WebkitLineClamp: 2,
											WebkitBoxOrient: 'vertical',
											overflow: 'hidden',
										}}
									>
										{workout.workoutTitle}
									</Typography>
									{workout.memberData && (
										<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
											<Avatar
												src={getTrainerAvatarUrl(workout.memberData)}
												alt={workout.memberData.memberFullName || workout.memberData.memberNick}
												sx={{ width: 24, height: 24 }}
											/>
											<Typography variant="caption" sx={{ color: '#757575', fontSize: '12px' }}>
												{workout.memberData.memberFullName || workout.memberData.memberNick}
											</Typography>
										</Stack>
									)}
									<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
										<StarIcon sx={{ fontSize: 16, color: '#E10600' }} />
										<Typography variant="body2" sx={{ fontWeight: 600, color: '#212121', fontSize: '13px' }}>
											{workout.workoutRating?.toFixed(1) || '0.0'}
										</Typography>
									</Stack>
									<Box sx={{ mt: 'auto' }}>
										<Button
											variant="contained"
											fullWidth
											size="small"
											onClick={(e: React.MouseEvent) => {
												e.preventDefault();
												router.push(`/workouts/${workout._id}`);
											}}
											sx={{
												backgroundColor: '#E10600',
												'&:hover': { backgroundColor: '#C10500' },
												textTransform: 'none',
												fontWeight: 600,
												fontSize: '13px',
											}}
										>
											View Program
										</Button>
									</Box>
								</CardContent>
							</Card>
						);
					})}
				</Box>
			</Box>
		);
	};

	// Use workouts directly from GraphQL query
	const displayWorkouts = getWorkoutsData?.getWorkouts?.list ?? [];

	// Get suggested workouts (top rated / most joined) for empty state
	const suggestedWorkouts = useMemo(() => {
		if (workouts.length > 0) {
			// Use real data: sort by rating and completions, take top 4
			return [...workouts]
				.sort((a, b) => {
					const aScore = (a.workoutRating || 0) * 0.6 + (a.workoutCompletions || 0) * 0.4;
					const bScore = (b.workoutRating || 0) * 0.6 + (b.workoutCompletions || 0) * 0.4;
					return bScore - aScore;
				})
				.slice(0, 4);
		}
		// Return empty array if no workouts available
		return [];
	}, [workouts]);

	// Calculate workout match score based on applied filters
	const calculateMatchScore = useMemo(() => {
		const hasFilters = 
			appliedFilters.goals.length > 0 ||
			appliedFilters.location.length > 0 ||
			appliedFilters.levels.length > 0 ||
			appliedFilters.durations.length > 0 ||
			appliedFilters.equipment.length > 0 ||
			appliedFilters.bodyFocus.length > 0 ||
			appliedFilters.trainer !== null ||
			appliedFilters.minRating !== null;

		if (!hasFilters) return null;

		// Start at 100% and calculate based on filter matches
		let score = 100;
		const reasons: string[] = [];

		// Goals filter (20% weight)
		if (appliedFilters.goals.length > 0) {
			reasons.push('goal');
			// If multiple goals selected, slight reduction
			if (appliedFilters.goals.length > 2) {
				score -= 2;
			}
		}

		// Level filter (15% weight)
		if (appliedFilters.levels.length > 0) {
			reasons.push('level');
			// If multiple levels selected, slight reduction
			if (appliedFilters.levels.length > 2) {
				score -= 2;
			}
		}

		// Equipment filter (15% weight)
		if (appliedFilters.equipment.length > 0) {
			reasons.push('equipment');
			// If multiple equipment types selected, slight reduction
			if (appliedFilters.equipment.length > 3) {
				score -= 2;
			}
		}

		// Location filter (10% weight)
		if (appliedFilters.location.length > 0) {
			reasons.push('location');
		}

		// Duration filter (10% weight)
		if (appliedFilters.durations.length > 0) {
			reasons.push('duration');
			if (appliedFilters.durations.length > 2) {
				score -= 1;
			}
		}

		// Rating filter (10% weight)
		if (appliedFilters.minRating !== null) {
			reasons.push('rating');
		}

		// Trainer filter (10% weight)
		if (appliedFilters.trainer !== null) {
			reasons.push('trainer');
		}

		// Body focus filter (10% weight)
		if (appliedFilters.bodyFocus.length > 0) {
			reasons.push('body focus');
		}

		// Ensure score is between 60-100% for believability
		score = Math.max(60, Math.min(100, score));

		// Format reasons text - prioritize most important filters
		const priorityOrder = ['goal', 'level', 'equipment', 'location', 'duration', 'rating', 'trainer', 'body focus'];
		const sortedReasons = reasons.sort((a, b) => {
			const aIndex = priorityOrder.indexOf(a);
			const bIndex = priorityOrder.indexOf(b);
			return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
		});

		let reasonText = '';
		if (sortedReasons.length === 1) {
			reasonText = `Based on your ${sortedReasons[0]}`;
		} else if (sortedReasons.length === 2) {
			reasonText = `Based on your ${sortedReasons[0]} + ${sortedReasons[1]}`;
		} else if (sortedReasons.length === 3) {
			reasonText = `Based on your ${sortedReasons[0]} + ${sortedReasons[1]} + ${sortedReasons[2]}`;
		} else {
			reasonText = `Based on your ${sortedReasons.slice(0, 2).join(' + ')} + ${sortedReasons.length - 2} more`;
		}

		return {
			score: Math.round(score),
			reason: reasonText,
		};
	}, [appliedFilters]);

	// Filter workouts based on client-side filters (location, rating, body focus)
	const filteredWorkouts = useMemo(() => {
		let filtered = displayWorkouts;
		
		// Apply location filter (client-side since it's based on equipment)
		if (appliedFilters.location.length > 0) {
			filtered = filtered.filter((workout: Workout) => {
				if (appliedFilters.location.includes('HOME')) {
					return isHomeWorkout(workout.workoutEquipment);
				}
				if (appliedFilters.location.includes('GYM')) {
					return isGymWorkout(workout.workoutEquipment);
				}
				return true;
			});
		}
		
		// Apply rating filter (client-side)
		if (appliedFilters.minRating) {
			filtered = filtered.filter((workout: Workout) => {
				return (workout.workoutRating || 0) >= appliedFilters.minRating!;
			});
		}
		
		// Note: Other filters (goals, levels, durations, equipment) are handled by the API
		// Body focus would need to be checked against workout exercises, which we don't have in the current data
		
		return filtered;
	}, [displayWorkouts, appliedFilters]);

	// Show error banner if there's an error and no workouts
	const showErrorBanner = getWorkoutsError && workouts.length === 0;

	if (device === 'mobile') {
		return (
			<Stack className={'workouts-page'}>
				<Container maxWidth="sm" className={'workouts-container'}>
					{/* Page Header */}
					<Box className={'page-header'}>
						<Typography variant="h4" className={'page-title'}>
							Workouts
						</Typography>
						<Typography variant="body2" className={'page-subtitle'}>
							Find workouts that match your goal, level, and equipment.
						</Typography>
					</Box>

					{/* Search Bar */}
					<Box className={'search-section'}>
						<TextField
							fullWidth
							placeholder="Search workouts..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className={'search-input'}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon sx={{ color: '#6B6B6B' }} />
									</InputAdornment>
								),
							}}
						/>
					</Box>

					{/* Filter Button */}
					<Box className={'filters-header'}>
						<Button
							variant={filterDrawerOpen ? 'contained' : 'outlined'}
							startIcon={<FilterListIcon />}
							onClick={() => setFilterDrawerOpen(true)}
							fullWidth
							sx={{
								borderRadius: '16px',
								textTransform: 'none',
								fontWeight: 600,
								borderColor: '#E5E5E5',
								'&:hover': {
									borderColor: '#E10600',
								},
								'&.MuiButton-contained': {
									backgroundColor: '#E10600',
									color: '#FFFFFF',
									'&:hover': {
										backgroundColor: '#C10500',
									},
								},
							}}
						>
							Filters
							{getFilterChips().length > 0 && (
								<Chip
									label={getFilterChips().length}
									size="small"
									sx={{
										ml: 1,
										height: 20,
										minWidth: 20,
										fontSize: '11px',
										backgroundColor: filterDrawerOpen ? 'rgba(255,255,255,0.3)' : '#E10600',
										color: '#FFFFFF',
									}}
								/>
							)}
						</Button>
					</Box>

					{/* Active Filter Chips */}
					{getFilterChips().length > 0 && (
						<Box className={'active-filters-mobile'}>
							<Stack direction="row" spacing={1} flexWrap="wrap">
								{getFilterChips().map((chip, index) => (
									<Chip
										key={index}
										label={chip.label}
										onDelete={() => handleRemoveFilter(chip.type, chip.value)}
										deleteIcon={<CloseIcon sx={{ fontSize: 14 }} />}
										size="small"
										sx={{
											borderRadius: '16px',
											fontWeight: 500,
											backgroundColor: '#E10600',
											color: '#FFFFFF',
											'& .MuiChip-deleteIcon': {
												color: '#FFFFFF',
											},
										}}
									/>
								))}
							</Stack>
						</Box>
					)}

					{/* Trainer Programs Section */}
					<TrainerProgramsSection />

					{/* Category Tabs */}
					<Box className={'category-tabs-section'}>
						<Tabs 
							value={tabValue} 
							onChange={handleTabChange} 
							variant="scrollable"
							scrollButtons="auto"
						>
							<Tab label="All" />
							<Tab label="Fat Loss" icon={<LocalFireDepartmentIcon />} iconPosition="start" />
							<Tab label="Muscle Gain" icon={<TrendingUpIcon />} iconPosition="start" />
							<Tab label="Strength" icon={<FitnessCenterIcon />} iconPosition="start" />
							<Tab label="Home" icon={<HomeIcon />} iconPosition="start" />
							<Tab label="Gym" icon={<FitnessCenterIcon />} iconPosition="start" />
						</Tabs>
					</Box>

					{showErrorBanner && (
						<Alert severity="error" sx={{ mt: 2, mb: 2, borderRadius: '16px' }}>
							Unable to load workouts. Please try again later.
						</Alert>
					)}

					{/* Workout Match Score */}
					{calculateMatchScore && !getWorkoutsLoading && (
						<Box
							sx={{
								mb: 3,
								p: 2,
								backgroundColor: '#FFFFFF',
								borderRadius: '16px',
								border: '1px solid #E5E5E5',
								boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
								display: 'flex',
								alignItems: 'center',
								gap: 1.5,
							}}
						>
							<Box
								sx={{
									width: 56,
									height: 56,
									borderRadius: '50%',
									background: `linear-gradient(135deg, #E10600 0%, #C10500 100%)`,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexShrink: 0,
								}}
							>
								<Typography
									variant="h6"
									sx={{
										fontWeight: 800,
										color: '#FFFFFF',
										fontSize: '20px',
									}}
								>
									{calculateMatchScore.score}%
								</Typography>
							</Box>
							<Box sx={{ flex: 1, minWidth: 0 }}>
								<Typography
									variant="subtitle1"
									sx={{
										fontWeight: 700,
										color: '#111111',
										fontSize: '16px',
										mb: 0.5,
									}}
								>
									Your Match
								</Typography>
								<Typography
									variant="caption"
									sx={{
										color: '#6B6B6B',
										fontSize: '12px',
										display: 'block',
									}}
								>
									{calculateMatchScore.reason}
								</Typography>
							</Box>
						</Box>
					)}

					{/* Results */}
					{getWorkoutsLoading ? (
						<>
							{/* Skeleton Tabs */}
							<Box sx={{ mb: 2, display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
								{[1, 2, 3, 4, 5, 6].map((i) => (
									<Skeleton key={i} variant="rectangular" width={100} height={40} sx={{ borderRadius: '16px', flexShrink: 0 }} />
								))}
							</Box>
							
							{/* Skeleton Cards */}
							<Stack spacing={2} sx={{ mt: 2 }}>
								{[1, 2, 3].map((i) => (
									<Card key={i} sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)', border: '1px solid #E5E5E5' }}>
										<Skeleton variant="rectangular" height={200} />
										<CardContent sx={{ p: 2.5 }}>
											<Skeleton variant="text" height={24} width="80%" />
											<Stack direction="row" spacing={1} sx={{ mt: 1.5, mb: 1.5 }}>
												<Skeleton variant="circular" width={32} height={32} />
												<Skeleton variant="text" height={20} width={100} />
											</Stack>
											<Skeleton variant="text" height={18} width="40%" />
											<Skeleton variant="text" height={16} width="60%" sx={{ mt: 1 }} />
											<Skeleton variant="rectangular" height={40} sx={{ mt: 2, borderRadius: '12px' }} />
										</CardContent>
									</Card>
								))}
							</Stack>
						</>
					) : filteredWorkouts.length === 0 && !getWorkoutsLoading ? (
						<>
							{/* Empty State */}
							<Box 
								sx={{ 
									textAlign: 'center', 
									padding: 4,
									mt: 3,
									mb: 4,
								}}
							>
								<FitnessCenterIcon sx={{ fontSize: 64, color: '#E5E5E5', mb: 2 }} />
								<Typography 
									variant="h5" 
									sx={{ 
										color: '#111111', 
										fontWeight: 700, 
										mb: 1.5,
										fontSize: '20px',
									}}
								>
									No workouts found
								</Typography>
								<Typography 
									variant="body2" 
									sx={{ 
										color: '#6B6B6B', 
										mb: 4,
										fontSize: '14px',
									}}
								>
									{getWorkoutsError 
										? 'Unable to load workouts. Please try again later.' 
										: 'Try clearing filters or adjusting your search criteria.'}
								</Typography>
								<Stack 
									direction="column" 
									spacing={2}
									sx={{ mb: 4 }}
								>
									<Button
										variant="outlined"
										onClick={handleClearAllFilters}
										fullWidth
										sx={{
											borderRadius: '16px',
											textTransform: 'none',
											fontWeight: 600,
											padding: '12px 24px',
											borderColor: '#E5E5E5',
											color: '#111111',
											'&:hover': {
												borderColor: '#E10600',
												color: '#E10600',
												backgroundColor: 'rgba(225, 6, 0, 0.04)',
											},
										}}
									>
										Clear Filters
									</Button>
									<Button
										variant="contained"
										onClick={() => {
											handleClearAllFilters();
											setTabValue(0);
										}}
										fullWidth
										sx={{
											borderRadius: '16px',
											textTransform: 'none',
											fontWeight: 600,
											padding: '12px 24px',
											backgroundColor: '#E10600',
											'&:hover': {
												backgroundColor: '#C10500',
											},
										}}
									>
										Browse All Workouts
									</Button>
								</Stack>
							</Box>
							
							{/* Suggested Workouts */}
							{suggestedWorkouts.length > 0 && (
								<Box sx={{ mt: 2 }}>
									<Typography 
										variant="h6" 
										sx={{ 
											fontWeight: 700,
											color: '#111111',
											mb: 2,
											fontSize: '18px',
										}}
									>
										Suggested Workouts
									</Typography>
									<Stack spacing={2}>
									{suggestedWorkouts.map((workout: Workout) => {
										const workoutImageUrl = getWorkoutImageUrl(workout.workoutImage);
										
										return (
											<Card 
												key={workout._id}
												sx={{ 
													borderRadius: '16px',
													boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
													border: '1px solid #E5E5E5',
													overflow: 'hidden',
													transition: 'all 0.3s ease',
													'&:hover': {
														boxShadow: '0 8px 24px rgba(225, 6, 0, 0.12)',
														borderColor: '#E10600',
													},
												}}
											>
												<Link href={`/workouts/${workout._id}`} style={{ textDecoration: 'none' }}>
														<CardMedia
															component="div"
															sx={{
																height: 200,
																backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), url(${workoutImageUrl})`,
																backgroundSize: 'cover',
																backgroundPosition: 'center',
																position: 'relative',
															}}
														>
															<Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
																<Chip
																	label={formatCategory(workout.workoutCategory)}
																	size="small"
																	sx={{
																		backgroundColor: '#E10600',
																		color: '#FFFFFF',
																		fontWeight: 600,
																		fontSize: '11px',
																		height: 24,
																	}}
																/>
																<Chip
																	label={formatDifficulty(workout.workoutDifficulty)}
																	size="small"
																	sx={{
																		backgroundColor: 'rgba(255, 255, 255, 0.95)',
																		color: '#111111',
																		fontWeight: 600,
																		fontSize: '11px',
																		height: 24,
																	}}
																/>
																<Chip
																	label={`${formatDurationMinutes(workout.workoutDuration)} min`}
																	size="small"
																	icon={<AccessTimeIcon sx={{ fontSize: 12, color: '#6B6B6B' }} />}
																	sx={{
																		backgroundColor: 'rgba(255, 255, 255, 0.95)',
																		color: '#111111',
																		fontWeight: 500,
																		fontSize: '11px',
																		height: 24,
																	}}
																/>
															</Box>
														</CardMedia>
													</Link>
													<CardContent sx={{ p: 2.5 }}>
														<Typography 
															variant="h6" 
															sx={{ 
																fontWeight: 700,
																color: '#111111',
																fontSize: '18px',
																lineHeight: 1.3,
																mb: 1.5,
															}}
														>
															{workout.workoutTitle}
														</Typography>
														{workout.memberData && (
															<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
																<Avatar
																	src={getTrainerAvatarUrl(workout.memberData)}
																	alt={workout.memberData.memberFullName || workout.memberData.memberNick}
																	sx={{ width: 32, height: 32 }}
																/>
																<Typography 
																	variant="caption" 
																	sx={{ 
																		color: '#6B6B6B',
																		fontSize: '13px',
																		fontWeight: 500,
																	}}
																>
																	{workout.memberData.memberFullName || workout.memberData.memberNick}
																</Typography>
															</Stack>
														)}
														<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
															<StarIcon sx={{ fontSize: 18, color: '#E10600' }} />
															<Typography 
																variant="body2" 
																sx={{ 
																	fontWeight: 600,
																	color: '#111111',
																	fontSize: '14px',
																}}
															>
																{workout.workoutRating?.toFixed(1) || '0.0'}
															</Typography>
															<Typography 
																variant="caption" 
																sx={{ 
																	color: '#6B6B6B',
																	fontSize: '12px',
																}}
															>
																({workout.workoutComments || 0} reviews)
															</Typography>
														</Stack>
														<Box sx={{ mb: 2 }}>
															<Typography 
																variant="caption" 
																sx={{ 
																	color: '#6B6B6B',
																	fontSize: '12px',
																	fontWeight: 500,
																	display: 'block',
																	mb: 0.5,
																}}
															>
																Equipment:
															</Typography>
															<Typography 
																variant="body2" 
																sx={{ 
																	color: '#111111',
																	fontSize: '13px',
																}}
															>
																{formatEquipmentCompact(workout.workoutEquipment)}
															</Typography>
														</Box>
														<Button
															variant="contained"
															fullWidth
													onClick={(e: React.MouseEvent) => {
														e.preventDefault();
														router.push(`/workouts/${workout._id}`);
													}}
															sx={{
																borderRadius: '12px',
																textTransform: 'none',
																fontWeight: 600,
																fontSize: '14px',
																padding: '10px 16px',
																backgroundColor: '#E10600',
																'&:hover': {
																	backgroundColor: '#C10500',
																},
																'&.Mui-disabled': {
																	backgroundColor: '#E5E5E5',
																	color: '#6B6B6B',
																},
															}}
														>
															View Workout
														</Button>
													</CardContent>
												</Card>
											);
										})}
									</Stack>
								</Box>
							)}
						</>
					) : (
						<>
							<Stack spacing={2} sx={{ mt: 2 }}>
								{filteredWorkouts.map((workout: Workout) => {
									const workoutImageUrl = getWorkoutImageUrl(workout.workoutImage);
									return (
										<Card 
											key={workout._id} 
											sx={{ 
												borderRadius: '16px',
												boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
												border: '1px solid #E5E5E5',
												overflow: 'hidden',
												transition: 'all 0.3s ease',
												'&:hover': {
													boxShadow: '0 8px 24px rgba(225, 6, 0, 0.12)',
													borderColor: '#E10600',
												},
											}}
										>
											{/* Thumbnail Image */}
											<Link href={`/workouts/${workout._id}`} style={{ textDecoration: 'none' }}>
												<CardMedia
													component="div"
													sx={{
														height: 200,
														backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), url(${workoutImageUrl})`,
														backgroundSize: 'cover',
														backgroundPosition: 'center',
														position: 'relative',
													}}
												>
													{/* Tags Overlay */}
													<Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
														<Chip
															label={formatCategory(workout.workoutCategory)}
															size="small"
															sx={{
																backgroundColor: '#E10600',
																color: '#FFFFFF',
																fontWeight: 600,
																fontSize: '11px',
																height: 24,
															}}
														/>
														<Chip
															label={formatDifficulty(workout.workoutDifficulty)}
															size="small"
															sx={{
																backgroundColor: 'rgba(255, 255, 255, 0.95)',
																color: '#111111',
																fontWeight: 600,
																fontSize: '11px',
																height: 24,
															}}
														/>
														<Chip
															label={`${formatDurationMinutes(workout.workoutDuration)} min`}
															size="small"
															icon={<AccessTimeIcon sx={{ fontSize: 12, color: '#6B6B6B' }} />}
															sx={{
																backgroundColor: 'rgba(255, 255, 255, 0.95)',
																color: '#111111',
																fontWeight: 500,
																fontSize: '11px',
																height: 24,
															}}
														/>
													</Box>
												</CardMedia>
											</Link>
											
											{/* Card Content */}
											<CardContent sx={{ p: 2.5 }}>
												{/* Workout Title */}
												<Typography 
													variant="h6" 
													sx={{ 
														fontWeight: 700,
														color: '#111111',
														fontSize: '18px',
														lineHeight: 1.3,
														mb: 1.5,
													}}
												>
													{workout.workoutTitle}
												</Typography>
												
												{/* Trainer Info */}
												{workout.memberData && (
													<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
														<Avatar
															src={getTrainerAvatarUrl(workout.memberData)}
															alt={workout.memberData.memberFullName || workout.memberData.memberNick}
															sx={{ width: 32, height: 32 }}
														/>
														<Typography 
															variant="caption" 
															sx={{ 
																color: '#6B6B6B',
																fontSize: '13px',
																fontWeight: 500,
															}}
														>
															{workout.memberData.memberFullName || workout.memberData.memberNick}
														</Typography>
													</Stack>
												)}
												
												{/* Rating and Reviews */}
												<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
													<StarIcon sx={{ fontSize: 18, color: '#E10600' }} />
													<Typography 
														variant="body2" 
														sx={{ 
															fontWeight: 600,
															color: '#111111',
															fontSize: '14px',
														}}
													>
														{workout.workoutRating?.toFixed(1) || '0.0'}
													</Typography>
													<Typography 
														variant="caption" 
														sx={{ 
															color: '#6B6B6B',
															fontSize: '12px',
														}}
													>
														({workout.workoutComments || 0} reviews)
													</Typography>
												</Stack>
												
												{/* Equipment List */}
												<Box sx={{ mb: 2 }}>
													<Typography 
														variant="caption" 
														sx={{ 
															color: '#6B6B6B',
															fontSize: '12px',
															fontWeight: 500,
															display: 'block',
															mb: 0.5,
														}}
													>
														Equipment:
													</Typography>
													<Typography 
														variant="body2" 
														sx={{ 
															color: '#111111',
															fontSize: '13px',
														}}
													>
														{formatEquipmentCompact(workout.workoutEquipment)}
													</Typography>
												</Box>
												
												{/* CTA Button */}
												<Button
													variant="contained"
													fullWidth
													onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
														e.preventDefault();
														router.push(`/workouts/${workout._id}`);
													}}
													sx={{
														borderRadius: '12px',
														textTransform: 'none',
														fontWeight: 600,
														fontSize: '14px',
														padding: '10px 16px',
														backgroundColor: '#E10600',
														'&:hover': {
															backgroundColor: '#C10500',
														},
														'&.Mui-disabled': {
															backgroundColor: '#E5E5E5',
															color: '#6B6B6B',
														},
													}}
												>
													View Workout
												</Button>
											</CardContent>
										</Card>
									);
								})}
							</Stack>
							
							{/* Pagination */}
							{totalPages > 1 && (
								<Box className={'pagination-section'} sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'center' }}>
									<Pagination
										count={totalPages}
										page={page}
										onChange={handlePageChange}
										color="primary"
										size="small"
										sx={{
											'& .MuiPaginationItem-root': {
												borderRadius: '16px',
												fontWeight: 500,
												'&.Mui-selected': {
													backgroundColor: '#E10600',
													color: '#FFFFFF',
												},
											},
										}}
									/>
								</Box>
							)}
						</>
					)}
				</Container>
				
				{/* Filter Drawer - Mobile */}
				<Drawer
					anchor="bottom"
					open={filterDrawerOpen}
					onClose={() => setFilterDrawerOpen(false)}
					PaperProps={{
						sx: {
							height: '90vh',
							borderRadius: '16px 16px 0 0',
						},
					}}
				>
					<Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
						{/* Drawer Header */}
						<Box sx={{ p: 3, borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Typography variant="h6" sx={{ fontWeight: 700, color: '#111111' }}>
								Filters
							</Typography>
							<IconButton onClick={() => setFilterDrawerOpen(false)}>
								<CloseIcon />
							</IconButton>
						</Box>
						
						{/* Drawer Content - Same as desktop */}
						<Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
							{/* Goal Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('goals')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Goal
									</Typography>
									{expandedSections.goals ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.goals}>
									<Stack spacing={1}>
										{Object.entries(goalToCategories).map(([goal, categories]) => (
											<FormControlLabel
												key={goal}
												control={
													<Checkbox
														checked={categories.some(cat => filters.goals.includes(cat))}
														onChange={(e) => {
															if (e.target.checked) {
																handleFilterChange('goals', [...filters.goals, ...categories.filter(c => !filters.goals.includes(c))]);
															} else {
																handleFilterChange('goals', filters.goals.filter(g => !categories.includes(g)));
															}
														}}
														sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
													/>
												}
												label={goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
											/>
										))}
									</Stack>
								</Collapse>
							</Box>
							
							<Divider sx={{ my: 2 }} />
							
							{/* Location Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('location')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Location
									</Typography>
									{expandedSections.location ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.location}>
									<Stack spacing={1}>
										{['HOME', 'GYM'].map((loc) => (
											<FormControlLabel
												key={loc}
												control={
													<Checkbox
														checked={filters.location.includes(loc as 'HOME' | 'GYM')}
														onChange={(e) => {
															if (e.target.checked) {
																handleFilterChange('location', [...filters.location, loc as 'HOME' | 'GYM']);
															} else {
																handleFilterChange('location', filters.location.filter(l => l !== loc));
															}
														}}
														sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
													/>
												}
												label={loc === 'HOME' ? 'Home' : 'Gym'}
											/>
										))}
									</Stack>
								</Collapse>
							</Box>
							
							<Divider sx={{ my: 2 }} />
							
							{/* Level Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('levels')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Level
									</Typography>
									{expandedSections.levels ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.levels}>
									<Stack spacing={1}>
										{Object.values(WorkoutDifficulty).map((level) => (
											<FormControlLabel
												key={level}
												control={
													<Checkbox
														checked={filters.levels.includes(level)}
														onChange={(e) => {
															if (e.target.checked) {
																handleFilterChange('levels', [...filters.levels, level]);
															} else {
																handleFilterChange('levels', filters.levels.filter(l => l !== level));
															}
														}}
														sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
													/>
												}
												label={formatDifficulty(level)}
											/>
										))}
									</Stack>
								</Collapse>
							</Box>
							
							<Divider sx={{ my: 2 }} />
							
							{/* Duration Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('durations')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Duration
									</Typography>
									{expandedSections.durations ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.durations}>
									<Stack spacing={1}>
										{Object.values(WorkoutDuration).map((duration) => (
											<FormControlLabel
												key={duration}
												control={
													<Checkbox
														checked={filters.durations.includes(duration)}
														onChange={(e) => {
															if (e.target.checked) {
																handleFilterChange('durations', [...filters.durations, duration]);
															} else {
																handleFilterChange('durations', filters.durations.filter(d => d !== duration));
															}
														}}
														sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
													/>
												}
												label={formatDuration(duration)}
											/>
										))}
									</Stack>
								</Collapse>
							</Box>
							
							<Divider sx={{ my: 2 }} />
							
							{/* Equipment Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('equipment')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Equipment
									</Typography>
									{expandedSections.equipment ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.equipment}>
									<Stack spacing={1}>
										{Object.values(WorkoutEquipment).map((eq) => (
											<FormControlLabel
												key={eq}
												control={
													<Checkbox
														checked={filters.equipment.includes(eq)}
														onChange={(e) => {
															if (e.target.checked) {
																handleFilterChange('equipment', [...filters.equipment, eq]);
															} else {
																handleFilterChange('equipment', filters.equipment.filter(e => e !== eq));
															}
														}}
														sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
													/>
												}
												label={formatEnumLabel(eq)}
											/>
										))}
									</Stack>
								</Collapse>
							</Box>
							
							<Divider sx={{ my: 2 }} />
							
							{/* Body Focus Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('bodyFocus')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Body Focus
									</Typography>
									{expandedSections.bodyFocus ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.bodyFocus}>
									<Stack spacing={1}>
										{['FULL_BODY', 'UPPER', 'LOWER', 'CORE'].map((focus) => {
											const muscleGroups = bodyFocusToMuscleGroups[focus] || [];
											return (
												<FormControlLabel
													key={focus}
													control={
														<Checkbox
															checked={muscleGroups.some(mg => filters.bodyFocus.includes(mg))}
															onChange={(e) => {
																if (e.target.checked) {
																	handleFilterChange('bodyFocus', [...filters.bodyFocus, ...muscleGroups.filter(mg => !filters.bodyFocus.includes(mg))]);
																} else {
																	handleFilterChange('bodyFocus', filters.bodyFocus.filter(bf => !muscleGroups.includes(bf)));
																}
															}}
															sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
														/>
													}
													label={focus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
												/>
											);
										})}
									</Stack>
								</Collapse>
							</Box>
							
							<Divider sx={{ my: 2 }} />
							
							{/* Rating Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('rating')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Rating
									</Typography>
									{expandedSections.rating ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.rating}>
									<Stack spacing={1}>
										{[4.0, 4.5].map((rating) => (
											<FormControlLabel
												key={rating}
												control={
													<Checkbox
														checked={filters.minRating === rating}
														onChange={(e) => {
															handleFilterChange('minRating', e.target.checked ? rating : null);
														}}
														sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
													/>
												}
												label={`${rating}+ Stars`}
											/>
										))}
									</Stack>
								</Collapse>
							</Box>
						</Box>
						
						{/* Drawer Footer */}
						<Box sx={{ p: 3, borderTop: '1px solid #E5E5E5', display: 'flex', gap: 2 }}>
							<Button
								variant="outlined"
								fullWidth
								onClick={handleClearAllFilters}
								sx={{
									borderRadius: '16px',
									textTransform: 'none',
									fontWeight: 600,
									borderColor: '#E5E5E5',
									color: '#111111',
									'&:hover': {
										borderColor: '#E10600',
										color: '#E10600',
									},
								}}
							>
								Clear All
							</Button>
							<Button
								variant="contained"
								fullWidth
								onClick={handleApplyFilters}
								sx={{
									borderRadius: '16px',
									textTransform: 'none',
									fontWeight: 600,
									backgroundColor: '#E10600',
									'&:hover': {
										backgroundColor: '#C10500',
									},
								}}
							>
								Apply Filters
							</Button>
						</Box>
					</Box>
				</Drawer>
			</Stack>
		);
	} else {
		return (
			<Stack className={'workouts-page'}>
				<Container maxWidth="xl" className={'workouts-container'}>
					{/* Page Header */}
					<Box className={'page-header'}>
						<Typography variant="h1" className={'page-title'}>
							Workouts
						</Typography>
						<Typography variant="body1" className={'page-subtitle'}>
							Find workouts that match your goal, level, and equipment.
						</Typography>
					</Box>

					{/* Search Bar */}
					<Box className={'search-section'}>
						<TextField
							fullWidth
							placeholder="Search workouts, exercises, trainers..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className={'search-input'}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon sx={{ color: '#6B6B6B' }} />
									</InputAdornment>
								),
							}}
						/>
					</Box>

					{/* Filter Button and Active Filter Chips */}
					<Box className={'filters-header'}>
						{getWorkoutsLoading ? (
							<Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
								<Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: '16px' }} />
								{[1, 2, 3].map((i) => (
									<Skeleton key={i} variant="rectangular" width={80} height={32} sx={{ borderRadius: '16px' }} />
								))}
							</Stack>
						) : (
							<Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
								<Button
									variant={filterDrawerOpen ? 'contained' : 'outlined'}
									startIcon={<FilterListIcon />}
									onClick={() => setFilterDrawerOpen(true)}
									className={'filter-toggle-btn'}
									sx={{
										borderRadius: '16px',
										textTransform: 'none',
										fontWeight: 600,
										borderColor: '#E5E5E5',
										'&:hover': {
											borderColor: '#E10600',
										},
										'&.MuiButton-contained': {
											backgroundColor: '#E10600',
											color: '#FFFFFF',
											'&:hover': {
												backgroundColor: '#C10500',
											},
										},
									}}
								>
									Filters
									{getFilterChips().length > 0 && (
										<Chip
											label={getFilterChips().length}
											size="small"
											sx={{
												ml: 1,
												height: 20,
												minWidth: 20,
												fontSize: '11px',
												backgroundColor: filterDrawerOpen ? 'rgba(255,255,255,0.3)' : '#E10600',
												color: '#FFFFFF',
											}}
										/>
									)}
								</Button>
								
								{getFilterChips().length > 0 && (
									<>
										{getFilterChips().map((chip, index) => (
											<Chip
												key={index}
												label={chip.label}
												onDelete={() => handleRemoveFilter(chip.type, chip.value)}
												deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
												className={'active-filter-chip'}
												sx={{
													borderRadius: '16px',
													fontWeight: 500,
													backgroundColor: '#E10600',
													color: '#FFFFFF',
													'& .MuiChip-deleteIcon': {
														color: '#FFFFFF',
														'&:hover': {
															color: '#FFFFFF',
														},
													},
												}}
											/>
										))}
										<Button
											variant="text"
											onClick={handleClearAllFilters}
											sx={{
												textTransform: 'none',
												color: '#6B6B6B',
												fontSize: '14px',
												fontWeight: 500,
												'&:hover': {
													backgroundColor: 'transparent',
													color: '#E10600',
												},
											}}
										>
											Clear all
										</Button>
									</>
								)}
							</Stack>
						)}
					</Box>

					{/* Error Banner - shown only when there's an error */}
					{showErrorBanner && (
						<Alert severity="error" sx={{ mb: 3, borderRadius: '16px' }}>
							Unable to load workouts. Please try again later.
						</Alert>
					)}

					{/* Category Tabs */}
					<Box className={'category-tabs-section'}>
						{getWorkoutsLoading ? (
							<Box sx={{ display: 'flex', gap: 1, p: 1, flexWrap: 'wrap' }}>
								{[1, 2, 3, 4, 5, 6].map((i) => (
									<Skeleton key={i} variant="rectangular" width={120} height={56} sx={{ borderRadius: '12px' }} />
								))}
							</Box>
						) : (
							<Tabs 
								value={tabValue} 
								onChange={handleTabChange} 
								className={'category-tabs'}
								variant="scrollable"
								scrollButtons="auto"
							>
								<Tab label="All" />
								<Tab label="Fat Loss" icon={<LocalFireDepartmentIcon />} iconPosition="start" />
								<Tab label="Muscle Gain" icon={<TrendingUpIcon />} iconPosition="start" />
								<Tab label="Strength" icon={<FitnessCenterIcon />} iconPosition="start" />
								<Tab label="Home" icon={<HomeIcon />} iconPosition="start" />
								<Tab label="Gym" icon={<FitnessCenterIcon />} iconPosition="start" />
							</Tabs>
						)}
					</Box>

					{/* Workout Match Score */}
					{calculateMatchScore && !getWorkoutsLoading && (
						<Box
							sx={{
								mb: 3,
								p: 2.5,
								backgroundColor: '#FFFFFF',
								borderRadius: '16px',
								border: '1px solid #E5E5E5',
								boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								flexWrap: 'wrap',
								gap: 2,
							}}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box
									sx={{
										width: 64,
										height: 64,
										borderRadius: '50%',
										background: `linear-gradient(135deg, #E10600 0%, #C10500 100%)`,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										flexShrink: 0,
									}}
								>
									<Typography
										variant="h5"
										sx={{
											fontWeight: 800,
											color: '#FFFFFF',
											fontSize: '24px',
										}}
									>
										{calculateMatchScore.score}%
									</Typography>
								</Box>
								<Box>
									<Typography
										variant="h6"
										sx={{
											fontWeight: 700,
											color: '#111111',
											fontSize: '18px',
											mb: 0.5,
										}}
									>
										Your Match
									</Typography>
									<Typography
										variant="body2"
										sx={{
											color: '#6B6B6B',
											fontSize: '14px',
										}}
									>
										{calculateMatchScore.reason}
									</Typography>
								</Box>
							</Box>
						</Box>
					)}

					{/* Results Grid */}
					<Box className={'results-section'}>
						{getWorkoutsLoading ? (
							<>
								{/* Skeleton Tabs */}
								<Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
									{[1, 2, 3, 4, 5, 6].map((i) => (
										<Skeleton key={i} variant="rectangular" width={120} height={40} sx={{ borderRadius: '16px' }} />
									))}
								</Box>
								
								{/* Skeleton Filter Chips */}
								<Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
									{[1, 2, 3].map((i) => (
										<Skeleton key={i} variant="rectangular" width={80} height={32} sx={{ borderRadius: '16px' }} />
									))}
								</Box>
								
								{/* Skeleton Cards */}
								<Grid container spacing={3}>
									{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
										<Grid item xs={12} sm={6} md={4} lg={3} key={i}>
											<Card 
												sx={{
													borderRadius: '16px',
													boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
													border: '1px solid #E5E5E5',
													overflow: 'hidden',
												}}
											>
												<Skeleton variant="rectangular" height={200} />
												<CardContent sx={{ p: 2.5 }}>
													<Skeleton variant="text" height={28} width="80%" />
													<Skeleton variant="text" height={20} width="60%" sx={{ mt: 1.5 }} />
													<Stack direction="row" spacing={1} sx={{ mt: 1.5, mb: 1.5 }}>
														<Skeleton variant="circular" width={32} height={32} />
														<Skeleton variant="text" height={20} width={100} />
													</Stack>
													<Skeleton variant="text" height={18} width="40%" sx={{ mt: 1.5 }} />
													<Skeleton variant="text" height={16} width="60%" sx={{ mt: 1 }} />
													<Skeleton variant="rectangular" height={40} sx={{ mt: 2, borderRadius: '12px' }} />
												</CardContent>
											</Card>
										</Grid>
									))}
								</Grid>
							</>
						) : filteredWorkouts.length === 0 && !getWorkoutsLoading ? (
							<>
								{/* Empty State */}
								<Box 
									sx={{ 
										textAlign: 'center', 
										padding: { xs: 4, md: 6 },
										mb: 4,
									}}
								>
									<FitnessCenterIcon sx={{ fontSize: { xs: 64, md: 80 }, color: '#E5E5E5', mb: 3 }} />
									<Typography 
										variant="h4" 
										sx={{ 
											color: '#111111', 
											fontWeight: 700, 
											mb: 1.5,
											fontSize: { xs: '24px', md: '32px' },
										}}
									>
										No workouts found
									</Typography>
									<Typography 
										variant="body1" 
										sx={{ 
											color: '#6B6B6B', 
											mb: 4,
											fontSize: { xs: '14px', md: '16px' },
										}}
									>
										{getWorkoutsError 
											? 'Unable to load workouts. Please try again later.' 
											: 'Try clearing filters or adjusting your search criteria.'}
									</Typography>
									<Stack 
										direction={{ xs: 'column', sm: 'row' }} 
										spacing={2} 
										justifyContent="center"
										sx={{ mb: 6 }}
									>
										<Button
											variant="outlined"
											onClick={handleClearAllFilters}
											sx={{
												borderRadius: '16px',
												textTransform: 'none',
												fontWeight: 600,
												padding: '12px 24px',
												borderColor: '#E5E5E5',
												color: '#111111',
												'&:hover': {
													borderColor: '#E10600',
													color: '#E10600',
													backgroundColor: 'rgba(225, 6, 0, 0.04)',
												},
											}}
										>
											Clear Filters
										</Button>
										<Button
											variant="contained"
											onClick={() => {
												handleClearAllFilters();
												setTabValue(0);
											}}
											sx={{
												borderRadius: '16px',
												textTransform: 'none',
												fontWeight: 600,
												padding: '12px 24px',
												backgroundColor: '#E10600',
												'&:hover': {
													backgroundColor: '#C10500',
												},
											}}
										>
											Browse All Workouts
										</Button>
									</Stack>
								</Box>
								
								{/* Suggested Workouts */}
								{suggestedWorkouts.length > 0 && (
									<Box sx={{ mt: 4 }}>
										<Typography 
											variant="h5" 
											sx={{ 
												fontWeight: 700,
												color: '#111111',
												mb: 3,
												fontSize: { xs: '20px', md: '24px' },
											}}
										>
											Suggested Workouts
										</Typography>
										<Grid container spacing={3}>
											{suggestedWorkouts.map((workout: Workout) => {
												const workoutImageUrl = getWorkoutImageUrl(workout.workoutImage);
												
												return (
													<Grid item xs={12} sm={6} md={4} lg={3} key={workout._id}>
														<Card 
															sx={{
																height: '100%',
																display: 'flex',
																flexDirection: 'column',
																borderRadius: '16px',
																boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
																border: '1px solid #E5E5E5',
																transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
																overflow: 'hidden',
																'&:hover': {
																	transform: 'translateY(-4px)',
																	boxShadow: '0 8px 24px rgba(225, 6, 0, 0.12)',
																	borderColor: '#E10600',
																},
															}}
														>
															<Link href={`/workouts/${workout._id}`} style={{ textDecoration: 'none' }}>
																<CardMedia
																	component="div"
																	sx={{
																		height: 200,
																		backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), url(${workoutImageUrl})`,
																		backgroundSize: 'cover',
																		backgroundPosition: 'center',
																		position: 'relative',
																	}}
																>
																	<Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
																		<Chip
																			label={formatCategory(workout.workoutCategory)}
																			size="small"
																			sx={{
																				backgroundColor: '#E10600',
																				color: '#FFFFFF',
																				fontWeight: 600,
																				fontSize: '11px',
																				height: 24,
																			}}
																		/>
																		<Chip
																			label={formatDifficulty(workout.workoutDifficulty)}
																			size="small"
																			sx={{
																				backgroundColor: 'rgba(255, 255, 255, 0.95)',
																				color: '#111111',
																				fontWeight: 600,
																				fontSize: '11px',
																				height: 24,
																			}}
																		/>
																		<Chip
																			label={`${formatDurationMinutes(workout.workoutDuration)} min`}
																			size="small"
																			icon={<AccessTimeIcon sx={{ fontSize: 12, color: '#6B6B6B' }} />}
																			sx={{
																				backgroundColor: 'rgba(255, 255, 255, 0.95)',
																				color: '#111111',
																				fontWeight: 500,
																				fontSize: '11px',
																				height: 24,
																			}}
																		/>
																	</Box>
																</CardMedia>
															</Link>
															<CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
																<Typography 
																	variant="h6" 
																	sx={{ 
																		fontWeight: 700,
																		color: '#111111',
																		fontSize: '18px',
																		lineHeight: 1.3,
																		mb: 1.5,
																		minHeight: 46,
																	}}
																>
																	{workout.workoutTitle}
																</Typography>
																{workout.memberData && (
																	<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
																		<Avatar
																			src={getTrainerAvatarUrl(workout.memberData)}
																			alt={workout.memberData.memberFullName || workout.memberData.memberNick}
																			sx={{ width: 32, height: 32 }}
																		/>
																		<Typography 
																			variant="caption" 
																			sx={{ 
																				color: '#6B6B6B',
																				fontSize: '13px',
																				fontWeight: 500,
																			}}
																		>
																			{workout.memberData.memberFullName || workout.memberData.memberNick}
																		</Typography>
																	</Stack>
																)}
																<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
																	<StarIcon sx={{ fontSize: 18, color: '#E10600' }} />
																	<Typography 
																		variant="body2" 
																		sx={{ 
																			fontWeight: 600,
																			color: '#111111',
																			fontSize: '14px',
																		}}
																	>
																		{workout.workoutRating?.toFixed(1) || '0.0'}
																	</Typography>
																	<Typography 
																		variant="caption" 
																		sx={{ 
																			color: '#6B6B6B',
																			fontSize: '12px',
																		}}
																	>
																		({workout.workoutComments || 0} reviews)
																	</Typography>
																</Stack>
																<Box sx={{ mb: 2, flex: 1 }}>
																	<Typography 
																		variant="caption" 
																		sx={{ 
																			color: '#6B6B6B',
																			fontSize: '12px',
																			fontWeight: 500,
																			display: 'block',
																			mb: 0.5,
																		}}
																	>
																		Equipment:
																	</Typography>
																	<Typography 
																		variant="body2" 
																		sx={{ 
																			color: '#111111',
																			fontSize: '13px',
																		}}
																	>
																		{formatEquipmentCompact(workout.workoutEquipment)}
																	</Typography>
																</Box>
																<Button
																	variant="contained"
																	fullWidth
																	onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
																		e.preventDefault();
																		router.push(`/workouts/${workout._id}`);
																	}}
																	sx={{
																		borderRadius: '12px',
																		textTransform: 'none',
																		fontWeight: 600,
																		fontSize: '14px',
																		padding: '10px 16px',
																		backgroundColor: '#E10600',
																		'&:hover': {
																			backgroundColor: '#C10500',
																		},
																		'&.Mui-disabled': {
																			backgroundColor: '#E5E5E5',
																			color: '#6B6B6B',
																		},
																	}}
																>
																	View Workout
																</Button>
															</CardContent>
														</Card>
													</Grid>
												);
											})}
										</Grid>
									</Box>
								)}
							</>
						) : (
							<>
								<Grid container spacing={3}>
									{filteredWorkouts.map((workout: Workout) => {
										const workoutImageUrl = getWorkoutImageUrl(workout.workoutImage);
										
										return (
											<Grid item xs={12} sm={6} md={4} lg={3} key={workout._id}>
												<Card 
													className={'workout-card'}
													sx={{
														height: '100%',
														display: 'flex',
														flexDirection: 'column',
														borderRadius: '16px',
														boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
														border: '1px solid #E5E5E5',
														transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
														overflow: 'hidden',
														'&:hover': {
															transform: 'translateY(-4px)',
															boxShadow: '0 8px 24px rgba(225, 6, 0, 0.12)',
															borderColor: '#E10600',
														},
													}}
												>
													{/* Thumbnail Image */}
													<Link href={`/workouts/${workout._id}`} style={{ textDecoration: 'none' }}>
														<CardMedia
															component="div"
															sx={{
																height: 200,
																backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), url(${workoutImageUrl})`,
																backgroundSize: 'cover',
																backgroundPosition: 'center',
																position: 'relative',
															}}
														>
															{/* Tags Overlay */}
															<Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
																<Chip
																	label={formatCategory(workout.workoutCategory)}
																	size="small"
																	sx={{
																		backgroundColor: '#E10600',
																		color: '#FFFFFF',
																		fontWeight: 600,
																		fontSize: '11px',
																		height: 24,
																	}}
																/>
																<Chip
																	label={formatDifficulty(workout.workoutDifficulty)}
																	size="small"
																	sx={{
																		backgroundColor: 'rgba(255, 255, 255, 0.95)',
																		color: '#111111',
																		fontWeight: 600,
																		fontSize: '11px',
																		height: 24,
																	}}
																/>
																<Chip
																	label={`${formatDurationMinutes(workout.workoutDuration)} min`}
																	size="small"
																	icon={<AccessTimeIcon sx={{ fontSize: 12, color: '#6B6B6B' }} />}
																	sx={{
																		backgroundColor: 'rgba(255, 255, 255, 0.95)',
																		color: '#111111',
																		fontWeight: 500,
																		fontSize: '11px',
																		height: 24,
																	}}
																/>
															</Box>
														</CardMedia>
													</Link>
													
													{/* Card Content */}
													<CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
														{/* Workout Title */}
														<Typography 
															variant="h6" 
															sx={{ 
																fontWeight: 700,
																color: '#111111',
																fontSize: '18px',
																lineHeight: 1.3,
																mb: 1.5,
																minHeight: 46,
															}}
														>
															{workout.workoutTitle}
														</Typography>
														
														{/* Trainer Info */}
														{workout.memberData && (
															<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
																<Avatar
																	src={getTrainerAvatarUrl(workout.memberData)}
																	alt={workout.memberData.memberFullName || workout.memberData.memberNick}
																	sx={{ width: 32, height: 32 }}
																/>
																<Typography 
																	variant="caption" 
																	sx={{ 
																		color: '#6B6B6B',
																		fontSize: '13px',
																		fontWeight: 500,
																	}}
																>
																	{workout.memberData.memberFullName || workout.memberData.memberNick}
																</Typography>
															</Stack>
														)}
														
														{/* Rating and Reviews */}
														<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
															<StarIcon sx={{ fontSize: 18, color: '#E10600' }} />
															<Typography 
																variant="body2" 
																sx={{ 
																	fontWeight: 600,
																	color: '#111111',
																	fontSize: '14px',
																}}
															>
																{workout.workoutRating?.toFixed(1) || '0.0'}
															</Typography>
															<Typography 
																variant="caption" 
																sx={{ 
																	color: '#6B6B6B',
																	fontSize: '12px',
																}}
															>
																({workout.workoutComments || 0} reviews)
															</Typography>
														</Stack>
														
														{/* Equipment List */}
														<Box sx={{ mb: 2, flex: 1 }}>
															<Typography 
																variant="caption" 
																sx={{ 
																	color: '#6B6B6B',
																	fontSize: '12px',
																	fontWeight: 500,
																	display: 'block',
																	mb: 0.5,
																}}
															>
																Equipment:
															</Typography>
															<Typography 
																variant="body2" 
																sx={{ 
																	color: '#111111',
																	fontSize: '13px',
																}}
															>
																{formatEquipmentCompact(workout.workoutEquipment)}
															</Typography>
														</Box>
														
														{/* CTA Button */}
														<Button
															variant="contained"
															fullWidth
													onClick={(e: React.MouseEvent) => {
														e.preventDefault();
														router.push(`/workouts/${workout._id}`);
													}}
															sx={{
																borderRadius: '12px',
																textTransform: 'none',
																fontWeight: 600,
																fontSize: '14px',
																padding: '10px 16px',
																backgroundColor: '#E10600',
																'&:hover': {
																	backgroundColor: '#C10500',
																},
																'&.Mui-disabled': {
																	backgroundColor: '#E5E5E5',
																	color: '#6B6B6B',
																},
															}}
														>
															View Workout
														</Button>
													</CardContent>
												</Card>
											</Grid>
										);
									})}
								</Grid>
								
								{/* Pagination */}
								{totalPages > 1 && (
									<Box className={'pagination-section'}>
										<Pagination
											count={totalPages}
											page={page}
											onChange={handlePageChange}
											color="primary"
											sx={{
												'& .MuiPaginationItem-root': {
													borderRadius: '16px',
													fontWeight: 500,
													'&.Mui-selected': {
														backgroundColor: '#E10600',
														color: '#FFFFFF',
														'&:hover': {
															backgroundColor: '#C10500',
														},
													},
												},
											}}
										/>
									</Box>
								)}
							</>
						)}
					</Box>
				</Container>
				
				{/* Filter Drawer */}
				<Drawer
					anchor="right"
					open={filterDrawerOpen}
					onClose={() => setFilterDrawerOpen(false)}
					PaperProps={{
						sx: {
							width: { xs: '100%', sm: 400 },
							padding: 0,
						},
					}}
				>
					<Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
						{/* Drawer Header */}
						<Box sx={{ p: 3, borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Typography variant="h6" sx={{ fontWeight: 700, color: '#111111' }}>
								Filters
							</Typography>
							<IconButton onClick={() => setFilterDrawerOpen(false)}>
								<CloseIcon />
							</IconButton>
						</Box>
						
						{/* Drawer Content */}
						<Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
							{/* Goal Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('goals')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Goal
									</Typography>
									{expandedSections.goals ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.goals}>
									<Stack spacing={1}>
										{Object.entries(goalToCategories).map(([goal, categories]) => (
											<FormControlLabel
												key={goal}
												control={
													<Checkbox
														checked={categories.some(cat => filters.goals.includes(cat))}
														onChange={(e) => {
															if (e.target.checked) {
																handleFilterChange('goals', [...filters.goals, ...categories.filter(c => !filters.goals.includes(c))]);
															} else {
																handleFilterChange('goals', filters.goals.filter(g => !categories.includes(g)));
															}
														}}
														sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
													/>
												}
												label={goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
											/>
										))}
									</Stack>
								</Collapse>
							</Box>
							
							<Divider sx={{ my: 2 }} />
							
							{/* Location Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('location')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Location
									</Typography>
									{expandedSections.location ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.location}>
									<Stack spacing={1}>
										{['HOME', 'GYM'].map((loc) => (
											<FormControlLabel
												key={loc}
												control={
													<Checkbox
														checked={filters.location.includes(loc as 'HOME' | 'GYM')}
														onChange={(e) => {
															if (e.target.checked) {
																handleFilterChange('location', [...filters.location, loc as 'HOME' | 'GYM']);
															} else {
																handleFilterChange('location', filters.location.filter(l => l !== loc));
															}
														}}
														sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
													/>
												}
												label={loc === 'HOME' ? 'Home' : 'Gym'}
											/>
										))}
									</Stack>
								</Collapse>
							</Box>
							
							<Divider sx={{ my: 2 }} />
							
							{/* Level Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('levels')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Level
									</Typography>
									{expandedSections.levels ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.levels}>
									<Stack spacing={1}>
										{Object.values(WorkoutDifficulty).map((level) => (
											<FormControlLabel
												key={level}
												control={
													<Checkbox
														checked={filters.levels.includes(level)}
														onChange={(e) => {
															if (e.target.checked) {
																handleFilterChange('levels', [...filters.levels, level]);
															} else {
																handleFilterChange('levels', filters.levels.filter(l => l !== level));
															}
														}}
														sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
													/>
												}
												label={formatDifficulty(level)}
											/>
										))}
									</Stack>
								</Collapse>
							</Box>
							
							<Divider sx={{ my: 2 }} />
							
							{/* Duration Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('durations')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Duration
									</Typography>
									{expandedSections.durations ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.durations}>
									<Stack spacing={1}>
										{Object.values(WorkoutDuration).map((duration) => (
											<FormControlLabel
												key={duration}
												control={
													<Checkbox
														checked={filters.durations.includes(duration)}
														onChange={(e) => {
															if (e.target.checked) {
																handleFilterChange('durations', [...filters.durations, duration]);
															} else {
																handleFilterChange('durations', filters.durations.filter(d => d !== duration));
															}
														}}
														sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
													/>
												}
												label={formatDuration(duration)}
											/>
										))}
									</Stack>
								</Collapse>
							</Box>
							
							<Divider sx={{ my: 2 }} />
							
							{/* Equipment Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('equipment')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Equipment
									</Typography>
									{expandedSections.equipment ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.equipment}>
									<Stack spacing={1}>
										{Object.values(WorkoutEquipment).map((eq) => (
											<FormControlLabel
												key={eq}
												control={
													<Checkbox
														checked={filters.equipment.includes(eq)}
														onChange={(e) => {
															if (e.target.checked) {
																handleFilterChange('equipment', [...filters.equipment, eq]);
															} else {
																handleFilterChange('equipment', filters.equipment.filter(e => e !== eq));
															}
														}}
														sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
													/>
												}
												label={formatEnumLabel(eq)}
											/>
										))}
									</Stack>
								</Collapse>
							</Box>
							
							<Divider sx={{ my: 2 }} />
							
							{/* Body Focus Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('bodyFocus')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Body Focus
									</Typography>
									{expandedSections.bodyFocus ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.bodyFocus}>
									<Stack spacing={1}>
										{['FULL_BODY', 'UPPER', 'LOWER', 'CORE'].map((focus) => {
											const muscleGroups = bodyFocusToMuscleGroups[focus] || [];
											return (
												<FormControlLabel
													key={focus}
													control={
														<Checkbox
															checked={muscleGroups.some(mg => filters.bodyFocus.includes(mg))}
															onChange={(e) => {
																if (e.target.checked) {
																	handleFilterChange('bodyFocus', [...filters.bodyFocus, ...muscleGroups.filter(mg => !filters.bodyFocus.includes(mg))]);
																} else {
																	handleFilterChange('bodyFocus', filters.bodyFocus.filter(bf => !muscleGroups.includes(bf)));
																}
															}}
															sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
														/>
													}
													label={focus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
												/>
											);
										})}
									</Stack>
								</Collapse>
							</Box>
							
							<Divider sx={{ my: 2 }} />
							
							{/* Rating Filter */}
							<Box sx={{ mb: 3 }}>
								<Button
									fullWidth
									onClick={() => toggleSection('rating')}
									sx={{
										justifyContent: 'space-between',
										textTransform: 'none',
										color: '#111111',
										fontWeight: 600,
										p: 0,
										mb: 2,
									}}
								>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Rating
									</Typography>
									{expandedSections.rating ? <ExpandLessIcon /> : <ExpandMoreIcon />}
								</Button>
								<Collapse in={expandedSections.rating}>
									<Stack spacing={1}>
										{[4.0, 4.5].map((rating) => (
											<FormControlLabel
												key={rating}
												control={
													<Checkbox
														checked={filters.minRating === rating}
														onChange={(e) => {
															handleFilterChange('minRating', e.target.checked ? rating : null);
														}}
														sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
													/>
												}
												label={`${rating}+ Stars`}
											/>
										))}
									</Stack>
								</Collapse>
							</Box>
						</Box>
						
						{/* Drawer Footer */}
						<Box sx={{ p: 3, borderTop: '1px solid #E5E5E5', display: 'flex', gap: 2 }}>
							<Button
								variant="outlined"
								fullWidth
								onClick={handleClearAllFilters}
								sx={{
									borderRadius: '16px',
									textTransform: 'none',
									fontWeight: 600,
									borderColor: '#E5E5E5',
									color: '#111111',
									'&:hover': {
										borderColor: '#E10600',
										color: '#E10600',
									},
								}}
							>
								Clear All
							</Button>
							<Button
								variant="contained"
								fullWidth
								onClick={handleApplyFilters}
								sx={{
									borderRadius: '16px',
									textTransform: 'none',
									fontWeight: 600,
									backgroundColor: '#E10600',
									'&:hover': {
										backgroundColor: '#C10500',
									},
								}}
							>
								Apply Filters
							</Button>
						</Box>
					</Box>
				</Drawer>
			</Stack>
		);
	}
};

export default withLayoutBasic(WorkoutsPage);






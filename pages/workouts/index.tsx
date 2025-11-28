import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Chip, Tabs, Tab, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HomeIcon from '@mui/icons-material/Home';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import { WorkoutDifficulty, WorkoutEquipment } from '../../libs/enums/workout.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Workout Program Types
type WorkoutGoal = 'FAT_LOSS' | 'MUSCLE_GAIN' | 'STRENGTH' | 'HOME' | 'GYM';
type ProgramDuration = 4 | 8;

interface WorkoutProgram {
	id: string;
	title: string;
	duration: ProgramDuration;
	difficulty: WorkoutDifficulty;
	goal: WorkoutGoal;
	equipment: WorkoutEquipment[];
	thumbnail: string;
	rating: number;
	views: number;
	completions: number;
	sampleWorkouts: string[];
	description: string;
}

// Sample workout programs data
const workoutPrograms: WorkoutProgram[] = [
	// Fat Loss Programs
	{
		id: '1',
		title: '4-Week Fat Loss Challenge',
		duration: 4,
		difficulty: WorkoutDifficulty.BEGINNER,
		goal: 'FAT_LOSS',
		equipment: [WorkoutEquipment.BODYWEIGHT, WorkoutEquipment.DUMBBELLS],
		thumbnail: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
		rating: 4.8,
		views: 2500,
		completions: 450,
		sampleWorkouts: ['HIIT Cardio', 'Full Body Circuit', 'Core Blast'],
		description: 'Intensive 4-week program designed to burn fat and boost metabolism',
	},
	{
		id: '2',
		title: '8-Week Fat Loss Transformation',
		duration: 8,
		difficulty: WorkoutDifficulty.INTERMEDIATE,
		goal: 'FAT_LOSS',
		equipment: [WorkoutEquipment.FULL_GYM],
		thumbnail: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
		rating: 4.9,
		views: 3200,
		completions: 680,
		sampleWorkouts: ['Cardio Blast', 'Strength & Cardio', 'Metabolic Conditioning'],
		description: 'Comprehensive 8-week program combining strength and cardio for maximum fat loss',
	},
	// Muscle Gain Programs
	{
		id: '3',
		title: '4-Week Muscle Builder',
		duration: 4,
		difficulty: WorkoutDifficulty.BEGINNER,
		goal: 'MUSCLE_GAIN',
		equipment: [WorkoutEquipment.DUMBBELLS, WorkoutEquipment.BARBELL],
		thumbnail: '/img/bodybuilders/pexels-leonmart-1552108.jpg',
		rating: 4.7,
		views: 1800,
		completions: 320,
		sampleWorkouts: ['Upper Body Power', 'Lower Body Strength', 'Full Body Mass'],
		description: 'Beginner-friendly program to build lean muscle mass in 4 weeks',
	},
	{
		id: '4',
		title: '8-Week Advanced Muscle Gain',
		duration: 8,
		difficulty: WorkoutDifficulty.ADVANCED,
		goal: 'MUSCLE_GAIN',
		equipment: [WorkoutEquipment.FULL_GYM],
		thumbnail: '/img/bodybuilders/pexels-mralpha-13451637.jpg',
		rating: 4.9,
		views: 4100,
		completions: 890,
		sampleWorkouts: ['Push/Pull/Legs', 'Hypertrophy Focus', 'Progressive Overload'],
		description: 'Advanced 8-week program for serious muscle growth and strength',
	},
	// Strength Programs
	{
		id: '5',
		title: '4-Week Strength Foundation',
		duration: 4,
		difficulty: WorkoutDifficulty.BEGINNER,
		goal: 'STRENGTH',
		equipment: [WorkoutEquipment.BARBELL, WorkoutEquipment.DUMBBELLS],
		thumbnail: '/img/bodybuilders/pexels-mralpha-24809802.jpg',
		rating: 4.6,
		views: 1500,
		completions: 280,
		sampleWorkouts: ['Compound Movements', 'Strength Basics', 'Progressive Loading'],
		description: 'Build foundational strength with compound movements and proper form',
	},
	{
		id: '6',
		title: '8-Week Power & Strength',
		duration: 8,
		difficulty: WorkoutDifficulty.ADVANCED,
		goal: 'STRENGTH',
		equipment: [WorkoutEquipment.FULL_GYM],
		thumbnail: '/img/bodybuilders/pexels-oscar-machado-937103-3014237.jpg',
		rating: 4.8,
		views: 2800,
		completions: 520,
		sampleWorkouts: ['Powerlifting Focus', 'Olympic Lifts', 'Max Strength'],
		description: 'Advanced strength program focusing on powerlifting and maximum strength gains',
	},
	// Home Workouts
	{
		id: '7',
		title: '4-Week Home Bodyweight Challenge',
		duration: 4,
		difficulty: WorkoutDifficulty.BEGINNER,
		goal: 'HOME',
		equipment: [WorkoutEquipment.BODYWEIGHT],
		thumbnail: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
		rating: 4.7,
		views: 3600,
		completions: 720,
		sampleWorkouts: ['Bodyweight HIIT', 'Home Cardio', 'No Equipment Strength'],
		description: 'Complete bodyweight program you can do anywhere, no equipment needed',
	},
	{
		id: '8',
		title: '8-Week Home Fitness Program',
		duration: 8,
		difficulty: WorkoutDifficulty.INTERMEDIATE,
		goal: 'HOME',
		equipment: [WorkoutEquipment.BODYWEIGHT, WorkoutEquipment.DUMBBELLS, WorkoutEquipment.RESISTANCE_BAND],
		thumbnail: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
		rating: 4.8,
		views: 2900,
		completions: 580,
		sampleWorkouts: ['Home Strength', 'Minimal Equipment', 'Full Body Home'],
		description: 'Comprehensive home workout program with minimal equipment requirements',
	},
	// Gym Workouts
	{
		id: '9',
		title: '4-Week Gym Beginner Program',
		duration: 4,
		difficulty: WorkoutDifficulty.BEGINNER,
		goal: 'GYM',
		equipment: [WorkoutEquipment.FULL_GYM],
		thumbnail: '/img/bodybuilders/pexels-leonmart-1552108.jpg',
		rating: 4.6,
		views: 2200,
		completions: 410,
		sampleWorkouts: ['Machine Basics', 'Free Weights Intro', 'Gym Fundamentals'],
		description: 'Perfect introduction to gym training with proper form and technique',
	},
	{
		id: '10',
		title: '8-Week Gym Mastery',
		duration: 8,
		difficulty: WorkoutDifficulty.ADVANCED,
		goal: 'GYM',
		equipment: [WorkoutEquipment.FULL_GYM],
		thumbnail: '/img/bodybuilders/pexels-mralpha-13451637.jpg',
		rating: 4.9,
		views: 3800,
		completions: 850,
		sampleWorkouts: ['Advanced Split', 'Gym Power', 'Complete Gym Program'],
		description: 'Advanced gym program utilizing all equipment for maximum results',
	},
];

const WorkoutsPage: NextPage = () => {
	const device = useDeviceDetect();
	const [selectedGoal, setSelectedGoal] = useState<WorkoutGoal | 'ALL'>('ALL');
	const [selectedDifficulty, setSelectedDifficulty] = useState<WorkoutDifficulty | 'ALL'>('ALL');
	const [selectedDuration, setSelectedDuration] = useState<ProgramDuration | 'ALL'>('ALL');
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
		// Update goal filter based on tab
		if (newValue === 0) setSelectedGoal('ALL');
		else if (newValue === 1) setSelectedGoal('FAT_LOSS');
		else if (newValue === 2) setSelectedGoal('MUSCLE_GAIN');
		else if (newValue === 3) setSelectedGoal('STRENGTH');
		else if (newValue === 4) setSelectedGoal('HOME');
		else if (newValue === 5) setSelectedGoal('GYM');
	};

	// Sync tab with goal filter
	useEffect(() => {
		if (selectedGoal === 'ALL') setTabValue(0);
		else if (selectedGoal === 'FAT_LOSS') setTabValue(1);
		else if (selectedGoal === 'MUSCLE_GAIN') setTabValue(2);
		else if (selectedGoal === 'STRENGTH') setTabValue(3);
		else if (selectedGoal === 'HOME') setTabValue(4);
		else if (selectedGoal === 'GYM') setTabValue(5);
	}, [selectedGoal]);

	const formatGoal = (goal: WorkoutGoal) => {
		return goal.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const formatDifficulty = (difficulty: WorkoutDifficulty) => {
		return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
	};

	const formatEquipment = (equipment: WorkoutEquipment[]) => {
		if (equipment.length === 0) return 'No Equipment';
		if (equipment.length === 1) return equipment[0].replace(/_/g, ' ');
		return `${equipment.length} types`;
	};

	const filteredPrograms = workoutPrograms.filter((program) => {
		if (selectedGoal !== 'ALL' && program.goal !== selectedGoal) return false;
		if (selectedDifficulty !== 'ALL' && program.difficulty !== selectedDifficulty) return false;
		if (selectedDuration !== 'ALL' && program.duration !== selectedDuration) return false;
		return true;
	});

	if (device === 'mobile') {
		return (
			<Stack className={'workouts-page'}>
				<Stack className={'container'}>
					<Typography variant="h4" className={'page-title'}>Workout Programs</Typography>
					<div>MOBILE WORKOUTS PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'workouts-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'}>
						<Typography variant="h2" className={'page-title'}>
							Workout Programs
						</Typography>
						<Typography variant="h6" className={'page-subtitle'}>
							Structured training programs designed to help you achieve your fitness goals
						</Typography>
					</Stack>

					{/* Goal-Based Tabs */}
					<Box className={'goal-tabs-section'}>
						<Tabs value={tabValue} onChange={handleTabChange} className={'goal-tabs'}>
							<Tab label="All Programs" />
							<Tab label="Fat Loss" icon={<LocalFireDepartmentIcon />} iconPosition="start" />
							<Tab label="Muscle Gain" icon={<TrendingUpIcon />} iconPosition="start" />
							<Tab label="Strength" icon={<FitnessCenterIcon />} iconPosition="start" />
							<Tab label="Home Workouts" icon={<HomeIcon />} iconPosition="start" />
							<Tab label="Gym Workouts" icon={<FitnessCenterIcon />} iconPosition="start" />
						</Tabs>
					</Box>

					{/* Filter Section */}
					<Box className={'filters-section'}>
						<Stack direction="row" spacing={2} flexWrap="wrap">
							<Chip
								label={selectedDifficulty === 'ALL' ? 'All Levels' : formatDifficulty(selectedDifficulty)}
								onClick={() => {
									const difficulties = [WorkoutDifficulty.BEGINNER, WorkoutDifficulty.INTERMEDIATE, WorkoutDifficulty.ADVANCED];
									const currentIndex = difficulties.indexOf(selectedDifficulty as WorkoutDifficulty);
									const nextIndex = (currentIndex + 1) % (difficulties.length + 1);
									setSelectedDifficulty(nextIndex === 0 ? 'ALL' : difficulties[nextIndex - 1]);
								}}
								variant={selectedDifficulty !== 'ALL' ? 'filled' : 'outlined'}
								className={'filter-chip'}
							/>
							<Chip
								label={selectedDuration === 'ALL' ? 'All Durations' : `${selectedDuration}-Week`}
								onClick={() => {
									const durations: (ProgramDuration | 'ALL')[] = ['ALL', 4, 8];
									const currentIndex = durations.indexOf(selectedDuration);
									const nextIndex = (currentIndex + 1) % durations.length;
									setSelectedDuration(durations[nextIndex]);
								}}
								variant={selectedDuration !== 'ALL' ? 'filled' : 'outlined'}
								className={'filter-chip'}
							/>
						</Stack>
					</Box>

					{/* Programs Grid */}
					<Box className={'programs-section'}>
						{filteredPrograms.length === 0 ? (
							<Box className={'empty-state'}>
								<Typography variant="h6">No programs found</Typography>
								<Typography variant="body2">Try adjusting your filters.</Typography>
							</Box>
						) : (
							<Grid container spacing={3}>
								{filteredPrograms.map((program) => (
									<Grid item xs={12} sm={6} md={4} key={program.id}>
										<Link href={`/workouts/${program.id}`}>
											<Card className={'program-card'}>
												<CardMedia
													component="div"
													className={'program-thumbnail'}
													style={{
														backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(${program.thumbnail})`,
														backgroundSize: 'cover',
														backgroundPosition: 'center',
													}}
												>
													<Box className={'thumbnail-overlay'}>
														<IconButton className={'play-btn'}>
															<PlayArrowIcon />
														</IconButton>
													</Box>
													<Box className={'program-badges'}>
														<Chip
															label={`${program.duration}-Week`}
															size="small"
															className={'duration-badge'}
														/>
														<Chip
															label={formatDifficulty(program.difficulty)}
															size="small"
															className={'difficulty-badge'}
														/>
													</Box>
												</CardMedia>
												<CardContent>
													<Typography variant="h5" className={'program-title'} gutterBottom>
														{program.title}
													</Typography>
													<Typography variant="body2" className={'program-description'} mb={2}>
														{program.description}
													</Typography>
													<Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
														<Chip
															label={formatGoal(program.goal)}
															size="small"
															className={'goal-chip'}
														/>
														<Chip
															icon={<FitnessCenterIcon />}
															label={formatEquipment(program.equipment)}
															size="small"
															className={'equipment-chip'}
														/>
													</Stack>
													<Grid container spacing={2} mb={2}>
														<Grid item xs={6}>
															<Box className={'program-stat'}>
																<Stack direction="row" alignItems="center" spacing={0.5}>
																	<StarIcon className={'stat-icon'} />
																	<Typography variant="body2" className={'stat-value'}>
																		{program.rating}
																	</Typography>
																</Stack>
															</Box>
														</Grid>
														<Grid item xs={6}>
															<Box className={'program-stat'}>
																<Typography variant="body2" className={'stat-value'}>
																	{program.completions} completed
																</Typography>
															</Box>
														</Grid>
													</Grid>
													{program.sampleWorkouts.length > 0 && (
														<Box className={'sample-workouts'}>
															<Typography variant="caption" className={'sample-label'} gutterBottom>
																Sample Workouts:
															</Typography>
															<Stack direction="row" spacing={0.5} flexWrap="wrap">
																{program.sampleWorkouts.slice(0, 3).map((workout, idx) => (
																	<Chip
																		key={idx}
																		label={workout}
																		size="small"
																		className={'sample-chip'}
																	/>
																))}
															</Stack>
														</Box>
													)}
													<Button
														variant="contained"
														fullWidth
														className={'start-program-btn'}
														startIcon={<PlayArrowIcon />}
														mt={2}
													>
														Start Program
													</Button>
												</CardContent>
											</Card>
										</Link>
									</Grid>
								))}
							</Grid>
						)}
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(WorkoutsPage);






import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Tabs, Tab, Chip, LinearProgress, IconButton, List, ListItem, ListItemText, Avatar, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIconOutlined from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import StraightenIcon from '@mui/icons-material/Straighten';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { ProgressType, MeasurementUnit } from '../../libs/enums/progress.enum';
import { BodyMeasurements } from '../../libs/types/progress/progress';
import { Achievement } from '../../libs/types/achievement/achievement';
import { Workout } from '../../libs/types/workout/workout';
import Link from 'next/link';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Why Track Progress - Compelling Data
const whyTrackProgressData = [
	{
		stat: '75%',
		title: 'More Likely to Achieve Goals',
		description: 'People who track their progress are 75% more likely to achieve their fitness goals',
		icon: <CheckCircleIcon />,
	},
	{
		stat: '3x',
		title: 'Faster Results',
		description: 'Regular progress tracking leads to 3x faster results compared to those who don\'t track',
		icon: <TrendingUpIconOutlined />,
	},
	{
		stat: '90%',
		title: 'Stay Motivated',
		description: '90% of users report increased motivation when they see their progress over time',
		icon: <LocalFireDepartmentIcon />,
	},
	{
		stat: '2.5x',
		title: 'Better Consistency',
		description: 'Tracking progress increases workout consistency by 2.5x on average',
		icon: <FitnessCenterIcon />,
	},
];

// Sample motivation videos/images
const motivationContent = [
	{
		id: '1',
		type: 'video',
		thumbnail: '/img/videos/4443524-hd_1080_1614_25fps.mp4',
		title: 'Transform Your Body',
		category: 'Motivation',
	},
	{
		id: '2',
		type: 'image',
		thumbnail: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
		title: 'Success Stories',
		category: 'Inspiration',
	},
	{
		id: '3',
		type: 'image',
		thumbnail: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
		title: 'Fitness Journey',
		category: 'Progress',
	},
];

const ProgressPage: NextPage = () => {
	const device = useDeviceDetect();
	const [tabValue, setTabValue] = useState(0);
	const [currentStats] = useState({
		weight: 75.5,
		targetWeight: 70,
		bodyFat: 18.5,
		muscleMass: 58.2,
		bmi: 24.2,
		lastUpdated: '2024-01-15',
	});
	const [bodyMeasurements] = useState<BodyMeasurements>({
		chest: 102,
		waist: 85,
		hips: 95,
		biceps: 35,
		thighs: 58,
		calves: 38,
	});

	// Weight log data (sample)
	const [weightLogs] = useState([
		{ date: '2024-01-01', weight: 78.5 },
		{ date: '2024-01-08', weight: 77.2 },
		{ date: '2024-01-15', weight: 75.5 },
		{ date: '2024-01-22', weight: 74.8 },
		{ date: '2024-01-29', weight: 73.5 },
	]);

	// Progress photos (sample)
	const [progressPhotos] = useState([
		{ id: '1', date: '2024-01-01', imageUrl: '/img/bodybuilders/pexels-gabflicks-13122470.jpg', notes: 'Starting point' },
		{ id: '2', date: '2024-01-15', imageUrl: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg', notes: '2 weeks progress' },
		{ id: '3', date: '2024-01-29', imageUrl: '/img/bodybuilders/pexels-leonmart-1552108.jpg', notes: '1 month progress' },
	]);

	// Workout history (sample)
	const [workoutHistory] = useState<Partial<Workout>[]>([
		{ _id: '1', workoutTitle: 'Full Body Strength', workoutCaloriesBurn: 450, createdAt: new Date('2024-01-29') },
		{ _id: '2', workoutTitle: 'HIIT Cardio Blast', workoutCaloriesBurn: 380, createdAt: new Date('2024-01-28') },
		{ _id: '3', workoutTitle: 'Upper Body Power', workoutCaloriesBurn: 420, createdAt: new Date('2024-01-27') },
		{ _id: '4', workoutTitle: 'Leg Day Destroyer', workoutCaloriesBurn: 500, createdAt: new Date('2024-01-26') },
		{ _id: '5', workoutTitle: 'Core & Stability', workoutCaloriesBurn: 320, createdAt: new Date('2024-01-25') },
	]);

	// Nutrition logs (sample)
	const [nutritionLogs] = useState([
		{ date: '2024-01-29', calories: 2150, protein: 165, carbs: 220, fats: 65 },
		{ date: '2024-01-28', calories: 2080, protein: 158, carbs: 210, fats: 62 },
		{ date: '2024-01-27', calories: 2220, protein: 172, carbs: 235, fats: 68 },
		{ date: '2024-01-26', calories: 1980, protein: 150, carbs: 195, fats: 58 },
		{ date: '2024-01-25', calories: 2100, protein: 160, carbs: 215, fats: 63 },
	]);

	// Weekly goals (sample)
	const [weeklyGoals] = useState([
		{ id: '1', title: 'Complete 5 Workouts', current: 4, target: 5, type: 'workouts' },
		{ id: '2', title: 'Track Nutrition Daily', current: 7, target: 7, type: 'nutrition' },
		{ id: '3', title: 'Lose 0.5kg', current: 0.3, target: 0.5, type: 'weight' },
		{ id: '4', title: '10,000 Steps Daily', current: 8, target: 7, type: 'steps' },
	]);

	// Achievements (sample)
	const [achievements] = useState<Partial<Achievement>[]>([
		{ _id: '1', achievementTitle: 'First Workout', achievementDesc: 'Completed your first workout', achievementStatus: 'UNLOCKED', progressPercentage: 100, points: 10 },
		{ _id: '2', achievementTitle: 'Week Warrior', achievementDesc: '7-day workout streak', achievementStatus: 'UNLOCKED', progressPercentage: 100, points: 50 },
		{ _id: '3', achievementTitle: 'Weight Loss Milestone', achievementDesc: 'Lost 5kg', achievementStatus: 'IN_PROGRESS', progressPercentage: 60, points: 100 },
		{ _id: '4', achievementTitle: 'Century Club', achievementDesc: 'Complete 100 workouts', achievementStatus: 'IN_PROGRESS', progressPercentage: 45, points: 500 },
	]);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const calculateProgress = (current: number, target: number) => {
		return Math.min((current / target) * 100, 100);
	};

	// Simple weight chart data points
	const getWeightChartData = () => {
		return weightLogs.map((log, index) => ({
			x: index,
			y: log.weight,
			date: log.date,
		}));
	};

	if (device === 'mobile') {
		return (
			<Stack className={'progress-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Progress</Typography>
					<div>MOBILE PROGRESS PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'progress-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'}>
						<Typography variant="h3" className={'page-title'}>
							Track Your Progress
						</Typography>
						<Typography variant="body1" className={'page-subtitle'}>
							Monitor your fitness journey and see how far you've come
						</Typography>
					</Stack>

					{/* Motivation Hero Section */}
					<Box className={'motivation-hero'}>
						<Grid container spacing={3}>
							<Grid item xs={12} md={8}>
								<Box className={'hero-video'}>
									<video
										className={'motivation-video'}
										poster="/img/bodybuilders/pexels-gabflicks-13122470.jpg"
										controls
										autoPlay
										muted
										loop
									>
										<source src="/img/videos/4443524-hd_1080_1614_25fps.mp4" type="video/mp4" />
									</video>
									<Box className={'video-overlay'}>
										<Typography variant="h4" className={'video-title'}>
											Your Transformation Starts Here
										</Typography>
										<Typography variant="body1" className={'video-subtitle'}>
											Track every milestone, celebrate every victory
										</Typography>
									</Box>
								</Box>
							</Grid>
							<Grid item xs={12} md={4}>
								<Box className={'motivation-grid'}>
									{motivationContent.slice(1).map((item) => (
										<Box key={item.id} className={'motivation-item'}>
											<Box
												className={'motivation-thumbnail'}
												style={{
													backgroundImage: `url(${item.thumbnail})`,
													backgroundSize: 'cover',
													backgroundPosition: 'center',
												}}
											>
												<Box className={'thumbnail-overlay'}>
													<IconButton className={'play-btn'}>
														<PlayArrowIcon />
													</IconButton>
												</Box>
											</Box>
											<Box className={'motivation-info'}>
												<Chip label={item.category} size="small" className={'category-chip'} />
												<Typography variant="body2" className={'motivation-title'}>
													{item.title}
												</Typography>
											</Box>
										</Box>
									))}
								</Box>
							</Grid>
						</Grid>
					</Box>

					{/* Why Track Progress Section */}
					<Box className={'why-track-section'}>
						<Typography variant="h4" className={'section-title'} gutterBottom>
							Why Track Your Progress?
						</Typography>
						<Typography variant="body1" className={'section-description'} paragraph>
							Tracking your fitness progress isn't just about numbers—it's about staying motivated, making informed decisions, and celebrating your journey. Here's what the data shows:
						</Typography>
						<Grid container spacing={3} className={'stats-grid'}>
							{whyTrackProgressData.map((item, index) => (
								<Grid item xs={12} sm={6} md={3} key={index}>
									<Card className={'stat-card'}>
										<CardContent>
											<Box className={'stat-icon'}>{item.icon}</Box>
											<Typography variant="h3" className={'stat-number'}>
												{item.stat}
											</Typography>
											<Typography variant="h6" className={'stat-title'}>
												{item.title}
											</Typography>
											<Typography variant="body2" className={'stat-description'}>
												{item.description}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					</Box>

					{/* Current Stats Overview */}
					<Box className={'current-stats-section'}>
						<Typography variant="h5" className={'section-title'} gutterBottom>
							Your Current Stats
						</Typography>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6} md={3}>
								<Card className={'metric-card'}>
									<CardContent>
										<Stack direction="row" alignItems="center" spacing={1} mb={1}>
											<MonitorWeightIcon className={'metric-icon'} />
											<Typography variant="body2" className={'metric-label'}>
												Current Weight
											</Typography>
										</Stack>
										<Typography variant="h4" className={'metric-value'}>
											{currentStats.weight} kg
										</Typography>
										<Typography variant="caption" className={'metric-target'}>
											Target: {currentStats.targetWeight} kg
										</Typography>
										<LinearProgress
											variant="determinate"
											value={calculateProgress(currentStats.weight, currentStats.targetWeight)}
											className={'metric-progress'}
										/>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<Card className={'metric-card'}>
									<CardContent>
										<Stack direction="row" alignItems="center" spacing={1} mb={1}>
											<StraightenIcon className={'metric-icon'} />
											<Typography variant="body2" className={'metric-label'}>
												Body Fat %
											</Typography>
										</Stack>
										<Typography variant="h4" className={'metric-value'}>
											{currentStats.bodyFat}%
										</Typography>
										<Typography variant="caption" className={'metric-target'}>
											Last updated: {currentStats.lastUpdated}
										</Typography>
										<LinearProgress
											variant="determinate"
											value={currentStats.bodyFat}
											className={'metric-progress'}
										/>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<Card className={'metric-card'}>
									<CardContent>
										<Stack direction="row" alignItems="center" spacing={1} mb={1}>
											<FitnessCenterIcon className={'metric-icon'} />
											<Typography variant="body2" className={'metric-label'}>
												Muscle Mass
											</Typography>
										</Stack>
										<Typography variant="h4" className={'metric-value'}>
											{currentStats.muscleMass} kg
										</Typography>
										<Typography variant="caption" className={'metric-target'}>
											Healthy range: 50-65 kg
										</Typography>
										<LinearProgress
											variant="determinate"
											value={(currentStats.muscleMass / 65) * 100}
											className={'metric-progress'}
										/>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<Card className={'metric-card'}>
									<CardContent>
										<Stack direction="row" alignItems="center" spacing={1} mb={1}>
											<TrendingUpIcon className={'metric-icon'} />
											<Typography variant="body2" className={'metric-label'}>
												BMI
											</Typography>
										</Stack>
										<Typography variant="h4" className={'metric-value'}>
											{currentStats.bmi}
										</Typography>
										<Typography variant="caption" className={'metric-target'}>
											Normal range: 18.5-24.9
										</Typography>
										<LinearProgress
											variant="determinate"
											value={(currentStats.bmi / 30) * 100}
											className={'metric-progress'}
										/>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</Box>

					{/* Tabs */}
					<Box className={'progress-tabs'}>
						<Tabs value={tabValue} onChange={handleTabChange} className={'custom-tabs'}>
							<Tab label="Overview" icon={<TrendingUpIcon />} iconPosition="start" />
							<Tab label="Weight Tracker" icon={<MonitorWeightIcon />} iconPosition="start" />
							<Tab label="Body Measurements" icon={<AssessmentIcon />} iconPosition="start" />
							<Tab label="Progress Photos" icon={<PhotoCameraIcon />} iconPosition="start" />
							<Tab label="Workout History" icon={<FitnessCenterIcon />} iconPosition="start" />
							<Tab label="Nutrition Logs" icon={<RestaurantIcon />} iconPosition="start" />
							<Tab label="Weekly Goals" icon={<CalendarTodayIcon />} iconPosition="start" />
							<Tab label="Achievements" icon={<EmojiEventsIcon />} iconPosition="start" />
						</Tabs>
					</Box>

					{/* Overview Tab */}
					{tabValue === 0 && (
						<Grid container spacing={3}>
							<Grid item xs={12} md={8}>
								<Card className={'overview-card'}>
									<CardContent>
										<Typography variant="h6" className={'section-title'} gutterBottom>
											Progress Overview
										</Typography>
										<Box className={'charts-placeholder'} sx={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
											<Typography variant="body2" color="text.secondary">
												Progress charts will appear here
											</Typography>
										</Box>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} md={4}>
								<Card className={'quick-stats-card'}>
									<CardContent>
										<Typography variant="h6" className={'section-title'} gutterBottom>
											Quick Stats
										</Typography>
										<Stack spacing={2} mt={2}>
											<Box className={'quick-stat-item'}>
												<Stack direction="row" justifyContent="space-between" alignItems="center">
													<Typography variant="body2" color="text.secondary">
														This Week's Workouts
													</Typography>
													<Typography variant="h6" className={'quick-stat-value'}>
														{workoutHistory.length}
													</Typography>
												</Stack>
											</Box>
											<Divider />
											<Box className={'quick-stat-item'}>
												<Stack direction="row" justifyContent="space-between" alignItems="center">
													<Typography variant="body2" color="text.secondary">
														Avg Daily Calories
													</Typography>
													<Typography variant="h6" className={'quick-stat-value'}>
														{Math.round(nutritionLogs.reduce((sum, log) => sum + log.calories, 0) / nutritionLogs.length)}
													</Typography>
												</Stack>
											</Box>
											<Divider />
											<Box className={'quick-stat-item'}>
												<Stack direction="row" justifyContent="space-between" alignItems="center">
													<Typography variant="body2" color="text.secondary">
														Weight Change
													</Typography>
													<Stack direction="row" alignItems="center" spacing={1}>
														<ArrowDownwardIcon className={'trend-down'} fontSize="small" />
														<Typography variant="h6" className={'quick-stat-value trend-down'}>
															{Math.abs(weightLogs[0].weight - weightLogs[weightLogs.length - 1].weight).toFixed(1)} kg
														</Typography>
													</Stack>
												</Stack>
											</Box>
											<Divider />
											<Box className={'quick-stat-item'}>
												<Stack direction="row" justifyContent="space-between" alignItems="center">
													<Typography variant="body2" color="text.secondary">
														Achievements Unlocked
													</Typography>
													<Typography variant="h6" className={'quick-stat-value'}>
														{achievements.filter(a => a.achievementStatus === 'UNLOCKED').length}
													</Typography>
												</Stack>
											</Box>
										</Stack>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					)}

					{/* Weight Tracker Tab */}
					{tabValue === 1 && (
						<Card className={'weight-tracker-card'}>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
									<Typography variant="h5" className={'section-title'}>
										Weight Tracker
									</Typography>
									<Button variant="contained" startIcon={<AddIcon />} className={'add-btn'}>
										Log Weight
									</Button>
								</Stack>
								<Grid container spacing={3}>
									<Grid item xs={12} md={8}>
										<Box className={'weight-chart-container'}>
											<Typography variant="h6" gutterBottom>
												Weight Progress (Last 5 Weeks)
											</Typography>
											<Box className={'weight-chart'} sx={{ minHeight: 300, position: 'relative', mt: 2 }}>
												{/* Simple line chart visualization */}
												<Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', gap: 2, justifyContent: 'space-around', pb: 4 }}>
													{weightLogs.map((log, index) => {
														const maxWeight = Math.max(...weightLogs.map(l => l.weight));
														const minWeight = Math.min(...weightLogs.map(l => l.weight));
														const range = maxWeight - minWeight || 1;
														const height = ((log.weight - minWeight) / range) * 100;
														return (
															<Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
																<Box
																	sx={{
																		width: '100%',
																		height: `${height}%`,
																		background: 'linear-gradient(to top, #424242, #616161)',
																		borderRadius: '4px 4px 0 0',
																		minHeight: '40px',
																		display: 'flex',
																		alignItems: 'flex-end',
																		justifyContent: 'center',
																		padding: 1,
																	}}
																>
																	<Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
																		{log.weight}kg
																	</Typography>
																</Box>
																<Typography variant="caption" sx={{ mt: 1, fontSize: '10px', color: 'text.secondary' }}>
																	{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
																</Typography>
															</Box>
														);
													})}
												</Box>
											</Box>
										</Box>
									</Grid>
									<Grid item xs={12} md={4}>
										<Card className={'weight-summary-card'}>
											<CardContent>
												<Typography variant="h6" gutterBottom>
													Weight Summary
												</Typography>
												<Stack spacing={2} mt={2}>
													<Box>
														<Typography variant="body2" color="text.secondary">
															Starting Weight
														</Typography>
														<Typography variant="h6">
															{weightLogs[0].weight} kg
														</Typography>
													</Box>
													<Divider />
													<Box>
														<Typography variant="body2" color="text.secondary">
															Current Weight
														</Typography>
														<Typography variant="h6">
															{weightLogs[weightLogs.length - 1].weight} kg
														</Typography>
													</Box>
													<Divider />
													<Box>
														<Typography variant="body2" color="text.secondary">
															Total Change
														</Typography>
														<Stack direction="row" alignItems="center" spacing={1}>
															<ArrowDownwardIcon className={'trend-down'} />
															<Typography variant="h6" className={'trend-down'}>
																{Math.abs(weightLogs[0].weight - weightLogs[weightLogs.length - 1].weight).toFixed(1)} kg
															</Typography>
														</Stack>
													</Box>
													<Divider />
													<Box>
														<Typography variant="body2" color="text.secondary">
															Target Weight
														</Typography>
														<Typography variant="h6">
															{currentStats.targetWeight} kg
														</Typography>
														<LinearProgress
															variant="determinate"
															value={calculateProgress(weightLogs[weightLogs.length - 1].weight, currentStats.targetWeight)}
															sx={{ mt: 1 }}
														/>
													</Box>
												</Stack>
											</CardContent>
										</Card>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					)}

					{/* Body Measurements Tab */}
					{tabValue === 2 && (
						<Card className={'measurements-card'}>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
									<Typography variant="h5" className={'section-title'}>
										Body Measurements
									</Typography>
									<Button variant="contained" startIcon={<AddIcon />} className={'add-btn'}>
										Add Measurement
									</Button>
								</Stack>
								<Grid container spacing={3}>
									{Object.entries(bodyMeasurements).map(([key, value]) => (
										<Grid item xs={12} sm={6} md={4} key={key}>
											<Card className={'measurement-item'}>
												<CardContent>
													<Typography variant="body2" className={'measurement-label'} gutterBottom>
														{key.charAt(0).toUpperCase() + key.slice(1)}
													</Typography>
													<Typography variant="h4" className={'measurement-value'}>
														{value} cm
													</Typography>
													<Box className={'measurement-trend'}>
														<TrendingUpIcon className={'trend-icon'} />
														<Typography variant="caption" className={'trend-text'}>
															+2.5 cm this month
														</Typography>
													</Box>
												</CardContent>
											</Card>
										</Grid>
									))}
								</Grid>
							</CardContent>
						</Card>
					)}

					{/* Progress Photos Tab */}
					{tabValue === 3 && (
						<Card className={'photos-card'}>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
									<Typography variant="h5" className={'section-title'}>
										Progress Photos
									</Typography>
									<Button variant="contained" startIcon={<AddIcon />} className={'add-btn'}>
										Upload Photo
									</Button>
								</Stack>
								{progressPhotos.length > 0 ? (
									<Grid container spacing={3}>
										{progressPhotos.map((photo) => (
											<Grid item xs={12} sm={6} md={4} key={photo.id}>
												<Card className={'photo-card'}>
													<Box
														className={'photo-image'}
														style={{
															backgroundImage: `url(${photo.imageUrl})`,
															backgroundSize: 'cover',
															backgroundPosition: 'center',
															height: 300,
															borderRadius: '8px 8px 0 0',
														}}
													/>
													<CardContent>
														<Typography variant="body2" className={'photo-date'} gutterBottom>
															{new Date(photo.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
														</Typography>
														{photo.notes && (
															<Typography variant="body2" color="text.secondary">
																{photo.notes}
															</Typography>
														)}
													</CardContent>
												</Card>
											</Grid>
										))}
									</Grid>
								) : (
									<Box className={'photos-placeholder'} sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<Typography variant="body2" color="text.secondary">
											No photos uploaded yet. Start tracking your visual progress!
										</Typography>
									</Box>
								)}
							</CardContent>
						</Card>
					)}

					{/* Workout History Tab */}
					{tabValue === 4 && (
						<Card className={'workout-history-card'}>
							<CardContent>
								<Typography variant="h5" className={'section-title'} gutterBottom>
									Workout History
								</Typography>
								<Typography variant="body2" className={'section-description'} paragraph>
									Track all your completed workouts and see your progress over time
								</Typography>
								{workoutHistory.length > 0 ? (
									<TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell><strong>Date</strong></TableCell>
													<TableCell><strong>Workout</strong></TableCell>
													<TableCell align="right"><strong>Calories Burned</strong></TableCell>
													<TableCell align="right"><strong>Actions</strong></TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{workoutHistory.map((workout) => (
													<TableRow key={workout._id} hover>
														<TableCell>
															{workout.createdAt ? new Date(workout.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
														</TableCell>
														<TableCell>
															<Typography variant="body1" fontWeight={600}>
																{workout.workoutTitle}
															</Typography>
														</TableCell>
														<TableCell align="right">
															<Chip
																icon={<LocalFireDepartmentIcon />}
																label={`${workout.workoutCaloriesBurn} cal`}
																size="small"
																className={'calorie-chip'}
															/>
														</TableCell>
														<TableCell align="right">
															<Button size="small" variant="outlined">
																View Details
															</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								) : (
									<Box className={'workout-log-placeholder'}>
										<Typography variant="body2" color="text.secondary">
											No workouts completed yet. Start your fitness journey today!
										</Typography>
									</Box>
								)}
							</CardContent>
						</Card>
					)}

					{/* Nutrition Logs Tab */}
					{tabValue === 5 && (
						<Card className={'nutrition-logs-card'}>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
									<Box>
										<Typography variant="h5" className={'section-title'} gutterBottom>
											Nutrition Logs
										</Typography>
										<Typography variant="body2" className={'section-description'}>
											Track your daily nutrition intake
										</Typography>
									</Box>
									<Button variant="contained" startIcon={<AddIcon />} className={'add-btn'}>
										Log Nutrition
									</Button>
								</Stack>
								{nutritionLogs.length > 0 ? (
									<TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell><strong>Date</strong></TableCell>
													<TableCell align="right"><strong>Calories</strong></TableCell>
													<TableCell align="right"><strong>Protein (g)</strong></TableCell>
													<TableCell align="right"><strong>Carbs (g)</strong></TableCell>
													<TableCell align="right"><strong>Fats (g)</strong></TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{nutritionLogs.map((log, index) => (
													<TableRow key={index} hover>
														<TableCell>
															{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
														</TableCell>
														<TableCell align="right">
															<Chip
																icon={<LocalFireDepartmentIcon />}
																label={log.calories}
																size="small"
																className={'calorie-chip'}
															/>
														</TableCell>
														<TableCell align="right">{log.protein}g</TableCell>
														<TableCell align="right">{log.carbs}g</TableCell>
														<TableCell align="right">{log.fats}g</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								) : (
									<Box className={'workout-log-placeholder'}>
										<Typography variant="body2" color="text.secondary">
											No nutrition logs yet. Start tracking your daily intake!
										</Typography>
									</Box>
								)}
							</CardContent>
						</Card>
					)}

					{/* Weekly Goals Tab */}
					{tabValue === 6 && (
						<Card className={'weekly-goals-card'}>
							<CardContent>
								<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
									<Box>
										<Typography variant="h5" className={'section-title'} gutterBottom>
											Weekly Goals
										</Typography>
										<Typography variant="body2" className={'section-description'}>
											Set and track your weekly fitness goals
										</Typography>
									</Box>
									<Button variant="contained" startIcon={<AddIcon />} className={'add-btn'}>
										Add Goal
									</Button>
								</Stack>
								<Grid container spacing={3}>
									{weeklyGoals.map((goal) => (
										<Grid item xs={12} md={6} key={goal.id}>
											<Card className={'goal-card'}>
												<CardContent>
													<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
														<Typography variant="h6" className={'goal-title'}>
															{goal.title}
														</Typography>
														<Chip
															label={goal.type}
															size="small"
															className={'goal-type-chip'}
														/>
													</Stack>
													<Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
														<Typography variant="body2" color="text.secondary">
															Progress: {goal.current} / {goal.target}
														</Typography>
														<Typography variant="body2" className={'goal-percentage'}>
															{Math.round((goal.current / goal.target) * 100)}%
														</Typography>
													</Stack>
													<LinearProgress
														variant="determinate"
														value={Math.min((goal.current / goal.target) * 100, 100)}
														className={'goal-progress'}
													/>
												</CardContent>
											</Card>
										</Grid>
									))}
								</Grid>
							</CardContent>
						</Card>
					)}

					{/* Achievements Tab */}
					{tabValue === 7 && (
						<Card className={'achievements-card'}>
							<CardContent>
								<Typography variant="h5" className={'section-title'} gutterBottom>
									Achievements
								</Typography>
								<Typography variant="body2" className={'section-description'} paragraph>
									Unlock achievements as you progress on your fitness journey
								</Typography>
								<Grid container spacing={3}>
									{achievements.map((achievement) => (
										<Grid item xs={12} sm={6} md={4} key={achievement._id}>
											<Card className={`achievement-card ${achievement.achievementStatus?.toLowerCase()}`}>
												<CardContent>
													<Stack direction="row" alignItems="center" spacing={2} mb={2}>
														<Avatar className={'achievement-badge'} sx={{ bgcolor: achievement.achievementStatus === 'UNLOCKED' ? 'success.main' : 'gray.400' }}>
															<EmojiEventsIcon />
														</Avatar>
														<Box flex={1}>
															<Typography variant="h6" className={'achievement-title'}>
																{achievement.achievementTitle}
															</Typography>
															<Typography variant="caption" color="text.secondary">
																{achievement.achievementDesc}
															</Typography>
														</Box>
													</Stack>
													{achievement.achievementStatus === 'IN_PROGRESS' && (
														<Box>
															<Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
																<Typography variant="caption" color="text.secondary">
																	Progress
																</Typography>
																<Typography variant="caption" className={'achievement-progress-text'}>
																	{achievement.progressPercentage}%
																</Typography>
															</Stack>
															<LinearProgress
																variant="determinate"
																value={achievement.progressPercentage || 0}
																className={'achievement-progress'}
															/>
														</Box>
													)}
													{achievement.achievementStatus === 'UNLOCKED' && (
														<Chip
															icon={<CheckCircleIcon />}
															label="Unlocked"
															size="small"
															color="success"
															sx={{ mt: 1 }}
														/>
													)}
													{achievement.points && (
														<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
															{achievement.points} points
														</Typography>
													)}
												</CardContent>
											</Card>
										</Grid>
									))}
								</Grid>
							</CardContent>
						</Card>
					)}
						<Card className={'muscle-tracking-card'}>
							<CardContent>
								<Typography variant="h5" className={'section-title'} gutterBottom>
									Muscle Development Tracking
								</Typography>
								<Typography variant="body2" className={'section-description'} paragraph>
									Track your muscle growth across different body parts to see where you're making the most progress.
								</Typography>
								<Grid container spacing={3}>
									{[
										{ name: 'Chest', current: 102, target: 110, progress: 92.7 },
										{ name: 'Back', current: 95, target: 105, progress: 90.5 },
										{ name: 'Shoulders', current: 48, target: 52, progress: 92.3 },
										{ name: 'Arms', current: 35, target: 38, progress: 92.1 },
										{ name: 'Legs', current: 58, target: 65, progress: 89.2 },
										{ name: 'Core', current: 85, target: 80, progress: 100 },
									].map((muscle, index) => (
										<Grid item xs={12} md={6} key={index}>
											<Card className={'muscle-card'}>
												<CardContent>
													<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
														<Typography variant="h6" className={'muscle-name'}>
															{muscle.name}
														</Typography>
														<Typography variant="body2" className={'muscle-value'}>
															{muscle.current} cm
														</Typography>
													</Stack>
													<Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
														<Typography variant="caption" className={'muscle-target'}>
															Target: {muscle.target} cm
														</Typography>
														<Typography variant="caption" className={'muscle-progress-text'}>
															{muscle.progress.toFixed(1)}%
														</Typography>
													</Stack>
													<LinearProgress
														variant="determinate"
														value={muscle.progress}
														className={'muscle-progress'}
													/>
												</CardContent>
											</Card>
										</Grid>
									))}
								</Grid>
							</CardContent>
						</Card>
					)}

				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(ProgressPage);






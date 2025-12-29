import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import {
	Container,
	Box,
	Typography,
	Button,
	Stack,
	Card,
	CardContent,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Switch,
	FormControlLabel,
	Alert,
	Grid,
	Tabs,
	Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_WORKOUT, UPDATE_WORKOUT } from '../apollo/user/mutation';
import { GET_TRAINER_WORKOUTS } from '../apollo/user/query';
import { WorkoutInput, WorkoutUpdate, TrainerWorkoutsInquiry } from '../libs/types/workout/workout.input';
import {
	WorkoutCategory,
	WorkoutDifficulty,
	WorkoutDuration,
	WorkoutEquipment,
	WorkoutStatus,
} from '../libs/enums/workout.enum';
import { Workout } from '../libs/types/workout/workout';
import { Direction } from '../libs/enums/common.enum';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;
	return (
		<div role="tabpanel" hidden={value !== index} id={`workout-tabpanel-${index}`} {...other}>
			{value === index && <Box sx={{ py: 3 }}>{children}</Box>}
		</div>
	);
}

const TrainerStudioPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [tabValue, setTabValue] = useState(0);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
	const [formData, setFormData] = useState<Partial<WorkoutInput>>({
		workoutTitle: '',
		workoutCategory: WorkoutCategory.STRENGTH,
		workoutDifficulty: WorkoutDifficulty.BEGINNER,
		workoutDuration: WorkoutDuration.MEDIUM,
		workoutEquipment: [],
		workoutStatus: WorkoutStatus.DRAFT,
		workoutDesc: '',
		workoutTags: [],
		workoutImage: '',
		workoutVideo: '',
	});

	const [tagInput, setTagInput] = useState('');

	// Redirect if not trainer
	React.useEffect(() => {
		if (user?.memberType !== 'TRAINER') {
			router.push('/trainer');
		}
	}, [user, router]);

	const trainerWorkoutsInput: TrainerWorkoutsInquiry = useMemo(
		() => ({
			page: 1,
			limit: 50,
			trainerId: user?._id || '',
			workoutStatus: tabValue === 0 ? 'PUBLISHED' : tabValue === 1 ? 'DRAFT' : undefined,
		}),
		[user?._id, tabValue],
	);

	const {
		data: workoutsData,
		loading: workoutsLoading,
		refetch: refetchWorkouts,
	} = useQuery(GET_TRAINER_WORKOUTS, {
		variables: { input: trainerWorkoutsInput },
		fetchPolicy: 'cache-and-network',
		skip: !user?._id,
	});

	const workouts = (workoutsData?.getTrainerWorkouts?.list || []) as Workout[];

	const [createWorkout, { loading: creating }] = useMutation(CREATE_WORKOUT, {
		onCompleted: () => {
			sweetTopSmallSuccessAlert('Workout created successfully', 2000);
			setDialogOpen(false);
			resetForm();
			refetchWorkouts();
		},
		onError: (error) => {
			sweetMixinErrorAlert(error.message);
		},
	});

	const [updateWorkout, { loading: updating }] = useMutation(UPDATE_WORKOUT, {
		onCompleted: () => {
			sweetTopSmallSuccessAlert('Workout updated successfully', 2000);
			setDialogOpen(false);
			resetForm();
			refetchWorkouts();
		},
		onError: (error) => {
			sweetMixinErrorAlert(error.message);
		},
	});

	const resetForm = () => {
		setFormData({
			workoutTitle: '',
			workoutCategory: WorkoutCategory.STRENGTH,
			workoutDifficulty: WorkoutDifficulty.BEGINNER,
			workoutDuration: WorkoutDuration.MEDIUM,
			workoutEquipment: [],
			workoutStatus: WorkoutStatus.DRAFT,
			workoutDesc: '',
			workoutTags: [],
			workoutImage: '',
			workoutVideo: '',
		});
		setEditingWorkout(null);
		setTagInput('');
	};

	const handleOpenDialog = (workout?: Workout) => {
		if (workout) {
			setEditingWorkout(workout);
			setFormData({
				workoutTitle: workout.workoutTitle,
				workoutCategory: workout.workoutCategory,
				workoutDifficulty: workout.workoutDifficulty,
				workoutDuration: workout.workoutDuration,
				workoutEquipment: workout.workoutEquipment,
				workoutStatus: workout.workoutStatus,
				workoutDesc: workout.workoutDesc,
				workoutTags: workout.workoutTags || [],
				workoutImage: workout.workoutImage || '',
				workoutVideo: workout.workoutVideo || '',
			});
		} else {
			resetForm();
		}
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		resetForm();
	};

	const handleSubmit = async () => {
		if (!formData.workoutTitle || !formData.workoutDesc) {
			sweetMixinErrorAlert('Please fill in all required fields');
			return;
		}

		if (editingWorkout) {
			const updateInput: WorkoutUpdate = {
				_id: editingWorkout._id,
				...formData,
			};
			await updateWorkout({ variables: { input: updateInput } });
		} else {
			const createInput: WorkoutInput = {
				...formData,
				createdBy: user?._id,
			} as WorkoutInput;
			await createWorkout({ variables: { input: createInput } });
		}
	};

	const handleAddTag = () => {
		if (tagInput.trim() && !formData.workoutTags?.includes(tagInput.trim())) {
			setFormData({
				...formData,
				workoutTags: [...(formData.workoutTags || []), tagInput.trim()],
			});
			setTagInput('');
		}
	};

	const handleRemoveTag = (tag: string) => {
		setFormData({
			...formData,
			workoutTags: formData.workoutTags?.filter((t) => t !== tag) || [],
		});
	};

	if (user?.memberType !== 'TRAINER') {
		return (
			<Container>
				<Alert severity="warning">You must be a trainer to access this page.</Alert>
			</Container>
		);
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
					<Typography variant="h4" sx={{ fontWeight: 700, color: '#212121' }}>
						Trainer Studio
					</Typography>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={() => handleOpenDialog()}
						sx={{
							backgroundColor: '#E10600',
							'&:hover': { backgroundColor: '#C10500' },
							textTransform: 'none',
							fontWeight: 600,
						}}
					>
						Create Workout
					</Button>
				</Stack>
			</Box>

			{/* Tabs */}
			<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
				<Tabs value={tabValue} onChange={(_e, newValue) => setTabValue(newValue)}>
					<Tab label="Published" />
					<Tab label="Drafts" />
					<Tab label="All" />
				</Tabs>
			</Box>

			{/* Workouts List */}
			{workoutsLoading ? (
				<Grid container spacing={3}>
					{[1, 2, 3, 4].map((i) => (
						<Grid item xs={12} sm={6} md={4} key={i}>
							<Card>
								<CardContent>
									<Typography variant="h6">Loading...</Typography>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			) : workouts.length === 0 ? (
				<Box sx={{ textAlign: 'center', py: 8 }}>
					<Typography variant="h6" sx={{ mb: 2, color: '#757575' }}>
						No workouts yet
					</Typography>
					<Button variant="contained" onClick={() => handleOpenDialog()}>
						Create Your First Workout
					</Button>
				</Box>
			) : (
				<Grid container spacing={3}>
					{workouts.map((workout) => (
						<Grid item xs={12} sm={6} md={4} key={workout._id}>
							<Card sx={{ height: '100%' }}>
								<CardContent>
									<Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
										{workout.workoutTitle}
									</Typography>
									<Stack direction="row" spacing={1} sx={{ mb: 2 }}>
										<Chip label={workout.workoutCategory} size="small" />
										<Chip label={workout.workoutDifficulty} size="small" />
										<Chip label={workout.workoutStatus} size="small" color={workout.workoutStatus === 'PUBLISHED' ? 'success' : 'default'} />
									</Stack>
									<Typography variant="body2" sx={{ mb: 2, color: '#757575' }}>
										{workout.workoutDesc?.substring(0, 100)}...
									</Typography>
									<Button
										variant="outlined"
										startIcon={<EditIcon />}
										onClick={() => handleOpenDialog(workout)}
										fullWidth
									>
										Edit
									</Button>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			)}

			{/* Create/Edit Dialog */}
			<Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
				<DialogTitle>{editingWorkout ? 'Edit Workout' : 'Create Workout'}</DialogTitle>
				<DialogContent>
					<Stack spacing={3} sx={{ mt: 1 }}>
						<TextField
							label="Workout Title *"
							fullWidth
							value={formData.workoutTitle}
							onChange={(e) => setFormData({ ...formData, workoutTitle: e.target.value })}
						/>

						<FormControl fullWidth>
							<InputLabel>Category *</InputLabel>
							<Select
								value={formData.workoutCategory}
								label="Category *"
								onChange={(e) => setFormData({ ...formData, workoutCategory: e.target.value as WorkoutCategory })}
							>
								{Object.values(WorkoutCategory).map((cat) => (
									<MenuItem key={cat} value={cat}>
										{cat.replace(/_/g, ' ')}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel>Difficulty *</InputLabel>
							<Select
								value={formData.workoutDifficulty}
								label="Difficulty *"
								onChange={(e) => setFormData({ ...formData, workoutDifficulty: e.target.value as WorkoutDifficulty })}
							>
								{Object.values(WorkoutDifficulty).map((diff) => (
									<MenuItem key={diff} value={diff}>
										{diff}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel>Duration *</InputLabel>
							<Select
								value={formData.workoutDuration}
								label="Duration *"
								onChange={(e) => setFormData({ ...formData, workoutDuration: e.target.value as WorkoutDuration })}
							>
								{Object.values(WorkoutDuration).map((dur) => (
									<MenuItem key={dur} value={dur}>
										{dur}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel>Equipment</InputLabel>
							<Select
								multiple
								value={formData.workoutEquipment || []}
								label="Equipment"
								onChange={(e) => setFormData({ ...formData, workoutEquipment: e.target.value as WorkoutEquipment[] })}
								renderValue={(selected) => (
									<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
										{(selected as WorkoutEquipment[]).map((value) => (
											<Chip key={value} label={value.replace(/_/g, ' ')} size="small" />
										))}
									</Box>
								)}
							>
								{Object.values(WorkoutEquipment).map((eq) => (
									<MenuItem key={eq} value={eq}>
										{eq.replace(/_/g, ' ')}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<TextField
							label="Description *"
							fullWidth
							multiline
							rows={4}
							value={formData.workoutDesc}
							onChange={(e) => setFormData({ ...formData, workoutDesc: e.target.value })}
						/>

						<Box>
							<Stack direction="row" spacing={1} sx={{ mb: 1 }}>
								<TextField
									label="Add Tag"
									size="small"
									value={tagInput}
									onChange={(e) => setTagInput(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											handleAddTag();
										}
									}}
								/>
								<Button onClick={handleAddTag}>Add</Button>
							</Stack>
							<Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
								{formData.workoutTags?.map((tag) => (
									<Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} size="small" />
								))}
							</Stack>
						</Box>

						<TextField
							label="Image URL"
							fullWidth
							value={formData.workoutImage}
							onChange={(e) => setFormData({ ...formData, workoutImage: e.target.value })}
						/>

						<TextField
							label="Video URL"
							fullWidth
							value={formData.workoutVideo}
							onChange={(e) => setFormData({ ...formData, workoutVideo: e.target.value })}
						/>

						<FormControlLabel
							control={
								<Switch
									checked={formData.workoutStatus === WorkoutStatus.PUBLISHED}
									onChange={(e) =>
										setFormData({
											...formData,
											workoutStatus: e.target.checked ? WorkoutStatus.PUBLISHED : WorkoutStatus.DRAFT,
										})
									}
								/>
							}
							label={formData.workoutStatus === WorkoutStatus.PUBLISHED ? 'Published' : 'Draft'}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button onClick={handleSubmit} variant="contained" disabled={creating || updating}>
						{editingWorkout ? 'Update' : 'Create'}
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default withLayoutBasic(TrainerStudioPage);














import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, Chip, Divider, List, ListItem, ListItemText, Grid } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import StarIcon from '@mui/icons-material/Star';
import { Exercise } from '../../libs/types/exercise/exercise';

export const getStaticPaths = async () => ({ paths: [], fallback: 'blocking' });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ExerciseDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const device = useDeviceDetect();
	const [exercise, setExercise] = useState<Exercise | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (id) {
			// TODO: Replace with actual GET_EXERCISE query
			// const { data, loading, error } = useQuery(GET_EXERCISE, {
			// 	variables: { exerciseId: id }
			// });
			setLoading(false);
		}
	}, [id]);

	const formatMuscleGroupName = (muscle: string) => {
		return muscle.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	const formatEquipmentName = (equipment: string) => {
		return equipment.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
	};

	if (device === 'mobile') {
		return (
			<Stack className={'exercise-detail-page'}>
				<Stack className={'container'}>
					<div>MOBILE EXERCISE DETAIL</div>
				</Stack>
			</Stack>
		);
	} else {
		if (loading) {
			return (
				<Stack className={'exercise-detail-page'}>
					<Stack className={'container'}>
						<Box className={'loading-state'}>
							<Typography variant="h6">Loading exercise...</Typography>
						</Box>
					</Stack>
				</Stack>
			);
		}

		if (!exercise) {
			return (
				<Stack className={'exercise-detail-page'}>
					<Stack className={'container'}>
						<Box className={'empty-state'}>
							<Typography variant="h6">Exercise not found</Typography>
							<Typography variant="body2">The exercise you're looking for doesn't exist.</Typography>
						</Box>
					</Stack>
				</Stack>
			);
		}

		return (
			<Stack className={'exercise-detail-page'}>
				<Stack className={'container'}>
					{/* Header Section */}
					<Stack className={'exercise-header'}>
						<Box className={'exercise-media'}>
							{exercise.exerciseVideo ? (
								<video controls poster={exercise.exerciseImage} className={'exercise-video'}>
									<source src={exercise.exerciseVideo} type="video/mp4" />
								</video>
							) : exercise.exerciseGif ? (
								<img src={exercise.exerciseGif} alt={exercise.exerciseName} className={'exercise-gif'} />
							) : exercise.exerciseImage ? (
								<img src={exercise.exerciseImage} alt={exercise.exerciseName} className={'exercise-image'} />
							) : (
								<Box className={'media-placeholder'}>
									<FitnessCenterIcon sx={{ fontSize: 80, color: '#ccc' }} />
								</Box>
							)}
						</Box>
						<Box className={'exercise-header-info'}>
							<Stack direction="row" spacing={1} className={'exercise-badges'} flexWrap="wrap">
								{exercise.targetMuscles.slice(0, 3).map((muscle, idx) => (
									<Chip key={idx} label={formatMuscleGroupName(muscle)} size="small" className={'muscle-chip'} />
								))}
								{exercise.exerciseEquipment && exercise.exerciseEquipment.length > 0 && (
									<Chip
										label={formatEquipmentName(exercise.exerciseEquipment[0])}
										size="small"
										className={'equipment-chip'}
									/>
								)}
								{exercise.exerciseType && (
									<Chip label={exercise.exerciseType.replace(/_/g, ' ')} size="small" className={'type-chip'} />
								)}
							</Stack>
							<Typography variant="h3" className={'exercise-title'}>
								{exercise.exerciseName}
							</Typography>
							{exercise.memberData && (
								<Typography variant="body2" className={'exercise-creator'}>
									By {exercise.memberData.memberFullName || exercise.memberData.memberNick}
								</Typography>
							)}
							<Stack direction="row" spacing={3} className={'exercise-stats'}>
								<Box className={'stat-item'}>
									<StarIcon />
									<span>⭐ {exercise.exerciseRating?.toFixed(1) || '0.0'}</span>
								</Box>
								<Box className={'stat-item'}>
									<FitnessCenterIcon />
									<span>Difficulty: {exercise.exerciseDifficulty}/10</span>
								</Box>
								<Box className={'stat-item'}>
									<span>{exercise.exerciseViews || 0} views</span>
									<span>•</span>
									<span>{exercise.exerciseLikes || 0} likes</span>
								</Box>
							</Stack>
							<Stack direction="row" spacing={2} className={'exercise-actions'}>
								<Button
									variant="contained"
									size="large"
									startIcon={<PlayArrowIcon />}
									className={'watch-btn'}
									onClick={() => {
										if (exercise.exerciseVideo) {
											const video = document.querySelector('.exercise-video') as HTMLVideoElement;
											video?.play();
										}
									}}
								>
									Watch Demo
								</Button>
								<Button variant="outlined" startIcon={<FavoriteBorderIcon />}>
									Save
								</Button>
								<Button variant="outlined" startIcon={<ShareIcon />}>
									Share
								</Button>
							</Stack>
						</Box>
					</Stack>

					<Divider sx={{ my: 4 }} />

					{/* Description */}
					{exercise.exerciseDesc && (
						<Box className={'exercise-description'}>
							<Typography variant="h5" gutterBottom>
								Description
							</Typography>
							<Typography variant="body1" className={'description-text'}>
								{exercise.exerciseDesc}
							</Typography>
						</Box>
					)}

					{/* Instructions */}
					{exercise.exerciseInstructions && exercise.exerciseInstructions.length > 0 && (
					<Box className={'exercise-instructions'}>
						<Typography variant="h5" gutterBottom>
							Instructions
						</Typography>
							<List className={'instructions-list'}>
								{exercise.exerciseInstructions.map((instruction, index) => (
									<ListItem key={index} className={'instruction-item'}>
										<Box className={'instruction-number'}>{index + 1}</Box>
										<ListItemText primary={instruction} className={'instruction-text'} />
									</ListItem>
								))}
							</List>
						</Box>
					)}

					{/* Target & Secondary Muscles */}
					<Grid container spacing={3} className={'exercise-muscles-section'}>
						{exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
							<Grid item xs={12} md={6}>
								<Box className={'muscle-group-card'}>
									<Typography variant="h6" gutterBottom className={'section-title'}>
										Target Muscles
									</Typography>
									<Stack direction="row" spacing={1} flexWrap="wrap" className={'muscle-chips'}>
										{exercise.targetMuscles.map((muscle, index) => (
											<Chip key={index} label={formatMuscleGroupName(muscle)} size="small" className={'muscle-chip'} />
										))}
									</Stack>
								</Box>
							</Grid>
						)}
						{exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
							<Grid item xs={12} md={6}>
								<Box className={'muscle-group-card'}>
									<Typography variant="h6" gutterBottom className={'section-title'}>
										Secondary Muscles
									</Typography>
									<Stack direction="row" spacing={1} flexWrap="wrap" className={'muscle-chips'}>
										{exercise.secondaryMuscles.map((muscle, index) => (
											<Chip key={index} label={formatMuscleGroupName(muscle)} size="small" className={'muscle-chip secondary'} />
										))}
									</Stack>
								</Box>
							</Grid>
						)}
					</Grid>

					{/* Tips, Warnings & Common Mistakes */}
					<Grid container spacing={3} className={'exercise-info-cards'}>
						{exercise.exerciseTips && exercise.exerciseTips.length > 0 && (
							<Grid item xs={12} md={4}>
								<Box className={'info-card tips'}>
									<Typography variant="h6" gutterBottom className={'card-title'}>
										💡 Tips
							</Typography>
									<List className={'tips-list'}>
										{exercise.exerciseTips.map((tip, index) => (
											<ListItem key={index} className={'tip-item'}>
												<ListItemText primary={tip} />
											</ListItem>
										))}
									</List>
								</Box>
							</Grid>
						)}
						{exercise.exerciseWarnings && exercise.exerciseWarnings.length > 0 && (
							<Grid item xs={12} md={4}>
								<Box className={'info-card warnings'}>
									<Typography variant="h6" gutterBottom className={'card-title'}>
										⚠️ Warnings
							</Typography>
									<List className={'warnings-list'}>
										{exercise.exerciseWarnings.map((warning, index) => (
											<ListItem key={index} className={'warning-item'}>
												<ListItemText primary={warning} />
											</ListItem>
										))}
									</List>
								</Box>
							</Grid>
						)}
						{exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
							<Grid item xs={12} md={4}>
								<Box className={'info-card mistakes'}>
									<Typography variant="h6" gutterBottom className={'card-title'}>
										❌ Common Mistakes
									</Typography>
									<List className={'mistakes-list'}>
										{exercise.commonMistakes.map((mistake, index) => (
											<ListItem key={index} className={'mistake-item'}>
												<ListItemText primary={mistake} />
											</ListItem>
										))}
									</List>
					</Box>
							</Grid>
						)}
					</Grid>

					{/* Equipment */}
					{exercise.exerciseEquipment && exercise.exerciseEquipment.length > 0 && (
						<Box className={'exercise-equipment'}>
							<Typography variant="h6" gutterBottom>
								Required Equipment
							</Typography>
							<Stack direction="row" spacing={1} flexWrap="wrap">
								{exercise.exerciseEquipment.map((equipment, index) => (
									<Chip key={index} label={formatEquipmentName(equipment)} size="small" className={'equipment-chip'} />
								))}
							</Stack>
						</Box>
					)}

					{/* Tags */}
					{exercise.exerciseTags && exercise.exerciseTags.length > 0 && (
						<Box className={'exercise-tags'}>
									<Typography variant="h6" gutterBottom>
								Tags
									</Typography>
							<Stack direction="row" spacing={1} flexWrap="wrap">
								{exercise.exerciseTags.map((tag, index) => (
									<Chip key={index} label={tag} size="small" />
								))}
							</Stack>
						</Box>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(ExerciseDetailPage);






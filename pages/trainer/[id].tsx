import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack, Typography, Grid } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useMemo } from 'react';
import { GET_MEMBER, GET_TRAINER_WORKOUTS } from '../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { Member } from '../../libs/types/member/member';
import { Direction } from '../../libs/enums/common.enum';
import TrainerProfileHeader from '../../libs/components/trainer/TrainerProfileHeader';
import TrainerDNA from '../../libs/components/trainer/TrainerDNA';
import TrainerProgramMap from '../../libs/components/trainer/TrainerProgramMap';
import TrainerWorkoutsGrid from '../../libs/components/trainer/TrainerWorkoutsGrid';
import BookingModal from '../../libs/components/trainer/BookingModal';
import { TrainerProfileSkeleton } from '../../libs/components/trainer/TrainerSkeleton';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import { buildTrainerWorkoutsInquiryInput } from '../../libs/utils/trainer.utils';
import { GetMemberData, GetMemberVariables, GetTrainerWorkoutsData, GetTrainerWorkoutsVariables } from '../../libs/types/trainer/trainer.types';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TrainerDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const device = useDeviceDetect();
	const [bookingModalOpen, setBookingModalOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	// Build inquiry input for workouts with useMemo
	const workoutsInquiryInput = useMemo(() => {
		if (!id || typeof id !== 'string') return null;
		return buildTrainerWorkoutsInquiryInput(
			id,
			{ page: 1, limit: 50 },
			{ sort: 'createdAt', direction: Direction.DESC }
		);
	}, [id]);

	// Fetch trainer data
	const {
		loading: trainerLoading,
		data: trainerData,
		error: trainerError,
		refetch: trainerRefetch,
	} = useQuery<GetMemberData, GetMemberVariables>(GET_MEMBER, {
		skip: !id || typeof id !== 'string',
		fetchPolicy: 'cache-and-network',
		variables: { input: id as string },
	});

	// Fetch trainer workouts
	const {
		loading: workoutsLoading,
		data: workoutsData,
		error: workoutsError,
		refetch: workoutsRefetch,
	} = useQuery<GetTrainerWorkoutsData, GetTrainerWorkoutsVariables>(GET_TRAINER_WORKOUTS, {
		skip: !workoutsInquiryInput,
		fetchPolicy: 'cache-and-network',
		variables: { input: workoutsInquiryInput! },
	});

	const trainer: Member | null = trainerData?.getMember || null;
	const workouts = workoutsData?.getTrainerWorkouts?.list || [];

	const handleBookSession = () => {
		setBookingModalOpen(true);
	};

	const handleMessage = () => {
		// TODO: Implement messaging flow
		console.log('Message trainer:', trainer?._id);
	};

	const handleCategoryClick = (category: string) => {
		setSelectedCategory(category);
		// Scroll to workouts section
		setTimeout(() => {
			const workoutsSection = document.getElementById('workouts-section');
			if (workoutsSection) {
				workoutsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}, 100);
	};

	const handleRefetch = () => {
		trainerRefetch();
		workoutsRefetch();
	};

	if (device === 'mobile') {
		return (
			<Box
				className="trainer-detail-page-mobile"
				sx={{
					width: '100%',
					maxWidth: '100%',
					padding: 2,
					backgroundColor: '#FAFAFA',
					minHeight: 'calc(100vh - 200px)',
					overflowX: 'hidden',
				}}
			>
				{trainerLoading ? (
					<TrainerProfileSkeleton />
				) : trainerError ? (
					<Box sx={{ textAlign: 'center', py: 4 }}>
						<ErrorOutlineIcon sx={{ fontSize: 48, color: '#9E9E9E', mb: 2 }} />
						<Typography variant="body1" sx={{ mb: 2, color: '#616161' }}>
							Error loading trainer
						</Typography>
						<Button variant="contained" onClick={() => trainerRefetch()} startIcon={<RefreshIcon />}>
							Retry
						</Button>
					</Box>
				) : !trainer ? (
					<Box sx={{ textAlign: 'center', py: 4 }}>
						<Typography variant="body1" sx={{ color: '#616161' }}>
							Trainer not found
						</Typography>
					</Box>
				) : (
					<Stack spacing={3}>
						<TrainerProfileHeader trainer={trainer} onBookSession={handleBookSession} onMessage={handleMessage} onRefetch={handleRefetch} />
						<TrainerDNA trainer={trainer} />
						<TrainerProgramMap trainer={trainer} workouts={workouts} onCategoryClick={handleCategoryClick} />
						<Box id="workouts-section">
							<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
								Workouts
							</Typography>
							<TrainerWorkoutsGrid workouts={workouts} loading={workoutsLoading} />
						</Box>
					</Stack>
				)}
				{trainer && (
					<BookingModal
						open={bookingModalOpen}
						onClose={() => setBookingModalOpen(false)}
						trainerId={trainer._id}
						trainerName={trainer.memberFullName || trainer.memberNick || 'Trainer'}
					/>
				)}
			</Box>
		);
	}

	return (
		<Box
			className="trainer-detail-page"
			sx={{
				width: '100%',
				minHeight: 'calc(100vh - 200px)',
				backgroundColor: '#FAFAFA',
				paddingTop: { xs: 3, md: 4 },
				paddingBottom: { xs: 4, md: 6 },
				paddingX: { xs: 2, sm: 3 },
			}}
		>
			<Box
				sx={{
					maxWidth: '1300px',
					width: '100%',
					margin: '0 auto',
					paddingX: { xs: 0, sm: 2, md: 3 },
				}}
			>
				{trainerLoading ? (
					<TrainerProfileSkeleton />
				) : trainerError ? (
					<Box
						sx={{
							textAlign: 'center',
							py: 8,
							backgroundColor: '#FFFFFF',
							borderRadius: 2,
							border: '1px solid #E5E5E5',
						}}
					>
						<ErrorOutlineIcon sx={{ fontSize: 64, color: '#9E9E9E', mb: 2 }} />
						<Typography variant="h6" sx={{ mb: 1, color: '#212121', fontWeight: 600 }}>
							Error loading trainer
						</Typography>
						<Typography variant="body2" sx={{ mb: 3, color: '#757575', maxWidth: 400, margin: '0 auto' }}>
							{trainerError.message || 'Something went wrong. Please try again.'}
						</Typography>
						<Button
							variant="contained"
							onClick={() => trainerRefetch()}
							startIcon={<RefreshIcon />}
							sx={{
								backgroundColor: '#212121',
								color: '#FFFFFF',
								fontWeight: 600,
								textTransform: 'none',
								px: 3,
								'&:hover': {
									backgroundColor: '#424242',
								},
							}}
						>
							Retry
						</Button>
					</Box>
				) : !trainer ? (
					<Box
						sx={{
							textAlign: 'center',
							py: 8,
							backgroundColor: '#FFFFFF',
							borderRadius: 2,
							border: '1px solid #E5E5E5',
						}}
					>
						<Typography variant="h6" sx={{ mb: 1, color: '#212121', fontWeight: 600 }}>
							Trainer not found
						</Typography>
						<Typography variant="body2" sx={{ color: '#757575' }}>
							The trainer you're looking for doesn't exist or has been removed.
						</Typography>
					</Box>
				) : (
					<>
						{/* A) Trainer Profile Header */}
						<TrainerProfileHeader trainer={trainer} onBookSession={handleBookSession} onMessage={handleMessage} onRefetch={handleRefetch} />

						{/* B) Coaching Style Panel */}
						<TrainerDNA trainer={trainer} />

						{/* C) Program Map Section */}
						<Box sx={{ mb: { xs: 3, md: 4 } }}>
							<TrainerProgramMap trainer={trainer} workouts={workouts} onCategoryClick={handleCategoryClick} />
						</Box>

						{/* D) Trainer Workouts Section */}
						<Box id="workouts-section" sx={{ mb: { xs: 3, md: 4 } }}>
							<Typography
								variant="h5"
								sx={{
									fontSize: { xs: '20px', md: '24px' },
									fontWeight: 600,
									color: '#212121',
									marginBottom: { xs: 2, md: 3 },
								}}
							>
								Workouts ({workouts.length})
							</Typography>
							{workoutsError ? (
								<Box
									sx={{
										textAlign: 'center',
										py: 4,
										backgroundColor: '#FFFFFF',
										borderRadius: 2,
										border: '1px solid #E5E5E5',
									}}
								>
									<ErrorOutlineIcon sx={{ fontSize: 48, color: '#9E9E9E', mb: 1 }} />
									<Typography variant="body2" sx={{ color: '#757575' }}>
										Error loading workouts
									</Typography>
								</Box>
							) : (
								<TrainerWorkoutsGrid workouts={workouts} loading={workoutsLoading} />
							)}
						</Box>
					</>
				)}
			</Box>

			{/* E) Booking Modal */}
			{trainer && (
				<BookingModal
					open={bookingModalOpen}
					onClose={() => setBookingModalOpen(false)}
					trainerId={trainer._id}
					trainerName={trainer.memberFullName || trainer.memberNick || 'Trainer'}
				/>
			)}
		</Box>
	);
};

export default withLayoutBasic(TrainerDetailPage);

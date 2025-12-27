import React from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	Stack,
	Divider,
	Alert,
	Button,
	CircularProgress,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import moment from 'moment';
import styles from '../../../scss/pc/booking/booking.module.scss';
import { Service } from '../../types/service/service';

interface BookingSummaryProps {
	selectedTrainer: any | null;
	selectedService: Service | null;
	bookingDate: Date | null;
	bookingTime: string | null;
	durationMinutes: number;
	totalPrice: number;
	user: any;
	creatingBooking: boolean;
	isFormValid: boolean;
	onSubmit: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
	selectedTrainer,
	selectedService,
	bookingDate,
	bookingTime,
	durationMinutes,
	totalPrice,
	user,
	creatingBooking,
	isFormValid,
	onSubmit,
}) => {
	// Format date for display
	const formatDate = (date: Date | null) => {
		if (!date) return '—';
		return moment(date).format('MMMM DD, YYYY');
	};

	// Format time for display
	const formatTime = (timeStr: string | null) => {
		if (!timeStr) return '';
		return moment(timeStr, 'HH:mm').format('h:mm A');
	};

	// Format date and time together
	const formatDateTime = (date: Date | null, time: string | null) => {
		if (!date && !time) return '—';
		if (!date) return `— ${formatTime(time)}`;
		if (!time) return `${formatDate(date)} —`;
		return `${formatDate(date)} ${formatTime(time)}`;
	};

	// Format duration for display
	const formatDuration = (minutes: number) => {
		if (!minutes || minutes === 0) return '—';
		if (minutes === 30) return '30 minutes';
		if (minutes === 60) return '1 hour';
		if (minutes === 90) return '1.5 hours';
		if (minutes === 120) return '2 hours';
		return `${minutes} minutes`;
	};

	// Format service for display
	const formatService = (service: Service | null) => {
		if (!service) return '—';
		return service.title || '—';
	};

	// Format trainer name for display
	const formatTrainerName = (trainer: any | null) => {
		if (!trainer) return '—';
		return trainer.memberFullName || trainer.memberNick || '—';
	};

	// Format total price for display
	const formatTotalPrice = (price: number) => {
		if (!price || price === 0) return '—';
		return `$${price.toFixed(2)}`;
	};

	return (
		<Box className={styles.summaryContainer}>
			<Card className={styles.summaryCard}>
				<CardContent className={styles.summaryCardContent}>
					<Typography
						variant="h6"
						className={styles.summaryTitle}
					>
						Booking Summary
					</Typography>
					<Stack spacing={2.5}>
						<Box>
							<Typography
								variant="body2"
								className={styles.summaryLabel}
							>
								Trainer
							</Typography>
							<Typography
								variant="body1"
								className={selectedTrainer ? styles.summaryValue : styles.summaryValueSecondary}
							>
								{formatTrainerName(selectedTrainer)}
							</Typography>
							{selectedTrainer?.trainerRating && (
								<Box className={styles.starContainer}>
									<StarIcon className={styles.starIcon} />
									<Typography
										variant="body2"
										className={styles.starRating}
									>
										{selectedTrainer.trainerRating.toFixed(1)}
									</Typography>
								</Box>
							)}
							{selectedTrainer?.trainerExperience && (
								<Typography
									variant="body2"
									className={styles.summaryValueTertiary}
								>
									{selectedTrainer.trainerExperience}{' '}
									{selectedTrainer.trainerExperience === 1 ? 'year' : 'years'} experience
								</Typography>
							)}
							{selectedTrainer?.trainerSpecialties && selectedTrainer.trainerSpecialties.length > 0 && (
								<Box sx={{ mt: 0.75 }}>
									<Typography
										variant="body2"
										className={styles.summaryValueSmallTertiary}
									>
										{selectedTrainer.trainerSpecialties.slice(0, 2).join(', ')}
									</Typography>
								</Box>
							)}
						</Box>
						{selectedTrainer && <Divider className={styles.summaryDivider} />}
						<Box>
							<Typography
								variant="body2"
								className={styles.summaryLabel}
							>
								Service
							</Typography>
							<Typography variant="body1" className={styles.summaryValueSmall}>
								{formatService(selectedService)}
							</Typography>
						</Box>
						<Box>
							<Typography
								variant="body2"
								className={styles.summaryLabel}
							>
								Date & Time
							</Typography>
							<Typography variant="body1" className={styles.summaryValueSmall}>
								{formatDateTime(bookingDate, bookingTime)}
							</Typography>
						</Box>
						<Box>
							<Typography
								variant="body2"
								className={styles.summaryLabel}
							>
								Duration
							</Typography>
							<Typography variant="body1" className={styles.summaryValueSmall}>
								{formatDuration(durationMinutes)}
							</Typography>
						</Box>
						<Divider className={styles.summaryDivider} sx={{ my: 1 }} />
						<Box>
							<Typography
								variant="body2"
								className={styles.summaryLabel}
								sx={{ mb: 1 }}
							>
								Total
							</Typography>
							<Typography
								variant="h5"
								className={styles.summaryTotal}
							>
								{formatTotalPrice(totalPrice)}
							</Typography>
						</Box>
					</Stack>
					{!user?._id && (
						<Alert
							severity="warning"
							className={styles.alert}
							sx={{
								'& .MuiAlert-icon': {
									color: '#ff9800',
								},
							}}
						>
							Please login to confirm your booking
						</Alert>
					)}
					<Button
						variant="contained"
						fullWidth
						size="large"
						onClick={onSubmit}
						disabled={creatingBooking || !isFormValid}
						sx={{
							borderRadius: 2,
							textTransform: 'none',
							fontWeight: 600,
							py: 1.5,
							backgroundColor: '#E92C28',
							color: '#fff',
							'&:hover': {
								backgroundColor: '#C92420',
							},
							'&:focus': {
								backgroundColor: '#C92420',
								outline: '2px solid #E92C28',
								outlineOffset: '2px',
							},
							'&:disabled': {
								backgroundColor: '#e0e0e0',
								color: '#9e9e9e',
							},
						}}
					>
						{creatingBooking ? (
							<>
								<CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />
								Creating Booking...
							</>
						) : (
							'Confirm Booking'
						)}
					</Button>
				</CardContent>
			</Card>
		</Box>
	);
};

export default BookingSummary;


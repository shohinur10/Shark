import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import BookingForm from './BookingForm';
import BookingSummary from './BookingSummary';
import styles from '../../../scss/pc/booking/booking.module.scss';
import { Service } from '../../types/service/service';

interface BookingPageProps {
	selectedTrainerId: string | null;
	selectedTrainer: any | null;
	selectedServiceId: string | null;
	selectedService: Service | null;
	bookingDate: Date | null;
	bookingTime: string | null;
	durationMinutes: number;
	locationType: string;
	notes: string;
	trainerIdParam: string | string[] | undefined;
	trainersLoading: boolean;
	trainersError: any;
	trainersData: any;
	servicesData: Service[];
	servicesLoading: boolean;
	servicesError: any;
	availableSlots: string[];
	availabilityLoading: boolean;
	availabilityError: any;
	validationErrors: {
		trainerId?: string;
		serviceId?: string;
		date?: string;
		time?: string;
		duration?: string;
	};
	minDate: string;
	totalPrice: number;
	user: any;
	creatingBooking: boolean;
	isFormValid: boolean;
	onTrainerChange: (trainerId: string) => void;
	onServiceChange: (serviceId: string) => void;
	onBookingDateChange: (date: Date | null) => void;
	onBookingTimeChange: (time: string | null) => void;
	onDurationChange: (duration: number) => void;
	onLocationChange: (location: string) => void;
	onNotesChange: (notes: string) => void;
	onSubmit: () => void;
}

const BookingPage: React.FC<BookingPageProps> = ({
	selectedTrainerId,
	selectedTrainer,
	selectedServiceId,
	selectedService,
	bookingDate,
	bookingTime,
	durationMinutes,
	locationType,
	notes,
	trainerIdParam,
	trainersLoading,
	trainersError,
	trainersData,
	servicesData,
	servicesLoading,
	servicesError,
	availableSlots,
	availabilityLoading,
	availabilityError,
	validationErrors,
	minDate,
	totalPrice,
	user,
	creatingBooking,
	isFormValid,
	onTrainerChange,
	onServiceChange,
	onBookingDateChange,
	onBookingTimeChange,
	onDurationChange,
	onLocationChange,
	onNotesChange,
	onSubmit,
}) => {
	const router = useRouter();

	return (
		<Box className={styles.container}>
			<Box className={styles.innerContainer}>
				{/* Header */}
				<Box className={styles.header}>
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => router.back()}
						className={styles.backButton}
					>
						Back
					</Button>
					<Typography
						variant="h3"
						className={styles.title}
					>
						Book a Session
					</Typography>
				</Box>

				<Grid container spacing={{ xs: 2, md: 3 }}>
					{/* Form Section */}
					<Grid item xs={12} md={8}>
						<BookingForm
							selectedTrainerId={selectedTrainerId}
							selectedTrainer={selectedTrainer}
							selectedServiceId={selectedServiceId}
							selectedService={selectedService}
							bookingDate={bookingDate}
							bookingTime={bookingTime}
							durationMinutes={durationMinutes}
							locationType={locationType}
							notes={notes}
							trainerIdParam={trainerIdParam}
							trainersLoading={trainersLoading}
							trainersError={trainersError}
							trainersData={trainersData}
							servicesData={servicesData}
							servicesLoading={servicesLoading}
							servicesError={servicesError}
							availableSlots={availableSlots}
							availabilityLoading={availabilityLoading}
							availabilityError={availabilityError}
							validationErrors={validationErrors}
							minDate={minDate}
							onTrainerChange={onTrainerChange}
							onServiceChange={onServiceChange}
							onBookingDateChange={onBookingDateChange}
							onBookingTimeChange={onBookingTimeChange}
							onDurationChange={onDurationChange}
							onLocationChange={onLocationChange}
							onNotesChange={onNotesChange}
						/>
					</Grid>

					{/* Summary Section - Sticky on Desktop */}
					<Grid item xs={12} md={4}>
						<BookingSummary
							selectedTrainer={selectedTrainer}
							selectedService={selectedService}
							bookingDate={bookingDate}
							bookingTime={bookingTime}
							durationMinutes={durationMinutes}
							totalPrice={totalPrice}
							user={user}
							creatingBooking={creatingBooking}
							isFormValid={isFormValid}
							onSubmit={onSubmit}
						/>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
};

export default BookingPage;


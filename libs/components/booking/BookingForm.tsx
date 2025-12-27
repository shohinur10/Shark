import React from 'react';
import {
	Grid,
	Card,
	CardContent,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Typography,
	InputAdornment,
	FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import moment from 'moment';
import styles from '../../../scss/pc/booking/booking.module.scss';
import { Service } from '../../types/service/service';

interface BookingFormProps {
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
	onTrainerChange: (trainerId: string) => void;
	onServiceChange: (serviceId: string) => void;
	onBookingDateChange: (date: Date | null) => void;
	onBookingTimeChange: (time: string | null) => void;
	onDurationChange: (duration: number) => void;
	onLocationChange: (location: string) => void;
	onNotesChange: (notes: string) => void;
}

// Format duration for display
const formatDurationLabel = (minutes: number) => {
	if (minutes === 30) return '30 minutes';
	if (minutes === 60) return '1 hour';
	if (minutes === 90) return '1.5 hours';
	if (minutes === 120) return '2 hours';
	return `${minutes} minutes`;
};

const BookingForm: React.FC<BookingFormProps> = ({
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
	onTrainerChange,
	onServiceChange,
	onBookingDateChange,
	onBookingTimeChange,
	onDurationChange,
	onLocationChange,
	onNotesChange,
}) => {
	return (
		<Card className={styles.formCard}>
			<CardContent className={styles.formCardContent}>
				<Grid container spacing={{ xs: 2, md: 2.5 }}>
					{/* Trainer Selection */}
					<Grid item xs={12}>
						<FormControl fullWidth>
							<InputLabel
								className={styles.selectLabel}
								sx={{
									'&.Mui-focused': {
										color: '#E92C28',
									},
								}}
							>
								Select Trainer
							</InputLabel>
							<Select
								value={selectedTrainerId || ''}
								onChange={(e) => onTrainerChange(e.target.value)}
								label="Select Trainer"
								disabled={!!trainerIdParam || trainersLoading}
								sx={{
									color: '#212121',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#e0e0e0',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#bdbdbd',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: '#E92C28',
										borderWidth: '2px',
									},
									'& .MuiSvgIcon-root': {
										color: '#212121',
									},
								}}
							>
								{trainersLoading ? (
									<MenuItem disabled className={styles.menuItemDisabled}>
										Loading trainers...
									</MenuItem>
								) : trainersError ? (
									<MenuItem disabled className={styles.menuItemDisabled}>
										Error loading trainers
									</MenuItem>
								) : trainersData?.getTrainers?.list?.length > 0 ? (
									trainersData.getTrainers.list.map((trainer: any) => (
										<MenuItem
											key={trainer._id}
											value={trainer._id}
											className={styles.menuItem}
											sx={{
												'&:hover': {
													backgroundColor: 'rgba(233, 44, 40, 0.08)',
												},
												'&.Mui-selected': {
													backgroundColor: 'rgba(233, 44, 40, 0.12)',
												},
											}}
										>
											{trainer.memberFullName || trainer.memberNick}
											{trainer.trainerRating ? ` ⭐ ${trainer.trainerRating.toFixed(1)}` : ''}
										</MenuItem>
									))
								) : (
									<MenuItem disabled className={styles.menuItemDisabled}>
										No trainers available
									</MenuItem>
								)}
							</Select>
							{trainersError && (
								<Typography variant="caption" className={styles.errorText}>
									Error loading trainers. Please try again.
								</Typography>
							)}
							{validationErrors.trainerId && (
								<FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
									{validationErrors.trainerId}
								</FormHelperText>
							)}
						</FormControl>
					</Grid>

					{/* Service Selection */}
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth>
							<InputLabel
								sx={{
									color: '#616161',
									'&.Mui-focused': {
										color: '#E92C28',
									},
								}}
							>
								Service
							</InputLabel>
							<Select
								value={selectedServiceId || ''}
								onChange={(e) => onServiceChange(e.target.value)}
								label="Service"
								disabled={servicesLoading}
								sx={{
									color: '#212121',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#e0e0e0',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#bdbdbd',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: '#E92C28',
										borderWidth: '2px',
									},
									'& .MuiSvgIcon-root': {
										color: '#212121',
									},
								}}
							>
								{servicesLoading ? (
									<MenuItem disabled sx={{ color: 'rgba(33, 33, 33, 0.5)' }}>
										Loading services...
									</MenuItem>
								) : servicesError ? (
									<MenuItem disabled sx={{ color: 'rgba(33, 33, 33, 0.5)' }}>
										Error loading services
									</MenuItem>
								) : servicesData && servicesData.length > 0 ? (
									servicesData.map((service: Service) => (
										<MenuItem
											key={service._id}
											value={service._id}
											sx={{
												color: '#212121',
												'&:hover': {
													backgroundColor: 'rgba(233, 44, 40, 0.08)',
												},
												'&.Mui-selected': {
													backgroundColor: 'rgba(233, 44, 40, 0.12)',
												},
											}}
										>
											{service.title}
										</MenuItem>
									))
								) : (
									<MenuItem disabled sx={{ color: 'rgba(33, 33, 33, 0.5)' }}>
										No services available
									</MenuItem>
								)}
							</Select>
							{servicesError && (
								<Typography variant="caption" className={styles.errorText}>
									Error loading services. Please try again.
								</Typography>
							)}
							{validationErrors.serviceId && (
								<FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
									{validationErrors.serviceId}
								</FormHelperText>
							)}
						</FormControl>
					</Grid>

					{/* Date */}
					<Grid item xs={12} sm={6}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								label="Date"
								value={bookingDate}
								onChange={(newValue: Date | null) => {
									if (newValue) {
										// Set time to start of day to avoid timezone issues
										const date = new Date(newValue);
										date.setHours(0, 0, 0, 0);
										onBookingDateChange(date);
										// Clear time when date changes
										onBookingTimeChange(null);
									} else {
										onBookingDateChange(null);
									}
								}}
								minDate={(() => {
									// Convert minDate string to Date object at start of day
									const [year, month, day] = minDate.split('-').map(Number);
									const date = new Date(year, month - 1, day);
									date.setHours(0, 0, 0, 0);
									return date;
								})()}
								renderInput={(params) => (
									<TextField
										{...params}
										fullWidth
										required
										sx={{
											'& .MuiOutlinedInput-root': {
												color: '#212121',
												'& .MuiOutlinedInput-notchedOutline': {
													borderColor: '#e0e0e0',
												},
												'&:hover .MuiOutlinedInput-notchedOutline': {
													borderColor: '#bdbdbd',
												},
												'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
													borderColor: '#E92C28',
													borderWidth: '2px',
												},
											},
											'& .MuiInputLabel-root': {
												color: '#616161',
												'&.Mui-focused': {
													color: '#E92C28',
												},
											},
											'& .MuiSvgIcon-root': {
												color: '#616161',
											},
										}}
									/>
								)}
							/>
						</LocalizationProvider>
						{validationErrors.date && (
							<FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
								{validationErrors.date}
							</FormHelperText>
						)}
					</Grid>

					{/* Time */}
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth>
							<InputLabel
								sx={{
									color: '#616161',
									'&.Mui-focused': {
										color: '#E92C28',
									},
								}}
							>
								Time
							</InputLabel>
							<Select
								value={bookingTime || ''}
								onChange={(e) => onBookingTimeChange(e.target.value || null)}
								label="Time"
								disabled={!selectedTrainerId || !bookingDate || availabilityLoading}
								sx={{
									color: '#212121',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#e0e0e0',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#bdbdbd',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: '#E92C28',
										borderWidth: '2px',
									},
									'& .MuiSvgIcon-root': {
										color: '#616161',
									},
								}}
							>
								{!selectedTrainerId || !bookingDate ? (
									<MenuItem disabled sx={{ color: 'rgba(33, 33, 33, 0.5)' }}>
										Select trainer and date first
									</MenuItem>
								) : availabilityLoading ? (
									<MenuItem disabled sx={{ color: 'rgba(33, 33, 33, 0.5)' }}>
										Loading available times...
									</MenuItem>
								) : availabilityError ? (
									<MenuItem disabled sx={{ color: 'rgba(33, 33, 33, 0.5)' }}>
										Error loading availability
									</MenuItem>
								) : availableSlots && availableSlots.length > 0 ? (
									availableSlots.map((slot: string) => (
										<MenuItem
											key={slot}
											value={slot}
											sx={{
												color: '#212121',
												'&:hover': {
													backgroundColor: 'rgba(233, 44, 40, 0.08)',
												},
												'&.Mui-selected': {
													backgroundColor: 'rgba(233, 44, 40, 0.12)',
												},
											}}
										>
											{moment(slot, 'HH:mm').format('h:mm A')}
										</MenuItem>
									))
								) : (
									<MenuItem disabled sx={{ color: 'rgba(33, 33, 33, 0.5)' }}>
										No available times
									</MenuItem>
								)}
							</Select>
							{availabilityError && (
								<Typography variant="caption" className={styles.errorText}>
									Error loading availability. Please try again.
								</Typography>
							)}
							{validationErrors.time && (
								<FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
									{validationErrors.time}
								</FormHelperText>
							)}
						</FormControl>
					</Grid>

					{/* Duration */}
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth>
							<InputLabel
								sx={{
									color: '#616161',
									'&.Mui-focused': {
										color: '#E92C28',
									},
								}}
							>
								Duration
							</InputLabel>
							<Select
								value={durationMinutes || ''}
								onChange={(e) => onDurationChange(Number(e.target.value))}
								label="Duration"
								disabled={!selectedService || !selectedService.durationOptions || selectedService.durationOptions.length === 0}
								sx={{
									color: '#212121',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#e0e0e0',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#bdbdbd',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: '#E92C28',
										borderWidth: '2px',
									},
									'& .MuiSvgIcon-root': {
										color: '#212121',
									},
								}}
							>
								{!selectedService ? (
									<MenuItem disabled sx={{ color: 'rgba(33, 33, 33, 0.5)' }}>
										Select a service first
									</MenuItem>
								) : selectedService.durationOptions && selectedService.durationOptions.length > 0 ? (
									selectedService.durationOptions.map((minutes: number) => (
										<MenuItem
											key={minutes}
											value={minutes}
											sx={{
												color: '#212121',
												'&:hover': {
													backgroundColor: 'rgba(233, 44, 40, 0.08)',
												},
												'&.Mui-selected': {
													backgroundColor: 'rgba(233, 44, 40, 0.12)',
												},
											}}
										>
											{formatDurationLabel(minutes)}
										</MenuItem>
									))
								) : (
									<MenuItem disabled sx={{ color: 'rgba(33, 33, 33, 0.5)' }}>
										No duration options available
									</MenuItem>
								)}
							</Select>
							{validationErrors.duration && (
								<FormHelperText error sx={{ mt: 0.5, mx: 1.75 }}>
									{validationErrors.duration}
								</FormHelperText>
							)}
						</FormControl>
					</Grid>

					{/* Location */}
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth>
							<InputLabel
								sx={{
									color: '#616161',
									'&.Mui-focused': {
										color: '#E92C28',
									},
								}}
							>
								Location
							</InputLabel>
							<Select
								value={locationType || ''}
								onChange={(e) => onLocationChange(e.target.value)}
								label="Location"
								sx={{
									color: '#212121',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#e0e0e0',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#bdbdbd',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: '#E92C28',
										borderWidth: '2px',
									},
									'& .MuiSvgIcon-root': {
										color: '#212121',
									},
								}}
							>
								<MenuItem
									value="in-person"
									sx={{
										color: '#212121',
										'&:hover': {
											backgroundColor: 'rgba(233, 44, 40, 0.08)',
										},
										'&.Mui-selected': {
											backgroundColor: 'rgba(233, 44, 40, 0.12)',
										},
									}}
								>
									In-Person
								</MenuItem>
								<MenuItem
									value="online"
									sx={{
										color: '#212121',
										'&:hover': {
											backgroundColor: 'rgba(233, 44, 40, 0.08)',
										},
										'&.Mui-selected': {
											backgroundColor: 'rgba(233, 44, 40, 0.12)',
										},
									}}
								>
									Online
								</MenuItem>
							</Select>
						</FormControl>
					</Grid>

					{/* Notes */}
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Additional Notes (Optional)"
							multiline
							rows={4}
							value={notes}
							onChange={(e) => onNotesChange(e.target.value)}
							InputLabelProps={{
								sx: {
									color: '#616161',
									'&.Mui-focused': {
										color: '#E92C28',
									},
								},
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									color: '#212121',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#e0e0e0',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#bdbdbd',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: '#E92C28',
										borderWidth: '2px',
									},
								},
							}}
						/>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default BookingForm;


import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Stack,
	Box,
	Typography,
	IconButton,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from '@apollo/client';
import { CREATE_BOOKING } from '../../../apollo/user/mutation';
import { BookingType } from '../../../libs/enums/booking.enum';
import { sweetTopSmallSuccessAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface BookingModalProps {
	open: boolean;
	onClose: () => void;
	trainerId: string;
	trainerName: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ open, onClose, trainerId, trainerName }) => {
	const user = useReactiveVar(userVar);
	const [createBooking] = useMutation(CREATE_BOOKING);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		bookingDate: '',
		bookingTime: '',
		sessionDuration: 60,
		bookingNotes: '',
	});

	const handleSubmit = async () => {
		try {
			if (!user._id) {
				sweetErrorHandling({ message: 'Please login to book a session' });
				return;
			}

			if (!formData.bookingDate || !formData.bookingTime) {
				sweetErrorHandling({ message: 'Please select date and time' });
				return;
			}

			setLoading(true);

			const bookingDate = new Date(`${formData.bookingDate}T${formData.bookingTime}`);
			
			await createBooking({
				variables: {
					input: {
						bookingType: BookingType.PERSONAL_TRAINING,
						providerId: trainerId,
						bookingDate: bookingDate,
						bookingTime: formData.bookingTime,
						sessionDuration: formData.sessionDuration,
						bookingPrice: 0, // Can be set based on trainer pricing
						bookingNotes: formData.bookingNotes,
						clientId: user._id,
					},
				},
			});

			await sweetTopSmallSuccessAlert('Booking created successfully!', 2000);
			onClose();
			setFormData({
				bookingDate: '',
				bookingTime: '',
				sessionDuration: 60,
				bookingNotes: '',
			});
		} catch (err: any) {
			sweetErrorHandling(err);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		onClose();
		setFormData({
			bookingDate: '',
			bookingTime: '',
			sessionDuration: 60,
			bookingNotes: '',
		});
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Typography variant="h6" sx={{ fontWeight: 600 }}>
						Book a Session with {trainerName}
					</Typography>
					<IconButton onClick={handleClose} size="small">
						<CloseIcon />
					</IconButton>
				</Stack>
			</DialogTitle>
			<DialogContent>
				<Stack spacing={3} sx={{ mt: 1 }}>
					<TextField
						label="Date"
						type="date"
						value={formData.bookingDate}
						onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
						InputLabelProps={{ shrink: true }}
						fullWidth
						inputProps={{ min: new Date().toISOString().split('T')[0] }}
					/>
					<TextField
						label="Time"
						type="time"
						value={formData.bookingTime}
						onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
						InputLabelProps={{ shrink: true }}
						fullWidth
					/>
					<FormControl fullWidth>
						<InputLabel>Duration</InputLabel>
						<Select
							value={formData.sessionDuration}
							label="Duration"
							onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value as number })}
						>
							<MenuItem value={30}>30 minutes</MenuItem>
							<MenuItem value={45}>45 minutes</MenuItem>
							<MenuItem value={60}>1 hour</MenuItem>
							<MenuItem value={90}>1.5 hours</MenuItem>
						</Select>
					</FormControl>
					<TextField
						label="Notes (optional)"
						multiline
						rows={4}
						value={formData.bookingNotes}
						onChange={(e) => setFormData({ ...formData, bookingNotes: e.target.value })}
						placeholder="Any special requests or information..."
						fullWidth
					/>
				</Stack>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 3 }}>
				<Button onClick={handleClose} sx={{ color: '#616161' }}>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit}
					disabled={loading}
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
					{loading ? 'Booking...' : 'Book Session'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default BookingModal;


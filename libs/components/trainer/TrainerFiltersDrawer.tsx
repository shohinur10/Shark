import React, { useState, useEffect } from 'react';
import {
	Drawer,
	Box,
	Typography,
	Stack,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Slider,
	Checkbox,
	FormControlLabel,
	Divider,
	IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TrainersInquiry } from '../../../libs/types/member/member.input';
import { Member } from '../../../libs/types/member/member';

interface TrainerFiltersDrawerProps {
	open: boolean;
	onClose: () => void;
	filters: TrainersInquiry;
	onFiltersChange: (filters: TrainersInquiry) => void;
	trainers: Member[];
	onReset: () => void;
	onApply: (filterState: {
		specialties: string[];
		minRating: number;
		minExperience: number;
		maxExperience: number;
	}) => void;
}

const TrainerFiltersDrawer: React.FC<TrainerFiltersDrawerProps> = ({
	open,
	onClose,
	filters,
	onFiltersChange,
	trainers,
	onReset,
	onApply,
}) => {
	// Extract unique specialties from trainers data
	const allSpecialties = new Set<string>();
	trainers.forEach((trainer) => {
		if (trainer.trainerSpecialties && Array.isArray(trainer.trainerSpecialties)) {
			trainer.trainerSpecialties.forEach((spec: string) => {
				if (spec) allSpecialties.add(spec);
			});
		}
	});
	const specialtiesList = Array.from(allSpecialties).sort();

	const [localFilters, setLocalFilters] = useState<{
		specialties: string[];
		minRating: number;
		minExperience: number;
		maxExperience: number;
	}>({
		specialties: [],
		minRating: 0,
		minExperience: 0,
		maxExperience: 20,
	});

	useEffect(() => {
		// Initialize local filters from props if needed
		// Note: Since TrainersInquiry doesn't support these filters in the schema,
		// we'll store them locally and apply client-side filtering if needed
	}, [filters]);

	const handleSpecialtyToggle = (specialty: string) => {
		setLocalFilters((prev) => ({
			...prev,
			specialties: prev.specialties.includes(specialty)
				? prev.specialties.filter((s) => s !== specialty)
				: [...prev.specialties, specialty],
		}));
	};

	const handleApply = () => {
		// Apply client-side filters
		onApply(localFilters);
		onClose();
	};

	const handleReset = () => {
		setLocalFilters({
			specialties: [],
			minRating: 0,
			minExperience: 0,
			maxExperience: 20,
		});
		onReset();
		onClose();
	};

	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			sx={{
				'& .MuiDrawer-paper': {
					width: { xs: '100%', sm: 400 },
					padding: 3,
				},
			}}
		>
			<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
				{/* Header */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
					<Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 600, color: '#212121' }}>
						Filters
					</Typography>
					<IconButton onClick={onClose} size="small">
						<CloseIcon />
					</IconButton>
				</Stack>

				<Divider sx={{ mb: 3 }} />

				{/* Filters Content */}
				<Box sx={{ flex: 1, overflowY: 'auto' }}>
					{/* Specialties */}
					{specialtiesList.length > 0 && (
						<Box sx={{ mb: 4 }}>
							<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#212121' }}>
								Specialties
							</Typography>
							<Stack spacing={1}>
								{specialtiesList.map((specialty) => (
									<FormControlLabel
										key={specialty}
										control={
											<Checkbox
												checked={localFilters.specialties.includes(specialty)}
												onChange={() => handleSpecialtyToggle(specialty)}
												size="small"
											/>
										}
										label={
											<Typography variant="body2" sx={{ fontSize: '14px', color: '#616161' }}>
												{specialty}
											</Typography>
										}
									/>
								))}
							</Stack>
						</Box>
					)}

					{/* Min Rating */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#212121' }}>
							Minimum Rating
						</Typography>
						<Slider
							value={localFilters.minRating}
							onChange={(_, value) => setLocalFilters((prev) => ({ ...prev, minRating: value as number }))}
							min={0}
							max={5}
							step={0.5}
							marks={[
								{ value: 0, label: '0' },
								{ value: 5, label: '5' },
							]}
							valueLabelDisplay="auto"
							valueLabelFormat={(value) => value.toFixed(1)}
						/>
					</Box>

					{/* Experience Range */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#212121' }}>
							Experience (years)
						</Typography>
						<Stack spacing={2}>
							<Typography variant="body2" sx={{ fontSize: '12px', color: '#757575' }}>
								Min: {localFilters.minExperience} years
							</Typography>
							<Slider
								value={[localFilters.minExperience, localFilters.maxExperience]}
								onChange={(_, value) => {
									const [min, max] = value as number[];
									setLocalFilters((prev) => ({ ...prev, minExperience: min, maxExperience: max }));
								}}
								min={0}
								max={20}
								step={1}
								valueLabelDisplay="auto"
							/>
							<Typography variant="body2" sx={{ fontSize: '12px', color: '#757575' }}>
								Max: {localFilters.maxExperience} years
							</Typography>
						</Stack>
					</Box>
				</Box>

				{/* Footer Actions */}
				<Stack direction="row" spacing={2} sx={{ mt: 3, pt: 3, borderTop: '1px solid #E5E5E5' }}>
					<Button
						variant="outlined"
						fullWidth
						onClick={handleReset}
						sx={{
							borderColor: '#E5E5E5',
							color: '#212121',
							fontWeight: 600,
							textTransform: 'none',
						}}
					>
						Reset
					</Button>
					<Button
						variant="contained"
						fullWidth
						onClick={handleApply}
						sx={{
							backgroundColor: '#212121',
							color: '#FFFFFF',
							fontWeight: 600,
							textTransform: 'none',
							'&:hover': {
								backgroundColor: '#424242',
							},
						}}
					>
						Apply
					</Button>
				</Stack>
			</Box>
		</Drawer>
	);
};

export default TrainerFiltersDrawer;


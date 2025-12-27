import React, { useState, useMemo } from 'react';
import {
	Drawer,
	Box,
	Typography,
	Slider,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Stack,
	Checkbox,
	FormControlLabel,
	Divider,
	IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Member } from '../../types/member/member';

interface TrainerFiltersProps {
	open: boolean;
	onClose: () => void;
	onApply: (filters: FilterState) => void;
	onReset: () => void;
	trainers: Member[];
}

export interface FilterState {
	ratingRange: [number, number];
	experienceRange: [number, number];
	specialties: string[];
}

const TrainerFilters: React.FC<TrainerFiltersProps> = ({ open, onClose, onApply, onReset, trainers }) => {
	// Get unique specialties from trainers
	const availableSpecialties = useMemo(() => {
		const specialtiesSet = new Set<string>();
		trainers.forEach((trainer) => {
			(trainer.trainerSpecialties || []).forEach((spec: string) => {
				if (spec) specialtiesSet.add(spec);
			});
		});
		return Array.from(specialtiesSet).sort();
	}, [trainers]);

	const [filters, setFilters] = useState<FilterState>({
		ratingRange: [0, 5],
		experienceRange: [0, 20],
		specialties: [],
	});

	const handleRatingChange = (_event: Event, newValue: number | number[]) => {
		setFilters((prev) => ({
			...prev,
			ratingRange: newValue as [number, number],
		}));
	};

	const handleExperienceChange = (_event: Event, newValue: number | number[]) => {
		setFilters((prev) => ({
			...prev,
			experienceRange: newValue as [number, number],
		}));
	};

	const handleSpecialtyToggle = (specialty: string) => {
		setFilters((prev) => ({
			...prev,
			specialties: prev.specialties.includes(specialty)
				? prev.specialties.filter((s) => s !== specialty)
				: [...prev.specialties, specialty],
		}));
	};

	const handleApply = () => {
		onApply(filters);
		onClose();
	};

	const handleReset = () => {
		const resetFilters: FilterState = {
			ratingRange: [0, 5],
			experienceRange: [0, 20],
			specialties: [],
		};
		setFilters(resetFilters);
		onReset();
		onClose();
	};

	return (
		<Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}>
			<Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
				{/* Header */}
				<Box sx={{ p: 3, borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Typography variant="h6" sx={{ fontWeight: 700, color: '#212121' }}>
						Filters
					</Typography>
					<IconButton onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</Box>

				{/* Content */}
				<Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
					{/* Rating Range */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#212121' }}>
							Rating
						</Typography>
						<Slider
							value={filters.ratingRange}
							onChange={handleRatingChange}
							valueLabelDisplay="auto"
							min={0}
							max={5}
							step={0.5}
							marks={[
								{ value: 0, label: '0' },
								{ value: 5, label: '5' },
							]}
							sx={{
								color: '#E10600',
								'& .MuiSlider-thumb': {
									'&:hover': {
										boxShadow: '0 0 0 8px rgba(225, 6, 0, 0.16)',
									},
								},
							}}
						/>
						<Typography variant="caption" sx={{ color: '#757575', mt: 1, display: 'block' }}>
							{filters.ratingRange[0]} - {filters.ratingRange[1]} stars
						</Typography>
					</Box>

					<Divider sx={{ my: 3 }} />

					{/* Experience Range */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#212121' }}>
							Experience (Years)
						</Typography>
						<Slider
							value={filters.experienceRange}
							onChange={handleExperienceChange}
							valueLabelDisplay="auto"
							min={0}
							max={20}
							step={1}
							marks={[
								{ value: 0, label: '0' },
								{ value: 20, label: '20+' },
							]}
							sx={{
								color: '#E10600',
								'& .MuiSlider-thumb': {
									'&:hover': {
										boxShadow: '0 0 0 8px rgba(225, 6, 0, 0.16)',
									},
								},
							}}
						/>
						<Typography variant="caption" sx={{ color: '#757575', mt: 1, display: 'block' }}>
							{filters.experienceRange[0]} - {filters.experienceRange[1]} years
						</Typography>
					</Box>

					<Divider sx={{ my: 3 }} />

					{/* Specialties */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#212121' }}>
							Specialties
						</Typography>
						<Stack spacing={1}>
							{availableSpecialties.map((specialty) => (
								<FormControlLabel
									key={specialty}
									control={
										<Checkbox
											checked={filters.specialties.includes(specialty)}
											onChange={() => handleSpecialtyToggle(specialty)}
											sx={{ color: '#E10600', '&.Mui-checked': { color: '#E10600' } }}
										/>
									}
									label={specialty}
								/>
							))}
							{availableSpecialties.length === 0 && (
								<Typography variant="body2" sx={{ color: '#757575', fontStyle: 'italic' }}>
									No specialties available
								</Typography>
							)}
						</Stack>
					</Box>
				</Box>

				{/* Footer */}
				<Box sx={{ p: 3, borderTop: '1px solid #E5E5E5', display: 'flex', gap: 2 }}>
					<Button variant="outlined" fullWidth onClick={handleReset} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
						Reset
					</Button>
					<Button
						variant="contained"
						fullWidth
						onClick={handleApply}
						sx={{
							borderRadius: 2,
							textTransform: 'none',
							fontWeight: 600,
							backgroundColor: '#E10600',
							'&:hover': {
								backgroundColor: '#C10500',
							},
						}}
					>
						Apply
					</Button>
				</Box>
			</Box>
		</Drawer>
	);
};

export default TrainerFilters;








import React, { useState } from 'react';
import { Box, TextField, MenuItem, Select, FormControl, InputLabel, Chip, Stack, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { TrainersInquiry } from '../../../libs/types/member/member.input';
import { Direction } from '../../../libs/enums/common.enum';

interface TrainerFiltersBarProps {
	filters: TrainersInquiry;
	onFiltersChange: (filters: TrainersInquiry) => void;
	total: number;
}

const TrainerFiltersBar: React.FC<TrainerFiltersBarProps> = ({ filters, onFiltersChange, total }) => {
	const [searchText, setSearchText] = useState('');

	const handleSortChange = (sort: string) => {
		onFiltersChange({
			...filters,
			sort,
			direction: sort === 'memberRank' ? Direction.DESC : Direction.ASC,
		});
	};

	const handleSearch = (value: string) => {
		setSearchText(value);
		onFiltersChange({
			...filters,
			search: value ? { memberFullName: value } : {},
			page: 1,
		});
	};

	const handleClear = () => {
		setSearchText('');
		onFiltersChange({
			...filters,
			search: {},
			page: 1,
		});
	};

	return (
		<Box
			className="trainer-filters-bar"
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				gap: 2,
				padding: 2,
				backgroundColor: '#FFFFFF',
				borderRadius: 2,
				border: '1px solid #E5E5E5',
				marginBottom: 3,
				flexWrap: 'wrap',
			}}
		>
			{/* Search */}
			<Box sx={{ position: 'relative', flex: '1 1 300px', minWidth: 200 }}>
				<TextField
					fullWidth
					size="small"
					placeholder="Search trainers..."
					value={searchText}
					onChange={(e) => handleSearch(e.target.value)}
					sx={{
						'& .MuiOutlinedInput-root': {
							backgroundColor: '#FAFAFA',
							'&:hover': {
								backgroundColor: '#F5F5F5',
							},
							'&.Mui-focused': {
								backgroundColor: '#FFFFFF',
							},
						},
					}}
					InputProps={{
						startAdornment: <SearchIcon sx={{ color: '#9E9E9E', mr: 1, fontSize: 20 }} />,
						endAdornment: searchText && (
							<IconButton size="small" onClick={handleClear} sx={{ p: 0.5 }}>
								<ClearIcon sx={{ fontSize: 18, color: '#9E9E9E' }} />
							</IconButton>
						),
					}}
				/>
			</Box>

			{/* Sort */}
			<FormControl size="small" sx={{ minWidth: 160 }}>
				<InputLabel>Sort by</InputLabel>
				<Select
					value={filters.sort || 'memberRank'}
					label="Sort by"
					onChange={(e) => handleSortChange(e.target.value)}
					sx={{
						backgroundColor: '#FAFAFA',
						'&:hover': {
							backgroundColor: '#F5F5F5',
						},
					}}
				>
					<MenuItem value="memberRank">Highest Rated</MenuItem>
					<MenuItem value="memberLikes">Most Reviews</MenuItem>
					<MenuItem value="createdAt">Newest</MenuItem>
					<MenuItem value="memberFullName">Name (A-Z)</MenuItem>
				</Select>
			</FormControl>

			{/* Results Count */}
			<Chip
				label={`${total} trainer${total !== 1 ? 's' : ''}`}
				size="small"
				sx={{
					height: 32,
					fontSize: '12px',
					fontWeight: 500,
					backgroundColor: '#F5F5F5',
					color: '#616161',
					border: 'none',
				}}
			/>
		</Box>
	);
};

export default TrainerFiltersBar;


















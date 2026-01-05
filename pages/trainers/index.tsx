import React, { useState, useMemo, useEffect } from 'react';
import { NextPage } from 'next';
import {
	Container,
	Grid,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	Stack,
	Box,
	Typography,
	Pagination,
	Alert,
	Skeleton,
	Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTrainersQuery } from '../../libs/hooks/useTrainersQuery';
import { TrainersInquiry } from '../../libs/types/member/member.input';
import { Direction } from '../../libs/enums/common.enum';
import TrainerCard from '../../libs/components/trainers/TrainerCard';
import TrainerFilters, { FilterState } from '../../libs/components/trainers/TrainerFilters';
import TrainerProfileDrawer from '../../libs/components/trainers/TrainerProfileDrawer';
import { Member } from '../../libs/types/member/member';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { useRouter } from 'next/router';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TrainersPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [searchText, setSearchText] = useState('');
	const [sortBy, setSortBy] = useState<'memberRank' | 'trainerExperience' | 'createdAt'>('memberRank');
	const [page, setPage] = useState(1);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [selectedTrainer, setSelectedTrainer] = useState<Member | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [appliedFilters, setAppliedFilters] = useState<FilterState>({
		ratingRange: [0, 5],
		experienceRange: [0, 20],
		specialties: [],
	});

	const limit = 12;

	const inquiryInput: TrainersInquiry = useMemo(
		() => ({
			page,
			limit,
			sort: sortBy,
			direction: sortBy === 'memberRank' ? Direction.DESC : sortBy === 'trainerExperience' ? Direction.DESC : Direction.DESC,
			search: {
				text: searchText || undefined,
			},
		}),
		[page, limit, sortBy, searchText],
	);

	const { trainers, total, loading, error, refetch } = useTrainersQuery(inquiryInput);

	// Apply client-side filters
	const filteredTrainers = useMemo(() => {
		return trainers.filter((trainer) => {
			// Rating filter
			const trainerRating = trainer.trainerRating || (trainer.memberRank ? trainer.memberRank / 10 : 0);
			if (trainerRating < appliedFilters.ratingRange[0] || trainerRating > appliedFilters.ratingRange[1]) {
				return false;
			}

			// Experience filter
			const experience = trainer.trainerExperience || 0;
			if (experience < appliedFilters.experienceRange[0] || experience > appliedFilters.experienceRange[1]) {
				return false;
			}

			// Specialties filter
			if (appliedFilters.specialties.length > 0) {
				const trainerSpecialties = trainer.trainerSpecialties || [];
				const hasMatchingSpecialty = appliedFilters.specialties.some((spec) =>
					trainerSpecialties.some((ts: string) => ts.toLowerCase().includes(spec.toLowerCase())),
				);
				if (!hasMatchingSpecialty) return false;
			}

			return true;
		});
	}, [trainers, appliedFilters]);

	const handleSortChange = (newSort: 'memberRank' | 'trainerExperience' | 'createdAt') => {
		setSortBy(newSort);
		setPage(1);
	};

	const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleTrainerClick = (trainer: Member) => {
		setSelectedTrainer(trainer);
		setDrawerOpen(true);
	};

	const handleFiltersApply = (filters: FilterState) => {
		setAppliedFilters(filters);
		setPage(1);
	};

	const handleFiltersReset = () => {
		setAppliedFilters({
			ratingRange: [0, 5],
			experienceRange: [0, 20],
			specialties: [],
		});
		setPage(1);
	};

	const hasActiveFilters = useMemo(() => {
		return (
			appliedFilters.ratingRange[0] > 0 ||
			appliedFilters.ratingRange[1] < 5 ||
			appliedFilters.experienceRange[0] > 0 ||
			appliedFilters.experienceRange[1] < 20 ||
			appliedFilters.specialties.length > 0
		);
	}, [appliedFilters]);

	if (device === 'mobile') {
		return (
			<Container maxWidth="sm" sx={{ py: 3 }}>
				{/* Header */}
				<Box sx={{ mb: 3 }}>
					<Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#212121' }}>
						Trainers
					</Typography>
					<Typography variant="body2" sx={{ color: '#757575' }}>
						Find expert trainers to guide your fitness journey
					</Typography>
				</Box>

				{/* Search and Filters */}
				<Stack spacing={2} sx={{ mb: 3 }}>
					<TextField
						fullWidth
						placeholder="Search trainers..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						InputProps={{
							startAdornment: <SearchIcon sx={{ color: '#9E9E9E', mr: 1 }} />,
						}}
					/>
					<Stack direction="row" spacing={1}>
						<FormControl fullWidth size="small">
							<InputLabel>Sort by</InputLabel>
							<Select value={sortBy} label="Sort by" onChange={(e) => handleSortChange(e.target.value as any)}>
								<MenuItem value="memberRank">Highest Rated</MenuItem>
								<MenuItem value="trainerExperience">Most Experienced</MenuItem>
								<MenuItem value="createdAt">Newest</MenuItem>
							</Select>
						</FormControl>
						<Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setFiltersOpen(true)}>
							Filters
						</Button>
					</Stack>
				</Stack>

				{/* Active Filters */}
				{hasActiveFilters && (
					<Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
						{appliedFilters.specialties.map((spec) => (
							<Chip key={spec} label={spec} size="small" onDelete={() => handleFiltersReset()} />
						))}
					</Stack>
				)}

				{/* Content */}
				{loading ? (
					<Stack spacing={2}>
						{[1, 2, 3, 4].map((i) => (
							<Skeleton key={i} variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
						))}
					</Stack>
				) : error ? (
					<Alert severity="error" sx={{ mb: 2 }}>
						Error loading trainers. Please try again.
						<Button onClick={() => refetch()} sx={{ ml: 2 }}>
							Retry
						</Button>
					</Alert>
				) : filteredTrainers.length === 0 ? (
					<Box sx={{ textAlign: 'center', py: 4 }}>
						<Typography variant="body1" sx={{ mb: 2, color: '#757575' }}>
							No trainers found
						</Typography>
						<Button variant="outlined" onClick={handleFiltersReset}>
							Reset Filters
						</Button>
					</Box>
				) : (
					<>
						<Stack spacing={2}>
							{filteredTrainers.map((trainer) => (
								<TrainerCard key={trainer._id} trainer={trainer} onClick={handleTrainerClick} />
							))}
						</Stack>
						{Math.ceil(total / limit) > 1 && (
							<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
								<Pagination count={Math.ceil(total / limit)} page={page} onChange={handlePageChange} />
							</Box>
						)}
					</>
				)}

				{/* Filters Drawer */}
				<TrainerFilters
					open={filtersOpen}
					onClose={() => setFiltersOpen(false)}
					onApply={handleFiltersApply}
					onReset={handleFiltersReset}
					trainers={trainers}
				/>

				{/* Profile Drawer */}
				<TrainerProfileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} trainer={selectedTrainer} />
			</Container>
		);
	}

	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
			{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
					<Box>
						<Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: '#212121' }}>
							Trainers
						</Typography>
						<Typography variant="body1" sx={{ color: '#757575' }}>
							Find expert trainers to guide your fitness journey
						</Typography>
					</Box>
					{user?.memberType === 'TRAINER' && (
						<Button
							variant="contained"
							onClick={() => router.push('/trainer/studio')}
							sx={{
								backgroundColor: '#E10600',
								'&:hover': { backgroundColor: '#C10500' },
								textTransform: 'none',
								fontWeight: 600,
							}}
						>
							Open Studio
						</Button>
					)}
				</Stack>

				{/* Search, Sort, Filters */}
				<Stack direction="row" spacing={2} sx={{ mb: 3 }}>
					<TextField
						placeholder="Search trainers..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						sx={{ flex: 1 }}
						InputProps={{
							startAdornment: <SearchIcon sx={{ color: '#9E9E9E', mr: 1 }} />,
						}}
					/>
					<FormControl sx={{ minWidth: 200 }}>
						<InputLabel>Sort by</InputLabel>
						<Select value={sortBy} label="Sort by" onChange={(e) => handleSortChange(e.target.value as any)}>
							<MenuItem value="memberRank">Highest Rated</MenuItem>
							<MenuItem value="trainerExperience">Most Experienced</MenuItem>
							<MenuItem value="createdAt">Newest</MenuItem>
						</Select>
					</FormControl>
					<Button variant="outlined" startIcon={<FilterListIcon />} onClick={() => setFiltersOpen(true)}>
						Filters
					</Button>
				</Stack>

				{/* Active Filters */}
				{hasActiveFilters && (
					<Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
						{appliedFilters.specialties.map((spec) => (
							<Chip key={spec} label={spec} size="small" onDelete={() => handleFiltersReset()} />
						))}
					</Stack>
				)}
			</Box>

			{/* Content */}
			{loading ? (
				<Grid container spacing={3}>
					{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
						<Grid item xs={12} sm={6} md={4} lg={3} key={i}>
							<Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
						</Grid>
					))}
				</Grid>
			) : error ? (
				<Alert severity="error" sx={{ mb: 2 }}>
					Error loading trainers. Please try again.
					<Button onClick={() => refetch()} sx={{ ml: 2 }}>
						Retry
					</Button>
				</Alert>
			) : filteredTrainers.length === 0 ? (
				<Box sx={{ textAlign: 'center', py: 8 }}>
					<Typography variant="h6" sx={{ mb: 2, color: '#212121' }}>
						No trainers found
					</Typography>
					<Typography variant="body2" sx={{ mb: 3, color: '#757575' }}>
						Try adjusting your filters or search criteria
					</Typography>
					<Button variant="outlined" onClick={handleFiltersReset}>
						Reset Filters
					</Button>
				</Box>
			) : (
				<>
					<Grid container spacing={3}>
						{filteredTrainers.map((trainer) => (
							<Grid item xs={12} sm={6} md={4} lg={3} key={trainer._id}>
								<TrainerCard trainer={trainer} onClick={handleTrainerClick} />
							</Grid>
						))}
					</Grid>
					{Math.ceil(total / limit) > 1 && (
						<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
							<Pagination count={Math.ceil(total / limit)} page={page} onChange={handlePageChange} />
						</Box>
					)}
				</>
			)}

			{/* Filters Drawer */}
			<TrainerFilters
				open={filtersOpen}
				onClose={() => setFiltersOpen(false)}
				onApply={handleFiltersApply}
				onReset={handleFiltersReset}
				trainers={trainers}
			/>

			{/* Profile Drawer */}
			<TrainerProfileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} trainer={selectedTrainer} />
		</Container>
	);
};

export default withLayoutBasic(TrainersPage);




















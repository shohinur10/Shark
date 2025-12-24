import { NextPage } from 'next';
import { Box, Stack, Typography, Button, Pagination, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect, useMemo } from 'react';
import { Member } from '../../libs/types/member/member';
import { TrainersInquiry } from '../../libs/types/member/member.input';
import { GET_TRAINERS } from '../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { Direction } from '../../libs/enums/common.enum';
import TrainerCardCompact from '../../libs/components/trainer/TrainerCardCompact';
import TrainerFiltersDrawer from '../../libs/components/trainer/TrainerFiltersDrawer';
import { TrainerCardSkeleton } from '../../libs/components/trainer/TrainerSkeleton';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useDebounce } from '../../libs/hooks/useDebounce';
import { buildTrainersInquiryInput } from '../../libs/utils/trainer.utils';
import { GetTrainersData, GetTrainersVariables } from '../../libs/types/trainer/trainer.types';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TrainersPage: NextPage = () => {
	const device = useDeviceDetect();
	const [trainers, setTrainers] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchText, setSearchText] = useState<string>('');
	const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
	const [appliedFilters, setAppliedFilters] = useState<{
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

	// Debounce search input
	const debouncedSearch = useDebounce(searchText, 300);

	// Pagination state
	const [pagination, setPagination] = useState({ page: 1, limit: 20 });

	// Filters state
	const [filters, setFilters] = useState<{ sort?: string; direction?: Direction }>({
		sort: 'memberRank',
		direction: Direction.DESC,
	});

	// Build inquiry input with useMemo
	const inquiryInput = useMemo<TrainersInquiry>(() => {
		return buildTrainersInquiryInput(
			pagination,
			filters,
			{ text: debouncedSearch }
		);
	}, [pagination, filters, debouncedSearch]);

	// Update pagination when search changes
	useEffect(() => {
		if (debouncedSearch !== searchText) {
			setPagination((prev) => ({ ...prev, page: 1 }));
		}
	}, [debouncedSearch, searchText]);

	const {
		loading: getTrainersLoading,
		data: getTrainersData,
		error: getTrainersError,
		refetch: getTrainersRefetch,
	} = useQuery<GetTrainersData, GetTrainersVariables>(GET_TRAINERS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: inquiryInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			if (data?.getTrainers) {
				setTrainers(data.getTrainers.list || []);
				setTotal(data.getTrainers.metaCounter?.[0]?.total || 0);
			}
		},
	});

	useEffect(() => {
		if (getTrainersData?.getTrainers) {
			setTrainers(getTrainersData.getTrainers.list || []);
			setTotal(getTrainersData.getTrainers.metaCounter?.[0]?.total || 0);
		}
	}, [getTrainersData]);

	const handleFiltersChange = (newFilters: TrainersInquiry) => {
		setPagination({ page: newFilters.page, limit: newFilters.limit });
		setFilters({
			sort: newFilters.sort,
			direction: newFilters.direction,
		});
		if (newFilters.search?.text) {
			setSearchText(newFilters.search.text);
		} else {
			setSearchText('');
		}
	};

	const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
		setPagination((prev) => ({ ...prev, page: value }));
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleResetFilters = () => {
		setSearchText('');
		setAppliedFilters({
			specialties: [],
			minRating: 0,
			minExperience: 0,
			maxExperience: 20,
		});
		setPagination({ page: 1, limit: 20 });
		setFilters({
			sort: 'memberRank',
			direction: Direction.DESC,
		});
	};

	const handleSortChange = (sort: string) => {
		setFilters({
			sort,
			direction: sort === 'memberRank' ? Direction.DESC : Direction.ASC,
		});
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const handleFiltersApply = (filterState: {
		specialties: string[];
		minRating: number;
		minExperience: number;
		maxExperience: number;
	}) => {
		setAppliedFilters(filterState);
	};

	// Apply client-side filters (for filters not supported by backend)
	const filteredTrainers = useMemo(() => {
		return trainers.filter((trainer) => {
			// Specialty filter
			if (appliedFilters.specialties.length > 0) {
				const trainerSpecialties = trainer.trainerSpecialties || [];
				const hasMatchingSpecialty = appliedFilters.specialties.some((spec) =>
					trainerSpecialties.some((ts: string) => ts.toLowerCase().includes(spec.toLowerCase()))
				);
				if (!hasMatchingSpecialty) return false;
			}

			// Rating filter
			const trainerRating = trainer.trainerRating || (trainer.memberRank ? trainer.memberRank / 10 : 0);
			if (trainerRating < appliedFilters.minRating) return false;

			// Experience filter
			const experience = trainer.trainerExperience || 0;
			if (experience < appliedFilters.minExperience || experience > appliedFilters.maxExperience) return false;

			return true;
		});
	}, [trainers, appliedFilters]);

	// Two-column layout for filtered trainers
	const column1Trainers = useMemo(() => {
		return filteredTrainers.filter((_, index) => index % 2 === 0);
	}, [filteredTrainers]);

	const column2Trainers = useMemo(() => {
		return filteredTrainers.filter((_, index) => index % 2 === 1);
	}, [filteredTrainers]);

	if (device === 'mobile') {
		return (
			<Box
				className="trainers-page-mobile"
				sx={{
					width: '100%',
					maxWidth: '100%',
					padding: 2,
					backgroundColor: '#FAFAFA',
					minHeight: 'calc(100vh - 200px)',
					overflowX: 'hidden',
				}}
			>
				<Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
					Trainers
				</Typography>
				{getTrainersLoading ? (
					<Stack spacing={2} sx={{ width: '100%' }}>
						{[...Array(4)].map((_, idx) => (
							<TrainerCardSkeleton key={idx} />
						))}
					</Stack>
				) : getTrainersError ? (
					<Box sx={{ textAlign: 'center', py: 4, width: '100%' }}>
						<ErrorOutlineIcon sx={{ fontSize: 48, color: '#9E9E9E', mb: 2 }} />
						<Typography variant="body1" sx={{ mb: 2, color: '#616161' }}>
							Error loading trainers
						</Typography>
						<Button variant="contained" onClick={() => getTrainersRefetch()} startIcon={<RefreshIcon />}>
							Retry
						</Button>
					</Box>
				) : filteredTrainers.length === 0 ? (
					<Box sx={{ textAlign: 'center', py: 4, width: '100%' }}>
						<Typography variant="body1" sx={{ mb: 2, color: '#616161' }}>
							No trainers found
						</Typography>
						<Button variant="outlined" onClick={handleResetFilters}>
							Reset Filters
						</Button>
					</Box>
				) : (
					<Stack spacing={2} sx={{ width: '100%' }}>
						{filteredTrainers.map((trainer) => (
							<TrainerCardCompact key={trainer._id} trainer={trainer} />
						))}
					</Stack>
				)}
			</Box>
		);
	}

	return (
		<Box
			className="trainers-page"
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
				{/* Page Header */}
				<Box sx={{ marginBottom: { xs: 3, md: 4 } }}>
					<Typography
						variant="h3"
						sx={{
							fontSize: { xs: '32px', md: '40px' },
							fontWeight: 700,
							color: '#212121',
							marginBottom: 1,
							letterSpacing: '-0.5px',
						}}
					>
						Trainers
					</Typography>
					<Typography
						variant="body1"
						sx={{
							fontSize: '16px',
							color: '#757575',
							fontWeight: 400,
						}}
					>
						Find a coaching style that fits your goal.
					</Typography>
				</Box>

				{/* Top Section: Search, Sort, Filters */}
				<Stack
					direction="row"
					spacing={2}
					sx={{
						marginBottom: { xs: 3, md: 4 },
						flexWrap: 'wrap',
						alignItems: 'center',
					}}
				>
					{/* Inline Search */}
					<TextField
						placeholder="Search trainers..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						size="small"
						sx={{
							flex: '1 1 300px',
							minWidth: 200,
							'& .MuiOutlinedInput-root': {
								backgroundColor: '#FFFFFF',
								'&:hover': {
									backgroundColor: '#FAFAFA',
								},
								'&.Mui-focused': {
									backgroundColor: '#FFFFFF',
								},
							},
						}}
						InputProps={{
							startAdornment: <SearchIcon sx={{ color: '#9E9E9E', mr: 1, fontSize: 20 }} />,
						}}
					/>

					{/* Sort Dropdown */}
					<FormControl size="small" sx={{ minWidth: 180 }}>
						<InputLabel>Sort by</InputLabel>
						<Select
							value={filters.sort || 'memberRank'}
							label="Sort by"
							onChange={(e) => handleSortChange(e.target.value)}
							sx={{
								backgroundColor: '#FFFFFF',
							}}
						>
							<MenuItem value="memberRank">Highest Rated</MenuItem>
							<MenuItem value="trainerExperience">Most Experienced</MenuItem>
							<MenuItem value="createdAt">Newest</MenuItem>
						</Select>
					</FormControl>

					{/* Filters Button */}
					<Button
						variant="outlined"
						startIcon={<FilterListIcon />}
						onClick={() => setFiltersOpen(true)}
						sx={{
							borderColor: '#E5E5E5',
							color: '#212121',
							fontWeight: 600,
							textTransform: 'none',
							px: 2,
							'&:hover': {
								borderColor: '#212121',
								backgroundColor: '#FAFAFA',
							},
						}}
					>
						Filters
					</Button>
				</Stack>

				{/* Content */}
				{getTrainersLoading ? (
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
							gap: { xs: 1.5, md: 2 },
							width: '100%',
						}}
					>
						{[...Array(8)].map((_, idx) => (
							<TrainerCardSkeleton key={idx} />
						))}
					</Box>
				) : getTrainersError ? (
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
							Error loading trainers
						</Typography>
						<Typography variant="body2" sx={{ mb: 3, color: '#757575', maxWidth: 400, margin: '0 auto' }}>
							{getTrainersError.message || 'Something went wrong. Please try again.'}
						</Typography>
						<Button
							variant="contained"
							onClick={() => getTrainersRefetch()}
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
				) : filteredTrainers.length === 0 ? (
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
							No trainers found
						</Typography>
						<Typography variant="body2" sx={{ mb: 3, color: '#757575' }}>
							Try adjusting your filters or check back later.
						</Typography>
						<Button
							variant="outlined"
							onClick={handleResetFilters}
							sx={{
								borderColor: '#E5E5E5',
								color: '#212121',
								fontWeight: 600,
								textTransform: 'none',
								px: 3,
								'&:hover': {
									borderColor: '#212121',
									backgroundColor: '#FAFAFA',
								},
							}}
						>
							Reset Filters
						</Button>
					</Box>
				) : (
					<>
						{/* Two-Column Masonry Layout */}
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
								gap: { xs: 1.5, md: 2 },
								marginBottom: { xs: 3, md: 4 },
								width: '100%',
								maxWidth: '100%',
							}}
						>
							{/* Column 1 */}
							<Stack spacing={{ xs: 1.5, md: 2 }} sx={{ width: '100%', minWidth: 0 }}>
								{column1Trainers.map((trainer) => (
									<TrainerCardCompact key={trainer._id} trainer={trainer} />
								))}
							</Stack>
							{/* Column 2 */}
							<Stack spacing={{ xs: 1.5, md: 2 }} sx={{ width: '100%', minWidth: 0 }}>
								{column2Trainers.map((trainer) => (
									<TrainerCardCompact key={trainer._id} trainer={trainer} />
								))}
							</Stack>
						</Box>

						{/* Pagination */}
						{total > pagination.limit && (
							<Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 3, md: 4 } }}>
								<Pagination
									count={Math.ceil(total / pagination.limit)}
									page={pagination.page}
									onChange={handlePageChange}
									color="standard"
									sx={{
										'& .MuiPaginationItem-root': {
											color: '#616161',
											'&.Mui-selected': {
												backgroundColor: '#212121',
												color: '#FFFFFF',
												'&:hover': {
													backgroundColor: '#424242',
												},
											},
										},
									}}
								/>
							</Box>
						)}
					</>
				)}
			</Box>

			{/* Filters Drawer */}
			<TrainerFiltersDrawer
				open={filtersOpen}
				onClose={() => setFiltersOpen(false)}
				filters={inquiryInput}
				onFiltersChange={handleFiltersChange}
				trainers={trainers}
				onReset={handleResetFilters}
				onApply={handleFiltersApply}
			/>
		</Box>
	);
};

export default withLayoutBasic(TrainersPage);

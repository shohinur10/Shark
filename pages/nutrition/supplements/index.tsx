import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, CardMedia, Chip, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useMemo, useEffect } from 'react';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import InfoIcon from '@mui/icons-material/Info';
import { useQuery } from '@apollo/client';
import { GET_SUPPLEMENTS } from '../../../apollo/user/query';
import { SupplementsInquiry } from '../../../libs/types/supplement/supplement.input';
import { Supplement } from '../../../libs/types/supplement/supplement';
import { Direction } from '../../../libs/enums/common.enum';
import { T } from '../../../libs/types/common';
import { mockSupplements } from '../../../libs/data/mockSupplements';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// Helper function to extract recommended timing from supplement data
const extractRecommendedTiming = (supplement: Supplement): string[] => {
	const dosage = supplement.recommendedDosage?.toLowerCase() || '';
	const notes = supplement.usageNotes?.toLowerCase() || '';
	const combined = `${dosage} ${notes}`;
	
	const timings: string[] = [];
	
	// Check for timing indicators
	if (combined.includes('morning') || combined.includes('breakfast') || combined.includes('am')) {
		timings.push('Morning');
	}
	if (combined.includes('pre-workout') || combined.includes('pre workout') || combined.includes('before workout')) {
		timings.push('Pre-workout');
	}
	if (combined.includes('post-workout') || combined.includes('post workout') || combined.includes('after workout') || combined.includes('after exercise')) {
		timings.push('Post-workout');
	}
	if (combined.includes('evening') || combined.includes('night') || combined.includes('bedtime') || combined.includes('before bed') || combined.includes('pm')) {
		timings.push('Evening');
	}
	
	// Default to Morning if no timing found
	return timings.length > 0 ? timings : ['Morning'];
};

// Helper function to convert Supplement to display format
const supplementToDisplayFormat = (supplement: Supplement) => ({
	id: supplement._id,
	name: supplement.name,
	category: supplement.category,
	benefits: supplement.keyBenefits,
	dosage: supplement.recommendedDosage,
	image: undefined, // Images not in backend schema
	rating: supplement.rating,
	description: supplement.description,
	timing: extractRecommendedTiming(supplement),
	bestFor: supplement.bestFor,
});

const SupplementsPage: NextPage = () => {
	const device = useDeviceDetect();
	const [supplements, setSupplements] = useState<Supplement[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
	const [sortBy, setSortBy] = useState<string>('rating');

	// Prepare supplements query input
	const supplementsQueryInput: SupplementsInquiry = {
		page: 1,
		limit: 100,
		sort: 'rating',
		direction: Direction.DESC,
	};

	// Fetch supplements from API with fallback to mock data
	const {
		loading: supplementsLoading,
		data: supplementsData,
		error: supplementsError,
	} = useQuery(GET_SUPPLEMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: supplementsQueryInput },
		onCompleted: (data: T) => {
			if (data?.getSupplements?.list) {
				setSupplements(data.getSupplements.list);
			}
		},
		onError: () => {
			// Fallback to mock data if API fails
			setSupplements(mockSupplements);
		},
	});

	// Initialize with mock data if API hasn't loaded yet or failed
	useEffect(() => {
		if (!supplementsLoading && !supplementsData?.getSupplements?.list && supplements.length === 0) {
			setSupplements(mockSupplements);
		}
	}, [supplementsLoading, supplementsData, supplements.length]);

	// Convert supplements to display format
	const displaySupplements = supplements.map(supplementToDisplayFormat);

	// Get top 3 most researched supplements (by rating) for empty state
	const mostResearchedSupplements = useMemo(() => {
		return supplements
			.sort((a, b) => b.rating - a.rating)
			.slice(0, 3)
			.map(supplementToDisplayFormat);
	}, [supplements]);

	// Get unique categories
	const categories = useMemo(() => {
		const cats = new Set(displaySupplements.map((s) => s.category));
		return Array.from(cats);
	}, [displaySupplements]);

	// Filter and sort supplements
	const filteredSupplements = useMemo(() => {
		let filtered = [...displaySupplements];

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(supplement) =>
					supplement.name.toLowerCase().includes(query) ||
					supplement.description?.toLowerCase().includes(query) ||
					supplement.benefits.some((b) => b.toLowerCase().includes(query)) ||
					supplement.category.toLowerCase().includes(query)
			);
		}

		// Category filter
		if (selectedCategory !== 'ALL') {
			filtered = filtered.filter((supplement) => supplement.category === selectedCategory);
		}

		// Sort
		filtered.sort((a, b) => {
			switch (sortBy) {
				case 'rating':
					return b.rating - a.rating;
				case 'name':
					return a.name.localeCompare(b.name);
				default:
					return 0;
			}
		});

		return filtered;
	}, [displaySupplements, searchQuery, selectedCategory, sortBy]);

	// Get image URL
	const getSupplementImageUrl = (supplement: any) => {
		if (supplement.image && !supplement.image.startsWith('http')) {
			return supplement.image;
		}
		return '/img/bodybuilders/pexels-gabflicks-13122470.jpg';
	};

	// Show loading state
	if (supplementsLoading && supplements.length === 0) {
		return (
			<Stack className={'supplements-page'}>
				<Stack className={'container'}>
					<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
						<CircularProgress />
					</Box>
				</Stack>
			</Stack>
		);
	}

	if (device === 'mobile') {
		return (
			<Stack className={'supplements-page'}>
				<Stack className={'container'}>
					<Typography variant="h4" className={'page-title'} sx={{ mb: 3 }}>
						Supplements
					</Typography>
					{filteredSupplements.length === 0 ? (
						<Box className={'empty-state'}>
							<Stack spacing={3} alignItems="center" textAlign="center" py={4}>
								<Box>
									<Typography variant="h6" gutterBottom>
										No supplements found
									</Typography>
									<Typography variant="body2" color="text.secondary" mt={1}>
										Try searching by benefit (e.g. recovery, strength, immunity)
									</Typography>
								</Box>

								{/* Most Researched Supplements */}
								{mostResearchedSupplements.length > 0 && (
									<Box sx={{ width: '100%', mt: 2 }}>
										<Typography variant="h6" gutterBottom sx={{ mb: 2, textAlign: 'left' }}>
											Most Researched Supplements
										</Typography>
										<Stack spacing={2}>
											{mostResearchedSupplements.map((supplement) => (
												<Card key={supplement.id}>
													<CardMedia
														component="div"
														style={{
															height: 200,
															backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${getSupplementImageUrl(supplement)})`,
															backgroundSize: 'cover',
															backgroundPosition: 'center',
														}}
													/>
													<CardContent>
														<Typography variant="h6">{supplement.name}</Typography>
														<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
															{supplement.description || 'No description available.'}
														</Typography>
														<Box sx={{ mt: 2 }}>
															<Stack direction="row" spacing={1} alignItems="center">
																<StarIcon sx={{ color: '#ffc107', fontSize: 18 }} />
																<Typography variant="body2" fontWeight={600}>
																	{supplement.rating}
																</Typography>
															</Stack>
														</Box>
													</CardContent>
												</Card>
											))}
										</Stack>
									</Box>
								)}
							</Stack>
						</Box>
					) : (
						<Stack spacing={2}>
							{filteredSupplements.map((supplement) => (
								<Card key={supplement.id}>
									<CardMedia
										component="div"
										style={{
											height: 200,
											backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${getSupplementImageUrl(supplement)})`,
											backgroundSize: 'cover',
											backgroundPosition: 'center',
										}}
									/>
									<CardContent>
										<Typography variant="h6">{supplement.name}</Typography>
										<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
											{supplement.description || 'No description available.'}
										</Typography>
									</CardContent>
								</Card>
							))}
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'supplements-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'} sx={{ mb: 4 }}>
						<Typography variant="h2" className={'page-title'}>
							Vitamins & Supplements
						</Typography>
						<Typography variant="h6" className={'page-subtitle'}>
							Essential nutrients for optimal health, performance, and recovery
						</Typography>
					</Stack>

					{/* Search and Filters */}
					<Box className={'filters-section'} sx={{ mb: 4 }}>
						<Grid container spacing={2} alignItems="center">
							<Grid item xs={12} md={5}>
								<TextField
									fullWidth
									placeholder="Search supplements, benefits..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									InputProps={{
										startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
									}}
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={3}>
								<FormControl fullWidth>
									<InputLabel>Category</InputLabel>
									<Select
										value={selectedCategory}
										label="Category"
										onChange={(e) => setSelectedCategory(e.target.value)}
									>
										<MenuItem value="ALL">All Categories</MenuItem>
										{categories.map((category) => (
											<MenuItem key={category} value={category}>
												{category}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6} md={2}>
								<FormControl fullWidth>
									<InputLabel>Sort By</InputLabel>
									<Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
										<MenuItem value="rating">Highest Rated</MenuItem>
										<MenuItem value="name">Name A-Z</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={2}>
								<Button
									fullWidth
									variant="outlined"
									startIcon={<FilterListIcon />}
									onClick={() => {
										setSearchQuery('');
										setSelectedCategory('ALL');
										setSortBy('rating');
									}}
								>
									Reset
								</Button>
							</Grid>
						</Grid>
					</Box>

					{/* Supplements Grid */}
					<Box className={'supplements-section'}>
						{filteredSupplements.length === 0 ? (
							<Box className={'empty-state'}>
								<Stack spacing={3} alignItems="center" textAlign="center" py={6}>
									<Box>
										<Typography variant="h5" gutterBottom>
											No supplements found
										</Typography>
										<Typography variant="body1" color="text.secondary">
											Try searching by benefit (e.g. recovery, strength, immunity)
										</Typography>
									</Box>

									{/* Most Researched Supplements */}
									{mostResearchedSupplements.length > 0 && (
										<Box sx={{ width: '100%', mt: 4 }}>
											<Typography variant="h6" gutterBottom sx={{ mb: 3, textAlign: 'left' }}>
												Most Researched Supplements
											</Typography>
											<Grid container spacing={3}>
												{mostResearchedSupplements.map((supplement) => (
													<Grid item xs={12} sm={6} md={4} key={supplement.id}>
														<Card
															className={'supplement-card'}
															sx={{
																height: '100%',
																display: 'flex',
																flexDirection: 'column',
																transition: 'transform 0.2s, box-shadow 0.2s',
																'&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
															}}
														>
															<CardMedia
																component="div"
																className={'supplement-image'}
																style={{
																	backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url(${getSupplementImageUrl(supplement)})`,
																	backgroundSize: 'cover',
																	backgroundPosition: 'center',
																	height: 250,
																	position: 'relative',
																}}
															>
																<Box
																	sx={{
																		position: 'absolute',
																		top: 8,
																		left: 8,
																		right: 8,
																		display: 'flex',
																		justifyContent: 'space-between',
																		alignItems: 'flex-start',
																	}}
																>
																	<Chip
																		label={supplement.category}
																		size="small"
																		sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', fontWeight: 600 }}
																	/>
																	<Box
																		sx={{
																			display: 'flex',
																			alignItems: 'center',
																			gap: 0.5,
																			backgroundColor: 'rgba(0,0,0,0.5)',
																			borderRadius: 1,
																			px: 1,
																			py: 0.5,
																		}}
																	>
																		<StarIcon sx={{ color: '#ffc107', fontSize: 18 }} />
																		<Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
																			{supplement.rating}
																		</Typography>
																	</Box>
																</Box>
															</CardMedia>
															<CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
																<Typography variant="h6" className={'supplement-name'} gutterBottom>
																	{supplement.name}
																</Typography>
																{supplement.description && (
																	<Typography
																		variant="body2"
																		color="text.secondary"
																		mb={2}
																		sx={{ flexGrow: 1 }}
																	>
																		{supplement.description.length > 120
																			? `${supplement.description.substring(0, 120)}...`
																			: supplement.description}
																	</Typography>
																)}
																<Box sx={{ mb: 2 }}>
																	<Typography variant="body2" fontWeight={600} gutterBottom>
																		Recommended Dosage:
																	</Typography>
																	<Typography variant="body2" color="text.secondary">
																		{supplement.dosage}
																	</Typography>
																</Box>
																<Box className={'benefits-section'} sx={{ mb: 2 }}>
																	<Typography variant="caption" fontWeight={600} gutterBottom>
																		Key Benefits:
																	</Typography>
																	<Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
																		{supplement.benefits.slice(0, 3).map((benefit, idx) => (
																			<Chip
																				key={idx}
																				label={benefit}
																				size="small"
																				variant="outlined"
																				sx={{ fontSize: '0.7rem' }}
																			/>
																		))}
																		{supplement.benefits.length > 3 && (
																			<Chip
																				label={`+${supplement.benefits.length - 3}`}
																				size="small"
																				variant="outlined"
																			/>
																		)}
																	</Stack>
																</Box>
																{supplement.bestFor && supplement.bestFor.length > 0 && (
																	<Box sx={{ mb: 2 }}>
																		<Typography variant="caption" color="text.secondary">
																			Best for: {supplement.bestFor.join(', ')}
																		</Typography>
																	</Box>
																)}
																{/* When Should You Take This? Timeline */}
																<Box sx={{ mb: 2 }}>
																	<Typography variant="caption" fontWeight={600} gutterBottom sx={{ display: 'block', mb: 1 }}>
																		When Should You Take This?
																	</Typography>
																	<Stack direction="row" spacing={0.5} justifyContent="space-between" flexWrap="wrap">
																		{['Morning', 'Pre-workout', 'Post-workout', 'Evening'].map((timing) => (
																			<Box
																				key={timing}
																				sx={{
																					flex: 1,
																					minWidth: '60px',
																					textAlign: 'center',
																					padding: '6px 8px',
																					borderRadius: '6px',
																					backgroundColor: supplement.timing?.includes(timing) 
																						? 'rgba(25, 118, 210, 0.1)' 
																						: 'rgba(0, 0, 0, 0.03)',
																					border: `1px solid ${supplement.timing?.includes(timing) 
																						? 'rgba(25, 118, 210, 0.3)' 
																						: 'rgba(0, 0, 0, 0.08)'}`,
																					transition: 'all 0.2s ease',
																				}}
																			>
																				<Typography 
																					variant="caption" 
																					sx={{
																						fontWeight: supplement.timing?.includes(timing) ? 600 : 400,
																						color: supplement.timing?.includes(timing) 
																							? 'primary.main' 
																							: 'text.secondary',
																						fontSize: '0.65rem',
																					}}
																				>
																					{timing}
																				</Typography>
																			</Box>
																		))}
																	</Stack>
																	<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic', fontSize: '0.6rem', display: 'block' }}>
																		*Informational only
																	</Typography>
																</Box>
																<Stack direction="row" spacing={1} mt="auto">
																	<Button variant="outlined" size="small" startIcon={<FavoriteBorderIcon />} fullWidth>
																		Save
																	</Button>
																	<Button variant="outlined" size="small" startIcon={<ShareIcon />} fullWidth>
																		Share
																	</Button>
																</Stack>
															</CardContent>
														</Card>
													</Grid>
												))}
											</Grid>
										</Box>
									)}
								</Stack>
							</Box>
						) : (
							<Grid container spacing={3}>
								{filteredSupplements.map((supplement) => (
									<Grid item xs={12} sm={6} md={4} key={supplement.id}>
										<Card
											className={'supplement-card'}
											sx={{
												height: '100%',
												display: 'flex',
												flexDirection: 'column',
												transition: 'transform 0.2s, box-shadow 0.2s',
												'&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
											}}
										>
											<CardMedia
												component="div"
												className={'supplement-image'}
												style={{
													backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url(${getSupplementImageUrl(supplement)})`,
													backgroundSize: 'cover',
													backgroundPosition: 'center',
													height: 250,
													position: 'relative',
												}}
											>
												<Box
													sx={{
														position: 'absolute',
														top: 8,
														left: 8,
														right: 8,
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'flex-start',
													}}
												>
													<Chip
														label={supplement.category}
														size="small"
														sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', fontWeight: 600 }}
													/>
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															gap: 0.5,
															backgroundColor: 'rgba(0,0,0,0.5)',
															borderRadius: 1,
															px: 1,
															py: 0.5,
														}}
													>
														<StarIcon sx={{ color: '#ffc107', fontSize: 18 }} />
														<Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
															{supplement.rating}
														</Typography>
													</Box>
												</Box>
											</CardMedia>
											<CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
												<Typography variant="h6" className={'supplement-name'} gutterBottom>
													{supplement.name}
												</Typography>
												{supplement.description && (
													<Typography
														variant="body2"
														color="text.secondary"
														mb={2}
														sx={{ flexGrow: 1 }}
													>
														{supplement.description.length > 120
															? `${supplement.description.substring(0, 120)}...`
															: supplement.description}
													</Typography>
												)}
												<Box sx={{ mb: 2 }}>
													<Typography variant="body2" fontWeight={600} gutterBottom>
														Recommended Dosage:
													</Typography>
													<Typography variant="body2" color="text.secondary">
														{supplement.dosage} {supplement.timing && `- ${supplement.timing}`}
													</Typography>
												</Box>
												<Box className={'benefits-section'} sx={{ mb: 2 }}>
													<Typography variant="caption" fontWeight={600} gutterBottom>
														Key Benefits:
													</Typography>
													<Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
														{supplement.benefits.slice(0, 3).map((benefit, idx) => (
															<Chip
																key={idx}
																label={benefit}
																size="small"
																variant="outlined"
																sx={{ fontSize: '0.7rem' }}
															/>
														))}
														{supplement.benefits.length > 3 && (
															<Chip
																label={`+${supplement.benefits.length - 3}`}
																size="small"
																variant="outlined"
															/>
														)}
													</Stack>
												</Box>
												{supplement.bestFor && supplement.bestFor.length > 0 && (
													<Box sx={{ mb: 2 }}>
														<Typography variant="caption" color="text.secondary">
															Best for: {supplement.bestFor.join(', ')}
														</Typography>
													</Box>
												)}
												{/* When Should You Take This? Timeline */}
												<Box sx={{ mb: 2 }}>
													<Typography variant="caption" fontWeight={600} gutterBottom sx={{ display: 'block', mb: 1 }}>
														When Should You Take This?
													</Typography>
													<Stack direction="row" spacing={0.5} justifyContent="space-between" flexWrap="wrap">
														{['Morning', 'Pre-workout', 'Post-workout', 'Evening'].map((timing) => (
															<Box
																key={timing}
																sx={{
																	flex: 1,
																	minWidth: '60px',
																	textAlign: 'center',
																	padding: '6px 8px',
																	borderRadius: '6px',
																	backgroundColor: supplement.timing?.includes(timing) 
																		? 'rgba(25, 118, 210, 0.1)' 
																		: 'rgba(0, 0, 0, 0.03)',
																	border: `1px solid ${supplement.timing?.includes(timing) 
																		? 'rgba(25, 118, 210, 0.3)' 
																		: 'rgba(0, 0, 0, 0.08)'}`,
																	transition: 'all 0.2s ease',
																}}
															>
																<Typography 
																	variant="caption" 
																	sx={{
																		fontWeight: supplement.timing?.includes(timing) ? 600 : 400,
																		color: supplement.timing?.includes(timing) 
																			? 'primary.main' 
																			: 'text.secondary',
																		fontSize: '0.65rem',
																	}}
																>
																	{timing}
																</Typography>
															</Box>
														))}
													</Stack>
													<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic', fontSize: '0.6rem', display: 'block' }}>
														*Informational only
													</Typography>
												</Box>
												<Stack direction="row" spacing={1} mt="auto">
													<Button variant="outlined" size="small" startIcon={<FavoriteBorderIcon />} fullWidth>
														Save
													</Button>
													<Button variant="outlined" size="small" startIcon={<ShareIcon />} fullWidth>
														Share
													</Button>
												</Stack>
											</CardContent>
										</Card>
									</Grid>
								))}
							</Grid>
						)}
					</Box>

					{/* Information Section */}
					<Box sx={{ mt: 6 }}>
						<Card>
							<CardContent>
								<Stack direction="row" alignItems="center" spacing={1} mb={2}>
									<InfoIcon color="primary" />
									<Typography variant="h5">
										Supplement Safety & Guidelines
									</Typography>
								</Stack>
								<Grid container spacing={3} mt={1}>
									<Grid item xs={12} md={6}>
										<Typography variant="body1" fontWeight={600} gutterBottom>
											✓ Consult a Healthcare Professional
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Always consult with a healthcare provider before starting any new supplement regimen, especially if you have existing health conditions or take medications.
										</Typography>
									</Grid>
									<Grid item xs={12} md={6}>
										<Typography variant="body1" fontWeight={600} gutterBottom>
											✓ Quality Matters
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Choose supplements from reputable brands that undergo third-party testing for purity and quality. Look for certifications like USP, NSF, or GMP.
										</Typography>
									</Grid>
									<Grid item xs={12} md={6}>
										<Typography variant="body1" fontWeight={600} gutterBottom>
											✓ Follow Dosage Instructions
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Never exceed recommended dosages. More is not always better and can lead to adverse effects or nutrient imbalances.
										</Typography>
									</Grid>
									<Grid item xs={12} md={6}>
										<Typography variant="body1" fontWeight={600} gutterBottom>
											✓ Food First
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Supplements are meant to supplement a healthy diet, not replace it. Focus on getting nutrients from whole foods first.
										</Typography>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(SupplementsPage);









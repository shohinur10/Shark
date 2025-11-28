import { NextPage } from 'next';
import { Stack, Box, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { Property } from '../../libs/types/property/property';
import { PropertiesInquiry } from '../../libs/types/property/property.input';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../libs/types/common';
import { REACT_APP_API_URL } from '../../libs/config';
import Link from 'next/link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const GymsPage: NextPage = () => {
	const device = useDeviceDetect();
	const [gyms, setGyms] = useState<Property[]>([]);
	const [filters, setFilters] = useState<PropertiesInquiry>({
		page: 1,
		limit: 20,
		sort: 'propertyRank',
		direction: 'DESC',
		search: {},
	});

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: filters },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setGyms(data?.getProperties?.list || []);
		},
	});

	if (device === 'mobile') {
		return (
			<Stack className={'gyms-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Gyms</Typography>
					<div>MOBILE GYMS PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'gyms-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'}>
						<Typography variant="h3" className={'page-title'}>
							Gyms & Facilities
						</Typography>
						<Typography variant="body1" className={'page-subtitle'}>
							Find the perfect fitness facility near you
						</Typography>
					</Stack>

					{/* Gyms Grid */}
					<Stack className={'gyms-content'}>
						{gyms.length === 0 ? (
							<Box className={'empty-state'}>
								<Typography variant="h6">No gyms found</Typography>
								<Typography variant="body2">Check back later for new facilities.</Typography>
							</Box>
						) : (
							<Grid container spacing={3}>
								{gyms.map((gym) => (
									<Grid item xs={12} sm={6} md={4} lg={3} key={gym._id}>
										<Link href={`/gyms/${gym._id}`}>
											<Card className={'gym-card'}>
												{gym.propertyImages && gym.propertyImages.length > 0 && (
													<CardMedia
														component="img"
														height="200"
														image={`${REACT_APP_API_URL}/${gym.propertyImages[0]}`}
														alt={gym.propertyTitle}
														className={'gym-image'}
													/>
												)}
												<CardContent>
													<Typography variant="h6" className={'gym-title'}>
														{gym.propertyTitle}
													</Typography>
													{gym.propertyAddress && (
														<Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
															<LocationOnIcon fontSize="small" color="action" />
															<Typography variant="body2" color="text.secondary">
																{gym.propertyAddress}
															</Typography>
														</Stack>
													)}
													<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
														<StarIcon fontSize="small" sx={{ color: '#FFC107' }} />
														<Typography variant="body2" color="text.secondary">
															{gym.propertyRank || 0} rating • {gym.propertyViews || 0} views
														</Typography>
													</Stack>
													{gym.propertyPrice && (
														<Typography variant="h6" color="primary" sx={{ mb: 2 }}>
															${gym.propertyPrice}
															{gym.propertyRent && <Typography component="span" variant="body2">/month</Typography>}
														</Typography>
													)}
													<Button variant="outlined" fullWidth>
														View Details
													</Button>
												</CardContent>
											</Card>
										</Link>
									</Grid>
								))}
							</Grid>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(GymsPage);


import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, CardMedia, Chip, Divider } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import { Property } from '../../libs/types/property/property';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { REACT_APP_API_URL } from '../../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const GymDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const device = useDeviceDetect();
	const [gym, setGym] = useState<Property | null>(null);
	const [loading, setLoading] = useState(true);

	// TODO: Replace with GET_PROPERTY query
	useEffect(() => {
		if (id) {
			setLoading(false);
		}
	}, [id]);

	if (device === 'mobile') {
		return <div>MOBILE GYM DETAIL</div>;
	} else {
		if (loading) return <div>Loading...</div>;
		if (!gym) return <div>Gym not found</div>;

		return (
			<Stack className={'gym-detail-page'}>
				<Stack className={'container'}>
					{/* Image Gallery */}
					{gym.propertyImages && gym.propertyImages.length > 0 && (
						<Box className={'gym-gallery'} sx={{ mb: 4 }}>
							<Grid container spacing={2}>
								<Grid item xs={12} md={8}>
									<CardMedia
										component="img"
										height="400"
										image={`${REACT_APP_API_URL}/${gym.propertyImages[0]}`}
										alt={gym.propertyTitle}
										sx={{ borderRadius: 2 }}
									/>
								</Grid>
								{gym.propertyImages.slice(1, 5).map((img, index) => (
									<Grid item xs={6} md={4} key={index}>
										<CardMedia
											component="img"
											height="190"
											image={`${REACT_APP_API_URL}/${img}`}
											alt={`${gym.propertyTitle} ${index + 2}`}
											sx={{ borderRadius: 2 }}
										/>
									</Grid>
								))}
							</Grid>
						</Box>
					)}

					<Grid container spacing={4}>
						<Grid item xs={12} md={8}>
							{/* Title & Info */}
							<Box sx={{ mb: 3 }}>
								<Typography variant="h3" className={'gym-title'}>
									{gym.propertyTitle}
								</Typography>
								{gym.propertyAddress && (
									<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
										<LocationOnIcon fontSize="small" />
										<Typography variant="body1">{gym.propertyAddress}</Typography>
									</Stack>
								)}
								<Stack direction="row" alignItems="center" spacing={2}>
									<Stack direction="row" alignItems="center" spacing={0.5}>
										<StarIcon sx={{ color: '#FFC107' }} />
										<Typography variant="body1">{gym.propertyRank || 0}</Typography>
										<Typography variant="body2" color="text.secondary">
											({gym.propertyViews || 0} views)
										</Typography>
									</Stack>
									{gym.propertyPrice && (
										<Typography variant="h5" color="primary">
											${gym.propertyPrice}
											{gym.propertyRent && <Typography component="span" variant="body2">/month</Typography>}
										</Typography>
									)}
								</Stack>
							</Box>

							<Divider sx={{ my: 3 }} />

							{/* Description */}
							<Box sx={{ mb: 3 }}>
								<Typography variant="h5" gutterBottom>
									Description
								</Typography>
								<Typography variant="body1">
									{gym.propertyDesc || 'No description available.'}
								</Typography>
							</Box>

							{/* Amenities */}
							<Box sx={{ mb: 3 }}>
								<Typography variant="h5" gutterBottom>
									Amenities
								</Typography>
								<Stack direction="row" spacing={1} flexWrap="wrap">
									<Chip label="Free Weights" />
									<Chip label="Cardio Equipment" />
									<Chip label="Locker Room" />
									<Chip label="Parking" />
								</Stack>
							</Box>
						</Grid>

						<Grid item xs={12} md={4}>
							<Card>
								<CardContent>
									<Typography variant="h6" gutterBottom>
										Contact & Info
									</Typography>
									<Stack spacing={2}>
										<Button variant="contained" fullWidth>
											Book Tour
										</Button>
										<Button variant="outlined" fullWidth startIcon={<PhoneIcon />}>
											Call
										</Button>
										<Button variant="outlined" fullWidth startIcon={<EmailIcon />}>
											Email
										</Button>
									</Stack>
									<Divider sx={{ my: 2 }} />
									<Box>
										<Typography variant="body2" color="text.secondary" gutterBottom>
											Opening Hours
										</Typography>
										<Typography variant="body1">Mon-Fri: 6:00 AM - 10:00 PM</Typography>
										<Typography variant="body1">Sat-Sun: 8:00 AM - 8:00 PM</Typography>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(GymDetailPage);






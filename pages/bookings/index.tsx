import { NextPage } from 'next';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Tabs, Tab, Chip } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const BookingsPage: NextPage = () => {
	const device = useDeviceDetect();
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'bookings-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Bookings</Typography>
					<div>MOBILE BOOKINGS PAGE</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'bookings-page'}>
				<Stack className={'container'}>
					{/* Page Header */}
					<Stack className={'page-header'} direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
						<Box>
							<Typography variant="h3" className={'page-title'}>
								My Bookings
							</Typography>
							<Typography variant="body1" className={'page-subtitle'}>
								Manage your trainer sessions and gym visits
							</Typography>
						</Box>
						<Button variant="contained" startIcon={<AddIcon />}>
							Book New Session
						</Button>
					</Stack>

					{/* Tabs */}
					<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
						<Tabs value={tabValue} onChange={handleTabChange}>
							<Tab label="Upcoming" />
							<Tab label="History" />
							<Tab label="Cancelled" />
						</Tabs>
					</Box>

					{/* Tab Content - Upcoming */}
					{tabValue === 0 && (
						<Grid container spacing={3}>
							{[1, 2].map((item) => (
								<Grid item xs={12} md={6} key={item}>
									<Card className={'booking-card'}>
										<CardContent>
											<Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
												<Box>
													<Typography variant="h6">Personal Training Session</Typography>
													<Typography variant="body2" color="text.secondary">
														with Trainer Name
													</Typography>
												</Box>
												<Chip label="Confirmed" color="success" size="small" />
											</Stack>
											<Stack spacing={1}>
												<Stack direction="row" alignItems="center" spacing={1}>
													<CalendarTodayIcon fontSize="small" color="action" />
													<Typography variant="body2">January 15, 2024</Typography>
												</Stack>
												<Stack direction="row" alignItems="center" spacing={1}>
													<AccessTimeIcon fontSize="small" color="action" />
													<Typography variant="body2">10:00 AM - 11:00 AM</Typography>
												</Stack>
												<Stack direction="row" alignItems="center" spacing={1}>
													<LocationOnIcon fontSize="small" color="action" />
													<Typography variant="body2">In-person / Online</Typography>
												</Stack>
											</Stack>
											<Stack direction="row" spacing={2} sx={{ mt: 3 }}>
												<Button variant="outlined" size="small" startIcon={<CancelIcon />}>
													Cancel
												</Button>
												<Button variant="contained" size="small">
													View Details
												</Button>
											</Stack>
										</CardContent>
									</Card>
								</Grid>
							))}
							<Grid item xs={12}>
								<Box className={'empty-bookings-placeholder'} sx={{ textAlign: 'center', py: 4 }}>
									<Typography variant="body2" color="text.secondary">
										No upcoming bookings
									</Typography>
									<Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }}>
										Book New Session
									</Button>
								</Box>
							</Grid>
						</Grid>
					)}

					{/* Tab Content - History */}
					{tabValue === 1 && (
						<Grid container spacing={3}>
							{[1, 2, 3].map((item) => (
								<Grid item xs={12} md={6} key={item}>
									<Card className={'booking-card'}>
										<CardContent>
											<Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
												<Box>
													<Typography variant="h6">Personal Training Session</Typography>
													<Typography variant="body2" color="text.secondary">
														with Trainer Name
													</Typography>
												</Box>
												<Chip label="Completed" color="default" size="small" />
											</Stack>
											<Stack spacing={1}>
												<Stack direction="row" alignItems="center" spacing={1}>
													<CalendarTodayIcon fontSize="small" color="action" />
													<Typography variant="body2">January 10, 2024</Typography>
												</Stack>
												<Stack direction="row" alignItems="center" spacing={1}>
													<AccessTimeIcon fontSize="small" color="action" />
													<Typography variant="body2">10:00 AM - 11:00 AM</Typography>
												</Stack>
											</Stack>
											<Button variant="outlined" size="small" sx={{ mt: 3 }}>
												Leave Review
											</Button>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					)}

					{/* Tab Content - Cancelled */}
					{tabValue === 2 && (
						<Box className={'empty-bookings-placeholder'} sx={{ textAlign: 'center', py: 4 }}>
							<Typography variant="body2" color="text.secondary">
								No cancelled bookings
							</Typography>
						</Box>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(BookingsPage);






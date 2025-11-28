import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, Grid, Card, CardContent, Avatar, Rating, Tabs, Tab } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import { Member } from '../../libs/types/member/member';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import { REACT_APP_API_URL } from '../../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TrainerDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const device = useDeviceDetect();
	const [trainer, setTrainer] = useState<Member | null>(null);
	const [loading, setLoading] = useState(true);
	const [tabValue, setTabValue] = useState(0);

	// TODO: Replace with GET_TRAINER query
	useEffect(() => {
		if (id) {
			setLoading(false);
		}
	}, [id]);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	if (device === 'mobile') {
		return <div>MOBILE TRAINER DETAIL</div>;
	} else {
		if (loading) return <div>Loading...</div>;
		if (!trainer) return <div>Trainer not found</div>;

		return (
			<Stack className={'trainer-detail-page'}>
				<Stack className={'container'}>
					{/* Header */}
					<Stack className={'trainer-header'} direction="row" spacing={4}>
						<Avatar
							src={trainer.memberImage ? `${REACT_APP_API_URL}/${trainer.memberImage}` : undefined}
							sx={{ width: 200, height: 200 }}
						>
							{trainer.memberFullName?.charAt(0) || 'T'}
						</Avatar>
						<Box className={'trainer-info'} flex={1}>
							<Typography variant="h3" className={'trainer-name'}>
								{trainer.memberFullName || trainer.memberNick}
							</Typography>
							{trainer.memberAddress && (
								<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
									<LocationOnIcon fontSize="small" />
									<Typography variant="body1">{trainer.memberAddress}</Typography>
								</Stack>
							)}
							<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
								<Rating value={trainer.memberRank / 10 || 0} readOnly precision={0.5} />
								<Typography variant="body2" color="text.secondary">
									({trainer.memberLikes || 0} reviews) • {trainer.memberRank || 0} points
								</Typography>
							</Stack>
							{trainer.memberDesc && (
								<Typography variant="body1" sx={{ mb: 3 }}>
									{trainer.memberDesc}
								</Typography>
							)}
							<Stack direction="row" spacing={2}>
								<Button variant="contained" size="large" startIcon={<CalendarTodayIcon />}>
									Book Session
								</Button>
								<Button variant="outlined" startIcon={<MessageIcon />}>
									Message
								</Button>
							</Stack>
						</Box>
					</Stack>

					{/* Tabs */}
					<Box sx={{ borderBottom: 1, borderColor: 'divider', my: 4 }}>
						<Tabs value={tabValue} onChange={handleTabChange}>
							<Tab label="About" />
							<Tab label="Specializations" />
							<Tab label="Reviews" />
							<Tab label="Availability" />
						</Tabs>
					</Box>

					{/* Tab Content */}
					{tabValue === 0 && (
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									About
								</Typography>
								<Typography variant="body1">
									{trainer.memberDesc || 'No additional information available.'}
								</Typography>
							</CardContent>
						</Card>
					)}

					{tabValue === 1 && (
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Specializations
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Specializations will be displayed here
								</Typography>
							</CardContent>
						</Card>
					)}

					{tabValue === 2 && (
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Reviews
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Reviews will be displayed here
								</Typography>
							</CardContent>
						</Card>
					)}

					{tabValue === 3 && (
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Availability
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Availability calendar will be displayed here
								</Typography>
							</CardContent>
						</Card>
					)}
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(TrainerDetailPage);






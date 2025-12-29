import { NextPage } from 'next';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const GymsPage: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'gyms-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Gyms</Typography>
					<div>MOBILE GYMS PAGE - Coming Soon</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'gyms-page'}>
				<Stack className={'container'}>
					<Stack className={'page-header'}>
						<Typography variant="h3" className={'page-title'}>
							Gyms & Facilities
						</Typography>
						<Typography variant="body1" className={'page-subtitle'}>
							Find the perfect fitness facility near you
						</Typography>
					</Stack>

					<Stack className={'gyms-content'}>
						<Box className={'empty-state'}>
							<Typography variant="h6">Gyms feature coming soon</Typography>
							<Typography variant="body2">We're working on bringing you the best gym listings.</Typography>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(GymsPage);

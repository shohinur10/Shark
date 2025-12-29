import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const GymDetailPage: NextPage = () => {
	const router = useRouter();
	const { id } = router.query;
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'gym-detail-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">Gym Details</Typography>
					<div>MOBILE GYM DETAIL - Coming Soon</div>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'gym-detail-page'}>
				<Stack className={'container'}>
					<Box className={'empty-state'}>
						<Typography variant="h4">Gym Details</Typography>
						<Typography variant="body1">Gym detail page coming soon</Typography>
						<Typography variant="body2" color="text.secondary">
							Gym ID: {id}
						</Typography>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(GymDetailPage);

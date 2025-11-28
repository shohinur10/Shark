import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeroSection from '../libs/components/homepage/HeroSection';
import WorkoutCategoriesPreview from '../libs/components/homepage/WorkoutCategoriesPreview';
import NutritionPreview from '../libs/components/homepage/NutritionPreview';
import TrainerShowcase from '../libs/components/homepage/TrainerShowcase';
import TestimonialsTransformations from '../libs/components/homepage/TestimonialsTransformations';
import AppFeatures from '../libs/components/homepage/AppFeatures';
import PricingTeaser from '../libs/components/homepage/PricingTeaser';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<HeroSection />
				<WorkoutCategoriesPreview />
				<NutritionPreview />
				<TrainerShowcase />
				<TestimonialsTransformations />
				<AppFeatures />
				<PricingTeaser />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<HeroSection />
				<WorkoutCategoriesPreview />
				<NutritionPreview />
				<TrainerShowcase />
				<TestimonialsTransformations />
				<AppFeatures />
				<PricingTeaser />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);

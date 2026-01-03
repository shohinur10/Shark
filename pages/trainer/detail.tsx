import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Container, Box, Typography, CircularProgress } from '@mui/material';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

/**
 * Trainer Detail Page - Redirects to the proper trainer profile page
 * This page handles the legacy route /trainer/detail?trainerId=...
 * and redirects to /trainer/[id] format
 */
const TrainerDetailPage: NextPage = () => {
	const router = useRouter();
	const { trainerId } = router.query;

	useEffect(() => {
		if (trainerId && typeof trainerId === 'string') {
			// Redirect to the proper trainer profile page
			router.replace(`/trainer/${trainerId}`);
		} else if (!trainerId) {
			// If no trainerId provided, redirect to trainers list
			router.replace('/trainers');
		}
	}, [trainerId, router]);

	// Show loading state while redirecting
	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '50vh',
					gap: 2,
				}}
			>
				<CircularProgress />
				<Typography variant="body1" sx={{ color: '#757575' }}>
					Redirecting to trainer profile...
				</Typography>
			</Box>
		</Container>
	);
};

export default TrainerDetailPage;
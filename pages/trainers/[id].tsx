import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

// This page redirects /trainers/[id] to /trainer/[id] to match the existing route structure
const TrainersDetailRedirect: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (id && typeof id === 'string') {
			router.replace(`/trainer/${id}`);
		}
	}, [id, router]);

	// Show loading state while redirecting
	return (
		<div style={{ 
			display: 'flex', 
			justifyContent: 'center', 
			alignItems: 'center', 
			height: '100vh',
			fontFamily: 'system-ui, sans-serif'
		}}>
			Redirecting...
		</div>
	);
};

export default TrainersDetailRedirect;


import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

// Redirect /goals/challenges to /challenges
const GoalsChallengesRedirect: React.FC = () => {
	const router = useRouter();

	useEffect(() => {
		router.replace('/challenges');
	}, [router]);

	return (
		<div style={{ 
			display: 'flex', 
			justifyContent: 'center', 
			alignItems: 'center', 
			height: '100vh',
			fontFamily: 'system-ui, sans-serif'
		}}>
			Redirecting to challenges...
		</div>
	);
};

export default GoalsChallengesRedirect;


































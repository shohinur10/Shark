import React from 'react';
import { Stack, Box, Button, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PeopleIcon from '@mui/icons-material/People';

const HeroSection = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'hero-section'}>
				<Box component="div" className={'hero-image-container'}>
					<Box component="div" className={'hero-overlay'} />
					<Stack className={'hero-content'}>
						<Typography variant="h2" className={'hero-title'}>
							Start Your Fitness Journey
						</Typography>
						<Typography variant="body1" className={'hero-subtitle'}>
							Transform your body, fuel your mind, achieve greatness with Shark Fitness
						</Typography>
						<Link href="/account/join">
							<Button variant="contained" size="large" className={'hero-btn-primary'} startIcon={<FitnessCenterIcon />}>
								Start Your Fitness Journey
							</Button>
						</Link>
					</Stack>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className={'hero-section'}>
				<Box component="div" className={'hero-image-container'}>
					<Box component="div" className={'hero-overlay'} />
					<Stack className={'hero-content'}>
						<Typography variant="h1" className={'hero-title'}>
							Start Your Fitness Journey
						</Typography>
						<Typography variant="h4" className={'hero-subtitle'}>
							Transform your body, fuel your mind, achieve greatness
							<br />
							<span className={'shark-accent'}>with Shark Fitness</span>
						</Typography>
						<Link href="/account/join">
							<Button variant="contained" size="large" className={'hero-btn-primary'} startIcon={<FitnessCenterIcon />}>
								Start Your Fitness Journey
							</Button>
						</Link>
						<Stack className={'hero-stats'} direction="row" spacing={6}>
							<Box component="div" className={'stat-item'}>
								<PeopleIcon className={'stat-icon'} />
								<Typography variant="h3" className={'stat-number'}>50K+</Typography>
								<Typography variant="body2" className={'stat-label'}>Active Members</Typography>
							</Box>
							<Box component="div" className={'stat-item'}>
								<FitnessCenterIcon className={'stat-icon'} />
								<Typography variant="h3" className={'stat-number'}>500+</Typography>
								<Typography variant="body2" className={'stat-label'}>Workout Plans</Typography>
							</Box>
							<Box component="div" className={'stat-item'}>
								<LocalFireDepartmentIcon className={'stat-icon'} />
								<Typography variant="h3" className={'stat-number'}>1000+</Typography>
								<Typography variant="body2" className={'stat-label'}>Success Stories</Typography>
							</Box>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		);
	}
};

export default HeroSection;






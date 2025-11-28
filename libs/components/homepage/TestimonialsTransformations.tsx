import React from 'react';
import { Stack, Box, Typography, Grid, Card, CardContent, Avatar, Chip } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const transformations = [
	{
		id: '1',
		name: 'James Wilson',
		age: 32,
		beforeImage: '/img/bodybuilders/pexels-gabflicks-13122470.jpg',
		afterImage: '/img/bodybuilders/pexels-kuiyibo-13958866.jpg',
		timeframe: '6 months',
		weightLoss: '25 lbs',
		muscleGain: '+15 lbs muscle',
		testimonial: 'Shark Fitness transformed my life. The combination of structured workouts and meal plans helped me lose 25 pounds and gain incredible strength. The trainers are amazing!',
		rating: 5,
		program: 'Muscle Gain Program',
	},
	{
		id: '2',
		name: 'Maria Garcia',
		age: 28,
		beforeImage: '/img/bodybuilders/pexels-leonmart-1552108.jpg',
		afterImage: '/img/bodybuilders/pexels-mralpha-13451637.jpg',
		timeframe: '4 months',
		weightLoss: '30 lbs',
		muscleGain: '+10 lbs muscle',
		testimonial: 'I never thought I could achieve these results. The nutrition tracking and HIIT workouts were game-changers. I feel stronger and more confident than ever!',
		rating: 5,
		program: 'Weight Loss Program',
	},
	{
		id: '3',
		name: 'David Chen',
		age: 35,
		beforeImage: '/img/bodybuilders/pexels-mralpha-24809802.jpg',
		afterImage: '/img/bodybuilders/pexels-oscar-machado-937103-3014237.jpg',
		timeframe: '8 months',
		weightLoss: '40 lbs',
		muscleGain: '+20 lbs muscle',
		testimonial: 'The progress tracking feature kept me motivated every day. Seeing my body measurements change week by week was incredible. Best investment in my health!',
		rating: 5,
		program: 'Complete Transformation',
	},
];

const TestimonialsTransformations = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'testimonials-transformations'}>
				<Stack className={'container'}>
					<Typography variant="h4" className={'section-title'}>
						Success Stories
					</Typography>
					<Stack spacing={2}>
						{transformations.slice(0, 2).map((story) => (
							<Card key={story.id} className={'transformation-card'}>
								<CardContent>
									<Stack direction="row" spacing={2} mb={2}>
										<Box
											className={'before-image'}
											style={{
												backgroundImage: `url(${story.beforeImage})`,
											}}
										/>
										<Box
											className={'after-image'}
											style={{
												backgroundImage: `url(${story.afterImage})`,
											}}
										/>
									</Stack>
									<Typography variant="h6" className={'story-name'}>
										{story.name}
									</Typography>
									<Typography variant="body2" className={'story-testimonial'}>
										{story.testimonial}
									</Typography>
								</CardContent>
							</Card>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'testimonials-transformations'}>
				<Stack className={'container'}>
					<Stack className={'section-header'}>
						<Box>
							<Typography variant="h3" className={'section-title'}>
								Real Transformations, Real Results
							</Typography>
							<Typography variant="body1" className={'section-subtitle'}>
								See how our members achieved incredible results with Shark Fitness
							</Typography>
						</Box>
					</Stack>
					<Grid container spacing={4}>
						{transformations.map((story) => (
							<Grid item xs={12} md={4} key={story.id}>
								<Card className={'transformation-card'}>
									<Box className={'transformation-images'}>
										<Box className={'image-container'}>
											<Box
												className={'before-image'}
												style={{
													backgroundImage: `url(${story.beforeImage})`,
												}}
											>
												<Chip label="Before" size="small" className={'before-label'} />
											</Box>
											<Box
												className={'after-image'}
												style={{
													backgroundImage: `url(${story.afterImage})`,
												}}
											>
												<Chip label="After" size="small" className={'after-label'} />
											</Box>
										</Box>
									</Box>
									<CardContent>
										<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
											<Box>
												<Typography variant="h6" className={'story-name'}>
													{story.name}
												</Typography>
												<Typography variant="caption" color="text.secondary">
													{story.age} years old • {story.timeframe}
												</Typography>
											</Box>
											<Stack direction="row" spacing={0.5}>
												{[...Array(story.rating)].map((_, i) => (
													<StarIcon key={i} className={'star-icon'} />
												))}
											</Stack>
										</Stack>
										<Stack direction="row" spacing={2} mb={2}>
											<Chip
												icon={<TrendingUpIcon />}
												label={story.weightLoss}
												size="small"
												className={'result-chip'}
											/>
											<Chip
												icon={<LocalFireDepartmentIcon />}
												label={story.muscleGain}
												size="small"
												className={'result-chip'}
											/>
										</Stack>
										<Typography variant="body2" className={'story-testimonial'} mb={1}>
											"{story.testimonial}"
										</Typography>
										<Chip label={story.program} size="small" className={'program-chip'} />
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Stack>
			</Stack>
		);
	}
};

export default TestimonialsTransformations;





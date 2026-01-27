import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography, Grid } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: 'none',
		boxShadow: 'none',
		'&:before': {
			display: 'none',
		},
	}),
);

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary 
		expandIcon={<ChevronRightIcon className="faq-chevron" />} 
		{...props} 
	/>
))(({ theme }) => ({
	backgroundColor: 'transparent',
	padding: '20px 24px',
	minHeight: '72px',
	'& .MuiAccordionSummary-content': {
		margin: 0,
	},
	'& .faq-chevron': {
		transition: 'transform 0.3s ease-in-out',
		color: '#6B6B6B',
		fontSize: '24px',
	},
	'&.Mui-expanded .faq-chevron': {
		transform: 'rotate(90deg)',
		color: '#E10600',
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<string>('account');
	const [expanded, setExpanded] = useState<string | false>(false);

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	
	/** HANDLERS **/
	const changeCategoryHandler = (category: string) => {
		setCategory(category);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const data: any = {
		account: [
			{
				id: 'account-1',
				subject: 'Can I switch plans anytime?',
				content: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.',
			},
			{
				id: 'account-2',
				subject: 'How do I update my profile information?',
				content: 'Go to your account settings and click "Edit Profile". You can update your name, photo, fitness goals, and preferences anytime.',
			},
			{
				id: 'account-3',
				subject: 'What happens if I cancel my membership?',
				content: 'You\'ll keep access until the end of your billing period. After that, you can still use the free features, but premium workouts and features will be locked.',
			},
			{
				id: 'account-4',
				subject: 'How do I reset my password?',
				content: 'Click "Forgot Password" on the login page. We\'ll send you a secure link to reset it. Check your spam folder if you don\'t see it!',
			},
			{
				id: 'account-5',
				subject: 'Can I share my account with family?',
				content: 'Each account is for one person to ensure accurate progress tracking. We offer family plans if you want multiple accounts at a discount.',
			},
		],
		workouts: [
			{
				id: 'workout-1',
				subject: 'What happens if I miss a workout day?',
				content: 'No worries! Your streak might pause, but you can always jump back in. We recommend doing a quick 10-minute session to keep momentum going.',
			},
			{
				id: 'workout-2',
				subject: 'How do I find workouts for my fitness level?',
				content: 'Use the filter to select Beginner, Intermediate, or Advanced. Each workout shows difficulty ratings, and you can preview exercises before starting.',
			},
			{
				id: 'workout-3',
				subject: 'Can I do workouts without equipment?',
				content: 'Yes! Many workouts are bodyweight-only. Look for the "No Equipment" tag. We also offer equipment-free alternatives for most exercises.',
			},
			{
				id: 'workout-4',
				subject: 'How long should my workouts be?',
				content: 'We have everything from 10-minute quick sessions to 60-minute full programs. Start with what fits your schedule - consistency beats duration!',
			},
			{
				id: 'workout-5',
				subject: 'Can I create my own workout plan?',
				content: 'Yes! Premium members can build custom workouts by selecting exercises, setting reps and rest times, and saving them to their library.',
			},
		],
		progress: [
			{
				id: 'progress-1',
				subject: 'How is my progress calculated?',
				content: 'We track workouts completed, calories burned, active minutes, and consistency. Your progress score combines all these factors to show your overall improvement.',
			},
			{
				id: 'progress-2',
				subject: 'Why did my streak reset?',
				content: 'Streaks reset if you go 48+ hours without logging a workout. Don\'t worry - you can always start a new streak! We also offer streak freezes for premium members.',
			},
			{
				id: 'progress-3',
				subject: 'How do challenges work?',
				content: 'Challenges are time-limited goals (like "30-Day Strength Challenge"). Complete daily tasks, earn points, and compete with others. Winners get badges and sometimes prizes!',
			},
			{
				id: 'progress-4',
				subject: 'Can I export my workout data?',
				content: 'Yes! Go to Progress > Export Data. You can download your workout history, stats, and achievements as a CSV or PDF file.',
			},
			{
				id: 'progress-5',
				subject: 'How accurate are the calorie estimates?',
				content: 'Our estimates are based on your weight, workout intensity, and duration. They\'re a helpful guide, but individual results may vary. Use them as a reference point!',
			},
		],
		nutrition: [
			{
				id: 'nutrition-1',
				subject: 'How do meal plans work?',
				content: 'Choose a plan based on your goals (weight loss, muscle gain, maintenance). We\'ll give you daily meal suggestions with recipes, shopping lists, and nutrition info.',
			},
			{
				id: 'nutrition-2',
				subject: 'Can I customize meal plans for dietary restrictions?',
				content: 'Absolutely! Filter by vegetarian, vegan, gluten-free, keto, or other preferences. You can also swap meals within your plan.',
			},
			{
				id: 'nutrition-3',
				subject: 'How do I track my macros?',
				content: 'Log your meals in the Nutrition section. We\'ll show your daily protein, carbs, and fats. Premium members get detailed breakdowns and recommendations.',
			},
			{
				id: 'nutrition-4',
				subject: 'Are the recipes easy to make?',
				content: 'Yes! Most recipes take 30 minutes or less and use common ingredients. Each recipe includes step-by-step photos and prep tips.',
			},
			{
				id: 'nutrition-5',
				subject: 'Can I use the calorie calculator for meal planning?',
				content: 'Definitely! Our calculator helps you figure out your daily calorie needs based on your goals. Use it to plan meals that fit your targets.',
			},
		],
		community: [
			{
				id: 'community-1',
				subject: 'How do I connect with other members?',
				content: 'Join groups based on your interests, follow members who inspire you, and comment on posts. You can also send direct messages to friends.',
			},
			{
				id: 'community-2',
				subject: 'Can I share my progress photos?',
				content: 'Yes! Many members share their transformation photos. You can set privacy controls - share publicly, with friends only, or keep them private.',
			},
			{
				id: 'community-3',
				subject: 'What should I do if someone is being inappropriate?',
				content: 'Report them immediately using the flag icon. Our moderators review reports within 24 hours. We have zero tolerance for harassment.',
			},
			{
				id: 'community-4',
				subject: 'How do I find workout buddies?',
				content: 'Join location-based groups or search for members with similar goals. You can also post in the community asking for accountability partners!',
			},
			{
				id: 'community-5',
				subject: 'Can I create my own group?',
				content: 'Premium members can create public or private groups. Set your own rules, post challenges, and build your fitness community!',
			},
		],
		payments: [
			{
				id: 'payment-1',
				subject: 'What payment methods do you accept?',
				content: 'We accept all major credit cards, debit cards, PayPal, and Apple Pay. All payments are processed securely through encrypted channels.',
			},
			{
				id: 'payment-2',
				subject: 'When will I be charged?',
				content: 'You\'re charged on the same date each month (or year for annual plans). We\'ll send you an email reminder 3 days before billing.',
			},
			{
				id: 'payment-3',
				subject: 'Can I get a refund?',
				content: 'We offer a 30-day money-back guarantee. If you\'re not happy, contact support within 30 days of your first payment for a full refund.',
			},
			{
				id: 'payment-4',
				subject: 'What happens if my payment fails?',
				content: 'We\'ll retry the payment automatically. If it fails after 3 attempts, we\'ll email you. You\'ll have 7 days to update your payment method before access is paused.',
			},
			{
				id: 'payment-5',
				subject: 'Do you offer student discounts?',
				content: 'Yes! Students get 50% off with a valid .edu email. Military and healthcare workers also get special pricing. Check our pricing page for details.',
			},
		],
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box component="div" className={'categories'}>
					<button
						className={`category-button ${category === 'account' ? 'active' : ''}`}
						onClick={() => changeCategoryHandler('account')}
					>
						Account & Membership
					</button>
					<button
						className={`category-button ${category === 'workouts' ? 'active' : ''}`}
						onClick={() => changeCategoryHandler('workouts')}
					>
						Workouts & Training
					</button>
					<button
						className={`category-button ${category === 'progress' ? 'active' : ''}`}
						onClick={() => changeCategoryHandler('progress')}
					>
						Progress & Streaks
					</button>
					<button
						className={`category-button ${category === 'nutrition' ? 'active' : ''}`}
						onClick={() => changeCategoryHandler('nutrition')}
					>
						Nutrition
					</button>
					<button
						className={`category-button ${category === 'community' ? 'active' : ''}`}
						onClick={() => changeCategoryHandler('community')}
					>
						Community
					</button>
					<button
						className={`category-button ${category === 'payments' ? 'active' : ''}`}
						onClick={() => changeCategoryHandler('payments')}
					>
						Payments
					</button>
				</Box>
				<Box component="div" className={'faq-cards'}>
					<Grid container spacing={2}>
					{data[category] &&
						data[category].map((ele: any) => (
								<Grid item xs={12} key={ele?.id}>
									<Accordion 
										expanded={expanded === ele?.id} 
										onChange={handleChange(ele?.id)} 
										className={'faq-card'}
									>
										<AccordionSummary 
											className="faq-question" 
											aria-controls={`${ele?.id}-content`}
											id={`${ele?.id}-header`}
										>
											<Typography className="faq-question-text">
												{ele?.subject}
									</Typography>
								</AccordionSummary>
										<AccordionDetails className={'faq-answer'}>
											<Typography className="faq-answer-text">
												{ele?.content}
										</Typography>
								</AccordionDetails>
							</Accordion>
								</Grid>
						))}
					</Grid>
				</Box>
			</Stack>
		);
	}
};

export default Faq;

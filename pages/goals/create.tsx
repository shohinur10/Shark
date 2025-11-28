import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CreateGoalPage: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [goalData, setGoalData] = useState({
		title: '',
		type: '',
		targetValue: '',
		currentValue: '',
		targetDate: '',
		description: '',
	});

	const handleSubmit = () => {
		// TODO: Save goal
		router.push('/goals');
	};

	if (device === 'mobile') {
		return <div>MOBILE CREATE GOAL</div>;
	} else {
		return (
			<Stack className={'create-goal-page'}>
				<Stack className={'container'}>
					<Typography variant="h3" className={'page-title'} sx={{ mb: 4 }}>
						Create New Goal
					</Typography>

					<Card>
						<CardContent>
							<Stack spacing={3}>
								<TextField
									fullWidth
									label="Goal Title"
									value={goalData.title}
									onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
									placeholder="e.g., Lose 10kg, Run 5K"
								/>

								<FormControl fullWidth>
									<InputLabel>Goal Type</InputLabel>
									<Select
										value={goalData.type}
										onChange={(e) => setGoalData({ ...goalData, type: e.target.value })}
										label="Goal Type"
									>
										<MenuItem value="weight_loss">Lose Weight</MenuItem>
										<MenuItem value="weight_gain">Gain Weight</MenuItem>
										<MenuItem value="muscle_gain">Build Muscle</MenuItem>
										<MenuItem value="endurance">Improve Endurance</MenuItem>
										<MenuItem value="strength">Increase Strength</MenuItem>
										<MenuItem value="distance">Run Distance</MenuItem>
										<MenuItem value="other">Other</MenuItem>
									</Select>
								</FormControl>

								<Grid container spacing={2}>
									<Grid item xs={6}>
										<TextField
											fullWidth
											label="Current Value"
											type="number"
											value={goalData.currentValue}
											onChange={(e) => setGoalData({ ...goalData, currentValue: e.target.value })}
										/>
									</Grid>
									<Grid item xs={6}>
										<TextField
											fullWidth
											label="Target Value"
											type="number"
											value={goalData.targetValue}
											onChange={(e) => setGoalData({ ...goalData, targetValue: e.target.value })}
										/>
									</Grid>
								</Grid>

								<TextField
									fullWidth
									label="Target Date"
									type="date"
									value={goalData.targetDate}
									onChange={(e) => setGoalData({ ...goalData, targetDate: e.target.value })}
									InputLabelProps={{ shrink: true }}
								/>

								<TextField
									fullWidth
									label="Description (Optional)"
									multiline
									rows={4}
									value={goalData.description}
									onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
									placeholder="Add any notes or motivation for this goal..."
								/>

								<Stack direction="row" spacing={2} justifyContent="flex-end">
									<Button variant="outlined" onClick={() => router.back()}>
										Cancel
									</Button>
									<Button variant="contained" onClick={handleSubmit}>
										Create Goal
									</Button>
								</Stack>
							</Stack>
						</CardContent>
					</Card>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(CreateGoalPage);






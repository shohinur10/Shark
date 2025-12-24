import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Box, Card } from '@mui/material';
import dynamic from 'next/dynamic';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
const TuiEditor = dynamic(() => import('../community/Teditor'), { ssr: false });

const WriteArticle: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Box sx={{ p: 2 }}>
				<Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
					Write Article
				</Typography>
				<TuiEditor />
			</Box>
		);
	} else {
		return (
			<div id="write-article-page">
				<Card
					elevation={0}
					sx={{
						mb: 4,
						p: 4,
						background: 'linear-gradient(135deg, #87cdf9 0%, #6bb3e8 100%)',
						borderRadius: 3,
						color: 'white',
					}}
				>
					<Stack direction="row" alignItems="center" spacing={2} mb={1}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								width: 56,
								height: 56,
								borderRadius: 2,
								backgroundColor: 'rgba(255, 255, 255, 0.2)',
								backdropFilter: 'blur(10px)',
							}}
						>
							<EditNoteIcon sx={{ fontSize: 32 }} />
						</Box>
						<Box>
							<Typography
								className="main-title"
								variant="h4"
								sx={{
									fontWeight: 700,
									mb: 0.5,
									color: 'white',
									textShadow: '0 2px 4px rgba(0,0,0,0.1)',
								}}
							>
								Write an Article
							</Typography>
							<Stack direction="row" alignItems="center" spacing={1}>
								<LightbulbIcon sx={{ fontSize: 18, opacity: 0.9 }} />
								<Typography
									className="sub-title"
									variant="body1"
									sx={{
										color: 'rgba(255, 255, 255, 0.95)',
										fontSize: '16px',
									}}
								>
									Share your thoughts, experiences, and knowledge with the community
								</Typography>
							</Stack>
						</Box>
					</Stack>
				</Card>
				<TuiEditor />
			</div>
		);
	}
};

export default WriteArticle;

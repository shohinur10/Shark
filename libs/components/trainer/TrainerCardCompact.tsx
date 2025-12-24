import React from 'react';
import { Box, Typography, Avatar, Rating, Chip, Stack, Button } from '@mui/material';
import Link from 'next/link';
import { Member } from '../../../libs/types/member/member';
import { REACT_APP_API_URL } from '../../../libs/config';

interface TrainerCardCompactProps {
	trainer: Member;
}

const TrainerCardCompact: React.FC<TrainerCardCompactProps> = ({ trainer }) => {
	const imageUrl = trainer.memberImage ? `${REACT_APP_API_URL}/${trainer.memberImage}` : undefined;
	const name = trainer.memberFullName || trainer.memberNick || 'Trainer';
	const rating = trainer.trainerRating || (trainer.memberRank ? trainer.memberRank / 10 : 0);
	const experience = trainer.trainerExperience || 0;
	const specialties = trainer.trainerSpecialties || [];
	const bio = trainer.trainerBio || trainer.memberDesc || '';

	// Derive DNA chips
	const deriveFocus = (): string => {
		const specialtiesLower = specialties.map((s: string) => s.toLowerCase());
		if (specialtiesLower.some((s: string) => s.includes('strength') || s.includes('hypertrophy'))) {
			return 'Strength/Hypertrophy';
		}
		if (specialtiesLower.some((s: string) => s.includes('fat') || s.includes('weight'))) {
			return 'Fat Loss';
		}
		return specialties[0] || 'General';
	};

	const deriveIntensity = (): string => {
		if (experience >= 10) return 'High';
		if (experience >= 5) return 'Medium';
		return 'Low';
	};

	const deriveStyle = (): string => {
		if (bio.length > 200) return 'Structured';
		if (bio.length > 50) return 'Coaching';
		return 'Minimal';
	};

	return (
		<Box
			className="trainer-card-compact"
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				maxWidth: '100%',
				padding: 2,
				borderRadius: 2,
				border: '1px solid #E5E5E5',
				backgroundColor: '#FFFFFF',
				transition: 'all 0.2s ease',
				cursor: 'pointer',
				height: '100%',
				'&:hover': {
					borderColor: '#f17742',
					boxShadow: '0 4px 12px rgba(241, 119, 66, 0.15)',
					transform: 'translateY(-2px)',
				},
			}}
		>
			<Link href={`/trainer/${trainer._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
				{/* Header Row */}
				<Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
					<Avatar
						src={imageUrl}
						sx={{
							width: 56,
							height: 56,
							border: '2px solid #F5F5F5',
							flexShrink: 0,
						}}
					>
						{name.charAt(0).toUpperCase()}
					</Avatar>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography
							variant="h6"
							sx={{
								fontSize: '15px',
								fontWeight: 600,
								color: '#212121',
								marginBottom: 0.5,
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{name}
						</Typography>
						<Stack direction="row" alignItems="center" spacing={1}>
							<Rating value={rating} readOnly precision={0.5} size="small" sx={{ fontSize: '14px' }} />
							<Typography variant="body2" sx={{ fontSize: '12px', color: '#757575' }}>
								{rating.toFixed(1)}
							</Typography>
							{experience > 0 && (
								<Typography variant="body2" sx={{ fontSize: '12px', color: '#757575' }}>
									• {experience}yr
								</Typography>
							)}
						</Stack>
					</Box>
				</Stack>

				{/* Specialties Chips */}
				{specialties.length > 0 && (
					<Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mb: 1.5 }}>
						{specialties.slice(0, 2).map((specialty: string, idx: number) => (
							<Chip
								key={idx}
								label={specialty}
								size="small"
								sx={{
									height: 22,
									fontSize: '11px',
									fontWeight: 500,
									backgroundColor: '#F5F5F5',
									color: '#616161',
									border: 'none',
								}}
							/>
						))}
					</Stack>
				)}

				{/* Bio Preview */}
				{bio && (
					<Typography
						variant="body2"
						sx={{
							fontSize: '12px',
							color: '#757575',
							lineHeight: 1.5,
							mb: 1.5,
							display: '-webkit-box',
							WebkitLineClamp: 1,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
						}}
					>
						{bio}
					</Typography>
				)}

				{/* Trainer DNA Row */}
				<Stack direction="row" spacing={0.5} sx={{ mb: 1.5 }}>
					<Chip
						label={`Focus: ${deriveFocus()}`}
						size="small"
						sx={{
							height: 20,
							fontSize: '10px',
							fontWeight: 500,
							backgroundColor: '#E3F2FD',
							color: '#1976D2',
							border: 'none',
						}}
					/>
					<Chip
						label={`Intensity: ${deriveIntensity()}`}
						size="small"
						sx={{
							height: 20,
							fontSize: '10px',
							fontWeight: 500,
							backgroundColor: '#FFF3E0',
							color: '#F57C00',
							border: 'none',
						}}
					/>
					<Chip
						label={`Style: ${deriveStyle()}`}
						size="small"
						sx={{
							height: 20,
							fontSize: '10px',
							fontWeight: 500,
							backgroundColor: '#F3E5F5',
							color: '#7B1FA2',
							border: 'none',
						}}
					/>
				</Stack>

				{/* CTA Button */}
				<Button
					variant="contained"
					fullWidth
					sx={{
						backgroundColor: '#212121',
						color: '#FFFFFF',
						fontWeight: 600,
						textTransform: 'none',
						fontSize: '13px',
						py: 0.75,
						'&:hover': {
							backgroundColor: '#424242',
						},
					}}
					onClick={(e) => {
						e.preventDefault();
						window.location.href = `/trainer/${trainer._id}`;
					}}
				>
					View Trainer
				</Button>
			</Link>
		</Box>
	);
};

export default TrainerCardCompact;

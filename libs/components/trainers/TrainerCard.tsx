import React from 'react';
import { Card, CardContent, CardMedia, Typography, Rating, Chip, Stack, Box, Avatar } from '@mui/material';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';
import Link from 'next/link';

interface TrainerCardProps {
	trainer: Member;
	onClick?: (trainer: Member) => void;
}

const TrainerCard: React.FC<TrainerCardProps> = ({ trainer, onClick }) => {
	const imageUrl = trainer.memberImage ? `${REACT_APP_API_URL}/${trainer.memberImage}` : '/img/profile/defaultUser.svg';
	const name = trainer.memberFullName || trainer.memberNick || 'Trainer';
	const rating = trainer.trainerRating || (trainer.memberRank ? trainer.memberRank / 10 : 0);
	const experience = trainer.trainerExperience || 0;
	const specialties = trainer.trainerSpecialties || [];
	const bio = trainer.trainerBio || trainer.memberDesc || '';

	const handleClick = () => {
		if (onClick) {
			onClick(trainer);
		}
	};

	return (
		<Card
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				borderRadius: 2,
				border: '1px solid #E5E5E5',
				backgroundColor: '#FFFFFF',
				transition: 'all 0.3s ease',
				cursor: 'pointer',
				'&:hover': {
					borderColor: '#E10600',
					boxShadow: '0 8px 24px rgba(225, 6, 0, 0.12)',
					transform: 'translateY(-4px)',
				},
			}}
			onClick={handleClick}
		>
			{/* Image */}
			<CardMedia
				component="div"
				sx={{
					height: 180,
					backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)), url(${imageUrl})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					position: 'relative',
				}}
			>
				{/* Rating Badge */}
				<Box sx={{ position: 'absolute', top: 12, right: 12 }}>
					<Chip
						label={`${rating.toFixed(1)} ⭐`}
						size="small"
						sx={{
							backgroundColor: 'rgba(255, 255, 255, 0.95)',
							color: '#E10600',
							fontWeight: 600,
							fontSize: '11px',
							height: 24,
						}}
					/>
				</Box>
			</CardMedia>

			<CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
				{/* Header */}
				<Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
					<Avatar
						src={imageUrl}
						sx={{
							width: 48,
							height: 48,
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
								fontSize: '16px',
								fontWeight: 700,
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
							{experience > 0 && (
								<Typography variant="body2" sx={{ fontSize: '12px', color: '#757575' }}>
									{experience}yr exp
								</Typography>
							)}
						</Stack>
					</Box>
				</Stack>

				{/* Specialties */}
				{specialties.length > 0 && (
					<Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mb: 1.5 }}>
						{specialties.slice(0, 3).map((specialty: string, idx: number) => (
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
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							flex: 1,
						}}
					>
						{bio}
					</Typography>
				)}

				{/* Stats */}
				<Stack direction="row" spacing={2} sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid #F5F5F5' }}>
					<Box>
						<Typography variant="caption" sx={{ fontSize: '10px', color: '#9E9E9E', display: 'block' }}>
							Workouts
						</Typography>
						<Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 600, color: '#212121' }}>
							{trainer.memberWorkouts || 0}
						</Typography>
					</Box>
					<Box>
						<Typography variant="caption" sx={{ fontSize: '10px', color: '#9E9E9E', display: 'block' }}>
							Followers
						</Typography>
						<Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 600, color: '#212121' }}>
							{trainer.memberFollowers || 0}
						</Typography>
					</Box>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default TrainerCard;








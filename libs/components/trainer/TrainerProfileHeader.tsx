import React, { useState } from 'react';
import { Box, Typography, Avatar, Rating, Button, Stack, Chip, Collapse, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Member } from '../../../libs/types/member/member';
import { REACT_APP_API_URL } from '../../../libs/config';
import { useMutation } from '@apollo/client';
import { SUBSCRIBE, UNSUBSCRIBE, LIKE_TARGET_MEMBER } from '../../../apollo/user/mutation';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { sweetTopSmallSuccessAlert, sweetErrorHandling } from '../../../libs/sweetAlert';

interface TrainerProfileHeaderProps {
	trainer: Member;
	onBookSession?: () => void;
	onMessage?: () => void;
	onRefetch?: () => void;
}

const TrainerProfileHeader: React.FC<TrainerProfileHeaderProps> = ({ trainer, onBookSession, onMessage, onRefetch }) => {
	const user = useReactiveVar(userVar);
	const [showCertifications, setShowCertifications] = useState(false);
	const [showFullBio, setShowFullBio] = useState(false);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const imageUrl = trainer.memberImage ? `${REACT_APP_API_URL}/${trainer.memberImage}` : undefined;
	const name = trainer.memberFullName || trainer.memberNick || 'Trainer';
	const rating = trainer.trainerRating || (trainer.memberRank ? trainer.memberRank / 10 : 0);
	const reviews = trainer.memberLikes || 0;
	const specialties = trainer.trainerSpecialties || [];
	const certifications = trainer.trainerCertifications || [];
	const experience = trainer.trainerExperience || 0;
	const bio = trainer.trainerBio || trainer.memberDesc || '';

	const isFollowing = trainer.meFollowed && trainer.meFollowed[0]?.myFollowing;
	const isLiked = trainer.meLiked && trainer.meLiked[0]?.myFavorite;

	const handleFollow = async () => {
		try {
			if (!trainer._id) return;
			if (!user._id) {
				sweetErrorHandling({ message: 'Please login to follow trainers' });
				return;
			}

			if (isFollowing) {
				await unsubscribe({ variables: { input: trainer._id } });
				await sweetTopSmallSuccessAlert('Unfollowed!', 800);
			} else {
				await subscribe({ variables: { input: trainer._id } });
				await sweetTopSmallSuccessAlert('Followed!', 800);
			}
			onRefetch?.();
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const handleLike = async () => {
		try {
			if (!trainer._id) return;
			if (!user._id) {
				sweetErrorHandling({ message: 'Please login to like trainers' });
				return;
			}

			await likeTargetMember({ variables: { memberId: trainer._id } });
			await sweetTopSmallSuccessAlert('Success!', 800);
			onRefetch?.();
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	return (
		<Box
			className="trainer-profile-header"
			sx={{
				padding: 3,
				backgroundColor: '#FFFFFF',
				borderRadius: 2,
				border: '1px solid #E5E5E5',
				marginBottom: 3,
			}}
		>
			{/* Top Row: Avatar + Name + Actions */}
			<Stack direction="row" spacing={3} sx={{ mb: 2 }}>
				{/* Left: Avatar + Name + Rating */}
				<Stack direction="row" spacing={2} sx={{ flex: 1 }}>
					<Avatar
						src={imageUrl}
						sx={{
							width: 100,
							height: 100,
							border: '3px solid #F5F5F5',
							flexShrink: 0,
						}}
					>
						{name.charAt(0).toUpperCase()}
					</Avatar>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography
							variant="h4"
							sx={{
								fontSize: '28px',
								fontWeight: 700,
								color: '#212121',
								marginBottom: 1,
							}}
						>
							{name}
						</Typography>
						<Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
							<Rating value={rating} readOnly precision={0.5} size="small" />
							<Typography variant="body2" sx={{ fontSize: '14px', color: '#757575' }}>
								{rating.toFixed(1)} ({reviews} reviews)
							</Typography>
							{experience > 0 && (
								<Typography variant="body2" sx={{ fontSize: '14px', color: '#757575' }}>
									• {experience} years experience
								</Typography>
							)}
						</Stack>
					</Box>
				</Stack>

				{/* Right: Follow + Like Actions */}
				<Stack direction="row" spacing={1.5}>
					<Button
						variant={isFollowing ? 'outlined' : 'contained'}
						startIcon={isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
						onClick={handleFollow}
						sx={{
							backgroundColor: isFollowing ? 'transparent' : '#212121',
							color: isFollowing ? '#212121' : '#FFFFFF',
							borderColor: '#E5E5E5',
							fontWeight: 600,
							textTransform: 'none',
							px: 2.5,
							'&:hover': {
								backgroundColor: isFollowing ? '#FAFAFA' : '#424242',
								borderColor: isFollowing ? '#212121' : undefined,
							},
						}}
					>
						{isFollowing ? 'Unfollow' : 'Follow'}
					</Button>
					<IconButton
						onClick={handleLike}
						sx={{
							border: '1px solid #E5E5E5',
							color: isLiked ? '#f17742' : '#616161',
							'&:hover': {
								backgroundColor: '#FAFAFA',
								borderColor: '#212121',
							},
						}}
					>
						{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
					</IconButton>
				</Stack>
			</Stack>

			{/* Specialties Chips */}
			{specialties.length > 0 && (
				<Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
					{specialties.map((specialty: string, idx: number) => (
						<Chip
							key={idx}
							label={specialty}
							size="small"
							sx={{
								height: 28,
								fontSize: '12px',
								fontWeight: 500,
								backgroundColor: '#F5F5F5',
								color: '#616161',
								border: 'none',
							}}
						/>
					))}
				</Stack>
			)}

			{/* Certifications (Collapsible) */}
			{certifications.length > 0 && (
				<Box sx={{ mb: 2 }}>
					<Stack
						direction="row"
						alignItems="center"
						spacing={1}
						onClick={() => setShowCertifications(!showCertifications)}
						sx={{ cursor: 'pointer', mb: 1 }}
					>
						<Typography variant="subtitle2" sx={{ fontSize: '13px', fontWeight: 600, color: '#616161' }}>
							Certifications ({certifications.length})
						</Typography>
						<IconButton size="small" sx={{ p: 0 }}>
							{showCertifications ? <ExpandLessIcon /> : <ExpandMoreIcon />}
						</IconButton>
					</Stack>
					<Collapse in={showCertifications}>
						<Stack spacing={0.5} sx={{ pl: 2 }}>
							{certifications.map((cert: string, idx: number) => (
								<Typography
									key={idx}
									variant="body2"
									sx={{
										fontSize: '13px',
										color: '#616161',
										position: 'relative',
										'&::before': {
											content: '"•"',
											position: 'absolute',
											left: -16,
											color: '#f17742',
											fontSize: '16px',
										},
									}}
								>
									{cert}
								</Typography>
							))}
						</Stack>
					</Collapse>
				</Box>
			)}

			{/* Bio Section with Read More */}
			{bio && (
				<Box>
					<Typography
						variant="body2"
						sx={{
							fontSize: '14px',
							color: '#616161',
							lineHeight: 1.7,
							mb: 1,
							display: '-webkit-box',
							WebkitLineClamp: showFullBio ? 'unset' : 3,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
						}}
					>
						{bio}
					</Typography>
					{bio.length > 150 && (
						<Button
							onClick={() => setShowFullBio(!showFullBio)}
							sx={{
								textTransform: 'none',
								color: '#f17742',
								fontSize: '13px',
								fontWeight: 500,
								padding: 0,
								minWidth: 'auto',
								'&:hover': {
									backgroundColor: 'transparent',
									textDecoration: 'underline',
								},
							}}
						>
							{showFullBio ? 'Read less' : 'Read more'}
						</Button>
					)}
				</Box>
			)}
		</Box>
	);
};

export default TrainerProfileHeader;

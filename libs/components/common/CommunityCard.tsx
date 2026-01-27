import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Card, CardContent, CardMedia, Avatar, Box, IconButton, Chip } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import { BoardArticleCategory } from '../../enums/board-article.enum';

interface CommunityCardProps {
	boardArticle: BoardArticle;
	size?: string;
	likeArticleHandler: any;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { boardArticle, size = 'normal', likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/communityImg.png';

	/** HANDLERS **/
	const chooseArticleHandler = (e: React.SyntheticEvent, boardArticle: BoardArticle) => {
		router.push(
			{
				pathname: '/community/detail',
				query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	// Get category tag info
	const getCategoryTag = (category: BoardArticleCategory) => {
		const tags: { [key: string]: { label: string; color: string } } = {
			SUCCESS_STORY: { label: 'Progress', color: '#4CAF50' },
			QUESTION: { label: 'Question', color: '#2196F3' },
			MOTIVATION: { label: 'Motivation', color: '#FF9800' },
			WORKOUT_TIPS: { label: 'Tips', color: '#9C27B0' },
		};
		return tags[category] || null;
	};

	const categoryTag = getCategoryTag(boardArticle?.articleCategory);

	if (device === 'mobile') {
		return <div>COMMUNITY CARD MOBILE</div>;
	} else {
		return (
			<Card
				elevation={0}
				sx={{
					width: '100%',
					backgroundColor: '#FFFFFF',
					borderRadius: '16px',
					border: '1px solid #E5E5E5',
					cursor: 'pointer',
					transition: 'all 0.3s ease',
					overflow: 'hidden',
					'&:hover': {
						transform: 'translateY(-2px)',
						boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
						borderColor: '#E10600',
					},
				}}
			>
				{/* Post Image (if exists) */}
				{boardArticle?.articleImage && (
					<CardMedia
						component="div"
						onClick={(e: React.SyntheticEvent<Element, Event>) => chooseArticleHandler(e, boardArticle)}
						sx={{
							height: 320,
							backgroundImage: `url(${imagePath})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							position: 'relative',
						}}
					/>
				)}

				<CardContent sx={{ padding: '24px' }}>
					<Stack spacing={2.5}>
						{/* Author Info with Time */}
						<Stack direction="row" alignItems="center" spacing={1.5}>
							<Avatar
								sx={{
									width: 40,
									height: 40,
									bgcolor: '#E10600',
									fontSize: '16px',
									fontWeight: 600,
									cursor: 'pointer',
								}}
								onClick={(e: React.SyntheticEvent) => {
									e.stopPropagation();
									goMemberPage(boardArticle?.memberData?._id as string);
								}}
								src={boardArticle?.memberData?.memberImage ? `${REACT_APP_API_URL}/${boardArticle?.memberData?.memberImage}` : undefined}
							>
								{!boardArticle?.memberData?.memberImage && (boardArticle?.memberData?.memberNick?.charAt(0)?.toUpperCase() || 'U')}
							</Avatar>
							<Stack spacing={0} sx={{ flex: 1 }}>
								<Typography
									sx={{
										fontSize: '15px',
										fontWeight: 600,
										color: '#111111',
										cursor: 'pointer',
										lineHeight: 1.2,
										'&:hover': {
											color: '#E10600',
										},
									}}
									onClick={(e: React.SyntheticEvent) => {
										e.stopPropagation();
										goMemberPage(boardArticle?.memberData?._id as string);
									}}
								>
									{boardArticle?.memberData?.memberNick || 'Anonymous'}
								</Typography>
								<Typography
									sx={{
										fontSize: '13px',
										color: '#6B6B6B',
									}}
								>
									<Moment fromNow>{boardArticle?.createdAt}</Moment>
								</Typography>
							</Stack>
							{categoryTag && (
								<Chip
									label={categoryTag.label}
									size="small"
									sx={{
										backgroundColor: `${categoryTag.color}15`,
										color: categoryTag.color,
										fontSize: '11px',
										fontWeight: 600,
										height: '24px',
									}}
								/>
							)}
						</Stack>

						{/* Post Content */}
						<Box component="div" onClick={(e: React.SyntheticEvent<Element, Event>) => chooseArticleHandler(e, boardArticle)}
							sx={{ cursor: 'pointer' }}
						>
							<Typography
								variant="h6"
								sx={{
									fontSize: '18px',
									fontWeight: 700,
									color: '#111111',
									lineHeight: 1.5,
									mb: 1.5,
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden',
								}}
							>
								{boardArticle?.articleTitle}
							</Typography>
							{boardArticle?.articleContent && (
								<Typography
									sx={{
										fontSize: '15px',
										color: '#6B6B6B',
										lineHeight: 1.6,
										display: '-webkit-box',
										WebkitLineClamp: 3,
										WebkitBoxOrient: 'vertical',
										overflow: 'hidden',
									}}
									dangerouslySetInnerHTML={{
										__html: boardArticle.articleContent.substring(0, 150) + (boardArticle.articleContent.length > 150 ? '...' : ''),
									}}
								/>
							)}
						</Box>

						{/* Actions Row */}
						<Stack direction="row" alignItems="center" spacing={1} sx={{ pt: 1, borderTop: '1px solid #F0F0F0' }}>
							<IconButton
								size="small"
								onClick={(e: React.SyntheticEvent) => {
									e.stopPropagation();
									likeArticleHandler(e, user, boardArticle?._id);
								}}
								sx={{
									color: (boardArticle as any)?.meLiked && (boardArticle as any)?.meLiked[0]?.myFavorite ? '#E10600' : '#6B6B6B',
									padding: '8px',
									'&:hover': {
										backgroundColor: 'rgba(225, 6, 0, 0.08)',
										color: '#E10600',
									},
								}}
							>
								{(boardArticle as any)?.meLiked && (boardArticle as any)?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon sx={{ fontSize: '20px' }} />
								) : (
									<FavoriteBorderIcon sx={{ fontSize: '20px' }} />
								)}
							</IconButton>
							<Typography
								sx={{
									fontSize: '14px',
									color: '#6B6B6B',
									fontWeight: 600,
									mr: 2,
								}}
							>
								{boardArticle?.articleLikes || 0}
							</Typography>

							<IconButton
								size="small"
								onClick={(e: React.SyntheticEvent) => {
									e.stopPropagation();
									chooseArticleHandler(e, boardArticle);
								}}
								sx={{
									color: '#6B6B6B',
									padding: '8px',
									'&:hover': {
										backgroundColor: 'rgba(33, 150, 243, 0.08)',
										color: '#2196F3',
									},
								}}
							>
								<ChatBubbleOutlineIcon sx={{ fontSize: '20px' }} />
							</IconButton>
							<Typography
								sx={{
									fontSize: '14px',
									color: '#6B6B6B',
									fontWeight: 600,
									mr: 2,
								}}
							>
								{boardArticle?.articleComments || 0}
							</Typography>

							<IconButton
								size="small"
								onClick={(e: React.SyntheticEvent) => {
									e.stopPropagation();
									// Share functionality would go here
								}}
								sx={{
									color: '#6B6B6B',
									padding: '8px',
									'&:hover': {
										backgroundColor: 'rgba(76, 175, 80, 0.08)',
										color: '#4CAF50',
									},
								}}
							>
								<ShareIcon sx={{ fontSize: '20px' }} />
							</IconButton>

							<Box component="div" sx={{ flex: 1 }} />

							<Stack direction="row" alignItems="center" spacing={0.5}>
								<RemoveRedEyeIcon sx={{ fontSize: '16px', color: '#6B6B6B' }} />
								<Typography
									sx={{
										fontSize: '13px',
										color: '#6B6B6B',
									}}
								>
									{boardArticle?.articleViews || 0}
								</Typography>
							</Stack>
						</Stack>
					</Stack>
				</CardContent>
			</Card>
		);
	}
};

export default CommunityCard;

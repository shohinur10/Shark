import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';

export const TrainerCardSkeleton: React.FC = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				padding: 2,
				borderRadius: 2,
				border: '1px solid #E5E5E5',
				backgroundColor: '#FFFFFF',
			}}
		>
			{/* Header Row */}
			<Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
				<Skeleton variant="circular" width={56} height={56} />
				<Box sx={{ flex: 1 }}>
					<Skeleton variant="text" width="60%" height={20} sx={{ mb: 0.5 }} />
					<Skeleton variant="text" width="40%" height={16} />
				</Box>
			</Stack>
			{/* Specialties */}
			<Stack direction="row" spacing={0.5} sx={{ mb: 1.5 }}>
				<Skeleton variant="rectangular" width={80} height={22} sx={{ borderRadius: 1 }} />
				<Skeleton variant="rectangular" width={80} height={22} sx={{ borderRadius: 1 }} />
			</Stack>
			{/* Bio */}
			<Skeleton variant="text" width="100%" height={16} sx={{ mb: 1.5 }} />
			{/* DNA Row */}
			<Stack direction="row" spacing={0.5} sx={{ mb: 1.5 }}>
				<Skeleton variant="rectangular" width={100} height={20} sx={{ borderRadius: 1 }} />
				<Skeleton variant="rectangular" width={100} height={20} sx={{ borderRadius: 1 }} />
				<Skeleton variant="rectangular" width={100} height={20} sx={{ borderRadius: 1 }} />
			</Stack>
			{/* Button */}
			<Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
		</Box>
	);
};

export const TrainerListSkeleton: React.FC = () => {
	return (
		<Stack spacing={2}>
			{[...Array(8)].map((_, idx) => (
				<TrainerCardSkeleton key={idx} />
			))}
		</Stack>
	);
};

export const TrainerProfileSkeleton: React.FC = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				gap: 3,
				padding: 3,
				backgroundColor: '#FFFFFF',
				borderRadius: 2,
				border: '1px solid #E5E5E5',
			}}
		>
			<Skeleton variant="circular" width={120} height={120} />
			<Box sx={{ flex: 1 }}>
				<Skeleton variant="text" width="40%" height={36} sx={{ mb: 1 }} />
				<Skeleton variant="text" width="30%" height={20} sx={{ mb: 2 }} />
				<Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
				<Skeleton variant="text" width="80%" height={16} sx={{ mb: 2 }} />
				<Stack direction="row" spacing={1} sx={{ mb: 2 }}>
					<Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
					<Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
				</Stack>
				<Stack direction="row" spacing={1.5}>
					<Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
					<Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
				</Stack>
			</Box>
		</Box>
	);
};


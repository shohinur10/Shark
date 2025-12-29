import React, { useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../libs/components/layout/LayoutAdmin';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Button, Stack } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_ADMIN_DASHBOARD_STATS } from '../../apollo/admin/query';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import BlockIcon from '@mui/icons-material/Block';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';

const AdminDashboard: NextPage = () => {
	const [refreshing, setRefreshing] = useState(false);

	const { loading, data, error, refetch } = useQuery(GET_ADMIN_DASHBOARD_STATS, {
		fetchPolicy: 'network-only',
		onCompleted: () => {
			setRefreshing(false);
		},
		onError: () => {
			setRefreshing(false);
		},
	});

	const handleRefresh = async () => {
		setRefreshing(true);
		await refetch();
	};

	const stats = data?.getAdminDashboardStats;

	const StatCard = ({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color?: string }) => (
		<Card sx={{ height: '100%', boxShadow: 'rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px', borderRadius: '4px' }}>
			<CardContent sx={{ p: 3 }}>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Box>
						<Typography color="#757575" gutterBottom variant="body2" sx={{ fontSize: '14px', fontWeight: 400 }}>
							{title}
						</Typography>
						<Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontSize: '32px', color: '#212121', mt: 1 }}>
							{typeof value === 'number' ? value.toLocaleString() : value}
						</Typography>
					</Box>
					<Box sx={{ color: color || '#e92c28' }}>{icon}</Box>
				</Stack>
			</CardContent>
		</Card>
	);

	if (loading && !stats) {
		return (
			<Box component={'div'} className={'content'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box component={'div'} className={'content'} sx={{ p: 3 }}>
				<Typography color="error">Error loading dashboard stats: {error.message}</Typography>
				<Button onClick={handleRefresh} startIcon={<RefreshIcon />} sx={{ mt: 2 }}>
					Retry
				</Button>
			</Box>
		);
	}

	return (
		<Box component={'div'} className={'content'}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
				<Typography variant={'h2'} className={'tit'}>
					Admin Dashboard
				</Typography>
				<Button
					onClick={handleRefresh}
					startIcon={<RefreshIcon />}
					disabled={refreshing || loading}
					variant="outlined"
					sx={{
						borderColor: '#e92c28',
						color: '#e92c28',
						'&:hover': {
							borderColor: '#e92c28',
							backgroundColor: 'rgba(233, 44, 40, 0.04)',
						},
					}}
				>
					Refresh
				</Button>
			</Stack>

			{/* User Statistics */}
			<Typography variant="h6" sx={{ mb: 2, mt: 4, fontSize: '18px', fontWeight: 600, color: '#212121' }}>
				User Statistics
			</Typography>
			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Members"
						value={stats?.totalMembers || 0}
						icon={<PeopleIcon sx={{ fontSize: 48, color: '#1976d2' }} />}
						color="#1976d2"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Trainers"
						value={stats?.totalTrainers || 0}
						icon={<FitnessCenterIcon sx={{ fontSize: 48, color: '#2e7d32' }} />}
						color="#2e7d32"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Users"
						value={stats?.totalUsers || 0}
						icon={<PersonIcon sx={{ fontSize: 48, color: '#ed6c02' }} />}
						color="#ed6c02"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Admins"
						value={stats?.totalAdmins || 0}
						icon={<AdminPanelSettingsIcon sx={{ fontSize: 48, color: '#9c27b0' }} />}
						color="#9c27b0"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Active Members"
						value={stats?.activeMembers || 0}
						icon={<PersonIcon sx={{ fontSize: 48, color: '#2e7d32' }} />}
						color="#2e7d32"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Blocked Members"
						value={stats?.blockedMembers || 0}
						icon={<BlockIcon sx={{ fontSize: 48, color: '#d32f2f' }} />}
						color="#d32f2f"
					/>
				</Grid>
			</Grid>

			{/* Revenue & Bookings */}
			<Typography variant="h6" sx={{ mb: 2, fontSize: '18px', fontWeight: 600, color: '#212121' }}>
				Revenue & Bookings
			</Typography>
			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Revenue"
						value={`$${((stats?.totalRevenue || 0) / 100).toFixed(2)}`}
						icon={<AttachMoneyIcon sx={{ fontSize: 48, color: '#2e7d32' }} />}
						color="#2e7d32"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Bookings"
						value={stats?.totalBookings || 0}
						icon={<BookOnlineIcon sx={{ fontSize: 48, color: '#1976d2' }} />}
						color="#1976d2"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Pending Bookings"
						value={stats?.pendingBookings || 0}
						icon={<BookOnlineIcon sx={{ fontSize: 48, color: '#ed6c02' }} />}
						color="#ed6c02"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Confirmed Bookings"
						value={stats?.confirmedBookings || 0}
						icon={<BookOnlineIcon sx={{ fontSize: 48, color: '#2e7d32' }} />}
						color="#2e7d32"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Completed Bookings"
						value={stats?.completedBookings || 0}
						icon={<BookOnlineIcon sx={{ fontSize: 48, color: '#1976d2' }} />}
						color="#1976d2"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Cancelled Bookings"
						value={stats?.cancelledBookings || 0}
						icon={<BookOnlineIcon sx={{ fontSize: 48, color: '#d32f2f' }} />}
						color="#d32f2f"
					/>
				</Grid>
			</Grid>

			{/* Reviews & Engagement */}
			<Typography variant="h6" sx={{ mb: 2, fontSize: '18px', fontWeight: 600, color: '#212121' }}>
				Reviews & Engagement
			</Typography>
			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Reviews"
						value={stats?.totalReviews || 0}
						icon={<RateReviewIcon sx={{ fontSize: 48, color: '#1976d2' }} />}
						color="#1976d2"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Pending Reviews"
						value={stats?.pendingReviews || 0}
						icon={<RateReviewIcon sx={{ fontSize: 48, color: '#ed6c02' }} />}
						color="#ed6c02"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Likes"
						value={stats?.totalLikes || 0}
						icon={<ThumbUpIcon sx={{ fontSize: 48, color: '#2e7d32' }} />}
						color="#2e7d32"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Views"
						value={stats?.totalViews || 0}
						icon={<VisibilityIcon sx={{ fontSize: 48, color: '#9c27b0' }} />}
						color="#9c27b0"
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<StatCard
						title="Total Comments"
						value={stats?.totalComments || 0}
						icon={<CommentIcon sx={{ fontSize: 48, color: '#ed6c02' }} />}
						color="#ed6c02"
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default withAdminLayout(AdminDashboard);

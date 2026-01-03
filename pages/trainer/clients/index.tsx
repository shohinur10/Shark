import React, { useEffect, useState, ChangeEvent } from 'react';
import { NextPage } from 'next';
import {
	Stack,
	Box,
	Typography,
	Button,
	Grid,
	Card,
	CardContent,
	TextField,
	InputAdornment,
	Avatar,
	Chip,
	Pagination,
	CircularProgress,
	Tabs,
	Tab,
} from '@mui/material';
import useDeviceDetect from '../../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_TRAINER_CLIENTS, GET_USER_ASSIGNED_ROUTINES } from '../../../apollo/user/query';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { Direction } from '../../../libs/types/enums/common.enum';
import { AssignmentStatus } from '../../../libs/types/routine-assignment/routine-assignment';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TrainerClients: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const trainerId = user?._id;
	const [searchText, setSearchText] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
	const limit = 12;

	// Fetch clients
	const { data: clientsData, loading: clientsLoading, refetch: refetchClients } = useQuery(GET_TRAINER_CLIENTS, {
		skip: !trainerId,
		variables: {
			input: {
				page: currentPage,
				limit: limit,
				trainerId: trainerId,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: searchText ? { text: searchText } : undefined,
			},
		},
	});

	// Fetch assignments for each client to show active count
	const { data: assignmentsData } = useQuery(GET_USER_ASSIGNED_ROUTINES, {
		skip: !trainerId,
		variables: {
			input: {
				page: 1,
				limit: 1000,
				trainerId: trainerId,
			},
		},
	});

	const clients = clientsData?.getTrainerClients?.list || [];
	const totalClients = clientsData?.getTrainerClients?.metaCounter[0]?.total || 0;

	// Get active assignments count per client
	const getActiveAssignmentsCount = (userId: string) => {
		if (!assignmentsData?.getUserAssignedRoutines?.list) return 0;
		return assignmentsData.getUserAssignedRoutines.list.filter(
			(assignment: any) =>
				assignment.userId === userId &&
				(assignment.status === AssignmentStatus.ASSIGNED || assignment.status === AssignmentStatus.IN_PROGRESS)
		).length;
	};

	const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setCurrentPage(1);
			refetchClients();
		}
	};

	const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
		setCurrentPage(value);
	};

	const handleStatusFilter = (event: React.SyntheticEvent, newValue: 'all' | 'active' | 'completed') => {
		setFilterStatus(newValue);
		setCurrentPage(1);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'trainer-clients-page'}>
				<Stack className={'container'}>
					<Typography variant="h4">My Clients</Typography>
					<div>MOBILE CLIENTS PAGE</div>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'trainer-clients-page'}>
			<Stack className={'container'}>
				{/* Page Header */}
				<Stack className={'page-header'} sx={{ mb: 4 }}>
					<Typography variant="h3" className={'page-title'}>
						My Clients
					</Typography>
					<Typography variant="body1" className={'page-subtitle'}>
						Manage and track your clients' progress
					</Typography>
				</Stack>

				{/* Filters and Search */}
				<Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center" justifyContent="space-between">
					<TextField
						placeholder="Search clients by name"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={handleSearch}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
						sx={{ flexGrow: 1, maxWidth: 400 }}
					/>
					<Tabs value={filterStatus} onChange={handleStatusFilter}>
						<Tab label="All" value="all" />
						<Tab label="Active" value="active" />
						<Tab label="Completed" value="completed" />
					</Tabs>
				</Stack>

				{/* Clients Grid */}
				{clientsLoading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
						<CircularProgress />
					</Box>
				) : clients.length === 0 ? (
					<Card>
						<CardContent>
							<Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
								<PersonIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
								<Typography variant="h6" color="text.secondary">
									No clients found
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{searchText ? 'Try adjusting your search' : 'You don\'t have any clients yet'}
								</Typography>
							</Stack>
						</CardContent>
					</Card>
				) : (
					<>
						<Grid container spacing={3} sx={{ mb: 4 }}>
							{clients.map((client: any) => {
								const activeAssignments = getActiveAssignmentsCount(client._id);
								const shouldShow =
									filterStatus === 'all' ||
									(filterStatus === 'active' && activeAssignments > 0) ||
									(filterStatus === 'completed' && activeAssignments === 0);

								if (!shouldShow) return null;

								return (
									<Grid item xs={12} sm={6} md={4} lg={3} key={client._id}>
										<Card
											sx={{
												cursor: 'pointer',
												transition: 'transform 0.2s, box-shadow 0.2s',
												'&:hover': {
													transform: 'translateY(-4px)',
													boxShadow: 4,
												},
											}}
											onClick={() => router.push(`/trainer/clients/${client._id}/progress`)}
										>
											<CardContent>
												<Stack spacing={2}>
													<Stack direction="row" spacing={2} alignItems="center">
														<Avatar
															src={client.memberImage}
															alt={client.memberFullName || client.memberNick}
															sx={{ width: 64, height: 64 }}
														>
															{client.memberFullName?.[0] || client.memberNick?.[0] || 'C'}
														</Avatar>
														<Box sx={{ flexGrow: 1 }}>
															<Typography variant="h6" noWrap>
																{client.memberFullName || client.memberNick || 'Unknown'}
															</Typography>
															<Typography variant="body2" color="text.secondary">
																{client.memberPoints || 0} points
															</Typography>
														</Box>
													</Stack>
													<Stack direction="row" spacing={1} flexWrap="wrap">
														<Chip
															label={`${activeAssignments} Active`}
															color={activeAssignments > 0 ? 'primary' : 'default'}
															size="small"
														/>
													</Stack>
													<Button
														variant="outlined"
														fullWidth
														onClick={(e) => {
															e.stopPropagation();
															router.push(`/trainer/clients/${client._id}/progress`);
														}}
													>
														View Progress
													</Button>
												</Stack>
											</CardContent>
										</Card>
									</Grid>
								);
							})}
						</Grid>

						{/* Pagination */}
						{Math.ceil(totalClients / limit) > 1 && (
							<Stack alignItems="center" sx={{ mt: 4 }}>
								<Pagination
									count={Math.ceil(totalClients / limit)}
									page={currentPage}
									onChange={handlePageChange}
									color="primary"
									size="large"
								/>
							</Stack>
						)}
					</>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(TrainerClients);


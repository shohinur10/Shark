import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, InputAdornment, Stack, Card, CardContent, Grid, Chip } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FaqArticlesPanelList } from '../../../libs/components/admin/cs/FaqList';
import { FaqsInquiry } from '../../../libs/types/faq/faq.input';
import { Faq } from '../../../libs/types/faq/faq';
import { FaqStatus } from '../../../libs/enums/faq.enum';
import { sweetErrorHandling, sweetConfirmAlert } from '../../../libs/sweetAlert';
import { FaqUpdate } from '../../../libs/types/faq/faq.update';
import { UPDATE_FAQ_BY_ADMIN, REMOVE_FAQ_BY_ADMIN } from '../../../apollo/admin/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_FAQS_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';

const FaqArticles: NextPage = ({ initialInquiry, ...props }: any) => {
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [faqsInquiry, setFaqsInquiry] = useState<FaqsInquiry>(initialInquiry);
	const [faqs, setFaqs] = useState<Faq[]>([]);
	const [faqsTotal, setFaqsTotal] = useState<number>(0);
	const [value, setValue] = useState(
		faqsInquiry?.search?.faqStatus ? faqsInquiry?.search?.faqStatus : 'ALL',
	);
	const [searchText, setSearchText] = useState('');

	/** APOLLO REQUESTS **/
	const [updateFaqByAdmin] = useMutation(UPDATE_FAQ_BY_ADMIN);
	const [removeFaqByAdmin] = useMutation(REMOVE_FAQ_BY_ADMIN);
	const {
		loading: getAllFaqsByAdminLoading,
		data: getAllFaqsByAdminData,
		error: getAllFaqsByAdminError,
		refetch: getAllFaqsByAdminRefetch,
	} = useQuery(GET_ALL_FAQS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: faqsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFaqs(data?.getAllFaqsByAdmin?.list || []);
			setFaqsTotal(data?.getAllFaqsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllFaqsByAdminRefetch({ input: faqsInquiry }).then();
	}, [faqsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		faqsInquiry.page = newPage + 1;
		setFaqsInquiry({ ...faqsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		faqsInquiry.limit = parseInt(event.target.value, 10);
		faqsInquiry.page = 1;
		setFaqsInquiry({ ...faqsInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		setSearchText('');

		setFaqsInquiry({ ...faqsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setFaqsInquiry({ ...faqsInquiry, search: { faqStatus: FaqStatus.ACTIVE } });
				break;
			case 'INACTIVE':
				setFaqsInquiry({ ...faqsInquiry, search: { faqStatus: FaqStatus.INACTIVE } });
				break;
			case 'DELETED':
				setFaqsInquiry({ ...faqsInquiry, search: { faqStatus: FaqStatus.DELETED } });
				break;
			default:
				delete faqsInquiry?.search?.faqStatus;
				setFaqsInquiry({ ...faqsInquiry });
				break;
		}
	};

	const updateFaqHandler = async (updateData: FaqUpdate) => {
		try {
			await updateFaqByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			await getAllFaqsByAdminRefetch({ input: faqsInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const removeFaqHandler = async (faqId: string) => {
		try {
			const confirm = await sweetConfirmAlert('Are you sure you want to delete this FAQ?');
			if (confirm) {
				await removeFaqByAdmin({
					variables: {
						input: faqId,
					},
				});
				await getAllFaqsByAdminRefetch({ input: faqsInquiry });
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const textHandler = useCallback((value: string) => {
		try {
			setSearchText(value);
		} catch (err: any) {
			console.log('textHandler: ', err.message);
		}
	}, []);

	const searchTextHandler = () => {
		try {
			setFaqsInquiry({
				...faqsInquiry,
				search: {
					...faqsInquiry.search,
					text: searchText,
				},
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const getStatusCount = (status: string) => {
		if (status === 'ALL') return faqsTotal;
		return faqs.filter((faq) => faq.faqStatus === status).length;
	};

	const activeCount = faqs.filter((faq) => faq.faqStatus === FaqStatus.ACTIVE).length;
	const inactiveCount = faqs.filter((faq) => faq.faqStatus === FaqStatus.INACTIVE).length;
	const deletedCount = faqs.filter((faq) => faq.faqStatus === FaqStatus.DELETED).length;
	const totalViews = faqs.reduce((sum, faq) => sum + (faq.viewCount || 0), 0);

	return (
		<Box component={'div'} className={'content'}>
			{/* Statistics Cards */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6} md={3}>
					<Card 
						sx={{ 
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							color: 'white',
							borderRadius: '16px',
							boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
							transition: 'transform 0.3s ease, box-shadow 0.3s ease',
							'&:hover': {
								transform: 'translateY(-4px)',
								boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
							}
						}}
					>
						<CardContent>
							<Stack direction="row" alignItems="center" justifyContent="space-between">
								<Box>
									<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
										{faqsTotal}
									</Typography>
									<Typography variant="body2" sx={{ opacity: 0.9 }}>
										Total FAQs
									</Typography>
								</Box>
								<HelpOutlineIcon sx={{ fontSize: 48, opacity: 0.8 }} />
							</Stack>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card 
						sx={{ 
							background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
							color: 'white',
							borderRadius: '16px',
							boxShadow: '0 8px 16px rgba(245, 87, 108, 0.3)',
							transition: 'transform 0.3s ease, box-shadow 0.3s ease',
							'&:hover': {
								transform: 'translateY(-4px)',
								boxShadow: '0 12px 24px rgba(245, 87, 108, 0.4)',
							}
						}}
					>
						<CardContent>
							<Stack direction="row" alignItems="center" justifyContent="space-between">
								<Box>
									<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
										{activeCount}
									</Typography>
									<Typography variant="body2" sx={{ opacity: 0.9 }}>
										Active FAQs
									</Typography>
								</Box>
								<CheckCircleOutlineIcon sx={{ fontSize: 48, opacity: 0.8 }} />
							</Stack>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card 
						sx={{ 
							background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
							color: 'white',
							borderRadius: '16px',
							boxShadow: '0 8px 16px rgba(79, 172, 254, 0.3)',
							transition: 'transform 0.3s ease, box-shadow 0.3s ease',
							'&:hover': {
								transform: 'translateY(-4px)',
								boxShadow: '0 12px 24px rgba(79, 172, 254, 0.4)',
							}
						}}
					>
						<CardContent>
							<Stack direction="row" alignItems="center" justifyContent="space-between">
								<Box>
									<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
										{totalViews}
									</Typography>
									<Typography variant="body2" sx={{ opacity: 0.9 }}>
										Total Views
									</Typography>
								</Box>
								<VisibilityIcon sx={{ fontSize: 48, opacity: 0.8 }} />
							</Stack>
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card 
						sx={{ 
							background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
							color: 'white',
							borderRadius: '16px',
							boxShadow: '0 8px 16px rgba(250, 112, 154, 0.3)',
							transition: 'transform 0.3s ease, box-shadow 0.3s ease',
							'&:hover': {
								transform: 'translateY(-4px)',
								boxShadow: '0 12px 24px rgba(250, 112, 154, 0.4)',
							}
						}}
					>
						<CardContent>
							<Stack direction="row" alignItems="center" justifyContent="space-between">
								<Box>
									<Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
										{inactiveCount}
									</Typography>
									<Typography variant="body2" sx={{ opacity: 0.9 }}>
										Inactive FAQs
									</Typography>
								</Box>
								<BlockIcon sx={{ fontSize: 48, opacity: 0.8 }} />
							</Stack>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{/* Header Section */}
			<Box component={'div'} className={'title flex_space'} sx={{ mb: 3 }}>
				<Box>
					<Typography 
						variant={'h2'} 
						sx={{ 
							fontWeight: 700, 
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							mb: 1
						}}
					>
						FAQ Management
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Manage and organize frequently asked questions
					</Typography>
				</Box>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'large'}
					onClick={() => router.push(`/_admin/cs/faq_create`)}
					sx={{
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
						borderRadius: '12px',
						px: 3,
						py: 1.5,
						fontWeight: 600,
						textTransform: 'none',
						'&:hover': {
							background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
							boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
							transform: 'translateY(-2px)',
						},
						transition: 'all 0.3s ease'
					}}
				>
					<AddRoundedIcon sx={{ mr: 1 }} />
					Add New FAQ
				</Button>
			</Box>
			<Card 
				className={'table-wrap'}
				sx={{ 
					borderRadius: '16px',
					boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
					overflow: 'hidden',
					background: '#fff'
				}}
			>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List 
								className={'tab-menu'}
								sx={{
									background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
									padding: '8px 24px',
									borderBottom: '2px solid #f0f0f0'
								}}
							>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
									sx={{
										mr: 2,
										borderRadius: '8px 8px 0 0',
										transition: 'all 0.3s ease',
										'&:hover': {
											background: value === 'ALL' ? 'transparent' : 'rgba(102, 126, 234, 0.05)',
										}
									}}
								>
									<Chip 
										label={`All (${getStatusCount('ALL')})`}
										variant={value === 'ALL' ? 'filled' : 'outlined'}
										sx={{
											background: value === 'ALL' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
											color: value === 'ALL' ? 'white' : 'inherit',
											fontWeight: value === 'ALL' ? 600 : 400,
											border: value === 'ALL' ? 'none' : '1px solid #e0e0e0',
										}}
									/>
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
									sx={{
										mr: 2,
										borderRadius: '8px 8px 0 0',
										transition: 'all 0.3s ease',
										'&:hover': {
											background: value === 'ACTIVE' ? 'transparent' : 'rgba(34, 154, 22, 0.05)',
										}
									}}
								>
									<Chip 
										label={`Active (${getStatusCount('ACTIVE')})`}
										variant={value === 'ACTIVE' ? 'filled' : 'outlined'}
										sx={{
											background: value === 'ACTIVE' ? '#229a16' : 'transparent',
											color: value === 'ACTIVE' ? 'white' : 'inherit',
											fontWeight: value === 'ACTIVE' ? 600 : 400,
											border: value === 'ACTIVE' ? 'none' : '1px solid #e0e0e0',
										}}
									/>
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'INACTIVE')}
									value="INACTIVE"
									className={value === 'INACTIVE' ? 'li on' : 'li'}
									sx={{
										mr: 2,
										borderRadius: '8px 8px 0 0',
										transition: 'all 0.3s ease',
										'&:hover': {
											background: value === 'INACTIVE' ? 'transparent' : 'rgba(245, 124, 0, 0.05)',
										}
									}}
								>
									<Chip 
										label={`Inactive (${getStatusCount('INACTIVE')})`}
										variant={value === 'INACTIVE' ? 'filled' : 'outlined'}
										sx={{
											background: value === 'INACTIVE' ? '#f57c00' : 'transparent',
											color: value === 'INACTIVE' ? 'white' : 'inherit',
											fontWeight: value === 'INACTIVE' ? 600 : 400,
											border: value === 'INACTIVE' ? 'none' : '1px solid #e0e0e0',
										}}
									/>
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'DELETED')}
									value="DELETED"
									className={value === 'DELETED' ? 'li on' : 'li'}
									sx={{
										mr: 2,
										borderRadius: '8px 8px 0 0',
										transition: 'all 0.3s ease',
										'&:hover': {
											background: value === 'DELETED' ? 'transparent' : 'rgba(183, 33, 54, 0.05)',
										}
									}}
								>
									<Chip 
										label={`Deleted (${getStatusCount('DELETED')})`}
										variant={value === 'DELETED' ? 'filled' : 'outlined'}
										sx={{
											background: value === 'DELETED' ? '#B72136' : 'transparent',
											color: value === 'DELETED' ? 'white' : 'inherit',
											fontWeight: value === 'DELETED' ? 600 : 400,
											border: value === 'DELETED' ? 'none' : '1px solid #e0e0e0',
										}}
									/>
								</ListItem>
							</List>
							<Stack 
								className={'search-area'} 
								sx={{ 
									m: '24px',
									background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
									padding: '20px',
									borderRadius: '12px',
									border: '1px solid #e0e0e0'
								}}
							>
								<OutlinedInput
									value={searchText}
									onChange={(e: any) => textHandler(e.target.value)}
									sx={{ 
										width: '100%',
										background: 'white',
										borderRadius: '12px',
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: '#e0e0e0',
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: '#667eea',
										},
										'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
											borderColor: '#667eea',
											borderWidth: '2px',
										},
									}}
									className={'search'}
									placeholder="Search FAQ question or answer..."
									onKeyDown={(event) => {
										if (event.key == 'Enter') searchTextHandler();
									}}
									endAdornment={
										<>
											{searchText && (
												<CancelRoundedIcon
													sx={{ 
														cursor: 'pointer', 
														mr: 1,
														color: '#999',
														'&:hover': { color: '#667eea' }
													}}
													onClick={async () => {
														setSearchText('');
														setFaqsInquiry({
															...faqsInquiry,
															search: {
																...faqsInquiry.search,
																text: '',
															},
														});
														await getAllFaqsByAdminRefetch({ input: faqsInquiry });
													}}
												/>
											)}
											<InputAdornment 
												position="end" 
												onClick={() => searchTextHandler()}
												sx={{ cursor: 'pointer' }}
											>
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
						</Box>
						<FaqArticlesPanelList
							faqs={faqs}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateFaqHandler={updateFaqHandler}
							deleteFaqHandler={removeFaqHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={faqsTotal}
							rowsPerPage={faqsInquiry?.limit}
							page={faqsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Card>
		</Box>
	);
};

FaqArticles.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

export default withAdminLayout(FaqArticles);

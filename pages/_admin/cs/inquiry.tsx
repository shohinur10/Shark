import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, InputAdornment, Stack } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { InquiryList } from '../../../libs/components/admin/cs/InquiryList';
import { InquiriesInquiry } from '../../../libs/types/inquiry/inquiry.input';
import { Inquiry } from '../../../libs/types/inquiry/inquiry';
import { InquiryStatus } from '../../../libs/enums/inquiry.enum';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { InquiryUpdate } from '../../../libs/types/inquiry/inquiry.update';
import { UPDATE_INQUIRY_BY_ADMIN } from '../../../apollo/admin/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_INQUIRIES_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';

const InquiryArticles: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [inquiriesInquiry, setInquiriesInquiry] = useState<InquiriesInquiry>(initialInquiry);
	const [inquiries, setInquiries] = useState<Inquiry[]>([]);
	const [inquiriesTotal, setInquiriesTotal] = useState<number>(0);
	const [value, setValue] = useState(
		inquiriesInquiry?.search?.inquiryStatus ? inquiriesInquiry?.search?.inquiryStatus : 'ALL',
	);
	const [searchText, setSearchText] = useState('');

	/** APOLLO REQUESTS **/
	const [updateInquiryByAdmin] = useMutation(UPDATE_INQUIRY_BY_ADMIN);
	const {
		loading: getAllInquiriesByAdminLoading,
		data: getAllInquiriesByAdminData,
		error: getAllInquiriesByAdminError,
		refetch: getAllInquiriesByAdminRefetch,
	} = useQuery(GET_ALL_INQUIRIES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: inquiriesInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setInquiries(data?.getAllInquiriesByAdmin?.list || []);
			setInquiriesTotal(data?.getAllInquiriesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllInquiriesByAdminRefetch({ input: inquiriesInquiry }).then();
	}, [inquiriesInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		inquiriesInquiry.page = newPage + 1;
		setInquiriesInquiry({ ...inquiriesInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		inquiriesInquiry.limit = parseInt(event.target.value, 10);
		inquiriesInquiry.page = 1;
		setInquiriesInquiry({ ...inquiriesInquiry });
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

		setInquiriesInquiry({ ...inquiriesInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'PENDING':
				setInquiriesInquiry({ ...inquiriesInquiry, search: { inquiryStatus: InquiryStatus.PENDING } });
				break;
			case 'AI_RESPONDED':
				setInquiriesInquiry({ ...inquiriesInquiry, search: { inquiryStatus: InquiryStatus.AI_RESPONDED } });
				break;
			case 'IN_PROGRESS':
				setInquiriesInquiry({ ...inquiriesInquiry, search: { inquiryStatus: InquiryStatus.IN_PROGRESS } });
				break;
			case 'RESOLVED':
				setInquiriesInquiry({ ...inquiriesInquiry, search: { inquiryStatus: InquiryStatus.RESOLVED } });
				break;
			case 'CLOSED':
				setInquiriesInquiry({ ...inquiriesInquiry, search: { inquiryStatus: InquiryStatus.CLOSED } });
				break;
			default:
				delete inquiriesInquiry?.search?.inquiryStatus;
				setInquiriesInquiry({ ...inquiriesInquiry });
				break;
		}
	};

	const updateInquiryHandler = async (updateData: InquiryUpdate) => {
		try {
			await updateInquiryByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			await getAllInquiriesByAdminRefetch({ input: inquiriesInquiry });
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
			// Note: InquiriesInquiry doesn't have a text search field in the search object
			// This would need to be added to the backend schema if needed
			// For now, we'll just trigger a refetch
			getAllInquiriesByAdminRefetch({ input: inquiriesInquiry });
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const getStatusCount = (status: string) => {
		if (status === 'ALL') return inquiriesTotal;
		return inquiries.filter((inquiry) => inquiry.inquiryStatus === status).length;
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				1:1 Inquiry Management
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All ({getStatusCount('ALL')})
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'PENDING')}
									value="PENDING"
									className={value === 'PENDING' ? 'li on' : 'li'}
								>
									Pending ({getStatusCount('PENDING')})
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'AI_RESPONDED')}
									value="AI_RESPONDED"
									className={value === 'AI_RESPONDED' ? 'li on' : 'li'}
								>
									AI Responded ({getStatusCount('AI_RESPONDED')})
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'IN_PROGRESS')}
									value="IN_PROGRESS"
									className={value === 'IN_PROGRESS' ? 'li on' : 'li'}
								>
									In Progress ({getStatusCount('IN_PROGRESS')})
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'RESOLVED')}
									value="RESOLVED"
									className={value === 'RESOLVED' ? 'li on' : 'li'}
								>
									Resolved ({getStatusCount('RESOLVED')})
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'CLOSED')}
									value="CLOSED"
									className={value === 'CLOSED' ? 'li on' : 'li'}
								>
									Closed ({getStatusCount('CLOSED')})
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<OutlinedInput
									value={searchText}
									onChange={(e: any) => textHandler(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search inquiry subject or question"
									onKeyDown={(event) => {
										if (event.key == 'Enter') searchTextHandler();
									}}
									endAdornment={
										<>
											{searchText && (
												<CancelRoundedIcon
													style={{ cursor: 'pointer' }}
													onClick={async () => {
														setSearchText('');
														await getAllInquiriesByAdminRefetch({ input: inquiriesInquiry });
													}}
												/>
											)}
											<InputAdornment position="end" onClick={() => searchTextHandler()}>
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>
						<InquiryList
							inquiries={inquiries}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateInquiryHandler={updateInquiryHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={inquiriesTotal}
							rowsPerPage={inquiriesInquiry?.limit}
							page={inquiriesInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

InquiryArticles.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {},
	},
};

export default withAdminLayout(InquiryArticles);

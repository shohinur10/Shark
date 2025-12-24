import React from 'react';
import { useRouter } from 'next/router';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
	IconButton,
	Tooltip,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { NotePencil } from 'phosphor-react';
import { Notice } from '../../../types/notice/notice';
import { NoticeCategory, NoticeStatus } from '../../../enums/notice.enum';

interface HeadCell {
	disablePadding: boolean;
	id: string;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'category',
		numeric: false,
		disablePadding: false,
		label: 'CATEGORY',
	},
	{
		id: 'title',
		numeric: false,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
	{
		id: 'views',
		numeric: true,
		disablePadding: false,
		label: 'VIEWS',
	},
	{
		id: 'date',
		numeric: false,
		disablePadding: false,
		label: 'DATE',
	},
	{
		id: 'action',
		numeric: false,
		disablePadding: false,
		label: 'ACTION',
	},
];

function EnhancedTableHead() {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface NoticeListType {
	notices: Notice[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateNoticeHandler: any;
	deleteNoticeHandler: any;
}

export const NoticeList = (props: NoticeListType) => {
	const { notices, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateNoticeHandler, deleteNoticeHandler } = props;
	const router = useRouter();

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<EnhancedTableHead />
					<TableBody>
						{notices.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={6}>
									<span className={'no-data'}>No notices found!</span>
								</TableCell>
							</TableRow>
						)}

						{notices.length !== 0 &&
							notices.map((notice: Notice, index: number) => {
								return (
									<TableRow hover key={notice._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">
											<Button className={'badge success'}>{notice.noticeCategory}</Button>
										</TableCell>

										<TableCell align="left" sx={{ maxWidth: 300 }}>
											<Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
												{notice.noticeTitle}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
												{notice.noticeStatus}
											</Button>

											<Menu
												className={'menu-modal'}
												MenuListProps={{
													'aria-labelledby': 'fade-button',
												}}
												anchorEl={anchorEl[index]}
												open={Boolean(anchorEl[index])}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
												sx={{ p: 1 }}
											>
												{Object.values(NoticeStatus)
													.filter((ele) => ele !== notice?.noticeStatus)
													.map((status: string) => (
														<MenuItem
															onClick={() => updateNoticeHandler({ _id: notice._id, noticeStatus: status as NoticeStatus })}
															key={status}
														>
															<Typography variant={'subtitle1'} component={'span'}>
																{status}
															</Typography>
														</MenuItem>
													))}
											</Menu>
										</TableCell>

										<TableCell align="right">{notice.viewCount}</TableCell>

										<TableCell align="left">
											{new Date(notice.createdAt).toLocaleDateString()}
										</TableCell>

										<TableCell align="right">
											<Tooltip title="Delete">
												<IconButton onClick={() => deleteNoticeHandler(notice._id)}>
													<DeleteRoundedIcon />
												</IconButton>
											</Tooltip>
											<Tooltip title="Edit">
												<IconButton onClick={() => router.push(`/_admin/cs/notice_create?id=${notice._id}`)}>
													<NotePencil size={24} weight="fill" />
												</IconButton>
											</Tooltip>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};

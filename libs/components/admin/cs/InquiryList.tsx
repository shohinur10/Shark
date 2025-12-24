import React from 'react';
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
	Chip,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { Inquiry } from '../../../types/inquiry/inquiry';
import { InquiryStatus, InquiryCategory, InquiryPriority } from '../../../enums/inquiry.enum';

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
		id: 'subject',
		numeric: false,
		disablePadding: false,
		label: 'SUBJECT',
	},
	{
		id: 'question',
		numeric: false,
		disablePadding: false,
		label: 'QUESTION',
	},
	{
		id: 'priority',
		numeric: false,
		disablePadding: false,
		label: 'PRIORITY',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
	{
		id: 'date',
		numeric: false,
		disablePadding: false,
		label: 'DATE',
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

interface InquiryPanelListType {
	inquiries: Inquiry[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateInquiryHandler: any;
}

export const InquiryList = (props: InquiryPanelListType) => {
	const { inquiries, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateInquiryHandler } = props;

	const getPriorityColor = (priority: InquiryPriority) => {
		switch (priority) {
			case InquiryPriority.URGENT:
				return 'error';
			case InquiryPriority.HIGH:
				return 'warning';
			case InquiryPriority.MEDIUM:
				return 'info';
			default:
				return 'default';
		}
	};

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<EnhancedTableHead />
					<TableBody>
						{inquiries.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={6}>
									<span className={'no-data'}>No inquiries found!</span>
								</TableCell>
							</TableRow>
						)}

						{inquiries.length !== 0 &&
							inquiries.map((inquiry: Inquiry, index: number) => {
								return (
									<TableRow hover key={inquiry._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">
											<Button className={'badge success'}>{inquiry.inquiryCategory}</Button>
										</TableCell>

										<TableCell align="left" sx={{ maxWidth: 200 }}>
											<Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
												{inquiry.subject}
											</Typography>
										</TableCell>

										<TableCell align="left" sx={{ maxWidth: 300 }}>
											<Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
												{inquiry.question}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Chip
												label={inquiry.inquiryPriority}
												color={getPriorityColor(inquiry.inquiryPriority)}
												size="small"
											/>
										</TableCell>

										<TableCell align="center">
											<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
												{inquiry.inquiryStatus}
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
												{Object.values(InquiryStatus)
													.filter((ele) => ele !== inquiry?.inquiryStatus)
													.map((status: string) => (
														<MenuItem
															onClick={() => updateInquiryHandler({ _id: inquiry._id, inquiryStatus: status as InquiryStatus })}
															key={status}
														>
															<Typography variant={'subtitle1'} component={'span'}>
																{status}
															</Typography>
														</MenuItem>
													))}
											</Menu>
										</TableCell>

										<TableCell align="left">
											{new Date(inquiry.createdAt).toLocaleDateString()}
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

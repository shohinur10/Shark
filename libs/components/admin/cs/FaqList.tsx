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
	IconButton,
	Tooltip,
	Chip,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Faq } from '../../../types/faq/faq';
import { FaqCategory, FaqStatus } from '../../../enums/faq.enum';

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
		id: 'question',
		numeric: false,
		disablePadding: false,
		label: 'QUESTION',
	},
	{
		id: 'answer',
		numeric: false,
		disablePadding: false,
		label: 'ANSWER',
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

interface FaqArticlesPanelListType {
	faqs: Faq[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateFaqHandler: any;
	deleteFaqHandler?: any;
}

export const FaqArticlesPanelList = (props: FaqArticlesPanelListType) => {
	const { faqs, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateFaqHandler, deleteFaqHandler } = props;

	return (
		<Stack>
			<TableContainer>
				<Table 
					sx={{ 
						minWidth: 750,
						'& .MuiTableCell-root': {
							borderBottom: '1px solid #f0f0f0',
						}
					}} 
					aria-labelledby="tableTitle" 
					size={'medium'}
				>
					<EnhancedTableHead />
					<TableBody>
						{faqs.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7} sx={{ py: 8 }}>
									<Stack alignItems="center" spacing={2}>
										<HelpOutlineIcon sx={{ fontSize: 64, color: '#ccc' }} />
										<Typography variant="h6" color="text.secondary">
											No FAQs found!
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Create your first FAQ to get started
										</Typography>
									</Stack>
								</TableCell>
							</TableRow>
						)}

						{faqs.length !== 0 &&
							faqs.map((faq: Faq, index: number) => {
								return (
									<TableRow 
										hover 
										key={faq._id} 
										sx={{ 
											'&:last-child td, &:last-child th': { border: 0 },
											transition: 'all 0.2s ease',
											'&:hover': {
												background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
												transform: 'scale(1.001)',
												boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
											}
										}}
									>
										<TableCell align="left">
											<Chip 
												label={faq.faqCategory}
												sx={{
													background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
													color: 'white',
													fontWeight: 600,
													fontSize: '11px',
													height: '24px',
												}}
											/>
										</TableCell>

										<TableCell align="left" sx={{ maxWidth: 300 }}>
											<Typography 
												variant="body2" 
												sx={{ 
													overflow: 'hidden', 
													textOverflow: 'ellipsis', 
													whiteSpace: 'nowrap',
													fontWeight: 500,
													color: '#212121'
												}}
											>
												{faq.question}
											</Typography>
										</TableCell>

										<TableCell align="left" sx={{ maxWidth: 300 }}>
											<Typography 
												variant="body2" 
												sx={{ 
													overflow: 'hidden', 
													textOverflow: 'ellipsis', 
													whiteSpace: 'nowrap',
													color: '#616161'
												}}
											>
												{faq.answer}
											</Typography>
										</TableCell>

										<TableCell align="center">
											<Chip
												onClick={(e: any) => menuIconClickHandler(e, index)}
												label={faq.faqStatus}
												sx={{
													background: faq.faqStatus === FaqStatus.ACTIVE 
														? 'rgba(34, 154, 22, 0.16)' 
														: faq.faqStatus === FaqStatus.INACTIVE
														? 'rgba(245, 124, 0, 0.16)'
														: 'rgba(183, 33, 54, 0.16)',
													color: faq.faqStatus === FaqStatus.ACTIVE 
														? '#229a16' 
														: faq.faqStatus === FaqStatus.INACTIVE
														? '#f57c00'
														: '#B72136',
													fontWeight: 600,
													cursor: 'pointer',
													'&:hover': {
														opacity: 0.8,
													}
												}}
											/>

											<Menu
												className={'menu-modal'}
												MenuListProps={{
													'aria-labelledby': 'fade-button',
												}}
												anchorEl={anchorEl[index]}
												open={Boolean(anchorEl[index])}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
												sx={{ 
													p: 1,
													'& .MuiPaper-root': {
														borderRadius: '12px',
														boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
													}
												}}
											>
												{Object.values(FaqStatus)
													.filter((ele) => ele !== faq?.faqStatus)
													.map((status: string) => (
														<MenuItem
															onClick={() => updateFaqHandler({ _id: faq._id, faqStatus: status as FaqStatus })}
															key={status}
															sx={{
																borderRadius: '8px',
																m: 0.5,
																'&:hover': {
																	background: 'rgba(102, 126, 234, 0.1)',
																}
															}}
														>
															<Typography variant={'subtitle1'} component={'span'}>
																{status}
															</Typography>
														</MenuItem>
													))}
											</Menu>
										</TableCell>

										<TableCell align="right">
											<Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
												<VisibilityIcon sx={{ fontSize: 16, color: '#999' }} />
												<Typography variant="body2" sx={{ fontWeight: 600, color: '#616161' }}>
													{faq.viewCount || 0}
												</Typography>
											</Stack>
										</TableCell>

										<TableCell align="left">
											<Typography variant="body2" color="text.secondary">
												{new Date(faq.createdAt).toLocaleDateString()}
											</Typography>
										</TableCell>

										<TableCell align="right">
											{deleteFaqHandler && (
												<Tooltip title="Delete FAQ">
													<IconButton 
														onClick={() => deleteFaqHandler(faq._id)} 
														size="small"
														sx={{
															color: '#f5576c',
															'&:hover': {
																background: 'rgba(245, 87, 108, 0.1)',
																transform: 'scale(1.1)',
															},
															transition: 'all 0.2s ease'
														}}
													>
														<DeleteRoundedIcon fontSize="small" />
													</IconButton>
												</Tooltip>
											)}
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

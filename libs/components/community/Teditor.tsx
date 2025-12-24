import React, { useRef, useState } from 'react';
import { Box, Button, FormControl, MenuItem, Stack, Typography, Select, TextField, Card, Alert, CircularProgress } from '@mui/material';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { Editor } from '@toast-ui/react-editor';
import { getJwtToken } from '../../auth';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import axios from 'axios';
import { T } from '../../types/common';
import { useMutation } from '@apollo/client';
import { CREATE_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { BoardArticleInput } from '../../types/board-article/board-article.input';
import PublishIcon from '@mui/icons-material/Publish';
import CategoryIcon from '@mui/icons-material/Category';
import TitleIcon from '@mui/icons-material/Title';
import '@toast-ui/editor/dist/toastui-editor.css';

const TuiEditor = () => {
	const editorRef = useRef<Editor>(null);
	const token = getJwtToken();
	const router = useRouter();
	const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(BoardArticleCategory.FREE);
	const [articleTitle, setArticleTitle] = useState<string>('');
	const [articleImage, setArticleImage] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [createBoardArticle] = useMutation(CREATE_BOARD_ARTICLE);

	/** HANDLERS **/
	const uploadImage = async (image: any) => {
		try {
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'article',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			setArticleImage(responseImage);
			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err) {
			console.log('Error, uploadImage:', err);
			throw err;
		}
	};

	const changeCategoryHandler = (e: any) => {
		setArticleCategory(e.target.value);
		setError('');
	};

	const articleTitleHandler = (e: T) => {
		setArticleTitle(e.target.value);
		setError('');
	};

	const handleRegisterButton = async () => {
		try {
			setError('');
			setIsSubmitting(true);

			// Validation
			if (!articleTitle.trim()) {
				setError('Please enter an article title');
				setIsSubmitting(false);
				return;
			}

			const articleContent = editorRef.current?.getInstance().getMarkdown() || '';
			if (!articleContent.trim() || articleContent.trim() === 'Type here') {
				setError('Please write article content');
				setIsSubmitting(false);
				return;
			}

			// Prepare input
			const input: BoardArticleInput = {
				articleCategory,
				articleTitle: articleTitle.trim(),
				articleContent,
				...(articleImage && { articleImage }),
			};

			// Create article
			const result = await createBoardArticle({
				variables: { input },
			});

			if (result.data?.createBoardArticle) {
				await sweetTopSmallSuccessAlert('Article published successfully!', 2000);
				// Reset form
				setArticleTitle('');
				setArticleCategory(BoardArticleCategory.FREE);
				setArticleImage('');
				editorRef.current?.getInstance().setMarkdown('');
				// Redirect to community or article detail
				setTimeout(() => {
					router.push('/community');
				}, 1500);
			}
		} catch (err: any) {
			console.log('Error, handleRegisterButton:', err);
			const errorMessage = err.message || 'Failed to publish article. Please try again.';
			setError(errorMessage);
			await sweetErrorHandling(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const isFormValid = () => {
		const content = editorRef.current?.getInstance().getMarkdown() || '';
		return articleTitle.trim() !== '' && content.trim() !== '' && content.trim() !== 'Type here';
	};

	return (
		<Stack spacing={3} sx={{ width: '100%' }}>
			{error && (
				<Alert severity="error" onClose={() => setError('')} sx={{ borderRadius: 2 }}>
					{error}
				</Alert>
			)}

			<Card elevation={0} sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 3 }}>
				<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
					<Box sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' } }}>
						<Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
							<CategoryIcon sx={{ color: '#87cdf9', fontSize: 20 }} />
							<Typography variant="subtitle2" sx={{ color: '#5a6c7d', fontWeight: 600 }}>
								Category
							</Typography>
						</Stack>
						<FormControl fullWidth sx={{ backgroundColor: 'white', borderRadius: 2 }}>
							<Select
								value={articleCategory}
								onChange={changeCategoryHandler}
								displayEmpty
								sx={{
									height: '48px',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#e0e0e0',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: '#87cdf9',
									},
								}}
							>
								<MenuItem value={BoardArticleCategory.FREE}>Free Discussion</MenuItem>
								<MenuItem value={BoardArticleCategory.WORKOUT_TIPS}>Workout Tips</MenuItem>
								<MenuItem value={BoardArticleCategory.NUTRITION}>Nutrition</MenuItem>
								<MenuItem value={BoardArticleCategory.SUCCESS_STORY}>Success Story</MenuItem>
								<MenuItem value={BoardArticleCategory.QUESTION}>Question</MenuItem>
								<MenuItem value={BoardArticleCategory.MOTIVATION}>Motivation</MenuItem>
								<MenuItem value={BoardArticleCategory.EQUIPMENT_REVIEW}>Equipment Review</MenuItem>
								<MenuItem value={BoardArticleCategory.GYM_REVIEW}>Gym Review</MenuItem>
								<MenuItem value={BoardArticleCategory.NEWS}>News</MenuItem>
								<MenuItem value={BoardArticleCategory.HUMOR}>Humor</MenuItem>
							</Select>
						</FormControl>
					</Box>

					<Box sx={{ flex: 2, minWidth: { xs: '100%', md: '400px' } }}>
						<Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
							<TitleIcon sx={{ color: '#87cdf9', fontSize: 20 }} />
							<Typography variant="subtitle2" sx={{ color: '#5a6c7d', fontWeight: 600 }}>
								Article Title
							</Typography>
						</Stack>
						<TextField
							onChange={articleTitleHandler}
							value={articleTitle}
							placeholder="Enter a compelling title for your article"
							fullWidth
							sx={{
								backgroundColor: 'white',
								borderRadius: 2,
								'& .MuiOutlinedInput-root': {
									'& fieldset': {
										borderColor: '#e0e0e0',
									},
									'&:hover fieldset': {
										borderColor: '#87cdf9',
									},
									'&.Mui-focused fieldset': {
										borderColor: '#87cdf9',
									},
								},
							}}
						/>
					</Box>
				</Stack>
			</Card>

			<Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
				<Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
					<Typography variant="subtitle2" sx={{ color: '#5a6c7d', fontWeight: 600 }}>
						Article Content
					</Typography>
				</Box>
				<Box sx={{ p: 2 }}>
					<Editor
						initialValue=""
						placeholder="Start writing your article here..."
						previewStyle="vertical"
						height="600px"
						// @ts-ignore
						initialEditType="wysiwyg"
						toolbarItems={[
							['heading', 'bold', 'italic', 'strike'],
							['hr', 'quote'],
							['ul', 'ol', 'task', 'indent', 'outdent'],
							['table', 'image', 'link'],
							['code', 'codeblock'],
						]}
						ref={editorRef}
						hooks={{
							addImageBlobHook: async (image: any, callback: any) => {
								try {
									const uploadedImageURL = await uploadImage(image);
									callback(uploadedImageURL);
									return false;
								} catch (err) {
									console.log('Error uploading image:', err);
									callback('');
									return false;
								}
							},
						}}
					/>
				</Box>
			</Card>

			<Stack direction="row" justifyContent="center" spacing={2} sx={{ pt: 2 }}>
				<Button
					variant="contained"
					onClick={handleRegisterButton}
					disabled={!isFormValid() || isSubmitting}
					startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <PublishIcon />}
					sx={{
						minWidth: '200px',
						height: '48px',
						backgroundColor: '#87cdf9',
						color: '#000',
						fontWeight: 600,
						borderRadius: 2,
						textTransform: 'none',
						fontSize: '16px',
						'&:hover': {
							backgroundColor: '#6bb3e8',
						},
						'&:disabled': {
							backgroundColor: '#e0e0e0',
							color: '#9e9e9e',
						},
					}}
				>
					{isSubmitting ? 'Publishing...' : 'Publish Article'}
				</Button>
			</Stack>
		</Stack>
	);
};

export default TuiEditor;

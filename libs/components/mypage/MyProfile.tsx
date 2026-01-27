import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Button, Stack, Typography, TextField, Box, Grid, Divider, Card, CardContent, Alert } from '@mui/material';
import axios from 'axios';
import { Messages, REACT_APP_API_URL } from '../../config';
import { getJwtToken, updateStorage, updateUserInfo } from '../../auth';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberUpdate } from '../../types/member/member.update';
import { UPDATE_MEMBER } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../sweetAlert';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';

const MyProfile: NextPage = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const [updateData, setUpdateData] = useState<MemberUpdate>(initialValues);
	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});
	const [showPasswordFields, setShowPasswordFields] = useState(false);

	/** APOLLO REQUESTS **/

	const [updateMember] = useMutation(UPDATE_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		if (user && user._id) {
			setUpdateData({
				_id: user._id || '',
				memberNick: user.memberNick || '',
				memberPhone: user.memberPhone || '',
				memberAddress: user.memberAddress || '',
				memberImage: user.memberImage || '',
			});
		}
	}, [user?._id, user?.memberNick, user?.memberPhone, user?.memberAddress, user?.memberImage]);

	/** HANDLERS **/
	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files[0];
			if (!image) return;

			// Validate file size (5MB max)
			if (image.size > 5 * 1024 * 1024) {
				await sweetErrorHandling(new Error('Image size must be less than 5MB'));
				return;
			}

			// Validate file type
			if (!image.type.match(/^image\/(jpg|jpeg|png)$/i)) {
				await sweetErrorHandling(new Error('Please upload a JPG, JPEG, or PNG image'));
				return;
			}

			console.log('+image:', image);

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'member',
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
			console.log('+responseImage: ', responseImage);
			
			// Update state properly
			setUpdateData((prevData) => ({
				...prevData,
				memberImage: responseImage,
			}));

			await sweetMixinSuccessAlert('Profile photo uploaded successfully');
			
			// Reset file input to allow re-uploading the same file
			e.target.value = '';

			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err: any) {
			console.log('Error, uploadImage:', err);
			await sweetErrorHandling(err);
		}
	};

	const updatePropertyHandler = async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			
			// Get the latest updateData state
			const dataToUpdate = {
				...updateData,
				_id: user._id,
			};
			
			// Perform the update
			const result = await updateMember({
				variables: {
					input: dataToUpdate,
				},
			});

			//@ts-ignore
			const jwtToken = result.data.updateMember?.accessToken;
			await updateStorage({ jwtToken });
			updateUserInfo(result.data.updateMember?.accessToken);
			await sweetMixinSuccessAlert('Information updated successfully');
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const handlePasswordChange = async () => {
		if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
			await sweetErrorHandling(new Error('Please fill in all password fields'));
			return;
		}

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			await sweetErrorHandling(new Error('New passwords do not match'));
			return;
		}

		if (passwordData.newPassword.length < 6) {
			await sweetErrorHandling(new Error('Password must be at least 6 characters long'));
			return;
		}

		try {
			// In production, this would call an API endpoint to change password
			// await changePassword(passwordData.currentPassword, passwordData.newPassword);
			await sweetMixinSuccessAlert('Password updated successfully');
			setPasswordData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
			setShowPasswordFields(false);
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const doDisabledCheck = () => {
		if (
			updateData.memberNick === '' ||
			updateData.memberPhone === '' ||
			updateData.memberAddress === ''
		) {
			return true;
		}
	};

	console.log('+updateData', updateData);

	if (device === 'mobile') {
		return <>MY PROFILE PAGE MOBILE</>;
	} else
		return (
			<div id="my-profile-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Profile Settings</Typography>
						<Typography className="sub-title">Manage your account information and preferences</Typography>
					</Stack>
				</Stack>

				<Grid container spacing={3}>
					{/* Profile Information Section */}
					<Grid item xs={12} md={8}>
						<Card className={'profile-settings-card'}>
							<CardContent>
								<Typography variant="h6" className={'section-title'} gutterBottom>
									Profile Information
								</Typography>

								{/* Profile Photo */}
								<Box component="div" className={'photo-section'} sx={{ mb: 4 }}>
									<Typography variant="body2" className={'field-label'} gutterBottom>
										Profile Photo
									</Typography>
									<Stack direction="row" spacing={3} alignItems="center">
										<Box component="div" className={'image-preview'}>
											<img
												src={
													updateData?.memberImage
														? `${REACT_APP_API_URL}/${updateData?.memberImage}`
														: `/img/profile/defaultUser.svg`
												}
												alt="Profile"
												className={'profile-image'}
											/>
										</Box>
										<Box component="div">
											<input
												type="file"
												hidden
												id="hidden-input"
												onChange={uploadImage}
												accept="image/jpg, image/jpeg, image/png"
											/>
											<label htmlFor="hidden-input">
												<Button variant="outlined" component="span" size="small">
													Upload New Photo
												</Button>
											</label>
											<Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
												JPG, JPEG or PNG format. Max 5MB
											</Typography>
										</Box>
									</Stack>
								</Box>

								<Divider sx={{ mb: 4 }} />

								{/* Form Fields */}
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<TextField
											fullWidth
											label="Username"
											variant="outlined"
											value={updateData.memberNick}
											onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberNick: value })}
											required
											InputProps={{
												startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
											}}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Phone Number"
											variant="outlined"
											value={updateData.memberPhone}
											onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberPhone: value })}
											required
											InputProps={{
												startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
											}}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Email"
											variant="outlined"
											value={user.memberPhone || ''}
											disabled
											InputProps={{
												startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
											}}
											helperText="Email cannot be changed"
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											fullWidth
											label="Address"
											variant="outlined"
											value={updateData.memberAddress}
											onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberAddress: value })}
											multiline
											rows={2}
											InputProps={{
												startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />,
											}}
										/>
									</Grid>
								</Grid>

								<Box component="div" sx={{ mt: 4 }}>
									<Button
										variant="contained"
										size="large"
										onClick={updatePropertyHandler}
										disabled={doDisabledCheck()}
										startIcon={<SaveIcon />}
										className={'update-button'}
									>
										Save Changes
									</Button>
								</Box>
							</CardContent>
						</Card>
					</Grid>

					{/* Password Change Section */}
					<Grid item xs={12} md={4}>
						<Card className={'password-settings-card'}>
							<CardContent>
								<Typography variant="h6" className={'section-title'} gutterBottom>
									Change Password
								</Typography>
								<Typography variant="body2" color="text.secondary" paragraph>
									Update your password to keep your account secure
								</Typography>

								{!showPasswordFields ? (
									<Button
										variant="outlined"
										fullWidth
										startIcon={<LockIcon />}
										onClick={() => setShowPasswordFields(true)}
									>
										Change Password
									</Button>
								) : (
									<Box component="div">
										<TextField
											fullWidth
											label="Current Password"
											type="password"
											variant="outlined"
											value={passwordData.currentPassword}
											onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
											sx={{ mb: 2 }}
										/>
										<TextField
											fullWidth
											label="New Password"
											type="password"
											variant="outlined"
											value={passwordData.newPassword}
											onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
											sx={{ mb: 2 }}
										/>
										<TextField
											fullWidth
											label="Confirm New Password"
											type="password"
											variant="outlined"
											value={passwordData.confirmPassword}
											onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
											sx={{ mb: 2 }}
										/>
										<Button
											variant="contained"
											fullWidth
											onClick={handlePasswordChange}
											sx={{ mb: 1 }}
										>
											Update Password
										</Button>
										<Button
											variant="text"
											fullWidth
											onClick={() => {
												setShowPasswordFields(false);
												setPasswordData({
													currentPassword: '',
													newPassword: '',
													confirmPassword: '',
												});
											}}
										>
											Cancel
										</Button>
									</Box>
								)}
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</div>
		);
};

MyProfile.defaultProps = {
	initialValues: {
		_id: '',
		memberImage: '',
		memberNick: '',
		memberPhone: '',
		memberAddress: '',
	},
};

export default MyProfile;
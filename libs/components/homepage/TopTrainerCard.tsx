import React from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';

interface TopTrainerProps {
	trainer: Member;
}
const TopTrainerCard = (props: TopTrainerProps) => {
	const { trainer } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const trainerImage = trainer?.memberImage
		? `${REACT_APP_API_URL}/${trainer?.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-trainer-card">
				<img src={trainerImage} alt="" />

				<strong>{trainer?.memberNick}</strong>
				<span>{trainer?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-trainer-card">
				<img src={trainerImage} alt="" />

				<strong>{trainer?.memberNick}</strong>
				<span>{trainer?.memberType}</span>
			</Stack>
		);
	}
};

export default TopTrainerCard;

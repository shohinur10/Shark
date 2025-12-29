import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopTrainerCard from './TopTrainerCard';
import { Member } from '../../types/member/member';
import { TrainersInquiry } from '../../types/member/member.input';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { GET_TRAINERS } from '../../../apollo/user/query';
import Link from 'next/link';

interface TopTrainersProps {
	initialInput: TrainersInquiry;
}

const TopTrainers = (props: TopTrainersProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topTrainers, setTopTrainers] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getTrainersLoading,
		data: getTrainersData,
		error: getTrainersError,
		refetch: getTrainersRefetch,
	} = useQuery(GET_TRAINERS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopTrainers(data?.getTrainers?.list);
		},
	});

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className={'top-trainers'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Expert Trainers</span>
					</Stack>
					<Stack className={'wrapper'}>
						<Swiper
							className={'top-trainers-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={29}
							modules={[Autoplay]}
						>
							{topTrainers.map((trainer: Member) => {
								return (
									<SwiperSlide className={'top-trainers-slide'} key={trainer?._id}>
										<TopTrainerCard trainer={trainer} key={trainer?.memberNick} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-trainers'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Expert Trainers</span>
							<p>Connect with certified fitness professionals</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<Link href={'/trainers'}>
								<div className={'more-box'}>
									<span>See All Trainers</span>
									<img src="/img/icons/rightup.svg" alt="" />
								</div>
							</Link>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<Box component={'div'} className={'switch-btn swiper-trainers-prev'}>
							<ArrowBackIosNewIcon />
						</Box>
						<Box component={'div'} className={'card-wrapper'}>
							<Swiper
								className={'top-trainers-swiper'}
								slidesPerView={'auto'}
								spaceBetween={29}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trainers-next',
									prevEl: '.swiper-trainers-prev',
								}}
							>
								{topTrainers.map((trainer: Member) => {
									return (
										<SwiperSlide className={'top-trainers-slide'} key={trainer?._id}>
											<TopTrainerCard trainer={trainer} key={trainer?.memberNick} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						</Box>
						<Box component={'div'} className={'switch-btn swiper-trainers-next'}>
							<ArrowBackIosNewIcon />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopTrainers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopTrainers;

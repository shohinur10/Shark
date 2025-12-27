import { NextPage } from 'next';
import { useRouter } from 'next/router';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { useBookingForm } from '../../libs/hooks/useBookingForm';
import { getMinBookingDate } from '../../libs/utils/booking.utils';
import BookingPage from '../../libs/components/booking/BookingPage';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const NewBookingPage: NextPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { trainerId: trainerIdParam } = router.query;

	// Use the custom booking form hook
	const bookingForm = useBookingForm(trainerIdParam);

	const minDate = getMinBookingDate();

	return (
		<BookingPage
			selectedTrainerId={bookingForm.state.trainerId}
			selectedTrainer={bookingForm.selectedTrainer}
			selectedServiceId={bookingForm.state.serviceId}
			selectedService={bookingForm.selectedService}
			bookingDate={bookingForm.state.bookingDate}
			bookingTime={bookingForm.state.bookingTime}
			durationMinutes={bookingForm.state.durationMinutes}
			locationType={bookingForm.state.locationType}
			notes={bookingForm.state.notes}
			trainerIdParam={trainerIdParam}
			trainersLoading={bookingForm.trainersLoading}
			trainersError={bookingForm.trainersError}
			trainersData={{ getTrainers: { list: bookingForm.trainers } }}
			servicesData={bookingForm.services}
			servicesLoading={bookingForm.servicesLoading}
			servicesError={bookingForm.servicesError}
			availableSlots={bookingForm.availableSlots}
			availabilityLoading={bookingForm.availabilityLoading}
			availabilityError={bookingForm.availabilityError}
			validationErrors={bookingForm.validationErrors}
			minDate={minDate}
			totalPrice={bookingForm.totalPrice}
			user={user}
			creatingBooking={bookingForm.creatingBooking}
			isFormValid={bookingForm.isFormValid}
			onTrainerChange={bookingForm.setTrainerId}
			onServiceChange={bookingForm.setServiceId}
			onBookingDateChange={bookingForm.setBookingDate}
			onBookingTimeChange={bookingForm.setBookingTime}
			onDurationChange={bookingForm.setDuration}
			onLocationChange={bookingForm.setLocationType}
			onNotesChange={bookingForm.setNotes}
			onSubmit={bookingForm.submit}
		/>
	);
};

export default withLayoutBasic(NewBookingPage);






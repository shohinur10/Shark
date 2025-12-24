import React from 'react';
import { Box, Stack, Chip } from '@mui/material';
import { Member } from '../../../libs/types/member/member';

interface TrainerDNAProps {
	trainer: Member;
}

const TrainerDNA: React.FC<TrainerDNAProps> = ({ trainer }) => {
	const specialties = trainer.trainerSpecialties || [];
	const experience = trainer.trainerExperience || 0;
	const bio = trainer.trainerBio || trainer.memberDesc || '';
	const workouts = trainer.memberWorkouts || 0;

	// Derive coaching style pills from available data
	const pills: string[] = [];

	// Strength-first: check for strength-related specialties
	const specialtiesLower = specialties.map((s: string) => s.toLowerCase());
	if (specialtiesLower.some((s: string) => s.includes('strength') || s.includes('hypertrophy') || s.includes('weight'))) {
		pills.push('Strength-first');
	}

	// HIIT friendly: check for HIIT, cardio, interval
	if (specialtiesLower.some((s: string) => s.includes('hiit') || s.includes('cardio') || s.includes('interval'))) {
		pills.push('HIIT friendly');
	}

	// Beginner safe: based on experience and specialties
	if (experience < 5 || specialtiesLower.some((s: string) => s.includes('beginner') || s.includes('intro'))) {
		pills.push('Beginner safe');
	}

	// Equipment: derive from bio or specialties
	if (specialtiesLower.some((s: string) => s.includes('bodyweight') || s.includes('calisthenics'))) {
		pills.push('Equipment: Minimal');
	} else if (specialtiesLower.some((s: string) => s.includes('gym') || s.includes('weights'))) {
		pills.push('Equipment: Full Gym');
	}

	// High volume: based on workouts count
	if (workouts > 50) {
		pills.push('High volume');
	}

	// Recovery-focused: check bio or specialties
	if (bio.toLowerCase().includes('recovery') || specialtiesLower.some((s: string) => s.includes('recovery'))) {
		pills.push('Recovery-focused');
	}

	// Limit to 3-5 pills
	const displayPills = pills.slice(0, 5);

	if (displayPills.length === 0) {
		return null;
	}

	return (
		<Box
			className="trainer-dna"
			sx={{
				padding: 2.5,
				backgroundColor: '#FFFFFF',
				borderRadius: 2,
				border: '1px solid #E5E5E5',
			}}
		>
			<Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
				{displayPills.map((pill, idx) => (
					<Chip
						key={idx}
						label={pill}
						size="small"
						sx={{
							height: 28,
							fontSize: '12px',
							fontWeight: 500,
							backgroundColor: idx % 3 === 0 ? '#E3F2FD' : idx % 3 === 1 ? '#FFF3E0' : '#F3E5F5',
							color: idx % 3 === 0 ? '#1976D2' : idx % 3 === 1 ? '#F57C00' : '#7B1FA2',
							border: 'none',
						}}
					/>
				))}
			</Stack>
		</Box>
	);
};

export default TrainerDNA;

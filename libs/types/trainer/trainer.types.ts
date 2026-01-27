import { Member } from '../member/member';
import { Workout } from '../workout/workout';
import { TotalCounter } from '../common';
import { TrainersInquiry } from '../member/member.input';
import { TrainerWorkoutsInquiry } from '../workout/workout.input';

/**
 * GraphQL Query Result Types
 */

export interface GetTrainersData {
	getTrainers: {
		list: Member[];
		metaCounter: TotalCounter[];
	};
}

export interface GetTrainersVariables {
	input: TrainersInquiry;
}

export interface GetMemberData {
	getMember: Member;
}

export interface GetMemberVariables {
	input: string;
}

export interface GetTrainerWorkoutsData {
	getTrainerWorkouts: {
		list: Workout[];
		metaCounter: TotalCounter[];
	};
}

export interface GetTrainerWorkoutsVariables {
	input: TrainerWorkoutsInquiry;
}






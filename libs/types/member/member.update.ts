import { MemberStatus, MemberType } from '../../enums/member.enum';

export interface MemberUpdate {
	_id: string;
	memberType?: MemberType;
	memberStatus?: MemberStatus;
	memberPhone?: string;
	memberNick?: string;
	memberPassword?: string;
	memberFullName?: string;
	memberImage?: string;
	memberAddress?: string;
	memberDesc?: string;
	memberWorkouts?: string[];
	memberChallenges?: string[];
	memberAchievements?: string[];
	trainerExperience?: string;
	trainerSpecialties?: string[];
	trainerBio?: string;
	subscriptionId?: string;
	deletedAt?: Date;
}

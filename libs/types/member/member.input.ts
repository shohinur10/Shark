import { MemberAuthType, MemberStatus, MemberType } from '../../enums/member.enum';
import { Direction } from '../../enums/common.enum';

export interface MemberInput {
	memberNick: string;
	memberPassword: string;
	memberPhone: string;
	memberType?: MemberType;
	memberAuthType?: MemberAuthType;
}

export interface LoginInput {
	memberNick: string;
	memberPassword: string;
}

interface AISearch {
	text?: string; // Optional - search by memberNick
}

export interface TrainersInquiry {
	page: number; // Required, minimum 1
	limit: number; // Required, minimum 1
	sort?: string; // Optional, e.g., "trainerRating", "createdAt"
	direction?: Direction; // Optional, "ASC" | "DESC", defaults to DESC
	search?: AISearch; // Optional search object
}

interface MISearch {
	memberStatus?: MemberStatus;
	memberType?: MemberType;
	text?: string;
}

export interface MembersInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: MISearch;
}

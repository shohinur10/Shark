import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { Direction } from '../../enums/common.enum';

export interface CommentInput {
	commentGroup: CommentGroup;
	commentContent: string;
	commentRefId: string;
	memberId?: string;
}

interface CISearch {
	commentRefId?: string;
	commentStatus?: CommentStatus;
}

export interface CommentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	commentRefId?: string;
	commentStatus?: CommentStatus;
	search?: CISearch;
}

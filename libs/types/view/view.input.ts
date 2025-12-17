import { ViewGroup } from '../../enums/view.enum';

export interface ViewInput {
	viewRefId?: string;
	viewGroup?: string;
	targetId?: string;
	targetType?: string;
	memberId?: string;
}

@InputType()
export class NotificationMarkAsReadInput {
	@IsNotEmpty()
	@Field(() => String)
	notificationId: string;
}
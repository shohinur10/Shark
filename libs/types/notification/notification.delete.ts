@InputType()
export class NotificationDeleteInput {
	@IsNotEmpty()
	@Field(() => String)
	notificationId: string;
}
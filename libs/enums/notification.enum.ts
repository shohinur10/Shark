// Types of notifications
export enum NotificationType {
	LIKE = 'LIKE',                     // Someone liked your content
	COMMENT = 'COMMENT',               // Someone commented
	FOLLOW = 'FOLLOW',                 // Someone followed you
	BOOKING = 'BOOKING',               // Trainer booking notification
	WORKOUT_REMINDER = 'WORKOUT_REMINDER',  // Workout reminder
	ACHIEVEMENT = 'ACHIEVEMENT',       // Achievement unlocked
	MESSAGE = 'MESSAGE',               // New message
	SYSTEM = 'SYSTEM',                 // System notification
}


export enum NotificationStatus {
	WAIT = 'WAIT',      // Unread
	READ = 'READ',      // Read
	ARCHIVED = 'ARCHIVED',  // Archived
}


// What entity the notification is related to
export enum NotificationGroup {
	MEMBER = 'MEMBER',         // Notification about a member
	ARTICLE = 'ARTICLE',       // Notification about an article
	PROPERTY = 'PROPERTY',     // Notification about a gym/studio/equipment
	WORKOUT = 'WORKOUT',       // Notification about a workout
	TRAINER = 'TRAINER',       // Notification about a trainer
}


export enum CommentStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
	HIDDEN = 'HIDDEN',      // Hidden by moderator
	REPORTED = 'REPORTED',  // Reported by users
}


// What can be commented on
export enum CommentGroup {
	MEMBER = 'MEMBER',         // Comments on member profiles
	ARTICLE = 'ARTICLE',       // Comments on board articles
	PROPERTY = 'PROPERTY',     // Comments on gym/studio/equipment listings
	WORKOUT = 'WORKOUT',       // Comments on workout plans
	TRAINER = 'TRAINER',       // Comments on trainer profiles
	MEAL_PLAN = 'MEAL_PLAN',   // Comments on meal plans
}


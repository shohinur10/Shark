import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
    signup(input: $input) {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
        memberDesc
        memberProperties
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberRank
        memberBlocks
        memberWarnings
        deletedAt
        createdAt
        updatedAt
        accessToken
        memberWorkouts
        memberChallenges
        memberAchievements
        trainerRating
        subscriptionId
        trainerBio
        trainerCertifications
        trainerSpecialties
        trainerExperience
    }
}

`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
    login(input: $input) {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
        memberDesc
        memberProperties
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberRank
        memberBlocks
        memberWarnings
        deletedAt
        createdAt
        updatedAt
        accessToken
        meLiked {
            memberId
            likeRefId
            myFavorite
        }
        meFollowed {
            followingId
            followerId
            myFollowing
        }
        memberWorkouts
        memberChallenges
        memberAchievements
        trainerRating
        trainerExperience
        trainerSpecialties
        trainerCertifications
        trainerBio
        subscriptionId
    }
}

`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
    updateMember(input: $input) {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
        memberDesc
        memberProperties
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberRank
        memberBlocks
        memberWarnings
        memberWorkouts
        memberChallenges
        memberAchievements
        trainerRating
        trainerExperience
        trainerSpecialties
        trainerCertifications
        trainerBio
        subscriptionId
        deletedAt
        createdAt
        updatedAt
        accessToken
        meLiked {
            memberId
            likeRefId
            myFavorite
        }
        meFollowed {
            followingId
            followerId
            myFollowing
        }
    }
}

`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($memberId:String!) {
    likeTargetMember(memberId: $memberId) {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
        memberDesc
        memberProperties
        memberArticles
        memberFollowers
        memberFollowings
        memberPoints
        memberLikes
        memberViews
        memberComments
        memberRank
        memberBlocks
        memberWarnings
        memberWorkouts
        memberChallenges
        memberAchievements
        trainerRating
        trainerExperience
        trainerSpecialties
        trainerCertifications
        trainerBio
        subscriptionId
        deletedAt
        createdAt
        updatedAt
        accessToken
        meLiked {
            memberId
            likeRefId
            myFavorite
        }
        meFollowed {
            followingId
            followerId
            myFollowing
        }
    }
}

`;


/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
	mutation CreateBoardArticle ($input:BoardArticleInput!){
    createBoardArticle(input: $input) {
        _id
        articleCategory
        articleStatus
        articleTitle
        articleContent
        articleImage
        articleViews
        articleLikes
        articleComments
        memberId
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}

`;

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_BOARD_ARTICLE = gql`
	mutation LikeTargetBoardArticle ($input:String!){
    likeTargetBoardArticle(articleId: $input) {
        _id
        articleCategory
        articleStatus
        articleTitle
        articleContent
        articleImage
        articleViews
        articleLikes
        articleComments
        memberId
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}

`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment ($input:CommentInput!){
    createComment(input: $input) {
        _id
        commentStatus
        commentGroup
        commentContent
        commentRefId
        memberId
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}

`;

export const UPDATE_COMMENT = gql`
	mutation UpdateComment ($input:CommentUpdate!){
    updateComment(input: $input) {
        _id
        commentStatus
        commentGroup
        commentContent
        commentRefId
        memberId
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}

`;

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation subscribe ($input:String!){
    subscribe(input: $input) {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        meLiked {
            memberId
            likeRefId
            myFavorite
        }
        meFollowed {
            followingId
            followerId
            myFollowing
        }
        followerData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}

`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input:String!) {
    unsubscribe(input: $input) {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        meLiked {
            memberId
            likeRefId
            myFavorite
        }
        meFollowed {
            followingId
            followerId
            myFollowing
        }
        followerData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}

`;

export const CREATE_ACHIEVEMENT = gql`
mutation CreateAchievement($input:AchievementInput!) {
    createAchievement(input: $input) {
        _id
        memberId
        achievementType
        achievementStatus
        achievementTitle
        achievementDesc
        achievementBadge
        targetValue
        currentValue
        progressPercentage
        points
        challengeId
        unlockedAt
        expiresAt
        createdAt
        updatedAt
    }
}
`;


export const CREATE_GOAL = gql`
	mutation CreateGoal ($input:GoalInput!){
    createGoal(input: $input) {
        _id
        memberId
        goalType
        goalStatus
        goalTitle
        goalDesc
        targetValue
        currentValue
        unit
        startDate
        targetDate
        achievedAt
        progressPercentage
        createdAt
        updatedAt
        milestones {
            value
            achieved
            achievedAt
        }
    }
}
`;

export const CREATE_FAQ = gql`
	mutation CreateFaq ($input:FaqInput!){
    createFaq(input: $input) {
        _id
        faqCategory
        faqStatus
        question
        answer
        keywords
        relatedWorkouts
        relatedMealPlans
        viewCount
        helpfulCount
        notHelpfulCount
        createdBy
        displayOrder
        createdAt
        updatedAt
    }
}
`;

export const MARK_FAQ_HELPFUL = gql`
	mutation MarkFaqHelpful($faqId: String!, $helpful: Boolean!) {
	markFaqHelpful(faqId: $faqId, helpful: $helpful) {
	  _id
	  faqCategory
	  faqStatus
	  question
	  answer
	  keywords
	  relatedWorkouts
	  relatedMealPlans
	  viewCount
	  helpfulCount
	  notHelpfulCount
	  createdBy
	  displayOrder
	  createdAt
	  updatedAt
	}
  }
  
`;

export const CREATE_EXERCISE = gql`
	mutation CreateExercise ($input: ExerciseInput!){
    createExercise(input: $input) {
        _id
        exerciseName
        exerciseType
        exerciseStatus
        targetMuscles
        secondaryMuscles
        exerciseDesc
        exerciseInstructions
        exerciseEquipment
        exerciseImage
        exerciseVideo
        exerciseGif
        exerciseDifficulty
        exerciseViews
        exerciseLikes
        exerciseRating
        exerciseTips
        exerciseWarnings
        commonMistakes
        createdBy
        exerciseTags
        deletedAt
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;


export const UPDATE_EXERCISE = gql`
	mutation UpdateExercise ($input: ExerciseUpdate!){
    updateExercise(input: $input) {
        _id
        exerciseName
        exerciseType
        exerciseStatus
        targetMuscles
        secondaryMuscles
        exerciseDesc
        exerciseInstructions
        exerciseEquipment
        exerciseImage
        exerciseVideo
        exerciseGif
        exerciseDifficulty
        exerciseViews
        exerciseLikes
        exerciseRating
        exerciseTips
        exerciseWarnings
        commonMistakes
        createdBy
        exerciseTags
        deletedAt
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}

`;

export const CREATE_MEAL_PLAN = gql`
	mutation CreateMealPlan ($input:MealPlanInput!){
    createMealPlan(input: $input) {
        _id
        mealPlanTitle
        mealPlanStatus
        mealPlanDesc
        nutritionGoal
        dietaryPreference
        duration
        calorieTarget
        createdBy
        mealPlanViews
        mealPlanLikes
        mealPlanRating
        mealPlanFollowers
        isPremium
        price
        deletedAt
        createdAt
        updatedAt
        macros {
            protein
            carbs
            fats
        }
        meals {
            day
            mealType
            mealName
            ingredients
            instructions
            calories
            protein
            carbs
            fats
            imageUrl
        }
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;

export const CREATE_PROGRESS = gql`
	mutation CreateProgress($input:ProgressInput!) {
    createProgress(input: $input) {
        _id
        memberId
        progressType
        value
        unit
        photoUrl
        workoutId
        exerciseId
        notes
        measurementDate
        createdAt
        updatedAt
        bodyMeasurements {
            chest
            waist
            hips
            biceps
            thighs
            calves
        }
    }
}
`;

export const CREATE_PAYMENT = gql`
	mutation CreatePayment ($input:PaymentInput!){
    createPayment(input: $input) {
        _id
        memberId
        transactionType
        paymentStatus
        paymentMethod
        amount
        currency
        subscriptionId
        bookingId
        propertyId
        mealPlanId
        stripePaymentId
        paypalTransactionId
        receiptUrl
        invoiceNumber
        refundAmount
        refundReason
        refundedAt
        description
        paidAt
        failedAt
        failureReason
        createdAt
        updatedAt
    }
}

`;

export const UPDATE_PAYMENT_DUPLICATE = gql`
	mutation UpdatePayment ($input:PaymentInput!){
    createPayment(input: $input) {
        _id
        memberId
        transactionType
        paymentStatus
        paymentMethod
        amount
        currency
        subscriptionId
        bookingId
        propertyId
        mealPlanId
        stripePaymentId
        paypalTransactionId
        receiptUrl
        invoiceNumber
        refundAmount
        refundReason
        refundedAt
        description
        paidAt
        failedAt
        failureReason
        createdAt
        updatedAt
    }
}

`;

export const UPDATE_PAYMENT = gql`
	mutation UpdatePayment ($input:PaymentUpdate!){
    updatePayment(input: $input) {
        _id
        memberId
        transactionType
        paymentStatus
        paymentMethod
        amount
        currency
        subscriptionId
        bookingId
        propertyId
        mealPlanId
        stripePaymentId
        paypalTransactionId
        receiptUrl
        invoiceNumber
        refundAmount
        refundReason
        refundedAt
        description
        paidAt
        failedAt
        failureReason
        createdAt
        updatedAt
    }
}
`;

export const CREATE_CHALLENGE = gql`
	mutation CreateChallenge($input:ChallengeInput!) {
    createChallenge(input: $input) {
        _id
        challengeTitle
        challengeType
        challengeStatus
        challengeDifficulty
        challengeDesc
        challengeImage
        targetValue
        targetUnit
        startDate
        endDate
        createdBy
        participantCount
        completionCount
        rewardBadge
        rewardPoints
        isCommunity
        challengeRules
        deletedAt
        createdAt
        updatedAt
        participants {
            memberId
            joinedAt
            currentProgress
            completed
            completedAt
        }
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}


`;

export const JOIN_CHALLENGE = gql`
	mutation JoinChallenge($input:String!) {
    joinChallenge(challengeId: $input) {
        _id
        challengeTitle
        challengeType
        challengeStatus
        challengeDifficulty
        challengeDesc
        challengeImage
        targetValue
        targetUnit
        startDate
        endDate
        createdBy
        participantCount
        completionCount
        rewardBadge
        rewardPoints
        isCommunity
        challengeRules
        deletedAt
        createdAt
        updatedAt
        participants {
            memberId
            joinedAt
            currentProgress
            completed
            completedAt
        }
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}

`;

export const RECORD_VIEW = gql`
	mutation RecordView ($input:ViewInput!){
    recordView(input: $input)
}

`;


export const CREATE_WORKOUT = gql`
	mutation CreateWorkout ($input:WorkoutInput!){
    createWorkout(input: $input) {
        _id
        workoutTitle
        workoutCategory
        workoutDifficulty
        workoutDuration
        workoutEquipment
        workoutStatus
        workoutDesc
        workoutImage
        workoutVideo
        workoutExercises
        workoutCaloriesBurn
        workoutViews
        workoutLikes
        workoutComments
        workoutRating
        workoutCompletions
        workoutRank
        createdBy
        workoutTags
        isPremium
        deletedAt
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;

export const UPDATE_WORKOUT = gql`
	mutation UpdateWorkout($input:WorkoutUpdate!) {
    updateWorkout(input: $input) {
        _id
        workoutTitle
        workoutCategory
        workoutDifficulty
        workoutDuration
        workoutEquipment
        workoutStatus
        workoutDesc
        workoutImage
        workoutVideo
        workoutExercises
        workoutCaloriesBurn
        workoutViews
        workoutLikes
        workoutComments
        workoutRating
        workoutCompletions
        workoutRank
        createdBy
        workoutTags
        isPremium
        deletedAt
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;

export const LIKE_TARGET_WORKOUT = gql`
	mutation LikeTargetWorkout($input:String!) {
    likeTargetWorkout(workoutId: $input) {
        _id
        workoutTitle
        workoutCategory
        workoutDifficulty
        workoutDuration
        workoutEquipment
        workoutStatus
        workoutDesc
        workoutImage
        workoutVideo
        workoutExercises
        workoutCaloriesBurn
        workoutViews
        workoutLikes
        workoutComments
        workoutRating
        workoutCompletions
        workoutRank
        createdBy
        workoutTags
        isPremium
        deletedAt
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;


export const CREATE_SUBSCRIPTION = gql`
	mutation CreateSubscription($input:SubscriptionInput!) {
    createSubscription(input:$input) {
        _id
        memberId
        subscriptionPlan
        subscriptionPeriod
        subscriptionStatus
        subscriptionDiscount
        basePrice
        discountPercentage
        finalPrice
        startDate
        endDate
        trialEndDate
        cancelledAt
        lastPaymentDate
        nextPaymentDate
        autoRenewal
        paymentMethodId
        subscriptionNotes
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}

`;


export const SUBSCRIBE_DUPLICATE = gql`
	mutation subscribe ($input:String!){
    subscribe(input: $input) {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        meLiked {
            memberId
            likeRefId
            myFavorite
        }
        meFollowed {
            followingId
            followerId
            myFollowing
        }
        followerData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;

export const CANCEL_SUBSCRIPTION = gql`
	mutation CancelSubscription ($input:String!){
    cancelSubscription(subscriptionId: $input) { 
        _id
        memberId
        subscriptionPlan
        subscriptionPeriod
        subscriptionStatus
        subscriptionDiscount
        basePrice
        discountPercentage
        finalPrice
        startDate
        endDate
        trialEndDate
        cancelledAt
        lastPaymentDate
        nextPaymentDate
        autoRenewal
        paymentMethodId
        subscriptionNotes
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;



export const UPDATE_SUBSCRIPTION = gql`
	mutation UpdateSubscription($input:SubscriptionUpdate!) {
    updateSubscription(input: $input) {
        _id
        memberId
        subscriptionPlan
        subscriptionPeriod
        subscriptionStatus
        subscriptionDiscount
        basePrice
        discountPercentage
        finalPrice
        startDate
        endDate
        trialEndDate
        cancelledAt
        lastPaymentDate
        nextPaymentDate
        autoRenewal
        paymentMethodId
        subscriptionNotes
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;


export const CREATE_BOOKING = gql`
	mutation CreateBooking ($input: BookingInput!){ 
    createBooking(input: $input) {
        _id
        bookingType
        bookingStatus
        clientId
        providerId
        propertyId
        serviceId
        bookingDate
        bookingTime
        sessionDuration
        bookingPrice
        paymentId
        bookingNotes
        providerNotes
        meetingLink
        cancellationReason
        cancelledBy
        cancelledAt
        completedAt
        reviewId
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
	`;


export const UPDATE_BOOKING = gql`
	mutation UpdateBooking ($input: BookingUpdate!){ 
    updateBooking(input: $input) {
        _id
        bookingType
        bookingStatus
        clientId
        providerId
        propertyId
        bookingDate
        bookingTime
        sessionDuration
        bookingPrice
        paymentId
        bookingNotes
        providerNotes
        meetingLink
        cancellationReason
        cancelledBy
        cancelledAt
        completedAt
        reviewId
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;



export const CREATE_REVIEW = gql`
	mutation CreateReview ($input:ReviewInput!){
    createReview(input: $input) {
        _id
        reviewGroup
        reviewStatus
        reviewerId
        propertyId
        trainerId
        workoutId
        mealPlanId
        bookingId
        rating
        reviewTitle
        reviewContent
        reviewImages
        helpfulCount
        notHelpfulCount
        flaggedCount
        flagReason
        moderatedBy
        moderatedAt
        deletedAt
        createdAt
        updatedAt
        response {
            responderId
            responseText
            respondedAt
        }
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
	
`;


export const UPDATE_REVIEW = gql`
	mutation UpdateReview ($input:ReviewUpdate!){ 
    updateReview(input: $input) {
        _id
        reviewGroup
        reviewStatus
        reviewerId
        propertyId
        trainerId
        workoutId
        mealPlanId
        bookingId
        rating
        reviewTitle
        reviewContent
        reviewImages
        helpfulCount
        notHelpfulCount
        flaggedCount
        flagReason
        moderatedBy
        moderatedAt
        deletedAt
        createdAt
        updatedAt
        response {
            responderId
            responseText
            respondedAt
        }
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;



export const DELETE_REVIEW = gql`
	mutation DeleteReview($input:String!) { 
    deleteReview(reviewId: $input) {
        _id
        reviewGroup
        reviewStatus
        reviewerId
        propertyId
        trainerId
        workoutId
        mealPlanId
        bookingId
        rating
        reviewTitle
        reviewContent
        reviewImages
        helpfulCount
        notHelpfulCount
        flaggedCount
        flagReason
        moderatedBy
        moderatedAt
        deletedAt
        createdAt
        updatedAt
        response {
            responderId
            responseText
            respondedAt
        }
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
} 
	`;

export const CREATE_INQUIRY = gql`
	mutation CreateInquiry ($input:InquiryInput!){
    createInquiry(input: $input) {
        _id
        userId
        inquiryCategory
        inquiryStatus
        inquiryPriority
        subject
        question
        aiResponse
        aiConfidence
        wasAiHelpful
        suggestedFaqs
        humanResponse
        respondedBy
        respondedAt
        resolvedAt
        closedAt
        createdAt
        updatedAt
        conversation {
            sender
            message
            isAI
            timestamp
        }
    }
}
`;

export const RESPOND_TO_INQUIRY = gql`
	mutation RespondToInquiry ($input:RespondToInquiryInput!){
    respondToInquiry(input: $input) {
        _id
        userId
        inquiryCategory
        inquiryStatus
        inquiryPriority
        subject
        question
        aiResponse
        aiConfidence
        wasAiHelpful
        suggestedFaqs
        humanResponse
        respondedBy
        respondedAt
        resolvedAt
        closedAt
        createdAt
        updatedAt
        conversation {
            sender
            message
            isAI
            timestamp
        }
    }
}

`;

export const RESOLVE_INQUIRY = gql`
	mutation ResolveInquiry($input:String!) { 
    resolveInquiry(inquiryId: $input) {
        _id
        userId
        inquiryCategory
        inquiryStatus
        inquiryPriority
        subject
        question
        aiResponse
        aiConfidence
        wasAiHelpful
        suggestedFaqs
        humanResponse
        respondedBy
        respondedAt
        resolvedAt
        closedAt
        createdAt
        updatedAt
        conversation {
            sender
            message
            isAI
            timestamp
        }
    }
}

`;






export const UPDATE_BOARD_ARTICLE_DUPLICATE = gql`
	mutation UpdateBoardArticle ($input:BoardArticleUpdate!){
    updateBoardArticle(input: $input) {
        _id
        articleCategory
        articleStatus
        articleTitle
        articleContent
        articleImage
        articleViews
        articleLikes
        articleComments
        memberId
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;


export const UPDATE_GOAL = gql`
mutation UpdateGoal($input:GoalUpdate!) {
    updateGoal(input: $input) {
        _id
        memberId
        goalType
        goalStatus
        goalTitle
        goalDesc
        targetValue
        currentValue
        unit
        startDate
        targetDate
        achievedAt
        progressPercentage
        createdAt
        updatedAt
        milestones {
            value
            achieved
            achievedAt
        }
    }
}
`;


export const DELETE_GOAL = gql`
mutation DeleteGoal ($input:String!){
    deleteGoal(goalId: $input) {
        _id
        memberId
        goalType
        goalStatus
        goalTitle
        goalDesc
        targetValue
        currentValue
        unit
        startDate
        targetDate
        achievedAt
        progressPercentage
        createdAt
        updatedAt
        milestones {
            value
            achieved
            achievedAt
        }
    }
}
`;


export const DELETE_PROGRESS = gql`
mutation DeleteProgress($input:String!) {
    deleteProgress(progressId: $input) {
        _id
        memberId
        progressType
        value
        unit
        photoUrl
        workoutId
        exerciseId
        notes
        measurementDate
        createdAt
        updatedAt
        bodyMeasurements {
            chest
            waist
            hips
            biceps
            thighs
            calves
        }
    }
}
`;



export const CANCEL_BOOKING = gql`
mutation CancelBooking($input:String!) {
    cancelBooking(bookingId: $input) {
        _id
        bookingType
        bookingStatus
        clientId
        providerId
        propertyId
        bookingDate
        bookingTime
        sessionDuration
        bookingPrice
        paymentId
        bookingNotes
        providerNotes
        meetingLink
        cancellationReason
        cancelledBy
        cancelledAt
        completedAt
        reviewId
        createdAt
        updatedAt
    }
}
`;


export const UPDATE_BOOKING_DUPLICATE = gql`
mutation UpdateBooking ($input:BookingUpdate!){
    updateBooking(input: $input) {
        _id
        bookingType
        bookingStatus
        clientId
        providerId
        propertyId
        bookingDate
        bookingTime
        sessionDuration
        bookingPrice
        paymentId
        bookingNotes
        providerNotes
        meetingLink
        cancellationReason
        cancelledBy
        cancelledAt
        completedAt
        reviewId
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;

export const DELETE_BOOKING = gql`
mutation DeleteBooking($input:String!) {
    deleteBooking(bookingId: $input) {
        _id
        bookingType
        bookingStatus
        clientId
        providerId
        propertyId
        bookingDate
        bookingTime
        sessionDuration
        bookingPrice
        paymentId
        bookingNotes
        providerNotes
        meetingLink
        cancellationReason
        cancelledBy
        cancelledAt
        completedAt
        reviewId
        deletedAt
        createdAt
        updatedAt
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;




/**************************
 *      NOTIFICATION       *
 *************************/

export const MARK_NOTIFICATION_AS_READ = gql`
mutation MarkNotificationAsRead($input: NotificationMarkAsReadInput!) {
    markNotificationAsRead(input: $input) {
        _id
        notificationStatus
        updatedAt
    }
}
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead {
        success
        updatedCount
    }
}
`;

export const DELETE_NOTIFICATION = gql`
mutation DeleteNotification($input: NotificationDeleteInput!) {
    deleteNotification(input: $input) {
        _id
    }
}
`;

export const CREATE_NOTIFICATION = gql`
mutation CreateNotification($input:NotificationInput!) {
    createNotification(input: $input) {
        _id
        notificationType
        notificationStatus
        notificationGroup
        notificationTitle
        notificationDesc
        authorId
        receiverId
        propertyId
        articleId
        createdAt
        updatedAt
        authorData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;

export const READ_NOTIFICATION = gql`
mutation ReadNotification($notificationId: String!) {
    readNotification(notificationId: $notificationId) {
        _id
        notificationType
        notificationStatus
        notificationGroup
        notificationTitle
        notificationDesc
        authorId
        receiverId
        propertyId
        articleId
        createdAt
        updatedAt
        authorData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
        notificationRefId
        notificationMessage
        notificationUrl
        memberId
        actionMemberId
        actionMemberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
        memberData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
        relatedCommentData {
            _id
            commentStatus
            commentGroup
            commentContent
            commentRefId
            memberId
            parentCommentId
            createdAt
            updatedAt
        }
    }
}

`;

export const UPDATE_SUPPLEMENT = gql`
mutation UpdateSupplement($input:SupplementUpdate!) {
    updateSupplement(input: $input) {
        _id
        name
        category
        description
        recommendedDosage
        keyBenefits
        bestFor
        rating
        usageNotes
        createdAt
        updatedAt
    }
}
`;



export const UPDATE_SERVICE = gql`
mutation UpdateService($input:ServiceUpdate!) {
    updateService(input: $input) {
        _id
        title
        description
        bookingType
        pricePerHour
        fixedPrice
        durationOptions
        status
        createdAt
        updatedAt
    }
}
    `;

export const CREATE_SERVICE = gql`
mutation CreateService ($input:ServiceInput!){ 
        createService(input: $input) {
            _id
            title
            description
            bookingType
            pricePerHour
            fixedPrice
            durationOptions
            status
            createdAt
            updatedAt
        }
    }
    
 `;


export const DELETE_SERVICE = gql`
mutation DeleteService($input:String!) {
    deleteService(serviceId: $input) {
        _id
        title
        description
        bookingType
        pricePerHour
        fixedPrice
        durationOptions
        status
        createdAt
        updatedAt
    }
}


 `;





 export const ADD_SUPPLEMENT_TO_BOOKING = gql`
 mutation AddSupplementToBooking ($input:BookingSupplementInput!){
    addSupplementToBooking(input: $input) {
        _id
        bookingId
        supplementId
        quantity
        unitPrice
        totalPrice
        notes
        recommendedBy
        createdAt
        updatedAt
        bookingData {
            _id
            bookingType
            bookingStatus
            clientId
            providerId
            propertyId
            bookingDate
            bookingTime
            sessionDuration
            bookingPrice
            paymentId
            bookingNotes
            providerNotes
            meetingLink
            cancellationReason
            cancelledBy
            cancelledAt
            completedAt
            reviewId
            deletedAt
            createdAt
            updatedAt
        }
        supplementData {
            _id
            name
            category
            description
            recommendedDosage
            keyBenefits
            bestFor
            rating
            usageNotes
            createdAt
            updatedAt
        }
        recommenderData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}

`;

export const REMOVE_SUPPLEMENT_FROM_BOOKING = gql`
mutation RemoveSupplementFromBooking ($input:String!){    
    removeSupplementFromBooking(bookingId: $input, supplementId: $input)
}
`;



export const SET_TRAINER_AVAILABILITY = gql`
mutation SetTrainerAvailability($input:TrainerAvailabilitySlotInput!) {
    setTrainerAvailability(input: $input) {
        _id
        trainerId
        dayOfWeek
        specificDate
        startTime
        endTime
        availabilityType
        isBlocked
        notes
        createdAt
        updatedAt
        trainerData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}


`;

export const PROCESS_BOOKING_PAYMENT = gql`
mutation ProcessBookingPayment($input:ProcessBookingPaymentInput!) {
    processBookingPayment(input: $input) {
        _id
        memberId
        transactionType
        paymentStatus
        paymentMethod
        amount
        currency
        subscriptionId
        bookingId
        propertyId
        mealPlanId
        stripePaymentId
        paypalTransactionId
        receiptUrl
        invoiceNumber
        refundAmount
        refundReason
        refundedAt
        description
        paidAt
        failedAt
        failureReason
        createdAt
        updatedAt
    }
}

`;

export const ADD_TO_WAITLIST = gql`
mutation AddToWaitlist($input:WaitlistInput!) {
    addToWaitlist(input: $input) {
        _id
        bookingId
        clientId
        priority
        status
        notifiedAt
        convertedAt
        notes
        createdAt
        updatedAt
        bookingData {
            _id
            bookingType
            bookingStatus
            clientId
            providerId
            propertyId
            bookingDate
            bookingTime
            sessionDuration
            bookingPrice
            paymentId
            bookingNotes
            providerNotes
            meetingLink
            cancellationReason
            cancelledBy
            cancelledAt
            completedAt
            reviewId
            deletedAt
            createdAt
            updatedAt
        }
        clientData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}

`;

export const REMOVE_FROM_WAITLIST = gql`
mutation RemoveFromWaitlist($input:String!) {
    removeFromWaitlist(waitlistId: $input)
}

`;

export const CONVERT_WAITLIST_TO_BOOKING = gql`
mutation ConvertWaitlistToBooking($input:String!){
    convertWaitlistToBooking(waitlistId: $input) {
        _id
        bookingId
        clientId
        priority
        status
        notifiedAt
        convertedAt
        notes
        createdAt
        updatedAt
        bookingData {
            _id
            bookingType
            bookingStatus
            clientId
            providerId
            propertyId
            bookingDate
            bookingTime
            sessionDuration
            bookingPrice
            paymentId
            bookingNotes
            providerNotes
            meetingLink
            cancellationReason
            cancelledBy
            cancelledAt
            completedAt
            reviewId
            deletedAt
            createdAt
            updatedAt
        }
        clientData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
    }
}
`;



export const SYNC_BOOKING_TO_CALENDAR = gql`
mutation SyncBookingToCalendar ($input:String!){
    syncBookingToCalendar(bookingId: $input, calendarType: $input) {
        success
        calendarEventId
        calendarUrl
    }
}


`;


export const CREATE_RECURRING_BOOKING = gql`
mutation CreateRecurringBooking ($input:RecurringBookingInput!){
    createRecurringBooking(input:$input) {
        _id
        bookingType
        clientId
        providerId
        propertyId
        serviceId
        recurrencePattern
        dayOfWeek
        startTime
        sessionDuration
        bookingPrice
        startDate
        endDate
        occurrences
        status
        bookingNotes
        meetingLink
        exceptionDates
        generatedBookingIds
        createdAt
        updatedAt
        clientData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
        providerData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
        generatedBookings {
            _id
            bookingType
            bookingStatus
            clientId
            providerId
            propertyId
            bookingDate
            bookingTime
            sessionDuration
            bookingPrice
            paymentId
            bookingNotes
            providerNotes
            meetingLink
            cancellationReason
            cancelledBy
            cancelledAt
            completedAt
            reviewId
            deletedAt
            createdAt
            updatedAt
        }
    }
}


`;

export const UPDATE_RECURRING_BOOKING = gql`
mutation UpdateRecurringBooking($input:RecurringBookingUpdate!) {
    updateRecurringBooking(input: $input) {
        _id
        bookingType
        clientId
        providerId
        propertyId
        serviceId
        recurrencePattern
        dayOfWeek
        startTime
        sessionDuration
        bookingPrice
        startDate
        endDate
        occurrences
        status
        bookingNotes
        meetingLink
        exceptionDates
        generatedBookingIds
        createdAt
        updatedAt
        clientData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
        providerData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
        generatedBookings {
            _id
            bookingType
            bookingStatus
            clientId
            providerId
            propertyId
            bookingDate
            bookingTime
            sessionDuration
            bookingPrice
            paymentId
            bookingNotes
            providerNotes
            meetingLink
            cancellationReason
            cancelledBy
            cancelledAt
            completedAt
            reviewId
            deletedAt
            createdAt
            updatedAt
        }
    }
}


`;

export const CANCEL_RECURRING_BOOKING = gql`
mutation CancelRecurringBooking($input:String!) {
    cancelRecurringBooking(recurringBookingId: $input) {
        _id
        bookingType
        clientId
        providerId
        propertyId
        serviceId
        recurrencePattern
        dayOfWeek
        startTime
        sessionDuration
        bookingPrice
        startDate
        endDate
        occurrences
        status
        bookingNotes
        meetingLink
        exceptionDates
        generatedBookingIds
        createdAt
        updatedAt
        clientData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
        providerData {
            _id
            memberType
            memberStatus
            memberAuthType
            memberPhone
            memberNick
            memberFullName
            memberImage
            memberAddress
            memberDesc
            memberProperties
            memberArticles
            memberFollowers
            memberFollowings
            memberPoints
            memberLikes
            memberViews
            memberComments
            memberRank
            memberBlocks
            memberWarnings
            memberWorkouts
            memberChallenges
            memberAchievements
            trainerRating
            trainerExperience
            trainerSpecialties
            trainerCertifications
            trainerBio
            subscriptionId
            deletedAt
            createdAt
            updatedAt
            accessToken
        }
        generatedBookings {
            _id
            bookingType
            bookingStatus
            clientId
            providerId
            propertyId
            bookingDate
            bookingTime
            sessionDuration
            bookingPrice
            paymentId
            bookingNotes
            providerNotes
            meetingLink
            cancellationReason
            cancelledBy
            cancelledAt
            completedAt
            reviewId
            deletedAt
            createdAt
            updatedAt
        }
    }
}
`;

/**************************
 *   ROUTINE ASSIGNMENTS  *
 *************************/

export const ASSIGN_MEAL_PLAN_TO_USER = gql`
	mutation AssignMealPlanToUser($input: AssignRoutineInput!) {
		assignMealPlanToUser(input: $input) {
			_id
			trainerId
			userId
			routineType
			routineId
			status
			startDate
			endDate
			trainerNotes
			priority
			createdAt
			updatedAt
		}
	}
`;

export const ASSIGN_WORKOUT_TO_USER = gql`
	mutation AssignWorkoutToUser($input: AssignRoutineInput!) {
		assignWorkoutToUser(input: $input) {
			_id
			trainerId
			userId
			routineType
			routineId
			status
			startDate
			endDate
			trainerNotes
			priority
			createdAt
			updatedAt
		}
	}
`;

export const MARK_ROUTINE_COMPLETE = gql`
	mutation MarkRoutineComplete($input: MarkRoutineCompleteInput!) {
		markRoutineComplete(input: $input) {
			_id
			userId
			routineType
			routineId
			assignmentId
			completionDate
			completionPercentage
			notes
			rating
			eligibleForBonus
			createdAt
			updatedAt
		}
	}
`;


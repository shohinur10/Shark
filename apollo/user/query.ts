import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_TRAINERS = gql`
query GetTrainers($input:TrainersInquiry!) {
    getTrainers(input: $input) {
        list {
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
        metaCounter {
            total
        }
    }
}

`;


export const GET_MEMBER = gql(`
query GetMember ($input:String!){
    getMember(memberId: $input) {
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

`);


/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
query GetBoardArticle($input: String!) {
    getBoardArticle(articleId: $input) {
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
}

`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
    getBoardArticles(input: $input) {
        list {
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
        metaCounter {
            total
        }
    }
}

`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
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
					memberWarnings
					memberBlocks
					memberProperties
					memberRank
					memberPoints
					memberLikes
					memberViews
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input:FollowInquiry!) {
    getMemberFollowers(input: $input) {
        list {
            _id
            followingId
            followerId
            createdAt
            updatedAt
        }
        metaCounter {
            total
        }
    }
}

`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings ($input:FollowInquiry!){
    getMemberFollowings(input: $input) {
        list {
            _id
            followingId
            followerId
            createdAt
            updatedAt
        }
        metaCounter {
            total
        }
    }
}

`;



export const GET_ACHIEVEMENT = gql`
query GetAchievement($input:String!) {
    getAchievement(achievementId: $input) {
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


export const GET_ACHIEVEMENTS = gql`
query GetAchievements ($input: AchievementsInquiry!){
    getAchievements(input: $input) {
        list {
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
        metaCounter {
            total
        }
    }
}
`;


export const GET_GOAL = gql`
query GetGoal($input:String!) {
    getGoal(goalId: $input) {
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


export const GET_GOALS = gql`
query GetGoals($input:GoalsInquiry!) {
    getGoals(input: $input) {
        list {
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
        }
        metaCounter {
            total
        }
    }
}
`;

export const GET_FAQ = gql`
query GetFaq ($input:String!){
    getFaq(faqId: $input) {
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


export const GET_FAQS = gql`
query GetFaqs($input:FaqsInquiry!) {
    getFaqs(input: $input) {
        list {
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
        metaCounter {
            total
        }
    }
}
`;



export const GET_EXERCISE = gql`
query GetExercise($input:String!) {
    getExercise(exerciseId: $input) {
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

export const GET_EXERCISES = gql`
query GetExercises($input: ExercisesInquiry!) {
    getExercises(input: $input) {
        list {
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
        }
        metaCounter {
            total
        }
    }
}
`;

export const GET_MEAL_PLAN = gql`
query GetMealPlan ($input:String!){
    getMealPlan(mealPlanId: $input) {
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

export const GET_MEAL_PLANS = gql`
query GetMealPlans ($input:MealPlansInquiry!){
    getMealPlans(input: $input) {
        list {
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
        metaCounter {
            total
        }
    }
}
`;

export const GET_FAVORITES_DUPLICATE = gql`
query GetFavorites ($input:OrdinaryInquiry!){
    getFavorites(input: $input) {
        list {
            _id
            propertyType
            propertyStatus
            propertyLocation
            propertyAddress
            propertyTitle
            propertyPrice
            priceType
            womenDiscountPercent
            childrenDiscountPercent
            childrenAgeLimit
            extraClassDiscountPercent
            perClassPrice
            propertyCapacity
            propertyEquipmentList
            propertyAmenities
            propertyOperatingHours
            propertyRating
            propertyViews
            propertyLikes
            propertyComments
            propertyRank
            propertyImages
            propertyDesc
            propertyRent
            propertyCondition
            deletedAt
            createdAt
            updatedAt
            memberId
        }
        metaCounter {
            total
        }
    }
}
`;

export const GET_VISITED_DUPLICATE = gql`
query GetVisited ($input:OrdinaryInquiry!){
    getVisited(input: $input) {
        list {
            _id
            propertyType
            propertyStatus
            propertyLocation
            propertyAddress
            propertyTitle
            propertyPrice
            priceType
            womenDiscountPercent
            childrenDiscountPercent
            childrenAgeLimit
            extraClassDiscountPercent
            perClassPrice
            propertyCapacity
            propertyEquipmentList
            propertyAmenities
            propertyOperatingHours
            propertyRating
            propertyViews
            propertyLikes
            propertyComments
            propertyRank
            propertyImages
            propertyDesc
            propertyRent
            propertyCondition
            deletedAt
            createdAt
            updatedAt
            memberId
        }
        metaCounter {
            total
        }
    }
}
`;

export const GET_PROGRESS = gql`
query GetProgress ($input:String!){
    getProgress(progressId: $input) {
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

export const GET_CHALLENGE = gql`
query GetChallenge ($input:String!){
    getChallenge(challengeId: $input) {
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

export const GET_CHALLENGES = gql`
query GetChallenges($input:ChallengesInquiry!) {
    getChallenges(input: $input) {
        list {
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
        }
        metaCounter {
            total
        }
    }
}
`;


export const GET_VISITED_WORKOUTS = gql`
query GetVisitedWorkouts($input:OrdinaryInquiry!) {
    getVisitedWorkouts(input: $input) {
        list {
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
        metaCounter {
            total
        }
    }
}
`;

export const GET_VISITED_MEAL_PLANS = gql`
query GetVisitedMealPlans($input:OrdinaryInquiry!) {
    getVisitedMealPlans(input: $input) {
        list {
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
        }
        metaCounter {
            total
        }
    }
}
`;

export const GET_WORKOUT = gql`
query GetWorkout ($input:String!){
    getWorkout(workoutId: $input) {
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

export const GET_WORKOUTS = gql`
query GetWorkouts($input:WorkoutsInquiry!) {
    getWorkouts(input: $input) {
        list {
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
        metaCounter {
            total
        }
    }
}
`;

export const GET_TRAINER_WORKOUTS = gql`
query GetTrainerWorkouts ($input:TrainerWorkoutsInquiry!){
    getTrainerWorkouts(input: $input) {
        list {
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
        metaCounter {
            total
        }
    }
}
`;

export const GET_FAVORITE_WORKOUTS = gql`
query GetFavoriteWorkouts($input:OrdinaryInquiry!) {
    getFavoriteWorkouts(input: $input) {
        list {
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
        metaCounter {
            total
        }
    }
}
`;

export const GET_VISITED_WORKOUTS_DUPLICATE = gql`
query GetVisitedWorkouts($input:OrdinaryInquiry!) {
    getVisitedWorkouts(input: $input) {
        list {
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
        }
        metaCounter {
            total
        }
    }
}
`;

export const GET_REVIEW = gql`
query GetReview ($input:String!){
    getReview(reviewId: $input) {
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

export const GET_REVIEWS = gql`
query GetReviews ($input:ReviewsInquiry!){
    getReviews(input: $input) {
        list {
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
        }
        metaCounter {
            total
        }
    }
}
`;

export const ASK_QUESTION = gql`
query AskQuestion($input:AskQuestionInput!) {
    askQuestion(input: $input) {
        answer
        confidence
        needsHumanSupport
        suggestedFaqs {
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
}
`;

export const GET_MY_INQUIRY = gql`
query GetMyInquiry($input:String!) {
    getMyInquiry(inquiryId: $input) {
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






export const GET_BOOKINGS = gql`
query GetBookings($input:BookingsInquiry!) {
    getBookings(input: $input) {
        list {
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
            }
        }
        metaCounter {
            total
        }
    }
}
`;

export const GET_BOOKING = gql`
query GetBooking ($input:String!){
    getBooking(bookingId: $input) {
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


export const GET_PAYMENT = gql`
query GetPayment($input:String!) {
    getPayment(paymentId: $input) {
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

export const GET_PROGRESSES = gql`
query GetProgresses ($input:ProgressesInquiry!){
    getProgresses(input: $input) {
        list {
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
        }
        metaCounter {
            total
        }
    }
}
`;


/**************************
 *      NOTIFICATION       *
 *************************/

export const GET_NOTIFICATIONS = gql`
query GetNotifications($input: NotificationsInquiry!) {
    getMyNotifications(input: $input) {
        list {
            _id
            notificationType
            notificationStatus
            notificationGroup
            notificationTitle
            notificationDesc
            notificationRefId
            notificationMessage
            notificationUrl
            authorId
            receiverId
            memberId
            actionMemberId
            propertyId
            articleId
            createdAt
            updatedAt
            authorData {
                _id
                memberNick
                memberFullName
                memberImage
            }
            actionMemberData {
                _id
                memberNick
                memberFullName
                memberImage
            }
            memberData {
                _id
                memberNick
                memberFullName
                memberImage
            }
        }
        metaCounter {
            total
            totalCount
            unreadCount
        }
    }
}
`;

export const GET_UNREAD_NOTIFICATION_COUNT = gql`
query GetUnreadNotificationCount {
    getUnreadNotificationCount
}
`;

export const GET_MY_NOTIFICATIONS = gql`
query GetMyNotifications ($input:NotificationsInquiry!){
    getMyNotifications(input: $input) {
        list {
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
        }
        metaCounter {
            total
        }
    }
}
`;

/**************************
 *      SUPPLEMENTS       *
 *************************/

export const GET_SUPPLEMENTS = gql`
query GetSupplements($input: SupplementsInquiry!) {
    getSupplements(input: $input) {
        list {
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
        metaCounter {
            total
        }
    }
}
`;

/**************************
 *         SERVICE        *
 *************************/

export const GET_SERVICE = gql`
query GetService ($input:String!){ 
    getService(serviceId: $input) {
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

export const GET_ALL_SERVICES = gql`
query GetAllServices ($input:ServicesInquiry!){
    getAllServices(input:$input) {
        list {
            _id
            title
            description
            bookingType
            difficulty
            pricePerHour
            fixedPrice
            durationOptions
            status
            createdAt
            updatedAt
        }
        metaCounter {
            total
        }
    }
}
`;

export const GET_TRAINER_AVAILABILITY = gql`
query GetTrainerAvailability($trainerId: String!, $date: String!) {
    getTrainerAvailability(trainerId: $trainerId, date: $date) {
        availableSlots
    }
}
`;
export const GET_BOOKING_STATS = gql`
query GetBookingStats($input:BookingStatsInput!) { 
    getBookingStats(input: $input) {
        totalBookings
        totalRevenue
        confirmedBookings
        cancelledBookings
        completedBookings
        cancellationRate
        averageBookingValue
        popularTimeSlots
        noShowCount
        noShowRate
    }
}

`;


export const GET_SERVICE_STATS = gql`
query GetServiceStats($input:String!) {
    getServiceStats(serviceId: $input) {
        serviceId
        serviceTitle
        bookingCount
        totalRevenue
        averageBookingValue
    }
}
`;

export const GET_TRAINER_STATS = gql`
query GetTrainerStats ($input:String!){
    getTrainerStats(trainerId: $input) {
        trainerId
        totalBookings
        totalRevenue
        averageRating
        completedBookings
        cancelledBookings
        clientRetentionRate
    }
}
`;

export const GET_BOOKING_SUPPLEMENTS = gql`
query GetBookingSupplements($input:String!) {
    getBookingSupplements(bookingId: $input) {
        list {
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
        }
    }
}
`;

export const GET_RECOMMENDED_SUPPLEMENTS = gql`
query GetRecommendedSupplements($input:RecommendedSupplementsInput!) {
    getRecommendedSupplements(input: $input) {
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




export const GET_TRAINER_SCHEDULE = gql`
query GetTrainerSchedule ($input:TrainerScheduleInput!){
    getTrainerSchedule(input: $input) {
        trainerId
        startDate
        endDate
        availabilitySlots {
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
        }
        bookings {
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


export const GET_PAYMENT_STATUS = gql`
query GetPaymentStatus ($input:String!){
    getPaymentStatus(bookingId: $input) {
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




export const GET_WAITLIST = gql`
query GetWaitlist($input:String!) {
    getWaitlist(bookingId: $input) {
        total
        list {
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
        }
    }
}

`;

export const EXPORT_BOOKINGS_TO_CALENDAR = gql`
query ExportBookingsToCalendar ($input:String!){
    exportBookingsToCalendar(format: $input)
}
`;

/**************************
 *   ROUTINE ASSIGNMENTS  *
 *************************/

export const GET_USER_ASSIGNED_ROUTINES = gql`
	query GetUserAssignedRoutines($input: UserRoutineInquiry!) {
		getUserAssignedRoutines(input: $input) {
			list {
				_id
				trainerId
				userId
				routineType
				routineId
				status
				startDate
				endDate
				completedAt
				trainerNotes
				userFeedback
				priority
				progressPercentage
				trainerData {
					_id
					memberNick
					memberImage
				}
				userData {
					_id
					memberNick
					memberFullName
					memberImage
				}
				mealPlanData {
					_id
					mealPlanTitle
					mealPlanDesc
					duration
					calorieTarget
				}
				workoutData {
					_id
					workoutTitle
					workoutDesc
					workoutDuration
					workoutDifficulty
				}
				createdAt
				updatedAt
			}
			metaCounter
		}
	}
`;

export const GET_ROUTINE_COMPLETIONS = gql`
	query GetRoutineCompletions($input: RoutineCompletionsInput!) {
		getRoutineCompletions(input: $input) {
			list {
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
				userData {
					_id
					memberNick
					memberImage
				}
				createdAt
				updatedAt
			}
			metaCounter
		}
	}
`;

export const GET_BONUS_REWARDS = gql`
	query GetBonusRewards($input: BonusRewardsInput!) {
		getBonusRewards(input: $input) {
			list {
				_id
				userId
				trainerId
				earnedDate
				bonusType
				pointsAwarded
				description
				mealPlanCompletionId
				workoutCompletionId
				claimed
				claimedAt
				userData {
					_id
					memberNick
					memberImage
				}
				trainerData {
					_id
					memberNick
					memberImage
				}
				createdAt
				updatedAt
			}
			metaCounter
		}
	}
`;

export const GET_TRAINER_CLIENTS = gql`
	query GetTrainerClients {
		getTrainerClients {
			_id
			userId
			assignmentsCount
			activeAssignments
			completedAssignments
			lastAssignment
			userData {
				_id
				memberNick
				memberImage
				memberFullName
				memberEmail
				memberPhone
			}
		}
	}
`;

/**************************
 *         MEMBERS         *
 *************************/

export const GET_MEMBERS = gql`
	query GetMembers($input: MembersInquiry!) {
		getMembers(input: $input) {
			list {
				_id
				memberNick
				memberFullName
				memberImage
				memberType
				memberStatus
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        PROPERTY        *
 *************************/

export const GET_PROPERTY = gql`
	query GetProperty($input: String!) {
		getProperty(propertyId: $input) {
			_id
			propertyType
			propertyStatus
			propertyLocation
			propertyAddress
			propertyTitle
			propertyPrice
			propertySquare
			propertyBeds
			propertyRooms
			propertyViews
			propertyLikes
			propertyComments
			propertyRank
			propertyImages
			propertyDesc
			propertyBarter
			propertyRent
			propertyCondition
			memberId
			soldAt
			constructedAt
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberStatus
				memberNick
				memberFullName
				memberImage
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_PROPERTIES = gql`
	query GetProperties($input: PropertiesInquiry!) {
		getProperties(input: $input) {
			list {
				_id
				propertyType
				propertyStatus
				propertyLocation
				propertyAddress
				propertyTitle
				propertyPrice
				propertySquare
				propertyBeds
				propertyRooms
				propertyViews
				propertyLikes
				propertyComments
				propertyRank
				propertyImages
				propertyDesc
				propertyBarter
				propertyRent
				propertyCondition
				memberId
				soldAt
				constructedAt
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberNick
					memberFullName
					memberImage
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
			list {
				_id
				propertyType
				propertyStatus
				propertyLocation
				propertyAddress
				propertyTitle
				propertyPrice
				priceType
				propertySquare
				propertyBeds
				propertyRooms
				womenDiscountPercent
				childrenDiscountPercent
				childrenAgeLimit
				extraClassDiscountPercent
				perClassPrice
				propertyCapacity
				propertyEquipmentList
				propertyAmenities
				propertyOperatingHours
				propertyRating
				propertyViews
				propertyLikes
				propertyComments
				propertyRank
				propertyImages
				propertyDesc
				propertyRent
				propertyBarter
				propertyCondition
				memberId
				soldAt
				constructedAt
				deletedAt
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberNick
					memberFullName
					memberImage
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_PROPERTIES = gql`
	query GetAgentProperties($input: AgentPropertiesInquiry!) {
		getAgentProperties(input: $input) {
			list {
				_id
				propertyType
				propertyStatus
				propertyLocation
				propertyAddress
				propertyTitle
				propertyPrice
				priceType
				propertySquare
				propertyBeds
				propertyRooms
				womenDiscountPercent
				childrenDiscountPercent
				childrenAgeLimit
				extraClassDiscountPercent
				perClassPrice
				propertyCapacity
				propertyEquipmentList
				propertyAmenities
				propertyOperatingHours
				propertyRating
				propertyViews
				propertyLikes
				propertyComments
				propertyRank
				propertyImages
				propertyDesc
				propertyRent
				propertyBarter
				propertyCondition
				memberId
				soldAt
				constructedAt
				deletedAt
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberNick
					memberFullName
					memberImage
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
				_id
				propertyType
				propertyStatus
				propertyLocation
				propertyAddress
				propertyTitle
				propertyPrice
				priceType
				propertySquare
				propertyBeds
				propertyRooms
				womenDiscountPercent
				childrenDiscountPercent
				childrenAgeLimit
				extraClassDiscountPercent
				perClassPrice
				propertyCapacity
				propertyEquipmentList
				propertyAmenities
				propertyOperatingHours
				propertyRating
				propertyViews
				propertyLikes
				propertyComments
				propertyRank
				propertyImages
				propertyDesc
				propertyRent
				propertyBarter
				propertyCondition
				memberId
				soldAt
				constructedAt
				deletedAt
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberNick
					memberFullName
					memberImage
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

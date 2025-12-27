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
 *        PROPERTY        *
 *************************/

export const GET_PROPERTY = gql`
	query GetProperty ($input:String!){
    getProperty(propertyId: $input) {
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

export const GET_MY_PROPERTIES= gql`
	query GetMyProperties ($input:MyPropertiesInquiry!){
    getMyProperties(input: $input) {
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


export const GET_FAVORITES = gql`
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

export const GET_VISITED = gql`
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
        }
        metaCounter {
            total
        }
    }
}
`;

export const GET_VISITED_PROPERTIES = gql`
query GetVisitedProperties ($input:OrdinaryInquiry!){
    getVisitedProperties(input: $input) {
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



query GetServiceStats($input:String!) {
    getServiceStats(serviceId: $input) {
        serviceId
        serviceTitle
        bookingCount
        totalRevenue
        averageBookingValue
    }
}


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
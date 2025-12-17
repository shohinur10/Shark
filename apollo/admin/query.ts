import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input:MembersInquiry!) {
    getAllMembersByAdmin(input: $input) {
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

/**************************
 *        PROPERTY        *
 *************************/

export const GET_ALL_PROPERTIES_BY_ADMIN = gql`
	query GetAllPropertiesByAdmin($input:AllPropertiesInquiry! ){
    getAllPropertiesByAdmin(input: $input) {
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

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
	query GetAllBoardArticlesByAdmin($input:AllBoardArticlesInquiry!) {
    getAllBoardArticlesByAdmin(input:$input) {
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
        }
        metaCounter {
            total
        }
    }
}

`;



export const GET_SUBSCRIPTIONS_BY_ADMIN = gql`
	query GetSubscriptionsByAdmin($input:SubscriptionsInquiry!) {
    getSubscriptionsByAdmin(input: $input) {
        list {
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
        }
        metaCounter {
            total
        }
    }
}

`;
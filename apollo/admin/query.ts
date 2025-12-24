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

/**************************
 *          FAQ           *
 *************************/

export const GET_ALL_FAQS_BY_ADMIN = gql`
	query GetAllFaqsByAdmin($input:FaqsInquiry!) {
    getAllFaqsByAdmin(input: $input) {
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

/**************************
 *        INQUIRY         *
 *************************/

// NOTE: Backend currently doesn't support InquiriesInquiry type and getAllInquiriesByAdmin query
// GraphQL Error: Unknown type "InquiriesInquiry" and Cannot query field "getAllInquiriesByAdmin"
// This query will fail until backend implements support. Pages using this should handle errors gracefully.
export const GET_ALL_INQUIRIES_BY_ADMIN = gql`
	query GetAllInquiriesByAdmin($input:InquiriesInquiry!) {
    getAllInquiriesByAdmin(input: $input) {
        list {
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
        }
        metaCounter {
            total
        }
    }
}
`;

/**************************
 *        NOTICE          *
 *************************/

// NOTE: Backend currently doesn't support NoticesInquiry type and getAllNoticesByAdmin query
// GraphQL Error: Unknown type "NoticesInquiry" and Cannot query field "getAllNoticesByAdmin"
// This query will fail until backend implements support. Pages using this should handle errors gracefully.
export const GET_ALL_NOTICES_BY_ADMIN = gql`
	query GetAllNoticesByAdmin($input:NoticesInquiry!) {
    getAllNoticesByAdmin(input: $input) {
        list {
            _id
            noticeCategory
            noticeStatus
            noticeTitle
            noticeContent
            noticeImage
            noticeUrl
            viewCount
            displayOrder
            startDate
            endDate
            createdBy
            createdAt
            updatedAt
        }
        metaCounter {
            total
        }
    }
}
`;
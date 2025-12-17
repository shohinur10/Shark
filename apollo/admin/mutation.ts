import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin ($input:MemberUpdate!){
    updateMemberByAdmin(input: $input) {
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
 *        PROPERTY        *
 *************************/

export const UPDATE_PROPERTY_BY_ADMIN = gql`
	mutation UpdatePropertyByAdmin($input:PropertyUpdate!) {
    updatePropertyByAdmin(input: $input) {
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

export const REMOVE_PROPERTY_BY_ADMIN = gql`
	mutation RemovePropertyByAdmin ($input:String!){
    removePropertyByAdmin(propertyId: $input) {
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

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin ($input:BoardArticleUpdate!){
    updateBoardArticleByAdmin(input: $input) {
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

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input:String!) {
    removeBoardArticleByAdmin(articleId: $input) {
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

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input:String!) {
    removeCommentByAdmin(commentId: $input) {
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



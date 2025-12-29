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

/**************************
 *          FAQ           *
 *************************/

export const UPDATE_FAQ_BY_ADMIN = gql`
	mutation UpdateFaqByAdmin($input:FaqUpdate!) {
    updateFaqByAdmin(input: $input) {
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

export const REMOVE_FAQ_BY_ADMIN = gql`
	mutation RemoveFaqByAdmin($input:String!) {
    removeFaqByAdmin(faqId: $input) {
        _id
        faqCategory
        faqStatus
        question
        answer
        createdAt
        updatedAt
    }
}

`;

/**************************
 *        INQUIRY         *
 *************************/

export const UPDATE_INQUIRY_BY_ADMIN = gql`
	mutation UpdateInquiryByAdmin($input:InquiryUpdate!) {
    updateInquiryByAdmin(input: $input) {
        _id
        userId
        inquiryCategory
        inquiryStatus
        inquiryPriority
        subject
        question
        aiResponse
        humanResponse
        respondedBy
        respondedAt
        resolvedAt
        closedAt
        createdAt
        updatedAt
    }
}

`;

export const REMOVE_INQUIRY_BY_ADMIN = gql`
	mutation RemoveInquiryByAdmin($input:String!) {
    removeInquiryByAdmin(inquiryId: $input) {
        _id
        inquiryStatus
        subject
        createdAt
        updatedAt
    }
}

`;

/**************************
 *        NOTICE          *
 *************************/

export const UPDATE_NOTICE_BY_ADMIN = gql`
	mutation UpdateNoticeByAdmin($input:NoticeUpdate!) {
    updateNoticeByAdmin(input: $input) {
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
}

`;

export const REMOVE_NOTICE_BY_ADMIN = gql`
	mutation RemoveNoticeByAdmin($input:String!) {
    removeNoticeByAdmin(noticeId: $input) {
        _id
        noticeStatus
        noticeTitle
        createdAt
        updatedAt
    }
}

`;



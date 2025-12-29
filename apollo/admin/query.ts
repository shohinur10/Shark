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

/**************************
 *     DASHBOARD STATS    *
 *************************/

export const GET_ADMIN_DASHBOARD_STATS = gql`
	query GetAdminDashboardStats {
		getAdminDashboardStats {
			totalMembers
			totalTrainers
			totalUsers
			totalAdmins
			activeMembers
			blockedMembers
			totalRevenue
			totalBookings
			pendingBookings
			confirmedBookings
			completedBookings
			cancelledBookings
			totalReviews
			pendingReviews
			totalLikes
			totalViews
			totalComments
		}
	}
`;

/**************************
 *        BOOKING         *
 *************************/

export const GET_ALL_BOOKINGS_BY_ADMIN = gql`
	query GetAllBookingsByAdmin($input: BookingsInquiry!) {
		getAllBookingsByAdmin(input: $input) {
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
					memberNick
					memberFullName
					memberImage
					memberPhone
					memberType
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_BOOKING_STATS = gql`
	query GetBookingStats($input: BookingStatsInput!) {
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

/**************************
 *         REVIEW         *
 *************************/

export const GET_ALL_REVIEWS_BY_ADMIN = gql`
	query GetAllReviewsByAdmin($input: ReviewsInquiry!) {
		getAllReviewsByAdmin(input: $input) {
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
				memberData {
					_id
					memberNick
					memberFullName
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        SERVICE         *
 *************************/

export const GET_ALL_SERVICES_BY_ADMIN = gql`
	query GetAllServicesByAdmin($input: ServicesInquiry!) {
		getAllServicesByAdmin(input: $input) {
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

export const GET_SERVICE_STATS = gql`
	query GetServiceStats($serviceId: String!) {
		getServiceStats(serviceId: $serviceId) {
			serviceId
			serviceTitle
			bookingCount
			totalRevenue
			averageBookingValue
		}
	}
`;

/**************************
 *        TRAINER         *
 *************************/

export const GET_TRAINER_STATS = gql`
	query GetTrainerStats($trainerId: String!) {
		getTrainerStats(trainerId: $trainerId) {
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

/**************************
 *        WORKOUT         *
 *************************/

export const GET_ALL_WORKOUTS_BY_ADMIN = gql`
	query GetAllWorkoutsByAdmin($input: WorkoutsInquiry!) {
		getAllWorkoutsByAdmin(input: $input) {
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
					memberNick
					memberFullName
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        EXERCISE        *
 *************************/

export const GET_ALL_EXERCISES_BY_ADMIN = gql`
	query GetAllExercisesByAdmin($input: ExercisesInquiry!) {
		getAllExercisesByAdmin(input: $input) {
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
				memberData {
					_id
					memberNick
					memberFullName
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *       CHALLENGE        *
 *************************/

export const GET_ALL_CHALLENGES_BY_ADMIN = gql`
	query GetAllChallengesByAdmin($input: ChallengesInquiry!) {
		getAllChallengesByAdmin(input: $input) {
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
				participants {
					memberId
					joinedAt
					currentProgress
					completed
					completedAt
				}
				participantCount
				completionCount
				rewardBadge
				rewardPoints
				isCommunity
				challengeRules
				deletedAt
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberFullName
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
# Backend Notification GraphQL Schema Requirements

This document outlines the fields that need to be added to the backend GraphQL schema for the Notification system to work fully as expected by the frontend.

## Current Status

The frontend has been updated to work with the current backend schema, but some features are limited. The following fields are **missing** from the backend GraphQL schema and should be added for full functionality.

## Required Fields to Add

### 1. Notification Type Fields

Add the following fields to the `Notification` GraphQL type:

#### `notificationRefId: String`
- **Purpose**: Reference ID to link notification to the related entity (article, property, comment, etc.)
- **Usage**: Used to navigate to the related content when clicking a notification
- **Status**: Currently missing, frontend uses workaround

#### `memberId: String`
- **Purpose**: ID of the member this notification is about
- **Usage**: Used for filtering and displaying member-specific notifications
- **Status**: Currently missing

#### `actionMemberId: String`
- **Purpose**: ID of the member who performed the action (e.g., who liked, commented, followed)
- **Usage**: Used to display who performed the action that triggered the notification
- **Status**: Currently missing, frontend uses `authorData` as fallback

#### `notificationMessage: String`
- **Purpose**: The actual notification message/body text
- **Usage**: Displayed as the main notification content
- **Status**: Currently missing, frontend uses `notificationTitle` and `notificationDesc` as fallback

#### `notificationUrl: String`
- **Purpose**: Direct URL to navigate when clicking the notification
- **Usage**: Used for navigation when user clicks on a notification
- **Status**: Currently missing, navigation is disabled

### 2. Notification Relations

#### `memberData: Member` (or keep `authorData` and add `actionMemberData`)
- **Current**: Backend has `authorData` but frontend expects `memberData` and `actionMemberData`
- **Recommendation**: 
  - Keep `authorData` (the notification author)
  - Add `actionMemberData: Member` (the member who performed the action)
  - Optionally add `memberData: Member` if different from author

#### `actionMemberData: Member`
- **Purpose**: Full member data for the person who performed the action
- **Fields needed**: `_id`, `memberNick`, `memberFullName`, `memberImage`
- **Status**: Currently missing, frontend cannot display action member info

#### `relatedCommentData: Comment`
- **Purpose**: Related comment data when notification is about a comment
- **Fields needed**: 
  - `_id: String`
  - `commentContent: String`
  - `createdAt: Date`
  - `memberData: Member` (with `_id`, `memberNick`, `memberFullName`, `memberImage`)
- **Status**: Currently missing, frontend cannot display related comments

### 3. MetaCounter Fields

Update the `TotalCounter` type (or create a `NotificationCounter` type) to include:

#### `unreadCount: Int`
- **Purpose**: Count of unread notifications
- **Current**: Only `total` exists in `TotalCounter`
- **Status**: Currently missing, frontend uses separate `getUnreadNotificationCount` query

#### `totalCount: Int` (optional, for consistency)
- **Purpose**: Total count of notifications
- **Current**: Backend uses `total`, frontend expects `totalCount`
- **Recommendation**: Either add `totalCount` or update frontend to use `total` consistently

## Recommended Backend Schema

```graphql
type Notification {
  _id: ID!
  notificationType: NotificationType!
  notificationStatus: NotificationStatus!
  notificationGroup: NotificationGroup!
  notificationTitle: String!
  notificationDesc: String
  notificationRefId: String          # ADD THIS
  notificationMessage: String       # ADD THIS
  notificationUrl: String           # ADD THIS
  authorId: String!
  receiverId: String!
  memberId: String                  # ADD THIS
  actionMemberId: String            # ADD THIS
  propertyId: String
  articleId: String
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relations
  authorData: Member                # EXISTS
  actionMemberData: Member          # ADD THIS
  memberData: Member                # ADD THIS (optional, if different from author)
  relatedCommentData: Comment       # ADD THIS
}

type NotificationCounter {
  total: Int!
  totalCount: Int!                  # ADD THIS (or use total consistently)
  unreadCount: Int!                  # ADD THIS
}

type NotificationsResponse {
  list: [Notification!]!
  metaCounter: NotificationCounter!  # Use NotificationCounter instead of TotalCounter
}
```

## Priority

### High Priority (Core Functionality)
1. ✅ `notificationUrl` - Required for navigation
2. ✅ `actionMemberData` - Required to show who performed the action
3. ✅ `unreadCount` in metaCounter - Better UX than separate query

### Medium Priority (Enhanced UX)
4. `notificationMessage` - Better than using title/desc
5. `relatedCommentData` - Shows comment context
6. `notificationRefId` - Better linking to related content

### Low Priority (Nice to Have)
7. `memberId` and `actionMemberId` - Can be derived from relations
8. `totalCount` - Can use `total` consistently

## Current Workarounds

The frontend has been updated to work with current schema:
- Uses `notificationTitle` and `notificationDesc` instead of `notificationMessage`
- Uses `authorData` instead of `actionMemberData`
- Uses separate `getUnreadNotificationCount` query for unread count
- Navigation is disabled (no `notificationUrl`)
- Related comment display is disabled (no `relatedCommentData`)

## Testing Checklist

Once backend fields are added:
- [ ] Verify `notificationUrl` works for navigation
- [ ] Verify `actionMemberData` displays correctly
- [ ] Verify `unreadCount` in metaCounter matches separate query
- [ ] Verify `notificationMessage` displays properly
- [ ] Verify `relatedCommentData` shows comment context
- [ ] Update frontend query to include new fields
- [ ] Update frontend component to use new fields






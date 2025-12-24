# Backend Resolver Implementation Status

## Issue Identified

The GraphQL schema definitions in `libs/types/notification/notification.ts` show that the backend **should** support all these fields, but the runtime GraphQL schema errors indicate the resolver is **not actually implementing them**.

## Schema vs Implementation Mismatch

### Fields Defined in Schema (notification.ts lines 41-129)

The `@ObjectType()` decorators show these fields should exist:

✅ **Currently Working:**
- `_id`
- `notificationType`
- `notificationStatus`
- `notificationGroup`
- `notificationTitle`
- `notificationDesc`
- `authorId`
- `receiverId`
- `propertyId`
- `articleId`
- `createdAt`
- `updatedAt`
- `authorData`

❌ **Defined in Schema but NOT Implemented in Resolver:**
- `notificationRefId` (line 74)
- `notificationMessage` (line 77)
- `notificationUrl` (line 80)
- `memberId` (line 89)
- `actionMemberId` (line 92)
- `actionMemberData` (line 111)
- `memberData` (line 114)
- `relatedCommentData` (line 117)

### NotificationCounter Schema (notification.ts lines 42-51)

✅ **Currently Working:**
- `total` (line 44)

❌ **Defined in Schema but NOT Implemented:**
- `totalCount` (line 47)
- `unreadCount` (line 49)

## Required Backend Resolver Updates

The backend resolver for `getMyNotifications` needs to:

1. **Populate the missing fields in the Notification entity:**
   ```typescript
   // In the resolver, ensure these fields are returned:
   - notificationRefId
   - notificationMessage
   - notificationUrl
   - memberId
   - actionMemberId
   ```

2. **Add field resolvers for relations:**
   ```typescript
   @ResolveField(() => Member, { nullable: true })
   async actionMemberData(@Parent() notification: Notification) {
     // Resolve actionMemberData from actionMemberId
   }

   @ResolveField(() => Member, { nullable: true })
   async memberData(@Parent() notification: Notification) {
     // Resolve memberData from memberId
   }

   @ResolveField(() => Comment, { nullable: true })
   async relatedCommentData(@Parent() notification: Notification) {
     // Resolve relatedCommentData based on notificationRefId and notificationGroup
   }
   ```

3. **Update NotificationCounter resolver:**
   ```typescript
   @ResolveField(() => Int, { nullable: true })
   async totalCount(@Parent() counter: NotificationCounter) {
     return counter.total; // Or calculate separately
   }

   @ResolveField(() => Int, { nullable: true })
   async unreadCount(@Parent() counter: NotificationCounter) {
     // Calculate unread count for the current user
   }
   ```

## Database Schema Check

Ensure the Notification model/schema in the database includes:
- `notificationRefId: ObjectId`
- `notificationMessage: String`
- `notificationUrl: String`
- `memberId: ObjectId`
- `actionMemberId: ObjectId`

## Testing

Once implemented, test that:
1. All fields are queryable without GraphQL validation errors
2. `actionMemberData` populates correctly from `actionMemberId`
3. `relatedCommentData` populates when notification is comment-related
4. `metaCounter.unreadCount` returns the correct count
5. `notificationUrl` is available for navigation

## Current Frontend Status

The frontend has been updated to:
- ✅ Query all fields defined in the schema
- ✅ Use `actionMemberData` when available (falls back to `authorData`)
- ✅ Use `notificationMessage` when available (falls back to `notificationTitle`)
- ✅ Display `relatedCommentData` when available
- ✅ Use `metaCounter.unreadCount` when available (falls back to separate query)
- ✅ Navigate using `notificationUrl` when available

The frontend is ready - it just needs the backend resolver to actually implement these fields!






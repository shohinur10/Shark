# Notification Types Analysis

## Issues Found

### 1. **notification.ts** (Lines 1-129)

**Problems:**
- ❌ Missing imports for GraphQL decorators (`@ObjectType`, `@Field`, `Int`)
- ❌ Missing imports for `ObjectId` type
- ✅ TypeScript interfaces (lines 6-40) are consistent with GraphQL classes (lines 41-129)
- ✅ All fields are properly defined in both interfaces and classes

**Missing Imports:**
```typescript
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ObjectId } from 'mongodb'; // or from mongoose
```

### 2. **notification.input.ts** (Lines 1-175)

**Problems:**
- ❌ Missing imports for GraphQL decorators (`@InputType`, `@Field`, `Int`)
- ❌ Missing imports for validation decorators (`@IsNotEmpty`, `@IsOptional`, `@IsEnum`, `@Length`, `@Min`)
- ❌ Missing imports for `ObjectId` type
- ❌ `NotificationSearch` class (line 116) is NOT exported but used in `NotificationsInquiry`
- ⚠️ `NotificationInput` class has `commentId` field (line 112) that's NOT in the interface (line 4-18)
- ✅ TypeScript interfaces match GraphQL classes for most fields

**Missing Imports:**
```typescript
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEnum, Length, Min } from 'class-validator';
import { ObjectId } from 'mongodb'; // or from mongoose
```

**Inconsistencies:**
- Interface `NotificationInput` (line 4) doesn't have `commentId`
- Class `NotificationInput` (line 52) has `commentId` (line 112)
- `NotificationSearch` class should be exported

### 3. **notification.update.ts** (Lines 1-69)

**Problems:**
- ❌ Missing imports for GraphQL decorators (`@InputType`, `@Field`)
- ❌ Missing imports for validation decorators (`@IsNotEmpty`, `@IsOptional`, `@IsEnum`, `@Length`)
- ❌ Missing imports for `ObjectId` type
- ❌ **CRITICAL**: GraphQL class is missing fields that exist in the interface:
  - `memberId` (in interface line 12, missing in class)
  - `actionMemberId` (in interface line 13, missing in class)
  - `notificationRefId` (in interface line 16, missing in class)
  - `notificationMessage` (in interface line 17, missing in class)
  - `notificationUrl` (in interface line 18, missing in class)

**Missing Imports:**
```typescript
import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEnum, Length } from 'class-validator';
import { ObjectId } from 'mongodb'; // or from mongoose
```

## Field Comparison

### notification.ts
| Field | Interface | GraphQL Class | Status |
|-------|-----------|---------------|--------|
| `notificationRefId` | ✅ | ✅ | OK |
| `notificationMessage` | ✅ | ✅ | OK |
| `notificationUrl` | ✅ | ✅ | OK |
| `memberId` | ✅ | ✅ | OK |
| `actionMemberId` | ✅ | ✅ | OK |
| `actionMemberData` | ✅ | ✅ | OK |
| `memberData` | ✅ | ✅ | OK |
| `relatedCommentData` | ✅ | ✅ | OK |

### notification.input.ts
| Field | Interface | GraphQL Class | Status |
|-------|-----------|---------------|--------|
| `commentId` | ❌ | ✅ | **MISMATCH** - Add to interface or remove from class |

### notification.update.ts
| Field | Interface | GraphQL Class | Status |
|-------|-----------|---------------|--------|
| `memberId` | ✅ | ❌ | **MISSING** in class |
| `actionMemberId` | ✅ | ❌ | **MISSING** in class |
| `notificationRefId` | ✅ | ❌ | **MISSING** in class |
| `notificationMessage` | ✅ | ❌ | **MISSING** in class |
| `notificationUrl` | ✅ | ❌ | **MISSING** in class |

## Recommendations

1. **Add missing imports** to all three files
2. **Fix notification.update.ts** - Add missing fields to GraphQL class
3. **Fix notification.input.ts** - Either add `commentId` to interface or remove from class, and export `NotificationSearch`
4. **Verify ObjectId import path** - Check if using `mongodb` or `mongoose` package






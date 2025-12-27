# Backend TODO: Booking System Implementation

## Overview
This document outlines all backend requirements for the Booking page implementation based on the frontend analysis.

---

## 1. QUERIES

### 1.1 `getAllServices` Query
**Status:** ✅ Exists (needs enhancement)

**Current Fields:**
- `_id: String!`
- `title: String!`
- `pricePerHour: Float`
- `fixedPrice: Float`
- `durationOptions: [Int!]!` (array of minutes)
- `createdAt: Date`
- `updatedAt: Date`

**Required Additions:**
- [ ] Add `bookingType: String!` field (maps to BookingType enum)
- [ ] Add `description: String` (optional field)
- [ ] Ensure `pricePerHour` OR `fixedPrice` is required (not both, not neither)
- [ ] Validate `durationOptions` array contains valid positive integers
- [ ] Add service status field (ACTIVE, INACTIVE) to filter active services only

**Validation Rules:**
- [ ] At least one of `pricePerHour` or `fixedPrice` must be provided
- [ ] `durationOptions` must be non-empty array
- [ ] All `durationOptions` values must be > 0
- [ ] `bookingType` must be valid enum value

---

### 1.2 `getTrainerAvailability` Query
**Status:** ✅ Exists

**Current Signature:**
```graphql
getTrainerAvailability(trainerId: String!, date: String!): TrainerAvailability
```

**Current Response:**
- `availableSlots: [String!]!` (array of time slots in "HH:mm" format)

**Required Enhancements:**
- [ ] Validate `trainerId` exists and is a trainer
- [ ] Validate `date` is valid date string (YYYY-MM-DD format)
- [ ] Validate `date` is not in the past
- [ ] Exclude already booked time slots
- [ ] Consider trainer's working hours
- [ ] Consider trainer's existing bookings for that date
- [ ] Return slots in chronological order
- [ ] Handle timezone correctly

**Business Logic:**
- [ ] Calculate available slots based on:
  - Trainer's schedule/working hours
  - Existing bookings for that date
  - Minimum booking advance time (e.g., 2 hours)
  - Service duration options (if provided)
- [ ] Return empty array if trainer has no availability

---

### 1.3 `getBookings` Query
**Status:** ✅ Exists

**Current Signature:**
```graphql
getBookings(input: BookingsInquiry!): Bookings
```

**Input Fields:**
- `page: Int!`
- `limit: Int!`
- `sort: String` (optional)
- `direction: Direction` (optional)
- `clientId: String` (optional)
- `providerId: String` (optional)
- `bookingStatus: BookingStatus` (optional)
- `bookingType: BookingType` (optional)
- `search: BISearch` (optional)

**Required Enhancements:**
- [ ] Validate `page` > 0
- [ ] Validate `limit` between 1 and 100
- [ ] Ensure `clientId` can only query own bookings (unless admin)
- [ ] Ensure `providerId` can only query own bookings (unless admin)
- [ ] Add date range filtering (startDate, endDate)
- [ ] Add sorting by bookingDate, bookingTime, createdAt
- [ ] Return paginated results with total count

**Security:**
- [ ] Users can only query bookings where they are `clientId` OR `providerId`
- [ ] Admins can query all bookings
- [ ] Validate user authentication for all queries

---

### 1.4 `getBooking` Query
**Status:** ✅ Exists

**Current Signature:**
```graphql
getBooking(bookingId: String!): Booking
```

**Required Enhancements:**
- [ ] Validate `bookingId` exists
- [ ] Ensure user can only access bookings where they are `clientId` OR `providerId`
- [ ] Return full booking details including memberData aggregation
- [ ] Include related service information if available

---

## 2. MUTATIONS

### 2.1 `createBooking` Mutation
**Status:** ✅ Exists (needs security & validation)

**Current Signature:**
```graphql
createBooking(input: BookingInput!): Booking
```

**Input Fields:**
- `bookingType: BookingType!`
- `providerId: String!` (trainerId)
- `propertyId: String` (optional)
- `bookingDate: Date!` (YYYY-MM-DD format)
- `bookingTime: String!` (HH:mm format)
- `sessionDuration: Int!` (duration in minutes)
- `bookingPrice: Float!`
- `bookingNotes: String` (optional)
- `meetingLink: String` (optional)
- `clientId: String` (optional - should come from auth context)

**Required Validations:**

#### 2.1.1 Authentication & Authorization
- [ ] Require authenticated user
- [ ] Extract `clientId` from authenticated user context (JWT token)
- [ ] **CRITICAL:** Ignore `clientId` from input if provided - always use authenticated user
- [ ] Validate user exists and is active

#### 2.1.2 Trainer Validation
- [ ] Validate `providerId` exists in database
- [ ] Validate `providerId` is a trainer (memberType = TRAINER)
- [ ] Validate trainer is active and available for bookings
- [ ] Validate trainer is not blocked/banned

#### 2.1.3 Date & Time Validation
- [ ] Validate `bookingDate` is not in the past
- [ ] Validate `bookingDate` format is YYYY-MM-DD
- [ ] Validate `bookingTime` format is HH:mm (24-hour format)
- [ ] Validate `bookingTime` is within trainer's working hours (if configured)
- [ ] Validate booking is not too far in advance (e.g., max 90 days)
- [ ] Validate minimum advance booking time (e.g., 2 hours before session)

#### 2.1.4 Duration Validation
- [ ] Validate `sessionDuration` > 0
- [ ] Validate `sessionDuration` matches service's `durationOptions` (if service provided)
- [ ] Validate `sessionDuration` is reasonable (e.g., max 480 minutes / 8 hours)

#### 2.1.5 Conflict Prevention
- [ ] **CRITICAL:** Check for overlapping bookings with same trainer:
  - Calculate session end time: `bookingTime + sessionDuration`
  - Query existing bookings for same `providerId` and `bookingDate`
  - Check if any existing booking overlaps with new booking time range
  - Return error if conflict found: "Time slot is already booked"
- [ ] Check trainer's availability for that date/time
- [ ] Consider buffer time between bookings (e.g., 15 minutes)
- [ ] Use database transaction to prevent race conditions
- [ ] Use optimistic locking or database-level constraints

#### 2.1.6 Pricing Security
- [ ] **CRITICAL:** Do NOT trust `bookingPrice` from client
- [ ] Fetch service details using `serviceId` (if provided) or infer from `bookingType`
- [ ] Calculate price server-side:
  - If service has `fixedPrice`: use `fixedPrice`
  - Else: calculate `pricePerHour * (sessionDuration / 60)`
  - Round to 2 decimal places
- [ ] Compare calculated price with provided `bookingPrice` (optional validation)
- [ ] Store calculated price, not client-provided price
- [ ] Log price discrepancy if client price differs (for fraud detection)

#### 2.1.7 Service Validation
- [ ] Validate service exists (if serviceId provided)
- [ ] Validate `bookingType` matches service's `bookingType`
- [ ] Validate `sessionDuration` is in service's `durationOptions`
- [ ] Validate service is active

#### 2.1.8 Business Rules
- [ ] Set initial `bookingStatus` to `PENDING` or `CONFIRMED` (based on business logic)
- [ ] Generate unique booking ID
- [ ] Set `createdAt` and `updatedAt` timestamps
- [ ] Validate `bookingNotes` length (e.g., max 1000 characters)
- [ ] Validate `meetingLink` is valid URL format (if provided)

#### 2.1.9 Response
- [ ] Return created booking with all fields
- [ ] Include `memberData` aggregation for provider
- [ ] Return error with clear message if validation fails

---

## 3. VALIDATION RULES SUMMARY

### 3.1 Input Validation
- [ ] All required fields must be present
- [ ] Date format: YYYY-MM-DD
- [ ] Time format: HH:mm (24-hour)
- [ ] Numeric fields must be positive
- [ ] String fields must not exceed max length
- [ ] Enum values must be valid

### 3.2 Business Logic Validation
- [ ] Booking date not in past
- [ ] Booking time within valid range
- [ ] Duration matches service options
- [ ] No overlapping bookings
- [ ] Trainer is available
- [ ] Price calculated server-side

### 3.3 Security Validation
- [ ] User authentication required
- [ ] clientId from auth context only
- [ ] User can only create bookings for themselves
- [ ] Price cannot be manipulated by client

---

## 4. BOOKING CONFLICT PREVENTION

### 4.1 Database Level
- [ ] Create unique index on `(providerId, bookingDate, bookingTime)` or composite constraint
- [ ] Use database transactions for booking creation
- [ ] Implement row-level locking when checking availability
- [ ] Consider using database triggers for conflict detection

### 4.2 Application Level
- [ ] Query existing bookings in same transaction
- [ ] Calculate time ranges: `startTime = bookingTime`, `endTime = bookingTime + sessionDuration`
- [ ] Check for overlaps:
  ```
  Existing: [10:00 - 11:00]
  New:      [10:30 - 11:30]  ❌ OVERLAP
  
  Existing: [10:00 - 11:00]
  New:      [11:00 - 12:00]  ✅ OK (if no buffer needed)
  ```
- [ ] Consider buffer time between bookings (configurable, e.g., 15 minutes)
- [ ] Return specific error: "This time slot conflicts with an existing booking"

### 4.3 Race Condition Prevention
- [ ] Use database transactions (BEGIN/COMMIT)
- [ ] Use SELECT FOR UPDATE when checking availability
- [ ] Implement retry logic for transient conflicts
- [ ] Use optimistic locking with version fields
- [ ] Consider using message queue for booking creation (if high concurrency)

---

## 5. PRICING SECURITY

### 5.1 Server-Side Price Calculation
- [ ] **NEVER** trust `bookingPrice` from client input
- [ ] Always fetch service from database using serviceId
- [ ] Calculate price using formula:
  ```javascript
  if (service.fixedPrice) {
    price = service.fixedPrice;
  } else {
    price = service.pricePerHour * (sessionDuration / 60);
  }
  price = Math.round(price * 100) / 100; // Round to 2 decimals
  ```
- [ ] Store calculated price in database
- [ ] Log original client price for audit (if different)

### 5.2 Price Validation (Optional)
- [ ] If client provides `bookingPrice`, compare with calculated price
- [ ] Allow small tolerance (e.g., ±0.01) for rounding differences
- [ ] Log warning if prices differ significantly
- [ ] Consider rejecting booking if price mismatch is too large

### 5.3 Service Price Rules
- [ ] Validate service has either `pricePerHour` OR `fixedPrice` (not both, not neither)
- [ ] Validate `pricePerHour` > 0 if used
- [ ] Validate `fixedPrice` > 0 if used
- [ ] Cache service prices for performance (with invalidation on update)

---

## 6. BOOKING STATUS LIFECYCLE

### 6.1 Initial Status
- [ ] Set `bookingStatus = PENDING` on creation (default)
- [ ] Or set `bookingStatus = CONFIRMED` if auto-confirm enabled
- [ ] Set `createdAt` timestamp
- [ ] Set `updatedAt` timestamp

### 6.2 Status Transitions
- [ ] `PENDING` → `CONFIRMED` (trainer/admin confirms)
- [ ] `PENDING` → `CANCELLED` (cancelled before confirmation)
- [ ] `CONFIRMED` → `COMPLETED` (session completed)
- [ ] `CONFIRMED` → `CANCELLED` (cancelled after confirmation)
- [ ] `CONFIRMED` → `NO_SHOW` (client didn't show up)
- [ ] `CANCELLED` → `REFUNDED` (if payment was made)

### 6.3 Status Rules
- [ ] Only trainer/admin can confirm bookings
- [ ] Only client or trainer can cancel (with restrictions)
- [ ] Cannot cancel completed bookings
- [ ] Cannot modify cancelled bookings
- [ ] Set `cancelledAt` timestamp when cancelled
- [ ] Set `cancelledBy` (clientId or providerId)
- [ ] Set `cancellationReason` (optional)
- [ ] Set `completedAt` timestamp when completed

### 6.4 Status-Based Queries
- [ ] Filter bookings by status in `getBookings`
- [ ] Return status in all booking queries
- [ ] Update status atomically (use transactions)

---

## 7. NOTIFICATIONS (Optional)

### 7.1 Booking Created
- [ ] Send email/SMS to trainer when booking is created
- [ ] Send email/SMS to client confirming booking
- [ ] Include booking details in notification

### 7.2 Booking Confirmed
- [ ] Send notification to client when trainer confirms
- [ ] Include session details and reminders

### 7.3 Booking Cancelled
- [ ] Send notification to both parties
- [ ] Include cancellation reason if provided

### 7.4 Booking Reminders
- [ ] Send reminder 24 hours before session
- [ ] Send reminder 2 hours before session
- [ ] Include meeting link if online session

### 7.5 Implementation Notes
- [ ] Use async job queue for notifications (don't block booking creation)
- [ ] Handle notification failures gracefully
- [ ] Allow users to opt-out of certain notifications
- [ ] Log all notifications sent

---

## 8. DATABASE SCHEMA REQUIREMENTS

### 8.1 Booking Collection/Table
- [ ] `_id: ObjectId/String` (primary key)
- [ ] `bookingType: Enum` (required)
- [ ] `bookingStatus: Enum` (required, default: PENDING)
- [ ] `clientId: ObjectId/String` (required, indexed)
- [ ] `providerId: ObjectId/String` (required, indexed)
- [ ] `propertyId: ObjectId/String` (optional)
- [ ] `bookingDate: Date` (required, indexed)
- [ ] `bookingTime: String` (required, format: HH:mm)
- [ ] `sessionDuration: Int` (required, in minutes)
- [ ] `bookingPrice: Decimal` (required, calculated server-side)
- [ ] `paymentId: ObjectId/String` (optional, for payment integration)
- [ ] `bookingNotes: String` (optional, max length)
- [ ] `providerNotes: String` (optional, trainer-only)
- [ ] `meetingLink: String` (optional, URL format)
- [ ] `cancellationReason: String` (optional)
- [ ] `cancelledBy: ObjectId/String` (optional)
- [ ] `cancelledAt: Date` (optional)
- [ ] `completedAt: Date` (optional)
- [ ] `reviewId: ObjectId/String` (optional, for reviews)
- [ ] `createdAt: Date` (required, auto-set)
- [ ] `updatedAt: Date` (required, auto-update)

### 8.2 Indexes
- [ ] Index on `(providerId, bookingDate, bookingTime)` for conflict detection
- [ ] Index on `clientId` for user booking queries
- [ ] Index on `providerId` for trainer booking queries
- [ ] Index on `bookingStatus` for filtering
- [ ] Index on `bookingDate` for date range queries
- [ ] Composite index on `(clientId, bookingStatus)` for user dashboard
- [ ] Composite index on `(providerId, bookingStatus)` for trainer dashboard

### 8.3 Service Collection/Table
- [ ] `_id: ObjectId/String` (primary key)
- [ ] `title: String` (required)
- [ ] `description: String` (optional)
- [ ] `bookingType: String` (required, enum)
- [ ] `pricePerHour: Decimal` (optional, > 0)
- [ ] `fixedPrice: Decimal` (optional, > 0)
- [ ] `durationOptions: [Int]` (required, array of minutes)
- [ ] `status: Enum` (ACTIVE, INACTIVE, default: ACTIVE)
- [ ] `createdAt: Date` (required)
- [ ] `updatedAt: Date` (required)

**Constraints:**
- [ ] Either `pricePerHour` OR `fixedPrice` must be provided (not both, not neither)
- [ ] `durationOptions` must be non-empty array
- [ ] All `durationOptions` values must be > 0

---

## 9. ERROR HANDLING

### 9.1 Validation Errors
- [ ] Return clear, user-friendly error messages
- [ ] Include field name in error message
- [ ] Return HTTP 400 (Bad Request) for validation errors
- [ ] Return specific error codes for different validation failures

### 9.2 Business Logic Errors
- [ ] "Time slot is already booked" (conflict)
- [ ] "Trainer is not available at this time"
- [ ] "Booking date cannot be in the past"
- [ ] "Invalid booking time format"
- [ ] "Service not found or inactive"
- [ ] "Duration not available for this service"

### 9.3 Security Errors
- [ ] "Authentication required" (401)
- [ ] "Unauthorized to create booking" (403)
- [ ] "Invalid user context" (403)

### 9.4 System Errors
- [ ] Return HTTP 500 for unexpected errors
- [ ] Log all errors with context
- [ ] Don't expose internal error details to client

---

## 10. TESTING REQUIREMENTS

### 10.1 Unit Tests
- [ ] Test price calculation logic
- [ ] Test conflict detection algorithm
- [ ] Test date/time validation
- [ ] Test status transitions

### 10.2 Integration Tests
- [ ] Test booking creation with valid input
- [ ] Test booking creation with conflicts
- [ ] Test booking creation with invalid price
- [ ] Test booking creation without authentication
- [ ] Test concurrent booking creation (race conditions)

### 10.3 Edge Cases
- [ ] Booking at midnight (00:00)
- [ ] Booking crossing day boundary
- [ ] Booking with maximum duration
- [ ] Booking with minimum duration
- [ ] Booking far in future (90+ days)
- [ ] Booking with special characters in notes
- [ ] Booking with very long notes

---

## 11. PERFORMANCE CONSIDERATIONS

### 11.1 Query Optimization
- [ ] Index all frequently queried fields
- [ ] Use pagination for booking lists
- [ ] Cache service data (with invalidation)
- [ ] Optimize availability query (consider pre-calculating)

### 11.2 Conflict Detection
- [ ] Use efficient query for checking overlaps
- [ ] Consider caching trainer availability
- [ ] Use database-level constraints where possible

### 11.3 Scalability
- [ ] Consider read replicas for booking queries
- [ ] Use connection pooling
- [ ] Implement rate limiting for booking creation
- [ ] Consider queue system for high-traffic periods

---

## 12. API RESPONSE FORMATS

### 12.1 Success Response
```json
{
  "data": {
    "createBooking": {
      "_id": "booking123",
      "bookingType": "PERSONAL_TRAINING",
      "bookingStatus": "PENDING",
      "clientId": "client123",
      "providerId": "trainer123",
      "bookingDate": "2024-01-15",
      "bookingTime": "10:00",
      "sessionDuration": 60,
      "bookingPrice": 75.00,
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-01-10T10:00:00Z"
    }
  }
}
```

### 12.2 Error Response
```json
{
  "errors": [
    {
      "message": "Time slot is already booked",
      "extensions": {
        "code": "BOOKING_CONFLICT",
        "field": "bookingTime"
      }
    }
  ]
}
```

---

## 13. ADDITIONAL CONSIDERATIONS

### 13.1 Payment Integration (Future)
- [ ] Reserve payment processing for confirmed bookings
- [ ] Link `paymentId` to booking
- [ ] Handle refunds for cancelled bookings
- [ ] Store payment status

### 13.2 Reviews Integration
- [ ] Link `reviewId` to booking after completion
- [ ] Only allow reviews for completed bookings
- [ ] Prevent duplicate reviews

### 13.3 Analytics
- [ ] Track booking creation rate
- [ ] Track cancellation rate
- [ ] Track popular time slots
- [ ] Track revenue per booking

---

## 14. PRIORITY CHECKLIST

### Critical (Must Have)
- [ ] Server-side price calculation
- [ ] Conflict detection and prevention
- [ ] Authentication and authorization
- [ ] Input validation
- [ ] Date/time validation

### Important (Should Have)
- [ ] Service bookingType field
- [ ] Availability query enhancements
- [ ] Status lifecycle management
- [ ] Error handling

### Nice to Have (Optional)
- [ ] Notifications
- [ ] Analytics
- [ ] Payment integration
- [ ] Advanced filtering

---

## NOTES FOR BACKEND TEAM

1. **Price Security is CRITICAL**: Never trust client-provided prices. Always calculate server-side.

2. **Conflict Prevention is CRITICAL**: Use database transactions and proper locking to prevent double bookings.

3. **Authentication Context**: Always extract `clientId` from JWT token, never from input.

4. **Service bookingType**: The frontend expects services to have a `bookingType` field that maps to the BookingType enum.

5. **Time Format**: All times are in 24-hour format (HH:mm), dates are YYYY-MM-DD.

6. **Duration**: All durations are in minutes (not hours or enum values).

7. **Testing**: Pay special attention to race conditions and concurrent booking creation.

---

**Last Updated:** Based on frontend implementation analysis
**Status:** Ready for backend implementation



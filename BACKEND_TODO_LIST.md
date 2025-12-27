# Backend TODO List for Booking System

This document outlines all backend tasks required to fully support the booking system, service management, and supplement integration.

---

## 🔴 HIGH PRIORITY - Core Booking Functionality

### 1. Booking CRUD Operations

#### 1.1 Create Booking
- [ ] **Endpoint:** `createBooking(input: BookingInput!)`
- [ ] Validate all required fields (trainerId, serviceId, date, time, duration, price)
- [ ] Check trainer availability for selected date/time
- [ ] Prevent double booking (check for existing bookings at same time)
- [ ] Validate booking date is in the future
- [ ] Validate booking time is within trainer's working hours
- [ ] Calculate and validate booking price matches service pricing
- [ ] Set initial booking status to `PENDING` or `CONFIRMED` based on business rules
- [ ] Create payment record (if payment is required upfront)
- [ ] Send confirmation notification to client and trainer
- [ ] Return created booking with full details

#### 1.2 Get Booking
- [ ] **Endpoint:** `getBooking(bookingId: String!)`
- [ ] Return booking with populated trainer and client data
- [ ] Include service details
- [ ] Include payment status
- [ ] Check user permissions (only client, trainer, or admin can view)

#### 1.3 Get Bookings (List)
- [ ] **Endpoint:** `getBookings(input: BookingsInquiry!)`
- [ ] Support filtering by:
  - [ ] clientId
  - [ ] providerId (trainer)
  - [ ] bookingStatus
  - [ ] bookingType
  - [ ] date range
- [ ] Support sorting by date, price, status
- [ ] Support pagination
- [ ] Return meta counter with total count
- [ ] Populate trainer and client data in results

#### 1.4 Update Booking
- [ ] **Endpoint:** `updateBooking(input: BookingUpdate!)`
- [ ] Allow status updates (CONFIRMED, CANCELLED, COMPLETED, etc.)
- [ ] Allow date/time rescheduling (with availability check)
- [ ] Allow price updates (with proper authorization)
- [ ] Allow notes updates (client notes, provider notes)
- [ ] Validate cancellation policy before allowing cancellation
- [ ] Handle refunds if booking is cancelled
- [ ] Send notifications on status changes
- [ ] Log all changes for audit trail

#### 1.5 Delete Booking (Soft Delete)
- [ ] **Endpoint:** `deleteBooking(bookingId: String!)`
- [ ] Soft delete (set deletedAt timestamp)
- [ ] Check permissions (only admin or booking owner)
- [ ] Handle refunds if applicable
- [ ] Send cancellation notifications

---

### 2. Trainer Availability System

#### 2.1 Get Trainer Availability
- [ ] **Endpoint:** `getTrainerAvailability(trainerId: String!, date: String!)`
- [ ] Calculate available time slots for a specific date
- [ ] Consider:
  - [ ] Trainer's working hours
  - [ ] Existing bookings
  - [ ] Trainer's schedule/calendar
  - [ ] Service duration requirements
  - [ ] Buffer time between bookings
- [ ] Return array of available time slots (HH:mm format)
- [ ] Support different time slot intervals (15min, 30min, 60min)
- [ ] Handle timezone conversions properly

#### 2.2 Trainer Schedule Management
- [ ] **Endpoint:** `getTrainerSchedule(trainerId: String!, startDate: String!, endDate: String!)`
- [ ] Return trainer's schedule for date range
- [ ] Include working hours, breaks, blocked times
- [ ] Include existing bookings

#### 2.3 Set Trainer Availability
- [ ] **Endpoint:** `setTrainerAvailability(input: TrainerAvailabilityInput!)`
- [ ] Allow trainers to set their working hours
- [ ] Allow setting recurring schedules
- [ ] Allow blocking specific dates/times
- [ ] Validate schedule conflicts

---

### 3. Service Management

#### 3.1 Create Service
- [ ] **Endpoint:** `createService(input: ServiceInput!)`
- [ ] Validate required fields (title, bookingType, pricing)
- [ ] Validate durationOptions are valid
- [ ] Set default status to ACTIVE
- [ ] Support both fixedPrice and pricePerHour models
- [ ] Return created service

#### 3.2 Get Service
- [ ] **Endpoint:** `getService(serviceId: String!)`
- [ ] Return service with full details
- [ ] Include associated trainers (if service-trainer relationship exists)

#### 3.3 Get All Services
- [ ] **Endpoint:** `getAllServices(input: ServicesInquiry!)`
- [ ] Support filtering by:
  - [ ] bookingType
  - [ ] status (ACTIVE/INACTIVE)
  - [ ] text search (title, description)
- [ ] Support sorting
- [ ] Support pagination
- [ ] Return only ACTIVE services by default (unless admin)

#### 3.4 Update Service
- [ ] **Endpoint:** `updateService(input: ServiceUpdate!)`
- [ ] Allow updating all service fields
- [ ] Validate pricing changes don't affect existing bookings
- [ ] Handle status changes (ACTIVE/INACTIVE)
- [ ] Check permissions (only admin or service owner)

#### 3.5 Delete Service
- [ ] **Endpoint:** `deleteService(serviceId: String!)`
- [ ] Soft delete service
- [ ] Check if service has active bookings
- [ ] Prevent deletion if service is in use
- [ ] Set status to INACTIVE instead of deleting

#### 3.6 Service-Trainer Relationship (Future Enhancement)
- [ ] **Endpoint:** `assignServiceToTrainer(serviceId: String!, trainerId: String!)`
- [ ] **Endpoint:** `getTrainerServices(trainerId: String!)`
- [ ] Allow trainers to have personalized service offerings
- [ ] Support trainer-specific pricing

---

### 4. Payment Integration

#### 4.1 Payment Processing
- [ ] Integrate payment gateway (Stripe/PayPal)
- [ ] **Endpoint:** `processBookingPayment(bookingId: String!, paymentMethodId: String!)`
- [ ] Create payment record
- [ ] Process payment through gateway
- [ ] Update booking with paymentId
- [ ] Handle payment failures gracefully
- [ ] Send payment confirmation

#### 4.2 Refund Processing
- [ ] **Endpoint:** `refundBooking(bookingId: String!, reason: String!)`
- [ ] Process refund through payment gateway
- [ ] Update booking status to REFUNDED
- [ ] Create refund record
- [ ] Send refund confirmation

#### 4.3 Payment Status
- [ ] **Endpoint:** `getPaymentStatus(bookingId: String!)`
- [ ] Return payment status and details
- [ ] Include transaction history

---

## 🟡 MEDIUM PRIORITY - Enhanced Features

### 5. Booking Notifications

#### 5.1 Email Notifications
- [ ] Send booking confirmation email to client
- [ ] Send booking notification to trainer
- [ ] Send reminder emails (24h before, 1h before)
- [ ] Send cancellation emails
- [ ] Send completion emails
- [ ] Email templates for all notification types

#### 5.2 SMS Notifications
- [ ] Send SMS for booking confirmations
- [ ] Send SMS reminders
- [ ] Send SMS for cancellations
- [ ] Integrate SMS service (Twilio, etc.)

#### 5.3 In-App Notifications
- [ ] Create notification records in database
- [ ] Real-time notifications via WebSocket
- [ ] Notification preferences per user

---

### 6. Booking Validation & Business Rules

#### 6.1 Booking Rules Engine
- [ ] Minimum booking notice (e.g., 24 hours)
- [ ] Maximum advance booking (e.g., 3 months)
- [ ] Cancellation policy enforcement
- [ ] Rescheduling rules
- [ ] No-show handling
- [ ] Booking limits per user

#### 6.2 Conflict Detection
- [ ] Check for double bookings
- [ ] Check for overlapping time slots
- [ ] Validate trainer availability
- [ ] Check service capacity (for group classes)

---

### 7. Supplement Integration

#### 7.1 Supplement-Booking Relationship
- [ ] **Endpoint:** `addSupplementToBooking(bookingId: String!, supplementId: String!, quantity: Number!)`
- [ ] **Endpoint:** `getBookingSupplements(bookingId: String!)`
- [ ] Link supplements to bookings
- [ ] Track supplement recommendations by trainer
- [ ] Calculate supplement pricing
- [ ] Include supplements in booking total

#### 7.2 Supplement Recommendations
- [ ] **Endpoint:** `getRecommendedSupplements(bookingType: BookingType!, trainerId: String!)`
- [ ] Algorithm to recommend supplements based on:
  - [ ] Booking type
  - [ ] Trainer preferences
  - [ ] User goals
  - [ ] Service type

#### 7.3 Supplement Purchase
- [ ] **Endpoint:** `purchaseSupplement(supplementId: String!, quantity: Number!)`
- [ ] Create supplement order
- [ ] Process payment
- [ ] Update inventory (if tracking stock)
- [ ] Send order confirmation

---

### 8. Booking Analytics & Reporting

#### 8.1 Booking Statistics
- [ ] **Endpoint:** `getBookingStats(trainerId: String!, startDate: String!, endDate: String!)`
- [ ] Total bookings count
- [ ] Revenue by period
- [ ] Popular time slots
- [ ] Cancellation rate
- [ ] No-show rate
- [ ] Average booking value

#### 8.2 Service Performance
- [ ] **Endpoint:** `getServiceStats(serviceId: String!)`
- [ ] Booking count per service
- [ ] Revenue per service
- [ ] Popular services ranking

#### 8.3 Trainer Performance
- [ ] **Endpoint:** `getTrainerStats(trainerId: String!)`
- [ ] Total bookings
- [ ] Revenue generated
- [ ] Average rating
- [ ] Client retention rate

---

## 🟢 LOW PRIORITY - Advanced Features

### 9. Recurring Bookings

#### 9.1 Recurring Booking Creation
- [ ] **Endpoint:** `createRecurringBooking(input: RecurringBookingInput!)`
- [ ] Support weekly, bi-weekly, monthly patterns
- [ ] Create multiple bookings from pattern
- [ ] Handle date exceptions (holidays, etc.)

#### 9.2 Recurring Booking Management
- [ ] **Endpoint:** `updateRecurringBooking(recurringBookingId: String!, input: RecurringBookingUpdate!)`
- [ ] **Endpoint:** `cancelRecurringBooking(recurringBookingId: String!)`
- [ ] Allow modifying recurring pattern
- [ ] Handle individual booking modifications within series

---

### 10. Group Bookings

#### 10.1 Group Booking Support
- [ ] **Endpoint:** `createGroupBooking(input: GroupBookingInput!)`
- [ ] Support multiple clients in one booking
- [ ] Track group capacity
- [ ] Handle group pricing
- [ ] Manage group attendance

#### 10.2 Waitlist
- [ ] **Endpoint:** `addToWaitlist(bookingId: String!, clientId: String!)`
- [ ] **Endpoint:** `getWaitlist(bookingId: String!)`
- [ ] Queue clients when booking is full
- [ ] Auto-notify when slot becomes available
- [ ] Priority system for waitlist

---

### 11. Calendar Integration

#### 11.1 Calendar Sync
- [ ] **Endpoint:** `syncBookingToCalendar(bookingId: String!, calendarType: String!)`
- [ ] Support Google Calendar
- [ ] Support iCal/Outlook
- [ ] Two-way sync
- [ ] Handle calendar conflicts

#### 11.2 Calendar Export
- [ ] **Endpoint:** `exportBookingsToCalendar(clientId: String!, format: String!)`
- [ ] Export bookings as .ics file
- [ ] Include booking details in calendar event

---

### 12. Reviews & Ratings

#### 12.1 Booking Reviews
- [ ] **Endpoint:** `createBookingReview(bookingId: String!, input: ReviewInput!)`
- [ ] Allow clients to review completed bookings
- [ ] Link reviews to bookings
- [ ] Update trainer rating based on reviews
- [ ] Validate booking is completed before allowing review

#### 12.2 Review Management
- [ ] **Endpoint:** `getBookingReviews(bookingId: String!)`
- [ ] **Endpoint:** `getTrainerReviews(trainerId: String!)`
- [ ] Display reviews on trainer profile
- [ ] Support review moderation

---

## 🔧 TECHNICAL REQUIREMENTS

### 13. Database Schema

#### 13.1 Booking Collection
- [ ] Ensure all required fields are indexed
- [ ] Add indexes for:
  - [ ] providerId + bookingDate + bookingTime (for availability queries)
  - [ ] clientId + bookingStatus
  - [ ] bookingDate (for date range queries)
  - [ ] bookingStatus
- [ ] Add compound indexes for common queries
- [ ] Optimize for read performance

#### 13.2 Service Collection
- [ ] Add indexes for:
  - [ ] status
  - [ ] bookingType
  - [ ] text search fields
- [ ] Support full-text search

#### 13.3 Supplement Collection
- [ ] Add indexes for:
  - [ ] category
  - [ ] rating
- [ ] Support text search

#### 13.4 New Collections Needed
- [ ] **TrainerAvailability** - Store trainer schedules
- [ ] **BookingSupplement** - Junction table for booking-supplement relationship
- [ ] **Payment** - Payment records (may already exist)
- [ ] **Notification** - Notification records (may already exist)
- [ ] **RecurringBooking** - Recurring booking patterns
- [ ] **Waitlist** - Waitlist entries

---

### 14. API Performance

#### 14.1 Query Optimization
- [ ] Optimize GraphQL queries with DataLoader
- [ ] Implement query result caching
- [ ] Add pagination to all list queries
- [ ] Limit query depth to prevent N+1 problems

#### 14.2 Caching Strategy
- [ ] Cache trainer availability (short TTL)
- [ ] Cache service list (longer TTL)
- [ ] Cache trainer list (medium TTL)
- [ ] Invalidate cache on updates

#### 14.3 Rate Limiting
- [ ] Add rate limiting to booking creation
- [ ] Prevent booking spam
- [ ] Rate limit availability queries

---

### 15. Security & Validation

#### 15.1 Input Validation
- [ ] Validate all input fields server-side
- [ ] Sanitize user inputs
- [ ] Validate date formats
- [ ] Validate time formats
- [ ] Validate price calculations

#### 15.2 Authorization
- [ ] Check user permissions for all operations
- [ ] Only allow clients to create their own bookings
- [ ] Only allow trainers to view their bookings
- [ ] Admin-only operations properly protected

#### 15.3 Data Integrity
- [ ] Prevent race conditions in booking creation
- [ ] Use database transactions for critical operations
- [ ] Implement optimistic locking for updates
- [ ] Validate booking conflicts before creation

---

### 16. Error Handling

#### 16.1 Error Responses
- [ ] Consistent error response format
- [ ] Meaningful error messages
- [ ] Error codes for client handling
- [ ] Log all errors for debugging

#### 16.2 Error Scenarios
- [ ] Handle trainer not found
- [ ] Handle service not found
- [ ] Handle availability conflicts
- [ ] Handle payment failures
- [ ] Handle network errors
- [ ] Handle database errors

---

### 17. Testing

#### 17.1 Unit Tests
- [ ] Test booking creation logic
- [ ] Test availability calculation
- [ ] Test price calculation
- [ ] Test validation functions
- [ ] Test business rules

#### 17.2 Integration Tests
- [ ] Test booking creation end-to-end
- [ ] Test booking update flow
- [ ] Test payment integration
- [ ] Test notification sending
- [ ] Test availability queries

#### 17.3 E2E Tests
- [ ] Test complete booking flow
- [ ] Test cancellation flow
- [ ] Test rescheduling flow
- [ ] Test payment flow

---

## 📋 DATA MIGRATION & SEEDING

### 18. Data Setup

#### 18.1 Seed Data
- [ ] Create sample services
- [ ] Create sample trainers
- [ ] Create sample bookings (for testing)
- [ ] Create sample supplements

#### 18.2 Migration Scripts
- [ ] Migrate existing data (if any)
- [ ] Set up default services
- [ ] Set up default availability patterns

---

## 🔄 INTEGRATION POINTS

### 19. External Services

#### 19.1 Payment Gateway
- [ ] Stripe integration
- [ ] PayPal integration (optional)
- [ ] Payment webhook handling
- [ ] Payment status sync

#### 19.2 Email Service
- [ ] Email service integration (SendGrid, AWS SES, etc.)
- [ ] Email template management
- [ ] Email delivery tracking

#### 19.3 SMS Service
- [ ] SMS service integration (Twilio, etc.)
- [ ] SMS template management
- [ ] Delivery status tracking

#### 19.4 Calendar Services
- [ ] Google Calendar API
- [ ] Outlook/iCal support
- [ ] Calendar sync webhooks

---

## 📊 MONITORING & LOGGING

### 20. Observability

#### 20.1 Logging
- [ ] Log all booking operations
- [ ] Log payment transactions
- [ ] Log errors with context
- [ ] Log performance metrics

#### 20.2 Monitoring
- [ ] Monitor booking creation rate
- [ ] Monitor payment success rate
- [ ] Monitor API response times
- [ ] Monitor error rates
- [ ] Set up alerts for critical issues

#### 20.3 Analytics
- [ ] Track booking conversion funnel
- [ ] Track cancellation reasons
- [ ] Track popular services
- [ ] Track peak booking times

---

## 🎯 PRIORITY SUMMARY

### Phase 1 (Week 1-2) - Core Functionality
1. ✅ Booking CRUD operations
2. ✅ Trainer availability system
3. ✅ Service management
4. ✅ Basic payment integration
5. ✅ Database schema & indexes

### Phase 2 (Week 3-4) - Enhanced Features
1. ✅ Booking notifications (email/SMS)
2. ✅ Booking validation & business rules
3. ✅ Supplement integration
4. ✅ Basic analytics

### Phase 3 (Week 5-6) - Advanced Features
1. ✅ Recurring bookings
2. ✅ Group bookings
3. ✅ Calendar integration
4. ✅ Reviews & ratings

### Phase 4 (Ongoing) - Optimization
1. ✅ Performance optimization
2. ✅ Security hardening
3. ✅ Testing & QA
4. ✅ Monitoring & logging

---

## 📝 NOTES

- All endpoints should follow RESTful/GraphQL best practices
- All dates should be handled in UTC and converted to user's timezone
- All prices should be stored in smallest currency unit (cents) to avoid floating point issues
- Consider implementing a booking state machine for status transitions
- All sensitive operations should be logged for audit purposes
- Consider implementing a queue system for async operations (notifications, etc.)

---

**Last Updated:** 2024  
**Status:** In Progress  
**Owner:** Backend Team


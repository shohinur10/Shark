# Booking Backend Integration TODO List

## Status: Ready for Implementation

This document outlines all tasks needed to connect hardcoded booking session data to the backend.

---

## 🔴 CRITICAL PRIORITY

### 1. Backend: Add Location Types to Service Model

**Current Problem:** Location types (`"in-person"`, `"online"`) are hardcoded in frontend.

**Tasks:**
- [ ] **Backend:** Add `locationTypes: [String!]!` field to Service schema/model
  - Options should be: `["IN_PERSON", "ONLINE", "HYBRID"]` or similar
  - Field should be required (at least one location type per service)
  - Default to `["IN_PERSON", "ONLINE"]` for existing services
  
- [ ] **Backend:** Update Service database schema/migration
  - Add `locationTypes` field with array of strings
  - Add validation: at least one location type required
  - Update existing services with default values

- [ ] **Backend:** Update `GET_ALL_SERVICES` query
  - Include `locationTypes` field in response
  - Ensure field is returned for all services

- [ ] **Frontend:** Update Service type definition
  - Add `locationTypes: string[]` to `libs/types/service/service.ts`

- [ ] **Frontend:** Replace hardcoded location types
  - Update `BookingForm.tsx` to use `selectedService?.locationTypes || ["in-person", "online"]`
  - Map backend enum values to frontend display values if needed
  - Add fallback for services without locationTypes (backward compatibility)

**Files to Modify:**
- `libs/types/service/service.ts` (add `locationTypes: string[]`)
- `libs/components/booking/BookingForm.tsx` (lines 518-547, replace hardcoded MenuItems)
- Backend Service model/schema
- Backend `GET_ALL_SERVICES` resolver

**Testing:**
- [ ] Verify location types are fetched from backend
- [ ] Test with services that have different location type combinations
- [ ] Test backward compatibility (services without locationTypes)

---

## 🟡 MEDIUM PRIORITY

### 2. Backend: Improve BookingType Handling

**Current Problem:** Frontend has hardcoded string-to-enum mapping for booking types.

**Tasks:**
- [ ] **Backend:** Ensure Service `bookingType` field is enum type (not string)
  - Verify `bookingType` in Service model is proper GraphQL enum
  - Return enum values directly, not string literals
  
- [ ] **Backend:** Update `GET_ALL_SERVICES` query response
  - Return `bookingType` as enum value (e.g., `PERSONAL_TRAINING` not `"ONE_ON_ONE"`)
  
- [ ] **Frontend:** Remove hardcoded mapping (if backend fixed)
  - Update `pages/bookings/new.tsx` to use `selectedService.bookingType` directly
  - Remove `bookingTypeMap` object (lines 229-235)

**Files to Modify:**
- `pages/bookings/new.tsx` (simplify bookingType mapping)
- Backend Service model/resolver

**Testing:**
- [ ] Verify bookingType is returned as enum
- [ ] Test booking creation with different booking types

---

### 3. Frontend: Make Duration Labels Dynamic

**Current Problem:** Duration label formatting is hardcoded and only handles specific values (30, 60, 90, 120 minutes).

**Tasks:**
- [ ] **Frontend:** Enhance `formatDurationLabel` function
  - Make it handle ANY duration value dynamically
  - Format: "X hours Y minutes" or "X minutes" as appropriate
  - Update in both `BookingForm.tsx` and `BookingSummary.tsx`

- [ ] **Optional - Backend:** Add duration labels to Service (if needed)
  - Add `durationLabels: Map<Int, String>` field (optional)
  - Allow custom labels per service for specific durations

**Files to Modify:**
- `libs/components/booking/BookingForm.tsx` (lines 62-68)
- `libs/components/booking/BookingSummary.tsx` (lines 64-71)

**Testing:**
- [ ] Test with various duration values (15, 45, 75, 105, 180 minutes, etc.)
- [ ] Verify labels display correctly

---

## 🟢 OPTIONAL ENHANCEMENTS

### 4. Backend: Create Booking Configuration Endpoint

**Current Problem:** Some booking configuration might be better served from a dedicated endpoint.

**Tasks:**
- [ ] **Backend:** Create `GET_BOOKING_CONFIG` query
  - Return global booking configuration:
    - Available location types (global defaults)
    - Default duration options
    - Booking rules (min advance time, max advance time, etc.)
    - Buffer time between bookings
  
- [ ] **Frontend:** Use config endpoint for fallbacks
  - Use service-specific `locationTypes` first
  - Fall back to global config if service doesn't specify

**Files to Create:**
- Backend: New `GET_BOOKING_CONFIG` query
- Frontend: New query hook/component

---

### 5. Backend: Enhance Service Query Response

**Tasks:**
- [ ] **Backend:** Add `description` field to Service (if missing)
- [ ] **Backend:** Add `status` field (ACTIVE, INACTIVE) to filter services
- [ ] **Backend:** Ensure all required fields are returned in `GET_ALL_SERVICES`

**Files to Modify:**
- Backend Service model/schema
- Backend `GET_ALL_SERVICES` resolver

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Critical - Location Types
- [ ] Backend: Add `locationTypes` to Service model
- [ ] Backend: Update database schema
- [ ] Backend: Update `GET_ALL_SERVICES` query
- [ ] Frontend: Update Service type
- [ ] Frontend: Replace hardcoded location types
- [ ] Test: Verify location types work end-to-end

### Phase 2: Medium - Booking Type & Duration
- [ ] Backend: Fix bookingType enum (if needed)
- [ ] Frontend: Remove bookingType mapping (if backend fixed)
- [ ] Frontend: Make duration labels dynamic
- [ ] Test: Verify all duration values work

### Phase 3: Optional - Enhancements
- [ ] Backend: Create booking config endpoint
- [ ] Frontend: Integrate config endpoint
- [ ] Backend: Enhance service query

---

## 🔍 TESTING REQUIREMENTS

### Unit Tests
- [ ] Test Service type includes locationTypes
- [ ] Test location type selection in BookingForm
- [ ] Test duration label formatting with various values

### Integration Tests
- [ ] Test booking creation with different location types
- [ ] Test booking creation with various duration options
- [ ] Test backward compatibility (services without locationTypes)

### E2E Tests
- [ ] Complete booking flow with backend-connected location types
- [ ] Verify all buttons work correctly
- [ ] Verify form validation works with dynamic data

---

## 📝 NOTES

### Button Status
- ✅ **Back Button:** Working correctly, no changes needed
- ✅ **Confirm Booking Button:** Working correctly, connected to backend

### Current Backend Connections (Working)
- ✅ Trainers list (`GET_TRAINERS`)
- ✅ Services list (`GET_ALL_SERVICES`)
- ✅ Trainer availability (`GET_TRAINER_AVAILABILITY`)
- ✅ Booking creation (`CREATE_BOOKING`)
- ✅ Service duration options (from service)
- ✅ Service pricing (from service)

### Data Flow
1. User selects service → Frontend uses `service.locationTypes` (once implemented)
2. User selects duration → Frontend uses `service.durationOptions` (already working)
3. User confirms booking → Frontend calls `CREATE_BOOKING` mutation (already working)

---

## 🚀 QUICK START

### To Fix Location Types (Critical):

1. **Backend:**
   ```graphql
   type Service {
     # ... existing fields
     locationTypes: [String!]!  # Add this
   }
   ```

2. **Frontend:**
   ```tsx
   // In BookingForm.tsx, replace hardcoded MenuItems:
   {selectedService?.locationTypes?.map((location) => (
     <MenuItem key={location} value={location.toLowerCase()}>
       {location.replace('_', '-')}
     </MenuItem>
   )) || (
     <>
       <MenuItem value="in-person">In-Person</MenuItem>
       <MenuItem value="online">Online</MenuItem>
     </>
   )}
   ```

---

**Last Updated:** Based on comprehensive analysis
**Priority Order:** Critical → Medium → Optional
**Estimated Time:** 
- Phase 1 (Critical): 2-4 hours
- Phase 2 (Medium): 1-2 hours  
- Phase 3 (Optional): 2-3 hours


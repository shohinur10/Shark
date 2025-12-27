# Booking Page Analysis Report

## Date: Analysis Complete
## Purpose: Identify hardcoded data and buttons for backend integration

---

## 1. BUTTONS ANALYSIS

### 1.1 Back Button
**Location:** `libs/components/booking/BookingPage.tsx` (Lines 94-100)
- **Type:** Navigation button
- **Functionality:** Routes user to previous page using `router.back()`
- **Status:** ✅ Working correctly, no backend needed
- **Icon:** ArrowBackIcon from Material-UI

```tsx
<Button
    startIcon={<ArrowBackIcon />}
    onClick={() => router.back()}
    className={styles.backButton}
>
    Back
</Button>
```

---

### 1.2 Confirm Booking Button
**Location:** `libs/components/booking/BookingSummary.tsx` (Lines 210-245)
- **Type:** Submit/Action button
- **Functionality:** 
  - Submits booking form via `onSubmit()` handler
  - Disabled when: `creatingBooking` is true OR `isFormValid` is false
  - Shows loading state with spinner during booking creation
  - Text changes: "Confirm Booking" → "Creating Booking..."
- **Status:** ✅ Connected to backend via `CREATE_BOOKING` mutation
- **Backend Integration:** ✅ Working (calls `createBooking` mutation in `pages/bookings/new.tsx`)

```tsx
<Button
    variant="contained"
    fullWidth
    size="large"
    onClick={onSubmit}
    disabled={creatingBooking || !isFormValid}
>
    {creatingBooking ? (
        <>
            <CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />
            Creating Booking...
        </>
    ) : (
        'Confirm Booking'
    )}
</Button>
```

**Button States:**
- ✅ **Normal:** Red background (#E92C28), enabled when form is valid
- ⏳ **Loading:** Shows spinner, text changes to "Creating Booking..."
- 🚫 **Disabled:** Gray background (#e0e0e0) when form invalid or user not logged in

---

## 2. HARDCODED DATA IDENTIFIED

### 2.1 Location Type Options ⚠️ **HARDCODED**
**Location:** `libs/components/booking/BookingForm.tsx` (Lines 518-547)

**Current Implementation:**
```tsx
<Select value={locationType || ''} onChange={(e) => onLocationChange(e.target.value)}>
    <MenuItem value="in-person">In-Person</MenuItem>
    <MenuItem value="online">Online</MenuItem>
</Select>
```

**Problem:** 
- Location types are hardcoded as "in-person" and "online"
- Not dynamic based on service configuration
- Some services may only support certain location types

**Expected Backend Solution:**
- Service should have `locationTypes: String[]` field
- Or global booking configuration endpoint should return available location types
- Examples: `["IN_PERSON", "ONLINE", "HYBRID"]`

**Impact:** 🔴 **HIGH** - Limits flexibility, cannot configure per-service location options

---

### 2.2 Duration Label Formatting ⚠️ **PARTIALLY HARDCODED**
**Location:** `libs/components/booking/BookingForm.tsx` (Lines 62-68, 468)
**Location:** `libs/components/booking/BookingSummary.tsx` (Lines 64-71)

**Current Implementation:**
```tsx
const formatDurationLabel = (minutes: number) => {
    if (minutes === 30) return '30 minutes';
    if (minutes === 60) return '1 hour';
    if (minutes === 90) return '1.5 hours';
    if (minutes === 120) return '2 hours';
    return `${minutes} minutes`;
};
```

**Problem:**
- Duration values come from `service.durationOptions` (backend) ✅
- But label formatting is hardcoded in frontend
- Limited to specific duration values (30, 60, 90, 120 minutes)
- Doesn't handle other durations gracefully

**Current Backend Data:**
- `service.durationOptions: number[]` - Array of minutes from backend ✅

**Expected Enhancement:**
- Backend could provide `durationLabels` mapping or service should include label configuration
- OR frontend should handle any duration value dynamically

**Impact:** 🟡 **MEDIUM** - Works but not flexible for custom durations

---

### 2.3 Booking Type Mapping ⚠️ **PARTIALLY HARDCODED**
**Location:** `pages/bookings/new.tsx` (Lines 229-235)

**Current Implementation:**
```tsx
const bookingTypeMap: Record<string, BookingType> = {
    'GROUP_CLASS': BookingType.GROUP_CLASS,
    'ONE_ON_ONE': BookingType.PERSONAL_TRAINING,
    'PERSONAL_TRAINING': BookingType.PERSONAL_TRAINING,
    'ONLINE_COACHING': BookingType.ONLINE_SESSION,
    'ONLINE_SESSION': BookingType.ONLINE_SESSION,
};
```

**Problem:**
- Mapping between service `bookingType` strings and enum values is hardcoded
- Backend should return enum values directly, not string mappings
- Or service should have proper enum field type

**Expected Backend Solution:**
- Service `bookingType` field should be proper enum type
- Or backend should return mapped enum value directly

**Impact:** 🟡 **MEDIUM** - Works but relies on string matching

---

### 2.4 Service Duration Options ✅ **FROM BACKEND**
**Location:** `libs/components/booking/BookingForm.tsx` (Line 454)
**Location:** Service type definition: `libs/types/service/service.ts`

**Current Implementation:**
```tsx
selectedService.durationOptions.map((minutes: number) => (
    <MenuItem key={minutes} value={minutes}>
        {formatDurationLabel(minutes)}
    </MenuItem>
))
```

**Status:** ✅ **Working correctly** - Duration options come from `service.durationOptions` array from backend

**Backend Field:** `service.durationOptions: number[]`

---

### 2.5 Minimum Booking Date ✅ **CALCULATED DYNAMICALLY**
**Location:** `pages/bookings/new.tsx` (Lines 49-51)

**Current Implementation:**
```tsx
const minDate = useMemo(() => {
    return moment().format('YYYY-MM-DD');
}, []);
```

**Status:** ✅ **Working correctly** - Dynamically calculates today's date, no hardcoding

---

### 2.6 Price Calculation ✅ **FROM BACKEND**
**Location:** `pages/bookings/new.tsx` (Lines 264-279)

**Current Implementation:**
```tsx
const calculateTotalPrice = (service: Service | null, durationMinutes: number): number => {
    if (!service || durationMinutes === 0) return 0;
    
    if (service.fixedPrice !== undefined && service.fixedPrice !== null) {
        return service.fixedPrice;
    }
    
    if (service.pricePerHour) {
        const total = service.pricePerHour * (durationMinutes / 60);
        return Math.round(total * 100) / 100;
    }
    
    return 0;
};
```

**Status:** ✅ **Using backend data** - Calculates from `service.fixedPrice` or `service.pricePerHour` from backend

**⚠️ SECURITY NOTE:** Backend should also calculate price server-side for security (see BACKEND_TODO_BOOKING.md)

---

## 3. BACKEND DATA FLOW ANALYSIS

### 3.1 Currently Fetched from Backend ✅

| Data | Source | Query/Mutation | Status |
|------|--------|----------------|--------|
| Trainers List | `GET_TRAINERS` | GraphQL Query | ✅ Working |
| Services List | `GET_ALL_SERVICES` | GraphQL Query | ✅ Working |
| Trainer Availability | `GET_TRAINER_AVAILABILITY` | GraphQL Query | ✅ Working |
| Service Duration Options | `service.durationOptions` | From GET_ALL_SERVICES | ✅ Working |
| Service Pricing | `service.pricePerHour` / `service.fixedPrice` | From GET_ALL_SERVICES | ✅ Working |
| Booking Creation | `CREATE_BOOKING` | GraphQL Mutation | ✅ Working |

---

### 3.2 Missing from Backend ⚠️

| Data | Current State | Needed |
|------|---------------|--------|
| Location Types | Hardcoded: `["in-person", "online"]` | Should come from service or config |
| Duration Labels | Hardcoded formatting function | Optional: backend could provide labels |
| Service BookingType | String values need mapping | Should be enum directly |

---

## 4. SUMMARY

### ✅ What's Working:
1. Trainers fetch from backend ✅
2. Services fetch from backend ✅
3. Duration options from backend ✅
4. Pricing calculation from backend data ✅
5. Availability slots from backend ✅
6. Booking creation mutation works ✅
7. Both buttons functional ✅

### ⚠️ What Needs Backend Integration:

1. **Location Types** 🔴 **CRITICAL**
   - Currently hardcoded: `["in-person", "online"]`
   - Should be: Service-specific or global configuration
   - Impact: Cannot customize location options per service

2. **Duration Label Formatting** 🟡 **MEDIUM PRIORITY**
   - Currently hardcoded formatting function
   - Could be enhanced with backend labels or made fully dynamic
   - Impact: Limited flexibility for custom durations

3. **Booking Type Mapping** 🟡 **MEDIUM PRIORITY**
   - Currently string-to-enum mapping in frontend
   - Should be enum directly from backend
   - Impact: Potential mismatch if backend changes string values

---

## 5. RECOMMENDATIONS

### Immediate Actions Required:

1. **Add `locationTypes` to Service Model**
   - Backend should add `locationTypes: [String]` field to Service
   - Options: `["IN_PERSON", "ONLINE", "HYBRID"]`
   - Or add global booking configuration endpoint

2. **Enhance Service Query**
   - Include `locationTypes` in `GET_ALL_SERVICES` response
   - Ensure `bookingType` is returned as enum (not string)

3. **Update Frontend**
   - Replace hardcoded location types with `service.locationTypes`
   - Add fallback if locationTypes not provided

### Optional Enhancements:

1. Add `durationLabels` mapping to service (optional)
2. Make duration formatting fully dynamic for any value
3. Add service-specific booking configuration endpoint

---

**Report Generated:** Analysis Complete
**Next Steps:** See TODO list in project for implementation plan



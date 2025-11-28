# 🦈 Shark Platform - Navigation Map

## Quick Navigation Structure

```
┌─────────────────────────────────────────────────────────┐
│                    TOP NAVIGATION                        │
├─────────────────────────────────────────────────────────┤
│ Home | Workouts | Exercises | Nutrition | Progress |    │
│ Trainers | Gyms | Community | Pricing                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    USER DROPDOWN                         │
│ (When Logged In)                                         │
├─────────────────────────────────────────────────────────┤
│ 📊 Dashboard                                             │
│ 💪 My Workouts                                           │
│ 📈 My Progress                                           │
│ 🥗 My Nutrition                                          │
│ 🎯 My Goals                                              │
│ 🏆 My Achievements                                       │
│ 🎮 My Challenges                                         │
│ 📅 My Bookings                                           │
│ 💳 Subscriptions                                         │
│ 👤 Profile                                               │
│ ⚙️  Settings                                             │
└─────────────────────────────────────────────────────────┘
```

## Page URL Structure Recommendation

```
/                              → Home
/workouts                      → Browse Workouts
/workouts/[id]                 → Workout Detail
/exercises                     → Exercise Library
/exercises/[id]                → Exercise Detail
/nutrition                     → Nutrition Hub
/nutrition/meal-plans          → Meal Plans
/nutrition/meal-plans/[id]     → Meal Plan Detail
/nutrition/my-nutrition        → My Nutrition Tracker
/nutrition/recipes             → Recipe Library
/nutrition/recipes/[id]        → Recipe Detail
/progress                      → Progress Dashboard
/progress/measurements         → Body Measurements
/progress/photos               → Progress Photos
/progress/workout-log          → Workout History
/goals                         → Goals & Achievements
/goals/create                  → Create Goal
/challenges                    → Challenges
/challenges/[id]               → Challenge Detail
/trainers                      → Trainer Directory
/trainers/[id]                 → Trainer Profile
/trainers/[id]/book            → Book Session
/gyms                          → Gym Directory
/gyms/[id]                     → Gym Detail
/community                     → Community Feed
/community/[id]                → Post Detail
/community/create              → Create Post
/pricing                       → Plans & Pricing
/dashboard                     → User Dashboard
/bookings                      → My Bookings
/bookings/new                  → New Booking
/mypage                        → My Page
/mypage/profile                → Profile Settings
/mypage/workouts               → My Workouts
/mypage/subscriptions          → Subscriptions
/support                       → Customer Support
/support/faq                   → FAQ
/support/contact               → Contact Us
```

## Suggested Navigation Renaming

### Current → Recommended

| Current | Recommended | Reason |
|---------|------------|---------|
| `/property` | `/gyms` | More fitness-specific |
| `/agent` | `/trainers` | Standard fitness terminology |
| `/cs` | `/support` | More professional |
| `/mypage` | `/dashboard` or keep `/mypage` | Dashboard is more modern |

## Mobile Bottom Navigation (Priority Pages)

```
┌─────────────────────────────────────┐
│  🏠 Home  💪 Workouts  📊 Progress  │
│         👤 Profile                  │
└─────────────────────────────────────┘
```

## Secondary Navigation (Sidebar on Dashboard)

```
Dashboard Sidebar:
├─ Overview
├─ Workouts
│  ├─ My Workouts
│  ├─ Saved Workouts
│  └─ Workout History
├─ Nutrition
│  ├─ Active Meal Plan
│  ├─ Daily Tracker
│  └─ Saved Recipes
├─ Progress
│  ├─ Measurements
│  ├─ Photos
│  └─ Workout Log
├─ Goals & Achievements
├─ Bookings
├─ Subscriptions
└─ Settings
```






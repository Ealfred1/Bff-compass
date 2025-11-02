# BFF COMPASS - Specification Compliance Checklist

## 🎯 Quick Reference: What Needs to Be Done

This checklist maps directly to the comprehensive BFF COMPASS specification provided.

---

## 🔴 CRITICAL PRIORITY (Must Fix for MVP)

### 1. Authentication System
- [ ] **Replace email/password with School ID-only auth**
  - Update sign-up page to accept School ID
  - Implement custom auth or magic link flow
  - Remove email/password fields
  - Update profiles table to use school_id instead of username

### 2. Buddy System Architecture
- [ ] **Convert from 1-on-1 to Group-Based (3-5 members)**
  - Create buddy_groups table
  - Create buddy_group_members table
  - Update matching logic for groups
  - Enforce 3-5 member limit
  - Build group management UI

### 3. AI Matching Algorithm
- [ ] **Create Supabase Edge Function for AI matching**
  - Implement matching criteria:
    - Similar leisure interests (top 3 categories)
    - Similar loneliness levels (±1 category)
    - Recent mood patterns
  - Use OpenAI or Claude API
  - Store matching_criteria in buddy_groups
  - Create groups of 3-5 members

### 4. End-to-End Encryption
- [ ] **Implement E2E encryption for group messages**
  - Use Web Crypto API (AES-GCM)
  - Generate per-group encryption keys
  - Encrypt messages client-side before sending
  - Decrypt on client-side display
  - Secure key storage

### 5. "You Good? Line" Crisis Feature
- [ ] **Persistent floating button on all pages**
  - Position: bottom-right corner
  - Modal with crisis check:
    - "Are you in crisis?"
    - If YES: Direct tel:988 link
    - If NO: Show non-emergency resources
  - Visible on every route
  - Prominent and accessible

### 6. Database Schema Updates
- [ ] Create mental_health_resources table
- [ ] Create guidance_content table
- [ ] Create user_guidance_history table
- [ ] Create events table
- [ ] Create event_attendance table
- [ ] Add computed columns for loneliness_category
- [ ] Update badges table with criteria_type and threshold
- [ ] Add school_id to profiles table

---

## 🟡 HIGH PRIORITY (Core Features)

### 7. My Guidance System
- [ ] **Daily Messages**
  - Create guidance content
  - Personalize by loneliness category (Low, Moderate, Moderately High, High)
  - Display on dashboard
  - Track viewing in user_guidance_history
  - Refresh daily

- [ ] **Weekly Videos**
  - One video per week per category
  - Based on day of week
  - Video player component
  - Track completion
  - Notification for new videos

### 8. Mental Health Resources
- [ ] **Resource Management**
  - Seed resources table with emergency contacts
  - 988 Crisis Lifeline (prominent)
  - Non-emergency resources
  - Click-to-call (tel: links)
  - Website links
  - Operating hours
  - Search/filter functionality

### 9. Event Management
- [ ] **Event System**
  - Admin can create events
  - Event listing page
  - Event details (title, description, URL, date)
  - Copy event link to share in chats
  - Attendance tracking
  - **Survey re-trigger after 20 events attended**

### 10. Leisure Survey Completion
- [ ] **Expand to 21 questions total**
  - Section 1: 21 word pairs (mark X)
  - Section 2: 21 picture pairs (select letter)
  - Calculate scores for all 7 domains (A-G)
  - Store responses in section1_responses and section2_responses
  - Calculate top 3 categories properly

### 11. Loneliness Assessment Enhancement
- [ ] **Add computed category column**
  - 6-34: Low
  - 35-49: Moderate
  - 50-64: Moderately High
  - 65+: High
- [ ] Use category for guidance and matching

---

## 🟢 MEDIUM PRIORITY (Enhanced Features)

### 12. Badge Auto-Awarding
- [ ] **Implement badge criteria tracking**
  - Create Edge Function to check criteria
  - Trigger on relevant actions:
    - events_attended
    - messages_sent
    - mood_checkins
    - connections_made
    - weekly_streaks
  - Award badge when threshold met
  - Send notification

- [ ] **Specific Badges**
  - First Connection (join first buddy group)
  - Social Butterfly (attend 5 events)
  - Conversation Starter (send 50 messages)
  - Mood Master (complete 10 mood check-ins)
  - Wellness Warrior (complete both surveys)
  - Streak Master (7-day mood check-in streak)
  - Event Enthusiast (attend 10, 20 events)

### 13. Mood Tracking Enhancements
- [ ] **Add mood tags** (array field)
  - Tags: 'anxious', 'energetic', 'lonely', 'happy', etc.
  - Mood tag selector component
- [ ] **Mood visualization**
  - Charts (line chart over time)
  - Mood history page
  - Analytics
- [ ] **Daily reminder notification**
- [ ] **AI integration for matching**

### 14. Admin Dashboard
- [ ] **User Management**
  - View all users
  - User details
  - Survey results
  - Activity metrics

- [ ] **Content Management**
  - Create/edit daily messages
  - Create/edit weekly videos
  - Tag by loneliness category
  - Schedule content

- [ ] **Badge Management**
  - Create new badges
  - Set criteria and thresholds
  - View badge statistics

- [ ] **Resource Management**
  - Add/edit emergency resources
  - Add/edit non-emergency resources
  - Display order

- [ ] **Event Management**
  - Create events
  - Edit events
  - View attendance
  - Event analytics

- [ ] **Analytics Dashboard**
  - User engagement metrics
  - Survey results aggregates
  - Connection statistics
  - Most active users
  - Badge distribution

### 15. Notifications System
- [ ] **Push notifications or in-app notifications**
  - New daily message available
  - New weekly video available
  - New message in group chat
  - Badge earned
  - Mood check-in reminder
  - Survey reminder (after 20 events)

---

## 🔵 LOW PRIORITY (Nice to Have)

### 16. Real-time Messaging Features
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Online status
- [ ] Message editing/deletion

### 17. Group Chat Enhancements
- [ ] Event link preview cards
- [ ] Image/media sharing
- [ ] Emoji reactions
- [ ] Copy link functionality

### 18. Profile & Settings
- [ ] Avatar upload
- [ ] Bio editing
- [ ] Privacy settings
- [ ] Notification preferences

### 19. Onboarding Polish
- [ ] Welcome screen with BFF COMPASS intro
- [ ] Progress indicators
- [ ] Better transitions
- [ ] Onboarding completion celebration

---

## 📊 Current Implementation Status

| Category | Status | Notes |
|----------|--------|-------|
| Infrastructure | ✅ Complete | Next.js, Supabase, Tailwind ready |
| Design System | ✅ Complete | Teal/Orange colors, Poppins font |
| Authentication | ❌ Wrong Type | Email/password instead of School ID |
| Database Schema | ⚠️ 50% | Missing 7 tables, computed columns |
| Onboarding Surveys | ⚠️ 70% | Leisure survey needs expansion |
| Buddy System | ❌ Wrong Model | 1-on-1 instead of groups |
| Messaging | ⚠️ 40% | No encryption, no group support |
| Mood Tracking | ⚠️ 70% | Basic tracking, needs charts/tags |
| Badges | ⚠️ 30% | Display only, no auto-awarding |
| Resources | ❌ 0% | Empty, needs full implementation |
| Guidance | ❌ 0% | Not implemented |
| Events | ❌ 0% | Not implemented |
| Admin | ❌ 0% | Not implemented |
| "You Good? Line" | ❌ 0% | **Critical missing feature** |
| AI Matching | ❌ 0% | Not implemented |
| E2E Encryption | ❌ 0% | Not implemented |

---

## 🎯 MVP Definition (Must-Have for Launch)

To comply with the comprehensive specification, the MVP MUST include:

1. ✅ School ID-only authentication
2. ✅ Both onboarding surveys (complete)
3. ✅ Group-based buddy system (3-5 members)
4. ✅ AI-powered matching
5. ✅ E2E encrypted group messaging
6. ✅ "You Good? Line" crisis button
7. ✅ Mental health resources page
8. ✅ Mood tracking
9. ✅ Basic badge system (even without auto-awarding)
10. ✅ Daily guidance messages (minimal)

**Current MVP Status: 3/10 ❌**

---

## 📝 Implementation Order (Recommended)

### Week 1-2: Foundation Fixes
1. Database schema updates (all new tables)
2. School ID authentication
3. Expand leisure survey to 21 questions
4. Add loneliness category computed column

### Week 2-3: Core Buddy & Messaging
1. Buddy groups (3-5 members)
2. AI matching Edge Function
3. E2E encryption implementation
4. Group messaging UI

### Week 3-4: Guidance & Resources
1. Guidance content system
2. Daily messages
3. Weekly videos
4. Mental health resources
5. **"You Good? Line" button**

### Week 4-5: Events & Gamification
1. Event management
2. Attendance tracking
3. Badge auto-awarding
4. Survey re-trigger logic

### Week 5-6: Admin & Polish
1. Admin dashboard
2. Analytics
3. Notifications
4. Testing & bug fixes

---

## ✅ Acceptance Criteria

The app meets specification when:

- [ ] Users can log in with School ID only
- [ ] Users complete both surveys (UCLA + 21-question Leisure)
- [ ] Users are matched into groups of 3-5 based on AI algorithm
- [ ] Users can send encrypted messages in group chats
- [ ] "You Good? Line" button appears on every page
- [ ] Users receive personalized daily messages by loneliness category
- [ ] Users can view weekly videos
- [ ] Mental health resources are accessible with click-to-call
- [ ] Events are listed and attendance is tracked
- [ ] Surveys re-trigger after 20 events
- [ ] Badges are automatically awarded based on criteria
- [ ] Admin can manage all content and users

**Current Acceptance: 0/12 criteria met ❌**

---

**Last Updated:** 2025-11-02  
**Git Commit:** afc7d0a


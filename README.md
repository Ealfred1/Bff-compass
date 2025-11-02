# BFF COMPASS - Social Wellness Application

**Find Your Friend Compass and Combat Loneliness**

BFF COMPASS is a full-stack social wellness application that helps users combat loneliness through AI-powered buddy matching, guided mental wellness content, and secure peer connections.

## 🎯 Project Overview

This application is designed to help combat social isolation by:
- **Smart Buddy Matching**: AI-powered matching based on leisure interests and loneliness assessment
- **Secure Connections**: End-to-end encrypted group messaging (3-5 members per group)
- **Guided Wellness**: Daily messages and weekly videos tailored to loneliness levels
- **Progress Tracking**: Mood check-ins, badges, and milestone achievements
- **Mental Health Resources**: Quick access to crisis and non-emergency support

## 🎨 Design System

### Brand Colors
- **Primary (Teal)**: `#0D9488` - Connection and growth
- **Secondary (Orange)**: `#F97316` - Warmth and energy
- **Navy**: `#1E3A5F` - Trust and stability
- **Background**: `#FAF8F5` - Warm, welcoming off-white

### Design Principles
- **Welcoming**: Youth-friendly, warm interface with rounded corners
- **Accessible**: WCAG 2.1 AA compliant with proper contrast ratios
- **Consistent**: Using shadcn/ui components with Tailwind CSS
- **Modern**: Next.js 14+ App Router for optimal performance

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Fonts**: Poppins (Google Fonts)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions

### AI/ML
- OpenAI API or Claude API (for buddy matching and mood insights)

## 📁 Project Structure

```
bff/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard & features
│   ├── onboarding/        # Onboarding surveys
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions
│   └── supabase/        # Supabase client configs
├── scripts/             # Database scripts
│   ├── 001_create_tables.sql
│   └── 002_seed_badges.sql
├── public/              # Static assets
└── styles/              # Global styles
```

## 🗄️ Database Schema

### Core Tables
- **profiles**: User profiles extending auth.users
- **loneliness_assessments**: UCLA Loneliness Scale results
- **leisure_assessments**: Leisure Interest Survey results
- **connections**: Buddy connections/matches
- **messages**: Encrypted messages between buddies
- **mood_entries**: Daily mood tracking
- **badges**: Achievement definitions
- **user_badges**: User-earned badges

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data and connected buddies' data
- Public read access for badges and resources

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account and project

### Environment Setup

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Installation

```bash
# Install dependencies
pnpm install

# Run database migrations
# (Execute scripts/001_create_tables.sql in Supabase SQL Editor)
# (Execute scripts/002_seed_badges.sql in Supabase SQL Editor)

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 📱 Core Features

### 1. Authentication & Onboarding
- School ID-based authentication (planned)
- UCLA Loneliness Survey (6 questions, 1-4 scale)
- Leisure Interest Survey (word and picture pairs)
- Profile creation

### 2. Buddy System
- AI-powered matching based on:
  - Leisure interest compatibility
  - Similar loneliness levels (±1 category)
  - Recent mood patterns
- Groups of 3-5 members
- Manual group browsing/joining

### 3. My Connections (Messaging)
- End-to-end encrypted group chats (planned)
- Real-time messaging
- Event link sharing
- Typing indicators and read receipts

### 4. My Guidance
- Daily messages personalized by loneliness category
- Weekly videos based on loneliness level and day of week
- Content tracking and history

### 5. My Badges
- Achievement system with progress tracking
- Badge categories:
  - First Connection, Social Butterfly
  - Conversation Starter, Wellness Warrior
  - Streak Master, Event Enthusiast

### 6. My Resources
- Emergency mental health resources (988 Crisis Lifeline)
- Non-emergency support contacts
- **"You Good? Line"** - Persistent crisis check button

### 7. Mood Tracking
- Daily mood check-ins (1-5 scale)
- Mood tags and notes
- Historical mood visualization
- AI uses mood data for matching

### 8. Event Management (Planned)
- Campus event listings
- Attendance tracking
- Survey re-trigger after 20 events attended

## 🔐 Security Features

### Row Level Security (RLS)
All tables have RLS policies ensuring:
- Users can only read/write their own data
- Users can view profiles of buddy group members
- Messages are only accessible to group participants

### End-to-End Encryption (Planned)
- Web Crypto API for client-side encryption
- Per-group encryption keys
- Encrypted message storage in database

## 🎯 UCLA Loneliness Scale

Six questions measuring loneliness on a 1-4 scale:
1. Companionship
2. Feeling alone
3. Closeness to others
4. Feeling left out
5. Being known
6. People around but not with you

**Scoring**:
- 6-34: Low loneliness
- 35-49: Moderate loneliness
- 50-64: Moderately high loneliness
- 65+: High loneliness

## 🎨 Leisure Interest Survey

Seven leisure categories assessed through word/picture pairs:
- **A**: Physical Activities
- **B**: Mind-Body
- **C**: Games
- **D**: Creative Expression
- **E**: Social Outings
- **F**: Collecting
- **G**: Nature

## 📊 Admin Dashboard (Planned)

- User management and analytics
- Content management (guidance messages, videos)
- Badge management and criteria
- Resource management
- Event management
- Engagement metrics

## 🚧 Roadmap

### Phase 1: Foundation ✅ (Current)
- Basic authentication
- Onboarding surveys
- Profile creation
- Database schema
- UI design system

### Phase 2: Core Features (In Progress)
- [ ] School ID-only authentication
- [ ] Buddy group system (3-5 members)
- [ ] AI matching algorithm
- [ ] E2E encrypted messaging
- [ ] Real-time chat

### Phase 3: Wellness & Engagement
- [ ] Daily guidance messages
- [ ] Weekly videos
- [ ] Mood tracking with charts
- [ ] Badge system with auto-awarding
- [ ] Mental health resources
- [ ] "You Good? Line" crisis button

### Phase 4: Advanced Features
- [ ] Event management
- [ ] Survey re-trigger (after 20 events)
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Push notifications

## 🤝 Contributing

This project follows best practices:
- TypeScript for type safety
- ESLint for code quality
- Proper error handling
- Loading states and optimistic UI
- Accessibility (WCAG 2.1 AA)
- Mobile-first responsive design

## 📝 License

This project is private and confidential.

## 🆘 Support

For emergency mental health support:
- **988 Crisis Lifeline**: Call or text 988
- **Crisis Text Line**: Text HOME to 741741

---

**Built with ❤️ to combat loneliness and foster meaningful connections**


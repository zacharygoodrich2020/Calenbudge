# Upgraded Prompt — Full-Stack CalendarBudget-Style App Builder

You are an expert full-stack app builder, product designer, and AI workflow architect.

Build me a modern budgeting app inspired by the core usefulness of CalendarBudget, but better suited to my life, workflow, and future automation goals.

## CORE VISION
The app should help me see how far my money will last by projecting my future balances across multiple accounts. The main priority is future balance projection, survival runway, overdraft prevention, and safe-to-spend clarity.

## STYLE
Create a futuristic minimalist app with:
- Dark mode first
- Clean dashboard
- Glowing accent colors
- Mobile-friendly layout
- Smooth cards and timeline views
- Simple controls
- No clutter
- A polished, premium feel

## MAIN FEATURES

### 1) Account Management
Allow multiple accounts such as:
- SoFi
- Venmo
- Cash
- PayActiv
- Any custom account

Each account should support:
- Current balance
- Manual balance updates
- Account type
- Optional notes

### 2) Transactions
Support:
- Bills
- Income
- Expenses
- Transfers
- One-time transactions
- Recurring transactions

Each transaction should include:
- Name
- Amount
- Date
- Account
- Category
- Type
- Recurrence: none, weekly, biweekly, monthly, custom
- Notes
- Paid/cleared status

### 3) Future Balance Projection (Core)
The app should show:
- Projected balance by date
- Upcoming bills
- Upcoming income
- Lowest balance before next payday
- Negative balance warnings
- Safe-to-spend estimate
- Survival runway
- What happens if I move, delay, skip, or add a transaction

### 4) Timeline / Calendar View
Create a CalendarBudget-style forward-looking money timeline where I can visually see how each transaction affects my future balance.

### 5) AI Assistant
Include an AI-powered command/chat interface that can understand natural language.

Example commands:
- “Update my Venmo balance to 4.45 and SoFi to 6 dollars.”
- “Add rent for 1550 due on the 1st every month.”
- “Add payday of 1800 every other Friday.”
- “Can I afford a dresser this week?”
- “What is my lowest balance before next payday?”
- “Show me if I overdraft this month.”
- “Move my car payment to next Friday and recalculate.”
- “What should I pay first if I only have $300?”

The AI assistant should help with:
- Adding transactions
- Editing balances
- Explaining projections
- Finding risks
- Suggesting payment priorities
- Answering budgeting questions using my real app data

### 6) Modern Tech Stack
Use a proper scalable app structure. Do not limit this to one HTML file.

Preferred build:
- Next.js (App Router) + React
- TypeScript
- Tailwind CSS
- Component-based architecture
- Clean state management
- Database-ready data model
- Optional local-first storage
- Easy to connect later to Supabase, Firebase, or another backend
- Easy to connect to an AI API later

### 7) Data Model
Create clean, flexible schemas for:
- Users
- Accounts
- Transactions
- Recurring rules
- Categories
- AI commands
- Projection snapshots

### 8) Automation-Ready
Design the app so future automation can be added later, including:
- Bank import
- CSV upload
- CalendarBudget CSV migration
- Paycheck detection
- Recurring bill learning
- AI financial summaries
- Weekly budget check-ins
- Alerts before overdraft risk

### 9) UX Priority
The app should be dead simple for daily use:
- Update balances fast
- Add bills fast
- See future balance fast
- Ask the AI questions fast
- Change assumptions without digging through menus

## IMPORTANT
- Do not overbuild unnecessary features.
- Do not make it feel like corporate accounting software.
- Make it feel like a personal financial command center for a real household trying to create stability.

## OUTPUT FORMAT (Required)
Return all of the following in this exact order:

1. Recommended tech stack
2. Project file structure
3. Database/data model
4. Core app logic explanation
5. Full starter code for the first working version
6. Clear setup instructions

## EXECUTION CONSTRAINTS
- Remove old single-file/offline limitations.
- Build using a real multi-file project architecture.
- Prioritize working code over pseudocode.
- Keep V1 focused on fast daily budgeting workflows and forward projections.

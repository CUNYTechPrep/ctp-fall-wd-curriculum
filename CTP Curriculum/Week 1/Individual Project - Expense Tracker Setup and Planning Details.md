# Individual Project: Expense Tracker Setup & Planning - Detailed Guide

## Overview
Duration: 25 minutes  
Learning Target: Initialize individual expense tracker project with professional structure and development plan

## Project Context

### Why Individual Projects Matter
- Personal portfolio piece for job applications
- Self-paced learning opportunity
- Demonstrates individual capabilities
- Safe space for experimentation

### The Expense Tracker Project
- 10-week progressive build
- Start simple (React UI) → End complex (Full-stack deployed)
- Common enough to find resources
- Complex enough to showcase skills
- Practical application everyone understands

## Part 1: Project Initialization (10 minutes)

### Step 1: Repository Creation (3 min)

#### Via GitHub UI:
1. Go to github.com
2. Click "New repository"
3. **Repository name:** `expense-tracker-[firstname-lastname]`
   - Example: `expense-tracker-sarah-chen`
4. **Description:** "Personal finance tracking application built with React, TypeScript, and AWS"
5. **Visibility:** Public (for portfolio)
6. **Initialize with:**
   - ✓ Add a README
   - ✓ Add .gitignore (Node)
   - ✓ Choose a license (MIT)

#### Initial Clone:
```bash
# In CodeSpaces terminal
git clone https://github.com/[username]/expense-tracker-[name].git
cd expense-tracker-[name]
```

### Step 2: Project Structure Setup (4 min)

#### Create Directory Structure:
```bash
# Create the folder structure
mkdir -p docs/ADR docs/planning docs/standups docs/architecture
mkdir -p docs/resources docs/decisions
touch docs/planning/roadmap.md
touch docs/standups/week1.md
touch .env.example
```

#### Final Structure:
```
expense-tracker-[name]/
├── README.md              (update with your work from YOU DO 2)
├── docs/
│   ├── ADR/
│   │   └── ADR-001.md    (from YOU DO 2)
│   ├── planning/
│   │   └── roadmap.md    (create now)
│   ├── standups/
│   │   └── week1.md      (create now)
│   ├── architecture/
│   │   └── (future diagrams)
│   ├── resources/
│   │   └── (helpful links)
│   └── decisions/
│       └── (project decisions)
├── .gitignore
├── .env.example
└── LICENSE
```

### Step 3: Initial Configuration Files (3 min)

#### Create `.env.example`:
```bash
# Environment Variables Template
# Copy this to .env and fill in your values

# Development
NODE_ENV=development
PORT=3000

# Database (Week 7+)
DATABASE_URL=

# Authentication (Week 8+)
JWT_SECRET=
SESSION_SECRET=

# External APIs (Future)
PLAID_CLIENT_ID=
PLAID_SECRET=

# AWS (Week 10)
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

#### Update `.gitignore`:
```bash
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Testing
coverage/
.nyc_output/

# Logs
logs/
*.log
npm-debug.log*

# Temporary files
tmp/
temp/
```

#### First Commit:
```bash
git add .
git commit -m "Initial project setup with documentation structure"
git push origin main
```

## Part 2: Individual Development Planning (10 minutes)

### Step 1: Create GitHub Project Board (3 min)

#### Setup Kanban Board:
1. Go to repository → Projects tab
2. Click "New project"
3. Choose "Board" template
4. Name: "Expense Tracker Development"
5. Create columns:
   - 📋 Backlog
   - 🎯 This Week
   - 🚧 In Progress
   - ✅ Done
   - 🚫 Blocked

#### Initial Cards:
Create cards for Week 1:
- Setup development environment
- Create component architecture plan
- Design initial wireframes
- Setup React with TypeScript
- Create basic layout components

### Step 2: Development Roadmap (4 min)

#### Create `docs/planning/roadmap.md`:
```markdown
# Expense Tracker Development Roadmap

## Project Overview
Building a full-stack expense tracking application over 10 weeks, progressing from basic React UI to deployed AWS application.

## Technical Goals
- Master React with TypeScript
- Implement clean architecture patterns
- Build a REST API with authentication
- Deploy to production on AWS
- Maintain 80%+ test coverage

## Weekly Milestones

### Phase 1: Foundation (Weeks 1-3)
**Goal:** Basic React application with core UI components

#### Week 1: Setup & Planning
- [x] Development environment setup
- [x] Project documentation structure
- [ ] Component architecture design
- [ ] Basic React + TypeScript setup
- [ ] Layout components (Header, Navigation)

#### Week 2: Core Components
- [ ] Expense form component
- [ ] Expense list component
- [ ] Category selector
- [ ] Basic routing setup
- [ ] Initial styling with Tailwind

#### Week 3: State Management
- [ ] Implement state management solution
- [ ] Local data persistence
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states

### Phase 2: Features (Weeks 4-6)
**Goal:** Complete frontend with all features

#### Week 4: Data Visualization
- [ ] Spending by category chart
- [ ] Monthly trends graph
- [ ] Budget progress indicators
- [ ] Dashboard layout
- [ ] Responsive design

#### Week 5: Advanced Features
- [ ] Search and filtering
- [ ] Bulk operations
- [ ] Export functionality
- [ ] Settings page
- [ ] Theme switching

#### Week 6: Polish & Testing
- [ ] Unit tests for components
- [ ] Integration tests
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] UI/UX refinements

### Phase 3: Backend (Weeks 7-9)
**Goal:** Full-stack application with API

#### Week 7: API Development
- [ ] Node.js + Express setup
- [ ] Database schema design
- [ ] CRUD endpoints
- [ ] API documentation
- [ ] Postman collection

#### Week 8: Authentication
- [ ] User registration
- [ ] Login/logout flow
- [ ] JWT implementation
- [ ] Protected routes
- [ ] Password reset

#### Week 9: Integration
- [ ] Connect frontend to API
- [ ] Error handling
- [ ] Data synchronization
- [ ] Offline capability
- [ ] API optimization

### Phase 4: Deployment (Week 10)
**Goal:** Production-ready application

#### Week 10: AWS Deployment
- [ ] CI/CD pipeline setup
- [ ] AWS configuration
- [ ] Database deployment
- [ ] Domain setup
- [ ] Monitoring setup

## Success Metrics
- Clean, maintainable codebase
- Comprehensive documentation
- 80%+ test coverage
- < 3s page load time
- Accessible (WCAG 2.1 AA)
- Successfully deployed to production

## Risk Mitigation
- **Time constraints:** Focus on MVP features first
- **Technical challenges:** Seek help early in office hours
- **Scope creep:** Stick to roadmap, note future enhancements
- **Deployment issues:** Practice deployment early (Week 8)

## Future Enhancements (Post-Program)
- Bank account integration
- Mobile application
- Machine learning categorization
- Multi-user support
- Business expense features
```

### Step 3: Personal Standup Documentation (3 min)

#### Create `docs/standups/week1.md`:
```markdown
# Week 1 Standup Log

## Date: [Today's Date]

### 📊 Weekly Goal
Set up development environment and plan component architecture for expense tracker.

### ✅ What I Completed
- Set up GitHub repository with professional structure
- Created comprehensive README documentation  
- Wrote first ADR about Tailwind CSS choice
- Configured CodeSpaces environment
- Learned GitHub Copilot best practices

### 🚧 What I'm Working On
- Planning React component hierarchy
- Researching TypeScript best practices for React
- Creating initial wireframes in Figma
- Setting up React project with Vite
- Designing data models for expenses

### 🚫 Blockers
- **Technical:**
  - Unsure about state management approach (Context vs Redux vs Zustand)
  - Need clarification on TypeScript strict mode settings
  
- **Knowledge Gaps:**
  - How to structure TypeScript types for the project
  - Best practices for organizing React components
  
- **Resources Needed:**
  - Examples of well-structured React+TS projects
  - Recommended testing approach for React components

### 📚 Learning Goals This Week
1. **Master TypeScript with React**
   - Understand generic components
   - Learn proper typing for events and refs
   - Practice with discriminated unions

2. **Component Architecture**
   - Study compound component patterns
   - Understand composition vs inheritance
   - Learn when to split components

3. **Documentation Habits**
   - Keep README updated as I code
   - Document decisions in ADRs
   - Maintain clear commit messages

### 💡 Insights & Reflections
- Copilot is helpful for boilerplate but I need to understand every line
- Good documentation now saves hours of confusion later
- Planning before coding prevents major refactoring
- Working in public makes me write cleaner code

### 🎯 Tomorrow's Focus
1. Set up React project with TypeScript
2. Create basic component structure
3. Implement Header and Navigation components

### 📊 Time Tracking
- Documentation: 2 hours
- Setup & Configuration: 1.5 hours  
- Learning/Research: 1 hour
- Coding: 0.5 hours (initial setup only)

### 🤝 Help Needed
- Code review for initial component structure
- Feedback on TypeScript configuration
- Suggestions for state management approach

---

## Standup History
- Week 1: Environment setup and planning *(current)*
- Week 2: [To be added]
- Week 3: [To be added]
```

## Part 3: Project Scope & Requirements (5 minutes)

### Core Feature Checklist

#### Must Have (MVP):
```markdown
## MVP Features Checklist

### Expense Management
- [ ] Add new expense
  - Amount (required)
  - Category (required)
  - Description (optional)
  - Date (default: today)
- [ ] Edit existing expense
- [ ] Delete expense
- [ ] View expense list

### Categories
- [ ] Default categories (Food, Transport, Entertainment, etc.)
- [ ] Custom category creation
- [ ] Category colors/icons
- [ ] Edit/Delete categories

### Analytics
- [ ] Total spending display
- [ ] Spending by category (pie chart)
- [ ] Monthly trend (line graph)
- [ ] Current month summary

### UI/UX
- [ ] Responsive design (mobile-first)
- [ ] Dark/Light theme
- [ ] Loading states
- [ ] Error messages
- [ ] Empty states
```

#### Technical Requirements:
```markdown
## Technical Requirements

### Frontend
- [ ] React 18+ with functional components
- [ ] TypeScript with strict mode
- [ ] Tailwind CSS for styling
- [ ] React Router for navigation
- [ ] Form validation
- [ ] Proper error boundaries

### Code Quality
- [ ] ESLint configuration
- [ ] Prettier formatting
- [ ] Husky pre-commit hooks
- [ ] Conventional commits
- [ ] 80%+ test coverage

### Performance
- [ ] Lazy loading for routes
- [ ] Optimized images
- [ ] Memoization where needed
- [ ] Bundle size < 200KB

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Proper ARIA labels
```

### Individual Learning Contract

Students create personal commitment:
```markdown
## My Learning Commitment

### I commit to:
1. **Daily Progress**
   - Code at least 1 hour per day
   - Update standup log daily
   - Push commits regularly

2. **Professional Practices**
   - Write clean, documented code
   - Create meaningful commit messages
   - Keep README current
   - Document decisions in ADRs

3. **Learning Focus**
   - Understand before implementing
   - Use Copilot responsibly
   - Ask for help when stuck > 30 min
   - Share knowledge with peers

4. **Quality Standards**
   - Test my code
   - Handle edge cases
   - Consider accessibility
   - Optimize performance

### My Personal Goals:
1. [Add your specific goal]
2. [Add another goal]
3. [Add learning objective]

Signed: [Your Name]
Date: [Today's Date]
```

## Instructor Checkpoints

### 5-Minute Check-ins:
- Repository created and structured?
- Documentation started?
- Roadmap realistic?
- Any immediate blockers?

### Common Issues to Address:
1. **Over-ambitious roadmaps**
   - Help scope down to achievable goals
   - Focus on MVP first

2. **Analysis paralysis**
   - Encourage starting simple
   - Iterate and improve

3. **Unclear requirements**
   - Clarify feature expectations
   - Provide examples

4. **Technical confusion**
   - TypeScript vs JavaScript start
   - State management choices

## Success Criteria

### By End of Session:
- [ ] Repository created with proper structure
- [ ] README and ADR from previous activities integrated
- [ ] Roadmap document completed
- [ ] First standup entry written
- [ ] GitHub Project board created
- [ ] Initial commit pushed

### Quality Indicators:
- Clear, realistic planning
- Professional documentation
- Thoughtful technical decisions
- Personal learning goals defined
- Commitment to daily progress

## Next Steps Preparation

### For Week 2:
- React component architecture
- TypeScript integration
- Basic expense components
- Tailwind CSS setup

### Resources to Review:
- React documentation
- TypeScript handbook
- Tailwind CSS docs
- Example expense trackers

### Mental Models to Build:
- Component composition
- State management patterns
- TypeScript type safety
- Project organization
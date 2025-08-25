# YOU DO Block 2: README & ADR Creation - Detailed Guide

## Overview
Duration: 20 minutes  
Learning Target: Students create professional documentation for their expense tracker projects

## Pre-Activity Setup (2 minutes)

### Student Preparation
- CodeSpaces with expense tracker repository
- Access to provided templates
- Understanding of project scope
- Clear project vision

### File Structure Setup
```
expense-tracker-[yourname]/
├── README.md              (to create)
├── docs/
│   ├── ADR/
│   │   └── ADR-001.md    (to create)
│   └── templates/        (provided)
│       ├── README-template.md
│       └── ADR-template.md
```

## Part 1: README Development (10 minutes)

### Step-by-Step README Creation

#### 1. Project Overview (2 min)

**Students start with:**
```markdown
# Expense Tracker - [Your Name]

## 🎯 Overview
[Write 2-3 sentences describing your expense tracker. What makes it unique? What problem does it solve?]

## 🚀 Live Demo
[Will be added after deployment]

## 📸 Screenshots
[Will be added as development progresses]
```

**Example Student Work:**
```markdown
# Expense Tracker - Sarah Chen

## 🎯 Overview
A modern expense tracking application that uses AI to automatically categorize transactions and provide personalized spending insights. Built with React and TypeScript, it features real-time budget alerts and beautiful data visualizations to help users take control of their financial health.

## 🚀 Live Demo
[Will be added after deployment]

## 📸 Screenshots
[Will be added as development progresses]
```

#### 2. Problem Statement & Solution (2 min)

**Template Section:**
```markdown
## 💡 Problem Statement
[Describe the specific problem your app solves. Be concrete about user pain points.]

## ✨ Solution
[Explain how your app addresses these problems. What's your unique approach?]
```

**Example Student Work:**
```markdown
## 💡 Problem Statement
Young professionals often struggle to track their expenses across multiple payment methods (credit cards, Venmo, cash) leading to overspending and financial stress. Existing apps are either too complex for casual users or too simple to provide meaningful insights.

## ✨ Solution
This expense tracker simplifies financial management by:
- Auto-importing transactions from bank accounts (coming in v2)
- Smart categorization using pattern recognition
- Visual spending trends that highlight problem areas
- Gentle budget notifications that encourage better habits
- Quick manual entry for cash transactions
```

#### 3. Features & Roadmap (2 min)

**Template Section:**
```markdown
## 🎨 Features

### Current Features (MVP - Weeks 1-5)
- [ ] User authentication
- [ ] Add/Edit/Delete expenses
- [ ] Category management
- [ ] Basic spending dashboard
- [ ] Monthly budget setting

### Planned Features (Weeks 6-10)
- [ ] Receipt photo upload
- [ ] Spending analytics
- [ ] Export to CSV/PDF
- [ ] Recurring expense tracking
- [ ] Budget notifications

### Future Enhancements (Post-Program)
- [ ] Bank integration
- [ ] Bill splitting with friends
- [ ] Investment tracking
- [ ] Tax report generation
```

#### 4. Technical Architecture (2 min)

**Students complete:**
```markdown
## 🛠️ Technical Stack

### Frontend
- **React 18** - [Why did you choose React?]
- **TypeScript** - [Why TypeScript over JavaScript?]
- **Tailwind CSS** - [Why this styling approach?]
- **[State Management]** - [Your choice and reasoning]

### Backend (Weeks 7-9)
- **[Your choice]** - [Why this backend?]
- **[Database]** - [Why this database?]
- **[Authentication]** - [Your auth strategy]

### Tools & Services
- **GitHub Actions** - CI/CD pipeline
- **[Deployment]** - [Where will you deploy?]
- **[Other tools]** - [Any other services?]
```

#### 5. Setup Instructions (2 min)

**Basic Template:**
```markdown
## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/[yourusername]/expense-tracker-[yourname].git
   cd expense-tracker-[yourname]
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000
```

### README Quality Checklist
- [ ] Clear project description
- [ ] Problem/solution clearly stated
- [ ] Features list with checkboxes
- [ ] Technical decisions explained
- [ ] Setup instructions tested
- [ ] Professional formatting
- [ ] No placeholder text remaining

## Part 2: ADR Practice (10 minutes)

### Creating Your First ADR

#### 1. Choose a Technical Decision (2 min)

**Common First ADRs for Students:**
- Frontend framework choice (React vs Vue vs Angular)
- Styling approach (Tailwind vs CSS Modules vs Styled Components)
- State management (Context API vs Redux vs Zustand)
- TypeScript adoption
- Testing strategy
- Deployment platform

#### 2. Write ADR-001 (6 min)

**Students use this template:**
```markdown
# ADR-001: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[What is the issue that we're seeing that is motivating this decision?]
[Include any constraints, requirements, or assumptions]

## Decision
[What is the change that we're proposing and/or doing?]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

### Negative
- [Drawback 1]
- [Drawback 2]

### Neutral
- [Neutral impact or observation]

## Alternatives Considered
- [Alternative 1]: [Why not chosen]
- [Alternative 2]: [Why not chosen]
```

**Example Student ADR:**
```markdown
# ADR-001: Use Tailwind CSS for Styling

## Status
Accepted

## Context
We need to choose a styling solution for the expense tracker that allows rapid development while maintaining consistency. The team has limited time (10 weeks) and needs to focus on functionality over custom design. Mobile responsiveness is critical as users will check expenses on the go.

## Decision
We will use Tailwind CSS as our primary styling solution.

## Consequences

### Positive
- Rapid prototyping with utility classes
- Consistent design system out of the box
- Excellent responsive design utilities
- Small bundle size with PurgeCSS
- Great documentation and community

### Negative
- Learning curve for utility-first approach
- HTML can become verbose with many classes
- Less semantic than traditional CSS
- Customization requires configuration

### Neutral
- Different from traditional CSS methodologies
- Requires PostCSS build step

## Alternatives Considered
- **CSS Modules**: More familiar but slower development
- **Styled Components**: Adds complexity and bundle size
- **Material-UI**: Too opinionated for our custom design
- **Plain CSS**: Too time-consuming for our timeline
```

#### 3. Create Second ADR (2 min)

**Quick second decision to document:**
```markdown
# ADR-002: [Second Technical Decision]

[Students complete a second ADR for practice]
```

### Common ADR Topics for Expense Tracker

1. **State Management**
   - Context API vs Redux vs Zustand
   - Local state vs global state strategy

2. **Data Persistence**
   - LocalStorage vs IndexedDB (before backend)
   - Database choice for backend

3. **Component Architecture**
   - Folder structure decisions
   - Component composition patterns

4. **Testing Strategy**
   - Unit tests vs integration tests
   - Testing library choices

5. **Authentication Approach**
   - JWT vs session-based
   - Social login integration

## Success Verification

### README Evaluation Criteria
1. **Clarity** (25%)
   - Easy to understand project purpose
   - Clear problem/solution statement

2. **Completeness** (25%)
   - All sections filled out
   - No template placeholders

3. **Technical Accuracy** (25%)
   - Correct technical information
   - Realistic feature roadmap

4. **Professionalism** (25%)
   - Good formatting and structure
   - Error-free writing

### ADR Evaluation Criteria
1. **Context Clarity** (30%)
   - Clear problem statement
   - Constraints identified

2. **Decision Rationale** (30%)
   - Logical reasoning
   - Alternatives considered

3. **Consequences Analysis** (30%)
   - Balanced view (pros and cons)
   - Realistic assessment

4. **Format Compliance** (10%)
   - Follows ADR template
   - Proper numbering

## Common Student Challenges & Solutions

### README Challenges

1. **Too Vague**
   - Problem: "An app to track expenses"
   - Solution: "A mobile-first expense tracker that uses AI to categorize spending and provides actionable insights for college students managing limited budgets"

2. **Over-Ambitious Features**
   - Problem: Listing 50+ features
   - Solution: Focus on 5-7 MVP features, 5-7 planned, and mark others as "future enhancements"

3. **Missing Technical Justification**
   - Problem: "Using React" (no why)
   - Solution: "Using React for its component reusability and large ecosystem of financial visualization libraries"

### ADR Challenges

1. **Decision Without Context**
   - Problem: Jumping straight to decision
   - Solution: Always explain the problem first

2. **Only Positive Consequences**
   - Problem: No drawbacks mentioned
   - Solution: Every decision has trade-offs; be honest

3. **No Alternatives**
   - Problem: Not showing other options
   - Solution: List 2-3 alternatives and why they weren't chosen

## Time Management Tips

### For Slower Students
- Use provided templates more directly
- Focus on one section at a time
- Complete basic version first, enhance later

### For Advanced Students
- Add additional sections (Contributing, License, Badges)
- Create multiple ADRs
- Add diagrams or architecture sketches
- Help peers with their documentation

## Final Checks

### Before Committing
```bash
# Students should verify:
git add README.md
git add docs/ADR/ADR-001.md
git status  # Check files are staged
git commit -m "Add professional documentation: README and first ADR"
git push
```

### Peer Review (If Time Allows)
- Exchange repository links
- Read each other's README
- Provide one compliment and one suggestion
- Check if you understand their project from docs alone
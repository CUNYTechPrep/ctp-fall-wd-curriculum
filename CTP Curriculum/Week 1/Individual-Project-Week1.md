# Individual Project Week 1: Project Planning & Documentation

## Overview
Duration: 25 minutes  
Learning Target: Plan your expense tracker project with professional documentation

## Learning Goals
- Create a comprehensive README
- Write your first Architecture Decision Record (ADR)
- Set up GitHub repository with proper structure
- Plan your project roadmap
- Document technical decisions

## Part 1: GitHub Repository Setup (5 minutes)

### Create Your Repository
```bash
# Repository name: expense-tracker-[your-name]
# Description: "Personal expense tracking application"
# Make it public for your portfolio
# Initialize with README
```

### Professional Project Structure
```
expense-tracker/
├── README.md                 # Project overview
├── docs/
│   ├── decisions/           # Architecture Decision Records
│   │   └── ADR-001-project-stack.md
│   ├── planning/            # Project planning docs
│   │   ├── roadmap.md
│   │   └── user-stories.md
│   └── technical/           # Technical documentation
│       └── architecture.md
├── .gitignore
└── LICENSE
```

## Part 2: Write a Professional README (10 minutes)

### README.md Template

Create a professional README using this structure:

```markdown
# Expense Tracker

## Overview
[TODO: Write 2-3 sentences describing what your app does and why it's useful]

## Problem Statement
[TODO: Describe the problem your app solves. Consider:]
- What frustrates people about tracking expenses?
- Why do existing solutions fall short?
- What specific pain points will you address?

## Target Users
[TODO: List 3-4 types of users who would benefit from your app]

## Core Features (MVP)
[TODO: List 5-6 essential features for version 1]
- [ ] 
- [ ] 
- [ ] 
- [ ] 
- [ ] 

## Technical Stack
[TODO: Fill in this table with your technology choices and reasoning]
| Layer | Technology | Justification |
|-------|------------|---------------|
| Frontend | | |
| Styling | | |
| Type Safety | | |
| State | | |
| Data | | |
| Deployment | | |

## Project Timeline
[TODO: Plan what you'll build each week]
- **Week 1**: 
- **Week 2**: 
- **Week 3**: 
- **Week 4**: 
- **Week 5**: 
- **Week 6**: 
- **Week 7**: 
- **Week 8**: 
- **Week 9**: 
- **Week 10**: 

## Getting Started
[TODO: Write installation and setup instructions]

## Development Process
[TODO: Describe your development workflow]

## Architecture Decisions
See [docs/decisions](./docs/decisions) for detailed technical decisions.

## Contributing
[TODO: How can others contribute or give feedback?]

## Learning Goals
[TODO: List 4-5 things you want to learn from this project]
- [ ] 
- [ ] 
- [ ] 
- [ ] 
- [ ] 

## Author
**[TODO: Your Name]**
- GitHub: [TODO: Your GitHub profile]
- LinkedIn: [TODO: Your LinkedIn profile]

## License
[TODO: Choose a license - MIT is common for open source]

## Acknowledgments
[TODO: Credit any resources, tutorials, or people who helped]
```

## Part 3: Architecture Decision Records (10 minutes)

### What is an ADR?
ADRs document important technical decisions, explaining:
- What decision was made
- Why it was made
- What alternatives were considered
- What the consequences are

### ADR-001: Initial Technology Stack
Create: `docs/decisions/ADR-001-project-stack.md`

Use this template and fill in your own decisions:

```markdown
# ADR-001: Initial Technology Stack

## Status
[TODO: Accepted/Proposed/Deprecated]

## Context
[TODO: Describe the situation and what needs to be decided]
Consider:
- What are your constraints?
- What are your goals?
- What factors influence this decision?

## Decision
[TODO: State what you've decided to do]
Example format:
We will use [technology] for [purpose] because [reason].

## Consequences

### Positive
[TODO: List good things that will result from this decision]
- 
- 
- 

### Negative
[TODO: List challenges or downsides]
- 
- 
- 

## Alternatives Considered

### Option 1: [TODO: Alternative technology/approach]
- **Pros**: [TODO: Benefits]
- **Cons**: [TODO: Drawbacks]
- **Decision**: [TODO: Why you didn't choose this]

### Option 2: [TODO: Another alternative]
- **Pros**: 
- **Cons**: 
- **Decision**: 

## Notes
[TODO: Any additional thoughts or future considerations]
```

### ADR-002: Data Storage Strategy
Create: `docs/decisions/ADR-002-data-storage.md`

```markdown
# ADR-002: Data Storage Strategy

## Status
[TODO: Your status]

## Context
[TODO: Explain why you need to make a decision about data storage]
Questions to consider:
- Where will expense data be stored?
- How will it persist between sessions?
- What are the trade-offs of different approaches?

## Decision
[TODO: What storage approach will you use and why?]

## Consequences

### Positive
[TODO: Benefits of your chosen approach]

### Negative
[TODO: Limitations or challenges]

## Migration Plan
[TODO: How will you evolve your storage solution over time?]
Example:
- Weeks 1-4: [Initial approach]
- Weeks 5-7: [Intermediate approach]
- Weeks 8-10: [Final approach]

## Notes
[TODO: Any additional considerations]
```

## Part 4: Project Planning Documents (5 minutes)

### User Stories
Create: `docs/planning/user-stories.md`

```markdown
# User Stories

## As a user, I want to...

### MVP (Weeks 1-3)
[TODO: List 5 core user stories]
- [ ] As a user, I want to... so that...
- [ ] 
- [ ] 
- [ ] 
- [ ] 

### Enhanced Features (Weeks 4-6)
[TODO: List 5 additional features]
- [ ] 
- [ ] 
- [ ] 
- [ ] 
- [ ] 

### Advanced Features (Weeks 7-10)
[TODO: List 5 stretch goals]
- [ ] 
- [ ] 
- [ ] 
- [ ] 
- [ ] 

## Acceptance Criteria

### [TODO: Feature Name]
**Given** [TODO: Initial context]
**When** [TODO: Action taken]
**Then** [TODO: Expected result]
**And** [TODO: Additional outcome]

### [TODO: Another Feature]
**Given** 
**When** 
**Then** 
```

### Technical Roadmap
Create: `docs/planning/roadmap.md`

```markdown
# Technical Roadmap

## Phase 1: Foundation (Weeks 1-3)
### Week 1: Documentation & Setup
[TODO: List your Week 1 tasks]
- [ ] 
- [ ] 
- [ ] 
- [ ] 

### Week 2: [TODO: Week 2 Focus]
[TODO: List your Week 2 tasks]
- [ ] 
- [ ] 
- [ ] 
- [ ] 

### Week 3: [TODO: Week 3 Focus]
[TODO: List your Week 3 tasks]
- [ ] 
- [ ] 
- [ ] 
- [ ] 

## Phase 2: [TODO: Name this phase] (Weeks 4-6)
[TODO: List main goals for weeks 4-6]

## Phase 3: [TODO: Name this phase] (Weeks 7-9)
[TODO: List main goals for weeks 7-9]

## Phase 4: [TODO: Name this phase] (Week 10)
[TODO: List final week goals]
```

## Part 5: Git Best Practices

### Commit Message Format
```
type: subject

body (optional)

footer (optional)
```

Examples:
```bash
docs: add initial README and ADRs

feat: add expense form component

fix: correct total calculation bug

style: update button colors for better contrast

refactor: extract validation logic to utilities
```

### Branch Strategy
```bash
main           # Production-ready code
├── develop    # Integration branch
    ├── feature/add-expense-form
    ├── feature/typescript-setup
    └── fix/calculation-bug
```

## Documentation as Living Documents

### Key Principle
Documentation is not a one-time task. It evolves with your project:
- **README**: Update weekly with progress
- **ADRs**: Create new ones for each major decision
- **Roadmap**: Adjust based on learnings
- **User Stories**: Mark complete, add new ones

### Weekly Documentation Rhythm
Every week you should:
1. Update README with progress
2. Create ADR for major decisions
3. Update roadmap based on reality
4. Mark completed user stories
5. Document lessons learned

### Documentation Structure for Course
```
docs/
├── decisions/           # ADRs (add one each week minimum)
│   ├── ADR-001-initial-stack.md    (Week 1)
│   ├── ADR-002-react-adoption.md   (Week 2)
│   ├── ADR-003-typescript.md       (Week 3)
│   └── ...              # Continue adding
├── planning/
│   ├── roadmap.md      # Update weekly
│   └── user-stories.md # Update weekly
├── technical/
│   └── architecture.md # Create in Week 3
└── weekly-reflections/
    ├── week1.md        # Your learnings
    ├── week2.md        # Your challenges
    └── week3.md        # Your victories
```

## Week 1 Checklist
- [ ] Repository created with professional name
- [ ] Initial README written (will update weekly)
- [ ] First 2 ADRs documented
- [ ] User stories defined (will update weekly)
- [ ] Technical roadmap created (will adjust weekly)
- [ ] Project board set up in GitHub
- [ ] Commit messages follow convention
- [ ] Documentation structure created

## Documentation Tips

### Good Documentation:
- Explains WHY, not just WHAT
- Includes examples
- Stays up-to-date
- Is easy to navigate
- Answers common questions

### README Best Practices:
- Start with the problem you're solving
- Include screenshots (when you have them)
- Make setup instructions foolproof
- Link to other documentation
- Keep it concise but complete

### ADR Best Practices:
- One decision per ADR
- Number them sequentially
- Never delete, only supersede
- Include date and authors
- Be honest about trade-offs

## Resources
- [ADR GitHub](https://adr.github.io/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [README Templates](https://github.com/othneildrew/Best-README-Template)
- [User Story Examples](https://www.atlassian.com/agile/project-management/user-stories)

## Why Documentation Matters
- **For Interviews**: Shows professional thinking
- **For Teams**: Onboards new developers
- **For Future You**: Remember decisions
- **For Portfolio**: Demonstrates process
- **For Learning**: Reinforces understanding

## Next Week Preview
Week 2: We'll implement the React components we've planned!

## Remember
- Documentation is part of the code
- Write docs for your future self
- Good docs save more time than they take
- This is a skill employers value highly!
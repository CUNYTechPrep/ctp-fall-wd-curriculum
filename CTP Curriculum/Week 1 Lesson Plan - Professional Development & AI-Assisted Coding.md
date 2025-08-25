## LEARNING OBJECTIVES

### Content Objectives (What students will know):
- Identify agile development principles and explain how sprint planning, standups, and retrospectives support team collaboration (see [https://business.adobe.com/blog/basics/agile](https://business.adobe.com/blog/basics/agile))
- Compare documentation approaches and justify why READMEs and ADRs are critical for professional codebases (see [https://adr.github.io](https://adr.github.io) and [https://readme.so](https://readme.so))
- Analyze AI coding assistant capabilities and evaluate appropriate use cases for GitHub Copilot (see [[Responsible AI Agent Usage]])
- Describe CodeSpaces features and explain how cloud development environments enable team consistency (See [[From VSCode to Codespaces]])

### Language Objectives (How students will communicate learning):
- **Reading:** Interpret agile methodology guides, ADR templates, and GitHub Copilot documentation to understand professional practices
- **Writing:** Create comprehensive READMEs, draft architectural decision records, and document AI-assisted code with clear explanations
- **Speaking:** Articulate team working agreements, explain technical decisions using ADR format, and present project ideas effectively
- **Listening:** Participate in simulated standup meetings, provide constructive feedback, and collaborate on documentation standards

### Learning Objectives (What students will be able to do):
By the end of this session, students will be able to:
- Navigate Codespaces environment and configure GitHub Copilot for responsible AI-assisted development
- Write professional README documentation following industry-standard templates and best practices
- Create architectural decision records (ADRs) that document technical choices with context and consequences
- Establish team working agreements and demonstrate agile ceremony participation (standup, planning, retrospective)

## MATERIALS & PREPARATION

### Instructor Prep:
- Presentation prepared: Agile methodology and professional practices slides (20 slides)
- Codespaces demo environment: Pre-configured workspace with sample project
- GitHub Copilot examples: Prepared prompts showing good and poor AI usage
- Template resources: README templates, ADR examples, team charter formats ready
- Remote setup: Zoom breakout rooms configured for team exercises
- Recording setup: Screen sharing tested for demonstration capture

### TA Prep:
- CodeSpaces proficiency: Familiar with environment features and troubleshooting
- GitHub Copilot experience: Understanding of appropriate AI assistance boundaries
- Documentation expertise: Knowledge of README and ADR best practices
- Agile facilitation: Ability to guide mock standup and planning sessions
- Support readiness: Prepared to assist with AI tool configuration and usage

### Student Requirements:
- **Accounts:** GitHub account with Copilot access enabled
- **Access:** CodeSpaces environment provisioned
- **Hardware:** Computer with stable internet for cloud development
- **Preparation:** Basic Git knowledge from prerequisites

### Technology Setup:
- **Development:** GitHub CodeSpaces with pre-configured environment
- **AI Tools:** GitHub Copilot activated and configured
- **Collaboration:** Shared GitHub repository for team documentation
- **Communication:** Zoom with breakout rooms, class Slack/Discord
- **Resources:** Course GitBook with templates and examples

## SESSION TIMELINE

| Time        | Duration | Activity                                             | Format                  | Assessment                  |
| ----------- | -------- | ---------------------------------------------------- | ----------------------- | --------------------------- |
| 0-10 min    | 10 min   | Launch & Professional Developer Mindset              | Think-Write-Pair-Share  | Engagement check            |
| 10-25 min   | 15 min   | Lecture: Agile Development & Documentation           | Instructor presentation | Concept understanding       |
| 25-45 min   | 20 min   | I DO Block 1: CodeSpaces & GitHub Copilot Demo       | Live demonstration      | Observation tracking        |
| 45-65 min   | 20 min   | YOU DO Block 1: AI-Assisted Coding Practice          | Individual exploration  | Copilot usage quality       |
| 65-75 min   | 10 min   | BREAK                                                | Informal                | None                        |
| 75-90 min   | 15 min   | I DO Block 2: Professional Documentation             | Live demonstration      | Documentation understanding |
| 90-110 min  | 20 min   | YOU DO Block 2: README & ADR Creation                | Individual practice     | Document quality            |
| 110-120 min | 10 min   | BREAK                                                | Informal                | None                        |
| 120-145 min | 25 min   | INDIVIDUAL PROJECT: Expense Tracker Setup & Planning | Individual Exploration  | README for Expense Tracker  |
| 145-150 min | 5 min    | Wrap-up & Week 2 Preview                             | Reflection              | Exit ticket                 |

## LAUNCH (10 minutes)

### Hook:
"Welcome to your transformation into a professional developer! Today we're not just learning to code - we're learning to think, document, and collaborate like professionals. By the end of this program, you'll have not just technical skills, but the professional practices that distinguish junior developers who get promoted from those who don't."

### Connection to Prior Learning:
"You know how to write code. Now we'll learn how to write code that teams can maintain, scale, and deploy. We're adding the 'why' behind every technical decision and learning to leverage AI as a powerful assistant, not a crutch."

### Launch Activity - Think-Write-Pair-Share:

**Think (2 min):** Individual reflection
- "What makes code 'professional' versus 'functional'?"
- "How could AI tools help or hinder your learning?"
- "What project would you build if you had a team of skilled developers?"

**Write (2 min):** Anonymous submission via form
- Share thoughts on professional development practices
- Express concerns about AI in coding

**Pair (3 min):** Breakout rooms (2-3 people)
- Discuss experiences with team projects
- Share thoughts on AI assistance in learning

**Share (3 min):** Whole group insights
- Instructor synthesizes themes about professionalism
- Address AI concerns and establish usage philosophy

## LECTURE: Agile Development & Documentation (15 minutes)

### Learning Target:
Students will understand agile methodology principles and professional documentation standards used in industry teams

### Instructional Strategy: Direct Instruction with Industry Context

### Presentation Content Structure:

**Agile Development Fundamentals (7 minutes)**
- **Sprint Planning:** 2-week cycles with defined deliverables; how teams estimate and commit to work
- **Daily Standups:** 15-minute sync on progress, blockers, and plans; builds accountability and communication
- **Retrospectives:** Team reflection on what worked, what didn't, and improvements; continuous team evolution
- **User Stories:** "As a [user], I want [feature] so that [benefit]" - customer-focused development
- **Real-world context:** "This is how Netflix ships features every two weeks without breaking production"

**Professional Documentation (8 minutes)**
- **README Excellence:** Project overview, setup instructions, architecture, contribution guidelines
- **Architecture Decision Records (ADRs):** Document the "why" behind technical choices
  - Context: What problem are we solving?
  - Decision: What did we choose?
  - Consequences: What are the trade-offs?
- **Code Comments:** When and how to comment (explain why, not what)
- **Industry impact:** "Good documentation is the difference between a 2-hour and 2-day onboarding"

### Visual Elements:
- Slides 1-7: Agile ceremony flow diagrams and team interaction patterns
- Slides 8-15: Before/after documentation examples showing transformation
- Slides 16-20: Real company examples (Spotify's squad model, Netflix's architecture)

### Engagement Techniques:
- "Who's been frustrated by poor documentation?"
- "What happens when a team member leaves without documenting their work?"
- "How many hours have you lost figuring out someone else's code?"

## I DO BLOCK 1: CodeSpaces & GitHub Copilot Demo (20 minutes)

### Learning Target:
Demonstrate professional cloud development environment and responsible AI-assisted coding practices

### Demonstration Sequence:

**CodeSpaces Environment Tour (8 min)**
- Navigate to github.com/codespaces
- Create new CodeSpace from template repository
- Show pre-configured environment advantages:
  - Consistent tooling across team
  - No "works on my machine" problems
  - Instant onboarding for new developers
- Demonstrate extensions and customization
- Think-aloud: "This eliminates the first week of setup at a new job"

**GitHub Copilot Integration (12 min)**
- Enable Copilot in CodeSpaces
- **Good Copilot Usage:**
  - Writing boilerplate code with clear intent
  - Generating test cases from functions
  - Explaining complex code sections
  - Learning new APIs with examples
- **Poor Copilot Usage:**
  - Accepting suggestions without understanding
  - Letting AI write critical business logic unchecked
  - Copy-pasting without adaptation
- **Professional Demonstration:**
  ```javascript
  // Good: Clear intent, then let Copilot help
  // TODO: Create a function that validates email format
  // Requirements: Check for @ symbol, domain, and valid characters
  
  // Copilot assists with implementation details
  ```
- Think-aloud: "I always verify Copilot's suggestions against requirements"

### Professional Context:
- "Copilot is your pair programmer, not your replacement"
- "Understanding the code you accept is non-negotiable"
- "AI speeds up the boring parts so you can focus on architecture"

## YOU DO BLOCK 1: AI-Assisted Coding Practice (20 minutes)

### Learning Target:
Students practice responsible GitHub Copilot usage while maintaining code understanding

### Activity Structure:

**Guided Copilot Exercises (15 minutes)**
- Open provided CodeSpaces environment
- Complete structured exercises:
  1. Generate a utility function with clear comments
  2. Write tests for existing code using Copilot
  3. Refactor code with AI assistance
  4. Document code purpose before implementation
- Focus on understanding every line accepted
- Practice rejecting inappropriate suggestions

**Reflection & Best Practices (5 minutes)**
- Document in practice log:
  - When Copilot helped effectively
  - When manual coding was better
  - How to maintain learning while using AI
- Share one insight in chat

### Success Criteria:
- Copilot enabled and functioning in CodeSpaces
- Completed all three exercise types
- Can explain every line of accepted code
- Documented appropriate use cases

## BREAK (10 minutes)

## I DO BLOCK 2: Professional Documentation (15 minutes)

### Learning Target:
Demonstrate creation of professional README and ADR documentation

### Demonstration Sequence:

**Professional README Creation (8 min)**
```markdown
# Expense Tracker

## Overview
A full-stack expense tracking application built with React, TypeScript, and AWS.

## Problem Statement
Individuals struggle to track spending patterns and maintain budgets...
```
## Setup Instructions
1. Prerequisites
2. Installation steps
3. Environment configuration

## Contributing
Please read our contribution guidelines...
```
- Think-aloud: "Every section answers a question new developers have"

**ADR Creation (7 min)**
```markdown
# ADR-001: Use TypeScript for Type Safety

## Status
Accepted

## Context
We need to choose between JavaScript and TypeScript for our React application...

## Decision
We will use TypeScript for all new code.

## Consequences
- Positive: Catch errors at compile time, better IDE support
- Negative: Learning curve for team members, additional build complexity
```
- Think-aloud: "This explains our decision to future developers (including future you)"

## YOU DO BLOCK 2: README & ADR Creation (20 minutes)

### Learning Target:
Students create professional documentation for their projects

### Activity Structure:

**README Development (10 minutes)**
- Use provided template in CodeSpaces
- Create README for expense tracker project:
  - Clear project overview
  - Problem statement
  - Technical architecture
  - Setup instructions
  - Contribution guidelines

**ADR Practice (10 minutes)**
- Write first ADR about a technical decision:
  - "Use Vite instead of Create React App"
  - "Choose PostgreSQL over MongoDB"
  - "Implement TypeScript from start"
- Follow ADR template structure
- Focus on context and consequences

### Success Criteria:
- README includes all required sections
- Clear, professional writing throughout
- ADR follows standard format
- Technical decision properly justified
- Documents committed to repository

## INDIVIDUAL PROJECT: Expense Tracker Setup & Planning (25 minutes)

### Learning Target:
Initialize individual expense tracker project with professional structure and development plan

### Activity Structure:

**Project Initialization (10 minutes)**
- **Repository Setup:**
  ```bash
  # Create new repository from template
  # Name: expense-tracker-[yourname]
  ```
- **Initial Structure:**
  ```
  expense-tracker/
  ├── README.md           (created earlier)
  ├── docs/
  │   ├── ADR/
  │   │   └── ADR-001.md  (created earlier)
  │   └── planning/
  │       └── roadmap.md  (create now)
  ├── .gitignore
  └── LICENSE
  ```
- **First Commit:**
  ```bash
  git add .
  git commit -m "Initial project setup with documentation"
  ```

**Individual Development Planning (10 minutes)**
- **Create Personal Kanban Board (GitHub Projects):**
  - To Do column: All planned features
  - In Progress column: Current week's work
  - Done column: Completed items
- **Week 1-10 Roadmap:**
  ```markdown
  ## Development Roadmap
  
  ### Week 1-3: Foundation
  - [ ] Basic React components
  - [ ] TypeScript integration
  - [ ] Tailwind styling
  
  ### Week 4-6: Core Features  
  - [ ] Expense CRUD operations
  - [ ] Category management
  - [ ] Basic analytics
  
  ### Week 7-9: Advanced Features
  - [ ] Database integration
  - [ ] API development
  - [ ] Authentication
  
  ### Week 10: Polish & Deploy
  - [ ] Testing coverage
  - [ ] Performance optimization
  - [ ] AWS deployment
  ```

**Mock Personal Standup (5 minutes)**
- Practice individual standup format:
  - Record in `docs/standups/week1.md`:
    ```markdown
    ## Standup - Week 1
    
    ### What I Completed
    - Set up development environment
    - Created project documentation
    - Learned GitHub Copilot best practices
    
    ### What I'm Working On
    - Planning React component structure
    - Setting up TypeScript configuration
    - Creating initial wireframes
    
    ### Blockers
    - Need clarification on database schema
    - Unsure about authentication approach
    
    ### Learning Goals This Week
    - Master TypeScript with React
    - Understand ADR best practices
    - Improve documentation habits
    ```
- **Reflection:** How will daily standups improve your development?

### Project Scope Clarification:
**Expense Tracker Requirements:**
- Core Features:
  - Add/Edit/Delete expenses
  - Categorize transactions
  - View spending by category
  - Monthly/weekly summaries
- Technical Requirements:
  - React with TypeScript
  - Responsive design
  - Data persistence
  - Clean architecture
- Professional Requirements:
  - Comprehensive documentation
  - Test coverage
  - Git history showing progress
  - Deployed to production

## WRAP-UP & REFLECTION (5 minutes)

### Today's Achievements:
"You've established the foundation for professional development. You now have CodeSpaces configured, understand responsible AI usage, created professional documentation, and formed teams around exciting projects."

### Key Takeaways:
- Professional development is about communication, not just code
- AI tools amplify your abilities but don't replace understanding
- Documentation is an investment in your team's future
- Agile practices create predictable, sustainable development

### Next Week Preview:
"Week 2: React fundamentals and project kickoff. You'll build your first components while teams finalize project plans and create technical roadmaps."

#### Sample Project Ideas:

- **StudyBuddy:** Match students for study sessions based on courses and availability
- **PetPal:** Connect pet owners for playdates and pet-sitting exchanges
- **MealMate:** Coordinate group cooking and meal sharing in dorms/apartments
- **SkillSwap:** Trade skills (coding for design, language for music, etc.)
- **EventHub:** Discover and organize local community events
- **GreenThumb:** Plant care reminders and community garden coordination

### Exit Ticket (Google Form):
1. One thing you learned about professional development
2. How you plan to use GitHub Copilot responsibly
3. Your team name and project concept
4. One question or concern for next week

## ADDENDUM: UDL & DIFFERENTIATION

### Multiple Means of Representation:
- **Visual:** Diagrams, flowcharts, and documentation examples
- **Auditory:** Live demonstrations with think-aloud protocols
- **Reading:** Comprehensive GitBook resources and templates
- **Kinesthetic:** Hands-on practice in CodeSpaces

### Multiple Means of Engagement:
- **Relevance:** Direct connection to industry practices and career preparation
- **Choice:** Student-driven project selection and team formation
- **Community:** Collaborative team formation and peer learning
- **Mastery:** Clear rubrics and success criteria for all activities

### Multiple Means of Action/Expression:
- **Documentation:** Written READMEs and ADRs
- **Verbal:** Team discussions and presentations
- **Technical:** Code creation with AI assistance
- **Collaborative:** Team charter negotiations

### Specific Support Strategies:

**For Advanced Students:**
- Explore advanced Copilot features (chat, debugging)
- Create multiple ADRs for complex decisions
- Mentor teammates on documentation best practices
- Research additional agile methodologies (Kanban, SAFe)

**For Struggling Students:**
- Provide additional README templates and examples
- Pair with TA for Copilot configuration
- Simplified ADR format with fill-in sections
- Extra office hours for CodeSpaces troubleshooting

**For English Language Learners:**
- Technical vocabulary glossary provided
- Visual examples alongside written instructions
- Peer translation support in breakout rooms
- Permission to draft in native language first

**For Different Learning Styles:**
- Visual learners: Flowcharts and diagrams
- Auditory learners: Recorded demonstrations available
- Read/write learners: Comprehensive documentation
- Kinesthetic learners: Immediate hands-on practice
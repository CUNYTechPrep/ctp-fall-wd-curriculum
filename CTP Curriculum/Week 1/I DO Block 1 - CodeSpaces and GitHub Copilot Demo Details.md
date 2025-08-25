# I DO Block 1: CodeSpaces & GitHub Copilot Demo - Detailed Guide

## Overview
Duration: 20 minutes  
Learning Target: Demonstrate professional cloud development environment and responsible AI-assisted coding practices

## Part 1: CodeSpaces Environment Tour (8 minutes)

### Pre-Demo Setup
- Have GitHub account logged in
- Pre-select a template repository (Node.js or Python starter)
- Have example project ready to showcase

### Demo Flow

#### 1. Navigate to CodeSpaces (1 min)
- Go to github.com/codespaces
- Show the dashboard with any existing CodeSpaces
- Explain: "This is where professional teams manage their cloud development environments"

#### 2. Create New CodeSpace (2 min)
- Click "New CodeSpace"
- Select from template repository
- Show configuration options:
  - Machine type selection (2-core vs 4-core)
  - Region selection for performance
  - Timeout settings
- Think-aloud: "Companies configure these to match production environments"

#### 3. Environment Advantages Demo (3 min)
**Consistent Tooling:**
- Show pre-installed extensions
- Demonstrate terminal with pre-configured tools
- Example: "Notice Node.js, npm, git are all pre-installed with specific versions"

**No "Works on My Machine" Problems:**
- Show `.devcontainer/devcontainer.json` file
- Explain standardized environment configuration
- Think-aloud: "Every developer gets the exact same setup"

**Instant Onboarding:**
- Demonstrate opening an existing project
- Show how extensions and settings persist
- Example: "A new team member can be coding in 5 minutes, not 5 days"

#### 4. Customization Options (2 min)
- Show VS Code settings sync
- Demonstrate installing additional extensions
- Show dotfiles repository integration
- Explain: "You can personalize while maintaining team standards"

## Part 2: GitHub Copilot Integration (12 minutes)

### Setup and Context (2 min)
- Enable GitHub Copilot extension
- Show Copilot status in status bar
- Explain pricing and availability (free for students)
- Set expectations: "This is about augmentation, not replacement"

### Good Copilot Usage Examples (5 min)

#### Example 1: Writing Boilerplate with Clear Intent
```javascript
// Instructor types this comment first:
// TODO: Create an Express.js server with middleware for JSON parsing and CORS

// Let Copilot suggest the implementation
// Copilot will likely suggest:
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Think-aloud: "I provided clear intent, Copilot handled the boilerplate"

#### Example 2: Generating Test Cases
```javascript
// First write the function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Then add comment for tests
// TODO: Write comprehensive test cases for validateEmail function

// Copilot suggests:
describe('validateEmail', () => {
    test('should return true for valid emails', () => {
        expect(validateEmail('user@example.com')).toBe(true);
        expect(validateEmail('test.user@company.co.uk')).toBe(true);
    });
    
    test('should return false for invalid emails', () => {
        expect(validateEmail('invalid.email')).toBe(false);
        expect(validateEmail('@example.com')).toBe(false);
        expect(validateEmail('user@')).toBe(false);
    });
});
```

#### Example 3: Learning New APIs
```javascript
// Comment: How do I use the Fetch API to make a POST request with headers?

// Copilot explains with example:
fetch('https://api.example.com/data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN'
    },
    body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com'
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Poor Copilot Usage Examples (3 min)

#### Anti-Pattern 1: Blind Acceptance
```javascript
// Bad: Accepting without understanding
// "Create a function to calculate compound interest"
// [Copilot suggests complex formula]
// DON'T just accept if you don't understand the math!
```

#### Anti-Pattern 2: Critical Business Logic
```javascript
// Bad: Letting AI write security-critical code
// "Create user authentication system"
// This needs human expertise for security considerations!
```

#### Anti-Pattern 3: No Adaptation
```javascript
// Bad: Copy-pasting without considering context
// Copilot might suggest code that doesn't match your:
// - Coding standards
// - Error handling patterns
// - Logging requirements
```

### Professional Best Practices Demo (2 min)

#### The Right Way:
```javascript
// Step 1: Clear requirements
// TODO: Create a rate limiter middleware for Express
// Requirements:
// - Allow 100 requests per 15 minutes per IP
// - Return 429 status when limit exceeded
// - Include retry-after header

// Step 2: Let Copilot assist with implementation
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
});

// Step 3: Verify against requirements
// ✓ 15-minute window
// ✓ 100 request limit
// ✓ 429 status (express-rate-limit default)
// ✓ Retry-after header (standardHeaders: true)
```

## Key Messages to Reinforce

### Throughout the Demo:
1. "Copilot is your pair programmer, not your replacement"
2. "Understanding the code you accept is non-negotiable"
3. "AI speeds up the boring parts so you can focus on architecture"
4. "Always verify suggestions against requirements"
5. "Use AI to learn, not to avoid learning"

### Professional Context Connections:
- "This is how modern teams onboard quickly"
- "Senior developers use these tools to stay productive"
- "Companies expect you to use AI responsibly"
- "The goal is augmented intelligence, not artificial replacement"

## Post-Demo Discussion Points
- How does this change your view of professional development?
- What concerns do you have about AI-assisted coding?
- How can we ensure we're learning, not just copying?
- What would you use Copilot for in your current projects?

## Additional Resources
- GitHub Copilot documentation
- CodeSpaces best practices guide
- Responsible AI usage guidelines
- Team collaboration in cloud environments
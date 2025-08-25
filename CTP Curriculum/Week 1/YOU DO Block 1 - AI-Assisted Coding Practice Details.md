# YOU DO Block 1: AI-Assisted Coding Practice - Detailed Guide

## Overview
Duration: 20 minutes  
Learning Target: Students practice responsible GitHub Copilot usage while maintaining code understanding

## Pre-Activity Setup (2 minutes)

### Student Checklist
- CodeSpaces environment open
- GitHub Copilot enabled and working
- New file created: `copilot-practice.js`
- Practice log document ready: `copilot-learning-log.md`

### Instructor Preparation
- Monitor student progress via screen shares
- Have troubleshooting guide ready
- Prepare additional challenges for fast finishers

## Part 1: Guided Copilot Exercises (15 minutes)

### Exercise 1: Generate Utility Function with Clear Comments (5 min)

**Instructions for Students:**

1. **Write Clear Intent First:**
```javascript
// TODO: Create a function that formats currency values
// Requirements:
// - Accept a number as input
// - Return string with $ symbol
// - Include comma separators for thousands
// - Always show 2 decimal places
// - Handle negative numbers with parentheses

// Let Copilot help implement this function
```

2. **Evaluate Copilot's Suggestion:**
- Does it meet ALL requirements?
- Is the code readable and efficient?
- Do you understand every line?

3. **Expected Result (example):**
```javascript
function formatCurrency(amount) {
    const isNegative = amount < 0;
    const absoluteAmount = Math.abs(amount);
    
    const formatted = absoluteAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    return isNegative ? `($${formatted})` : `$${formatted}`;
}

// Test the function
console.log(formatCurrency(1234.5));      // $1,234.50
console.log(formatCurrency(-1234.5));     // ($1,234.50)
console.log(formatCurrency(0));           // $0.00
```

4. **Learning Check:**
- What is `toLocaleString` doing?
- Why use `Math.abs()`?
- How does the ternary operator work here?

### Exercise 2: Write Tests for Existing Code (5 min)

**Instructions for Students:**

1. **Given This Function:**
```javascript
function validatePassword(password) {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*]/.test(password)) return false;
    return true;
}
```

2. **Add Comment for Test Generation:**
```javascript
// TODO: Write comprehensive test cases for validatePassword
// Test for:
// - Minimum length requirement
// - Uppercase requirement
// - Lowercase requirement  
// - Number requirement
// - Special character requirement
// - Valid passwords that meet all criteria
// - Edge cases
```

3. **Review Generated Tests:**
```javascript
// Test cases for validatePassword
console.log("Testing validatePassword function:");

// Test minimum length
console.log(validatePassword("Aa1!") === false); // Too short
console.log(validatePassword("Aa1!5678") === true); // Exactly 8 chars

// Test missing uppercase
console.log(validatePassword("password1!") === false);

// Test missing lowercase
console.log(validatePassword("PASSWORD1!") === false);

// Test missing number
console.log(validatePassword("Password!") === false);

// Test missing special character
console.log(validatePassword("Password1") === false);

// Test valid passwords
console.log(validatePassword("Password1!") === true);
console.log(validatePassword("MyP@ssw0rd123") === true);

// Edge cases
console.log(validatePassword("") === false); // Empty string
console.log(validatePassword("        ") === false); // Only spaces
```

4. **Critical Thinking:**
- Are all edge cases covered?
- Would these tests catch common bugs?
- What tests would you add?

### Exercise 3: Refactor Code with AI Assistance (5 min)

**Instructions for Students:**

1. **Given This Code:**
```javascript
// Messy code that needs refactoring
function calc(items) {
    var t = 0;
    for(var i = 0; i < items.length; i++) {
        if(items[i].type == "product") {
            t = t + items[i].price * items[i].qty;
        } else if(items[i].type == "service") {
            t = t + items[i].price;
        }
    }
    var tax = t * 0.08;
    var total = t + tax;
    return {subtotal: t, tax: tax, total: total};
}
```

2. **Add Refactoring Intent:**
```javascript
// TODO: Refactor this function to be more readable
// Requirements:
// - Use descriptive variable names
// - Use modern JavaScript syntax (const, arrow functions)
// - Separate concerns (calculation logic vs formatting)
// - Add JSDoc comments
```

3. **Expected Refactored Version:**
```javascript
/**
 * Calculate total price including tax for a list of items
 * @param {Array} items - Array of items with type, price, and quantity
 * @returns {Object} Object containing subtotal, tax, and total
 */
const calculateInvoiceTotal = (items) => {
    const TAX_RATE = 0.08;
    
    const subtotal = items.reduce((total, item) => {
        if (item.type === "product") {
            return total + (item.price * item.qty);
        } else if (item.type === "service") {
            return total + item.price;
        }
        return total;
    }, 0);
    
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    
    return {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    };
};
```

4. **Refactoring Analysis:**
- What improvements were made?
- Is the logic clearer now?
- What patterns do you recognize?

## Part 2: Reflection & Best Practices (5 minutes)

### Practice Log Documentation

**Students Create `copilot-learning-log.md`:**

```markdown
# GitHub Copilot Learning Log - Week 1

## Date: [Today's Date]

### When Copilot Helped Effectively:
1. **Boilerplate Generation**
   - Saved time on repetitive code structure
   - Example: Setting up test cases framework
   
2. **Syntax Reminders**
   - Helped with unfamiliar APIs (toLocaleString)
   - Suggested modern JavaScript patterns

3. **Code Completion**
   - Completed logical patterns correctly
   - Saved typing on predictable code

### When Manual Coding Was Better:
1. **Business Logic**
   - Complex requirements needed human understanding
   - Edge cases required careful thinking
   
2. **Learning New Concepts**
   - Writing code manually helped understanding
   - Copilot suggestions sometimes too advanced

3. **Debugging**
   - Understanding errors required manual investigation
   - Copilot can suggest fixes without explaining why

### How to Maintain Learning While Using AI:

1. **Always Write Intent First**
   - Clear comments before code
   - Understand requirements fully
   
2. **Review Every Line**
   - Never accept without understanding
   - Look up unfamiliar methods
   
3. **Test Understanding**
   - Can I explain this code to someone?
   - Could I write it without Copilot?
   
4. **Practice Without AI**
   - Regular coding sessions without assistance
   - Build fundamental skills separately

### Key Insights:
- Copilot is best for acceleration, not learning
- Understanding > Speed when learning
- AI suggestions are starting points, not final solutions

### Questions for Instructor:
- [Students add their questions here]
```

### Share Insights (2 min)

**Students Share in Chat:**
- One effective Copilot use case
- One time manual coding was better
- One learning strategy they'll adopt

**Instructor Synthesizes Common Themes:**
- Acknowledge good practices observed
- Address common misconceptions
- Reinforce responsible usage

## Success Criteria Checklist

### Technical Achievement:
- [ ] Copilot enabled and functioning
- [ ] All three exercises completed
- [ ] Code runs without errors
- [ ] Comments explain understanding

### Learning Objectives:
- [ ] Can explain when to use/not use Copilot
- [ ] Understands every line of accepted code
- [ ] Created meaningful practice log
- [ ] Identified personal learning strategies

### Professional Practices:
- [ ] Clear intent before implementation
- [ ] Code review mindset with AI suggestions
- [ ] Documentation of learning process
- [ ] Questions prepared for clarification

## Common Issues & Solutions

### Technical Problems:
1. **Copilot Not Suggesting**
   - Check extension is enabled
   - Verify GitHub authentication
   - Try restarting CodeSpaces

2. **Poor Suggestions**
   - Improve comment clarity
   - Provide more context
   - Break down complex requirements

### Learning Challenges:
1. **Over-Reliance on AI**
   - Set "no Copilot" time blocks
   - Practice explaining code aloud
   - Write pseudocode first

2. **Not Understanding Suggestions**
   - Break down complex code
   - Research unfamiliar methods
   - Ask for simpler alternatives

## Extension Activities (For Fast Finishers)

### Advanced Challenges:
1. **Create a Code Review Checklist**
   - What to check in Copilot suggestions
   - Red flags to watch for
   - Best practices document

2. **Copilot Experiments**
   - Try different comment styles
   - Compare suggestions quality
   - Document findings

3. **Teach Back**
   - Help struggling peers
   - Explain Copilot concepts
   - Share effective prompts

## Instructor Notes

### Monitoring Points:
- Watch for blind acceptance of code
- Ensure students test their functions
- Check practice logs for depth
- Identify students needing extra support

### Discussion Prompts:
- "What surprised you about Copilot?"
- "How will you use this professionally?"
- "What are the ethical considerations?"
- "How do we maintain learning?"
# Week 4: React Component Libraries & Chakra UI

## Overview
This week introduces students to React component libraries, with a focus on Chakra UI. Students will learn how component libraries accelerate development, ensure consistency, and provide accessible components out of the box.

## Learning Objectives
By the end of this session, students will be able to:
- Understand the benefits and trade-offs of using component libraries
- Compare different popular React component libraries
- Implement a UI using Chakra UI components
- Understand theming and customization in component libraries
- Make informed decisions about when to use component libraries vs. custom components

## Session Duration: 3 hours

## Pre-Class Preparation
- Review React props and state management
- Install Node.js and npm
- Have VS Code or preferred code editor ready

## Materials Needed
- Slides on React Component Libraries
- Example project (plain React vs Chakra UI comparison)
- Chakra UI documentation
- Component library comparison chart

## Detailed Lesson Plan

### Part 1: Introduction to Component Libraries (30 minutes)

#### Opening Discussion (10 minutes)
- Ask: "What challenges have you faced when styling React applications?"
- Discuss pain points: consistency, responsiveness, accessibility, development speed
- Introduce component libraries as a solution

#### What Are Component Libraries? (10 minutes)
- Pre-built, reusable UI components
- Benefits:
  - Faster development
  - Consistent design system
  - Built-in accessibility
  - Responsive by default
  - Community support
- Trade-offs:
  - Learning curve
  - Bundle size
  - Design constraints
  - Customization complexity

#### Popular React Component Libraries Overview (10 minutes)
Quick tour of major libraries:
- **Material-UI (MUI)**: Google's Material Design
- **Ant Design**: Enterprise-focused, feature-rich
- **Chakra UI**: Modern, accessible, developer-friendly
- **Bootstrap React**: Bootstrap components for React
- **Semantic UI React**: Human-friendly HTML
- **Tailwind UI**: Premium components for Tailwind CSS

### Part 2: Deep Dive into Chakra UI (45 minutes)

#### Why Chakra UI? (10 minutes)
- Modular and accessible
- Simple, composable API
- Built-in dark mode support
- Extensive theming capabilities
- TypeScript support
- Excellent documentation
- Active community

#### Core Concepts (15 minutes)
1. **ChakraProvider**: Theme and CSS-in-JS setup
2. **Style Props**: Direct styling through props
3. **Responsive Styles**: Array and object syntax
4. **Color Mode**: Light/dark theme switching
5. **Component Composition**: Building complex UIs from primitives

#### Live Coding: Setting Up Chakra UI (20 minutes)
```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

Basic setup demonstration:
```jsx
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      {/* Your app */}
    </ChakraProvider>
  )
}
```

### Part 3: Hands-On Exercise - Building a Task Dashboard (60 minutes)

#### Project Overview (5 minutes)
Build a simple task management dashboard featuring:
- Header with navigation
- Task cards with status indicators
- Add task form
- Statistics display
- Responsive layout

#### Group Activity: Plain React Implementation (25 minutes)
Students work in pairs to build components using:
- CSS modules or styled-components
- Custom form components
- Manual responsive design
- Custom color scheme

#### Group Activity: Chakra UI Implementation (25 minutes)
Same pairs rebuild using Chakra components:
- Box, Flex, Grid for layout
- Card components
- Form controls
- Built-in responsive props
- Theme customization

#### Comparison Discussion (5 minutes)
- Development speed
- Code readability
- Bundle size
- Customization ease
- Accessibility features

### Part 4: Advanced Chakra UI Features (30 minutes)

#### Theming and Customization (15 minutes)
```jsx
const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0e4ff',
      500: '#6b46c1',
      900: '#2d1b69'
    }
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif'
  }
})
```

#### Component Variants and Styles (10 minutes)
- Creating custom component variants
- Global style overrides
- Compound components

#### Performance Optimization (5 minutes)
- Code splitting strategies
- Tree shaking
- Lazy loading components

### Part 5: Best Practices & Decision Making (15 minutes)

#### When to Use Component Libraries
✅ Do use when:
- Rapid prototyping needed
- Consistency is crucial
- Team lacks design resources
- Accessibility is a priority
- Building internal tools

❌ Don't use when:
- Unique brand identity required
- Extreme performance constraints
- Learning project for CSS
- Very simple applications

#### Mixing Approaches
- Using component libraries with custom components
- Gradual migration strategies
- Escape hatches for customization

### Wrap-Up & Assignment (15 minutes)

#### Key Takeaways
1. Component libraries accelerate development
2. Choose libraries based on project needs
3. Understand the trade-offs
4. Chakra UI offers excellent DX with flexibility
5. Always consider accessibility and performance

#### Assignment
**Option 1: Extend the Dashboard**
- Add data visualization using Chakra UI
- Implement user authentication UI
- Add drag-and-drop functionality
- Create a mobile-responsive navigation

**Option 2: Component Library Comparison**
- Choose another component library
- Implement the same dashboard
- Write a comparison report (500 words)
- Present findings next week

#### Resources for Further Learning
- [Chakra UI Documentation](https://chakra-ui.com/)
- [Chakra UI Templates](https://chakra-templates.dev/)
- [Component Library Comparison](https://www.npmtrends.com/)
- [React Component Library Best Practices](https://blog.bitsrc.io/)

## Assessment Criteria
- Understanding of component library benefits/trade-offs
- Ability to implement UI with Chakra components
- Code organization and best practices
- Responsive design implementation
- Accessibility considerations

## Instructor Notes
- Prepare both example projects before class
- Have Chakra UI documentation readily available
- Be ready to troubleshoot installation issues
- Emphasize that component libraries are tools, not requirements
- Encourage experimentation with different libraries

## Extension Activities
- Create a custom Chakra UI component
- Build a theme switcher
- Implement internationalization
- Add animation with Framer Motion
- Create a design system documentation
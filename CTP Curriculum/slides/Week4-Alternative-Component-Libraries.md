---
marp: true
theme: default
paginate: true
---

# React Component Libraries
## Accelerating UI Development with Chakra UI

Week 4 - Alternative Session

---

# Today's Agenda

1. **Introduction to Component Libraries** (30 min)
2. **Deep Dive: Chakra UI** (45 min)
3. **Hands-On: Building a Task Dashboard** (60 min)
4. **Advanced Features** (30 min)
5. **Best Practices & Decision Making** (15 min)

---

# The Problem We're Solving

## Building UIs from Scratch is Hard

- ❌ Inconsistent designs across pages
- ❌ Accessibility often overlooked
- ❌ Responsive design is time-consuming
- ❌ Reinventing common patterns
- ❌ Browser compatibility issues

---

# What Are Component Libraries?

## Pre-built, Tested, Ready-to-Use UI Components

```jsx
// Without Component Library
<div className="card">
  <div className="card-header">
    <h2 className="card-title">Title</h2>
  </div>
  <div className="card-body">Content</div>
</div>

// With Component Library
<Card>
  <CardHeader><Heading>Title</Heading></CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

---

# Benefits of Component Libraries

### ⚡ **Speed**
- Ship features faster
- Focus on business logic

---

### 🎨 **Consistency**
- Unified design system
- Professional look out-of-box

---

### ♿ **Accessibility**
- WCAG compliant components
- Keyboard navigation built-in

---

### 📱 **Responsive**
- Mobile-first approach
- Tested across devices

---

# Trade-offs to Consider

### 📚 **Learning Curve**
- New API to learn
- Documentation dependency

---

### 📦 **Bundle Size**
- Additional dependencies
- May include unused code

---

### 🎭 **Design Constraints**
- Less unique designs
- Customization limits

---

### 🔒 **Lock-in**
- Migration can be difficult
- Version updates

---

# Popular React Component Libraries

| Library | Best For | Philosophy |
|---------|----------|------------|
| **Material-UI** | Google apps | Material Design |
| **Ant Design** | Enterprise | Feature-rich |
| **Chakra UI** | Modern apps | Developer-friendly |
| **React Bootstrap** | Bootstrap users | Familiar |
| **Semantic UI** | Readable code | Human-friendly |

---

# Why Chakra UI?

## Developer Experience First

```jsx
// Simple, intuitive API
<Box p={4} bg="blue.500" color="white">
  <Heading size="lg">Hello World</Heading>
  <Text mt={2}>Building UIs is now fun!</Text>
</Box>
```

---

## Developer Experience

- 🚀 Minimal setup
- 📖 Excellent documentation
- 🎨 Built-in dark mode
- 🔧 TypeScript support

---

# Chakra UI Core Concepts

## 1. ChakraProvider
Wraps your app with theme and styles

---

## 2. Style Props
Style directly through props

---

## 3. Responsive Styles
Arrays and objects for breakpoints

---

## 4. Composition
Build complex UIs from primitives

---

# Installation & Setup

```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

---

## Wrapping on Chakra Provider

```jsx
// App.jsx
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <YourApp />
    </ChakraProvider>
  )
}
```

That's it! You're ready to use Chakra UI 🎉

---

# Style Props: The Power of Chakra

```jsx
/**
.box {
  padding: 16px;
  margin-top: 8px;
  background: #3182ce;
  border-radius: 8px;
}
*/

// Chakra UI approach
<Box p={4} mt={2} bg="blue.500" borderRadius="md">
  Content
</Box>
```

---

# Responsive Design Made Easy

```jsx
// Responsive with arrays
<Box
  width={["100%", "50%", "25%"]}
  p={[2, 4, 6]}
>
  Responsive Box
</Box>

// Responsive with objects
<Text
  fontSize={{ base: "sm", md: "md", lg: "lg" }}
  color={{ base: "gray.600", md: "gray.800" }}
>
  Responsive Text
</Text>
```

---

# Common Chakra Components

## Layout
`Box`, `Flex`, `Grid`, `Stack`, `Container`

---

## Typography
`Heading`, `Text`, `Link`

---

## Form
`Input`, `Select`, `Checkbox`, `Radio`, `Switch`

---

## Feedback
`Alert`, `Toast`, `Spinner`, `Progress`

---

## Overlay
`Modal`, `Drawer`, `Popover`, `Tooltip`

---

# Let's Build: Task Dashboard

## Plain React vs Chakra UI

We'll build the same UI twice:
1. **Plain React** with CSS modules
2. **Chakra UI** components

---

### Features:
- Header with navigation
- Task cards
- Add task form
- Statistics display

---

# Plain React: Task Card

```jsx
// TaskCard.jsx
import styles from './TaskCard.module.css'

function TaskCard({ task }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <span className={styles.status}>{task.status}</span>
      </div>
      <p className={styles.description}>{task.description}</p>
    </div>
  )
}
```

Plus 30+ lines of CSS... 😅

---

# Chakra UI: Task Card

```jsx
// TaskCard.jsx
import { Box, Heading, Text, Badge } from '@chakra-ui/react'

function TaskCard({ task }) {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Flex justify="space-between" align="center">
        <Heading size="md">{task.title}</Heading>
        <Badge colorScheme="green">{task.status}</Badge>
      </Flex>
      <Text mt={2} color="gray.600">{task.description}</Text>
    </Box>
  )
}
```

---

# Theming in Chakra UI

```jsx
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0e4ff',
      500: '#6b46c1',
      900: '#2d1b69'
    }
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Inter", sans-serif'
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true
  }
})
```

---

# Dark Mode: Built-In!

```jsx
import { useColorMode, Button, useColorModeValue } from '@chakra-ui/react'

function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const bgColor = useColorModeValue('gray.100', 'gray.900')

  return (
    <Box bg={bgColor}>
      <Button onClick={toggleColorMode}>
        Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
    </Box>
  )
}
```

---

# Component Variants

```jsx
// Define custom variants
const theme = extendTheme({
  components: {
    Button: {
      variants: {
        'brand': {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          }
        }
      }
    }
  }
})

// Use the variant
<Button variant="brand">Custom Button</Button>
```

---

# Form Controls

```jsx
import {
  FormControl, FormLabel, Input,
  Select, Switch, Button
} from '@chakra-ui/react'

function TaskForm() {
  return (
    <VStack spacing={4}>
      <FormControl isRequired>
        <FormLabel>Task Title</FormLabel>
        <Input placeholder="Enter task title" />
      </FormControl>

      <FormControl>
        <FormLabel>Priority</FormLabel>
        <Select>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </Select>
      </FormControl>

      <Button colorScheme="blue" type="submit">
        Add Task
      </Button>
    </VStack>
  )
}
```

---

# Accessibility Features

## Built into every Chakra component:

- ✅ **ARIA attributes** automatically added
- ✅ **Keyboard navigation** works out-of-box
- ✅ **Focus management** handled properly
- ✅ **Screen reader** support included

```jsx
// This simple code is fully accessible!
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Add Task</ModalHeader>
    <ModalCloseButton />
    <ModalBody>...</ModalBody>
  </ModalContent>
</Modal>
```

---

# Performance Optimization

## Code Splitting
```jsx
// Lazy load heavy components
const DataTable = lazy(() => import('./DataTable'))
```

## Tree Shaking
```jsx
// Import only what you need
import { Box, Text } from '@chakra-ui/react'
// NOT: import * as Chakra from '@chakra-ui/react'
```

## Chakra UI is optimized for:
- Minimal runtime overhead
- Efficient re-renders
- Small bundle size (with tree shaking)

---

# When to Use Component Libraries

## ✅ **DO USE** when:
- Building MVPs or prototypes
- Internal tools and dashboards
- Consistency matters more than uniqueness
- Team lacks dedicated designers
- Accessibility is critical

---

# When NOT to Use Component Libraries

## ❌ **AVOID** when:
- Brand identity is unique/crucial
- Performance is absolutely critical
- Learning CSS/building portfolio
- Very simple static sites

---

# Mixing Approaches

## You don't have to go all-in!

```jsx
// Use Chakra for layout and common components
<ChakraProvider>
  <Box p={4}>
    <Heading>My App</Heading>

    {/* Custom component with your own styles */}
    <MyCustomHero />

    {/* Back to Chakra for forms */}
    <Input placeholder="Email" />
  </Box>
</ChakraProvider>
```

---

# Real-World Examples

## Companies using Chakra UI:

- **Twetch** - Social network
- **Peerlist** - Professional network
- **Polygon** - Blockchain platform
- **Deta** - Cloud platform

---

## Why they chose it:
- Rapid development
- Consistent UX
- Great DX
- Active community

---

# Resources & Next Steps

## Documentation
- [Chakra UI Docs](https://chakra-ui.com)
- [Component Gallery](https://chakra-ui.com/docs/components)

## Templates & Examples
- [Chakra Templates](https://chakra-templates.dev)
- [Official Examples](https://github.com/chakra-ui/chakra-ui/tree/main/examples)

## Community
- [Discord Server](https://discord.gg/chakra-ui)
- [GitHub Discussions](https://github.com/chakra-ui/chakra-ui/discussions)

---

# Key Takeaways

1. 🚀 **Component libraries accelerate development**
2. 🎯 **Choose based on project needs**
3. ⚖️ **Understand the trade-offs**
4. 💜 **Chakra UI = Great DX + Flexibility**
5. ♿ **Accessibility shouldn't be optional**

---

# Questions?

## Let's discuss:
- Which library appeals to you most?
- What are your concerns?
- Any specific use cases?

### Remember:
Component libraries are **tools**, not requirements.
Choose the right tool for the job!

---

# Thank You!

## Happy Coding! 🚀
# Week 4 - React Component Libraries Examples

This folder contains two implementations of the same Task Dashboard application:

## 📁 task-dashboard-plain
A plain React implementation using custom CSS for all styling. This demonstrates the traditional approach with full control over styles but requires more development time.

**Run it:**
```bash
cd task-dashboard-plain
npm install
npm run dev
```

## 📁 task-dashboard-chakra
The same application built with Chakra UI component library. This demonstrates how component libraries can dramatically speed up development while providing excellent features out of the box.

**Run it:**
```bash
cd task-dashboard-chakra
npm install
npm run dev
```

## Key Differences

### Plain React Version
- ✅ Full control over styles
- ✅ Smaller bundle size
- ❌ More development time
- ❌ Manual accessibility implementation
- ❌ Custom responsive design needed
- ❌ No built-in dark mode

### Chakra UI Version
- ✅ Rapid development
- ✅ Built-in dark mode
- ✅ Accessible by default
- ✅ Responsive design with props
- ✅ Consistent theming
- ❌ Larger bundle size
- ❌ Learning curve for API

## Learning Objectives

By comparing these two implementations, students will:

1. Understand the trade-offs between custom CSS and component libraries
2. Learn when to use component libraries vs. custom implementations
3. Experience the development speed difference firsthand
4. Appreciate built-in features like dark mode and accessibility
5. Make informed decisions for their own projects

## Assignment Ideas

1. **Extend Features**: Add sorting, filtering, or search to both versions
2. **Performance Test**: Measure and compare bundle sizes and load times
3. **Accessibility Audit**: Test both versions with screen readers
4. **Custom Theme**: Create a custom Chakra UI theme
5. **Migration Exercise**: Convert a plain React component to use Chakra UI
```markdown
# x402-ai-starter1 Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `x402-ai-starter1` repository. The project is a Next.js application written in TypeScript, following strict code style and commit message conventions. You'll learn how to structure files, write imports/exports, and maintain consistency in your workflow.

## Coding Conventions

### File Naming
- Use **camelCase** for file and directory names.
  - Example: `userProfile.ts`, `apiRoutes/handleRequest.ts`

### Import Style
- Use **absolute imports** from the project root.
  - Example:
    ```typescript
    import { fetchData } from 'utils/dataFetcher';
    ```

### Export Style
- Use **named exports** for modules.
  - Example:
    ```typescript
    // utils/dataFetcher.ts
    export function fetchData() { /* ... */ }
    ```

### Commit Messages
- Follow **Conventional Commits**.
- Allowed prefixes: `chore`, `fix`
- Example:
  ```
  fix: correct typo in userProfile component
  chore: update dependencies to latest versions
  ```

## Workflows

### Commit Changes
**Trigger:** When making any code change  
**Command:** `/commit-changes`

1. Stage your changes:
   ```bash
   git add .
   ```
2. Write a commit message using the allowed prefixes (`chore`, `fix`):
   ```bash
   git commit -m "fix: resolve issue with data fetch"
   ```
3. Push your changes:
   ```bash
   git push
   ```

### Add a New Module
**Trigger:** When creating a new feature or utility  
**Command:** `/add-module`

1. Create a new file using camelCase naming:
   ```
   utils/newFeature.ts
   ```
2. Use absolute imports for dependencies:
   ```typescript
   import { helper } from 'utils/helper';
   ```
3. Export your functions or components using named exports:
   ```typescript
   export function newFeature() { /* ... */ }
   ```
4. Add tests in a corresponding `*.test.*` file.

## Testing Patterns

- Test files follow the pattern: `*.test.*` (e.g., `userProfile.test.ts`)
- The testing framework is **unknown** (please check the project for details).
- Place test files alongside the modules they test or in a dedicated test directory.

#### Example Test File
```typescript
// userProfile.test.ts
import { render } from '@testing-library/react';
import { UserProfile } from 'components/userProfile';

test('renders user profile', () => {
  // Test implementation
});
```

## Commands
| Command           | Purpose                                         |
|-------------------|-------------------------------------------------|
| /commit-changes   | Commit code changes following conventions        |
| /add-module       | Add a new module with proper structure           |
```

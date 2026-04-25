---
name: dev_agent
description: Expert engineer for this GitHub Action
---

## Persona

Specialize in developing GitHub Actions with clear, DRY, understandable code.

## Project

- **Tech Stack:**
  - GitHub Actions toolkit:
    - @actions/core 3 (functions for setting results, logging, registering secrets and exporting variables across actions)
    - @actions/exec 3 (executes cross-platform tools)
    - @actions/tool-cache 4 (downloads and caches tools)
  - TypeScript 6 (strict mode)
  - @vercel/ncc 0.38 (build tool)
  - Node.js 24 (runtime used to execute the code)
- **File Structure:**
  - `action.yml` (action metadata)
  - `src/` (action code)
  - `dist/` (build artifact)

## Commands

- **Build:** `npm run build` (compiles a Node.js module into a single file with ncc, outputs to `dist/index.js`)
- **Lint:** `npm run lint:fix` (auto-fixes ESLint errors)
- **Type check:** `npm run lint:tsc` (checks TypeScript for errors)
- **Test:** `npm run test:ci` (runs Jest unit tests, must pass with 100% coverage before commits)

## Standards

Follow these rules for all code you write:

**Naming conventions:**

- Functions: camelCase (`getArch`, `getDownloadObject`)
- Classes: PascalCase (`ToolManager`, `Config`)
- Constants: UPPER_SNAKE_CASE (`CLI_NAME`, `CLI_VERSION`)

**Code style example:**

```typescript
// ✅ Good - descriptive names, no `any` types
function getBinaryPath(directory: string, name: string) {
  return path.join(directory, name + (os.platform() === 'win32' ? '.exe' : ''));
}

// ❌ Bad - vague names, `any` types
function getOutput(a: any, b: any) {
  return path.join(a, b + (os.platform() === 'win32' ? '.exe' : ''));
}
```

Boundaries:

- ✅ **Always:** Write to `action.yml` and `src/`, run lint, type check, and test before commits, follow naming conventions
- ⚠️ **Ask first:** Adding dependencies, modifying CI/CD config
- 🚫 **Never:** Commit secrets or API keys, edit `dist/` and `node_modules/`

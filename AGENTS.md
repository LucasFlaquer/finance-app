# Finance App

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (Base UI), backed by PostgreSQL 17 via Prisma ORM Postgres (`prisma-next`, contract-based). Package manager: **pnpm**.

## Getting Started

```bash
pnpm install                  # install dependencies (also runs `lefthook install` via prepare)
cp .env.example .env          # then set DATABASE_URL
docker compose up -d          # start PostgreSQL 17 on localhost:5432
pnpm contract:emit            # generate Prisma contract artifacts from contract.prisma
pnpm dev                      # start dev server
```

## Where It Runs

| Service | URL / Port |
| --- | --- |
| Next.js dev server | http://localhost:3000 |
| Next.js production server (`pnpm start`) | http://localhost:3000 |
| PostgreSQL (docker compose service `db`) | localhost:5432 (user `user`, password `password`, db `mydb`) |

Override the app port with `pnpm dev -- -p <port>`.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Run the app in development mode |
| `pnpm build` | Production build (`next build`) |
| `pnpm start` | Serve the production build (requires `pnpm build` first) |
| `pnpm lint` | Lint with Biome (`biome check`) |
| `pnpm check` | Ultracite check (lint + format verification) |
| `pnpm fix` | Auto-fix lint/format issues |
| `pnpm format` | Format only (`biome format --write`) |
| `pnpm contract:emit` | Emit Prisma contract (`contract.json` / `contract.d.ts`) from `contract.prisma` |
| `docker compose up -d` / `docker compose down` | Start / stop the PostgreSQL database |

### Tests

No test runner is configured yet. There is no `pnpm test` script and no test files in the repo. When adding tests, wire a `test` script into `package.json` and document it here; follow the testing rules in the Testing section below.

## Folder Structure

```
finance-app/
├── src/
│   ├── app/                  # Next.js App Router: routes, layouts, pages
│   │   ├── layout.tsx        # Root layout (fonts, global providers, <html>/<body>)
│   │   ├── page.tsx          # Home route (/)
│   │   ├── globals.css       # Tailwind v4 entry + design tokens/theme variables
│   │   └── favicon.ico
│   ├── components/
│   │   └── ui/               # shadcn/ui primitives (e.g. button.tsx) — generated, edit with care
│   ├── lib/
│   │   └── utils.ts          # Shared helpers (`cn` class-merge utility)
│   └── prisma/
│       ├── contract.prisma   # Source of truth for the data model
│       ├── contract.json     # Generated contract consumed at runtime
│       ├── contract.d.ts     # Generated TypeScript types for the contract
│       └── db.ts             # Database client singleton (`db`) — import this for queries
├── public/                   # Static assets served at the site root (/file.svg, ...)
├── .claude/
│   ├── CLAUDE.md             # Claude Code entry point; re-exports AGENTS.md
│   ├── settings.json         # Claude Code project settings
│   └── skills/               # Project skills (shadcn)
├── .cursor/hooks.json        # Cursor editor hooks
├── .vscode/settings.json     # Editor settings (Biome as formatter)
├── AGENTS.md                 # This file — agent/contributor guide + code standards
├── README.md                 # Human-facing project readme
├── biome.json                # Biome/Ultracite lint + format configuration
├── components.json           # shadcn/ui CLI configuration (aliases, style, theme)
├── docker-compose.yml        # Local PostgreSQL 17 service
├── lefthook.yml              # Git hooks (pre-commit runs `ultracite fix`)
├── next.config.ts            # Next.js configuration
├── postcss.config.mjs        # PostCSS with @tailwindcss/postcss plugin
├── prisma-next.config.ts     # Prisma contract + DB connection configuration
├── prisma-next.md            # Prisma ORM Postgres (prisma-next) usage notes
├── tsconfig.json             # TypeScript config (path alias `@/*` → `src/*`)
├── .env.example              # Template for `.env` (DATABASE_URL)
└── pnpm-workspace.yaml       # pnpm workspace configuration
```

Path alias: `@/` resolves to `src/`.

Git hooks: `lefthook` runs `pnpm dlx ultracite fix` on staged JS/TS/JSON/CSS files before each commit.

---

# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `pnpm dlx ultracite fix`
- **Check for issues**: `pnpm dlx ultracite check`
- **Diagnose setup**: `pnpm dlx ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `pnpm dlx ultracite fix` before committing to ensure compliance.

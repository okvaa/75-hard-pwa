<!-- .github/copilot-instructions.md - guidance for AI coding agents -->
# Copilot instructions for 75-hard-pwa

This repository is a small React + Vite single-page app (PWA-ready) used to track the "75 Hard" challenge. The goal of this file is to give an AI agent the exact, actionable information needed to make safe, consistent edits.

Key facts (big picture)
- Framework: React 18 + Vite (see `package.json` scripts). UI is plain functional components with Tailwind classes (`tailwind.config.js`).
- Entry: `src/main.tsx` -> `src/App.tsx` -> `src/MainTaskMenu.tsx` (main UI and stateful logic).
- Small component library in `src/components/ui/` (simple wrappers for Button, Card, Checkbox, ScrollArea).
- No server: app is fully client-side and uses `localStorage` to persist user state (see `src/MainTaskMenu.tsx` and components like `ExerciseTracker.tsx`, `PhotoPage.tsx`).

Developer workflows & commands
- Start dev server: `npm run dev` (runs `vite`).
- Build production: `npm run build` followed by `npm run preview` to test the built output.
- Deploy: `npm run deploy` (uses `gh-pages` to publish `dist/`).
- Vite base is configured to `/75-hard-pwa/` in `vite.config.ts` — be careful when changing paths or the base public path.

Project-specific conventions and patterns
- Persistence: Components use `localStorage` directly. Keys to watch for: `selectedTask`, `waterIntake`, `pagesRead`, `darkMode`, `completedDates`, `photoHistory`, `exerciseProgress`, `measurementsHistory`.
- Minimal custom UI primitives: `src/components/ui/*` export tiny presentational components. Avoid introducing heavy component libraries without updating these primitives.
- Routing: there is no React Router — UI switches views conditionally (see `MainTaskMenu`'s `selectedTask`). Add new screens as conditional renders or implement a lightweight routing approach consistently.
- Animations: `framer-motion` is used for entry/exit transitions; follow existing `motion.div` and `variants` patterns when adding animations.
- Styling: Tailwind utility classes are used inline. Keep classes on elements rather than extracting many custom CSS files unless necessary.

Integration & dependencies
- PWA: `vite-plugin-pwa` is listed in `devDependencies` but not currently wired in `vite.config.ts`. If adding PWA features, wire `VitePWA` into `vite.config.ts` and update `public/manifest.*`.
- 3rd-party UI/UX libs in use: `framer-motion`, `lucide-react` (icons), `react-calendar`, `react-circular-progressbar`, `canvas-confetti`.

Safety and small-scope guidance for edits
- Preserve `localStorage` keys and their shape when migrating state to a different system. If changing keys, add a compatibility migration to read old keys and write the new ones.
- Keep the `base` option in `vite.config.ts` in sync with `index.html` script paths and the `public/` assets.
- Tests: no test framework is present. Add tests only after proposing a minimal test runner (e.g., Vitest) and updating `package.json` scripts.

Where to look first for common tasks
- To update the main UI or behavior: `src/MainTaskMenu.tsx` (handles most app logic and localStorage).
- To add a new task screen: create a new component under `src/`, export default, and conditionally render it where `tasks` are mapped in `MainTaskMenu`.
- To change build/deploy settings: `vite.config.ts`, `package.json` scripts, and `public/manifest.webmanifest`.

Examples (copy/paste patterns)
- Read/write a persisted integer:
  - Read: `const stored = localStorage.getItem("waterIntake"); const value = stored ? parseInt(stored) : 0;`
  - Write: `useEffect(() => { localStorage.setItem("waterIntake", waterIntake.toString()); }, [waterIntake]);`
- Conditional screen rendering (MainTaskMenu): `selectedTask === "Exercise" && <ExerciseTracker />`

If you change global state shape or introduce global context:
- Provide a migration helper (runs on first load) that reads old `localStorage` keys and converts them.
- Keep changes small and add console.log traces to ease manual testing in the browser.

When you finish a change
- Run `npm run dev`, open the app in the browser, and manually test the feature that depends on `localStorage` keys.
- If you touched `vite.config.ts` or the `base` setting, run `npm run build` and `npm run preview` to validate production paths.

Questions for maintainers (if unclear)
- Is preserving backward compatibility of `localStorage` keys required across releases? If yes, prefer additive migrations.
- Do you want a routing library added or keep the current conditional rendering approach?

End of guidance — ask the repo owner for clarifications if you need to change core persistence, routing, or the Vite base path.

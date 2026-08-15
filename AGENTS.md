# Repository Testing Instructions

## Global Settings

Create components for the reused screens elements, if they are reused inside the same component put them in the features folder into /[feature]/components, if they are reused in another screen put them into the common components folder.

## Mobile app

For mobile changes, preserve the existing Expo-compatible Jest strategy.

### Test stack

- Use `jest-expo` and React Native Testing Library.
- Keep tests outside `apps/mobile/app/`; route tests belong in `apps/mobile/test/` and may import route modules.
- Do not add snapshots or numeric coverage thresholds.
- Use accessible roles, labels, text, and placeholders. Add an accessible name to production code only when it also improves the UI.
- React Native Testing Library 14 is asynchronous: await `render`, `rerender`, `unmount`, and `fireEvent` calls.

### What to test

- Extract nontrivial pure logic into the smallest feature-local logic module and test branches directly.
- Test reducers, validation, normalization, DTO mapping, media-state changes, and `FormData` serialization.
- Exercise RTK Query endpoints through a real Redux store with mocked `fetch`; verify URLs, methods, response transforms, and success/error invalidation.
- Cover critical component and route flows: loading, empty, error/retry, data, validation, normalized submission, server errors, filtering/switching, loading state, and successful navigation.
- Mock native boundaries such as image picker, Android date picker, MapLibre, Skia/charts, router hooks, and API hooks. Test application behavior, not native implementations.
- Skip style-only wrappers, static configuration, icon/map/chart internals, the low-level dropdown primitive, snapshots, and device E2E unless explicitly requested.

### Required verification

Run from the repository root:

```powershell
pnpm --filter @internal/mobile test
pnpm --filter @internal/mobile test:coverage
pnpm --filter @internal/mobile exec tsc --noEmit
pnpm --filter @internal/mobile lint
```

Coverage must be reported but must not fail on a percentage. Keep existing unrelated lint warnings separate from new errors.

## Web app

For web changes, use a Next.js-compatible Vitest strategy equivalent in rigor to the mobile strategy.

### Test stack

- Use Vitest, jsdom, React Testing Library, `@testing-library/user-event`, and `@testing-library/jest-dom`.
- If the web test infrastructure is missing, configure it before adding web tests: add `vitest.config`, a shared test setup, and non-watch `test` and `test:coverage` scripts to `@internal/web`. Convert ad-hoc assertion scripts to real Vitest suites when touching them.
- Keep feature tests beside feature code. Keep page, metadata, and route-handler integration tests in `apps/web/test/`; do not scatter test-only modules through `apps/web/app/`.
- Do not add snapshots or numeric coverage thresholds.
- Query the DOM by accessible role, name, label, text, and placeholder. Use `userEvent` for interactions and await asynchronous UI updates.
- Vitest does not render async Server Components reliably. Extract their decisions into the smallest server-safe module and test it directly; use Playwright only when an async page flow genuinely requires browser-level coverage.

### What to test

- Extract nontrivial pure logic into the smallest feature-local module and test branches directly.
- Test validation, normalization, DTO mapping, serialization, URL construction, query-parameter parsing, pagination boundaries, sort/search configuration, redirects, canonical URLs, and robots metadata.
- Invoke App Router route handlers with real `Request` objects and mocked external boundaries. Verify status codes, response bodies, authentication/authorization, database payloads, upload cleanup, and error handling.
- Mock `next/navigation`, `next/headers`, Supabase, R2, fonts, and other framework or network boundaries. Test application behavior, not those implementations.
- Cover critical client flows: loading/skeletons, empty and error states, search submit/clear without per-keystroke requests, filtering, sorting, pagination, grid/list switching, disabled controls, and successful navigation.
- For server data queries, verify filters and ordering are applied before pagination, counts drive page bounds, invalid or out-of-range URLs fail correctly, and alternative filter/sort URLs remain non-indexable.
- Keep crawlable navigation assertions at the HTML level: pagination must expose real anchor `href` values and preserve committed query state.
- Skip style-only wrappers, static configuration, shadcn/Radix primitive internals, icon internals, snapshots, and broad browser E2E unless explicitly requested.

### Required verification

Run from the repository root:

```powershell
pnpm --filter @internal/web test
pnpm --filter @internal/web test:coverage
& apps/web/node_modules/.bin/tsc.CMD -p apps/web/tsconfig.json --noEmit --incremental false
pnpm --filter @internal/web lint
pnpm --filter @internal/web build
```

Coverage must be reported but must not fail on a percentage. The production build is required because it validates App Router server/client boundaries and metadata behavior that unit tests cannot. Keep existing unrelated warnings separate from new failures.

### Responsiveness

When making desktop versions of mobile screens reuse the components of the mobile version as much as posible. Prioritize responsive clases before creating a new component. If you really think that reusing the mobile component will overcomplicate the code you can create a new component.

When setting responsiveness, i want a fluid conversion. I want the screen to be responsive in any screen size between xl and mobile. only after the xl breakpoint the page container should stop growing and just add space on the side, below that the page container should be 100 vw and arrange the elements accordingly, making a soft transition between the mobile and desktop screens.

# Repository Testing Instructions

For mobile changes, preserve the existing Expo-compatible Jest strategy.

## Test stack

- Use `jest-expo` and React Native Testing Library.
- Keep tests outside `apps/mobile/app/`; route tests belong in `apps/mobile/test/` and may import route modules.
- Do not add snapshots or numeric coverage thresholds.
- Use accessible roles, labels, text, and placeholders. Add an accessible name to production code only when it also improves the UI.
- React Native Testing Library 14 is asynchronous: await `render`, `rerender`, `unmount`, and `fireEvent` calls.

## What to test

- Extract nontrivial pure logic into the smallest feature-local logic module and test branches directly.
- Test reducers, validation, normalization, DTO mapping, media-state changes, and `FormData` serialization.
- Exercise RTK Query endpoints through a real Redux store with mocked `fetch`; verify URLs, methods, response transforms, and success/error invalidation.
- Cover critical component and route flows: loading, empty, error/retry, data, validation, normalized submission, server errors, filtering/switching, loading state, and successful navigation.
- Mock native boundaries such as image picker, Android date picker, MapLibre, Skia/charts, router hooks, and API hooks. Test application behavior, not native implementations.
- Skip style-only wrappers, static configuration, icon/map/chart internals, the low-level dropdown primitive, snapshots, and device E2E unless explicitly requested.

## Required verification

Run from the repository root:

```powershell
pnpm --filter @internal/mobile test
pnpm --filter @internal/mobile test:coverage
pnpm --filter @internal/mobile exec tsc --noEmit
pnpm --filter @internal/mobile lint
```

Coverage must be reported but must not fail on a percentage. Keep existing unrelated lint warnings separate from new errors.

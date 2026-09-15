# 001 — Derive the experience scroll runway

- **Commit:** 84da2af
- **Severity:** LOW
- **Category:** Cohesion, hierarchy & spatial consistency
- **Estimated scope:** 1 file, ~12 lines

## Problem

The Experience stack uses a fixed `280svh` height even though its cards come from `workExperiences`. Adding or removing a card therefore changes the amount of scroll available to every transition and makes the interaction's pace data-dependent.

## Where

| File                                             | Lines        | What's there                                     |
| ------------------------------------------------ | ------------ | ------------------------------------------------ |
| `src/components/sections/experience-section.tsx` | 14–15, 39–99 | Fixed stack height and the data-driven card loop |

### Current code

```tsx
const experienceStackClass =
  "relative h-[280svh] pl-[52px] ...";

<div className={experienceStackClass} ref={stackRef}>
```

## Target

Define `60svh` of movement runway for every incoming card and `20svh` of resting runway after the final card settles. Set `--experience-stack-height` to `100 + transitionCount * 60 + 20` svh when transitions exist, and `100svh` for a single card. Consume the property with `h-(--experience-stack-height)` while retaining all existing static-layout responsive overrides.

**Why these values:** `60svh` closely preserves the existing pace of three transitions within `280svh`; `20svh` gives the completed arrangement a brief readable hold.

## Conventions to follow

- Responsive stack geometry and CSS custom properties already live in `src/components/sections/experience-section.tsx`.
- Preserve the existing `short-viewport`, `max-[360px]`, and `motion-reduce` static-layout variants.

## Steps

1. Import `CSSProperties` as a type.
2. Add constants for the `60svh` transition runway and `20svh` settled runway.
3. Derive transition count and stack height from `workExperiences.length`.
4. Set `--experience-stack-height` on the stack container and consume it in the height utility.

## Out of scope

- Do not alter card content or responsive breakpoints.
- Do not introduce a new animation library.
- Do not change other sections.

## Verification

**Build**

- [x] `bun run lint` passes.
- [x] `bun run build` passes.

**Behavior**

- [x] Four cards produce a `300svh` stack.
- [x] Static fallback layouts remain `height: auto`.

**Feel**

- [x] Scroll through the desktop stack; every incoming card receives consistent travel time. Responsive static fallbacks remain intact in source.

# 003 — Use a composite experience-card transform

- **Commit:** 84da2af
- **Severity:** MEDIUM
- **Category:** Performance
- **Estimated scope:** 1 file, ~5 lines

## Problem

The continuously updated scroll position is supplied through Motion's individual `y` transform. Individual transform values are composed by Motion on the main thread; a complete transform string gives the browser its best opportunity to composite the movement.

## Where

| File                                             | Lines   | What's there                                     |
| ------------------------------------------------ | ------- | ------------------------------------------------ |
| `src/components/sections/experience-section.tsx` | 125–141 | Numeric `y` MotionValue passed through `style.y` |

### Current code

```tsx
const y = useTransform(progress, inputRange, outputRange);
style={reduceMotion ? { zIndex: 10 + index } : { y, zIndex: 10 + index }}
```

## Target

Map `y` to a reactive full transform string using `useTransform(y, value => \`translate3d(0, ${value}px, 0)\`)`, then pass it through `style.transform`. Keep the reduced-motion branch free of transforms.

**Why these values:** `translate3d` changes only composition and uses pixel output already calculated from measured stage geometry.

## Conventions to follow

- Continue using Motion values so scroll updates remain outside React rendering.
- Do not add `will-change`; the repository has no verified layer-handoff defect on these cards.

## Steps

1. Derive a reactive `transform` MotionValue from the existing numeric `y` value.
2. Replace `style.y` with `style.transform`.
3. Preserve `zIndex` and the reduced-motion branch exactly.

## Out of scope

- Do not introduce CSS scroll timelines or another animation library.
- Do not change scroll pacing or layout in this plan.

## Verification

**Build**

- [x] `bun run lint` passes.
- [x] `bun run build` passes.

**Behavior**

- [x] Card positions still resolve to `0`, `step`, `step * 2`, and `step * 3`.
- [x] Reverse scrolling remains interruptible without jumps.

**Feel**

- [x] Inspect a desktop scroll and confirm continuous frames without positional jumps.
- [ ] Test on a real mid-range mobile device before treating compositor promotion as guaranteed.

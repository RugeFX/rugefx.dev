# 002 — Hold the completed experience stack

- **Commit:** 84da2af
- **Severity:** MEDIUM
- **Category:** Cohesion, hierarchy & spatial consistency
- **Estimated scope:** 1 file, ~10 lines

## Problem

The final card reaches its resting position at `scrollYProgress = 1`, exactly when the sticky stage releases. The completed composition has no stationary reading moment and immediately leaves toward Selected Work.

## Where

| File                                             | Lines   | What's there                          |
| ------------------------------------------------ | ------- | ------------------------------------- |
| `src/components/sections/experience-section.tsx` | 122–129 | Equal progress segments ending at `1` |

### Current code

```tsx
const segmentStart = index === 0 ? 0 : (index - 1) / segmentCount;
const segmentEnd = index === 0 ? 1 : index / segmentCount;
```

## Target

Calculate `settleProgress` as movement runway divided by total runway. With four cards this is `180 / 200 = 0.9`. Multiply every moving card's segment start and end by this value so the last card settles at 90% and remains fixed for the final 10%.

**Why these values:** a `20svh` hold after three `60svh` movements is long enough to register without making the marketing page feel stalled.

## Conventions to follow

- Keep direct scroll tracking through Motion values; no tween or spring belongs between scroll input and card position.
- `src/components/sections/experience-section.tsx` already passes calculated stack geometry into each card.

## Steps

1. Derive `settleProgress` in `ExperienceStack` from the runway values in plan 001.
2. Pass it to every `ExperienceCard`.
3. Multiply `segmentStart` and `segmentEnd` by `settleProgress`.

## Out of scope

- Do not animate the stationary hold.
- Do not add opacity, scale, bounce, or depth effects.
- Do not change card overlap spacing.

## Verification

**Build**

- [x] `bun run lint` passes.
- [x] `bun run build` passes.

**Behavior**

- [x] The final card reaches `index * step` before the sticky stage releases.
- [x] Reverse scrolling remains directly attached to input.
- [x] Reduced motion remains a static document flow.

**Feel**

- [x] Inspect the final transition at 90% and 96% progress; the completed stack remains still before Selected Work enters.

# Definitions UI Update - Accordion Implementation

**Date**: November 5, 2025  
**Change**: Replaced individual tooltip icons with expandable accordion

## Problem

The original implementation showed multiple info icons (up to 5) for questions with many definitions, creating visual clutter and poor UX:

```
Tap for definitions:
Medically Frail ⓘ  Substance Use Disorder ⓘ  Disabling Mental Disorder ⓘ
Physical/Intellectual/Developmental Disability ⓘ  Serious or Complex Medical Condition ⓘ
```

This was overwhelming and took up too much screen space.

## Solution

Implemented a single expandable accordion that contains all definitions in an organized, scannable format:

```
┌─────────────────────────────────────────────┐
│ ⓘ What do these terms mean?        5 terms ▼│
└─────────────────────────────────────────────┘

When expanded:
┌─────────────────────────────────────────────┐
│ ⓘ What do these terms mean?        5 terms ▲│
├─────────────────────────────────────────────┤
│ Medically Frail                             │
│ Having a serious health condition...        │
│ Examples:                                   │
│ • You have severe depression...             │
│                                             │
│ Substance Use Disorder                      │
│ A medical condition where someone...        │
│ Examples:                                   │
│ • You're receiving treatment...             │
│                                             │
│ [... more definitions ...]                  │
└─────────────────────────────────────────────┘
```

## Changes Made

### New Component: `DefinitionsAccordion.tsx`

Created a new accordion component with two variants:

1. **DefinitionsAccordion** (default) - Full definitions with examples
2. **CompactDefinitionsAccordion** - Condensed format for many terms

Features:

- Clean, organized layout
- Shows term count in summary
- Large touch targets (56px minimum)
- Dividers between definitions
- Includes all examples
- Mobile-friendly

### Updated: `ExemptionQuestion.tsx`

Replaced the tooltip implementation with the accordion:

**Before:**

```tsx
<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
  {definitions.map((def) => (
    <Box key={def.term}>
      <Typography variant="body2">{def.term}</Typography>
      <DefinitionTooltip definition={def} size="small" />
    </Box>
  ))}
</Stack>
```

**After:**

```tsx
<DefinitionsAccordion
  definitions={definitions}
  summaryText="What do these terms mean?"
/>
```

## Benefits

✅ **Cleaner UI** - Single expandable section instead of 5+ icons  
✅ **Better Scannability** - All definitions in one organized list  
✅ **Progressive Disclosure** - Collapsed by default, expand when needed  
✅ **Mobile-Friendly** - Large touch target, easy to tap  
✅ **More Context** - Shows term count, organized with dividers  
✅ **Accessible** - Proper ARIA labels, keyboard navigable

## User Flow

1. User sees question with help text
2. Below help text, sees collapsed accordion: "What do these terms mean? 5 terms"
3. User taps to expand
4. Sees all definitions in organized list with examples
5. Can scroll through definitions
6. Taps again to collapse

## Backward Compatibility

The old `DefinitionTooltip` component is still available for:

- Single-term definitions
- Inline help text
- Other use cases where tooltips make sense

## Testing

To test the new accordion:

1. Run `npm run dev`
2. Navigate to `/exemptions`
3. Start screening
4. Go to "Are you medically frail or have special needs?" question
5. See the accordion below the help text
6. Tap to expand and see all 5 definitions
7. Verify it looks clean and organized

## Future Enhancements

Potential improvements:

- [ ] Add search/filter within accordion for many terms
- [ ] Remember expanded/collapsed state per question
- [ ] Add "jump to definition" links from help text
- [ ] Animate expansion for smoother UX
- [ ] Add "Was this helpful?" feedback

## Files Changed

- **Created**: `src/components/exemptions/DefinitionsAccordion.tsx`
- **Updated**: `src/components/exemptions/ExemptionQuestion.tsx`
- **Preserved**: `src/components/exemptions/DefinitionTooltip.tsx` (for other uses)

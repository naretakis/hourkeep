# Onboarding Redesign: Summary

## Overview

This spec redesigns HourKeep's onboarding experience to support both event-driven (reactive) and continuous (proactive) tracking use cases by **maximizing reuse of existing components**.

## Key Strategy: 90% Component Reuse

Instead of building from scratch, we're integrating existing, tested components from "How to HourKeep" assessment and current onboarding flow.

## Time Savings

| Approach                               | Estimated Time     | Components         |
| -------------------------------------- | ------------------ | ------------------ |
| **Original Plan** (Build from scratch) | ~98 hours          | 25+ new components |
| **Reuse Strategy** (This spec)         | ~44 hours          | 3 new components   |
| **Savings**                            | **54 hours (55%)** | **90% reuse**      |

## What We're Reusing

### From "How to HourKeep" Assessment (✅ Reuse as-is)

- `IntroductionScreen` - Welcome screen (minor copy update)
- `NoticeQuestion` - "Have you received a notice?"
- `NoticeFollowUp` - "Check exemption or skip?"
- `ExemptionQuestion` - All 12 exemption questions
- `ProgressIndicator` - Progress dots/percentage
- `QuestionWrapper` - Question container with back/continue
- `SingleChoiceQuestion` - Radio button questions
- `MultipleChoiceQuestion` - Checkbox questions
- `NumberInputQuestion` - Number inputs
- Assessment progress saving and resumption

### From Onboarding (✅ Reuse with minor changes)

- `PrivacyNotice` - Privacy explanation (no changes)
- `ProfileForm` - Profile data collection (streamline)

### From Existing Patterns (✅ Reuse patterns)

- Material-UI components (Accordion, Tooltip, etc.)
- Validation logic
- Error handling
- Loading states
- Accessibility features

## What We're Creating (Only 3 Components!)

1. **NoticeDetailsQuestion** (3 hours)
   - Ask about months needed and deadline
   - Reuses SingleChoiceQuestion pattern

2. **GettingStartedContextual** (5 hours)
   - Show next steps based on context
   - Reuses Material-UI patterns

3. **Onboarding Router** (4 hours)
   - Sequences existing components
   - Adapts existing routing logic

## New User Flow

```
1. Privacy Notice (existing PrivacyNotice)
   ↓
2. Welcome (existing IntroductionScreen - enhanced copy)
   ↓
3. Notice Question (existing NoticeQuestion)
   ↓
4. Notice Details (NEW - NoticeDetailsQuestion)
   ↓
5. Exemption Check (existing NoticeFollowUp + ExemptionQuestion)
   ↓
6. Profile Setup (existing ProfileForm - streamlined)
   ↓
7. Getting Started (NEW - GettingStartedContextual)
   ↓
8. Dashboard (configured based on context)
```

## Data Model Changes

**Minimal!** Just add optional field to existing UserProfile:

```typescript
interface UserProfile {
  // ... existing fields ...

  // NEW: Optional onboarding context
  onboardingContext?: {
    hasNotice?: boolean;
    monthsRequired?: number;
    deadline?: Date;
    completedAt?: Date;
  };
}
```

**No new tables needed!** Reusing:

- `profiles` table (existing)
- `assessmentProgress` table (existing)
- `assessmentResults` table (existing)

## Implementation Breakdown

### Phase 1: Foundation (5 hours)

- Extend UserProfile interface (1 hour)
- Create onboarding router (4 hours)

### Phase 2: Component Enhancement (11 hours)

- Enhance IntroductionScreen copy (1 hour)
- Create NoticeDetailsQuestion (3 hours)
- Streamline ProfileForm (2 hours)
- Create GettingStartedContextual (5 hours)

### Phase 3: Integration (5 hours)

- Implement router logic (4 hours)
- Add route guards (1 hour)

### Phase 4: Dashboard Integration (11 hours)

- Update dashboard for goal progress (5 hours)
- Add goal configuration settings (3 hours)
- Add completion messaging (3 hours)

### Phase 5: Testing (8 hours)

- Verify accessibility (2 hours)
- Verify error handling (1 hour)
- Verify loading states (0.5 hours)
- Write unit tests (4 hours)
- Write integration tests (4 hours)

### Phase 6: Documentation & Deployment (4 hours)

- Update user documentation (2 hours)
- Update developer documentation (2 hours)
- Performance testing (2 hours)
- Browser testing (2 hours)

**Total: ~44 hours**

## Benefits

### 1. Time Savings

- **55% faster** implementation (44 hours vs 98 hours)
- **1 week** for 1 developer vs 2.5 weeks

### 2. Lower Risk

- Existing components already tested
- Existing components already accessible
- Existing components already performant
- No migration needed (backward compatible)

### 3. Consistent UX

- Users familiar with existing patterns
- Same question styles throughout
- Same navigation patterns
- Same progress indicators

### 4. Easier Maintenance

- Single source of truth for questions
- Changes to assessment automatically apply
- Less code to maintain
- Fewer bugs to fix

### 5. Data Continuity

- No new database tables
- No data migration
- Backward compatible
- Existing data preserved

## Comparison: Original vs Reuse Strategy

| Aspect             | Original Plan | Reuse Strategy |
| ------------------ | ------------- | -------------- |
| **Time**           | ~98 hours     | ~44 hours      |
| **New Components** | 25+           | 3              |
| **New Tables**     | 3             | 0              |
| **Migration**      | Required      | Not needed     |
| **Risk**           | Higher        | Lower          |
| **Testing**        | Extensive     | Minimal        |
| **Maintenance**    | More code     | Less code      |

## What Stays the Same

✅ All functional requirements met
✅ All user stories addressed
✅ All acceptance criteria satisfied
✅ Same user experience goals
✅ Same accessibility standards
✅ Same performance targets

## What Changes

🔧 Implementation approach (reuse vs build)
🔧 Time estimate (44 hours vs 98 hours)
🔧 Component count (3 new vs 25+ new)
🔧 Data model (minimal vs extensive)
🔧 Testing scope (new components only vs everything)

## Recommendation

**Proceed with Reuse Strategy** for the following reasons:

1. **Faster delivery** - 1 week vs 2.5 weeks
2. **Lower risk** - 90% of code already tested
3. **Better UX** - Consistent with existing patterns
4. **Easier maintenance** - Less code to maintain
5. **Same outcome** - All requirements met

## Next Steps

1. Review and approve this spec
2. Begin Phase 1: Foundation (5 hours)
3. Proceed through phases sequentially
4. Deploy in ~1 week

## Questions?

See:

- `requirements.md` - Detailed requirements
- `design.md` - Technical design
- `tasks.md` - Implementation tasks
- `reuse-analysis.md` - Component reuse analysis

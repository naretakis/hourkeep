# Design Document

## Overview

This design addresses the alignment of two assessment flows in HourKeep: the onboarding flow and the "How to HourKeep" (reassessment) flow. The onboarding flow has evolved to include better UX patterns, modern component styling, and additional questions (notice details), while the How to HourKeep flow has fallen behind. This design brings both flows into alignment while maintaining their distinct purposes:

- **Onboarding flow**: First-time user experience including privacy notice and profile creation
- **How to HourKeep flow**: Reassessment experience for existing users with pre-populated answers

The alignment will ensure consistent user experience, shared component patterns, and maintainable code.

## Architecture

### Component Structure

Both flows will share the same assessment question components:

- `NoticeQuestion` - Asks if user received agency notice
- `NoticeDetailsQuestion` - Collects months required and deadline (NEW for How to HourKeep)
- `NoticeFollowUp` - Follow-up for users without notice
- `NoticeFollowUpWithNotice` - Follow-up for users with notice (NEW for How to HourKeep)
- `ExemptionQuestion` - 12 exemption screening questions
- `SingleChoiceQuestion` - Work status questions
- `NumberInputQuestion` - Income and hours questions
- `MultipleChoiceQuestion` - Activity selection
- `GettingStartedContextual` - Final screen with recommendation (NEW for How to HourKeep)

### Flow Differences

While both flows share the same assessment questions, they differ in:

**Onboarding Flow:**

- Starts with privacy notice
- Includes profile creation step
- Allows "skip to tracking" option from profile
- Saves profile and assessment together at the end

**How to HourKeep Flow:**

- Starts with introduction screen
- Skips privacy and profile (already completed)
- Pre-populates answers from previous assessment
- Allows "skip" option from intro to return to dashboard

### State Management

Both flows maintain similar state structure:

```typescript
{
  currentStep: AssessmentStep,
  stepHistory: AssessmentStep[],
  responses: AssessmentResponses,
  exemptionQuestionIndex: number,
  // UI state
  jobStatus: "yes" | "no" | "sometimes",
  seasonalStatus: "yes" | "no" | "not-sure",
  sixMonthTotal: number,
  // Notice context (NEW for How to HourKeep)
  hasNotice: boolean,
  monthsRequired: number,
  deadline: string
}
```

## Components and Interfaces

### Updated How to HourKeep Page

The How to HourKeep page will be refactored to:

1. Add notice details step after "yes" to notice question
2. Use NoticeFollowUpWithNotice when user has notice
3. Replace QuestionWrapper with Box wrappers (py: 2)
4. Add Getting Started screen before results
5. Store notice context in assessment responses

### Notice Details Question Component

Location: `src/components/onboarding/NoticeDetailsQuestion.tsx`

This component already exists in onboarding and will be reused in How to HourKeep:

```typescript
interface NoticeDetailsQuestionProps {
  monthsRequired?: number;
  deadline?: string;
  onMonthsChange: (months: number) => void;
  onDeadlineChange: (deadline: string) => void;
  onBack?: () => void;
  onContinue: () => void;
}
```

### Getting Started Contextual Component

Location: `src/components/onboarding/GettingStartedContextual.tsx`

This component already exists and will be reused in How to HourKeep:

```typescript
interface GettingStartedContextualProps {
  hasNotice: boolean;
  monthsRequired?: number;
  deadline?: Date;
  recommendation?: Recommendation;
  onStartTracking: () => void;
}
```

### Assessment Step Type

Both flows will use the same step enumeration:

```typescript
type AssessmentStep =
  | "intro" // How to HourKeep only
  | "privacy" // Onboarding only
  | "profile" // Onboarding only
  | "notice"
  | "noticeDetails" // NEW for How to HourKeep
  | "noticeFollowUp"
  | "noticeFollowUpWithNotice" // NEW for How to HourKeep
  | "exemption"
  | "work-job"
  | "work-seasonal"
  | "work-frequency"
  | "work-income"
  | "work-income-seasonal"
  | "work-hours"
  | "activities"
  | "activities-volunteer"
  | "activities-school"
  | "activities-workprogram"
  | "gettingStarted" // NEW for How to HourKeep
  | "results"; // How to HourKeep only (optional)
```

## Data Models

### Assessment Responses

The AssessmentResponses type will be extended to include notice context:

```typescript
interface AssessmentResponses {
  // Existing fields
  receivedAgencyNotice?: boolean;
  exemption: ExemptionResponses;
  hasJob?: boolean;
  isSeasonalWork?: boolean;
  paymentFrequency?: PayFrequency;
  monthlyIncome?: number;
  monthlyWorkHours?: number;
  otherActivities?: {
    volunteer?: boolean;
    school?: boolean;
    workProgram?: boolean;
  };
  volunteerHoursPerMonth?: number;
  schoolHoursPerMonth?: number;
  workProgramHoursPerMonth?: number;

  // NEW: Notice context
  noticeContext?: {
    monthsRequired?: number;
    deadline?: Date;
  };
}
```

### Onboarding Context

The UserProfile's onboardingContext will store notice details:

```typescript
interface OnboardingContext {
  hasNotice: boolean;
  monthsRequired?: number;
  deadline?: Date;
  completedAt: Date;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Notice details trigger correct follow-up component

_For any_ assessment flow, when a user answers "yes" to receiving a notice and completes notice details, the system should display NoticeFollowUpWithNotice (not the generic NoticeFollowUp)
**Validates: Requirements 2.4**

### Property 2: Notice details are persisted

_For any_ user who provides notice details (months required and deadline), those values should be stored in the assessment responses and retrievable after save
**Validates: Requirements 2.3**

### Property 3: Getting Started screen displays recommendation

_For any_ completed assessment, the Getting Started screen should display the calculated recommendation's primary method
**Validates: Requirements 3.2**

### Property 4: Getting Started screen shows contextual guidance

_For any_ completed assessment, the Getting Started screen should display different guidance text based on whether hasNotice is true or false
**Validates: Requirements 3.3**

### Property 5: Question text consistency across flows

_For any_ question that appears in both flows (identified by step name), the question text and helper text should be identical
**Validates: Requirements 4.1**

### Property 6: Exemption early-exit consistency

_For any_ set of exemption responses that result in isExempt=true, both flows should exit the exemption questions and proceed to completion
**Validates: Requirements 4.2**

### Property 7: Seasonal work navigation consistency

_For any_ combination of hasJob and isSeasonalWork values, both flows should navigate to the same next step
**Validates: Requirements 4.3**

### Property 8: Activity navigation consistency

_For any_ set of selected activities (volunteer, school, workProgram), both flows should navigate through activity detail questions in the same order
**Validates: Requirements 4.4**

### Property 9: Recommendation calculation consistency

_For any_ identical set of assessment responses, both flows should produce the same recommendation (same primaryMethod, same alternativeMethods, same reasoning)
**Validates: Requirements 4.5**

### Property 10: Pre-population includes all response types

_For any_ user with a previous assessment, starting How to HourKeep should pre-populate exemption responses, work responses, and activity responses
**Validates: Requirements 5.1, 5.3, 5.4, 5.5**

### Property 11: Auto-save after each question

_For any_ question answered in either flow, the responses should be persisted to storage before advancing to the next step
**Validates: Requirements 6.1**

### Property 12: Resume from saved progress

_For any_ incomplete assessment with saved progress, reopening the flow should resume at the saved step with all previous responses intact
**Validates: Requirements 6.2**

### Property 13: Progress cleanup on completion

_For any_ completed assessment, the in-progress data should be deleted from storage
**Validates: Requirements 6.3**

### Property 14: Progress data completeness

_For any_ saved progress, the data should include currentStep, stepNumber, and all responses (exemption, work, activities)
**Validates: Requirements 6.4, 6.5**

### Property 15: Progress percentage format

_For any_ step in either flow, the calculated progress should be a number between 0 and 100 (inclusive)
**Validates: Requirements 7.2**

### Property 16: Exemption section progress calculation

_For any_ exemption question index (0-11), the progress should be between 25% and 60%, calculated as 25 + (index / 12) \* 35
**Validates: Requirements 7.4**

### Property 17: Work section progress range

_For any_ work or activity step, the progress should be between 60% and 95%
**Validates: Requirements 7.5**

### Property 18: Dashboard configuration matches recommendation

_For any_ completed onboarding with a recommendation, the dashboard compliance mode should match the recommendation's primary method (income for income-tracking/seasonal-income-tracking, hours for hour-tracking)
**Validates: Requirements 8.4**

### Property 19: Assessment result saved on completion

_For any_ completed How to HourKeep assessment, an assessment result record should exist in storage with the responses and recommendation
**Validates: Requirements 9.1**

### Property 20: Results page shows all methods

_For any_ results page display, all four compliance methods (exemption, income-tracking, seasonal-income-tracking, hour-tracking) should be shown with explanations
**Validates: Requirements 9.3**

### Property 21: Results page explains method availability

_For any_ compliance method on the results page, there should be explanatory text indicating whether it's recommended, available as alternative, or not currently available
**Validates: Requirements 9.4**

## Error Handling

### Missing Profile Data

- **Scenario**: User accesses How to HourKeep without a profile
- **Handling**: Redirect to onboarding flow
- **User Impact**: Seamless redirect, no error message needed

### Failed Auto-Save

- **Scenario**: Storage operation fails during auto-save
- **Handling**: Log error to console, allow user to continue (data will be saved on next successful save)
- **User Impact**: Minimal - progress may be lost if user closes browser, but assessment can be restarted

### Missing Previous Assessment

- **Scenario**: User starts How to HourKeep with no previous assessment to pre-populate
- **Handling**: Start with empty responses (except DOB from profile)
- **User Impact**: User fills out assessment from scratch

### Invalid Notice Details

- **Scenario**: User enters invalid months (< 1 or > 12) or past deadline date
- **Handling**: Form validation prevents submission, show inline error messages
- **User Impact**: Clear feedback on what needs to be corrected

## Testing Strategy

### Unit Testing

Unit tests will focus on:

1. **Component rendering**: Verify correct components render for each step
2. **Navigation logic**: Test step transitions based on user answers
3. **Data persistence**: Verify responses are saved correctly
4. **Pre-population**: Test that previous answers load correctly
5. **Progress calculation**: Verify progress percentages for each step

Example unit tests:

- Notice "yes" answer leads to notice details step
- Notice "no" answer leads to notice follow-up step
- Completing notice details shows NoticeFollowUpWithNotice
- Exemption early-exit skips remaining exemption questions
- Seasonal work leads to 6-month income question
- Non-seasonal work leads to payment frequency question

### Property-Based Testing

Property-based tests will verify universal behaviors across many inputs using fast-check library:

1. **Question text consistency** (Property 5): Generate random step names, verify text matches between flows
2. **Exemption early-exit** (Property 6): Generate random exemption responses that qualify for exemption, verify both flows exit early
3. **Navigation consistency** (Properties 7-8): Generate random work/activity combinations, verify same navigation path
4. **Recommendation consistency** (Property 9): Generate random assessment responses, verify same recommendation from both flows
5. **Pre-population completeness** (Property 10): Generate random previous assessments, verify all data pre-populates
6. **Auto-save** (Property 11): Generate random question answers, verify save occurs
7. **Progress calculation** (Properties 15-17): Generate random steps, verify progress in correct range
8. **Data persistence** (Properties 2, 11, 14, 19): Generate random responses, verify round-trip through storage

### Integration Testing

Integration tests will verify end-to-end flows:

1. Complete onboarding flow from privacy to dashboard
2. Complete How to HourKeep flow from intro to dashboard
3. Resume incomplete assessment from saved progress
4. Pre-populate from previous assessment and modify answers
5. Navigate to results page and back to dashboard

### Manual Testing

Manual testing will verify:

1. Visual consistency between flows (styling, spacing, colors)
2. Responsive design on mobile and desktop
3. Accessibility (keyboard navigation, screen readers)
4. User experience flow feels natural and intuitive
5. Getting Started screen provides clear guidance

## Implementation Notes

### Refactoring Strategy

1. **Phase 1**: Add missing steps to How to HourKeep
   - Add noticeDetails step
   - Add noticeFollowUpWithNotice step
   - Add gettingStarted step

2. **Phase 2**: Update component patterns
   - Replace QuestionWrapper with Box wrappers
   - Ensure consistent padding (py: 2)
   - Update NoticeQuestion usage

3. **Phase 3**: Add notice context storage
   - Extend AssessmentResponses type
   - Update save logic to include notice context
   - Update pre-population to include notice context

4. **Phase 4**: Update navigation logic
   - Ensure notice "yes" leads to notice details
   - Ensure notice details leads to NoticeFollowUpWithNotice
   - Update Getting Started to navigate to dashboard (not results)

5. **Phase 5**: Testing and validation
   - Write unit tests for new steps
   - Write property tests for consistency
   - Manual testing of both flows

### Code Reuse

The following components will be shared between flows:

- All question components (NoticeQuestion, ExemptionQuestion, etc.)
- NoticeDetailsQuestion (move from onboarding-specific to shared)
- GettingStartedContextual (move from onboarding-specific to shared)
- Progress calculation logic (extract to shared utility)
- Auto-save logic (already shared via storage functions)

### Breaking Changes

None - this is purely additive and refactoring. Existing user data remains compatible.

### Performance Considerations

- Auto-save operations are already debounced in storage layer
- Pre-population loads from IndexedDB (fast, local)
- No additional network requests
- Component rendering is already optimized with React

### Accessibility

- All existing accessibility features maintained
- Keyboard navigation works throughout both flows
- Screen reader announcements for step changes
- Focus management on step transitions
- ARIA labels on all form controls

### Mobile Considerations

- Responsive design already implemented
- Touch-friendly button sizes (minHeight: 48px)
- Proper viewport scaling
- No horizontal scrolling
- Readable text sizes on small screens

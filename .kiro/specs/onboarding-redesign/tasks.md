# Implementation Plan: Enhanced Onboarding Flow

## Overview

This implementation plan leverages existing, tested components from "How to HourKeep" assessment and current onboarding flow. Only 3 new components are needed, achieving 90% component reuse.

**Key Strategy:** Maximum component reuse to reduce implementation time and risk.

---

## Tasks

- [x] 1. Extend existing data models
  - Add optional `onboardingContext` field to UserProfile interface in `src/types/index.ts`
  - Update TypeScript types to support onboarding context
  - Ensure backward compatibility with existing profiles
  - _Requirements: FR1.5, FR5.1_

- [x] 2. Enhance IntroductionScreen component
  - Update copy in `src/components/assessment/IntroductionScreen.tsx` to be more context-focused
  - Change from "Let's figure out the best way to track" to "Why are you here today?"
  - Keep existing skip functionality and styling
  - Test that it still works in How to HourKeep flow
  - _Requirements: FR2.1, FR2.3_

- [x] 3. Create NoticeDetailsQuestion component
  - Create new component at `src/components/onboarding/NoticeDetailsQuestion.tsx`
  - Add radio options for months (1, 2, 3, 6, "I'm not sure")
  - Add optional deadline date picker using TextField with type="date"
  - Add help text for unsure users
  - Use existing QuestionWrapper for back/continue navigation
  - Style to match existing question components
  - _Requirements: FR3.1, FR3.2, FR3.3, FR3.4_

- [x] 4. Streamline ProfileForm component
  - Modify `src/components/onboarding/ProfileForm.tsx` to make Medicaid ID, phone, email optional
  - Add optional deadline field (only shown if user has notice)
  - Keep existing validation logic and state dropdown
  - Keep existing date of birth field with encryption
  - Update form to accept `showDeadlineField` prop
  - Ensure backward compatibility with existing usage
  - _Requirements: FR5.1, FR5.2, FR5.3, FR5.4, FR5.5, FR5.6_

- [x] 5. Create GettingStartedContextual component
  - Create new component at `src/components/onboarding/GettingStartedContextual.tsx`
  - Build notice version with 3-step action plan
  - Build proactive version with continuous tracking benefits
  - Show deadline and countdown for notice users
  - Add helptext tooltips for brief explanations (reuse existing Tooltip component)
  - Add collapsible content for longer explanations (reuse Accordion component)
  - Add "Start Tracking" and "Skip Tutorial" buttons
  - Add link to detailed help
  - Style with Material-UI to match existing components
  - _Requirements: FR6.1, FR6.2, FR6.3, FR6.4, FR6.5, FR6.6, FR6.7, FR6.8_

- [x] 6. Implement onboarding router
  - Create/enhance `src/app/onboarding/page.tsx` with step state management
  - Implement routing logic for each user path (notice, applying, renewal, proactive)
  - Integrate PrivacyNotice → IntroductionScreen → NoticeQuestion flow
  - Integrate NoticeDetailsQuestion when user has notice
  - Integrate NoticeFollowUp → ExemptionQuestion flow (existing components)
  - Integrate ProfileForm (streamlined)
  - Integrate GettingStartedContextual
  - Handle skip functionality
  - Add loading states
  - Reuse existing assessment progress saving from `src/lib/storage/assessment.ts`
  - _Requirements: FR2.1, FR2.2, FR2.3, FR2.4, FR4.1, FR4.2, FR4.3, FR4.4, FR8.1, FR8.2, FR8.3, FR8.4, FR8.5_

- [x] 7. Add route guards
  - Modify `src/app/tracking/page.tsx` to check if profile exists on page load
  - Redirect to onboarding if no profile
  - Allow access if profile exists
  - Handle edge cases (corrupted data, etc.)
  - _Requirements: FR9.1, FR9.2_

- [x] 8. Update dashboard to show goal progress
  - Create `src/components/tracking/GoalProgress.tsx` component
  - Read onboardingContext from user profile
  - Display required months and deadline if present
  - Show progress for each month (✓ or incomplete)
  - Add "Add Another Month" button
  - Show deadline countdown
  - Handle both goal-based and continuous modes
  - Modify `src/app/tracking/page.tsx` to integrate GoalProgress component
  - _Requirements: FR7.1, FR7.2, FR7.3, FR7.4, FR7.5_

- [x] 9. Add goal configuration settings
  - Add goal configuration section to `src/app/settings/page.tsx`
  - Allow editing months required
  - Allow editing deadline
  - Allow switching between goal-based and continuous tracking
  - Save changes to profile.onboardingContext in IndexedDB
  - Ensure dashboard updates immediately after changes
  - _Requirements: FR7.4, FR9.3, FR9.4_

- [x] 10. Add completion messaging
  - Create `src/components/tracking/CompletionMessage.tsx` component
  - Detect when goal is complete (all required months have 80+ hours or $580+ income)
  - Show completion message with next steps
  - Prompt to export report
  - Remind about future renewals (6 months)
  - Offer to continue tracking
  - Add "Set Renewal Reminder" option (placeholder for now)
  - Integrate into `src/app/tracking/page.tsx`
  - _Requirements: FR7.1, FR7.2_

- [ ] 11. Verify accessibility in new components
  - Test NoticeDetailsQuestion and GettingStartedContextual with screen reader
  - Ensure keyboard navigation works in router
  - Verify color contrast passes WCAG AA in new components
  - Verify existing components maintain accessibility
  - _Requirements: NFR2_

- [ ] 12. Verify error handling
  - Verify existing error handling in assessment progress saving
  - Verify existing error handling in profile saving
  - Add error handling to router if needed
  - Test error scenarios (database errors, corrupted data)
  - _Requirements: NFR4_

- [ ]\* 13. Write unit tests for new components
  - Create `src/components/onboarding/__tests__/NoticeDetailsQuestion.test.tsx`
  - Create `src/components/onboarding/__tests__/GettingStartedContextual.test.tsx`
  - Create `src/app/onboarding/__tests__/router.test.tsx`
  - Test NoticeDetailsQuestion component
  - Test GettingStartedContextual component
  - Test onboarding router logic
  - Verify existing tests still pass

- [ ]\* 14. Write integration tests
  - Create `src/app/onboarding/__tests__/onboarding-flow.test.tsx`
  - Test notice user flow (Privacy → Welcome → Notice → Details → Exemption → Profile → Getting Started → Tracking)
  - Test proactive user flow (Privacy → Welcome → Profile → Getting Started → Tracking)
  - Test skip functionality
  - Test back navigation
  - Test progress persistence

- [ ] 15. Update user documentation
  - Update help content with new flow
  - Add screenshots of new screens (NoticeDetails, GettingStarted)
  - Document skip functionality
  - Explain goal-based vs continuous tracking
  - Update FAQ if needed

- [ ] 16. Update developer documentation
  - Create `docs/onboarding-architecture.md`
  - Document component reuse strategy
  - Document router logic
  - Document data flow (profile + assessment)
  - Add code examples for new components
  - Document integration points

- [ ] 17. Performance testing
  - Test load times for new screens (should be <1 second)
  - Test router performance
  - Test on slow devices/connections
  - Verify no performance regressions from existing components
  - _Requirements: NFR1_

- [ ] 18. Browser testing
  - Test on Chrome (desktop & mobile)
  - Test on Safari (desktop & mobile)
  - Test on Firefox
  - Test on Edge
  - Fix browser-specific issues in new components
  - _Requirements: NFR3_

- [ ] 19. Deploy to production
  - Run final tests
  - Create deployment checklist
  - Deploy to production
  - Monitor for errors
  - Gather user feedback

---

## Summary

**Total Estimated Time:** ~44 hours

**Component Reuse:** 90% of components reused from existing code

**New Components:** Only 3 new components needed

1. NoticeDetailsQuestion
2. GettingStartedContextual
3. Onboarding Router

**Dependencies:**

- Tasks 2-5 can be done in parallel after Task 1
- Task 6 depends on Tasks 2-5
- Task 7 depends on Task 6
- Tasks 8-10 depend on Task 6
- Tasks 11-19 can be done in parallel after Tasks 1-10

---

## Archived Tasks (Not Needed)

The following tasks were originally planned but are not needed due to existing component reuse:

### Task 1.3: Create Shared Onboarding Components (SKIPPED)

**Status:** All components already exist and can be reused

- ✅ `ProgressIndicator` - Already exists
- ✅ `QuestionWrapper` - Already has back/continue navigation
- ✅ `SingleChoiceQuestion` - Already exists
- ✅ `MultipleChoiceQuestion` - Already exists
- ✅ `NumberInputQuestion` - Already exists
- ✅ `PrivacyNotice` - Already exists
- ✅ `ProfileForm` - Already exists (will be streamlined in Task 4)

### Task 2.3: Build Exemption Check Screen (SKIPPED)

**Status:** Already exists in How to HourKeep

- ✅ `NoticeFollowUp` component - Already asks "Check exemption or skip?"
- ✅ `ExemptionQuestion` component - Already has all 12 questions
- ✅ Exemption calculation logic - Already exists
- ✅ Progress indicator - Already integrated
- Router will use existing components, no new code needed

### Task 3.2: Implement Progress Persistence (SKIPPED)

**Status:** Already exists

- ✅ `saveAssessmentProgress()` - Already saves progress
- ✅ `getAssessmentProgress()` - Already loads progress
- ✅ `completeAssessmentProgress()` - Already clears progress
- ✅ Error handling - Already implemented
- Router will use existing assessment progress functions

### Task 5.3: Add Loading States (SKIPPED)

**Status:** Already complete

- ✅ Existing components already have CircularProgress and loading states
- ✅ ProfileForm loading state works
- Only verification needed (covered in Task 12)

### Task 5.6: Migrate Existing Users (SKIPPED)

**Status:** Not needed

- No existing users in production yet
- The optional `onboardingContext` field is backward compatible with existing profiles
- No migration code required

# Implementation Plan

- [x] 1. Add notice details step to How to HourKeep flow
  - Add noticeDetails step to AssessmentStep type
  - Add state for monthsRequired and deadline
  - Update handleNoticeAnswer to navigate to noticeDetails when user answers "yes"
  - Add noticeDetails step rendering with NoticeDetailsQuestion component
  - Add handleNoticeDetailsComplete to navigate to noticeFollowUpWithNotice
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Add NoticeFollowUpWithNotice component to How to HourKeep
  - Add noticeFollowUpWithNotice step to flow
  - Update navigation from noticeDetails to use noticeFollowUpWithNotice
  - Render NoticeFollowUpWithNotice component for this step
  - Ensure NoticeFollowUp is used when user answers "no" to notice
  - _Requirements: 2.4, 2.5_

- [x] 3. Replace QuestionWrapper with Box wrappers in How to HourKeep
  - Remove QuestionWrapper imports
  - Wrap NoticeQuestion in Box with py: 2
  - Wrap NoticeFollowUp/NoticeFollowUpWithNotice in Box with py: 2
  - Ensure ExemptionQuestion already uses Box wrapper (verify)
  - Ensure all work questions use Box with py: 2
  - Ensure all activity questions use Box with py: 2
  - _Requirements: 1.2, 1.5_

- [x] 4. Add Getting Started screen to How to HourKeep flow
  - Add gettingStarted step to AssessmentStep type
  - Update completeAssessment to navigate to gettingStarted instead of results
  - Add gettingStarted step rendering with GettingStartedContextual component
  - Pass hasNotice, monthsRequired, deadline, and recommendation to component
  - Add handleStartTracking to navigate to /tracking dashboard
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Extend data models to store notice context
  - Add noticeContext field to AssessmentResponses type
  - Update saveAssessmentResult to include notice context
  - Update getLatestAssessmentResult to return notice context
  - Update pre-population logic to include notice context
  - _Requirements: 2.3, 5.1_

- [x] 6. Update progress calculation for new steps
  - Add noticeDetails to progress calculation (20%)
  - Add noticeFollowUpWithNotice to progress calculation (25%)
  - Add gettingStarted to progress calculation (95%)
  - Verify progress ranges match design (notice: 15-25%, exemption: 25-60%, work: 60-95%)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 7. Verify question text consistency between flows
  - Compare notice question text between onboarding and How to HourKeep
  - Compare exemption question text (should already be identical via shared component)
  - Compare work question text (job, seasonal, frequency, income, hours)
  - Compare activity question text (volunteer, school, workProgram)
  - Update any inconsistencies to match onboarding flow
  - _Requirements: 4.1_

- [x] 8. Verify navigation logic consistency
  - Test exemption early-exit in both flows
  - Test seasonal vs non-seasonal navigation in both flows
  - Test activity navigation order in both flows
  - Ensure both flows use same recommendation engine
  - _Requirements: 4.2, 4.3, 4.4, 4.5_

- [x] 9. Verify pre-population includes all data types
  - Test that exemption responses pre-populate
  - Test that work responses pre-populate (hasJob, isSeasonalWork, income, hours)
  - Test that activity responses pre-populate (selections and hours)
  - Test that date of birth pre-populates from profile
  - Test that notice context pre-populates if available
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 10. Verify auto-save and resume functionality
  - Test that responses save after each question
  - Test that progress includes step number and all responses
  - Test that resuming loads correct step and responses
  - Test that completing assessment clears progress data
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 11. Verify onboarding flow Getting Started screen works correctly
  - Verify Getting Started screen already shows in onboarding (it does at step "gettingStarted")
  - Verify notice context is passed correctly to GettingStartedContextual component
  - Verify recommendation is displayed correctly
  - Verify dashboard configuration matches recommendation after completion
  - Verify navigation goes to tracking dashboard (not results page)
  - Note: GettingStartedContextual already exists and is used in onboarding - just verify it works
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 12. Verify results page functionality
  - Test that assessment result saves on How to HourKeep completion
  - Verify results page shows all four compliance methods
  - Verify each method has explanation of availability
  - Verify navigation back to dashboard works
  - _Requirements: 9.1, 9.3, 9.4, 9.5_

- [x] 13. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Manual testing and polish
  - Test complete onboarding flow on mobile and desktop
  - Test complete How to HourKeep flow on mobile and desktop
  - Test resume from incomplete assessment
  - Test pre-population from previous assessment
  - Verify visual consistency between flows
  - Test keyboard navigation and accessibility
  - Verify responsive design works correctly
  - _Requirements: All_

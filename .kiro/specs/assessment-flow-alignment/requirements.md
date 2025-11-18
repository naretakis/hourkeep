# Requirements Document

## Introduction

This specification addresses the alignment of two assessment flows in HourKeep: the onboarding flow (for new users) and the "How to HourKeep" flow (for users retaking the assessment). Currently, these flows ask similar questions but use different patterns, components, and styling. The onboarding flow represents the latest and greatest implementation with improved UX patterns, while the "How to HourKeep" flow uses older patterns that need to be updated.

## Glossary

- **Assessment Flow**: The series of questions that determine a user's compliance method (exemption, income tracking, or hour tracking)
- **Onboarding Flow**: The initial user experience when first setting up HourKeep, including privacy notice, profile creation, and assessment
- **How to HourKeep Flow**: The reassessment experience accessed via the "Retake Assessment" button on the dashboard
- **Notice Question**: Question asking if the user received a Medicaid agency notice about work requirements
- **Notice Details**: Follow-up questions about months required and deadline (when user has received a notice)
- **Exemption Questions**: Series of 12 questions checking if user qualifies for work requirement exemptions
- **Work Questions**: Questions about employment status, income, and hours
- **Activity Questions**: Questions about volunteer work, school, and work programs
- **Getting Started Screen**: Contextual final screen showing user's recommended path and next steps

## Requirements

### Requirement 1

**User Story:** As a user retaking the assessment, I want the same modern question patterns and styling as the onboarding flow, so that I have a consistent and polished experience.

#### Acceptance Criteria

1. WHEN a user navigates through the How to HourKeep flow THEN the system SHALL use the same component patterns as the onboarding flow
2. WHEN displaying questions in the How to HourKeep flow THEN the system SHALL wrap questions in Box components with consistent padding (py: 2) instead of QuestionWrapper
3. WHEN showing the notice question in How to HourKeep THEN the system SHALL use the standalone NoticeQuestion component without QuestionWrapper
4. WHEN showing notice follow-up in How to HourKeep THEN the system SHALL use NoticeFollowUp or NoticeFollowUpWithNotice components without QuestionWrapper
5. WHEN displaying work and activity questions THEN the system SHALL use consistent Box wrapper styling across both flows

### Requirement 2

**User Story:** As a user who received a Medicaid notice, I want to provide notice details in both flows, so that the system can track my compliance deadlines accurately.

#### Acceptance Criteria

1. WHEN a user answers "yes" to receiving a notice in How to HourKeep THEN the system SHALL display the notice details question
2. WHEN the notice details question is displayed THEN the system SHALL ask for months required and deadline
3. WHEN a user completes notice details THEN the system SHALL store monthsRequired and deadline in the assessment responses
4. WHEN a user has provided notice details THEN the system SHALL show the NoticeFollowUpWithNotice component (not the generic NoticeFollowUp)
5. WHEN a user answers "no" to receiving a notice THEN the system SHALL show the NoticeFollowUp component and skip notice details

### Requirement 3

**User Story:** As a user completing the How to HourKeep assessment, I want to see a contextual "Getting Started" screen with my results, so that I understand my recommended path before returning to the dashboard.

#### Acceptance Criteria

1. WHEN a user completes the How to HourKeep assessment THEN the system SHALL display a Getting Started screen instead of immediately redirecting to results page
2. WHEN the Getting Started screen is displayed THEN the system SHALL show the user's recommended compliance method
3. WHEN the Getting Started screen is displayed THEN the system SHALL show contextual guidance based on whether the user has a notice
4. WHEN the Getting Started screen is displayed THEN the system SHALL include a button to proceed to the dashboard
5. WHEN a user clicks the proceed button THEN the system SHALL navigate to the tracking dashboard (not the results page)

### Requirement 4

**User Story:** As a developer maintaining the codebase, I want both assessment flows to share the same question flow logic, so that changes to the assessment are consistent across both experiences.

#### Acceptance Criteria

1. WHEN both flows ask the same question THEN the system SHALL use identical question text and helper text
2. WHEN both flows handle exemption questions THEN the system SHALL use the same early-exit logic when exemption is detected
3. WHEN both flows handle work questions THEN the system SHALL use the same conditional logic for seasonal vs non-seasonal paths
4. WHEN both flows handle activity questions THEN the system SHALL use the same navigation logic between volunteer, school, and work program questions
5. WHEN both flows calculate recommendations THEN the system SHALL use the same recommendation engine and save logic

### Requirement 5

**User Story:** As a user, I want the How to HourKeep flow to remember my previous answers, so that I can quickly update only what has changed.

#### Acceptance Criteria

1. WHEN a user starts the How to HourKeep flow THEN the system SHALL pre-populate responses from the latest completed assessment
2. WHEN pre-populating responses THEN the system SHALL include date of birth from the user profile
3. WHEN pre-populating responses THEN the system SHALL include all exemption answers
4. WHEN pre-populating responses THEN the system SHALL include work status, income, and hours
5. WHEN pre-populating responses THEN the system SHALL include activity selections and hours

### Requirement 6

**User Story:** As a user, I want both flows to save my progress automatically, so that I can resume if I need to stop partway through.

#### Acceptance Criteria

1. WHEN a user progresses through either flow THEN the system SHALL auto-save responses after each question
2. WHEN a user returns to an incomplete assessment THEN the system SHALL resume from the last saved step
3. WHEN a user completes an assessment THEN the system SHALL clear the in-progress data
4. WHEN saving progress THEN the system SHALL include the current step number for progress calculation
5. WHEN saving progress THEN the system SHALL store all responses including exemption, work, and activity data

### Requirement 7

**User Story:** As a user, I want consistent progress indication in both flows, so that I know how far along I am in the assessment.

#### Acceptance Criteria

1. WHEN a user is in either assessment flow THEN the system SHALL display a progress indicator
2. WHEN calculating progress THEN the system SHALL use percentage-based progress (0-100%)
3. WHEN in the notice section THEN the system SHALL show 15-25% progress
4. WHEN in the exemption section THEN the system SHALL show 25-60% progress based on question index
5. WHEN in the work/activities section THEN the system SHALL show 60-95% progress

### Requirement 8

**User Story:** As a user completing the onboarding flow, I want to see the same Getting Started screen as the How to HourKeep flow, so that I have a consistent experience regardless of entry point.

#### Acceptance Criteria

1. WHEN a user completes onboarding assessment THEN the system SHALL display the Getting Started screen
2. WHEN the Getting Started screen is displayed in onboarding THEN the system SHALL show notice context if provided
3. WHEN the Getting Started screen is displayed in onboarding THEN the system SHALL show the recommended compliance method
4. WHEN the Getting Started screen is displayed in onboarding THEN the system SHALL configure the dashboard based on the recommendation
5. WHEN a user proceeds from Getting Started THEN the system SHALL navigate to the tracking dashboard

### Requirement 9

**User Story:** As a user, I want the results page to remain accessible after completing How to HourKeep, so that I can review all compliance methods in detail.

#### Acceptance Criteria

1. WHEN a user completes the Getting Started screen in How to HourKeep THEN the system SHALL save the assessment result
2. WHEN a user wants to review detailed results THEN the system SHALL provide a way to access the results page
3. WHEN the results page is displayed THEN the system SHALL show all compliance methods with explanations
4. WHEN the results page is displayed THEN the system SHALL explain why each method is or isn't recommended
5. WHEN a user is on the results page THEN the system SHALL provide navigation back to the dashboard

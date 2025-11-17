# Requirements: Enhanced Onboarding Flow

## Overview

Redesign HourKeep's onboarding experience to support both event-driven (reactive) and continuous (proactive) tracking use cases. The new flow will assess user context early, provide personalized guidance, and configure the app based on their specific needs.

## Problem Statement

### Current Issues

1. **Disconnected flows** - Onboarding and "How to HourKeep" assessment are separate, causing duplication
2. **Late context gathering** - Profile setup happens before understanding user's situation
3. **Generic onboarding** - Doesn't account for why users are here (notice, renewal, proactive)
4. **Not optimized for urgent cases** - Users with 30-day deadlines need faster path to action
5. **Assumes continuous tracking** - Design doesn't reflect that most users will engage reactively

### Existing Assets

HourKeep already has robust components that can be reused:

**From "How to HourKeep" Assessment (`/how-to-hourkeep`):**

- Complete exemption screening (12 questions)
- Notice detection and routing
- Progress indicators and navigation
- Question components (SingleChoice, MultipleChoice, NumberInput)
- Assessment data storage and progress saving

**From Onboarding (`/onboarding`):**

- Privacy notice with detailed explanations
- Profile form with validation
- State dropdown (all 50 states + DC)
- Encrypted storage for sensitive data

### User Scenarios

**Scenario 1: Notice of Non-Compliance (Urgent)**

- User received a letter saying they need to prove work within 30 days
- High stress, needs clear guidance immediately
- Needs to document specific months (1-6 months depending on state)

**Scenario 2: Initial Application**

- Applying for Medicaid for the first time
- Needs to prove 1-3 consecutive months of compliance (state-specific)
- May not understand work requirements yet

**Scenario 3: Upcoming Renewal**

- 6-month renewal approaching
- Needs to prove at least 1 month of compliance in past 6 months
- May have been tracking already or starting fresh

**Scenario 4: Proactive Tracking**

- Wants to stay ahead of requirements
- No immediate deadline
- Wants to track continuously

**Scenario 5: Exemption Check**

- Thinks they might be exempt
- Needs to verify exemption status before tracking
- May not need to track at all

## Goals

### Primary Goals

1. **Integrate existing flows** - Combine onboarding and assessment into cohesive experience
2. **Maximize component reuse** - Leverage existing, tested components (90% reuse target)
3. **Understand user context early** - Know why they're here before collecting profile data
4. **Personalize the experience** - Show relevant content based on their situation
5. **Reduce time to value** - Get users tracking faster
6. **Support state variability** - Handle different state requirements (1-6 month lookback periods)
7. **Maintain flexibility** - Allow skip options for power users

### Secondary Goals

1. **Minimize new code** - Reduce implementation time and risk by reusing existing components
2. **Educate appropriately** - Provide context-specific help, not generic tutorials
3. **Set expectations** - Help users understand what they need to do
4. **Encourage future use** - Remind about renewals without being pushy
5. **Build trust** - Use conversational tone, show progress, allow back navigation

## User Requirements

### Functional Requirements

#### FR1: Component Reuse

- **FR1.1** - System shall reuse existing "How to HourKeep" assessment components
- **FR1.2** - System shall reuse existing onboarding components (PrivacyNotice, ProfileForm)
- **FR1.3** - System shall reuse existing exemption screening (all 12 questions)
- **FR1.4** - System shall reuse existing question components (SingleChoice, MultipleChoice, etc.)
- **FR1.5** - System shall maintain compatibility with existing data storage

#### FR2: Context Assessment

- **FR2.1** - System shall use existing IntroductionScreen (enhanced with new copy)
- **FR2.2** - System shall use existing NoticeQuestion component
- **FR2.3** - System shall allow users to skip assessment and go directly to tracking
- **FR2.4** - System shall branch to appropriate follow-up questions based on user's answer

#### FR3: Notice-Driven Configuration

- **FR3.1** - If user has a notice, system shall ask what the notice says (new component)
- **FR3.2** - System shall capture number of months user needs to document
- **FR3.3** - System shall capture deadline date if user has one
- **FR3.4** - System shall default to 1 month if user is unsure
- **FR3.5** - System shall offer "6 months (safe option)" as alternative

#### FR4: Exemption Screening

- **FR4.1** - System shall use existing exemption screening flow (all 12 questions)
- **FR4.2** - System shall use existing ExemptionQuestion component
- **FR4.3** - Exemption check shall be optional - users can skip
- **FR4.4** - System shall recommend exemption check but not require it
- **FR4.5** - If user runs exemption check and is exempt, system shall explain they may not need to track
- **FR4.6** - System shall still allow exempt users to track if they choose

#### FR5: Streamlined Profile Setup

- **FR5.1** - System shall use existing ProfileForm component (streamlined)
- **FR5.2** - System shall collect: First name, Last name, State, Date of Birth
- **FR5.3** - System shall use existing state dropdown with all 50 states + DC
- **FR5.4** - System shall add optional deadline field (only if user has notice)
- **FR5.5** - System shall move Medicaid ID, phone, email to settings (not required for onboarding)
- **FR5.6** - System shall maintain existing validation and encryption

#### FR6: Contextual Getting Started

- **FR6.1** - System shall create new GettingStartedContextual component
- **FR6.2** - System shall show different "next steps" based on user context
- **FR6.3** - For users with notices: Show deadline, required months, action steps
- **FR6.4** - For proactive users: Show continuous tracking benefits, renewal timeline
- **FR6.5** - System shall allow users to skip getting started tutorial
- **FR6.6** - System shall use helptext tooltips for brief explanations
- **FR6.7** - System shall use collapsible content for longer explanations
- **FR6.8** - System shall provide link to detailed help for later reference

#### FR7: Configured Dashboard

- **FR7.1** - Dashboard shall display user's tracking goal if they have one
- **FR7.2** - Dashboard shall show deadline countdown if applicable
- **FR7.3** - Dashboard shall show progress toward goal (e.g., "January: 85 hours ✓")
- **FR7.4** - Dashboard shall allow users to modify their goal/configuration
- **FR7.5** - For continuous trackers, dashboard shall show current month progress

#### FR8: Progress & Navigation

- **FR8.1** - System shall use existing ProgressIndicator component
- **FR8.2** - System shall use existing QuestionWrapper for back/continue navigation
- **FR8.3** - System shall use existing assessment progress saving
- **FR8.4** - System shall allow users to resume onboarding if they exit
- **FR8.5** - System shall show estimated time to complete ("About 2 minutes")

#### FR9: Return User Experience

- **FR9.1** - System shall skip onboarding for return users
- **FR9.2** - System shall go directly to dashboard for return users
- **FR9.3** - System shall allow users to reconfigure their goal from settings
- **FR9.4** - System shall preserve user's original context/configuration
- **FR9.5** - System shall allow users to re-run "How to HourKeep" assessment anytime

### Non-Functional Requirements

#### NFR1: Performance

- Each screen shall load in under 1 second
- Auto-save shall happen within 500ms of user input
- Transitions between screens shall be smooth (no flicker)

#### NFR2: Accessibility

- All form fields shall have proper labels
- Progress indicator shall be screen-reader friendly
- Back/Continue buttons shall be keyboard accessible
- Color shall not be the only indicator of progress

#### NFR3: Mobile-First

- All screens shall be optimized for mobile (320px width minimum)
- Touch targets shall be at least 44x44px
- Forms shall use appropriate input types (date picker, number pad)
- Scrolling shall be smooth and natural

#### NFR4: Offline Support

- Onboarding progress shall be saved to IndexedDB
- Users shall be able to complete onboarding offline
- Data shall sync when connection is restored

#### NFR5: Privacy

- All data shall remain local (IndexedDB)
- No data shall be transmitted to external servers
- User shall be informed about local data storage

## User Stories

### Epic 1: Event-Driven Entry

**US1.1: User with Notice**

```
As a Medicaid beneficiary who received a notice of non-compliance
I want to quickly understand what I need to do
So that I can respond before my deadline and keep my coverage
```

**US1.2: User Applying for Medicaid**

```
As someone applying for Medicaid for the first time
I want to know what work documentation I need to provide
So that I can get approved without delays
```

**US1.3: User Preparing for Renewal**

```
As a Medicaid beneficiary with a renewal coming up
I want to prepare my work documentation in advance
So that my renewal goes smoothly
```

### Epic 2: Proactive Tracking

**US2.1: Proactive User**

```
As someone who wants to stay organized
I want to track my hours continuously
So that I'm always ready for renewals
```

**US2.2: Returning User**

```
As someone who used HourKeep before
I want to skip onboarding and start tracking immediately
So that I don't waste time on setup I've already done
```

### Epic 3: Exemption Support

**US3.1: Potentially Exempt User**

```
As someone who thinks I might be exempt from work requirements
I want to check my exemption status first
So that I don't waste time tracking if I don't need to
```

**US3.2: Exempt User Who Wants to Track**

```
As someone who is exempt but wants to track anyway
I want to use HourKeep even though I'm exempt
So that I have documentation just in case
```

### Epic 4: State Variability

**US4.1: User in State with 1-Month Requirement**

```
As a user in a state that only requires 1 month of documentation
I want to track just what I need
So that I don't spend unnecessary time on extra months
```

**US4.2: User in State with 6-Month Requirement**

```
As a user in a state that requires 6 months of documentation
I want to know upfront what I need to provide
So that I can plan my documentation accordingly
```

**US4.3: User with Confusing Notice**

```
As someone whose notice is unclear about requirements
I want guidance on what to document
So that I provide enough information without overdoing it
```

### Epic 5: Progress & Navigation

**US5.1: User Who Needs to Pause**

```
As someone who needs to stop onboarding midway
I want my progress to be saved
So that I can continue later without starting over
```

**US5.2: User Who Made a Mistake**

```
As someone who answered a question incorrectly
I want to go back and change my answer
So that my configuration is correct
```

**US5.3: User Who Wants to Know Progress**

```
As someone going through onboarding
I want to see how many steps are left
So that I know how much longer it will take
```

## Acceptance Criteria

### AC1: Context Assessment

- [ ] User sees "Why are you here?" question before profile setup
- [ ] User can select from 4 options: Notice, Applying, Renewal, Proactive
- [ ] User can skip assessment with prominent "Skip" button
- [ ] Follow-up questions appear based on user's selection
- [ ] If user selects "Notice", they're asked about notice details

### AC2: Notice Configuration

- [ ] User can specify number of months needed (1-6)
- [ ] User can enter deadline date
- [ ] System defaults to 1 month if user is unsure
- [ ] System offers "6 months (safe option)" as alternative
- [ ] Configuration is saved and used to set up dashboard

### AC3: Exemption Screening

- [ ] Exemption check happens early in flow
- [ ] If user might be exempt, full exemption assessment runs
- [ ] Exempt users are informed they may not need to track
- [ ] Exempt users can still choose to track
- [ ] Exemption status is saved to profile

### AC4: Profile Setup

- [ ] User provides: First name, Last name, State
- [ ] Deadline field appears only if user has a deadline
- [ ] State can be pre-filled if detectable
- [ ] Form validates required fields
- [ ] Data is saved to IndexedDB

### AC5: Contextual Getting Started

- [ ] Users with notices see: deadline, required months, action steps
- [ ] Proactive users see: benefits of continuous tracking, renewal info
- [ ] Users can skip getting started with prominent button
- [ ] Link to detailed help is provided
- [ ] Content is specific to user's context

### AC6: Dashboard Configuration

- [ ] Dashboard shows tracking goal if user has one
- [ ] Dashboard shows deadline countdown if applicable
- [ ] Dashboard shows progress toward goal
- [ ] Users can modify goal from dashboard
- [ ] Continuous trackers see current month progress

### AC7: Progress & Navigation

- [ ] Progress indicator shows "Step X of Y"
- [ ] Back button navigates to previous screen
- [ ] Continue button advances to next screen
- [ ] Progress auto-saves after each step
- [ ] Time estimate is shown ("About 2 minutes")

### AC8: Return Users

- [ ] Return users skip onboarding entirely
- [ ] Return users go directly to dashboard
- [ ] Users can reconfigure from settings
- [ ] Original configuration is preserved

## Out of Scope

### Phase 1 (Current Spec)

- State requirements database (will be added when data available)
- Renewal reminder notifications (separate spec)
- Export overhaul (separate spec)
- Multi-language support
- SMS/email notifications

### Future Considerations

- Integration with state systems
- Automatic data verification
- Shared household accounts
- Caseworker portal

## Component Reuse Strategy

### Reuse Existing Components (90%)

**From "How to HourKeep" Assessment:**

- ✅ `IntroductionScreen` - Welcome screen (enhance copy)
- ✅ `NoticeQuestion` - "Have you received a notice?"
- ✅ `NoticeFollowUp` - "Check exemption or skip?"
- ✅ `ExemptionQuestion` - All 12 exemption questions
- ✅ `ProgressIndicator` - Progress dots/percentage
- ✅ `QuestionWrapper` - Question container with back/continue
- ✅ `SingleChoiceQuestion` - Radio button questions
- ✅ Assessment progress saving and resumption

**From Onboarding:**

- ✅ `PrivacyNotice` - Privacy explanation (no changes)
- ✅ `ProfileForm` - Profile data collection (streamline)

### Create New Components (10%)

**New Components Needed:**

1. `NoticeDetailsQuestion` - Ask about months needed and deadline
2. `GettingStartedContextual` - Show next steps based on context
3. `OnboardingRouter` - Sequence existing components

### Benefits of Reuse Strategy

- **55% time savings** - ~44 hours instead of ~98 hours
- **Lower risk** - Components already tested and validated
- **Consistent UX** - Users familiar with existing patterns
- **Easier maintenance** - Single source of truth for questions
- **Data continuity** - No migration needed

## Success Metrics

### Primary Metrics

1. **Time to first activity logged** - Should decrease by 50%
2. **Onboarding completion rate** - Should be >90%
3. **User understanding** - Users should know what they need to do (survey)
4. **Component reuse rate** - Should achieve 90% reuse

### Secondary Metrics

1. **Implementation time** - Should be ~44 hours (vs. 98 hours for new build)
2. **Skip rate** - Track how many users skip assessment
3. **Back navigation usage** - Track if users need to go back
4. **Context distribution** - Understand which scenarios are most common
5. **Return user rate** - Track if users come back for renewals

## Dependencies

### Technical Dependencies

- ✅ Existing IndexedDB schema (no changes needed)
- ✅ Existing exemption screening logic (reuse as-is)
- ✅ Existing assessment components (reuse as-is)
- ✅ Existing onboarding components (minor enhancements)
- ✅ Existing dashboard components (minor integration)
- ✅ Existing routing system (add onboarding router)

### Design Dependencies

- ✅ Progress indicator component (exists)
- ✅ Question components (exist)
- ✅ Contextual help tooltips (use existing patterns)
- ✅ Mobile-optimized forms (exist)
- 🆕 Conversational UI copy (update IntroductionScreen)
- 🆕 GettingStartedContextual component (new)

## Assumptions

1. Users have basic smartphone literacy
2. Users can read and understand English (for MVP)
3. Users have access to their notice if they received one
4. Users know their state
5. Most users will engage reactively (notice/renewal) not proactively

## Constraints

1. Must work offline (PWA requirement)
2. Must work on mobile (primary device)
3. Must not transmit data externally (privacy requirement)
4. Must be accessible (WCAG 2.1 AA)
5. Must support all modern browsers

## Resolved Questions

1. **State detection** - ✅ No automatic detection. Use dropdown selector for user to choose their state.
2. **Notice parsing** - ✅ Not in MVP. Future enhancement could use existing document capture to upload notice.
3. **Exemption timing** - ✅ Optional and recommended, but users can skip the exemption check.
4. **Data migration** - ✅ Not needed. No existing users in production yet.
5. **Help content** - ✅ Use existing help methods: helptext tooltips for brief explanations, collapsible content for longer explanations.

## References

- Medicaid Domain Knowledge: `.kiro/steering/medicaid-domain-knowledge.md`
- HR1 Legislation: `docs/domain/hr1/119hr1enr-title7-part3.md`
- Service Blueprint: `docs/domain/medicaid-work-requirements-cfa-service-blueprint.md`
- Getting Started Guide: `.kiro/steering/getting-started.md`

# Reuse Analysis: Existing Components for Onboarding Redesign

## Overview

This document analyzes existing HourKeep components and proposes how to integrate them into the enhanced onboarding flow to avoid duplicating work.

## Existing Components Analysis

### 1. How to HourKeep Assessment (`/how-to-hourkeep`)

**Current Flow:**

1. Introduction screen
2. Notice question ("Have you received a notice?")
3. Notice follow-up (if yes)
4. Exemption screening (12 questions)
5. Work situation questions (job, seasonal, income, hours)
6. Other activities (volunteer, school, work program)
7. Results page with recommendation

**What It Does Well:**

- ✅ Complete exemption screening with all 12 questions
- ✅ Notice detection and routing
- ✅ Work situation assessment (income, hours, seasonal)
- ✅ Activity tracking assessment
- ✅ Progress saving and resumption
- ✅ Recommendation engine
- ✅ Pre-population from previous assessments
- ✅ Back navigation through questions
- ✅ Percentage-based progress indicator

**Data Collected:**

```typescript
interface AssessmentResponses {
  receivedAgencyNotice?: boolean;
  exemption: ExemptionResponses; // 12 questions
  hasJob?: boolean;
  paymentFrequency?: PayFrequency;
  monthlyIncome?: number;
  monthlyWorkHours?: number;
  isSeasonalWork?: boolean;
  otherActivities?: {
    volunteer?: boolean;
    school?: boolean;
    workProgram?: boolean;
  };
  volunteerHoursPerMonth?: number;
  schoolHoursPerMonth?: number;
  workProgramHoursPerMonth?: number;
}
```

**Components Used:**

- `IntroductionScreen`
- `ProgressIndicator`
- `QuestionWrapper`
- `NoticeQuestion` + `NoticeFollowUp`
- `ExemptionQuestion` (from exemptions)
- `SingleChoiceQuestion`
- `MultipleChoiceQuestion`
- `NumberInputQuestion`
- `HoursConverter` + `IncomeConverter`

### 2. Onboarding (`/onboarding`)

**Current Flow:**

1. Privacy notice
2. Profile form (name, state, DOB, optional: Medicaid ID, phone, email)
3. Redirect to `/tracking`

**What It Does Well:**

- ✅ Privacy notice with detailed explanations
- ✅ Profile data collection with validation
- ✅ State dropdown (all 50 states + DC)
- ✅ Age validation and exemption hints
- ✅ Optional vs required fields clearly marked
- ✅ Encrypted storage for sensitive data (DOB, Medicaid ID)

**Data Collected:**

```typescript
interface UserProfile {
  name: string;
  state: string;
  dateOfBirth: string; // Encrypted
  medicaidId?: string; // Encrypted
  phoneNumber?: string;
  email?: string;
  privacyNoticeAcknowledged: boolean;
  privacyNoticeAcknowledgedAt: Date;
}
```

**Components Used:**

- `PrivacyNotice`
- `ProfileForm`

## Proposed Integration Strategy

### Option 1: Sequential Integration (Recommended)

**New Flow:**

```
1. Privacy Notice (existing PrivacyNotice component)
   ↓
2. Welcome + Assessment (enhanced How to HourKeep intro)
   ↓
3. Notice Question (existing NoticeQuestion)
   ↓
4. Notice Follow-up OR Exemption Check (existing components)
   ↓
5. Profile Setup (existing ProfileForm - streamlined)
   ↓
6. Getting Started (new contextual component)
   ↓
7. Dashboard (configured based on assessment)
```

**Why This Works:**

- Reuses 90% of existing components
- Privacy notice stays first (legal requirement)
- Assessment happens before profile (understand context first)
- Profile form already has state dropdown (no auto-detection needed)
- Minimal new code needed

### Option 2: Parallel Paths (Alternative)

**New Flow:**

```
1. Privacy Notice
   ↓
2. Welcome Screen with Choice:
   - "I have a notice" → Assessment path
   - "I want to track proactively" → Quick profile path
   ↓
Assessment Path:          Quick Path:
3a. Notice questions      3b. Profile form
4a. Exemption check       4b. Skip to dashboard
5a. Profile form
6a. Getting Started
7a. Dashboard
```

**Why This Might Work:**

- Faster for proactive users
- Still captures context for notice users
- More complex routing logic

## Recommended Approach: Enhanced Sequential Flow

### Phase 1: Minimal Changes to Existing Components

**Step 1: Privacy Notice** (No changes needed)

- Use existing `PrivacyNotice` component as-is
- Already explains data storage and privacy

**Step 2: Welcome + Assessment** (Minor enhancement)

- Enhance existing `IntroductionScreen` to be more context-focused
- Change copy from "Let's figure out the best way to track" to "Why are you here today?"
- Keep existing skip functionality

**Step 3: Notice Questions** (No changes needed)

- Use existing `NoticeQuestion` and `NoticeFollowUp` components
- Already asks about notice and routes appropriately

**Step 4: Notice Details** (New component - but simple)

- Only needed if user has a notice
- Ask: "How many months do you need to document?" (1, 2, 3, 6, "Not sure")
- Ask: "When do you need to respond?" (optional date picker)
- Can reuse `SingleChoiceQuestion` and date input patterns

**Step 5: Exemption Check** (No changes needed)

- Use existing exemption screening flow
- Already has all 12 questions
- Already calculates exemption status
- Already allows skipping

**Step 6: Profile Setup** (Minor streamlining)

- Use existing `ProfileForm` component
- Remove Medicaid ID, phone, email fields (move to settings)
- Keep only: name, state, DOB
- Add optional deadline field (only if user has notice)

**Step 7: Getting Started** (New contextual component)

- Create new component that shows different content based on context
- Reuse patterns from existing `IntroductionScreen`
- Show deadline countdown if applicable
- Link to tracking dashboard

### Data Flow Integration

**Combine Assessment + Profile Data:**

```typescript
interface OnboardingData {
  // From Privacy Notice
  privacyAcknowledgedAt: Date;

  // From Assessment
  userType: "notice" | "applying" | "renewal" | "proactive";
  hasNotice: boolean;
  monthsRequired?: number;
  deadline?: Date;
  exemptionStatus?: {
    isExempt: boolean;
    reasons: string[];
  };

  // From Profile
  name: string;
  state: string;
  dateOfBirth: string;

  // Derived
  trackingGoal?: {
    monthsRequired: number;
    deadline?: Date;
  };
}
```

**Storage Strategy:**

1. Save assessment progress to `assessmentProgress` table (existing)
2. Save profile to `profiles` table (existing)
3. Create new `userContext` table for onboarding-specific data
4. Link assessment result to user context

## Component Reuse Map

### Reuse As-Is (No Changes)

- ✅ `PrivacyNotice` - Privacy explanation
- ✅ `NoticeQuestion` - "Have you received a notice?"
- ✅ `NoticeFollowUp` - "Check exemption or skip?"
- ✅ `ExemptionQuestion` - All 12 exemption questions
- ✅ `ProgressIndicator` - Progress dots/percentage
- ✅ `QuestionWrapper` - Question container with back/continue
- ✅ `SingleChoiceQuestion` - Radio button questions
- ✅ `MultipleChoiceQuestion` - Checkbox questions
- ✅ `NumberInputQuestion` - Number inputs with validation

### Enhance Slightly

- 🔧 `IntroductionScreen` - Update copy to be more context-focused
- 🔧 `ProfileForm` - Streamline to only essential fields (name, state, DOB, optional deadline)

### Create New (Minimal)

- ✨ `NoticeDetailsQuestion` - Ask about months needed and deadline
- ✨ `GettingStartedContextual` - Show next steps based on user context
- ✨ `OnboardingRouter` - Route between screens based on context

### Don't Need

- ❌ Work situation questions (not needed for onboarding)
- ❌ Activity questions (not needed for onboarding)
- ❌ Recommendation engine (not needed for onboarding)
- ❌ Results page (not needed for onboarding)

## Routing Logic

### Current Routing

```
/onboarding → Privacy → Profile → /tracking
/how-to-hourkeep → Assessment → Results → /tracking
```

### New Routing

```
/onboarding →
  Privacy →
  Welcome →
  Notice? →
    Yes → Notice Details → Exemption? → Profile → Getting Started → /tracking
    No → Exemption? → Profile → Getting Started → /tracking
```

### Implementation

```typescript
// src/app/onboarding/page.tsx
export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>('privacy');
  const [context, setContext] = useState<Partial<OnboardingData>>({});

  // Route based on step and context
  switch (step) {
    case 'privacy':
      return <PrivacyNotice onAcknowledge={() => setStep('welcome')} />;

    case 'welcome':
      return <IntroductionScreen
        onGetStarted={() => setStep('notice')}
        onSkip={() => router.push('/tracking')}
      />;

    case 'notice':
      return <NoticeQuestion
        onAnswer={(hasNotice) => {
          setContext({ ...context, hasNotice });
          setStep(hasNotice ? 'notice-details' : 'exemption-check');
        }}
      />;

    case 'notice-details':
      return <NoticeDetailsQuestion
        onContinue={(months, deadline) => {
          setContext({ ...context, monthsRequired: months, deadline });
          setStep('exemption-check');
        }}
      />;

    case 'exemption-check':
      return <ExemptionCheckScreen
        onComplete={(exemptionStatus) => {
          setContext({ ...context, exemptionStatus });
          setStep('profile');
        }}
        onSkip={() => setStep('profile')}
      />;

    case 'profile':
      return <ProfileForm
        onSave={(profile) => {
          // Save profile and context
          setStep('getting-started');
        }}
        showDeadlineField={context.hasNotice}
      />;

    case 'getting-started':
      return <GettingStartedContextual
        context={context}
        onContinue={() => router.push('/tracking')}
      />;
  }
}
```

## Benefits of This Approach

### 1. Minimal Code Changes

- Reuse 90% of existing components
- Only 3 new components needed
- Existing validation, styling, accessibility already done

### 2. Consistent UX

- Users already familiar with assessment flow
- Same question patterns and interactions
- Same progress indicators

### 3. Data Continuity

- Assessment data already stored properly
- Profile data already encrypted
- No migration needed

### 4. Faster Implementation

- ~40 hours instead of ~98 hours
- Less testing needed (components already tested)
- Lower risk of bugs

### 5. Maintainability

- Single source of truth for questions
- Changes to assessment automatically apply to onboarding
- Easier to update in future

## Implementation Plan

### Phase 1: Routing Integration (8 hours)

1. Create new onboarding router that sequences existing components
2. Add context state management
3. Test flow with existing components

### Phase 2: New Components (12 hours)

1. Create `NoticeDetailsQuestion` component
2. Create `GettingStartedContextual` component
3. Style to match existing components

### Phase 3: Profile Form Enhancement (4 hours)

1. Add optional deadline field
2. Make Medicaid ID, phone, email optional (move to settings)
3. Update validation

### Phase 4: Introduction Screen Enhancement (4 hours)

1. Update copy to be more context-focused
2. Add "Why are you here?" framing
3. Keep skip functionality

### Phase 5: Dashboard Integration (8 hours)

1. Read user context on dashboard load
2. Show goal progress if applicable
3. Configure tracking mode based on context

### Phase 6: Testing & Polish (8 hours)

1. Test all paths (notice, proactive, exempt)
2. Test back navigation
3. Test progress saving
4. Browser testing

**Total: ~44 hours** (vs. 98 hours for building from scratch)

## Open Questions

1. **Should we keep work/activity questions in assessment?**
   - Recommendation: Yes, keep them in `/how-to-hourkeep` for users who want detailed guidance
   - Don't include in onboarding (too long)

2. **Should assessment results influence onboarding?**
   - Recommendation: No, keep them separate
   - Onboarding is about setup, assessment is about guidance

3. **What if user completes assessment before onboarding?**
   - Recommendation: Pre-populate profile with DOB from assessment
   - Skip exemption check if already done

4. **Should we merge `/onboarding` and `/how-to-hourkeep`?**
   - Recommendation: No, keep separate
   - Onboarding = first-time setup
   - How to HourKeep = ongoing guidance tool

## Recommendation

**Use the Enhanced Sequential Flow with maximum component reuse:**

1. Keep existing components as-is where possible
2. Create only 3 new components (NoticeDetails, GettingStarted, Router)
3. Enhance 2 existing components (IntroductionScreen, ProfileForm)
4. Implement in ~44 hours instead of ~98 hours
5. Lower risk, faster delivery, consistent UX

This approach gives us 90% of the benefits of the full redesign with 45% of the effort.

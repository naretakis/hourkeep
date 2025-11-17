# Design: Enhanced Onboarding Flow

## Overview

This document details the technical design for the enhanced onboarding experience that supports both event-driven and continuous tracking use cases.

## Architecture

### Component Reuse Strategy

This design maximizes reuse of existing, tested components from "How to HourKeep" assessment and current onboarding flow.

**Reuse Rate: 90%** - Only 3 new components needed

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     First-Time User Flow                     │
│              (Reusing Existing Components)                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │  Privacy Notice     │
                    │  (Existing - Reuse) │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │  Welcome Screen     │
                    │  (Existing - Enhance)│
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │  Notice Question    │
                    │  (Existing - Reuse) │
                    └──────────┬──────────┘
                               ↓
        ┌──────────────────────┼──────────────────────┐
        ↓                      ↓                      ↓
┌───────────────┐   ┌──────────────────┐   ┌─────────────────┐
│ Notice Details│   │ Exemption Check  │   │ Skip to Profile │
│ (NEW)         │   │ (Existing-Reuse) │   │                 │
└───────┬───────┘   └────────┬─────────┘   └────────┬────────┘
        ↓                    ↓                       ↓
        └────────────────────┼───────────────────────┘
                             ↓
                ┌────────────────────────┐
                │  Profile Setup         │
                │  (Existing - Streamline)│
                └────────────┬───────────┘
                             ↓
                ┌────────────────────────┐
                │  Getting Started       │
                │  (NEW - Contextual)    │
                └────────────┬───────────┘
                             ↓
                ┌────────────────────────┐
                │  Dashboard             │
                │  (Existing - Configure)│
                └────────────────────────┘
```

### Return User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Return User Flow                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ Check IndexedDB │
                    │ for user data   │
                    └────────┬────────┘
                             ↓
                    ┌────────────────┐
                    │   Dashboard    │
                    │  (Configured)  │
                    └────────────────┘
```

## Data Model

### Reusing Existing Data Structures

**No new tables needed!** We'll reuse existing data structures:

1. **UserProfile** (existing) - From `profiles` table
2. **AssessmentProgress** (existing) - From `assessmentProgress` table
3. **AssessmentResult** (existing) - From `assessmentResults` table

### Enhanced User Context (Minimal Addition)

```typescript
// Extend existing UserProfile with onboarding context
interface UserProfile {
  // Existing fields
  id: string;
  name: string;
  state: string;
  dateOfBirth: string; // Encrypted
  medicaidId?: string; // Encrypted
  phoneNumber?: string;
  email?: string;
  privacyNoticeAcknowledged: boolean;
  privacyNoticeAcknowledgedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  version: number;

  // NEW: Onboarding context (optional)
  onboardingContext?: {
    hasNotice?: boolean;
    monthsRequired?: number;
    deadline?: Date;
    completedAt?: Date;
  };
}
```

### Reusing Assessment Data

```typescript
// Already exists - no changes needed
interface AssessmentResponses {
  receivedAgencyNotice?: boolean;
  exemption: ExemptionResponses; // 12 questions
  hasJob?: boolean;
  monthlyIncome?: number;
  monthlyWorkHours?: number;
  isSeasonalWork?: boolean;
  // ... other fields
}
```

### Onboarding State Schema

```typescript
interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canSkip: boolean;

  // Step data
  assessmentData?: {
    userType: string;
    hasNotice: boolean;
    noticeDetails?: string;
    monthsNeeded?: number;
    deadline?: Date;
  };

  profileData?: {
    firstName: string;
    lastName: string;
    state: string;
  };

  exemptionData?: {
    isExempt: boolean;
    reasons: string[];
  };
}
```

## Component Architecture

### Reusing Existing Components

**From `/how-to-hourkeep` (Reuse as-is):**

```
src/components/assessment/
├── IntroductionScreen.tsx     # ✅ Reuse (enhance copy)
├── ProgressIndicator.tsx      # ✅ Reuse
├── QuestionWrapper.tsx        # ✅ Reuse
├── NoticeQuestion.tsx         # ✅ Reuse
├── SingleChoiceQuestion.tsx   # ✅ Reuse
└── NumberInputQuestion.tsx    # ✅ Reuse (for deadline)

src/components/exemptions/
└── ExemptionQuestion.tsx      # ✅ Reuse (all 12 questions)

src/lib/storage/
└── assessment.ts              # ✅ Reuse (progress saving)
```

**From `/onboarding` (Reuse with minor changes):**

```
src/components/onboarding/
├── PrivacyNotice.tsx          # ✅ Reuse (no changes)
└── ProfileForm.tsx            # 🔧 Streamline (remove optional fields)
```

### New Components (Only 3!)

```
src/app/onboarding/
├── page.tsx                   # 🆕 Onboarding router (sequences existing components)
└── components/
    ├── NoticeDetailsQuestion.tsx      # 🆕 Ask months + deadline
    └── GettingStartedContextual.tsx   # 🆕 Contextual next steps
```

## Screen Designs

### Screen 0: Privacy Notice (EXISTING - Reuse)

**Component:** `PrivacyNotice` (no changes)
**Purpose:** Explain data privacy and get acknowledgment
**Status:** ✅ Reuse as-is

### Screen 1: Welcome + Assessment (EXISTING - Enhance)

**Component:** `IntroductionScreen` (enhance copy)
**Purpose:** Understand why user is here and route appropriately
**Status:** 🔧 Minor enhancement (update copy)

**Layout:**

```
┌─────────────────────────────────────┐
│  [Skip to tracking →]               │
│                                     │
│         Welcome to HourKeep         │
│                                     │
│  Track your work hours to maintain │
│      your Medicaid coverage         │
│                                     │
│  ⏱️ This will take about 2 minutes  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Let's figure out what you need     │
│                                     │
│  Have you received a notice from    │
│  your state about Medicaid work     │
│  requirements?                      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ✉️  Yes, I have a notice   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📝 No, but I'm applying    │   │
│  │     for Medicaid            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🔄 No, but my renewal is   │   │
│  │     coming up               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📊 I just want to track    │   │
│  │     my hours                │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Interactions:**

- Tapping any option saves choice and advances to next screen
- Skip button goes directly to dashboard
- Each option routes to different follow-up

**Routing Logic:**

```typescript
if (userType === "notice") {
  navigate("/onboarding/notice-details");
} else if (userType === "applying" || userType === "renewal") {
  navigate("/onboarding/exemption-check"); // Optional check
} else if (userType === "proactive") {
  navigate("/onboarding/profile");
}
```

### Screen 1b: Notice Question (EXISTING - Reuse)

**Component:** `NoticeQuestion` (no changes)
**Purpose:** Ask if user received a notice
**Status:** ✅ Reuse as-is from How to HourKeep

### Screen 2a: Notice Details (NEW)

**Component:** `NoticeDetailsQuestion` (new)
**Purpose:** Capture specific requirements from notice
**Status:** 🆕 New component (simple, reuses SingleChoiceQuestion pattern)

**Layout:**

```
┌─────────────────────────────────────┐
│  [← Back]              [●●○○] 2 of 4│
│                                     │
│  What does your notice say?         │
│                                     │
│  How many months of work do you     │
│  need to prove?                     │
│                                     │
│  ○ 1 month                          │
│  ○ 2 months                         │
│  ○ 3 months                         │
│  ○ 6 months                         │
│  ○ I'm not sure                     │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  When do you need to respond?       │
│  (Optional)                         │
│                                     │
│  [__/__/____]  📅                   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  💡 Not sure? We recommend tracking │
│  1 month to start. You can always   │
│  add more later.                    │
│                                     │
│              [Continue →]           │
└─────────────────────────────────────┘
```

**Interactions:**

- Selecting "I'm not sure" defaults to 1 month
- Date picker for deadline (optional)
- Continue button enabled after selection
- Back button returns to welcome screen

**Data Saved:**

```typescript
{
  monthsRequired: number,
  deadline?: Date,
  isUnsure: boolean
}
```

### Screen 2b: Exemption Check (EXISTING - Reuse)

**Component:** `ExemptionQuestion` + `NoticeFollowUp` (no changes)
**Purpose:** Offer optional exemption check before tracking
**Status:** ✅ Reuse as-is from How to HourKeep (all 12 questions)

**Layout:**

```
┌─────────────────────────────────────┐
│  [← Back]              [●●○○] 2 of 4│
│                                     │
│  Before we start, let's check if    │
│  you're exempt from work            │
│  requirements                       │
│                                     │
│  💡 This is optional but recommended│
│                                     │
│  You might be exempt if you:        │
│                                     │
│  • Are 18 or younger, or 65+        │
│  • Are pregnant or postpartum       │
│  • Have a child 13 or younger       │
│  • Have a disability                │
│  • Are on Medicare                  │
│  • And other reasons... [?]         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ✓ Check if I'm exempt      │   │
│  │    (Recommended)            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Skip - I need to track     │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Interactions:**

- "Check if I'm exempt" runs existing exemption screening
- "Skip" goes to profile setup
- [?] icon shows helptext tooltip with full exemption list
- If exempt, show result and option to track anyway
- If not exempt, continue to profile
- Exemption check is clearly marked as optional but recommended

### Screen 3: Profile Setup (EXISTING - Streamline)

**Component:** `ProfileForm` (streamline)
**Purpose:** Collect basic user information
**Status:** 🔧 Minor changes (remove optional fields, add deadline field)

**Layout:**

```
┌─────────────────────────────────────┐
│  [← Back]              [●●●○] 3 of 4│
│                                     │
│  Let's set up your profile          │
│                                     │
│  First name                         │
│  [_________________________]        │
│                                     │
│  Last name                          │
│  [_________________________]        │
│                                     │
│  State                              │
│  [Select state ▼]                   │
│                                     │
│  [If user has deadline]             │
│  Response deadline                  │
│  [__/__/____]  📅                   │
│  You have 23 days to respond        │
│                                     │
│              [Continue →]           │
└─────────────────────────────────────┘
```

**Interactions:**

- All fields required except deadline
- State dropdown with all 50 states + DC
- Deadline only shown if user indicated they have one
- Form validation before continue
- Auto-save on field blur

**Validation:**

```typescript
{
  firstName: required, minLength: 1,
  lastName: required, minLength: 1,
  state: required,
  deadline: optional, mustBeFuture
}
```

### Screen 4: Getting Started (NEW)

**Component:** `GettingStartedContextual` (new)
**Purpose:** Provide context-specific guidance
**Status:** 🆕 New component (shows different content based on user context)

**Layout for Notice Users:**

```
┌─────────────────────────────────────┐
│  [← Back]              [●●●●] 4 of 4│
│                                     │
│  ✅ You're all set!                 │
│                                     │
│  Here's what to do next:            │
│                                     │
│  1. 📅 Document your work hours     │
│     Track hours for the months      │
│     you need (January 2027)         │
│                                     │
│  2. 📄 Add supporting documents     │
│     Upload pay stubs or volunteer   │
│     verification letters            │
│                                     │
│  3. 📤 Export and submit            │
│     Generate your report and send   │
│     it to your state                │
│                                     │
│  ⏰ Deadline: Feb 15, 2027          │
│     You have 23 days to respond     │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  💡 Need help? Tap the ? icon       │
│  anytime for guidance               │
│                                     │
│  [Start Tracking]  [Skip Tutorial]  │
└─────────────────────────────────────┘
```

**Layout for Proactive Users:**

```
┌─────────────────────────────────────┐
│  [← Back]              [●●●●] 4 of 4│
│                                     │
│  ✅ You're all set!                 │
│                                     │
│  Here's how HourKeep works:         │
│                                     │
│  • 📊 Log hours as you work         │
│    Track work, volunteer, school    │
│                                     │
│  • 📈 See your monthly progress     │
│    Know if you're meeting the       │
│    80-hour requirement              │
│                                     │
│  • 📤 Export when needed            │
│    Generate reports for your state  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  💡 You'll need to show proof       │
│  every 6 months for renewal.        │
│  Keeping HourKeep updated makes     │
│  renewals easy!                     │
│                                     │
│  [Start Tracking]  [Skip Tutorial]  │
└─────────────────────────────────────┘
```

**Interactions:**

- Content varies based on user context
- Both buttons go to dashboard
- "Start Tracking" marks tutorial as seen
- "Skip Tutorial" marks tutorial as skipped

## Component Specifications

### ProgressIndicator Component

**Purpose:** Show user where they are in onboarding

**Props:**

```typescript
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  showLabel?: boolean;
}
```

**Visual Design:**

```
[●●●○] Step 3 of 4
```

**Implementation:**

```typescript
export function ProgressIndicator({
  currentStep,
  totalSteps,
  showLabel = true
}: ProgressIndicatorProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: i < currentStep ? 'primary.main' : 'grey.300'
            }}
          />
        ))}
      </Box>
      {showLabel && (
        <Typography variant="caption" color="text.secondary">
          Step {currentStep} of {totalSteps}
        </Typography>
      )}
    </Box>
  );
}
```

### NavigationButtons Component

**Purpose:** Consistent back/continue navigation

**Props:**

```typescript
interface NavigationButtonsProps {
  onBack?: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
  showBack?: boolean;
}
```

**Implementation:**

```typescript
export function NavigationButtons({
  onBack,
  onContinue,
  continueDisabled = false,
  continueLabel = 'Continue',
  showBack = true
}: NavigationButtonsProps) {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      mt: 3
    }}>
      {showBack && onBack ? (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
        >
          Back
        </Button>
      ) : (
        <Box /> // Spacer
      )}
      <Button
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        onClick={onContinue}
        disabled={continueDisabled}
      >
        {continueLabel}
      </Button>
    </Box>
  );
}
```

### QuestionCard Component

**Purpose:** Display question with selectable options

**Props:**

```typescript
interface QuestionCardProps {
  question: string;
  options: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
  }>;
  value?: string;
  onChange: (value: string) => void;
  helpText?: string;
}
```

**Implementation:**

```typescript
export function QuestionCard({
  question,
  options,
  value,
  onChange,
  helpText
}: QuestionCardProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {question}
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        {options.map((option) => (
          <Card
            key={option.value}
            sx={{
              cursor: 'pointer',
              border: 2,
              borderColor: value === option.value
                ? 'primary.main'
                : 'transparent',
              '&:hover': {
                borderColor: 'primary.light'
              }
            }}
            onClick={() => onChange(option.value)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {option.icon}
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {option.label}
                  </Typography>
                  {option.description && (
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {helpText && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {helpText}
        </Alert>
      )}
    </Box>
  );
}
```

## State Management

### Onboarding Context

```typescript
interface OnboardingContextValue {
  state: OnboardingState;
  userContext: Partial<UserContext>;

  // Actions
  setAssessmentData: (data: AssessmentData) => void;
  setProfileData: (data: ProfileData) => void;
  setExemptionData: (data: ExemptionData) => void;
  goToStep: (step: number) => void;
  goBack: () => void;
  goForward: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => Promise<void>;

  // Computed
  canGoBack: boolean;
  canGoForward: boolean;
  isComplete: boolean;
}
```

### Context Provider

```typescript
export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initialState);
  const [userContext, setUserContext] = useState<Partial<UserContext>>({});

  // Auto-save to IndexedDB on state change
  useEffect(() => {
    saveOnboardingProgress(state, userContext);
  }, [state, userContext]);

  const setAssessmentData = useCallback((data: AssessmentData) => {
    setUserContext(prev => ({
      ...prev,
      userType: data.userType,
      hasNotice: data.hasNotice,
      trackingGoal: data.monthsNeeded ? {
        monthsRequired: data.monthsNeeded,
        deadline: data.deadline
      } : undefined
    }));
  }, []);

  const completeOnboarding = useCallback(async () => {
    const finalContext: UserContext = {
      ...userContext as UserContext,
      onboardingComplete: true,
      updatedAt: new Date()
    };

    await db.userContext.put(finalContext);
    router.push('/dashboard');
  }, [userContext]);

  // ... other actions

  return (
    <OnboardingContext.Provider value={{
      state,
      userContext,
      setAssessmentData,
      setProfileData,
      setExemptionData,
      goToStep,
      goBack,
      goForward,
      skipOnboarding,
      completeOnboarding,
      canGoBack: state.currentStep > 1,
      canGoForward: isStepComplete(state.currentStep),
      isComplete: state.currentStep === state.totalSteps
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}
```

## Routing Logic

### Dynamic Step Calculation

```typescript
function calculateOnboardingSteps(userContext: Partial<UserContext>): number {
  let steps = 2; // Welcome + Profile (minimum)

  if (userContext.hasNotice) {
    steps += 1; // Notice details
  }

  if (
    userContext.userType === "applying" ||
    userContext.userType === "renewal"
  ) {
    steps += 1; // Exemption check (optional but counted)
  }

  steps += 1; // Getting started (always shown)

  return steps;
}
```

### Route Guards

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has completed onboarding
  if (pathname.startsWith("/dashboard")) {
    const onboardingComplete = await checkOnboardingStatus();

    if (!onboardingComplete) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return NextResponse.next();
}
```

## Database Operations

### Save Onboarding Progress

```typescript
async function saveOnboardingProgress(
  state: OnboardingState,
  userContext: Partial<UserContext>,
) {
  await db.onboardingProgress.put({
    id: "current",
    state,
    userContext,
    savedAt: new Date(),
  });
}
```

### Load Onboarding Progress

```typescript
async function loadOnboardingProgress(): Promise<{
  state: OnboardingState;
  userContext: Partial<UserContext>;
} | null> {
  const progress = await db.onboardingProgress.get("current");
  return progress || null;
}
```

### Complete Onboarding

```typescript
async function completeOnboarding(userContext: UserContext) {
  // Save final user context
  await db.userContext.put({
    ...userContext,
    onboardingComplete: true,
    updatedAt: new Date(),
  });

  // Clear onboarding progress
  await db.onboardingProgress.delete("current");

  // Initialize dashboard configuration
  await initializeDashboard(userContext);
}
```

## Dashboard Configuration

### Configure Dashboard Based on Context

```typescript
async function initializeDashboard(userContext: UserContext) {
  if (userContext.trackingGoal) {
    // User has specific goal (notice, applying, renewal)
    await db.dashboardConfig.put({
      id: "current",
      mode: "goal-based",
      goal: userContext.trackingGoal,
      showDeadline: !!userContext.trackingGoal.deadline,
      showProgress: true,
    });
  } else {
    // Proactive user
    await db.dashboardConfig.put({
      id: "current",
      mode: "continuous",
      showCurrentMonth: true,
      showHistory: true,
    });
  }
}
```

## Accessibility Considerations

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order follows visual flow
- Enter key submits forms
- Escape key cancels/goes back

### Screen Reader Support

```typescript
// Progress indicator
<Box role="progressbar" aria-valuenow={currentStep} aria-valuemax={totalSteps}>
  <Typography id="progress-label">
    Step {currentStep} of {totalSteps}
  </Typography>
</Box>

// Question cards
<Card
  role="radio"
  aria-checked={value === option.value}
  tabIndex={0}
  onKeyPress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onChange(option.value);
    }
  }}
>
```

### Focus Management

```typescript
// Auto-focus first input on screen load
useEffect(() => {
  const firstInput = document.querySelector("input, button");
  if (firstInput instanceof HTMLElement) {
    firstInput.focus();
  }
}, []);

// Announce screen changes
useEffect(() => {
  const announcement = document.getElementById("screen-announcement");
  if (announcement) {
    announcement.textContent = `Step ${currentStep}: ${screenTitle}`;
  }
}, [currentStep]);
```

## Error Handling

### Validation Errors

```typescript
interface ValidationError {
  field: string;
  message: string;
}

function validateProfileData(data: ProfileData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.firstName?.trim()) {
    errors.push({ field: "firstName", message: "First name is required" });
  }

  if (!data.lastName?.trim()) {
    errors.push({ field: "lastName", message: "Last name is required" });
  }

  if (!data.state) {
    errors.push({ field: "state", message: "State is required" });
  }

  if (data.deadline && data.deadline < new Date()) {
    errors.push({
      field: "deadline",
      message: "Deadline must be in the future",
    });
  }

  return errors;
}
```

### Save Errors

```typescript
async function saveWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
}
```

## Performance Considerations

### Code Splitting

```typescript
// Lazy load onboarding screens
const WelcomeScreen = lazy(() => import("./welcome/page"));
const NoticeDetailsScreen = lazy(() => import("./notice-details/page"));
const ExemptionCheckScreen = lazy(() => import("./exemption-check/page"));
const ProfileScreen = lazy(() => import("./profile/page"));
const GettingStartedScreen = lazy(() => import("./getting-started/page"));
```

### Optimistic Updates

```typescript
function useOptimisticUpdate() {
  const [state, setState] = useState();

  const updateWithOptimism = async (newData) => {
    // Update UI immediately
    setState(newData);

    try {
      // Save to IndexedDB
      await db.save(newData);
    } catch (error) {
      // Revert on error
      setState(previousState);
      showError("Failed to save. Please try again.");
    }
  };

  return updateWithOptimism;
}
```

## Testing Strategy

### Unit Tests

```typescript
describe("OnboardingContext", () => {
  it("should calculate correct number of steps for notice user", () => {
    const steps = calculateOnboardingSteps({
      userType: "notice",
      hasNotice: true,
    });
    expect(steps).toBe(4); // Welcome, Notice Details, Profile, Getting Started
  });

  it("should save progress after each step", async () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.setAssessmentData({ userType: "notice" });
    });

    const saved = await db.onboardingProgress.get("current");
    expect(saved.userContext.userType).toBe("notice");
  });
});
```

### Integration Tests

```typescript
describe('Onboarding Flow', () => {
  it('should complete full onboarding for notice user', async () => {
    render(<OnboardingFlow />);

    // Step 1: Select "I have a notice"
    await userEvent.click(screen.getByText('Yes, I have a notice'));

    // Step 2: Enter notice details
    await userEvent.click(screen.getByLabelText('1 month'));
    await userEvent.click(screen.getByText('Continue'));

    // Step 3: Enter profile
    await userEvent.type(screen.getByLabelText('First name'), 'John');
    await userEvent.type(screen.getByLabelText('Last name'), 'Doe');
    await userEvent.selectOptions(screen.getByLabelText('State'), 'CA');
    await userEvent.click(screen.getByText('Continue'));

    // Step 4: Complete getting started
    await userEvent.click(screen.getByText('Start Tracking'));

    // Should navigate to dashboard
    expect(window.location.pathname).toBe('/dashboard');
  });
});
```

## Migration Strategy

### Existing Users

```typescript
async function migrateExistingUsers() {
  const users = await db.users.toArray();

  for (const user of users) {
    // Create UserContext from existing user data
    const userContext: UserContext = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      state: user.state,
      userType: "unknown", // Existing users didn't specify
      hasNotice: false,
      onboardingComplete: true, // They already completed old onboarding
      createdAt: user.createdAt,
      updatedAt: new Date(),
      skippedAssessment: true, // They didn't go through new assessment
    };

    await db.userContext.put(userContext);
  }
}
```

## Future Enhancements

### Phase 2 Features

1. **State Requirements Database**
   - Pre-populate months required based on state
   - Show state-specific guidance
   - Update as regulations change

2. **Notice Upload & Parsing**
   - Leverage existing document capture functionality
   - Allow users to upload photo of notice during onboarding
   - OCR to extract requirements (months needed, deadline)
   - Auto-configure tracking goal based on parsed data
   - Fallback to manual entry if parsing fails

3. **Renewal Reminders**
   - Calculate renewal date (6 months from start)
   - Send notifications before renewal
   - Prompt to update tracking goal

4. **Multi-Language Support**
   - Translate all onboarding content
   - Support Spanish, Chinese, Vietnamese, etc.
   - Detect browser language

5. **Progress Recovery**
   - If user exits mid-onboarding, send reminder
   - "Continue where you left off" option
   - Show what's already completed

## References

- Requirements: `.kiro/specs/onboarding-redesign/requirements.md`
- Medicaid Domain Knowledge: `.kiro/steering/medicaid-domain-knowledge.md`
- Material-UI Guidelines: `.kiro/steering/material-ui-guidelines.md`
- Getting Started Guide: `.kiro/steering/getting-started.md`

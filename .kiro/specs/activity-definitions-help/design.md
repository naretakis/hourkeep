# Design Document: Activity Definitions Help Text

## Overview

This feature adds comprehensive, contextual help text throughout HourKeep to help users understand what activities and income count toward Medicaid work requirements. The design prioritizes mobile-first accessibility, plain language, and accuracy to HR1 legislation while maintaining a clean, uncluttered UI.

## Architecture

### Component Structure

```
src/
├── components/
│   ├── help/
│   │   ├── HelpTooltip.tsx          # Reusable tooltip component
│   │   ├── HelpSection.tsx          # Expandable help section
│   │   ├── EdgeCaseExamples.tsx     # Collapsible edge case examples
│   │   └── DashboardGuidance.tsx    # Main dashboard guidance card
│   ├── activities/
│   │   └── ActivityFormHelp.tsx     # Activity-specific help text
│   └── income/
│       └── IncomeHelp.tsx           # Income tracking help text
├── content/
│   └── helpText.ts                  # Centralized help text content
└── types/
    └── help.ts                      # TypeScript types for help content
```

### Data Flow

1. **Content Source**: All help text stored in `helpText.ts` as structured data
2. **Component Consumption**: Components import and display relevant help text
3. **User Interaction**: Users tap/click help icons or expand sections
4. **State Management**: Local component state for expand/collapse (no global state needed)

## Components and Interfaces

### 1. HelpTooltip Component

**Purpose**: Reusable tooltip component for inline help text

**Props Interface**:
```typescript
interface HelpTooltipProps {
  content: string;
  title?: string;
  examples?: string[];
  counterExamples?: string[];
  placement?: 'top' | 'bottom' | 'left' | 'right';
  ariaLabel: string;
}
```

**Behavior**:
- Desktop: Shows on hover or click
- Mobile: Shows in bottom sheet modal on tap
- Includes close button for mobile
- Auto-dismisses on outside click
- Accessible via keyboard (Enter/Space to open, Escape to close)

**Visual Design**:
- Help icon: Info circle (ⓘ) with 44px minimum touch target
- Tooltip: White background, subtle shadow, rounded corners
- Mobile modal: Slides up from bottom, semi-transparent backdrop

### 2. HelpSection Component

**Purpose**: Expandable section for longer help content

**Props Interface**:
```typescript
interface HelpSectionProps {
  title: string;
  content: string | React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'info' | 'warning';
}
```

**Behavior**:
- Toggles between expanded/collapsed on click
- Smooth animation (300ms ease-in-out)
- Persists state in sessionStorage (optional)
- Chevron icon rotates to indicate state

**Visual Design**:
- Header: Bold text with chevron icon
- Content: Padded area with light background
- Border: Subtle border to separate from surrounding content

### 3. EdgeCaseExamples Component

**Purpose**: Collapsible section showing scenario examples

**Props Interface**:
```typescript
interface EdgeCaseExamplesProps {
  activityType: 'work' | 'volunteer' | 'education' | 'workProgram' | 'income';
  examples: EdgeCaseExample[];
}

interface EdgeCaseExample {
  scenario: string;
  counts: boolean;
  explanation: string;
}
```

**Behavior**:
- Collapsed by default to avoid clutter
- Expands to show 2-4 scenario examples
- Each example clearly marked with ✓ (counts) or ✗ (doesn't count)

**Visual Design**:
- Scenarios in card format
- Green checkmark for "counts", red X for "doesn't count"
- Clear visual separation between scenarios

### 4. DashboardGuidance Component

**Purpose**: Main dashboard guidance card

**Props Interface**:
```typescript
interface DashboardGuidanceProps {
  onDismiss?: () => void;
  dismissible?: boolean;
}
```

**Behavior**:
- Shows on first app load
- Can be dismissed (stored in localStorage)
- Can be re-shown from settings/help menu
- Collapsible to save space

**Visual Design**:
- Card with light blue background
- Icon for each step (exemption, calendar, review, export)
- Numbered list for clarity
- Dismiss button in top-right corner

### 5. ActivityFormHelp Component

**Purpose**: Activity-specific help text in tracking form

**Props Interface**:
```typescript
interface ActivityFormHelpProps {
  activityType: 'work' | 'volunteer' | 'education' | 'workProgram';
  inline?: boolean;
}
```

**Behavior**:
- Shows help icon next to each activity type selector
- Displays definition, examples, and counter-examples
- Links to edge case examples

**Visual Design**:
- Inline with form fields
- Minimal visual weight to avoid overwhelming form
- Clear typography hierarchy

### 6. IncomeHelp Component

**Purpose**: Income tracking help text

**Props Interface**:
```typescript
interface IncomeHelpProps {
  showSeasonalWorkerInfo?: boolean;
}
```

**Behavior**:
- Explains $580/month threshold
- Shows calculation (80 hours × $7.25)
- Conditionally shows seasonal worker info
- Links to income types that count

**Visual Design**:
- Calculation shown in highlighted box
- Clear distinction between regular and seasonal worker rules

## Data Models

### Help Text Content Structure

```typescript
// src/content/helpText.ts

export const activityDefinitions = {
  work: {
    title: 'Work (Paid Employment)',
    definition: 'Paid employment where you work at least 80 hours per month.',
    examples: [
      'Full-time or part-time job',
      'Multiple part-time jobs that total 80+ hours',
      'Gig work (Uber, DoorDash, etc.) if you work 80+ hours',
      'Self-employment if you work 80+ hours'
    ],
    counterExamples: [
      'Job searching or applying for jobs',
      'Unpaid internships',
      'Work under 80 hours per month (unless combined with other activities)'
    ],
    edgeCases: [
      {
        scenario: 'I work 60 hours at one job and 20 hours at another',
        counts: true,
        explanation: 'Yes! You can combine hours from multiple jobs. 60 + 20 = 80 hours total.'
      },
      {
        scenario: 'I spend 80 hours per month looking for a job',
        counts: false,
        explanation: 'No. Job searching does NOT count as a qualifying activity. You need to volunteer, go to school, or join a work program instead.'
      },
      {
        scenario: 'I do gig work but my hours vary each month',
        counts: true,
        explanation: 'Yes, as long as you work at least 80 hours in the month you\'re reporting. Track your hours carefully.'
      }
    ],
    source: 'HR1 Section 71119(xx)(2)(A)'
  },
  
  volunteer: {
    title: 'Volunteer (Community Service)',
    definition: 'Unpaid community service where you volunteer at least 80 hours per month.',
    examples: [
      'Volunteering at a food bank',
      'Helping at a community center',
      'Volunteering at a school or library',
      'Community cleanup or service projects'
    ],
    counterExamples: [
      'Informal help for friends or family',
      'Volunteering less than 80 hours per month (unless combined with other activities)'
    ],
    edgeCases: [
      {
        scenario: 'I volunteer 40 hours and work 40 hours',
        counts: true,
        explanation: 'Yes! You can combine volunteer hours with work hours. 40 + 40 = 80 hours total.'
      },
      {
        scenario: 'I help my neighbor with yard work',
        counts: false,
        explanation: 'No. Informal help for friends or family doesn\'t count. You need to volunteer with an organization.'
      }
    ],
    source: 'HR1 Section 71119(xx)(2)(B)'
  },
  
  education: {
    title: 'Education (School Enrollment)',
    definition: 'Enrolled at least half-time in an educational program.',
    examples: [
      'Community college (6+ credit hours)',
      'University or 4-year college (6+ credit hours)',
      'Trade school or vocational training',
      'Career and technical education programs',
      'GED or adult education programs (half-time or more)'
    ],
    counterExamples: [
      'Online courses that aren\'t part of a formal program',
      'Less than half-time enrollment',
      'Informal learning or self-study'
    ],
    edgeCases: [
      {
        scenario: 'I\'m taking 2 classes (6 credit hours) at community college',
        counts: true,
        explanation: 'Yes! 6 credit hours is typically considered half-time enrollment.'
      },
      {
        scenario: 'I\'m taking one online course for personal interest',
        counts: false,
        explanation: 'No. The course must be part of a formal educational program and you must be enrolled at least half-time.'
      }
    ],
    source: 'HR1 Section 71119(xx)(2)(D) and (xx)(9)(B)'
  },
  
  workProgram: {
    title: 'Work Program (Job Training)',
    definition: 'Participating in a job training or workforce development program for at least 80 hours per month.',
    examples: [
      'SNAP Employment & Training (E&T) program',
      'TANF work program',
      'Workforce development programs',
      'Job training or apprenticeship programs',
      'Vocational rehabilitation programs'
    ],
    counterExamples: [
      'Informal job training',
      'Programs less than 80 hours per month (unless combined with other activities)'
    ],
    edgeCases: [
      {
        scenario: 'I\'m in a SNAP E&T program for 80 hours per month',
        counts: true,
        explanation: 'Yes! SNAP E&T and similar workforce programs count as work programs.'
      }
    ],
    source: 'HR1 Section 71119(xx)(2)(C) and (xx)(9)(D)'
  }
};

export const incomeDefinitions = {
  threshold: {
    title: 'Income Threshold',
    definition: 'If you earn at least $580 per month, you automatically meet work requirements without tracking hours.',
    calculation: '$580 = 80 hours × $7.25 (federal minimum wage)',
    whatCounts: {
      title: 'What Types of Income Count?',
      description: 'Only earned income from working counts toward the $580 threshold.',
      examples: [
        'Wages from a job (W-2 income)',
        'Self-employment income (1099 income)',
        'Tips and commissions from work',
        'Gig work earnings (Uber, DoorDash, etc.)',
        'Freelance or contract work income'
      ]
    },
    whatDoesNotCount: {
      title: 'What Types of Income Do NOT Count?',
      description: 'Unearned income does not count toward the $580 threshold.',
      examples: [
        'SSI (Supplemental Security Income)',
        'SSDI (Social Security Disability Insurance)',
        'Unemployment benefits',
        'Child support payments',
        'Gifts or loans from family/friends',
        'Investment income or interest',
        'Rental income (unless it\'s your business)'
      ]
    },
    edgeCases: [
      {
        scenario: 'I earn $600 per month from my job',
        counts: true,
        explanation: 'Yes! Since you earn more than $580/month, you automatically meet work requirements. You don\'t need to track hours.'
      },
      {
        scenario: 'I earn $400 from work and $200 from unemployment',
        counts: false,
        explanation: 'No. Only the $400 from work counts. Unemployment benefits don\'t count. Since $400 is less than $580, you need to track your work hours or do other activities.'
      },
      {
        scenario: 'I do gig work and my income varies. Some months I earn $700, other months $400',
        counts: 'varies',
        explanation: 'It depends on the month. In months where you earn $580 or more, you meet requirements. In months under $580, you need to track hours or qualify as a seasonal worker.'
      }
    ],
    note: 'Only earned income from work counts toward the $580 threshold. If you earn less than $580/month, you need to track your hours.',
    source: 'HR1 Section 71119(xx)(2)(F)'
  },
  
  seasonalWorker: {
    title: 'Seasonal Workers',
    definition: 'If you\'re a seasonal worker, your income is averaged over the past 6 months instead of just one month.',
    whoQualifies: 'You may be a seasonal worker if your income varies significantly by season (e.g., farm work, holiday retail, summer tourism).',
    calculation: 'Average monthly income over past 6 months must be at least $580',
    howToCalculate: [
      'Add up your total income from the past 6 months',
      'Divide by 6 to get your average monthly income',
      'If the average is $580 or more, you meet requirements'
    ],
    example: {
      scenario: 'You earned $3,480 over the past 6 months',
      calculation: '$3,480 ÷ 6 months = $580/month average',
      result: 'You meet work requirements as a seasonal worker'
    },
    edgeCases: [
      {
        scenario: 'I work at a ski resort and only earn income 4 months per year',
        counts: true,
        explanation: 'Yes! As a seasonal worker, your income is averaged over 6 months. If your 6-month average is $580 or more, you meet requirements.'
      },
      {
        scenario: 'I earned $4,000 in the summer but nothing the rest of the year',
        counts: 'depends',
        explanation: 'It depends on your 6-month average. If $4,000 ÷ 6 = $667/month average, you meet requirements. But you need to recalculate every 6 months.'
      }
    ],
    source: 'HR1 Section 71119(xx)(2)(G)'
  },
  
  incomeVsHours: {
    title: 'Income OR Hours - You Choose',
    definition: 'You can meet work requirements in two ways: earn $580/month OR track 80 hours/month of activities.',
    options: [
      {
        option: 'Option 1: Income',
        description: 'Earn at least $580 per month from work',
        benefit: 'No need to track hours'
      },
      {
        option: 'Option 2: Hours',
        description: 'Track 80 hours per month of work, volunteer, education, or work programs',
        benefit: 'Counts even if you earn less than $580'
      }
    ],
    note: 'You only need to meet ONE of these requirements, not both.',
    example: 'If you work 100 hours per month but only earn $400, you still meet requirements because you have 80+ hours.'
  }
};

export const combinationRules = {
  title: 'Combining Activities',
  definition: 'You can combine different activities to reach 80 hours per month.',
  examples: [
    '40 hours work + 40 hours volunteer = 80 hours ✓',
    '60 hours work + 20 hours education = 80 hours ✓',
    '30 hours work + 30 hours volunteer + 20 hours work program = 80 hours ✓'
  ],
  note: 'The total must equal at least 80 hours per month.',
  source: 'HR1 Section 71119(xx)(2)(E)'
};

export const dashboardGuidance = {
  title: 'How to Use HourKeep',
  steps: [
    {
      icon: 'checklist',
      text: 'Start with the exemption screener to see if you need to track hours',
      action: 'Go to Exemptions'
    },
    {
      icon: 'calendar',
      text: 'Click on calendar days to log your work, volunteer, or education hours',
      action: null
    },
    {
      icon: 'chart',
      text: 'Review your monthly totals at the bottom to see if you\'re on track',
      action: null
    },
    {
      icon: 'download',
      text: 'Export and share your data with your state Medicaid agency',
      action: 'Go to Export'
    }
  ]
};
```

## Error Handling

### Content Loading Errors

- **Scenario**: Help text content fails to load
- **Handling**: Show generic fallback text: "Help information temporarily unavailable"
- **User Action**: Provide "Retry" button

### Accessibility Errors

- **Scenario**: Screen reader cannot access help text
- **Handling**: Ensure all help content has proper ARIA labels and roles
- **Testing**: Validate with screen reader testing tools

## Testing Strategy

### Unit Tests

1. **HelpTooltip Component**
   - Renders with correct content
   - Opens/closes on interaction
   - Displays examples and counter-examples
   - Accessible via keyboard

2. **HelpSection Component**
   - Expands/collapses correctly
   - Persists state (if enabled)
   - Animates smoothly

3. **Content Accuracy**
   - All definitions match HR1 Section 71119
   - Examples are clear and accurate
   - Counter-examples correctly identify non-qualifying activities

### Integration Tests

1. **Activity Form Integration**
   - Help text appears next to each activity type
   - Tooltips display correct content for each activity
   - Edge cases are accessible

2. **Dashboard Integration**
   - Guidance card appears on first load
   - Can be dismissed and re-shown
   - Links navigate correctly

### Accessibility Tests

1. **Screen Reader Testing**
   - All help text readable by screen readers
   - Proper ARIA labels and roles
   - Logical tab order

2. **Keyboard Navigation**
   - Can open/close help with keyboard
   - Focus management works correctly
   - No keyboard traps

3. **Color Contrast**
   - All text meets WCAG 2.1 AA standards (4.5:1)
   - Icons have sufficient contrast

### Mobile Testing

1. **Touch Targets**
   - All help icons are at least 44px × 44px
   - Tooltips open on tap (not hover)
   - Bottom sheets work correctly

2. **Viewport Testing**
   - Content readable at 320px width
   - No horizontal scrolling
   - Text scales appropriately

## Implementation Notes

### Material-UI Components to Use

- **Tooltip**: Use MUI `Tooltip` component for desktop, custom bottom sheet for mobile
- **Accordion**: Use MUI `Accordion` for expandable sections
- **Card**: Use MUI `Card` for dashboard guidance
- **Typography**: Use MUI `Typography` with consistent variants
- **Icons**: Use MUI `InfoOutlined` icon for help indicators

### Responsive Breakpoints

```typescript
const breakpoints = {
  mobile: '0px',      // 0-599px
  tablet: '600px',    // 600-959px
  desktop: '960px'    // 960px+
};
```

### Animation Timing

- Expand/collapse: 300ms ease-in-out
- Tooltip fade: 200ms ease-in-out
- Bottom sheet slide: 250ms ease-out

### Storage Keys

```typescript
const STORAGE_KEYS = {
  DASHBOARD_GUIDANCE_DISMISSED: 'hourkeep_dashboard_guidance_dismissed',
  HELP_SECTION_STATE: 'hourkeep_help_section_state'
};
```

### Plain Language Guidelines

1. **Reading Level**: 8th grade or below (use Hemingway Editor to verify)
2. **Sentence Length**: Maximum 20 words per sentence
3. **Paragraph Length**: Maximum 3-4 sentences per paragraph
4. **Active Voice**: Use "you" and active verbs
5. **Avoid Jargon**: Replace policy terms with plain language
   - ❌ "community engagement activities"
   - ✓ "work, volunteer, or education"

### Content Update Process

1. All help text stored in `helpText.ts`
2. Changes require review against HR1 legislation
3. Update `source` field to reference specific HR1 section
4. Test content with plain language tools
5. Validate accessibility after content changes

## Future Enhancements

1. **Multi-language Support**: Add Spanish translations
2. **Video Tutorials**: Short videos explaining each activity type
3. **Interactive Examples**: Calculator to show hour combinations
4. **Contextual Tips**: Show relevant tips based on user's activity patterns
5. **FAQ Section**: Comprehensive FAQ based on common questions
6. **Search Functionality**: Search help content by keyword

## References

- HR1 Legislation: Section 71119 (Community Engagement Requirements)
- CFA Service Blueprint: Medicaid Work Requirements
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Plain Language Guidelines: https://www.plainlanguage.gov/
- Material-UI Documentation: https://mui.com/

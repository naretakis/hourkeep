# Design Document: Income Tracking Feature

## Overview

This document outlines the technical design for implementing income tracking as an alternative compliance method in HourKeep. The feature allows users to track earned income instead of hours to meet the $580/month threshold required by HR1 Section 71119(xx)(2)(F-G).

### Design Principles

1. **Reuse Existing Components**: Leverage existing document capture, status indicators, and UI patterns from hours tracking
2. **Consistent Experience**: Income tracking UI/UX should mirror hours tracking for familiarity
3. **Mobile-First**: All interfaces optimized for smartphone usage
4. **Offline-Capable**: Income data stored locally in IndexedDB, works without internet
5. **Privacy-First**: All data remains on device, no external transmission
6. **Minimal & Focused**: Only implement what's needed for income tracking, avoid scope creep

## Architecture

### High-Level Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        Dashboard                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Compliance Mode Selector (Hours | Income)           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Hours Tracking UI (existing)                        │  │
│  │  - Calendar                                           │  │
│  │  - Activity List                                      │  │
│  │  - Hours Status Indicator                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Income Tracking UI (new)                            │  │
│  │  - Income Entry List                                  │  │
│  │  - Income Status Indicator                           │  │
│  │  - Add Income Button                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Income Entry Form                          │
│  - Amount (required)                                         │
│  - Date (required)                                           │
│  - Pay Period Selector (daily/weekly/bi-weekly/monthly)     │
│  - Source/Employer (optional)                                │
│  - Seasonal Worker Toggle (optional)                         │
│  - Document Attachment (reuses DocumentCapture)              │
│  - Monthly Equivalent Display (calculated)                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Seasonal Worker View                        │
│  - 6-Month Income History (bar chart or list)               │
│  - Rolling Average Calculation                               │
│  - Compliance Status                                         │
└─────────────────────────────────────────────────────────────┘
```

## Data Models

### Database Schema Updates

Add new tables to IndexedDB (via Dexie.js):

```typescript
// Version 5: Add income tracking tables
this.version(5).stores({
  profiles: "id",
  activities: "++id, date, type",
  documents: "++id, activityId, type, createdAt",
  documentBlobs: "++id",
  exemptions: "++id, userId, screeningDate",
  exemptionHistory: "++id, userId, screeningDate",
  // NEW TABLES
  incomeEntries: "++id, date, userId, isSeasonalWorker",
  incomeDocuments: "++id, incomeEntryId, type, createdAt",
  incomeDocumentBlobs: "++id",
  complianceModes: "++id, month, userId", // Track which mode user chose per month
});
```

### TypeScript Interfaces

```typescript
// Income Entry
export interface IncomeEntry {
  id?: number; // Auto-increment ID
  userId: string; // Link to user profile
  date: string; // YYYY-MM-DD format
  amount: number; // Dollar amount (e.g., 150.50)
  payPeriod: "daily" | "weekly" | "bi-weekly" | "monthly";
  monthlyEquivalent: number; // Calculated based on pay period
  source?: string; // Optional: employer/source name
  isSeasonalWorker: boolean; // Whether this entry is marked as seasonal
  incomeType?: "wages" | "self-employment" | "gig-work" | "tips" | "other"; // Type of earned income
  createdAt: Date;
  updatedAt: Date;
}

// Income Document (similar to Activity Document)
export interface IncomeDocument {
  id?: number;
  incomeEntryId: number; // Link to income entry
  blobId: number; // Link to blob storage
  type: "pay_stub" | "bank_statement" | "app_screenshot" | "other";
  customType?: string; // If type is "other"
  description?: string;
  fileSize: number; // Original file size in bytes
  compressedSize?: number; // Compressed size if compression was applied
  mimeType: "image/jpeg" | "image/png";
  captureMethod: "camera" | "upload";
  createdAt: Date;
}

// Income Document Blob (similar to Activity Document Blob)
export interface IncomeDocumentBlob {
  id?: number;
  blob: Blob;
  createdAt: Date;
}

// Compliance Mode (track user's choice per month)
export interface ComplianceMode {
  id?: number;
  userId: string;
  month: string; // YYYY-MM format
  mode: "hours" | "income";
  createdAt: Date;
  updatedAt: Date;
}

// Monthly Income Summary (calculated, not stored)
export interface MonthlyIncomeSummary {
  month: string; // YYYY-MM format
  totalIncome: number; // Sum of all monthly equivalents
  entryCount: number; // Number of income entries
  isCompliant: boolean; // totalIncome >= INCOME_THRESHOLD
  amountNeeded: number; // INCOME_THRESHOLD - totalIncome (if not compliant)
  isSeasonalWorker: boolean; // If any entry is marked seasonal
  seasonalAverage?: number; // 6-month average if seasonal
  seasonalHistory?: Array<{ month: string; total: number }>; // 6 months of data
  incomeBySource?: Array<{ source: string; monthlyEquivalent: number }>; // Breakdown by source
}
```

## Components

### 1. ComplianceModeSelector

**Purpose**: Toggle between hours and income tracking modes

**Location**: `src/components/compliance/ComplianceModeSelector.tsx`

**Props**:

```typescript
interface ComplianceModeSelectorProps {
  currentMode: "hours" | "income";
  currentMonth: string; // YYYY-MM format
  onModeChange: (mode: "hours" | "income") => void;
}
```

**UI Pattern**: Segmented control (Material-UI ToggleButtonGroup)

```
┌─────────────────────────────────────┐
│  [ Track Hours ]  [ Track Income ]  │
└─────────────────────────────────────┘
```

**Behavior**:

- Shows warning dialog before switching modes
- Preserves data from both modes
- Updates `complianceModes` table with user's choice

### 2. IncomeStatusIndicator

**Purpose**: Display income compliance status (mirrors Dashboard hours status)

**Location**: `src/components/income/IncomeStatusIndicator.tsx`

**Props**:

```typescript
interface IncomeStatusIndicatorProps {
  summary: MonthlyIncomeSummary;
}
```

**UI Pattern**: Reuse Dashboard component structure

```
┌──────────────────────────────────────────────┐
│  ✓ Compliant                                 │
│  You've met the $580 requirement!            │
│                                              │
│  Total Income                                │
│  $650 / $580                                 │
│  ████████████████████░░░░  112%              │
│                                              │
│  Income Sources: 3 entries                   │
│  • Job A: $400/month                         │
│  • Uber: $150/month                          │
│  • Freelance: $100/month                     │
└──────────────────────────────────────────────┘
```

**States**:

- **Compliant** (>= $580): Green checkmark, success color
- **Not Compliant** (< $580): Warning icon, warning color
- **Close to Threshold** ($550-$579): Additional warning message

### 3. IncomeEntryList

**Purpose**: Display list of income entries for the month

**Location**: `src/components/income/IncomeEntryList.tsx`

**Props**:

```typescript
interface IncomeEntryListProps {
  entries: IncomeEntry[];
  onEdit: (entry: IncomeEntry) => void;
  onDelete: (entryId: number) => void;
}
```

**UI Pattern**: Similar to ActivityList, card-based layout

```
┌──────────────────────────────────────────────┐
│  March 15, 2027                              │
│  $400 (bi-weekly) → $868/month               │
│  Acme Corp                                   │
│  📎 1 document                               │
└──────────────────────────────────────────────┘
```

### 4. IncomeEntryForm

**Purpose**: Add/edit income entries with pay period conversion

**Location**: `src/components/income/IncomeEntryForm.tsx`

**Props**:

```typescript
interface IncomeEntryFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    entry: Omit<IncomeEntry, "id" | "createdAt" | "updatedAt">,
  ) => Promise<number | void>;
  onDelete?: () => void;
  selectedDate: Date | null;
  existingEntry?: IncomeEntry;
}
```

**UI Pattern**: Dialog form (similar to ActivityForm)

**Pay Period Selector Options**:

- Segmented control (ToggleButtonGroup) for mobile
- Radio buttons as alternative
- Options: Daily | Weekly | Bi-weekly | Monthly

**Calculation Display**:

```
Amount: $400
Pay Period: [Daily] [Weekly] [Bi-weekly] [Monthly]

Monthly Equivalent: $868.00
(Calculated: $400 × 2.17 pay periods/month)
```

**Seasonal Worker Section**:

```
☐ Mark as seasonal worker income
  (Uses 6-month average instead of single month)
```

**Document Attachment**:

- Reuses `DocumentCapture` component
- Same UI pattern as ActivityForm
- Stores in `incomeDocuments` and `incomeDocumentBlobs` tables

### 5. SeasonalWorkerView

**Purpose**: Display 6-month income history and rolling average

**Location**: `src/components/income/SeasonalWorkerView.tsx`

**Props**:

```typescript
interface SeasonalWorkerViewProps {
  history: Array<{ month: string; total: number }>;
  average: number;
  isCompliant: boolean;
}
```

**UI Pattern**: Mobile-friendly visualization

**Option 1: Bar Chart** (using simple CSS bars)

```
┌──────────────────────────────────────────────┐
│  6-Month Income History                      │
│                                              │
│  Oct 2026  ████████░░░░░░░░░░  $400         │
│  Nov 2026  ░░░░░░░░░░░░░░░░░░░░  $0         │
│  Dec 2026  ████████████████████  $800        │
│  Jan 2027  ████████░░░░░░░░░░  $400         │
│  Feb 2027  ░░░░░░░░░░░░░░░░░░░░  $0         │
│  Mar 2027  ████████████████████  $880        │
│                                              │
│  Total: $2,480                               │
│  6-Month Average: $413/month                 │
│                                              │
│  ⚠ Below $580 threshold                      │
└──────────────────────────────────────────────┘
```

**Option 2: List View** (simpler, more accessible)

```
┌──────────────────────────────────────────────┐
│  6-Month Income History                      │
│                                              │
│  October 2026      $400                      │
│  November 2026     $0                        │
│  December 2026     $800                      │
│  January 2027      $400                      │
│  February 2027     $0                        │
│  March 2027        $880                      │
│  ─────────────────────────                   │
│  Total             $2,480                    │
│  Average/Month     $413                      │
│                                              │
│  ⚠ Below $580 threshold                      │
└──────────────────────────────────────────────┘
```

## Pay Period Conversion Logic

### Conversion Multipliers

```typescript
// Income threshold based on federal minimum wage
// $7.25 × 80 hours = $580
// This should be configurable in case minimum wage changes
const FEDERAL_MINIMUM_WAGE = 7.25;
const REQUIRED_HOURS = 80;
const INCOME_THRESHOLD = FEDERAL_MINIMUM_WAGE * REQUIRED_HOURS; // $580

const PAY_PERIOD_MULTIPLIERS = {
  daily: 30, // 30 days per month
  weekly: 4.33, // 52 weeks ÷ 12 months
  "bi-weekly": 2.17, // 26 pay periods ÷ 12 months
  monthly: 1, // No conversion needed
};

function calculateMonthlyEquivalent(
  amount: number,
  payPeriod: IncomeEntry["payPeriod"],
): number {
  const multiplier = PAY_PERIOD_MULTIPLIERS[payPeriod];
  return Math.round(amount * multiplier * 100) / 100; // Round to 2 decimals
}
```

### Example Calculations

| Amount | Pay Period | Multiplier | Monthly Equivalent |
| ------ | ---------- | ---------- | ------------------ |
| $150   | Daily      | 30         | $4,500             |
| $150   | Weekly     | 4.33       | $649.50            |
| $400   | Bi-weekly  | 2.17       | $868.00            |
| $650   | Monthly    | 1          | $650.00            |

## Seasonal Worker Calculation

### 6-Month Rolling Average

```typescript
async function calculateSeasonalAverage(
  userId: string,
  currentMonth: string,
): Promise<{
  average: number;
  history: Array<{ month: string; total: number }>;
}> {
  // Get current month and previous 5 months
  const months = getLast6Months(currentMonth);

  const history: Array<{ month: string; total: number }> = [];
  let totalIncome = 0;

  for (const month of months) {
    const entries = await db.incomeEntries
      .where("date")
      .between(`${month}-01`, `${month}-31`)
      .and((entry) => entry.userId === userId)
      .toArray();

    const monthTotal = entries.reduce(
      (sum, entry) => sum + entry.monthlyEquivalent,
      0,
    );

    history.push({ month, total: monthTotal });
    totalIncome += monthTotal;
  }

  const average = totalIncome / 6;

  return { average, history };
}

function getLast6Months(currentMonth: string): string[] {
  // Returns array of YYYY-MM strings for current month and previous 5
  // Example: ["2026-10", "2026-11", "2026-12", "2027-01", "2027-02", "2027-03"]
}
```

## Data Storage & Retrieval

### Storage Functions

**Location**: `src/lib/storage/income.ts`

```typescript
// Save income entry
export async function saveIncomeEntry(
  entry: Omit<IncomeEntry, "id" | "createdAt" | "updatedAt">,
): Promise<number> {
  const id = await db.incomeEntries.add({
    ...entry,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return id;
}

// Get income entries for a month
export async function getIncomeEntriesByMonth(
  userId: string,
  month: string, // YYYY-MM
): Promise<IncomeEntry[]> {
  return db.incomeEntries
    .where("date")
    .between(`${month}-01`, `${month}-31`)
    .and((entry) => entry.userId === userId)
    .toArray();
}

// Calculate monthly income summary
export async function getMonthlyIncomeSummary(
  userId: string,
  month: string,
): Promise<MonthlyIncomeSummary> {
  const entries = await getIncomeEntriesByMonth(userId, month);

  const totalIncome = entries.reduce(
    (sum, entry) => sum + entry.monthlyEquivalent,
    0,
  );

  // Calculate income breakdown by source
  const incomeBySource = entries.reduce(
    (acc, entry) => {
      const source = entry.source || "Unspecified";
      const existing = acc.find((item) => item.source === source);
      if (existing) {
        existing.monthlyEquivalent += entry.monthlyEquivalent;
      } else {
        acc.push({ source, monthlyEquivalent: entry.monthlyEquivalent });
      }
      return acc;
    },
    [] as Array<{ source: string; monthlyEquivalent: number }>,
  );

  const isSeasonalWorker = entries.some((entry) => entry.isSeasonalWorker);

  let seasonalData;
  if (isSeasonalWorker) {
    seasonalData = await calculateSeasonalAverage(userId, month);
  }

  const effectiveIncome = isSeasonalWorker
    ? seasonalData!.average
    : totalIncome;

  return {
    month,
    totalIncome,
    entryCount: entries.length,
    isCompliant: effectiveIncome >= INCOME_THRESHOLD,
    amountNeeded: Math.max(0, INCOME_THRESHOLD - effectiveIncome),
    isSeasonalWorker,
    seasonalAverage: seasonalData?.average,
    seasonalHistory: seasonalData?.history,
    incomeBySource,
  };
}

// Save/update compliance mode
export async function setComplianceMode(
  userId: string,
  month: string,
  mode: "hours" | "income",
): Promise<void> {
  const existing = await db.complianceModes.where({ userId, month }).first();

  if (existing) {
    await db.complianceModes.update(existing.id!, {
      mode,
      updatedAt: new Date(),
    });
  } else {
    await db.complianceModes.add({
      userId,
      month,
      mode,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

// Get compliance mode for month
export async function getComplianceMode(
  userId: string,
  month: string,
): Promise<"hours" | "income"> {
  const mode = await db.complianceModes.where({ userId, month }).first();

  return mode?.mode || "hours"; // Default to hours
}
```

### Income Document Storage

**Location**: `src/lib/storage/incomeDocuments.ts`

```typescript
// Reuse same pattern as activity documents
export async function saveIncomeDocument(
  incomeEntryId: number,
  blob: Blob,
  metadata: Omit<
    IncomeDocument,
    "id" | "incomeEntryId" | "blobId" | "createdAt"
  >,
): Promise<number> {
  // Save blob first
  const blobId = await db.incomeDocumentBlobs.add({
    blob,
    createdAt: new Date(),
  });

  // Save document metadata
  const docId = await db.incomeDocuments.add({
    incomeEntryId,
    blobId,
    ...metadata,
    createdAt: new Date(),
  });

  return docId;
}

// Get documents for income entry
export async function getDocumentsByIncomeEntry(
  incomeEntryId: number,
): Promise<IncomeDocument[]> {
  return db.incomeDocuments
    .where("incomeEntryId")
    .equals(incomeEntryId)
    .toArray();
}

// Get document blob
export async function getIncomeDocumentBlob(
  blobId: number,
): Promise<IncomeDocumentBlob | undefined> {
  return db.incomeDocumentBlobs.get(blobId);
}
```

## Export Functionality

### Export Data Structure

Update existing export to include income data:

```typescript
export interface ExportData {
  profile: UserProfile;
  exemption?: ExemptionScreening;
  complianceData: {
    month: string;
    mode: "hours" | "income";
    hoursData?: {
      activities: Activity[];
      summary: MonthlySummary;
      documents: Array<{ activity: Activity; documents: Document[] }>;
    };
    incomeData?: {
      entries: IncomeEntry[];
      summary: MonthlyIncomeSummary;
      documents: Array<{ entry: IncomeEntry; documents: IncomeDocument[] }>;
    };
  };
}
```

### Export Function Updates

**Location**: `src/lib/export/exportData.ts`

```typescript
export async function exportComplianceData(
  userId: string,
  month: string,
): Promise<ExportData> {
  const profile = await db.profiles.get(userId);
  const exemption = await getLatestExemption(userId);
  const mode = await getComplianceMode(userId, month);

  let hoursData, incomeData;

  if (mode === "hours") {
    // Export hours data (existing logic)
    hoursData = await exportHoursData(userId, month);
  } else {
    // Export income data (new logic)
    incomeData = await exportIncomeData(userId, month);
  }

  return {
    profile,
    exemption,
    complianceData: {
      month,
      mode,
      hoursData,
      incomeData,
    },
  };
}

async function exportIncomeData(userId: string, month: string) {
  const entries = await getIncomeEntriesByMonth(userId, month);
  const summary = await getMonthlyIncomeSummary(userId, month);

  // Get documents for each entry
  const documents = await Promise.all(
    entries.map(async (entry) => ({
      entry,
      documents: await getDocumentsByIncomeEntry(entry.id!),
    })),
  );

  return { entries, summary, documents };
}
```

## Help Content Integration

### Income Tracking Help

**Location**: `src/components/help/IncomeTrackingHelp.tsx`

Reuse existing help content from `src/content/helpText.ts`:

- `incomeDefinitions.threshold` - Include note about threshold being based on federal minimum wage and subject to change
- `incomeDefinitions.seasonalWorker` - Include IRS definition (section 45R(d)(5)(B)) and examples (farm work, holiday retail, summer tourism, ski resorts, fishing industry)
- `incomeDefinitions.incomeVsHours`
- `incomeDefinitions.earnedVsUnearned` - Include disclaimer about regulatory clarification pending
- `incomeDefinitions.gigEconomy` - NEW: Specific guidance for Uber, DoorDash, Instacart, etc.

Display in dialog or expandable section, similar to `ActivityFormHelp`.

### Document Verification Help

Extend existing `DocumentVerificationHelp` component to include income document examples:

- Pay stubs (traditional employment)
- Bank statements (showing deposits)
- Gig work app screenshots (Uber earnings, DoorDash weekly summary, Instacart payment history)
- 1099 forms (self-employment, contract work)
- Self-employment records (invoices, receipts)
- Payment platform screenshots (PayPal, Venmo for business, Cash App for business)

## Error Handling

### Validation Rules

```typescript
function validateIncomeEntry(entry: Partial<IncomeEntry>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!entry.amount || entry.amount <= 0) {
    errors.amount = "Amount must be greater than $0";
  }

  if (entry.amount && entry.amount > 100000) {
    errors.amount = "Amount seems unusually high. Please verify.";
  }

  if (!entry.date) {
    errors.date = "Date is required";
  }

  if (!entry.payPeriod) {
    errors.payPeriod = "Pay period is required";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
```

### User Feedback

- Show validation errors inline in form
- Display success message after saving
- Show warning if switching modes
- Alert if income is close to but below threshold

## Testing Strategy

### Unit Tests

**Location**: `src/lib/storage/__tests__/income.test.ts`

Test coverage:

- Pay period conversion calculations
- Monthly income summary calculations
- Seasonal worker 6-month averaging
- Compliance mode switching
- Data persistence and retrieval

### Integration Tests

**Location**: `src/components/income/__tests__/`

Test coverage:

- Income entry form submission
- Document attachment to income entries
- Mode switching with data preservation
- Seasonal worker UI display
- Export functionality with income data

### Manual Testing Checklist

- [ ] Add income entry with each pay period type
- [ ] Verify monthly equivalent calculations
- [ ] Attach documents to income entries
- [ ] Switch between hours and income modes
- [ ] Verify data preservation when switching
- [ ] Test seasonal worker 6-month averaging
- [ ] Export income data and verify format
- [ ] Test on mobile devices (iOS and Android)
- [ ] Test offline functionality
- [ ] Verify compliance status indicators

## Implementation Phases

### Phase 1: Core Data Layer (Priority: High)

- Database schema updates (Version 5)
- TypeScript interfaces
- Storage functions (`income.ts`, `incomeDocuments.ts`)
- Pay period conversion logic
- Unit tests for calculations

### Phase 2: Basic UI Components (Priority: High)

- `ComplianceModeSelector`
- `IncomeEntryForm` (without seasonal worker)
- `IncomeEntryList`
- `IncomeStatusIndicator`
- Reuse `DocumentCapture` for income documents

### Phase 3: Seasonal Worker Feature (Priority: Medium)

- 6-month averaging calculation
- `SeasonalWorkerView` component
- Seasonal worker toggle in form
- Help content for seasonal workers

### Phase 4: Export & Polish (Priority: Medium)

- Update export functionality
- Help content integration
- Error handling and validation
- Mobile responsiveness testing

### Phase 5: Testing & Documentation (Priority: Low)

- Integration tests
- Manual testing on devices
- User documentation updates
- Performance optimization

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Load income data only when in income mode
2. **Memoization**: Cache monthly summaries and seasonal calculations
3. **Debouncing**: Debounce pay period conversion calculations
4. **Pagination**: If user has many income entries, paginate the list
5. **Image Compression**: Reuse existing compression for income documents

### Database Indexing

Ensure efficient queries:

- Index on `date` for range queries
- Index on `userId` for user-specific queries
- Compound index on `userId, date` for optimal performance

## Accessibility

### WCAG 2.1 AA Compliance

- All form inputs have proper labels
- Color is not the only indicator of status (use icons + text)
- Keyboard navigation support for all interactive elements
- Screen reader announcements for status changes
- Sufficient color contrast (4.5:1 minimum)
- Touch targets at least 44x44px on mobile

### Semantic HTML

- Use proper heading hierarchy
- Form elements with associated labels
- ARIA labels where needed
- Focus management in dialogs

## Security & Privacy

### Data Protection

- All income data stored locally in IndexedDB
- No transmission to external servers
- Sensitive data (amounts, sources) never logged
- Document blobs stored separately from metadata
- User can delete income entries and documents at any time

### Input Sanitization

- Validate all numeric inputs
- Sanitize text inputs (source/employer names)
- Prevent XSS in user-generated content
- Validate file types for document uploads

## Migration Strategy

### Existing Users

- No migration needed (new feature, no existing data)
- Default to "hours" mode for existing users
- Show onboarding tooltip explaining income tracking option
- Preserve all existing hours data

### Database Version Upgrade

```typescript
// Version 5 upgrade
this.version(5)
  .stores({
    // ... existing tables
    incomeEntries: "++id, date, userId, isSeasonalWorker",
    incomeDocuments: "++id, incomeEntryId, type, createdAt",
    incomeDocumentBlobs: "++id",
    complianceModes: "++id, month, userId",
  })
  .upgrade(() => {
    console.log("Added income tracking tables to database");
  });
```

## Future Enhancements (Out of Scope)

- Automatic income detection from bank statements (OCR)
- Income forecasting based on historical data
- Multi-currency support
- Income categories/tags
- Recurring income entries
- Income vs. hours comparison analytics
- Export to PDF with formatted income report

## References

- **HR1 Legislation**: Section 71119(xx)(2)(F-G)
- **Help Text**: `src/content/helpText.ts` (incomeDefinitions)
- **Existing Components**: `Dashboard.tsx`, `ActivityForm.tsx`, `DocumentCapture.tsx`
- **Database**: `src/lib/db.ts`
- **Types**: `src/types/index.ts`

---

## Summary

This design document outlines a comprehensive approach to implementing income tracking in HourKeep by:

1. **Reusing existing patterns**: Document capture, status indicators, form layouts
2. **Maintaining consistency**: Income UI mirrors hours UI for familiarity
3. **Supporting flexibility**: Users can switch between modes monthly
4. **Enabling seasonal workers**: 6-month averaging for variable income
5. **Preserving privacy**: All data stored locally, no external transmission
6. **Ensuring accessibility**: WCAG 2.1 AA compliant, mobile-optimized

The implementation follows a phased approach, starting with core data layer and basic UI, then adding seasonal worker features and export functionality. All components leverage existing Material-UI patterns and maintain the mobile-first, offline-capable architecture of HourKeep.

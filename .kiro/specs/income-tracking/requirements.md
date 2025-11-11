# Requirements Document: Income Tracking Feature

## Introduction

This document outlines the requirements for implementing income tracking as an alternative compliance method for Medicaid work requirements in the HourKeep application. Under HR1 Section 71119, beneficiaries can meet work requirements by either:

- Completing 80 hours per month of community engagement activities, OR
- Earning at least $580 per month in earned income

This feature enables users to track their income instead of (or in addition to) tracking hours, providing flexibility for different work situations and aligning with legislative requirements.

## Glossary

- **Earned Income**: Income from working, including wages, self-employment income, tips, commissions, gig work earnings, and freelance income. Note: The distinction between earned and unearned income for Medicaid work requirements is subject to final CMS regulatory clarification. This app currently assumes only earned income counts toward the $580 threshold.
- **Unearned Income**: Income not from work, including SSI, SSDI, unemployment benefits, child support, gifts, investment income, and rental income (unless it's a business). These income types are assumed to NOT count toward work requirements, pending regulatory clarification.
- **Income Threshold**: The minimum monthly earned income ($580) that automatically satisfies work requirements without needing to track hours. This amount is calculated as 80 hours × federal minimum wage ($7.25) and may change if the federal minimum wage changes.
- **Seasonal Worker**: A worker whose income varies significantly by season and qualifies for 6-month income averaging. As defined in section 45R(d)(5)(B) of the Internal Revenue Code, this includes workers in industries where work is typically available for 6 months or less per year (e.g., farm work, holiday retail, summer tourism, ski resorts, fishing industry).
- **Pay Period**: The frequency at which income is received (daily, weekly, bi-weekly, monthly)
- **Monthly Equivalent**: The calculated monthly income amount based on pay period frequency
- **Compliance Mode**: The method a user chooses to demonstrate compliance for a given month (hours-based or income-based)
- **Income Entry**: A single record of earned income with amount, date, source, and optional documentation
- **6-Month Rolling Average**: The average monthly income calculated over the preceding 6 months, used for seasonal workers

## Requirements

### Requirement 1: Income Tracking Mode Selection

**User Story:** As a Medicaid beneficiary, I want to choose whether to track hours or income for each month, so that I can use the compliance method that works best for my situation.

#### Acceptance Criteria

1. WHEN a user who is not exempt accesses the dashboard, THE HourKeep System SHALL display a compliance mode selector allowing the user to choose between "Track Hours" and "Track Income" for the current month
2. WHEN a user selects "Track Income" mode for a month, THE HourKeep System SHALL display the income tracking interface instead of the hours tracking calendar
3. WHEN a user switches from "Track Hours" to "Track Income" mode for a month, THE HourKeep System SHALL preserve all previously logged hours data for that month without counting it toward compliance
4. WHEN a user switches from "Track Income" to "Track Hours" mode for a month, THE HourKeep System SHALL preserve all previously logged income data for that month without counting it toward compliance
5. WHEN a user attempts to switch compliance modes for a month, THE HourKeep System SHALL display a warning message informing the user that their data will be preserved but only one method will count toward compliance

_Requirements: HR1 Section 71119(xx)(2)(F), User feedback on flexibility_

### Requirement 2: Income Entry Interface

**User Story:** As a Medicaid beneficiary, I want to log my income throughout the month with dates and amounts using an elegant interface, so that I can track whether I'm meeting the $580 threshold.

#### Acceptance Criteria

1. WHEN a user is in "Track Income" mode, THE HourKeep System SHALL provide an interface to add income entries with the following fields: amount (required), date (required), source/employer (optional), and pay period frequency (daily, weekly, bi-weekly, or monthly)
2. WHEN a user enters an income amount, THE HourKeep System SHALL accept positive decimal values in US dollar format
3. WHEN a user selects a pay period frequency, THE HourKeep System SHALL use an elegant, industry-standard UI pattern (such as segmented control, radio buttons, or dropdown) that is mobile-friendly
4. WHEN a user adds multiple income entries for a month, THE HourKeep System SHALL calculate and display the total monthly income by summing the monthly equivalents across all entries
5. WHEN a user views their income entries for a month, THE HourKeep System SHALL display each entry with date, amount, source, pay period, and calculated monthly equivalent
6. WHEN calculating total monthly income, THE HourKeep System SHALL prevent double-counting by validating that entries with the same date, amount, and source are not duplicates

_Requirements: HR1 Section 71119(xx)(2)(F), User feedback on multiple income sources and elegant UI patterns_

### Requirement 3: Pay Period Conversion

**User Story:** As a Medicaid beneficiary who is paid daily, weekly, bi-weekly, or monthly, I want the app to automatically calculate my monthly income equivalent, so that I don't have to do the math myself.

#### Acceptance Criteria

1. WHEN a user enters income with "daily" pay period, THE HourKeep System SHALL calculate monthly equivalent by multiplying the amount by 30
2. WHEN a user enters income with "weekly" pay period, THE HourKeep System SHALL calculate monthly equivalent by multiplying the amount by 4.33 (52 weeks ÷ 12 months)
3. WHEN a user enters income with "bi-weekly" pay period, THE HourKeep System SHALL calculate monthly equivalent by multiplying the amount by 2.17 (26 pay periods ÷ 12 months)
4. WHEN a user enters income with "monthly" pay period, THE HourKeep System SHALL use the entered amount as the monthly equivalent without conversion
5. WHEN the monthly equivalent is calculated, THE HourKeep System SHALL display both the original amount with pay period and the calculated monthly equivalent to the user

_Requirements: HR1 Section 71119(xx)(2)(F), ROADMAP income tracking feature_

### Requirement 4: Income Documentation

**User Story:** As a Medicaid beneficiary, I want to attach documents to my income entries (like pay stubs or app screenshots), so that I have proof of my income when I need to verify compliance.

#### Acceptance Criteria

1. WHEN a user creates or edits an income entry, THE HourKeep System SHALL provide the ability to attach one or more document images to that entry
2. WHEN a user attaches a document to an income entry, THE HourKeep System SHALL reuse the existing document capture (camera) and upload components from the activity hour tracking feature
3. WHEN a user views an income entry with attached documents, THE HourKeep System SHALL display thumbnails of the attached documents using the same UI pattern as activity hour tracking
4. WHEN a user taps on a document thumbnail, THE HourKeep System SHALL display the full-size document image using the same viewer as activity hour tracking
5. WHEN a user exports their compliance data, THE HourKeep System SHALL include all income entry documents in the export

_Requirements: HR1 Section 71119(xx)(5), CFA Service Blueprint verification requirements, Reuse existing components_

### Requirement 5: Earned vs. Unearned Income Guidance

**User Story:** As a Medicaid beneficiary, I want clear guidance on what types of income count toward the $580 threshold, so that I don't mistakenly count unearned income.

#### Acceptance Criteria

1. WHEN a user accesses the income tracking interface, THE HourKeep System SHALL display a help icon or link providing guidance on earned vs. unearned income
2. WHEN a user views the earned income help content, THE HourKeep System SHALL display a list of income types that count (wages, self-employment, tips, commissions, gig work including Uber/DoorDash/Instacart, freelance income, contract work)
3. WHEN a user views the earned income help content, THE HourKeep System SHALL display a list of income types that do NOT count (SSI, SSDI, unemployment, child support, gifts, investment income, rental income unless it's a business)
4. WHEN a user views the earned income help content, THE HourKeep System SHALL provide examples in plain language (8th grade reading level) including specific gig economy examples
5. WHEN a user views the earned income help content, THE HourKeep System SHALL include edge case examples similar to the activity tracking help text
6. WHEN a user views the earned income help content, THE HourKeep System SHALL display a disclaimer that the distinction between earned and unearned income is subject to final CMS regulatory clarification

_Requirements: HR1 Section 71119(xx)(2)(F), helpText.ts income definitions_

### Requirement 6: Income Compliance Status

**User Story:** As a Medicaid beneficiary, I want to see my current income total and whether I've met the $580 threshold, so that I know if I'm on track for the month.

#### Acceptance Criteria

1. WHEN a user is in "Track Income" mode, THE HourKeep System SHALL display a dashboard status indicator showing total income for the current month using the same UI/UX pattern as the hours tracking status
2. WHEN the user's total monthly income is less than $580, THE HourKeep System SHALL display a warning status indicating the user has not yet met the threshold, consistent with the hours tracking warning status design
3. WHEN the user's total monthly income is $580 or more, THE HourKeep System SHALL display a success status indicating the user has met the income requirement, consistent with the hours tracking success status design
4. WHEN the user's total monthly income is between $550 and $579, THE HourKeep System SHALL display an additional warning that the user is close to but below the threshold
5. WHEN a user views the income compliance status, THE HourKeep System SHALL display the amount remaining to reach $580 (if below threshold) or the amount over $580 (if above threshold)

_Requirements: HR1 Section 71119(xx)(2)(F), User feedback on dashboard status and consistent experience_

### Requirement 7: Seasonal Worker Income Averaging

**User Story:** As a seasonal worker, I want to calculate my income based on a 6-month average instead of just one month, so that I can meet requirements even when my income varies by season.

#### Acceptance Criteria

1. WHEN a user adds an income entry, THE HourKeep System SHALL provide an option to mark the entry as "seasonal worker income"
2. WHEN a user marks an income entry as seasonal worker income, THE HourKeep System SHALL calculate the 6-month rolling average of all income entries from the current month and the preceding 5 months
3. WHEN the 6-month rolling average is calculated, THE HourKeep System SHALL divide the total income from the 6-month period by 6 to determine the average monthly income
4. WHEN the 6-month average monthly income is $580 or more, THE HourKeep System SHALL indicate that the user meets work requirements as a seasonal worker
5. WHEN a user views seasonal worker status, THE HourKeep System SHALL display the 6-month total income, the calculated average monthly income, and whether the average meets the $580 threshold

_Requirements: HR1 Section 71119(xx)(2)(G), helpText.ts seasonal worker definition_

### Requirement 8: Seasonal Worker UI Display

**User Story:** As a seasonal worker, I want to see my 6-month income history and rolling average in a clear, mobile-friendly format, so that I understand how my seasonal income is calculated.

#### Acceptance Criteria

1. WHEN a user has marked income as seasonal worker income, THE HourKeep System SHALL display a 6-month income summary view showing income totals for each of the past 6 months
2. WHEN the 6-month income summary is displayed, THE HourKeep System SHALL use a mobile-friendly visualization (such as a bar chart or list with visual indicators)
3. WHEN the 6-month income summary is displayed, THE HourKeep System SHALL clearly show the calculated 6-month average monthly income
4. WHEN the 6-month income summary is displayed, THE HourKeep System SHALL indicate whether the average meets the $580 threshold
5. WHEN a user views the seasonal worker calculation, THE HourKeep System SHALL provide help text explaining how the 6-month average is calculated

_Requirements: HR1 Section 71119(xx)(2)(G), User feedback on mobile-friendly design_

### Requirement 9: Income Data Storage

**User Story:** As a Medicaid beneficiary, I want my income data to be stored indefinitely, so that I have a complete history for renewals and verification.

#### Acceptance Criteria

1. WHEN a user adds an income entry, THE HourKeep System SHALL store the entry in the local IndexedDB database with all associated data (amount, date, source, pay period, documents, seasonal worker flag)
2. WHEN income data is stored, THE HourKeep System SHALL retain the data indefinitely without automatic deletion
3. WHEN a user switches between compliance modes, THE HourKeep System SHALL preserve all income data and all hours data for the month
4. WHEN calculating seasonal worker averages, THE HourKeep System SHALL access income data from the current month and the preceding 5 months
5. WHEN a user exports compliance data, THE HourKeep System SHALL include all income entries with their associated metadata and documents

_Requirements: HR1 Section 71119(xx)(5), User feedback on data retention_

### Requirement 10: Income Data Export Capability

**User Story:** As a Medicaid beneficiary, I want my income tracking data and documentation to be exportable, so that I can submit it to my state Medicaid agency when needed.

#### Acceptance Criteria

1. WHEN a user exports compliance data for a month where income tracking was used, THE HourKeep System SHALL include all income entries with dates, amounts, sources, and pay periods in the export data structure
2. WHEN income data is exported, THE HourKeep System SHALL include the total monthly income and whether the $580 threshold was met
3. WHEN seasonal worker income is exported, THE HourKeep System SHALL include the 6-month income history and calculated average
4. WHEN income data is exported, THE HourKeep System SHALL include all attached documentation images
5. WHEN income entries and documents are stored, THE HourKeep System SHALL ensure the data structure is compatible with the existing export functionality

_Requirements: HR1 Section 71119(xx)(6), CFA Service Blueprint verification requirements, Future export overhaul compatibility_

### Requirement 11: Multiple Income Sources

**User Story:** As a Medicaid beneficiary with multiple jobs or income sources, I want to add separate income entries for each source, so that I can track all my income and see if the total meets the $580 threshold.

#### Acceptance Criteria

1. WHEN a user has multiple income sources in a month, THE HourKeep System SHALL allow the user to add separate income entries for each source
2. WHEN multiple income entries exist for a month, THE HourKeep System SHALL calculate the total monthly income by summing the monthly equivalents of all entries
3. WHEN a user views their income entries, THE HourKeep System SHALL display each source separately with its amount, pay period, and calculated monthly equivalent
4. WHEN a user exports income data with multiple sources, THE HourKeep System SHALL list each income source separately with monthly equivalents and show the total
5. WHEN calculating compliance, THE HourKeep System SHALL determine if the sum of all monthly equivalents meets or exceeds $580
6. WHEN displaying total income, THE HourKeep System SHALL show a breakdown by source to help users understand how the total was calculated

_Requirements: HR1 Section 71119(xx)(2)(F), User feedback on multiple income sources_

### Requirement 12: Mode Switching Warning

**User Story:** As a Medicaid beneficiary, I want to be warned before I switch between hours and income tracking modes, so that I understand what will happen to my data.

#### Acceptance Criteria

1. WHEN a user attempts to switch from "Track Hours" to "Track Income" mode, THE HourKeep System SHALL display a modal dialog warning the user about the mode change
2. WHEN the mode switching warning is displayed, THE HourKeep System SHALL explain that hours data will be preserved but will not count toward compliance while in income mode
3. WHEN the mode switching warning is displayed, THE HourKeep System SHALL provide "Cancel" and "Continue" options
4. WHEN a user selects "Cancel" on the mode switching warning, THE HourKeep System SHALL keep the user in their current mode without making changes
5. WHEN a user selects "Continue" on the mode switching warning, THE HourKeep System SHALL switch the compliance mode and update the dashboard interface

_Requirements: User feedback on data preservation, UX best practices_

### Requirement 13: Income Tracking Help Content

**User Story:** As a Medicaid beneficiary, I want access to comprehensive help content about income tracking, so that I understand how to use this feature correctly.

#### Acceptance Criteria

1. WHEN a user accesses income tracking help, THE HourKeep System SHALL display the income threshold definition ($580 = 80 hours × $7.25 federal minimum wage) and note that this threshold may change if the federal minimum wage changes
2. WHEN a user accesses income tracking help, THE HourKeep System SHALL display examples of what types of income count (including gig economy work) and what types don't count
3. WHEN a user accesses income tracking help, THE HourKeep System SHALL display edge case examples (e.g., "I earn $600 per month from my job" = meets requirements, "I drive for Uber and made $650 this month" = meets requirements)
4. WHEN a user accesses income tracking help, THE HourKeep System SHALL display seasonal worker information including the IRS definition and how 6-month averaging works
5. WHEN a user accesses income tracking help, THE HourKeep System SHALL display information about the "Income OR Hours" choice and that only one method counts per month
6. WHEN a user accesses income tracking help, THE HourKeep System SHALL display guidance specific to gig workers on acceptable documentation (app screenshots, 1099 forms, payment summaries)

_Requirements: helpText.ts income definitions, HR1 Section 71119(xx)(2)(F-G)_

### Requirement 14: Exemption Flow Integration

**User Story:** As a Medicaid beneficiary, I want the exemption screener to run first before I'm asked to track income or hours, so that I don't waste time tracking if I'm already exempt.

#### Acceptance Criteria

1. WHEN a new user completes onboarding, THE HourKeep System SHALL direct the user to the exemption screener before showing compliance tracking options
2. WHEN a user is determined to be exempt from work requirements, THE HourKeep System SHALL not display the compliance mode selector (hours vs. income)
3. WHEN a user is determined to be NOT exempt from work requirements, THE HourKeep System SHALL display the compliance mode selector on the dashboard
4. WHEN a user's exemption status changes, THE HourKeep System SHALL update the dashboard to show or hide compliance tracking options accordingly
5. WHEN an exempt user views the dashboard, THE HourKeep System SHALL display their exemption status and explain that they do not need to track hours or income

_Requirements: HR1 Section 71119(xx)(3), User feedback on exemption flow_

---

## Summary

This requirements document defines 14 user stories with 70 acceptance criteria for implementing income tracking as an alternative compliance method in HourKeep. The feature enables users to:

- Choose between hours-based and income-based compliance tracking each month
- Log multiple income entries with dates, amounts, and documentation
- Automatically calculate monthly equivalents for different pay periods
- Track seasonal worker income using 6-month rolling averages
- View clear compliance status and warnings
- Export comprehensive income data for state agency verification

All requirements are derived from HR1 Section 71119, the CFA Service Blueprint, existing help text content, and user feedback on flexibility and usability.

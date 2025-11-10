# Requirements Document: Activity Definitions Help Text

## Introduction

This feature adds clear, plain-language help text throughout the HourKeep application to help users understand what activities and income count toward Medicaid work requirements. Users currently don't know what qualifies as "work," "volunteer," "education," or qualifying income, leading to confusion about what to log and how to meet the 80-hour or $580/month requirements.

The help text will be derived directly from HR1 legislation (Section 71119) and the CFA Service Blueprint, ensuring accuracy while maintaining accessibility through mobile-first, plain-language design.

## Glossary

- **Community Engagement**: Activities that count toward the 80-hour monthly requirement (work, volunteer, education, work programs)
- **Work Program**: Job training or workforce development programs as defined in the Food and Nutrition Act
- **Educational Program**: Half-time or more enrollment in higher education or career/technical education programs
- **Qualifying Income**: Monthly income of at least $580 (80 hours × federal minimum wage of $7.25)
- **Seasonal Worker**: Worker whose income is averaged over 6 months to meet the $580/month threshold
- **Help Text**: Contextual information that explains what counts toward requirements
- **Tooltip**: Small expandable text that appears near form fields
- **Collapsible Section**: Expandable/collapsible content area for additional details

## Requirements

### Requirement 1: Activity Tracking Form Help Text

**User Story:** As a Medicaid beneficiary logging my hours, I want to understand what activities count toward my work requirements, so that I can accurately track my compliance.

#### Acceptance Criteria

1. WHEN the user views the activity tracking form, THE System SHALL display help text for each activity type (work, volunteer, education, work program) that explains what qualifies
2. WHEN the user taps or hovers on a help icon next to an activity type, THE System SHALL display a tooltip with the definition and examples
3. WHEN the user views work activity help text, THE System SHALL explain that paid employment of at least 80 hours per month counts
4. WHEN the user views volunteer activity help text, THE System SHALL explain that unpaid community service of at least 80 hours per month counts
5. WHEN the user views education activity help text, THE System SHALL explain that half-time or more enrollment in educational programs counts
6. WHEN the user views work program activity help text, THE System SHALL explain that participation in job training or workforce development programs counts
7. WHEN the user views any activity help text, THE System SHALL include at least one example of what counts
8. WHEN the user views any activity help text, THE System SHALL include at least one example of what does NOT count (such as "job searching does not count")

### Requirement 2: Income Tracking Help Text

**User Story:** As a Medicaid beneficiary tracking my income, I want to understand what types of income count toward the $580/month requirement, so that I know if I'm meeting work requirements through income alone.

#### Acceptance Criteria

1. WHEN the user views the income tracking section, THE System SHALL display help text explaining the $580/month income threshold
2. WHEN the user views income help text, THE System SHALL explain that $580/month equals 80 hours at federal minimum wage ($7.25/hour)
3. WHEN the user views income help text, THE System SHALL explain what types of income count (earned income from employment)
4. WHEN the user views income help text, THE System SHALL explain the seasonal worker provision (6-month average for seasonal workers)
5. WHEN the user views income help text, THE System SHALL provide examples of qualifying income sources
6. WHEN the user views income help text, THE System SHALL be accessible via a help icon or expandable section

### Requirement 3: Combination Activities Help Text

**User Story:** As a Medicaid beneficiary doing multiple activities, I want to understand that I can combine different activities to reach 80 hours, so that I know all my efforts count.

#### Acceptance Criteria

1. WHEN the user views the activity tracking form, THE System SHALL display help text explaining that activities can be combined to reach 80 hours
2. WHEN the user views combination help text, THE System SHALL provide an example of combining activities (e.g., "40 hours work + 40 hours volunteer = 80 hours")
3. WHEN the user views combination help text, THE System SHALL explain that the total must equal at least 80 hours per month

### Requirement 4: Main Dashboard Guidance

**User Story:** As a new user of HourKeep, I want to see guidance on the main page about what I need to do, so that I understand how to use the app to maintain my Medicaid coverage.

#### Acceptance Criteria

1. WHEN the user views the main dashboard, THE System SHALL display a brief guidance section explaining the key steps to maintain compliance
2. WHEN the user views dashboard guidance, THE System SHALL explain to use the exemption screener first
3. WHEN the user views dashboard guidance, THE System SHALL explain to click on calendar days to log hours
4. WHEN the user views dashboard guidance, THE System SHALL explain to review monthly totals at the bottom
5. WHEN the user views dashboard guidance, THE System SHALL explain to export and share data with state agencies
6. WHEN the user views dashboard guidance, THE System SHALL be concise and mobile-friendly (no more than 5-6 bullet points)
7. WHEN the user views dashboard guidance, THE System SHALL be dismissible or collapsible after first viewing

### Requirement 5: Edge Cases and Scenarios

**User Story:** As a Medicaid beneficiary with questions about specific situations, I want to see examples of edge cases, so that I can understand if my situation qualifies.

#### Acceptance Criteria

1. WHEN the user views activity help text, THE System SHALL provide a collapsible "Examples & Edge Cases" section
2. WHEN the user expands the edge cases section, THE System SHALL display at least 2-3 scenario examples
3. WHEN the user views edge case examples, THE System SHALL include scenarios like gig work, informal employment, or multiple part-time jobs
4. WHEN the user views edge case examples, THE System SHALL clearly state what counts and what doesn't count
5. WHEN the user views edge case examples, THE System SHALL be formatted for mobile readability (short paragraphs, clear headings)

### Requirement 6: Plain Language and Accessibility

**User Story:** As a Medicaid beneficiary with varying literacy levels, I want help text written in plain language, so that I can easily understand what I need to do.

#### Acceptance Criteria

1. WHEN the System displays any help text, THE System SHALL use plain language (8th grade reading level or below)
2. WHEN the System displays any help text, THE System SHALL avoid legal jargon and policy terminology
3. WHEN the System displays any help text, THE System SHALL use active voice and short sentences
4. WHEN the System displays any help text, THE System SHALL meet WCAG 2.1 AA accessibility standards
5. WHEN the System displays any help text, THE System SHALL be readable on mobile devices (minimum 16px font size)
6. WHEN the System displays any help text, THE System SHALL use sufficient color contrast (4.5:1 minimum)

### Requirement 7: Source Accuracy

**User Story:** As a state Medicaid agency, I want help text to accurately reflect HR1 legislation requirements, so that beneficiaries receive correct information about compliance.

#### Acceptance Criteria

1. WHEN the System displays work activity definitions, THE System SHALL accurately reflect HR1 Section 71119(xx)(2)(A) (works not less than 80 hours)
2. WHEN the System displays volunteer activity definitions, THE System SHALL accurately reflect HR1 Section 71119(xx)(2)(B) (completes not less than 80 hours of community service)
3. WHEN the System displays education activity definitions, THE System SHALL accurately reflect HR1 Section 71119(xx)(2)(D) (enrolled in educational program at least half-time)
4. WHEN the System displays work program definitions, THE System SHALL accurately reflect HR1 Section 71119(xx)(2)(C) (participates in work program for not less than 80 hours)
5. WHEN the System displays income threshold information, THE System SHALL accurately reflect HR1 Section 71119(xx)(2)(F) (monthly income not less than minimum wage × 80 hours)
6. WHEN the System displays seasonal worker information, THE System SHALL accurately reflect HR1 Section 71119(xx)(2)(G) (average monthly income over preceding 6 months)
7. WHEN the System displays what does NOT count, THE System SHALL accurately reflect that job searching is not a qualifying activity per the CFA Service Blueprint

### Requirement 8: Mobile-First Design

**User Story:** As a Medicaid beneficiary primarily using a smartphone, I want help text optimized for mobile viewing, so that I can easily read and understand it on my device.

#### Acceptance Criteria

1. WHEN the user views help text on a mobile device, THE System SHALL display text in a mobile-optimized format (no horizontal scrolling)
2. WHEN the user views help text on a mobile device, THE System SHALL use touch-friendly interaction patterns (minimum 44px touch targets)
3. WHEN the user views collapsible sections on mobile, THE System SHALL expand/collapse smoothly without page jumps
4. WHEN the user views tooltips on mobile, THE System SHALL display them in a modal or bottom sheet (not hover-based)
5. WHEN the user views help text on mobile, THE System SHALL maintain readability at standard mobile viewport sizes (320px minimum width)

# Implementation Plan: Activity Definitions Help Text

## Task Overview

This implementation plan breaks down the activity definitions help text feature into discrete, manageable coding tasks. Each task builds incrementally on previous work and focuses on implementing specific components or content.

---

## Phase 1: Foundation and Content

- [ ] Task 1: Create help text content structure

- [ ] 1.1 Create `src/content/helpText.ts` file with TypeScript types
  - Define `ActivityDefinition` interface
  - Define `IncomeDefinition` interface
  - Define `EdgeCaseExample` interface
  - Define `DashboardGuidanceStep` interface
  - _Requirements: 1.1, 2.1, 7.1-7.7_

- [ ] 1.2 Add work activity definitions to `helpText.ts`
  - Add title, definition, examples, counter-examples
  - Add 3 edge case scenarios with counts/explanation
  - Include HR1 source reference (Section 71119(xx)(2)(A))
  - _Requirements: 1.3, 5.2-5.4, 7.1_

- [ ] 1.3 Add volunteer activity definitions to `helpText.ts`
  - Add title, definition, examples, counter-examples
  - Add 2 edge case scenarios
  - Include HR1 source reference (Section 71119(xx)(2)(B))
  - _Requirements: 1.4, 5.2-5.4, 7.2_

- [ ] 1.4 Add education activity definitions to `helpText.ts`
  - Add title, definition, examples, counter-examples
  - Add 2 edge case scenarios
  - Include HR1 source reference (Section 71119(xx)(2)(D))
  - _Requirements: 1.5, 5.2-5.4, 7.3_

- [ ] 1.5 Add work program definitions to `helpText.ts`
  - Add title, definition, examples, counter-examples
  - Add 1-2 edge case scenarios
  - Include HR1 source reference (Section 71119(xx)(2)(C))
  - _Requirements: 1.6, 5.2-5.4, 7.4_

- [ ] 1.6 Add income definitions to `helpText.ts`
  - Add threshold definition with calculation
  - Add "what counts" and "what doesn't count" sections
  - Add seasonal worker definition with calculation steps
  - Add income vs hours comparison
  - Add 3-4 edge case scenarios for income
  - Include HR1 source references (Sections 71119(xx)(2)(F) and (G))
  - _Requirements: 2.1-2.5, 7.5-7.6_

- [ ] 1.7 Add combination rules to `helpText.ts`
  - Add definition and examples of combining activities
  - Add note about 80-hour minimum
  - Include HR1 source reference (Section 71119(xx)(2)(E))
  - _Requirements: 3.1-3.3_

- [ ] 1.8 Add dashboard guidance content to `helpText.ts`
  - Add 4 guidance steps (exemption, calendar, review, export)
  - Include icons and action links for each step
  - _Requirements: 4.1-4.6_

- [ ] 1.9 Add "job searching doesn't count" to counter-examples
  - Add to work activity counter-examples
  - Add to edge cases with clear explanation
  - Reference CFA Service Blueprint source
  - _Requirements: 1.8, 7.7_

---

## Phase 2: Core Help Components

- [ ] Task 2: Build HelpTooltip component

- [ ] 2.1 Create `src/components/help/HelpTooltip.tsx` component
  - Create component with TypeScript props interface
  - Add info icon with 44px minimum touch target
  - Implement desktop tooltip using MUI Tooltip
  - _Requirements: 1.1-1.2, 8.2_

- [ ] 2.2 Implement mobile bottom sheet for HelpTooltip
  - Detect mobile viewport (< 600px)
  - Create bottom sheet modal for mobile
  - Add slide-up animation (250ms ease-out)
  - Add semi-transparent backdrop
  - Add close button
  - _Requirements: 1.2, 8.1, 8.3-8.4_

- [ ] 2.3 Add content rendering to HelpTooltip
  - Render title, definition, examples, counter-examples
  - Format examples as bulleted list
  - Format counter-examples with visual distinction
  - Use Typography components with proper hierarchy
  - _Requirements: 1.3-1.8, 6.1-6.3_

- [ ] 2.4 Add keyboard accessibility to HelpTooltip
  - Support Enter/Space to open
  - Support Escape to close
  - Manage focus correctly
  - Add proper ARIA labels and roles
  - _Requirements: 6.4_

- [ ] Task 3: Build HelpSection component (reuse exemption screener patterns)

- [ ] 3.1 Review existing exemption screener expandable sections
  - Identify reusable patterns and components
  - Check if there's already a collapsible/expandable component
  - Document what can be reused vs what needs to be built
  - _Requirements: 4.7, 8.3_

- [ ] 3.2 Create or extract `src/components/help/HelpSection.tsx` component
  - If exemption screener has reusable component, extract it
  - If not, create new component with TypeScript props interface
  - Use MUI Accordion component
  - Add chevron icon that rotates on expand/collapse
  - Implement smooth animation (300ms ease-in-out)
  - _Requirements: 4.7, 8.3_

- [ ] 3.3 Add content rendering to HelpSection
  - Render title in header
  - Render content in expandable area
  - Support both string and React node content
  - Add light background for expanded content
  - Match styling patterns from exemption screener
  - _Requirements: 6.1-6.3_

- [ ] 3.4 Apply HelpSection to exemption screener (if new component created)
  - Replace existing expandable sections with HelpSection component
  - Ensure consistent behavior across app
  - Test that exemption screener still works correctly
  - _Requirements: 4.7_

- [ ] Task 4: Build EdgeCaseExamples component

- [ ] 4.1 Create `src/components/help/EdgeCaseExamples.tsx` component
  - Create component with TypeScript props interface
  - Use HelpSection as wrapper (collapsed by default)
  - Map through edge case examples array
  - _Requirements: 5.1-5.2_

- [ ] 4.2 Render edge case scenarios
  - Display each scenario in card format
  - Show green checkmark (✓) for "counts: true"
  - Show red X (✗) for "counts: false"
  - Show warning icon for "counts: varies"
  - Display scenario text and explanation
  - _Requirements: 5.3-5.4_

- [ ] 4.3 Style EdgeCaseExamples for mobile
  - Ensure cards stack vertically on mobile
  - Use short paragraphs and clear headings
  - Maintain readability at 320px width
  - _Requirements: 5.5, 8.1, 8.5_

---

## Phase 3: Activity and Income Help

- [ ] Task 5: Build ActivityFormHelp component

- [ ] 5.1 Create `src/components/activities/ActivityFormHelp.tsx` component
  - Create component with TypeScript props interface
  - Accept activityType prop (work, volunteer, education, workProgram)
  - Import activity definitions from helpText.ts
  - _Requirements: 1.1-1.2_

- [ ] 5.2 Integrate HelpTooltip into ActivityFormHelp
  - Render HelpTooltip with activity-specific content
  - Pass title, definition, examples, counter-examples
  - Position inline with form fields
  - _Requirements: 1.3-1.7_

- [ ] 5.3 Integrate EdgeCaseExamples into ActivityFormHelp
  - Render EdgeCaseExamples below tooltip
  - Pass activity-specific edge cases
  - Ensure collapsible by default
  - _Requirements: 5.1-5.5_

- [ ] 5.4 Add ActivityFormHelp to activity tracking form
  - Place help icon next to each activity type selector
  - Ensure minimal visual weight
  - Test on mobile and desktop
  - _Requirements: 1.1-1.2, 8.1-8.5_

- [ ]  Task 6: Build IncomeHelp component

- [ ] 6.1 Create `src/components/income/IncomeHelp.tsx` component
  - Create component with TypeScript props interface
  - Import income definitions from helpText.ts
  - Support showSeasonalWorkerInfo prop
  - _Requirements: 2.1, 2.6_

- [ ] 6.2 Render income threshold help
  - Display $580/month threshold
  - Show calculation (80 hours × $7.25)
  - Render "what counts" section with examples
  - Render "what doesn't count" section with examples
  - _Requirements: 2.2-2.4_

- [ ] 6.3 Render seasonal worker help
  - Display seasonal worker definition
  - Show calculation steps
  - Provide example calculation
  - Conditionally show based on prop
  - _Requirements: 2.4_

- [ ] 6.4 Add income edge cases
  - Integrate EdgeCaseExamples component
  - Pass income-specific edge cases
  - Include scenarios for varying income
  - _Requirements: 2.5, 5.1-5.5_

- [ ] 6.5 Style income calculation display
  - Highlight calculation in box or card
  - Use clear typography
  - Ensure mobile-friendly layout
  - _Requirements: 6.1-6.3, 8.1, 8.5_

---

## Phase 4: Dashboard Guidance

- [ ]  Task 7: Build DashboardGuidance component

- [ ] 7.1 Create `src/components/help/DashboardGuidance.tsx` component
  - Create component with TypeScript props interface
  - Import dashboard guidance from helpText.ts
  - Use MUI Card component
  - _Requirements: 4.1_

- [ ] 7.2 Render guidance steps
  - Map through guidance steps array
  - Display icon for each step
  - Display numbered list (1-4)
  - Add action links where applicable
  - _Requirements: 4.2-4.5_

- [ ] 7.3 Add dismiss functionality
  - Add dismiss button in top-right corner
  - Store dismissed state in localStorage
  - Use storage key from design doc
  - Hide card when dismissed
  - _Requirements: 4.7_

- [ ] 7.4 Add collapsible functionality
  - Allow card to be collapsed to save space
  - Persist collapsed state in sessionStorage
  - Show expand button when collapsed
  - _Requirements: 4.7_

- [ ] 7.5 Style DashboardGuidance for mobile
  - Use light blue background
  - Ensure touch-friendly buttons (44px minimum)
  - Stack content vertically on mobile
  - Test at 320px width
  - _Requirements: 4.6, 8.1-8.5_

- [ ] 7.6 Add DashboardGuidance to main dashboard
  - Show on first app load
  - Position prominently but not intrusively
  - Test visibility and usability
  - _Requirements: 4.1-4.7_

---

## Phase 5: Plain Language and Mobile Polish

- [ ]  Task 8: Plain language review

- [ ] 8.1 Review all help text for plain language
  - Check reading level (use Hemingway Editor)
  - Ensure 8th grade level or below
  - Shorten sentences over 20 words
  - Replace jargon with plain terms
  - _Requirements: 6.1-6.3_

- [ ] 8.2 Review for active voice
  - Convert passive voice to active
  - Use "you" throughout
  - Use action verbs
  - _Requirements: 6.3_

- [ ]  Task 9: Mobile optimization

- [ ] 9.1 Test all components at mobile breakpoints
  - Test at 320px width (iPhone SE)
  - Test at 375px width (iPhone 12)
  - Test at 414px width (iPhone 12 Pro Max)
  - Fix any layout issues
  - _Requirements: 8.1, 8.5_

- [ ] 9.2 Verify touch targets
  - Measure all interactive elements
  - Ensure minimum 44px × 44px
  - Add padding if needed
  - _Requirements: 8.2_

- [ ] 9.3 Test animations on mobile
  - Verify smooth expand/collapse
  - Verify bottom sheet slide animation
  - Test on actual mobile device if possible
  - _Requirements: 8.3_

- [ ] 9.4 Test text readability on mobile
  - Verify minimum 16px font size
  - Check line height and spacing
  - Ensure no horizontal scrolling
  - _Requirements: 6.5, 8.5_

---

## Notes

- **Testing**: Focus on core functionality first, then accessibility, then polish
- **Content accuracy**: All definitions must be verified against HR1 Section 71119 before implementation
- **Plain language**: Use Hemingway Editor or similar tool to verify reading level
- **Mobile-first**: Test on mobile devices throughout development, not just at the end
- **Incremental development**: Each task should result in working, testable code
- **No optional tasks**: All tasks are required for core functionality

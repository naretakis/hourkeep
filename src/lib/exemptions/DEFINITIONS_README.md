# Plain Language Definitions System

This directory contains a plain language definitions system for the exemption screening feature. The system helps users understand complex legal and technical terms without jargon.

## Files

- **definitions.ts** - Contains all term definitions with plain language explanations
- **DefinitionTooltip.tsx** - React component for displaying definitions in tooltips
- **questions.ts** - Question definitions that reference the definitions

## How It Works

### 1. Definitions File (`definitions.ts`)

Each definition includes:

- **term**: The technical term being defined
- **definition**: Plain language explanation (8th grade reading level)
- **examples**: Real-world examples to clarify the term
- **source**: Where the definition comes from (HR1 legislation, Service Blueprint, etc.)
- **sourceReference**: Specific section reference for traceability

Example:

```typescript
medicare: {
  term: "Medicare",
  definition: "Federal health insurance for people 65 or older, or people under 65 with certain disabilities.",
  examples: [
    "You turned 65 and enrolled in Medicare",
    "You receive Social Security disability benefits and have Medicare",
  ],
  source: "HR1 Section 71119",
  sourceReference: "Section 1902(xx)(9)(A)(ii)(II)(bb)",
}
```

### 2. Question-Definition Mapping

The `questionDefinitionMap` links each question to relevant definitions:

```typescript
export const questionDefinitionMap: Record<string, string[]> = {
  "health-medicare": ["medicare"],
  "health-medically-frail": [
    "medicallyFrail",
    "substanceUseDisorder",
    "disablingMentalDisorder",
    // ...
  ],
  // ...
};
```

### 3. UI Integration

The `ExemptionQuestion` component automatically displays definition tooltips for any question that has associated definitions:

```typescript
const definitions = getDefinitionsForQuestion(question.id);
// Renders info icons with tooltips for each definition
```

## Adding New Definitions

To add a new definition:

1. **Add to `definitions.ts`**:

```typescript
export const termDefinitions: Record<string, TermDefinition> = {
  // ... existing definitions

  newTerm: {
    term: "New Term",
    definition: "Plain language explanation in 1-3 sentences.",
    examples: ["Example 1", "Example 2"],
    source: "HR1 Section 71119", // or other source
    sourceReference: "Section reference if applicable",
  },
};
```

2. **Link to question** (if applicable):

```typescript
export const questionDefinitionMap: Record<string, string[]> = {
  "question-id": ["newTerm", "otherTerm"],
  // ...
};
```

3. **Test the definition**:
   - Navigate to the exemption screening
   - Find the question that uses the term
   - Tap the info icon to see the definition
   - Verify it's clear and helpful

## Plain Language Guidelines

When writing definitions:

### ✅ DO:

- Use "you" and "your" (conversational tone)
- Write at 8th grade reading level
- Keep definitions to 1-3 sentences
- Include concrete examples
- Avoid acronyms (or explain them)
- Use active voice

### ❌ DON'T:

- Use legal jargon
- Reference regulations by number
- Use passive voice
- Make assumptions about user knowledge
- Use complex sentence structures

## Examples

### Good Definition:

```typescript
{
  term: "SNAP",
  definition: "The Supplemental Nutrition Assistance Program, also called food stamps. It helps people buy groceries.",
  examples: ["You get a card each month to buy food at the grocery store"],
}
```

### Bad Definition:

```typescript
{
  term: "SNAP",
  definition: "A federal assistance program pursuant to the Food and Nutrition Act of 2008 providing nutrition assistance to eligible low-income individuals and families.",
  // Too formal, uses legal language, no examples
}
```

## Testing Definitions

To test definitions for readability:

1. **Read aloud** - Does it sound natural?
2. **Hemingway Editor** - Check reading level at http://hemingwayapp.com
3. **User feedback** - Ask someone unfamiliar with the topic if they understand
4. **Mobile test** - Ensure tooltips work well on small screens

## Source Priority

When creating definitions, use sources in this order:

1. **HR1 Section 71119** - Most authoritative (the actual law)
2. **Service Blueprint** - Implementation guidance from CMS
3. **Domain Knowledge** - Consolidated requirements document
4. **Common knowledge/industry best practices** - For general terms

Always document which source you used in the `source` field.

## Accessibility

The definition system is designed for accessibility:

- **Touch targets**: Info icons are 44px+ for easy tapping
- **Screen readers**: ARIA labels describe each definition
- **Keyboard navigation**: All tooltips are keyboard accessible
- **Mobile-first**: Tooltips work well on small screens

## Future Enhancements

Potential improvements:

- [ ] Add search functionality for definitions
- [ ] Create a glossary page showing all definitions
- [ ] Add audio pronunciations for complex terms
- [ ] Support multiple languages
- [ ] Track which definitions users view most
- [ ] Add "Was this helpful?" feedback for definitions

## Questions?

If you have questions about the definitions system, check:

- The task list: `.kiro/specs/workpath-exemption-screening/tasks.md`
- The design doc: `.kiro/specs/workpath-exemption-screening/design.md`
- The requirements: `.kiro/specs/workpath-exemption-screening/requirements.md`

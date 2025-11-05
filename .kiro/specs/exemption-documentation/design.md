# Design Document

## Overview

This feature extends the existing exemption screening system to support optional document uploads for exemptions that may require evidence beyond self-attestation. The design leverages the existing document capture and storage infrastructure from the hour tracking system, adapting it for exemption-specific use cases.

### Key Design Principles

1. **Reuse existing infrastructure**: Leverage DocumentCapture, CameraCapture, FileUpload components
2. **Optional by default**: Never block users from completing screening due to missing documents
3. **Clear guidance**: Provide exemption-specific examples of helpful documentation
4. **Flexible timing**: Allow document upload during screening or later
5. **Privacy-first**: All documents stored locally in IndexedDB, never transmitted externally

## Architecture

### High-Level Component Structure

```
ExemptionScreening
├── QuestionFlow (existing)
│   ├── ExemptionQuestion (existing)
│   │   └── DocumentPrompt (new)
│   │       └── DocumentCapture (reused)
│   └── ExemptionResults (existing)
│       └── ExemptionDocumentManager (new)
└── ExemptionHistory (existing)
    └── ExemptionDocumentViewer (new)
```

### Data Flow

```
User answers exemption question
    ↓
System determines if exemption may benefit from documentation
    ↓
Display optional document upload prompt
    ↓
User chooses to upload or skip
    ↓
If upload: DocumentCapture component
    ↓
Document saved to documents table with exemptionId link
    ↓
Continue to next question or results
```

## Components and Interfaces

### 1. New Component: DocumentPrompt

**Purpose**: Display optional document upload prompt after answering exemption questions

**Location**: `src/components/exemptions/DocumentPrompt.tsx`

**Props**:

```typescript
interface DocumentPromptProps {
  exemptionType: ExemptionType; // Which exemption this is for
  exemptionId?: number; // ID of saved exemption (if available)
  onDocumentAdded?: (documentId: number) => void;
  onSkip?: () => void;
  showSkipButton?: boolean;
}
```

**Behavior**:

- Displays exemption-specific guidance about helpful documentation
- Shows examples of acceptable documents
- Provides "Add Document" and "Skip" buttons
- Opens DocumentCapture when user chooses to add document
- Handles document save and association with exemption

### 2. New Component: ExemptionDocumentManager

**Purpose**: Manage documents for a completed exemption screening

**Location**: `src/components/exemptions/ExemptionDocumentManager.tsx`

**Props**:

```typescript
interface ExemptionDocumentManagerProps {
  exemptionId: number;
  exemptionType: ExemptionType;
  documents: ExemptionDocument[];
  onDocumentAdded: (documentId: number) => void;
  onDocumentDeleted: (documentId: number) => void;
}
```

**Behavior**:

- Displays list of documents associated with exemption
- Allows adding new documents
- Allows viewing existing documents
- Allows deleting documents
- Shows document metadata (upload date, file type, size)

### 3. New Component: ExemptionDocumentViewer

**Purpose**: View documents associated with historical exemption screenings

**Location**: `src/components/exemptions/ExemptionDocumentViewer.tsx`

**Props**:

```typescript
interface ExemptionDocumentViewerProps {
  exemptionId: number;
  documents: ExemptionDocument[];
  readOnly?: boolean;
}
```

**Behavior**:

- Displays documents in a read-only view
- Shows document thumbnails or PDF previews
- Allows full-screen document viewing
- Shows document metadata

### 4. Enhanced Component: ExemptionResults

**Modifications**: Add document management section

**New Features**:

- Display ExemptionDocumentManager for exemptions that may benefit from documentation
- Show count of documents uploaded per exemption
- Provide clear call-to-action for adding documents

### 5. Reused Components

- **DocumentCapture**: Unified interface for camera/upload (no changes needed)
- **CameraCapture**: Camera photo capture (no changes needed)
- **FileUpload**: File selection and upload (extend to support PDF)
- **DocumentViewer**: Display captured documents (no changes needed)

## Data Models

### Extended Document Type

Add new document types for exemptions:

```typescript
export type DocumentType =
  | "pay-stub"
  | "volunteer-verification"
  | "school-enrollment"
  | "medical-documentation"
  | "exemption-medical" // NEW: Medical documentation for medically frail
  | "exemption-rehab" // NEW: Rehab program verification
  | "exemption-veteran" // NEW: VA disability documentation
  | "exemption-dependent-disability" // NEW: Dependent disability documentation
  | "exemption-other" // NEW: Other exemption documentation
  | "other";
```

### Extended Document Interface

Modify Document interface to support exemption associations:

```typescript
export interface Document {
  id?: number;
  activityId?: number; // Optional now (for activity documents)
  exemptionId?: number; // NEW: For exemption documents
  exemptionType?: ExemptionType; // NEW: Which exemption this supports
  type: DocumentType;
  customType?: string;
  description?: string;
  originalFileName?: string;
  fileSize: number;
  compressedSize?: number;
  mimeType: string; // Extend to support application/pdf
  captureMethod: "camera" | "upload";
  createdAt: Date;
  blobId: number;
}
```

### New Type: ExemptionType

```typescript
export type ExemptionType =
  | "medically-frail"
  | "rehab-program"
  | "disabled-veteran"
  | "parent-guardian-disabled"
  | "age"
  | "pregnant-postpartum"
  | "dependent-child"
  | "medicare"
  | "non-magi"
  | "snap-tanf"
  | "incarcerated"
  | "tribal";
```

### New Interface: ExemptionDocument

Convenience type for exemption-specific documents:

```typescript
export interface ExemptionDocument extends Document {
  exemptionId: number;
  exemptionType: ExemptionType;
}
```

### Database Schema Changes

Update database schema to support exemption documents:

```typescript
// Version 4: Add exemption document support
this.version(4)
  .stores({
    profiles: "id",
    activities: "++id, date, type",
    documents: "++id, activityId, exemptionId, type, createdAt", // Add exemptionId index
    documentBlobs: "++id",
    exemptions: "++id, userId, screeningDate",
    exemptionHistory: "++id, userId, screeningDate",
  })
  .upgrade(async (trans) => {
    // Make activityId optional for existing documents
    console.log("Added exemption document support");
  });
```

## Document Guidance Configuration

### Exemption-Specific Guidance

Configuration object mapping exemptions to document guidance:

```typescript
export const exemptionDocumentGuidance: Record<
  ExemptionType,
  {
    title: string;
    description: string;
    examples: string[];
    isRecommended: boolean;
  }
> = {
  "medically-frail": {
    title: "Medical Documentation",
    description:
      "Adding medical documentation may help verify your exemption faster. This is optional.",
    examples: [
      "Doctor's letter describing your condition",
      "Medical records showing diagnosis",
      "Prescription information",
      "Hospital discharge papers",
    ],
    isRecommended: true,
  },
  "rehab-program": {
    title: "Program Verification",
    description:
      "A letter from your program can help verify your participation. This is optional.",
    examples: [
      "Letter from program director",
      "Enrollment confirmation",
      "Attendance records",
      "Program schedule or certificate",
    ],
    isRecommended: true,
  },
  "disabled-veteran": {
    title: "VA Documentation",
    description:
      "VA disability documentation can help verify your exemption. This is optional.",
    examples: [
      "VA disability rating letter",
      "VA benefits summary",
      "DD-214 discharge papers",
    ],
    isRecommended: true,
  },
  "parent-guardian-disabled": {
    title: "Dependent's Disability Documentation",
    description:
      "Documentation of your dependent's disability may be helpful. This is optional.",
    examples: [
      "Doctor's letter about dependent's condition",
      "Disability determination letter",
      "Special education IEP",
      "SSI award letter for dependent",
    ],
    isRecommended: true,
  },
  // Other exemptions don't typically need documentation
  age: {
    title: "",
    description: "",
    examples: [],
    isRecommended: false,
  },
  // ... (similar for other exemptions that don't need docs)
};
```

## User Flows

### Flow 1: Document Upload During Screening

1. User answers exemption question (e.g., "Are you medically frail?")
2. User selects "Yes"
3. System displays DocumentPrompt with guidance
4. User chooses "Add Document" or "Skip"
5. If "Add Document":
   - DocumentCapture component opens
   - User captures photo or selects PDF
   - Document is saved with exemptionId (temporary ID if screening not yet saved)
   - Success message displayed
6. Continue to next question

### Flow 2: Add Documents After Screening

1. User completes exemption screening
2. ExemptionResults displays with document management section
3. For exemptions that may benefit from documentation:
   - Show "Add Documentation" button
   - Display count of existing documents
4. User clicks "Add Documentation"
5. DocumentPrompt opens with guidance
6. User captures/uploads document
7. Document list updates

### Flow 3: View and Manage Documents

1. User navigates to exemption status/results
2. ExemptionDocumentManager displays documents by exemption type
3. User can:
   - View document thumbnails
   - Click to view full-screen
   - Add additional documents
   - Delete documents
4. Changes saved immediately to IndexedDB

## File Type Support

### Supported MIME Types

Extend existing file type support:

```typescript
const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/heif",
  "application/pdf", // NEW: PDF support
];

const MAX_FILE_SIZE_MB = 10;
```

### PDF Handling

- Use existing Blob storage mechanism
- Display PDF icon/thumbnail in document lists
- Use browser's native PDF viewer for full-screen viewing
- Validate PDF file size before upload

## Storage Strategy

### Document Storage

All documents stored in existing `documents` and `documentBlobs` tables:

```typescript
// Save exemption document
async function saveExemptionDocument(
  exemptionId: number,
  exemptionType: ExemptionType,
  blob: Blob,
  metadata: Partial<Document>,
): Promise<number> {
  // 1. Save blob
  const blobId = await db.documentBlobs.add({
    blob,
    createdAt: new Date(),
  });

  // 2. Save document metadata
  const documentId = await db.documents.add({
    exemptionId,
    exemptionType,
    blobId,
    type: getDocumentTypeForExemption(exemptionType),
    mimeType: blob.type,
    fileSize: blob.size,
    captureMethod: metadata.captureMethod || "upload",
    createdAt: new Date(),
    ...metadata,
  });

  return documentId;
}
```

### Querying Exemption Documents

```typescript
// Get all documents for an exemption
async function getExemptionDocuments(
  exemptionId: number,
): Promise<ExemptionDocument[]> {
  return (await db.documents
    .where("exemptionId")
    .equals(exemptionId)
    .toArray()) as ExemptionDocument[];
}

// Get documents by exemption type
async function getDocumentsByExemptionType(
  exemptionType: ExemptionType,
): Promise<ExemptionDocument[]> {
  return (await db.documents
    .where("exemptionType")
    .equals(exemptionType)
    .toArray()) as ExemptionDocument[];
}
```

## Error Handling

### File Upload Errors

```typescript
enum DocumentUploadError {
  FILE_TOO_LARGE = "File size exceeds 10MB limit",
  UNSUPPORTED_TYPE = "File type not supported. Please upload a photo or PDF",
  STORAGE_FULL = "Device storage is full. Please free up space",
  CAMERA_UNAVAILABLE = "Camera not available on this device",
  PERMISSION_DENIED = "Camera permission denied",
}
```

### Error Display

- Use Material-UI Snackbar for error messages
- Provide clear, actionable error messages
- Suggest solutions (e.g., "Try compressing the file" for large files)

### Graceful Degradation

- If document upload fails, allow user to continue without document
- Save partial progress (exemption screening without documents)
- Provide retry option for failed uploads

## Testing Strategy

### Unit Tests

1. **Document Type Mapping**
   - Test getDocumentTypeForExemption() returns correct type
   - Test all exemption types have guidance configuration

2. **Storage Functions**
   - Test saveExemptionDocument() creates correct records
   - Test getExemptionDocuments() retrieves correct documents
   - Test document deletion removes both metadata and blob

3. **File Validation**
   - Test MIME type validation
   - Test file size validation
   - Test PDF support

### Integration Tests

1. **Document Upload Flow**
   - Test camera capture → save → associate with exemption
   - Test file upload → save → associate with exemption
   - Test document appears in exemption results

2. **Document Management**
   - Test adding multiple documents to one exemption
   - Test viewing documents
   - Test deleting documents

3. **Cross-Component Integration**
   - Test DocumentPrompt → DocumentCapture → Save flow
   - Test ExemptionResults → ExemptionDocumentManager flow

### Manual Testing Checklist

- [ ] Upload photo via camera for each exemption type
- [ ] Upload photo from library for each exemption type
- [ ] Upload PDF for each exemption type
- [ ] Verify document guidance displays correctly
- [ ] Test skip functionality
- [ ] Test adding documents after screening
- [ ] Test viewing documents in results
- [ ] Test deleting documents
- [ ] Test with no camera available
- [ ] Test with storage nearly full
- [ ] Test offline functionality
- [ ] Test accessibility with screen reader

## Accessibility Considerations

### Keyboard Navigation

- All document upload controls accessible via keyboard
- Tab order: Skip button → Add Document button → Document list items
- Enter/Space to activate buttons
- Escape to close document viewer

### Screen Reader Support

```typescript
// Example ARIA labels
<Button
  aria-label="Add medical documentation for medically frail exemption"
  onClick={handleAddDocument}
>
  Add Documentation
</Button>

<Box role="region" aria-label="Exemption documents">
  {documents.map(doc => (
    <Card
      key={doc.id}
      role="article"
      aria-label={`Document uploaded on ${formatDate(doc.createdAt)}`}
    >
      {/* Document content */}
    </Card>
  ))}
</Box>
```

### Visual Considerations

- Minimum 44x44px touch targets for mobile
- Sufficient color contrast (WCAG AA minimum)
- Clear focus indicators
- Loading states with aria-live announcements

## Performance Considerations

### Image Compression

Reuse existing compression logic from activity documents:

```typescript
// Compress images before storage (target: <500KB)
async function compressImage(blob: Blob): Promise<Blob> {
  // Use existing compression utility
  // Target quality: 0.8 for JPEG
  // Max dimension: 1920px
}
```

### PDF Handling

- No compression for PDFs (preserve document quality)
- Enforce 10MB size limit
- Lazy load PDF previews in document lists

### Database Queries

- Index exemptionId for fast lookups
- Use compound index for (exemptionId, createdAt) for sorted queries
- Limit document list queries to 50 items per exemption

## Migration Strategy

### Database Migration

```typescript
// Version 4 migration
this.version(4)
  .stores({
    documents: "++id, activityId, exemptionId, type, createdAt",
  })
  .upgrade(async (trans) => {
    // Existing documents have activityId, new ones may have exemptionId
    // No data migration needed - both fields are optional
    console.log("Added exemption document support");
  });
```

### Backward Compatibility

- Existing activity documents unaffected (activityId remains)
- New exemption documents use exemptionId
- Document queries check both fields as appropriate
- No breaking changes to existing components

## Future Enhancements

### Phase 2 Possibilities

1. **Document OCR**: Extract text from documents for auto-fill
2. **Document Templates**: Provide downloadable templates for verification letters
3. **Bulk Upload**: Upload multiple documents at once
4. **Document Expiration**: Track document validity periods
5. **Export Package**: Generate PDF package of all exemption documents
6. **Document Reminders**: Notify users when documents may need updating
7. **Document Sharing**: Generate shareable links for caseworkers (with encryption)

### Not in Scope

- Cloud storage/sync
- Document editing/annotation
- Automatic document verification
- Integration with state systems
- Document encryption (beyond browser's IndexedDB security)

## Open Questions

None at this time. All requirements clarified during requirements phase.

## References

- HR1 Section 71119 (Community Engagement Requirements)
- Service Blueprint (Verification Process section)
- Existing DocumentCapture implementation
- Existing database schema (src/lib/db.ts)
- Exemption definitions (src/lib/exemptions/definitions.ts)

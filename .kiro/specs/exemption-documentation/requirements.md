# Requirements Document

## Introduction

This feature enhances the existing Medicaid work requirement exemption screener by adding the ability for users to upload supporting documentation (photos or PDF files) for exemptions that may require evidence beyond self-attestation. While HR1 legislation requires states to verify exemptions automatically "where possible," some exemptions (particularly medically frail status, rehabilitation participation, and veteran disability) may require documentation when automatic verification is not available.

This feature reuses the existing document upload/capture infrastructure from the hour tracking system, extending it to support exemption verification documents.

## Glossary

- **Exemption Screener**: The questionnaire that determines if a user is exempt from Medicaid work requirements
- **Supporting Documentation**: Photos or PDF files that provide evidence for an exemption claim
- **Document Upload Flow**: The process of capturing or selecting a file and associating it with an exemption
- **Exemption Record**: A stored record in the database indicating a user has claimed a specific exemption
- **Document Table**: The existing database table that stores all user-uploaded documents
- **Ex Parte Verification**: Automatic verification using available data sources without requiring client submission

## Requirements

### Requirement 1: Document Upload During Exemption Screening

**User Story:** As a Medicaid beneficiary completing the exemption screener, I want to optionally upload supporting documentation immediately after answering exemption questions, so that I can provide evidence while the context is fresh in my mind.

#### Acceptance Criteria

1. WHEN the User answers "yes" to an exemption question that may benefit from documentation, THE System SHALL display an optional prompt to upload supporting documentation
2. WHEN the User chooses to upload documentation during screening, THE System SHALL provide options to capture a photo or select a PDF file
3. WHEN the User successfully uploads a document, THE System SHALL associate the document with the specific exemption record
4. WHEN the User chooses to skip document upload during screening, THE System SHALL allow the User to continue without requiring documentation
5. THE System SHALL display clear guidance about what types of documentation are helpful for each exemption type

### Requirement 2: Exemption-Specific Document Guidance

**User Story:** As a Medicaid beneficiary, I want to understand what documentation would be helpful for my specific exemption, so that I can provide the most relevant evidence.

#### Acceptance Criteria

1. THE System SHALL identify which exemptions may benefit from supporting documentation
2. THE System SHALL display exemption-specific guidance for the following exemptions: medically frail/special needs, drug/alcohol rehabilitation participation, disabled veteran status, and parent/guardian of disabled individual
3. WHEN displaying document upload prompts, THE System SHALL show examples of acceptable documentation types for each exemption
4. THE System SHALL use plain language to explain why documentation may be helpful
5. THE System SHALL clearly communicate that documentation is optional

### Requirement 3: Document Storage and Association

**User Story:** As a developer, I want exemption documents stored in the existing documents table with proper associations, so that we maintain a consistent data model across the application.

#### Acceptance Criteria

1. THE System SHALL store exemption documents in the existing documents table
2. THE System SHALL include a type or category field to distinguish exemption documents from activity documents
3. THE System SHALL create a link between exemption documents and their associated exemption records
4. THE System SHALL support multiple documents per exemption
5. THE System SHALL maintain referential integrity between documents and exemptions

### Requirement 4: Document Management Within Exemption Screener

**User Story:** As a Medicaid beneficiary, I want to view and manage documents associated with my exemptions from within the exemption screener, so that I can add, review, or remove documentation as needed.

#### Acceptance Criteria

1. WHEN the User views their exemption status, THE System SHALL display any documents associated with each exemption
2. WHEN the User has an exemption without documentation, THE System SHALL provide an option to add documentation
3. WHEN the User has an exemption with existing documentation, THE System SHALL allow the User to view the uploaded documents
4. WHEN the User has an exemption with existing documentation, THE System SHALL allow the User to add additional documents
5. WHEN the User views exemption documents, THE System SHALL display document metadata including upload date and file type

### Requirement 5: File Type Support

**User Story:** As a Medicaid beneficiary, I want to upload both photos and PDF files as exemption documentation, so that I can provide evidence in whatever format I have available.

#### Acceptance Criteria

1. THE System SHALL support photo capture from device camera for exemption documents
2. THE System SHALL support photo selection from device photo library for exemption documents
3. THE System SHALL support PDF file selection for exemption documents
4. THE System SHALL validate file types before upload
5. WHEN the User attempts to upload an unsupported file type, THE System SHALL display a clear error message with supported formats

### Requirement 6: Reuse of Existing Document Infrastructure

**User Story:** As a developer, I want to reuse the existing document upload components and logic from the hour tracking system, so that we maintain consistency and avoid code duplication.

#### Acceptance Criteria

1. THE System SHALL use the same document capture component used for activity documents
2. THE System SHALL use the same document storage logic used for activity documents
3. THE System SHALL use the same document display components used for activity documents
4. THE System SHALL extend existing document types to include exemption-related categories
5. THE System SHALL maintain backward compatibility with existing activity documents

### Requirement 7: Privacy and Data Management

**User Story:** As a Medicaid beneficiary, I want my exemption documents stored securely on my device, so that my sensitive medical and personal information remains private.

#### Acceptance Criteria

1. THE System SHALL store all exemption documents locally using IndexedDB
2. THE System SHALL not transmit exemption documents to external servers
3. WHEN the User deletes an exemption, THE System SHALL provide an option to also delete associated documents
4. THE System SHALL include exemption documents in any data export functionality
5. THE System SHALL maintain document privacy consistent with existing activity documents

### Requirement 8: Accessibility and Usability

**User Story:** As a Medicaid beneficiary with disabilities, I want the document upload process to be accessible, so that I can provide exemption documentation regardless of my abilities.

#### Acceptance Criteria

1. THE System SHALL provide keyboard navigation for all document upload controls
2. THE System SHALL include appropriate ARIA labels for screen readers
3. THE System SHALL provide sufficient color contrast for all document-related UI elements
4. THE System SHALL support touch targets of at least 44x44 pixels for mobile interactions
5. THE System SHALL provide clear visual feedback during document upload operations

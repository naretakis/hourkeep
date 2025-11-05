# Implementation Plan

- [ ] 1. Extend data models and database schema
  - Update Document type to support exemption associations
  - Add new exemption-specific document types
  - Create database migration (version 4) with exemptionId index
  - Create ExemptionDocument type and helper functions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 2. Create exemption document guidance configuration
  - Create configuration file with exemption-specific guidance
  - Define which exemptions benefit from documentation
  - Add document examples for each exemption type
  - Create helper function to get guidance by exemption type
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 3. Extend FileUpload component for PDF support
  - Add PDF MIME types to supported formats
  - Update file validation logic
  - Update error messages for PDF files
  - Test PDF file selection and validation
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 4. Create document storage functions for exemptions
  - Implement saveExemptionDocument() function
  - Implement getExemptionDocuments() query function
  - Implement getDocumentsByExemptionType() query function
  - Implement deleteExemptionDocument() function
  - Add error handling for storage operations
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 5. Build DocumentPrompt component
  - Create component with exemption-specific guidance display
  - Add "Add Document" and "Skip" buttons
  - Integrate DocumentCapture component
  - Handle document save and association with exemption
  - Display success/error messages
  - Add accessibility attributes (ARIA labels, keyboard navigation)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 6. Build ExemptionDocumentManager component
  - Create component to display document list
  - Add "Add Document" functionality
  - Implement document viewing (thumbnails/previews)
  - Implement document deletion
  - Display document metadata (date, type, size)
  - Add accessibility attributes
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 7.3, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 7. Build ExemptionDocumentViewer component
  - Create read-only document viewer
  - Display document thumbnails for images
  - Display PDF icon/preview for PDFs
  - Implement full-screen document viewing
  - Show document metadata
  - Add accessibility attributes
  - _Requirements: 4.1, 4.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 8. Integrate DocumentPrompt into exemption screening flow
  - Identify exemption questions that benefit from documentation
  - Add DocumentPrompt after relevant "yes" answers
  - Handle temporary exemption ID during screening
  - Associate documents with saved exemption after screening completes
  - Ensure skip functionality works correctly
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 9. Enhance ExemptionResults component with document management
  - Add ExemptionDocumentManager section to results page
  - Display document count per exemption
  - Show "Add Documentation" call-to-action for exemptions without docs
  - Integrate with existing results layout
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 10. Add exemption documents to data export
  - Extend existing export functionality to include exemption documents
  - Include document metadata in export
  - Ensure document blobs are included in export
  - Test export with multiple exemption documents
  - _Requirements: 7.4_

- [ ] 11. Update exemption deletion to handle documents
  - Add option to delete associated documents when deleting exemption
  - Implement cascade delete for documents and blobs
  - Add confirmation dialog for document deletion
  - _Requirements: 7.3_

- [ ] 12. End-to-end testing and polish
  - Test complete flow: screening → document upload → results → management
  - Test all exemption types with documentation
  - Test PDF and photo uploads
  - Test offline functionality
  - Verify accessibility with keyboard navigation
  - Test error scenarios (storage full, unsupported files, etc.)
  - Polish UI/UX based on testing feedback
  - _Requirements: All requirements_

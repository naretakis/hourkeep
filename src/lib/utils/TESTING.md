# Image Compression Testing Guide

## Manual Testing

The image compression utility can be tested using the test page at `/test-compression`.

### Test Cases

#### 1. Small Images (< 1MB)

- **Expected**: May increase slightly in size if already optimized, or compress minimally
- **Verify**: Compression completes successfully, quality is acceptable

#### 2. Medium Images (1-5MB)

- **Expected**: Should compress to 20-50% of original size
- **Verify**: Significant size reduction, quality remains good for document verification

#### 3. Large Images (5-10MB)

- **Expected**: Should compress significantly, typically to < 2MB
- **Verify**: Major size reduction, image still readable

#### 4. Very Large Images (> 10MB after compression)

- **Expected**: Should be rejected with error message
- **Verify**: Error message displayed, file not saved

#### 5. Invalid File Types

- **Expected**: Validation error for non-JPEG/PNG files
- **Verify**: Clear error message about supported formats

### Testing Steps

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/test-compression`
3. Test each scenario above by selecting appropriate image files
4. Verify compression results match expected behavior
5. Check that quality is acceptable for document verification purposes

### Validation Tests

The validation functions are tested in `__tests__/imageCompression.test.ts`:

- File type validation (JPEG/PNG only)
- File size validation
- File size formatting

### Compression Parameters

- **Max dimension**: 1920px (maintains aspect ratio)
- **Quality**: 0.8 (JPEG compression quality)
- **Max size threshold**: 5MB (triggers compression)
- **Max final size**: 10MB (rejects if exceeded)

### Success Criteria

✅ Compression reduces file size for images > 5MB
✅ Quality remains acceptable for document verification
✅ Progress callback reports accurate progress
✅ Validation catches invalid file types
✅ Validation catches oversized files
✅ Error messages are clear and helpful

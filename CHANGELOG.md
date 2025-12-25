# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-12-25

### Added - Major Security Update

#### Safety Features
- **Profanity Filter**: Comprehensive profanity detection and filtering system
  - Detects common profanity, leetspeak variants, and obfuscations
  - Real-time validation of text inputs
  - Automatic sanitization of inappropriate content
  - Case-insensitive detection

#### Security Enhancements
- **Cryptographic Random Generation**: Replaced Math.random() with Web Crypto API
- **Input Validation**: Comprehensive validation for all user inputs
  - Number validation with type checking
  - Range validation with safety bounds
  - Length validation for text inputs
- **XSS Protection**: All text inputs sanitized to prevent cross-site scripting
- **Rate Limiting**: Client-side rate limiting (100 operations per minute)
- **Error Boundaries**: React Error Boundary for graceful error handling
- **Content Security Policy**: CSP headers in production builds
- **Console Protection**: Console output disabled in production

#### New Features
- **Custom Labels**: Optional labels for generated numbers (profanity-filtered)
- **History Tracking**: Tracks last 10 generated numbers with metadata
- **Export History**: Download generation history as JSON
- **Visual Feedback**: 
  - Warning banners for approaching rate limits
  - Error messages for validation failures
  - Animated number generation
- **Responsive Design**: Mobile-friendly interface

#### Developer Experience
- Comprehensive test suite for all utilities
- Detailed documentation (README.md, SECURITY.md)
- TypeScript-ready component structure
- Modular architecture for easy maintenance

### Changed
- Completely restructured project with proper source code organization
- Enhanced UI with modern, accessible design
- Improved error handling and user feedback
- Better documentation and inline comments

### Security
- All security features listed above
- No external API dependencies
- Client-side only processing for data privacy
- No data collection or tracking

## [1.0.0] - Previous Version

### Initial Release
- Basic random number generation
- Min/max range selection
- Integer and float support
- Simple UI

---

## Security Advisories

### [2.0.0] Security Improvements
This version addresses multiple security concerns:
- Replaces predictable random generation with cryptographic methods
- Adds input validation to prevent injection attacks
- Implements profanity filtering for appropriate content
- Adds rate limiting to prevent abuse
- Removes console output in production to prevent information leakage

## Migration Guide

### From 1.0.0 to 2.0.0

If upgrading from version 1.0.0:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **New Features**:
   - Custom labels are now available (optional)
   - History tracking is enabled by default
   - Rate limiting applies (100 generations/minute)

3. **Breaking Changes**:
   - None - API remains backward compatible
   - UI has been redesigned but functionality is preserved

4. **Configuration**:
   - No configuration required
   - Rate limits can be adjusted in source code if needed

---

For questions about changes, please refer to the README.md or open an issue.

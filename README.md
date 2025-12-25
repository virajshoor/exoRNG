# exoRNG - Secure Random Number Generator

Ex0's Random Number Generator with comprehensive safety features and profanity filter.

## 🔒 Safety Features

This RNG implementation includes multiple layers of security and safety to ensure a secure, reliable, and appropriate user experience:

### 1. **Cryptographically Secure Random Generation**
- Uses Web Crypto API (`crypto.getRandomValues()`) for true cryptographic randomness
- No reliance on predictable `Math.random()`
- Suitable for security-sensitive applications

### 2. **Profanity Filter**
- Comprehensive profanity detection and filtering
- Covers common words, leetspeak variants, and obfuscations
- Real-time validation of text inputs
- Automatic sanitization of inappropriate content
- Prevents display of offensive language in custom labels

### 3. **Input Validation & Sanitization**
- **Number Validation**: Ensures all numeric inputs are valid, finite, and within safe ranges
- **Range Validation**: Prevents invalid ranges (min ≥ max) and excessively large ranges
- **XSS Protection**: Sanitizes all text inputs to prevent cross-site scripting attacks
- **Type Checking**: Validates integer vs. float constraints
- **Length Limits**: Enforces maximum lengths on text inputs

### 4. **Rate Limiting**
- Limits users to 100 number generations per minute
- Prevents abuse and system overload
- Visual warnings when approaching limits
- Automatic reset after time window expires

### 5. **Error Boundaries**
- React Error Boundary catches and handles unexpected errors gracefully
- Prevents application crashes
- Provides user-friendly error messages
- Detailed error logs in development mode
- "Try Again" functionality for recovery

### 6. **Security Best Practices**
- Content Security Policy (CSP) headers in production
- Console output disabled in production (prevents information leakage)
- Constant-time string comparison to prevent timing attacks
- Safe JSON parsing with error handling
- No eval() or dangerous dynamic code execution

### 7. **Data Privacy**
- No external API calls or data transmission
- All processing happens client-side
- History stored only in browser memory (not persisted)
- No cookies or tracking mechanisms

## 🚀 Features

- **Integer & Float Generation**: Support for both integer and decimal numbers
- **Custom Range**: User-defined minimum and maximum values
- **Custom Labels**: Optional labels for generated numbers (profanity-filtered)
- **History Tracking**: Keeps last 10 generated numbers with metadata
- **Export History**: Download generation history as JSON
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Visual feedback for number generation
- **Accessibility**: Keyboard navigation and screen reader support

## 📦 Installation

### Prerequisites
- Node.js 14+ and npm 6+

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd exorng
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## 🎯 Usage

1. **Set Range**: Enter minimum and maximum values
2. **Choose Type**: Select Integer or Float
3. **Add Label** (Optional): Enter a custom label (profanity-filtered)
4. **Generate**: Click the "Generate Number" button
5. **View History**: See your last 10 generated numbers
6. **Export**: Download your history as JSON

### Safety Warnings

The application will display warnings when:
- Input validation fails
- Profanity is detected in labels
- Rate limit is approaching (< 20 remaining)
- Rate limit is exceeded
- Errors occur during generation

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📁 Project Structure

```
exorng/
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.jsx          # Error handling component
│   │   ├── RandomNumberGenerator.jsx  # Main RNG component
│   │   └── RandomNumberGenerator.css  # Component styles
│   ├── hooks/
│   │   └── useRateLimit.js            # Rate limiting hook
│   ├── utils/
│   │   ├── profanityFilter.js         # Profanity detection & filtering
│   │   └── validation.js              # Input validation utilities
│   ├── App.jsx                        # Root component
│   ├── App.css                        # Global styles
│   ├── index.jsx                      # Entry point
│   └── index.css                      # Base styles
├── public/
│   ├── index.html
│   └── manifest.json
├── package.json
├── .gitignore
├── LICENSE
└── README.md
```

## 🔧 Configuration

### Profanity Filter

To customize the profanity list, edit `src/utils/profanityFilter.js`:

```javascript
const profanityList = [
  // Add your custom words here
];
```

### Rate Limiting

To adjust rate limits, modify the parameters in `src/components/RandomNumberGenerator.jsx`:

```javascript
// 100 generations per minute (60000ms)
const { attempt, remaining, isLimited, resetAt } = useRateLimit(100, 60000);
```

### Validation Bounds

To change safe range limits, edit `src/utils/validation.js`:

```javascript
const SAFE_RANGE = 1e15; // Adjust this value
```

## 🛡️ Security Considerations

### What's Protected
- ✅ XSS attacks (input sanitization)
- ✅ Timing attacks (constant-time comparisons)
- ✅ Rate limiting abuse
- ✅ Invalid input injection
- ✅ Console manipulation (production)
- ✅ Profanity and inappropriate content

### What's Not Covered
- ⚠️ CSRF protection (client-side only app)
- ⚠️ Server-side validation (no backend)
- ⚠️ Persistent storage encryption (no storage)

## 📝 API Reference

### Profanity Filter

```javascript
import { containsProfanity, filterProfanity, sanitizeInput } from './utils/profanityFilter';

// Check for profanity
const hasBadWords = containsProfanity("some text");

// Filter profanity
const cleaned = filterProfanity("some text", "*");

// Sanitize input
const result = sanitizeInput("user input", 100);
// Returns: { isValid, sanitized, error }
```

### Validation

```javascript
import { validateNumber, validateRange } from './utils/validation';

// Validate a number
const result = validateNumber(42, {
  min: 0,
  max: 100,
  allowFloat: false,
  required: true
});
// Returns: { isValid, value, error }

// Validate a range
const rangeResult = validateRange(0, 100);
// Returns: { isValid, error }
```

### Rate Limiting Hook

```javascript
import useRateLimit from './hooks/useRateLimit';

const { attempt, remaining, isLimited, resetAt } = useRateLimit(100, 60000);

// Attempt an action
const result = attempt();
if (result.allowed) {
  // Proceed with action
}
```

## 🤝 Contributing

Contributions are welcome! Please ensure any pull requests:
- Maintain or improve security features
- Include appropriate tests
- Follow existing code style
- Update documentation as needed

## 📄 License

See LICENSE file for details.

## 🙏 Acknowledgments

- Web Crypto API for secure random generation
- React team for the excellent framework
- Security community for best practices guidance

## 📞 Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Note**: This is a client-side application. For production use with sensitive data, consider implementing server-side validation and additional security measures.

## Version History

### v2.0.0 (Current)
- ✨ Added comprehensive safety features
- ✨ Implemented profanity filter
- ✨ Added rate limiting
- ✨ Enhanced input validation
- ✨ Added error boundaries
- ✨ Implemented XSS protection
- ✨ Added cryptographic random generation
- ✨ Added history tracking and export

### v1.0.0
- Initial release with basic RNG functionality

# Security Policy

## 🔒 Security Features

This Random Number Generator application implements comprehensive security measures to ensure safe operation:

### 1. Cryptographic Security
- **Web Crypto API**: Uses `crypto.getRandomValues()` for cryptographically secure random number generation
- No reliance on predictable `Math.random()`
- Suitable for security-sensitive applications requiring true randomness

### 2. Input Validation & Sanitization
- **Type Validation**: All inputs are validated for correct data types
- **Range Validation**: Numeric inputs checked for safe bounds
- **XSS Prevention**: All text inputs are sanitized to prevent cross-site scripting
- **HTML Encoding**: Special characters are properly escaped
- **Length Limits**: Maximum input lengths enforced

### 3. Profanity Filter
- Comprehensive word list covering common profanity
- Detects leetspeak variants (e.g., "sh1t", "fck")
- Identifies spaced obfuscations (e.g., "f u c k")
- Case-insensitive detection
- Real-time validation and filtering

### 4. Rate Limiting
- **Client-Side Rate Limiting**: 100 operations per minute per client
- Prevents abuse and resource exhaustion
- Visual warnings before limit is reached
- Automatic reset after time window

### 5. Error Handling
- **Error Boundaries**: React Error Boundary catches unexpected errors
- Graceful degradation when errors occur
- User-friendly error messages
- Development mode provides detailed error information
- Production mode hides sensitive error details

### 6. Content Security
- **Content Security Policy**: CSP headers in production builds
- Restricts script sources to prevent XSS
- Controls resource loading
- Prevents eval() and inline script execution

### 7. Data Privacy
- **No External Calls**: All processing happens client-side
- **No Data Collection**: No analytics or tracking
- **No Cookies**: No persistent cookies set
- **Memory Only**: History stored only in browser memory
- **No Persistence**: Data not saved to localStorage or server

### 8. Additional Protections
- **Constant-Time Comparisons**: Prevents timing attacks
- **Safe JSON Parsing**: Protected against JSON injection
- **Console Protection**: Console output disabled in production
- **No eval()**: No dynamic code execution
- **Type Checking**: Strict type validation throughout

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please follow responsible disclosure:

1. **Do NOT** open a public issue
2. Email the maintainer with details:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

3. Allow reasonable time for a fix before public disclosure
4. You will be credited for the discovery (if desired)

## 🔄 Security Updates

- Regular dependency updates to patch known vulnerabilities
- Security patches released as soon as possible
- Version history maintained in CHANGELOG.md

## 🧪 Security Testing

The application includes comprehensive test coverage for:
- Profanity detection and filtering
- Input validation
- XSS prevention
- Error boundary functionality
- Rate limiting

Run tests with:
```bash
npm test
```

## ⚠️ Known Limitations

### Client-Side Only
This is a client-side application with no backend. As such:
- No server-side validation
- No CSRF protection (not applicable)
- No authentication/authorization (not required)
- No persistent data storage

### Profanity Filter Limitations
- Cannot catch all variations and new slang
- May produce false positives
- Language-specific (currently English only)
- Requires regular updates to word list

### Rate Limiting Limitations
- Client-side only (can be bypassed by clearing browser data)
- No IP-based limiting
- No distributed rate limiting across sessions

## 🎯 Best Practices

When using this application in production:

1. **Deploy with HTTPS**: Always use secure connections
2. **Set CSP Headers**: Configure Content Security Policy on your server
3. **Regular Updates**: Keep dependencies up to date
4. **Monitor Usage**: Track unusual patterns if logs are available
5. **Backup Strategy**: Implement export/backup for important data
6. **Access Controls**: Implement authentication if needed for your use case

## 📋 Security Checklist

- [x] Cryptographically secure random generation
- [x] Input validation and sanitization
- [x] XSS protection
- [x] Profanity filtering
- [x] Rate limiting
- [x] Error boundaries
- [x] Content Security Policy
- [x] No external dependencies with known vulnerabilities
- [x] No sensitive data logging in production
- [x] Secure coding practices followed

## 🔗 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## 📅 Last Updated

This security policy was last updated: December 25, 2025

## 📧 Contact

For security concerns, please contact the repository maintainer.

---

**Remember**: No system is 100% secure. This application implements industry best practices for a client-side web application, but users should evaluate their specific security requirements.

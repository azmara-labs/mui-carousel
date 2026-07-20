# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities privately - **do not** open a public issue.

**Email:** gazmutech@gmail.com

Include:
- A description of the vulnerability and its potential impact
- Steps to reproduce (proof-of-concept code, if applicable)
- The package version affected

We aim to acknowledge reports within 3 business days and to keep you updated as the issue is triaged and fixed.

## Supported Versions

Only the latest published version on npm is supported with security fixes. Please upgrade rather than requesting a backported patch for an older version.

## Scope

This policy covers the carousel component library published from this repo. It doesn't cover the `demo/` app's own dependencies unless the vulnerability is reachable through the published package itself.

Vulnerabilities in third-party dependencies (React, MUI, Emotion, framer-motion) should ideally be reported upstream to their own maintainers, but we're happy to be notified as well so we can track and patch on our end.

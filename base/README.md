# thinkcove-lib
Open Source Libraries from Thinkcove

# @thinkcove-lib/base
A lightweight TypeScript utility library for building Hapi-style APIs, providing:
- **BaseController**: standardized JSON responses and centralized error handling  
- **ErrorMessages**: customizable HTTP error message manager  
- **Logger**: Winston-based logger factory  
- **Performance**, **RequestHelper**, **Utils** modules for common tasks  

## Installation
# From npm
npm install @thinkcove-lib/base

# Project Structure
.
├── src
│   ├── baseController       # BaseController class
│   ├── errorController      # ErrorMessages manager
│   ├── logger               # Winston logger factory
│   ├── performance          # Performance utilities
│   ├── requestHelper        # HTTP request helpers
│   ├── utils                # Miscellaneous utilities
│   └── index.ts             # Library entrypoint
├── .gitignore
├── .npmignore
├── .prettierignore
├── .prettierrc
├── eslint.config.mjs       # ESLint configuration
├── tsconfig.json           # TypeScript configuration
├── package.json
└── README.md

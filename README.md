# Tamil Water Game
Work by Ishan Sharma


A modern, interactive water-themed game built with React and TypeScript. This project demonstrates a contemporary web development stack with Vite, React 19, and TypeScript for optimal performance and developer experience.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [License](#license)

## Overview

Tamil Water Game is an interactive gaming experience crafted with modern web technologies. The project leverages React's component-based architecture and TypeScript's type safety to deliver a robust and maintainable codebase.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (v8 or higher) - Comes with Node.js
- **Python** (v3.6 or higher) - Required for serving the production build locally

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd TamilWaterGame
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Development

To start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Development Features

- **Hot Module Replacement (HMR):** Changes are reflected instantly without full page reload
- **TypeScript Support:** Full type checking during development
- **Linting:** Code quality checks with Oxlint

## Building for Production

To create a production-optimized build:

```bash
npm run build
```

This command:
1. Compiles TypeScript files with type checking (`tsc -b`)
2. Bundles and minifies the application with Vite
3. Outputs the compiled code to the `dist/` directory

## Running the Application

### Option 1: Using Python (Recommended for Local Testing)

1. **Navigate to the dist directory:**
   ```bash
   cd dist
   ```

2. **Start a local HTTP server:**
   ```bash
   python -m http.server 8000
   ```

3. **Open your browser and navigate to:**
   ```
   http://localhost:8000
   ```

### Option 2: Using Node.js

Use Vite's preview server:

```bash
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run lint` | Run code linting with Oxlint |
| `npm run preview` | Preview production build locally |

## Project Structure

```
TamilWaterGame/
├── dist/                 # Production build output
├── public/              # Static assets (favicon, icons)
├── src/                 # Source code (TypeScript/React components)
├── index.html           # HTML entry point
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md           # Project documentation
```

## Technologies

- **React** - UI library (v19.2.8)
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation build tool and dev server
- **Babel** - JavaScript compiler with React plugin support
- **Oxlint** - High-performance linter
- **React Compiler** - Optimizes React component performance

## Development Dependencies

The project uses modern tooling for optimal development experience:
- `@vitejs/plugin-react` - React support in Vite
- `babel-plugin-react-compiler` - Automatic React component optimization
- TypeScript type definitions for React and Node.js

## License

Please refer to the project repository for license information.

---

For more information or to contribute, please visit the project repository.

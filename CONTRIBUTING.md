# Contributing to Snox

Thank you for your interest in contributing to Snox! We welcome all contributions, whether it's fixing bugs, adding new features, or improving documentation. This document outlines the guidelines and processes for contributing to our task management application.

## Table of Contents

- [How to Report Bugs](#how-to-report-bugs)
- [How to Suggest Enhancements](#how-to-suggest-enhancements)
- [How to Set Up the Development Environment](#how-to-set-up-the-development-environment)
- [How to Run Tests](#how-to-run-tests)
- [How to Submit Pull Requests](#how-to-submit-pull-requests)
- [Code of Conduct](#code-of-conduct)
- [Coding Standards](#coding-standards)
- [Recognition](#recognition)
- [Contact](#contact)

## How to Report Bugs

If you find a bug, please open an issue on our [GitHub repository](https://github.com/ritikdoijod/snox/issues). Include the following details:
- A clear description of the bug
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots or logs, if applicable
- Your environment (e.g., OS, browser, Node.js version)

## How to Suggest Enhancements

If you have an idea for a new feature or enhancement, please open an issue on our [GitHub repository](https://github.com/ritikdoijod/snox/issues). Provide:
- A clear description of the enhancement
- Why it would be useful
- Any relevant screenshots or designs
- Potential implementation details, if applicable

## How to Set Up the Development Environment

Follow the installation instructions in the [README.md](README.md) to set up the development environment for Snox, including both the backend (Node.js, Hono.js, MongoDB) and frontend (React, React Router 7, Shadcn, Tailwind CSS).

## How to Submit Pull Requests

To contribute code, follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit them with clear messages:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push your branch to your fork:
   ```bash
   git push origin feature-branch
   ```
5. Open a pull request against the main branch, following any provided pull request template.

## Code of Conduct

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a respectful and inclusive collaboration environment.

## Coding Standards

Snox uses [ESLint](https://eslint.org/) for code linting and [Prettier](https://prettier.io/) for code formatting to maintain consistent code quality. Before submitting a pull request:
- Run ESLint to check for linting errors:
  ```bash
  npm run lint
  ```
  Fix any errors or warnings.
- Run Prettier to format your code:
  ```bash
  npm run format
  ```
  Alternatively, enable Prettier in your editor for automatic formatting.

We also recommend following [JavaScript Best Practices](https://github.com/stevekwan/best-practices/blob/master/javascript/best-practices.md) for general JavaScript coding guidelines.

For Git commit messages, please:
- Use the imperative mood (e.g., "Fix bug" instead of "Fixed bug").
- Keep the first line under 50 characters.
- Provide detailed descriptions in subsequent lines if needed.
- Reference issue numbers when applicable (e.g., "Fix #123").

## Recognition

We value all contributions to Snox. Contributors will be listed in the [CONTRIBUTORS.md](CONTRIBUTORS.md) file or recognized via GitHub’s contributors feature.

## Contact

For questions or assistance, contact [ritikdoijod](https://github.com/ritikdoijod) or open an issue on [GitHub](https://github.com/ritikdoijod/snox/issues).
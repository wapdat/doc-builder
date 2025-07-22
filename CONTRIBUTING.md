# Contributing to Doc Builder

First off, thank you for considering contributing to Doc Builder! It's people like you that make Doc Builder such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed and expected**
* **Include screenshots if relevant**
* **Include your environment details** (OS, Node.js version, npm version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a detailed description of the suggested enhancement**
* **Provide specific examples to demonstrate how it would work**
* **Describe the current behavior and expected behavior**
* **Explain why this enhancement would be useful**

### Your First Code Contribution

Unsure where to begin? You can start by looking through these issues:

* `good first issue` - issues which should only require a few lines of code
* `help wanted` - issues which need extra attention

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code follows the existing style
6. Issue that pull request!

## Development Process

1. **Setup your environment**
   ```bash
   git clone https://github.com/YOUR_USERNAME/doc-builder.git
   cd doc-builder
   npm install
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write code
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm test
   npm run build
   npm run dev
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation changes
   - `style:` formatting, missing semicolons, etc
   - `refactor:` code change that neither fixes a bug nor adds a feature
   - `test:` adding missing tests
   - `chore:` maintain

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**

## Style Guide

### JavaScript Style Guide

* Use ES6+ features where appropriate
* 2 spaces for indentation
* Use semicolons
* Use `const` and `let`, avoid `var`
* Use meaningful variable names
* Add comments for complex logic

### Documentation Style Guide

* Use Markdown for all documentation
* Include code examples where relevant
* Keep line length to 80 characters where possible
* Use present tense ("Add feature" not "Added feature")

## Testing

* Write tests for new features
* Ensure all tests pass before submitting PR
* Aim for high code coverage
* Test edge cases

## Project Structure

```
doc-builder/
├── assets/          # Static assets
├── lib/             # Core library code
├── scripts/         # Build and utility scripts
├── templates/       # HTML templates
├── test/           # Test files
├── docs/           # Documentation
└── cli.js          # CLI entry point
```

## Release Process

Maintainers will handle releases, but for reference:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes
4. Tag release
5. Push to npm

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉
# Contributing to PG & Bike Rental System 🤝

Thank you for your interest in contributing to our project! This document provides guidelines and instructions for contributing.

## 🚀 Quick Start for Contributors

### 1. Fork & Clone
```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/pg-bike-rental-system.git
cd pg-bike-rental-system

# Add upstream remote
git remote add upstream https://github.com/Ashu6307/pg-bike-rental-system.git
```

### 2. Set Up Development Environment
```bash
# Backend setup
cd backend
npm install
cp .env.example .env
# Configure your .env file

# Frontend setup  
cd ../frontend
npm install
```

### 3. Create Feature Branch
```bash
# Get latest changes from upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

## 📋 Development Guidelines

### Code Style
- **JavaScript/React**: Follow ESLint configuration
- **Commit Messages**: Use conventional commits format
- **File Naming**: Use camelCase for files, PascalCase for components
- **Comments**: Write meaningful comments for complex logic

### Commit Message Format
```
type(scope): description

Examples:
feat(auth): add user registration functionality
fix(api): resolve booking validation issue
docs(readme): update installation instructions
refactor(ui): improve responsive design
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🔄 Development Workflow

### 1. Before Starting Work
```bash
# Make sure you're on main branch
git checkout main

# Get latest changes
git pull upstream main

# Create feature branch
git checkout -b feature/issue-123-feature-name
```

### 2. During Development
- Write clear, self-documenting code
- Add comments for complex business logic
- Follow existing code patterns and conventions
- Test your changes locally
- Commit frequently with clear messages

### 3. Before Submitting PR
```bash
# Make sure your branch is up to date
git fetch upstream main
git rebase upstream/main

# Run tests
cd frontend && npm test
cd ../backend && npm test

# Run linting
cd frontend && npm run lint
cd ../backend && npm run lint
```

## 🧪 Testing Requirements

### Frontend Testing
- Write unit tests for new components
- Use React Testing Library
- Maintain test coverage above 80%
- Test user interactions and edge cases

### Backend Testing
- Write unit tests for new API endpoints
- Use Jest for testing framework
- Test error handling and validation
- Mock external dependencies

### Testing Commands
```bash
# Frontend tests
cd frontend
npm test                    # Run tests in watch mode
npm run test:coverage       # Run with coverage report

# Backend tests  
cd backend
npm test                    # Run all tests
npm run test:watch          # Run in watch mode
```

## 📝 Pull Request Process

### 1. PR Requirements
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added for new functionality
- [ ] All tests pass
- [ ] Documentation updated (if needed)
- [ ] No merge conflicts with main branch

### 2. PR Description
Use the provided PR template and include:
- Clear description of changes
- Related issue numbers
- Type of change (feature, bugfix, etc.)
- Testing information
- Screenshots (for UI changes)

### 3. Review Process
- Minimum 1 reviewer approval required
- Address all review comments
- Keep PR focused and small when possible
- Be responsive to feedback

## 🐛 Bug Reports

### Before Reporting
1. Check existing issues to avoid duplicates
2. Test with latest version
3. Reproduce the bug consistently

### Bug Report Should Include
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, etc.)
- Screenshots or error logs
- Minimal code example (if applicable)

## 💡 Feature Requests

### Before Requesting
1. Check existing issues and discussions
2. Consider if it fits project scope
3. Think about implementation complexity

### Feature Request Should Include
- Problem statement
- Proposed solution
- Use cases and benefits
- Implementation considerations
- Alternative solutions considered

## 📚 Code Review Guidelines

### For Authors
- Keep PRs small and focused
- Provide context in PR description
- Respond promptly to feedback
- Be open to suggestions and improvements

### For Reviewers
- Be constructive and respectful
- Focus on code quality and best practices
- Check for security and performance issues
- Test the changes locally when needed
- Approve only when confident about the changes

## 🔒 Security Considerations

### Reporting Security Issues
- **DO NOT** create public issues for security vulnerabilities
- Email security concerns to: [security@yourproject.com]
- Include detailed description and reproduction steps

### Security Best Practices
- Never commit secrets or API keys
- Validate and sanitize all inputs
- Use parameterized queries for database operations
- Implement proper authentication and authorization
- Keep dependencies up to date

## 🌟 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributors page on website

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Slack/Discord**: Real-time chat with team
- **Email**: Direct contact with maintainers

### Common Questions
- **How to set up development environment?** - See README.md
- **What should I work on?** - Check GitHub Issues with "good first issue" label
- **How to run tests?** - See Testing section above
- **Code style questions?** - Check existing code patterns and ESLint rules

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing! 🎉**

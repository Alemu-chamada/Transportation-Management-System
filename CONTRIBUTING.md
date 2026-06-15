# Contributing to Transportation Management System

Thank you for considering contributing to the Transportation Management System! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment

## How to Contribute

### 1. Fork the Repository
```bash
git clone https://github.com/Alemu-chamada/Transportation-Management-System
cd Transportation-Management-System
```

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Write clear, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 4. Test Your Changes
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

Use conventional commit messages:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 6. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub.

## Development Guidelines

### Code Style
- **Backend**: Follow ESLint configuration
- **Frontend**: Follow TypeScript and React best practices
- **Formatting**: Use consistent indentation (2 spaces)

### Git Workflow
1. Keep commits atomic and focused
2. Write descriptive commit messages
3. Reference issues in commits (`fixes #123`)
4. Keep PRs small and focused

### Testing
- Write unit tests for new features
- Ensure existing tests pass
- Test manually in browser/Postman

### Documentation
- Update README.md for new features
- Add JSDoc comments for functions
- Update API documentation

## Project Structure

### Backend
```
backend/src/
├── config/          - Configuration files
├── infrastructure/  - Database, Redis, Socket.IO
├── modules/         - Feature modules
│   ├── auth/
│   ├── booking/
│   ├── trip/
│   └── ...
├── jobs/            - Background jobs
└── shared/          - Shared utilities
```

### Frontend
```
frontend/src/
├── features/        - Feature modules
├── pages/           - Page components
├── providers/       - React providers
├── routes/          - Route config
├── shared/          - Shared components
└── styles/          - Global styles
```

## Feature Requests

Have an idea? Open an issue with:
- Clear description
- Use case
- Proposed solution (optional)

## Bug Reports

Found a bug? Open an issue with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

## Questions

- Open an issue with the `question` label
- Check existing issues first
- Be specific and clear

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉

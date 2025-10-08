# Support

Welcome to the Recipe Admin UI Service support documentation! This guide will help you find the resources you need.

## 📖 Documentation

- **[README](../README.md)** - Overview, quick start, and available scripts
- **[Technical Specification](TECHNICAL_SPEC.md)** - Detailed technical documentation
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[Security Policy](SECURITY.md)** - Security reporting and best practices
- **[Changelog](../CHANGELOG.md)** - Version history and changes

## 🆘 Getting Help

### For Questions and Discussions

Use **[GitHub Discussions](https://github.com/Recipe-Web-App/admin-ui-service/discussions)** for:

- General questions about using the admin UI
- Implementation help
- Best practices
- Feature discussions
- Community interaction

**Categories:**

- **Q&A** - Ask questions and get answers
- **Ideas** - Share ideas for improvements
- **Show and Tell** - Share what you've built

### For Bugs and Issues

Use **[GitHub Issues](https://github.com/Recipe-Web-App/admin-ui-service/issues/new/choose)** for:

- Bug reports
- Feature requests
- Performance issues
- Documentation issues

### For Security Vulnerabilities

**Do NOT create public issues for security vulnerabilities!**

Use
**[GitHub Security Advisories](https://github.com/Recipe-Web-App/admin-ui-service/security/advisories/new)**
to privately report security issues.

See our [Security Policy](SECURITY.md) for details.

## ❓ Common Questions

### Setup and Configuration

**Q: What are the minimum requirements?**

- Node.js 20.x or higher
- npm 11.x or higher
- See [README](../README.md#prerequisites) for details

**Q: How do I set up OAuth2 authentication?**

- Configure your OAuth2 provider settings in `.env`
- See the authentication section in [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md)

**Q: How do I enable dark mode?**

- Dark mode is built-in using PrimeNG theming
- Users can toggle via the theme switcher in the UI

### Development

**Q: How do I run tests?**

```bash
npm run test:vitest    # Unit tests
npm run test:e2e       # E2E tests
npm run test:coverage  # With coverage
```

**Q: How do I fix linting errors?**

```bash
npm run lint:fix
npm run format
```

**Q: How do I build for production?**

```bash
npm run build
```

**Q: How do I analyze bundle size?**

```bash
npm run analyze
```

### Troubleshooting

#### Q: Server won't start / Port already in use

- Check if port 4200 is already in use
- Change port: `ng serve --port 4201`
- Kill existing process using the port

#### Q: npm install fails

- Ensure you're using Node.js 20+ and npm 11+
- Try clearing cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then `npm install`

#### Q: SSR not working

- Ensure you built with SSR: `ng build`
- Check server configuration in `server.ts`
- Verify all dependencies are SSR-compatible

#### Q: Styles not loading

- Clear Angular cache: `rm -rf .angular`
- Rebuild: `npm run build`
- Check Tailwind and PrimeNG configurations

## ⏱️ Response Times

We aim to respond to:

- **Security issues**: Within 24 hours
- **Bug reports**: Within 2-3 business days
- **Feature requests**: Within 1 week
- **Questions/Discussions**: Within 3-5 business days

_Note: This is an open source project maintained by volunteers. Response times may vary._

## 🤝 Community Guidelines

When asking for help:

1. **Search first** - Check if your question has been answered
2. **Be specific** - Provide details, error messages, and steps to reproduce
3. **Share code** - Use code blocks and include relevant snippets
4. **Be respectful** - Follow our Code of Conduct
5. **Give back** - Help others when you can

### Asking Good Questions

Include:

- **Environment**: OS, browser, Node.js version, Angular version
- **What you tried**: Steps to reproduce the issue
- **Expected vs actual**: What should happen vs what happens
- **Code samples**: Minimal reproducible example
- **Error messages**: Full error text from console/logs

## 🐛 Bug Report Best Practices

A great bug report includes:

1. **Clear title**: Describe the issue briefly
2. **Environment details**: OS, browser, versions
3. **Steps to reproduce**: Numbered list of exact steps
4. **Expected behavior**: What should happen
5. **Actual behavior**: What actually happens
6. **Screenshots**: Visual evidence when applicable
7. **Console errors**: Browser console or terminal errors
8. **Code samples**: Minimal code to reproduce

## 📚 Additional Resources

### Official Documentation

- [Angular Documentation](https://angular.dev/)
- [PrimeNG Documentation](https://primeng.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/)

### Related Projects

- [Recipe API Service](https://github.com/Recipe-Web-App/api-service)
- [Authentication Service](https://github.com/Recipe-Web-App/auth-service)

### Learning Resources

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Server-Side Rendering](https://angular.dev/guide/ssr)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📧 Contact

For project-related questions, use GitHub Discussions or Issues.

For other inquiries:

- Organization: Recipe-Web-App
- Maintainer: @jsamuelsen

---

**Thank you for using the Recipe Admin UI Service!**

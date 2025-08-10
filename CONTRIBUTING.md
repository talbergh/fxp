# Contributing to FXP CLI

We love your input! We want to make contributing to FXP CLI as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Pull Request Process

1. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters
2. Increase the version numbers in any examples files and the README.md to the new version that this Pull Request would represent
3. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/talbergh/fxp/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/talbergh/fxp/issues/new); it's that easy!

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Use a Consistent Coding Style

* Use 2 spaces for indentation rather than tabs
* You can try running `npm run lint` for style unification

## Template Contributions

We welcome new templates! When contributing templates:

1. Follow the existing template structure
2. Include proper documentation
3. Test with the target framework (ESX, QB-Core, etc.)
4. Add the template to the templates registry in `src/utils/templates.js`

### Template Guidelines

- Use modern practices and latest natives (August 2025 standards)
- Include proper error handling
- Follow framework conventions
- Add helpful comments
- Include example usage

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## References

This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md)

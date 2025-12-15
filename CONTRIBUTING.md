# Contributing to QuickStow

First off, thank you for considering contributing to QuickStow! It's people like you that make this project better for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected to see
- **Include screenshots** if relevant
- **Note your browser and OS version**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternative solutions** you've considered

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write a clear commit message**

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/QuickStow.git
   cd QuickStow
   ```

2. Start a local server:
   ```bash
   python3 -m http.server 8080
   ```

3. Open `http://localhost:8080` in your browser

## Coding Standards

### HTML
- Use semantic HTML5 elements
- Maintain proper indentation (4 spaces)
- Include meaningful `id` and `class` names

### CSS
- Use CSS custom properties (variables) for theming
- Follow BEM naming convention where appropriate
- Keep selectors specific but not overly complex
- Group related properties together

### JavaScript
- Use modern ES6+ syntax
- Write clear, descriptive variable and function names
- Add comments for complex logic
- Handle errors gracefully
- Use `const` and `let` instead of `var`

### Code Style Example

```javascript
// Good
async function transcribeAudio(audioBlob) {
    try {
        const response = await fetch(TRANSCRIPTION_ENDPOINT, {
            method: 'POST',
            body: audioBlob
        });
        
        if (!response.ok) {
            throw new Error('Transcription failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Transcription error:', error);
        throw error;
    }
}

// Avoid
function doStuff(x) {
    fetch(url).then(r => r.json()).then(d => console.log(d));
}
```

## Testing

Before submitting a PR, please test:

1. **Basic functionality**
   - Recording starts and stops correctly
   - Audio is transcribed accurately
   - Results are displayed properly

2. **Browser compatibility**
   - Chrome/Edge
   - Firefox
   - Safari

3. **Responsive design**
   - Desktop
   - Tablet
   - Mobile

4. **Error handling**
   - No API key
   - Network errors
   - Microphone access denied

## Commit Message Guidelines

Write clear, concise commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests when relevant

Examples:
```
Add search functionality for recorded items
Fix audio recording on Safari
Update README with deployment instructions
Refactor API error handling
```

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the documentation with any new features
3. The PR will be merged once you have approval from a maintainer

## Design Guidelines

When adding UI elements:

- Follow the existing design system (colors, spacing, typography)
- Ensure accessibility (ARIA labels, keyboard navigation)
- Test on different screen sizes
- Maintain the "premium" feel with smooth animations
- Use the Inter font family for consistency

## Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed

## Questions?

Feel free to open an issue with the `question` label if you need help or clarification on anything.

## Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

# Development Guide

## Project Structure

```
vscode-npm-manager/
├── .vscode/              # VSCode configuration
│   ├── launch.json      # Debug configuration
│   └── tasks.json       # Build tasks
├── src/                 # Source code
│   └── extension.ts     # Main extension code
├── example-project/     # Example project for testing
│   └── package.json     # Sample package.json with scripts
├── out/                 # Compiled JavaScript (generated)
├── package.json         # Extension manifest
├── tsconfig.json        # TypeScript configuration
├── .eslintrc.json       # ESLint configuration
├── .gitignore           # Git ignore rules
├── .vscodeignore        # Files to exclude from extension package
├── README.md            # User documentation
├── CHANGELOG.md         # Version history
└── LICENSE              # MIT License
```

## How It Works

### Context Menu Registration

The extension uses VSCode's `contributes.menus` API to add items to the explorer context menu:

```json
"menus": {
  "explorer/context": [
    {
      "when": "resourceFilename == package.json",
      "command": "vscode-npm-manager.npmInstall",
      "group": "npm@1"
    }
  ]
}
```

The `when` clause ensures the menu items only appear when right-clicking on a file named `package.json`.

### NPM Install Command

When the user clicks "NPM Install", the extension:
1. Gets the URI of the clicked file
2. Extracts the directory path
3. Creates a new integrated terminal
4. Runs `npm install` in that directory

### NPM Run Command

When the user clicks "NPM Run...", the extension:
1. Reads the package.json file
2. Parses the JSON and extracts the `scripts` section
3. Shows a Quick Pick menu with all available scripts
4. When a script is selected, creates a terminal and runs `npm run <script>`

## Development Setup

### Prerequisites

- Node.js v18+
- npm or yarn
- VSCode 1.74.0+

### Installation Steps

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch
```

### Running and Debugging

1. Open the project in VSCode
2. Press `F5` to start debugging
3. A new "Extension Development Host" window will open
4. Open the `example-project` folder in this window
5. Right-click on `package.json` to test the context menu

### Testing the Extension

1. In the Extension Development Host window, right-click on `example-project/package.json`
2. You should see two new menu items:
   - **NPM Install** - Runs npm install
   - **NPM Run...** - Shows a list of scripts (start, dev, build, test, lint, format, clean)
3. Select a script to run it in the integrated terminal

## Building for Production

### Create VSIX Package

```bash
# Install vsce globally (if not already installed)
npm install -g @vscode/vsce

# Package the extension
npm run package
# or
vsce package
```

This creates a `.vsix` file that can be:
- Installed locally for testing
- Shared with others
- Published to the marketplace

### Manual Installation

#### Add Code (Cursor) to PATH

View → Command Palette… (or Cmd + Shift + P).

```bash
Shell Command: Install 'code | cursor' command in PATH
```

#### Check 

```bash
code --version
# cursor --version
```

#### Install Local Extension

```bash
# Install the extension from VSIX
code --install-extension vscode-npm-manager-0.0.1.vsix
```

## Publishing to Marketplace

### First-Time Setup

1. Create a publisher account at https://marketplace.visualstudio.com/manage

2. Create a Personal Access Token (PAT):
   - Go to https://dev.azure.com
   - User Settings → Personal Access Tokens
   - Create new token with "Marketplace (Manage)" scope
   - Save the token securely

3. Login with vsce:
```bash
vsce login <your-publisher-name>
```

### Update package.json

Before publishing, update the `publisher` field in `package.json`:

```json
{
  "publisher": "your-actual-publisher-name"
}
```

### Publish

```bash
# Publish the current version
vsce publish

# Or bump version and publish
vsce publish patch  # 0.0.1 → 0.0.2
vsce publish minor  # 0.0.1 → 0.1.0
vsce publish major  # 0.0.1 → 1.0.0
```

## Code Quality

### Linting

```bash
npm run lint
```

### Type Checking

TypeScript compilation will catch type errors:
```bash
npm run compile
```

## Extension API Used

- `vscode.commands.registerCommand` - Register commands
- `vscode.window.createTerminal` - Create integrated terminal
- `vscode.window.showQuickPick` - Show script selection menu
- `vscode.window.showInformationMessage` - Show notifications
- Context menu API via `package.json` contributions

## Future Enhancements

Potential features to add:
- Support for yarn, pnpm, and other package managers
- Option to run scripts in debug mode
- Show script output inline
- Cancel running scripts
- Script history and favorites
- Custom script arguments
- Multi-root workspace support
- Icons for different script types

## Troubleshooting

### Extension doesn't activate
- Check the Output panel (View → Output → Extension Host)
- Ensure VSCode version is 1.74.0+

### Context menu doesn't appear
- Verify you're right-clicking on a file named exactly `package.json`
- Check the extension is enabled in Extensions view

### Scripts don't run
- Verify npm is installed and in PATH
- Check terminal output for errors
- Ensure package.json is valid JSON

## Resources

- [VSCode Extension API](https://code.visualstudio.com/api)
- [Extension Samples](https://github.com/microsoft/vscode-extension-samples)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

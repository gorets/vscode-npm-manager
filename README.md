# NPM Manager - VSCode Extension

A Visual Studio Code extension that adds convenient context menu items for managing NPM packages directly from package.json files.

## Features

Right-click on any `package.json` file to access a complete set of NPM commands through a convenient submenu:

### Basic Commands
- **NPM Install** - Install all dependencies from package.json
- **NPM Update** - Update dependencies to their latest versions
- **NPM CI** - Clean install (removes node_modules and installs from lock file)

### Testing & Scripts
- **NPM Test** - Run the test script defined in package.json
- **NPM Run...** - Interactive menu to select and run any custom script from package.json
- **NPM Build** - Run the build script
- **NPM Start** - Start the application

### Maintenance & Security
- **NPM Outdated** - Check which packages are outdated
- **NPM Audit** - Run security vulnerability audit
- **NPM Audit Fix** - Automatically fix security vulnerabilities
- **NPM Cache Clean** - Clear npm cache (uses --force flag)

### Release & Publishing
- **NPM Version** - Bump package version (submenu):
  - **Patch (0.0.x)** - Bug fixes and minor changes
  - **Minor (0.x.0)** - New features, backward compatible
  - **Major (x.0.0)** - Breaking changes
- **NPM Publish** - Publish to npm registry (submenu):
  - **Latest** - Publish with 'latest' tag
  - **Dev** - Publish with 'dev' tag

![NPM Manager Demo](images/demo.gif)

## Usage

1. Right-click on any `package.json` file in the Explorer
2. Select **NPM Commands** to open the submenu
3. Choose any command to execute it in the integrated terminal

The extension will automatically:
- Parse the package.json file
- Extract all available scripts
- Run the selected command in the correct directory
- Display status messages

## Installation

### From VSIX (Local Testing)

1. Download the `.vsix` file
2. Open VSCode
3. Go to Extensions view (Ctrl+Shift+X)
4. Click on the "..." menu at the top
5. Select "Install from VSIX..."
6. Choose the downloaded file

### From Marketplace

Search for "NPM Manager" in the VSCode Extensions marketplace.

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Visual Studio Code

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/vscode-npm-manager.git
cd vscode-npm-manager

# Install dependencies
npm install

# Compile the extension
npm run compile
```

### Testing Locally

1. Open the project in VSCode
2. Press F5 to open a new Extension Development Host window
3. Create or open a project with a package.json file
4. Right-click on package.json to test the context menu

### Build

To create a `.vsix` package:

```bash
npm run package
```

This will create a `vscode-npm-manager-x.x.x.vsix` file in the root directory.

## Publishing

### Prerequisites

1. Install vsce (Visual Studio Code Extension Manager):
```bash
npm install -g @vscode/vsce
```

2. Create a publisher account at https://marketplace.visualstudio.com/manage

3. Get a Personal Access Token (PAT) from Azure DevOps:
   - Go to https://dev.azure.com
   - Create a new organization if needed
   - Go to User Settings → Personal Access Tokens
   - Create a new token with "Marketplace (Manage)" scope

### Publishing Steps

1. Update version in `package.json`

2. Login to vsce:
```bash
vsce login <publisher-name>
```

3. Publish the extension:
```bash
npm run publish
# or
vsce publish
```

### Publishing with Specific Version

```bash
vsce publish minor  # Bumps minor version
vsce publish major  # Bumps major version
vsce publish patch  # Bumps patch version
vsce publish 1.0.0  # Specific version
```

## Configuration

Currently, the extension works out of the box without any configuration.

## Requirements

- VSCode version 1.74.0 or higher
- npm installed on your system

## Known Issues

None at the moment. Please report issues on GitHub.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Release Notes

### 0.0.1

Initial release with:
- Complete NPM Commands submenu in context menu
- Basic commands: Install, Update, CI
- Testing & Scripts: Test, Run (interactive), Build, Start
- Maintenance & Security: Outdated, Audit, Audit Fix, Cache Clean
- Release & Publishing:
  - Version bump submenu (Patch, Minor, Major)
  - Publish submenu (Latest tag, Dev tag)
- Dynamic script extraction from package.json
- Integrated terminal support for all commands

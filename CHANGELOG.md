# Change Log

All notable changes to the "vscode-npm-manager" extension will be documented in this file.

## [0.0.1] - 2024-11-12

### Added
- Initial release
- Complete NPM Commands submenu for package.json files
- Basic commands:
  - NPM Install - Install all dependencies
  - NPM Update - Update dependencies to latest versions
  - NPM CI - Clean install from lock file
- Testing & Scripts:
  - NPM Test - Run test script
  - NPM Run - Interactive selection of custom scripts from package.json
  - NPM Build - Run build script
  - NPM Start - Start application
- Maintenance & Security:
  - NPM Outdated - Check for outdated packages
  - NPM Audit - Security vulnerability audit
  - NPM Audit Fix - Automatically fix vulnerabilities
  - NPM Cache Clean - Clear npm cache (--force)
- Release & Publishing:
  - NPM Version submenu with Patch, Minor, Major version bumps
  - NPM Publish submenu with Latest and Dev tags
- Integrated terminal support for all commands
- Dynamic script extraction and display
- User feedback messages for all operations
- SVG icon (requires conversion to PNG for publishing)

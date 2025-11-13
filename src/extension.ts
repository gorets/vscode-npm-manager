import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface PackageJson {
  scripts?: { [key: string]: string };
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
}

export function activate(context: vscode.ExtensionContext) {
  console.log('NPM Manager extension is now active');

  // Register all NPM commands
  const commands = [
    vscode.commands.registerCommand('vscode-npm-manager.npmInstall', (uri: vscode.Uri) => runNpmCommand(uri, 'install', 'Installing dependencies')),
    vscode.commands.registerCommand('vscode-npm-manager.npmUpdate', (uri: vscode.Uri) => runNpmCommand(uri, 'update', 'Updating dependencies')),
    vscode.commands.registerCommand('vscode-npm-manager.npmUninstall', async (uri: vscode.Uri) => await showNpmUninstallQuickPick(uri)),
    vscode.commands.registerCommand('vscode-npm-manager.npmOutdated', (uri: vscode.Uri) => runNpmCommand(uri, 'outdated', 'Checking for outdated packages')),
    vscode.commands.registerCommand('vscode-npm-manager.npmAudit', (uri: vscode.Uri) => runNpmCommand(uri, 'audit', 'Running security audit')),
    vscode.commands.registerCommand('vscode-npm-manager.npmAuditFix', (uri: vscode.Uri) => runNpmCommand(uri, 'audit fix', 'Fixing security vulnerabilities')),
    vscode.commands.registerCommand('vscode-npm-manager.npmCI', (uri: vscode.Uri) => runNpmCommand(uri, 'ci', 'Running clean install')),
    vscode.commands.registerCommand('vscode-npm-manager.npmTest', (uri: vscode.Uri) => runNpmCommand(uri, 'test', 'Running tests')),
    vscode.commands.registerCommand('vscode-npm-manager.npmCacheClean', (uri: vscode.Uri) => runNpmCommand(uri, 'cache clean --force', 'Cleaning npm cache')),
    vscode.commands.registerCommand('vscode-npm-manager.npmBuild', (uri: vscode.Uri) => runNpmCommand(uri, 'run build', 'Building project')),
    vscode.commands.registerCommand('vscode-npm-manager.npmStart', (uri: vscode.Uri) => runNpmCommand(uri, 'start', 'Starting application')),
    vscode.commands.registerCommand('vscode-npm-manager.npmVersionPatch', (uri: vscode.Uri) => runNpmCommand(uri, 'version patch', 'Bumping patch version')),
    vscode.commands.registerCommand('vscode-npm-manager.npmVersionMinor', (uri: vscode.Uri) => runNpmCommand(uri, 'version minor', 'Bumping minor version')),
    vscode.commands.registerCommand('vscode-npm-manager.npmVersionMajor', (uri: vscode.Uri) => runNpmCommand(uri, 'version major', 'Bumping major version')),
    vscode.commands.registerCommand('vscode-npm-manager.npmPublishLatest', (uri: vscode.Uri) => runNpmCommand(uri, 'publish --tag latest', 'Publishing with latest tag')),
    vscode.commands.registerCommand('vscode-npm-manager.npmPublishDev', (uri: vscode.Uri) => runNpmCommand(uri, 'publish --tag dev', 'Publishing with dev tag')),
    vscode.commands.registerCommand('vscode-npm-manager.npmRun', async (uri: vscode.Uri) => await showNpmRunQuickPick(uri)),
  ];

  context.subscriptions.push(...commands);
}

async function showNpmRunQuickPick(uri: vscode.Uri) {
  const scripts = await getPackageJsonScripts(uri);

  if (scripts.length === 0) {
    vscode.window.showWarningMessage('No scripts found in package.json');
    return;
  }

  // Create quick pick items with script details
  const packageJsonPath = uri.fsPath;
  const content = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson: PackageJson = JSON.parse(content);

  const quickPickItems: vscode.QuickPickItem[] = scripts.map(scriptName => ({
    label: scriptName,
    description: packageJson.scripts?.[scriptName] || '',
  }));

  const selectedScript = await vscode.window.showQuickPick(quickPickItems, {
    placeHolder: 'Select a script to run',
    matchOnDescription: true,
  });

  if (selectedScript) {
    await runNpmScript(uri, selectedScript.label);
  }
}

async function showNpmUninstallQuickPick(uri: vscode.Uri) {
  const packageJsonPath = uri.fsPath;

  try {
    const content = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson: PackageJson = JSON.parse(content);

    const quickPickItems: vscode.QuickPickItem[] = [];

    // Add dependencies section
    if (packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0) {
      quickPickItems.push({
        label: 'Dependencies',
        kind: vscode.QuickPickItemKind.Separator
      });

      Object.keys(packageJson.dependencies).forEach(pkgName => {
        quickPickItems.push({
          label: pkgName,
          description: packageJson.dependencies?.[pkgName] || '',
          detail: 'dependency'
        });
      });
    }

    // Add devDependencies section
    if (packageJson.devDependencies && Object.keys(packageJson.devDependencies).length > 0) {
      quickPickItems.push({
        label: 'Dev Dependencies',
        kind: vscode.QuickPickItemKind.Separator
      });

      Object.keys(packageJson.devDependencies).forEach(pkgName => {
        quickPickItems.push({
          label: pkgName,
          description: packageJson.devDependencies?.[pkgName] || '',
          detail: 'devDependency'
        });
      });
    }

    if (quickPickItems.length === 0) {
      vscode.window.showWarningMessage('No packages found in package.json');
      return;
    }

    const selectedPackage = await vscode.window.showQuickPick(quickPickItems, {
      placeHolder: 'Select a package to uninstall',
      matchOnDescription: true,
    });

    if (selectedPackage && selectedPackage.kind !== vscode.QuickPickItemKind.Separator) {
      await runNpmUninstall(uri, selectedPackage.label, selectedPackage.detail === 'devDependency');
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Error reading package.json: ${error}`);
  }
}

async function getPackageJsonScripts(uri: vscode.Uri): Promise<string[]> {
  try {
    const packageJsonPath = uri.fsPath;
    const content = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson: PackageJson = JSON.parse(content);

    if (packageJson.scripts) {
      return Object.keys(packageJson.scripts);
    }
  } catch (error) {
    console.error('Error reading package.json:', error);
  }
  return [];
}

async function runNpmCommand(uri: vscode.Uri, command: string, message: string) {
  const workspaceFolder = path.dirname(uri.fsPath);

  const terminal = vscode.window.createTerminal({
    name: `NPM: ${command}`,
    cwd: workspaceFolder,
  });

  terminal.show();
  terminal.sendText(`npm ${command}`);

  vscode.window.showInformationMessage(`${message} in ${path.basename(workspaceFolder)}`);
}

async function runNpmScript(uri: vscode.Uri, scriptName: string) {
  const workspaceFolder = path.dirname(uri.fsPath);

  const terminal = vscode.window.createTerminal({
    name: `NPM Run: ${scriptName}`,
    cwd: workspaceFolder,
  });

  terminal.show();
  terminal.sendText(`npm run ${scriptName}`);

  vscode.window.showInformationMessage(`Running npm run ${scriptName} in ${path.basename(workspaceFolder)}`);
}

async function runNpmUninstall(uri: vscode.Uri, packageName: string, isDevDependency: boolean) {
  const workspaceFolder = path.dirname(uri.fsPath);

  const terminal = vscode.window.createTerminal({
    name: `NPM Uninstall: ${packageName}`,
    cwd: workspaceFolder,
  });

  terminal.show();
  terminal.sendText(`npm uninstall ${packageName}`);

  const depType = isDevDependency ? 'dev dependency' : 'dependency';
  vscode.window.showInformationMessage(`Uninstalling ${packageName} (${depType}) in ${path.basename(workspaceFolder)}`);
}

export function deactivate() {}

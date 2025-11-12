import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface PackageJson {
  scripts?: { [key: string]: string };
}

export function activate(context: vscode.ExtensionContext) {
  console.log('NPM Manager extension is now active');

  // Register NPM Install command
  const npmInstallCommand = vscode.commands.registerCommand(
    'vscode-npm-manager.npmInstall',
    async (uri: vscode.Uri) => {
      await runNpmInstall(uri);
    }
  );

  // Register NPM Run command with quick pick
  const npmRunCommand = vscode.commands.registerCommand(
    'vscode-npm-manager.npmRun',
    async (uri: vscode.Uri) => {
      await showNpmRunQuickPick(uri);
    }
  );

  context.subscriptions.push(npmInstallCommand, npmRunCommand);
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

async function runNpmInstall(uri: vscode.Uri) {
  const workspaceFolder = path.dirname(uri.fsPath);

  const terminal = vscode.window.createTerminal({
    name: 'NPM Install',
    cwd: workspaceFolder,
  });

  terminal.show();
  terminal.sendText('npm install');

  vscode.window.showInformationMessage(`Running npm install in ${path.basename(workspaceFolder)}`);
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

export function deactivate() {}

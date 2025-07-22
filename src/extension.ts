// src/extension.ts
import * as vscode from "vscode";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import * as path from "path";
import * as os from "os";

export function activate(ctx: vscode.ExtensionContext) {
  const sendCmd = vscode.commands.registerCommand(
    "vscodeCroc.sendFiles",
    // note the two-arg signature
    (
      contextSelection: vscode.Uri,
      allSelections: vscode.Uri[]
    ) => {
      // normalize to an array of URIs
      const uris = allSelections.length
        ? allSelections
        : [contextSelection];
      if (uris.length === 0) {
        return vscode.window.showWarningMessage(
          "No files selected"
        );
      }

      // build croc args
      const paths = uris.map((u) => u.fsPath);
      const args = ["send", ...paths];
      const cmdLine = `croc ${args
        .map((s) => `"${s}"`)
        .join(" ")}; exit`;

      // 1) visible terminal
      const term = vscode.window.createTerminal({
        name: "SendWithCroc",
      });
      term.show(true);
      term.sendText(cmdLine, true);

      // 2) hidden spawn to grab relay code
      let buf = "";
      let got = false;
      const hidden: ChildProcessWithoutNullStreams = spawn(
        "croc",
        args
      );
      hidden.stdout.on("data", (b) => {
        buf += b.toString();
        if (!got) {
          const m = buf.match(/Code is\s+([A-Za-z0-9\-]+)/);
          if (m) {
            got = true;
            const code = m[1];
            vscode.env.clipboard.writeText(code);
            vscode.window.showInformationMessage(
              `🚀 croc code copied: ${code}`
            );
          }
        }
      });
      hidden.stderr.on("data", (b) =>
        vscode.window.showErrorMessage(b.toString())
      );
      hidden.on("close", () => term.dispose());
    }
  );

  const receiveCmd = vscode.commands.registerCommand(
    "vscodeCroc.receiveFiles",
    async (
      contextSelection: vscode.Uri,
      allSelections: vscode.Uri[]
    ) => {
      // Determine the target directory
      let targetDir: string;
      if (contextSelection) {
        // If a file was right-clicked, use its containing directory
        const stats = await vscode.workspace.fs.stat(contextSelection);
        if (stats.type === vscode.FileType.File) {
          targetDir = path.dirname(contextSelection.fsPath);
        } else {
          targetDir = contextSelection.fsPath;
        }
      } else {
        // If no context, use the first workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
          return vscode.window.showErrorMessage(
            "No workspace folder found. Please open a folder first."
          );
        }
        targetDir = workspaceFolders[0].uri.fsPath;
      }

      // Check clipboard for croc code
      let code: string | undefined = await vscode.env.clipboard.readText();
      
      // Validate if the clipboard content looks like a croc code
      const crocCodePattern = /^[A-Za-z0-9\-]+$/;
      if (!code || !crocCodePattern.test(code.trim())) {
        // Prompt user for croc code
        code = await vscode.window.showInputBox({
          prompt: "Enter croc code to receive files",
          placeHolder: "e.g., ABC123-def456",
          validateInput: (input) => {
            if (!input || !crocCodePattern.test(input.trim())) {
              return "Please enter a valid croc code (alphanumeric with hyphens)";
            }
            return null;
          }
        });
        
        if (!code) {
          return; // User cancelled
        }
      }

      // Clean the code
      code = code.trim();

      // Create terminal and run croc receive
      const term = vscode.window.createTerminal({
        name: "ReceiveWithCroc",
        cwd: targetDir
      });
      term.show(true);
      
      // Use platform-specific croc command format
      const platform = os.platform();
      let cmdLine: string;
      
      if (platform === 'win32') {
        // Windows: croc <code>
        cmdLine = `croc ${code}; exit`;
      } else {
        // Linux/macOS: CROC_SECRET=<code> croc
        cmdLine = `CROC_SECRET=${code} croc; exit`;
      }
      
      term.sendText(cmdLine, true);

      vscode.window.showInformationMessage(
        `📥 Receiving files with code: ${code}`
      );
    }
  );

  ctx.subscriptions.push(sendCmd, receiveCmd);
}

export function deactivate() {}
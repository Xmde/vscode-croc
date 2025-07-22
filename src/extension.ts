// src/extension.ts
import * as vscode from "vscode";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

export function activate(ctx: vscode.ExtensionContext) {
  const cmd = vscode.commands.registerCommand(
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

  ctx.subscriptions.push(cmd);
}

export function deactivate() {}
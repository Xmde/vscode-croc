# vscode-croc

A Visual Studio Code extension that adds **Send with Croc** and **Receive with Croc** commands to the Explorer context menu.

## Send Files
Right-click on any file(s) or folder(s), select **Send with Croc**, and the extension will:

1. Spawn `croc send` in a terminal
2. Auto-copy the relay code to your clipboard  
3. Display transfer logs in real time

## Receive Files
Right-click on any file or folder, select **Receive with Croc**, and the extension will:

1. Check your clipboard for a croc code
2. If no valid code is found, prompt you to enter one
3. Open a terminal in the selected directory
4. Execute the croc receive command with platform-specific syntax  

---

## Features

- **Send Files**: Explorer context menu integration for sending files with croc
- **Receive Files**: Context menu integration for receiving files with croc
- **Cross-Platform Support**: Automatically uses the correct croc syntax for Windows, Linux, and macOS
- **Clipboard Integration**: Automatically detects croc codes from clipboard
- **Smart Directory Selection**: Receives files in the appropriate directory based on context
- **Real-time Logs**: Croc logs displayed in dedicated terminals
- **Automatic Code Copying**: Relay codes automatically copied to clipboard when sending  

---

## Requirements

- [croc](https://github.com/schollz/croc) installed and on your `PATH`  
- VS Code ≥ 1.50.0  

---

## Installation

### From the Marketplace

_TBD once published_

### From a VSIX

```bash
# Install vsce if you haven’t already
npm install -g vsce

# Package the extension (creates vscode-croc-0.0.1.vsix)
vsce package

# Install the generated VSIX
code --install-extension vscode-croc-0.0.1.vsix --force
```

### From Source

```bash
git clone https://github.com/your-username/vscode-croc.git
cd vscode-croc

# Install dependencies and compile
npm install
npm run compile

# Launch an Extension Development Host
code .
# Press F5 to open a new VS Code window with the extension loaded
```

---

## Usage

### Sending Files
1. Right-click on any file(s) or folder(s) in the Explorer view
2. Select **Send with Croc**  
3. Watch the terminal for croc logs  
4. The relay code is automatically copied to your clipboard
5. Share the code with the recipient

### Receiving Files
1. Right-click on any file or folder in the Explorer view
2. Select **Receive with Croc**
3. The extension will:
   - Check your clipboard for a croc code
   - If found and valid, use it automatically
   - If not found, prompt you to enter the code
4. After confirmation, files will be received in the selected directory
5. Watch the terminal for transfer progress

---

## Configuration

No configuration needed. The extension automatically handles:
- Cross-platform croc command syntax (Windows vs Linux/macOS)
- Clipboard integration for croc codes
- Smart directory selection for receiving files

If you need to pass additional flags to `croc`, you can customize the commands in `src/extension.ts`:

```typescript
// For sending files
const croc = spawn("croc", ["send", ...paths, "--relay", "your.relay.server"]);

// For receiving files (platform-specific)
const platform = os.platform();
if (platform === 'win32') {
  cmdLine = `croc ${code} --relay your.relay.server; exit`;
} else {
  cmdLine = `CROC_SECRET=${code} croc --relay your.relay.server; exit`;
}
```

---

## Development

- Code is bundled with Webpack (see `webpack.config.js`)  
- Entry point: `src/extension.ts`  
- Run `npm run compile` after changes  
- Use F5 in VS Code for iterative debugging  

---

## Contributing

1. Fork the repo  
2. Create a feature branch  
3. Submit a pull request  

Please adhere to the existing code style and include tests for new functionality.

---

## License

MIT © Eric Verheyden
# SendWithCroc

A Visual Studio Code extension that adds a **Send with Croc** command to the Explorer context menu.  
Select one or more files, right-click ▶ **Send with Croc**, and the extension will:

1. Spawn `croc send` in a terminal
2. Auto-copy the relay code to your clipboard  
3. Display transfer logs in real time  

---

## Features

- Explorer context menu integration  
- Real-time croc logs in a dedicated Output channel  
- Automatic copying of the croc relay code  

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

1. In the Explorer view, select one or more files or folders  
2. Right-click ▶ **Send with Croc**  
3. Watch the **croc** output channel for logs  
4. Paste the relay code into the receiving machine’s croc prompt  

---

## Configuration

No configuration needed. If you need to pass additional flags to `croc`, you can customize the command in `src/extension.ts`:

```typescript
const croc = spawn("croc", ["send", …paths, "--relay", "your.relay.server"]);
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
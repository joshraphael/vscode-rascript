# <p align="center">![ra](assets/ra_big.png "Retro Achievements VSCode")<br>vscode-rascript</p>

# RAScript extension for Visual Studio Code

The Visual Studio Code RAScript extension provides language support for the [RATools](https://github.com/Jamiras/RATools) scripting language.

[![GitHub License](https://img.shields.io/github/license/joshraphael/vscode-rascript)](https://github.com/joshraphael/vscode-rascript/blob/main/LICENSE)
[![pipeline](https://github.com/joshraphael/vscode-rascript/actions/workflows/publish.yaml/badge.svg)](https://github.com/joshraphael/vscode-rascript/actions/workflows/publish.yaml)
[![GitHub Tag](https://img.shields.io/github/v/tag/joshraphael/vscode-rascript)](https://github.com/joshraphael/vscode-rascript/tags)
[![GitHub repo size](https://img.shields.io/github/repo-size/joshraphael/vscode-rascript)](https://github.com/joshraphael/vscode-rascript/archive/main.zip)

Available on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=joshraphael.rascript) and [Open VSX Registry](https://open-vsx.org/extension/joshraphael/rascript)

## Requirements
- VSCode
- NPM
- Make
- dotnet (Optional -- used for language server)

## Quickstart
to start install all dependencies using `npm install`. Once installed the extension should be available to run in VSCode by pressing F5 to launch a new window running the code.

## Feature Highlights
- Syntax Highlighting - Custom RAScript syntax highlighting using TextMate.
- Function navigation - Jump to a functions defintion.
- Code Completion - Completion results appear for symbols as you type.
- Hover Info - Documentation appears when you hover over a function.

## Language Server
This extension has a [language server](https://github.com/joshraphael/rascript-language-server) available. To use it you will need [dotnet](https://learn.microsoft.com/en-us/dotnet/core/install/) installed. Once dotnet is installed you can begin downloading the latest release of the language server DLL file and place it in a location you remember on your computer. The VSCode extension will look for an environment variable called `RASCRIPT_LANGUAGE_SERVER_DLL` to call from the extension. Make sure the file path is correct otherwise the extension will show errors. ex:

Linux/MacOS:
```sh
export RASCRIPT_LANGUAGE_SERVER_DLL="/home/joshraphael/rascript-language-server.dll"
```

Windows:
```powershell
setx RASCRIPT_LANGUAGE_SERVER_DLL "C:\Users\joshraphael\rascript-language-server.dll"
```
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

## Quickstart
to start install all dependencies using `npm install`. Once installed the extension should be available to run in VSCode by pressing F5 to launch a new window running the code.

## Feature Highlights
- Syntax Highlighting - Custom RAScript syntax highlighting using TextMate.
- Function navigation - Jump to a functions defintion.
- Code Completion - Completion results appear for symbols as you type.
- Hover Info - Documentation appears when you hover over a function.

## Language Server
This extension has a [language server](https://github.com/joshraphael/rascript-language-server) available. You can begin by downloading the latest release of the language server file for your operating system and place it in a location you remember on your computer. The VSCode extension has an extension setting to specify the location of the langauge server binary. Open the settings menu using `Ctrl+,` then go to `User > Commonly Used > Extensions` and find the `RAScript Language Server` section. Underneath this youll find a string field called `Language Server` that you need to specify the full path to the binary, if it is not set or the file is not found the extension will default to some basic functionality (code jump, function hover text, code completion) without any RATools errors/Code Note hover text. You may need to restart VSCode after setting this value. Make sure the file path is correct otherwise the extension will show errors. Below are some examples of what the filepath could look like on different operating systems:

Linux/MacOS:
```text
/home/joshraphael/rascript-language-server_v0.0.1_linux-x64
```

Windows:
```text
C:\Users\joshraphael\rascript-language-server_v0.0.1_win-x64.exe
```
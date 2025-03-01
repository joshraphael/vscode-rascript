import * as vscode from 'vscode';
import { builtinFunctionDefinitions } from './functionDefinitions';

const G_FUNCTION_DEFINITION = /(\bfunction\b)\s*(\w+)\s*\(([^\(\)]*)\)/g; // keep in sync with syntax file rascript.tmLanguage.json #function-definitions regex
const G_COMMENTS = new RegExp('^\/\/.*$', 'g');
const G_VARIABLES = /(\w+)\s*=/g;

export function activate(context: vscode.ExtensionContext) {
    const definitions = vscode.languages.registerDefinitionProvider('rascript', {
        provideDefinition(document, position, token) {
            let text = document.getText();
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
            let m: RegExpExecArray | null;
            let functionDefinitions = new Map<string, vscode.Position>();
            while (m = G_FUNCTION_DEFINITION.exec(text)) {
                let pos = document.positionAt(m.index);
                functionDefinitions.set(m[2], pos);
            }
            if (functionDefinitions.has(word)) {
                let pos = functionDefinitions.get(word);
                if(pos !== undefined) {
                    let r = new vscode.Range(pos, pos);
                    const locLink: vscode.LocationLink = {
                        targetRange: r,
                        targetUri: document.uri,
                    };
                    return [locLink];
                }
            }
            return null;
        }
    });

    const hover = vscode.languages.registerHoverProvider('rascript', {
        provideHover(document: vscode.TextDocument, position: vscode.Position) {

            let words = [];
            for( let i = 0; i < builtinFunctionDefinitions.length; i++) {
                let fn = builtinFunctionDefinitions[i];
                let comment = fn.commentDoc.join("\n");
                words.push(newHoverText(fn.key, comment, fn.url, ...fn.args));
            }
            let text = document.getText();
            let m: RegExpExecArray | null;
            let functionDefinitions = new Map<string, vscode.Position>();
            while (m = G_FUNCTION_DEFINITION.exec(text)) {
                let pos = document.positionAt(m.index);
                functionDefinitions.set(m[2], pos);
                let comment = '';
                if( pos.line > 0 ) { // dont look for comments if were at the top of the file
                    let offset = 1;
                    // while not at the top of the file and the next line up is a comment
                    while(pos.line - offset >= 0) {
                        let line = document.lineAt(new vscode.Position(pos.line - offset, 0)).text;
                        let isComment = G_COMMENTS.test(line);
                        G_COMMENTS.lastIndex = 0; // POS js
                        if(isComment) {
                            comment = line + "\n" + comment;
                            offset = offset + 1;
                        } else {
                            break;
                        }
                    }
                }
                let args = m[3].split(",").map(s => s.trim());
                words.push(newHoverText(m[2], comment, "", ...args));
            }
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);

            for (let i = 0; i < words.length; i++) {
                if (words[i].key === word) {
                    return words[i].hover;
                }
            }
            return null;
        }
    });
    const autocomplete = vscode.languages.registerCompletionItemProvider(
        'rascript',
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                let completionItems = [];
                for( let i = 0; i < builtinFunctionDefinitions.length; i++) {
                    let fn = builtinFunctionDefinitions[i];
                    completionItems.push(newBuiltInFunction(fn.key));
                }
                let text = document.getText();
                let m: RegExpExecArray | null;
                while (m = G_FUNCTION_DEFINITION.exec(text)) {
                    completionItems.push(newBuiltInFunction(m[2]));
                }
                while (m = G_VARIABLES.exec(text)) {
                    completionItems.push(newVariable(m[1]));
                }

                return completionItems;
            }
        }
    );

    context.subscriptions.push(autocomplete, hover, definitions);
}

function newBuiltInFunction(name: string) {
    const snippetCompletion = new vscode.CompletionItem(name);
    snippetCompletion.insertText = new vscode.SnippetString(name + '()');
    snippetCompletion.kind = vscode.CompletionItemKind.Function;
    const moveCursorCommand: vscode.Command = {
        title: "Move cursor left between parentheses",
        command: "cursorLeft"
    };
            
    snippetCompletion.command = moveCursorCommand;
    return snippetCompletion;
}

function newVariable(name: string) {
    const snippetCompletion = new vscode.CompletionItem(name, vscode.CompletionItemKind.Variable);

    return snippetCompletion;
}

interface HoverData {
    key: string;
    hover: vscode.Hover;
}

function newHoverText(key: string, text: string, docUrl: string, ...args: string[]): HoverData {
    let argStr = args.join(", ");
    let commentLines = text.split(/\r?\n/);
    let lines = [
        `\`\`\`rascript\nfunction ${key}(${argStr})\n\`\`\``
    ];
    if( text !== '') {
        lines.push('---');
        let curr = '';
        let codeBlock = false;
        for (let i = 0; i < commentLines.length; i++) {
            let line = commentLines[i].replace(/^\/\//g, "");
            if (line.startsWith(' ')) {
                line = line.substring(1);
            }
            if (line.startsWith('```')) {
                codeBlock = !codeBlock;
                if(codeBlock) {
                    curr = line;
                } else {
                    curr = curr + "\n" + line;
                    lines.push(curr);
                    curr = '';
                }
                continue;
            }
            if (line.startsWith('|') || line.startsWith('*')) {
                line = line + "\n";
            }
            if(codeBlock) {
                curr = curr + "\n" + line;
            } else {
                if( line === '' ) {
                    lines.push(curr);
                    curr = '';
                } else {
                    curr = curr + " " + line;
                }
            }
        }
        if( curr !== '' ) {
            lines.push(curr);
        }
        if( codeBlock ) {
            lines.push('```');
        }
    }
    if( docUrl !== '') {
        lines.push('---');
        lines.push(`[Wiki link for \`${key}()\`](${docUrl})`);
    }

    return {
        key: key,
        hover: new vscode.Hover(lines)
    };
}
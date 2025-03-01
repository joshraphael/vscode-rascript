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

            let words = [
                // newHoverText("leaderboard", "// Defines a leaderboard. `title` and `description` must be strings.\n//\n// `start`, `cancel`, and `submit` are trigger expressions similar to the [`achievement`](https://github.com/Jamiras/RATools/wiki/Achievement-Functions)'s `trigger` parameter.\n//\n// `value` is a memory accessor, arithmetic expression, or a function that evaluates to a memory accessor or arithmetic expression.\n// Multiple values may be defined by encasing them in a `max_of(a, b, ...)` function.\n//\n// `format` is one of the following:\n//\n// * `VALUE` - number (default)\n//\n// * `SECS` - the value is a number of seconds that should be formatted as `MM:SS`\n//\n// * `FRAMES` - the value is divided by 60 and displayed as `MM:SS`\n//\n// * `POINTS` - the value should be displayed as a zero-padded six digit number\n//\n// * `MILLISECS` - the value is a number of hundredths of a second and will be displayed as `MM:SS.FF`\n//\n// * `MINUTES` - the value is a number of minutes that should be formatted as `HHhMM`\n//\n// * `SECS_AS_MINS` - the value is a number of seconds that should be formatted as `HHhMM`\n//\n// * `FLOAT1` ... `FLOAT6` - the value is formatted to N digits after the decimal (FLOAT1 = 1 digit after the decimal, FLOAT3 = 3 digits after the decimal, etc).\n//\n// * `FIXED1` ... `FIXED3` - the value is formatted with a decimal point N spaces from the end (FIXED1 = 1 digit after the decimal).\n//\n// * `TENS`, `HUNDREDS`, `THOUSANDS` - the value is padded with additional 0s after the end of the value.\n//\n//\n// if `lower_is_better` is `true`, lower scores will be ranked higher in the leaderboard.\n//\n// if `id` is provided when calling the `leaderboard` function, the script will generate a local leaderboard definition that the toolkit will merge into the existing leaderboard instead of putting as a separate local leaderboard.", "https://github.com/Jamiras/RATools/wiki/Leaderboard-Functions", "title", "description", "start", "cancel", "submit", "value", "format", "lower_is_better", "id"),
            ];
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
                let completionItems = [
                    newBuiltInFunction('byte'),
                    newBuiltInFunction('word'),
                    newBuiltInFunction('tbyte'),
                    newBuiltInFunction('dword'),
                    newBuiltInFunction('bit0'),
                    newBuiltInFunction('bit1'),
                    newBuiltInFunction('bit2'),
                    newBuiltInFunction('bit3'),
                    newBuiltInFunction('bit4'),
                    newBuiltInFunction('bit5'),
                    newBuiltInFunction('bit6'),
                    newBuiltInFunction('bit7'),
                    newBuiltInFunction('bit'),
                    newBuiltInFunction('low4'),
                    newBuiltInFunction('high4'),
                    newBuiltInFunction('bitcount'),
                    newBuiltInFunction('word_be'),
                    newBuiltInFunction('tbyte_be'),
                    newBuiltInFunction('dword_be'),
                    newBuiltInFunction('float'),
                    newBuiltInFunction('mbf32'),
                    newBuiltInFunction('mbf32_le'),
                    newBuiltInFunction('double32'),
                    newBuiltInFunction('double32_be'),
                    newBuiltInFunction('prev'),
                    newBuiltInFunction('prior'),
                    newBuiltInFunction('bcd'),
                    newBuiltInFunction("ascii_string_equals"),
                    newBuiltInFunction("unicode_string_equals"),
                    newBuiltInFunction('repeated'),
                    newBuiltInFunction('once'),
                    newBuiltInFunction('tally'),
                    newBuiltInFunction('never'),
                    newBuiltInFunction('unless'),
                    newBuiltInFunction('measured'),
                    newBuiltInFunction('trigger_when'),
                    newBuiltInFunction('disable_when'),
                    newBuiltInFunction('always_true'),
                    newBuiltInFunction('always_false'),
                    newBuiltInFunction('format'),
                    newBuiltInFunction('substring'),
                    newBuiltInFunction('length'),
                    newBuiltInFunction('range'),
                    newBuiltInFunction('array_map'),
                    newBuiltInFunction('array_contains'),
                    newBuiltInFunction('array_push'),
                    newBuiltInFunction('array_pop'),
                    newBuiltInFunction('dictionary_contains_key'),
                    newBuiltInFunction('any_of'),
                    newBuiltInFunction('all_of'),
                    newBuiltInFunction('none_of'),
                    newBuiltInFunction('sum_of'),
                    newBuiltInFunction('tally_of'),
                    newBuiltInFunction('assert'),
                    newBuiltInFunction('achievement'),
                    newBuiltInFunction('rich_presence_display'),
                    newBuiltInFunction('rich_presence_value'),
                    newBuiltInFunction('rich_presence_lookup'),
                    newBuiltInFunction('rich_presence_ascii_string_lookup'),
                    newBuiltInFunction('rich_presence_macro'),
                    newBuiltInFunction('rich_presence_conditional_display'),
                    newBuiltInFunction('leaderboard')
                ];
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
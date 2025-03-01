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
                // newHoverText("rich_presence_display", "// Parameters:\n//\n// `format_string` - the format string template\n//\n// `parameters` - (Optional) the list of replacement values\n//\n// Defines the rich presence display string.\n// Only one string may be defined per script.\n// If this function is called multiple times, the last one will win.\n//\n// `format_string` is a string with zero or more placeholders that will be evaluated by the emulator at runtime.\n// It uses the same syntax as the [`format`](https://github.com/Jamiras/RATools/wiki/Built-in-Functions#formatformat_string-parameters) function.\n//\n// For each placeholder a parameter must be defined using a `rich_presence_value` or `rich_presence_lookup` function.", "https://github.com/Jamiras/RATools/wiki/Rich-Presence-Functions#rich_presence_displayformat_string-parameters", "format_string", "parameters"),
                // newHoverText("rich_presence_value", "// Parameters:\n//\n// `name` - placeholder name\n//\n// `expression` - value to uses\n//\n// `format` - (Optional) format to display the value\n//\n// `name` is the name to associate to the placeholder.\n//\n// ---\n//\n// `expression` is a [memory accessor](https://github.com/Jamiras/RATools/wiki/Accessing-Memory), [arithmetic expression](https://github.com/Jamiras/RATools/wiki/Operators#arithmetic-operations), or a function that evaluates to a memory accessor or arithmetic expression.\n//\n// `format` is one of the following:\n//\n// * `VALUE` - number (default)\n//\n// * `SECS` - the value is a number of seconds that should be formatted as `MM:SS`\n//\n// * `FRAMES` - the value is a number of frames that should be converted to seconds and displayed as `MM:SS`\n//\n// * `POINTS` - the value should be displayed as a six digit score value followed by the word 'POINTS'\n//\n// * `MILLISECS` - the value is a number of hundredths of a second and will be displayed as `MM:SS.FF`\n//\n// * `MINUTES` - the value is a number of minutes that should be formatted as `HHhMM`\n//\n// * `SECS_AS_MINS` - the value is a number of seconds that should be formatted as `HHhMM`\n//\n// * `FLOAT1` ... `FLOAT6` - the value is formatted to N digits after the decimal (FLOAT1 = 1 digit after the decimal, FLOAT3 = 3 digits after the decimal, etc).\n//\n// * `FIXED1` ... `FIXED3` - the value is formatted with a decimal point N spaces from the end (FIXED1 = 1 digit after the decimal).\n//\n// * `TENS`, `HUNDREDS`, `THOUSANDS` - the value is padded with additional 0s after the end of the value.", "https://github.com/Jamiras/RATools/wiki/Rich-Presence-Functions#rich_presence_valuename-expression-format", "name", "expression", "format"),
                // newHoverText("rich_presence_lookup", "// `name` is the name to associate to the placeholder. \n//\n// `expression` is a memory accessor, arithmetic expression, or a function that evaluates to a memory accessor or arithmetic expression.\n//\n// `dictionary` is the [key to value map](https://github.com/Jamiras/RATools/wiki/Variables#dictionaries) used to convert the result of `expression` into a string.\n//\n// `fallback` is an optional parameter that tells the display string what to display if the value isn't found in the dictionary. If not specified, empty string \"\" will be displayed when a value is not found in the dictionary.\n//\n// #### Example\n//\n// ```rascript\n// function lives() => byte(0x05D4) + 1\n// function stage() => byte(0x003A)\n//\n// stages = { 1: \"Downtown\", 2: \"Sewers\" }\n//\n// rich_presence_display(\"{0}, {1} lives\",\n//     rich_presence_lookup(\"Stage\", stage(), stages),\n//     rich_presence_value(\"Lives\", lives())\n// )\n// ```", "https://github.com/Jamiras/RATools/wiki/Rich-Presence-Functions#rich_presence_lookupname-expression-dictionary-fallback", "name", "expression", "dictionary", "fallback"),
                // newHoverText("rich_presence_ascii_string_lookup", "// Creates a unique mapping from the keys of `dictionary` to match an ASCII string at `address` and constructs a rich presence lookup.\n//\n// `name` is the name to associate to the placeholder. \n//\n// `address` is the address of the ASCII string. If a memory accessor is passed, it's assumed to be a pointer to the ASCII string.\n//\n// `dictionary` is the key to value map used to map the ASCII string at `address` to a display string.\n//\n// `fallback` is an optional parameter that tells the display string what to display if the ASCII string isn't found in the dictionary. If not specified, empty string \"\" will be displayed when a value is not found in the dictionary.\n//\n// #### Example\n//\n// ```rascript\n// function lives() => byte(0x05D4) + 1\n// function stage_buffer_address() => 0x003A // 8-byte ASCII string\n//\n// stages = { \"LVL_DTWN\": \"Downtown\", \"LVL_SWRS\": \"Sewers\" }\n//\n// rich_presence_display(\"{0}, {1} lives\",\n//     rich_presence_ascii_string_lookup(\"Stage\", stage_buffer_address(), stages),\n//     rich_presence_value(\"Lives\", lives())\n// )\n// ```", "https://github.com/Jamiras/RATools/wiki/Rich-Presence-Functions#rich_presence_ascii_string_lookupname-address-dictionary-fallback", "name", "address", "dictionary", "fallback"),
                // newHoverText("rich_presence_macro", "//`macro` is the name of the built-in macro to use.\n//\n// * `Number` - number (default)\n//\n// * `Score` - number padded with leading 0s to 6 digits\n//\n// * `Seconds` - the value is a number of seconds that should be formatted as `MM:SS`\n//\n// * `Centiseconds` - the value is a number of hundredths of a second and will be displayed as `MM:SS.FF`\n//\n// * `Minutes` - the value is a number of minutes that should be formatted as `HHhMM`\n//\n// * `ASCIIChar` - the value is converted to a character using the ASCII lookup table\n//\n// * `UnicodeChar` - the value is converted to a character using the UCS2 (16-bit unicode) lookup table\n//\n// * `Float1` ... `Float6` - the value is formatted to N digits after the decimal (Float1 = 1 digit after the decimal, Float3 = 3 digits after the decimal, etc).\n//\n// * `Fixed1` ... `Fixed3` - the value is formatted with a decimal point N spaces from the end (Fixed1 = 1 digit after the decimal).\n//\n// `expression` is a [memory accessor](https://github.com/Jamiras/RATools/wiki/Accessing-Memory), [arithmetic expression](https://github.com/Jamiras/RATools/wiki/Operators#arithmetic-operations), or a function that evaluates to a memory accessor or arithmetic expression.", "https://github.com/Jamiras/RATools/wiki/Rich-Presence-Functions#rich_presence_macromacro-expression", "macro", "expression"),
                // newHoverText("rich_presence_conditional_display", "// Defines a conditional rich presence display string.\n// When executing the rich presence script, each `condition` is examined in order.\n// If a condition is matched, that display string will be used.\n// If no conditions are matched, the default display string will be used.\n// You must still provide a default display string by calling `rich_presence_display`.\n//\n// This function has the same structure as `rich_presence_display` with the additional `condition` parameter.\n// `condition` must evaluate to one or more [comparisons](https://github.com/Jamiras/RATools/wiki/Operators#comparisons).\n//\n// #### Example\n//\n// ```rascript\n// rich_presence_conditional_display(is_title_screen(), \"Title Screen\")\n// rich_presence_display(\"Playing Battle {0} in {1}\", \n//     rich_presence_value(\"Battle\", current_level()),\n//     rich_presence_lookup(\"Landscape\", current_landscape(), landscapes)\n// )\n// ```\n//\n// **NOTE**: To actually publish the script, you have to copy the script definition to the clipboard (there's a link on the viewer for the rich presence) and paste it into the appropriate field on the website.", "https://github.com/Jamiras/RATools/wiki/Rich-Presence-Functions#rich_presence_conditional_displaycondition-format_string-parameters", "condition", "format_String", "parameters"),
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
            if (line.startsWith('|')) {
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
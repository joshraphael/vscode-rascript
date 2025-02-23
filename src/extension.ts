/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';
import * as util from "util";

export function activate(context: vscode.ExtensionContext) {

    const hover = vscode.languages.registerHoverProvider('rascript', {
        provideHover(document: vscode.TextDocument, position: vscode.Position) {

            let words = [
                newHoverText("byte", "// Parameters:\n//\n// `address` - memory address\n//\n// the 8-bit value at the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("word", "// Parameters:\n//\n// `address` - memory address\n//\n// the 16-bit value at the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("tbyte", "// Parameters:\n//\n// `address` - memory address\n//\n// the 24-bit value at the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("dword", "// Parameters:\n//\n// `address` - memory address\n//\n// the 32-bit value at the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("bit0", "// Parameters:\n//\n// `address` - memory address\n//\n// the least significant bit of the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("bit1", "// Parameters:\n//\n// `address` - memory address\n//\n// the second least significant bit of the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("bit2", "// Parameters:\n//\n// `address` - memory address\n//\n// the third least significant bit of the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("bit3", "// Parameters:\n//\n// `address` - memory address\n//\n// the fourth least significant bit of the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("bit4", "// Parameters:\n//\n// `address` - memory address\n//\n// the fifth least significant bit of the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("bit5", "// Parameters:\n//\n// `address` - memory address\n//\n// the sixth least significant bit of the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("bit6", "// Parameters:\n//\n// `address` - memory address\n//\n// the seventh least significant bit of the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("bit7", "// Parameters:\n//\n// `address` - memory address\n//\n// the most significant bit of the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("bit", "// Parameters:\n//\n// `index` - n-th bit\n//\n// `address` - memory address\n//\n// the `index`th bit of the specified address (`index` must be between 0 and 31)", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "index", "address"),
                newHoverText("low4", "// Parameters:\n//\n// `address` - memory address\n//\n// the four least significant bits of the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("high4", "// Parameters:\n//\n// `address` - memory address\n//\n// the four most significant bits of the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("bitcount", "// Parameters:\n//\n// `address` - memory address\n//\n// the number of non-zero bits at the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("word_be", "// Parameters:\n//\n// `address` - memory address\n//\n// the 16-bit big-endian value at the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("tbyte_be", "// Parameters:\n//\n// `address` - memory address\n//\n// the 24-bit big-endian value at the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("dword_be", "// Parameters:\n//\n// `address` - memory address\n//\n// the 32-bit big-endian value at the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("float", "// Parameters:\n//\n// `address` - memory address\n//\n// the 32-bit IEEE-754 floating point value at the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("mbf32", "// Parameters:\n//\n// `address` - memory address\n//\n// the 32-bit Microsoft Binary Format floating point value at the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("mbf32_le", "// Parameters:\n//\n// `address` - memory address\n//\n// the 32-bit Microsoft Binary Format floating point value (in little-endian form) at the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("double32", "// Parameters:\n//\n// `address` - memory address\n//\n// the 32 most significant bits of a 64-bit double at the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("double32_be", "// Parameters:\n//\n// `address` - memory address\n//\n// the 32 most significant bits of a 64-bit double (in big-endian form). Note: specified address should be offset for the most significant bits.", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "address"),
                newHoverText("prev", "// Parameters:\n//\n// `accessor` - memory accessor function\n//\n// the value of the specified address from the previous frame", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "accessor"),
                newHoverText("prior", "// Parameters:\n//\n// `accessor` - memory accessor function\n//\n// the last differing value of the specified address", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "accessor"),
                newHoverText("bcd", "// Parameters:\n//\n// `accessor` - memory accessor function\n//\n// converts a BCD-encoded value to decimal for leaderboard and rich presence values.", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory", "accessor"),
                newHoverText("ascii_string_equals", "// Parameters:\n//\n// `address` - memory address\n//\n// `string` - string to compare\n//\n// `length` - (Optional) length of string\n//\n// `transform` - (Optional) transform on the address\n//\n// match memory to strings assuming they're encoded using ASCII (7-bit latin characters)", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory#string-matching", "address", "string", "length", "transform"),
                newHoverText("unicode_string_equals", "// Parameters:\n//\n// `address` - memory address\n//\n// `string` - string to compare\n//\n// `length` - (Optional) length of string\n//\n// `transform` - (Optional) transform on the address\n//\n// match memory to strings assuming they're encoded using Unicode (16-bit international alphabets)", "https://github.com/Jamiras/RATools/wiki/Accessing-Memory#string-matching", "address", "string", "length", "transform"),
                newHoverText("repeated", "// Parameters:\n//\n// `count` - number of repetitions\n//\n// `comparison` - condition that must be true\n//\n// Adds a Hit Target to the condition.\n// The specified `comparison` must be true for count frames for the trigger to fire.\n// The frames do not have to be consecutive.\n// Once the Hit Target is met, the condition is considered true until it is reset.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#repeatedcount-comparison", "count", "comparison"),
                newHoverText("once", "// Parameters:\n//\n// `comparison` - condition that must be true\n//\n// Shorthand for `repeated(1, comparison)`.\n// The specified `comparison` must have been true at one point, but is not required to currently be true to trigger the achievement.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#oncecomparison", "comparison"),
                newHoverText("tally", "// Parameters:\n//\n// `count` - number of repetitions\n//\n// `comparisons` - list of conditions that can add to the tally count\n//\n// Adds a Hit Target to the condition where multiple conditions may be true in the same frame.\n// `comparison` may be an array of conditions, or multiple conditions passed as individual parameters.\n// Each condition that is true on each frame will tally a Hit Count.\n// Multiple Hit Counts may be tallied in the same frame.\n// The overall tally must reach `count` for the trigger to fire.\n// Once the Hit Target is met, the condition is considered true until it is reset.\n//\n// Individual conditions in the `comparisons` list may be wrapped in a `deduct()` function call, which causes any hits counted by the condition to be deducted from the overall tally.\n//\n// If `count` is zero, the overall condition will become true as soon as any individual comparison is true.\n// This is mostly used when building leaderboard value clauses using the `measured` function as it provides an unbounded counting of the subclauses.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#tallycount-comparisons", "count", "comparison"),
                newHoverText("never", "// Parameters:\n//\n// `comparison` - condition that must be true\n//\n// This becomes a `ResetIf`. If the `comparison` is true, all Hit Counts in the trigger are reset to 0, and the trigger cannot fire.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#nevercomparison", "comparison"),
                newHoverText("unless", "// Parameters:\n//\n// `comparison` - condition that must be true\n//\n// This becomes a PauseIf.\n// The group containing the PauseIf is not processed while the condition is true, and the trigger cannot fire.\n//\n// `unless` has precedence over `never`.\n// A paused group will not evaluate it's reset statements.\n// If the `comparison` is a `repeated` condition, once the Hit Target has been met, the group will be \"Pause Lock\"ed until a `never` resets it's Hit Count from another group.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#unlesscomparison", "comparison"),
                newHoverText("measured", "// Parameters:\n//\n// `comparison` - condition that must be true\n//\n// `when` - (Optional) secondary condition that must be true\n//\n// `format` - (Optional) format of value `raw` or `percent`\n//\n// This adds a `Measured` flag to the comparison. If the `comparison` is repeated, the Measured value will be the current number of hits on the condition, and the measurement target will be the Hit Target for the condition. Otherwise, the Measured value will be the left side value and the measurement target will be the right side value (regardless of the comparison operation).\n//\n// When used in an achievement, Measurements are displayed in the overlay. Use the `when` parameter to specify a secondary condition that must be true for the Measured value to be reported (i.e. for achievements where the player must be using a specific character). If the `when` condition is false, the Measured value will be 0, regardless of the values in the associated memory. Both the `comparison` (and `when` condition if provided) must be true for the achievement to trigger.\n//\n// `format` may be set to `percent` to change the display in the overlay to report a percentage instead of the raw measured value (i.e. 75% instead of 3/4)\n//\n// When used in rich presence or leaderboards, the Measured value is captured and the measurement target is ignored.\n//\n// **Using with complex conditions**\n//\n// `comparison` may be a series of AND'd or OR'd conditions.\n// This will cause `repeated`, `once`, and `measured` to generate a series of OrNext and AndNext conditions, and `never` and `unless` will generate a series of ResetIf/PauseIf conditions.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#measuredcomparison-whenalways_true-formatraw", "comparison", "when", "format"),
                newHoverText("trigger_when", "// Parameters:\n//\n// `comparison` - condition that must be true\n//\n// This adds a `Trigger` flag to the comparison, which tells the runtime that the specified conditions are the last conditions that will be true for the achievement.\n// When all other logical conditions are true, the runtime may display an indicator on-screen to let the user know they're close to completing an achievement.\n// Should be used for tracking challenges, like defeating a boss without taking damage.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#trigger_whencomparison", "comparison"),
                newHoverText("disable_when", "// Parameters:\n//\n// `comparison` - condition that must be true\n//\n// `until` - (Optional) condition to reset the hit count\n//\n// This adds a `PauseIf` flag and a hit target to the comparison. If `comparison` is not a `repeated()` condition, the hit target will be 1, otherwise the hit target will come from the `repeated()` function call. When the hit target is met, the runtime will disable the achievement indefinitely. This is most often used to disable achievements while a cheat is active.\n//\n// If `until` is specified, it will generate a `ResetNextIf` condition attached to the `PauseIf`, which will clear the hit count when true, thereby re-enabling the achievement.", "https://github.com/Jamiras/RATools/wiki/Trigger-Functions#disable_whencomparison-untilalways_false", "comparison", "until"),
                newHoverText("always_true", "// Defines the clause \"1==1\".\n// It is typically only used to move a PauseIf/ResetIf to an alt group:\n//\n`byte(0x1234) == 8 && (always_true() || (never(byte(0x2345) == 12) && unless(byte(0x3456) == 6)))`\n//\nThis allows the achievement (core group) to trigger while the `never` is paused by the `unless`.", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#always_true"),
                newHoverText("always_false", "// Defines the clause \"0==1\".\n// It is typically used for constructing alt chains, as a variable must have an initial value:\n//\n// ```rascript\n// trigger = always_false()\n// for test in tests\n//     trigger = trigger || test\n// achievement(..., trigger = trigger)\n// ```\n//\n// If more than two alt groups exist, the `always_false` group will be removed from the final achievement code", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#always_false"),
                newHoverText("format", "// Parameters:\n//\n// `format_string` - the format string template\n//\n// `parameters` - (Optional) the list of replacement values\n//\n// Builds a string by inserting parameters into placeholders in the format_string.\n//\n// For example:\n//\n// ```rascript\n// stage_names = {\n//     1: \"Downtown\"\n// }\n// stage_1_label = format(\"Stage {0} - {1}\", 1, stage_names[1])\n// ```\n//\n// Would set stage_1_label to \"Stage 1 - Downtown\"", "https://github.com/Jamiras/RATools/wiki/Built-in-Functions#formatformat_string-parameters", "format_string", "parameters"),
            ];
            let text = document.getText();
            let pattern = /(\bfunction\b)\s*(\w+)\s*\(([^\(\)]*)\)/g; // keep in sync with syntax file rascript.tmLanguage.json #function-definitions regex
            let m: RegExpExecArray | null;
            while (m = pattern.exec(text)) {
                let pos = document.positionAt(m.index);
                let line = document.lineAt(pos);
                console.log(line.text);
            }
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);

            for (let i = 0; i < words.length; i++) {
                if (words[i].key === word) {
                    return words[i].hover;
                }
            }
        }
    });
    const autocomplete = vscode.languages.registerCompletionItemProvider(
        'rascript',
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                let text = document.getText();
                let pattern = /(\bfunction\b)\s*(\w+)\s*\(([^\(\)]*)\)/g;
                let m: RegExpExecArray | null;
                while (m = pattern.exec(text)) {
                    let pos = document.positionAt(m.index);
                    let line = document.lineAt(pos);
                    console.log(line.text);
                }

                return [
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
            }
        }
    );

    context.subscriptions.push(autocomplete, hover);
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

interface HoverData {
    key: string;
    hover: vscode.Hover;
}

function newHoverText(key: string, text: string, docUrl: string, ...args: string[]): HoverData {
    let argStr = args.join(", ");
    let commentLines = text.split(/\r?\n/);
    let lines = [
        util.format('```rascript\nfunction %s(%s)\n```', key, argStr)
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
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';
import * as util from "util";

export function activate(context: vscode.ExtensionContext) {

	const hover = vscode.languages.registerHoverProvider('rascript', {
		provideHover(document: vscode.TextDocument, position: vscode.Position) {

			let words = [
				newHoverText("byte", "// the 8-bit value at the specified address\nfunction %s(address)"),
				newHoverText("word", "// the 16-bit value at the specified address\nfunction %s(address)"),
				newHoverText("tbyte", "// the 24-bit value at the specified address\nfunction %s(address)"),
				newHoverText("dword", "// the 32-bit value at the specified address\nfunction %s(address)"),
				newHoverText("bit0", "// the least significant bit of the specified address\nfunction %s(address)"),
				newHoverText("bit1", "// the second least significant bit of the specified address\nfunction %s(address)"),
				newHoverText("bit2", "// the third least significant bit of the specified address\nfunction %s(address)"),
				newHoverText("bit3", "// the fourth least significant bit of the specified address\nfunction %s(address)"),
				newHoverText("bit4", "// the fifth least significant bit of the specified address\nfunction %s(address)"),
				newHoverText("bit5", "// the sixth least significant bit of the specified address\nfunction %s(address)"),
				newHoverText("bit6", "// the seventh least significant bit of the specified address\nfunction %s(address)"),
				newHoverText("bit7", "// the most significant bit of the specified address\nfunction %s(address)"),
				newHoverText("bit", "// the `index`th bit of the specified address (`index` must be between 0 and 31)\nfunction %s(index, address)"),
				newHoverText("low4", "// the four least significant bits of the specified address\nfunction %s(address)"),
				newHoverText("high4", "// the four most significant bits of the specified address\nfunction %s(address)"),
				newHoverText("bitcount", "// the number of non-zero bits at the specified address\nfunction %s(address)"),
				newHoverText("word_be", "// the 16-bit big-endian value at the specified address\nfunction %s(address)"),
				newHoverText("tbyte_be", "// the 24-bit big-endian value at the specified address\nfunction %s(address)"),
				newHoverText("dword_be", "// the 32-bit big-endian value at the specified address\nfunction %s(address)"),
				newHoverText("float", "// the 32-bit IEEE-754 floating point value at the specified address\nfunction %s(address)"),
				newHoverText("mbf32", "// the 32-bit Microsoft Binary Format floating point value at the specified address\nfunction %s(address)"),
				newHoverText("mbf32_le", "// the 32-bit Microsoft Binary Format floating point value (in little-endian form) at the specified address\nfunction %s(address)"),
				newHoverText("double32", "// the 32 most significant bits of a 64-bit double at the specified address\nfunction %s(address)"),
				newHoverText("double32_be", "// the 32 most significant bits of a 64-bit double (in big-endian form). Note: specified address should be offset for the most significant bits.\nfunction %s(address)"),
				newHoverText("prev", "// the value of the specified address from the previous frame\nfunction %s(accessor(address))"),
				newHoverText("prior", "// the last differing value of the specified address\nfunction %s(accessor(address))"),
				newHoverText("bcd", "// converts a BCD-encoded value to decimal for leaderboard and rich presence values.\nfunction %s(accessor(address))"),
				newHoverText("ascii_string_equals", "// match memory to strings assuming they're encoded using ASCII (7-bit latin characters)\nfunction %s(address, string, length=0x7FFFFFFF, transform=a=>a)"),
				newHoverText("unicode_string_equals", "// match memory to strings assuming they're encoded using Unicode (16-bit international alphabets)\nfunction %s(address, string, length=0x7FFFFFFF, transform=a=>a)"),
				newHoverText("repeated", "// Adds a Hit Target to the condition.\n// The specified `comparison` must be true for count frames for the trigger to fire.\n// The frames do not have to be consecutive.\n// Once the Hit Target is met, the condition is considered true until it is reset.\nfunction %s(count, comparison)"),
				newHoverText("once", "// Shorthand for `repeated(1, comparison)`.\n// The specified `comparison` must have been true at one point, but is not required to currently be true to trigger the achievement.\nfunction %s(comparison)"),
				newHoverText("tally", "// Adds a Hit Target to the condition where multiple conditions may be true in the same frame.\n// `comparison` may be an array of conditions, or multiple conditions passed as individual parameters.\n// Each condition that is true on each frame will tally a Hit Count.\n// Multiple Hit Counts may be tallied in the same frame.\n// The overall tally must reach `count` for the trigger to fire.\n// Once the Hit Target is met, the condition is considered true until it is reset.\n//\n// Individual conditions in the `comparisons` list may be wrapped in a `deduct()` function call, which causes any hits counted by the condition to be deducted from the overall tally.\n//\n// If `count` is zero, the overall condition will become true as soon as any individual comparison is true.\n// This is mostly used when building leaderboard value clauses using the `measured` function as it provides an unbounded counting of the subclauses.\nfunction %s(count, comparisons)"),
				newHoverText("never", "// This becomes a `ResetIf`. If the `comparison` is true, all Hit Counts in the trigger are reset to 0, and the trigger cannot fire.\nfunction %s(comparison)"),
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

				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				// const linePrefix = document.lineAt(position).text.slice(0, position.character);
				// if (!linePrefix.endsWith('console.')) {
				// 	return undefined;
				// }

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

function newHoverText(key: string, fmtText: string): HoverData {
	let text = util.format(fmtText, key);
	return {
		key: key,
		hover: new vscode.Hover({
			language: "rascript",
			value: text
		})
	};
}
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';
import * as util from "util";

export function activate(context: vscode.ExtensionContext) {

	const hover = vscode.languages.registerHoverProvider('rascript', {
		provideHover(document: vscode.TextDocument, position: vscode.Position) {

			let words = [
				newHoverText("byte", "// the 8-bit value at the specified address\n%s(address)"),
				newHoverText("word", "// the 16-bit value at the specified address\n%s(address)"),
				newHoverText("tbyte", "// the 24-bit value at the specified address\n%s(address)"),
				newHoverText("dword", "// the 32-bit value at the specified address\n%s(address)"),
				newHoverText("bit0", "// the least significant bit of the specified address\n%s(address)"),
				newHoverText("bit1", "// the second least significant bit of the specified address\n%s(address)"),
				newHoverText("bit2", "// the third least significant bit of the specified address\n%s(address)"),
				newHoverText("bit3", "// the fourth least significant bit of the specified address\n%s(address)"),
				newHoverText("bit4", "// the fifth least significant bit of the specified address\n%s(address)"),
				newHoverText("bit5", "// the sixth least significant bit of the specified address\n%s(address)"),
				newHoverText("bit6", "// the seventh least significant bit of the specified address\n%s(address)"),
				newHoverText("bit7", "// the most significant bit of the specified address\n%s(address)"),
				newHoverText("bit", "// the `index`th bit of the specified address (`index` must be between 0 and 31)\n%s(index, address)"),
				newHoverText("low4", "// the four least significant bits of the specified address\n%s(address)"),
				newHoverText("high4", "// the four most significant bits of the specified address\n%s(address)"),
				newHoverText("bitcount", "// the number of non-zero bits at the specified address\n%s(address)"),
			]
			let text = document.getText();
            let pattern = /(\bfunction\b)\s*(\w+)\s*\(([^\(\)]*)\)/g; // keep in sync with syntax file rascript.tmLanguage.json #function-definitions regex
			let m: RegExpExecArray | null;
			while (m = pattern.exec(text)) {
				let pos = document.positionAt(m.index)
				let line = document.lineAt(pos)
				console.log(line.text)
			}
			const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);

			for (let i = 0; i < words.length; i++) {
                if (words[i].key == word) {
				    return words[i].hover;
				}
            }
		}
	})
	const autocomplete = vscode.languages.registerCompletionItemProvider(
		'rascript',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				let text = document.getText();
                let pattern = /(\bfunction\b)\s*(\w+)\s*\(([^\(\)]*)\)/g;
				let m: RegExpExecArray | null;
				while (m = pattern.exec(text)) {
					let pos = document.positionAt(m.index)
					let line = document.lineAt(pos)
					console.log(line.text)
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
	}
}
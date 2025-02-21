/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const provider = vscode.languages.registerCompletionItemProvider(
		'rascript',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

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

	context.subscriptions.push(provider);
}

function newBuiltInFunction(name: string) {
	console.log("here")
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
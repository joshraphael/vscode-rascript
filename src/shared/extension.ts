import * as vscode from "vscode";
import * as parser from "./parser";
import { builtinFunctionDefinitions } from "./functionDefinitions";
import { definitionProvider } from "./definitionProvider";
import { hoverProvider } from "./hoverProvider";
import { completionItemsProvider } from "./completionItemsProvider";

export function localExtension(context: vscode.ExtensionContext) {
  const definitions = vscode.languages.registerDefinitionProvider("rascript", {
    provideDefinition(
      document: vscode.TextDocument,
      position: vscode.Position,
      token: vscode.CancellationToken
    ) {
      return definitionProvider(document, position, token);
    },
  });

  const hover = vscode.languages.registerHoverProvider("rascript", {
    provideHover(document: vscode.TextDocument, position: vscode.Position) {
      return hoverProvider(document, position);
    },
  });
  const autocomplete = vscode.languages.registerCompletionItemProvider(
    "rascript",
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
      ) {
        return completionItemsProvider(document, position);
      },
    }
  );

  context.subscriptions.push(autocomplete, hover, definitions);
}

import * as vscode from "vscode";
import * as parser from "./parser";

export function completionItemsProvider(
  document: vscode.TextDocument,
  position: vscode.Position
) {
  let parsedDocument = parser.parseDocument(document);
  let completionItems: vscode.CompletionItem[] = [];
  let functionSet: Set<string> = new Set(parsedDocument.completionFunctions);
  functionSet.forEach((fnName: string) => {
    completionItems.push(parser.newBuiltInFunction(fnName));
  });
  let variableSet: Set<string> = new Set(parsedDocument.completionVariables);
  variableSet.forEach((varName: string) => {
    completionItems.push(
      parser.newCompletion(varName, vscode.CompletionItemKind.Variable)
    );
  });
  let classSet: Set<string> = new Set(parsedDocument.completionClasses);
  classSet.forEach((className: string) => {
    completionItems.push(
      parser.newCompletion(className, vscode.CompletionItemKind.Class)
    );
  });
  return completionItems;
}

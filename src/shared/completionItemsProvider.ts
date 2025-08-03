import * as vscode from "vscode";
import * as parser from "./parser";
import { builtinFunctionDefinitions } from "./functionDefinitions";

export function completionItemsProvider(
  document: vscode.TextDocument,
  position: vscode.Position
) {
  let completionFunctions = [];
  let completionVariables = [];
  let completionClasses = [];
  let completionItems: vscode.CompletionItem[] = [];
  for (let i = 0; i < builtinFunctionDefinitions.length; i++) {
    let fn = builtinFunctionDefinitions[i];
    completionFunctions.push(fn.key);
  }
  let text = document.getText();
  let commentBounds = parser.getCommentBoundsList(document);
  let classes = parser.getClassData(text, commentBounds);
  let m: RegExpExecArray | null;
  while ((m = parser.G_FUNCTION_DEFINITION.exec(text))) {
    // dont parse if its in a comment
    if (parser.inCommentBound(m.index, commentBounds)) {
      continue;
    }
    completionFunctions.push(m[2]);
  }
  let functionSet: Set<string> = new Set(completionFunctions);
  functionSet.forEach((fnName: string) => {
    completionItems.push(parser.newBuiltInFunction(fnName));
  });
  while ((m = parser.G_VARIABLES.exec(text))) {
    // dont parse if its in a comment
    if (parser.inCommentBound(m.index, commentBounds)) {
      continue;
    }
    completionVariables.push(m[1]);
  }
  let variableSet: Set<string> = new Set(completionVariables);
  variableSet.forEach((varName: string) => {
    completionItems.push(
      parser.newCompletion(varName, vscode.CompletionItemKind.Variable)
    );
  });
  for (const [className, classScope] of classes) {
    completionClasses.push(className);
  }
  let classSet: Set<string> = new Set(completionClasses);
  classSet.forEach((className: string) => {
    completionItems.push(
      parser.newCompletion(className, vscode.CompletionItemKind.Class)
    );
  });
  return completionItems;
}

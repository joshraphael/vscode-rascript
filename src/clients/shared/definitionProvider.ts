import * as vscode from "vscode";
import * as parser from "./parser";
import * as models from "./models";

export function definitionProvider(
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken
) {
  let text = document.getText();
  const range = document.getWordRangeAtPosition(position);
  const word = document.getText(range);
  let parsedDocument = parser.parseDocument(document);
  const origWordOffset = document.offsetAt(position);
  if (parsedDocument.functionDefinitions.has(word)) {
    if (range !== undefined) {
      let endOffset = document.offsetAt(range.end);
      if (text[endOffset] !== "(") {
        return null; // not a function (maybe comment, or just varaible named the same)
      }
    }
    let origOffset = document.offsetAt(position);
    if (range?.start !== undefined) {
      origOffset = document.offsetAt(range.start);
    }
    let offset = origOffset - 1;
    const [global, usingThis] = parser.getScope(document, origOffset);
    let list = parsedDocument.functionDefinitions.get(word) || [];
    let filteredList = list.filter(
      parser.classFilter(
        global,
        usingThis,
        parser.detectClass(origWordOffset, parsedDocument.classes)
      )
    );
    // can only link to one location, so anything that has multiple definitions wont work for code jumping
    if (filteredList.length === 1) {
      let el = filteredList[0];
      let r = new vscode.Range(el.pos, el.pos);
      const locLink: vscode.LocationLink = {
        targetRange: r,
        targetUri: document.uri,
      };
      return [locLink];
    }
  }
  return null;
}

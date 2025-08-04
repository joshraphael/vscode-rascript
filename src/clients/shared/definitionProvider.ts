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
  const origWordOffset = document.offsetAt(position);
  let commentBounds = parser.getCommentBoundsList(document);
  let classes = parser.getClassData(text, commentBounds);
  let m: RegExpExecArray | null;
  let functionDefinitions = new Map<string, models.ClassFunction[]>();
  while ((m = parser.G_FUNCTION_DEFINITION.exec(text))) {
    // dont parse if its in a comment
    if (parser.inCommentBound(m.index, commentBounds)) {
      continue;
    }
    let pos = document.positionAt(m.index);
    let list = functionDefinitions.get(m[2]);
    let a = m[3].split(",").map((s) => s.trim());
    var args = a.filter(function (el) {
      return el !== null && el !== "" && el !== undefined;
    });
    let item = parser.createClassFunction(
      parser.detectClass(m.index, classes),
      m[2],
      pos,
      ...args
    );
    if (list !== undefined) {
      list.push(item);
    } else {
      functionDefinitions.set(m[2], [item]);
    }
  }
  if (functionDefinitions.has(word)) {
    if (range !== undefined) {
      let endOffset = document.offsetAt(range.end);
      if (text[endOffset] !== "(") {
        return null; // not a function
      }
    }
    let origOffset = document.offsetAt(position);
    if (range?.start !== undefined) {
      origOffset = document.offsetAt(range.start);
    }
    let offset = origOffset - 1;
    const [global, usingThis] = parser.getScope(document, origOffset);
    let list = functionDefinitions.get(word) || [];
    let filteredList = list.filter(
      parser.classFilter(
        global,
        usingThis,
        parser.detectClass(origWordOffset, classes)
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

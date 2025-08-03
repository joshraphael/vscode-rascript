import * as vscode from "vscode";
import * as parser from "./parser";
import * as models from "./models";
import { builtinFunctionDefinitions } from "./functionDefinitions";

export function hoverProvider(
  document: vscode.TextDocument,
  position: vscode.Position
) {
  let words = new Map<string, models.HoverData[]>();
  for (let i = 0; i < builtinFunctionDefinitions.length; i++) {
    let fn = builtinFunctionDefinitions[i];
    let comment = fn.commentDoc.join("\n");
    let hover = parser.newHoverText(
      fn.key,
      -1,
      parser.G_FUNTION,
      "",
      comment,
      fn.url,
      ...fn.args
    );
    let definitions = words.get(fn.key);
    if (definitions !== undefined) {
      definitions.push(hover);
    } else {
      words.set(fn.key, [hover]);
    }
  }
  let text = document.getText();
  let m: RegExpExecArray | null;
  // get bounds of single line comments
  let commentBounds = parser.getCommentBoundsList(document);
  let classes = parser.getClassData(text, commentBounds);
  for (const [className, classScope] of classes) {
    let pos = document.positionAt(classScope.start);
    let comment = parser.getCommentText(document, pos);
    let hover = parser.newHoverText(
      className,
      classScope.start,
      parser.G_CLASS,
      "",
      comment,
      "",
      ...classScope.constructorArgs
    );
    let definitions = words.get(className);
    if (definitions !== undefined) {
      definitions.push(hover);
    } else {
      words.set(className, [hover]);
    }
  }
  while ((m = parser.G_FUNCTION_DEFINITION.exec(text))) {
    // dont parse if its in a comment
    if (parser.inCommentBound(m.index, commentBounds)) {
      continue;
    }
    let className = parser.detectClass(m.index, classes);
    let pos = document.positionAt(m.index);
    let comment = parser.getCommentText(document, pos);
    let a = m[3].split(",").map((s) => s.trim());
    var args = a.filter(function (el) {
      return el !== null && el !== "" && el !== undefined;
    });
    let hover = parser.newHoverText(
      m[2],
      m.index,
      parser.G_FUNTION,
      className,
      comment,
      "",
      ...args
    );
    let definitions = words.get(m[2]);
    if (definitions !== undefined) {
      definitions.push(hover);
    } else {
      words.set(m[2], [hover]);
    }
  }
  const range = document.getWordRangeAtPosition(position);
  let startingPos = position;
  if (range?.start !== undefined) {
    startingPos = range.start;
  }
  let endingPos = position;
  if (range?.end !== undefined) {
    endingPos = range.end;
  }
  const startingOffset = document.offsetAt(startingPos);
  const endingOffset = document.offsetAt(endingPos);
  const word = document.getText(range);
  const hoverClass = parser.detectClass(startingOffset, classes);
  let offset = startingOffset - 1; // get character just before the function name position

  // Special case: this keyword should show the class hover info
  if (word === "this") {
    let definitions = words.get(hoverClass);
    if (definitions !== undefined) {
      for (let i = 0; i < definitions.length; i++) {
        let definition = definitions[i];
        if (definition.className === "") {
          return definition.hover;
        }
      }
    }
  }
  const [global, usingThis] = parser.getScope(document, startingOffset);

  let definitions = words.get(word);
  if (definitions !== undefined) {
    const [fn, cls] = parser.getWordType(
      document,
      startingOffset,
      endingOffset
    );
    if (!fn && !cls) {
      // only provide hover data for classes and functions
      return null;
    }
    let filteredDefinitions = [];
    // if we are hovering over the actual function signature itself, find it and return it
    for (let i = 0; i < definitions.length; i++) {
      let definition = definitions[i];
      // magic number 9 here is length of word function plus a space in between the function name
      if (
        startingOffset >= definition.index &&
        startingOffset <= definition.index + 9 + definition.key.length
      ) {
        return definition.hover;
      }
    }
    // determine list of definitions for function calls found in code bodies
    for (let i = 0; i < definitions.length; i++) {
      let definition = definitions[i];

      if (global) {
        if (definition.className === "") {
          // this should only be one occurence, but we can handle multiple
          filteredDefinitions.push(definition);
        }
      } else {
        if (definition.className !== "") {
          // Special case: we can determine the exact definition is the definition if using this.<className>
          if (usingThis && hoverClass === definition.className) {
            return definition.hover;
          }
          // if its a function, further filter down by arg list length
          // otherwise just append if its a class
          if (fn) {
            let numArgs = parser.countArgsAt(document, endingOffset);
            if (numArgs === definition.args.length) {
              filteredDefinitions.push(definition);
            }
          } else {
            filteredDefinitions.push(definition);
          }
        }
      }
    }
    if (filteredDefinitions.length === 1) {
      return filteredDefinitions[0].hover;
    } else {
      // Special case: more than one functions in different classes are named the same and we cant determine the exact hover data
      let lines: string[] = [];
      for (let i = 0; i < filteredDefinitions.length; i++) {
        let definition = filteredDefinitions[i];
        lines = lines.concat(definition.lines);
      }
      return new vscode.Hover(lines);
    }
  }

  return null;
}

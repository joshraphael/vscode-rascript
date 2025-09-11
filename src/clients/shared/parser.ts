import * as vscode from "vscode";
import * as models from "./models";

export const G_FUNCTION_DEFINITION =
  /(\bfunction\b)[\t ]*([a-zA-Z_][\w]*)[\t ]*\(([^\(\)]*)\)/g; // keep in sync with syntax file rascript.tmLanguage.json #function-definitions regex
export const G_CLASS_DEFINITION = /(\bclass\b)[\t ]*([a-zA-Z_][\w]*)/g; // keep in sync with syntax file rascript.tmLanguage.json #class-definitions regex
export const G_COMMENTS = new RegExp("^//.*$", "g");

export const G_BLOCK_COMMENTS_START = /^.*\/\*.*$/g;
export const G_BLOCK_COMMENTS_END = /^.*\*\/$/g;
export const G_VARIABLES = /([a-zA-Z_][\w]*)[\t ]*=/g;
export const G_STAR_BLOCK_COMMENT = /^\*.*/g; // starts with a star
export const G_FUNTION = "function";
export const G_CLASS = "class";

export function inCommentBound(
  index: number,
  commentBounds: models.CommentBounds[]
) {
  for (let i = 0; i < commentBounds.length; i++) {
    let bound = commentBounds[i];
    if (index >= bound.start && index <= bound.end) {
      return true;
    }
  }
  return false;
}

export function newClassScope(
  start: number,
  end: number,
  ...constructorArgs: string[]
): models.ClassScope {
  return {
    start: start,
    end: end,
    functions: new Map<string, models.FunctionDefinition>(),
    constructorArgs: constructorArgs,
  };
}

export function createClassFunction(
  className: string,
  name: string,
  pos: vscode.Position,
  ...args: string[]
): models.ClassFunction {
  return {
    className: className,
    name: name,
    pos: pos,
    args: args,
  };
}

export function classFilter(
  global: boolean,
  usingThis: boolean,
  className: string
) {
  return function (el: models.ClassFunction) {
    if (global) {
      return el.className === "";
    } else if (usingThis) {
      return el.className === className;
    }
    return el.className !== "";
  };
}

export function getWordType(
  document: vscode.TextDocument,
  startingOffset: number,
  endingOffset: number
): [boolean, boolean] {
  const text = document.getText();
  let fn = false;
  let cls = false;

  // check for function
  if (text[endingOffset] === "(") {
    fn = true;
  }

  // check for previous word being class
  let offset = startingOffset - 1;
  while (offset >= 0) {
    if (text[offset] !== " " && text[offset] !== "\t" && text[offset] !== "s") {
      break;
    }
    if (text[offset] === "s") {
      const position = document.positionAt(offset);
      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);
      if (word === "class") {
        cls = true;
      }
      break;
    }
    offset--;
  }
  return [fn, cls];
}

export function getScope(
  document: vscode.TextDocument,
  startingOffset: number
): [boolean, boolean] {
  // Determine if this function is part of a class or global function
  const text = document.getText();
  let global = true;
  let usingThis = false;
  let offset = startingOffset - 1;

  while (global && offset >= 0) {
    if (text[offset] !== " " && text[offset] !== "\t" && text[offset] !== ".") {
      break;
    }
    if (text[offset] === ".") {
      const position = document.positionAt(offset);
      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);
      if (word === "this") {
        usingThis = true;
      }
      // in here means the previous non whitespace character next to the word hovered over is a dot which is the class attribute accessor operator
      global = false;
      break;
    }
    offset--;
  }
  return [global, usingThis];
}

export function getCommentBoundsList(document: vscode.TextDocument) {
  let text = document.getText();
  let commentBounds: models.CommentBounds[] = [];
  let inComment = false;
  let tempStart = 0;
  if (text.length < 2) {
    return commentBounds;
  }
  for (let i = 1; i < text.length; i++) {
    if (inComment) {
      if (text[i] === "\n" || text[i] === "\r") {
        inComment = false;
        commentBounds.push({
          start: tempStart,
          end: i - 1,
          type: "Line",
          raw: text.slice(tempStart, i),
        });
      }
    } else {
      if (text[i - 1] + text[i] === "//") {
        inComment = true;
        tempStart = i - 1;
      }
    }
    if (i === text.length - 1 && inComment) {
      inComment = false;
      commentBounds.push({
        start: tempStart,
        end: i,
        type: "Line",
        raw: text.slice(tempStart),
      });
    }
  }
  // parse different comment types seperately incase they are mixed together,
  // the bounds between these two could overlap technically

  // get bounds of block comments
  inComment = false;
  tempStart = 0;
  for (let i = 1; i < text.length; i++) {
    if (inComment) {
      if (text[i - 1] + text[i] === "*/") {
        // end
        inComment = false;
        commentBounds.push({
          start: tempStart,
          end: i - 1,
          type: "Block",
          raw: text.slice(tempStart, i),
        });
      }
    } else {
      if (text[i - 1] + text[i] === "/*") {
        // start
        inComment = true;
        tempStart = i - 1;
      }
    }
    if (i === text.length - 1 && inComment) {
      inComment = false;
      commentBounds.push({
        start: tempStart,
        end: i,
        type: "Block",
        raw: text.slice(tempStart),
      });
    }
  }
  return commentBounds;
}

export function countArgsAt(document: vscode.TextDocument, offset: number) {
  let text = document.getText();
  let count = 0;
  if (text[offset] === "(") {
    offset++;
    while (offset < text.length) {
      if (text[offset] === ")") {
        break;
      }
      if (count === 0) {
        count = 1;
      } else {
        if (text[offset] === ",") {
          count++;
        }
      }
      offset++;
    }
  }
  return count;
}

export function getCommentText(
  document: vscode.TextDocument,
  pos: vscode.Position
): string {
  let comment = "";
  let untrimmedComment = ""; // This holds a second copy of the comments with leading stars
  let blockCommentStarStyle = true;
  if (pos.line > 0) {
    // dont look for comments if were at the top of the file
    let offset = 1;
    let inBlock = false;
    // while not at the top of the file and the next line up is a comment
    while (pos.line - offset >= 0) {
      let lineNum = pos.line - offset;
      let line = document.lineAt(new vscode.Position(lineNum, 0)).text;
      line = line.trimStart();
      if (offset === 1) {
        // if were right above the function declaration, look for a block comment
        let isBlock = G_BLOCK_COMMENTS_END.test(line);
        G_BLOCK_COMMENTS_END.lastIndex = 0;
        if (isBlock) {
          inBlock = true;
        }
      }
      if (inBlock) {
        // handle block comments
        let endBlock = G_BLOCK_COMMENTS_START.test(line);
        G_BLOCK_COMMENTS_START.lastIndex = 0;
        if (endBlock) {
          // at the beginning of comment block

          // TRIM START TOKEN
          let trimmedLine = line.split(/\/\*(.*)/s); // use whats after the start token
          let firstEl = trimmedLine.shift(); // remove text before commend block start
          let newLine = trimmedLine.join("").trimStart();

          // TRIM END TOKEN
          trimmedLine = newLine.split("*/"); // use whats after the star token
          if (trimmedLine.length > 2) {
            let firstEl = trimmedLine.pop();
          }
          newLine = trimmedLine.join("").trimStart();
          if (blockCommentStarStyle) {
            let starComment = G_STAR_BLOCK_COMMENT.test(newLine);
            G_STAR_BLOCK_COMMENT.lastIndex = 0;
            if (!starComment) {
              blockCommentStarStyle = false;
            }
          }
          untrimmedComment = "//" + newLine + "\n" + untrimmedComment; // keep an untrimmed version of the comment in case the entire block is prefixed with stars

          // TRIM FIRST '*' TOKEN (in case they comment that way)
          trimmedLine = newLine.split(/^\*(.*)/s); // use whats after the end token
          if (trimmedLine.length > 2) {
            let firstEl = trimmedLine.shift(); // remove leading '*'
          }
          newLine = trimmedLine.join("").trimStart();
          comment = "//" + newLine + "\n" + comment;
          break;
        } else {
          // at end of comment block

          // TRIM END TOKEN (guaranteed to not have text after end token if tthe user wants comments to appear in hover box)
          let trimmedLine = line.split("*/"); // use whats after the end token
          if (trimmedLine.length > 2) {
            let firstEl = trimmedLine.pop();
          }
          let newLine = trimmedLine.join("").trimStart();

          if (blockCommentStarStyle) {
            let starComment = G_STAR_BLOCK_COMMENT.test(newLine);
            G_STAR_BLOCK_COMMENT.lastIndex = 0;
            if (!starComment) {
              blockCommentStarStyle = false;
            }
          }
          untrimmedComment = "//" + newLine + "\n" + untrimmedComment; // keep an untrimmed version of the comment in case the entire block is prefixed with stars

          // TRIM FIRST '*' TOKEN (in case they comment that way)
          trimmedLine = newLine.split(/^\*(.*)/s); // use whats after the first star token
          if (trimmedLine.length > 2) {
            let firstEl = trimmedLine.shift(); // remove leading '*'
          }
          newLine = trimmedLine.join("").trimStart();
          comment = "//" + trimmedLine[0] + "\n" + comment;
        }
      } else {
        // else handle single line block comments
        let isComment = G_COMMENTS.test(line);
        G_COMMENTS.lastIndex = 0;
        if (isComment) {
          comment = line + "\n" + comment;
        } else {
          break;
        }
      }
      offset = offset + 1;
    }
  }
  let finalComment = untrimmedComment;
  if (blockCommentStarStyle) {
    finalComment = comment;
  }
  return finalComment;
}

export function detectClass(
  funcPos: number,
  classData: Map<string, models.ClassScope>
) {
  for (const [className, classScope] of classData) {
    if (funcPos >= classScope.start && funcPos <= classScope.end) {
      return className;
    }
  }
  return "";
}

export function getClassData(
  text: string,
  commentBounds: models.CommentBounds[]
): Map<string, models.ClassScope> {
  let classes = new Map<string, models.ClassScope>();
  let m: RegExpExecArray | null;
  while ((m = G_CLASS_DEFINITION.exec(text))) {
    // dont parse if its in a comment
    if (inCommentBound(m.index, commentBounds)) {
      continue;
    }
    let postClassNameInd = m.index + m[0].length;
    let ind = postClassNameInd;
    let stack = []; // makeshift stack to detect scope of class
    let strippedText = ""; // this is used to determine the implicit arguments to a class constructor
    while (ind < text.length) {
      // anything other than white space or open curly brace is an error and we just wont parse this class
      if (
        text[ind] !== " " &&
        text[ind] !== "\n" &&
        text[ind] !== "\r" &&
        text[ind] !== "\t" &&
        text[ind] !== "{"
      ) {
        break;
      }
      if (text[ind] === "{") {
        // get the position of the opening curly brace
        stack.push(ind);
        break;
      }
      ind++;
    }
    if (stack.length === 1) {
      // if we have a curly brace scope, start parsing to find the end of the scope
      let ind = stack[0] + 1; // next char after our first open curly brace
      while (ind < text.length) {
        if (text[ind] === "}") {
          stack.pop();
        } else if (text[ind] === "{") {
          stack.push(ind);
        } else {
          let size = stack.length;
          if (size === 1) {
            // if the code is at the first level of the class (not in a function) append it to our stripped class
            strippedText = strippedText + text[ind];
          }
        }
        let size = stack.length;
        if (size === 0) {
          // we have found our end position of the scope, break out
          break;
        }
        ind++;
      }
      let args = [];
      let m2: RegExpExecArray | null;
      while ((m2 = G_VARIABLES.exec(strippedText))) {
        args.push(m2[1]);
      }
      let scope = newClassScope(m.index, ind, ...args);
      classes.set(m[2], scope);
    }
  }
  return classes;
}

export function newBuiltInFunction(name: string) {
  const snippetCompletion = new vscode.CompletionItem(name);
  snippetCompletion.insertText = new vscode.SnippetString(name + "()");
  snippetCompletion.kind = vscode.CompletionItemKind.Function;
  const moveCursorCommand: vscode.Command = {
    title: "Move cursor left between parentheses",
    command: "cursorLeft",
  };

  snippetCompletion.command = moveCursorCommand;
  return snippetCompletion;
}

export function newCompletion(name: string, kind: vscode.CompletionItemKind) {
  const snippetCompletion = new vscode.CompletionItem(name, kind);

  return snippetCompletion;
}

export function newHoverText(
  key: string,
  index: number,
  type: string,
  className: string,
  text: string,
  docUrl: string,
  ...args: string[]
): models.HoverData {
  let argStr = args.join(", ");
  let commentLines = text.split(/\r?\n/);
  let lines = [];
  let prefix = "function ";
  if (className !== "") {
    prefix = `// class ${className}\nfunction `;
  }
  lines.push(`\`\`\`rascript\n${prefix}${key}(${argStr})\n\`\`\``);
  if (type === G_CLASS) {
    let fnLine = lines[0];
    lines = [`\`\`\`rascript\nclass ${key}\n\`\`\``];
    lines.push(fnLine);
  }
  if (text !== "") {
    lines.push("---");
    let curr = "";
    let codeBlock = false;
    for (let i = 0; i < commentLines.length; i++) {
      let line = commentLines[i].replace(/^\/\//g, "");
      line = line.trimStart();
      if (line.startsWith("```")) {
        codeBlock = !codeBlock;
        if (codeBlock) {
          curr = line;
        } else {
          curr = curr + "\n" + line;
          lines.push(curr);
          curr = "";
        }
        continue;
      }
      if (line.startsWith("|") || line.startsWith("*")) {
        line = line + "\n";
      }
      if (codeBlock) {
        curr = curr + "\n" + line;
      } else {
        if (line === "") {
          lines.push(curr);
          curr = "";
        } else {
          curr = curr + " " + line;
        }
      }
    }
    if (curr !== "") {
      lines.push(curr);
    }
    if (codeBlock) {
      lines.push("```");
    }
  }
  if (docUrl !== "") {
    lines.push("---");
    lines.push(`[Wiki link for \`${key}()\`](${docUrl})`);
  }

  return {
    key: key,
    index: index,
    className: className,
    hover: new vscode.Hover(lines),
    args: args,
    lines: lines,
  };
}

export function parseDocument(
  document: vscode.TextDocument
): models.ParsedDocument {
  let text = document.getText();
  let commentBounds = getCommentBoundsList(document);
  let classes = getClassData(text, commentBounds);
  let functionDefinitions = new Map<string, models.ClassFunction[]>();
  let m: RegExpExecArray | null;
  while ((m = G_FUNCTION_DEFINITION.exec(text))) {
    // dont parse if its in a comment
    if (inCommentBound(m.index, commentBounds)) {
      continue;
    }
    let pos = document.positionAt(m.index);
    let list = functionDefinitions.get(m[2]);
    let a = m[3].split(",").map((s) => s.trim());
    var args = a.filter(function (el) {
      return el !== null && el !== "" && el !== undefined;
    });
    let item = createClassFunction(
      detectClass(m.index, classes),
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
  return {
    classes: classes,
    functionDefinitions: functionDefinitions,
  };
}

import * as vscode from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";
import { builtinFunctionDefinitions } from "./functionDefinitions";

const G_FUNCTION_DEFINITION = /(\bfunction\b)\s*(\w+)\s*\(([^\(\)]*)\)/g; // keep in sync with syntax file rascript.tmLanguage.json #function-definitions regex
const G_CLASS_DEFINITION = /(\bclass\b)\s*(\w+)\s*\{*/g; // keep in sync with syntax file rascript.tmLanguage.json #class-definitions regex
const G_COMMENTS = new RegExp("^//.*$", "g");

const G_BLOCK_COMMENTS_START = /^.*\/\*.*$/g;
const G_BLOCK_COMMENTS_END = /^.*\*\/$/g;
const G_VARIABLES = /(\w+)\s*=/g;
const G_STAR_BLOCK_COMMENT = /^\*.*/g; // starts with a star
const G_FUNTION = "function";
const G_CLASS = "class";

let client: LanguageClient;

interface ClassScope {
  start: number;
  end: number;
  functions: Map<string, vscode.Position>;
  constructorArgs: string[];
}

interface CommentBounds {
  start: number;
  end: number;
  type: string;
  raw: string;
}

function newClassScope(
  start: number,
  end: number,
  ...constructorArgs: string[]
): ClassScope {
  return {
    start: start,
    end: end,
    functions: new Map<string, vscode.Position>(),
    constructorArgs: constructorArgs,
  };
}

export function activate(context: vscode.ExtensionContext) {
  const rascriptLanguageServer =
    vscode.workspace.getConfiguration("rascript").languageServer;
  setup(context, rascriptLanguageServer);
}

async function setup(
  context: vscode.ExtensionContext,
  rascriptLanguageServer: string
) {
  const fileUri = vscode.Uri.file(rascriptLanguageServer);
  if (rascriptLanguageServer === undefined || rascriptLanguageServer === "") {
    vscode.window.showInformationMessage("No Language Server specified");
    localExtension(context);
    return;
  }
  languageServer(context, rascriptLanguageServer);
}

function languageServer(
  context: vscode.ExtensionContext,
  rascriptLanguageServer: string
) {
  let serverOptions: ServerOptions = {
    run: { command: rascriptLanguageServer },
    debug: { command: rascriptLanguageServer },
  };

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: [
      {
        pattern: "**/*.rascript",
      },
    ],
    synchronize: {
      configurationSection: "rascriptLanguageServer",
      fileEvents: vscode.workspace.createFileSystemWatcher("**/*.rascript"),
    },
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    "rascript-language-server",
    "RAScript Language Server",
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  client
    .start()
    .then(() => {
      vscode.window.showInformationMessage(
        "Language Server started from: " + rascriptLanguageServer
      );
    })
    .catch((error) => {
      vscode.window.showInformationMessage(
        "Failed to start language server: " + error
      );
      localExtension(context);
    });
}

function localExtension(context: vscode.ExtensionContext) {
  const definitions = vscode.languages.registerDefinitionProvider("rascript", {
    provideDefinition(document, position, token) {
      let text = document.getText();
      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);
      let m: RegExpExecArray | null;
      let functionDefinitions = new Map<string, vscode.Position>();
      while ((m = G_FUNCTION_DEFINITION.exec(text))) {
        let pos = document.positionAt(m.index);
        functionDefinitions.set(m[2], pos);
      }
      if (functionDefinitions.has(word)) {
        let pos = functionDefinitions.get(word);
        if (pos !== undefined) {
          let r = new vscode.Range(pos, pos);
          const locLink: vscode.LocationLink = {
            targetRange: r,
            targetUri: document.uri,
          };
          return [locLink];
        }
      }
      return null;
    },
  });

  const hover = vscode.languages.registerHoverProvider("rascript", {
    provideHover(document: vscode.TextDocument, position: vscode.Position) {
      let words = new Map<string, HoverData[]>();
      for (let i = 0; i < builtinFunctionDefinitions.length; i++) {
        let fn = builtinFunctionDefinitions[i];
        let comment = fn.commentDoc.join("\n");
        let hover = newHoverText(
          fn.key,
          -1,
          G_FUNTION,
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
      let commentBounds: CommentBounds[] = [];
      let inComment = false;
      let tempStart = 0;
      for (let i = 0; i < text.length - 1; i++) {
        if (inComment) {
          if (text[i] === "\n" || text === "\r") {
            inComment = false;
            commentBounds.push({
              start: tempStart,
              end: i,
              type: "Line",
              raw: text.slice(tempStart, i + 1),
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
            raw: text.slice(tempStart, i + 1),
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
            inComment = false;
            commentBounds.push({
              start: tempStart,
              end: i,
              type: "Block",
              raw: text.slice(tempStart, i + 1),
            });
          }
        } else {
          if (text[i - 1] + text[i] === "/*") {
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
            raw: text.slice(tempStart, i + 1),
          });
        }
      }
      console.log(commentBounds);
      let classes = getClassData(text);
      for (const [className, classScope] of classes) {
        let pos = document.positionAt(classScope.start);
        let comment = getCommentText(document, pos);
        let hover = newHoverText(
          className,
          classScope.start,
          G_CLASS,
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
      while ((m = G_FUNCTION_DEFINITION.exec(text))) {
        let className = detectClass(m.index, classes);
        let pos = document.positionAt(m.index);
        let comment = getCommentText(document, pos);
        let args = m[3].split(",").map((s) => s.trim());
        let hover = newHoverText(
          m[2],
          m.index,
          G_FUNTION,
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
      const startingOffset = document.offsetAt(startingPos);
      const word = document.getText(range);
      const hoverClass = detectClass(startingOffset, classes);
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

      // Determine if this function is part of a class or global function
      let global = true;
      let usingThis = false;

      while (global && offset >= 0) {
        if (
          text[offset] !== " " &&
          text[offset] !== "\n" &&
          text[offset] !== "\r" &&
          text[offset] !== "\t" &&
          text[offset] !== "."
        ) {
          break;
        }
        if (text[offset] === ".") {
          if (
            text[offset - 4] === "t" &&
            text[offset - 3] === "h" &&
            text[offset - 2] === "i" &&
            text[offset - 1] === "s"
          ) {
            usingThis = true;
          }
          // in here means the previous non whitespace character next to the word hovered over is a dot which is the class attribute accessor operator
          global = false;
          break;
        }
        offset--;
      }

      let definitions = words.get(word);
      if (definitions !== undefined) {
        let filteredDefinitions = [];
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
        for (let i = 0; i < definitions.length; i++) {
          let definition = definitions[i];

          if (global) {
            if (definition.className === "") {
              filteredDefinitions.push(definition);
            }
          } else {
            if (definition.className !== "") {
              // Special case: we can determine the exact definition is the definition is using this.<className>
              if (usingThis && hoverClass === definition.className) {
                return definition.hover;
              }
              filteredDefinitions.push(definition);
            }
          }
        }
        if (filteredDefinitions.length === 1) {
          return filteredDefinitions[0].hover;
        } else {
          // Special case: two functions in different classes are named the same and we cant determine the exact hover data
          let lines = [];
          for (let i = 0; i < filteredDefinitions.length; i++) {
            let definition = filteredDefinitions[i];
            lines.push(
              `${definition.className}.${definition.key} @ ${definition.index}`
            );
          }
          return new vscode.Hover(lines);
        }
      }

      return null;
    },
  });
  const autocomplete = vscode.languages.registerCompletionItemProvider(
    "rascript",
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
      ) {
        let completionItems = [];
        for (let i = 0; i < builtinFunctionDefinitions.length; i++) {
          let fn = builtinFunctionDefinitions[i];
          completionItems.push(newBuiltInFunction(fn.key));
        }
        let text = document.getText();
        let classes = getClassData(text);
        let m: RegExpExecArray | null;
        while ((m = G_FUNCTION_DEFINITION.exec(text))) {
          completionItems.push(newBuiltInFunction(m[2]));
        }
        while ((m = G_VARIABLES.exec(text))) {
          completionItems.push(
            newCompletion(m[1], vscode.CompletionItemKind.Variable)
          );
        }
        for (const [className, classScope] of classes) {
          completionItems.push(
            newCompletion(className, vscode.CompletionItemKind.Class)
          );
        }
        return completionItems;
      },
    }
  );

  context.subscriptions.push(autocomplete, hover, definitions);
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

function getCommentText(
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

function detectClass(funcPos: number, classData: Map<string, ClassScope>) {
  for (const [className, classScope] of classData) {
    if (funcPos >= classScope.start && funcPos <= classScope.end) {
      return className;
    }
  }
  return "";
}

function getClassData(text: string) {
  let classes = new Map<string, ClassScope>();
  let m: RegExpExecArray | null;
  while ((m = G_CLASS_DEFINITION.exec(text))) {
    let postClassNameInd = m.index + 6 + m[2].length; // class(5) + [space](1) + [Class name](m[2].length)
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

function newBuiltInFunction(name: string) {
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

function newCompletion(name: string, kind: vscode.CompletionItemKind) {
  const snippetCompletion = new vscode.CompletionItem(name, kind);

  return snippetCompletion;
}

interface HoverData {
  key: string;
  index: number;
  className: string;
  hover: vscode.Hover;
}

function newHoverText(
  key: string,
  index: number,
  type: string,
  className: string,
  text: string,
  docUrl: string,
  ...args: string[]
): HoverData {
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
  };
}

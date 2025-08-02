import * as vscode from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";
import { builtinFunctionDefinitions } from "./functionDefinitions";
import * as parser from "./parser";
import * as models from "./models";

let client: LanguageClient;

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
    },
  });

  const hover = vscode.languages.registerHoverProvider("rascript", {
    provideHover(document: vscode.TextDocument, position: vscode.Position) {
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

import * as vscode from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/browser";
import { localExtension } from "../shared/extension";

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

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

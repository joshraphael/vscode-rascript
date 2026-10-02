import * as vscode from "vscode";

import { localExtension } from "../shared/extension";

export function activate(context: vscode.ExtensionContext) {
  localExtension(context);
}

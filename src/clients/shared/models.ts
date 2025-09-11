import * as vscode from "vscode";

export interface CommentBounds {
  start: number;
  end: number;
  type: string;
  raw: string;
}

export interface FunctionDefinition {
  name: string;
  pos: vscode.Position;
  args: string[];
}

export interface ClassScope {
  start: number;
  end: number;
  functions: Map<string, FunctionDefinition>;
  constructorArgs: string[];
}

export interface ClassFunction {
  className: string;
  name: string;
  pos: vscode.Position;
  args: string[];
}

export interface HoverData {
  key: string;
  index: number;
  className: string;
  hover: vscode.Hover;
  args: string[];
  lines: string[];
}

export interface ParsedDocument {
  classes: Map<string, ClassScope>;
  functionDefinitions: Map<string, ClassFunction[]>;
  hoverData: Map<string, HoverData[]>;
}

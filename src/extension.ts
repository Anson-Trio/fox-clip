import * as path from "path";
import * as vscode from "vscode";

type LineFormat = "colon" | "github";

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("foxClip.copyAbsolute", () =>
      copyPath({ absolute: true, withCode: false })
    ),
    vscode.commands.registerCommand("foxClip.copyRelative", () =>
      copyPath({ absolute: false, withCode: false })
    ),
    vscode.commands.registerCommand("foxClip.copyAbsoluteWithCode", () =>
      copyPath({ absolute: true, withCode: true })
    )
  );
}

export function deactivate(): void {}

async function copyPath(options: {
  absolute: boolean;
  withCode: boolean;
}): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage(vscode.l10n.t("No active editor."));
    return;
  }

  const document = editor.document;
  if (document.uri.scheme === "untitled") {
    vscode.window.showWarningMessage(
      vscode.l10n.t("Cannot create a path reference for an unsaved file.")
    );
    return;
  }

  const config = vscode.workspace.getConfiguration("foxClip");
  const lineFormat = config.get<LineFormat>("lineFormat", "github");
  const includeCodeFence = config.get<boolean>("includeCodeFence", true);
  const showNotification = config.get<boolean>("showNotification", true);

  const filePath = options.absolute
    ? document.uri.fsPath
    : toWorkspaceRelativePath(document.uri);

  const linePart = formatLineRanges(editor.selections, lineFormat);
  const reference = formatReference(
    normalizePathSeparators(filePath),
    linePart
  );

  let clipboardText = reference;
  if (options.withCode) {
    const code = getSelectedOrCurrentLineText(editor);
    if (includeCodeFence) {
      const lang = document.languageId || "";
      clipboardText = `${reference}\n\`\`\`${lang}\n${code}\n\`\`\``;
    } else {
      clipboardText = `${reference}\n${code}`;
    }
  }

  await vscode.env.clipboard.writeText(clipboardText);

  if (showNotification) {
    vscode.window.setStatusBarMessage(
      vscode.l10n.t("Copied: {0}", reference),
      2500
    );
  }
}

function toWorkspaceRelativePath(uri: vscode.Uri): string {
  const folder = vscode.workspace.getWorkspaceFolder(uri);
  if (!folder) {
    return uri.fsPath;
  }

  const relative = path.relative(folder.uri.fsPath, uri.fsPath);
  // Outside workspace (starts with ..) → fall back to absolute
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    return uri.fsPath;
  }
  return relative;
}

function normalizePathSeparators(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

/** e.g. "file: /path/to/file.ts; line: L12-L28" */
function formatReference(filePath: string, linePart: string): string {
  const body = linePart
    ? `file: ${filePath}; line: ${linePart}`
    : `file: ${filePath}`;
  return `"${body.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * Build line range text from one or more selections.
 * Empty selection → current cursor line.
 * Selection ending at column 0 of next line → treat as previous line end.
 */
function formatLineRanges(
  selections: readonly vscode.Selection[],
  format: LineFormat
): string {
  const ranges = selections
    .map((selection) => selectionToInclusiveRange(selection))
    .sort((a, b) => a.start - b.start);

  const merged = mergeRanges(ranges);
  if (merged.length === 0) {
    return "";
  }

  if (format === "github") {
    return merged
      .map(({ start, end }) =>
        start === end ? `L${start}` : `L${start}-L${end}`
      )
      .join(",");
  }

  return merged
    .map(({ start, end }) => (start === end ? `${start}` : `${start}-${end}`))
    .join(",");
}

function selectionToInclusiveRange(selection: vscode.Selection): {
  start: number;
  end: number;
} {
  if (selection.isEmpty) {
    const line = selection.active.line + 1;
    return { start: line, end: line };
  }

  const start = selection.start.line + 1;
  let end = selection.end.line + 1;

  // Dragging to the start of the next line should not include that empty line
  if (selection.end.character === 0) {
    end = Math.max(start, end - 1);
  }

  return { start, end };
}

function mergeRanges(
  ranges: Array<{ start: number; end: number }>
): Array<{ start: number; end: number }> {
  if (ranges.length === 0) {
    return [];
  }

  const result: Array<{ start: number; end: number }> = [
    { ...ranges[0] },
  ];

  for (let i = 1; i < ranges.length; i++) {
    const current = ranges[i];
    const last = result[result.length - 1];
    if (current.start <= last.end + 1) {
      last.end = Math.max(last.end, current.end);
    } else {
      result.push({ ...current });
    }
  }

  return result;
}

function getSelectedOrCurrentLineText(
  editor: vscode.TextEditor
): string {
  const { document, selection } = editor;
  if (!selection.isEmpty) {
    return document.getText(selection);
  }
  return document.lineAt(selection.active.line).text;
}

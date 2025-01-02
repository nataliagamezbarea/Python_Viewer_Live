const vscode = require("vscode");
const { ejecutarYMostrarResultado } = require("./pythonExecutor");

function activate(context) {
  registrarComandos(context);
  escucharCambiosEnDocumento();
}

function registrarComandos(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("createPythonPackage.executePythonFile", (uri) => {
      if (!esArchivoPython(uri)) {
        vscode.window.showErrorMessage("Por favor, selecciona un archivo Python (.py).");
        return;
      }
      ejecutarYMostrarResultado(uri.fsPath);
    })
  );
}

function escucharCambiosEnDocumento() {
  vscode.workspace.onDidChangeTextDocument((event) => {
    if (event.document.languageId === "python") {
      ejecutarYMostrarResultado(event.document.uri.fsPath);
    }
  });
}

function esArchivoPython(uri) {
  return uri && uri.fsPath.endsWith(".py");
}

module.exports = { activate };

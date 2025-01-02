const fs = require("fs");
const path = require("path");
const vscode = require("vscode");  

let outputPanel = null;

function obtenerRootDir() {
  return vscode.workspace.workspaceFolders[0].uri.fsPath; 
}

async function obtenerContenidoArchivo(rutaArchivo) {
  return fs.promises.readFile(rutaArchivo, "utf-8");
}

async function obtenerStandardInput(codigoPython) {
  const rutasImportadas = obtenerRutaImportacion(codigoPython);
  let standardInput = [];

  for (const { rutaArchivo } of rutasImportadas) {
    if (fs.existsSync(rutaArchivo)) {
      const contenidoImportado = await obtenerContenidoArchivo(rutaArchivo);
      standardInput = extraerStandardInput(contenidoImportado);
      if (standardInput.length > 0) break;
    }
  }

  return standardInput.length ? standardInput : extraerStandardInput(codigoPython);
}

function obtenerRutaImportacion(codigoPython) {
  const regex = /from\s+([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*)\s+import\s+([a-zA-Z0-9_]+)/g;
  let rutasImportadas = [];
  let match;

  while ((match = regex.exec(codigoPython)) !== null) {
    const rutaModulo = match[1];
    const variable = match[2];
    const rootDir = obtenerRootDir(); 
    const rutaArchivo = path.join(rootDir, rutaModulo.replace(/\./g, path.sep) + '.py');
    rutasImportadas.push({ rutaArchivo, variable });
  }

  return rutasImportadas;
}

function modificarInputs(codigoPython, standardInput) {
  const inputRegex = /input\(["'](.*?)["']\)/g;
  let index = 0;

  return codigoPython.replace(inputRegex, (match, p1) => {
    if (index < standardInput.length) {
      const inputValue = standardInput[index++];
      return `input("${p1} ${inputValue}\\n")`;
    }
    return match;
  });
}

function extraerStandardInput(codigoPython) {
  // @ts-ignore
  const regex = /standard_input\s*=\s*\[(.*?)\]/s;
  const match = regex.exec(codigoPython);
  if (match && match[1]) {
    return match[1].split(",").map(value => value.trim().replace(/['"\s]/g, ''));
  }
  return [];
}

function enviarStandardInput(pythonProcess, standardInput) {
  if (standardInput.length > 0) {
    for (let input of standardInput) {
      pythonProcess.stdin.write(input + "\n");
    }
  }
  pythonProcess.stdin.end();
}

function mostrarResultado(contenido, standardInput) {
  const outputHTML = generarHTML(contenido, standardInput);

  if (!outputPanel) {
    outputPanel = vscode.window.createWebviewPanel(
      "pythonOutput",
      "Resultado Python",
      vscode.ViewColumn.Beside,
      { enableScripts: true }
    );
  }

  outputPanel.webview.html = outputHTML;

  outputPanel.onDidDispose(() => {
    outputPanel = null;
  });
}

function generarHTML(contenido, standardInput) {
  const resultadosHTML = contenido.replace(/\n\s*/g, "<br>");
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resultado de Python</title>
        <style>
          body {
            font-family: Courier, monospace;
            white-space: pre-wrap;
            background-color: #1e1e1e;
            color: var(--vscode-editor-foreground);
          }
          div {
            background-color: #1e1e1e;
            color: var(--vscode-editor-foreground);
            border-radius: 4px;
            font-size: 14px;
          }
          h3 {
            color: var(--vscode-editor-foreground);
          }
        </style>
      </head>
      <body>
        <div>${resultadosHTML}</div>
      </body>
    </html>
  `;
}

module.exports = { obtenerContenidoArchivo, obtenerStandardInput, modificarInputs, enviarStandardInput, generarHTML, mostrarResultado };

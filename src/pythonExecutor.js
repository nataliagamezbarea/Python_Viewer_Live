const vscode = require("vscode");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const {
  obtenerContenidoArchivo,
  obtenerStandardInput,
  modificarInputs,
  enviarStandardInput,
  generarHTML,
  mostrarResultado,
} = require("./fileUtils");

let outputPanel = null;

async function ejecutarYMostrarResultado(rutaArchivo) {
  try {
    const contenidoArchivo = await obtenerContenidoArchivo(rutaArchivo);
    const standardInput = await obtenerStandardInput(contenidoArchivo);

    const contenidoModificado = `
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
${modificarInputs(contenidoArchivo, standardInput)}
    `;

    const rootDir = obtenerRootDir();

    console.log(`Ejecutando el archivo Python en la ruta: ${rutaArchivo}`);

    const pythonProcess = spawn("python", ["-c", contenidoModificado], {
      cwd: rootDir,
      env: {
        ...process.env,
        PYTHONPATH: rootDir,
      },
    });

    enviarStandardInput(pythonProcess, standardInput);

    let contenido = "";
    pythonProcess.stdout.on("data", (data) => {
      contenido += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      contenido += `Stderr:\n${data.toString()}\n\n`;
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        contenido += `El proceso Python terminó con código de salida ${code}.`;
      }
      mostrarResultado(contenido, standardInput);
    });
  } catch (error) {
    console.error("Error al ejecutar el archivo Python:", error);
  }
}

function obtenerRootDir() {
  return vscode.workspace.workspaceFolders[0].uri.fsPath;
}

module.exports = { ejecutarYMostrarResultado };

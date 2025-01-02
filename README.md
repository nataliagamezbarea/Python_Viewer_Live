# Python Viewer Live

Esta extensión de Visual Studio Code permite ejecutar y visualizar el resultado de archivos Python en tiempo real, mostrando la salida de la ejecución y simulando entradas estándar (`input()`) para facilitar la depuración.

## Características

- **Ejecución de Archivos Python**: Ejecuta archivos Python directamente desde Visual Studio Code y muestra el resultado en un panel de salida.
- **Simulación de Entradas**: Permite la simulación de entradas estándar (`input()`) definidas dentro del código Python, sin necesidad de interacción manual.
- **Panel de Salida**: Muestra el resultado de la ejecución del archivo Python en un panel web dentro de Visual Studio Code.
- **Extracción Automática de Entradas**: Extrae automáticamente las entradas estándar desde el código Python o desde un archivo específico (`variable.py`).
- **Visualización de Errores**: Muestra los errores estándar (`stderr`) de la ejecución directamente en el panel.
- **Comandos Personalizados**: Ejecuta archivos Python directamente desde la paleta de comandos de VSCode.

## Comandos

Los siguientes comandos están disponibles en la paleta de comandos de Visual Studio Code:

- **`createPythonPackage.executePythonFile`**: Ejecuta el archivo Python seleccionado.
  - Abre un archivo Python en VSCode y ejecútalo directamente desde la paleta de comandos.

## Uso

1. **Ejecutar un Archivo Python**:
   - Abre el archivo `.py` que deseas ejecutar.
   - Ejecuta el comando `createPythonPackage.executePythonFile` desde la paleta de comandos de Visual Studio Code.
   - La salida se mostrará en el panel de resultados, donde podrás ver la ejecución del código y las simulaciones de entradas `input()`.

2. **Simulación de Entradas**:
   - En tu código Python, define un array de entradas estándar de la forma:
     ```python
     standard_input = ["entrada1", "entrada2", "entrada3"]
     ```
   - La extensión utilizará estos valores como entradas automáticas para las funciones `input()` en el código.

3. **Manejo de Errores**:
   - Si la ejecución del código Python genera errores (`stderr`), estos se mostrarán en el panel de salida.

## Instalación

1. Abre Visual Studio Code.
2. Ve a la pestaña de **Extensiones** (ícono de cuadrícula en la barra lateral).
3. Busca `Python Viewer Live`.
4. Haz clic en **Instalar**.

## Configuración

La extensión se configura automáticamente al instalarse. Sin embargo, puedes personalizar el comportamiento de la ejecución de Python a través de la configuración de VSCode.

### Archivos de Configuración

La extensión busca entradas estándar en el archivo `standard_input = ["valor1" , "valor2"]` dentro del archivo Python que estás ejecutando. También puedes importar la variable.

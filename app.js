const fs = require('fs');
const path = require('path');

// Función para leer cualquier archivo de texto de forma segura
function leerTexto(nombreArchivo) {
    try {
        const rutaArchivo = path.join(__dirname, 'textos', nombreArchivo);
        if (fs.existsSync(rutaArchivo)) {
            return fs.readFileSync(rutaArchivo, 'utf8').trim();
        } else {
            console.log(`El archivo ${nombreArchivo} no se encontró.`);
            return "Información no disponible temporalmente.";
        }
    } catch (error) {
        console.error(`Error leyendo el archivo ${nombreArchivo}:`, error);
        return "Error al cargar la información.";
    }
}

// Probando la lectura de tus archivos principales
const proximaActividad = leerTexto('actividades.txt');
const comoColaborar = leerTexto('colaboracion.txt');
const contactoEquipo = leerTexto('contacto_telefonos.txt');
const menuPrincipal = leerTexto('menu.txt');

console.log("--- MENÚ PRINCIPAL ---");
console.log(menuPrincipal);

console.log("\n--- PRÓXIMA ACTIVIDAD ---");
console.log(proximaActividad);
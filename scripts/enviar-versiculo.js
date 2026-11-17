const fs = require('fs');

const APP_ID = '01b3d5eb-72d8-44d2-b8da-c61986cbe26a';
const REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

if (!REST_API_KEY) {
  console.error('Falta ONESIGNAL_REST_API_KEY');
  process.exit(1);
}

const contenido = fs.readFileSync('textos/aliento.txt', 'utf8');
const versiculos = contenido
  .split(/\r?\n/)
  .map((linea) => linea.trim())
  .filter((linea) => linea.length > 0);

if (versiculos.length === 0) {
  console.error('textos/aliento.txt está vacío');
  process.exit(1);
}

const indice = Math.floor(Math.random() * versiculos.length);
const versiculoElegido = versiculos[indice];

async function enviarNotificacion() {
  const respuesta = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Basic ${REST_API_KEY}`
    },
    body: JSON.stringify({
      app_id: APP_ID,
      included_segments: ['Total Subscriptions'],
      headings: { es: 'Club Otoñal — Palabra de Aliento' },
      contents: { es: versiculoElegido }
    })
  });

  const datos = await respuesta.json();
  console.log('Versículo enviado:', versiculoElegido);
  console.log('Respuesta OneSignal:', JSON.stringify(datos));

  if (!respuesta.ok || datos.errors) {
    process.exit(1);
  }
}

enviarNotificacion();

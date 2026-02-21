// 1. Importaciones necesarias desde la nube
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Tu configuración que encontraste (YA INTEGRADA)
const firebaseConfig = {
  apiKey: "AIzaSyC7jfXwzhbDMBoFQIVRFA-T7Z5z5ORwBcY",
  authDomain: "app-rico-express-mensajeria.firebaseapp.com",
  projectId: "app-rico-express-mensajeria",
  storageBucket: "app-rico-express-mensajeria.firebasestorage.app",
  messagingSenderId: "564550571645",
  appId: "1:564550571645:web:3f0466c6c7b5a5224f4314",
  measurementId: "G-YR37D30D59"
};

// 3. Inicializar Firebase y la Base de Datos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. Tarifas de Rico Express
const tarifas = {
    "Medellín": 12000, "Bello": 17000, "Itagüí": 17000, "Envigado": 17000,
    "Sabaneta": 17000, "La Estrella": 18000, "San Antonio de Prado": 20000,
    "Caldas": 25000, "Copacabana": 23000, "Girardota": 33000, "Barbosa": 43000
};

// 5. Lógica para guardar el servicio y enviar WhatsApp
document.getElementById('form-servicio').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Capturar datos del formulario
    const muni = document.getElementById('municipio').value;
    const nombreCli = document.getElementById('nombre').value;
    const telCli = document.getElementById('telefono').value;
    const valorServicio = tarifas[muni] || 0;
    const guiaID = "RX" + Date.now(); // Crea número de guía único

    const pedido = {
        guia: guiaID,
        nombre: nombreCli,
        telefono: telCli,
        origen: document.getElementById('origen').value,
        destino: document.getElementById('destino').value,
        municipio: muni,
        valor: valorServicio,
        estado: "Pendiente de pago",
        fecha: new Date().toLocaleString()
    };

    try {
        // Guardar en la nube (Firestore)
        await addDoc(collection(db, "servicios"), pedido);
        
        alert("✅ Guía Generada: " + guiaID);

        // Abrir WhatsApp con la información
        const mensajeWA = `*RICO EXPRESS*%0A` +
                          `*Guía:* ${guiaID}%0A` +
                          `*Servicio:* ${muni}%0A` +
                          `*Valor:* $${valorServicio.toLocaleString()}%0A` +
                          `*Nequi:* 3003565305%0A` +
                          `Por favor envía el comprobante.`;
        
        window.open(`https://wa.me/57${telCli}?text=${mensajeWA}`, '_blank');
        
        // Limpiar formulario
        document.getElementById('form-servicio').reset();

    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error al guardar. Verifica si activaste Firestore en modo prueba.");
    }
});
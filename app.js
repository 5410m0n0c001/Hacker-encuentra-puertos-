// Servicios y puertos comunes para el juego
const servicios = [
    {
        nombre: "SSH (Secure Shell)",
        puerto: 22,
        descripcion: "Protocolo para acceso remoto seguro a sistemas Unix/Linux",
        pista: "El puerto estándar para conexiones SSH seguras. Muy usado por administradores."
    },
    {
        nombre: "HTTP (Web Server)",
        puerto: 80,
        descripcion: "Protocolo de transferencia de hipertexto para sitios web",
        pista: "Puerto por defecto para sitios web sin cifrado SSL."
    },
    {
        nombre: "HTTPS (Web Seguro)",
        puerto: 443,
        descripcion: "HTTP sobre SSL/TLS para conexiones web seguras",
        pista: "Puerto estándar para sitios web con cifrado SSL/TLS."
    },
    {
        nombre: "FTP (File Transfer)",
        puerto: 21,
        descripcion: "Protocolo de transferencia de archivos",
        pista: "Puerto clásico para transferencia de archivos, muy vulnerable."
    },
    {
        nombre: "Telnet",
        puerto: 23,
        descripcion: "Protocolo de acceso remoto sin cifrado (inseguro)",
        pista: "Puerto para acceso remoto sin cifrado. ¡Muy inseguro!"
    },
    {
        nombre: "SMTP (Email)",
        puerto: 25,
        descripcion: "Protocolo simple de transferencia de correo",
        pista: "Puerto para envío de correos electrónicos."
    },
    {
        nombre: "DNS (Domain Name)",
        puerto: 53,
        descripcion: "Sistema de nombres de dominio",
        pista: "Puerto para resolución de nombres de dominio."
    },
    {
        nombre: "MySQL Database",
        puerto: 3306,
        descripcion: "Base de datos MySQL",
        pista: "Puerto por defecto de la base de datos MySQL."
    },
    {
        nombre: "RDP (Remote Desktop)",
        puerto: 3389,
        descripcion: "Escritorio remoto de Windows",
        pista: "Puerto para acceso remoto a escritorios Windows."
    },
    {
        nombre: "PostgreSQL Database",
        puerto: 5432,
        descripcion: "Base de datos PostgreSQL",
        pista: "Puerto estándar de PostgreSQL, base de datos muy robusta."
    }
];

let servicioActual = null;
let intentos = 0;
let serviciosEncontrados = 0;
let serviciosUsados = [];

function asignarTextoElemento(elemento, texto) {
    let elementoHTML = document.querySelector(elemento);
    if (elementoHTML) {
        elementoHTML.innerHTML = texto;
    }
}

function actualizarStats() {
    document.getElementById('intentos').textContent = intentos;
    document.getElementById('serviciosEncontrados').textContent = serviciosEncontrados;
    document.getElementById('puertosRestantes').textContent = servicios.length - serviciosUsados.length;
}

function mostrarServicio(servicio) {
    const serviceDiv = document.getElementById('serviceInfo');
    serviceDiv.innerHTML = `
        <div class="service-name">🎯 TARGET: ${servicio.nombre}</div>
        <div>${servicio.descripcion}</div>
        <div class="hint">💡 Pista: ${servicio.pista}</div>
    `;
}

function verificarIntento() {
    let puertoUsuario = parseInt(document.getElementById('valorUsuario').value);
    
    if (!puertoUsuario || puertoUsuario < 1 || puertoUsuario > 65535) {
        mostrarResultado('⚠️ Puerto inválido. Ingresa un número entre 1 y 65535', 'warning');
        return;
    }
    
    if (puertoUsuario === servicioActual.puerto) {
        serviciosEncontrados++;
        mostrarResultado(`🎉 ¡ACCESO CONCEDIDO! Puerto ${puertoUsuario} - ${servicioActual.nombre}`, 'success');
        document.getElementById('reiniciar').removeAttribute('disabled');
        
        // Efecto de éxito
        document.querySelector('.container').style.boxShadow = '0 0 100px rgba(0, 255, 0, 0.8)';
        setTimeout(() => {
            document.querySelector('.container').style.boxShadow = '0 0 50px rgba(0, 255, 0, 0.3)';
        }, 2000);
        
    } else {
        if (puertoUsuario > servicioActual.puerto) {
            mostrarResultado(`🔴 PUERTO CERRADO - El puerto objetivo es MENOR que ${puertoUsuario}`, 'error');
        } else {
            mostrarResultado(`🔴 PUERTO CERRADO - El puerto objetivo es MAYOR que ${puertoUsuario}`, 'error');
        }
        intentos++;
        actualizarStats();
        limpiarCaja();
    }
}

function mostrarResultado(mensaje, tipo) {
    const resultado = document.getElementById('resultado');
    resultado.textContent = mensaje;
    resultado.className = `resultado ${tipo}`;
}

function limpiarCaja() {
    document.querySelector('#valorUsuario').value = '';
}

function generarServicioAleatorio() {
    const serviciosDisponibles = servicios.filter(s => !serviciosUsados.includes(s.puerto));
    
    if (serviciosDisponibles.length === 0) {
        mostrarResultado('🏆 ¡FELICITACIONES! Has encontrado todos los servicios', 'success');
        asignarTextoElemento('#title', 'MISIÓN COMPLETADA');
        return null;
    }
    
    const servicioAleatorio = serviciosDisponibles[Math.floor(Math.random() * serviciosDisponibles.length)];
    serviciosUsados.push(servicioAleatorio.puerto);
    return servicioAleatorio;
}

function condicionesIniciales() {
    asignarTextoElemento('#title', 'H4CK3R PORT GUESSER');
    servicioActual = generarServicioAleatorio();
    
    if (servicioActual) {
        mostrarServicio(servicioActual);
        mostrarResultado('🔍 Sistema listo. Inicia el escaneo de puertos...', '');
    }
    
    intentos = 1;
    actualizarStats();
    
    console.log(`[DEBUG] Puerto objetivo: ${servicioActual?.puerto} - ${servicioActual?.nombre}`);
}

function reiniciarJuego() {
    limpiarCaja();
    condicionesIniciales();
    document.querySelector('#reiniciar').setAttribute('disabled', 'true');
    document.querySelector('.container').style.boxShadow = '0 0 50px rgba(0, 255, 0, 0.3)';
}

// Inicializar el juego
condicionesIniciales();

// Permitir Enter para enviar
document.getElementById('valorUsuario').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        verificarIntento();
    }
});

// Efecto de typing en el título
function typingEffect() {
    const title = document.getElementById('title');
    const originalText = title.textContent;
    let index = 0;
    title.textContent = '';
    
    const timer = setInterval(() => {
        if (index < originalText.length) {
            title.textContent += originalText.charAt(index);
            index++;
        } else {
            clearInterval(timer);
        }
    }, 100);
}

// Iniciar efecto de typing al cargar
window.addEventListener('load', () => {
    setTimeout(typingEffect, 500);
});
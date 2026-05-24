// =========================================================
// SCRIPT GENERAL DE LA PÁGINA - HOSPITAL REGIONAL
// =========================================================

// ==========================================
// 1. BASE DE DATOS SIMULADA (Para el equipo)
// ==========================================
const HOSPITAL_DATA = {
    especialidades: [
        { nombre: "Pediatría", categoria: "niños", palabras: ["fiebre", "vacuna", "crecimiento", "niño", "bebe"] },
        { nombre: "Cardiología", categoria: "adultos", palabras: ["pecho", "presión", "corazón", "infarto"] },
        { nombre: "Medicina General", categoria: "todos", palabras: ["dolor", "malestar", "resfriado", "gripe"] }
    ],
    doctores: {
        "Pediatría": ["Dr. Luis Zapata", "Dra. Ana Silva"],
        "Cardiología": ["Dr. Ricardo Pérez", "Dra. María Gómez"],
        "Medicina General": ["Dr. Carlos Ruiz", "Dra. Elena Castro"]
    }
};

// ==========================================
// 2. SISTEMA DE NOTIFICACIONES GLOBAL (SweetAlert2)
// ==========================================
function mostrarNotificacion(titulo, texto, icono = 'success') {
    Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        confirmButtonColor: '#0056b3',
        confirmButtonText: 'Aceptar'
    });
}

// ==========================================
// 3. EVENTOS AL CARGAR LA PÁGINA (Animaciones y Footer)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // A) Configurar el año actual en el Footer (Código original)
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // B) Motor de Animación al hacer Scroll (Fade-In)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    const secciones = document.querySelectorAll('section, .transparencia-container');
    secciones.forEach((el) => {
        el.classList.add('fade-section');
        observer.observe(el);
    });

});

// ==========================================
// 4. ZONA DE ROYSER - Contacto
// ==========================================
function mostrarPanel() {
    var val = document.getElementById('servicio-select').value;
    document.querySelectorAll('.panel').forEach(function(p) {
        p.classList.remove('active');
    });
    if (val) document.getElementById('panel-' + val).classList.add('active');
}

function enviar(msgId) {
    document.getElementById(msgId).style.display = 'block';
    setTimeout(function() {
        document.getElementById(msgId).style.display = 'none';
    }, 4000);
}
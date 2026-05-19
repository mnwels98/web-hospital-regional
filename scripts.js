// ==========================================
// SCRIPT GENERAL DE LA PÁGINA
// ==========================================

// Esperamos a que todo el HTML cargue primero
document.addEventListener("DOMContentLoaded", function() {
    
    // Buscamos la etiqueta que tiene el id "year" en el Footer
    const yearSpan = document.getElementById("year");
    
    // Si la encontramos, le inyectamos el año actual de la computadora
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
});

// ZONA DE ROYSER - Contacto
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
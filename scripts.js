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
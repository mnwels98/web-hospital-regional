/**
 * LÓGICA DEL PORTAL DE CONVOCATORIAS
 */

// 1. Buscador en tiempo real
document.addEventListener("DOMContentLoaded", () => {
    const buscador = document.getElementById('buscadorProcesos');
    if (buscador) {
        buscador.addEventListener('keyup', (e) => {
            const textoBusqueda = e.target.value.toLowerCase();
            document.querySelectorAll('.filas-procesos tr').forEach(fila => {
                fila.style.display = fila.textContent.toLowerCase().includes(textoBusqueda) ? '' : 'none';
            });
        });
    }
});

// 2. Sistema de Pestañas
function cambiarPestana(evento, idPestana) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    
    evento.currentTarget.classList.add('active');
    document.getElementById(idPestana).classList.add('active');
}

// 3. Vista Maestro-Detalle (Ver Postulantes)
function verPostulantes(nombreProceso) {
    document.getElementById('vista-procesos').classList.add('hidden');
    document.getElementById('vista-resultados').classList.remove('hidden');
    document.getElementById('titulo-resultados').innerText = `Cuadro de Méritos: Proceso ${nombreProceso}`;
    
    const cuerpoTabla = document.getElementById('cuerpoResultados');
    cuerpoTabla.innerHTML = ''; 

    // Base de datos simulada
    const nombres = ["Juan Pérez García", "Ana García Ruiz", "Luis Torres Huamán", "María López Quispe", "Carlos Díaz Silva", "Elena Ruiz Vega", "Jorge Soto Solano", "Lucía Vega Ríos"];
    const cargos = nombreProceso.includes("Médico") ? ["Médico Cirujano", "Médico Pediatra"] : 
                   nombreProceso.includes("Enfermería") ? ["Enfermera UCI", "Enfermera General"] : 
                   ["Administrativo", "Soporte TI"];

    for (let i = 0; i < 8; i++) {
        const nombre = nombres[i];
        const cargo = cargos[Math.floor(Math.random() * cargos.length)];
        const aprobo = Math.random() > 0.4; // Simula aprobados y desaprobados

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><strong>${nombre}</strong></td>
            <td>${cargo}</td>
            <td><span class="${aprobo ? 'badge-aprobado' : 'badge-rechazado'}">${aprobo ? 'APTO / GANADOR' : 'NO APTO'}</span></td>
        `;
        cuerpoTabla.appendChild(fila);
    }
}

// 4. Volver a la lista general
function volverAProcesos() {
    document.getElementById('vista-resultados').classList.add('hidden');
    document.getElementById('vista-procesos').classList.remove('hidden');
}
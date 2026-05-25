/**
 * LÓGICA DEL PORTAL DE CONVOCATORIAS - HEGB
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Generar la base de datos simulada de procesos al cargar la página
    generarProcesos();

    // 2. Activar buscador
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

// ==========================================
// GENERADOR DE DATOS (SIMULACIÓN DE BASE DE DATOS)
// ==========================================
function generarProcesos() {
    const tbody2026 = document.getElementById('tbody-2026');
    const tbodyAnteriores = document.getElementById('tbody-anteriores');
    const areas = ["Médico Cirujano", "Enfermera UCI", "Técnico en Laboratorio", "Soporte TI", "Asistente Administrativo", "Médico Pediatra", "Tecnólogo Médico", "Nutricionista", "Psicólogo", "Vigilancia"];

    // Generar 10 procesos para 2026
    for(let i = 10; i >= 1; i--) {
        const mes = String(Math.floor(Math.random() * 6) + 1).padStart(2, '0');
        const area = areas[Math.floor(Math.random() * areas.length)];
        const numCas = String(i).padStart(3, '0');
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>15/${mes}/2026</td>
            <td>PROCESO CAS N° ${numCas}-2026: Contratación de ${area}</td>
            <td><button class="btn-moderno" onclick="verPostulantes('CAS N° ${numCas}-2026')">👁️ Ver Resultados</button></td>
        `;
        tbody2026.appendChild(tr);
    }

    // Generar 20 procesos para años anteriores (2025 y 2024)
    for(let i = 20; i >= 1; i--) {
        const anio = Math.random() > 0.5 ? 2025 : 2024;
        const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const area = areas[Math.floor(Math.random() * areas.length)];
        const numCas = String(i).padStart(3, '0');
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>10/${mes}/${anio}</td>
            <td>PROCESO CAS N° ${numCas}-${anio}: Contratación de ${area}</td>
            <td><button class="btn-moderno" onclick="verPostulantes('CAS N° ${numCas}-${anio}')">👁️ Ver Resultados</button></td>
        `;
        tbodyAnteriores.appendChild(tr);
    }

    // Actualizar los contadores en las pestañas de forma dinámica
    document.getElementById('count-2026').innerText = "10";
    document.getElementById('count-anteriores').innerText = "20";
}

// ==========================================
// CONTROL DE NAVEGACIÓN Y PESTAÑAS
// ==========================================
function cambiarPestana(evento, idPestana) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    
    evento.currentTarget.classList.add('active');
    document.getElementById(idPestana).classList.add('active');
}

function verPostulantes(nombreProceso) {
    document.getElementById('vista-procesos').classList.add('hidden');
    document.getElementById('vista-resultados').classList.remove('hidden');
    document.getElementById('titulo-resultados').innerText = `Cuadro de Méritos: Proceso ${nombreProceso}`;
    
    const cuerpoTabla = document.getElementById('cuerpoResultados');
    cuerpoTabla.innerHTML = ''; 

    const nombres = ["Juan Pérez García", "Ana García Ruiz", "Luis Torres Huamán", "María López Quispe", "Carlos Díaz Silva", "Elena Ruiz Vega", "Jorge Soto Solano", "Lucía Vega Ríos", "David Meca Inga", "Sara Paz Luna"];
    const cargos = nombreProceso.includes("Médico") ? ["Médico Cirujano", "Médico Pediatra"] : 
                   nombreProceso.includes("Enfermer") ? ["Enfermera UCI", "Enfermera General"] : 
                   ["Administrativo", "Soporte TI", "Técnico Especialista"];

    for (let i = 0; i < 8; i++) {
        // Nombres aleatorios del arreglo
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const cargo = cargos[Math.floor(Math.random() * cargos.length)];
        const aprobo = Math.random() > 0.4; 

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><strong>${nombre}</strong></td>
            <td>${cargo}</td>
            <td><span class="${aprobo ? 'badge-aprobado' : 'badge-rechazado'}">${aprobo ? 'APTO / GANADOR' : 'NO APTO'}</span></td>
        `;
        cuerpoTabla.appendChild(fila);
    }
}

function volverAProcesos() {
    document.getElementById('vista-resultados').classList.add('hidden');
    document.getElementById('vista-procesos').classList.remove('hidden');
}
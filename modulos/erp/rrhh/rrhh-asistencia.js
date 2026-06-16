document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos de la vista principal
    const formFiltros = document.getElementById('form-filtros-asistencia');
    const btnAbrirModal = document.getElementById('btn-marcar-asistencia');
    const tablaBody = document.getElementById('tabla-asistencia-body');

    // Elementos del Modal Integrado
    const modalAsistencia = document.getElementById('modal-asistencia');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnCancelarModal = document.getElementById('btn-cancelar-modal');
    const formAsistencia = document.getElementById('formulario-asistencia');

    // ==========================================
    // 1. MANEJO DEL MODAL (Abrir / Cerrar)
    // ==========================================
    const abrirModal = () => {
        if (modalAsistencia) {
            modalAsistencia.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Bloquea scroll de fondo
        }
    };

    const cerrarModal = () => {
        if (modalAsistencia) {
            modalAsistencia.style.display = 'none';
            document.body.style.overflow = 'auto'; // Libera scroll de fondo
            if (formAsistencia) formAsistencia.reset(); // Limpia los campos
        }
    };

    // Asignación de eventos de control
    if (btnAbrirModal) btnAbrirModal.addEventListener('click', abrirModal);
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModal);
    if (btnCancelarModal) btnCancelarModal.addEventListener('click', cerrarModal);

    // Cerrar si el usuario hace clic fuera de la caja blanca del modal
    window.addEventListener('click', (e) => {
        if (e.target === modalAsistencia) {
            cerrarModal();
        }
    });

    // ==========================================
    // 2. LOGIC DE FILTROS DE BÚSQUEDA
    // ==========================================
    if (formFiltros) {
        formFiltros.addEventListener('submit', (e) => {
            e.preventDefault();
            const area = document.getElementById('area').value;
            const fecha = document.getElementById('fecha').value;
            console.log(`Buscando registros en el sistema para el área: ${area} en la fecha: ${fecha}`);
        });
    }

    // ==========================================
    // 3. PROCESAMIENTO DEL FORMULARIO (Inserción)
    // ==========================================
    if (formAsistencia) {
        formAsistencia.addEventListener('submit', (e) => {
            e.preventDefault();

            // Capturar elementos de selección
            const comboColaborador = document.getElementById('select-colaborador');
            const nombreEmpleado = comboColaborador.value;
            
            // Obtener el departamento guardado en el atributo personalizado 'data-area'
            const opcionSeleccionada = comboColaborador.options[comboColaborador.selectedIndex];
            const areaEmpleado = opcionSeleccionada.getAttribute('data-area') || 'General';
            
            const tipoMarca = document.getElementById('select-tipo-marca').value;
            const observacion = document.getElementById('txt-observacion').value || 'Sin observaciones';

            // Capturar hora del sistema
            const ahora = new Date();
            const horaFormateada = ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

            // Formatear columnas de Ingreso / Salida según el tipo de registro
            let celdaIngreso = '—';
            let celdaSalida = '—';
            
            if (tipoMarca === 'Ingreso') {
                celdaIngreso = `<strong>${horaFormateada}</strong>`;
            } else {
                celdaSalida = `<strong>${horaFormateada}</strong>`;
            }

            // Construir la nueva fila estructurada para la tabla
            const nuevaFila = document.createElement('tr');
            nuevaFila.innerHTML = `
                <td>${nombreEmpleado}</td>
                <td>${areaEmpleado}</td>
                <td>${celdaIngreso}</td>
                <td>${celdaSalida}</td>
                <td><span class="badge badge-activo">Presente</span></td>
                <td>${observacion}</td>
            `;

            // Insertar el nuevo registro al principio de la tabla de asistencia
            if (tablaBody) {
                tablaBody.insertBefore(nuevaFila, tablaBody.firstChild);
            }

            // Feedback visual sutil (animación de inserción temporal)
            nuevaFila.style.backgroundColor = 'rgba(40, 167, 69, 0.15)';
            setTimeout(() => {
                nuevaFila.style.transition = 'background-color 0.8s ease';
                nuevaFila.style.backgroundColor = '';
            }, 1000);

            // Cerrar el modal al finalizar correctamente
            cerrarModal();
        });
    }
});
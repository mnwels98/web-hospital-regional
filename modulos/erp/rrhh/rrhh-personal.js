// Coloca aquí tu URL de Google Apps Script. 
// Como la declaramos fuera, todas las funciones podrán usarla.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyeynkHzjTFrVPDBBTtsNNP5tooxYDKVsE1VVYdAdiXSsbvV-Q5j15F_ImyQSuX0z8U/exec'; 

// Hacemos que la función de cargar sea global para poder llamarla desde "Editar" y "Crear"
window.cargarEmpleadosDesdeSheet = async function() {
    const tbody = document.querySelector('.tabla-contenedor table tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Cargando directorio de personal...</td></tr>';

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        if (!response.ok) throw new Error('Error al conectar.');
        const empleados = await response.json();
        
        tbody.innerHTML = '';
        if (empleados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No hay colaboradores registrados.</td></tr>';
            return;
        }

        empleados.forEach(emp => {
            let badgeClass = 'badge-activo';
            if (emp.estado === 'Licencia' || emp.estado === 'Inactivo') badgeClass = 'badge-inactivo';
            if (emp.estado === 'Vacaciones') badgeClass = 'badge-pendiente';

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><strong>${emp.dni}</strong><br><small style="color: var(--color-texto-mutado);">${emp.codigo}</small></td>
                <td>${emp.apellidos}, ${emp.nombres}</td>
                <td>${emp.cargo}</td>
                <td>${emp.departamento}</td>
                <td>${emp.telefono}</td>
                <td><span class="badge ${badgeClass}">${emp.estado}</span></td>
                <td>
                    <button class="btn" style="background-color: var(--color-info); color: white; padding: 4px 8px; font-size: 0.8rem;" 
                            onclick="abrirVerPerfil('${emp.dni}', '${emp.apellidos}, ${emp.nombres}', '${emp.cargo}', '${emp.departamento}', '${emp.telefono}', '${emp.estado}')">
                        Ver Perfil
                    </button>
                    <button class="btn btn-primario" style="padding: 4px 8px; font-size: 0.8rem;" 
                            onclick="abrirEditarEmpleado('${emp.dni}', '${emp.codigo}', '${emp.apellidos}', '${emp.nombres}', '${emp.cargo}', '${emp.departamento}', '${emp.telefono}', '${emp.email}', '${emp.tipoContrato}', '${emp.estado}')">
                        Editar
                    </button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error(error);
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color: red;">Error al cargar datos.</td></tr>';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    // Carga inicial
    window.cargarEmpleadosDesdeSheet();

    // Referencias del modal de CREAR
    const modalNuevo = document.getElementById('modalNuevoEmpleado');
    const btnAbrirModal = document.getElementById('btnAbrirModalNuevo');
    const btnCerrarModalX = document.querySelector('#modalNuevoEmpleado .modal-cerrar');
    const btnCancelar = document.getElementById('btnCancelarNuevo');
    const formNuevoEmpleado = document.getElementById('formularioNuevoEmpleado');
    const btnSubmit = document.getElementById('btnGuardarNuevo');

    if (btnAbrirModal) btnAbrirModal.addEventListener('click', () => modalNuevo.style.display = 'flex');

    const cerrarModalNuevo = () => {
        modalNuevo.style.display = 'none';
        formNuevoEmpleado.reset(); 
    };

    if (btnCerrarModalX) btnCerrarModalX.addEventListener('click', cerrarModalNuevo);
    if (btnCancelar) btnCancelar.addEventListener('click', cerrarModalNuevo);

    // Enviar CREAR
    formNuevoEmpleado.addEventListener('submit', async (e) => {
        e.preventDefault();
        const textoOriginal = btnSubmit.textContent;
        btnSubmit.textContent = 'Guardando...';
        btnSubmit.disabled = true;

        const formData = new FormData(formNuevoEmpleado);
        formData.append('accion', 'crear'); // Le decimos a Google que es un registro nuevo

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: new URLSearchParams(formData)
            });

            if (response.ok) {
                alert('Colaborador registrado exitosamente. Se envió una notificación por correo.');
                cerrarModalNuevo();
                await window.cargarEmpleadosDesdeSheet();
            } else {
                throw new Error('Error en Google.');
            }
        } catch (error) {
            console.error(error);
            alert('Error al registrar el empleado.');
        } finally {
            btnSubmit.textContent = textoOriginal;
            btnSubmit.disabled = false;
        }
    });
});

// ==========================================
// FUNCIONES GLOBALES (EDITAR)
// ==========================================
window.abrirEditarEmpleado = function(dni, codigo, apellidos, nombres, cargo, departamento, telefono, email, tipoContrato, estado) {
    const modalEditar = document.getElementById('modalEditarEmpleado');
    
    document.getElementById('editDni').value = dni;
    document.getElementById('editCodigo').value = codigo;
    document.getElementById('editApellidos').value = apellidos;
    document.getElementById('editNombres').value = nombres;
    document.getElementById('editCargo').value = cargo;
    document.getElementById('editDepartamento').value = departamento;
    document.getElementById('editTelefono').value = telefono;
    document.getElementById('editEmail').value = email;
    document.getElementById('editTipoContrato').value = tipoContrato;
    document.getElementById('editEstado').value = estado;
    
    modalEditar.style.display = 'flex';
};

window.cerrarModalEditarEmpleado = function() {
    document.getElementById('modalEditarEmpleado').style.display = 'none';
};

window.guardarEditarEmpleado = async function(event) {
    event.preventDefault();
    
    const formEditar = document.getElementById('formularioEditarEmpleado');
    const btnSubmit = formEditar.querySelector('button[type="submit"]');
    
    const textoOriginal = btnSubmit.textContent;
    btnSubmit.textContent = 'Actualizando...';
    btnSubmit.disabled = true;

    // Recolectamos los datos manualmente desde los inputs de edición
    const data = new URLSearchParams();
    data.append('accion', 'editar'); // Le decimos a Google que es una actualización
    data.append('dni', document.getElementById('editDni').value);
    data.append('codigo', document.getElementById('editCodigo').value);
    data.append('apellidos', document.getElementById('editApellidos').value);
    data.append('nombres', document.getElementById('editNombres').value);
    data.append('cargo', document.getElementById('editCargo').value);
    data.append('departamento', document.getElementById('editDepartamento').value);
    data.append('telefono', document.getElementById('editTelefono').value);
    data.append('email', document.getElementById('editEmail').value);
    data.append('tipoContrato', document.getElementById('editTipoContrato').value);
    data.append('estado', document.getElementById('editEstado').value);

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: data
        });

        if (response.ok) {
            alert('Datos del colaborador actualizados. Se envió una notificación por correo.');
            window.cerrarModalEditarEmpleado();
            await window.cargarEmpleadosDesdeSheet(); // Refrescamos la tabla
        } else {
            throw new Error('Error en el servidor de Google.');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al actualizar el empleado.');
    } finally {
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
    }
};
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
// 4. ZONA DE ROYSER - Formulario de Citas Inteligente 
// ==========================================

const DOCTORES_POR_ESPECIALIDAD = {
    "Medicina General":  ["Dr. Carlos Ruiz", "Dra. Elena Castro"],
    "Pediatría":         ["Dr. Luis Zapata", "Dra. Ana Silva"],
    "Cardiología":       ["Dr. Ricardo Pérez", "Dra. María Gómez"],
    "Neurología":        ["Dr. Héctor Villanueva", "Dra. Carmen Torres"],
    "Traumatología":     ["Dr. Miguel Ángeles", "Dra. Sandra Quispe"],
    "Oftalmología":      ["Dr. Roberto Flores", "Dra. Lucia Mendoza"],
    "Nefrología":        ["Dr. Alberto Salas", "Dra. Patricia Huanca"],
    "Psicología":        ["Ps. Andrea Vera", "Ps. David Morales"],
    "Urología":          ["Dr. Fernando Chávez"],
    "Cirugía":           ["Dr. Jesús Paredes", "Dra. Giovanna Ríos"]
};

// --- Mostrar/ocultar paneles ---
function mostrarPanel() {
    var val = document.getElementById('servicio-select').value;
    document.querySelectorAll('.panel').forEach(function(p) {
        p.classList.remove('active');
    });
    if (val) document.getElementById('panel-' + val).classList.add('active');
}

// --- Listas en cascada: Especialidad → Doctores ---
const selectEspecialidad = document.getElementById('select-especialidad');
const selectDoctor = document.getElementById('select-doctor');

if (selectEspecialidad && selectDoctor) {
    selectEspecialidad.addEventListener('change', function () {
        const esp = this.value;
        selectDoctor.innerHTML = '';
        if (!esp) {
            selectDoctor.innerHTML = '<option value="">-- Primero elige especialidad --</option>';
            return;
        }
        const opDefault = document.createElement('option');
        opDefault.value = '';
        opDefault.textContent = '-- Selecciona un doctor --';
        selectDoctor.appendChild(opDefault);
        (DOCTORES_POR_ESPECIALIDAD[esp] || []).forEach(function(nombre) {
            const op = document.createElement('option');
            op.value = nombre;
            op.textContent = nombre;
            selectDoctor.appendChild(op);
        });
    });
}

// --- Validación DNI en tiempo real ---
const dniInput   = document.getElementById('dni-paciente');
const errorDni   = document.getElementById('error-dni');
const dniCounter = document.getElementById('dni-counter');

function validarDni() {
    if (!dniInput) return false;
    const valor = dniInput.value;
    const esValido = /^\d{8}$/.test(valor);
    if (dniCounter) dniCounter.textContent = valor.length + '/8 dígitos';
    if (!esValido && valor.length > 0) {
        dniInput.style.border = '2px solid #e53e3e';
        if (errorDni) errorDni.style.display = 'block';
    } else {
        dniInput.style.border = valor.length === 8 ? '2px solid #22c55e' : '';
        if (errorDni) errorDni.style.display = 'none';
    }
    return esValido;
}

if (dniInput) {
    dniInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '');
        validarDni();
        actualizarBoton();
    });
}

// --- Mejora 2: Validar teléfono (9 dígitos peruano) ---
const telefonoInput = document.getElementById('telefono-paciente');
const errorTel      = document.getElementById('error-tel');

function validarTelefono() {
    if (!telefonoInput) return true;
    const valor = telefonoInput.value.replace(/\D/g, '');
    telefonoInput.value = valor;
    const esValido = /^\d{9}$/.test(valor);
    if (!esValido && valor.length > 0) {
        telefonoInput.style.border = '2px solid #e53e3e';
        if (errorTel) errorTel.style.display = 'block';
    } else {
        telefonoInput.style.border = valor.length === 9 ? '2px solid #22c55e' : '';
        if (errorTel) errorTel.style.display = 'none';
    }
    return esValido;
}

if (telefonoInput) {
    telefonoInput.addEventListener('input', function() {
        validarTelefono();
        actualizarBoton();
    });
}

// --- Mejora 3: Validar que la fecha no sea en el pasado ---
const fechaInput = document.getElementById('fecha-cita');
const errorFecha = document.getElementById('error-fecha');

function validarFecha() {
    if (!fechaInput || !fechaInput.value) return false;
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const elegida = new Date(fechaInput.value + 'T00:00:00');
    const esValida = elegida >= hoy;
    if (!esValida) {
        fechaInput.style.border = '2px solid #e53e3e';
        if (errorFecha) errorFecha.style.display = 'block';
    } else {
        fechaInput.style.border = '2px solid #22c55e';
        if (errorFecha) errorFecha.style.display = 'none';
    }
    return esValida;
}

if (fechaInput) {
    // Setear mínimo como hoy
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.setAttribute('min', hoy);
    fechaInput.addEventListener('change', function() {
        validarFecha();
        actualizarBoton();
    });
}

// --- Mejora 4: Deshabilitar botón si formulario incompleto ---
const btnEnviar = document.getElementById('btn-enviar-cita');

function actualizarBoton() {
    if (!btnEnviar) return;
    const nombre    = document.getElementById('nombre-paciente');
    const completo  = nombre && nombre.value.trim().length > 2
                   && dniInput && /^\d{8}$/.test(dniInput.value)
                   && selectEspecialidad && selectEspecialidad.value
                   && selectDoctor && selectDoctor.value
                   && fechaInput && fechaInput.value;
    btnEnviar.disabled = !completo;
    btnEnviar.style.opacity = completo ? '1' : '0.5';
    btnEnviar.style.cursor  = completo ? 'pointer' : 'not-allowed';
}

if (document.getElementById('nombre-paciente')) {
    document.getElementById('nombre-paciente').addEventListener('input', actualizarBoton);
}
if (selectEspecialidad) selectEspecialidad.addEventListener('change', actualizarBoton);
if (selectDoctor)       selectDoctor.addEventListener('change', actualizarBoton);

// Inicializar botón deshabilitado
actualizarBoton();

// --- Envío con preventDefault y alerta global ---
const formCita = document.getElementById('form-cita');

if (formCita) {
    formCita.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre    = document.getElementById('nombre-paciente').value.trim();
        const esp       = selectEspecialidad ? selectEspecialidad.value : '';
        const doctor    = selectDoctor ? selectDoctor.value : '';
        const fecha     = fechaInput ? fechaInput.value : '';
        const dniOk     = validarDni();
        const telOk     = validarTelefono();
        const fechaOk   = validarFecha();

        if (!nombre || !esp || !doctor || !fecha) {
            mostrarNotificacion('Campos incompletos', 'Por favor, completa todos los campos antes de enviar.', 'warning');
            return;
        }
        if (!dniOk) {
            mostrarNotificacion('DNI inválido', 'El DNI debe tener exactamente 8 dígitos numéricos.', 'error');
            dniInput.focus();
            return;
        }
        if (!telOk) {
            mostrarNotificacion('Teléfono inválido', 'El teléfono debe tener 9 dígitos (formato peruano).', 'error');
            telefonoInput.focus();
            return;
        }
        if (!fechaOk) {
            mostrarNotificacion('Fecha inválida', 'La fecha de cita no puede ser en el pasado.', 'error');
            fechaInput.focus();
            return;
        }

        mostrarNotificacion(
            '✅ ¡Solicitud enviada!',
            'Hola ' + nombre + ', tu cita con ' + doctor + ' en ' + esp + ' para el ' + fecha + ' fue registrada. Te contactaremos pronto.',
            'success'
        );

        formCita.reset();
        if (selectDoctor) selectDoctor.innerHTML = '<option value="">-- Primero elige especialidad --</option>';
        if (errorDni)   errorDni.style.display = 'none';
        if (errorTel)   errorTel.style.display = 'none';
        if (errorFecha) errorFecha.style.display = 'none';
        if (dniCounter) dniCounter.textContent = '0/8 dígitos';
        [dniInput, telefonoInput, fechaInput].forEach(el => { if(el) el.style.border = ''; });
        actualizarBoton();
    });
}

// ==========================================
// CHAT FLOTANTE 
// ==========================================

const OPENAI_API_KEY = 'PEGA_TU_KEY_AQUI'; // ← Pega aquí tu API key de OpenAI

const SYSTEM_PROMPT = `Eres el asistente virtual oficial del Hospital Regional Eleazar Guzmán Barrón (HEGB), ubicado en Av. Brasil S/N, Urb. Santa Cristina, Nuevo Chimbote, Áncash, Perú.
Responde de forma amable, clara y breve. Solo responde preguntas relacionadas al hospital.
Datos clave:
- Emergencias: 946 249 521 (24 horas, todos los días)
- Central: 934 290 087
- Fonocitas: 934 274 553
- Email: mesadepartes@hegb.gob.pe
- Facebook: @hregb
- Horarios: Emergencias 24h | Consulta externa Lun-Sáb 7:00-13:00 | Citas telefónicas 7:00-11:00
- Especialidades: Pediatría, Cardiología, Neurología, Traumatología, Medicina General, Oftalmología, Nefrología, Psicología, Urología, Cirugía.
- Para citas: formulario en la web o llamar al Fonocitas.
Si preguntan algo fuera del hospital, indica amablemente que solo puedes ayudar con temas del HEGB.`;

let historialChat = [];

function toggleChat() {
    const w = document.getElementById('chat-window');
    w.classList.toggle('open');
    const badge = document.querySelector('.chat-badge');
    if (badge) badge.style.display = 'none';
}

function preguntaRapida(texto) {
    document.getElementById('chat-input').value = texto;
    enviarMensajeChat();
}

async function enviarMensajeChat() {
    const input = document.getElementById('chat-input');
    const texto = input.value.trim();
    if (!texto) return;
    input.value = '';

    const msgs = document.getElementById('chat-messages');

    const userDiv = document.createElement('div');
    userDiv.className = 'msg-chat user-msg';
    userDiv.textContent = texto;
    msgs.appendChild(userDiv);

    const typing = document.createElement('div');
    typing.className = 'msg-chat bot-msg typing-msg';
    typing.id = 'typing-indicator';
    typing.textContent = 'Escribiendo...';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;

    historialChat.push({ role: 'user', content: texto });

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...historialChat
                ],
                max_tokens: 300,
                temperature: 0.7
            })
        });

        const data = await response.json();
        const respuesta = data.choices[0].message.content;
        historialChat.push({ role: 'assistant', content: respuesta });

        document.getElementById('typing-indicator').remove();
        const botDiv = document.createElement('div');
        botDiv.className = 'msg-chat bot-msg';
        botDiv.textContent = respuesta;
        msgs.appendChild(botDiv);

    } catch (error) {
        document.getElementById('typing-indicator').remove();
        const errDiv = document.createElement('div');
        errDiv.className = 'msg-chat bot-msg';
        errDiv.textContent = 'Lo siento, hubo un error. Por favor llama al 934 290 087.';
        msgs.appendChild(errDiv);
    }

    msgs.scrollTop = msgs.scrollHeight;
}
// --- Panel Consultar ---
const dniConsultar = document.getElementById('dni-consultar');
const fechaConsultar = document.getElementById('fecha-consultar');

if (dniConsultar) {
    dniConsultar.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
}

if (fechaConsultar) {
    const hoy = new Date().toISOString().split('T')[0];
    fechaConsultar.setAttribute('max', hoy);
}

function enviarConsulta() {
    const dni   = document.getElementById('dni-consultar').value.trim();
    const fecha = document.getElementById('fecha-consultar').value;

    if (!dni || !fecha) {
        mostrarNotificacion('Campos incompletos o incorrectos', 'Por favor ingresa tu DNI y la fecha de tu cita.', 'warning');
        return;
    }

    if (!/^\d{8}$/.test(dni)) {
        mostrarNotificacion('DNI inválido', 'El DNI debe tener exactamente 8 dígitos numéricos.', 'error');
        return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const elegida = new Date(fecha + 'T00:00:00');

    if (elegida > hoy) {
        mostrarNotificacion('Fecha inválida', 'La fecha no puede ser futura. Ingresa la fecha real de tu cita.', 'error');
        return;
    }

    mostrarNotificacion(
        '🔍 Búsqueda realizada',
        'Cita encontrada para el DNI ' + dni + '. Revisa tu correo o llama al 934 274 553.',
        'success'
    );

    document.getElementById('dni-consultar').value = '';
    document.getElementById('fecha-consultar').value = '';
}
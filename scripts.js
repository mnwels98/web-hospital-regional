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

// ==========================================
// CHAT FLOTANTE - ZONA ROYSER
// ==========================================

const SYSTEM_PROMPT = `Eres el asistente virtual oficial del Hospital Regional Eleazar Guzmán Barrón (HEGB), ubicado en Av. Brasil S/N, Urb. Santa Cristina, Nuevo Chimbote, Áncash, Perú.`;

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
    const textoLower = texto.toLowerCase();
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

    await new Promise(r => setTimeout(r, 900));

    document.getElementById('typing-indicator').remove();

    const botDiv = document.createElement('div');
    botDiv.className = 'msg-chat bot-msg';
    botDiv.textContent = obtenerRespuesta(textoLower);
    msgs.appendChild(botDiv);
    msgs.scrollTop = msgs.scrollHeight;
}

function obtenerRespuesta(texto) {

    if (texto.includes('horario') || texto.includes('hora') || texto.includes('atiende') || 
        texto.includes('abierto') || texto.includes('turno') || texto.includes('cuándo') || 
        texto.includes('cuando') || texto.includes('qué días') || texto.includes('que dias')) {
        return '🕐 Nuestros horarios son:\n• Emergencias: 24h todos los días\n• Consulta externa: 7:00–13:00 Lun a Sáb\n• Citas telefónicas: 7:00–11:00 Lun a Sáb';
    }

    if (texto.includes('especialidad') || texto.includes('servicio') || texto.includes('área') || 
        texto.includes('area') || texto.includes('atención') || texto.includes('atencion') || 
        texto.includes('tienen') || texto.includes('ofrecen') || texto.includes('disponible')) {
        return '🏥 Contamos con: Pediatría, Cardiología, Neurología, Traumatología, Medicina General, Oftalmología, Nefrología, Psicología, Urología y Cirugía.';
    }

    if (texto.includes('cita') || texto.includes('reserva') || texto.includes('agendar') || 
        texto.includes('programar') || texto.includes('solicitar') || texto.includes('quiero atención') || 
        texto.includes('quiero atencion') || texto.includes('consulta')) {
        return '📅 Puedes sacar tu cita:\n• Llenando el formulario en esta página\n• Llamando al Fonocitas: 934 274 553\n• Horario de citas: Lun a Sáb 7:00–11:00';
    }

    if (texto.includes('direcci') || texto.includes('donde') || texto.includes('ubicaci') || 
        texto.includes('llegar') || texto.includes('queda') || texto.includes('encuentran') || 
        texto.includes('lugar') || texto.includes('mapa')) {
        return '📍 Estamos en Av. Brasil S/N, Urb. Santa Cristina, Nuevo Chimbote, Áncash.';
    }

    if (texto.includes('emergencia') || texto.includes('urgencia') || texto.includes('urgente') || 
        texto.includes('accidente') || texto.includes('grave') || texto.includes('crítico') || 
        texto.includes('critico') || texto.includes('auxilio')) {
        return '🚨 Para emergencias llama al: 946 249 521\nEstamos disponibles las 24 horas, todos los días.';
    }

    if (texto.includes('teléfono') || texto.includes('telefono') || texto.includes('llamar') || 
        texto.includes('contacto') || texto.includes('número') || texto.includes('numero') || 
        texto.includes('comunicar') || texto.includes('hablar')) {
        return '📞 Nuestros teléfonos:\n• Central: 934 290 087\n• Emergencias: 946 249 521\n• Fonocitas: 934 274 553';
    }

    if (texto.includes('correo') || texto.includes('email') || texto.includes('mail') || 
        texto.includes('mensaje') || texto.includes('escribir') || texto.includes('mesa de partes')) {
        return '✉️ Correo institucional: mesadepartes@hegb.gob.pe\nTambién puedes usar nuestra Mesa de Partes Virtual desde esta página.';
    }

    if (texto.includes('doctor') || texto.includes('médico') || texto.includes('medico') || 
        texto.includes('especialista') || texto.includes('profesional') || texto.includes('quién atiende') || 
        texto.includes('quien atiende')) {
        return '👨‍⚕️ Contamos con médicos especializados en todas las áreas. Para saber la disponibilidad llama al 934 290 087 o saca tu cita desde el formulario.';
    }

    if (texto.includes('precio') || texto.includes('costo') || texto.includes('pagar') || 
        texto.includes('tarifa') || texto.includes('cobran') || texto.includes('cuánto') || 
        texto.includes('cuanto') || texto.includes('gratuito') || texto.includes('gratis')) {
        return '💰 Para información sobre tarifas, comunícate al 934 290 087 o visítanos en Av. Brasil S/N, Nuevo Chimbote.';
    }

    if (texto.includes('laboratorio') || texto.includes('análisis') || texto.includes('analisis') || 
        texto.includes('examen') || texto.includes('sangre') || texto.includes('muestra') || 
        texto.includes('resultado') || texto.includes('prueba')) {
        return '🔬 Nuestro Laboratorio Clínico ofrece análisis precisos y rápidos.\n• Hematología, bioquímica y biología molecular\n• Entrega de resultados online\n• Para más info llama al 934 290 087';
    }

    if (texto.includes('niño') || texto.includes('nino') || texto.includes('bebe') || 
        texto.includes('bebé') || texto.includes('pediatr') || texto.includes('infant') || 
        texto.includes('hijo') || texto.includes('vacuna')) {
        return '🩺 Nuestra área de Pediatría atiende desde recién nacidos hasta adolescentes.\n• Control de niño sano\n• Vacunación\n• Horario: Lun a Sáb 7:00–13:00\nSaca tu cita llamando al 934 274 553.';
    }

    if (texto.includes('corazón') || texto.includes('corazon') || texto.includes('cardiolog') || 
        texto.includes('presión') || texto.includes('presion') || texto.includes('pecho') || 
        texto.includes('infarto') || texto.includes('cardiovascular')) {
        return '🫀 Nuestra área de Cardiología ofrece:\n• Electrocardiograma\n• Ecocardiografía 3D\n• Prevención y tratamiento cardiovascular\nSaca tu cita llamando al 934 274 553.';
    }

    if (texto.includes('cabeza') || texto.includes('neurolog') || texto.includes('cerebro') || 
        texto.includes('migraña') || texto.includes('migrana') || texto.includes('epilepsia') || 
        texto.includes('nervio')) {
        return '🧠 Nuestra área de Neurología trata:\n• Migrañas y cefaleas\n• Epilepsia\n• Enfermedades degenerativas\nSaca tu cita llamando al 934 274 553.';
    }

    if (texto.includes('hueso') || texto.includes('fractura') || texto.includes('traumatolog') || 
        texto.includes('articulacion') || texto.includes('articulación') || texto.includes('músculo') || 
        texto.includes('musculo') || texto.includes('lesión') || texto.includes('lesion')) {
        return '🦴 Nuestra área de Traumatología atiende:\n• Fracturas y lesiones óseas\n• Rehabilitación física\n• Medicina deportiva\nSaca tu cita llamando al 934 274 553.';
    }

    if (texto.includes('histor') || texto.includes('expediente') || texto.includes('registro') || 
        texto.includes('documento') || texto.includes('archivo')) {
        return '📋 Para solicitar tu historia clínica o documentos médicos acércate a nuestra Mesa de Partes o escríbenos a mesadepartes@hegb.gob.pe';
    }

    if (texto.includes('visita') || texto.includes('hospitaliz') || texto.includes('internado') || 
        texto.includes('internamiento') || texto.includes('piso') || texto.includes('cama')) {
        return '🏨 Para información sobre visitas a pacientes hospitalizados llama al 934 290 087 y te daremos los horarios y requisitos de visita.';
    }

    if (texto.includes('estacion') || texto.includes('parking') || texto.includes('carro') || 
        texto.includes('auto') || texto.includes('vehículo') || texto.includes('vehiculo')) {
        return '🚗 Contamos con zona de estacionamiento dentro del hospital. Para más información sobre el acceso llama al 934 290 087.';
    }

    if (texto.includes('hola') || texto.includes('buenos') || texto.includes('buenas') || 
        texto.includes('saludos') || texto.includes('buen día') || texto.includes('buen dia')) {
        return '👋 ¡Hola! Bienvenido al Hospital Regional EGB. ¿En qué puedo ayudarte hoy?';
    }

    if (texto.includes('gracias') || texto.includes('muchas gracias') || texto.includes('perfecto') || 
        texto.includes('excelente') || texto.includes('genial')) {
        return '😊 ¡Con gusto! Recuerda que estamos aquí para cuidar tu salud. ¿Hay algo más en lo que pueda ayudarte?';
    }

    if (texto.includes('adios') || texto.includes('adiós') || texto.includes('hasta luego') || 
        texto.includes('chau') || texto.includes('bye')) {
        return '👋 ¡Hasta luego! Que tengas un excelente día. Recuerda que estamos aquí para cuidar tu salud.';
    }

    return '🤔 No entendí tu consulta. Puedes preguntarme sobre horarios, especialidades, citas, dirección, teléfonos o laboratorio. También puedes llamarnos al 934 290 087.';
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
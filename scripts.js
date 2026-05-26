// =========================================================
// SCRIPT GENERAL DE LA PÁGINA - HOSPITAL REGIONAL
// Versión sin conflictos - Todas las ramas unificadas
// =========================================================

// ==========================================
// 1. BASE DE DATOS PRINCIPAL
// ==========================================
const HOSPITAL_DATA = {
    especialidades: [
        { id: 1,  nombre: "Cardiología",                    descripcion: "Prevención, diagnóstico y tratamiento de enfermedades del corazón y presión arterial.",        icono: "❤️",  sintomas: ["corazon","pecho","presion","taquicardia","infarto","palpitaciones","fatiga","dolor de pecho","soplo","hipertension","arritmia","agitacion"] },
        { id: 2,  nombre: "Endocrinología",                 descripcion: "Estudio y tratamiento del sistema endocrino, hormonas y metabolismo.",                          icono: "⚖️",  sintomas: ["diabetes","tiroides","hormonas","obesidad","peso","bajar de peso","colesterol","trigliceridos","crecimiento"] },
        { id: 3,  nombre: "Medicina Interna",               descripcion: "Atención integral del adulto, diagnóstico de enfermedades complejas y crónicas.",               icono: "🩺",  sintomas: ["fiebre","diabetes","hipertension","chequeo","dolor general","infeccion","adulto","cronico","malestar general","fatiga"] },
        { id: 4,  nombre: "Neumología",                     descripcion: "Especialistas en enfermedades del sistema respiratorio y los pulmones.",                        icono: "🫁",  sintomas: ["pulmon","asma","tos","resfriado","gripe","ahogo","flema","bronquios","neumonia","bronquitis","respirar","pecho congestionado","silbido de pecho"] },
        { id: 5,  nombre: "Neurología",                     descripcion: "Tratamiento no quirúrgico de trastornos del sistema nervioso y el cerebro.",                   icono: "🧠",  sintomas: ["cerebro","migraña","dolor de cabeza","paralisis","convulsion","mareo","olvido","nervios","derrame","epilepsia","adormecimiento","tics"] },
        { id: 6,  nombre: "Neurocirugía",                   descripcion: "Cirugías de alta complejidad en el cerebro, médula espinal y columna vertebral.",              icono: "🔬",  sintomas: ["cerebro","operar cabeza","tumor cerebral","columna","hernia discal","golpe en la cabeza","traumatismo craneal","medula"] },
        { id: 7,  nombre: "Patología Clínica",              descripcion: "Análisis e interpretación de muestras biológicas en laboratorio para el diagnóstico.",         icono: "🧪",  sintomas: ["analisis de sangre","laboratorio","muestras","orina","hemograma","perfil hepatico","examen","glucosa"] },
        { id: 8,  nombre: "Anátomo Patología",              descripcion: "Estudio celular de biopsias, tejidos y piezas quirúrgicas para descartar malignidad.",          icono: "🔬",  sintomas: ["biopsia","tumores","tejido","analisis de tejido","patologo","celulas","necropsia","descarte de cancer"] },
        { id: 9,  nombre: "Dermatología",                   descripcion: "Diagnóstico y tratamiento de afecciones de la piel, cabello y uñas.",                          icono: "✨",  sintomas: ["piel","manchas","acne","granitos","alergia","ronchas","hongo","caspa","caida de cabello","comezon","picazon","quemadura","uñero","lunares"] },
        { id: 10, nombre: "Psiquiatría",                    descripcion: "Evaluación, diagnóstico y tratamiento médico de trastornos de la salud mental.",                icono: "🧘",  sintomas: ["ansiedad","depresion","estres","sueño","insomnio","animo","panico","mente","psicosis","tristeza","bipolaridad","alucinaciones"] },
        { id: 11, nombre: "Pediatría",                      descripcion: "Atención médica integral y control del desarrollo para bebés, niños y adolescentes.",           icono: "👶",  sintomas: ["nino","bebe","fiebre","vacunas","crecimiento","tos","vomito","pediatra","desarrollo","infantil","lactante"] },
        { id: 12, nombre: "Neonatología",                   descripcion: "Cuidado especializado y crítico del recién nacido y bebés prematuros.",                        icono: "🍼",  sintomas: ["recien nacido","prematuro","incubadora","bebe amarillo","ictericia","parto complicado","cordon","lactancia materna"] },
        { id: 13, nombre: "Gastroenterología Pediátrica",   descripcion: "Enfermedades del aparato digestivo exclusivas para niños y lactantes.",                        icono: "👦",  sintomas: ["niño","bebe","dolor de estomago niño","colicos","estreñimiento infantil","reflujo bebe","diarrea niño","intolerancia lactosa"] },
        { id: 14, nombre: "Traumatología",                  descripcion: "Especialistas en lesiones del aparato locomotor, huesos, articulaciones y fracturas.",          icono: "🦴",  sintomas: ["hueso","fractura","esguince","dolor de espalda","caida","rodilla","golpe","columna","yeso","articulacion","dislocacion"] },
        { id: 15, nombre: "Reumatología",                   descripcion: "Tratamiento de enfermedades inflamatorias crónicas que afectan articulaciones y músculos.",     icono: "🤝",  sintomas: ["artritis","artrosis","reumas","dolor de huesos","dolor de manos","hinchazon articulaciones","lupus","deformidad"] },
        { id: 16, nombre: "Radiología",                     descripcion: "Diagnóstico mediante imágenes médicas de rayos X, ecografías y tomografías.",                  icono: "🩻",  sintomas: ["radiografia","rayos x","ecografia","tomografia","resonancia","placa","imagenes por diagnostico"] },
        { id: 17, nombre: "Cirugía General",                descripcion: "Tratamiento quirúrgico de enfermedades abdominales, hernias y tejidos blandos.",               icono: "🔪",  sintomas: ["operacion","apendice","hernia","vesicula","dolor abdominal agudo","cirujano","quiste","lipoma"] },
        { id: 18, nombre: "Cirugía Pediátrica",             descripcion: "Intervenciones quirúrgicas especializadas para corregir anomalías en niños.",                  icono: "🧒",  sintomas: ["operacion niño","hernia infantil","apendicitis niño","frenillo","testiculo no descendido","malformacion"] },
        { id: 19, nombre: "Cirugía Plástica",               descripcion: "Cirugía reconstructiva para quemaduras, cicatrices, anomalías y estética.",                   icono: "🩹",  sintomas: ["quemadura","cicatriz","reconstruccion","labio leporino","injerto","cirugia reconstructiva"] },
        { id: 20, nombre: "Cirugía Oncológica",             descripcion: "Tratamiento quirúrgico para la remoción y extirpación de tumores cancerígenos.",               icono: "🎗️", sintomas: ["tumor","cancer","extirpar","nodulo","masa en el cuerpo","quiste sospechoso","operar tumor"] },
        { id: 21, nombre: "Ginecología y Obstetricia",      descripcion: "Cuidado integral de la salud de la mujer, control del embarazo y parto.",                      icono: "🤰",  sintomas: ["embarazo","mujer","parto","control","utero","menstruacion","ovarios","gestante","quistes","flujo","cesarea"] },
        { id: 22, nombre: "Oftalmología",                   descripcion: "Cuidado de la visión, medida de la vista y tratamiento de enfermedades oculares.",             icono: "👁️", sintomas: ["ojos","vista","lentes","borroso","ceguera","medida","miopia","catarata","ardor","conjuntivitis"] },
        { id: 23, nombre: "Otorrinolaringología",           descripcion: "Especialistas en afecciones del oído, la nariz y la garganta.",                                icono: "👂",  sintomas: ["oido","nariz","garganta","dolor de garganta","ronquera","amigdalas","sordera","zumbido","gripe","resfriado","sinusitis"] },
        { id: 24, nombre: "Urología",                       descripcion: "Atención del sistema urinario general y del aparato reproductor masculino.",                   icono: "💧",  sintomas: ["orina","riñon","prostata","vejiga","calculos","dolor al orinar","varon","hombre","testiculo","infeccion urinaria"] },
        { id: 25, nombre: "Anestesiología",                 descripcion: "Cuidado, sedación y alivio del dolor antes, durante y después de cirugías.",                  icono: "😴",  sintomas: ["anestesia","operacion dolor","bloqueo","sedacion","preoperatorio","calmar dolor"] },
        { id: 26, nombre: "Odontoestomatología",            descripcion: "Salud oral integral, tratamiento de dientes, encías y afecciones bucales.",                    icono: "🦷",  sintomas: ["dientes","muela","dolor de muela","caries","curacion","encias","brackets","ortodoncia","extraccion"] },
        { id: 27, nombre: "Odontoestomatología Pediátrica", descripcion: "Cuidado dental especializado exclusivo para niños (Odontopediatría).",                         icono: "🦁",  sintomas: ["diente niño","muela niño","caries infantil","fluorización","dentista niños"] },
        { id: 28, nombre: "Nefrología",                     descripcion: "Prevención, diagnóstico y tratamiento de enfermedades renales y diálisis.",                    icono: "🧼",  sintomas: ["riñon","insuficiencia renal","dialisis","retencion de liquidos","orina con sangre","creatinina alta"] },
        { id: 29, nombre: "Cirugía de Tórax y Cardiovascular", descripcion: "Cirugías del sistema respiratorio, caja torácica, venas, arterias y el corazón.",          icono: "🫀",  sintomas: ["varices","operacion pulmon","tomas toracicas","arterias tapadas","bypass","aneurisma","venas"] },
        { id: 30, nombre: "Oncología Médica",               descripcion: "Tratamiento sistémico del cáncer mediante quimioterapia e inmunoterapia.",                     icono: "🎗️", sintomas: ["cancer","quimioterapia","tumor maligno","carcinoma","leucemia","infusion oncologica"] },
        { id: 31, nombre: "Gastroenterología",              descripcion: "Especialistas en enfermedades del aparato digestivo, estómago e intestinos para adultos.",     icono: "🤢",  sintomas: ["estomago","gastritis","dolor de panza","dolor de barriga","vomito","diarrea","acidez","reflujo","colon","higado","gases","indigestion"] }
    ]
};

// ==========================================
// 2. DOCTORES POR ESPECIALIDAD (Formulario de Citas)
// ==========================================
const DOCTORES_POR_ESPECIALIDAD = {
    "Medicina General":  ["Dr. Carlos Ruiz",       "Dra. Elena Castro"],
    "Pediatría":         ["Dr. Luis Zapata",        "Dra. Ana Silva"],
    "Cardiología":       ["Dr. Ricardo Pérez",      "Dra. María Gómez"],
    "Neurología":        ["Dr. Héctor Villanueva",  "Dra. Carmen Torres"],
    "Traumatología":     ["Dr. Miguel Ángeles",     "Dra. Sandra Quispe"],
    "Oftalmología":      ["Dr. Roberto Flores",     "Dra. Lucia Mendoza"],
    "Nefrología":        ["Dr. Alberto Salas",      "Dra. Patricia Huanca"],
    "Psicología":        ["Ps. Andrea Vera",        "Ps. David Morales"],
    "Urología":          ["Dr. Fernando Chávez"],
    "Cirugía":           ["Dr. Jesús Paredes",      "Dra. Giovanna Ríos"]
};

// Palabras a ignorar en el buscador
const STOP_WORDS = ["de","del","el","la","los","las","un","una","con","en","por","para","me","duele","tengo","dolor","siento","fuerte","mucho","mi","mis","ella"];

// ==========================================
// 3. SISTEMA DE NOTIFICACIONES GLOBAL (SweetAlert2)
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
// 4. EVENTOS AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener("DOMContentLoaded", function () {

    // --- A) Año actual en el Footer ---
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- B) Animaciones de scroll (Fade-In) ---
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

    // --- C) Modal Institucional "Sobre Nosotros" (Eddy) ---
    const modalSobre    = document.getElementById("modal-sobre");
    const btnSobre      = document.getElementById("btn-modal-sobre");
    const closeSobreBtn = document.getElementById("close-sobre-btn");

    if (btnSobre && modalSobre && closeSobreBtn) {
        btnSobre.addEventListener("click", (e) => {
            e.preventDefault();
            modalSobre.classList.add("active");
        });
        closeSobreBtn.addEventListener("click", () => {
            modalSobre.classList.remove("active");
        });
        modalSobre.addEventListener("click", (e) => {
            if (e.target === modalSobre) modalSobre.classList.remove("active");
        });
    }

    // --- D) Modales institucionales del desplegable Nosotros ---
    const modalResena = document.getElementById("modal-resena");
    const btnResena = document.getElementById("btn-modal-resena");
    const closeResenaBtn = document.getElementById("close-resena-btn");

    if (btnResena && modalResena && closeResenaBtn) {
        btnResena.addEventListener("click", (e) => {
            e.preventDefault();
            modalResena.classList.add("active");
        });
        closeResenaBtn.addEventListener("click", () => modalResena.classList.remove("active"));
        modalResena.addEventListener("click", (e) => {
            if (e.target === modalResena) modalResena.classList.remove("active");
        });
    }

    const modalMision = document.getElementById("modal-mision");
    const btnMision = document.getElementById("btn-modal-mision");
    const closeMisionBtn = document.getElementById("close-mision-btn");

    if (btnMision && modalMision && closeMisionBtn) {
        btnMision.addEventListener("click", (e) => {
            e.preventDefault();
            modalMision.classList.add("active");
        });
        closeMisionBtn.addEventListener("click", () => modalMision.classList.remove("active"));
        modalMision.addEventListener("click", (e) => {
            if (e.target === modalMision) modalMision.classList.remove("active");
        });
    }

    const modalDirectivos = document.getElementById("modal-directivos");
    const btnDirectivos = document.getElementById("btn-modal-directivos");
    const closeDirectivosBtn = document.getElementById("close-directivos-btn");

    if (btnDirectivos && modalDirectivos && closeDirectivosBtn) {
        btnDirectivos.addEventListener("click", (e) => {
            e.preventDefault();
            modalDirectivos.classList.add("active");

            modalDirectivos.querySelectorAll('.directivos-card').forEach((card, index) => {
                card.classList.add('fade-section');
                card.style.transitionDelay = `${index * 70}ms`;
                observer.observe(card);
                requestAnimationFrame(() => card.classList.add('visible'));
            });
        });
        closeDirectivosBtn.addEventListener("click", () => modalDirectivos.classList.remove("active"));
        modalDirectivos.addEventListener("click", (e) => {
            if (e.target === modalDirectivos) modalDirectivos.classList.remove("active");
        });
    }

    const modalOrganigrama = document.getElementById("modal-organigrama");
    const btnOrganigrama = document.getElementById("btn-modal-organigrama");
    const closeOrganigramaBtn = document.getElementById("close-organigrama-btn");

    if (btnOrganigrama && modalOrganigrama && closeOrganigramaBtn) {
        btnOrganigrama.addEventListener("click", (e) => {
            e.preventDefault();
            modalOrganigrama.classList.add("active");
        });
        closeOrganigramaBtn.addEventListener("click", () => modalOrganigrama.classList.remove("active"));
        modalOrganigrama.addEventListener("click", (e) => {
            if (e.target === modalOrganigrama) modalOrganigrama.classList.remove("active");
        });
    }

    const modalDirectorio = document.getElementById("modal-directorio");
    const btnDirectorio = document.getElementById("btn-modal-directorio");
    const closeDirectorioBtn = document.getElementById("close-directorio-btn");

    if (btnDirectorio && modalDirectorio && closeDirectorioBtn) {
        btnDirectorio.addEventListener("click", (e) => {
            e.preventDefault();
            modalDirectorio.classList.add("active");
        });
        closeDirectorioBtn.addEventListener("click", () => modalDirectorio.classList.remove("active"));
        modalDirectorio.addEventListener("click", (e) => {
            if (e.target === modalDirectorio) modalDirectorio.classList.remove("active");
        });
    }

    // --- E) Buscador Interactivo de Especialidades y Modal de Citas (Eddy) ---
    const searchInput        = document.getElementById("search-input");
    const specialtiesGrid    = document.getElementById("specialties-grid");
    const searchModal        = document.getElementById("search-modal");
    const appointmentModal   = document.getElementById("appointment-modal");
    const openSearchBtn      = document.getElementById("open-search-btn");
    const closeSearchBtn     = document.getElementById("close-search-btn");
    const closeAppointmentBtn = document.getElementById("close-appointment-btn");
    const appointmentForm    = document.getElementById("appointment-form");
    const selectedSpecialtyInput = document.getElementById("selected-specialty");

    if (openSearchBtn && closeSearchBtn && searchModal) {
        openSearchBtn.addEventListener("click", () => {
            searchModal.classList.add("active");
            searchInput.value = "";
            renderSpecialties(HOSPITAL_DATA.especialidades);
            setTimeout(() => searchInput.focus(), 100);
        });
        closeSearchBtn.addEventListener("click", () => searchModal.classList.remove("active"));
        searchModal.addEventListener("click", (e) => {
            if (e.target === searchModal) searchModal.classList.remove("active");
        });
    }

    if (closeAppointmentBtn && appointmentModal) {
        closeAppointmentBtn.addEventListener("click", () => appointmentModal.classList.remove("active"));
        appointmentModal.addEventListener("click", (e) => {
            if (e.target === appointmentModal) appointmentModal.classList.remove("active");
        });
    }

    function cleanText(text) {
        return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    function filterData(query) {
        const cleanQuery = cleanText(query);
        if (cleanQuery === "") {
            renderSpecialties(HOSPITAL_DATA.especialidades);
            return;
        }
        const searchTerms = cleanQuery.split(/\s+/).filter(w => !STOP_WORDS.includes(w) && w.length > 1);
        const finalTerms  = searchTerms.length > 0 ? searchTerms : [cleanQuery];

        const filtered = HOSPITAL_DATA.especialidades.filter(item => {
            const nombreLimpio = cleanText(item.nombre);
            return finalTerms.some(term =>
                nombreLimpio.includes(term) ||
                item.sintomas.some(sintoma => cleanText(sintoma).includes(term))
            );
        });
        renderSpecialties(filtered);
    }

    function renderSpecialties(list) {
        if (!specialtiesGrid) return;
        specialtiesGrid.innerHTML = "";
        if (list.length === 0) {
            specialtiesGrid.innerHTML = `<div class="no-results">🔍 No encontramos una coincidencia exacta. Prueba escribiendo palabras directas como "ojo", "garganta", "barriga", "fractura" o "niño".</div>`;
            return;
        }
        list.forEach(item => {
            const card = document.createElement("div");
            card.className = "card-specialty clickable-card";
            card.setAttribute("title", "Haz clic para solicitar una cita en esta especialidad");
            card.innerHTML = `
                <div class="icon-specialty">${item.icono}</div>
                <h4>${item.nombre}</h4>
                <p>${item.descripcion}</p>
                <div class="action-badge">📅 Solicitar Cita</div>
            `;
            card.addEventListener("click", () => {
                searchModal.classList.remove("active");
                if (selectedSpecialtyInput) selectedSpecialtyInput.value = item.nombre;
                appointmentModal.classList.add("active");
            });
            specialtiesGrid.appendChild(card);
        });
    }

    if (searchInput && specialtiesGrid) {
        searchInput.addEventListener("input", (e) => filterData(e.target.value));
    }

    if (appointmentForm) {
        appointmentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const paciente    = document.getElementById("patient-name").value;
            const especialidad = selectedSpecialtyInput ? selectedSpecialtyInput.value : '';
            mostrarNotificacion(
                '✅ ¡Solicitud enviada!',
                `Hola ${paciente}, tu cita en ${especialidad} fue registrada. Nos comunicaremos pronto.`,
                'success'
            );
            appointmentForm.reset();
            appointmentModal.classList.remove("active");
        });
    }
});

// ==========================================
// 5. FORMULARIO DE CITAS INTELIGENTE (Royser)
// ==========================================

// --- Mostrar/ocultar paneles de servicio ---
function mostrarPanel() {
    const val = document.getElementById('servicio-select').value;
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    if (val) document.getElementById('panel-' + val).classList.add('active');
}

// --- Lista en cascada: Especialidad → Doctores ---
const selectEspecialidad = document.getElementById('select-especialidad');
const selectDoctor       = document.getElementById('select-doctor');

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
        (DOCTORES_POR_ESPECIALIDAD[esp] || []).forEach(nombre => {
            const op = document.createElement('option');
            op.value = nombre;
            op.textContent = nombre;
            selectDoctor.appendChild(op);
        });
    });
}

// --- Validación DNI ---
const dniInput   = document.getElementById('dni-paciente');
const errorDni   = document.getElementById('error-dni');
const dniCounter = document.getElementById('dni-counter');

function validarDni() {
    if (!dniInput) return false;
    const valor    = dniInput.value;
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

// --- Validación Teléfono ---
const telefonoInput = document.getElementById('telefono-paciente');
const errorTel      = document.getElementById('error-tel');

function validarTelefono() {
    if (!telefonoInput) return true;
    const valor    = telefonoInput.value.replace(/\D/g, '');
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
    telefonoInput.addEventListener('input', function () {
        validarTelefono();
        actualizarBoton();
    });
}

// --- Validación Fecha ---
const fechaInput = document.getElementById('fecha-cita');
const errorFecha = document.getElementById('error-fecha');

function validarFecha() {
    if (!fechaInput || !fechaInput.value) return false;
    const hoy    = new Date(); hoy.setHours(0, 0, 0, 0);
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
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.setAttribute('min', hoy);
    fechaInput.addEventListener('change', function () {
        validarFecha();
        actualizarBoton();
    });
}

// --- Botón enviar: habilitar solo si todo está completo ---
const btnEnviar = document.getElementById('btn-enviar-cita');

function actualizarBoton() {
    if (!btnEnviar) return;
    const nombre   = document.getElementById('nombre-paciente');
    const completo = nombre && nombre.value.trim().length > 2
                  && dniInput && /^\d{8}$/.test(dniInput.value)
                  && selectEspecialidad && selectEspecialidad.value
                  && selectDoctor && selectDoctor.value
                  && fechaInput && fechaInput.value;
    btnEnviar.disabled      = !completo;
    btnEnviar.style.opacity = completo ? '1' : '0.5';
    btnEnviar.style.cursor  = completo ? 'pointer' : 'not-allowed';
}

if (document.getElementById('nombre-paciente')) {
    document.getElementById('nombre-paciente').addEventListener('input', actualizarBoton);
}
if (selectEspecialidad) selectEspecialidad.addEventListener('change', actualizarBoton);
if (selectDoctor)       selectDoctor.addEventListener('change', actualizarBoton);

actualizarBoton();

// --- Envío del formulario de citas ---
const formCita = document.getElementById('form-cita');

if (formCita) {
    formCita.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre  = document.getElementById('nombre-paciente').value.trim();
        const esp     = selectEspecialidad ? selectEspecialidad.value : '';
        const doctor  = selectDoctor ? selectDoctor.value : '';
        const fecha   = fechaInput ? fechaInput.value : '';
        const dniOk   = validarDni();
        const telOk   = validarTelefono();
        const fechaOk = validarFecha();

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
            `Hola ${nombre}, tu cita con ${doctor} en ${esp} para el ${fecha} fue registrada. Te contactaremos pronto.`,
            'success'
        );

        formCita.reset();
        if (selectDoctor) selectDoctor.innerHTML = '<option value="">-- Primero elige especialidad --</option>';
        if (errorDni)   errorDni.style.display   = 'none';
        if (errorTel)   errorTel.style.display   = 'none';
        if (errorFecha) errorFecha.style.display = 'none';
        if (dniCounter) dniCounter.textContent   = '0/8 dígitos';
        [dniInput, telefonoInput, fechaInput].forEach(el => { if (el) el.style.border = ''; });
        actualizarBoton();
    });
}

// ==========================================
// 6. CHAT FLOTANTE
// ==========================================

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
    const input    = document.getElementById('chat-input');
    const texto    = input.value.trim();
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
        texto.includes('cuando') || texto.includes('qué días') || texto.includes('que dias'))
        return '🕐 Nuestros horarios son:\n• Emergencias: 24h todos los días\n• Consulta externa: 7:00–13:00 Lun a Sáb\n• Citas telefónicas: 7:00–11:00 Lun a Sáb';

    if (texto.includes('especialidad') || texto.includes('servicio') || texto.includes('área') ||
        texto.includes('area') || texto.includes('atención') || texto.includes('atencion') ||
        texto.includes('tienen') || texto.includes('ofrecen') || texto.includes('disponible'))
        return '🏥 Contamos con: Pediatría, Cardiología, Neurología, Traumatología, Medicina General, Oftalmología, Nefrología, Psicología, Urología y Cirugía.';

    if (texto.includes('cita') || texto.includes('reserva') || texto.includes('agendar') ||
        texto.includes('programar') || texto.includes('solicitar') || texto.includes('consulta'))
        return '📅 Puedes sacar tu cita:\n• Llenando el formulario en esta página\n• Llamando al Fonocitas: 934 274 553\n• Horario de citas: Lun a Sáb 7:00–11:00';

    if (texto.includes('direcci') || texto.includes('donde') || texto.includes('ubicaci') ||
        texto.includes('llegar') || texto.includes('queda') || texto.includes('mapa'))
        return '📍 Estamos en Av. Brasil S/N, Urb. Santa Cristina, Nuevo Chimbote, Áncash.';

    if (texto.includes('emergencia') || texto.includes('urgencia') || texto.includes('urgente') ||
        texto.includes('accidente') || texto.includes('grave') || texto.includes('auxilio'))
        return '🚨 Para emergencias llama al: 946 249 521\nEstamos disponibles las 24 horas, todos los días.';

    if (texto.includes('teléfono') || texto.includes('telefono') || texto.includes('llamar') ||
        texto.includes('contacto') || texto.includes('número') || texto.includes('comunicar'))
        return '📞 Nuestros teléfonos:\n• Central: 934 290 087\n• Emergencias: 946 249 521\n• Fonocitas: 934 274 553';

    if (texto.includes('correo') || texto.includes('email') || texto.includes('mail') ||
        texto.includes('mesa de partes'))
        return '✉️ Correo institucional: mesadepartes@hegb.gob.pe\nTambién puedes usar nuestra Mesa de Partes Virtual desde esta página.';

    if (texto.includes('doctor') || texto.includes('médico') || texto.includes('medico') ||
        texto.includes('especialista'))
        return '👨‍⚕️ Contamos con médicos especializados en todas las áreas. Llama al 934 290 087 o saca tu cita desde el formulario.';

    if (texto.includes('precio') || texto.includes('costo') || texto.includes('pagar') ||
        texto.includes('tarifa') || texto.includes('cuánto') || texto.includes('cuanto'))
        return '💰 Para información sobre tarifas, comunícate al 934 290 087 o visítanos en Av. Brasil S/N, Nuevo Chimbote.';

    if (texto.includes('laboratorio') || texto.includes('análisis') || texto.includes('analisis') ||
        texto.includes('examen') || texto.includes('sangre') || texto.includes('resultado'))
        return '🔬 Nuestro Laboratorio Clínico ofrece análisis precisos y rápidos.\n• Hematología, bioquímica y biología molecular\n• Entrega de resultados online\nLlama al 934 290 087.';

    if (texto.includes('niño') || texto.includes('bebe') || texto.includes('bebé') ||
        texto.includes('pediatr') || texto.includes('vacuna'))
        return '🩺 Nuestra área de Pediatría atiende desde recién nacidos hasta adolescentes.\n• Control de niño sano\n• Vacunación\n• Horario: Lun a Sáb 7:00–13:00\nSaca tu cita: 934 274 553.';

    if (texto.includes('corazón') || texto.includes('corazon') || texto.includes('cardiolog') ||
        texto.includes('presión') || texto.includes('infarto'))
        return '🫀 Nuestra área de Cardiología ofrece electrocardiograma, ecocardiografía 3D y prevención cardiovascular.\nSaca tu cita: 934 274 553.';

    if (texto.includes('cabeza') || texto.includes('neurolog') || texto.includes('migraña') ||
        texto.includes('epilepsia'))
        return '🧠 Nuestra área de Neurología trata migrañas, epilepsia y enfermedades degenerativas.\nSaca tu cita: 934 274 553.';

    if (texto.includes('hueso') || texto.includes('fractura') || texto.includes('traumatolog') ||
        texto.includes('lesión') || texto.includes('lesion'))
        return '🦴 Nuestra área de Traumatología atiende fracturas, rehabilitación física y medicina deportiva.\nSaca tu cita: 934 274 553.';

    if (texto.includes('histor') || texto.includes('expediente') || texto.includes('documento'))
        return '📋 Para solicitar tu historia clínica acércate a Mesa de Partes o escríbenos a mesadepartes@hegb.gob.pe';

    if (texto.includes('hola') || texto.includes('buenos') || texto.includes('buenas') ||
        texto.includes('saludos'))
        return '👋 ¡Hola! Bienvenido al Hospital Regional EGB. ¿En qué puedo ayudarte hoy?';

    if (texto.includes('gracias') || texto.includes('perfecto') || texto.includes('excelente'))
        return '😊 ¡Con gusto! ¿Hay algo más en lo que pueda ayudarte?';

    if (texto.includes('adios') || texto.includes('adiós') || texto.includes('chau') ||
        texto.includes('bye'))
        return '👋 ¡Hasta luego! Que tengas un excelente día.';

    return '🤔 No entendí tu consulta. Puedes preguntarme sobre horarios, especialidades, citas, dirección o teléfonos. También puedes llamarnos al 934 290 087.';
}

// ==========================================
// 7. PANEL "CONSULTAR CITA" (Royser)
// ==========================================
const dniConsultar   = document.getElementById('dni-consultar');
const fechaConsultar = document.getElementById('fecha-consultar');

if (dniConsultar) {
    dniConsultar.addEventListener('input', function () {
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
        mostrarNotificacion('Campos incompletos', 'Por favor ingresa tu DNI y la fecha de tu cita.', 'warning');
        return;
    }
    if (!/^\d{8}$/.test(dni)) {
        mostrarNotificacion('DNI inválido', 'El DNI debe tener exactamente 8 dígitos numéricos.', 'error');
        return;
    }

    const hoy    = new Date(); hoy.setHours(0, 0, 0, 0);
    const elegida = new Date(fecha + 'T00:00:00');

    if (elegida > hoy) {
        mostrarNotificacion('Fecha inválida', 'La fecha no puede ser futura. Ingresa la fecha real de tu cita.', 'error');
        return;
    }

    mostrarNotificacion(
        '🔍 Búsqueda realizada',
        `Cita encontrada para el DNI ${dni}. Revisa tu correo o llama al 934 274 553.`,
        'success'
    );

    document.getElementById('dni-consultar').value   = '';
    document.getElementById('fecha-consultar').value = '';
}
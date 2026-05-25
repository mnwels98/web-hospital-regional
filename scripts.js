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




// --- NUEVO: Modales Institucionales (Eddy) ---
    const modalSobre = document.getElementById("modal-sobre");
    const btnSobre = document.getElementById("btn-modal-sobre");
    const closeSobreBtn = document.getElementById("close-sobre-btn");

    if (btnSobre && modalSobre && closeSobreBtn) {
        // Abrir modal al hacer clic en el submenú
        btnSobre.addEventListener("click", (e) => {
            e.preventDefault(); // Evita que la página salte
            modalSobre.classList.add("active");
        });

        // Cerrar con la X
        closeSobreBtn.addEventListener("click", () => {
            modalSobre.classList.remove("active");
        });

        // Cerrar al hacer clic afuera
        modalSobre.addEventListener("click", (e) => {
            if (e.target === modalSobre) modalSobre.classList.remove("active");
        });
    }

// ========================================== 
// LÓGICA DEL BUSCADOR INTERACTIVO Y MODAL (EDDY)
// ========================================== 
const HOSPITAL_DATA = {
    especialidades: [
        { id: 1, nombre: "Cardiología", descripcion: "Prevención, diagnóstico y tratamiento de enfermedades del corazón y presión arterial.", icono: "❤️", sintomas: ["corazon", "pecho", "presion", "taquicardia", "infarto", "palpitaciones", "fatiga", "dolor de pecho", "soplo", "hipertension", "arritmia", "agitacion"] },
        { id: 2, nombre: "Endocrinología", descripcion: "Estudio y tratamiento del sistema endocrino, hormonas y metabolismo.", icono: "⚖️", sintomas: ["diabetes", "tiroides", "hormonas", "obesidad", "peso", "bajar de peso", "colesterol", "trigliceridos", "crecimiento"] },
        { id: 3, nombre: "Medicina Interna", descripcion: "Atención integral del adulto, diagnóstico de enfermedades complejas y crónicas.", icono: "🩺", sintomas: ["fiebre", "diabetes", "hipertension", "chequeo", "dolor general", "infeccion", "adulto", "cronico", "malestar genel", "fatiga"] },
        { id: 4, nombre: "Neumología", descripcion: "Especialistas en enfermedades del sistema respiratorio y los pulmones.", icono: "🫁", sintomas: ["pulmon", "asma", "tos", "resfriado", "gripe", "ahogo", "flema", "bronquios", "neumonia", "bronquitis", "respirar", "pecho congestionado", "silbido de pecho"] },
        { id: 5, nombre: "Neurología", descripcion: "Tratamiento no quirúrgico de trastornos del sistema nervioso y el cerebro.", icono: "🧠", sintomas: ["cerebro", "migraña", "dolor de cabeza", "paralisis", "convulsion", "mareo", "olvido", "nervios", "derrame", "epilepsia", "adormecimiento", "tics"] },
        { id: 6, nombre: "Neurocirugía", descripcion: "Cirugías de alta complejidad en el cerebro, médula espinal y columna vertebral.", icono: "🔬", sintomas: ["cerebro", "operar cabeza", "tumor cerebral", "columna", "hernia discal", "golpe en la cabeza", "traumatismo craneal", "medula"] },
        { id: 7, nombre: "Patología Clínica", descripcion: "Análisis e interpretación de muestras biológicas en laboratorio para el diagnóstico.", icono: "🧪", sintomas: ["analisis de sangre", "laboratorio", "muestras", "orina", "hemograma", "perfil hepatico", "examen", "glucosa"] },
        { id: 8, nombre: "Anátomo Patología", descripcion: "Estudio celular de biopsias, tejidos y piezas quirúrgicas para descartar malignidad.", icono: "🔬", sintomas: ["biopsia", "tumores", "tejido", "analisis de tejido", "patologo", "celulas", "necropsia", "descarte de cancer"] },
        { id: 9, nombre: "Dermatología", descripcion: "Diagnóstico y tratamiento de afecciones de la piel, cabello y uñas.", icono: "✨", sintomas: ["piel", "manchas", "acne", "granitos", "alergia", "ronchas", "hongo", "caspa", "caida de cabello", "comezon", "picazon", "quemadura", "uñero", "lunares"] },
        { id: 10, nombre: "Psiquiatría", descripcion: "Evaluación, diagnóstico y tratamiento médico de trastornos de la salud mental.", icono: "🧘", sintomas: ["ansiedad", "depresion", "estres", "sueño", "insomnio", "animo", "panico", "mente", "psicosis", "tristeza", "bipolaridad", "alucinaciones"] },
        { id: 11, nombre: "Pediatría", descripcion: "Atención médica integral y control del desarrollo para bebés, niños y adolescentes.", icono: "👶", sintomas: ["nino", "bebe", "fiebre", "vacunas", "crecimiento", "tos", "vomito", "pediatra", "desarrollo", "infantil", "lactante"] },
        { id: 12, nombre: "Neonatología", descripcion: "Cuidado especializado y crítico del recién nacido y bebés prematuros.", icono: "🍼", sintomas: ["recien nacido", "prematuro", "incubadora", "bebe amarillo", "ictericia", "parto complicado", "cordon", "lactancia materna"] },
        { id: 13, nombre: "Gastroenterología Pediátrica", descripcion: "Enfermedades del aparato digestivo exclusivas para niños y lactantes.", icono: "👦", sintomas: ["niño", "bebe", "dolor de estomago niño", "colicos", "estreñimiento infantil", "reflujo bebe", "diarrea niño", "intolerancia lactosa"] },
        { id: 14, nombre: "Traumatología", descripcion: "Especialistas en lesiones del aparato locomotor, huesos, articulaciones y fracturas.", icono: "🦴", sintomas: ["hueso", "fractura", "esguince", "dolor de espalda", "caida", "rodilla", "golpe", "columna", "yeso", "articulacion", "dislocacion"] },
        { id: 15, nombre: "Reumatología", descripcion: "Tratamiento de enfermedades inflamatorias crónicas que afectan articulaciones y músculos.", icono: "🤝", sintomas: ["artritis", "artrosis", "reumas", "dolor de huesos", "dolor de manos", "hinchazon articulaciones", "lupus", "deformidad"] },
        { id: 16, nombre: "Radiología", descripcion: "Diagnóstico mediante imágenes médicas de rayos X, ecografías y tomografías.", icono: "🩻", sintomas: ["radiografia", "rayos x", "ecografia", "tomografia", "resonancia", "placa", "imagenes por diagnostico"] },
        { id: 17, nombre: "Cirugía General", descripcion: "Tratamiento quirúrgico de enfermedades abdominales, hernias y tejidos blandos.", icono: "🔪", sintomas: ["operacion", "apendice", "hernia", "vesicula", "dolor abdominal agudo", "cirujano", "quiste", "lipoma"] },
        { id: 18, nombre: "Cirugía Pediátrica", descripcion: "Intervenciones quirúrgicas especializadas para corregir anomalías en niños.", icono: "🧒", sintomas: ["operacion niño", "hernia infantil", "apendicitis niño", "frenillo", "testiculo no descendido", "malformacion"] },
        { id: 19, nombre: "Cirugía Plástica", descripcion: "Cirugía reconstructiva para quemaduras, cicatrices, anomalías y estética.", icono: "🩹", sintomas: ["quemadura", "cicatriz", "reconstruccion", "labio leporino", "injerto", "cirugia reconstructiva"] },
        { id: 20, nombre: "Cirugía Oncológica", descripcion: "Tratamiento quirúrgico para la remoción y extirpación de tumores cancerígenos.", icono: "🎗️", sintomas: ["tumor", "cancer", "extirpar", "nodulo", "masa en el cuerpo", "quiste sospechoso", "operar tumor"] },
        { id: 21, nombre: "Ginecología y Obstetricia", descripcion: "Cuidado integral de la salud de la mujer, control del embarazo y parto.", icono: "🤰", sintomas: ["embarazo", "mujer", "parto", "control", "utero", "menstruacion", "ovarios", "gestante", "quistes", "flujo", "cesarea"] },
        { id: 22, nombre: "Oftalmología", descripcion: "Cuidado de la visión, medida de la vista y tratamiento de enfermedades oculares.", icono: "👁️", sintomas: ["ojos", "vista", "lentes", "borroso", "ceguera", "medida", "miopia", "catarata", "ardor", "conjuntivitis"] },
        { id: 23, nombre: "Otorrinolaringología", descripcion: "Especialistas en afecciones del oído, la nariz y la garganta.", icono: "👂", sintomas: ["oido", "nariz", "garganta", "dolor de garganta", "ronquera", "amigdalas", "sordera", "zumbido", "gripe", "resfriado", "sinusitis"] },
        { id: 24, nombre: "Urología", descripcion: "Atención del sistema urinario general y del aparato reproductor masculino.", icono: "💧", sintomas: ["orina", "riñon", "prostata", "vejiga", "calculos", "dolor al orinar", "varon", "hombre", "testiculo", "infeccion urinaria"] },
        { id: 25, nombre: "Anestesiología", descripcion: "Cuidado, sedación y alivio del dolor antes, durante y después de cirugías.", icono: "😴", sintomas: ["anestesia", "operacion dolor", "bloqueo", "sedacion", "preoperatorio", "calmar dolor"] },
        { id: 26, nombre: "Odontoestomatología", descripcion: "Salud oral integral, tratamiento de dientes, encías y afecciones bucales.", icono: "🦷", sintomas: ["dientes", "muela", "dolor de muela", "caries", "curacion", "encias", "brackets", "ortodoncia", "extraccion"] },
        { id: 27, nombre: "Odontoestomatología Pediátrica", descripcion: "Cuidado dental especializado exclusivo para niños (Odontopediatría).", icono: "🦁", sintomas: ["diente niño", "muela niño", "caries infantil", "fluorización", "dentista niños"] },
        { id: 28, nombre: "Nefrología", descripcion: "Prevención, diagnóstico y tratamiento de enfermedades renales y diálisis.", icono: "🧼", sintomas: ["riñon", "insuficiencia renal", "dialisis", "retencion de liquidos", "orina con sangre", "creatinina alta"] },
        { id: 29, nombre: "Cirugía de Tórax y Cardiovascular", descripcion: "Cirugías del sistema respiratorio, caja torácica, venas, arterias y el corazón.", icono: "🫀", sintomas: ["varices", "operacion pulmon", "tomas toracicas", "arterias tapadas", "bypass", "aneurisma", "venas"] },
        { id: 30, nombre: "Oncología Médica", descripcion: "Tratamiento sistémico del cáncer mediante quimioterapia e inmunoterapia.", icono: "🎗️", sintomas: ["cancer", "quimioterapia", "tumor maligno", "carcinoma", "leucemia", "infusion oncologica"] },
        { id: 31, nombre: "Gastroenterología", descripcion: "Especialistas en enfermedades del aparato digestivo, estómago e intestinos para adultos.", icono: "🤢", sintomas: ["estomago", "gastritis", "dolor de panza", "dolor de barriga", "vomito", "diarrea", "acidez", "reflujo", "colon", "higado", "gases", "indigestion"] }
    ]
};

// Conectores comunes en español que debemos ignorar en las búsquedas
const STOP_WORDS = ["de", "del", "el", "la", "los", "las", "un", "una", "con", "en", "por", "para", "me", "duele", "tengo", "dolor", "siento", "fuerte", "mucho", "mi", "mis", "el", "ella"];

// ========================================== 
// LÓGICA INTERACTIVA AVANZADA
// ========================================== 
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const specialtiesGrid = document.getElementById("specialties-grid");
    const yearSpan = document.getElementById("year");

    const searchModal = document.getElementById("search-modal");
    const appointmentModal = document.getElementById("appointment-modal");
    
    const openSearchBtn = document.getElementById("open-search-btn");
    const closeSearchBtn = document.getElementById("close-search-btn");
    const closeAppointmentBtn = document.getElementById("close-appointment-btn");
    
    const appointmentForm = document.getElementById("appointment-form");
    const selectedSpecialtyInput = document.getElementById("selected-specialty");

    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }

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

        const searchTerms = cleanQuery.split(/\s+/).filter(word => !STOP_WORDS.includes(word) && word.length > 1);
        const finalTerms = searchTerms.length > 0 ? searchTerms : [cleanQuery];

        const filtered = HOSPITAL_DATA.especialidades.filter(item => {
            const nombreLimpio = cleanText(item.nombre);
            return finalTerms.some(term => {
                const matchNombre = nombreLimpio.includes(term);
                const matchSintomas = item.sintomas.some(sintoma => cleanText(sintoma).includes(term));
                return matchNombre || matchSintomas;
            });
        });

        renderSpecialties(filtered);
    }

    function renderSpecialties(list) {
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
                selectedSpecialtyInput.value = item.nombre; 
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
            const paciente = document.getElementById("patient-name").value;
            const especialidad = selectedSpecialtyInput.value;
            
            alert(`¡Solicitud registrada con éxito!\n\nPaciente: ${paciente}\nEspecialidad: ${especialidad}\n\nNos comunicaremos pronto para confirmar el horario de su cita.`);
            appointmentForm.reset();
            appointmentModal.classList.remove("active");
        });
    }
});
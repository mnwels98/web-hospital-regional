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



// ========================================== 
// LÓGICA DEL BUSCADOR INTERACTIVO Y MODAL (EDDY)
// ========================================== 
const HOSPITAL_DATA = {
    especialidades: [
        { id: 1, nombre: "Pediatría", descripcion: "Atención médica integral para bebés, niños y adolescentes.", icono: "👶", sintomas: ["niño", "bebe", "fiebre", "vacunas", "crecimiento", "tos", "vomito", "pediatra", "desarrollo", "infantil"] },
        { id: 2, nombre: "Cardiología", descripcion: "Prevención, diagnóstico y tratamiento de enfermedades del corazón y presión arterial.", icono: "❤️", sintomas: ["corazon", "pecho", "presion", "taquicardia", "infarto", "palpitaciones", "fatiga", "dolor de pecho", "soplo"] },
        { id: 3, nombre: "Traumatología", descripcion: "Especialistas en lesiones del aparato locomotor, huesos, articulaciones y fracturas.", icono: "🦴", sintomas: ["hueso", "fractura", "esguince", "dolor de espalda", "caida", "rodilla", "golpe", "columna", "yeso"] },
        { id: 4, nombre: "Ginecología y Obstetricia", descripcion: "Cuidado integral de la salud de la mujer, control del embarazo y parto.", icono: "🤰", sintomas: ["embarazo", "mujer", "parto", "control", "utero", "menstruacion", "ovarios", "gestante"] },
        { id: 5, nombre: "Medicina Interna", descripcion: "Atención integral del adulto, diagnóstico de enfermedades complejas y crónicas.", icono: "🩺", sintomas: ["fiebre", "diabetes", "hipertension", "chequeo", "dolor general", "infeccion", "adulto", "cronico"] },
        { id: 6, nombre: "Gastroenterología", descripcion: "Especialistas en enfermedades del aparato digestivo, estómago e intestinos.", icono: "🤢", sintomas: ["estomago", "gastritis", "dolor de panza", "vómito", "diarrea", "acidez", "reflujo", "colon", "higado"] },
        { id: 7, nombre: "Oftalmología", descripcion: "Cuidado de la visión, diagnóstico y tratamiento de enfermedades oculares.", icono: "👁️", sintomas: ["ojos", "vista", "lentes", "borroso", "ceguera", "medida", "miopia", "catarata", "ardor"] },
        { id: 8, nombre: "Neurología", descripcion: "Tratamiento de trastornos del sistema nervioso y el cerebro.", icono: "🧠", sintomas: ["cerebro", "migraña", "dolor de cabeza", "paralisis", "convulsion", "mareo", "olvido", "nervios"] },
        { id: 9, nombre: "Urología", descripcion: "Atención del sistema urinario en general y del aparato reproductor masculino.", icono: "💧", sintomas: ["orina", "riñon", "prostata", "vejiga", "calculos", "dolor al orinar", "varon", "hombre"] }
    ]
};

// Conectores comunes en español que debemos ignorar en las búsquedas
const STOP_WORDS = ["de", "del", "el", "la", "los", "las", "un", "una", "con", "en", "por", "para", "me", "duele", "tengo", "dolor"];

// ========================================== 
// LÓGICA INTERACTIVA AVANZADA
// ========================================== 
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const specialtiesGrid = document.getElementById("specialties-grid");
    const yearSpan = document.getElementById("year");

    // Modales
    const searchModal = document.getElementById("search-modal");
    const appointmentModal = document.getElementById("appointment-modal");
    
    // Botones de control
    const openSearchBtn = document.getElementById("open-search-btn");
    const closeSearchBtn = document.getElementById("close-search-btn");
    const closeAppointmentBtn = document.getElementById("close-appointment-btn");
    
    // Formulario de citas
    const appointmentForm = document.getElementById("appointment-form");
    const selectedSpecialtyInput = document.getElementById("selected-specialty");

    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }

    // --- MANEJO DE MODALES ---
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

    // --- MOTOR DE BÚSQUEDA POR FRASES AVANZADO ---
    function cleanText(text) {
        return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    function filterData(query) {
        const cleanQuery = cleanText(query);
        if (cleanQuery === "") {
            renderSpecialties(HOSPITAL_DATA.especialidades);
            return;
        }

        // Dividir la frase en palabras individuales y filtrar las que no aportan valor (Stopwords)
        const searchTerms = cleanQuery.split(/\s+/).filter(word => !STOP_WORDS.includes(word) && word.length > 1);

        // Si el filtro limpió todo (ej: si escribe "de el"), usamos la query original para no romper nada
        const finalTerms = searchTerms.length > 0 ? searchTerms : [cleanQuery];

        const filtered = HOSPITAL_DATA.especialidades.filter(item => {
            const nombreLimpio = cleanText(item.nombre);
            
            // Evaluar si alguno de los términos clave ingresados coincide con la especialidad o síntomas
            return finalTerms.some(term => {
                const matchNombre = nombreLimpio.includes(term);
                const matchSintomas = item.sintomas.some(sintoma => cleanText(sintoma).includes(term));
                return matchNombre || matchSintomas;
            });
        });

        renderSpecialties(filtered);
    }

    // --- RENDERIZADO DE TARJETAS CLICABLES ---
    function renderSpecialties(list) {
        specialtiesGrid.innerHTML = "";
        if (list.length === 0) {
            specialtiesGrid.innerHTML = `<div class="no-results">🔍 No encontramos una coincidencia exacta. Prueba escribiendo palabras directas como "ojo", "estómago" o "cabeza".</div>`;
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

            // Evento para abrir el flujo de citas al hacer clic en la tarjeta
            card.addEventListener("click", () => {
                searchModal.classList.remove("active"); // Cerramos el buscador
                selectedSpecialtyInput.value = item.nombre; // Precargamos la especialidad
                appointmentModal.classList.add("active"); // Abrimos el formulario de citas
            });

            specialtiesGrid.appendChild(card);
        });
    }

    if (searchInput && specialtiesGrid) {
        searchInput.addEventListener("input", (e) => filterData(e.target.value));
    }

    // --- CONTROL DE ENVÍO DE FORMULARIO DE CITA ---
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
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

//EDDY: DATA COMPARTIDA - HOSPITAL_DATA
const HOSPITAL_DATA = {
    especialidades: [
        {
            id: 1,
            nombre: "Pediatría",
            descripcion: "Atención médica integral para bebés, niños y adolescentes.",
            icono: "👶",
            sintomas: ["niño", "bebe", "fiebre", "vacunas", "crecimiento", "tos", "vomito", "pediatra"]
        },
        {
            id: 2,
            nombre: "Cardiología",
            descripcion: "Prevención, diagnóstico y tratamiento de enfermedades del corazón y presión arterial.",
            icono: "❤️",
            sintomas: ["corazon", "pecho", "presion", "taquicardia", "infarto", "palpitaciones", "fatiga"]
        },
        {
            id: 3,
            nombre: "Traumatología",
            descripcion: "Especialistas en lesiones del aparato locomotor, huesos, articulaciones y fracturas.",
            icono: "🦴",
            sintomas: ["hueso", "fractura", "esguince", "dolor de espalda", "caida", "rodilla", "golpe"]
        },
        {
            id: 4,
            nombre: "Ginecología",
            descripcion: "Cuidado integral de la salud de la mujer y control del embarazo.",
            icono: "🤰",
            sintomas: ["embarazo", "mujer", "parto", "control", "utero", "menstruacion"]
        },
        {
            id: 5,
            nombre: "Medicina Interna",
            descripcion: "Atención integral del adulto, diagnóstico de enfermedades complejas y crónicas.",
            icono: "🩺",
            sintomas: ["fiebre", "diabetes", "hipertension", "chequeo", "dolor general", "infeccion"]
        }
    ]
};

// ========================================== 
// LÓGICA DEL BUSCADOR INTERACTIVO (EDDY)
// ========================================== 
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const specialtiesGrid = document.getElementById("specialties-grid");
    const yearSpan = document.getElementById("year");

    // Lógica automática para el año del footer (de Diego)
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Función para renderizar tarjetas en el grid
    function renderSpecialties(list) {
        specialtiesGrid.innerHTML = "";

        if (list.length === 0) {
            specialtiesGrid.innerHTML = `
                <div class="no-results">
                    🔍 No se encontraron especialidades para ese síntoma. Intenta con otra palabra.
                </div>
            `;
            return;
        }

        list.forEach(item => {
            const card = document.createElement("div");
            card.className = "card-specialty";
            card.innerHTML = `
                <div class="icon-specialty">${item.icono}</div>
                <h4>${item.nombre}</h4>
                <p>${item.descripcion}</p>
                <div class="tags-container">
                    ${item.sintomas.slice(0, 3).map(s => `<span class="tag">${s}</span>`).join('')}
                </div>
            `;
            specialtiesGrid.appendChild(card);
        });
    }

    // Lógica de filtrado en tiempo real
    function filterData(query) {
        // Quitamos acentos y pasamos a minúsculas
        const cleanQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

        if (cleanQuery === "") {
            renderSpecialties(HOSPITAL_DATA.especialidades);
            return;
        }

        const filtered = HOSPITAL_DATA.especialidades.filter(item => {
            const matchNombre = item.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(cleanQuery);
            const matchSintomas = item.sintomas.some(sintoma => 
                sintoma.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(cleanQuery)
            );
            return matchNombre || matchSintomas;
        });

        renderSpecialties(filtered);
    }

    // Inicialización
    if (searchInput && specialtiesGrid) {
        renderSpecialties(HOSPITAL_DATA.especialidades); // Muestra todas al inicio

        searchInput.addEventListener("input", (e) => {
            filterData(e.target.value);
        });
    }
});
// ==========================================================================
// DATA SIMULADA AMPLIADA - HISTORIAL Y ALMACÉN HOSPITALARIO (ACTUALIZADO)
// ==========================================================================
let inventario = [
    // --- MEDICAMENTOS ---
    { id: 1, codigoSiga: "50102004", nombre: "Paracetamol 500mg", tipo: "Medicamento", stock: 650, lote: "LOTE-P2026", vencimiento: "2027-08-15", stockMinimo: 200, subAlmacen: "Almacén Farmacéutico Central" },
    { id: 2, codigoSiga: "50102008", nombre: "Ceftriaxona 1g Inyectable", tipo: "Medicamento", stock: 450, lote: "LOTE-C26C4", vencimiento: "2026-12-20", stockMinimo: 100, subAlmacen: "Sub-almacén de Emergencia y Trauma Shock" },
    { id: 5, codigoSiga: "50103022", nombre: "Ibuprofeno 400mg Tableta", tipo: "Medicamento", stock: 2500, lote: "LOTE-I8821", vencimiento: "2027-11-05", stockMinimo: 500, subAlmacen: "Almacén Farmacéutico Central" },
    { id: 6, codigoSiga: "50104011", nombre: "Insulina Humana NPH 100 UI/ml", tipo: "Medicamento", stock: 120, lote: "LOTE-INS45", vencimiento: "2026-09-30", stockMinimo: 40, subAlmacen: "Almacén Farmacéutico Central" }, // ABASTECIDO ✔️
    { id: 7, codigoSiga: "50101005", nombre: "Amoxicilina 250mg/5ml Suspensión", tipo: "Medicamento", stock: 0, lote: "LOTE-AMX12", vencimiento: "2027-01-10", stockMinimo: 150, subAlmacen: "Sub-almacén de Emergencia y Trauma Shock" }, // ❌ Se mantiene Quiebre para pruebas

    // --- MATERIAL MÉDICO ---
    { id: 3, codigoSiga: "50301012", nombre: "Catéter Intravenoso 18G", tipo: "Material Médico", stock: 380, lote: "LOTE-M2599", vencimiento: "2028-02-10", stockMinimo: 150, subAlmacen: "Insumos Quirúrgicos - Pabellón Central" }, // ABASTECIDO ✔️
    { id: 8, codigoSiga: "50302214", nombre: "Guantes de Látex Quirúrgicos Estériles 7.5", tipo: "Material Médico", stock: 1800, lote: "LOTE-G75A2", vencimiento: "2029-04-18", stockMinimo: 600, subAlmacen: "Insumos Quirúrgicos - Pabellón Central" },
    { id: 9, codigoSiga: "50304001", nombre: "Jeringa Descartable 10ml con Aguja 21G", tipo: "Material Médico", stock: 450, lote: "LOTE-JER09", vencimiento: "2028-10-12", stockMinimo: 300, subAlmacen: "Sub-almacén de Emergencia y Trauma Shock" }, // ABASTECIDO ✔️
    { id: 10, codigoSiga: "50305088", nombre: "Mascarilla Quirúrgica Tres Pliegues c/Elástico", tipo: "Material Médico", stock: 5000, lote: "LOTE-MASK2", vencimiento: "2030-01-01", stockMinimo: 1000, subAlmacen: "Almacén Farmacéutico Central" },
    { id: 11, codigoSiga: "50301140", nombre: "Gasa Quirúrgica Estéril 10cm x 10cm", tipo: "Material Médico", stock: 140, lote: "LOTE-GASA7", vencimiento: "2029-06-22", stockMinimo: 200, subAlmacen: "Insumos Quirúrgicos - Pabellón Central" }, // ⚠️ Se mantiene Crítico para pruebas

    // --- EQUIPO HOSPITALARIO ---
    { id: 4, codigoSiga: "50604001", nombre: "Ventilador Mecánico Adulto-Pediátrico", tipo: "Equipo Hospitalario", stock: 5, lote: "SERIE-VM23A", vencimiento: "N/A", stockMinimo: 2, subAlmacen: "Almacén Farmacéutico Central" }, // ABASTECIDO ✔️
    { id: 12, codigoSiga: "50601099", nombre: "Monitor de Funciones Vitales 5 Parámetros", tipo: "Equipo Hospitalario", stock: 8, lote: "SERIE-MN882", vencimiento: "N/A", stockMinimo: 3, subAlmacen: "Sub-almacén de Emergencia y Trauma Shock" },
    { id: 13, codigoSiga: "50602114", nombre: "Bomba de Infusión Volumétrica Continua", tipo: "Equipo Hospitalario", stock: 6, lote: "SERIE-BI004", vencimiento: "N/A", stockMinimo: 4, subAlmacen: "Insumos Quirúrgicos - Pabellón Central" }, // ABASTECIDO ✔️
    { id: 14, codigoSiga: "50605020", nombre: "Desfibrilador Externo Automático (DEA)", tipo: "Equipo Hospitalario", stock: 3, lote: "SERIE-DEA91", vencimiento: "N/A", stockMinimo: 2, subAlmacen: "Sub-almacén de Emergencia y Trauma Shock" }
];

let historialMovimientos = [
    // Movimientos del catálogo (Garantiza al menos 1 por cada ID)
    { idMovimiento: 1, fecha: "16/6/2026, 08:30:15", productoId: 14, producto: "Desfibrilador Externo Automático (DEA)", tipo: "INGRESO", cantidad: 1, documento: "NEA-0022", area: "Sub-almacén de Emergencia y Trauma Shock" },
    { idMovimiento: 2, fecha: "16/6/2026, 07:15:40", productoId: 13, producto: "Bomba de Infusión Volumétrica Continua", tipo: "INGRESO", cantidad: 6, documento: "OC-2026-88", area: "Insumos Quirúrgicos - Pabellón Central" },
    { idMovimiento: 3, fecha: "15/6/2026, 18:22:11", productoId: 12, producto: "Monitor de Funciones Vitales 5 Parámetros", tipo: "INGRESO", cantidad: 2, documento: "SIS-COMPRA-50", area: "Sub-almacén de Emergencia y Trauma Shock" },
    { idMovimiento: 4, fecha: "15/6/2026, 16:45:00", productoId: 11, producto: "Gasa Quirúrgica Estéril 10cm x 10cm", tipo: "SALIDA", cantidad: 60, documento: "PECOSA-0155", area: "Insumos Quirúrgicos - Pabellón Central" },
    { idMovimiento: 5, fecha: "15/6/2026, 14:10:25", productoId: 10, producto: "Mascarilla Quirúrgica Tres Pliegues c/Elástico", tipo: "INGRESO", cantidad: 2000, documento: "DONACIÓN-MINSA", area: "Almacén Farmacéutico Central" },
    { idMovimiento: 6, fecha: "15/6/2026, 11:30:00", productoId: 9, producto: "Jeringa Descartable 10ml con Aguja 21G", tipo: "INGRESO", cantidad: 400, documento: "SIS-COMPRA-49", area: "Sub-almacén de Emergencia y Trauma Shock" },
    { idMovimiento: 7, fecha: "15/6/2026, 09:15:32", productoId: 8, producto: "Guantes de Látex Quirúrgicos Estériles 7.5", tipo: "SALIDA", cantidad: 200, documento: "PECOSA-0154", area: "Insumos Quirúrgicos - Pabellón Central" },
    { idMovimiento: 8, fecha: "15/6/2026, 08:00:00", productoId: 1, producto: "Paracetamol 500mg", tipo: "SALIDA", cantidad: 300, documento: "PECOSA-0012", area: "Sub-almacén de Emergencia y Trauma Shock" },
    { idMovimiento: 9, fecha: "14/6/2026, 15:40:19", productoId: 7, producto: "Amoxicilina 250mg/5ml Suspensión", tipo: "SALIDA", cantidad: 150, documento: "RECETA-EMERG-102", area: "Sub-almacén de Emergencia y Trauma Shock" },
    { idMovimiento: 10, fecha: "14/6/2026, 11:20:05", productoId: 6, producto: "Insulina Humana NPH 100 UI/ml", tipo: "INGRESO", cantidad: 110, documento: "OC-2026-85", area: "Almacén Farmacéutico Central" },
    { idMovimiento: 11, fecha: "14/6/2026, 10:30:00", productoId: 1, producto: "Paracetamol 500mg", tipo: "INGRESO", cantidad: 450, documento: "SIS-COMPRA-44", area: "Almacén Farmacéutico Central" },
    { idMovimiento: 12, fecha: "13/6/2026, 16:11:45", productoId: 5, producto: "Ibuprofeno 400mg Tableta", tipo: "INGRESO", cantidad: 1000, documento: "SIS-COMPRA-42", area: "Almacén Farmacéutico Central" },
    { idMovimiento: 13, fecha: "13/6/2026, 14:15:00", productoId: 3, producto: "Catéter Intravenoso 18G", tipo: "SALIDA", cantidad: 125, documento: "RECETA-EMERG-99", area: "Insumos Quirúrgicos - Pabellón Central" },
    { idMovimiento: 14, fecha: "13/6/2026, 10:05:22", productoId: 2, producto: "Ceftriaxona 1g Inyectable", tipo: "INGRESO", cantidad: 200, documento: "SIS-COMPRA-41", area: "Sub-almacén de Emergencia y Trauma Shock" },
    { idMovimiento: 15, fecha: "12/6/2026, 09:00:00", productoId: 4, producto: "Ventilador Mecánico Adulto-Pediátrico", tipo: "INGRESO", cantidad: 4, documento: "DONACIÓN-MINSA", area: "Almacén Farmacéutico Central" }
];

// VARIABLES GLOBALES DE FILTRADO (Las 3 de la fila superior)
let filtroBusqueda = "";
let filtroAlmacen = "Todos los almacenes internos...";
let filtroEstado = "TODOS"; // <-- NUEVA: Controla el selector de alertas
let idProductoKardexSeleccionado = "TODOS";

function actualizarFechaHora() {
    const contenedorTexto = document.getElementById('fecha-hora-texto');
    if (!contenedorTexto) return;

    const ahora = new Date();
    
    // Opciones para formatear como: "mar, 16 jun. 10:32 a. m."
    const opciones = { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short', 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    };
    
    let fechaFormateada = ahora.toLocaleDateString('es-PE', opciones);
    // Limpieza sutil de formato para quitar comas excesivas si existieran
    fechaFormateada = fechaFormateada.replace('.', '').replace(' p m', ' p. m.').replace(' a m', ' a. m.');
    
    contenedorTexto.textContent = fechaFormateada;
}

// Inicializar y actualizar cada minuto
document.addEventListener('DOMContentLoaded', () => {
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 60000);
});

// ==========================================================================
// LOGICA DE TRANSACCIONES KÁRDEX
// ==========================================================================
function procesarMovimiento(productoId, tipo, cantidad, documento, area) {
    const producto = inventario.find(p => p.codigoSiga === productoId);
    
    if (!producto) return { exito: false, mensaje: "Error: Producto no encontrado." };
    if (cantidad <= 0) return { exito: false, mensaje: "Error: La cantidad debe ser mayor a cero." };
    
    if (tipo === 'INGRESO') {
        producto.stock += cantidad;
    } else if (tipo === 'SALIDA') {
        if (producto.stock < cantidad) {
            return { exito: false, mensaje: `Error: Stock insuficiente. Solo quedan ${producto.stock} unidades.` };
        }
        producto.stock -= cantidad;
    }

    const nuevoMovimiento = {
        idMovimiento: historialMovimientos.length + 1,
        fecha: new Date().toLocaleString('es-PE'),
        productoId: producto.id,
        producto: producto.nombre,
        tipo: tipo,
        cantidad: cantidad,
        documento: documento || "Sin documento",
        area: area || producto.subAlmacen
    };
    historialMovimientos.unshift(nuevoMovimiento);

    renderizarTablas();
    return { exito: true, mensaje: `¡${tipo} procesado con éxito para ${producto.nombre}!` };
}

// ==========================================================================
// RENDERIZADOR TOTAL DE LA INTERFAZ
// ==========================================================================
function renderizarTablas() {
    const tablaInventario = document.getElementById('cuerpo-inventario');
    const tablaHistorial = document.getElementById('cuerpo-historial');

    // 1. DIBUJAR TABLA DE INVENTARIO GENERAL
    if (tablaInventario) {
        tablaInventario.innerHTML = '';
        
        // Aplicación acumulativa de filtros
        const inventarioFiltrado = inventario.filter(p => {
            const cumpleBusqueda = p.nombre.toLowerCase().includes(filtroBusqueda) || 
                                  p.codigoSiga.includes(filtroBusqueda) || 
                                  p.lote.toLowerCase().includes(filtroBusqueda);
            
            const cumpleAlmacen = (filtroAlmacen === "Todos los almacenes internos...") || (p.subAlmacen === filtroAlmacen);
            
            // Lógica del nuevo filtro: Si es 'ALERTA', solo pasan los que tienen problemas de stock
            let cumpleEstado = true;
            if (filtroEstado === "ALERTA") {
                cumpleEstado = (p.stock === 0 || p.stock <= p.stockMinimo);
            }
            
            return cumpleBusqueda && cumpleAlmacen && cumpleEstado;
        });

        let acumuladorFilas = ""; 

        inventarioFiltrado.forEach(p => {
            let filaClass = "";
            let condicionTexto = "Óptimo (Abastecido)";
            let condicionClass = "stock-optimo";

            if (p.stock === 0) {
                filaClass = "table-danger-critica";
                condicionClass = "badge-critico-intenso";
                condicionTexto = "Quiebre de Stock ❌";
            } else if (p.stock <= p.stockMinimo) {
                filaClass = "table-danger-critica";
                condicionClass = "badge-critico-intenso";
                condicionTexto = `${p.stock} ⚠️ (Stock Mínimo: ${p.stockMinimo})`;
            }

            let badgeClass = "badge-medicamento";
            if (p.tipo === "Material Médico") badgeClass = "badge-material-medico";
            if (p.tipo === "Equipo Hospitalario") badgeClass = "badge-equipo-hospitalario";

            acumuladorFilas += `
                <tr class="${filaClass}">
                    <td class="fw-bold text-dark">${p.codigoSiga}</td>
                    <td class="fw-medium text-dark">${p.nombre}</td>
                    <td><span class="${badgeClass}">${p.tipo}</span></td>
                    <td class="text-uppercase fw-medium">${p.lote}</td>
                    <td>${p.vencimiento}</td>
                    <td class="text-center fw-bold text-dark ${condicionClass === 'stock-optimo' ? '' : 'd-none'}">${p.stock}</td>
                    <td class="text-start ${condicionClass !== 'stock-optimo' ? '' : 'd-none'}" colspan="1">
                        <span class="${condicionClass}">${condicionTexto}</span>
                    </td>
                </tr>
            `;
        });

        tablaInventario.innerHTML = acumuladorFilas;

        // CONTROL DINÁMICO DE LA NOTIFICACIÓN SUPERIOR DE DIRESA
        const alertaDiresa = document.querySelector('.alerta-hospital');
        if (alertaDiresa) {
            const hayCrisisEnAlmacen = inventario.some(p => p.stock === 0 || p.stock <= p.stockMinimo);
            if (hayCrisisEnAlmacen) {
                alertaDiresa.style.display = 'block';
            } else {
                alertaDiresa.style.display = 'none';
            }
        }
    } 

    // 2. DIBUJAR TABLA DE HISTORIAL (KÁRDEX)
    if (tablaHistorial) {
        tablaHistorial.innerHTML = '';
        const movimientosFiltrados = historialMovimientos.filter(m => {
            if (idProductoKardexSeleccionado === "TODOS") return true;
            return m.productoId === parseInt(idProductoKardexSeleccionado);
        });

        if (movimientosFiltrados.length === 0) {
            tablaHistorial.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No se han registrado movimientos en esta sesión.</td></tr>`;
        } else {
            let acumuladorHistorial = "";
            movimientosFiltrados.forEach(m => {
                acumuladorHistorial += `
                    <tr class="${m.tipo === 'INGRESO' ? 'kardex-entrada' : 'kardex-salida'}">
                        <td>${m.fecha}</td>
                        <td class="text-center fw-bold ${m.tipo === 'INGRESO' ? 'text-success' : 'text-danger'}">
                            ${m.tipo === 'INGRESO' ? 'INGRESO' : 'SALIDA'}
                        </td>
                        <td class="fw-bold text-dark">${m.producto}</td>
                        <td class="text-center fw-bold text-dark">${m.cantidad}</td>
                        <td><span class="badge bg-light text-dark border">${m.documento}</span></td>
                        <td>${m.area}</td>
                    </tr>
                `;
            });
            tablaHistorial.innerHTML = acumuladorHistorial;
        }
    }
}

// ==========================================================================
// CONTROLADORES DE EVENTOS DE FILTRADO (Globales)
// ==========================================================================
function actualizarFiltroBusqueda(valor) {
    filtroBusqueda = valor.toLowerCase().trim();
    renderizarTablas();
}

function actualizarFiltroAlmacen(valor) {
    filtroAlmacen = valor;
    renderizarTablas();
}

// Función asignada al tercer selector simétrico del HTML
function actualizarFiltroEstado(valor) {
    filtroEstado = valor;
    renderizarTablas();
}

function filtrarKardexPorProducto(idProducto) {
    idProductoKardexSeleccionado = idProducto;
    renderizarTablas();
}

// ==========================================================================
// POBLADO AUTOMÁTICO DE SELECTORES AL ARRANQUE
// ==========================================================================
function poblarSelectoresDinámicos() {
    const selectProducto = document.getElementById('select-producto');
    const selectFiltroKardex = document.getElementById('select-kardex-filtro');

    if (selectProducto) {
        let opcionesRegistro = `<option value="" disabled selected>Seleccione un insumo hospitalario...</option>`;
        inventario.forEach(p => {
            opcionesRegistro += `<option value="${p.codigoSiga}">#${p.codigoSiga} - ${p.nombre}</option>`;
        });
        selectProducto.innerHTML = opcionesRegistro;
    }

    if (selectFiltroKardex) {
        let opcionesFiltro = `<option value="TODOS">Ver todos los movimientos</option>`;
        inventario.forEach(p => {
            opcionesFiltro += `<option value="${p.id}">${p.nombre}</option>`; 
        });
        selectFiltroKardex.innerHTML = opcionesFiltro;
    }
}
// ==========================================================================
// LÓGICA DE MODO OSCURO CONMUTABLE INTERACTIVO
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const btnTheme = document.getElementById('btn-theme');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // 1. Cargar estado guardado en el navegador
    const temaGuardado = localStorage.getItem('hospital-theme');
    if (temaGuardado === 'dark') {
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
    }

    // 2. Escuchar clics en el botón circular
    if (btnTheme) {
        btnTheme.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('hospital-theme', 'dark');
                if (themeIcon) themeIcon.textContent = '☀️';
            } else {
                localStorage.setItem('hospital-theme', 'light');
                if (themeIcon) themeIcon.textContent = '🌙';
            }
        });
    }
});

// Inicializador principal automático
document.addEventListener('DOMContentLoaded', () => {
    poblarSelectoresDinámicos(); 
    renderizarTablas();          
});
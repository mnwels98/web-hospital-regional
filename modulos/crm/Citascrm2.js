// =============================================
//  citasCRM2.js — Módulo CRM Citas
//  Usa localStorage para compartir datos
//  con dashboard-citas.html
// =============================================

const medicosPorEspecialidad = {
  "Medicina General":  ["Dr. Carlos Huamán",  "Dra. Rosa Espinoza"],
  "Pediatría":         ["Dra. Lucía Castillo", "Dr. Marcos Ríos"],
  "Ginecología":       ["Dra. Ana Mendoza",    "Dra. Patricia Vega"],
  "Cardiología":       ["Dr. Roberto Salas",   "Dr. Jorge Llanos"],
  "Traumatología":     ["Dr. Luis Paredes",    "Dr. César Quispe"],
  "Neurología":        ["Dra. Elena Torres",   "Dr. Andrés Mora"],
  "Dermatología":      ["Dra. Carmen Silva",   "Dr. Iván Rojas"],
  "Oftalmología":      ["Dr. Felipe Herrera",  "Dra. Susana Díaz"],
};

// ─── Cargar datos desde localStorage ─────────────────────────────
let citas   = JSON.parse(localStorage.getItem("crm_citas"))   || [];
let tickets = JSON.parse(localStorage.getItem("crm_tickets")) || [];
let contadorCitas   = citas.length   > 0 ? Math.max(...citas.map(c=>c.id))   : 0;
let contadorTickets = tickets.length > 0 ? Math.max(...tickets.map(t=>t.id)) : 0;

// ─── Guardar en localStorage ──────────────────────────────────────
function guardarDatos() {
  localStorage.setItem("crm_citas",   JSON.stringify(citas));
  localStorage.setItem("crm_tickets", JSON.stringify(tickets));
}

// ─── Init ─────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fecha").min = hoy;

  document.getElementById("especialidad").addEventListener("change", function () {
    const medicos = medicosPorEspecialidad[this.value] || [];
    document.getElementById("medico").innerHTML = medicos.length
      ? medicos.map(m => `<option>${m}</option>`).join("")
      : `<option value="">-- Seleccionar especialidad primero --</option>`;
    limpiarError("especialidad");
  });

  ["nombre","dni","fecha","hora"].forEach(id => {
    document.getElementById(id).addEventListener("input",  () => limpiarError(id));
    document.getElementById(id).addEventListener("change", () => limpiarError(id));
  });
  ["ticket-paciente","ticket-motivo"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => limpiarError(id));
  });

  renderTabla();
  renderTickets();
  actualizarEstadisticas();
  verificarAlertas();
  actualizarCampana();
  init3DCards();
});

// ─── VALIDACIONES ─────────────────────────────────────────────────
function validarCita() {
  let ok = true;
  limpiarTodosErrores(["nombre","dni","especialidad","medico","fecha","hora"]);

  const nombre = document.getElementById("nombre").value.trim();
  const dni    = document.getElementById("dni").value.trim();
  const espec  = document.getElementById("especialidad").value;
  const medico = document.getElementById("medico").value;
  const fecha  = document.getElementById("fecha").value;
  const hora   = document.getElementById("hora").value;

  if (!nombre)             { mostrarError("nombre", "El nombre es obligatorio"); ok = false; }
  else if (nombre.length < 3) { mostrarError("nombre", "Mínimo 3 caracteres"); ok = false; }
  else if (/\d/.test(nombre)) { mostrarError("nombre", "No puede contener números"); ok = false; }

  if (!dni)                    { mostrarError("dni", "El DNI es obligatorio"); ok = false; }
  else if (!/^\d{8}$/.test(dni)) { mostrarError("dni", "Debe tener exactamente 8 dígitos"); ok = false; }

  if (!espec)  { mostrarError("especialidad", "Selecciona una especialidad"); ok = false; }
  if (!medico || medico.includes("primero")) { mostrarError("medico", "Selecciona un médico"); ok = false; }

  if (!fecha) { mostrarError("fecha", "La fecha es obligatoria"); ok = false; }
  else if (fecha < new Date().toISOString().split("T")[0]) {
    mostrarError("fecha", "No puedes seleccionar una fecha pasada"); ok = false;
  }

  if (!hora) { mostrarError("hora", "Selecciona una hora"); ok = false; }
  return ok;
}

function validarTicket() {
  let ok = true;
  limpiarTodosErrores(["ticket-paciente","ticket-motivo"]);

  const paciente = document.getElementById("ticket-paciente").value.trim();
  const motivo   = document.getElementById("ticket-motivo").value.trim();

  if (!paciente)           { mostrarError("ticket-paciente", "El nombre es obligatorio"); ok = false; }
  else if (paciente.length < 3) { mostrarError("ticket-paciente", "Mínimo 3 caracteres"); ok = false; }

  if (!motivo)             { mostrarError("ticket-motivo", "Describe el motivo"); ok = false; }
  else if (motivo.length < 10) { mostrarError("ticket-motivo", "Mínimo 10 caracteres"); ok = false; }

  return ok;
}

function mostrarError(id, texto) {
  const input = document.getElementById(id);
  const span  = document.getElementById("err-" + id);
  if (input) input.classList.add("input-error");
  if (span)  span.textContent = texto;
}

function limpiarError(id) {
  const input = document.getElementById(id);
  const span  = document.getElementById("err-" + id);
  if (input) input.classList.remove("input-error");
  if (span)  span.textContent = "";
}

function limpiarTodosErrores(ids) { ids.forEach(id => limpiarError(id)); }

// ─── Registrar Cita ───────────────────────────────────────────────
function registrarCita() {
  if (!validarCita()) return;

  const nombre       = document.getElementById("nombre").value.trim();
  const dni          = document.getElementById("dni").value.trim();
  const especialidad = document.getElementById("especialidad").value;
  const medico       = document.getElementById("medico").value;
  const fecha        = document.getElementById("fecha").value;
  const hora         = document.getElementById("hora").value;

  contadorCitas++;
  citas.push({ id: contadorCitas, nombre, dni, especialidad, medico, fecha, hora, estado: "pendiente" });
  guardarDatos();

  renderTabla();
  actualizarEstadisticas();
  limpiarFormularioCita();
  mostrarMensaje("mensaje", "exito", `✅ Cita #${contadorCitas} registrada para ${nombre}.`);
  mostrarToast("📅", "Cita registrada", `${nombre} · ${especialidad}`, "exito");
}

function renderTabla(lista) {
  const data    = lista !== undefined ? lista : citas;
  const tbody   = document.getElementById("cuerpoTabla");
  const contador = document.getElementById("contador");

  contador.textContent = `${citas.length} cita${citas.length !== 1 ? "s" : ""}`;

  if (data.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="8">${lista !== undefined ? "Sin resultados" : "No hay citas registradas aún"}</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(c => `
    <tr>
      <td><strong>${c.nombre}</strong></td>
      <td>${c.dni}</td>
      <td>${c.especialidad}</td>
      <td>${c.medico}</td>
      <td>${formatFecha(c.fecha)}</td>
      <td>${c.hora}</td>
      <td>
        <span class="estado estado-${c.estado}" onclick="cambiarEstado(${c.id})" title="Clic para cambiar estado">
          ${c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}
        </span>
      </td>
      <td><button class="btn-eliminar" onclick="eliminarCita(${c.id})">🗑️</button>
          <button class="btn-editar" onclick="editarCita(${c.id})">✏️</button></td>
    </tr>
  `).join("");
}

function cambiarEstado(id) {
  const estados = ["pendiente","confirmada","cancelada"];
  const cita = citas.find(c => c.id === id);
  if (!cita) return;
  cita.estado = estados[(estados.indexOf(cita.estado) + 1) % estados.length];
  guardarDatos();
  renderTabla();
  actualizarEstadisticas();
}

function eliminarCita(id) {
  if (!confirm("¿Deseas eliminar esta cita?")) return;
  citas = citas.filter(c => c.id !== id);
  guardarDatos();
  renderTabla();
  actualizarEstadisticas();
}

// ─── Editar Cita ──────────────────────────────────────────────────
let citaEditandoId = null;

function editarCita(id) {
  const cita = citas.find(c => c.id === id);
  if (!cita) return;

  citaEditandoId = id;

  // Cargar datos en el formulario
  document.getElementById("nombre").value = cita.nombre;
  document.getElementById("dni").value    = cita.dni;
  document.getElementById("fecha").value  = cita.fecha;

  // Cargar especialidad y médico
  const selectEsp = document.getElementById("especialidad");
  selectEsp.value = cita.especialidad;
  selectEsp.dispatchEvent(new Event("change"));

  setTimeout(() => {
    document.getElementById("medico").value = cita.medico;
    document.getElementById("hora").value   = cita.hora;
  }, 50);

  // Cambiar botón a modo edición
  const btn = document.querySelector(".form-footer .btn-primary");
  btn.textContent = "💾 Actualizar Cita";
  btn.onclick = actualizarCita;
  btn.classList.add("btn-editando");

  // Mostrar botón cancelar
  document.getElementById("btn-cancelar").style.display = "block";

  // Mostrar indicador de edición
  document.getElementById("mensaje").textContent = `✏️ Editando cita de ${cita.nombre} — modifica los datos y guarda.`;
  document.getElementById("mensaje").className = "mensaje editando";

  // Scroll al formulario
  document.querySelector(".card").scrollIntoView({ behavior: "smooth", block: "start" });
}

function actualizarCita() {
  if (!validarCita()) return;

  const nombre       = document.getElementById("nombre").value.trim();
  const dni          = document.getElementById("dni").value.trim();
  const especialidad = document.getElementById("especialidad").value;
  const medico       = document.getElementById("medico").value;
  const fecha        = document.getElementById("fecha").value;
  const hora         = document.getElementById("hora").value;

  const cita = citas.find(c => c.id === citaEditandoId);
  if (!cita) return;

  cita.nombre       = nombre;
  cita.dni          = dni;
  cita.especialidad = especialidad;
  cita.medico       = medico;
  cita.fecha        = fecha;
  cita.hora         = hora;

  guardarDatos();
  renderTabla();
  actualizarEstadisticas();
  cancelarEdicion();
  mostrarToast("✏️", "Cita actualizada", `${nombre} · ${especialidad}`, "exito");
}

function cancelarEdicion() {
  citaEditandoId = null;
  limpiarFormularioCita();

  const btn = document.querySelector(".form-footer .btn-primary");
  btn.textContent = "📅 Registrar Cita";
  btn.onclick = registrarCita;
  btn.classList.remove("btn-editando");

  document.getElementById("btn-cancelar").style.display = "none";
  document.getElementById("mensaje").className = "mensaje oculto";
}

function limpiarFormularioCita() {
  ["nombre","dni","fecha"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("especialidad").value = "";
  document.getElementById("hora").value = "";
  document.getElementById("medico").innerHTML = `<option value="">-- Seleccionar especialidad primero --</option>`;
}

// ─── Registrar Ticket ─────────────────────────────────────────────
function registrarTicket() {
  if (!validarTicket()) return;

  const paciente  = document.getElementById("ticket-paciente").value.trim();
  const motivo    = document.getElementById("ticket-motivo").value.trim();
  const prioridad = document.getElementById("ticket-prioridad").value;

  contadorTickets++;
  tickets.push({ id: contadorTickets, paciente, motivo, prioridad, atendido: false, hora: horaActual() });
  guardarDatos();

  renderTickets();
  actualizarEstadisticas();
  verificarAlertas();
  actualizarCampana();
  limpiarFormularioTicket();
  mostrarMensaje("mensajeTicket", "exito", `✅ Ticket #${contadorTickets} generado para ${paciente}.`);
  const iconoToast = prioridad === "emergencia" ? "🚨" : prioridad === "urgente" ? "⚠️" : "🎫";
  mostrarToast(iconoToast, `Ticket ${prioridad}`, `${paciente} — ${motivo.substring(0,40)}`, prioridad === "normal" ? "exito" : prioridad);
}

function renderTickets() {
  const lista    = document.getElementById("listaTickets");
  const contador = document.getElementById("contadorTickets");
  contador.textContent = `${tickets.length} ticket${tickets.length !== 1 ? "s" : ""}`;

  if (tickets.length === 0) {
    lista.innerHTML = `<div class="empty-tickets">No hay tickets registrados aún</div>`;
    return;
  }

  lista.innerHTML = tickets.map(t => `
    <div class="ticket-item ${t.prioridad} ${t.atendido ? "atendido" : ""}">
      <div class="ticket-info">
        <h4>Ticket #${t.id} — ${t.paciente}</h4>
        <p>${t.motivo}</p>
        <p style="font-size:11px;color:#888;margin-top:4px;">🕐 ${t.hora}</p>
      </div>
      <div class="ticket-meta">
        <span class="prioridad-badge prioridad-${t.prioridad}">
          ${t.prioridad.charAt(0).toUpperCase() + t.prioridad.slice(1)}
        </span>
        <button class="ticket-estado-btn" onclick="marcarAtendido(${t.id})">
          ${t.atendido ? "✓ Atendido" : "Marcar atendido"}
        </button>
        <button class="btn-imprimir" onclick="imprimirTicket(${t.id})" title="Imprimir ticket">🖨️</button>
      </div>
    </div>
  `).join("");
}

function marcarAtendido(id) {
  const t = tickets.find(t => t.id === id);
  if (t) { t.atendido = !t.atendido; guardarDatos(); renderTickets(); actualizarEstadisticas(); verificarAlertas(); actualizarCampana(); }
}

function limpiarFormularioTicket() {
  document.getElementById("ticket-paciente").value = "";
  document.getElementById("ticket-motivo").value   = "";
  document.getElementById("ticket-prioridad").value = "normal";
}

// ─── ESTADÍSTICAS ─────────────────────────────────────────────────
function actualizarEstadisticas() {
  animarNumero("stat-total",       citas.length);
  animarNumero("stat-confirmadas", citas.filter(c => c.estado === "confirmada").length);
  animarNumero("stat-pendientes",  citas.filter(c => c.estado === "pendiente").length);
  animarNumero("stat-tickets",     tickets.filter(t => !t.atendido).length);
  animarNumero("stat-urgentes",    tickets.filter(t => !t.atendido && (t.prioridad === "urgente" || t.prioridad === "emergencia")).length);
}

function animarNumero(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const actual = parseInt(el.textContent) || 0;
  if (actual === target) return;
  const paso = target > actual ? 1 : -1;
  let val = actual;
  const iv = setInterval(() => { val += paso; el.textContent = val; if (val === target) clearInterval(iv); }, 30);
}

// ─── ALERTAS ─────────────────────────────────────────────────────
function verificarAlertas() {
  const zona = document.getElementById("zona-alertas");
  zona.innerHTML = "";
  tickets.filter(t => !t.atendido).forEach(t => {
    if (t.prioridad === "emergencia")
      zona.innerHTML += `<div class="alerta alerta-emergencia">🚨 <strong>EMERGENCIA:</strong> ${t.paciente} — ${t.motivo}</div>`;
    else if (t.prioridad === "urgente")
      zona.innerHTML += `<div class="alerta alerta-urgente">⚠️ <strong>Urgente:</strong> ${t.paciente} — ${t.motivo}</div>`;
  });
}

// ─── BÚSQUEDA ─────────────────────────────────────────────────────
function buscarPaciente() {
  const query = document.getElementById("buscador").value.trim().toLowerCase();
  const resultado = document.getElementById("resultado-busqueda");
  if (!query) { resultado.innerHTML = ""; return; }

  const encontradas = citas.filter(c =>
    c.nombre.toLowerCase().includes(query) || c.dni.includes(query)
  );

  resultado.innerHTML = encontradas.length === 0
    ? `<div class="sin-resultados">No se encontraron citas para "<strong>${query}</strong>"</div>`
    : `<div class="resultado-card">
        <h4>🔍 ${encontradas.length} resultado(s) para "${query}"</h4>
        <table>${encontradas.map(c => `
          <tr>
            <td><strong>${c.nombre}</strong></td>
            <td>DNI: ${c.dni}</td>
            <td>${c.especialidad}</td>
            <td>${formatFecha(c.fecha)} ${c.hora}</td>
            <td><span class="estado estado-${c.estado}">${c.estado}</span></td>
          </tr>`).join("")}
        </table>
      </div>`;
  renderTabla(encontradas);
}

function limpiarBusqueda() {
  document.getElementById("buscador").value = "";
  document.getElementById("resultado-busqueda").innerHTML = "";
  renderTabla();
}

// ─── Utilidades ───────────────────────────────────────────────────
function mostrarMensaje(id, tipo, texto) {
  const el = document.getElementById(id);
  el.textContent = texto;
  el.className   = `mensaje ${tipo}`;
  setTimeout(() => { el.className = "mensaje oculto"; }, 3500);
}

function formatFecha(f) {
  const [y,m,d] = f.split("-"); return `${d}/${m}/${y}`;
}

function horaActual() {
  return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

// ─── Imprimir Ticket Individual ───────────────────────────────────
function imprimirTicket(id) {
  const t = tickets.find(t => t.id === id);
  if (!t) return;

  const colorPrioridad = {
    normal:     { bg: "#e8f0fb", color: "#0056b3", label: "Normal" },
    urgente:    { bg: "#fff3cd", color: "#856404", label: "Urgente" },
    emergencia: { bg: "#f8d7da", color: "#721c24", label: "EMERGENCIA" },
  };

  const cp = colorPrioridad[t.prioridad];
  const fecha = new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
  const hora  = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });

  const ventana = window.open("", "_blank", "width=480,height=640");
  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Ticket #${t.id} - Hospital Regional</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: #f0f4f8;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 24px;
          min-height: 100vh;
        }
        .ticket {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
          overflow: hidden;
        }
        .ticket-header {
          background: linear-gradient(135deg, #003d82, #0056b3);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .ticket-header img {
          width: 56px;
          height: 56px;
          object-fit: contain;
          background: white;
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 10px;
        }
        .ticket-header h2 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .ticket-header p {
          font-size: 12px;
          opacity: 0.8;
        }
        .ticket-numero {
          background: #f0f4f8;
          text-align: center;
          padding: 20px;
          border-bottom: 2px dashed #dee2e6;
        }
        .ticket-numero span {
          font-size: 48px;
          font-weight: 800;
          color: #003d82;
          display: block;
          line-height: 1;
        }
        .ticket-numero small {
          font-size: 13px;
          color: #666;
          margin-top: 4px;
          display: block;
        }
        .ticket-body {
          padding: 20px;
        }
        .ticket-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 10px 0;
          border-bottom: 1px solid #f0f4f8;
          gap: 12px;
        }
        .ticket-row:last-child { border-bottom: none; }
        .ticket-row label {
          font-size: 11px;
          font-weight: 700;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        .ticket-row span {
          font-size: 14px;
          color: #333;
          font-weight: 500;
          text-align: right;
        }
        .prioridad-badge {
          display: inline-block;
          background: ${cp.bg};
          color: ${cp.color};
          font-size: 13px;
          font-weight: 700;
          padding: 4px 14px;
          border-radius: 20px;
        }
        .ticket-estado {
          text-align: center;
          padding: 12px 20px;
          background: ${t.atendido ? "#d4edda" : "#fff3cd"};
          color: ${t.atendido ? "#155724" : "#856404"};
          font-size: 13px;
          font-weight: 700;
        }
        .ticket-footer {
          background: #003d82;
          color: rgba(255,255,255,0.7);
          text-align: center;
          padding: 12px;
          font-size: 11px;
        }
        .btn-imprimir-real {
          display: block;
          width: calc(100% - 48px);
          margin: 16px auto;
          background: linear-gradient(135deg, #003d82, #0056b3);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }
        @media print {
          body { background: white; padding: 0; }
          .btn-imprimir-real { display: none; }
          .ticket { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div>
        <div class="ticket">
          <div class="ticket-header">
            <img src="../../global/images/logo.jpg" alt="Logo Hospital">
            <h2>Hospital Regional</h2>
            <p>Eleazar Guzmán Barrón</p>
          </div>

          <div class="ticket-numero">
            <span>#${String(t.id).padStart(3, "0")}</span>
            <small>Ticket de Atención</small>
          </div>

          <div class="ticket-body">
            <div class="ticket-row">
              <label>Paciente</label>
              <span>${t.paciente}</span>
            </div>
            <div class="ticket-row">
              <label>Motivo</label>
              <span>${t.motivo}</span>
            </div>
            <div class="ticket-row">
              <label>Prioridad</label>
              <span><span class="prioridad-badge">${cp.label}</span></span>
            </div>
            <div class="ticket-row">
              <label>Fecha</label>
              <span>${fecha}</span>
            </div>
            <div class="ticket-row">
              <label>Hora emisión</label>
              <span>${hora}</span>
            </div>
          </div>

          <div class="ticket-estado">
            ${t.atendido ? "✅ Atendido" : "⏳ En espera de atención"}
          </div>

          <div class="ticket-footer">
            © 2026 Hospital Regional Eleazar Guzmán Barrón · CRM por Royser
          </div>
        </div>

        <button class="btn-imprimir-real" onclick="window.print()">🖨️ Imprimir Ticket</button>
      </div>
    </body>
    </html>
  `);
  ventana.document.close();
}


// =============================================
//  EFECTO 3D EN CARDS DE ESTADÍSTICAS
// =============================================
function init3DCards() {
  document.querySelectorAll(".stat-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect    = card.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const cx      = rect.width  / 2;
      const cy      = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -12;
      const rotateY = ((x - cx) / cx) *  12;
      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// =============================================
function toggleDarkMode() {
  const body = document.body;
  const btn  = document.getElementById("btn-dark");
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  btn.textContent = isDark ? "☀️" : "🌙";
  btn.title = isDark ? "Modo claro" : "Modo oscuro";
  localStorage.setItem("crm_dark_mode", isDark ? "1" : "0");
}

// Cargar preferencia guardada
(function() {
  if (localStorage.getItem("crm_dark_mode") === "1") {
    document.body.classList.add("dark");
    const btn = document.getElementById("btn-dark");
    if (btn) { btn.textContent = "☀️"; btn.title = "Modo claro"; }
  }
})();

// =============================================
//  NOTIFICACIONES — Toast + Campana + Parpadeo
// =============================================

// ─── TOAST ────────────────────────────────────────────────────────
function mostrarToast(icono, titulo, subtitulo, tipo = "exito") {
  const container = document.getElementById("toast-container");
  const id = "toast-" + Date.now();

  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;
  toast.id = id;
  toast.innerHTML = `
    <span class="toast-icono">${icono}</span>
    <div class="toast-texto">
      <strong>${titulo}</strong>
      <span>${subtitulo}</span>
    </div>
    <button class="toast-cerrar" onclick="cerrarToast('${id}')">✕</button>
  `;

  container.appendChild(toast);
  setTimeout(() => cerrarToast(id), 4000);
}

function cerrarToast(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ─── CAMPANA ──────────────────────────────────────────────────────
function toggleCampana() {
  const dropdown = document.getElementById("campana-dropdown");
  dropdown.classList.toggle("oculto");
}

// Cierra campana si hace clic fuera
document.addEventListener("click", function(e) {
  const wrapper = document.querySelector(".campana-wrapper");
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById("campana-dropdown").classList.add("oculto");
  }
});

function actualizarCampana() {
  const activos = tickets.filter(t => !t.atendido && (t.prioridad === "urgente" || t.prioridad === "emergencia"));
  const badge   = document.getElementById("campana-badge");
  const lista   = document.getElementById("campana-lista");

  if (activos.length === 0) {
    badge.classList.add("oculto");
    lista.innerHTML = `<div class="campana-vacia">Sin alertas activas 🎉</div>`;
  } else {
    badge.classList.remove("oculto");
    badge.textContent = activos.length;
    lista.innerHTML = activos.map(t => `
      <div class="campana-item">
        <span class="campana-item-icono">${t.prioridad === "emergencia" ? "🚨" : "⚠️"}</span>
        <div class="campana-item-texto">
          <strong>${t.paciente}</strong>
          <span>${t.motivo.substring(0, 50)}${t.motivo.length > 50 ? "..." : ""}</span>
        </div>
      </div>
    `).join("");
  }
}
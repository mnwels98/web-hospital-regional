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
      <td><button class="btn-eliminar" onclick="eliminarCita(${c.id})">🗑️</button></td>
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
  limpiarFormularioTicket();
  mostrarMensaje("mensajeTicket", "exito", `✅ Ticket #${contadorTickets} generado para ${paciente}.`);
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
      </div>
    </div>
  `).join("");
}

function marcarAtendido(id) {
  const t = tickets.find(t => t.id === id);
  if (t) { t.atendido = !t.atendido; guardarDatos(); renderTickets(); actualizarEstadisticas(); verificarAlertas(); }
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
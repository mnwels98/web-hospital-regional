// =============================================
//  citas.js — Módulo CRM Citas
//  Hospital Regional Eleazar Guzmán Barrón
//  Desarrollado por: Royser · feature-citas
// =============================================

// Médicos por especialidad
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

// Datos en memoria
let citas   = [];
let tickets = [];
let contadorCitas   = 0;
let contadorTickets = 0;

// ─── Inicialización ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Fecha mínima = hoy
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fecha").min = hoy;

  // Médicos según especialidad
  document.getElementById("especialidad").addEventListener("change", function () {
    const selectMedico = document.getElementById("medico");
    const medicos = medicosPorEspecialidad[this.value] || [];
    selectMedico.innerHTML = medicos.length
      ? medicos.map(m => `<option>${m}</option>`).join("")
      : `<option value="">-- Seleccionar especialidad primero --</option>`;
  });
});

// ─── Registrar Cita ───────────────────────────────────────────────
function registrarCita() {
  const nombre       = document.getElementById("nombre").value.trim();
  const dni          = document.getElementById("dni").value.trim();
  const especialidad = document.getElementById("especialidad").value;
  const medico       = document.getElementById("medico").value;
  const fecha        = document.getElementById("fecha").value;
  const hora         = document.getElementById("hora").value;
  const msg          = document.getElementById("mensaje");

  // Validación
  if (!nombre || !dni || !especialidad || !medico || !fecha || !hora) {
    mostrarMensaje(msg, "error", "⚠️ Por favor completa todos los campos.");
    return;
  }

  if (!/^\d{8}$/.test(dni)) {
    mostrarMensaje(msg, "error", "⚠️ El DNI debe tener exactamente 8 dígitos.");
    return;
  }

  // Crear cita
  contadorCitas++;
  const cita = { id: contadorCitas, nombre, dni, especialidad, medico, fecha, hora, estado: "pendiente" };
  citas.push(cita);

  renderTabla();
  limpiarFormularioCita();
  mostrarMensaje(msg, "exito", `✅ Cita registrada correctamente para ${nombre}.`);
}

// ─── Renderizar tabla ─────────────────────────────────────────────
function renderTabla() {
  const tbody   = document.getElementById("cuerpoTabla");
  const emptyRow = document.getElementById("emptyRow");
  const contador = document.getElementById("contador");

  contador.textContent = `${citas.length} cita${citas.length !== 1 ? "s" : ""}`;

  if (citas.length === 0) {
    tbody.innerHTML = `<tr class="empty-row" id="emptyRow"><td colspan="8">No hay citas registradas aún</td></tr>`;
    return;
  }

  tbody.innerHTML = citas.map(c => `
    <tr>
      <td><strong>${c.nombre}</strong></td>
      <td>${c.dni}</td>
      <td>${c.especialidad}</td>
      <td>${c.medico}</td>
      <td>${formatFecha(c.fecha)}</td>
      <td>${c.hora}</td>
      <td>
        <span class="estado estado-${c.estado}" onclick="cambiarEstado(${c.id})" style="cursor:pointer" title="Clic para cambiar estado">
          ${c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}
        </span>
      </td>
      <td>
        <button class="btn-eliminar" onclick="eliminarCita(${c.id})" title="Eliminar cita">🗑️</button>
      </td>
    </tr>
  `).join("");
}

// ─── Cambiar estado de cita ───────────────────────────────────────
function cambiarEstado(id) {
  const estados = ["pendiente", "confirmada", "cancelada"];
  const cita = citas.find(c => c.id === id);
  if (!cita) return;
  const idx = estados.indexOf(cita.estado);
  cita.estado = estados[(idx + 1) % estados.length];
  renderTabla();
}

// ─── Eliminar cita ────────────────────────────────────────────────
function eliminarCita(id) {
  if (!confirm("¿Deseas eliminar esta cita?")) return;
  citas = citas.filter(c => c.id !== id);
  renderTabla();
}

// ─── Limpiar formulario cita ──────────────────────────────────────
function limpiarFormularioCita() {
  ["nombre", "dni", "fecha"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("especialidad").value = "";
  document.getElementById("hora").value = "";
  document.getElementById("medico").innerHTML = `<option value="">-- Seleccionar especialidad primero --</option>`;
}

// ─── Registrar Ticket ─────────────────────────────────────────────
function registrarTicket() {
  const paciente  = document.getElementById("ticket-paciente").value.trim();
  const motivo    = document.getElementById("ticket-motivo").value.trim();
  const prioridad = document.getElementById("ticket-prioridad").value;
  const msg       = document.getElementById("mensajeTicket");

  if (!paciente || !motivo) {
    mostrarMensaje(msg, "error", "⚠️ Completa el nombre del paciente y el motivo.");
    return;
  }

  contadorTickets++;
  const ticket = { id: contadorTickets, paciente, motivo, prioridad, atendido: false, hora: horaActual() };
  tickets.push(ticket);

  renderTickets();
  limpiarFormularioTicket();
  mostrarMensaje(msg, "exito", `✅ Ticket #${contadorTickets} generado para ${paciente}.`);
}

// ─── Renderizar tickets ───────────────────────────────────────────
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
        <p style="font-size:11px; color:#888; margin-top:4px;">🕐 ${t.hora}</p>
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

// ─── Marcar ticket como atendido ──────────────────────────────────
function marcarAtendido(id) {
  const ticket = tickets.find(t => t.id === id);
  if (ticket) {
    ticket.atendido = !ticket.atendido;
    renderTickets();
  }
}

// ─── Limpiar formulario ticket ────────────────────────────────────
function limpiarFormularioTicket() {
  document.getElementById("ticket-paciente").value = "";
  document.getElementById("ticket-motivo").value   = "";
  document.getElementById("ticket-prioridad").value = "normal";
}

// ─── Utilidades ───────────────────────────────────────────────────
function mostrarMensaje(el, tipo, texto) {
  el.textContent  = texto;
  el.className    = `mensaje ${tipo}`;
  setTimeout(() => { el.className = "mensaje oculto"; }, 3500);
}

function formatFecha(fechaStr) {
  const [y, m, d] = fechaStr.split("-");
  return `${d}/${m}/${y}`;
}

function horaActual() {
  return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}
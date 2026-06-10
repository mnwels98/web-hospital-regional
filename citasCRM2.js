// =============================================
//  citas.js — Módulo CRM Citas
//  Hospital Regional Eleazar Guzmán Barrón
//  Desarrollado por: Royser · feature-citas
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

let citas   = [];
let tickets = [];
let contadorCitas   = 0;
let contadorTickets = 0;

// ─── Init ─────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fecha").min = hoy;

  document.getElementById("especialidad").addEventListener("change", function () {
    const selectMedico = document.getElementById("medico");
    const medicos = medicosPorEspecialidad[this.value] || [];
    selectMedico.innerHTML = medicos.length
      ? medicos.map(m => `<option>${m}</option>`).join("")
      : `<option value="">-- Seleccionar especialidad primero --</option>`;
    limpiarError("especialidad");
  });

  // Limpiar error al escribir
  ["nombre","dni","fecha","hora"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => limpiarError(id));
    document.getElementById(id).addEventListener("change", () => limpiarError(id));
  });

  ["ticket-paciente","ticket-motivo"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => limpiarError(id));
  });

  actualizarEstadisticas();
});

// ─── VALIDACIONES ─────────────────────────────────────────────────
function validarCita() {
  let valido = true;
  limpiarTodosErrores(["nombre","dni","especialidad","medico","fecha","hora"]);

  const nombre = document.getElementById("nombre").value.trim();
  const dni    = document.getElementById("dni").value.trim();
  const espec  = document.getElementById("especialidad").value;
  const medico = document.getElementById("medico").value;
  const fecha  = document.getElementById("fecha").value;
  const hora   = document.getElementById("hora").value;

  if (!nombre) {
    mostrarError("nombre", "El nombre es obligatorio"); valido = false;
  } else if (nombre.length < 3) {
    mostrarError("nombre", "Mínimo 3 caracteres"); valido = false;
  } else if (/\d/.test(nombre)) {
    mostrarError("nombre", "El nombre no puede contener números"); valido = false;
  }

  if (!dni) {
    mostrarError("dni", "El DNI es obligatorio"); valido = false;
  } else if (!/^\d{8}$/.test(dni)) {
    mostrarError("dni", "El DNI debe tener exactamente 8 dígitos numéricos"); valido = false;
  }

  if (!espec) { mostrarError("especialidad", "Selecciona una especialidad"); valido = false; }
  if (!medico || medico === "-- Seleccionar especialidad primero --") {
    mostrarError("medico", "Selecciona un médico"); valido = false;
  }

  if (!fecha) {
    mostrarError("fecha", "La fecha es obligatoria"); valido = false;
  } else {
    const hoy = new Date().toISOString().split("T")[0];
    if (fecha < hoy) { mostrarError("fecha", "No puedes seleccionar una fecha pasada"); valido = false; }
  }

  if (!hora) { mostrarError("hora", "Selecciona una hora"); valido = false; }

  return valido;
}

function validarTicket() {
  let valido = true;
  limpiarTodosErrores(["ticket-paciente","ticket-motivo"]);

  const paciente = document.getElementById("ticket-paciente").value.trim();
  const motivo   = document.getElementById("ticket-motivo").value.trim();

  if (!paciente) {
    mostrarError("ticket-paciente", "El nombre del paciente es obligatorio"); valido = false;
  } else if (paciente.length < 3) {
    mostrarError("ticket-paciente", "Mínimo 3 caracteres"); valido = false;
  }

  if (!motivo) {
    mostrarError("ticket-motivo", "Describe el motivo de consulta"); valido = false;
  } else if (motivo.length < 10) {
    mostrarError("ticket-motivo", "El motivo debe tener al menos 10 caracteres"); valido = false;
  }

  return valido;
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

function limpiarTodosErrores(ids) {
  ids.forEach(id => limpiarError(id));
}

// ─── Registrar Cita ───────────────────────────────────────────────
function registrarCita() {
  if (!validarCita()) return;

  const nombre       = document.getElementById("nombre").value.trim();
  const dni          = document.getElementById("dni").value.trim();
  const especialidad = document.getElementById("especialidad").value;
  const medico       = document.getElementById("medico").value;
  const fecha        = document.getElementById("fecha").value;
  const hora         = document.getElementById("hora").value;
  const msg          = document.getElementById("mensaje");

  contadorCitas++;
  citas.push({ id: contadorCitas, nombre, dni, especialidad, medico, fecha, hora, estado: "pendiente" });

  renderTabla();
  actualizarEstadisticas();
  limpiarFormularioCita();
  mostrarMensaje(msg, "exito", `✅ Cita #${contadorCitas} registrada para ${nombre}.`);
}

// ─── Tabla ────────────────────────────────────────────────────────
function renderTabla(lista) {
  const data    = lista !== undefined ? lista : citas;
  const tbody   = document.getElementById("cuerpoTabla");
  const contador = document.getElementById("contador");

  contador.textContent = `${citas.length} cita${citas.length !== 1 ? "s" : ""}`;

  if (data.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="8">${lista !== undefined ? "Sin resultados para esta búsqueda" : "No hay citas registradas aún"}</td></tr>`;
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
      <td><button class="btn-eliminar" onclick="eliminarCita(${c.id})" title="Eliminar">🗑️</button></td>
    </tr>
  `).join("");
}

function cambiarEstado(id) {
  const estados = ["pendiente","confirmada","cancelada"];
  const cita = citas.find(c => c.id === id);
  if (!cita) return;
  cita.estado = estados[(estados.indexOf(cita.estado) + 1) % estados.length];
  renderTabla();
  actualizarEstadisticas();
}

function eliminarCita(id) {
  if (!confirm("¿Deseas eliminar esta cita?")) return;
  citas = citas.filter(c => c.id !== id);
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
  const msg       = document.getElementById("mensajeTicket");

  contadorTickets++;
  tickets.push({ id: contadorTickets, paciente, motivo, prioridad, atendido: false, hora: horaActual() });

  renderTickets();
  actualizarEstadisticas();
  verificarAlertas();
  limpiarFormularioTicket();
  mostrarMensaje(msg, "exito", `✅ Ticket #${contadorTickets} generado para ${paciente}.`);
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
  const ticket = tickets.find(t => t.id === id);
  if (ticket) { ticket.atendido = !ticket.atendido; renderTickets(); actualizarEstadisticas(); verificarAlertas(); }
}

function limpiarFormularioTicket() {
  document.getElementById("ticket-paciente").value = "";
  document.getElementById("ticket-motivo").value   = "";
  document.getElementById("ticket-prioridad").value = "normal";
}

// ─── ESTADÍSTICAS ─────────────────────────────────────────────────
function actualizarEstadisticas() {
  const total       = citas.length;
  const confirmadas = citas.filter(c => c.estado === "confirmada").length;
  const pendientes  = citas.filter(c => c.estado === "pendiente").length;
  const activos     = tickets.filter(t => !t.atendido).length;
  const urgentes    = tickets.filter(t => !t.atendido && (t.prioridad === "urgente" || t.prioridad === "emergencia")).length;

  animarNumero("stat-total",       total);
  animarNumero("stat-confirmadas", confirmadas);
  animarNumero("stat-pendientes",  pendientes);
  animarNumero("stat-tickets",     activos);
  animarNumero("stat-urgentes",    urgentes);
}

function animarNumero(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const actual = parseInt(el.textContent) || 0;
  if (actual === target) return;
  const paso = target > actual ? 1 : -1;
  let val = actual;
  const intervalo = setInterval(() => {
    val += paso;
    el.textContent = val;
    if (val === target) clearInterval(intervalo);
  }, 30);
}

// ─── ALERTAS ─────────────────────────────────────────────────────
function verificarAlertas() {
  const zona = document.getElementById("zona-alertas");
  zona.innerHTML = "";

  tickets.filter(t => !t.atendido).forEach(t => {
    if (t.prioridad === "emergencia") {
      zona.innerHTML += `<div class="alerta alerta-emergencia">🚨 <strong>EMERGENCIA:</strong> ${t.paciente} — ${t.motivo}</div>`;
    } else if (t.prioridad === "urgente") {
      zona.innerHTML += `<div class="alerta alerta-urgente">⚠️ <strong>Urgente:</strong> ${t.paciente} — ${t.motivo}</div>`;
    }
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

  if (encontradas.length === 0) {
    resultado.innerHTML = `<div class="sin-resultados">No se encontraron citas para "<strong>${query}</strong>"</div>`;
    renderTabla(encontradas);
    return;
  }

  resultado.innerHTML = `
    <div class="resultado-card">
      <h4>🔍 ${encontradas.length} resultado(s) para "${query}"</h4>
      <table>
        ${encontradas.map(c => `
          <tr>
            <td><strong>${c.nombre}</strong></td>
            <td>DNI: ${c.dni}</td>
            <td>${c.especialidad}</td>
            <td>${formatFecha(c.fecha)} ${c.hora}</td>
            <td><span class="estado estado-${c.estado}">${c.estado}</span></td>
          </tr>
        `).join("")}
      </table>
    </div>
  `;
  renderTabla(encontradas);
}

function limpiarBusqueda() {
  document.getElementById("buscador").value = "";
  document.getElementById("resultado-busqueda").innerHTML = "";
  renderTabla();
}

// ─── Utilidades ───────────────────────────────────────────────────
function mostrarMensaje(el, tipo, texto) {
  el.textContent = texto;
  el.className   = `mensaje ${tipo}`;
  setTimeout(() => { el.className = "mensaje oculto"; }, 3500);
}

function formatFecha(f) {
  const [y,m,d] = f.split("-");
  return `${d}/${m}/${y}`;
}

function horaActual() {
  return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}
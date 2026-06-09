// ============================================================
// app.js — Lógica principal del módulo Historial Clínico
// ============================================================

let pacienteActivo = null;
let tabActiva = 'historial';

document.addEventListener('DOMContentLoaded', () => {
  renderLista(pacientes);
});

// ── Búsqueda ──────────────────────────────────────────────
function filtrarPacientes(q) {
  q = q.toLowerCase().trim();
  const resultado = q
    ? pacientes.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.dni.includes(q) ||
        p.nhc.toLowerCase().includes(q)
      )
    : pacientes;
  renderLista(resultado);
}

function buscar() {
  filtrarPacientes(document.getElementById('searchInput').value);
}

// ── Sidebar ───────────────────────────────────────────────
function renderLista(lista) {
  const contenedor = document.getElementById('listaPacientes');
  if (lista.length === 0) {
    contenedor.innerHTML = `<div style="padding:20px 16px;font-size:13px;color:var(--muted);text-align:center;">Sin resultados</div>`;
    return;
  }
  contenedor.innerHTML = lista.map(p => `
    <div class="patient-item ${pacienteActivo?.id === p.id ? 'active' : ''}"
         onclick="seleccionarPaciente(${p.id})" role="button" tabindex="0">
      <div class="avatar" style="background:${AVATAR_COLORES[p.genero] || AVATAR_COLORES.m}">
        ${p.iniciales}
      </div>
      <div>
        <div class="patient-name">${p.nombre}</div>
        <div class="patient-meta">DNI ${p.dni} · ${p.edad} años</div>
      </div>
      ${p.urgente ? '<span class="tag-urgente">Urgente</span>' : ''}
    </div>
  `).join('');
}

// ── Selección de paciente ─────────────────────────────────
function seleccionarPaciente(id) {
  pacienteActivo = pacientes.find(p => p.id === id);
  tabActiva = 'historial';
  renderLista(pacientes);
  renderDetalle();
}

function cambiarTab(tab) {
  tabActiva = tab;
  renderDetalle();
}

// ── Panel principal ───────────────────────────────────────
function renderDetalle() {
  if (!pacienteActivo) return;
  const p = pacienteActivo;
  document.getElementById('mainPanel').innerHTML = `
    ${renderCabecera(p)}
    ${renderTabs()}
    <div class="content">
      ${tabActiva === 'historial' ? renderTabHistorial(p) : ''}
      ${tabActiva === 'nuevo'     ? renderTabNuevo()      : ''}
      ${tabActiva === 'info'      ? renderTabInfo(p)      : ''}
    </div>
  `;
}

function renderCabecera(p) {
  return `
    <div class="patient-header">
      <div class="avatar-lg" style="background:${AVATAR_COLORES[p.genero] || AVATAR_COLORES.m}">
        ${p.iniciales}
      </div>
      <div>
        <div class="ph-name">${p.nombre}</div>
        <div class="ph-meta">
          <span><i class="ti ti-id-badge" aria-hidden="true"></i> DNI ${p.dni}</span>
          <span><i class="ti ti-file-description" aria-hidden="true"></i> ${p.nhc}</span>
          <span><i class="ti ti-cake" aria-hidden="true"></i> ${p.edad} años</span>
          <span><i class="ti ti-drop" aria-hidden="true"></i> ${p.sangre}</span>
        </div>
      </div>
      <div class="ph-actions">
        <button class="btn-sm" onclick="imprimirHistorial()">
          <i class="ti ti-printer" aria-hidden="true"></i> Imprimir
        </button>
        <button class="btn-sm primary" onclick="cambiarTab('nuevo')">
          <i class="ti ti-plus" aria-hidden="true"></i> Nuevo diagnóstico
        </button>
      </div>
    </div>
  `;
}

function renderTabs() {
  const tabs = [
    { key: 'historial', icon: 'ti-history',     label: 'Historial' },
    { key: 'nuevo',     icon: 'ti-stethoscope', label: 'Nuevo diagnóstico' },
    { key: 'info',      icon: 'ti-user',        label: 'Datos del paciente' },
  ];
  return `
    <div class="tabs" role="tablist">
      ${tabs.map(t => `
        <div class="tab ${tabActiva === t.key ? 'active' : ''}"
             onclick="cambiarTab('${t.key}')" role="tab">
          <i class="ti ${t.icon}" aria-hidden="true"></i> ${t.label}
        </div>
      `).join('')}
    </div>
  `;
}

function renderTabHistorial(p) {
  const alergias = p.alergias.length
    ? p.alergias.map(a => `<span class="alergia-tag">${a}</span>`).join('')
    : '<span style="font-size:12px;color:var(--muted)">Sin alergias registradas</span>';

  const consultas = p.historial.length
    ? p.historial.map(h => `
        <div class="historia-item">
          <div class="hi-head">
            <span class="hi-date">
              <i class="ti ti-calendar-event" aria-hidden="true"></i> ${h.fecha}
            </span>
            ${badgeEstado(h.estado)}
          </div>
          <div class="hi-diag">${h.diag}</div>
          <div class="hi-notas">${h.notas}</div>
          <div class="hi-medico">
            <i class="ti ti-user-circle" aria-hidden="true"></i> ${h.medico}
          </div>
        </div>
      `).join('')
    : `<div class="empty-historial">
         <i class="ti ti-notes-off" aria-hidden="true"></i>
         <p>Sin consultas registradas</p>
       </div>`;

  return `
    <div class="section-label">Alergias</div>
    <div class="alergias-tags" style="margin-bottom:16px;">${alergias}</div>
    <div class="section-label">Historial de consultas (${p.historial.length})</div>
    ${consultas}
  `;
}

function renderTabNuevo() {
  const hoy = new Date().toISOString().slice(0, 10);
  return `
    <div class="section-label">Registrar nueva consulta</div>
    <div class="card">
      <div class="form-row">
        <div class="form-group">
          <label for="f_fecha">Fecha de consulta</label>
          <input type="date" id="f_fecha" value="${hoy}" />
        </div>
        <div class="form-group">
          <label for="f_tipo">Tipo de consulta</label>
          <select id="f_tipo">
            <option>Consulta externa</option>
            <option>Emergencia</option>
            <option>Control</option>
            <option>Post-operatorio</option>
          </select>
        </div>
        <div class="form-group full">
          <label for="f_diag">Diagnóstico principal (CIE-10)</label>
          <input type="text" id="f_diag" placeholder="Ej: Hipertensión arterial estadio II (I10)" />
        </div>
        <div class="form-group full">
          <label for="f_vitales">Signos vitales</label>
          <input type="text" id="f_vitales" placeholder="Ej: PA 130/85, FC 78 lpm, T° 36.8°C" />
        </div>
        <div class="form-group full">
          <label for="f_notas">Notas clínicas y plan de tratamiento</label>
          <textarea id="f_notas" rows="4"
            placeholder="Anamnesis, exploración, plan terapéutico, indicaciones..."></textarea>
        </div>
        <div class="form-group">
          <label for="f_medico">Médico responsable</label>
          <input type="text" id="f_medico" placeholder="Nombre del médico" />
        </div>
        <div class="form-group">
          <label for="f_estado">Estado del caso</label>
          <select id="f_estado">
            <option value="activo">Activo</option>
            <option value="control">En control</option>
            <option value="tratamiento">En tratamiento</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-cancel" onclick="cambiarTab('historial')">Cancelar</button>
        <button class="btn-guardar" onclick="guardarDiagnostico()">
          <i class="ti ti-device-floppy" aria-hidden="true"></i> Guardar registro
        </button>
      </div>
    </div>
  `;
}

function renderTabInfo(p) {
  const alergias = p.alergias.length
    ? p.alergias.map(a => `<span class="alergia-tag">${a}</span>`).join('')
    : '<span style="font-size:12px;color:var(--muted)">Sin alergias registradas</span>';

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <i class="ti ti-user-circle" aria-hidden="true"></i> Información personal
        </div>
      </div>
      <div class="info-grid">
        <div class="info-item"><label>Nombre completo</label><span>${p.nombre}</span></div>
        <div class="info-item"><label>DNI</label><span>${p.dni}</span></div>
        <div class="info-item"><label>N° historia clínica</label><span>${p.nhc}</span></div>
        <div class="info-item"><label>Edad</label><span>${p.edad} años</span></div>
        <div class="info-item"><label>Grupo sanguíneo</label><span>${p.sangre}</span></div>
        <div class="info-item"><label>Teléfono</label><span>${p.telefono}</span></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <i class="ti ti-alert-triangle" aria-hidden="true"></i> Alergias registradas
        </div>
      </div>
      <div class="alergias-tags">${alergias}</div>
    </div>
  `;
}

// ── Guardar diagnóstico ───────────────────────────────────
function guardarDiagnostico() {
  const diag   = document.getElementById('f_diag')?.value.trim();
  const notas  = document.getElementById('f_notas')?.value.trim();
  const medico = document.getElementById('f_medico')?.value.trim();
  const estado = document.getElementById('f_estado')?.value;
  const fecha  = document.getElementById('f_fecha')?.value;

  if (!diag || !medico) {
    alert('Por favor completa el diagnóstico y el médico responsable.');
    return;
  }

  const fechaFmt = new Date(fecha + 'T12:00:00').toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  pacienteActivo.historial.unshift({ fecha: fechaFmt, diag, notas, medico, estado });
  cambiarTab('historial');
}

// ── Extras ────────────────────────────────────────────────
function nuevoPaciente() {
  alert('Función "Nuevo paciente" — conectar con el backend del equipo.');
}

function imprimirHistorial() {
  window.print();
}

function badgeEstado(estado) {
  const mapa = {
    activo:      { clase: 'badge-blue',   texto: 'Activo'         },
    control:     { clase: 'badge-green',  texto: 'En control'     },
    tratamiento: { clase: 'badge-yellow', texto: 'En tratamiento' },
    urgente:     { clase: 'badge-red',    texto: 'Urgente'        },
  };
  const c = mapa[estado] || { clase: 'badge-blue', texto: estado };
  return `<span class="badge ${c.clase}">${c.texto}</span>`;
}
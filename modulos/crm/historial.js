/* =========================================================
   CRM Historial Clínico — Hospital Regional EGB
   historial.js
   ========================================================= */
'use strict';

/* ── Constantes ── */
const AVATAR_COLORS = [
  { bg:'#D6EAF8', text:'#1A5276' }, { bg:'#D5F5E3', text:'#1E8449' },
  { bg:'#FDEBD0', text:'#935116' }, { bg:'#FDEDEC', text:'#A93226' },
  { bg:'#E8DAEF', text:'#6C3483' }, { bg:'#D1F2EB', text:'#0E6655' },
  { bg:'#FAE5D3', text:'#784212' },
];
const SPECIALTIES = ['Medicina Interna','Cardiología','Pediatría','Cirugía','Traumatología','Neurología','Ginecología'];
const BAR_COLORS  = ['#2471A3','#1A5276','#148F77','#D35400','#8E44AD','#CB4335','#117A65'];

/* ── Estado ── */
let patients = [], diagnoses = [];
let selectedPatient = null, editingDiagId = null;
let nextPatId = 1, nextDiagId = 1;

/* =========================================================
   DATOS DE EJEMPLO
   ========================================================= */
function seedData() {
  patients = [
    { id:'P001', nombres:'Carlos Alberto',  apellidos:'Quispe Mendoza',  dni:'45678912', fechaNac:'1978-03-15', sexo:'Masculino', sangre:'O+',  tel:'944123456', especialidad:'Medicina Interna', alergias:'Penicilina',          antecedentes:'Hipertensión arterial desde 2015', colorIdx:0 },
    { id:'P002', nombres:'María Elena',     apellidos:'Torres Castillo', dni:'52341678', fechaNac:'1990-07-22', sexo:'Femenino',  sangre:'A+',  tel:'965234567', especialidad:'Cardiología',      alergias:'',                    antecedentes:'Sin antecedentes relevantes',       colorIdx:1 },
    { id:'P003', nombres:'Juan Roberto',    apellidos:'Flores Vásquez',  dni:'38901234', fechaNac:'1965-11-08', sexo:'Masculino', sangre:'B-',  tel:'977345678', especialidad:'Traumatología',    alergias:'Aspirina, Ibuprofeno', antecedentes:'Fractura de tibia izquierda 2018',  colorIdx:2 },
    { id:'P004', nombres:'Rosa Amelia',     apellidos:'Huanca Paredes',  dni:'61234890', fechaNac:'2001-05-30', sexo:'Femenino',  sangre:'AB+', tel:'988456789', especialidad:'Ginecología',      alergias:'',                    antecedentes:'Sin antecedentes',                  colorIdx:3 },
    { id:'P005', nombres:'Pedro Antonio',   apellidos:'Sánchez Rojas',   dni:'29876543', fechaNac:'1955-01-20', sexo:'Masculino', sangre:'O-',  tel:'912567890', especialidad:'Neurología',        alergias:'Morfina',             antecedentes:'Diabetes tipo 2, Hipertensión',     colorIdx:4 },
    { id:'P006', nombres:'Lucía Fernanda',  apellidos:'Ramos Cárdenas',  dni:'73456123', fechaNac:'1985-09-12', sexo:'Femenino',  sangre:'B+',  tel:'956789012', especialidad:'Pediatría',         alergias:'',                    antecedentes:'Asma bronquial leve',               colorIdx:5 },
    { id:'P007', nombres:'Marco Antonio',   apellidos:'Díaz Espinoza',   dni:'60123456', fechaNac:'1972-04-05', sexo:'Masculino', sangre:'A-',  tel:'933210987', especialidad:'Cirugía',           alergias:'Latex',               antecedentes:'Apendicectomía 2019',               colorIdx:6 },
  ];
  diagnoses = [
    { id:'D001', patId:'P001', fecha:'2025-11-10', diagnostico:'Hipertensión arterial controlada',         tratamiento:'Enalapril 10mg c/12h',                        notas:'PA 130/85, mejora progresiva. Dieta baja en sodio.',       medico:'Dr. Rafael Torres',  especialidad:'Medicina Interna', estado:'Activo'         },
    { id:'D002', patId:'P001', fecha:'2025-08-22', diagnostico:'Cefalea tensional',                        tratamiento:'Paracetamol 500mg c/8h por 3 días',           notas:'Episodios recurrentes por estrés laboral.',                medico:'Dr. Rafael Torres',  especialidad:'Medicina Interna', estado:'Resuelto'       },
    { id:'D003', patId:'P002', fecha:'2025-12-01', diagnostico:'Taquicardia supraventricular paroxística', tratamiento:'Metoprolol 25mg c/24h',                       notas:'ECG confirma arritmia. Control en 30 días.',               medico:'Dra. Carmen Vidal',  especialidad:'Cardiología',      estado:'Activo'         },
    { id:'D004', patId:'P003', fecha:'2025-10-15', diagnostico:'Fractura de clavícula derecha',            tratamiento:'Cabestrillo + Tramadol 50mg c/8h',            notas:'Caída de altura. Rx: fractura completa. Reevaluar 6 sem.',  medico:'Dr. Luis Barrera',   especialidad:'Traumatología',   estado:'En seguimiento' },
    { id:'D005', patId:'P005', fecha:'2025-12-05', diagnostico:'Diabetes mellitus tipo 2 descompensada',   tratamiento:'Metformina 850mg c/12h + dieta',              notas:'Glucosa: 245 mg/dl. HbA1c: 9.2%.',                        medico:'Dr. Rafael Torres',  especialidad:'Neurología',       estado:'Activo'         },
    { id:'D006', patId:'P006', fecha:'2025-11-20', diagnostico:'Crisis asmática leve',                     tratamiento:'Salbutamol inhalador 2 puff c/6h',            notas:'SpO2 95%. Mejoría tras broncodilatador.',                  medico:'Dra. Ana Solis',     especialidad:'Pediatría',        estado:'Resuelto'       },
    { id:'D007', patId:'P007', fecha:'2025-12-10', diagnostico:'Hernia inguinal derecha',                  tratamiento:'Programar hernioplastía',                     notas:'Sin complicaciones agudas. Cirugía electiva.',             medico:'Dr. Marcos León',    especialidad:'Cirugía',          estado:'En seguimiento' },
  ];
  nextPatId = 8; nextDiagId = 8;

  /* Compartir datos con dashboard.html via sessionStorage */
  syncStorage();
}

function syncStorage() {
  try {
    sessionStorage.setItem('egb_patients',  JSON.stringify(patients));
    sessionStorage.setItem('egb_diagnoses', JSON.stringify(diagnoses));
  } catch(e) {}
}

/* =========================================================
   UTILIDADES
   ========================================================= */
function calcAge(iso) {
  const b = new Date(iso), n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a;
}
function initials(p)    { return (p.nombres[0] + p.apellidos[0]).toUpperCase(); }
function avatarColor(p) { return AVATAR_COLORS[p.colorIdx % AVATAR_COLORS.length]; }
function newPatientId() { return 'P' + String(nextPatId++).padStart(3,'0'); }
function newDiagId()    { return 'D' + String(nextDiagId++).padStart(3,'0'); }
function today()        { return new Date().toISOString().split('T')[0]; }

function showToast(msg) {
  const el = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  el.style.display = 'flex';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = 'none'; }, 2800);
}
function showAlert(id, msg, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}">
    <i class="ti ti-${type==='error'?'alert-circle':'check'}"></i>${msg}</div>`;
  setTimeout(() => { el.innerHTML = ''; }, 4000);
}
function estadoBadge(e) {
  return { 'Activo':'badge-warn','En seguimiento':'badge-info','Resuelto':'badge-success' }[e] || 'badge-gray';
}

/* =========================================================
   FILTRADO
   ========================================================= */
function getFiltered() {
  const q   = document.getElementById('searchInput').value.trim().toLowerCase();
  const esp = document.getElementById('filterEsp').value;
  return patients.filter(p => {
    const h = `${p.nombres} ${p.apellidos} ${p.dni} ${p.id}`.toLowerCase();
    return (!q || h.includes(q)) && (!esp || p.especialidad === esp);
  });
}

/* =========================================================
   RENDER: LISTA
   ========================================================= */
function renderPatientsList() {
  const c = document.getElementById('patientsList');
  const list = getFiltered();
  if (!list.length) {
    c.innerHTML = `<div class="empty-state animate-fade-in">
      <i class="ti ti-mood-empty"></i><p>No se encontraron pacientes</p></div>`;
    return;
  }
  c.innerHTML = list.map((p, idx) => {
    const age   = calcAge(p.fechaNac);
    const dc    = diagnoses.filter(d => d.patId === p.id).length;
    const sel   = selectedPatient && selectedPatient.id === p.id;
    const col   = avatarColor(p);
    return `<div class="patient-card ${sel?'selected':''}"
      onclick="selectPatient('${p.id}')"
      style="animation-delay:${idx*40}ms">
      <div class="pc-header">
        <div class="pc-avatar" style="background:${col.bg};color:${col.text};">${initials(p)}</div>
        <div>
          <div class="pc-name">${p.nombres} ${p.apellidos}</div>
          <div class="pc-id">HC: ${p.id} &middot; DNI: ${p.dni}</div>
        </div>
      </div>
      <div class="pc-meta">
        <span class="badge badge-info">${p.especialidad}</span>
        <span class="badge badge-gray">${age} años &middot; ${p.sexo[0]}</span>
        <span class="badge badge-warn">🩸 ${p.sangre}</span>
        ${dc>0?`<span class="badge badge-success">${dc} consulta${dc>1?'s':''}</span>`:''}
      </div>
    </div>`;
  }).join('');
}

/* =========================================================
   RENDER: DETALLE
   ========================================================= */
function renderDetail() {
  const area = document.getElementById('detailArea');
  if (!selectedPatient) {
    area.innerHTML = `<div class="empty-state animate-fade-in">
      <div class="empty-icon-wrap"><i class="ti ti-user-search"></i></div>
      <p>Selecciona un paciente</p></div>`;
    return;
  }
  const p    = selectedPatient;
  const age  = calcAge(p.fechaNac);
  const col  = avatarColor(p);
  const diags = diagnoses.filter(d => d.patId === p.id).sort((a,b) => b.fecha.localeCompare(a.fecha));

  area.innerHTML = `
  <div class="detail-panel animate-scale-in">
    <div class="detail-header">
      <div class="detail-avatar" style="background:${col.bg};color:${col.text};">${initials(p)}</div>
      <div>
        <div class="detail-name">${p.nombres} ${p.apellidos}</div>
        <div class="detail-meta">HC: ${p.id} &middot; DNI: ${p.dni} &middot; ${p.sexo} &middot; ${age} años &middot; ${p.sangre}</div>
        <div class="detail-meta" style="margin-top:4px;">
          <i class="ti ti-phone" style="font-size:12px;"></i> ${p.tel||'—'}
        </div>
      </div>
      <div class="detail-actions">
        <button class="btn btn-primary btn-sm" onclick="toggleDiagForm()">
          <i class="ti ti-plus"></i> Nueva consulta
        </button>
      </div>
    </div>
    <div class="info-grid">
      <div class="info-card">
        <div class="info-label">Especialidad</div>
        <div class="info-value" style="font-size:12px;">${p.especialidad}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Alergias</div>
        <div class="info-value" style="font-size:12px;color:${p.alergias?'#A93226':'inherit'};">
          ${p.alergias||'Ninguna conocida'}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Consultas</div>
        <div class="info-value">${diags.length}</div>
      </div>
    </div>
    ${p.antecedentes?`<div class="antecedentes-box"><strong>Antecedentes:</strong> ${p.antecedentes}</div>`:''}
    <div id="diagFormWrapper" style="display:none;">${diagFormHtml(p.especialidad)}</div>
    <h3 class="section-title"><i class="ti ti-history"></i> Historial de consultas</h3>
    <div id="timelineContainer">
      ${diags.length===0
        ?`<div class="empty-state"><i class="ti ti-notes"></i><p>Sin consultas registradas</p></div>`
        :diags.map((d,i)=>timelineItemHtml(d, i<diags.length-1, col.text, i)).join('')}
    </div>
  </div>`;
}

function diagFormHtml(defEsp) {
  const opts = SPECIALTIES.map(s=>`<option value="${s}" ${s===defEsp?'selected':''}>${s}</option>`).join('');
  return `<div class="new-diag-form">
    <h3><i class="ti ti-stethoscope" style="color:#2471A3;"></i>
      <span id="diagFormTitle">Nueva consulta</span></h3>
    <input type="hidden" id="editDiagId"/>
    <div class="form-row">
      <div class="form-group">
        <label>Fecha de consulta *</label>
        <input type="date" id="diag_fecha" value="${today()}"/>
      </div>
      <div class="form-group">
        <label>Especialidad</label>
        <select id="diag_esp">${opts}</select>
      </div>
    </div>
    <div class="form-group">
      <label>Diagnóstico *</label>
      <input type="text" id="diag_diag" placeholder="Ej: Hipertensión arterial grado I"/>
    </div>
    <div class="form-group">
      <label>Tratamiento / Medicamentos</label>
      <input type="text" id="diag_trat" placeholder="Ej: Enalapril 10mg c/12h"/>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Estado</label>
        <select id="diag_estado">
          <option value="Activo">Activo</option>
          <option value="En seguimiento">En seguimiento</option>
          <option value="Resuelto">Resuelto</option>
        </select>
      </div>
      <div class="form-group">
        <label>Médico responsable</label>
        <input type="text" id="diag_medico" value="Dr. Rafael Torres"/>
      </div>
    </div>
    <div class="form-group">
      <label>Notas / Observaciones</label>
      <textarea id="diag_notas" placeholder="Observaciones clínicas, próxima cita..."></textarea>
    </div>
    <div class="form-actions">
      <button class="btn btn-success" onclick="saveDiagnosis()">
        <i class="ti ti-device-floppy"></i> Guardar diagnóstico</button>
      <button class="btn" onclick="closeDiagForm()">
        <i class="ti ti-x"></i> Cancelar</button>
    </div>
  </div>`;
}

function timelineItemHtml(d, showLine, dotColor, idx) {
  return `<div class="timeline-item" style="animation-delay:${idx*60}ms">
    <div class="tl-dot-col">
      <div class="tl-dot" style="background:${dotColor};"></div>
      ${showLine?'<div class="tl-line"></div>':''}
    </div>
    <div style="flex:1;margin-bottom:10px;">
      <div class="tl-body">
        <div class="tl-top">
          <span class="tl-date">${d.fecha}</span>
          <span class="badge ${estadoBadge(d.estado)}">${d.estado}</span>
          <span class="badge badge-gray" style="font-size:9px;">${d.especialidad}</span>
        </div>
        <div class="tl-diag">${d.diagnostico}</div>
        ${d.tratamiento?`<div class="tl-trat"><strong>Tratamiento:</strong> ${d.tratamiento}</div>`:''}
        ${d.notas?`<div class="tl-notas">${d.notas}</div>`:''}
        <div class="tl-footer">
          <div class="tl-doctor"><i class="ti ti-user" style="font-size:12px;"></i> ${d.medico}</div>
          <div class="tl-btns">
            <button class="btn btn-sm" onclick="editDiagnosis('${d.id}')">
              <i class="ti ti-edit"></i> Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deleteDiagnosis('${d.id}')"
              aria-label="Eliminar">
              <i class="ti ti-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/* =========================================================
   ACCIONES PACIENTE
   ========================================================= */
function selectPatient(id) {
  selectedPatient = patients.find(p=>p.id===id)||null;
  editingDiagId = null;
  renderPatientsList();
  renderDetail();
}

/* =========================================================
   ACCIONES DIAGNÓSTICO
   ========================================================= */
function toggleDiagForm() {
  const w = document.getElementById('diagFormWrapper');
  if (!w) return;
  if (w.style.display !== 'none') { closeDiagForm(); return; }
  editingDiagId = null;
  document.getElementById('diagFormTitle').textContent = 'Nueva consulta';
  document.getElementById('editDiagId').value = '';
  document.getElementById('diag_fecha').value = today();
  ['diag_diag','diag_trat','diag_notas'].forEach(id=>{ document.getElementById(id).value=''; });
  document.getElementById('diag_estado').value = 'Activo';
  w.style.display = 'block';
  document.getElementById('diag_diag').focus();
}
function closeDiagForm() {
  const w = document.getElementById('diagFormWrapper');
  if (w) w.style.display = 'none';
  editingDiagId = null;
}
function editDiagnosis(id) {
  const d = diagnoses.find(x=>x.id===id); if (!d) return;
  editingDiagId = id;
  const w = document.getElementById('diagFormWrapper');
  w.style.display = 'block';
  document.getElementById('diagFormTitle').textContent = 'Editar consulta';
  document.getElementById('editDiagId').value  = id;
  document.getElementById('diag_fecha').value  = d.fecha;
  document.getElementById('diag_diag').value   = d.diagnostico;
  document.getElementById('diag_trat').value   = d.tratamiento||'';
  document.getElementById('diag_notas').value  = d.notas||'';
  document.getElementById('diag_estado').value = d.estado;
  document.getElementById('diag_medico').value = d.medico;
  document.getElementById('diag_esp').value    = d.especialidad;
  w.scrollIntoView({ behavior:'smooth', block:'start' });
}
function deleteDiagnosis(id) {
  if (!confirm('¿Eliminar esta consulta del historial?')) return;
  diagnoses = diagnoses.filter(d=>d.id!==id);
  syncStorage();
  showToast('Consulta eliminada del historial');
  renderDetail(); renderPatientsList();
}
function saveDiagnosis() {
  const fecha = document.getElementById('diag_fecha').value;
  const diag  = document.getElementById('diag_diag').value.trim();
  if (!fecha||!diag) { showToast('⚠ Completa la fecha y el diagnóstico'); return; }
  const payload = {
    fecha, diagnostico: diag,
    tratamiento: document.getElementById('diag_trat').value.trim(),
    notas:       document.getElementById('diag_notas').value.trim(),
    estado:      document.getElementById('diag_estado').value,
    medico:      document.getElementById('diag_medico').value.trim(),
    especialidad:document.getElementById('diag_esp').value,
  };
  const eid = document.getElementById('editDiagId').value;
  if (eid) {
    const i = diagnoses.findIndex(d=>d.id===eid);
    if (i>=0) diagnoses[i] = {...diagnoses[i],...payload};
    showToast('Consulta actualizada correctamente');
  } else {
    diagnoses.push({ id:newDiagId(), patId:selectedPatient.id, ...payload });
    showToast('Diagnóstico registrado exitosamente');
  }
  syncStorage();
  closeDiagForm(); renderDetail(); renderPatientsList();
}

/* =========================================================
   NUEVO PACIENTE
   ========================================================= */
function saveNewPatient() {
  const nombres   = document.getElementById('np_nombres').value.trim();
  const apellidos = document.getElementById('np_apellidos').value.trim();
  const dni       = document.getElementById('np_dni').value.trim();
  const fechaNac  = document.getElementById('np_fecha_nac').value;
  if (!nombres||!apellidos||!dni||!fechaNac) {
    showAlert('newPatientAlert','Completa los campos obligatorios marcados con *','error'); return; }
  if (!/^\d{8}$/.test(dni)) {
    showAlert('newPatientAlert','El DNI debe tener exactamente 8 dígitos','error'); return; }
  if (patients.find(p=>p.dni===dni)) {
    showAlert('newPatientAlert','Ya existe un paciente con ese DNI','error'); return; }
  const id = newPatientId();
  patients.push({ id, nombres, apellidos, dni, fechaNac,
    sexo:         document.getElementById('np_sexo').value,
    sangre:       document.getElementById('np_sangre').value,
    tel:          document.getElementById('np_tel').value.trim(),
    especialidad: document.getElementById('np_esp').value,
    alergias:     document.getElementById('np_alergias').value.trim(),
    antecedentes: document.getElementById('np_antecedentes').value.trim(),
    colorIdx:     patients.length % AVATAR_COLORS.length,
  });
  syncStorage();
  showAlert('newPatientAlert',`Paciente ${nombres} ${apellidos} registrado con HC: ${id}`,'success');
  clearNewPatientForm();
  showToast('Nuevo paciente registrado');
  setTimeout(() => { switchTab('buscar'); selectPatient(id); }, 1400);
}
function clearNewPatientForm() {
  ['np_nombres','np_apellidos','np_dni','np_tel','np_alergias','np_antecedentes']
    .forEach(id=>{ document.getElementById(id).value=''; });
  document.getElementById('np_fecha_nac').value='';
}
function clearSearch() {
  document.getElementById('searchInput').value='';
  document.getElementById('filterEsp').value='';
  renderPatientsList();
}

/* =========================================================
   RENDER: DASHBOARD RÁPIDO
   ========================================================= */
function renderDashboard() {
  const total   = patients.length;
  const totalD  = diagnoses.length;
  const activos = diagnoses.filter(d=>d.estado==='Activo').length;
  const seguim  = diagnoses.filter(d=>d.estado==='En seguimiento').length;

  const statsData = [
    { icon:'ti-users',     value:total,   label:'Pacientes registrados', color:'#2471A3' },
    { icon:'ti-notes',     value:totalD,  label:'Consultas totales',     color:'#1A5276' },
    { icon:'ti-heartbeat', value:activos, label:'Diagnósticos activos',  color:'#C0392B' },
    { icon:'ti-clock',     value:seguim,  label:'En seguimiento',        color:'#D35400' },
  ];
  document.getElementById('statsGrid').innerHTML = statsData.map((s,i)=>`
    <div class="stat-card" style="animation-delay:${i*80}ms">
      <div class="stat-icon"><i class="ti ${s.icon}" style="color:${s.color};"></i></div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');

  const recent = [...diagnoses].sort((a,b)=>b.fecha.localeCompare(a.fecha)).slice(0,5);
  document.getElementById('recentConsults').innerHTML = recent.length
    ? recent.map(d => {
        const p = patients.find(x=>x.id===d.patId); if(!p) return '';
        const c = avatarColor(p);
        return `<div class="recent-item">
          <div class="recent-avatar" style="background:${c.bg};color:${c.text};">${initials(p)}</div>
          <div style="flex:1;min-width:0;">
            <div class="recent-name">${p.nombres} ${p.apellidos}</div>
            <div class="recent-diag">${d.diagnostico}</div>
          </div>
          <div class="recent-date">${d.fecha}</div>
        </div>`;
      }).join('')
    : '<div class="empty-state"><p>Sin consultas aún</p></div>';

  const espCount = {};
  patients.forEach(p=>{ espCount[p.especialidad]=(espCount[p.especialidad]||0)+1; });
  const maxV = Math.max(...Object.values(espCount),1);
  document.getElementById('specialtyChart').innerHTML = Object.entries(espCount)
    .sort((a,b)=>b[1]-a[1])
    .map(([esp,cnt],i)=>`
      <div class="bar-row">
        <div class="bar-header"><span>${esp}</span><span>${cnt}</span></div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${Math.round(cnt/maxV*100)}%;background:${BAR_COLORS[i%BAR_COLORS.length]};"></div>
        </div>
      </div>`).join('');
}

/* =========================================================
   NAVEGACIÓN
   ========================================================= */
function switchTab(name) {
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  const btn = document.querySelector(`.nav-tab[data-tab="${name}"]`);
  const pan = document.getElementById(`panel-${name}`);
  if (btn) btn.classList.add('active');
  if (pan) pan.classList.add('active');
  if (name==='dashboard-tab') renderDashboard();
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  seedData();
  renderPatientsList();

  document.querySelectorAll('.nav-tab').forEach(t=>{
    t.addEventListener('click', ()=>switchTab(t.dataset.tab));
  });
  document.getElementById('searchInput').addEventListener('input', renderPatientsList);
  document.getElementById('filterEsp').addEventListener('change', renderPatientsList);
  document.getElementById('btnClearSearch').addEventListener('click', clearSearch);
  document.getElementById('btnSaveNewPatient').addEventListener('click', saveNewPatient);
  document.getElementById('btnClearNewPatient').addEventListener('click', clearNewPatientForm);
});
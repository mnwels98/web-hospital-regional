// ============================================================
// datos.js — Datos de ejemplo (mock data)
// Cuando conecten el backend, reemplazar con fetch() a la API
// ============================================================

const AVATAR_COLORES = {
  m: '#1565C0',  // masculino
  f: '#7B1FA2',  // femenino
  o: '#0F6E56',  // otro
};

const pacientes = [
  {
    id: 1, iniciales: 'CM', genero: 'm',
    nombre: 'Carlos Meza Ríos', dni: '45123678', nhc: 'HC-20210045',
    edad: 42, sangre: 'O+', telefono: '943 112 234',
    alergias: ['Penicilina', 'Ibuprofeno'],
    historial: [
      {
        fecha: '05 Jun 2026',
        diag: 'Hipertensión arterial estadio I (I10)',
        notas: 'PA: 150/95 mmHg. Se ajusta dosis de amlodipino 5mg. Control en 4 semanas.',
        medico: 'Dr. Ramos Vega', estado: 'control',
      },
      {
        fecha: '10 Feb 2026',
        diag: 'Diabetes mellitus tipo 2 (E11)',
        notas: 'HbA1c 7.2%. Se inicia metformina 850mg c/12h. Dieta estricta recomendada.',
        medico: 'Dr. Ramos Vega', estado: 'activo',
      },
    ],
  },
  {
    id: 2, iniciales: 'LT', genero: 'f',
    nombre: 'Lucía Torres Peralta', dni: '48991002', nhc: 'HC-20190132',
    edad: 31, sangre: 'A+', telefono: '967 445 891',
    alergias: ['Látex'],
    historial: [
      {
        fecha: '03 Jun 2026',
        diag: 'Gastritis crónica (K29.5)',
        notas: 'Endoscopía confirma H. pylori positivo. Se inicia triple terapia erradicadora por 14 días.',
        medico: 'Dra. Flores Luján', estado: 'tratamiento',
      },
    ],
  },
  {
    id: 3, iniciales: 'JV', genero: 'm',
    nombre: 'José Vásquez Alcántara', dni: '32456789', nhc: 'HC-20170078',
    edad: 65, sangre: 'B-', telefono: '941 887 562',
    alergias: ['Aspirina', 'Morfina', 'Polen'],
    urgente: true,
    historial: [
      {
        fecha: '08 Jun 2026',
        diag: 'Insuficiencia cardíaca congestiva (I50)',
        notas: 'FE 35%. Ingreso por disnea de reposo. Se ajusta furosemida y se solicita ecocardiograma.',
        medico: 'Dr. Paredes Quispe', estado: 'urgente',
      },
      {
        fecha: '15 Ene 2026',
        diag: 'Fibrilación auricular paroxística (I48)',
        notas: 'Holter confirma episodios nocturnos. Se mantiene anticoagulación con rivaroxabán 20mg.',
        medico: 'Dr. Paredes Quispe', estado: 'activo',
      },
    ],
  },
  {
    id: 4, iniciales: 'AR', genero: 'f',
    nombre: 'Ana Rojas Huanca', dni: '51334200', nhc: 'HC-20230201',
    edad: 28, sangre: 'AB+', telefono: '956 001 334',
    alergias: [],
    historial: [
      {
        fecha: '01 Jun 2026',
        diag: 'Anemia ferropénica leve (D50)',
        notas: 'Hb 10.2 g/dL. Se prescribe sulfato ferroso 300mg/día por 3 meses. Dieta rica en hierro.',
        medico: 'Dra. Morales Chávez', estado: 'control',
      },
    ],
  },
];
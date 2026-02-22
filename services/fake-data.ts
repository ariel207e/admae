export const MOCK_USERS = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@example.com',
    rol: 'Administrador',
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'García',
    email: 'maria@example.com',
    rol: 'Usuario',
    estado: 'activo',
  },
];

export const MOCK_DOCUMENTS = [
  {
    id: '1',
    titulo: 'Documento 1',
    fecha: '2024-02-15',
    estado: 'pendiente',
  },
  {
    id: '2',
    titulo: 'Documento 2',
    fecha: '2024-02-14',
    estado: 'aprobado',
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    titulo: 'Documento nuevo',
    descripcion: 'Ha llegado un nuevo documento',
    fecha: new Date(),
    leido: false,
  },
  {
    id: '2',
    titulo: 'Tarea asignada',
    descripcion: 'Te han asignado una nueva tarea',
    fecha: new Date(Date.now() - 3600000),
    leido: true,
  },
];

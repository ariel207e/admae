export interface Entidad {
  id: number;
  nombreCompleto: string;
  sigla: string;
  siglaHR: string;        // exactamente 3 chars
  direccion: string;
  telefono: string;
  nombreContacto: string;
  telefonoContacto: string;
  logoUrl: string;
}

export interface Oficina {
  id: number;
  nombre: string;
  sigla: string;
  parentId: number | null;   // id de la oficina padre (null = raíz)
  entidadId: number;
}

export const TODOS_DOCUMENTOS = [
  'Nota',
  'Informe',
  'Carta',
  'Circular',
  'Memorando',
  'Resolución',
  'Certificación',
] as const;

export type TipoDocumento = (typeof TODOS_DOCUMENTOS)[number];

export const DOCUMENTOS_DEFAULT: TipoDocumento[] = ['Nota', 'Informe', 'Carta'];

export const ROLES = [
  'Administrador',
  'Administrador Local',
  'Funcionario',
  'Ventanilla',
  'Secretaria',
  'Jefe de Oficina',
] as const;

export type Rol = (typeof ROLES)[number];

export interface Usuario {
  id: number;
  nombreUsuario: string;
  nombreCompleto: string;
  carnet: string;
  rol: Rol | '';
  cargo: string;
  oficina: string;             // nombre de la oficina
  oficinaId: number | null;
  entidad: string;             // nombre de la entidad
  entidadId: number | null;
  correo: string;
  mosca: string;               // iniciales (auto-generable)
  activo: boolean;
  cantidadIngresos: number;
  ultimoIngreso: string | null; // ISO date string
  documentosPermitidos: TipoDocumento[];
}

export interface TipoDocumentoAdmin {
  id: number;
  nombre: string;
  abreviatura: string;   // ej: NOT, INF, CRT (max 5 chars, auto-mayúsculas)
  formaCITE: string;     // ej: "MAP-DG-NOT-###-ANNO"
  plantilla: string;     // contenido HTML/texto de la plantilla
}

// Documentos por defecto asignados al crear un usuario según su rol
export type RolDocumentosMap = Partial<Record<Rol, string[]>>; // Rol -> ids de abreviaturas


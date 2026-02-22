'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const BREADCRUMB_LABELS: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  usuarios: 'Usuarios',
  oficinas: 'Oficinas',
  entidades: 'Entidades',
  tipos: 'Tipos',
  bandeja: 'Bandeja',
  entrada: 'Entrada',
  pendientes: 'Pendientes',
  salida: 'Salida',
  archivo: 'Archivo',
  carpetas: 'Carpetas',
  agrupados: 'Agrupados',
  documentos: 'Documentos',
  misdocumentos: 'Mis Documentos',
  crear: 'Crear',
  editar: 'Editar',
  detalle: 'Detalle',
  'libro-de-registros': 'Libro de Registros',
  ventanilla: 'Ventanilla',
  registro: 'Registro',
  listado: 'Listado',
  seguimiento: 'Seguimiento',
  reportes: 'Reportes',
  selector: 'Selector',
  generar: 'Generar',
  busqueda: 'Búsqueda',
};

export function Breadcrumbs() {
  const pathname = usePathname();

  // No mostrar breadcrumbs en login
  if (pathname === '/login') return null;

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replace(/-/g, '-'));

  const breadcrumbs = segments.map((segment, index) => {
    const label = BREADCRUMB_LABELS[segment] || segment;
    const href = '/' + segments.slice(0, index + 1).join('/');
    return { label, href, segment };
  });

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-body">
      <Link href="/" className="hover:text-foreground transition-colors">
        Inicio
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.segment} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4" />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-display">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

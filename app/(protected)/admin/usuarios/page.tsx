'use client';

import { useState, useMemo } from 'react';
import {
  Plus, Search, X, MoreHorizontal,
  LogIn, CalendarDays, ShieldCheck, ShieldOff,
  KeyRound, FileText, Pencil, Users,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UsuarioSheet } from '@/components/admin/UsuarioSheet';
import { DocsPermitidosSheet } from '@/components/admin/DocsPermitidosSheet';
import { UsuarioDrawer } from '@/components/admin/UsuarioDrawer';
import type { Usuario, Entidad, Oficina, TipoDocumento, Rol } from '@/components/admin/types';
import { DOCUMENTOS_DEFAULT } from '@/components/admin/types';

// ─── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_ENTIDADES: Entidad[] = [
  { id: 1, nombreCompleto: 'Ministerio de Administración Pública', sigla: 'MAP', siglaHR: 'MAP', direccion: '', telefono: '', nombreContacto: '', telefonoContacto: '', logoUrl: '' },
  { id: 2, nombreCompleto: 'Contraloría General de la República',  sigla: 'CGR', siglaHR: 'CGR', direccion: '', telefono: '', nombreContacto: '', telefonoContacto: '', logoUrl: '' },
];

const MOCK_OFICINAS: Oficina[] = [
  { id: 1, nombre: 'Dirección General',          sigla: 'DG',   parentId: null, entidadId: 1 },
  { id: 2, nombre: 'Subdirección Administrativa', sigla: 'SDA',  parentId: 1,   entidadId: 1 },
  { id: 3, nombre: 'Dpto. de Tecnología',         sigla: 'TI',   parentId: 2,   entidadId: 1 },
  { id: 7, nombre: 'Contraloría General',          sigla: 'CG',   parentId: null, entidadId: 2 },
  { id: 8, nombre: 'Dpto. de Auditoría Interna',  sigla: 'DAI',  parentId: 7,   entidadId: 2 },
];

const MOCK_USUARIOS: Usuario[] = [
  {
    id: 1, nombreUsuario: 'jperez', nombreCompleto: 'Juan Carlos Pérez Marte',
    carnet: '001-1111111-1', rol: 'Funcionario', cargo: 'Analista de Sistemas',
    oficina: 'Dpto. de Tecnología', oficinaId: 3,
    entidad: 'Ministerio de Administración Pública', entidadId: 1,
    correo: 'jperez@map.gob.do', mosca: 'JCPM',
    activo: true, cantidadIngresos: 142, ultimoIngreso: '2026-02-24T18:30:00Z',
    documentosPermitidos: ['Nota', 'Informe', 'Carta'],
  },
  {
    id: 2, nombreUsuario: 'mgarcia', nombreCompleto: 'María Elena García Rodríguez',
    carnet: '001-2222222-2', rol: 'Jefe de Oficina', cargo: 'Directora de RRHH',
    oficina: 'Subdirección Administrativa', oficinaId: 2,
    entidad: 'Ministerio de Administración Pública', entidadId: 1,
    correo: 'mgarcia@map.gob.do', mosca: 'MEGR',
    activo: true, cantidadIngresos: 88, ultimoIngreso: '2026-02-23T09:10:00Z',
    documentosPermitidos: ['Nota', 'Informe', 'Carta', 'Circular', 'Memorando'],
  },
  {
    id: 3, nombreUsuario: 'cherrera', nombreCompleto: 'Carlos Javier Herrera Soto',
    carnet: '001-3333333-3', rol: 'Administrador Local', cargo: 'Auditor Senior',
    oficina: 'Dpto. de Auditoría Interna', oficinaId: 8,
    entidad: 'Contraloría General de la República', entidadId: 2,
    correo: 'cherrera@cgr.gob.do', mosca: 'CJHS',
    activo: false, cantidadIngresos: 34, ultimoIngreso: '2026-01-15T11:00:00Z',
    documentosPermitidos: ['Nota', 'Informe', 'Carta', 'Resolución'],
  },
  {
    id: 4, nombreUsuario: 'lmartinez', nombreCompleto: 'Laura Sofía Martínez Núñez',
    carnet: '001-4444444-4', rol: 'Secretaria', cargo: 'Técnico Administrativo',
    oficina: 'Dirección General', oficinaId: 1,
    entidad: 'Ministerio de Administración Pública', entidadId: 1,
    correo: 'lmartinez@map.gob.do', mosca: 'LSMN',
    activo: true, cantidadIngresos: 211, ultimoIngreso: '2026-02-24T07:45:00Z',
    documentosPermitidos: ['Nota', 'Informe', 'Carta'],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatFecha(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function AvatarMosca({ mosca, activo }: { mosca: string; activo: boolean }) {
  return (
    <div className={`size-9 rounded-full flex items-center justify-center text-xs font-bold font-mono flex-shrink-0 ${
      activo
        ? 'bg-primary/15 text-primary'
        : 'bg-muted text-muted-foreground'
    }`}>
      {mosca.slice(0, 3)}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(MOCK_USUARIOS);
  const [entidades] = useState<Entidad[]>(MOCK_ENTIDADES);
  const [oficinas] = useState<Oficina[]>(MOCK_OFICINAS);

  const [query, setQuery] = useState('');
  const [entidadFiltro, setEntidadFiltro] = useState('__all__');
  const [oficinaFiltro, setOficinaFiltro] = useState('__all__');

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Usuario | null>(null);
  const [docsTarget, setDocsTarget] = useState<Usuario | null>(null);
  const [docsOpen, setDocsOpen] = useState(false);
  const [drawerTarget, setDrawerTarget] = useState<Usuario | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Oficinas del filtro (dependen de entidad seleccionada)
  const oficinasFiltroDisp = useMemo(() =>
    entidadFiltro === '__all__'
      ? oficinas
      : oficinas.filter((o) => o.entidadId === Number(entidadFiltro)),
    [oficinas, entidadFiltro]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return usuarios.filter((u) => {
      const matchQ = !q || [
        u.nombreUsuario, u.nombreCompleto, u.carnet, u.cargo,
        u.oficina, u.entidad, u.correo, u.mosca,
      ].some((v) => v.toLowerCase().includes(q));
      const matchE = entidadFiltro === '__all__' || u.entidadId === Number(entidadFiltro);
      const matchO = oficinaFiltro === '__all__' || u.oficinaId === Number(oficinaFiltro);
      return matchQ && matchE && matchO;
    });
  }, [usuarios, query, entidadFiltro, oficinaFiltro]);

  const handleSave = (data: Usuario) => {
    setUsuarios((prev) => {
      const exists = prev.some((u) => u.id === data.id);
      return exists ? prev.map((u) => (u.id === data.id ? data : u)) : [data, ...prev];
    });
    setSheetOpen(false);
    setEditTarget(null);
  };

  const toggleActivo = (id: number) => {
    setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, activo: !u.activo } : u));
  };

  const resetPassword = (u: Usuario) => {
    alert(`Contraseña reseteada para: ${u.nombreUsuario}\nContraseña temporal: temporal123`);
  };

  const handleSaveDocs = (docs: TipoDocumento[]) => {
    if (!docsTarget) return;
    setUsuarios((prev) =>
      prev.map((u) => u.id === docsTarget.id ? { ...u, documentosPermitidos: docs } : u)
    );
    setDocsOpen(false);
    setDocsTarget(null);
  };

  const openNew = () => { setEditTarget(null); setSheetOpen(true); };
  const openEdit = (u: Usuario) => { setEditTarget(u); setSheetOpen(true); };
  const openDocs = (u: Usuario) => { setDocsTarget(u); setDocsOpen(true); };
  const openDrawer = (u: Usuario) => { setDrawerTarget(u); setDrawerOpen(true); };

  const activos   = usuarios.filter((u) => u.activo).length;
  const inactivos = usuarios.filter((u) => !u.activo).length;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display leading-tight">Usuarios</h1>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-muted-foreground">{usuarios.length} registrados</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
              {activos} activos
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-muted-foreground/40 inline-block" />
              {inactivos} inactivos
            </span>
          </div>
        </div>
        <Button size="sm" className="gap-1.5 flex-shrink-0" onClick={openNew}>
          <Plus className="size-4" />
          Nuevo usuario
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Buscador */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            id="buscador-usuarios"
            placeholder="Buscar por nombre, usuario, correo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filtro entidad */}
        <Select
          value={entidadFiltro}
          onValueChange={(v) => { setEntidadFiltro(v); setOficinaFiltro('__all__'); }}
        >
          <SelectTrigger id="filtro-entidad-u" className="h-9 text-sm w-[200px]">
            <SelectValue placeholder="Todas las entidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas las entidades</SelectItem>
            {entidades.map((e) => (
              <SelectItem key={e.id} value={String(e.id)}>
                <span className="font-mono text-xs mr-2 text-muted-foreground">{e.siglaHR}</span>
                {e.nombreCompleto}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro oficina */}
        <Select
          value={oficinaFiltro}
          onValueChange={setOficinaFiltro}
          disabled={entidadFiltro === '__all__'}
        >
          <SelectTrigger id="filtro-oficina-u" className="h-9 text-sm w-[200px]">
            <SelectValue placeholder="Todas las oficinas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas las oficinas</SelectItem>
            {oficinasFiltroDisp.map((o) => (
              <SelectItem key={o.id} value={String(o.id)}>
                <span className="font-mono text-xs mr-2 text-muted-foreground">{o.sigla}</span>
                {o.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <Users className="size-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {query || entidadFiltro !== '__all__' || oficinaFiltro !== '__all__'
              ? 'No se encontraron usuarios con los filtros aplicados.'
              : 'No hay usuarios registrados.'}
          </p>
          {!query && entidadFiltro === '__all__' && (
            <Button size="sm" variant="outline" className="mt-4" onClick={openNew}>
              <Plus className="size-3.5 mr-1.5" />
              Agregar primer usuario
            </Button>
          )}
        </Card>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Usuario</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Cargo / Oficina</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Entidad</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden xl:table-cell">Actividad</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estado</th>
                <th className="px-4 py-2.5 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((u) => (
                <tr key={u.id} className={`hover:bg-muted/20 transition-colors group ${!u.activo ? 'opacity-60' : ''}`}>

                  {/* Columna: usuario */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AvatarMosca mosca={u.mosca} activo={u.activo} />
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => openDrawer(u)}
                          className="font-medium font-display text-sm truncate block hover:text-primary hover:underline transition-colors text-left w-full"
                        >
                          {u.nombreCompleto}
                        </button>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground font-mono">@{u.nombreUsuario}</span>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="text-xs text-muted-foreground font-mono">{u.mosca}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{u.correo}</p>
                      </div>
                    </div>
                  </td>

                  {/* Columna: cargo / oficina */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-sm truncate max-w-[160px]">{u.cargo || '—'}</p>
                      {u.rol && (
                        <span className="text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 px-1.5 py-0 rounded-full whitespace-nowrap">
                          {u.rol}
                        </span>
                      )}
                    </div>
                    {u.oficina && (
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {u.oficina}
                      </p>
                    )}
                  </td>

                  {/* Columna: entidad */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs truncate max-w-[160px] block text-muted-foreground">
                      {u.entidad || '—'}
                    </span>
                  </td>

                  {/* Columna: actividad */}
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <LogIn className="size-3 flex-shrink-0" />
                      <span>{u.cantidadIngresos} ingresos</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <CalendarDays className="size-3 flex-shrink-0" />
                      <span>{formatFecha(u.ultimoIngreso)}</span>
                    </div>
                  </td>

                  {/* Columna: estado */}
                  <td className="px-4 py-3">
                    <Badge
                      variant={u.activo ? 'default' : 'secondary'}
                      className={`text-[10px] px-1.5 h-4 ${u.activo ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : ''}`}
                    >
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {u.documentosPermitidos.slice(0, 3).map((d) => (
                        <span key={d} className="text-[9px] bg-muted text-muted-foreground px-1 rounded font-mono">
                          {d.slice(0, 3).toUpperCase()}
                        </span>
                      ))}
                      {u.documentosPermitidos.length > 3 && (
                        <span className="text-[9px] bg-muted text-muted-foreground px-1 rounded">
                          +{u.documentosPermitidos.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Columna: acciones */}
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="size-7 rounded-md flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => openEdit(u)}>
                          <Pencil className="size-3.5 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDocs(u)}>
                          <FileText className="size-3.5 mr-2" />
                          Documentos permitidos
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => resetPassword(u)}>
                          <KeyRound className="size-3.5 mr-2" />
                          Resetear contraseña
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => toggleActivo(u.id)}
                          className={u.activo ? 'text-destructive focus:text-destructive' : 'text-emerald-600 focus:text-emerald-600'}
                        >
                          {u.activo
                            ? <><ShieldOff className="size-3.5 mr-2" />Dar de baja</>
                            : <><ShieldCheck className="size-3.5 mr-2" />Dar de alta</>
                          }
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sheets */}
      <UsuarioSheet
        open={sheetOpen}
        onClose={() => { setSheetOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        usuario={editTarget}
        entidades={entidades}
        oficinas={oficinas}
      />

      <DocsPermitidosSheet
        open={docsOpen}
        onClose={() => { setDocsOpen(false); setDocsTarget(null); }}
        onSave={handleSaveDocs}
        usuario={docsTarget}
      />

      <UsuarioDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setDrawerTarget(null); }}
        usuario={drawerTarget}
      />
    </div>
  );
}

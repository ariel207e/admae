'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, List, GitBranch, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OficinaSheet } from '@/components/admin/OficinaSheet';
import { OficinaTree } from '@/components/admin/OficinaTree';
import { OficinaOrgChart } from '@/components/admin/OficinaOrgChart';
import type { Oficina, Entidad } from '@/components/admin/types';

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ENTIDADES: Entidad[] = [
  {
    id: 1,
    nombreCompleto: 'Ministerio de Administración Pública',
    sigla: 'MAP',
    siglaHR: 'MAP',
    direccion: 'Av. México 2, Santo Domingo',
    telefono: '809-533-4141',
    nombreContacto: 'Juan Pérez',
    telefonoContacto: '809-533-4199',
    logoUrl: '',
  },
  {
    id: 2,
    nombreCompleto: 'Contraloría General de la República',
    sigla: 'CGR',
    siglaHR: 'CGR',
    direccion: 'Calle El Conde 103',
    telefono: '809-687-0100',
    nombreContacto: 'María García',
    telefonoContacto: '809-687-0199',
    logoUrl: '',
  },
];

const MOCK_OFICINAS: Oficina[] = [
  { id: 1,  nombre: 'Dirección General',                sigla: 'DG',    parentId: null, entidadId: 1 },
  { id: 2,  nombre: 'Subdirección Administrativa',      sigla: 'SDA',   parentId: 1,    entidadId: 1 },
  { id: 3,  nombre: 'Subdirección Técnica',             sigla: 'SDT',   parentId: 1,    entidadId: 1 },
  { id: 4,  nombre: 'Dpto. de Recursos Humanos',        sigla: 'RRHH',  parentId: 2,    entidadId: 1 },
  { id: 5,  nombre: 'Dpto. de Finanzas',                sigla: 'FIN',   parentId: 2,    entidadId: 1 },
  { id: 6,  nombre: 'Dpto. de Tecnología',              sigla: 'TI',    parentId: 3,    entidadId: 1 },
  { id: 7,  nombre: 'Contraloría General',              sigla: 'CG',    parentId: null, entidadId: 2 },
  { id: 8,  nombre: 'Dpto. de Auditoría Interna',       sigla: 'DAI',   parentId: 7,    entidadId: 2 },
  { id: 9,  nombre: 'Dpto. de Control Patrimonial',     sigla: 'DCP',   parentId: 7,    entidadId: 2 },
];

type ViewMode = 'lista' | 'arbol' | 'organigrama';

export default function OficinasPage() {
  const [oficinas, setOficinas] = useState<Oficina[]>(MOCK_OFICINAS);
  const [entidades] = useState<Entidad[]>(MOCK_ENTIDADES);

  const [query, setQuery] = useState('');
  const [entidadFiltro, setEntidadFiltro] = useState<string>('__all__');
  const [viewMode, setViewMode] = useState<ViewMode>('lista');

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Oficina | null>(null);

  const entidadMap = useMemo(
    () => new Map(entidades.map((e) => [e.id, e])),
    [entidades]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return oficinas.filter((o) => {
      const matchQuery =
        !q ||
        o.nombre.toLowerCase().includes(q) ||
        o.sigla.toLowerCase().includes(q);
      const matchEntidad =
        entidadFiltro === '__all__' || o.entidadId === Number(entidadFiltro);
      return matchQuery && matchEntidad;
    });
  }, [oficinas, query, entidadFiltro]);

  const handleSave = (data: Oficina) => {
    setOficinas((prev) => {
      const exists = prev.find((o) => o.id === data.id);
      return exists ? prev.map((o) => (o.id === data.id ? data : o)) : [data, ...prev];
    });
    setSheetOpen(false);
    setEditTarget(null);
  };

  const openNew = () => { setEditTarget(null); setSheetOpen(true); };
  const openEdit = (o: Oficina) => { setEditTarget(o); setSheetOpen(true); };

  // Para árbol/organigrama usar solo las oficinas filtradas
  const displayOficinas = viewMode === 'lista' ? filtered : filtered;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display leading-tight">Oficinas</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {oficinas.length} oficinas registradas
          </p>
        </div>
        <Button size="sm" className="gap-1.5 flex-shrink-0" onClick={openNew}>
          <Plus className="size-4" />
          Nueva oficina
        </Button>
      </div>

      {/* Filtros + Vista */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Buscador */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            id="buscador-oficinas"
            placeholder="Buscar por nombre o sigla..."
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

        {/* Select entidad */}
        <Select value={entidadFiltro} onValueChange={setEntidadFiltro}>
          <SelectTrigger id="filtro-entidad" className="h-9 text-sm w-[220px]">
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

        {/* Toggle de vista */}
        <div className="ml-auto flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
          {(
            [
              { mode: 'lista' as ViewMode,      icon: <List className="size-3.5" />,      label: 'Lista' },
              { mode: 'arbol' as ViewMode,       icon: <GitBranch className="size-3.5" />, label: 'Árbol' },
              { mode: 'organigrama' as ViewMode, icon: <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="2" width="6" height="4" rx="1"/><rect x="2" y="18" width="6" height="4" rx="1"/><rect x="16" y="18" width="6" height="4" rx="1"/><line x1="12" y1="6" x2="12" y2="12"/><line x1="5" y1="18" x2="5" y2="12"/><line x1="19" y1="18" x2="19" y2="12"/><line x1="5" y1="12" x2="19" y2="12"/></svg>, label: 'Organigrama' },
            ] as const
          ).map(({ mode, icon, label }) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === mode
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido según vista */}
      {viewMode === 'lista' && (
        filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-sm text-muted-foreground">
              {query || entidadFiltro !== '__all__'
                ? 'No se encontraron resultados para los filtros aplicados.'
                : 'No hay oficinas registradas.'}
            </p>
            {!query && entidadFiltro === '__all__' && (
              <Button size="sm" variant="outline" className="mt-4" onClick={openNew}>
                <Plus className="size-3.5 mr-1.5" />
                Agregar primera oficina
              </Button>
            )}
          </Card>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nombre</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sigla</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Entidad</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Dependencia</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((o) => {
                  const entidad = entidadMap.get(o.entidadId);
                  const padre = o.parentId ? oficinas.find((p) => p.id === o.parentId) : null;
                  return (
                    <tr key={o.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-4 py-2.5 font-medium">{o.nombre}</td>
                      <td className="px-4 py-2.5">
                        <Badge variant="secondary" className="font-mono text-[11px]">
                          {o.sigla}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 hidden md:table-cell">
                        {entidad ? (
                          <span className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                              {entidad.siglaHR}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                              {entidad.nombreCompleto}
                            </span>
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-2.5 hidden lg:table-cell text-xs text-muted-foreground">
                        {padre ? (
                          <span className="flex items-center gap-1">
                            <GitBranch className="size-3" />
                            {padre.nombre}
                          </span>
                        ) : (
                          <span className="italic">Raíz</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => openEdit(o)}
                          className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {viewMode === 'arbol' && (
        <Card className="p-4">
          <OficinaTree oficinas={displayOficinas} entidades={entidades} onEdit={openEdit} />
        </Card>
      )}

      {viewMode === 'organigrama' && (
        <Card className="p-4 overflow-x-auto">
          <OficinaOrgChart oficinas={displayOficinas} entidades={entidades} onEdit={openEdit} />
        </Card>
      )}

      {/* Sheet */}
      <OficinaSheet
        open={sheetOpen}
        onClose={() => { setSheetOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        oficina={editTarget}
        entidades={entidades}
        oficinas={oficinas}
      />
    </div>
  );
}

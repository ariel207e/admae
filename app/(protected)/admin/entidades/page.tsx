'use client';

import { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Upload,
  Phone,
  MapPin,
  User,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EntidadSheet } from '@/components/admin/EntidadSheet';
import type { Entidad } from '@/components/admin/types';

// ─── Datos de ejemplo ────────────────────────────────────────────────────────
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
    direccion: 'Calle El Conde 103, Santo Domingo',
    telefono: '809-687-0100',
    nombreContacto: 'María García',
    telefonoContacto: '809-687-0199',
    logoUrl: '',
  },
  {
    id: 3,
    nombreCompleto: 'Ministerio de Hacienda',
    sigla: 'MH',
    siglaHR: 'MHA',
    direccion: 'Av. México 45, Santiago',
    telefono: '809-687-5131',
    nombreContacto: 'Carlos Herrera',
    telefonoContacto: '809-687-5199',
    logoUrl: '',
  },
];

export default function EntidadesPage() {
  const [entidades, setEntidades] = useState<Entidad[]>(MOCK_ENTIDADES);
  const [query, setQuery] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Entidad | null>(null);
  const [logoUploadTarget, setLogoUploadTarget] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return entidades;
    return entidades.filter(
      (e) =>
        e.nombreCompleto.toLowerCase().includes(q) ||
        e.sigla.toLowerCase().includes(q) ||
        e.siglaHR.toLowerCase().includes(q)
    );
  }, [entidades, query]);

  const handleSave = (data: Entidad) => {
    setEntidades((prev) => {
      const exists = prev.find((e) => e.id === data.id);
      return exists
        ? prev.map((e) => (e.id === data.id ? data : e))
        : [data, ...prev];
    });
    setSheetOpen(false);
    setEditTarget(null);
  };

  const handleLogoUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setEntidades((prev) =>
        prev.map((ent) => (ent.id === id ? { ...ent, logoUrl: result } : ent))
      );
    };
    reader.readAsDataURL(file);
    setLogoUploadTarget(null);
  };

  const openNew = () => {
    setEditTarget(null);
    setSheetOpen(true);
  };

  const openEdit = (e: Entidad) => {
    setEditTarget(e);
    setSheetOpen(true);
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display leading-tight">Entidades</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {entidades.length} entidades registradas
          </p>
        </div>
        <Button size="sm" className="gap-1.5 flex-shrink-0" onClick={openNew}>
          <Plus className="size-4" />
          Nueva entidad
        </Button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          id="buscador-entidades"
          placeholder="Buscar por nombre, sigla..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8 h-9 text-sm max-w-sm"
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

      {/* Lista de entidades */}
      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <Building2 className="size-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {query ? 'No se encontraron resultados para tu búsqueda.' : 'No hay entidades registradas.'}
          </p>
          {!query && (
            <Button size="sm" variant="outline" className="mt-4" onClick={openNew}>
              <Plus className="size-3.5 mr-1.5" />
              Agregar primera entidad
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((entidad) => (
            <Card key={entidad.id} className="p-4 flex flex-col gap-3 group hover:border-primary/40 transition-colors">

              {/* Header de la card */}
              <div className="flex items-start gap-3">
                {/* Logo / Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="size-12 rounded-lg border bg-muted/50 flex items-center justify-center overflow-hidden">
                    {entidad.logoUrl ? (
                      <img
                        src={entidad.logoUrl}
                        alt={`Logo ${entidad.sigla}`}
                        className="size-full object-contain p-0.5"
                      />
                    ) : (
                      <span className="text-base font-bold text-muted-foreground/60 font-mono">
                        {entidad.siglaHR}
                      </span>
                    )}
                  </div>
                  {/* Botón de logo superpuesto */}
                  <label
                    htmlFor={`logo-upload-${entidad.id}`}
                    className="absolute -bottom-1 -right-1 size-5 rounded-full bg-primary flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    title="Cambiar logo"
                  >
                    <Upload className="size-2.5 text-primary-foreground" />
                    <input
                      id={`logo-upload-${entidad.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleLogoUpload(entidad.id, e)}
                    />
                  </label>
                </div>

                {/* Nombre + siglas */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-display font-semibold leading-tight truncate">
                    {entidad.nombreCompleto}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono h-4">
                      {entidad.sigla}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono h-4">
                      HR: {entidad.siglaHR}
                    </Badge>
                  </div>
                </div>

                {/* Botón editar */}
                <button
                  type="button"
                  onClick={() => openEdit(entidad)}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                  title="Editar entidad"
                >
                  <Pencil className="size-3.5" />
                </button>
              </div>

              {/* Detalles */}
              <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border/50 pt-3">
                {entidad.direccion && (
                  <div className="flex items-start gap-1.5">
                    <MapPin className="size-3 flex-shrink-0 mt-0.5" />
                    <span className="truncate">{entidad.direccion}</span>
                  </div>
                )}
                {entidad.telefono && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3 flex-shrink-0" />
                    <span>{entidad.telefono}</span>
                  </div>
                )}
                {entidad.nombreContacto && (
                  <div className="flex items-center gap-1.5">
                    <User className="size-3 flex-shrink-0" />
                    <span className="truncate">
                      {entidad.nombreContacto}
                      {entidad.telefonoContacto && (
                        <span className="text-foreground/50 ml-1">
                          · {entidad.telefonoContacto}
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Acciones visibles */}
              <div className="flex gap-2 pt-1 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-7 text-xs gap-1.5"
                  onClick={() => openEdit(entidad)}
                >
                  <Pencil className="size-3" />
                  Editar
                </Button>
                <label
                  htmlFor={`logo-btn-${entidad.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 h-7 text-xs rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors px-3"
                >
                  <Upload className="size-3" />
                  Subir logo
                  <input
                    id={`logo-btn-${entidad.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLogoUpload(entidad.id, e)}
                  />
                </label>
              </div>

            </Card>
          ))}
        </div>
      )}

      {/* Sheet de creación/edición */}
      <EntidadSheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setEditTarget(null);
        }}
        onSave={handleSave}
        entidad={editTarget}
      />
    </div>
  );
}

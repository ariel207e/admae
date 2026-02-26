'use client';

import { useState, useMemo } from 'react';
import {
  Plus, Search, X, Pencil, Trash2,
  FileText, Shield, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { TipoDocumentoAdmin, Rol, RolDocumentosMap } from '@/components/admin/types';
import { ROLES } from '@/components/admin/types';

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_DOCS: TipoDocumentoAdmin[] = [
  { id: 1, nombre: 'Nota', abreviatura: 'NOT', formaCITE: 'SIGLA-DEP-NOT-###-ANNO', plantilla: 'Plantilla de Nota interna.' },
  { id: 2, nombre: 'Informe', abreviatura: 'INF', formaCITE: 'SIGLA-DEP-INF-###-ANNO', plantilla: 'Plantilla de Informe técnico.' },
  { id: 3, nombre: 'Carta', abreviatura: 'CRT', formaCITE: 'SIGLA-DEP-CRT-###-ANNO', plantilla: 'Plantilla de Carta oficial.' },
  { id: 4, nombre: 'Circular', abreviatura: 'CIR', formaCITE: 'SIGLA-DEP-CIR-###-ANNO', plantilla: 'Plantilla de Circular.' },
  { id: 5, nombre: 'Memorando', abreviatura: 'MEM', formaCITE: 'SIGLA-DEP-MEM-###-ANNO', plantilla: 'Plantilla de Memorando.' },
  { id: 6, nombre: 'Resolución', abreviatura: 'RES', formaCITE: 'SIGLA-DEP-RES-###-ANNO', plantilla: 'Plantilla de Resolución.' },
  { id: 7, nombre: 'Certificación', abreviatura: 'CER', formaCITE: 'SIGLA-DEP-CER-###-ANNO', plantilla: 'Plantilla de Certificación.' },
];

const MOCK_ROL_MAP: RolDocumentosMap = {
  'Administrador': ['NOT', 'INF', 'CRT', 'CIR', 'MEM', 'RES', 'CER'],
  'Administrador Local': ['NOT', 'INF', 'CRT', 'CIR', 'MEM', 'RES'],
  'Funcionario': ['NOT', 'INF', 'CRT'],
  'Ventanilla': ['NOT', 'CRT'],
  'Secretaria': ['NOT', 'INF', 'CRT', 'MEM'],
  'Jefe de Oficina': ['NOT', 'INF', 'CRT', 'CIR', 'MEM', 'RES'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const EMPTY_DOC: Omit<TipoDocumentoAdmin, 'id'> = {
  nombre: '', abreviatura: '', formaCITE: '', plantilla: '',
};

type DocForm = Omit<TipoDocumentoAdmin, 'id'>;

function DocDialog({
  open, onClose, onSave, doc,
  abreviaturas,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (d: DocForm) => void;
  doc?: TipoDocumentoAdmin | null;
  abreviaturas: string[];
}) {
  const [form, setForm] = useState<DocForm>(EMPTY_DOC);
  const [errors, setErrors] = useState<Partial<Record<keyof DocForm, string>>>({});

  useMemo(() => {
    if (open) {
      setForm(doc ? { nombre: doc.nombre, abreviatura: doc.abreviatura, formaCITE: doc.formaCITE, plantilla: doc.plantilla } : EMPTY_DOC);
      setErrors({});
    }
  }, [open, doc]);

  const set = (field: keyof DocForm, val: string) => {
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (!form.abreviatura.trim()) e.abreviatura = 'Requerido';
    else if (
      !doc &&
      abreviaturas.includes(form.abreviatura.toUpperCase())
    ) e.abreviatura = 'La abreviatura ya existe';
    if (!form.formaCITE.trim()) e.formaCITE = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, abreviatura: form.abreviatura.toUpperCase() });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            {doc ? 'Editar Documento' : 'Nuevo Tipo de Documento'}
          </DialogTitle>
          <DialogDescription>
            {doc ? 'Modifica los campos y guarda.' : 'Define un nuevo tipo de documento disponible en el sistema.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="d-nombre" className="text-xs">Nombre *</Label>
            <Input
              id="d-nombre"
              placeholder="Ej: Nota Interna"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              className={`h-8 text-sm ${errors.nombre ? 'border-destructive' : ''}`}
            />
            {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="d-abrev" className="text-xs">Abreviatura * <span className="text-muted-foreground font-normal">(máx. 5 chars)</span></Label>
              <Input
                id="d-abrev"
                placeholder="Ej: NOT"
                maxLength={5}
                value={form.abreviatura}
                onChange={(e) => set('abreviatura', e.target.value.toUpperCase())}
                className={`h-8 text-sm font-mono ${errors.abreviatura ? 'border-destructive' : ''}`}
                disabled={!!doc}
              />
              {errors.abreviatura && <p className="text-xs text-destructive">{errors.abreviatura}</p>}
              {!!doc && <p className="text-xs text-muted-foreground">No editable</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="d-cite" className="text-xs">Forma CITE *</Label>
              <Input
                id="d-cite"
                placeholder="Ej: SIGLA-DEP-NOT-###-ANNO"
                value={form.formaCITE}
                onChange={(e) => set('formaCITE', e.target.value)}
                className={`h-8 text-sm font-mono ${errors.formaCITE ? 'border-destructive' : ''}`}
              />
              {errors.formaCITE && <p className="text-xs text-destructive">{errors.formaCITE}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="d-plantilla" className="text-xs">Plantilla</Label>
            <Textarea
              id="d-plantilla"
              placeholder="Contenido base de la plantilla del documento..."
              value={form.plantilla}
              onChange={(e) => set('plantilla', e.target.value)}
              rows={3}
              className="text-sm resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" className="px-6" onClick={handleSave}>
            {doc ? 'Guardar cambios' : 'Crear documento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Sección de permisos por rol ──────────────────────────────────────────────
function RolPermisosSection({
  docs, rolMap, onRolMapChange,
}: {
  docs: TipoDocumentoAdmin[];
  rolMap: RolDocumentosMap;
  onRolMapChange: (map: RolDocumentosMap) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const toggle = (rol: Rol, abrev: string) => {
    const current = rolMap[rol] ?? [];
    const next = current.includes(abrev)
      ? current.filter((a) => a !== abrev)
      : [...current, abrev];
    onRolMapChange({ ...rolMap, [rol]: next });
  };

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-primary" />
          <span className="text-sm font-display font-semibold">Documentos por defecto según Rol</span>
          <span className="text-xs text-muted-foreground">
            (se asignan al crear un nuevo usuario)
          </span>
        </div>
        {expanded
          ? <ChevronUp className="size-4 text-muted-foreground" />
          : <ChevronDown className="size-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <>
          <Separator />
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-44">
                    Documento
                  </th>
                  {ROLES.map((rol) => (
                    <th key={rol} className="px-3 py-2 text-center">
                      <div className="text-[10px] font-mono font-semibold text-primary">{rol}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {docs.map((d) => {
                  return (
                    <tr key={d.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">{d.nombre}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{d.abreviatura}</span>
                        </div>
                      </td>
                      {ROLES.map((rol) => {
                        const asignados = rolMap[rol] ?? [];
                        const checked = asignados.includes(d.abreviatura);
                        return (
                          <td key={rol} className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => toggle(rol, d.abreviatura)}
                              className={`
                                size-5 rounded border-2 flex items-center justify-center mx-auto transition-all
                                ${checked
                                  ? 'bg-primary border-primary text-primary-foreground'
                                  : 'border-border hover:border-primary/50'}
                              `}
                              title={checked ? `Quitar ${d.nombre} de ${rol}` : `Agregar ${d.nombre} a ${rol}`}
                            >
                              {checked && (
                                <svg className="size-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="1,6 5,10 11,2" />
                                </svg>
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t bg-muted/20 flex justify-end">
            <Button
              size="sm"
              className="px-6"
              onClick={() => alert('Configuración guardada (mock)')}
            >
              Guardar configuración
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DocumentosAdminPage() {
  const [docs, setDocs] = useState<TipoDocumentoAdmin[]>(MOCK_DOCS);
  const [rolMap, setRolMap] = useState<RolDocumentosMap>(MOCK_ROL_MAP);
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TipoDocumentoAdmin | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TipoDocumentoAdmin | null>(null);

  const abreviaturas = docs.map((d) => d.abreviatura);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return docs;
    return docs.filter(
      (d) =>
        d.nombre.toLowerCase().includes(q) ||
        d.abreviatura.toLowerCase().includes(q) ||
        d.formaCITE.toLowerCase().includes(q)
    );
  }, [docs, query]);

  const handleSave = (form: DocForm) => {
    if (editTarget) {
      setDocs((prev) => prev.map((d) => d.id === editTarget.id ? { ...d, ...form } : d));
    } else {
      setDocs((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setDialogOpen(false);
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDocs((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const openNew = () => { setEditTarget(null); setDialogOpen(true); };
  const openEdit = (d: TipoDocumentoAdmin) => { setEditTarget(d); setDialogOpen(true); };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display leading-tight">Tipos de Documento</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {docs.length} tipos registrados · Gestión y permisos por rol
          </p>
        </div>
        <Button size="sm" className="gap-1.5 flex-shrink-0" onClick={openNew}>
          <Plus className="size-4" />
          Nuevo tipo
        </Button>
      </div>

      {/* Permisos por rol */}
      <RolPermisosSection docs={docs} rolMap={rolMap} onRolMapChange={setRolMap} />

      {/* Buscador */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          id="buscador-docs"
          placeholder="Buscar por nombre, abreviatura..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-8 h-9 text-sm"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <FileText className="size-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No se encontraron tipos de documento.</p>
        </Card>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nombre</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Abrev.</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Forma CITE</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Plantilla</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden xl:table-cell">Roles que la incluyen por defecto</th>
                <th className="px-4 py-2.5 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((d) => {
                const rolesAsignados = ROLES.filter(
                  (r) => (rolMap[r] ?? []).includes(d.abreviatura)
                );
                return (
                  <tr key={d.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-4 py-3 font-display font-medium">{d.nombre}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="font-mono text-[11px] px-1.5">
                        {d.abreviatura}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-mono text-xs text-muted-foreground">{d.formaCITE}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {d.plantilla || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {rolesAsignados.length === 0
                          ? <span className="text-xs text-muted-foreground italic">Ninguno</span>
                          : rolesAsignados.map((r) => (
                            <span key={r} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
                              {r}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEdit(d)}
                          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Editar"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(d)}
                          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog crear/editar */}
      <DocDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        doc={editTarget}
        abreviaturas={abreviaturas}
      />

      {/* Dialog confirmar borrado */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Trash2 className="size-4 text-destructive" />
              Eliminar documento
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el tipo{' '}
              <strong>{deleteTarget?.nombre}</strong> ({deleteTarget?.abreviatura})?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

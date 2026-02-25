'use client';

import { useState, useEffect } from 'react';
import { Network } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Oficina, Entidad } from '@/components/admin/types';

interface OficinaSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (oficina: Oficina) => void;
  oficina?: Oficina | null;
  entidades: Entidad[];
  oficinas: Oficina[];   // para seleccionar la oficina padre
}

const EMPTY: Omit<Oficina, 'id'> = {
  nombre: '',
  sigla: '',
  parentId: null,
  entidadId: 0,
};

export function OficinaSheet({
  open,
  onClose,
  onSave,
  oficina,
  entidades,
  oficinas,
}: OficinaSheetProps) {
  const [form, setForm] = useState<Omit<Oficina, 'id'>>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Oficina, 'id'>, string>>>({});

  useEffect(() => {
    if (open) {
      if (oficina) {
        const { id: _id, ...rest } = oficina;
        setForm(rest);
      } else {
        setForm(EMPTY);
      }
      setErrors({});
    }
  }, [open, oficina]);

  const set = (field: keyof Omit<Oficina, 'id'>, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (!form.sigla.trim()) e.sigla = 'Requerido';
    if (!form.entidadId) e.entidadId = 'Selecciona una entidad';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ id: oficina?.id ?? Date.now(), ...form });
  };

  const isEditing = !!oficina;

  // Oficinas disponibles como padre: excluimos la propia oficina (en edición)
  const padresDisponibles = oficinas.filter(
    (o) => o.id !== oficina?.id && o.entidadId === form.entidadId
  );

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-5 pt-5 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 font-display">
            <Network className="size-4 text-primary" />
            {isEditing ? 'Editar Oficina' : 'Nueva Oficina'}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modifica los datos de la oficina y guarda los cambios.'
              : 'Completa los datos para registrar una nueva oficina.'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Entidad */}
          <div className="space-y-1.5">
            <Label htmlFor="entidadId" className="text-xs">
              Entidad *
            </Label>
            <Select
              value={form.entidadId ? String(form.entidadId) : ''}
              onValueChange={(v) => {
                set('entidadId', Number(v));
                set('parentId', null); // resetear padre al cambiar entidad
              }}
            >
              <SelectTrigger id="entidadId" className={`h-8 text-sm ${errors.entidadId ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Selecciona una entidad..." />
              </SelectTrigger>
              <SelectContent>
                {entidades.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    <span className="font-mono text-xs mr-2 text-muted-foreground">{e.siglaHR}</span>
                    {e.nombreCompleto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.entidadId && <p className="text-xs text-destructive">{errors.entidadId}</p>}
          </div>

          <Separator />

          {/* Datos de la oficina */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Datos de la oficina
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="nombre" className="text-xs">Nombre *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Departamento de Tecnología"
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                className={`h-8 text-sm ${errors.nombre ? 'border-destructive' : ''}`}
              />
              {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sigla" className="text-xs">Sigla *</Label>
              <Input
                id="sigla"
                placeholder="Ej: DT"
                value={form.sigla}
                onChange={(e) => set('sigla', e.target.value.toUpperCase())}
                className={`h-8 text-sm font-mono ${errors.sigla ? 'border-destructive' : ''}`}
              />
              {errors.sigla && <p className="text-xs text-destructive">{errors.sigla}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="parentId" className="text-xs">
                Oficina superior{' '}
                <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Select
                value={form.parentId !== null ? String(form.parentId) : '__none__'}
                onValueChange={(v) => set('parentId', v === '__none__' ? null : Number(v))}
                disabled={!form.entidadId}
              >
                <SelectTrigger id="parentId" className="h-8 text-sm">
                  <SelectValue placeholder="Sin dependencia (raíz)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">
                    <span className="text-muted-foreground italic">Sin dependencia (raíz)</span>
                  </SelectItem>
                  {padresDisponibles.map((o) => (
                    <SelectItem key={o.id} value={String(o.id)}>
                      <span className="font-mono text-xs mr-2 text-muted-foreground">{o.sigla}</span>
                      {o.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!form.entidadId && (
                <p className="text-xs text-muted-foreground">Selecciona primero una entidad</p>
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="border-t px-5 py-4 flex flex-row gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button size="sm" className="px-6" onClick={handleSubmit}>
            {isEditing ? 'Guardar cambios' : 'Crear oficina'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

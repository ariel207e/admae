'use client';

import { useState, useEffect } from 'react';
import { UserCog } from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
  SheetDescription, SheetFooter,
} from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Usuario, Entidad, Oficina } from '@/components/admin/types';
import { DOCUMENTOS_DEFAULT, ROLES } from '@/components/admin/types';
import type { Rol } from '@/components/admin/types';

interface UsuarioSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (u: Usuario) => void;
  usuario?: Usuario | null;
  entidades: Entidad[];
  oficinas: Oficina[];
}

type FormData = Omit<Usuario,
  'id' | 'activo' | 'cantidadIngresos' | 'ultimoIngreso' | 'documentosPermitidos'
  | 'entidad' | 'oficina'
>;

const EMPTY_FORM: FormData = {
  nombreUsuario: '',
  nombreCompleto: '',
  carnet: '',
  rol: '',
  cargo: '',
  entidadId: null,
  oficinaId: null,
  correo: '',
  mosca: '',
};

/** Genera las iniciales "mosca" a partir del nombre completo */
function generarMosca(nombre: string): string {
  return nombre
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export function UsuarioSheet({ open, onClose, onSave, usuario, entidades, oficinas }: UsuarioSheetProps) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const isEditing = !!usuario;

  useEffect(() => {
    if (open) {
      if (usuario) {
        setForm({
          nombreUsuario: usuario.nombreUsuario,
          nombreCompleto: usuario.nombreCompleto,
          carnet: usuario.carnet,
          rol: usuario.rol,
          cargo: usuario.cargo,
          entidadId: usuario.entidadId,
          oficinaId: usuario.oficinaId,
          correo: usuario.correo,
          mosca: usuario.mosca,
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [open, usuario]);

  const set = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Auto-genera la mosca al cambiar el nombre si el campo mosca está vacío o fue auto-generado
  const handleNombreChange = (v: string) => {
    set('nombreCompleto', v);
    set('mosca', generarMosca(v));
  };

  // Filtrar oficinas por entidad seleccionada
  const oficinasFiltradas = oficinas.filter(
    (o) => form.entidadId && o.entidadId === form.entidadId
  );

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.nombreUsuario.trim()) e.nombreUsuario = 'Requerido';
    if (!form.nombreCompleto.trim()) e.nombreCompleto = 'Requerido';
    if (!form.correo.trim()) e.correo = 'Requerido';
    if (!form.rol) e.rol = 'Selecciona un rol';
    if (!form.entidadId) e.entidadId = 'Selecciona una entidad';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const entidadObj = entidades.find((e) => e.id === form.entidadId);
    const oficinaObj = oficinas.find((o) => o.id === form.oficinaId);
    onSave({
      id: usuario?.id ?? Date.now(),
      ...form,
      entidad: entidadObj?.nombreCompleto ?? '',
      oficina: oficinaObj?.nombre ?? '',
      activo: usuario?.activo ?? true,
      cantidadIngresos: usuario?.cantidadIngresos ?? 0,
      ultimoIngreso: usuario?.ultimoIngreso ?? null,
      documentosPermitidos: usuario?.documentosPermitidos ?? DOCUMENTOS_DEFAULT,
    });
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-5 pt-5 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 font-display">
            <UserCog className="size-4 text-primary" />
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modifica los datos del usuario.'
              : 'Crea un nuevo usuario. Se asignarán documentos por defecto: Nota, Informe, Carta.'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Credenciales */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Credenciales</p>

            <div className="space-y-1.5">
              <Label htmlFor="nombreUsuario" className="text-xs">Nombre de usuario *</Label>
              <Input
                id="nombreUsuario"
                placeholder="Ej: jperez"
                value={form.nombreUsuario}
                onChange={(e) => set('nombreUsuario', e.target.value.toLowerCase().replace(/\s/g, ''))}
                className={`h-8 text-sm font-mono ${errors.nombreUsuario ? 'border-destructive' : ''}`}
              />
              {errors.nombreUsuario && <p className="text-xs text-destructive">{errors.nombreUsuario}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="correo" className="text-xs">Correo electrónico *</Label>
              <Input
                id="correo"
                type="email"
                placeholder="Ej: juan.perez@entidad.gob"
                value={form.correo}
                onChange={(e) => set('correo', e.target.value)}
                className={`h-8 text-sm ${errors.correo ? 'border-destructive' : ''}`}
              />
              {errors.correo && <p className="text-xs text-destructive">{errors.correo}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rol" className="text-xs">Rol *</Label>
              <Select
                value={form.rol}
                onValueChange={(v) => set('rol', v as Rol)}
              >
                <SelectTrigger id="rol" className={`h-8 text-sm ${errors.rol ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Selecciona un rol..." />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rol && <p className="text-xs text-destructive">{errors.rol}</p>}
            </div>
          </div>

          <Separator />

          {/* Datos personales */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Datos personales</p>

            <div className="space-y-1.5">
              <Label htmlFor="nombreCompleto" className="text-xs">Nombre completo *</Label>
              <Input
                id="nombreCompleto"
                placeholder="Ej: Juan Carlos Pérez Marte"
                value={form.nombreCompleto}
                onChange={(e) => handleNombreChange(e.target.value)}
                className={`h-8 text-sm ${errors.nombreCompleto ? 'border-destructive' : ''}`}
              />
              {errors.nombreCompleto && <p className="text-xs text-destructive">{errors.nombreCompleto}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="carnet" className="text-xs">Carnet / Cédula</Label>
                <Input
                  id="carnet"
                  placeholder="Ej: 001-1234567-8"
                  value={form.carnet}
                  onChange={(e) => set('carnet', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mosca" className="text-xs">
                  Mosca{' '}
                  <span className="text-muted-foreground font-normal">(iniciales)</span>
                </Label>
                <Input
                  id="mosca"
                  placeholder="Ej: JCPM"
                  value={form.mosca}
                  onChange={(e) => set('mosca', e.target.value.toUpperCase())}
                  className="h-8 text-sm font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cargo" className="text-xs">Cargo</Label>
              <Input
                id="cargo"
                placeholder="Ej: Analista de Sistemas"
                value={form.cargo}
                onChange={(e) => set('cargo', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* Adscripción */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Adscripción</p>

            <div className="space-y-1.5">
              <Label htmlFor="entidadId-u" className="text-xs">Entidad *</Label>
              <Select
                value={form.entidadId ? String(form.entidadId) : ''}
                onValueChange={(v) => {
                  set('entidadId', Number(v));
                  set('oficinaId', null);
                }}
              >
                <SelectTrigger id="entidadId-u" className={`h-8 text-sm ${errors.entidadId ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Selecciona entidad..." />
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

            <div className="space-y-1.5">
              <Label htmlFor="oficinaId-u" className="text-xs">
                Oficina <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Select
                value={form.oficinaId ? String(form.oficinaId) : '__none__'}
                onValueChange={(v) => set('oficinaId', v === '__none__' ? null : Number(v))}
                disabled={!form.entidadId}
              >
                <SelectTrigger id="oficinaId-u" className="h-8 text-sm">
                  <SelectValue placeholder="Selecciona oficina..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">
                    <span className="text-muted-foreground italic">Sin oficina</span>
                  </SelectItem>
                  {oficinasFiltradas.map((o) => (
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
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" className="px-6" onClick={handleSubmit}>
            {isEditing ? 'Guardar cambios' : 'Crear usuario'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

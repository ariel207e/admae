'use client';

import { useRef, useState, useEffect } from 'react';
import { Building2, Upload, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Entidad } from '@/components/admin/types';

interface EntidadSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (entidad: Entidad) => void;
  entidad?: Entidad | null;
}

const EMPTY_FORM: Omit<Entidad, 'id'> = {
  nombreCompleto: '',
  sigla: '',
  siglaHR: '',
  direccion: '',
  telefono: '',
  nombreContacto: '',
  telefonoContacto: '',
  logoUrl: '',
};

export function EntidadSheet({ open, onClose, onSave, entidad }: EntidadSheetProps) {
  const [form, setForm] = useState<Omit<Entidad, 'id'>>(EMPTY_FORM);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Entidad, 'id'>, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (entidad) {
        const { id: _id, ...rest } = entidad;
        setForm(rest);
        setLogoPreview(entidad.logoUrl || '');
      } else {
        setForm(EMPTY_FORM);
        setLogoPreview('');
      }
      setErrors({});
    }
  }, [open, entidad]);

  const handleChange = (field: keyof Omit<Entidad, 'id'>, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setLogoPreview(result);
      setForm((prev) => ({ ...prev, logoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.nombreCompleto.trim()) newErrors.nombreCompleto = 'Requerido';
    if (!form.sigla.trim()) newErrors.sigla = 'Requerido';
    if (!form.siglaHR.trim()) {
      newErrors.siglaHR = 'Requerido';
    } else if (form.siglaHR.length !== 3) {
      newErrors.siglaHR = 'Debe tener exactamente 3 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      id: entidad?.id ?? Date.now(),
      ...form,
      siglaHR: form.siglaHR.toUpperCase(),
    });
  };

  const isEditing = !!entidad;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-5 pt-5 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 font-display">
            <Building2 className="size-4 text-primary" />
            {isEditing ? 'Editar Entidad' : 'Nueva Entidad'}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Modifica los datos de la entidad y guarda los cambios.'
              : 'Completa los datos para registrar una nueva entidad.'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div
              className="size-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/40 overflow-hidden flex-shrink-0 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="size-full object-contain p-1" />
              ) : (
                <Building2 className="size-6 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-display font-medium">Logo de la entidad</p>
              <p className="text-xs text-muted-foreground">PNG, JPG o SVG. Máx. 2MB</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2.5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="size-3 mr-1" />
                  Subir logo
                </Button>
                {logoPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 text-destructive hover:text-destructive"
                    onClick={() => {
                      setLogoPreview('');
                      setForm((prev) => ({ ...prev, logoUrl: '' }));
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <X className="size-3" />
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          <Separator />

          {/* Datos institucionales */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Datos institucionales
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="nombreCompleto" className="text-xs">
                Nombre completo *
              </Label>
              <Input
                id="nombreCompleto"
                placeholder="Ej: Ministerio de Administración Pública"
                value={form.nombreCompleto}
                onChange={(e) => handleChange('nombreCompleto', e.target.value)}
                className={`h-8 text-sm ${errors.nombreCompleto ? 'border-destructive' : ''}`}
              />
              {errors.nombreCompleto && (
                <p className="text-xs text-destructive">{errors.nombreCompleto}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="sigla" className="text-xs">
                  Sigla *
                </Label>
                <Input
                  id="sigla"
                  placeholder="Ej: MAP"
                  value={form.sigla}
                  onChange={(e) => handleChange('sigla', e.target.value.toUpperCase())}
                  className={`h-8 text-sm font-mono ${errors.sigla ? 'border-destructive' : ''}`}
                />
                {errors.sigla && (
                  <p className="text-xs text-destructive">{errors.sigla}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="siglaHR" className="text-xs">
                  Sigla HR *{' '}
                  <span className="text-muted-foreground font-normal">(3 caracteres)</span>
                </Label>
                <Input
                  id="siglaHR"
                  placeholder="Ej: MAP"
                  maxLength={3}
                  value={form.siglaHR}
                  onChange={(e) => handleChange('siglaHR', e.target.value.toUpperCase())}
                  className={`h-8 text-sm font-mono ${errors.siglaHR ? 'border-destructive' : ''}`}
                />
                {errors.siglaHR && (
                  <p className="text-xs text-destructive">{errors.siglaHR}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="direccion" className="text-xs">
                Dirección
              </Label>
              <Input
                id="direccion"
                placeholder="Ej: Av. México 2."
                value={form.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telefono" className="text-xs">
                Teléfono institucional
              </Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="Ej: 809-000-0000"
                value={form.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* Contacto */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Persona de contacto
            </p>

            <div className="space-y-1.5">
              <Label htmlFor="nombreContacto" className="text-xs">
                Nombre del contacto
              </Label>
              <Input
                id="nombreContacto"
                placeholder="Ej: Juan Pérez"
                value={form.nombreContacto}
                onChange={(e) => handleChange('nombreContacto', e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telefonoContacto" className="text-xs">
                Teléfono del contacto
              </Label>
              <Input
                id="telefonoContacto"
                type="tel"
                placeholder="Ej: 809-000-0001"
                value={form.telefonoContacto}
                onChange={(e) => handleChange('telefonoContacto', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>

        <SheetFooter className="border-t px-5 py-4 flex flex-row gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button size="sm" className="px-6" onClick={handleSubmit}>
            {isEditing ? 'Guardar cambios' : 'Crear entidad'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

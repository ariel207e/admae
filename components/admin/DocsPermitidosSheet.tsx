'use client';

import { useState, useEffect } from 'react';
import { FileText, Check, Plus, Minus } from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
  SheetDescription, SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Usuario, TipoDocumento } from '@/components/admin/types';
import { TODOS_DOCUMENTOS } from '@/components/admin/types';

interface DocsSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (docs: TipoDocumento[]) => void;
  usuario: Usuario | null;
}

export function DocsPermitidosSheet({ open, onClose, onSave, usuario }: DocsSheetProps) {
  const [selectedDocs, setSelectedDocs] = useState<Set<TipoDocumento>>(new Set());

  useEffect(() => {
    if (open && usuario) {
      setSelectedDocs(new Set(usuario.documentosPermitidos));
    }
  }, [open, usuario]);

  const toggle = (doc: TipoDocumento) => {
    setSelectedDocs((prev) => {
      const next = new Set(prev);
      next.has(doc) ? next.delete(doc) : next.add(doc);
      return next;
    });
  };

  const handleSave = () => {
    onSave([...selectedDocs] as TipoDocumento[]);
  };

  const disponibles = TODOS_DOCUMENTOS.filter((d) => !selectedDocs.has(d));
  const asignados   = TODOS_DOCUMENTOS.filter((d) =>  selectedDocs.has(d));

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-5 pt-5 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 font-display">
            <FileText className="size-4 text-primary" />
            Documentos permitidos
          </SheetTitle>
          <SheetDescription>
            {usuario ? (
              <>Configurando documentos para <strong>{usuario.nombreCompleto}</strong></>
            ) : ''}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

          {/* Documentos asignados */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Docs. Asignados
              </p>
              <Badge variant="default" className="text-[10px] h-4 px-1.5">
                {asignados.length}
              </Badge>
            </div>

            {asignados.length === 0 ? (
              <div className="rounded-lg border border-dashed py-5 text-center">
                <p className="text-xs text-muted-foreground">
                  Ningún documento asignado
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {asignados.map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center justify-between px-3 py-2 rounded-md border bg-primary/5 border-primary/20 group"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="size-3.5 text-primary" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(doc)}
                      className="size-5 rounded flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Quitar"
                    >
                      <Minus className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documentos disponibles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Docs. Disponibles
              </p>
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                {disponibles.length}
              </Badge>
            </div>

            {disponibles.length === 0 ? (
              <div className="rounded-lg border border-dashed py-5 text-center">
                <p className="text-xs text-muted-foreground">
                  Todos los documentos están asignados
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {disponibles.map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center justify-between px-3 py-2 rounded-md border bg-muted/30 group hover:border-primary/30 transition-colors cursor-pointer"
                    onClick={() => toggle(doc)}
                  >
                    <span className="text-sm text-muted-foreground">{doc}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggle(doc); }}
                      className="size-5 rounded flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                      title="Agregar"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="border-t px-5 py-4 flex flex-row gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" className="px-6" onClick={handleSave}>
            Guardar permisos
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

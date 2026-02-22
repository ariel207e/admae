'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock suggested recipients data
const suggestedRecipients = [
  {
    id: 1,
    nombre: 'Juan Carlos García',
    cargo: 'Gerente de Adquisiciones',
    email: 'jgarcia@empresa.com',
  },
  {
    id: 2,
    nombre: 'María López Rodríguez',
    cargo: 'Directora de Operaciones',
    email: 'mlopez@empresa.com',
  },
  {
    id: 3,
    nombre: 'Roberto Fernández Martínez',
    cargo: 'Jefe de Recursos Humanos',
    email: 'rfernandez@empresa.com',
  },
  {
    id: 4,
    nombre: 'Carmen Silva Núñez',
    cargo: 'Coordinadora de Proyectos',
    email: 'csilva@empresa.com',
  },
  {
    id: 5,
    nombre: 'Francisco Morales Gutiérrez',
    cargo: 'Supervisor de Compras',
    email: 'fmorales@empresa.com',
  },
  {
    id: 6,
    nombre: 'Elena Rodríguez Pérez',
    cargo: 'Gerente de Finanzas',
    email: 'erodriguez@empresa.com',
  },
  {
    id: 7,
    nombre: 'Diego Sánchez Torres',
    cargo: 'Analista de Sistemas',
    email: 'dsanchez@empresa.com',
  },
  {
    id: 8,
    nombre: 'Patricia González Ruiz',
    cargo: 'Especialista en Capacitación',
    email: 'pgonzalez@empresa.com',
  },
  {
    id: 9,
    nombre: 'Javier Méndez Castro',
    cargo: 'Coordinador de Logística',
    email: 'jmendez@empresa.com',
  },
  {
    id: 10,
    nombre: 'Sofía Ramírez López',
    cargo: 'Asistente Ejecutiva',
    email: 'sramirez@empresa.com',
  },
];

interface Recipient {
  id: number;
  nombre: string;
  cargo: string;
  email: string;
}

interface RecipientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (recipients: Recipient[]) => void;
  selectedRecipients: Recipient[];
}

export function RecipientModal({
  isOpen,
  onClose,
  onSelect,
  selectedRecipients,
}: RecipientModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelected, setLocalSelected] = useState<Recipient[]>(selectedRecipients);

  // Filter recipients based on search query
  const filteredRecipients = suggestedRecipients.filter(
    (recipient) =>
      recipient.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipient.cargo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isRecipientSelected = (recipientId: number) => {
    return localSelected.some((r) => r.id === recipientId);
  };

  const toggleRecipient = (recipient: Recipient) => {
    if (isRecipientSelected(recipient.id)) {
      setLocalSelected(localSelected.filter((r) => r.id !== recipient.id));
    } else {
      setLocalSelected([...localSelected, recipient]);
    }
  };

  const handleConfirm = () => {
    onSelect(localSelected);
    onClose();
  };

  const handleClose = () => {
    setLocalSelected(selectedRecipients);
    setSearchQuery('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buscar y Agregar Destinatarios</DialogTitle>
          <DialogDescription>
            Busca por nombre o cargo. Selecciona uno o varios destinatarios usando los checkboxes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Input
              placeholder="Buscar por nombre o cargo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Recipients List */}
          <ScrollArea className="h-80 border rounded-lg p-4">
            <div className="space-y-2">
              {filteredRecipients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No se encontraron destinatarios</p>
                </div>
              ) : (
                filteredRecipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => toggleRecipient(recipient)}
                  >
                    <input
                      type="checkbox"
                      checked={isRecipientSelected(recipient.id)}
                      onChange={() => toggleRecipient(recipient)}
                      className="mt-1 w-4 h-4 rounded cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{recipient.nombre}</p>
                      <p className="text-xs text-muted-foreground">{recipient.cargo}</p>
                      <p className="text-xs text-muted-foreground">{recipient.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Selected Count */}
          <div className="text-sm text-muted-foreground">
            {localSelected.length} destinatario{localSelected.length !== 1 ? 's' : ''} seleccionado
            {localSelected.length !== 1 ? 's' : ''}
          </div>

          {/* Selected Recipients Preview */}
          {localSelected.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-medium mb-2">Seleccionados:</p>
              <div className="flex flex-wrap gap-2">
                {localSelected.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="bg-primary/20 text-primary text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1"
                  >
                    <span>{recipient.nombre}</span>
                    <button
                      type="button"
                      onClick={() => toggleRecipient(recipient)}
                      className="ml-1 hover:opacity-70"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            {localSelected.length === 0
              ? 'Confirmar'
              : `Confirmar (${localSelected.length} seleccionados)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

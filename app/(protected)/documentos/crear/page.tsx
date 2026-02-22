'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RecipientModal } from '@/components/documentos/RecipientModal';
import { useAuth } from '@/contexts/AuthContext';

interface Recipient {
  id: number;
  nombre: string;
  cargo: string;
  email: string;
}

export default function CrearPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [formData, setFormData] = useState({
    documentType: '',
    process: '',
    destinatario: '',
    cargoDestinatario: '',
    via: '',
    cargoVia: '',
    referencia: '',
    adjuntos: 0,
    hojas: 0,
    conHojaDeRuta: false,
  });

  const handleRecipientSelect = (recipients: Recipient[]) => {
    setSelectedRecipients(recipients);
    // Auto-fill the first recipient's info
    if (recipients.length > 0) {
      setFormData((prev) => ({
        ...prev,
        destinatario: recipients[0].nombre,
        cargoDestinatario: recipients[0].cargo,
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'adjuntos' || name === 'hojas' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      conHojaDeRuta: checked,
    }));
  };

  const handleGenerateDocument = () => {
    console.log('[v0] Form submitted:', formData, 'Recipients:', selectedRecipients);
    // TODO: Implement document generation logic
    alert('Documento generado (ver consola para detalles)');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display mb-2">Crear Documento</h1>

      {/* Section 1: Document Classification */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Clasificación del Documento</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Selecciona el tipo de documento y el proceso asociado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="documentType">Tipo de Documento *</Label>
            <Select value={formData.documentType} onValueChange={(value) =>
              handleSelectChange('documentType', value)
            }>
              <SelectTrigger id="documentType">
                <SelectValue placeholder="Selecciona un tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nota">Nota</SelectItem>
                <SelectItem value="informe">Informe</SelectItem>
                <SelectItem value="carta">Carta</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              💡 Tipo base del documento a generar
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="process">Proceso *</Label>
            <Select value={formData.process} onValueChange={(value) =>
              handleSelectChange('process', value)
            }>
              <SelectTrigger id="process">
                <SelectValue placeholder="Selecciona un proceso..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adquisicion">Adquisición</SelectItem>
                <SelectItem value="informe-viaje">Informe de Viaje</SelectItem>
                <SelectItem value="comision">Comisión</SelectItem>
                <SelectItem value="instructivo">Instructivo</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              💡 Contexto o flujo del documento
            </p>
          </div>
        </div>
      </Card>

      {/* Section 2: Recipient Information */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Información del Destinatario</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Completa los datos del destinatario del documento
          </p>
        </div>

        {/* Suggested Recipients */}
        <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <Label htmlFor="suggestedRecipients" className="text-sm font-medium">
              Destinatarios Sugeridos
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-xs h-8"
            >
              + Buscar Destinatarios
            </Button>
          </div>

          {selectedRecipients.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedRecipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="bg-primary/20 text-primary text-xs px-2.5 py-1 rounded-full flex items-center gap-2 cursor-pointer hover:bg-primary/30 transition-colors"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      destinatario: recipient.nombre,
                      cargoDestinatario: recipient.cargo,
                    }));
                  }}
                >
                  <span>{recipient.nombre}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRecipients(
                        selectedRecipients.filter((r) => r.id !== recipient.id)
                      );
                    }}
                    className="hover:opacity-70"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Aún no hay destinatarios seleccionados. Haz clic en "Buscar Destinatarios"
            </p>
          )}
        </div>

        {/* Recipient Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="destinatario">Nombre del Destinatario *</Label>
            <Input
              id="destinatario"
              name="destinatario"
              placeholder="Ej: Juan Carlos García"
              value={formData.destinatario}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Se auto-completa al seleccionar de la lista
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargoDestinatario">Cargo del Destinatario *</Label>
            <Input
              id="cargoDestinatario"
              name="cargoDestinatario"
              placeholder="Ej: Gerente de Adquisiciones"
              value={formData.cargoDestinatario}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Se auto-completa al seleccionar de la lista
            </p>
          </div>
        </div>

        {/* Optional Via Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="via">Vía (Opcional)</Label>
            <Input
              id="via"
              name="via"
              placeholder="Ej: Dirección General"
              value={formData.via}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Persona o departamento por el que pasa el documento
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargoVia">Cargo de la Vía (Opcional)</Label>
            <Input
              id="cargoVia"
              name="cargoVia"
              placeholder="Ej: Director General"
              value={formData.cargoVia}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              Dejar vacío si no aplica
            </p>
          </div>
        </div>
      </Card>

      {/* Section 3: Sender Information (Read-only) */}
      <Card className="p-6 bg-muted/50 border-dashed">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Información del Remitente</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Datos del usuario actual (no editable)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Nombre</Label>
            <p className="text-sm font-medium mt-1">
              {user?.name || 'Usuario'}
            </p>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Cargo</Label>
            <p className="text-sm font-medium mt-1">
              {user?.role || 'Sin asignar'}
            </p>
          </div>
        </div>
      </Card>

      {/* Section 4: Reference & Details */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Referencia y Detalles</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Información adicional del documento
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referencia">Referencia *</Label>
            <Textarea
              id="referencia"
              name="referencia"
              placeholder="Ej: Solicitud de aprobación del presupuesto Q2 2024"
              value={formData.referencia}
              onChange={handleInputChange}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Breve descripción o asunto del documento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adjuntos">Número de Adjuntos</Label>
              <Input
                id="adjuntos"
                name="adjuntos"
                type="number"
                min="0"
                value={formData.adjuntos}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Documentos anexados (por defecto: 0)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hojas">Número de Hojas</Label>
              <Input
                id="hojas"
                name="hojas"
                type="number"
                min="0"
                value={formData.hojas}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Hojas del documento (por defecto: 0)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 5: Actions */}
      <Card className="p-6 border-primary/20 bg-primary/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Opciones de Generación</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Configura cómo deseas generar el documento
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="hojaDeRuta" className="text-sm font-medium cursor-pointer">
                Generar con Hoja de Ruta
              </Label>
              <Switch
                id="hojaDeRuta"
                checked={formData.conHojaDeRuta}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          💡 Activa esta opción si deseas que el documento incluya un número de rastreo y hoja de ruta
        </p>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setFormData({
                documentType: '',
                process: '',
                destinatario: '',
                cargoDestinatario: '',
                via: '',
                cargoVia: '',
                referencia: '',
                adjuntos: 0,
                hojas: 0,
                conHojaDeRuta: false,
              });
              setSelectedRecipients([]);
            }}
          >
            Limpiar Formulario
          </Button>
          <Button
            onClick={handleGenerateDocument}
            disabled={!formData.documentType || !formData.process || !formData.destinatario || !formData.referencia}
            className="flex-1 bg-primary"
          >
            Generar Documento
          </Button>
        </div>
      </Card>

      {/* Recipient Modal */}
      <RecipientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleRecipientSelect}
        selectedRecipients={selectedRecipients}
      />
    </div>
  );
}

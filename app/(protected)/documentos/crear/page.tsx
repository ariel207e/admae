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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, conHojaDeRuta: checked }));
  };

  const handleGenerateDocument = () => {
    console.log('[v0] Form submitted:', formData, 'Recipients:', selectedRecipients);
    alert('Documento generado (ver consola para detalles)');
  };

  const handleClear = () => {
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
  };

  const isValid =
    !!formData.documentType &&
    !!formData.process &&
    !!formData.destinatario &&
    !!formData.referencia;

  return (
    <div className="space-y-4">

      {/* Header: Título + Tipo de Documento */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-display leading-tight">Crear Documento</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Remitente: <span className="font-medium text-foreground">{user?.name || 'Usuario'}</span>
            {user?.role && <span className="ml-1 text-muted-foreground">— {user.role}</span>}
          </p>
        </div>

        <div className="w-48 space-y-1">
          <Label htmlFor="documentType" className="text-xs text-muted-foreground">Tipo de Documento *</Label>
          <Select
            value={formData.documentType}
            onValueChange={(value) => handleSelectChange('documentType', value)}
          >
            <SelectTrigger id="documentType" className="h-9 text-sm">
              <SelectValue placeholder="Selecciona tipo..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nota">Nota</SelectItem>
              <SelectItem value="informe">Informe</SelectItem>
              <SelectItem value="carta">Carta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards en fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

        {/* Card 1: Proceso + Destinatario + Vía */}
        <Card className="p-4 space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Destinatario y Proceso
          </h2>

          {/* Proceso */}
          <div className="space-y-1.5">
            <Label htmlFor="process" className="text-xs">Proceso *</Label>
            <Select
              value={formData.process}
              onValueChange={(value) => handleSelectChange('process', value)}
            >
              <SelectTrigger id="process" className="h-8 text-sm">
                <SelectValue placeholder="Selecciona un proceso..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adquisicion">Adquisición</SelectItem>
                <SelectItem value="informe-viaje">Informe de Viaje</SelectItem>
                <SelectItem value="comision">Comisión</SelectItem>
                <SelectItem value="instructivo">Instructivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Destinatario: búsqueda + chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="destinatario" className="text-xs">Destinatario *</Label>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-primary hover:underline"
              >
                + Buscar
              </button>
            </div>

            {selectedRecipients.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-1">
                {selectedRecipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="bg-primary/15 text-primary text-xs px-2 py-0.5 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-primary/25 transition-colors"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        destinatario: recipient.nombre,
                        cargoDestinatario: recipient.cargo,
                      }))
                    }
                  >
                    <span>{recipient.nombre}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecipients(selectedRecipients.filter((r) => r.id !== recipient.id));
                      }}
                      className="hover:opacity-70 leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Input
                id="destinatario"
                name="destinatario"
                placeholder="Nombre"
                value={formData.destinatario}
                onChange={handleInputChange}
                className="h-8 text-sm"
              />
              <Input
                id="cargoDestinatario"
                name="cargoDestinatario"
                placeholder="Cargo"
                value={formData.cargoDestinatario}
                onChange={handleInputChange}
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* Vía (opcional) */}
          <div className="space-y-1.5">
            <Label htmlFor="via" className="text-xs">
              Vía <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                id="via"
                name="via"
                placeholder="Nombre vía"
                value={formData.via}
                onChange={handleInputChange}
                className="h-8 text-sm"
              />
              <Input
                id="cargoVia"
                name="cargoVia"
                placeholder="Cargo vía"
                value={formData.cargoVia}
                onChange={handleInputChange}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </Card>

        {/* Card 2: Referencia + Adjuntos + Hojas */}
        <Card className="p-4 space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Contenido del Documento
          </h2>

          {/* Referencia */}
          <div className="space-y-1.5">
            <Label htmlFor="referencia" className="text-xs">Referencia / Asunto *</Label>
            <Textarea
              id="referencia"
              name="referencia"
              placeholder="Ej: Solicitud de aprobación del presupuesto Q2 2024"
              value={formData.referencia}
              onChange={handleInputChange}
              rows={4}
              className="text-sm resize-none"
            />
          </div>

          {/* Adjuntos + Hojas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="adjuntos" className="text-xs">Nº Adjuntos</Label>
              <Input
                id="adjuntos"
                name="adjuntos"
                type="number"
                min="0"
                value={formData.adjuntos}
                onChange={handleInputChange}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hojas" className="text-xs">Nº Hojas</Label>
              <Input
                id="hojas"
                name="hojas"
                type="number"
                min="0"
                value={formData.hojas}
                onChange={handleInputChange}
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* Switch + Botón */}
          <div className="pt-2 border-t border-border/50 space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                id="hojaDeRuta"
                checked={formData.conHojaDeRuta}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="hojaDeRuta" className="text-xs cursor-pointer select-none">
                Incluir Hoja de Ruta
              </Label>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="text-xs"
              >
                Limpiar
              </Button>
              <Button
                onClick={handleGenerateDocument}
                disabled={!isValid}
                size="sm"
                className="flex-1 bg-primary text-xs"
              >
                {formData.conHojaDeRuta
                  ? 'Crear con Hoja de Ruta'
                  : 'Crear sin Hoja de Ruta'}
              </Button>
            </div>
          </div>
        </Card>

      </div>

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

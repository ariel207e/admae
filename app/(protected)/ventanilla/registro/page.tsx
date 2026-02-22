'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Check,
  ChevronsUpDown,
  Save,
  RotateCcw,
  FileText,
  User,
  Building2,
  FileStack,
  MessageSquareQuote,
  Stamp,
  Info,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

// Mock list of recipients
const destinatarios = [
  { id: 1, nombre: 'Lic. Ricardo Zuazo', cargo: 'Director Administrativo', institucion: 'ADMAE - Central' },
  { id: 2, nombre: 'Ing. Elena Torres', cargo: 'Jefe de Sistemas', institucion: 'ADMAE - TI' },
  { id: 3, nombre: 'Dr. Marcos Vaca', cargo: 'Asesor Legal', institucion: 'ADMAE - Legal' },
  { id: 4, nombre: 'Sofía Martínez', cargo: 'Encargada de Planillas', institucion: 'ADMAE - RRHH' },
  { id: 5, nombre: 'Mónica Suárez', cargo: 'Contadora General', institucion: 'ADMAE - Contabilidad' },
  { id: 6, nombre: 'Juan Pérez', cargo: 'Gerente General', institucion: 'ADMAE - Gerencia' },
];

export default function RegistroVentanillaPage() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    citeOriginal: '',
    destinatario: '',
    cargoDestinatario: '',
    institucionDestinatario: '',
    remitente: '',
    cargoRemitente: '',
    institucionRemitente: '',
    referencia: '',
    motivo: '',
    adjunto: '0',
    nroHojas: '1',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectDestinatario = (dest: typeof destinatarios[0]) => {
    setFormData(prev => ({
      ...prev,
      destinatario: dest.nombre,
      cargoDestinatario: dest.cargo,
      institucionDestinatario: dest.institucion,
    }));
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registro enviado:', formData);
    toast.success('Documento registrado con éxito', {
      description: `Se ha generado correctamente el registro para ${formData.citeOriginal}`,
    });
    // Reset form or redirect
  };

  const handleReset = () => {
    setFormData({
      citeOriginal: '',
      destinatario: '',
      cargoDestinatario: '',
      institucionDestinatario: '',
      remitente: '',
      cargoRemitente: '',
      institucionRemitente: '',
      referencia: '',
      motivo: '',
      adjunto: '0',
      nroHojas: '1',
    });
    toast.info('Formulario restablecido');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Registro en Ventanilla</h1>
          <p className="text-muted-foreground mt-1">Ingrese la información del documento externo para su tramitación interna.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Card */}
          <Card className="lg:col-span-2 shadow-lg border-primary/10 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <div className="flex items-center gap-2">
                <Stamp className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Datos del Documento</CardTitle>
              </div>
              <CardDescription>Información técnica y técnica del CITE entrante.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="citeOriginal" className="font-bold">CITE ORIGINAL</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground opacity-70" />
                    <Input
                      id="citeOriginal"
                      name="citeOriginal"
                      placeholder="Ej: MEFP/VPT/Nro-012/2026"
                      className="pl-10"
                      value={formData.citeOriginal}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivo" className="font-bold">Motivo</Label>
                  <Select
                    value={formData.motivo}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, motivo: val }))}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione un motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comunicacion">Comunicación</SelectItem>
                      <SelectItem value="denuncia">Denuncia</SelectItem>
                      <SelectItem value="conocimiento">Conocimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="referencia" className="font-bold">Referencia / Asunto</Label>
                  <div className="relative">
                    <MessageSquareQuote className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground opacity-70" />
                    <Input
                      id="referencia"
                      name="referencia"
                      placeholder="Breve descripción del contenido del documento"
                      className="pl-10 h-12"
                      value={formData.referencia}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Sender Info Section */}
                <div className="md:col-span-2 pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Separator className="flex-1" />
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-2">Información del Remitente</span>
                    <Separator className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remitente" className="font-bold">Remitente</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground opacity-70" />
                    <Input
                      id="remitente"
                      name="remitente"
                      placeholder="Nombre de la persona que envía"
                      className="pl-10"
                      value={formData.remitente}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargoRemitente" className="font-bold">Cargo Remitente</Label>
                  <Input
                    id="cargoRemitente"
                    name="cargoRemitente"
                    placeholder="Ej: Gerente de Finanzas"
                    value={formData.cargoRemitente}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="institucionRemitente" className="font-bold">Institución Remitente</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground opacity-70" />
                    <Input
                      id="institucionRemitente"
                      name="institucionRemitente"
                      placeholder="Ej: Ministerio de Economía y Finanzas Públicas"
                      className="pl-10"
                      value={formData.institucionRemitente}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Recipient & Stats */}
          <div className="space-y-6">
            <Card className="shadow-lg border-primary/10 overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Destinatario</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label className="font-bold">Buscar en Directorio</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between h-10 border-dashed hover:border-primary hover:bg-primary/5 transition-all"
                      >
                        {formData.destinatario || "Seleccionar destinatario..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0 shadow-2xl" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar por nombre o cargo..." />
                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {destinatarios.map((dest) => (
                              <CommandItem
                                key={dest.id}
                                value={dest.nombre}
                                onSelect={() => handleSelectDestinatario(dest)}
                                className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                              >
                                <div className="flex items-center w-full justify-between">
                                  <span className="font-bold text-sm">{dest.nombre}</span>
                                  {formData.destinatario === dest.nombre && <Check className="h-4 w-4 text-primary" />}
                                </div>
                                <span className="text-[10px] text-muted-foreground uppercase">{dest.cargo}</span>
                                <span className="text-[10px] italic text-primary">{dest.institucion}</span>
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-1.5 px-3 py-2 bg-muted/30 rounded-lg border border-dashed">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Nombre Completo:</p>
                    <p className="text-sm font-semibold">{formData.destinatario || '---'}</p>
                  </div>
                  <div className="space-y-1.5 px-3 py-2 bg-muted/30 rounded-lg border border-dashed">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Cargo Destinatario:</p>
                    <p className="text-sm font-semibold">{formData.cargoDestinatario || '---'}</p>
                  </div>
                  <div className="space-y-1.5 px-3 py-2 bg-muted/30 rounded-lg border border-dashed">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Institución Destino:</p>
                    <p className="text-sm font-semibold">{formData.institucionDestinatario || '---'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-primary/10 overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10 p-4">
                <div className="flex items-center gap-2">
                  <FileStack className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base uppercase tracking-wider">Folios y Anexos</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="nroHojas" className="text-xs font-bold">Nro. Hojas</Label>
                    <Input
                      id="nroHojas"
                      name="nroHojas"
                      type="number"
                      min="1"
                      value={formData.nroHojas}
                      onChange={handleInputChange}
                      className="font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="adjunto" className="text-xs font-bold">Cant. Adjuntos</Label>
                    <Input
                      id="adjunto"
                      name="adjunto"
                      type="number"
                      min="0"
                      value={formData.adjunto}
                      onChange={handleInputChange}
                      className="font-mono"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 pt-4">
              <Button type="submit" size="lg" className="w-full shadow-lg shadow-primary/25 font-bold gap-2">
                <Save className="h-5 w-5" />
                Registrar Documento
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={handleReset} className="w-full font-bold gap-2">
                <RotateCcw className="h-4 w-4" />
                Limpiar Formulario
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Footer Info Tips */}
      <div className="flex grid-cols-1 md:grid-cols-3 gap-6 opacity-60 px-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-full shrink-0">
            <Info className="h-4 w-4 text-primary" />
          </div>
          <p className="text-[10px] leading-relaxed italic">Asegúrese de que el CITE original coincida exactamente con la carátula física del documento externo.</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-full shrink-0">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-[10px] leading-relaxed italic">Al seleccionar un destinatario del directorio, el sistema validará automáticamente sus competencias de recepción.</p>
        </div>
      </div>
    </div>
  );
}

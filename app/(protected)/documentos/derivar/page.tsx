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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    User,
    Send,
    Clock,
    AlertCircle,
    History,
    XCircle,
    ArrowRightLeft,
    Calendar as CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { RecipientModal } from '@/components/documentos/RecipientModal';

// Mock data for the document being derived
const mockDocInfo = {
    referencia: 'Solicitud de aprobación presupuestal Q1 2026 para el departamento de IT',
    destinatario: 'Juan Carlos García',
    remitente: 'María López Rodríguez',
    isOwner: true, // Simulated: if true, can "Derivar principal"
};

// Mock data for existing derivations
const mockDerivations = [
    {
        id: 1,
        tipo: 'Original',
        nombre: 'Carlos Mendoza',
        cargo: 'Coordinador de Proyectos',
        proveido: 'Para su revisión y aprobación inmediata.',
        accion: 'Atención urgente',
        fechaMaxima: '2026-02-25',
    },
    {
        id: 2,
        tipo: 'Copia',
        nombre: 'Ana Rodríguez',
        cargo: 'Analista Financiero',
        proveido: 'Para su conocimiento.',
        accion: 'Para su conocimiento',
        fechaMaxima: null,
    }
];

export default function DerivarPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
    const [isUrgente, setIsUrgente] = useState(false);
    const [proveido, setProveido] = useState('');
    const [accion, setAccion] = useState('');
    const [fechaPlazo, setFechaPlazo] = useState('');
    const [tipoDerivacion, setTipoDerivacion] = useState('principal');
    const [derivations, setDerivations] = useState(mockDerivations);

    const handleDerivar = () => {
        if (!proveido || !accion || !selectedRecipient) {
            alert('Por favor complete los campos obligatorios (Destinatario, Proveido y Acción)');
            return;
        }

        const newDerivation = {
            id: Date.now(),
            tipo: tipoDerivacion === 'principal' ? 'Original' : 'Copia',
            nombre: selectedRecipient.nombre,
            cargo: selectedRecipient.cargo,
            proveido: proveido,
            accion: accion,
            fechaMaxima: fechaPlazo || null,
        };

        setDerivations([newDerivation, ...derivations]);
        alert('Documento derivado correctamente');

        // Clear form
        setProveido('');
        setAccion('');
        setFechaPlazo('');
        setSelectedRecipient(null);
    };

    const handleCancelDerivation = (id: number) => {
        if (confirm('¿Está seguro de que desea cancelar esta derivación?')) {
            setDerivations(derivations.filter(d => d.id !== id));
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Derivar Documento</h1>
            </div>

            {/* Card 1: Información del Documento */}
            <Card className="p-6 border-l-4 border-l-primary shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Send className="h-6 w-6 text-primary" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                        <div className="md:col-span-3">
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Referencia</Label>
                            <p className="text-lg font-semibold mt-1">{mockDocInfo.referencia}</p>
                        </div>
                        <div>
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Destinatario Actual</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{mockDocInfo.destinatario}</span>
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Remitente</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{mockDocInfo.remitente}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card 2: Formulario de Derivación */}
                <Card className="p-6 shadow-md border-t-4 border-t-blue-500">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-xl font-bold">Nueva Derivación</h2>
                    </div>

                    <div className="space-y-5">
                        {/* Destinatario Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="destinatario" className="font-semibold">Elegir Destinatario *</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="destinatario"
                                    readOnly
                                    placeholder="Seleccione un destinatario..."
                                    value={selectedRecipient ? `${selectedRecipient.nombre} - ${selectedRecipient.cargo}` : ''}
                                    className="bg-muted/30"
                                />
                                <Button onClick={() => setIsModalOpen(true)} variant="outline">
                                    Buscar
                                </Button>
                            </div>
                        </div>

                        {/* Tipo de Derivación */}
                        <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-dashed">
                            <Label className="font-semibold">Tipo de Derivación</Label>
                            <RadioGroup
                                value={tipoDerivacion}
                                onValueChange={setTipoDerivacion}
                                className="flex gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="principal" id="principal" disabled={!mockDocInfo.isOwner} />
                                    <Label htmlFor="principal" className={`cursor-pointer ${!mockDocInfo.isOwner ? 'text-muted-foreground' : ''}`}>
                                        Derivar Principal {!mockDocInfo.isOwner && '(Solo dueño)'}
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="copia" id="copia" />
                                    <Label htmlFor="copia" className="cursor-pointer">Derivar Copia</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Urgente Check */}
                        <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md border border-amber-200 dark:border-amber-900">
                            <Checkbox
                                id="urgente"
                                checked={isUrgente}
                                onCheckedChange={(checked) => setIsUrgente(checked as boolean)}
                            />
                            <Label htmlFor="urgente" className="text-amber-800 dark:text-amber-200 font-medium cursor-pointer flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Marcar como Urgente
                            </Label>
                        </div>

                        {/* Proveido Textarea */}
                        <div className="space-y-2">
                            <Label htmlFor="proveido" className="font-semibold">Proveido *</Label>
                            <Textarea
                                id="proveido"
                                placeholder="Escriba las instrucciones o comentarios..."
                                rows={4}
                                value={proveido}
                                onChange={(e) => setProveido(e.target.value)}
                                required
                            />
                            <p className="text-xs text-muted-foreground italic">
                                * Campo obligatorio: Instrucciones para el destinatario.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Acción Select */}
                            <div className="space-y-2">
                                <Label htmlFor="accion" className="font-semibold">Acción *</Label>
                                <Select value={accion} onValueChange={setAccion}>
                                    <SelectTrigger id="accion">
                                        <SelectValue placeholder="Seleccione acción..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Atención urgente">Atención urgente</SelectItem>
                                        <SelectItem value="Para su conocimiento">Para su conocimiento</SelectItem>
                                        <SelectItem value="Para VoBo">Para VoBo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Fecha Plazo */}
                            <div className="space-y-2">
                                <Label htmlFor="fechaPlazo" className="font-semibold text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    Fecha Plazo Máximo
                                </Label>
                                <Input
                                    id="fechaPlazo"
                                    type="date"
                                    value={fechaPlazo}
                                    onChange={(e) => setFechaPlazo(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button onClick={handleDerivar} className="w-full mt-4 bg-primary hover:bg-primary/90">
                            <Send className="mr-2 h-4 w-4" />
                            Realizar Derivación
                        </Button>
                    </div>
                </Card>

                {/* Card 3: Detalle de Derivaciones */}
                <Card className="p-6 shadow-md border-t-4 border-t-green-500 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <History className="h-5 w-5 text-green-600" />
                            Historial de Derivaciones
                        </h2>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                            {derivations.length} total
                        </Badge>
                    </div>

                    <div className="flex-1 overflow-auto space-y-4 pr-2">
                        {derivations.length > 0 ? (
                            derivations.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative border rounded-xl p-4 hover:shadow-md transition-all bg-card hover:border-green-200"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <Badge className={item.tipo === 'Original' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}>
                                                {item.tipo}
                                            </Badge>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">{item.accion}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 -mt-1 -mr-1"
                                            onClick={() => handleCancelDerivation(item.id)}
                                            title="Cancelar derivación"
                                        >
                                            <XCircle className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-1 mb-3">
                                        <p className="font-bold text-sm">{item.nombre}</p>
                                        <p className="text-[11px] text-muted-foreground uppercase tracking-tight">{item.cargo}</p>
                                    </div>

                                    <div className="bg-muted/30 p-3 rounded-lg text-sm italic text-muted-foreground mb-3 border-l-2 border-l-muted">
                                        "{item.proveido}"
                                    </div>

                                    <div className="flex items-center justify-between text-[11px] font-medium">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <CalendarIcon className="h-3 w-3" />
                                            <span>Plazo: {item.fechaMaxima ? format(new Date(item.fechaMaxima), 'dd/MM/yyyy', { locale: es }) : 'Sin plazo'}</span>
                                        </div>
                                        <span className="text-green-600">Activo</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/10 rounded-xl border-2 border-dashed">
                                <History className="h-12 w-12 text-muted-foreground/30 mb-2" />
                                <p className="text-muted-foreground">No hay derivaciones realizadas aún.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Reusing Recipient Modal from create page */}
            <RecipientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={(recipients) => {
                    if (recipients.length > 0) {
                        setSelectedRecipient(recipients[0]);
                    }
                    setIsModalOpen(false);
                }}
                selectedRecipients={selectedRecipient ? [selectedRecipient] : []}
            />
        </div>
    );
}


'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
    Printer,
    Search,
    Check,
    ChevronsUpDown,
    FileStack,
    FileText,
    Calendar,
    User,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Mock data for Hoja de Ruta
const hojaderutas = [
    { id: 1, codigo: 'ADM-2026-00045', referencia: 'Solicitud de reposición de activos fijos', fecha: new Date(2026, 1, 15), remitente: 'Juan Perez' },
    { id: 2, codigo: 'TEC-2026-00120', referencia: 'Mantenimiento preventivo de servidores core', fecha: new Date(2026, 1, 18), remitente: 'Ing. Elena Torres' },
    { id: 3, codigo: 'LEG-2026-00088', referencia: 'Revisión de contrato de servicios generales', fecha: new Date(2026, 1, 10), remitente: 'Dr. Marcos Vaca' },
    { id: 4, codigo: 'RRHH-2026-00215', referencia: 'Aprobación de planillas de sueldos enero', fecha: new Date(2026, 1, 28), remitente: 'Sofía Martínez' },
];

export default function HojaDeRutaPrintPage() {
    const [open, setOpen] = useState(false);
    const [selectedHR, setSelectedHR] = useState<typeof hojaderutas[0] | null>(null);
    const [imprimirProveido, setImprimirProveido] = useState(false);

    const handlePrint = () => {
        if (!selectedHR) {
            toast.error('Debe seleccionar una Hoja de Ruta');
            return;
        }

        toast.success('Generando impresión...', {
            description: `Iniciando impresión de ${selectedHR.codigo} ${imprimirProveido ? 'con proveído' : 'sin proveído'}.`,
        });

        // Logic for actual window.print() or PDF generation would go here
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Impresión de Hoja de Ruta</h1>
                    <p className="text-muted-foreground mt-1">Busque y genere la carátula oficial de seguimiento del trámite.</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                    <FileStack className="h-6 w-6 text-primary" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Selection Card */}
                <Card className="md:col-span-2 shadow-lg border-primary/10">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Search className="h-5 w-5 text-primary" />
                            Selección de Trámite
                        </CardTitle>
                        <CardDescription>Busque por código de Hoja de Ruta o Referencia.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="font-bold text-sm">Código de Hoja de Ruta</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full justify-between h-12 text-left font-mono font-bold text-base border-2 hover:border-primary transition-all"
                                    >
                                        {selectedHR ? selectedHR.codigo : "Seleccionar Hoja de Ruta..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[450px] p-0 shadow-2xl" align="start">
                                    <Command>
                                        <CommandInput placeholder="Buscar por código o referencia..." className="h-11" />
                                        <CommandEmpty>No se encontraron hojas de ruta.</CommandEmpty>
                                        <CommandGroup>
                                            <CommandList>
                                                {hojaderutas.map((hr) => (
                                                    <CommandItem
                                                        key={hr.id}
                                                        value={hr.codigo + " " + hr.referencia}
                                                        onSelect={() => {
                                                            setSelectedHR(hr);
                                                            setOpen(false);
                                                        }}
                                                        className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                                                    >
                                                        <div className="flex items-center w-full justify-between">
                                                            <span className="font-mono font-bold text-primary">{hr.codigo}</span>
                                                            {selectedHR?.id === hr.id && <Check className="h-4 w-4 text-primary" />}
                                                        </div>
                                                        <span className="text-xs text-foreground font-medium line-clamp-1">{hr.referencia}</span>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{format(hr.fecha, 'dd/MM/yyyy')}</span>
                                                            <span className="text-[10px] text-muted-foreground italic">Rem: {hr.remitente}</span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandList>
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {selectedHR && (
                            <div className="p-4 bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20 space-y-3 animate-in fade-in zoom-in-95 duration-300">
                                <div className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter leading-none">Referencia del Trámite</p>
                                        <p className="text-sm font-semibold">{selectedHR.referencia}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter leading-none">Fecha Inicio</p>
                                            <p className="text-xs font-medium">{format(selectedHR.fecha, 'PPP')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter leading-none">Iniciado por</p>
                                            <p className="text-xs font-medium">{selectedHR.remitente}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Action Card */}
                <div className="space-y-6">
                    <Card className="shadow-lg border-primary/10 overflow-hidden">
                        <CardHeader className="bg-primary/5 border-b border-primary/10">
                            <CardTitle className="text-lg">Opciones de Impresión</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center space-x-3 p-4 bg-muted/40 rounded-lg border border-transparent hover:border-primary/20 transition-all cursor-pointer select-none">
                                <Checkbox
                                    id="imprimirProveido"
                                    checked={imprimirProveido}
                                    onCheckedChange={(checked) => setImprimirProveido(checked as boolean)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="imprimirProveido"
                                        className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        Imprimir Proveído
                                    </label>
                                    <p className="text-[10px] text-muted-foreground">Incluir el texto del último proveído en la carátula.</p>
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 text-lg font-bold gap-3 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                                onClick={handlePrint}
                                disabled={!selectedHR}
                            >
                                <Printer className="h-6 w-6" />
                                Imprimir Documento
                            </Button>

                            {!selectedHR && (
                                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium">Seleccione una hoja de ruta para habilitar las opciones de impresión.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="px-4 text-[10px] text-muted-foreground italic leading-relaxed">
                        <p>Nota: La impresión se generará en formato estándar A4 según la normativa vigente de gestión documental de ADMAE.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    FileText,
    FileSearch,
    Download,
    Search,
    RotateCcw,
    Calendar,
    File,
    HardDrive,
    Eye,
    ExternalLink,
    X
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@/components/ui/sheet';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface UploadedFile {
    id: number;
    nombreArchivo: string;
    peso: string;
    cite: string;
    referencia: string;
    hojaDeRuta: string;
    fechaSubida: Date;
    tipo: string;
    url: string; // URL al PDF (mock)
}

const mockFiles: UploadedFile[] = [
    {
        id: 1,
        nombreArchivo: 'informe_tecnico_mantenimiento.pdf',
        peso: '2.4 MB',
        cite: 'G-001/2026',
        referencia: 'Reporte mensual de actividades de mantenimiento - Enero 2026',
        hojaDeRuta: 'ADM-2026-00050',
        fechaSubida: new Date(2026, 0, 22, 11, 30),
        tipo: 'application/pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
        id: 2,
        nombreArchivo: 'solicitud_vacaciones_2025.pdf',
        peso: '850 KB',
        cite: 'N-012/2026',
        referencia: 'Solicitud de vacaciones - Periodo 2025',
        hojaDeRuta: 'ADM-2026-00055',
        fechaSubida: new Date(2026, 0, 24, 14, 15),
        tipo: 'application/pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
        id: 3,
        nombreArchivo: 'notificacion_contrato_it.pdf',
        peso: '1.1 MB',
        cite: 'C-005/2026',
        referencia: 'Notificación de finalización de contrato de servicios IT',
        hojaDeRuta: 'ADM-2026-00060',
        fechaSubida: new Date(2026, 1, 1, 9, 0),
        tipo: 'application/pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
        id: 4,
        nombreArchivo: 'balance_anual_2025.pdf',
        peso: '4.8 MB',
        cite: 'G-015/2026',
        referencia: 'Balance anual consolidado - Gestión 2025',
        hojaDeRuta: 'ADM-2026-00065',
        fechaSubida: new Date(2026, 1, 10, 16, 45),
        tipo: 'application/pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
        id: 5,
        nombreArchivo: 'propuesta_reestructuracion.pdf',
        peso: '3.2 MB',
        cite: 'N-020/2026',
        referencia: 'Propuesta de reestructuración de equipos de campo',
        hojaDeRuta: 'ADM-2026-00070',
        fechaSubida: new Date(2026, 1, 15, 11, 20),
        tipo: 'application/pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    }
];

export default function MisArchivosPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);

    const filteredFiles = useMemo(() => {
        return mockFiles.filter((file) => {
            const matchesSearch =
                file.nombreArchivo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                file.referencia.toLowerCase().includes(searchQuery.toLowerCase()) ||
                file.hojaDeRuta.toLowerCase().includes(searchQuery.toLowerCase()) ||
                file.cite.toLowerCase().includes(searchQuery.toLowerCase());

            let dateMatch = true;
            if (dateFrom) {
                const from = new Date(dateFrom);
                dateMatch = dateMatch && file.fechaSubida >= from;
            }
            if (dateTo) {
                const to = new Date(dateTo);
                to.setHours(23, 59, 59, 999);
                dateMatch = dateMatch && file.fechaSubida <= to;
            }

            return matchesSearch && dateMatch;
        });
    }, [searchQuery, dateFrom, dateTo]);

    const handleClearFilters = () => {
        setSearchQuery('');
        setDateFrom('');
        setDateTo('');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mis Archivos</h1>
                    <p className="text-muted-foreground mt-1 text-sm lg:text-base">Listado de archivos digitales subidos al sistema.</p>
                </div>
                <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-lg border border-primary/10">
                    <HardDrive className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase opacity-70">Almacenamiento</p>
                        <p className="text-sm font-bold">12.3 MB utilizados</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <Card className="p-4">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="search" className="text-sm">
                                Buscar Archivo
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Nombre, HR, Cite o Referencia..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateFrom" className="text-sm">
                                Subido Desde
                            </Label>
                            <Input
                                id="dateFrom"
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateTo" className="text-sm">
                                Subido Hasta
                            </Label>
                            <Input
                                id="dateTo"
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={handleClearFilters}
                            size="sm"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Limpiar Filtros
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            {filteredFiles.length} archivos encontrados
                        </p>
                    </div>
                </div>
            </Card>

            {/* Files List */}
            <Card className="overflow-hidden shadow-sm">
                {filteredFiles.length > 0 ? (
                    <div className="divide-y text-sm">
                        {/* Header */}
                        <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-muted/50 font-semibold text-muted-foreground">
                            <div className="flex-1">Nombre del Archivo</div>
                            <div className="w-[100px]">Peso</div>
                            <div className="w-[120px]">CITE</div>
                            <div className="w-[140px]">Hoja de Ruta</div>
                            <div className="w-[140px]">Fecha Subida</div>
                        </div>

                        {/* Rows */}
                        {filteredFiles.map((file) => (
                            <div
                                key={file.id}
                                className="flex flex-col lg:flex-row lg:items-center gap-4 px-4 lg:px-6 py-4 hover:bg-muted/30 transition-colors"
                            >
                                {/* File Identity */}
                                <div className="flex-1 flex items-start gap-3">
                                    <div className="p-2 bg-red-50 dark:bg-red-950 rounded border border-red-100 dark:border-red-900">
                                        <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => setSelectedFile(file)}
                                            className="font-bold text-primary hover:underline text-left"
                                        >
                                            {file.nombreArchivo}
                                        </button>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic" title={file.referencia}>
                                            {file.referencia}
                                        </p>
                                    </div>
                                </div>

                                {/* Other Info */}
                                <div className="grid grid-cols-2 lg:flex lg:items-center gap-4 text-[12px] lg:text-sm">
                                    <div className="lg:w-[100px] flex items-center gap-2">
                                        <span className="lg:hidden text-muted-foreground font-semibold">Peso:</span>
                                        <Badge variant="secondary" className="font-normal opacity-80">{file.peso}</Badge>
                                    </div>

                                    <div className="lg:w-[120px] flex lg:flex-col lg:items-start gap-2">
                                        <span className="lg:hidden text-muted-foreground font-semibold">CITE:</span>
                                        <span className="font-mono text-[11px] bg-muted px-2 py-0.5 rounded border">
                                            {file.cite}
                                        </span>
                                    </div>

                                    <div className="lg:w-[140px] flex lg:flex-col lg:items-start gap-2">
                                        <span className="lg:hidden text-muted-foreground font-semibold">HR:</span>
                                        <span className="font-bold text-primary/80">
                                            {file.hojaDeRuta}
                                        </span>
                                    </div>

                                    <div className="lg:w-[140px] flex lg:flex-col lg:items-start gap-2 lg:text-right">
                                        <span className="lg:hidden text-muted-foreground font-semibold">Fecha:</span>
                                        <div className="flex items-center gap-1.5 text-muted-foreground whitespace-nowrap">
                                            <Calendar className="h-3 w-3" />
                                            {format(file.fechaSubida, 'dd/MM/yyyy HH:mm', { locale: es })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-20 text-center bg-muted/10">
                        <FileSearch className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg italic">
                            No se encontraron archivos digitales.
                        </p>
                        <Button variant="link" onClick={handleClearFilters} className="mt-2 text-primary">
                            Ver todos los archivos
                        </Button>
                    </div>
                )}
            </Card>

            {/* Lateral Drawer for PDF Preview */}
            <Sheet open={!!selectedFile} onOpenChange={(open) => !open && setSelectedFile(null)}>
                <SheetContent
                    side="right"
                    className="max-w-[80%] w-[80%] p-0 sm:max-w-none flex flex-col h-screen"
                >
                    <SheetHeader className="p-6 border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 dark:bg-red-900 rounded">
                                    <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <SheetTitle className="text-xl font-bold">{selectedFile?.nombreArchivo}</SheetTitle>
                                    <SheetDescription>
                                        Hoja de Ruta: {selectedFile?.hojaDeRuta} | CITE: {selectedFile?.cite}
                                    </SheetDescription>
                                </div>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 bg-muted/30 overflow-hidden relative">
                        {selectedFile ? (
                            <iframe
                                src={`${selectedFile.url}#view=FitH`}
                                className="w-full h-full border-none"
                                title="PDF Preview"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-muted-foreground">Cargando visualizador...</p>
                            </div>
                        )}

                        {/* Action floating buttons in drawer */}
                        <div className="absolute top-4 right-10 flex gap-2">
                            <Button variant="secondary" size="sm" asChild>
                                <a href={selectedFile?.url} download={selectedFile?.nombreArchivo}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Descargar
                                </a>
                            </Button>
                            <Button variant="secondary" size="sm" asChild>
                                <a href={selectedFile?.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Abrir en pestaña
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 border-t bg-muted/5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <p>Referencia: <span className="font-semibold text-foreground italic">"{selectedFile?.referencia}"</span></p>
                            <Badge variant="outline" className="text-[10px]">PDF Document - {selectedFile?.peso}</Badge>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

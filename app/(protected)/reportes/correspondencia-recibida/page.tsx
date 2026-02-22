'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Inbox,
    Printer,
    FileDown,
    Search,
    Calendar
} from 'lucide-react';

export default function ReporteRecibidosPage() {
    const mockData = [
        { id: 1, hojaderuta: 'EXT-2026-00012', remitente: 'Ministerio de Economía', fecha: '2026-02-20', asunto: 'Solicitud de información presupuestaria' },
        { id: 2, hojaderuta: 'EXT-2026-00015', remitente: 'Gobierno Autónomo La Paz', fecha: '2026-02-21', asunto: 'Convenio interinstitucional' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reporte: Correspondencia Recibida</h1>
                    <p className="text-muted-foreground mt-1">Consolidad de documentos externos recepcionados por Ventanilla.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 font-bold transition-all hover:bg-muted">
                        <FileDown className="h-4 w-4" /> Exportar
                    </Button>
                    <Button className="gap-2 font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30">
                        <Printer className="h-4 w-4" /> Imprimir Libro
                    </Button>
                </div>
            </div>

            <Card className="shadow-md">
                <CardHeader className="bg-primary/5 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <CardTitle className="text-lg">Filtros de Período</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input type="date" className="h-9 w-40" />
                            <span className="text-muted-foreground">al</span>
                            <Input type="date" className="h-9 w-40" />
                        </div>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="font-bold">Hoja de Ruta</TableHead>
                                <TableHead className="font-bold">Remitente</TableHead>
                                <TableHead className="font-bold">Fecha Recibido</TableHead>
                                <TableHead className="font-bold">Asunto / Referencia</TableHead>
                                <TableHead className="text-right font-bold">Detalle</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockData.map((row) => (
                                <TableRow key={row.id} className="hover:bg-muted/10">
                                    <TableCell className="font-mono font-bold text-primary">{row.hojaderuta}</TableCell>
                                    <TableCell className="font-semibold">{row.remitente}</TableCell>
                                    <TableCell className="text-xs font-medium">{row.fecha}</TableCell>
                                    <TableCell className="max-w-xs truncate text-xs italic">"{row.asunto}"</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}

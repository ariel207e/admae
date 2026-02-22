'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Send, Printer, FileDown, Search, ArrowRight } from 'lucide-react';

export default function ReporteEnviadosPage() {
    const mockData = [
        { id: 1, hojaderuta: 'ADM-2026-00045', destinatario: 'Ricardo Zuazo', institucion: 'ADMAE - Central', fecha: '2026-02-20' },
        { id: 2, hojaderuta: 'ADM-2026-00048', destinatario: 'Elena Torres', institucion: 'ADMAE - TI', fecha: '2026-02-22' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reporte: Correspondencia Enviada</h1>
                    <p className="text-muted-foreground mt-1">Registro de documentos derivados a otras unidades o externos.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 font-bold shadow-sm">
                        <FileDown className="h-4 w-4" /> Excel
                    </Button>
                    <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
                        <Printer className="h-4 w-4" /> Imprimir Envío
                    </Button>
                </div>
            </div>

            <Card className="shadow-lg border-primary/10 overflow-hidden">
                <TableHeader className="bg-primary/5">
                    <TableRow>
                        <TableHead className="font-bold">Hoja de Ruta</TableHead>
                        <TableHead className="font-bold">Destinatario</TableHead>
                        <TableHead className="font-bold">Institución / Unidad</TableHead>
                        <TableHead className="font-bold">Fecha de Envío</TableHead>
                        <TableHead className="text-right font-bold w-[100px]">Acción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockData.map((row) => (
                        <TableRow key={row.id} className="group cursor-default hover:bg-muted/30 transition-colors">
                            <TableCell className="font-mono font-black text-primary group-hover:underline transition-all underline-offset-4">{row.hojaderuta}</TableCell>
                            <TableCell className="font-medium">{row.destinatario}</TableCell>
                            <TableCell className="text-xs uppercase text-muted-foreground font-bold">{row.institucion}</TableCell>
                            <TableCell className="text-sm">{row.fecha}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="group-hover:text-primary group-hover:scale-110 transition-transform">
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Card>

            <div className="p-4 bg-muted/40 rounded-xl border border-dashed text-center">
                <p className="text-xs text-muted-foreground flex flex-col items-center gap-2">
                    <Send className="h-8 w-8 opacity-20" />
                    Mostrando correspondencia del día actual. Seleccione un rango para búsquedas históricas.
                </p>
            </div>
        </div>
    );
}

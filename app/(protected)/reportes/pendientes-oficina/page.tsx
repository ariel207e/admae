'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    Clock,
    Printer,
    FileDown,
    Search,
    Filter,
    AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

export default function ReportePendientesOficinaPage() {
    const mockData = [
        { id: 1, hojaderuta: 'ADM-2026-00045', referencia: 'Solicitud de reposición', dias: 5, estado: 'Crítico' },
        { id: 2, hojaderuta: 'TEC-2026-00120', referencia: 'Mantenimiento preventivo', dias: 2, estado: 'Atención' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reporte: Pendientes de Oficina</h1>
                    <p className="text-muted-foreground mt-1">Trámites sin derivar o con retraso en la unidad actual.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 font-bold">
                        <FileDown className="h-4 w-4" /> Exportar
                    </Button>
                    <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
                        <Printer className="h-4 w-4" /> Imprimir Reporte
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-full">
                            <Clock className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Total Pendientes</p>
                            <p className="text-2xl font-black text-amber-900 dark:text-amber-100">12 Trámites</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg">Listado Detallado</CardTitle>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar por código..." className="pl-9 h-9" />
                        </div>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-bold">Hoja de Ruta</TableHead>
                                <TableHead className="font-bold">Referencia</TableHead>
                                <TableHead className="font-bold">Días en Oficina</TableHead>
                                <TableHead className="font-bold">Estado</TableHead>
                                <TableHead className="text-right font-bold">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="font-mono font-bold text-primary">{row.hojaderuta}</TableCell>
                                    <TableCell className="max-w-xs truncate">{row.referencia}</TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-2 font-semibold">
                                            {row.dias} días
                                            {row.dias > 3 && <AlertCircle className="h-4 w-4 text-destructive" />}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={row.estado === 'Crítico' ? 'destructive' : 'secondary'} className="font-bold uppercase text-[10px]">
                                            {row.estado}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Ver Ficha</Button>
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

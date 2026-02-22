'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Printer, Download, Search, Filter, Hash, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

export default function ReporteLibroSEPage() {
    const mockData = [
        { nro: '102-26', hojaderuta: 'ADM-2026-00045', fecha: '2026-02-22', rem: 'Juan Perez', cargo: 'Ventanilla', prov: 'Derivado para revisión legal urgente.' },
        { nro: '103-26', hojaderuta: 'ADM-2026-00046', fecha: '2026-02-22', rem: 'Maria Choque', cargo: 'Secretaria', prov: 'Archivo definitivo por conclusión de trámite.' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                        <BookOpen className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Libro SE (Salida y Entrada)</h1>
                        <p className="text-muted-foreground mt-1">Registro cronológico oficial de todos los ingresos y salidas de la oficina.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 font-bold transition-all active:scale-95">
                        <Download className="h-4 w-4" /> Exportar
                    </Button>
                    <Button className="gap-2 font-bold shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 transition-all active:scale-95">
                        <Printer className="h-4 w-4" /> Imprimir Folios
                    </Button>
                </div>
            </div>

            <Card className="shadow-lg border-emerald-500/10 overflow-hidden">
                <CardHeader className="bg-emerald-500/5 border-b border-emerald-500/10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Buscar por número o remitente..." className="pl-9 h-9" />
                            </div>
                            <Button variant="ghost" className="gap-2 text-xs font-bold uppercase tracking-wider">
                                <Filter className="h-3 w-3" /> Filtros
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-700 tracking-widest bg-emerald-100/50 px-3 py-1.5 rounded-full border border-emerald-200">
                            GESTIÓN 2026 • LIBRO NRO 04
                        </div>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow>
                                <TableHead className="w-[80px] font-bold text-center">NRO</TableHead>
                                <TableHead className="font-bold">Hoja de Ruta</TableHead>
                                <TableHead className="font-bold">Remitente</TableHead>
                                <TableHead className="font-bold">Cargo</TableHead>
                                <TableHead className="font-bold">Proveído</TableHead>
                                <TableHead className="w-[60px] text-right font-bold"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-sm">
                            {mockData.map((row) => (
                                <TableRow key={row.nro} className="hover:bg-emerald-50/30">
                                    <TableCell className="text-center">
                                        <span className="inline-flex items-center justify-center h-7 w-12 rounded bg-muted text-[11px] font-black border uppercase">
                                            {row.nro}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-mono font-bold text-emerald-700">{row.hojaderuta}</TableCell>
                                    <TableCell className="font-semibold">{row.rem}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground italic truncate max-w-[120px]">{row.cargo}</TableCell>
                                    <TableCell className="max-w-xs">
                                        <p className="text-xs leading-relaxed italic border-l-2 border-emerald-200 pl-3">"{row.prov}"</p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-muted/20 border-dashed">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Última Apertura de Libro</p>
                            <p className="text-sm font-bold">22 de Febrero, 2026 - 08:30 AM</p>
                        </div>
                        <Hash className="h-8 w-8 opacity-10" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

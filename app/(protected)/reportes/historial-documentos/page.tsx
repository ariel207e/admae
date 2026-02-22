'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Search, ArrowRight, Clock, User, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ReporteHistorialDocumentosPage() {
    const mockHistory = [
        { id: 1, hojaderuta: 'ADM-2026-00045', accion: 'Derivación', fecha: '2026-02-22 14:30', usuario: 'Ricardo Zuazo', destino: 'Gerencia' },
        { id: 2, hojaderuta: 'ADM-2026-00045', accion: 'Subsanación', fecha: '2026-02-22 10:15', usuario: 'Elena Torres', destino: 'Sistemas' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-rose-500/10 rounded-xl">
                        <History className="h-8 w-8 text-rose-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Historial de Documentos</h1>
                        <p className="text-muted-foreground mt-1">Auditabilidad completa de todos los estados y cambios de cada trámite.</p>
                    </div>
                </div>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Ingrese Hoja de Ruta para ver historial..." className="pl-10 h-10 border-2 focus-visible:ring-rose-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                        {mockHistory.map((item) => (
                            <div key={item.id} className="relative">
                                <div className="absolute -left-[26px] top-1 p-1 bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-full z-10 shadow-sm">
                                    <Clock className="h-3 w-3 text-rose-500" />
                                </div>
                                <Card className="shadow-sm border-none bg-muted/20 hover:bg-muted/40 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none font-bold uppercase text-[9px]">{item.accion}</Badge>
                                                        <span className="text-xs font-black font-mono">{item.hojaderuta}</span>
                                                    </div>
                                                    <p className="text-sm font-bold flex items-center gap-2">
                                                        <User className="h-3 w-3 opacity-50" /> {item.usuario}
                                                        <ArrowRight className="h-3 w-3 opacity-30" />
                                                        <span className="text-muted-foreground italic">{item.destino}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border">
                                                <Calendar className="h-3 w-3" />
                                                {item.fecha}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

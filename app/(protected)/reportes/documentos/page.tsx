'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Files, FileText, Search, Printer, Download, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ReporteDocumentosPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/10 rounded-xl">
                        <Files className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Reporte General de Documentos</h1>
                        <p className="text-muted-foreground mt-1">Visión global de toda la documentación generada en el sistema.</p>
                    </div>
                </div>
            </div>

            {/* Stats Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Informes', count: 154, color: 'blue' },
                    { label: 'Notas', count: 88, color: 'indigo' },
                    { label: 'Circulares', count: 12, color: 'amber' },
                    { label: 'Proyectos', count: 4, color: 'emerald' },
                ].map((stat) => (
                    <Card key={stat.label} className="shadow-sm border-none bg-white dark:bg-slate-900 ring-1 ring-slate-200">
                        <CardContent className="p-4">
                            <p className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</p>
                            <p className="text-2xl font-black mt-1">{stat.count}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
                        <CardDescription>Localice documentos por sus metadatos.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                        <Filter className="h-5 w-5" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar por referencia, CITE o palabras clave..." className="pl-10 h-10" />
                        </div>
                        <Button className="font-bold gap-2">
                            <Printer className="h-4 w-4" /> Generar Listado
                        </Button>
                        <Button variant="outline" className="font-bold gap-2">
                            <Download className="h-4 w-4" /> CSV
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        {/* Document Preview Placeholder */}
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="group hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer overflow-hidden border-dashed">
                                <CardContent className="p-0">
                                    <div className="bg-muted p-8 flex items-center justify-center">
                                        <FileText className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <p className="text-xs font-black text-primary uppercase">CITE-ADM-00{i}/2026</p>
                                        <p className="text-sm font-bold truncate">Referencia del documento ejemplo {i}</p>
                                        <p className="text-[10px] text-muted-foreground">Generado hace {i} horas • Por: Administrador</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

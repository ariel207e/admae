'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { FileSearch, Settings2, Play, Download, Save } from 'lucide-react';

export default function ReportePersonalizadoPage() {
    const [columns, setColumns] = useState(['Hoja de Ruta', 'Referencia', 'Estado', 'Fecha']);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl shadow-inner">
                        <Settings2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Reportes Personalizados</h1>
                        <p className="text-muted-foreground mt-1">Configure sus propios parámetros para generar un reporte a medida.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Configuration Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="shadow-lg border-primary/10">
                        <CardHeader className="bg-primary/5">
                            <CardTitle className="text-sm uppercase tracking-widest font-black">Dimensiones</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {['Hoja de Ruta', 'Referencia', 'CITE', 'Estado', 'Fecha', 'Remitente', 'Destinatario', 'Oficina Actual'].map((col) => (
                                <div key={col} className="flex items-center space-x-2">
                                    <Checkbox id={col} checked={columns.includes(col)} />
                                    <label htmlFor={col} className="text-sm font-medium leading-none cursor-pointer">{col}</label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Button className="w-full gap-2 font-bold shadow-lg shadow-primary/20 h-12">
                        <Play className="h-4 w-4" /> Generar Vista Previa
                    </Button>
                </div>

                {/* Filters & Results */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileSearch className="h-5 w-5 text-primary" />
                                Parámetros de Filtrado
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="font-bold">Estado del Trámite</Label>
                                <Select defaultValue="all">
                                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="pendiente">Pendiente</SelectItem>
                                        <SelectItem value="recepcionado">Recepcionado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Tipo de Proceso</Label>
                                <Select defaultValue="all">
                                    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="admin">Administrativo</SelectItem>
                                        <SelectItem value="legal">Legal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label className="font-bold">Criterio de Fecha</Label>
                                <div className="flex gap-4">
                                    <Input type="date" className="flex-1" />
                                    <Input type="date" className="flex-1" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="p-12 border-dashed flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                        <div className="p-6 bg-muted rounded-full">
                            <FileSearch className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold">Sin resultados para mostrar</p>
                            <p className="text-sm max-w-xs mx-auto text-muted-foreground">Ajuste los filtros de la izquierda y haga clic en "Generar Vista Previa".</p>
                        </div>
                    </Card>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" className="gap-2 font-bold h-11 border-2">
                            <Save className="h-4 w-4" /> Guardar Filtro
                        </Button>
                        <Button variant="secondary" className="gap-2 font-bold h-11 border-2">
                            <Download className="h-4 w-4" /> Exportar a PDF
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

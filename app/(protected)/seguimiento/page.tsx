'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import {
  Search,
  Eye,
  History,
  FileSearch,
  Filter,
  Calendar,
  Clock,
  ArrowUpDown,
  FileText,
  User,
  MapPin,
  MessageSquare,
  Paperclip,
  Activity,
  Layers,
  ArrowRight,
  Stamp,
  CheckCircle2,
  Archive,
  Info,
  RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Derivacion {
  id: number;
  fecha: Date;
  proveido: string;
  estado: string;
  emisor: {
    nombre: string;
    cargo: string;
    unidad: string;
  };
  receptor: {
    nombre: string;
    cargo: string;
    unidad: string;
  };
  actual?: boolean;
}

interface SeguimientoDoc {
  id: number;
  hojaDeRuta: string;
  referencia: string;
  citeOriginal: string;
  proceso: string;
  tipoDocumento: string;
  fechaCreacion: Date;
  destinatario: string; // Destinatario final/actual
  cargo: string;
  proveido: string; // Proveído actual
  fechaEnvio: Date;
  estado: 'Enviado' | 'Recepcionado' | 'Archivado';
  tipo: 'Salida' | 'Entrada' | 'Archivo';
  adjunto?: { nombre: string; url: string } | null;
  agrupado?: boolean;
  derivaciones: Derivacion[];
}

const mockDocs: SeguimientoDoc[] = [
  {
    id: 1,
    hojaDeRuta: 'ADM-2026-00045',
    referencia: 'Solicitud de reposición de activos fijos - Planta Central',
    citeOriginal: 'OF-FIN-001/2026',
    proceso: 'Gestión de Activos',
    tipoDocumento: 'Nota',
    fechaCreacion: new Date(2026, 1, 15, 0, 0),
    destinatario: 'Lic. Ricardo Zuazo',
    cargo: 'Director Administrativo',
    proveido: 'Para su revisión y firma de contrato adjunto.',
    fechaEnvio: new Date(2026, 1, 20, 10, 30),
    estado: 'Recepcionado',
    tipo: 'Salida',
    adjunto: { nombre: 'contrato_activos.pdf', url: '#' },
    agrupado: false,
    derivaciones: [
      {
        id: 1,
        fecha: new Date(2026, 1, 15, 9, 30),
        proveido: 'Registro inicial de solicitud.',
        estado: 'Generado',
        emisor: { nombre: 'Juan Perez', cargo: 'Ventanilla', unidad: 'Administración' },
        receptor: { nombre: 'Ana Lopez', cargo: 'Jefe Depto', unidad: 'Finanzas' }
      },
      {
        id: 2,
        fecha: new Date(2026, 1, 18, 14, 0),
        proveido: 'Se adjunta informe técnico detallado.',
        estado: 'Derivado',
        emisor: { nombre: 'Ana Lopez', cargo: 'Jefe Depto', unidad: 'Finanzas' },
        receptor: { nombre: 'Ricardo Zuazo', cargo: 'Director', unidad: 'Dirección Administrativa' }
      },
      {
        id: 3,
        fecha: new Date(2026, 1, 20, 10, 30),
        proveido: 'Para su revisión y firma de contrato adjunto.',
        estado: 'Recepcionado',
        emisor: { nombre: 'Ricardo Zuazo', cargo: 'Director', unidad: 'Dirección Administrativa' },
        receptor: { nombre: 'Ricardo Zuazo', cargo: 'Director', unidad: 'Dirección Administrativa' },
        actual: true
      }
    ]
  },
  {
    id: 2,
    hojaDeRuta: 'TEC-2026-00120',
    referencia: 'Mantenimiento preventivo de servidores core',
    citeOriginal: 'TEC-INF-088/2026',
    proceso: 'Infraestructura Tecnológica',
    tipoDocumento: 'Informe',
    fechaCreacion: new Date(2026, 1, 18, 0, 0),
    destinatario: 'Ing. Elena Torres',
    cargo: 'Jefe de Sistemas',
    proveido: 'Atención inmediata por falla en servidor central de datos.',
    fechaEnvio: new Date(2026, 1, 21, 14, 15),
    estado: 'Enviado',
    tipo: 'Salida',
    adjunto: null,
    agrupado: true,
    derivaciones: [
      {
        id: 10,
        fecha: new Date(2026, 1, 18, 11, 0),
        proveido: 'Derivado para revisión técnica inmediata.',
        estado: 'Generado',
        emisor: { nombre: 'Soporte Nivel 1', cargo: 'Técnico', unidad: 'Sistemas' },
        receptor: { nombre: 'Ing. Elena Torres', cargo: 'Jefe', unidad: 'Sistemas' }
      },
      {
        id: 11,
        fecha: new Date(2026, 1, 21, 14, 15),
        proveido: 'Atención inmediata por falla en servidor central de datos.',
        estado: 'Enviado',
        emisor: { nombre: 'Ing. Elena Torres', cargo: 'Jefe', unidad: 'Sistemas' },
        receptor: { nombre: 'Core Team', cargo: 'Administradores', unidad: 'Datacenter' },
        actual: true
      }
    ]
  }
];

export default function SeguimientoPage() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    hojaDeRuta: '',
    cite: '',
    tipoDocumento: 'all',
    referencia: '',
    destinatario: '',
    cargoDestinatario: '',
    remitente: '',
    cargoRemitente: '',
    proveido: '',
    dateFrom: '',
    dateTo: '',
    estado: 'all',
  });
  const [selectedDoc, setSelectedDoc] = useState<SeguimientoDoc | null>(null);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      hojaDeRuta: '',
      cite: '',
      tipoDocumento: 'all',
      referencia: '',
      destinatario: '',
      cargoDestinatario: '',
      remitente: '',
      cargoRemitente: '',
      proveido: '',
      dateFrom: '',
      dateTo: '',
      estado: 'all',
    });
  };

  const filteredDocs = useMemo(() => {
    return mockDocs.filter(doc => {
      const matchesHR = doc.hojaDeRuta.toLowerCase().includes(filters.hojaDeRuta.toLowerCase());
      const matchesCite = doc.citeOriginal.toLowerCase().includes(filters.cite.toLowerCase());
      const matchesRef = doc.referencia.toLowerCase().includes(filters.referencia.toLowerCase());
      const matchesDest = doc.destinatario.toLowerCase().includes(filters.destinatario.toLowerCase());
      const matchesCargoDest = doc.cargo.toLowerCase().includes(filters.cargoDestinatario.toLowerCase());
      const matchesProv = doc.proveido.toLowerCase().includes(filters.proveido.toLowerCase());

      const matchesStatus = filters.estado === 'all' || doc.estado === filters.estado;
      const matchesType = filters.tipoDocumento === 'all' || doc.tipoDocumento === filters.tipoDocumento;

      // For Remitente, we'll check the first derivation (generator/sender)
      const firstDer = doc.derivaciones[0];
      const matchesRem = firstDer.emisor.nombre.toLowerCase().includes(filters.remitente.toLowerCase());
      const matchesCargoRem = firstDer.emisor.cargo.toLowerCase().includes(filters.cargoRemitente.toLowerCase());

      let dateMatch = true;
      if (filters.dateFrom) {
        dateMatch = dateMatch && doc.fechaCreacion >= new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59);
        dateMatch = dateMatch && doc.fechaCreacion <= toDate;
      }

      return matchesHR && matchesCite && matchesRef && matchesDest &&
        matchesCargoDest && matchesProv && matchesStatus &&
        matchesType && matchesRem && matchesCargoRem && dateMatch;
    });
  }, [filters]);

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Enviado':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Enviado</Badge>;
      case 'Recepcionado':
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">Recepcionado</Badge>;
      case 'Archivado':
        return <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-300">Archivado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seguimiento de Documentos</h1>
          <p className="text-muted-foreground mt-1">Siga el estado y recorrido de toda su documentación en tiempo real.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border">
          <History className="h-4 w-4" />
          <span>Última actualización: {format(new Date(), "HH:mm:ss")}</span>
        </div>
      </div>

      {/* Modern Filter Section */}
      <Card className="p-4 bg-muted/5 border-dashed space-y-4">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full text-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtro rápido por Hoja de Ruta..."
              className="pl-10 h-10 border-muted-foreground/20 focus-visible:ring-primary"
              value={filters.hojaDeRuta}
              onChange={(e) => handleFilterChange('hojaDeRuta', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <Button
              variant={showAdvanced ? "default" : "outline"}
              className={cn("h-10 gap-2 font-bold", showAdvanced && "bg-primary text-white hover:bg-primary/90")}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4" />
              {showAdvanced ? "Ocultar Filtros" : "Más Filtros"}
            </Button>

            <Button
              variant="outline"
              className="h-10 w-10 p-0"
              onClick={resetFilters}
              title="Restablecer filtros"
            >
              <RotateCcw className="h-4 w-4 opacity-70" />
            </Button>
          </div>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-dashed animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-1">Cite Original</Label>
              <Input
                placeholder="Ej: OF-FIN-001..."
                className="h-9 text-xs"
                value={filters.cite}
                onChange={(e) => handleFilterChange('cite', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-1">Tipo Documento</Label>
              <Select value={filters.tipoDocumento} onValueChange={(val) => handleFilterChange('tipoDocumento', val)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Nota">Nota</SelectItem>
                  <SelectItem value="Informe">Informe</SelectItem>
                  <SelectItem value="Circular">Circular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-1">Destinatario</Label>
              <Input
                placeholder="Nombre destinatario..."
                className="h-9 text-xs"
                value={filters.destinatario}
                onChange={(e) => handleFilterChange('destinatario', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-1">Cargo Destinatario</Label>
              <Input
                placeholder="Cargo..."
                className="h-9 text-xs"
                value={filters.cargoDestinatario}
                onChange={(e) => handleFilterChange('cargoDestinatario', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-1">Remitente</Label>
              <Input
                placeholder="Nombre remitente..."
                className="h-9 text-xs"
                value={filters.remitente}
                onChange={(e) => handleFilterChange('remitente', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-1">Cargo Remitente</Label>
              <Input
                placeholder="Cargo..."
                className="h-9 text-xs"
                value={filters.cargoRemitente}
                onChange={(e) => handleFilterChange('cargoRemitente', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-1">Referencia</Label>
              <Input
                placeholder="Contenido en referencia..."
                className="h-9 text-xs"
                value={filters.referencia}
                onChange={(e) => handleFilterChange('referencia', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-1">Proveído</Label>
              <Input
                placeholder="Contenido en proveído..."
                className="h-9 text-xs"
                value={filters.proveido}
                onChange={(e) => handleFilterChange('proveido', e.target.value)}
              />
            </div>

            <div className="space-y-1.5 lg:col-span-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-1">Rango de Creación (Desde - Hasta)</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  className="h-9 text-xs flex-1"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
                <Input
                  type="date"
                  className="h-9 text-xs flex-1"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-1">Estado</Label>
              <Select value={filters.estado} onValueChange={(val) => handleFilterChange('estado', val)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Enviado">Enviado</SelectItem>
                  <SelectItem value="Recepcionado">Recepcionado</SelectItem>
                  <SelectItem value="Archivado">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </Card>

      {/* Results Table */}
      <Card className="overflow-hidden shadow-md border-t-4 border-t-primary">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[180px] font-bold">Hoja de Ruta</TableHead>
                <TableHead className="w-[200px] font-bold">Destinatario</TableHead>
                <TableHead className="w-[200px] font-bold hidden md:table-cell">Cargo</TableHead>
                <TableHead className="font-bold">Proveído</TableHead>
                <TableHead className="w-[160px] font-bold">Fecha Envío</TableHead>
                <TableHead className="w-[130px] font-bold">Estado</TableHead>
                <TableHead className="w-[80px] text-right font-bold">Ver</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-muted/20 group transition-colors">
                    <TableCell>
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="font-mono font-bold tracking-tight text-primary hover:underline cursor-pointer"
                      >
                        {doc.hojaDeRuta}
                      </button>
                    </TableCell>
                    <TableCell className="font-medium text-foreground/90">
                      {doc.destinatario}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground italic text-xs uppercase leading-tight">
                      {doc.cargo}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="line-clamp-2 text-xs leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                        {doc.proveido}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5 whitespace-nowrap">
                        <span className="flex items-center gap-1 font-semibold">
                          <Calendar className="h-3 w-3 opacity-60" />
                          {format(doc.fechaEnvio, 'dd/MM/yyyy')}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground lowercase">
                          <Clock className="h-3 w-3 opacity-60" />
                          {format(doc.fechaEnvio, 'HH:mm')} hrs
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(doc.estado)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center text-muted-foreground italic">
                    <div className="flex flex-col items-center justify-center gap-2 opacity-30">
                      <FileSearch className="h-10 w-10" />
                      <p className="text-lg">No se encontraron documentos en seguimiento.</p>
                      <Button variant="link" size="sm" onClick={resetFilters}>
                        Limpiar todos los filtros
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Lateral Drawer for Tracking Details */}
      <Sheet open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
        <SheetContent
          side="right"
          className="w-[85%] max-w-[85%] sm:max-w-none p-0 flex flex-col h-screen"
        >
          <SheetHeader className="p-6 bg-primary text-primary-foreground relative overflow-hidden">
            {/* Abstract background patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md shadow-inner">
                <Activity className="h-8 w-8" />
              </div>
              <div>
                <SheetTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  Seguimiento de Trámite
                  {selectedDoc?.agrupado && (
                    <Badge className="bg-amber-400 text-amber-950 border-none font-bold uppercase text-[10px]">Agrupado</Badge>
                  )}
                </SheetTitle>
                <SheetDescription className="text-primary-foreground/90 font-medium">
                  {selectedDoc?.proceso} • <span className="font-mono font-bold text-white tracking-wider">{selectedDoc?.hojaDeRuta}</span>
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50 dark:bg-slate-950/50">
            {/* FICHA TÉCNICA CARD */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Info className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Ficha Técnica del Documento</h3>
              </div>

              <Card className="p-6 shadow-sm border-none bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Hoja de Ruta</Label>
                    <p className="font-mono font-bold text-lg text-primary">{selectedDoc?.hojaDeRuta}</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Cite Original</Label>
                    <p className="font-bold flex items-center gap-2">
                      <Stamp className="h-4 w-4 opacity-40 text-primary" />
                      {selectedDoc?.citeOriginal}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Tipo de Documento</Label>
                    <p className="font-semibold px-2 py-1 bg-muted rounded-md w-fit text-xs border">
                      {selectedDoc?.tipoDocumento}
                    </p>
                  </div>

                  <div className="md:col-span-3 space-y-1 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-lg">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Referencia</Label>
                    <p className="text-sm font-semibold leading-relaxed">
                      "{selectedDoc?.referencia}"
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Destinatario</Label>
                    <p className="text-sm font-bold flex items-center gap-2">
                      <User className="h-4 w-4 opacity-40 text-primary" />
                      {selectedDoc?.destinatario}
                    </p>
                    <p className="text-[11px] text-muted-foreground italic uppercase pl-6">{selectedDoc?.cargo}</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Fecha de Creación</Label>
                    <p className="text-sm font-medium flex items-center gap-2 lowercase">
                      <Calendar className="h-4 w-4 opacity-40 text-primary" />
                      {selectedDoc ? format(selectedDoc.fechaCreacion, 'PPP', { locale: es }) : ''}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Archivo Adjunto</Label>
                    {selectedDoc?.adjunto ? (
                      <Button variant="link" className="p-0 h-auto text-primary font-bold text-xs flex items-center gap-2" asChild>
                        <a href={selectedDoc.adjunto.url}>
                          <Paperclip className="h-3 w-3" />
                          {selectedDoc.adjunto.nombre}
                        </a>
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No se subieron archivos</p>
                    )}
                  </div>
                </div>
              </Card>
            </section>

            {/* TIMELINE SECTION */}
            <section className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Cronología de Derivaciones</h3>
                </div>
                {selectedDoc?.estado === 'Archivado' && (
                  <Badge className="bg-slate-700 text-white gap-2 px-3">
                    <Archive className="h-3 w-3" />
                    TRÁMITE FINALIZADO / ARCHIVADO
                  </Badge>
                )}
              </div>

              <div className="relative pl-12 md:pl-20 py-4">
                {/* Visual Line */}
                <div className="absolute left-[23px] md:left-[31px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/20 to-transparent" />

                <div className="space-y-12">
                  {selectedDoc?.derivaciones.map((der, idx) => (
                    <div key={der.id} className={cn(
                      "relative group transition-all",
                      der.actual ? "scale-100 opacity-100" : "opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
                    )}>
                      {/* Node point */}
                      <div className={cn(
                        "absolute -left-[37px] md:-left-[45px] top-0 h-8 w-8 rounded-full border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center z-10",
                        der.actual ? "bg-primary animate-pulse" : "bg-slate-200 dark:bg-slate-800"
                      )}>
                        {der.actual ? <Activity className="h-3 w-3 text-white" /> : <CheckCircle2 className="h-4 w-4 text-slate-400" />}
                      </div>

                      {/* Date Indicator (Left side on larger screens) */}
                      <div className="hidden md:block absolute -left-[140px] top-1 text-right w-[80px]">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{format(der.fecha, 'MMM dd')}</p>
                        <p className="text-[11px] font-medium text-primary mt-1">{format(der.fecha, 'HH:mm')}</p>
                      </div>

                      <div className={cn(
                        "p-5 rounded-xl border transition-all duration-300",
                        der.actual
                          ? "bg-white dark:bg-slate-900 border-primary shadow-lg ring-1 ring-primary/20"
                          : "bg-transparent border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900"
                      )}>
                        {/* Status & Date (Date only for mobile) */}
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant={der.actual ? "default" : "outline"} className="font-bold uppercase text-[9px]">
                            {der.estado}
                          </Badge>
                          <span className="md:hidden text-[10px] font-medium text-muted-foreground">
                            {format(der.fecha, 'dd/MM/yyyy HH:mm')}
                          </span>
                          {der.actual && (
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 animate-bounce">
                              <ArrowRight className="h-3 w-3" />
                              ESTADO ACTUAL
                            </span>
                          )}
                        </div>

                        {/* Derivation Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                          {/* Emisor */}
                          <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">De (Emisor):</p>
                            <div className="flex items-start gap-3">
                              <div className="mt-1 p-1 bg-slate-100 dark:bg-slate-800 rounded">
                                <User className="h-3 w-3 text-slate-500" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-xs font-bold leading-none">{der.emisor.nombre}</p>
                                <p className="text-[10px] text-muted-foreground italic leading-tight">{der.emisor.cargo}</p>
                                <p className="text-[9px] font-bold text-primary/70 uppercase">{der.emisor.unidad}</p>
                              </div>
                            </div>
                          </div>

                          {/* Receptor */}
                          <div className="space-y-2">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Para (Receptor):</p>
                            <div className="flex items-start gap-3">
                              <div className="mt-1 p-1 bg-slate-100 dark:bg-slate-800 rounded">
                                <User className="h-3 w-3 text-emerald-500" />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-xs font-bold leading-none">{der.receptor.nombre}</p>
                                <p className="text-[10px] text-muted-foreground italic leading-tight">{der.receptor.cargo}</p>
                                <p className="text-[9px] font-bold text-emerald-600/70 uppercase">{der.receptor.unidad}</p>
                              </div>
                            </div>
                          </div>

                          {/* Proveído specific to this derivation */}
                          <div className="md:col-span-2 pt-3 mt-1 border-t border-dashed border-slate-200 dark:border-slate-800">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Proveído:</p>
                            <p className="text-xs leading-relaxed italic text-foreground/80 font-medium">
                              "{der.proveido}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="p-6 border-t bg-white dark:bg-slate-900 flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Button variant="outline" onClick={() => setSelectedDoc(null)} className="font-bold">Cerrar Detalle</Button>
            <Button className="flex items-center gap-2 font-bold shadow-md shadow-primary/20">
              <Printer className="h-4 w-4" />
              Imprimir Reporte de Seguimiento
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Footer Info */}
      <div className="flex items-center gap-4 px-2 text-xs text-muted-foreground opacity-60">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span>Salida</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Entrada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-slate-500" />
          <span>Archivado</span>
        </div>
        <div className="ml-auto italic">
          Total: {filteredDocs.length} documentos listados
        </div>
      </div>
    </div>
  );
}

// Helper icons needed but not imported
import { Printer } from 'lucide-react';

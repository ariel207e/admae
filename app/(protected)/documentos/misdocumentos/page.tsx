'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import {
  Search,
  RotateCcw,
  Printer,
  Edit,
  Download,
  Eye,
  FileText,
  FileDown,
  Clock,
  Calendar,
  Filter,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface UserDocument {
  id: number;
  hojaDeRuta: string;
  tipoDocumento: 'Informe' | 'Nota' | 'Carta';
  cite: string;
  destinatario: string;
  cargoDestinatario: string;
  referencia: string;
  fecha: Date;
}

// Mock data for Mis Documentos
const mockUserDocuments: UserDocument[] = [
  {
    id: 1,
    hojaDeRuta: 'ADM-2026-00050',
    tipoDocumento: 'Informe',
    cite: 'G-001/2026',
    destinatario: 'Juan García Martínez',
    cargoDestinatario: 'Gerente de Operaciones',
    referencia: 'Reporte mensual de actividades de mantenimiento - Enero 2026',
    fecha: new Date(2026, 0, 22, 11, 30),
  },
  {
    id: 2,
    hojaDeRuta: 'ADM-2026-00055',
    tipoDocumento: 'Nota',
    cite: 'N-012/2026',
    destinatario: 'María López Rodríguez',
    cargoDestinatario: 'Directora de Recursos Humanos',
    referencia: 'Solicitud de vacaciones - Periodo 2025',
    fecha: new Date(2026, 0, 24, 14, 15),
  },
  {
    id: 3,
    hojaDeRuta: 'ADM-2026-00060',
    tipoDocumento: 'Carta',
    cite: 'C-005/2026',
    destinatario: 'Roberto Fernández López',
    cargoDestinatario: 'Jefe de Administración',
    referencia: 'Notificación de finalización de contrato de servicios IT',
    fecha: new Date(2026, 1, 1, 9, 0),
  },
  {
    id: 4,
    hojaDeRuta: 'ADM-2026-00065',
    tipoDocumento: 'Informe',
    cite: 'G-015/2026',
    destinatario: 'Ana Rodríguez García',
    cargoDestinatario: 'Analista Financiero',
    referencia: 'Balance anual consolidado - Gestión 2025',
    fecha: new Date(2026, 1, 10, 16, 45),
  },
  {
    id: 5,
    hojaDeRuta: 'ADM-2026-00070',
    tipoDocumento: 'Nota',
    cite: 'N-020/2026',
    destinatario: 'Carlos Mendoza Sánchez',
    cargoDestinatario: 'Coordinador de Proyectos',
    referencia: 'Propuesta de reestructuración de equipos de campo',
    fecha: new Date(2026, 1, 15, 11, 20),
  },
  {
    id: 6,
    hojaDeRuta: 'ADM-2026-00075',
    tipoDocumento: 'Informe',
    cite: 'G-025/2026',
    destinatario: 'Luis Herrera Pérez',
    cargoDestinatario: 'Supervisor de Calidad',
    referencia: 'Resultados de auditoría de procesos trimestral Q4',
    fecha: new Date(2026, 1, 22, 14, 30),
  },
];

const ITEMS_PER_PAGE = 10;

function getDocumentTypeBadgeColor(tipo: string): string {
  switch (tipo) {
    case 'Informe':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'Nota':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    case 'Carta':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function MisDocumentosPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Summary counts
  const summary = useMemo(() => {
    return {
      total: mockUserDocuments.length,
      informes: mockUserDocuments.filter(d => d.tipoDocumento === 'Informe').length,
      notas: mockUserDocuments.filter(d => d.tipoDocumento === 'Nota').length,
      cartas: mockUserDocuments.filter(d => d.tipoDocumento === 'Carta').length,
    };
  }, []);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return mockUserDocuments.filter((doc) => {
      const matchesSearch =
        doc.referencia.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.hojaDeRuta.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.cite.toLowerCase().includes(searchQuery.toLowerCase());

      let dateMatch = true;
      if (dateFrom) {
        const from = new Date(dateFrom);
        dateMatch = dateMatch && doc.fecha >= from;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        dateMatch = dateMatch && doc.fecha <= to;
      }

      return matchesSearch && dateMatch;
    });
  }, [searchQuery, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const handlePrint = (id: number) => {
    console.log('Imprimir Hoja de Ruta:', id);
    alert('Preparando impresión de Hoja de Ruta...');
  };

  const handleEdit = (id: number) => {
    console.log('Editar documento:', id);
    alert('Redirigiendo a edición de documento...');
  };

  const handleDownloadWord = (id: number) => {
    console.log('Descargar Word:', id);
    alert('Generando archivo Word...');
  };

  const handleTrack = (id: number) => {
    console.log('Seguimiento:', id);
    alert('Abriendo seguimiento del documento...');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display mb-2">Mis Documentos</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Card className="p-4">
          <Skeleton className="h-[400px] w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Documentos</h1>
        <p className="text-muted-foreground mt-1">Historial de documentos creados por su usuario.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Creados</p>
            <p className="text-2xl font-bold">{summary.total}</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            <FileText className="h-5 w-5 text-primary" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Informes</p>
            <p className="text-2xl font-bold">{summary.informes}</p>
          </div>
          <div className="p-2 bg-blue-500/10 rounded-full">
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notas</p>
            <p className="text-2xl font-bold">{summary.notas}</p>
          </div>
          <div className="p-2 bg-amber-500/10 rounded-full">
            <FileText className="h-5 w-5 text-amber-500" />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cartas</p>
            <p className="text-2xl font-bold">{summary.cartas}</p>
          </div>
          <div className="p-2 bg-purple-500/10 rounded-full">
            <FileText className="h-5 w-5 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm">
                Buscar (Referencia, H.R. o Cite)
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Ej: presupuesto, ADM-2026..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFrom" className="text-sm">
                Fecha Desde
              </Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo" className="text-sm">
                Fecha Hasta
              </Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(1);
                }}
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
              Mostrando {filteredDocuments.length} documentos encontrados
            </p>
          </div>
        </div>
      </Card>

      {/* Documents Table */}
      <Card className="overflow-hidden shadow-sm">
        {paginatedDocuments.length > 0 ? (
          <div className="divide-y text-sm">
            {/* Header */}
            <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-muted/50 font-semibold text-muted-foreground">
              <div className="w-[130px]">Hoja de Ruta</div>
              <div className="w-[100px]">Tipo</div>
              <div className="w-[120px]">CITE</div>
              <div className="flex-1 min-w-[200px]">Referencia</div>
              <div className="w-[180px]">Destinatario</div>
              <div className="w-[110px]">Fecha</div>
              <div className="w-[180px] text-right">Acciones</div>
            </div>

            {/* Rows */}
            {paginatedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col lg:flex-row lg:items-center gap-4 px-4 lg:px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                {/* Mobile Identity */}
                <div className="lg:hidden flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-bold text-primary">{doc.hojaDeRuta}</p>
                    <Badge className={getDocumentTypeBadgeColor(doc.tipoDocumento)}>
                      {doc.tipoDocumento}
                    </Badge>
                  </div>
                  <p className="font-mono text-[11px] bg-muted px-2 py-0.5 rounded border">
                    {doc.cite}
                  </p>
                </div>

                {/* Desktop View Elements */}
                <div className="hidden lg:block w-[130px]">
                  <p className="font-bold text-primary">{doc.hojaDeRuta}</p>
                </div>

                <div className="hidden lg:block w-[100px]">
                  <Badge className={getDocumentTypeBadgeColor(doc.tipoDocumento)}>
                    {doc.tipoDocumento}
                  </Badge>
                </div>

                <div className="hidden lg:block w-[120px]">
                  <p className="font-mono text-[11px] bg-muted px-2 py-0.5 rounded border truncate" title={doc.cite}>
                    {doc.cite}
                  </p>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-2 lg:line-clamp-1" title={doc.referencia}>
                    {doc.referencia}
                  </p>
                </div>

                <div className="w-[180px]">
                  <p className="font-semibold text-xs lg:text-sm">{doc.destinatario}</p>
                  <p className="text-[10px] text-muted-foreground uppercase truncate" title={doc.cargoDestinatario}>
                    {doc.cargoDestinatario}
                  </p>
                </div>

                <div className="w-[110px]">
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                    <Calendar className="h-3 w-3 opacity-60" />
                    {format(doc.fecha, 'dd/MM/yyyy', { locale: es })}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-2 lg:pt-0 lg:w-[180px]">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                    onClick={() => handlePrint(doc.id)}
                    title="Imprimir Hoja de Ruta"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                    onClick={() => handleEdit(doc.id)}
                    title="Editar Documento"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                    onClick={() => handleDownloadWord(doc.id)}
                    title="Descargar Word"
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-purple-600 hover:bg-purple-50"
                    onClick={() => handleTrack(doc.id)}
                    title="Seguimiento"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-muted/10">
            <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg italic">
              No se encontraron documentos personales.
            </p>
            <Button variant="link" onClick={handleClearFilters} className="mt-2 text-primary">
              Ver todos los registros
            </Button>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

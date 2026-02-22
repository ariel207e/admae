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
  Layers,
  User,
  Calendar,
  FileText,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface GroupedDocument {
  id: number;
  hojaDeRuta: string;
  hojaDeRutaPrincipal: string;
  citeOriginal: string;
  referencia: string;
  destinatario: string;
  cargoDestinatario: string;
  fechaAgrupacion: Date;
}

// Mock data for Agrupados
const mockAgrupados: GroupedDocument[] = [
  {
    id: 1,
    hojaDeRuta: 'ADM-2026-00088',
    hojaDeRutaPrincipal: 'ADM-2026-00050',
    citeOriginal: 'DG-045/2026',
    referencia: 'Solicitud de reposición de activos fijos - Planta Central',
    destinatario: 'Ana Rodríguez García',
    cargoDestinatario: 'Directora Administrativa',
    fechaAgrupacion: new Date(2026, 1, 22, 14, 30),
  },
  {
    id: 2,
    hojaDeRuta: 'RRHH-2026-00120',
    hojaDeRutaPrincipal: 'RRHH-2026-00100',
    citeOriginal: 'D-RRHH-012/2026',
    referencia: 'Plan de capacitación trimestral - Módulo Seguridad',
    destinatario: 'Carlos Mendoza Sánchez',
    cargoDestinatario: 'Jefe de RRHH',
    fechaAgrupacion: new Date(2026, 1, 21, 10, 15),
  },
  {
    id: 3,
    hojaDeRuta: 'IT-2026-00034',
    hojaDeRutaPrincipal: 'IT-2026-00010',
    citeOriginal: 'CIT-005/2026',
    referencia: 'Adquisición de licencias de software de diseño v.2026',
    destinatario: 'Roberto Fernández López',
    cargoDestinatario: 'Gerente de IT',
    fechaAgrupacion: new Date(2026, 1, 20, 16, 45),
  },
  {
    id: 4,
    hojaDeRuta: 'FIN-2026-00099',
    hojaDeRutaPrincipal: 'FIN-2026-00080',
    citeOriginal: 'DF-088/2026',
    referencia: 'Ajuste presupuestario por incremento de costos operativos',
    destinatario: 'Juan García Martínez',
    cargoDestinatario: 'Director Financiero',
    fechaAgrupacion: new Date(2026, 1, 19, 11, 20),
  },
];

const ITEMS_PER_PAGE = 10;

export default function AgrupadosPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filter documents
  const filteredAgrupados = useMemo(() => {
    return mockAgrupados.filter((doc) => {
      const matchesSearch =
        doc.referencia.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.hojaDeRuta.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.hojaDeRutaPrincipal.toLowerCase().includes(searchQuery.toLowerCase());

      let dateMatch = true;
      if (dateFrom) {
        const from = new Date(dateFrom);
        dateMatch = dateMatch && doc.fechaAgrupacion >= from;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        dateMatch = dateMatch && doc.fechaAgrupacion <= to;
      }

      return matchesSearch && dateMatch;
    });
  }, [searchQuery, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredAgrupados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAgrupados = filteredAgrupados.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const handlePrintCaratula = (id: number) => {
    console.log('Imprimir carátula para el registro agrupado:', id);
    alert('Generando carátula para impresión...');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display mb-2">Agrupados</h1>
        <Card className="p-4">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-5 w-5" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documentos Agrupados</h1>
          <p className="text-muted-foreground">Listado de trámites asociados a una hoja de ruta principal.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm">
                Buscar (Hoja de Ruta o Referencia)
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Ej: ADM-2026, presupuesto..."
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
                Agrupado Desde
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
                Agrupado Hasta
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

          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="w-full md:w-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpiar Filtros
          </Button>
        </div>
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredAgrupados.length} registro
          {filteredAgrupados.length !== 1 ? 's' : ''} encontrado
          {filteredAgrupados.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* List Table */}
      <Card className="overflow-hidden shadow-sm">
        {paginatedAgrupados.length > 0 ? (
          <div className="divide-y text-sm">
            {/* Header */}
            <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-muted/50 font-semibold text-muted-foreground">
              <div className="w-[140px]">H.R. Agrupada</div>
              <div className="w-[140px]">H.R. Principal</div>
              <div className="w-[120px]">CITE Original</div>
              <div className="flex-1">Referencia</div>
              <div className="w-[180px]">Destinatario</div>
              <div className="w-[120px]">Fecha Agrup.</div>
              <div className="w-[120px] text-right">Acciones</div>
            </div>

            {/* Rows */}
            {paginatedAgrupados.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col lg:flex-row lg:items-center gap-4 px-4 lg:px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                {/* Mobile Identity */}
                <div className="lg:hidden flex justify-between items-start">
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-[10px] uppercase text-primary border-primary/30">
                      H.R. Agrupada: {doc.hojaDeRuta}
                    </Badge>
                    <p className="text-xs font-bold text-muted-foreground">
                      Principal: {doc.hojaDeRutaPrincipal}
                    </p>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                    {doc.citeOriginal}
                  </Badge>
                </div>

                {/* Desktop Identity */}
                <div className="hidden lg:flex flex-1 items-center justify-between gap-4">
                  <div className="w-[140px]">
                    <p className="font-bold text-primary">{doc.hojaDeRuta}</p>
                  </div>

                  <div className="w-[140px]">
                    <p className="font-semibold text-muted-foreground">{doc.hojaDeRutaPrincipal}</p>
                  </div>

                  <div className="w-[120px]">
                    <p className="font-medium bg-muted px-2 py-0.5 rounded text-[11px] truncate" title={doc.citeOriginal}>
                      {doc.citeOriginal}
                    </p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-2" title={doc.referencia}>
                      {doc.referencia}
                    </p>
                  </div>

                  <div className="w-[180px]">
                    <p className="font-semibold flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {doc.destinatario}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase truncate ml-4" title={doc.cargoDestinatario}>
                      {doc.cargoDestinatario}
                    </p>
                  </div>

                  <div className="w-[120px]">
                    <p className="text-muted-foreground flex items-center gap-1.5 font-medium">
                      <Calendar className="h-3 w-3 opacity-60" />
                      {format(doc.fechaAgrupacion, 'dd/MM/yyyy', { locale: es })}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 ml-4.5">
                      {format(doc.fechaAgrupacion, 'HH:mm', { locale: es })}
                    </p>
                  </div>

                  <div className="w-[120px] flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 hover:text-primary hover:bg-primary/5 px-2 group"
                      onClick={() => handlePrintCaratula(doc.id)}
                    >
                      <Printer className="h-3.5 w-3.5 mr-2" />
                      Carátula
                    </Button>
                  </div>
                </div>

                {/* Mobile View Extensions */}
                <div className="lg:hidden space-y-3">
                  <p className="text-sm font-medium">{doc.referencia}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="font-semibold">{doc.destinatario}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(doc.fechaAgrupacion, 'dd/MM/yyyy', { locale: es })}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-9 flex items-center justify-center gap-2"
                    onClick={() => handlePrintCaratula(doc.id)}
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir Carátula
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-muted/10">
            <Layers className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg italic">
              No hay documentos agrupados que coincidan con los filtros
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

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  Archive,
  Layers,
  Forward,
  Reply,
  Calendar,
  Search,
  RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Document {
  id: number;
  hojaDeRuta: string;
  remitente: string;
  cargoRemitente: string;
  referencia: string;
  fechaEnvio: Date;
  tipoDocumento: 'Informe' | 'Nota' | 'Carta';
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: 1,
    hojaDeRuta: 'ABC-2026-00001',
    remitente: 'Juan García Martínez',
    cargoRemitente: 'Gerente de Operaciones',
    referencia: 'Solicitud de aprobación presupuestal Q1',
    fechaEnvio: new Date(2026, 1, 20, 10, 30),
    tipoDocumento: 'Informe',
  },
  {
    id: 2,
    hojaDeRuta: 'ABC-2026-00002',
    remitente: 'María López Rodríguez',
    cargoRemitente: 'Directora de Recursos Humanos',
    referencia: 'Cambios en políticas de permiso',
    fechaEnvio: new Date(2026, 1, 21, 14, 15),
    tipoDocumento: 'Nota',
  },
  {
    id: 3,
    hojaDeRuta: 'ABC-2026-00003',
    remitente: 'Roberto Fernández López',
    cargoRemitente: 'Jefe de Administración',
    referencia: 'Reporte de auditoría interna 2026',
    fechaEnvio: new Date(2026, 1, 22, 9, 0),
    tipoDocumento: 'Informe',
  },
  {
    id: 4,
    hojaDeRuta: 'ABC-2026-00004',
    remitente: 'Carlos Mendoza Sánchez',
    cargoRemitente: 'Coordinador de Proyectos',
    referencia: 'Propuesta de nuevo proyecto estratégico',
    fechaEnvio: new Date(2026, 1, 18, 16, 45),
    tipoDocumento: 'Carta',
  },
  {
    id: 5,
    hojaDeRuta: 'ABC-2026-00005',
    remitente: 'Ana Rodríguez García',
    cargoRemitente: 'Analista Financiero',
    referencia: 'Balance financiero mensual',
    fechaEnvio: new Date(2026, 1, 19, 11, 20),
    tipoDocumento: 'Informe',
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

export default function PendientesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [searchReference, setSearchReference] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter((doc) => {
      const refMatch = doc.referencia
        .toLowerCase()
        .includes(searchReference.toLowerCase());

      let dateMatch = true;
      if (dateFrom) {
        const from = new Date(dateFrom);
        dateMatch = dateMatch && doc.fechaEnvio >= from;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        dateMatch = dateMatch && doc.fechaEnvio <= to;
      }

      return refMatch && dateMatch;
    });
  }, [searchReference, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(paginatedDocuments.map((doc) => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleSelectDocument = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, id]);
    } else {
      setSelectedDocuments(selectedDocuments.filter((docId) => docId !== id));
    }
  };

  const handleClearFilters = () => {
    setSearchReference('');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const handleDerivar = () => {
    router.push('/documentos/derivar');
  };

  const handleResponder = () => {
    router.push('/documentos/crear');
  };

  const handleAgrupar = () => {
    console.log('Agrupar documentos:', selectedDocuments);
    alert('Documentos agrupados correctamente');
    setSelectedDocuments([]);
  };

  const handleArchivar = () => {
    console.log('Archivar documentos:', selectedDocuments);
    alert('Documentos archivados correctamente');
    setSelectedDocuments([]);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display mb-2">Pendientes</h1>
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
          <h1 className="text-3xl font-bold mb-2">Pendientes</h1>
          <p className="text-muted-foreground">Gestión de documentos en espera de acción.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm">
                Buscar por Referencia
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Ej: presupuestal, auditoría..."
                  className="pl-9"
                  value={searchReference}
                  onChange={(e) => {
                    setSearchReference(e.target.value);
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

      {/* Results Info & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {filteredDocuments.length} documento
          {filteredDocuments.length !== 1 ? 's' : ''} encontrado
          {filteredDocuments.length !== 1 ? 's' : ''}
        </p>

        {selectedDocuments.length > 0 && (
          <div className="flex items-center gap-2 bg-muted p-2 rounded-lg border">
            <Badge variant="secondary" className="mr-2">
              {selectedDocuments.length} seleccionados
            </Badge>

            {selectedDocuments.length > 1 ? (
              <>
                <Button onClick={handleAgrupar} size="sm" variant="outline">
                  <Layers className="mr-2 h-4 w-4" />
                  Agrupar
                </Button>
                <Button onClick={handleArchivar} size="sm" variant="outline">
                  <Archive className="mr-2 h-4 w-4" />
                  Archivar
                </Button>
                <Button onClick={handleDerivar} size="sm">
                  <Forward className="mr-2 h-4 w-4" />
                  Derivar
                </Button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground italic mr-2">
                Selecciona más de 1 para agrupar o archivar
              </p>
            )}
          </div>
        )}
      </div>

      {/* Documents List */}
      <Card className="overflow-hidden">
        {paginatedDocuments.length > 0 ? (
          <div className="divide-y text-sm">
            {/* Header */}
            <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-muted/50 font-semibold">
              <Checkbox
                checked={
                  paginatedDocuments.length > 0 &&
                  paginatedDocuments.every((doc) =>
                    selectedDocuments.includes(doc.id)
                  )
                }
                onCheckedChange={handleSelectAll}
              />
              <div className="w-[180px]">Hoja de Ruta</div>
              <div className="w-[200px]">Remitente</div>
              <div className="flex-1">Referencia</div>
              <div className="w-[120px]">Tipo</div>
              <div className="w-[150px]">Fecha de Envío</div>
              <div className="w-[200px] text-right">Acciones</div>
            </div>

            {/* Rows */}
            {paginatedDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`flex flex-col md:flex-row md:items-center gap-4 px-4 md:px-6 py-4 hover:bg-muted/30 transition-colors ${selectedDocuments.includes(doc.id) ? 'bg-primary/5' : ''
                  }`}
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedDocuments.includes(doc.id)}
                    onCheckedChange={(checked) =>
                      handleSelectDocument(doc.id, checked as boolean)
                    }
                  />
                  <div className="md:hidden font-bold text-primary">{doc.hojaDeRuta}</div>
                </div>

                {/* Mobile: Stacked layout */}
                <div className="md:hidden flex-1 space-y-3">
                  <div className="text-xs">
                    <p className="font-semibold">{doc.remitente}</p>
                    <p className="text-muted-foreground">{doc.cargoRemitente}</p>
                  </div>
                  <p className="text-sm font-medium">{doc.referencia}</p>
                  <div className="flex gap-2 flex-wrap items-center">
                    <Badge className={getDocumentTypeBadgeColor(doc.tipoDocumento)}>
                      {doc.tipoDocumento}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(doc.fechaEnvio, 'dd/MM/yyyy HH:mm', { locale: es })}
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResponder}
                      className="flex-1"
                    >
                      <Reply className="mr-2 h-4 w-4" />
                      Responder
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDerivar}
                      className="flex-1"
                    >
                      <Forward className="mr-2 h-4 w-4" />
                      Derivar
                    </Button>
                  </div>
                </div>

                {/* Desktop: Table layout */}
                <div className="hidden md:flex flex-1 items-center justify-between gap-4">
                  <div className="w-[180px]">
                    <p className="font-bold text-primary">{doc.hojaDeRuta}</p>
                  </div>

                  <div className="w-[200px]">
                    <p className="font-semibold leading-tight">{doc.remitente}</p>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">
                      {doc.cargoRemitente}
                    </p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium" title={doc.referencia}>
                      {doc.referencia}
                    </p>
                  </div>

                  <div className="w-[120px]">
                    <Badge className={`${getDocumentTypeBadgeColor(doc.tipoDocumento)} font-normal px-2 py-0`}>
                      {doc.tipoDocumento}
                    </Badge>
                  </div>

                  <div className="w-[150px]">
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {format(doc.fechaEnvio, 'dd/MM/yyyy', { locale: es })}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 ml-5">
                      {format(doc.fechaEnvio, 'HH:mm', { locale: es })}
                    </p>
                  </div>

                  <div className="w-[200px] flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 hover:text-blue-600 hover:bg-blue-50"
                      onClick={handleResponder}
                    >
                      <Reply className="mr-2 h-3.5 w-3.5" />
                      Responder
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 hover:text-green-600 hover:bg-green-50"
                      onClick={handleDerivar}
                    >
                      <Forward className="mr-2 h-3.5 w-3.5" />
                      Derivar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-muted/20">
            <p className="text-muted-foreground text-lg">
              No hay documentos pendientes que coincidan con los filtros
            </p>
            <Button variant="link" onClick={handleClearFilters} className="mt-2 text-primary">
              Ver todos los pendientes
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
                  onClick={() =>
                    setCurrentPage(Math.max(1, currentPage - 1))
                  }
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
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

                if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <PaginationEllipsis key={page} />;
                }

                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

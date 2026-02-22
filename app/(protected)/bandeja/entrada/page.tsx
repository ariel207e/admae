'use client';

import { useState, useMemo } from 'react';
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
    fechaEnvio: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    tipoDocumento: 'Informe',
  },
  {
    id: 2,
    hojaDeRuta: 'ABC-2026-00002',
    remitente: 'María López Rodríguez',
    cargoRemitente: 'Directora de Recursos Humanos',
    referencia: 'Cambios en políticas de permiso',
    fechaEnvio: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    tipoDocumento: 'Nota',
  },
  {
    id: 3,
    hojaDeRuta: 'ABC-2026-00003',
    remitente: 'Roberto Fernández López',
    cargoRemitente: 'Jefe de Administración',
    referencia: 'Reporte de auditoría interna 2026',
    fechaEnvio: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    tipoDocumento: 'Informe',
  },
  {
    id: 4,
    hojaDeRuta: 'ABC-2026-00004',
    remitente: 'Carlos Mendoza Sánchez',
    cargoRemitente: 'Coordinador de Proyectos',
    referencia: 'Propuesta de nuevo proyecto estratégico',
    fechaEnvio: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    tipoDocumento: 'Carta',
  },
  {
    id: 5,
    hojaDeRuta: 'ABC-2026-00005',
    remitente: 'Ana Rodríguez García',
    cargoRemitente: 'Analista Financiero',
    referencia: 'Balance financiero mensual',
    fechaEnvio: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    tipoDocumento: 'Informe',
  },
  {
    id: 6,
    hojaDeRuta: 'ABC-2026-00006',
    remitente: 'Luis Herrera Pérez',
    cargoRemitente: 'Supervisor de Calidad',
    referencia: 'Notificación de incidente de seguridad',
    fechaEnvio: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    tipoDocumento: 'Nota',
  },
  {
    id: 7,
    hojaDeRuta: 'ABC-2026-00007',
    remitente: 'Patricia Soto Vázquez',
    cargoRemitente: 'Jefa de Comunicaciones',
    referencia: 'Comunicado oficial para distribución',
    fechaEnvio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    tipoDocumento: 'Carta',
  },
  {
    id: 8,
    hojaDeRuta: 'ABC-2026-00008',
    remitente: 'David Torres Morales',
    cargoRemitente: 'Ingeniero Senior',
    referencia: 'Especificaciones técnicas actualizadas',
    fechaEnvio: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    tipoDocumento: 'Informe',
  },
  {
    id: 9,
    hojaDeRuta: 'ABC-2026-00009',
    remitente: 'Gabriela Morales González',
    cargoRemitente: 'Coordinadora Legal',
    referencia: 'Revisión de contratos pendientes',
    fechaEnvio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    tipoDocumento: 'Nota',
  },
  {
    id: 10,
    hojaDeRuta: 'ABC-2026-00010',
    remitente: 'Francisco Díaz López',
    cargoRemitente: 'Director de Logística',
    referencia: 'Plan de distribución trimestral',
    fechaEnvio: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    tipoDocumento: 'Informe',
  },
  {
    id: 11,
    hojaDeRuta: 'ABC-2026-00011',
    remitente: 'Sandra Ruiz Flores',
    cargoRemitente: 'Asistente Administrativo',
    referencia: 'Actualización de directorio de empleados',
    fechaEnvio: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    tipoDocumento: 'Carta',
  },
  {
    id: 12,
    hojaDeRuta: 'ABC-2026-00012',
    remitente: 'Andrés Castillo Ramírez',
    cargoRemitente: 'Especialista en IT',
    referencia: 'Implementación del nuevo sistema de backup',
    fechaEnvio: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    tipoDocumento: 'Informe',
  },
];

const ITEMS_PER_PAGE = 10;

function calculateTimeDifference(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `hace ${diffMinutes}m`;
  } else if (diffHours < 24) {
    return `hace ${diffHours}h`;
  } else {
    return `hace ${diffDays}d`;
  }
}

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

export default function EntradaPage() {
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

  const handleReceive = (id: number) => {
    console.log('[v0] Recibir documento:', id);
    alert(`Documento ${id} recibido`);
  };

  const handleReceiveAndDelegate = (id: number) => {
    console.log('[v0] Recibir y derivar documento:', id);
    alert(`Documento ${id} recibido y derivado`);
  };

  const handleBulkReceive = () => {
    console.log('[v0] Recibir múltiples documentos:', selectedDocuments);
    alert(`${selectedDocuments.length} documentos recibidos`);
    setSelectedDocuments([]);
  };

  // Render skeleton loader
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display mb-2">Entrada</h1>
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
      <h1 className="text-3xl font-display mb-2">Entrada</h1>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm">
                Buscar por Referencia
              </Label>
              <Input
                id="search"
                placeholder="Ej: presupuestal, auditoría..."
                value={searchReference}
                onChange={(e) => {
                  setSearchReference(e.target.value);
                  setCurrentPage(1);
                }}
              />
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
            Limpiar Filtros
          </Button>
        </div>
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredDocuments.length} documento
          {filteredDocuments.length !== 1 ? 's' : ''} encontrado
          {filteredDocuments.length !== 1 ? 's' : ''}
        </p>
        {selectedDocuments.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedDocuments.length} seleccionado
              {selectedDocuments.length !== 1 ? 's' : ''}
            </Badge>
            <Button onClick={handleBulkReceive} size="sm">
              Recibir Seleccionados
            </Button>
          </div>
        )}
      </div>

      {/* Documents List */}
      <Card className="overflow-hidden">
        {paginatedDocuments.length > 0 ? (
          <div className="divide-y">
            {/* Header */}
            <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-muted/50 font-medium text-sm">
              <Checkbox
                checked={
                  paginatedDocuments.length > 0 &&
                  paginatedDocuments.every((doc) =>
                    selectedDocuments.includes(doc.id)
                  )
                }
                onCheckedChange={handleSelectAll}
              />
              <div className="flex-1">Hoja de Ruta</div>
              <div className="flex-1">Remitente</div>
              <div className="flex-1">Referencia</div>
              <div className="w-24">Tipo</div>
              <div className="w-20">Tiempo</div>
              <div className="w-32">Acciones</div>
            </div>

            {/* Rows */}
            {paginatedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col md:flex-row md:items-center gap-4 px-4 md:px-6 py-4 hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={selectedDocuments.includes(doc.id)}
                  onCheckedChange={(checked) =>
                    handleSelectDocument(doc.id, checked as boolean)
                  }
                />

                {/* Mobile: Stacked layout */}
                <div className="md:hidden flex-1 space-y-2">
                  <div className="font-medium text-sm">{doc.hojaDeRuta}</div>
                  <div className="text-xs">
                    <p className="font-medium">{doc.remitente}</p>
                    <p className="text-muted-foreground">{doc.cargoRemitente}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{doc.referencia}</p>
                  <div className="flex gap-2 flex-wrap items-center">
                    <Badge className={getDocumentTypeBadgeColor(doc.tipoDocumento)}>
                      {doc.tipoDocumento}
                    </Badge>
                    <Badge variant="outline">
                      {calculateTimeDifference(doc.fechaEnvio)}
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReceive(doc.id)}
                    >
                      Recibir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReceiveAndDelegate(doc.id)}
                    >
                      Derivar
                    </Button>
                  </div>
                </div>

                {/* Desktop: Table layout */}
                <div className="hidden md:flex-1 md:flex md:items-center md:justify-between md:gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{doc.hojaDeRuta}</p>
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-sm">{doc.remitente}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.cargoRemitente}
                    </p>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm truncate">{doc.referencia}</p>
                  </div>

                  <div className="w-24">
                    <Badge className={getDocumentTypeBadgeColor(doc.tipoDocumento)}>
                      {doc.tipoDocumento}
                    </Badge>
                  </div>

                  <div className="w-20">
                    <Badge variant="outline" className="whitespace-nowrap">
                      {calculateTimeDifference(doc.fechaEnvio)}
                    </Badge>
                  </div>

                  <div className="w-32 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReceive(doc.id)}
                    >
                      Recibir
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReceiveAndDelegate(doc.id)}
                      title="Recibir y Derivar"
                    >
                      ↗
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              No hay documentos que coincidan con los filtros
            </p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage(Math.max(1, currentPage - 1))
                  }
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Show first, last, current, and neighbors
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
                      : ''
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

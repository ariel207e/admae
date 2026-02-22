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
import {
  Search,
  RotateCcw,
  XSquare,
  User,
  MessageSquare,
  Calendar,
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Document {
  id: number;
  hojaDeRuta: string;
  destinatario: string;
  cargoDestinatario: string;
  referencia: string;
  proveido: string;
  fechaEnvio: Date;
  tipoDocumento: 'Informe' | 'Nota' | 'Carta';
  estado: 'Enviado' | 'Recibido' | 'Cancelado';
}

// Mock data for Salida
const mockDocuments: Document[] = [
  {
    id: 1,
    hojaDeRuta: 'ABC-2026-00045',
    destinatario: 'Ana Rodríguez García',
    cargoDestinatario: 'Analista Financiero',
    referencia: 'Solicitud de pasajes y viáticos Q1',
    proveido: 'Para su conocimiento y fines consiguientes.',
    fechaEnvio: new Date(2026, 1, 22, 11, 30),
    tipoDocumento: 'Nota',
    estado: 'Enviado',
  },
  {
    id: 2,
    hojaDeRuta: 'ABC-2026-00046',
    destinatario: 'Carlos Mendoza Sánchez',
    cargoDestinatario: 'Coordinador de Proyectos',
    referencia: 'Propuesta de actualización de software',
    proveido: 'Favor revisar y emitir criterio técnico.',
    fechaEnvio: new Date(2026, 1, 22, 10, 15),
    tipoDocumento: 'Informe',
    estado: 'Recibido',
  },
  {
    id: 3,
    hojaDeRuta: 'ABC-2026-00047',
    destinatario: 'María López Rodríguez',
    cargoDestinatario: 'Directora de RRHH',
    referencia: 'Información de vacaciones pendientes',
    proveido: 'Para su atención urgente.',
    fechaEnvio: new Date(2026, 1, 21, 15, 45),
    tipoDocumento: 'Carta',
    estado: 'Enviado',
  },
  {
    id: 4,
    hojaDeRuta: 'ABC-2026-00048',
    destinatario: 'Roberto Fernández López',
    cargoDestinatario: 'Jefe de Administración',
    referencia: 'Resumen mensual de gastos operativos',
    proveido: 'Consolidado para auditoría interna.',
    fechaEnvio: new Date(2026, 1, 20, 9, 20),
    tipoDocumento: 'Informe',
    estado: 'Recibido',
  },
  {
    id: 5,
    hojaDeRuta: 'ABC-2026-00049',
    destinatario: 'Juan García Martínez',
    cargoDestinatario: 'Gerente de Operaciones',
    referencia: 'Planificación trimestral de mantenimiento',
    proveido: 'Para VoBo y firma correspondiente.',
    fechaEnvio: new Date(2026, 1, 19, 16, 10),
    tipoDocumento: 'Nota',
    estado: 'Enviado',
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

export default function SalidaPage() {
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

  const handleCancelDerivation = (id: number) => {
    if (confirm('¿Está seguro de que desea cancelar esta derivación?')) {
      console.log('Cancelar derivación:', id);
      alert(`Derivación del documento ${id} cancelada`);
    }
  };

  const handleBulkCancel = () => {
    if (confirm(`¿Está seguro de cancelar ${selectedDocuments.length} derivaciones?`)) {
      console.log('Bulk Cancel:', selectedDocuments);
      alert(`${selectedDocuments.length} derivaciones canceladas`);
      setSelectedDocuments([]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-display mb-2">Salida</h1>
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
          <h1 className="text-3xl font-bold mb-2">Salida</h1>
          <p className="text-muted-foreground">Documentos enviados o derivados por usted.</p>
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
                  placeholder="Ej: viáticos, software..."
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

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {filteredDocuments.length} documento
          {filteredDocuments.length !== 1 ? 's' : ''} enviado
          {filteredDocuments.length !== 1 ? 's' : ''}
        </p>

        {selectedDocuments.length > 0 && (
          <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/10 p-2 rounded-lg border border-red-100 dark:border-red-900/30">
            <Badge variant="destructive" className="mr-2">
              {selectedDocuments.length} seleccionados
            </Badge>
            <Button onClick={handleBulkCancel} size="sm" variant="destructive">
              <XSquare className="mr-2 h-4 w-4" />
              Cancelar Derivaciones
            </Button>
          </div>
        )}
      </div>

      {/* Documents List */}
      <Card className="overflow-hidden shadow-sm">
        {paginatedDocuments.length > 0 ? (
          <div className="divide-y text-sm">
            {/* Header */}
            <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-muted/50 font-semibold text-muted-foreground">
              <Checkbox
                checked={
                  paginatedDocuments.length > 0 &&
                  paginatedDocuments.every((doc) =>
                    selectedDocuments.includes(doc.id)
                  )
                }
                onCheckedChange={handleSelectAll}
              />
              <div className="w-[140px]">Hoja de Ruta</div>
              <div className="w-[180px]">Destinatario</div>
              <div className="flex-1">Referencia / Proveído</div>
              <div className="w-[100px]">Tipo</div>
              <div className="w-[120px]">Fecha Envío</div>
              <div className="w-[150px] text-right">Acciones</div>
            </div>

            {/* Rows */}
            {paginatedDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`flex flex-col lg:flex-row lg:items-center gap-4 px-4 lg:px-6 py-4 hover:bg-muted/30 transition-colors ${selectedDocuments.includes(doc.id) ? 'bg-primary/5' : ''
                  }`}
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedDocuments.includes(doc.id)}
                    onCheckedChange={(checked) =>
                      handleSelectDocument(doc.id, checked as boolean)
                    }
                  />
                  <div className="lg:hidden font-bold text-primary">{doc.hojaDeRuta}</div>
                </div>

                {/* Mobile: Stacked layout */}
                <div className="lg:hidden flex-1 space-y-3">
                  <div className="text-xs">
                    <p className="font-semibold flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {doc.destinatario}
                    </p>
                    <p className="text-muted-foreground ml-4">{doc.cargoDestinatario}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{doc.referencia}</p>
                    <div className="bg-muted/50 p-2 rounded mt-1 text-xs italic border-l-2 border-primary/30">
                      <MessageSquare className="h-3 w-3 inline mr-1 mb-0.5 opacity-70" />
                      {doc.proveido}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap items-center">
                    <Badge className={getDocumentTypeBadgeColor(doc.tipoDocumento)}>
                      {doc.tipoDocumento}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(doc.fechaEnvio, 'dd/MM/yyyy HH:mm', { locale: es })}
                    </Badge>
                    <Badge className={doc.estado === 'Recibido' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      {doc.estado}
                    </Badge>
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelDerivation(doc.id)}
                      className="w-full"
                    >
                      <XSquare className="mr-2 h-4 w-4" />
                      Cancelar Derivación
                    </Button>
                  </div>
                </div>

                {/* Desktop: Table layout */}
                <div className="hidden lg:flex flex-1 items-center justify-between gap-4">
                  <div className="w-[140px]">
                    <p className="font-bold text-primary">{doc.hojaDeRuta}</p>
                    <Badge variant="outline" className={`mt-1 text-[10px] py-0 ${doc.estado === 'Recibido' ? 'border-green-200 text-green-600' : 'border-blue-200 text-blue-600'}`}>
                      {doc.estado}
                    </Badge>
                  </div>

                  <div className="w-[180px]">
                    <p className="font-semibold leading-tight">{doc.destinatario}</p>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1 truncate" title={doc.cargoDestinatario}>
                      {doc.cargoDestinatario}
                    </p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" title={doc.referencia}>
                      {doc.referencia}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 bg-muted/30 px-2 py-0.5 rounded border-l-2 border-primary/20 italic truncate" title={doc.proveido}>
                      "{doc.proveido}"
                    </p>
                  </div>

                  <div className="w-[100px]">
                    <Badge className={`${getDocumentTypeBadgeColor(doc.tipoDocumento)} font-normal px-2 py-0`}>
                      {doc.tipoDocumento}
                    </Badge>
                  </div>

                  <div className="w-[120px]">
                    <p className="text-muted-foreground flex items-center gap-1.5 font-medium">
                      <Calendar className="h-3 w-3 opacity-60" />
                      {format(doc.fechaEnvio, 'dd/MM/yyyy', { locale: es })}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 ml-4.5">
                      {format(doc.fechaEnvio, 'HH:mm', { locale: es })}
                    </p>
                  </div>

                  <div className="w-[150px] flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50 px-2 group"
                      onClick={() => handleCancelDerivation(doc.id)}
                      title="Cancelar esta derivación"
                    >
                      <XSquare className="h-4 w-4 lg:mr-2" />
                      <span className="hidden xl:inline">Cancelar</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-muted/10">
            <Send className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg italic">
              No hay documentos enviados que coincidan con los filtros
            </p>
            <Button variant="link" onClick={handleClearFilters} className="mt-2 text-primary">
              Ver todos los envíos
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

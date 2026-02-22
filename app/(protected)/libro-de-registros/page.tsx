'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Printer,
  Settings2,
  Search,
  ArrowUp,
  ArrowDown,
  Clock,
  History,
  FileSpreadsheet,
  RotateCcw
} from 'lucide-react';
import { format, differenceInHours, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface RegistrationEntry {
  id: number;
  hojaDeRuta: string;
  referencia: string;
  fecha: Date;
  destinatario: string;
  cargo: string;
  unidad: string;
  proveido: string;
}

const mockEntries: RegistrationEntry[] = [
  {
    id: 1,
    hojaDeRuta: 'ABC-2026-001',
    referencia: 'Solicitud de reposición de activos fijos - Planta Central',
    fecha: new Date(2026, 1, 10, 8, 30),
    destinatario: 'Ana Rodríguez García',
    cargo: 'Analista Financiero',
    unidad: 'Finanzas',
    proveido: 'Para su atención urgente y reporte de saldo.',
  },
  {
    id: 2,
    hojaDeRuta: 'ABC-2026-005',
    referencia: 'Contrato de mantenimiento preventivo de ascensores',
    fecha: new Date(2026, 1, 15, 14, 20),
    destinatario: 'Carlos Mendoza Sánchez',
    cargo: 'Jefe de Administración',
    unidad: 'Servicios Generales',
    proveido: 'Revisar términos de garantía antes de la firma.',
  },
  {
    id: 3,
    hojaDeRuta: 'ABC-2026-012',
    referencia: 'Propuesta de capacitación en ciberseguridad 2026',
    fecha: new Date(2026, 1, 20, 10, 0),
    destinatario: 'María López Rodríguez',
    cargo: 'Directora de RRHH',
    unidad: 'Talento Humano',
    proveido: 'Para su VoBo y publicación en el portal.',
  },
  {
    id: 4,
    hojaDeRuta: 'ABC-2026-018',
    referencia: 'Informe de auditoría interna - Gestión 2025',
    fecha: new Date(2026, 1, 21, 16, 45),
    destinatario: 'Juan García Martínez',
    cargo: 'Gerente General',
    unidad: 'Gerencia',
    proveido: 'Favor analizar hallazgos críticos de inmediato.',
  },
  {
    id: 5,
    hojaDeRuta: 'ABC-2026-022',
    referencia: 'Suscripción anual de servicios en la nube (Cloud)',
    fecha: new Date(2026, 1, 22, 0, 0),
    destinatario: 'Roberto Fernández López',
    cargo: 'Jefe de TI',
    unidad: 'Tecnología',
    proveido: 'Proceder con el pago si cuenta con presupuesto.',
  },
];

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

const INITIAL_COLUMNS: ColumnConfig[] = [
  { id: 'hojaDeRuta', label: 'Hoja de Ruta', visible: true },
  { id: 'referencia', label: 'Referencia', visible: true },
  { id: 'fecha', label: 'Fecha', visible: true },
  { id: 'destinatario', label: 'Destinatario', visible: true },
  { id: 'cargo', label: 'Cargo', visible: true },
  { id: 'unidad', label: 'Unidad', visible: true },
  { id: 'proveido', label: 'Proveído', visible: true },
  { id: 'tiempo', label: 'Tiempo Transcurrido', visible: true },
];

export default function LibroRegistrosPage() {
  const [columns, setColumns] = useState<ColumnConfig[]>(INITIAL_COLUMNS);
  const [entries, setEntries] = useState<RegistrationEntry[]>(mockEntries);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const now = new Date();

  const getElapsedTime = (date: Date) => {
    const hours = differenceInHours(now, date);
    if (hours < 24) {
      return `${hours} hs`;
    }
    const days = differenceInDays(now, date);
    return `${days} días`;
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const newColumns = [...columns];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newColumns.length) {
      const temp = newColumns[index];
      newColumns[index] = newColumns[targetIndex];
      newColumns[targetIndex] = temp;
      setColumns(newColumns);
    }
  };

  const moveRow = (index: number, direction: 'up' | 'down') => {
    const newEntries = [...entries];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newEntries.length) {
      const temp = newEntries[index];
      newEntries[index] = newEntries[targetIndex];
      newEntries[targetIndex] = temp;
      setEntries(newEntries);
    }
  };

  const toggleColumnVisibility = (id: string) => {
    setColumns(columns.map(col =>
      col.id === id ? { ...col, visible: !col.visible } : col
    ));
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch =
        entry.hojaDeRuta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.destinatario.toLowerCase().includes(searchTerm.toLowerCase());

      let dateMatch = true;
      if (dateFrom) dateMatch = dateMatch && entry.fecha >= new Date(dateFrom);
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59);
        dateMatch = dateMatch && entry.fecha <= to;
      }
      return matchesSearch && dateMatch;
    });
  }, [entries, searchTerm, dateFrom, dateTo]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredEntries.map(e => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    if (selectedIds.length === 0) {
      alert('Por favor, seleccione al menos un registro para imprimir.');
      return;
    }
    alert(`Imprimiendo ${selectedIds.length} registros con el orden de columnas y filas configurado.`);
    window.print();
  };

  const renderCell = (entry: RegistrationEntry, columnId: string) => {
    switch (columnId) {
      case 'hojaDeRuta': return <span className="font-bold text-primary">{entry.hojaDeRuta}</span>;
      case 'referencia': return <span className="font-medium line-clamp-1">{entry.referencia}</span>;
      case 'fecha': return format(entry.fecha, 'dd/MM/yyyy HH:mm', { locale: es });
      case 'destinatario': return entry.destinatario;
      case 'cargo': return <span className="text-muted-foreground italic text-xs uppercase">{entry.cargo}</span>;
      case 'unidad': return <Badge variant="secondary" className="font-normal">{entry.unidad}</Badge>;
      case 'proveido': return <span className="text-xs italic bg-muted/50 p-1 rounded">"{entry.proveido}"</span>;
      case 'tiempo': return (
        <Badge variant="outline" className="flex items-center gap-1 w-fit bg-amber-50 border-amber-200 text-amber-700">
          <Clock className="h-3 w-3" />
          {getElapsedTime(entry.fecha)}
        </Badge>
      );
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Libro de Registro</h1>
          <p className="text-muted-foreground text-sm lg:text-base">Gestione y visualice el historial de tramitaciones con reporte personalizado.</p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings2 className="mr-2 h-4 w-4" />
                Configurar Columnas
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Personalizar Columnas</DialogTitle>
                <p className="text-xs text-muted-foreground">Active, desactive o cambie el orden de aparición de las columnas.</p>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {columns.map((col, idx) => (
                  <div key={col.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`col-${col.id}`}
                        checked={col.visible}
                        onCheckedChange={() => toggleColumnVisibility(col.id)}
                      />
                      <Label htmlFor={`col-${col.id}`} className="font-medium cursor-pointer">{col.label}</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={idx === 0}
                        onClick={() => moveColumn(idx, 'up')}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={idx === columns.length - 1}
                        onClick={() => moveColumn(idx, 'down')}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Selección
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label className="text-xs">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ruta, Ref o Destinatario"
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Desde</Label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Hasta</Label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <Button variant="outline" onClick={() => { setSearchTerm(''); setDateFrom(''); setDateTo(''); }}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </Card>

      {/* Table Section */}
      <Card className="overflow-hidden border shadow-sm">
        <div className="overflow-x-auto print:overflow-visible">
          <Table className="text-sm">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[50px] print:hidden">
                  <Checkbox
                    checked={selectedIds.length === filteredEntries.length && filteredEntries.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[80px] print:hidden text-center font-bold">Orden</TableHead>
                {columns.filter(c => c.visible).map(col => (
                  <TableHead key={col.id} className="font-bold print:border print:border-black whitespace-nowrap px-4 py-2">
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry, idx) => (
                  <TableRow key={entry.id} className={selectedIds.includes(entry.id) ? 'bg-primary/5' : ''}>
                    <TableCell className="print:hidden">
                      <Checkbox
                        checked={selectedIds.includes(entry.id)}
                        onCheckedChange={() => handleToggleSelect(entry.id)}
                      />
                    </TableCell>
                    <TableCell className="print:hidden">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          disabled={idx === 0}
                          onClick={() => moveRow(idx, 'up')}
                          title="Mover arriba"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          disabled={idx === filteredEntries.length - 1}
                          onClick={() => moveRow(idx, 'down')}
                          title="Mover abajo"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    {columns.filter(c => c.visible).map(col => (
                      <TableCell key={col.id} className="print:border print:border-black px-4 py-2">
                        {renderCell(entry, col.id)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} className="h-32 text-center text-muted-foreground italic">
                    <History className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    No se encontraron registros activos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Summary Footer */}
      <div className="flex justify-between items-center text-xs text-muted-foreground px-2">
        <p>{filteredEntries.length} registros totales | {selectedIds.length} seleccionados para reporte</p>
        <p>Generado hoy: {format(now, 'PPP', { locale: es })}</p>
      </div>

      {/* Hidden Print Styling */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          /* This simple CSS works if we wrap the table in a print-only container or manage visibility */
          /* However, for complex layouts, often a separate PrintTemplate is better. */
          /* Here we just ensure the table is visible and rest is hidden if needed. */
          table { width: 100%; border-collapse: collapse; }
          thead { display: table-header-group; }
          .lg\\:flex, .flex, .p-16, header, aside, .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .overflow-x-auto { overflow: visible !important; }
          /* Ensure visible parts are shown */
          .overflow-hidden.border.shadow-sm { 
            visibility: visible !important; 
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100%;
          }
          .overflow-hidden.border.shadow-sm * { visibility: visible !important; }
        }
      `}</style>
    </div>
  );
}

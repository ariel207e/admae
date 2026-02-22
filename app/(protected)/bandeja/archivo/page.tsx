'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FolderArchive,
  FileText,
  Search,
  RotateCw,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Input } from '@/components/ui/input';

interface ArchivedDocument {
  id: number;
  hojaDeRuta: string;
  cite: string;
  referencia: string;
  observaciones: string;
  fechaArchivado: Date;
}

interface Folder {
  id: number;
  nombre: string;
  descripcion: string;
  totalDocumentos: number;
  color: string;
  documentos: ArchivedDocument[];
}

// Mock data for archived folders
const mockFolders: Folder[] = [
  {
    id: 1,
    nombre: 'Gestión 2024 - Q1',
    descripcion: 'Documentos administrativos del primer trimestre',
    totalDocumentos: 15,
    color: 'bg-blue-500',
    documentos: [
      {
        id: 101,
        hojaDeRuta: 'ADM-2024-001',
        cite: 'G-001/2024',
        referencia: 'Solicitud de material de escritorio',
        observaciones: 'Completado y verificado',
        fechaArchivado: new Date(2024, 0, 15),
      },
      {
        id: 102,
        hojaDeRuta: 'ADM-2024-005',
        cite: 'G-012/2024',
        referencia: 'Contrato de servicios de limpieza',
        observaciones: 'Archivo definitivo',
        fechaArchivado: new Date(2024, 1, 10),
      }
    ]
  },
  {
    id: 2,
    nombre: 'Proyectos Especiales',
    descripcion: 'Correspondencia de proyectos de infraestructura',
    totalDocumentos: 8,
    color: 'bg-amber-500',
    documentos: [
      {
        id: 201,
        hojaDeRuta: 'PRJ-2024-022',
        cite: 'INF-045/2024',
        referencia: 'Planos de remodelación oficina central',
        observaciones: 'Copia física en estante B-4',
        fechaArchivado: new Date(2024, 2, 5),
      }
    ]
  },
  {
    id: 3,
    nombre: 'RRHH - Memorandums',
    descripcion: 'Archivo de memorandums de personal',
    totalDocumentos: 42,
    color: 'bg-purple-500',
    documentos: []
  },
  {
    id: 4,
    nombre: 'Auditorías 2023',
    descripcion: 'Informes finales y descargos',
    totalDocumentos: 12,
    color: 'bg-emerald-500',
    documentos: []
  }
];

export default function ArchivadosPage() {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUnarchive = (docId: number) => {
    if (confirm('¿Está seguro de que desea desarchivar este documento? El documento retornará a la bandeja de Pendientes.')) {
      console.log('Desarchivar documento:', docId);
      alert('Documento retornado a Pendientes correctamente');
      // In a real app, logic to update state/db would go here
    }
  };

  const filteredFolders = mockFolders.filter(folder =>
    folder.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Archivo de Documentos</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">Consulta y gestiona los documentos archivados en carpetas organizadas.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar carpeta..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFolders.map((folder) => (
          <Card
            key={folder.id}
            className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden border-t-4 border-t-primary"
            style={{ borderTopColor: folder.color.replace('bg-', '') }}
            onClick={() => setSelectedFolder(folder)}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${folder.color} bg-opacity-10`}>
                  <FolderArchive className={`h-6 w-6 ${folder.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded">
                  {folder.totalDocumentos} Docs
                </div>
              </div>
              <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">
                {folder.nombre}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 h-8">
                {folder.descripcion}
              </p>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-dashed">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Actualizado hoy
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for Folder Content */}
      <Dialog open={!!selectedFolder} onOpenChange={(open) => !open && setSelectedFolder(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedFolder?.color} bg-opacity-10`}>
                <FolderArchive className={`h-5 w-5 ${selectedFolder?.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">{selectedFolder?.nombre}</DialogTitle>
                <DialogDescription>
                  Mostrando documentos en esta carpeta. Desarchive para retornar a pendientes.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto py-4">
            {selectedFolder && selectedFolder.documentos.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold whitespace-nowrap">Hoja de Ruta</TableHead>
                      <TableHead className="font-bold whitespace-nowrap">Cite</TableHead>
                      <TableHead className="font-bold whitespace-nowrap">Referencia</TableHead>
                      <TableHead className="font-bold whitespace-nowrap">Observaciones</TableHead>
                      <TableHead className="font-bold whitespace-nowrap">Fecha</TableHead>
                      <TableHead className="text-right font-bold">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedFolder.documentos.map((doc) => (
                      <TableRow key={doc.id} className="hover:bg-muted/20">
                        <TableCell className="font-bold text-primary">{doc.hojaDeRuta}</TableCell>
                        <TableCell className="font-medium">{doc.cite}</TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate" title={doc.referencia}>{doc.referencia}</p>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs italic">
                          {doc.observaciones || 'Sin observaciones'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs">
                          {format(doc.fechaArchivado, 'dd/MM/yyyy', { locale: es })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-8"
                            onClick={() => handleUnarchive(doc.id)}
                          >
                            <RotateCw className="h-4 w-4 mr-2" />
                            Desarchivar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-lg border-2 border-dashed">
                <FileText className="h-12 w-12 text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground font-medium">Esta carpeta está vacía</p>
                <p className="text-xs text-muted-foreground mt-1">No hay documentos archivados actualmente aquí.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setSelectedFolder(null)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for stats
const statsData = [
  { label: 'Recibidos', value: '248', icon: '📬' },
  { label: 'Pendientes', value: '32', icon: '⏱️' },
  { label: 'Archivados', value: '1,205', icon: '📦' },
  { label: 'Documentos', value: '1,842', icon: '📄' },
];

// Mock data for chart
const chartData = [
  { month: 'Ene', recibidos: 45, procesados: 32 },
  { month: 'Feb', recibidos: 52, procesados: 38 },
  { month: 'Mar', recibidos: 48, procesados: 41 },
  { month: 'Abr', recibidos: 61, procesados: 52 },
  { month: 'May', recibidos: 55, procesados: 48 },
  { month: 'Jun', recibidos: 67, procesados: 58 },
];

// Mock data for recent documents
const recentDocuments = [
  {
    id: 1,
    hojaDeRuta: 'HDR-2024-001',
    cite: 'CITE-001',
    titulo: 'Informe de Gestión Q2',
    referencia: 'REF-2024-045',
    fechaCreacion: '2024-06-15',
    tipo: 'Informe',
  },
  {
    id: 2,
    hojaDeRuta: 'HDR-2024-002',
    cite: 'CITE-002',
    titulo: 'Nota de Cambio de Políticas',
    referencia: 'REF-2024-046',
    fechaCreacion: '2024-06-14',
    tipo: 'Nota',
  },
  {
    id: 3,
    hojaDeRuta: 'HDR-2024-003',
    cite: 'CITE-003',
    titulo: 'Carta de Presentación Oficial',
    referencia: 'REF-2024-047',
    fechaCreacion: '2024-06-13',
    tipo: 'Carta',
  },
  {
    id: 4,
    hojaDeRuta: 'HDR-2024-004',
    cite: 'CITE-004',
    titulo: 'Informe Financiero Trimestral',
    referencia: 'REF-2024-048',
    fechaCreacion: '2024-06-12',
    tipo: 'Informe',
  },
  {
    id: 5,
    hojaDeRuta: 'HDR-2024-005',
    cite: 'CITE-005',
    titulo: 'Nota de Supervisión Interna',
    referencia: 'REF-2024-049',
    fechaCreacion: '2024-06-11',
    tipo: 'Nota',
  },
];

const chartConfig = {
  recibidos: {
    label: 'Recibidos',
    color: '#7c3aed',
  },
  procesados: {
    label: 'Procesados',
    color: '#ec4899',
  },
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display mb-2">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="text-3xl opacity-50">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Actividad del Mes</h2>
        <ChartContainer config={chartConfig} className="h-80">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="recibidos" fill="var(--color-recibidos)" />
            <Bar dataKey="procesados" fill="var(--color-procesados)" />
          </BarChart>
        </ChartContainer>
      </Card>

      {/* Recent Documents Table */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Últimos 5 Documentos Generados</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hoja de Ruta</TableHead>
              <TableHead>CITE</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Referencia</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.hojaDeRuta}</TableCell>
                <TableCell>{doc.cite}</TableCell>
                <TableCell>{doc.titulo}</TableCell>
                <TableCell>{doc.referencia}</TableCell>
                <TableCell>
                  {new Date(doc.fechaCreacion).toLocaleDateString('es-ES')}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {doc.tipo}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

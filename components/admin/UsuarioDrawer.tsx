'use client';

import {
  Mail, Building2, Network, IdCard, Briefcase,
  LogIn, CalendarDays, FileText, ShieldCheck, ShieldOff,
  Inbox, Send, Archive, ArrowDownLeft, Hash,
} from 'lucide-react';
import {
  Drawer, DrawerContent, DrawerHeader,
  DrawerTitle, DrawerDescription,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
  PieChart, Pie,
} from 'recharts';
import type { Usuario } from '@/components/admin/types';

// ─── Mock de estadísticas (en producción vendría del servidor) ─────────────────
function getMockStats(userId: number) {
  const seed = userId * 7;
  return {
    bandeja: {
      entrada:   (seed * 3 + 12) % 60 + 5,
      salida:    (seed * 5 + 8)  % 40 + 3,
      enviados:  (seed * 2 + 20) % 80 + 10,
      archivados:(seed * 4 + 6)  % 50 + 2,
    },
    porTipo: [
      { tipo: 'Nota',      total: (seed * 3 + 10) % 50 + 5  },
      { tipo: 'Informe',   total: (seed * 5 + 6)  % 35 + 3  },
      { tipo: 'Carta',     total: (seed * 2 + 8)  % 30 + 2  },
      { tipo: 'Memorando', total: (seed * 7 + 3)  % 20 + 1  },
      { tipo: 'Circular',  total: (seed * 4 + 2)  % 15 + 1  },
    ].sort((a, b) => b.total - a.total),
  };
}

const PALETA = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
];

function formatFechaLarga(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function InfoFila({ icon: Icon, label, value }: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="size-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
        <p className="text-sm mt-0.5 break-words">{value || '—'}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-card p-3">
      <div className={`size-7 rounded-md flex items-center justify-center ${color}`}>
        <Icon className="size-3.5" />
      </div>
      <p className="text-2xl font-display font-semibold tabular-nums mt-1">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
    </div>
  );
}

// ─── Drawer principal ─────────────────────────────────────────────────────────

interface UsuarioDrawerProps {
  open: boolean;
  onClose: () => void;
  usuario: Usuario | null;
}

export function UsuarioDrawer({ open, onClose, usuario }: UsuarioDrawerProps) {
  if (!usuario) return null;

  const stats = getMockStats(usuario.id);
  const totalDocs = Object.values(stats.bandeja).reduce((a, b) => a + b, 0);

  const chartConfig = Object.fromEntries(
    stats.porTipo.map((d, i) => [
      d.tipo,
      { label: d.tipo, color: PALETA[i] ?? PALETA[4] },
    ])
  );

  const pieData = stats.porTipo.map((d) => ({
    name: d.tipo,
    value: d.total,
    fill: PALETA[stats.porTipo.indexOf(d)] ?? PALETA[4],
  }));

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => !v && onClose()}
      direction="right"
    >
      <DrawerContent className="sm:max-w-lg w-full flex flex-col overflow-hidden">
        {/* Header */}
        <DrawerHeader className="border-b px-5 pt-5 pb-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className={`size-14 rounded-full flex items-center justify-center text-base font-bold font-mono flex-shrink-0 ${
              usuario.activo ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {usuario.mosca.slice(0, 3)}
            </div>
            <div className="flex-1 min-w-0">
              <DrawerTitle className="font-display text-base leading-tight">
                {usuario.nombreCompleto}
              </DrawerTitle>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">@{usuario.nombreUsuario}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge
                  variant={usuario.activo ? 'default' : 'secondary'}
                  className={`text-[10px] h-4 px-1.5 ${
                    usuario.activo
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : ''
                  }`}
                >
                  {usuario.activo ? <ShieldCheck className="size-2.5 mr-1" /> : <ShieldOff className="size-2.5 mr-1" />}
                  {usuario.activo ? 'Activo' : 'Inactivo'}
                </Badge>
                <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                  {usuario.mosca}
                </span>
              </div>
            </div>
          </div>
          <DrawerDescription className="sr-only">
            Perfil de {usuario.nombreCompleto}
          </DrawerDescription>
        </DrawerHeader>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

          {/* Info personal */}
          <section>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
              Información personal
            </p>
            <div className="divide-y">
              <InfoFila icon={Mail}      label="Correo"  value={usuario.correo} />
              <InfoFila icon={IdCard}    label="Carnet"  value={usuario.carnet} />
              <InfoFila icon={ShieldCheck} label="Rol" value={usuario.rol || '—'} />
              <InfoFila icon={Briefcase} label="Cargo"   value={usuario.cargo} />
              <InfoFila icon={Building2} label="Entidad" value={usuario.entidad} />
              <InfoFila icon={Network}   label="Oficina" value={usuario.oficina} />
            </div>
          </section>

          <Separator />

          {/* Actividad */}
          <section>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              Actividad de sesión
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border p-3 flex items-center gap-3">
                <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <LogIn className="size-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-display font-semibold tabular-nums">{usuario.cantidadIngresos}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Ingresos</p>
                </div>
              </div>
              <div className="rounded-lg border p-3 flex items-center gap-3">
                <div className="size-8 rounded-md bg-muted flex items-center justify-center">
                  <CalendarDays className="size-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium leading-tight">
                    {formatFechaLarga(usuario.ultimoIngreso)}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Último acceso</p>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Documentos por bandeja */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Documentos por bandeja
              </p>
              <span className="text-xs font-mono text-muted-foreground">{totalDocs} total</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <StatCard
                icon={Inbox}
                label="Entrada"
                value={stats.bandeja.entrada}
                color="bg-blue-500/10 text-blue-500"
              />
              <StatCard
                icon={ArrowDownLeft}
                label="Salida"
                value={stats.bandeja.salida}
                color="bg-amber-500/10 text-amber-500"
              />
              <StatCard
                icon={Send}
                label="Enviados"
                value={stats.bandeja.enviados}
                color="bg-emerald-500/10 text-emerald-500"
              />
              <StatCard
                icon={Archive}
                label="Archivados"
                value={stats.bandeja.archivados}
                color="bg-muted text-muted-foreground"
              />
            </div>
          </section>

          <Separator />

          {/* Gráfico de documentos por tipo */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Documentos creados por tipo
              </p>
              <Hash className="size-3 text-muted-foreground" />
            </div>

            {/* Barras horizontales */}
            <ChartContainer id={`user-bar-${usuario.id}`} config={chartConfig} className="h-[180px] w-full">
              <BarChart
                layout="vertical"
                data={stats.porTipo}
                margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="tipo"
                  type="category"
                  width={72}
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="total" radius={4}>
                  {stats.porTipo.map((_, i) => (
                    <Cell key={i} fill={PALETA[i] ?? PALETA[4]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>

            {/* Pie chart secundario */}
            <div className="mt-4">
              <ChartContainer id={`user-pie-${usuario.id}`} config={chartConfig} className="h-[180px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
            </div>
          </section>

          <Separator />

          {/* Documentos permitidos */}
          <section className="pb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Documentos permitidos
              </p>
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                {usuario.documentosPermitidos.length}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {usuario.documentosPermitidos.map((doc) => (
                <span
                  key={doc}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full"
                >
                  <FileText className="size-2.5" />
                  {doc}
                </span>
              ))}
            </div>
          </section>

        </div>
      </DrawerContent>
    </Drawer>
  );
}

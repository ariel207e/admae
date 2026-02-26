'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Mail,
  Briefcase,
  Building2,
  IdCard,
  Shield,
  FileText,
  History,
  LogIn,
  Globe,
  Smartphone,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock de historial de login
const LOGIN_HISTORY = [
  { id: 1, date: '2026-02-25 08:30:15', ip: '192.168.1.45', device: 'Chrome on Windows', location: 'La Paz, Bolivia', current: true },
  { id: 2, date: '2026-02-24 14:22:10', ip: '192.168.1.45', device: 'Chrome on Windows', location: 'La Paz, Bolivia', current: false },
  { id: 3, date: '2026-02-24 09:15:44', ip: '186.121.23.10', device: 'Safari on iPhone', location: 'Santa Cruz, Bolivia', current: false },
  { id: 4, date: '2026-02-23 18:05:30', ip: '192.168.1.45', device: 'Chrome on Windows', location: 'La Paz, Bolivia', current: false },
  { id: 5, date: '2026-02-23 08:45:12', ip: '192.168.1.45', device: 'Chrome on Windows', location: 'La Paz, Bolivia', current: false },
];

export default function CuentaPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header / Perfil Principal */}
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl border border-primary/10" />
        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          <Avatar className="w-24 h-24 border-4 border-background shadow-xl ring-1 ring-primary/10">
            <AvatarImage src={user.avatar} alt={user.nombre} />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {user.nombre[0]}{user.apellido[0]}
            </AvatarFallback>
          </Avatar>
          <div className="pb-2">
            <h1 className="text-3xl font-display font-bold text-foreground">
              {user.nombre} {user.apellido}
            </h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
              {user.cargo} <span className="text-muted-foreground/30">•</span> {user.entidad}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16 pb-12">
        {/* Columna Izquierda: Información Personal */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold font-display">Información General</h2>
            </div>
            <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm transition-all hover:shadow-md">
              <InfoItem icon={User} label="Nombre de Usuario" value={`@${user.nombreUsuario}`} className="font-mono text-primary" />
              <InfoItem icon={IdCard} label="Carnet de Identidad" value={user.carnet || '---'} />
              <InfoItem icon={Mail} label="Correo Electrónico" value={user.email} />
              <InfoItem icon={Shield} label="Rol del Sistema" value={user.rol} isBadge />
              <InfoItem icon={Building2} label="Oficina" value={user.oficina} />
              <InfoItem icon={Briefcase} label="Cargo" value={user.cargo || '---'} />
              <InfoItem icon={User} label="Mosca (Iniciales)" value={user.mosca} className="font-mono" />
              <InfoItem icon={LogIn} label="Total Ingresos" value={String(user.cantidadIngresos)} />
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold font-display">Documentos Habilitados</h2>
            </div>
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
              <div className="flex flex-wrap gap-3">
                {user.documentosPermitidos?.map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 text-primary font-medium text-sm transition-all hover:bg-primary/10 hover:scale-105 cursor-default"
                  >
                    <FileText className="w-4 h-4" />
                    {doc}
                  </div>
                ))}
              </div>
              {(!user.documentosPermitidos || user.documentosPermitidos.length === 0) && (
                <p className="text-sm text-muted-foreground italic">No hay documentos habilitados asignados.</p>
              )}
            </Card>
          </section>
        </div>

        {/* Columna Derecha: Actividad Reciente */}
        <div className="lg:col-span-4 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold font-display">Historial de Acceso</h2>
            </div>
            <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
              <div className="divide-y divide-border/50">
                {LOGIN_HISTORY.map((login) => (
                  <div
                    key={login.id}
                    className={cn(
                      "p-4 transition-colors hover:bg-muted/30",
                      login.current && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-mono font-medium">{login.ip}</span>
                      </div>
                      {login.current && (
                        <Badge variant="outline" className="text-[10px] h-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-1.5 uppercase font-bold tracking-tighter">
                          Sesión Actual
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Smartphone className="w-3 h-3" />
                      <span>{login.device}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                        <MapPin className="w-3 h-3" />
                        <span>{login.location}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {login.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 text-xs font-semibold text-primary/70 hover:text-primary transition-colors border-t border-border/50 bg-muted/20">
                Ver historial completo
              </button>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  isBadge = false,
  className
}: {
  icon: any,
  label: string,
  value: string,
  isBadge?: boolean,
  className?: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      {isBadge ? (
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold px-2 py-0.5 rounded-md">
          {value}
        </Badge>
      ) : (
        <p className={cn("text-sm font-semibold text-foreground/90", className)}>
          {value}
        </p>
      )}
    </div>
  );
}

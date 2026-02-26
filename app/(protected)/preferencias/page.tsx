'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  Eye,
  Settings2,
  Lock,
  Globe,
  Layout,
  FileText,
  Save
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export default function PreferenciasPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    documents: true,
    assignments: true,
    reports: false
  });

  const [display, setDisplay] = useState({
    compactSidebar: false,
    animations: true,
    highContrast: false,
    showAvatars: true
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Preferencias</h1>
        <p className="text-muted-foreground">Personaliza tu experiencia de usuario y configura las notificaciones del sistema.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-muted/50 p-1 mb-6">
          <TabsTrigger value="general" className="gap-2">
            <Settings2 className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="apariencia" className="gap-2">
            <Monitor className="w-4 h-4" />
            Apariencia
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <TabsContent value="general" className="mt-0 space-y-6 outline-none">
              <Card className="p-6 md:p-8 space-y-8 bg-card/50 backdrop-blur-sm border-border/50">
                <section className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Idioma y Región
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Idioma del Sistema</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option>Español (Bolivia)</option>
                        <option>English (US)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Zona Horaria</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option>(GMT-04:00) La Paz</option>
                        <option>(GMT-05:00) Bogotá, Lima</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="space-y-4 pt-4 border-t border-border/50">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Layout className="w-5 h-5 text-primary" />
                    Espacio de Trabajo
                  </h3>
                  <div className="space-y-4">
                    <PreferenceToggle
                      icon={Monitor}
                      title="Barra lateral colapsada"
                      description="Mantener la barra lateral pequeña por defecto."
                      checked={display.compactSidebar}
                      onChange={(v) => setDisplay({ ...display, compactSidebar: v })}
                    />
                    <PreferenceToggle
                      icon={Eye}
                      title="Mostrar fotos de perfil"
                      description="Visualizar avatares en listas y comentarios."
                      checked={display.showAvatars}
                      onChange={(v) => setDisplay({ ...display, showAvatars: v })}
                    />
                  </div>
                </section>
              </Card>
            </TabsContent>

            <TabsContent value="apariencia" className="mt-0 outline-none">
              <Card className="p-6 md:p-8 space-y-8 bg-card/50 backdrop-blur-sm border-border/50">
                <section className="space-y-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                    <Sun className="w-5 h-5 text-primary" />
                    Modo del Sistema
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <ThemeCard
                      active={theme === 'light'}
                      onClick={() => setTheme('light')}
                      label="Claro"
                      icon={Sun}
                    />
                    <ThemeCard
                      active={theme === 'dark'}
                      onClick={() => setTheme('dark')}
                      label="Oscuro"
                      icon={Moon}
                    />
                    <ThemeCard
                      active={theme === 'system'}
                      onClick={() => setTheme('system')}
                      label="Sistema"
                      icon={Monitor}
                    />
                  </div>
                </section>

                <section className="space-y-4 pt-6 border-t border-border/50">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Layout className="w-5 h-5 text-primary" />
                    Efectos Visuales
                  </h3>
                  <div className="space-y-4">
                    <PreferenceToggle
                      icon={Monitor}
                      title="Animaciones del sistema"
                      description="Habilitar transiciones y animaciones fluidas."
                      checked={display.animations}
                      onChange={(v) => setDisplay({ ...display, animations: v })}
                    />
                    <PreferenceToggle
                      icon={Eye}
                      title="Contraste alto"
                      description="Mejorar la visibilidad de los elementos."
                      checked={display.highContrast}
                      onChange={(v) => setDisplay({ ...display, highContrast: v })}
                    />
                  </div>
                </section>
              </Card>
            </TabsContent>

            <TabsContent value="notificaciones" className="mt-0 outline-none">
              <Card className="p-6 md:p-8 space-y-8 bg-card/50 backdrop-blur-sm border-border/50">
                <section className="space-y-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Canales de Comunicación
                  </h3>
                  <div className="space-y-4">
                    <PreferenceToggle
                      icon={Mail}
                      title="Notificaciones por Correo"
                      description="Recibe alertas importantes en tu bandeja de entrada."
                      checked={notifications.email}
                      onChange={(v) => setNotifications({ ...notifications, email: v })}
                    />
                    <PreferenceToggle
                      icon={Smartphone}
                      title="Notificaciones Push"
                      description="Alertas en tiempo real en tu navegador o móvil."
                      checked={notifications.push}
                      onChange={(v) => setNotifications({ ...notifications, push: v })}
                    />
                  </div>
                </section>

                <section className="space-y-6 pt-6 border-t border-border/50">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Eventos del Flujo Documental
                  </h3>
                  <div className="space-y-4">
                    <PreferenceToggle
                      icon={FileText}
                      title="Documentos Recibidos"
                      description="Notificar cuando se reciba un nuevo documento."
                      checked={notifications.documents}
                      onChange={(v) => setNotifications({ ...notifications, documents: v })}
                    />
                    <PreferenceToggle
                      icon={Users}
                      title="Tareas Asignadas"
                      description="Alertar sobre nuevas derivaciones a mi usuario."
                      checked={notifications.assignments}
                      onChange={(v) => setNotifications({ ...notifications, assignments: v })}
                    />
                    <PreferenceToggle
                      icon={Save}
                      title="Reportes Listos"
                      description="Avisar cuando mis reportes programados terminen."
                      checked={notifications.reports}
                      onChange={(v) => setNotifications({ ...notifications, reports: v })}
                    />
                  </div>
                </section>
              </Card>
            </TabsContent>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 bg-primary/5 border-primary/10 relative overflow-hidden group">
              <Settings2 className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 -rotate-12 transition-transform group-hover:scale-110" />
              <div className="relative z-10 space-y-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <Save className="w-5 h-5 text-primary" />
                  Guardar Cambios
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Las preferencias se guardarán localmente en este dispositivo y se sincronizarán con tu perfil de usuario.
                </p>
                <Button className="w-full shadow-lg shadow-primary/20 h-11 font-bold">
                  Guardar Preferencias
                </Button>
                <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    <span>Tus datos están protegidos.</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-border/50 bg-card/50">
              <h4 className="font-bold text-sm">Resumen de Cuenta</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Última sincronización</span>
                  <span className="font-medium">Hace 5 min</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Dispositivos activos</span>
                  <span className="font-medium">2 sesiones</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

function PreferenceToggle({ icon: Icon, title, description, checked, onChange }: {
  icon: any;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50 group">
      <div className="flex gap-4">
        <div className="size-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground max-w-[280px]">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ThemeCard({ active, onClick, label, icon: Icon }: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: any
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-300 group",
        active
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-2 ring-primary/5"
          : "border-border/50 hover:border-primary/50 bg-background/50"
      )}
    >
      <div className={cn(
        "size-12 rounded-xl flex items-center justify-center transition-transform duration-500",
        active ? "bg-primary text-white scale-110 rotate-3" : "bg-muted text-muted-foreground group-hover:scale-110"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <span className={cn(
        "text-sm font-bold tracking-wide",
        active ? "text-primary" : "text-muted-foreground"
      )}>{label}</span>
    </button>
  );
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M23 7a4 4 0 0 0-4-4h-1" />
    </svg>
  );
}

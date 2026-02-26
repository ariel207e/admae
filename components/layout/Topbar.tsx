'use client';

import { useTheme } from 'next-themes';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  LogOut,
  User,
  Settings,
  ChevronDown,
  PanelLeft,
  KeyRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { toggle, toggleCollapse, isCollapsed } = useSidebar();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 bg-background/70 backdrop-blur-md border-b border-border/60 flex items-center justify-between px-4 lg:px-6 transition-all duration-300">
      {/* Lado izquierdo - Logo y nombre */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Toggle móvil */}
        <button
          onClick={toggle}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo y nombre */}
        <Link href="/admin/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Sistema"
              width={32}
              height={32}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-lg font-display hidden sm:inline whitespace-nowrap">Sistema</span>
        </Link>

        {/* Toggle desktop para colapsar sidebar */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
          title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Lado derecho */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Tema */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </Button>

        {/* Notificaciones */}
        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-2 font-semibold border-b">
              Notificaciones
            </div>
            <div className="py-2">
              <div className="px-4 py-3 hover:bg-muted cursor-pointer border-b">
                <h4 className="font-medium text-sm">Documento nuevo</h4>
                <p className="text-xs text-muted-foreground">
                  Ha llegado un nuevo documento
                </p>
              </div>
              <div className="px-4 py-3 hover:bg-muted cursor-pointer">
                <h4 className="font-medium text-sm">Tarea asignada</h4>
                <p className="text-xs text-muted-foreground">
                  Te han asignado una nueva tarea
                </p>
              </div>
            </div>
            <div className="px-4 py-2 border-t text-sm text-muted-foreground hover:text-foreground cursor-pointer">
              Ver todas
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                {user?.nombre?.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-foreground truncate max-w-[200px]">
                    {user?.nombre} {user?.apellido}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[200px]">
                  {user?.cargo}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-display">{user?.nombre} {user?.apellido}</p>
              <p className="text-xs text-muted-foreground font-body">{user?.email}</p>
            </div>
            <DropdownMenuItem asChild>
              <Link href="/cuenta" className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Mi Cuenta
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/cambiar-password" className="cursor-pointer">
                <KeyRound className="w-4 h-4 mr-2" />
                Actualizar Contraseña
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/preferencias" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Preferencias
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

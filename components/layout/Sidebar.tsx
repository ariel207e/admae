'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Mail,
  Building2,
  Tags,
  Inbox,
  CheckSquare,
  Send,
  Archive,
  Folder,
  BarChart3,
  Eye,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Admin',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
      { icon: Users, label: 'Usuarios', href: '/admin/usuarios' },
      { icon: Building2, label: 'Oficinas', href: '/admin/oficinas' },
      { icon: FileText, label: 'Entidades', href: '/admin/entidades' },
      { icon: Tags, label: 'Tipos', href: '/admin/tipos' },
    ],
  },
  {
    title: 'Bandeja',
    items: [
      { icon: Inbox, label: 'Entrada', href: '/bandeja/entrada' },
      { icon: CheckSquare, label: 'Pendientes', href: '/bandeja/pendientes' },
      { icon: Send, label: 'Salida', href: '/bandeja/salida' },
      { icon: Archive, label: 'Archivo', href: '/bandeja/archivo' },
      { icon: Folder, label: 'Carpetas', href: '/bandeja/carpetas' },
      { icon: Eye, label: 'Agrupados', href: '/bandeja/agrupados' },
    ],
  },
  {
    title: 'Documentos',
    items: [
      { icon: FileText, label: 'Mis Documentos', href: '/documentos/misdocumentos' },
      { icon: FileText, label: 'Crear', href: '/documentos/crear' },
    ],
  },
  {
    title: 'Otros',
    items: [
      { icon: FileText, label: 'Libro de Registros', href: '/libro-de-registros' },
      { icon: Mail, label: 'Ventanilla', href: '/ventanilla/registro' },
      { icon: Eye, label: 'Seguimiento', href: '/seguimiento' },
      { icon: BarChart3, label: 'Reportes', href: '/reportes/selector' },
    ],
  },
];

export function Sidebar() {
  const { isOpen, close, isCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 z-40 bg-sidebar border-r border-sidebar-border overflow-y-auto transition-all duration-300 ease-in-out',
          'lg:relative lg:top-0 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'w-20 lg:w-20' : 'w-64 lg:w-64'
        )}
      >
        <div className="p-4">
          {/* Cerrar en móvil */}
          <button
            onClick={close}
            className="lg:hidden mb-4 p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Menú */}
          {menuItems.map((section) => (
            <div key={section.title} className="mb-6">
              {!isCollapsed && (
                <h3 className="px-2 py-2 text-xs font-display uppercase text-sidebar-foreground/50 tracking-wider">
                  {section.title}
                </h3>
              )}
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body transition-colors',
                        isCollapsed ? 'justify-center px-2' : '',
                        isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent'
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

'use client';

import { Network, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Oficina, Entidad } from '@/components/admin/types';

interface OficinaNodo extends Oficina {
  children: OficinaNodo[];
}

function buildTree(oficinas: Oficina[]): OficinaNodo[] {
  const map = new Map<number, OficinaNodo>();
  oficinas.forEach((o) => map.set(o.id, { ...o, children: [] }));
  const roots: OficinaNodo[] = [];
  map.forEach((node) => {
    if (node.parentId === null || !map.has(node.parentId)) {
      roots.push(node);
    } else {
      map.get(node.parentId)!.children.push(node);
    }
  });
  return roots;
}

interface OrgNodeProps {
  node: OficinaNodo;
  onEdit?: (o: Oficina) => void;
  isRoot?: boolean;
}

function OrgNode({ node, onEdit, isRoot = false }: OrgNodeProps) {
  const hasChildren = node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Card del nodo */}
      <div
        className={`
          relative group cursor-default select-none min-w-[140px] max-w-[180px]
          rounded-lg border px-3 py-2 text-center shadow-sm transition-all
          ${isRoot
            ? 'bg-primary text-primary-foreground border-primary/80 shadow-primary/20 shadow-md'
            : 'bg-card border-border hover:border-primary/40 hover:shadow-md'
          }
        `}
      >
        <div className="flex items-center justify-center mb-1">
          {hasChildren ? (
            <Network className={`size-3.5 ${isRoot ? 'text-primary-foreground/80' : 'text-primary'}`} />
          ) : (
            <Building className={`size-3.5 ${isRoot ? 'text-primary-foreground/60' : 'text-muted-foreground'}`} />
          )}
        </div>
        <p className={`text-xs font-display font-semibold leading-tight ${isRoot ? 'text-primary-foreground' : ''}`}>
          {node.nombre}
        </p>
        <Badge
          variant={isRoot ? 'secondary' : 'outline'}
          className={`text-[10px] px-1.5 py-0 font-mono h-4 mt-1 ${isRoot ? 'bg-primary-foreground/20 text-primary-foreground border-0' : ''}`}
        >
          {node.sigla}
        </Badge>

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(node)}
            className="absolute -top-2 -right-2 size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
            title="Editar"
          >
            ✎
          </button>
        )}
      </div>

      {/* Conector + hijos */}
      {hasChildren && (
        <div className="flex flex-col items-center">
          {/* Línea vertical hacia abajo */}
          <div className="w-px h-5 bg-border" />

          {/* Rama horizontal */}
          <div className="flex items-start gap-0">
            {node.children.map((child, idx) => (
              <div key={child.id} className="flex flex-col items-center relative">
                {/* Líneas de conexión horizontal */}
                {node.children.length > 1 && (
                  <>
                    {/* Línea superior horizontal */}
                    <div
                      className={`h-px bg-border absolute top-0 ${
                        idx === 0
                          ? 'left-1/2 right-0'
                          : idx === node.children.length - 1
                          ? 'left-0 right-1/2'
                          : 'left-0 right-0'
                      }`}
                    />
                  </>
                )}
                {/* Línea vertical */}
                <div className="w-px h-5 bg-border" />

                <div className="px-3">
                  <OrgNode node={child} onEdit={onEdit} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface OficinaOrgChartProps {
  oficinas: Oficina[];
  entidades: Entidad[];
  onEdit?: (o: Oficina) => void;
}

export function OficinaOrgChart({ oficinas, entidades, onEdit }: OficinaOrgChartProps) {
  const entidadMap = new Map(entidades.map((e) => [e.id, e]));
  const byEntidad = new Map<number, Oficina[]>();
  oficinas.forEach((o) => {
    if (!byEntidad.has(o.entidadId)) byEntidad.set(o.entidadId, []);
    byEntidad.get(o.entidadId)!.push(o);
  });

  if (oficinas.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No hay oficinas que mostrar.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {[...byEntidad.entries()].map(([entidadId, ofs]) => {
        const entidad = entidadMap.get(entidadId);
        const roots = buildTree(ofs);

        return (
          <div key={entidadId}>
            {entidad && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                  {entidad.siglaHR}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {entidad.nombreCompleto}
                </span>
              </div>
            )}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-10 min-w-max px-4 pt-2">
                {roots.map((root) => (
                  <OrgNode key={root.id} node={root} onEdit={onEdit} isRoot />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

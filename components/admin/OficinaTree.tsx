'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Building, Network } from 'lucide-react';
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

interface TreeNodeProps {
  node: OficinaNodo;
  depth?: number;
  onEdit?: (o: Oficina) => void;
}

function TreeNode({ node, depth = 0, onEdit }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-1.5 py-1.5 px-2 rounded-md hover:bg-muted/60 group transition-colors cursor-pointer"
        style={{ paddingLeft: `${8 + depth * 20}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Expand icon */}
        <span className="size-4 flex items-center justify-center text-muted-foreground flex-shrink-0">
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )
          ) : (
            <span className="size-1.5 rounded-full bg-border block mx-auto" />
          )}
        </span>

        {/* Icon */}
        {hasChildren ? (
          <Network className="size-3.5 text-primary flex-shrink-0" />
        ) : (
          <Building className="size-3.5 text-muted-foreground flex-shrink-0" />
        )}

        <span className="text-sm flex-1 min-w-0 truncate">{node.nombre}</span>

        <Badge
          variant="secondary"
          className="text-[10px] px-1.5 py-0 font-mono h-4 opacity-60 group-hover:opacity-100 transition-opacity"
        >
          {node.sigla}
        </Badge>

        {onEdit && (
          <button
            type="button"
            className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity px-1.5 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
          >
            Editar
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="relative">
          {/* Línea vertical */}
          <div
            className="absolute top-0 bottom-0 border-l border-border/60"
            style={{ left: `${16 + depth * 20}px` }}
          />
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

interface OficinaTreeProps {
  oficinas: Oficina[];
  entidades: Entidad[];
  onEdit?: (o: Oficina) => void;
}

export function OficinaTree({ oficinas, entidades, onEdit }: OficinaTreeProps) {
  const entidadMap = new Map(entidades.map((e) => [e.id, e]));

  // Agrupar por entidad
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
    <div className="space-y-4">
      {[...byEntidad.entries()].map(([entidadId, ofs]) => {
        const entidad = entidadMap.get(entidadId);
        const roots = buildTree(ofs);
        return (
          <div key={entidadId}>
            {entidad && (
              <div className="flex items-center gap-2 mb-1.5 px-2">
                <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                  {entidad.siglaHR}
                </span>
                <span className="text-xs font-semibold text-muted-foreground truncate">
                  {entidad.nombreCompleto}
                </span>
              </div>
            )}
            <div className="rounded-lg border bg-card">
              {roots.map((root) => (
                <TreeNode key={root.id} node={root} depth={0} onEdit={onEdit} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

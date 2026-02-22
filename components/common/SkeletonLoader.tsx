export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      <div className="h-12 bg-muted rounded-lg animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-card rounded-lg p-4 space-y-3">
      <div className="h-6 bg-muted rounded animate-pulse w-2/3" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-10 bg-muted rounded flex-1 animate-pulse" />
          <div className="h-10 bg-muted rounded flex-1 animate-pulse" />
          <div className="h-10 bg-muted rounded flex-1 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

import { MoreVertical } from "lucide-react";

export function DocumentCard({
  name,
  updatedAt,
  children,
}: {
  name: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-sm">
      <div className="aspect-[3/4] w-full">{children}</div>
      <div className="flex items-center justify-between gap-2 px-2.5 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {name}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {updatedAt}
          </p>
        </div>
        <button
          type="button"
          aria-label={`More options for ${name}`}
          className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <MoreVertical className="size-4" />
        </button>
      </div>
    </article>
  );
}
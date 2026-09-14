export type SignupPoint = {
  label: string;
  count: number;
};

export function SignupsChart({
  data,
  total,
}: {
  data: SignupPoint[];
  total: string;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div>
      <div className="flex h-44 items-end gap-1.5 border-b border-border pb-6">
        {data.map((d) => {
          const height = Math.max(Math.round((d.count / max) * 100), 4);
          const isMax = d.count === max;
          return (
            <div
              key={d.label}
              title={`${d.label}: ${d.count} signups`}
              className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-1.5"
            >
              <div
                className={isMax ? "bg-primary" : "bg-primary/40 group-hover:bg-primary/70"}
                style={{ height: `${height}%` }}
              />
              <span className="truncate text-center text-[10px] leading-none text-muted-foreground">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{total}</span> new
        signups in the last 14 days
      </p>
    </div>
  );
}
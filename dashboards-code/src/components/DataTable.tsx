interface DataTableProps {
  headers: string[];
  rows: string[][];
  accentColor: string;
}

export default function DataTable({ headers, rows, accentColor }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: accentColor + '12' }}>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap border-b border-border"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-border/50 last:border-b-0 hover:bg-accent/30 transition-colors"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-3 text-muted-foreground leading-relaxed"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

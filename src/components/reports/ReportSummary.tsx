
import React from "react";

interface SummaryItem {
  label: string;
  value: string | number;
  colorClass?: string;
}

interface ReportSummaryProps {
  items: SummaryItem[];
}

export function ReportSummary({ items }: ReportSummaryProps) {
  return (
    <div className="mt-4 p-6 bg-muted rounded-md shadow-sm">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {items.map((item, index) => (
          <div key={index} className="flex-1 text-center md:text-left">
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            <p className={`text-2xl font-bold mt-1 ${item.colorClass || ''}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

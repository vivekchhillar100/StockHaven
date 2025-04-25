
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { ReportSummary } from "./ReportSummary";
import { StatusBadge } from "./StatusBadge";

interface MovementItem {
  id: string;
  itemId: string;
  name: string;
  date: Date;
  type: string;
  quantity: number;
  reference: string;
  notes: string;
}

interface MovementReportProps {
  data: MovementItem[];
}

export function MovementReport({ data }: MovementReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Movement Report</CardTitle>
        <CardDescription>
          Tracks all inward and outward movement of inventory items
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Movement ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-medium">
                      <div>{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.itemId}</div>
                    </TableCell>
                    <TableCell>{format(item.date, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.type} type="movement" />
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.reference}</TableCell>
                    <TableCell>{item.notes}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No movement data found for selected date range
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <ReportSummary 
          items={[
            {
              label: "Total Movements",
              value: data.length
            },
            {
              label: "Inward Movements",
              value: data.filter(item => item.type === "Inward").length
            },
            {
              label: "Outward Movements",
              value: data.filter(item => item.type === "Outward").length
            }
          ]}
        />
      </CardContent>
    </Card>
  );
}

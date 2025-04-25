
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { ReportSummary } from "./ReportSummary";
import { StatusBadge } from "./StatusBadge";

interface ExpiryItem {
  id: string;
  name: string;
  category: string;
  expiryDate: Date;
  daysRemaining: number;
  quantity: number;
  status: string;
}

interface ExpiryReportProps {
  data: ExpiryItem[];
}

export function ExpiryReport({ data }: ExpiryReportProps) {
  const criticalCount = data.filter(item => item.daysRemaining < 30).length;
  const warningCount = data.filter(item => item.daysRemaining >= 30 && item.daysRemaining <= 60).length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Expiry/End-of-Life Report</CardTitle>
        <CardDescription>
          Items nearing their expiration date or end-of-life dates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Days Remaining</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{format(item.expiryDate, 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{item.daysRemaining}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No expiry data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <ReportSummary 
          items={[
            {
              label: "Critical Items (< 30 days)",
              value: criticalCount,
              colorClass: "text-red-600"
            },
            {
              label: "Warning Items (30-60 days)",
              value: warningCount,
              colorClass: "text-yellow-600"
            },
            {
              label: "Total Expiring Items",
              value: data.length
            }
          ]}
        />
      </CardContent>
    </Card>
  );
}

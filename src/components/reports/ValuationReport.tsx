
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ReportSummary } from "./ReportSummary";

interface ValuationItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  totalValue: number;
}

interface ValuationReportProps {
  data: ValuationItem[];
}

export function ValuationReport({ data }: ValuationReportProps) {
  const totalInventoryValue = data.reduce((sum, item) => sum + item.totalValue, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Valuation Report</CardTitle>
        <CardDescription>
          Current inventory valuation showing stock levels and their monetary value
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
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price (₹)</TableHead>
                <TableHead className="text-right">Total Value (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₹{item.price.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right">₹{item.totalValue.toLocaleString('en-IN')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No valuation data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <ReportSummary 
          items={[
            {
              label: "Total Inventory Items",
              value: data.length
            },
            {
              label: "Total Inventory Value",
              value: `₹${totalInventoryValue.toLocaleString('en-IN')}`
            },
            {
              label: "Avg. Item Value",
              value: `₹${data.length > 0 
                ? Math.round(totalInventoryValue / data.length).toLocaleString('en-IN') 
                : 0}`
            }
          ]}
        />
      </CardContent>
    </Card>
  );
}

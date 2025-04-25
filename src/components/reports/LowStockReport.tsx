
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ReportSummary } from "./ReportSummary";

interface LowStockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  price: number;
  supplier: string;
}

interface LowStockReportProps {
  data: LowStockItem[];
}

export function LowStockReport({ data }: LowStockReportProps) {
  const lowStockValue = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock & Reorder Report</CardTitle>
        <CardDescription>
          Items that have fallen below their reorder level and need to be restocked
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
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Unit Price (₹)</TableHead>
                <TableHead>Supplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800">
                        {item.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.reorderLevel}</TableCell>
                    <TableCell>₹{item.price.toLocaleString('en-IN')}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No low stock items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <ReportSummary 
          items={[
            {
              label: "Total Low Stock Items",
              value: data.length
            },
            {
              label: "Total Value at Risk",
              value: `₹${lowStockValue.toLocaleString('en-IN')}`
            },
            {
              label: "Avg. Stock Level",
              value: data.length > 0 
                ? Math.round(data.reduce((sum, item) => sum + item.quantity, 0) / data.length) 
                : 0
            }
          ]}
        />
      </CardContent>
    </Card>
  );
}


import React, { useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Search, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LowStockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  supplierName: string;
  status: "critical" | "warning" | "normal";
}

export default function LowStockCount() {
  const sampleLowStockData: LowStockItem[] = [
    { 
      id: "SKU001", 
      name: "Brake Pads - Ceramic", 
      category: "Brake Systems", 
      quantity: 3, 
      reorderLevel: 10, 
      supplierName: "Supreme Auto Parts", 
      status: "critical" 
    },
    { 
      id: "SKU012", 
      name: "Engine Oil - Synthetic 5W30", 
      category: "Fluids & Oils", 
      quantity: 5, 
      reorderLevel: 15, 
      supplierName: "Royal Lubricants", 
      status: "critical" 
    },
    { 
      id: "SKU024", 
      name: "Air Filters - High Performance", 
      category: "Filters", 
      quantity: 4, 
      reorderLevel: 12, 
      supplierName: "FilterMax India", 
      status: "critical" 
    },
    { 
      id: "SKU045", 
      name: "Headlight Bulbs - LED", 
      category: "Electrical", 
      quantity: 6, 
      reorderLevel: 8, 
      supplierName: "Light Solutions", 
      status: "warning" 
    },
    { 
      id: "SKU038", 
      name: "Spark Plugs - Iridium", 
      category: "Engine Parts", 
      quantity: 8, 
      reorderLevel: 20, 
      supplierName: "Spark Technologies", 
      status: "warning" 
    },
    { 
      id: "SKU052", 
      name: "Wiper Blades - Premium", 
      category: "Exterior", 
      quantity: 7, 
      reorderLevel: 10, 
      supplierName: "Visibility Pro", 
      status: "warning" 
    },
    { 
      id: "SKU067", 
      name: "Radiator Coolant - Red", 
      category: "Fluids & Oils", 
      quantity: 9, 
      reorderLevel: 15, 
      supplierName: "Cooltech Solutions", 
      status: "warning" 
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const categories = [...new Set(sampleLowStockData.map(item => item.category))];
  
  const filteredData = sampleLowStockData.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const criticalCount = sampleLowStockData.filter(item => item.status === "critical").length;
  const warningCount = sampleLowStockData.filter(item => item.status === "warning").length;
  const totalItems = sampleLowStockData.length;

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Low Stock Count</h1>
          <Badge variant="outline" className="px-3 py-1 text-base">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {totalItems} Items Below Threshold
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center text-destructive">
                {criticalCount}
                <span className="text-sm text-muted-foreground font-normal ml-2">items</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Warning Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center text-amber-500">
                {warningCount}
                <span className="text-sm text-muted-foreground font-normal ml-2">items</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reorder Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                {totalItems}
                <span className="text-sm text-muted-foreground font-normal ml-2">items</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or SKU..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="md:w-[180px] w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-[180px] w-full">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Current Stock</TableHead>
                <TableHead className="text-center">Reorder Level</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">{item.reorderLevel}</TableCell>
                    <TableCell>{item.supplierName}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getBadgeVariant(item.status)}>
                        {item.status === "critical" ? "Critical" : "Warning"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Package className="h-12 w-12 mb-2" />
                      <h3 className="font-medium text-lg">No low stock items found</h3>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}

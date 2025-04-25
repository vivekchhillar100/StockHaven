import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, Search, ShoppingCart, Sliders } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type InventoryItem = Database['public']['Tables']['inventory']['Row'];

interface SaleRecord {
  id: string;
  customerName: string;
  itemName: string;
  price: number;
  quantity: number;
  total: number;
  date: Date;
}

// Generate sample sales data
const generateSampleSales = (): SaleRecord[] => {
  const customers = [
    "Raj Auto Works", 
    "Sharma Motors", 
    "Kumar Vehicles", 
    "Singh Mechanics", 
    "Patel Car Service",
    "Mehta Auto Parts",
    "Gupta Garage",
    "Joshi Automobiles",
    "Verma Mechanics"
  ];
  
  const items = [
    "Oil Filter", 
    "Brake Pads", 
    "Engine Oil (5L)", 
    "Air Filter", 
    "Battery",
    "Spark Plug",
    "Coolant",
    "Headlight Bulb",
    "Windshield Wiper",
    "Alternator",
    "Radiator",
    "Brake Fluid",
    "Power Steering Fluid",
    "Tire"
  ];
  
  const sampleSales: SaleRecord[] = [];
  
  // Generate 50 sample records
  for (let i = 0; i < 50; i++) {
    const customerName = customers[Math.floor(Math.random() * customers.length)];
    const itemName = items[Math.floor(Math.random() * items.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const price = Math.floor(Math.random() * 10000) + 500; // Between 500 and 10500 INR
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    sampleSales.push({
      id: `INV-${1000 + i}`,
      customerName,
      itemName,
      price,
      quantity,
      total: price * quantity,
      date
    });
  }
  
  // Sort by date (newest first)
  return sampleSales.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export default function SalesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [filteredSales, setFilteredSales] = useState<SaleRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);
  
  useEffect(() => {
    // In a real application, you would fetch this from the database
    setSales(generateSampleSales());
  }, []);
  
  useEffect(() => {
    let filtered = [...sales];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(sale => 
        sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      switch (dateFilter) {
        case "today":
          filtered = filtered.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getDate() === now.getDate() && 
                   saleDate.getMonth() === now.getMonth() && 
                   saleDate.getFullYear() === now.getFullYear();
          });
          break;
        case "week":
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          filtered = filtered.filter(sale => new Date(sale.date) >= oneWeekAgo);
          break;
        case "month":
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(sale => new Date(sale.date) >= oneMonthAgo);
          break;
      }
    }
    
    setFilteredSales(filtered);
  }, [sales, searchTerm, dateFilter]);
  
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalItems = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
  const averageOrderValue = filteredSales.length ? totalRevenue / filteredSales.length : 0;
  
  // Modified formatPrice function for INR currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
          <Button>
            <ShoppingCart className="h-4 w-4 mr-2" />
            New Sale
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                From {filteredSales.length} sales
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">
                {totalItems > 0 ? `Average ${(totalItems / filteredSales.length).toFixed(1)} per sale` : 'No items sold'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
              <Sliders className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground">
                Per invoice
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
            <CardDescription>
              View and manage your sales records
            </CardDescription>
            <div className="flex items-center space-x-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sales..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.slice(0, 10).map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>{sale.itemName}</TableCell>
                    <TableCell>{formatDistanceToNow(sale.date, { addSuffix: true })}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>{formatPrice(sale.price)}</TableCell>
                    <TableCell className="text-right">{formatPrice(sale.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredSales.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No sales found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filter
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

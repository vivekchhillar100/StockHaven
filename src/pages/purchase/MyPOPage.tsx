
import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Filter,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample purchase orders data
const myPurchaseOrders = [
  {
    id: "PO-001",
    supplier: "AutoParts Inc.",
    orderDate: "2023-10-15",
    expectedDelivery: "2023-10-30",
    status: "Delivered",
    totalItems: 5,
    totalAmount: 2499.95,
    items: [
      { id: "1", name: "Brake Pads", quantity: 20, price: 49.99, total: 999.80 },
      { id: "2", name: "Oil Filters", quantity: 50, price: 12.99, total: 649.50 },
      { id: "3", name: "Air Filters", quantity: 30, price: 15.99, total: 479.70 },
      { id: "4", name: "Wiper Blades", quantity: 25, price: 8.99, total: 224.75 },
      { id: "5", name: "Spark Plugs", quantity: 40, price: 3.59, total: 143.60 }
    ],
    paymentDetails: {
      method: "Credit Card",
      status: "Paid",
      date: "2023-10-16"
    },
    notes: "Regular quarterly order"
  },
  {
    id: "PO-002",
    supplier: "Global Suppliers Ltd.",
    orderDate: "2023-11-05",
    expectedDelivery: "2023-11-20",
    status: "In Transit",
    totalItems: 3,
    totalAmount: 3750.00,
    items: [
      { id: "1", name: "Transmission Fluid", quantity: 30, price: 25.00, total: 750.00 },
      { id: "2", name: "Car Batteries", quantity: 10, price: 120.00, total: 1200.00 },
      { id: "3", name: "Engine Oil", quantity: 100, price: 18.00, total: 1800.00 }
    ],
    paymentDetails: {
      method: "Bank Transfer",
      status: "Paid",
      date: "2023-11-06"
    },
    notes: "Special order for winter season"
  },
  {
    id: "PO-003",
    supplier: "Premium Auto Components",
    orderDate: "2023-11-15",
    expectedDelivery: "2023-12-01",
    status: "Pending",
    totalItems: 4,
    totalAmount: 5899.80,
    items: [
      { id: "1", name: "Alternators", quantity: 10, price: 189.99, total: 1899.90 },
      { id: "2", name: "Starters", quantity: 8, price: 210.00, total: 1680.00 },
      { id: "3", name: "Radiators", quantity: 5, price: 250.00, total: 1250.00 },
      { id: "4", name: "AC Compressors", quantity: 3, price: 356.63, total: 1069.90 }
    ],
    paymentDetails: {
      method: "Net 30",
      status: "Unpaid",
      date: "-"
    },
    notes: "High priority order for repair shop"
  },
  {
    id: "PO-004",
    supplier: "Elite Auto Parts",
    orderDate: "2023-10-25",
    expectedDelivery: "2023-11-10",
    status: "Delivered",
    totalItems: 2,
    totalAmount: 4250.00,
    items: [
      { id: "1", name: "Diagnostic Tool", quantity: 1, price: 3500.00, total: 3500.00 },
      { id: "2", name: "Repair Manual Set", quantity: 3, price: 250.00, total: 750.00 }
    ],
    paymentDetails: {
      method: "Credit Card",
      status: "Paid",
      date: "2023-10-25"
    },
    notes: "Equipment upgrade"
  },
  {
    id: "PO-005",
    supplier: "Precision Engineering Co.",
    orderDate: "2023-11-20",
    expectedDelivery: "2023-12-15",
    status: "Processing",
    totalItems: 1,
    totalAmount: 12500.00,
    items: [
      { id: "1", name: "Wheel Alignment System", quantity: 1, price: 12500.00, total: 12500.00 }
    ],
    paymentDetails: {
      method: "50% Upfront",
      status: "Partially Paid",
      date: "2023-11-21"
    },
    notes: "New equipment purchase"
  }
];

// Filter functions
const filterByStatus = (orders: any[], status: string) => {
  if (status === "all") return orders;
  return orders.filter(order => order.status.toLowerCase() === status.toLowerCase());
};

const filterByDate = (orders: any[], range: string) => {
  if (range === "all") return orders;
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const ninetyDaysAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
  
  return orders.filter(order => {
    const orderDate = new Date(order.orderDate);
    if (range === "30days") return orderDate >= thirtyDaysAgo;
    if (range === "90days") return orderDate >= ninetyDaysAgo;
    return true;
  });
};

const filterBySupplier = (orders: any[], supplier: string) => {
  if (supplier === "all") return orders;
  return orders.filter(order => order.supplier === supplier);
};

const filterBySearch = (orders: any[], search: string) => {
  if (!search) return orders;
  const searchLower = search.toLowerCase();
  return orders.filter(order => 
    order.id.toLowerCase().includes(searchLower) ||
    order.supplier.toLowerCase().includes(searchLower)
  );
};

export default function MyPOPage() {
  const [viewPO, setViewPO] = useState<any | null>(null);
  const [orders, setOrders] = useState(myPurchaseOrders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("orderDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Get unique suppliers for filter
  const suppliers = Array.from(new Set(myPurchaseOrders.map(po => po.supplier)));

  // Calculate dashboard metrics
  const totalOrders = myPurchaseOrders.length;
  const pendingOrders = myPurchaseOrders.filter(po => 
    ["pending", "processing", "in transit"].includes(po.status.toLowerCase())
  ).length;
  const completedOrders = myPurchaseOrders.filter(po => 
    po.status.toLowerCase() === "delivered"
  ).length;

  // Handle filters
  const handleFilterChange = () => {
    let filteredOrders = [...myPurchaseOrders];
    
    filteredOrders = filterByStatus(filteredOrders, statusFilter);
    filteredOrders = filterByDate(filteredOrders, dateFilter);
    filteredOrders = filterBySupplier(filteredOrders, supplierFilter);
    filteredOrders = filterBySearch(filteredOrders, searchQuery);
    
    // Sorting
    filteredOrders.sort((a, b) => {
      let valueA, valueB;
      
      if (sortField === "orderDate" || sortField === "expectedDelivery") {
        valueA = new Date(a[sortField]).getTime();
        valueB = new Date(b[sortField]).getTime();
      } else {
        valueA = a[sortField];
        valueB = b[sortField];
      }
      
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setOrders(filteredOrders);
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setStatusFilter("all");
    setDateFilter("all");
    setSupplierFilter("all");
    setSearchQuery("");
    setOrders(myPurchaseOrders);
  };

  // Apply filters when they change
  React.useEffect(() => {
    handleFilterChange();
  }, [statusFilter, dateFilter, supplierFilter, searchQuery, sortField, sortDirection]);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">My Purchase Orders</h1>
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalOrders}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingOrders}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Completed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{completedOrders}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search and Filter</CardTitle>
            <CardDescription>Find purchase orders quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by PO ID or supplier..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="in transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={resetFilters} className="whitespace-nowrap">
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* PO Table */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
            <CardDescription>
              {orders.length} {orders.length === 1 ? "order" : "orders"} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    PO ID
                    {sortField === "id" && (
                      sortDirection === "asc" 
                        ? <ChevronUp className="inline ml-1 h-4 w-4" />
                        : <ChevronDown className="inline ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("supplier")}
                  >
                    Supplier
                    {sortField === "supplier" && (
                      sortDirection === "asc" 
                        ? <ChevronUp className="inline ml-1 h-4 w-4" />
                        : <ChevronDown className="inline ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("orderDate")}
                  >
                    Order Date
                    {sortField === "orderDate" && (
                      sortDirection === "asc" 
                        ? <ChevronUp className="inline ml-1 h-4 w-4" />
                        : <ChevronDown className="inline ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("expectedDelivery")}
                  >
                    Expected Delivery
                    {sortField === "expectedDelivery" && (
                      sortDirection === "asc" 
                        ? <ChevronUp className="inline ml-1 h-4 w-4" />
                        : <ChevronDown className="inline ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    {sortField === "status" && (
                      sortDirection === "asc" 
                        ? <ChevronUp className="inline ml-1 h-4 w-4" />
                        : <ChevronDown className="inline ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("totalAmount")}
                  >
                    Amount
                    {sortField === "totalAmount" && (
                      sortDirection === "asc" 
                        ? <ChevronUp className="inline ml-1 h-4 w-4" />
                        : <ChevronDown className="inline ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No purchase orders found with the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.expectedDelivery}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status.toLowerCase() === "delivered" 
                              ? "default" 
                              : order.status.toLowerCase() === "pending" 
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${order.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewPO(order)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Purchase Order Detail Dialog */}
        <Dialog open={!!viewPO} onOpenChange={(open) => !open && setViewPO(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Purchase Order: {viewPO?.id}</DialogTitle>
              <DialogDescription>
                Created on {viewPO?.orderDate}
              </DialogDescription>
            </DialogHeader>
            
            {viewPO && (
              <div className="space-y-6">
                <Tabs defaultValue="details">
                  <TabsList className="w-full">
                    <TabsTrigger className="flex-1" value="details">Order Details</TabsTrigger>
                    <TabsTrigger className="flex-1" value="items">Items</TabsTrigger>
                    <TabsTrigger className="flex-1" value="payment">Payment</TabsTrigger>
                    <TabsTrigger className="flex-1" value="notes">Notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Supplier</h3>
                        <p className="font-medium">{viewPO.supplier}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                        <Badge variant="outline">{viewPO.status}</Badge>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Order Date</h3>
                        <p>{viewPO.orderDate}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Expected Delivery</h3>
                        <p>{viewPO.expectedDelivery}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Total Items</h3>
                        <p>{viewPO.totalItems}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
                        <p className="font-medium">${viewPO.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="items" className="space-y-4 pt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewPO.items.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">₹{item.total.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">
                            Total Amount
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            ${viewPO.totalAmount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                  
                  <TabsContent value="payment" className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                        <p>{viewPO.paymentDetails.method}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Payment Status</h3>
                        <Badge variant={
                          viewPO.paymentDetails.status === "Paid" 
                            ? "default" 
                            : viewPO.paymentDetails.status === "Unpaid" 
                            ? "outline"
                            : "secondary"
                        }>
                          {viewPO.paymentDetails.status}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Payment Date</h3>
                        <p>{viewPO.paymentDetails.date}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
                        <p className="font-medium">${viewPO.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes" className="space-y-4 pt-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                      <p>{viewPO.notes || "No notes available"}</p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setViewPO(null)}>
                    Close
                  </Button>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download PO
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

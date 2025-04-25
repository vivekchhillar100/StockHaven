
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { FilterBar } from "@/components/reports/FilterBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample purchase report data
const purchaseData = [
  {
    id: "PO-001",
    date: new Date(2025, 3, 5),
    vendor: "Supreme Auto Parts",
    items: 8,
    status: "Completed",
    amount: 12500,
  },
  {
    id: "PO-002",
    date: new Date(2025, 3, 8),
    vendor: "Royal Lubricants",
    items: 5,
    status: "Pending",
    amount: 8700,
  },
  {
    id: "PO-003",
    date: new Date(2025, 3, 12),
    vendor: "FilterMax India",
    items: 12,
    status: "Completed",
    amount: 14200,
  },
  {
    id: "PO-004",
    date: new Date(2025, 3, 15),
    vendor: "Spark Technologies",
    items: 20,
    status: "Completed",
    amount: 22000,
  },
];

const vendorData = [
  {
    id: "V-001",
    name: "Supreme Auto Parts",
    ordersCount: 12,
    totalSpend: 45000,
    avgDeliveryTime: 4,
  },
  {
    id: "V-002",
    name: "Royal Lubricants",
    ordersCount: 8,
    totalSpend: 32000,
    avgDeliveryTime: 3,
  },
  {
    id: "V-003",
    name: "FilterMax India",
    ordersCount: 15,
    totalSpend: 52000,
    avgDeliveryTime: 5,
  },
  {
    id: "V-004",
    name: "Spark Technologies",
    ordersCount: 10,
    totalSpend: 38000,
    avgDeliveryTime: 2,
  },
];

export default function PurchaseReportsPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 3, 1),
    to: new Date(2025, 3, 30),
  });
  
  const [filteredPurchaseData, setFilteredPurchaseData] = useState(purchaseData);
  const [filteredVendorData, setFilteredVendorData] = useState(vendorData);

  // Apply filters whenever search term or date range changes
  useEffect(() => {
    // Filter purchase order data
    const filteredOrders = purchaseData.filter(order => {
      // Filter by search term
      const matchesSearch = !searchTerm || 
        order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by date range
      const matchesDate = !dateRange || !dateRange.from || !dateRange.to ||
        (order.date >= dateRange.from && order.date <= dateRange.to);
      
      return matchesSearch && matchesDate;
    });
    
    // Filter vendor data
    const filteredVendors = vendorData.filter(vendor => {
      return !searchTerm || 
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.id.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    setFilteredPurchaseData(filteredOrders);
    setFilteredVendorData(filteredVendors);
  }, [searchTerm, dateRange]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Purchase Reports</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="orders" className="flex-1">Purchase Orders</TabsTrigger>
            <TabsTrigger value="vendors" className="flex-1">Vendor Analysis</TabsTrigger>
          </TabsList>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <FilterBar
                searchTerm={searchTerm}
                categoryFilter="All"
                dateRange={dateRange}
                categories={[]}
                showDateFilter={true}
                onSearchChange={handleSearch}
                onCategoryChange={() => {}}
                onDateRangeChange={handleDateRangeChange}
                onApplyFilters={() => {}} // Keeping the prop but making it a no-op
              />
            </CardContent>
          </Card>

          <TabsContent value="orders">
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchaseData.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell className="font-medium">{po.id}</TableCell>
                        <TableCell>{po.date.toLocaleDateString()}</TableCell>
                        <TableCell>{po.vendor}</TableCell>
                        <TableCell>{po.items}</TableCell>
                        <TableCell>{po.status}</TableCell>
                        <TableCell className="text-right">₹{po.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    {filteredPurchaseData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          No purchase orders found for the selected filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendors">
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Order Count</TableHead>
                      <TableHead>Avg. Delivery (days)</TableHead>
                      <TableHead className="text-right">Total Spend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendorData.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.id}</TableCell>
                        <TableCell>{vendor.name}</TableCell>
                        <TableCell>{vendor.ordersCount}</TableCell>
                        <TableCell>{vendor.avgDeliveryTime}</TableCell>
                        <TableCell className="text-right">₹{vendor.totalSpend.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    {filteredVendorData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          No vendors found for the selected filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

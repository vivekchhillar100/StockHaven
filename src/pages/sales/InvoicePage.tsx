import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, FileText, Filter, Plus, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Sample data
const sampleInvoices = [
  {
    id: "INV-001",
    date: new Date(2025, 2, 15),
    customer: "JK Auto Parts",
    items: [
      { name: "Brake Pads", quantity: 20, unitPrice: 450, taxes: 10, total: 9900 },
      { name: "Oil Filters", quantity: 30, unitPrice: 250, taxes: 5, total: 7875 }
    ],
    amount: 17775,
    status: "Paid",
    paymentMethod: "Credit Card"
  },
  {
    id: "INV-002",
    date: new Date(2025, 2, 18),
    customer: "Precision Motors",
    items: [
      { name: "Spark Plugs", quantity: 50, unitPrice: 120, taxes: 5, total: 6300 },
      { name: "Air Filters", quantity: 25, unitPrice: 350, taxes: 10, total: 9625 }
    ],
    amount: 15925,
    status: "Pending",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "INV-003",
    date: new Date(2025, 2, 20),
    customer: "Supreme Auto Works",
    items: [
      { name: "Engine Oil", quantity: 40, unitPrice: 550, taxes: 12, total: 24640 },
      { name: "Wiper Blades", quantity: 30, unitPrice: 180, taxes: 5, total: 5670 }
    ],
    amount: 30310,
    status: "Paid",
    paymentMethod: "Cash"
  },
  {
    id: "INV-004",
    date: new Date(2025, 2, 22),
    customer: "Automotive Solutions",
    items: [
      { name: "Transmission Fluid", quantity: 25, unitPrice: 650, taxes: 12, total: 18200 },
      { name: "Headlight Bulbs", quantity: 40, unitPrice: 220, taxes: 5, total: 9240 }
    ],
    amount: 27440,
    status: "Overdue",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "INV-005",
    date: new Date(2025, 2, 25),
    customer: "National Auto Parts",
    items: [
      { name: "Battery", quantity: 15, unitPrice: 3500, taxes: 15, total: 60375 },
      { name: "Alternator", quantity: 10, unitPrice: 4200, taxes: 15, total: 48300 }
    ],
    amount: 108675,
    status: "Pending",
    paymentMethod: "Credit Card"
  }
];

export default function InvoicePage() {
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState(sampleInvoices);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    id: `INV-00${invoices.length + 1}`,
    date: new Date(),
    customer: "",
    items: [{ name: "", quantity: 0, unitPrice: 0, taxes: 0, total: 0 }],
    amount: 0,
    status: "Pending",
    paymentMethod: "Cash"
  });
  
  const { toast } = useToast();

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    
    if (status === "All") {
      setFilteredInvoices(invoices);
    } else {
      setFilteredInvoices(invoices.filter(invoice => invoice.status === status));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
      handleFilterChange(filterStatus);
    } else {
      setFilteredInvoices(
        invoices.filter(
          invoice => 
            invoice.id.toLowerCase().includes(term) || 
            invoice.customer.toLowerCase().includes(term)
        )
      );
    }
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsCreateMode(false);
    setIsDialogOpen(true);
  };

  const handleNewInvoice = () => {
    setIsCreateMode(true);
    setSelectedInvoice(null);
    setNewInvoice({
      id: `INV-00${invoices.length + 1}`,
      date: new Date(),
      customer: "",
      items: [{ name: "", quantity: 0, unitPrice: 0, taxes: 0, total: 0 }],
      amount: 0,
      status: "Pending",
      paymentMethod: "Cash"
    });
    setIsDialogOpen(true);
  };

  const calculateTotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleAddItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { name: "", quantity: 0, unitPrice: 0, taxes: 0, total: 0 }]
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...newInvoice.items];
    updatedItems.splice(index, 1);
    
    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      amount: calculateTotal(updatedItems)
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...newInvoice.items];
    const item = { ...updatedItems[index], [field]: value };
    
    if (field === "quantity" || field === "unitPrice" || field === "taxes") {
      const quantity = field === "quantity" ? value : item.quantity;
      const unitPrice = field === "unitPrice" ? value : item.unitPrice;
      const taxes = field === "taxes" ? value : item.taxes;
      
      const subtotal = quantity * unitPrice;
      const taxAmount = subtotal * (taxes / 100);
      item.total = subtotal + taxAmount;
    }
    
    updatedItems[index] = item;
    
    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      amount: calculateTotal(updatedItems)
    });
  };

  const handleSaveInvoice = () => {
    if (!newInvoice.customer) {
      toast({
        title: "Error",
        description: "Please enter a customer name",
        variant: "destructive"
      });
      return;
    }

    if (newInvoice.items.some(item => !item.name || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast({
        title: "Error",
        description: "Please complete all item details with valid quantities and prices",
        variant: "destructive"
      });
      return;
    }

    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Invoice has been created successfully"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Invoice Management</h1>
          <Button onClick={handleNewInvoice} className="gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>
              Manage and track all your invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>{filterStatus} Status</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer/Vendor</TableHead>
                    <TableHead>Amount (₹)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{format(invoice.date, 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>₹{invoice.amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isCreateMode ? "Create New Invoice" : `Invoice ${selectedInvoice?.id}`}
              </DialogTitle>
              <DialogDescription>
                {isCreateMode ? "Enter the details to create a new invoice" : "View and manage invoice details"}
              </DialogDescription>
            </DialogHeader>

            {isCreateMode ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-id">Invoice ID</Label>
                    <Input
                      id="invoice-id"
                      value={newInvoice.id}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-date">Date</Label>
                    <Input
                      id="invoice-date"
                      type="date"
                      value={format(newInvoice.date, 'yyyy-MM-dd')}
                      onChange={(e) => setNewInvoice({...newInvoice, date: new Date(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer/Vendor Name</Label>
                    <Input
                      id="customer-name"
                      placeholder="Enter customer name"
                      value={newInvoice.customer}
                      onChange={(e) => setNewInvoice({...newInvoice, customer: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select 
                      value={newInvoice.paymentMethod}
                      onValueChange={(value) => setNewInvoice({...newInvoice, paymentMethod: value})}
                    >
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Item Details</h3>
                    <Button variant="outline" size="sm" onClick={handleAddItem}>
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {newInvoice.items.map((item, index) => (
                      <div key={index} className="flex flex-wrap items-end gap-2 p-3 rounded-md border">
                        <div className="w-full md:w-[calc(35%-8px)] space-y-1">
                          <Label htmlFor={`item-name-${index}`}>Item Name</Label>
                          <Input
                            id={`item-name-${index}`}
                            placeholder="Item name"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                          />
                        </div>
                        <div className="w-full md:w-[calc(15%-8px)] space-y-1">
                          <Label htmlFor={`item-qty-${index}`}>Quantity</Label>
                          <Input
                            id={`item-qty-${index}`}
                            type="number"
                            placeholder="Qty"
                            value={item.quantity || ""}
                            onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="w-full md:w-[calc(15%-8px)] space-y-1">
                          <Label htmlFor={`item-price-${index}`}>Unit Price (₹)</Label>
                          <Input
                            id={`item-price-${index}`}
                            type="number"
                            placeholder="Price"
                            value={item.unitPrice || ""}
                            onChange={(e) => handleItemChange(index, "unitPrice", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="w-full md:w-[calc(10%-8px)] space-y-1">
                          <Label htmlFor={`item-tax-${index}`}>Tax (%)</Label>
                          <Input
                            id={`item-tax-${index}`}
                            type="number"
                            placeholder="Tax %"
                            value={item.taxes || ""}
                            onChange={(e) => handleItemChange(index, "taxes", parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="w-full md:w-[calc(15%-8px)] space-y-1">
                          <Label htmlFor={`item-total-${index}`}>Total (₹)</Label>
                          <Input
                            id={`item-total-${index}`}
                            readOnly
                            className="bg-muted"
                            value={item.total.toLocaleString('en-IN')}
                          />
                        </div>
                        {newInvoice.items.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 ml-auto text-destructive"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>₹{newInvoice.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total Amount:</span>
                      <span>₹{newInvoice.amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedInvoice && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Invoice Number</p>
                    <p>{selectedInvoice.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Invoice Date</p>
                    <p>{format(selectedInvoice.date, 'dd/MM/yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Customer/Vendor</p>
                    <p>{selectedInvoice.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <Badge className={getStatusColor(selectedInvoice.status)}>
                      {selectedInvoice.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p>{selectedInvoice.paymentMethod}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price (₹)</TableHead>
                        <TableHead>Tax (%)</TableHead>
                        <TableHead className="text-right">Total (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unitPrice.toLocaleString('en-IN')}</TableCell>
                          <TableCell>{item.taxes}%</TableCell>
                          <TableCell className="text-right">{item.total.toLocaleString('en-IN')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between font-bold">
                      <span>Total Amount:</span>
                      <span>₹{selectedInvoice.amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              {isCreateMode && (
                <Button onClick={handleSaveInvoice}>
                  Create Invoice
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

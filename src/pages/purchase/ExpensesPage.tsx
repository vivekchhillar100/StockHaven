
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, ChevronDown, Filter, Plus, SearchIcon, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Sample expense data
const sampleExpenses = [
  { 
    id: "EXP-001", 
    date: new Date(2025, 3, 1), 
    vendor: "Supreme Auto Parts", 
    category: "Auto Parts", 
    amount: 15000, 
    paymentMethod: "Bank Transfer",
    paymentStatus: "Paid",
    notes: "Monthly inventory restocking",
    receipt: "/placeholder.svg" 
  },
  { 
    id: "EXP-002", 
    date: new Date(2025, 3, 5), 
    vendor: "BuildWell Construction", 
    category: "Maintenance", 
    amount: 8500, 
    paymentMethod: "Check",
    paymentStatus: "Paid",
    notes: "Shop floor repairs",
    receipt: "/placeholder.svg" 
  },
  { 
    id: "EXP-003", 
    date: new Date(2025, 3, 10), 
    vendor: "Power Utilities Ltd", 
    category: "Utilities", 
    amount: 12000, 
    paymentMethod: "Bank Transfer",
    paymentStatus: "Pending",
    notes: "Monthly electricity bill",
    receipt: "/placeholder.svg" 
  },
  { 
    id: "EXP-004", 
    date: new Date(2025, 3, 15), 
    vendor: "Automotive Logistics", 
    category: "Shipping", 
    amount: 9500, 
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    notes: "Parts delivery charges",
    receipt: "/placeholder.svg" 
  },
  { 
    id: "EXP-005", 
    date: new Date(2025, 3, 20), 
    vendor: "GearTech Solutions", 
    category: "Equipment", 
    amount: 75000, 
    paymentMethod: "Bank Transfer",
    paymentStatus: "Pending",
    notes: "New diagnostic equipment",
    receipt: "/placeholder.svg" 
  },
];

// Available categories
const expenseCategories = [
  "Auto Parts",
  "Maintenance",
  "Utilities",
  "Shipping",
  "Equipment",
  "Office Supplies",
  "Marketing",
  "Insurance",
  "Taxes",
  "Miscellaneous"
];

// Payment methods
const paymentMethods = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Check",
  "UPI",
  "Digital Wallet"
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(sampleExpenses);
  const [filteredExpenses, setFilteredExpenses] = useState(sampleExpenses);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [newExpense, setNewExpense] = useState({
    id: `EXP-00${expenses.length + 1}`,
    date: new Date(),
    vendor: "",
    category: "",
    amount: 0,
    paymentMethod: "Cash",
    paymentStatus: "Pending",
    notes: "",
    receipt: ""
  });
  
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, filterCategory, filterStatus);
  };

  const handleCategoryFilter = (category: string) => {
    setFilterCategory(category);
    applyFilters(searchTerm, category, filterStatus);
  };

  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
    applyFilters(searchTerm, filterCategory, status);
  };

  const applyFilters = (search: string, category: string, status: string) => {
    let result = expenses;
    
    if (search) {
      result = result.filter(expense => 
        expense.id.toLowerCase().includes(search) || 
        expense.vendor.toLowerCase().includes(search)
      );
    }
    
    if (category !== "All") {
      result = result.filter(expense => expense.category === category);
    }
    
    if (status !== "All") {
      result = result.filter(expense => expense.paymentStatus === status);
    }
    
    setFilteredExpenses(result);
  };

  const handleOpenNewExpense = () => {
    setSelectedExpense(null);
    setNewExpense({
      id: `EXP-00${expenses.length + 1}`,
      date: new Date(),
      vendor: "",
      category: "",
      amount: 0,
      paymentMethod: "Cash",
      paymentStatus: "Pending",
      notes: "",
      receipt: ""
    });
    setIsDialogOpen(true);
  };

  const handleViewExpense = (expense: any) => {
    setSelectedExpense(expense);
    setIsDialogOpen(true);
  };

  const handleExpenseChange = (field: string, value: any) => {
    setNewExpense({
      ...newExpense,
      [field]: value
    });
  };

  const handleSaveExpense = () => {
    if (!newExpense.vendor || !newExpense.category || newExpense.amount <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    setFilteredExpenses(updatedExpenses);
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Expense has been added successfully"
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you'd upload this file to storage
      // For now, we'll just pretend we have the URL
      handleExpenseChange("receipt", URL.createObjectURL(e.target.files[0]));
    }
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

  // Calculate summary statistics
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = filteredExpenses
    .filter(expense => expense.paymentStatus === "Paid")
    .reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = filteredExpenses
    .filter(expense => expense.paymentStatus === "Pending")
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Expense Management</h1>
          <Button onClick={handleOpenNewExpense} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Expense
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">
                Current month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{paidExpenses.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">
                {((paidExpenses / totalExpenses) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">₹{pendingExpenses.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">
                {((pendingExpenses / totalExpenses) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>
              View and manage all your inventory-related expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <Select value={filterCategory} onValueChange={handleCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>{filterCategory === "All" ? "All Categories" : filterCategory}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {expenseCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>{filterStatus === "All" ? "All Status" : filterStatus}</span>
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
                    <TableHead>Expense ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount (₹)</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.id}</TableCell>
                        <TableCell>{format(expense.date, 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{expense.vendor}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>₹{expense.amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(expense.paymentStatus)}>
                            {expense.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewExpense(expense)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No expenses found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedExpense ? `Expense Details - ${selectedExpense.id}` : "Add New Expense"}
              </DialogTitle>
              <DialogDescription>
                {selectedExpense 
                  ? "View expense details" 
                  : "Enter the details to create a new expense record"}
              </DialogDescription>
            </DialogHeader>

            {selectedExpense ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Expense ID</p>
                    <p>{selectedExpense.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p>{format(selectedExpense.date, 'dd/MM/yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vendor</p>
                    <p>{selectedExpense.vendor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p>{selectedExpense.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Amount</p>
                    <p>₹{selectedExpense.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p>{selectedExpense.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Status</p>
                    <Badge className={getStatusColor(selectedExpense.paymentStatus)}>
                      {selectedExpense.paymentStatus}
                    </Badge>
                  </div>
                </div>
                
                {selectedExpense.notes && (
                  <div>
                    <p className="text-sm font-medium">Notes</p>
                    <p className="text-sm">{selectedExpense.notes}</p>
                  </div>
                )}
                
                {selectedExpense.receipt && (
                  <div>
                    <p className="text-sm font-medium">Receipt</p>
                    <div className="mt-2 border rounded-md overflow-hidden">
                      <img 
                        src={selectedExpense.receipt} 
                        alt="Receipt" 
                        className="max-h-40 object-contain mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-id">Expense ID</Label>
                    <Input
                      id="expense-id"
                      value={newExpense.id}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-date">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="expense-date"
                        type="date"
                        className="pl-8"
                        value={format(newExpense.date, 'yyyy-MM-dd')}
                        onChange={(e) => handleExpenseChange("date", new Date(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor-name">Vendor Name</Label>
                    <Input
                      id="vendor-name"
                      placeholder="Enter vendor name"
                      value={newExpense.vendor}
                      onChange={(e) => handleExpenseChange("vendor", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-category">Category</Label>
                    <Select 
                      value={newExpense.category}
                      onValueChange={(value) => handleExpenseChange("category", value)}
                    >
                      <SelectTrigger id="expense-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Amount (₹)</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      placeholder="0.00"
                      value={newExpense.amount || ""}
                      onChange={(e) => handleExpenseChange("amount", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select 
                      value={newExpense.paymentMethod}
                      onValueChange={(value) => handleExpenseChange("paymentMethod", value)}
                    >
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(method => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-status">Payment Status</Label>
                    <Select 
                      value={newExpense.paymentStatus}
                      onValueChange={(value) => handleExpenseChange("paymentStatus", value)}
                    >
                      <SelectTrigger id="payment-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receipt-upload">Receipt Upload</Label>
                    <div className="relative">
                      <Input
                        id="receipt-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById("receipt-upload")?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Receipt
                      </Button>
                      {newExpense.receipt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Receipt uploaded
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expense-notes">Notes</Label>
                  <Input
                    id="expense-notes"
                    placeholder="Add any additional notes here"
                    value={newExpense.notes}
                    onChange={(e) => handleExpenseChange("notes", e.target.value)}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {selectedExpense ? "Close" : "Cancel"}
              </Button>
              {!selectedExpense && (
                <Button onClick={handleSaveExpense}>
                  Add Expense
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

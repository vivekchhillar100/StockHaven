
import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { X, Plus, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data for vendors
const vendors = [
  { id: "1", name: "AutoParts Inc." },
  { id: "2", name: "Global Suppliers Ltd." },
  { id: "3", name: "Premium Auto Components" },
  { id: "4", name: "Elite Auto Parts" },
  { id: "5", name: "Precision Engineering Co." },
];

// Sample data for items
const inventoryItems = [
  { id: "1", name: "Brake Pads", price: 1299.99 },
  { id: "2", name: "Oil Filters", price: 499.50 },
  { id: "3", name: "Spark Plugs", price: 199.99 },
  { id: "4", name: "Transmission Fluid", price: 799.75 },
  { id: "5", name: "Air Filters", price: 599.99 },
  { id: "6", name: "Battery", price: 4500.00 },
  { id: "7", name: "Headlight Bulbs", price: 799.50 },
];

// Payment terms options
const paymentTermsOptions = [
  "Net 30",
  "Net 60",
  "Net 90",
  "Due on Receipt",
  "50% Upfront",
];

// Form schema for Vendor PO
const vendorPOFormSchema = z.object({
  vendorId: z.string().min(1, {
    message: "Please select a vendor",
  }),
  poNumber: z.string().min(1, {
    message: "PO Number is required",
  }),
  paymentTerms: z.string().min(1, {
    message: "Please select payment terms",
  }),
  deliveryDate: z.string().min(1, {
    message: "Delivery date is required",
  }),
  notes: z.string().optional(),
});

type VendorPOFormValues = z.infer<typeof vendorPOFormSchema>;

// Item form schema
const itemSchema = z.object({
  itemId: z.string().min(1, { message: "Item is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  unitPrice: z.string().min(1, { message: "Price is required" }),
});

type LineItem = {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

// Sample existing POs
const existingPOs = [
  {
    id: "PO-2023-001",
    vendorId: "1",
    vendorName: "AutoParts Inc.",
    poNumber: "PO-2023-001",
    items: [
      {
        id: "1",
        itemId: "1",
        itemName: "Brake Pads",
        quantity: 50,
        unitPrice: 1299.99,
        total: 64999.50
      },
      {
        id: "2",
        itemId: "3",
        itemName: "Spark Plugs",
        quantity: 100,
        unitPrice: 199.99,
        total: 19999.00
      }
    ],
    totalAmount: 84998.50,
    paymentTerms: "Net 30",
    deliveryDate: "2023-06-15",
    notes: "Urgent order for quarterly stock replenishment",
    status: "Delivered"
  },
  {
    id: "PO-2023-002",
    vendorId: "2",
    vendorName: "Global Suppliers Ltd.",
    poNumber: "PO-2023-002",
    items: [
      {
        id: "1",
        itemId: "4",
        itemName: "Transmission Fluid",
        quantity: 30,
        unitPrice: 799.75,
        total: 23992.50
      }
    ],
    totalAmount: 23992.50,
    paymentTerms: "Net 60",
    deliveryDate: "2023-07-01",
    notes: "",
    status: "Pending"
  },
  {
    id: "PO-2023-003",
    vendorId: "3",
    vendorName: "Premium Auto Components",
    poNumber: "PO-2023-003",
    items: [
      {
        id: "1",
        itemId: "6",
        itemName: "Battery",
        quantity: 15,
        unitPrice: 4500.00,
        total: 67500.00
      },
      {
        id: "2",
        itemId: "7",
        itemName: "Headlight Bulbs",
        quantity: 40,
        unitPrice: 799.50,
        total: 31980.00
      }
    ],
    totalAmount: 99480.00,
    paymentTerms: "50% Upfront",
    deliveryDate: "2023-08-15",
    notes: "High priority order for premium vehicles",
    status: "Approved"
  },
  {
    id: "PO-2023-004",
    vendorId: "5",
    vendorName: "Precision Engineering Co.",
    poNumber: "PO-2023-004",
    items: [
      {
        id: "1",
        itemId: "5",
        itemName: "Air Filters",
        quantity: 75,
        unitPrice: 599.99,
        total: 44999.25
      }
    ],
    totalAmount: 44999.25,
    paymentTerms: "Net 30",
    deliveryDate: "2023-09-01",
    notes: "Regular quarterly restocking order",
    status: "Pending"
  }
];

export default function VendorPOPage() {
  const { toast } = useToast();
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [vendorPOs, setVendorPOs] = useState(existingPOs);
  const [viewMode, setViewMode] = useState<"form" | "list">("list");
  const [selectedPO, setSelectedPO] = useState<any>(null);

  // Initialize form with default values
  const form = useForm<VendorPOFormValues>({
    resolver: zodResolver(vendorPOFormSchema),
    defaultValues: {
      vendorId: "",
      poNumber: "",
      paymentTerms: "",
      deliveryDate: "",
      notes: "",
    },
  });

  const addLineItem = () => {
    if (!itemId || !quantity) {
      toast({
        title: "Missing information",
        description: "Please select an item and enter quantity",
        variant: "destructive",
      });
      return;
    }

    const selectedItem = inventoryItems.find((item) => item.id === itemId);
    if (!selectedItem) return;

    const newItem = {
      id: `item-${Date.now()}`,
      itemId,
      itemName: selectedItem.name,
      quantity: parseFloat(quantity),
      unitPrice: selectedItem.price,
      total: selectedItem.price * parseFloat(quantity),
    };

    setLineItems([...lineItems, newItem]);
    setItemId("");
    setQuantity("");
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const onSubmit = (data: VendorPOFormValues) => {
    if (lineItems.length === 0) {
      toast({
        title: "No items added",
        description: "Please add at least one item to the purchase order",
        variant: "destructive",
      });
      return;
    }

    const vendorName = vendors.find((v) => v.id === data.vendorId)?.name || "";
    
    const newPO = {
      id: data.poNumber,
      vendorId: data.vendorId,
      vendorName,
      poNumber: data.poNumber,
      items: lineItems,
      totalAmount: parseFloat(calculateTotal()),
      paymentTerms: data.paymentTerms,
      deliveryDate: data.deliveryDate,
      notes: data.notes || "",
      status: "Pending",
    };

    setVendorPOs([newPO, ...vendorPOs]);
    
    toast({
      title: "Purchase Order Created",
      description: `PO ${data.poNumber} has been created successfully.`,
    });
    
    // Reset form and state
    form.reset();
    setLineItems([]);
    setViewMode("list");
  };

  const viewPO = (po: any) => {
    setSelectedPO(po);
    setViewMode("form");
    
    // Populate form with PO data
    form.reset({
      vendorId: po.vendorId,
      poNumber: po.poNumber,
      paymentTerms: po.paymentTerms,
      deliveryDate: po.deliveryDate,
      notes: po.notes,
    });
    
    setLineItems(po.items);
  };

  const createNewPO = () => {
    setSelectedPO(null);
    form.reset({
      vendorId: "",
      poNumber: `PO-${new Date().getFullYear()}-${(Math.floor(Math.random() * 900) + 100).toString()}`,
      paymentTerms: "",
      deliveryDate: "",
      notes: "",
    });
    setLineItems([]);
    setViewMode("form");
  };

  // Format price in INR currency format
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Vendor Purchase Orders</h1>
          {viewMode === "list" ? (
            <Button onClick={createNewPO}>Create New PO</Button>
          ) : (
            <Button variant="outline" onClick={() => setViewMode("list")}>
              Back to List
            </Button>
          )}
        </div>

        {viewMode === "list" ? (
          <Card>
            <CardHeader>
              <CardTitle>Vendor Purchase Orders</CardTitle>
              <CardDescription>
                Manage and track purchase orders from vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorPOs.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.poNumber}</TableCell>
                      <TableCell>{po.vendorName}</TableCell>
                      <TableCell>{formatPrice(po.totalAmount)}</TableCell>
                      <TableCell>{po.paymentTerms}</TableCell>
                      <TableCell>{po.deliveryDate}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          po.status === "Delivered" 
                            ? "bg-green-100 text-green-800"
                            : po.status === "Approved"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {po.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => viewPO(po)}>
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedPO ? `View PO: ${selectedPO.poNumber}` : "Create New Purchase Order"}
              </CardTitle>
              <CardDescription>
                {selectedPO 
                  ? "View purchase order details" 
                  : "Fill in the details to create a new purchase order"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="vendorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor</FormLabel>
                          <Select
                            disabled={!!selectedPO}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vendor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vendors.map((vendor) => (
                                <SelectItem key={vendor.id} value={vendor.id}>
                                  {vendor.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="poNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PO Number</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!!selectedPO} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Terms</FormLabel>
                          <Select
                            disabled={!!selectedPO}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment terms" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {paymentTermsOptions.map((term) => (
                                <SelectItem key={term} value={term}>
                                  {term}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deliveryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Date</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              disabled={!!selectedPO}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium mb-4">Item List</h3>
                    
                    {!selectedPO && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="col-span-1 md:col-span-2">
                          <Select value={itemId} onValueChange={setItemId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {inventoryItems.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name} ({formatPrice(item.price)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Input
                            type="number"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                          />
                        </div>
                        <div>
                          <Button type="button" onClick={addLineItem}>
                            <Plus className="h-4 w-4 mr-1" /> Add Item
                          </Button>
                        </div>
                      </div>
                    )}

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          {!selectedPO && <TableHead></TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lineItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatPrice(item.unitPrice)}</TableCell>
                            <TableCell className="text-right">{formatPrice(item.total)}</TableCell>
                            {!selectedPO && (
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeLineItem(item.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-bold">
                            Total:
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatPrice(parseFloat(calculateTotal()))}
                          </TableCell>
                          {!selectedPO && <TableCell></TableCell>}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Additional notes about this purchase order"
                            disabled={!!selectedPO}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!selectedPO && (
                    <div className="flex justify-end">
                      <Button type="submit">Create Purchase Order</Button>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

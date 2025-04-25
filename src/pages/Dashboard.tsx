
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, BarChart3, Truck, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type InventoryItem = Database['public']['Tables']['inventory']['Row'];

// Sample low stock data
const sampleLowStockData = [
  { id: "SKU001", name: "Brake Pads - Ceramic", category: "Brake Systems", stock_quantity: 5, image_url: "/placeholder.svg" },
  { id: "SKU008", name: "Engine Oil - Synthetic 5W30", category: "Fluids & Oils", stock_quantity: 3, image_url: "/placeholder.svg" },
  { id: "SKU012", name: "Air Filters - Premium", category: "Filters", stock_quantity: 4, image_url: "/placeholder.svg" },
  { id: "SKU017", name: "Spark Plugs - Iridium", category: "Engine Parts", stock_quantity: 2, image_url: "/placeholder.svg" },
  { id: "SKU024", name: "Headlight Bulbs - LED", category: "Electrical", stock_quantity: 0, image_url: "/placeholder.svg" },
  { id: "SKU032", name: "Transmission Fluid", category: "Fluids & Oils", stock_quantity: 8, image_url: "/placeholder.svg" }
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isEditingInventory, setIsEditingInventory] = useState(false);
  const [editedItem, setEditedItem] = useState<InventoryItem | null>(null);
  const [lowStockItems, setLowStockItems] = useState<any[]>(sampleLowStockData);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data, error } = await supabase
          .from('inventory')
          .select("*");

        if (error) {
          throw error;
        }

        setInventory(data || []);
        
        // If we have real inventory data, filter for low stock items
        if (data && data.length > 0) {
          setLowStockItems(data.filter(item => item.stock_quantity < 10));
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
    
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory'
        },
        (payload) => {
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const categoryData = useCategoryData(inventory);
  const stockLevelData = useStockLevelData(inventory);
  const salesData = [
    { name: 'Engine Parts', value: 4300, color: '#8884d8' },
    { name: 'Brake Systems', value: 3200, color: '#82ca9d' },
    { name: 'Filters', value: 2800, color: '#ffc658' },
    { name: 'Electronics', value: 2100, color: '#ff8042' },
    { name: 'Body Parts', value: 1500, color: '#0088fe' }
  ];

  const handleUpdateStock = async (id: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('inventory')
        .update({ stock_quantity: newQuantity })
        .eq('id', id);

      if (error) throw error;
      
      setIsEditingInventory(false);
      setEditedItem(null);
      
      toast({
        title: "Stock updated",
        description: "Inventory stock has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast({
        title: "Error updating stock",
        description: "There was a problem updating the inventory",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const totalInventoryCount = inventory.reduce((sum, item) => sum + item.stock_quantity, 0);
  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.price * item.stock_quantity), 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        
        <p className="text-muted-foreground">
          Welcome to your automotive management dashboard.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
              <div className="flex items-center">
                <Package className="h-4 w-4 text-muted-foreground mr-2" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5"
                  onClick={() => {
                    setIsEditingInventory(!isEditingInventory);
                    setEditedItem(null);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInventoryCount}</div>
              <p className="text-xs text-muted-foreground">
                Value: ₹{formatNumber(totalInventoryValue)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">
                +15.3% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹4.3L</div>
              <p className="text-xs text-muted-foreground">
                +7.5% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +2 new this month
              </p>
            </CardContent>
          </Card>
        </div>
        
        {isEditingInventory && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Edit Inventory</CardTitle>
              <CardDescription>
                Update stock quantities for inventory items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {inventory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Current stock: {item.stock_quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        className="w-20 p-1 border rounded"
                        defaultValue={item.stock_quantity}
                        min={0}
                        onChange={(e) => {
                          setEditedItem({...item, stock_quantity: parseInt(e.target.value, 10)});
                        }}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (editedItem && editedItem.id === item.id) {
                            handleUpdateStock(item.id, editedItem.stock_quantity);
                          }
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Inventory by Category</CardTitle>
              <CardDescription>
                Distribution of inventory items by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex justify-center items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} items`, 'Quantity']} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Stock Level Status</CardTitle>
              <CardDescription>
                Inventory stock level distribution
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex justify-center items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stockLevelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stockLevelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} items`, 'Count']} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>
                Distribution of sales by product category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex justify-center items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={salesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`₹${formatNumber(Number(value))}`, 'Revenue']} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">New inventory added</p>
                    <p className="text-sm text-muted-foreground">
                      10 new items added to inventory
                    </p>
                  </div>
                  <div className="ml-auto font-medium">Today</div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Order completed</p>
                    <p className="text-sm text-muted-foreground">
                      Order #12345 has been completed
                    </p>
                  </div>
                  <div className="ml-auto font-medium">Yesterday</div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">New customer</p>
                    <p className="text-sm text-muted-foreground">
                      New customer Raj Automotive registered
                    </p>
                  </div>
                  <div className="ml-auto font-medium">2 days ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function useCategoryData(inventory: InventoryItem[]) {
  const [data, setData] = useState<{ name: string; value: number; color: string }[]>([]);
  
  useEffect(() => {
    const categoryMap = new Map<string, number>();
    
    inventory.forEach(item => {
      const category = item.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042'];
    
    const chartData = Array.from(categoryMap.entries()).map(([category, count], index) => ({
      name: category,
      value: count,
      color: colors[index % colors.length]
    }));
    
    setData(chartData);
  }, [inventory]);
  
  return data;
}

function useStockLevelData(inventory: InventoryItem[]) {
  const [data, setData] = useState<{ name: string; value: number; color: string }[]>([]);
  
  useEffect(() => {
    const stockLevels = {
      'Low Stock (0-5)': 0,
      'Medium Stock (6-20)': 0,
      'High Stock (21+)': 0
    };
    
    inventory.forEach(item => {
      if (item.stock_quantity <= 5) {
        stockLevels['Low Stock (0-5)']++;
      } else if (item.stock_quantity <= 20) {
        stockLevels['Medium Stock (6-20)']++;
      } else {
        stockLevels['High Stock (21+)']++;
      }
    });
    
    const colors = ['#ff8042', '#ffc658', '#82ca9d'];
    
    const chartData = Object.entries(stockLevels).map(([level, count], index) => ({
      name: level,
      value: count,
      color: colors[index]
    }));
    
    setData(chartData);
  }, [inventory]);
  
  return data;
}

function formatNumber(num: number) {
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + 'L';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

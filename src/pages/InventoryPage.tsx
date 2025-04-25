import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Package, Search, Plus, X, Tag, Truck, Calendar, BarChart2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type InventoryItem = Database['public']['Tables']['inventory']['Row'];

const autoPartImages = {
  "Air Filter": "/lovable-uploads/aa3c4085-d995-4cb3-9296-2e26bede92f1.png",
  "Alternator": "/lovable-uploads/d4bbcfe5-6953-44bd-a03d-ab94ffd77433.png",
  "Battery": "/lovable-uploads/270a6dd9-5b3c-41e5-9600-af24c005b50b.png",
  "Brake Pads": "/lovable-uploads/2d36268a-78cb-4f2a-9ef5-c0d1aa9b9ad9.png",
  "Engine Oil Filter": "/lovable-uploads/d0a74886-e20c-4ab3-8662-e93da822006d.png",
  "Headlight Assembly": "/lovable-uploads/d46a4028-4580-46aa-8fb9-a98a32a8e1e9.png",
  "Radiator": "/lovable-uploads/0321e865-c69f-4654-aa2c-100e8a52eb53.png",
  "Shock Absorber": "/lovable-uploads/11553fcf-2188-40b8-a8bd-d2835076c091.png",
  "Spark Plugs": "/lovable-uploads/a04ed822-5207-4391-acb5-1deb5be2e2e5.png",
  "Spark Plugs (Set of 4)": "/lovable-uploads/a04ed822-5207-4391-acb5-1deb5be2e2e5.png",
  "Timing Belt": "/lovable-uploads/fd160a06-4369-4dbd-bf3e-9651315b182a.png"
};

const sampleImages = {
  'Engine Parts': [
    '/lovable-uploads/db7037f4-82df-4e87-ab07-fee4a5735c77.png',
    '/lovable-uploads/fec52b68-848b-4f42-bb2f-e338ea292d82.png'
  ],
  'Filters': [
    '/lovable-uploads/5810386b-ce04-4b5b-a0cb-30c5c7a93f47.png',
    '/lovable-uploads/df4ff96e-a603-4c23-954b-f981ab2c5369.png'
  ],
  'Brakes': [
    '/lovable-uploads/e7839ea7-2c25-41ed-b90d-72a835d226e5.png'
  ],
  'Battery': [
    '/lovable-uploads/26dc1c70-bfba-4f8b-96d8-5959778001c3.png'
  ],
  'Alternator': [
    '/lovable-uploads/24710767-fb46-4680-a140-e4ab03834654.png'
  ],
  'Headlights': [
    '/lovable-uploads/a241383c-c452-4410-aec1-0e360c03e483.png'
  ],
  'Radiator': [
    '/lovable-uploads/811edc3a-5b9b-46ec-bd6f-afd297f677b6.png'
  ],
  'Shock Absorber': [
    '/lovable-uploads/7001bbb7-c425-43d3-81ec-87927036ac64.png'
  ],
  'Default': [
    'https://source.unsplash.com/random/300x200/?automotive',
    'https://source.unsplash.com/random/300x200/?car-part',
  ]
};

export default function InventoryPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    category: '',
    stock_quantity: 1,
    description: '',
    image_url: ''
  });

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
          .select("*")
          .order("name");

        if (error) {
          throw error;
        }

        setInventory(data || []);
        setFilteredInventory(data || []);
        
        const uniqueCategories = [...new Set(data?.map(item => item.category) || [])];
        setCategories(uniqueCategories.filter(Boolean) as string[]);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setIsLoading(false);
      }
    };

    fetchInventory();
    
    const channel = supabase
      .channel('schema-db-changes')
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

  useEffect(() => {
    let filtered = inventory;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter && categoryFilter !== "all-categories") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    setFilteredInventory(filtered);
  }, [searchTerm, categoryFilter, inventory]);

  const addNewItem = async () => {
    try {
      if (!newItem.name || newItem.price <= 0) {
        toast({
          title: "Missing required fields",
          description: "Please provide a name and a valid price.",
          variant: "destructive"
        });
        return;
      }

      let imageUrl = newItem.image_url;
      if (!imageUrl) {
        if (autoPartImages[newItem.name as keyof typeof autoPartImages]) {
          imageUrl = autoPartImages[newItem.name as keyof typeof autoPartImages];
        } else {
          const categoryImages = sampleImages[newItem.category as keyof typeof sampleImages] || sampleImages.Default;
          imageUrl = categoryImages[Math.floor(Math.random() * categoryImages.length)];
        }
      }

      const { data, error } = await supabase
        .from('inventory')
        .insert([{
          name: newItem.name,
          price: newItem.price,
          category: newItem.category,
          stock_quantity: newItem.stock_quantity,
          description: newItem.description,
          image_url: imageUrl
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Item added",
        description: `${newItem.name} has been added to the inventory.`
      });

      setIsAddDialogOpen(false);
      setNewItem({
        name: '',
        price: 0,
        category: '',
        stock_quantity: 1,
        description: '',
        image_url: ''
      });
      
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error adding item",
        description: "There was an error adding the item to inventory.",
        variant: "destructive"
      });
    }
  };

  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  if (loading || isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getItemImage = (item: InventoryItem) => {
    if (autoPartImages[item.name as keyof typeof autoPartImages]) {
      return autoPartImages[item.name as keyof typeof autoPartImages];
    }
    
    if (!item.category || !sampleImages[item.category as keyof typeof sampleImages]) {
      return sampleImages.Default[0];
    }
    const categoryImages = sampleImages[item.category as keyof typeof sampleImages];
    return categoryImages[0];
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search inventory..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="md:w-[180px] w-full mt-2 md:mt-0">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredInventory.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-md">
              <div className="h-48 overflow-hidden bg-muted relative">
                <img
                  src={getItemImage(item)}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = sampleImages.Default[0];
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={item.stock_quantity > 10 ? "secondary" : item.stock_quantity > 0 ? "default" : "destructive"}>
                    {item.stock_quantity > 0 ? `Stock: ${item.stock_quantity}` : "Out of Stock"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  <span className="text-xs">{item.category}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2 h-10">
                  {item.description || "No description available."}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-bold text-lg text-primary">{formatPrice(item.price)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewItem(item)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {filteredInventory.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No inventory items found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm || categoryFilter 
                  ? "Try adjusting your search or filter" 
                  : "Add some inventory items to get started"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new automotive part to your inventory
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (₹)
              </Label>
              <Input
                id="price"
                type="number"
                value={newItem.price || ''}
                onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                min={0}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select 
                onValueChange={(value) => setNewItem({...newItem, category: value})}
                value={newItem.category}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(sampleImages).filter(cat => cat !== 'Default').map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={newItem.stock_quantity || 1}
                onChange={(e) => setNewItem({...newItem, stock_quantity: parseInt(e.target.value) || 1})}
                min={1}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                value={newItem.image_url}
                onChange={(e) => setNewItem({...newItem, image_url: e.target.value})}
                placeholder="Leave blank for sample image"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addNewItem}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedItem && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
              <DialogDescription>
                Full details of the inventory item
              </DialogDescription>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-60 overflow-hidden rounded-md bg-muted">
                <img
                  src={getItemImage(selectedItem)}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                  <p className="flex items-center gap-1 mt-1">
                    <Tag className="h-4 w-4" />
                    <span>{selectedItem.category || "Uncategorized"}</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
                  <p className="flex items-center gap-1 mt-1 text-lg font-bold">
                    <BarChart2 className="h-4 w-4" />
                    <span>{formatPrice(selectedItem.price)}</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Stock</h4>
                  <p className="flex items-center gap-1 mt-1">
                    <Package className="h-4 w-4" />
                    <span>{selectedItem.stock_quantity} units available</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                  <p className="flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>Today</span>
                  </p>
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                <p className="text-sm">{selectedItem.description || "No description available."}</p>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              <Button 
                variant="default"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  toast({
                    title: "Edit functionality",
                    description: "Edit functionality will be implemented soon",
                  });
                }}
              >
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Truck, Phone, Mail, Package, Map, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Supplier {
  id: string;
  name: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  categories: string[];
  status: 'active' | 'inactive';
  deliveryStatus: 'on_time' | 'delayed' | 'pending';
  lastDelivery: Date;
}

const generateSampleSuppliers = (): Supplier[] => {
  const supplierNames = [
    "Tata Autocomp Systems Ltd.",
    "Ashok Leyland Limited",
    "Mahindra & Mahindra Limited",
    "Maruti Suzuki India Limited",
    "Bosch Limited",
    "Apollo Tyres Limited",
    "JK Tyres Limited",
    "Amara Raja Energy Limited",
    "Amaron India",
    "MRF Limited",
    "Castrol India Limited",
    "Shell India Market Pvt Limited",
    "TVS Motor Company Limited",
    "Lumax Industries Limited",
    "UNO Minda Limited",
    "Hero MotoCorp Limited",
    "Continental Private Limited",
    "SKF India Limited",
    "Samvardhana Motherson Ltd",
    "Gabriel India Limited",
    "Valeo India Private Limited",
    "Denso India Private Limited",
    "Brakes India Private Limited",
    "Subros Limited"
  ];
  
  const categories = [
    "Engine Parts", 
    "Transmission", 
    "Suspension", 
    "Brakes", 
    "Electrical", 
    "Body Parts",
    "Tires & Wheels",
    "Fluids & Oils",
    "Filters",
    "Lighting",
    "Accessories"
  ];
  
  return supplierNames.map((name, index) => {
    const numCategories = Math.floor(Math.random() * 3) + 2;
    const supplierCategories: string[] = [];
    for (let i = 0; i < numCategories; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      if (!supplierCategories.includes(randomCategory)) {
        supplierCategories.push(randomCategory);
      }
    }
    
    const lastDelivery = new Date();
    lastDelivery.setDate(lastDelivery.getDate() - Math.floor(Math.random() * 30));
    
    return {
      id: `SUP-${1000 + index}`,
      name,
      contact: {
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        email: `info@${name.toLowerCase().replace(/\s+/g, '')}.com`,
        address: `${Math.floor(Math.random() * 100) + 1}, Industrial Area, ${['Mumbai', 'Delhi', 'Bangalore', 'Rajasthan', 'Mumbai', 'Gurgaon', 'Pune'][Math.floor(Math.random() * 7)]}`
      },
      categories: supplierCategories,
      status: Math.random() > 0.2 ? 'active' : 'inactive',
      deliveryStatus: ['on_time', 'delayed', 'pending'][Math.floor(Math.random() * 3)] as 'on_time' | 'delayed' | 'pending',
      lastDelivery
    };
  });
};

export default function SuppliersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);
  
  useEffect(() => {
    setSuppliers(generateSampleSuppliers());
  }, []);
  
  useEffect(() => {
    let filtered = [...suppliers];
    
    if (searchTerm) {
      filtered = filtered.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())) ||
        supplier.contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeTab !== "all") {
      if (activeTab === "active") {
        filtered = filtered.filter(supplier => supplier.status === "active");
      } else if (activeTab === "inactive") {
        filtered = filtered.filter(supplier => supplier.status === "inactive");
      } else if (activeTab === "on_time") {
        filtered = filtered.filter(supplier => supplier.deliveryStatus === "on_time");
      } else if (activeTab === "delayed") {
        filtered = filtered.filter(supplier => supplier.deliveryStatus === "delayed");
      } else if (activeTab === "pending") {
        filtered = filtered.filter(supplier => supplier.deliveryStatus === "pending");
      }
    }
    
    setFilteredSuppliers(filtered);
  }, [suppliers, searchTerm, activeTab]);
  
  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'on_time':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'delayed':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };
  
  const getDeliveryStatusText = (status: string) => {
    switch (status) {
      case 'on_time':
        return 'On Time';
      case 'delayed':
        return 'Delayed';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Manage Suppliers</CardTitle>
            <CardDescription>
              View and manage your automotive parts suppliers
            </CardDescription>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search suppliers..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                  <TabsTrigger value="on_time">On Time</TabsTrigger>
                  <TabsTrigger value="delayed">Delayed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className={`border-l-4 ${
                  supplier.status === 'inactive' 
                    ? 'border-l-gray-300'
                    : supplier.deliveryStatus === 'on_time' 
                      ? 'border-l-green-500' 
                      : supplier.deliveryStatus === 'delayed' 
                        ? 'border-l-amber-500' 
                        : 'border-l-blue-500'
                }`}>
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10">
                        {getInitials(supplier.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{supplier.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getDeliveryStatusIcon(supplier.deliveryStatus)}
                        <span className="text-xs text-muted-foreground">
                          {getDeliveryStatusText(supplier.deliveryStatus)}
                        </span>
                        <Badge variant={supplier.status === 'active' ? 'default' : 'outline'}>
                          {supplier.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{supplier.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{supplier.contact.email}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Map className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>{supplier.contact.address}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex flex-wrap gap-1">
                          {supplier.categories.map((category, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Last delivery: {supplier.lastDelivery.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredSuppliers.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                  <Truck className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No suppliers found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search or filter
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

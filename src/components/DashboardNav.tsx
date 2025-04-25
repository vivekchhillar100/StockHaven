
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Truck, 
  FileText,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Boxes
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardNav() {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const isDropdownActive = (paths: string[]) => {
    return paths.some(path => location.pathname.startsWith(path));
  };
  
  // Define menu items with dropdown support
  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: Home
    },
    {
      title: "Purchase",
      path: "/dashboard/purchase",
      icon: ShoppingCart,
      hasDropdown: true,
      dropdownItems: [
        { title: "Vendor PO", path: "/dashboard/purchase/vendor-po" },
        { title: "My PO", path: "/dashboard/purchase/my-po" },
        { title: "Expenses", path: "/dashboard/purchase/expenses" }
      ]
    },
    {
      title: "Inventory",
      path: "/dashboard/inventory",
      icon: Package
    },
    {
      title: "Sales",
      path: "/dashboard/sales",
      icon: BarChart3,
      hasDropdown: true,
      dropdownItems: [
        { title: "Invoice", path: "/dashboard/sales/invoice" }
      ]
    },
    {
      title: "Suppliers",
      path: "/dashboard/suppliers",
      icon: Truck
    },
    {
      title: "Reports",
      path: "/dashboard/reports",
      icon: FileText,
      hasDropdown: true,
      dropdownItems: [
        { title: "Inventory Reports", path: "/dashboard/reports/inventory" },
        { title: "Purchase Reports", path: "/dashboard/reports/purchase" },
        { title: "Low Stock Count", path: "/dashboard/reports/low-stock" }
      ]
    }
  ];
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              {item.hasDropdown ? (
                <div className="w-full">
                  <SidebarMenuButton
                    isActive={isDropdownActive([item.path, ...(item.dropdownItems?.map(i => i.path) || [])])}
                    onClick={() => toggleDropdown(item.title)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                    {openDropdowns[item.title] ? (
                      <ChevronDown className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                  
                  {openDropdowns[item.title] && (
                    <div className="pl-8 mt-1">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link 
                          key={dropdownItem.path} 
                          to={dropdownItem.path}
                          className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground w-full mb-1 ${
                            isActive(dropdownItem.path) ? "bg-accent text-accent-foreground" : "text-sidebar-foreground"
                          }`}
                        >
                          {dropdownItem.title === "Low Stock Count" ? (
                            <>
                              <Boxes className="mr-2 h-4 w-4" />
                              {dropdownItem.title}
                            </>
                          ) : (
                            dropdownItem.title
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.path)}
                  tooltip={item.title}
                >
                  <Link to={item.path}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

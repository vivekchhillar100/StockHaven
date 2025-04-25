
import { useState } from "react";
import { DateRange } from "react-day-picker";

// Mock data types
export interface LowStockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  price: number;
  supplier: string;
}

export interface ValuationItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  totalValue: number;
}

export interface MovementItem {
  id: string;
  itemId: string;
  name: string;
  date: Date;
  type: string;
  quantity: number;
  reference: string;
  notes: string;
}

export interface ExpiryItem {
  id: string;
  name: string;
  category: string;
  expiryDate: Date;
  daysRemaining: number;
  quantity: number;
  status: string;
}

// Mock data
const lowStockData: LowStockItem[] = [
  { id: "SKU001", name: "Brake Pads - Ceramic", category: "Brake Systems", quantity: 5, reorderLevel: 10, price: 450, supplier: "Supreme Auto Parts" },
  { id: "SKU012", name: "Engine Oil - Synthetic 5W30", category: "Fluids & Oils", quantity: 3, reorderLevel: 15, price: 550, supplier: "Royal Lubricants" },
  { id: "SKU024", name: "Air Filters - High Performance", category: "Filters", quantity: 4, reorderLevel: 12, price: 350, supplier: "FilterMax India" },
  { id: "SKU038", name: "Spark Plugs - Iridium", category: "Engine Parts", quantity: 8, reorderLevel: 20, price: 120, supplier: "Spark Technologies" },
  { id: "SKU045", name: "Headlight Bulbs - LED", category: "Electrical", quantity: 6, reorderLevel: 8, price: 220, supplier: "Light Solutions" }
];

const valuationData: ValuationItem[] = [
  { id: "SKU001", name: "Brake Pads - Ceramic", category: "Brake Systems", quantity: 5, price: 450, totalValue: 2250 },
  { id: "SKU002", name: "Brake Discs - Slotted", category: "Brake Systems", quantity: 12, price: 1200, totalValue: 14400 },
  { id: "SKU003", name: "Brake Fluid DOT4", category: "Fluids & Oils", quantity: 25, price: 320, totalValue: 8000 },
  { id: "SKU004", name: "Oil Filter - Standard", category: "Filters", quantity: 30, price: 250, totalValue: 7500 },
  { id: "SKU005", name: "Oil Filter - Premium", category: "Filters", quantity: 15, price: 350, totalValue: 5250 },
  { id: "SKU006", name: "Air Filter - Standard", category: "Filters", quantity: 28, price: 280, totalValue: 7840 },
  { id: "SKU007", name: "Engine Oil - Mineral 15W40", category: "Fluids & Oils", quantity: 22, price: 420, totalValue: 9240 },
  { id: "SKU008", name: "Engine Oil - Synthetic 5W30", category: "Fluids & Oils", quantity: 3, price: 550, totalValue: 1650 },
  { id: "SKU009", name: "Spark Plugs - Copper", category: "Engine Parts", quantity: 40, price: 80, totalValue: 3200 },
  { id: "SKU010", name: "Spark Plugs - Iridium", category: "Engine Parts", quantity: 8, price: 120, totalValue: 960 }
];

const movementData: MovementItem[] = [
  { id: "MOV001", itemId: "SKU001", name: "Brake Pads - Ceramic", date: new Date(2025, 3, 1), type: "Inward", quantity: 20, reference: "PO-458", notes: "Regular stock replenishment" },
  { id: "MOV002", itemId: "SKU001", name: "Brake Pads - Ceramic", date: new Date(2025, 3, 3), type: "Outward", quantity: 15, reference: "INV-112", notes: "Customer order" },
  { id: "MOV003", itemId: "SKU008", name: "Engine Oil - Synthetic 5W30", date: new Date(2025, 3, 2), type: "Inward", quantity: 30, reference: "PO-459", notes: "New stock arrival" },
  { id: "MOV004", itemId: "SKU008", name: "Engine Oil - Synthetic 5W30", date: new Date(2025, 3, 4), type: "Outward", quantity: 27, reference: "INV-113", notes: "Bulk order - Garage Solutions" },
  { id: "MOV005", itemId: "SKU010", name: "Spark Plugs - Iridium", date: new Date(2025, 3, 5), type: "Inward", quantity: 50, reference: "PO-460", notes: "Seasonal stock up" },
  { id: "MOV006", itemId: "SKU010", name: "Spark Plugs - Iridium", date: new Date(2025, 3, 7), type: "Outward", quantity: 42, reference: "INV-115", notes: "Multiple customer orders" },
  { id: "MOV007", itemId: "SKU004", name: "Oil Filter - Standard", date: new Date(2025, 3, 8), type: "Inward", quantity: 40, reference: "PO-462", notes: "Regular restocking" },
  { id: "MOV008", itemId: "SKU004", name: "Oil Filter - Standard", date: new Date(2025, 3, 10), type: "Outward", quantity: 10, reference: "INV-118", notes: "Customer order" }
];

const expiryData: ExpiryItem[] = [
  { id: "SKU032", name: "Transmission Fluid ATF", category: "Fluids & Oils", expiryDate: new Date(2025, 5, 15), daysRemaining: 45, quantity: 18, status: "Warning" },
  { id: "SKU041", name: "Brake Fluid DOT5", category: "Fluids & Oils", expiryDate: new Date(2025, 5, 30), daysRemaining: 60, quantity: 12, status: "Warning" },
  { id: "SKU052", name: "Battery Electrolyte", category: "Chemicals", expiryDate: new Date(2025, 4, 20), daysRemaining: 20, quantity: 8, status: "Critical" },
  { id: "SKU017", name: "Radiator Coolant - Green", category: "Fluids & Oils", expiryDate: new Date(2025, 6, 10), daysRemaining: 70, quantity: 22, status: "Good" },
  { id: "SKU069", name: "Carb Cleaner Spray", category: "Chemicals", expiryDate: new Date(2025, 4, 15), daysRemaining: 15, quantity: 5, status: "Critical" },
  { id: "SKU073", name: "Rubber Conditioner", category: "Chemicals", expiryDate: new Date(2025, 5, 5), daysRemaining: 35, quantity: 10, status: "Warning" }
];

export function useReportData() {
  // Initial states for each report type
  const [filteredLowStock, setFilteredLowStock] = useState(lowStockData);
  const [filteredValuation, setFilteredValuation] = useState(valuationData);
  const [filteredMovement, setFilteredMovement] = useState(movementData);
  const [filteredExpiry, setFilteredExpiry] = useState(expiryData);

  // Extract all unique categories from our data sets
  const allCategories = Array.from(
    new Set([
      ...lowStockData.map(item => item.category),
      ...valuationData.map(item => item.category),
      ...expiryData.map(item => item.category)
    ])
  );

  // Filter functions for each report type
  const filterLowStockData = (term: string, category: string) => {
    let filtered = lowStockData;
    
    if (term) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.id.toLowerCase().includes(term)
      );
    }
    
    if (category !== "All") {
      filtered = filtered.filter(item => item.category === category);
    }
    
    setFilteredLowStock(filtered);
  };

  const filterValuationData = (term: string, category: string) => {
    let filtered = valuationData;
    
    if (term) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.id.toLowerCase().includes(term)
      );
    }
    
    if (category !== "All") {
      filtered = filtered.filter(item => item.category === category);
    }
    
    setFilteredValuation(filtered);
  };

  const filterMovementData = (term: string, dateRange?: DateRange) => {
    let filtered = movementData;
    
    if (term) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.itemId.toLowerCase().includes(term)
      );
    }
    
    if (dateRange && dateRange.from && dateRange.to) {
      filtered = filtered.filter(item => 
        item.date >= dateRange.from && item.date <= dateRange.to
      );
    }
    
    setFilteredMovement(filtered);
  };

  const filterExpiryData = (term: string, category: string) => {
    let filtered = expiryData;
    
    if (term) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.id.toLowerCase().includes(term)
      );
    }
    
    if (category !== "All") {
      filtered = filtered.filter(item => item.category === category);
    }
    
    setFilteredExpiry(filtered);
  };

  // Combined filter function that affects all reports
  const applyFilters = (term: string, category: string, dateRange?: DateRange) => {
    filterLowStockData(term, category);
    filterValuationData(term, category);
    filterMovementData(term, dateRange);
    filterExpiryData(term, category);
  };

  return {
    lowStockData: filteredLowStock,
    valuationData: filteredValuation,
    movementData: filteredMovement,
    expiryData: filteredExpiry,
    allCategories,
    applyFilters,
    filterLowStockData,
    filterValuationData,
    filterMovementData,
    filterExpiryData
  };
}

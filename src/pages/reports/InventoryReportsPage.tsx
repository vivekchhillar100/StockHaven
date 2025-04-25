
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";

// Import custom hooks
import { useReportData } from "@/hooks/useReportData";

// Import components
import { FilterBar } from "@/components/reports/FilterBar";
import { LowStockReport } from "@/components/reports/LowStockReport";
import { ValuationReport } from "@/components/reports/ValuationReport";
import { MovementReport } from "@/components/reports/MovementReport";
import { ExpiryReport } from "@/components/reports/ExpiryReport";

export default function InventoryReportsPage() {
  const [activeTab, setActiveTab] = useState("low-stock");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ 
    from: new Date(2025, 3, 1), 
    to: new Date(2025, 3, 30) 
  });
  
  const {
    lowStockData,
    valuationData,
    movementData,
    expiryData,
    allCategories,
    applyFilters
  } = useReportData();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, categoryFilter, dateRange);
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    applyFilters(searchTerm, category, dateRange);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    applyFilters(searchTerm, categoryFilter, range);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Inventory Reports</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="low-stock" className="flex-1">Low Stock/Reorder</TabsTrigger>
            <TabsTrigger value="valuation" className="flex-1">Stock Valuation</TabsTrigger>
            <TabsTrigger value="movement" className="flex-1">Stock Movement</TabsTrigger>
            <TabsTrigger value="expiry" className="flex-1">Item Expiry</TabsTrigger>
          </TabsList>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <FilterBar
                searchTerm={searchTerm}
                categoryFilter={categoryFilter}
                dateRange={dateRange}
                categories={allCategories}
                showDateFilter={activeTab === "movement"}
                onSearchChange={handleSearch}
                onCategoryChange={handleCategoryFilter}
                onDateRangeChange={handleDateRangeChange}
                onApplyFilters={() => {}} // Keeping the prop but making it a no-op
              />
            </CardContent>
          </Card>

          <TabsContent value="low-stock">
            <LowStockReport data={lowStockData} />
          </TabsContent>

          <TabsContent value="valuation">
            <ValuationReport data={valuationData} />
          </TabsContent>

          <TabsContent value="movement">
            <MovementReport data={movementData} />
          </TabsContent>

          <TabsContent value="expiry">
            <ExpiryReport data={expiryData} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

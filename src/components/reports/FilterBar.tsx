
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Filter, Search } from "lucide-react";
import { DateRange } from "react-day-picker";

interface FilterBarProps {
  searchTerm: string;
  categoryFilter: string;
  dateRange?: DateRange;
  categories: string[];
  showDateFilter?: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (category: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onApplyFilters: () => void; // Keeping for backward compatibility but not using it
}

export function FilterBar({
  searchTerm,
  categoryFilter,
  dateRange,
  categories,
  showDateFilter = false,
  onSearchChange,
  onCategoryChange,
  onDateRangeChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items..."
          className="pl-8"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      
      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{categoryFilter} Categories</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {showDateFilter && (
          <DatePickerWithRange
            value={dateRange}
            onChange={onDateRangeChange}
          />
        )}
      </div>
    </div>
  );
}

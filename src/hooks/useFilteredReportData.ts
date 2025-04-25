
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";

type FilterFunction<T> = (items: T[], term: string, category: string, dateRange?: DateRange) => T[];

export function useFilteredReportData<T>(
  initialData: T[],
  filterFunction: FilterFunction<T>
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 3, 1),
    to: new Date(2025, 3, 30),
  });
  const [filteredData, setFilteredData] = useState<T[]>(initialData);

  // Automatically apply filters when any filter value changes
  useEffect(() => {
    setFilteredData(filterFunction(initialData, searchTerm, categoryFilter, dateRange));
  }, [initialData, searchTerm, categoryFilter, dateRange, filterFunction]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  return {
    searchTerm,
    categoryFilter,
    dateRange,
    filteredData,
    handleSearch,
    handleCategoryFilter,
    handleDateRangeChange,
  };
}

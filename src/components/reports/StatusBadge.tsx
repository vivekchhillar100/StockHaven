
import React from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'movement' | 'priority' | 'performance';
}

export function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "Warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Good":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Normal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getMovementTypeColor = (type: string) => {
    return type === "Inward"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Average":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "Poor":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  let className;
  if (type === 'movement') {
    className = getMovementTypeColor(status);
  } else if (type === 'priority') {
    className = getPriorityColor(status);
  } else if (type === 'performance') {
    className = getPerformanceColor(status);
  } else {
    className = getStatusColor(status);
  }

  return (
    <Badge className={className}>
      {status}
    </Badge>
  );
}

import { format } from "date-fns";

export const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
  const date = new Date(dateString).toLocaleDateString();
   return format(date, "MMM dd, yyyy");
  };
  
  export const formatValue = (value?: string) => {
    return value || "Not specified";
  };
  
  export const formatOption = (value?: string) => {
    if (!value) return "Not specified";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
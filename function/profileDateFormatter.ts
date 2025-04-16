export const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };
  
  export const formatValue = (value?: string) => {
    return value || "Not specified";
  };
  
  export const formatOption = (value?: string) => {
    if (!value) return "Not specified";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };
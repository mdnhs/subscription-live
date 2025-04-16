import { useState } from "react";
import { FieldConfig } from "@/_types/usersTypes";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const DynamicFormField = <T extends FieldValues>({
  form,
  field,
}: {
  form: UseFormReturn<T>;
  field: FieldConfig<T>;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (field.options) {
    // Select field
    return (
      <FormField
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem className={field.colSpan === 2 ? "md:col-span-2" : ""}>
            <FormLabel>{field.label}</FormLabel>
            <Select
              onValueChange={formField.onChange}
              defaultValue={formField.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={field.colSpan === 2 ? "md:col-span-2" : ""}>
          <FormLabel>{field.label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={
                  field.type === "password" && showPassword
                    ? "text"
                    : field.type || "text"
                }
                placeholder={field.placeholder}
                {...formField}
              />
              {field.type === "password" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DynamicFormField;
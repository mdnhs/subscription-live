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
import { Eye, EyeOff, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, setMonth, setYear } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DateField = <T extends FieldValues>({
  formField,
  field,
  calendarOpen,
  setCalendarOpen,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formField: any;
  field: FieldConfig<T>;
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
}) => {
  const initialDate = formField.value ? new Date(formField.value) : new Date();
  const [calendarDate, setCalendarDate] = useState(initialDate);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2023, i, 1), "MMMM"),
  }));
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - 50 + i;
    return { value: year, label: year.toString() };
  });

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      formField.onChange(date.toISOString());
      setCalendarDate(date);
      setCalendarOpen(false);
    }
  };

  const handleMonthYearChange = (newDate: Date) => {
    setCalendarDate(newDate);
    formField.onChange(newDate.toISOString());
  };

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              "w-full pl-3 text-left font-normal",
              !formField.value && "text-gray-400"
            )}
          >
            {formField.value ? (
              format(new Date(formField.value), "PPP")
            ) : (
              <span>{field.placeholder || "Select a date"}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-2 flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Select
              value={calendarDate.getMonth().toString()}
              onValueChange={(value) => {
                const newDate = setMonth(calendarDate, parseInt(value));
                handleMonthYearChange(newDate);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={calendarDate.getFullYear().toString()}
              onValueChange={(value) => {
                const newDate = setYear(calendarDate, parseInt(value));
                handleMonthYearChange(newDate);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value.toString()}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            selected={formField.value ? new Date(formField.value) : undefined}
            onSelect={handleDateChange}
            initialFocus
            month={calendarDate}
            onMonthChange={setCalendarDate}
            classNames={{
              caption: "hidden",
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

const DynamicFormField = <T extends FieldValues>({
  form,
  field,
}: {
  form: UseFormReturn<T>;
  field: FieldConfig<T>;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Handle Select field
  if (field.options) {
    // Find if there's an "other" option
    const hasOtherOption = field.options.some(opt => opt.value === "other");
    const defaultValue = hasOtherOption ? "other" : field.options[0]?.value;

    return (
      <FormField
        control={form.control}
        name={field.name}
        defaultValue={defaultValue as T[keyof T]}
        render={({ field: formField }) => (
          <FormItem className={field.colSpan === 2 ? "md:col-span-2" : ""}>
            <FormLabel>{field.label}</FormLabel>
            <Select
              onValueChange={formField.onChange}
              value={formField.value}
              defaultValue={defaultValue}
            >
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(field.options ?? []).map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="hover:bg-gray-100"
                  >
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

  // Handle Date field
  if (field.type === "date") {
    return (
      <FormField
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem className={field.colSpan === 2 ? "md:col-span-2" : ""}>
            <FormLabel>{field.label}</FormLabel>
            <DateField
              formField={formField}
              field={field}
              calendarOpen={calendarOpen}
              setCalendarOpen={setCalendarOpen}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Handle other input types
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
                readOnly={field.name === "username"}
                className={cn(
                  "bg-white",
                  field.name === "username" ? "opacity-70" : ""
                )}
              />
              {field.type === "password" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
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
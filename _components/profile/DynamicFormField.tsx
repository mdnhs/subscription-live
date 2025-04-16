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
  // Initialize calendarDate with form value or current date
  const initialDate = formField.value ? new Date(formField.value) : new Date();
  const [calendarDate, setCalendarDate] = useState(initialDate);

  // Generate arrays for months and years
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
      setCalendarOpen(false); // Close the calendar only when day is selected
    }
  };

  const handleMonthYearChange = (newDate: Date) => {
    setCalendarDate(newDate);
    formField.onChange(newDate.toISOString()); // Still update form value immediately
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
          {/* Month and Year Selectors */}
          <div className="flex space-x-2">
            <Select
              value={calendarDate.getMonth().toString()}
              onValueChange={(value) => {
                const newDate = setMonth(calendarDate, parseInt(value));
                handleMonthYearChange(newDate);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select month" />
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
                <SelectValue placeholder="Select year" />
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
          {/* Calendar */}
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

  // Handle other input types (text, password, etc.)
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
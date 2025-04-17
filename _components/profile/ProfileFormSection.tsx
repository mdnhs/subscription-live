import { FieldConfig } from "@/_types/usersTypes";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import React, { ReactNode } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import DynamicFormField from "./DynamicFormField";

const ProfileFormSection = <T extends FieldValues>({
  title,
  form,
  onSubmit,
  fields,
  submitLabel,
  loading,
  footer,
}: {
  title: string;
  defaultOpen?: boolean;
  form: UseFormReturn<T>;
  onSubmit?: (data: T) => Promise<void>;
  fields: FieldConfig<T>[];
  submitLabel: string | ReactNode;
  loading?: boolean;
  footer?: ReactNode;
}) => {
  return (
    <AccordionItem
      value={title.toLowerCase().replace(/\s+/g, "-")}
      className="border-b"
    >
      <AccordionTrigger className="py-4 font-semibold text-lg text-primary">
        {title}
      </AccordionTrigger>
      <AccordionContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit || (() => Promise.resolve()))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => (
                <DynamicFormField
                  key={field.name.toString()}
                  form={form}
                  field={field}
                />
              ))}

              
            </div>
            <div className="flex justify-between items-center pt-2">
              {footer}
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ProfileFormSection;

import React from "react";
import { Form } from "@/components/ui/form.js";
import {
  useForm,
  type FieldValues,
  type UseFormProps,
  type SubmitHandler,
} from "react-hook-form";

type FormWrapperProps<T extends FieldValues> = {
  defaultValues?: UseFormProps<T>["defaultValues"];
  onSubmit: SubmitHandler<T>;
  children: (props: {
    control: ReturnType<typeof useForm<T>>["control"];
    handleSubmit: ReturnType<typeof useForm<T>>["handleSubmit"];
    getValues: ReturnType<typeof useForm<T>>["getValues"];
    setValue: ReturnType<typeof useForm<T>>["setValue"];
    watch: ReturnType<typeof useForm<T>>["watch"];
    reset: ReturnType<typeof useForm<T>>["reset"];
  }) => React.ReactNode;
};

export function FormWrapper<T extends FieldValues>({
  defaultValues,
  onSubmit,
  children,
}: FormWrapperProps<T>) {
  const form = useForm<T>({ defaultValues });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children({
          control: form.control,
          handleSubmit: form.handleSubmit,
          getValues: form.getValues,
          setValue: form.setValue,
          watch: form.watch,
          reset: form.reset,
        })}
      </form>
    </Form>
  );
}

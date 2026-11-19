import React from "react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form.js";
import { Input } from "@/components/ui/input.js";
import { Controller } from "react-hook-form";
import clsx from "clsx";

export interface FormInputProps {
  name?: string;
  label: string;
  type?: string;
  control?: any;
  rules?: any;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  showToggle?: boolean;
  showValue?: boolean;
  onToggle?: () => void;
}

export const FormInput = ({
  name,
  label,
  type = "text",
  control,
  rules,
  placeholder,
  leftIcon,
  icon,
  disabled = false,
  value,
  onChange,
  showToggle,
  showValue,
  onToggle,
}: FormInputProps) => {
  const inputId = `form-${name || label.replace(/\s/g, "-")}`;

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel htmlFor={inputId} className="text-sm font-medium">
              {label}
            </FormLabel>

            <div className="relative">
              {leftIcon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none">
                  {leftIcon}
                </div>
              )}

              <FormControl>
                <Input
                  id={inputId}
                  {...field}
                  type={showToggle ? (showValue ? "text" : "password") : type}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={clsx(
                    "input input-bordered w-full transition",
                    leftIcon && "pl-10",
                    icon && "pr-10",
                    fieldState.error && "input-error",
                    disabled && "bg-base-200 cursor-not-allowed"
                  )}
                  onChange={(e) => {
                    field.onChange(e);
                    onChange?.(e.target.value);
                  }}
                />
              </FormControl>

              {icon && (
                <button
                  type="button"
                  onClick={onToggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50"
                >
                  {icon}
                </button>
              )}
            </div>

            <FormMessage>
              {fieldState.error && (
                <span className="text-sm text-error">
                  {fieldState.error.message}
                </span>
              )}
            </FormMessage>
          </FormItem>
        )}
      />
    );
  }

  return (
    <div className="form-control">
      <label htmlFor={inputId} className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className={clsx(
            "input input-bordered w-full",
            leftIcon && "pl-10",
            icon && "pr-10",
            disabled && "bg-base-200 cursor-not-allowed"
          )}
        />
        {icon && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50"
          >
            {icon}
          </button>
        )}
      </div>
    </div>
  );
};

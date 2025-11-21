"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type FieldBaseProps = {
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  inputId?: string;
};

type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> &
  FieldBaseProps & {
    registration: UseFormRegisterReturn;
  };

type TextareaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> &
  FieldBaseProps & {
    registration: UseFormRegisterReturn;
  };

type SelectFieldProps = FieldBaseProps & {
  registration: UseFormRegisterReturn;
  options: { value: string; label: string }[];
  placeholder?: string;
};

type RadioGroupFieldProps = FieldBaseProps & {
  registration: UseFormRegisterReturn;
  options: { value: string; label: string }[];
};

type FileFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type"> &
  FieldBaseProps & {
    registration: UseFormRegisterReturn;
  };

const inputClasses =
  "mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

function FieldShell({ label, required, helperText, error, inputId, children }: FieldBaseProps & { children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-800 flex items-center gap-1">
        {label}
        {required && <span className="text-red-600 font-semibold">*</span>}
      </label>
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function InputField({ label, required, helperText, error, registration, inputId, ...rest }: InputFieldProps) {
  const id = inputId || rest.id || registration.name;
  return (
    <FieldShell label={label} required={required} helperText={helperText} error={error} inputId={id}>
      <input
        id={id}
        {...rest}
        {...registration}
        className={inputClasses}
      />
    </FieldShell>
  );
}

export function TextareaField({ label, required, helperText, error, registration, rows = 4, inputId, ...rest }: TextareaFieldProps) {
  const id = inputId || rest.id || registration.name;
  return (
    <FieldShell label={label} required={required} helperText={helperText} error={error} inputId={id}>
      <textarea
        id={id}
        {...rest}
        {...registration}
        rows={rows}
        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
      />
    </FieldShell>
  );
}

export function SelectField({ label, required, helperText, error, registration, options, placeholder, inputId }: SelectFieldProps) {
  const id = inputId || registration.name;
  return (
    <FieldShell label={label} required={required} helperText={helperText} error={error} inputId={id}>
      <select
        id={id}
        {...registration}
        className={inputClasses}
        defaultValue=""
      >
        <option value="" disabled>
          {placeholder || "Pilih opsi"}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function RadioGroupField({ label, required, helperText, error, registration, options }: RadioGroupFieldProps) {
  return (
    <FieldShell label={label} required={required} helperText={helperText} error={error}>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt, idx) => {
          const id = `${registration.name}-${idx}`;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition hover:border-brand/60"
            >
              <input
                id={id}
                type="radio"
                value={opt.value}
                {...registration}
                className="h-4 w-4 text-brand focus:ring-brand/40"
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </FieldShell>
  );
}

export function FileField({ label, required, helperText, error, registration, inputId, ...rest }: FileFieldProps) {
  const id = inputId || rest.id || registration.name;
  return (
    <FieldShell label={label} required={required} helperText={helperText} error={error} inputId={id}>
      <input
        id={id}
        type="file"
        {...rest}
        {...registration}
        className="mt-1 w-full rounded-xl border border-dashed border-orange-200 bg-orange-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition file:mr-3 file:rounded-lg file:border-none file:bg-brand file:px-4 file:py-2 file:text-white hover:border-brand/70 focus:border-brand focus:ring-2 focus:ring-brand/30"
      />
    </FieldShell>
  );
}

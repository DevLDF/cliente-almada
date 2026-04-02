"use client";

import React from "react";

// ── FormField wrapper ─────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, hint, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-xs font-semibold"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        {label}
        {required && <span className="ml-1" style={{ color: "#b91c1c" }}>*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-xs" style={{ color: "var(--color-on-surface-variant)", opacity: 0.7 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <div>
      <input
        {...props}
        className={className}
        style={{
          width: "100%",
          padding: "6px 10px",
          fontSize: "13px",
          borderRadius: "8px",
          border: `1px solid ${error ? "#fca5a5" : "rgba(15,58,95,0.15)"}`,
          background: "var(--color-surface-lowest)",
          color: "var(--color-on-background)",
          outline: "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          fontFamily: "var(--font-manrope), sans-serif",
        }}
        onFocus={(e) => {
          (e.target as HTMLInputElement).style.borderColor = "var(--color-primary)";
          (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(15,58,95,0.08)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          (e.target as HTMLInputElement).style.borderColor = error ? "#fca5a5" : "rgba(15,58,95,0.15)";
          (e.target as HTMLInputElement).style.boxShadow = "none";
          props.onBlur?.(e);
        }}
      />
      {error && (
        <p className="text-xs mt-0.5" style={{ color: "#b91c1c" }}>{error}</p>
      )}
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function Textarea({ error, ...props }: TextareaProps) {
  return (
    <div>
      <textarea
        {...props}
        rows={props.rows ?? 3}
        style={{
          width: "100%",
          padding: "6px 10px",
          fontSize: "13px",
          borderRadius: "8px",
          border: `1px solid ${error ? "#fca5a5" : "rgba(15,58,95,0.15)"}`,
          background: "var(--color-surface-lowest)",
          color: "var(--color-on-background)",
          outline: "none",
          resize: "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          fontFamily: "var(--font-manrope), sans-serif",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--color-primary)";
          e.target.style.boxShadow = "0 0 0 3px rgba(15,58,95,0.08)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#fca5a5" : "rgba(15,58,95,0.15)";
          e.target.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
      />
      {error && (
        <p className="text-xs mt-0.5" style={{ color: "#b91c1c" }}>{error}</p>
      )}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────

interface SelectOption { value: string; label: string; }

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: string;
}

export function Select({ options, error, ...props }: SelectProps) {
  return (
    <div>
      <select
        {...props}
        style={{
          width: "100%",
          padding: "6px 10px",
          fontSize: "13px",
          borderRadius: "8px",
          border: `1px solid ${error ? "#fca5a5" : "rgba(15,58,95,0.15)"}`,
          background: "var(--color-surface-lowest)",
          color: "var(--color-on-background)",
          outline: "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          fontFamily: "var(--font-manrope), sans-serif",
          cursor: "pointer",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--color-primary)";
          e.target.style.boxShadow = "0 0 0 3px rgba(15,58,95,0.08)";
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#fca5a5" : "rgba(15,58,95,0.15)";
          e.target.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && (
        <p className="text-xs mt-0.5" style={{ color: "#b91c1c" }}>{error}</p>
      )}
    </div>
  );
}

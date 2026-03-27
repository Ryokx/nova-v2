"use client";

/**
 * Composants de formulaire : Input, Textarea, Select.
 * Chacun supporte un label, un message d'erreur, et l'accessibilité (aria).
 */

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Génère un ID à partir du label (ex: "Votre email" → "votre-email").
 * Utilisé pour lier le <label> au champ via htmlFor/id.
 */
function labelToId(label?: string, id?: string): string | undefined {
  return id || label?.toLowerCase().replace(/\s+/g, "-");
}

/** Classes CSS communes à tous les champs de formulaire */
const fieldBaseStyles = [
  "w-full px-4 py-3 rounded-md border bg-white text-navy text-sm font-body",
  "placeholder:text-grayText/60",
  "focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest",
  "transition-colors duration-200",
];

/* ━━━ Input (champ texte simple) ━━━ */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Libellé affiché au-dessus du champ */
  label?: string;
  /** Message d'erreur affiché en rouge sous le champ */
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = labelToId(label, id);
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-navy mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            ...fieldBaseStyles,
            error ? "border-red" : "border-border",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-red" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

/* ━━━ Textarea (champ texte multiligne) ━━━ */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Libellé affiché au-dessus du champ */
  label?: string;
  /** Message d'erreur affiché en rouge sous le champ */
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = labelToId(label, id);
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-navy mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            ...fieldBaseStyles,
            "resize-y min-h-[100px]",
            error ? "border-red" : "border-border",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-red" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

/* ━━━ Select (menu déroulant) ━━━ */
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Libellé affiché au-dessus du champ */
  label?: string;
  /** Message d'erreur affiché en rouge sous le champ */
  error?: string;
  /** Liste des options du menu déroulant */
  options: SelectOption[];
  /** Texte d'invite (première option désactivée) */
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const inputId = labelToId(label, id);
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-navy mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            ...fieldBaseStyles,
            "appearance-none",
            error ? "border-red" : "border-border",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-red" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export { Input, Textarea, Select, type InputProps, type TextareaProps, type SelectProps, type SelectOption };

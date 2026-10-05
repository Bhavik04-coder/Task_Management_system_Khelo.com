import React, { forwardRef } from "react";

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  required = false,
  className = "",
  containerClassName = "",
  id,
  type = "text",
  ...props
}, ref) => {
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`block w-full rounded-xl border transition-all duration-150 text-sm text-slate-900 placeholder-slate-400 bg-white
            ${Icon ? "pl-10" : "pl-3.5"} pr-3.5 py-2.5
            ${error
              ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-rose-900"
              : "border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
            }
            focus:outline-none ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = "Input";
export default Input;

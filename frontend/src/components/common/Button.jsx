import React from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  className = "",
  onClick,
  ...props
}) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

  const variants = {
    primary: "bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500 shadow-brand-500/20 active:scale-[0.98]",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 focus:ring-slate-300",
    danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-rose-500/20 active:scale-[0.98]",
    outline: "bg-transparent hover:bg-brand-50 text-brand-600 border border-brand-300 focus:ring-brand-500",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 shadow-none focus:ring-slate-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" color={variant === "secondary" || variant === "ghost" ? "text-slate-600" : "text-white"} />
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

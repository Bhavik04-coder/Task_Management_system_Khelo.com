import React from "react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "brand",
  subtitle,
  onClick,
}) {
  const colorStyles = {
    brand: {
      bg: "bg-brand-500/10",
      text: "text-brand-600",
      border: "border-brand-100",
      iconBg: "bg-brand-600 text-white",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-600",
      border: "border-amber-100",
      iconBg: "bg-amber-500 text-white",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-600",
      border: "border-blue-100",
      iconBg: "bg-blue-600 text-white",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600",
      border: "border-emerald-100",
      iconBg: "bg-emerald-600 text-white",
    },
    rose: {
      bg: "bg-rose-500/10",
      text: "text-rose-600",
      border: "border-rose-100",
      iconBg: "bg-rose-600 text-white",
    },
  };

  const style = colorStyles[color] || colorStyles.brand;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? "cursor-pointer hover:border-slate-300" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center shadow-md shadow-slate-200 flex-shrink-0`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

export function DashboardPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-4 justify-between items-start mb-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B35] mb-1">
          Smart Inventory
        </p>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function DashboardStatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "#FF6B35",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 -translate-y-1/2 translate-x-1/4"
        style={{ backgroundColor: accent }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{value}</p>
          {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${accent}18`, color: accent }}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export function DashboardPanel({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-700/80">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  return (
    <div className="py-14 text-center">
      <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/30 text-[#FF6B35] flex items-center justify-center mx-auto mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex mt-4 px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-semibold hover:bg-[#E55A2B] transition"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex mt-4 px-4 py-2 rounded-lg bg-[#FF6B35] text-white text-sm font-semibold hover:bg-[#E55A2B] transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function DashboardButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const styles = {
    primary: "bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white hover:shadow-lg hover:shadow-orange-500/20",
    secondary: "border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
    ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

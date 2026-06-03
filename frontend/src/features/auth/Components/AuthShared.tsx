import React, { type MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

// ── Shell ─────────────────────────────────────────────────────
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0e1014] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="text-[15px] font-medium text-[#e8eaf0] tracking-wide">WatchTower</span>
        </div>

        {/* Card */}
        <div className="bg-[#16191f] border border-white/[0.07] rounded-xl px-6 py-7 shadow-2xl">
          <h1 className="text-[18px] font-semibold text-[#e8eaf0] mb-1">{title}</h1>
          <p className="text-[12px] text-[#6b7280] mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────────────
export function AuthField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] uppercase tracking-[0.08em] text-[#6b7280]">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────
interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ hasError, className = '', ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      className={`w-full h-10 bg-[#0e1014] border rounded-lg px-3 text-sm text-[#e8eaf0] placeholder-[#6b7280] focus:outline-none transition-colors font-mono ${
        hasError
          ? 'border-red-500/50 focus:border-red-500/70'
          : 'border-white/[0.07] focus:border-blue-500/50'
      } ${className}`}
    />
  )
);
AuthInput.displayName = 'AuthInput';

// ── Server error banner ───────────────────────────────────────
export function AuthError({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-400 flex-shrink-0 mt-px">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
      <p className="text-[12px] text-red-400">{message}</p>
    </div>
  );
}

// ── Submit button ─────────────────────────────────────────────
export function AuthSubmitButton({
  loading,
  label,
  loadingLabel,
  onClick 
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
  onClick: MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading && (
        <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {loading ? loadingLabel : label}
    </button>
  );
}

// ── Auth link ─────────────────────────────────────────────────
export function AuthLink({ text, linkText, to }: { text: string; linkText: string; to: string }) {
  return (
    <p className="text-center text-[12px] text-[#6b7280]">
      {text}{' '}
      <Link to={to} className="text-blue-400 hover:text-blue-300 transition-colors">
        {linkText}
      </Link>
    </p>
  );
}
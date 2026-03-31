import { forwardRef } from "react";

interface CampoTextoProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

export const CampoTexto = forwardRef<HTMLInputElement, CampoTextoProps>(
  ({ label, error, className = "", type = "text", ...props }, ref) => {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          ref={ref}
          type={type}
          {...props}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A5F] focus:border-transparent transition-colors ${
            error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
          }`}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

CampoTexto.displayName = "CampoTexto";

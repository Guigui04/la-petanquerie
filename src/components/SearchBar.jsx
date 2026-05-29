import { Search } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Chercher…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="h-4 w-4 text-fg-muted absolute left-4 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 pl-10 pr-4 rounded-full bg-white border border-line text-sm text-fg placeholder:text-fg-subtle focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition"
      />
    </div>
  );
}

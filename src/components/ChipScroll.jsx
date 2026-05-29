export function ChipScroll({ items = [] }) {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scroll -mx-5 px-5 pb-1">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full bg-white border border-line text-fg text-xs font-semibold whitespace-nowrap"
        >
          {item.icon ? <item.icon className="h-3.5 w-3.5 text-fg-muted" /> : null}
          {item.label}
        </span>
      ))}
    </div>
  );
}

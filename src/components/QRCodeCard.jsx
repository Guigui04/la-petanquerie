import { QRCodeSVG } from 'qrcode.react';

export function QRCodeCard({ data, label, sublabel, shimmer = false }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3 relative overflow-hidden shadow-elevated">
      {label ? <p className="text-sm font-semibold text-ink-900">{label}</p> : null}
      <div className="relative rounded-xl p-3 bg-white border-2 border-ink-900/10">
        <QRCodeSVG
          value={typeof data === 'string' ? data : JSON.stringify(data)}
          size={180}
          fgColor="#0A0F1C"
          bgColor="#ffffff"
          level="M"
        />
        {shimmer ? (
          <span className="pointer-events-none absolute inset-0 rounded-xl shimmer" />
        ) : null}
      </div>
      {sublabel ? (
        <p className="text-xs text-ink-700 text-center max-w-[280px]">{sublabel}</p>
      ) : null}
    </div>
  );
}

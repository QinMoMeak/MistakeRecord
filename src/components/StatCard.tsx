import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, hint, icon: Icon, tone }: { label: string; value: number | string; hint: string; icon: LucideIcon; tone: string }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-card backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{hint}</p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}


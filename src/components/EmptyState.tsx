import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
        <Icon size={28} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}


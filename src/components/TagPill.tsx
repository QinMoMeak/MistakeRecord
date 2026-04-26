import { cn } from "@/lib/helpers";

export function TagPill({ label, className }: { label: string; className?: string }) {
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset", className)}>{label}</span>;
}


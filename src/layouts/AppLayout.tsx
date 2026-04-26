import { Menu } from "lucide-react";
import { useState } from "react";
import type { PropsWithChildren } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { cn } from "@/lib/helpers";

export function AppLayout({ children }: PropsWithChildren) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_32%),linear-gradient(180deg,#f8fbff_0%,#f5f7fb_45%,#eef4ff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-dvh max-w-[1600px]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 border-r border-white/60 bg-white/80 p-4 shadow-card backdrop-blur transition-transform duration-300 lg:static lg:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 border-b border-white/60 bg-white/70 px-4 backdrop-blur lg:px-8">
            <div className="flex items-center gap-3 py-4 lg:hidden">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700"
                onClick={() => setMobileOpen(true)}
                aria-label="打开导航"
              >
                <Menu size={20} />
              </button>
              <span className="text-lg font-semibold">错题总结</span>
            </div>
            <Topbar />
          </div>
          <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
      {mobileOpen ? <button type="button" className="fixed inset-0 z-30 bg-slate-950/20 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="关闭导航" /> : null}
    </div>
  );
}


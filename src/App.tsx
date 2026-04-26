import { Outlet } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { useAppBootstrap } from "@/hooks/useAppBootstrap";

export function App() {
  const { initialized, loadingText } = useAppBootstrap();

  if (!initialized) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[radial-gradient(circle_at_top,#dbeafe,transparent_42%),linear-gradient(180deg,#f8fbff_0%,#f5f7fb_100%)] px-6">
        <div className="rounded-3xl border border-white/60 bg-white/80 px-8 py-10 text-center shadow-card backdrop-blur">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
            <span className="text-2xl font-bold">题</span>
          </div>
          <p className="text-lg font-semibold text-slate-900">正在准备你的错题本</p>
          <p className="mt-2 text-sm text-slate-500">{loadingText}</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}


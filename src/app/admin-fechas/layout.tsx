
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar, Home, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminFechasLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Verificar si está autenticado (en cliente)
    const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('admin_auth') === 'true';
    setIsAuthenticated(isAuth);
    setIsLoading(false);

    // Si no está autenticado y no está en login, redirigir
    if (!isAuth && pathname !== "/admin-fechas/login") {
      router.push("/admin-fechas/login");
    }
  }, [router, pathname]);

  const handleSignOut = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    router.push("/admin-fechas/login");
  };

  // Si está cargando, mostrar loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="text-zinc-500">Cargando Gestor...</p>
      </div>
    );
  }

  // Si es página de login, mostrar solo el contenido sin header
  if (pathname === "/admin-fechas/login") {
    return <>{children}</>;
  }

  // Si no está autenticado, no mostrar nada (redirección en progreso)
  if (!isAuthenticated) {
    return null;
  }

  // Mostrar layout con header y footer para páginas autenticadas
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin-fechas/dashboard" className="text-xl font-black text-blue-400 flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Gestor de Fechas
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/fechas">
              <Button variant="ghost" size="sm" className="text-zinc-400">
                <Home className="h-4 w-4 mr-2" />
                Ver Calendario
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleSignOut} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

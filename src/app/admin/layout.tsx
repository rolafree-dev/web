"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Home, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
    if (!isAuth && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [router, pathname]);

  const handleSignOut = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  // Si está cargando, mostrar loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Cargando...</p>
      </div>
    );
  }

  // Si es página de login, mostrar solo el contenido sin header
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Si no está autenticado, no mostrar nada (redirección en progreso)
  if (!isAuthenticated) {
    return null;
  }

  // Mostrar layout con header y footer para páginas autenticadas
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-muted bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="text-xl font-bold text-primary flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6" />
              Rola Free Admin
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-sm hover:text-primary transition-colors">Dashboard</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Ver Sitio
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
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

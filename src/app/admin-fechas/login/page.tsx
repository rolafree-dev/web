"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Loader2, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminFechasLoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const MASTER_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  useEffect(() => {
    const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('admin_auth') === 'true';
    if (isAuth) {
      router.push("/admin-fechas/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== MASTER_PASSWORD) {
      toast({
        variant: "destructive",
        title: "Contraseña incorrecta",
        description: "Acceso denegado para el gestor de calendario.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Guardar autenticación en sessionStorage
      sessionStorage.setItem('admin_auth', 'true');
      router.push("/admin-fechas/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo iniciar sesión.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] p-4 gap-6">
      <Link href="/fechas">
        <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Calendario
        </Button>
      </Link>

      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-2 border border-blue-500/20">
            <Calendar className="h-7 w-7 text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-black text-white">Gestor de Fechas</CardTitle>
          <CardDescription className="text-zinc-400">Panel exclusivo para el calendario 2026</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password de Calendario"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-zinc-950 border-zinc-800 text-center text-lg tracking-widest h-12 focus-visible:ring-blue-500"
                autoFocus
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-500 h-12 font-bold" 
              type="submit" 
              disabled={isLoading || password.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Validando...
                </>
              ) : (
                "Acceder al Gestor"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

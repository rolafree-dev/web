
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, Trophy, Swords, Star, Edit3, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useDoc } from "@/hooks/use-db";

const Match = ({ p1, p2, winner }: { p1: string; p2: string; winner?: number }) => (
  <div className="flex flex-col w-48 border border-muted bg-card/50 rounded-lg overflow-hidden shrink-0 shadow-lg">
    <div className={`px-3 py-2 flex justify-between items-center border-b border-muted ${winner === 1 ? 'bg-primary/10' : ''}`}>
      <span className={`text-sm font-bold truncate ${winner === 1 ? 'text-primary' : 'text-muted-foreground'}`}>{p1 || "TBD"}</span>
      {winner === 1 && <Trophy className="h-3 w-3 text-primary shrink-0 ml-2" />}
    </div>
    <div className={`px-3 py-2 flex justify-between items-center ${winner === 2 ? 'bg-primary/10' : ''}`}>
      <span className={`text-sm font-bold truncate ${winner === 2 ? 'text-primary' : 'text-muted-foreground'}`}>{p2 || "TBD"}</span>
      {winner === 2 && <Trophy className="h-3 w-3 text-primary shrink-0 ml-2" />}
    </div>
  </div>
);

export default function BracketDetailPage() {
  const { id } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('admin_auth') === 'true';
    setIsAdmin(isAuth);
  }, []);
  
  const { data: tournament, isLoading } = useDoc(`/tournaments/${id as string}`);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Cargando llave de competición...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="container mx-auto px-4 py-12 max-w-[1400px]">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-6">
            <Link href="/fechas">
              <Button variant="ghost" className="w-fit -ml-4 hover:text-primary">
                <ChevronLeft className="h-4 w-4 mr-2" /> Volver al Calendario
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-2xl">
                <Swords className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tight">
                  Llave de <span className="text-primary">{tournament?.name || "Competición"}</span>
                </h1>
                <p className="text-muted-foreground font-medium">Fase final - Camino al título</p>
              </div>
            </div>
          </div>

          {isAdmin && (
            <Link href={`/admin/tournament/${id}`}>
              <Button className="bg-blue-600 hover:bg-blue-500 font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <Edit3 className="h-4 w-4 mr-2" /> Editar Llave
              </Button>
            </Link>
          )}
        </div>

        {!tournament ? (
          <div className="text-center py-32 bg-card/20 rounded-3xl border border-dashed border-muted">
            <Trophy className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-muted-foreground">No hay llave configurada para esta fecha</h2>
            <p className="text-sm text-muted-foreground/60 mt-1">El organizador aún no ha publicado los enfrentamientos.</p>
            {isAdmin && (
               <Link href={`/admin/tournament/new?id=${id}`} className="mt-6 inline-block">
                 <Button variant="outline">Crear Llave ahora</Button>
               </Link>
            )}
          </div>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap rounded-3xl border border-muted bg-card/20 backdrop-blur-sm">
            <div className="flex gap-16 p-10 min-w-max h-[800px] items-center">
              
              {/* Octavos de Final */}
              <div className="flex flex-col justify-between h-full py-10">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 mb-4 text-center">Octavos</div>
                {tournament.bracket?.octavos?.map((match: any, i: number) => (
                  <Match key={`o-${i}`} {...match} />
                ))}
              </div>

              {/* Cuartos de Final */}
              <div className="flex flex-col justify-around h-full py-20">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 mb-4 text-center">Cuartos</div>
                {tournament.bracket?.cuartos?.map((match: any, i: number) => (
                  <Match key={`c-${i}`} {...match} />
                ))}
              </div>

              {/* Semifinales */}
              <div className="flex flex-col justify-around h-full py-40">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 mb-4 text-center">Semifinales</div>
                {tournament.bracket?.semis?.map((match: any, i: number) => (
                  <Match key={`s-${i}`} {...match} />
                ))}
              </div>

              {/* Final */}
              <div className="flex flex-col justify-center h-full items-center px-10">
                <div className="mb-4 animate-bounce">
                  <Trophy className="h-12 w-12 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 mb-8 text-center">Gran Final</div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
                  <div className="relative">
                    <Match {...tournament.bracket?.final} />
                  </div>
                </div>
              </div>

            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>
    </div>
  );
}

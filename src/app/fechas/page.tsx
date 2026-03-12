
"use client";

import React from "react";
import { ChevronLeft, Calendar as CalendarIcon, MapPin, Clock, Trophy, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCollection } from "@/hooks/use-db";

export default function FechasPage() {
  const { data: events, isLoading } = useCollection({ endpoint: '/events' });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12 flex flex-col gap-6">
          <Link href="/">
            <Button variant="ghost" className="w-fit -ml-4 hover:text-primary">
              <ChevronLeft className="h-4 w-4 mr-2" /> Volver al Ranking
            </Button>
          </Link>
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tight">Calendario <span className="text-primary">2026</span></h1>
              <p className="text-muted-foreground text-lg font-medium">Cronograma oficial de fechas y eventos de Rola Free.</p>
            </div>
            <Link href="/admin-fechas/login">
              <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest text-muted-foreground/40 hover:text-primary">
                Gestión
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : !events || events.length === 0 ? (
          <div className="text-center py-20 bg-card/10 rounded-3xl border border-dashed border-muted">
            <p className="text-muted-foreground">No hay fechas programadas en este momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((fecha) => (
              <Card key={fecha.id} className="bg-card/30 border-muted/20 hover:border-primary/30 transition-all group overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="bg-muted/50 p-6 flex flex-col items-center justify-center min-w-[140px] text-center md:border-r border-muted/20">
                      <CalendarIcon className="h-5 w-5 text-primary mb-2" />
                      <div className="font-black text-2xl leading-tight">{fecha.date}</div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">FECHA</div>
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 py-0 border-primary/20 text-primary/80">
                            {fecha.type}
                          </Badge>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${fecha.status === 'Finalizado' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                            {fecha.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{fecha.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {fecha.location}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            --:--
                          </div>
                        </div>
                      </div>
                      
                      <Link href={`/bracket/${fecha.id}`}>
                        <Button variant="outline" className="font-bold border-muted hover:border-primary transition-colors md:w-auto w-full">
                          Ver Llave
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-20 p-8 rounded-3xl bg-primary/5 border border-primary/10 text-center space-y-4">
          <Trophy className="h-10 w-10 text-primary mx-auto mb-2" />
          <h2 className="text-2xl font-black">¿Quieres organizar una fecha?</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Únete a la red oficial de organizadores y lleva la experiencia Rola Free a tu ciudad.</p>
          <Link href="https://www.instagram.com/santiago_barrionuevo_/" target="_blank">
            <Button className="font-bold rounded-xl px-8">Contactar Staff</Button>
          </Link>
        </div>
      </div>

      <footer className="container mx-auto px-4 py-10 border-t border-muted/20 text-center mt-auto">
        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.4em]">
          Rola Free 2026 - Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}

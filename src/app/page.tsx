"use client";

import React, { useEffect, useState } from "react";
import { CompetitorCard } from "@/components/public/CompetitorCard";
import { Trophy, Star, ChevronRight, Mic, Users, Trophy as TrophyIcon, Target, Calendar, Play, ExternalLink, Swords } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollection, useDoc } from "@/hooks/use-db";

interface Competitor {
  id: string;
  name: string;
  country?: string;
  wins: number;
  losses: number;
  imageUrl: string;
  isActive?: boolean;
}

interface GlobalStatsData {
  battles: number;
  tournaments: number;
  champions: number;
  competitors: number;
}

interface Rola {
  id: string;
  title: string;
  competitor1Id: string;
  competitor2Id: string;
  competitor1Name: string;
  competitor2Name: string;
  date: string;
  link: string;
  imageUrl: string;
  points: number;
}

export default function Home() {
  const { data: competitorsData, isLoading: isCompLoading } = useCollection<Competitor>({ endpoint: '/competitors' });
  const { data: rolasData, isLoading: isRolasLoading } = useCollection<Rola>({ endpoint: '/rolas' });
  const { data: stats } = useDoc<GlobalStatsData>('/settings');
  
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [rolas, setRolas] = useState<Rola[]>([]);

  useEffect(() => {
    if (competitorsData) {
      setCompetitors([...competitorsData].sort((a, b) => b.wins - a.wins));
    }
  }, [competitorsData]);

  useEffect(() => {
    if (rolasData) {
      setRolas(rolasData);
    }
  }, [rolasData]);

  const mainRola = rolas?.[0];

  const displayStats = [
    {
      icon: <Mic className="h-5 w-5 text-primary" />,
      value: stats?.battles ?? 0,
      label: "participaciones",
    },
    {
      icon: <Target className="h-5 w-5 text-primary" />,
      value: stats?.tournaments ?? 0,
      label: "fechas totales",
      href: "/fechas"
    },
    {
      icon: <TrophyIcon className="h-5 w-5 text-primary" />,
      value: stats?.champions ?? 0,
      label: "campeones únicos",
    },
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      value: stats?.competitors ?? 0,
      label: "competidores totales",
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-body">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 flex flex-col items-center justify-center overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>
        <div className="container mx-auto px-4 text-center z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] border border-primary/20 mb-4">
            <Star className="h-3 w-3 fill-primary" />
            RANKING OFICIAL
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 uppercase">
            Rola<span className="text-primary"> Free</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto font-medium opacity-80">
            La plataforma definitiva para seguir el desempeño y las estadísticas de los mejores competidores. 🎤🔥
          </p>
        </div>
      </section>

      {/* Global Stats */}
      <section className="container mx-auto px-4 max-w-5xl relative z-20 shrink-0 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayStats.map((stat, index) => {
            const content = (
              <div 
                key={`stat-card-${index}`}
                className={`bg-card/30 border border-muted/20 rounded-2xl p-6 flex flex-col items-center text-center backdrop-blur-md transition-all duration-300 h-full ${stat.href ? 'hover:bg-card/50 hover:border-primary/50 hover:scale-105 cursor-pointer' : ''}`}
              >
                <div className="mb-3 p-2 bg-primary/5 rounded-full">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/60">
                  {stat.label}
                </div>
              </div>
            );

            return stat.href ? (
              <Link key={index} href={stat.href} className="group">
                {content}
              </Link>
            ) : (
              <div key={index}>
                {content}
              </div>
            );
          })}
        </div>
      </section>

      {/* Ranking Content */}
      <main className="container mx-auto px-4 py-10 flex-grow max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
              <Trophy className="h-3 w-3" />
              Estatus Pro
            </div>
            <h2 className="text-3xl font-black tracking-tight uppercase">Los mejores competidores 🏆</h2>
            {/* Leyenda de estado */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 pt-2">
              <div className="flex items-center gap-1.5 bg-card/50 px-2 py-1 rounded-full border border-muted/30">
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span>Competidor en activo</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card/50 px-2 py-1 rounded-full border border-muted/30">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span>Inactivo</span>
              </div>
            </div>
          </div>
        </div>

        {isCompLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-card/10 rounded-2xl animate-pulse border border-muted/20" />
            ))}
          </div>
        ) : !competitors || competitors.length === 0 ? (
          <div className="text-center py-24 bg-card/10 rounded-3xl border border-muted/20 border-dashed">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">No hay competidores registrados aún. 🚫</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {competitors.map((comp) => (
              <CompetitorCard key={comp.id} {...comp} />
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Link href="/admin/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 hover:text-primary transition-colors flex items-center gap-1">
            Gestión <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </main>

      {/* Featured Battle */}
      {mainRola && (
        <section className="container mx-auto px-4 max-w-5xl mb-20 py-10 border-t border-muted/20">
          <div className="flex items-center gap-3 mb-8">
            <Swords className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-black uppercase tracking-widest">Batalla del Mes 🔥</h2>
          </div>
          <div className="bg-card border border-muted/30 rounded-3xl overflow-hidden shadow-2xl relative group">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto h-full min-h-[300px]">
                <Image 
                  src={mainRola.imageUrl || "https://picsum.photos/seed/battle/800/600"} 
                  alt={mainRola.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 flex gap-2">
                  <Badge className="bg-primary/90 hover:bg-primary border-none text-[10px] font-bold">DESTACADA</Badge>
                  <Badge variant="outline" className="bg-black/50 backdrop-blur-md border-white/20 text-[10px] font-bold">
                    <Calendar className="h-3 w-3 mr-1" /> {mainRola.date}
                  </Badge>
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                <div>
                  <h3 className="text-3xl font-black leading-tight mb-2 uppercase">{mainRola.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-lg">
                    <Link href={`/competitor/${mainRola.competitor1Id}`} className="text-primary hover:underline font-bold">
                      {mainRola.competitor1Name}
                    </Link>
                    <span className="text-muted-foreground font-light italic">vs</span>
                    <Link href={`/competitor/${mainRola.competitor2Id}`} className="text-primary hover:underline font-bold">
                      {mainRola.competitor2Name}
                    </Link>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Link href={mainRola.link} target="_blank" className="flex-1">
                    <Button className="w-full bg-white text-black hover:bg-gray-200 font-bold rounded-xl shadow-lg">
                      <Play className="h-4 w-4 mr-2 fill-black" /> Ver Batalla
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" className="rounded-xl border-muted-foreground/20">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="container mx-auto px-4 py-12 border-t border-muted/20 text-center mt-auto">
        <Link 
          href="https://tablarolafree-ch2hev03x-blesssssssins-projects.vercel.app/" 
          target="_blank"
          className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.4em] hover:text-primary transition-colors"
        >
          Rola Free © 2026
        </Link>
      </footer>
    </div>
  );
}
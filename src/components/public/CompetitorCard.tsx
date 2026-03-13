"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface CompetitorCardProps {
  id: string;
  name: string;
  country?: string;
  wins: number;
  losses: number;
  imageUrl: string;
  isActive?: boolean;
}

export function CompetitorCard({ id, name, country, wins, losses, imageUrl, isActive = true }: CompetitorCardProps) {
  const totalParticipations = wins + losses;

  return (
    <Link href={`/competitor/${id}`}>
      <div className="group bg-card/40 border border-muted/20 hover:border-primary/40 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 hover:bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 rounded-xl overflow-hidden border-2 border-muted/20 group-hover:border-primary/30 transition-colors">
            <Image
              src={imageUrl || "https://picsum.photos/seed/placeholder/200/200"}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{name}</h3>
              {/* Punto de estado con efecto de brillo */}
              <div 
                className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}
                title={isActive ? 'Competidor en activo' : 'Inactivo'}
              />
            </div>
            {country && <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">{country}</p>}
          </div>
        </div>

        <div className="flex items-center gap-8 pr-4">
          <div className="hidden md:flex items-center gap-8">
            <div className="text-center">
              <p className="text-xs font-bold text-primary">🏆 {wins}</p>
              <p className="text-[8px] uppercase font-black tracking-tighter text-muted-foreground/40">Victorias</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-red-500">💀 {losses}</p>
              <p className="text-[8px] uppercase font-black tracking-tighter text-muted-foreground/40">Derrotas</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-blue-400">📊 {totalParticipations}</p>
              <p className="text-[8px] uppercase font-black tracking-tighter text-muted-foreground/40">Participaciones</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground/20 group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Link>
  );
}
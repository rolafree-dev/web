
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trophy, Swords, Instagram, Twitter, Youtube, Loader2, Activity, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDoc } from "@/hooks/use-db";

export default function CompetitorProfilePage() {
  const { id } = useParams();

  const { data: competitor, isLoading } = useDoc(`/competitors/${id as string}`);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground">Cargando perfil...</p>
      </div>
    );
  }

  if (!competitor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
        <h2 className="text-3xl font-bold">Competidor no encontrado</h2>
        <Link href="/">
          <Button variant="outline">Volver al Ranking</Button>
        </Link>
      </div>
    );
  }

  const totalMatches = (competitor.wins || 0) + (competitor.losses || 0);
  const winRate = totalMatches > 0 ? Math.round((competitor.wins / totalMatches) * 100) : 0;

  // Helper function to format social links
  const getSocialLink = (platform: string, value?: string) => {
    if (!value) return null;
    if (value.startsWith('http')) return value;
    
    switch (platform) {
      case 'instagram': return `https://www.instagram.com/${value.replace('@', '')}/`;
      case 'twitter': return `https://twitter.com/${value.replace('@', '')}/`;
      case 'youtube': return value.includes('youtube.com') ? value : `https://www.youtube.com/@${value.replace('@', '')}`;
      default: return null;
    }
  };

  const instagramLink = getSocialLink('instagram', competitor.instagram);
  const twitterLink = getSocialLink('twitter', competitor.twitter);
  const youtubeLink = getSocialLink('youtube', competitor.youtube);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-grow">
        {/* Background Header */}
        <div className="h-[300px] w-full bg-gradient-to-r from-primary/30 to-secondary/30 relative">
          <Link href="/" className="absolute top-8 left-8 z-10">
            <Button variant="outline" className="bg-background/50 backdrop-blur-md border-white/10 hover:bg-background/80">
              <ChevronLeft className="h-4 w-4 mr-2" /> Volver al Ranking
            </Button>
          </Link>
        </div>

        <div className="container mx-auto px-4 -mt-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Profile Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-card border border-muted rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative aspect-square w-full">
                  <Image
                    src={competitor.imageUrl || "https://picsum.photos/seed/placeholder/600/600"}
                    alt={competitor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 text-center space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">{competitor.name}</h1>
                    <p className="text-primary font-medium tracking-widest uppercase text-sm">Competidor Pro</p>
                    {competitor.country && (
                      <div className="flex items-center justify-center gap-1.5 text-muted-foreground mt-2 text-xs font-bold uppercase tracking-tighter">
                        <Globe className="h-3 w-3" /> {competitor.country}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    {instagramLink && (
                      <Link href={instagramLink} target="_blank">
                        <Button variant="outline" size="icon" className="rounded-full hover:text-pink-500 hover:border-pink-500/50 transition-colors">
                          <Instagram className="h-5 w-5" />
                        </Button>
                      </Link>
                    )}
                    {twitterLink && (
                      <Link href={twitterLink} target="_blank">
                        <Button variant="outline" size="icon" className="rounded-full hover:text-blue-400 hover:border-blue-400/50 transition-colors">
                          <Twitter className="h-5 w-5" />
                        </Button>
                      </Link>
                    )}
                    {youtubeLink && (
                      <Link href={youtubeLink} target="_blank">
                        <Button variant="outline" size="icon" className="rounded-full hover:text-red-500 hover:border-red-500/50 transition-colors">
                          <Youtube className="h-5 w-5" />
                        </Button>
                      </Link>
                    )}
                    {!instagramLink && !twitterLink && !youtubeLink && (
                      <p className="text-xs text-muted-foreground italic">Sin redes sociales vinculadas</p>
                    )}
                  </div>

                  <div className="pt-6 border-t border-muted">
                    <p className="text-sm text-muted-foreground">Miembro del Ranking</p>
                    <p className="font-medium">Perfil Verificado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-12">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-8 rounded-3xl border border-muted relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Activity className="h-16 w-16 text-blue-400" />
                  </div>
                  <p className="text-muted-foreground font-medium uppercase text-xs tracking-wider mb-2">Participaciones Totales</p>
                  <p className="text-5xl font-black text-blue-400">{totalMatches}</p>
                </div>
                <div className="bg-card p-8 rounded-3xl border border-muted relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Trophy className="h-16 w-16 text-primary" />
                  </div>
                  <p className="text-muted-foreground font-medium uppercase text-xs tracking-wider mb-2">Victorias</p>
                  <p className="text-5xl font-black text-primary">{competitor.wins}</p>
                </div>
                <div className="bg-card p-8 rounded-3xl border border-muted relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <Swords className="h-16 w-16 text-red-500" />
                  </div>
                  <p className="text-muted-foreground font-medium uppercase text-xs tracking-wider mb-2">Derrotas</p>
                  <p className="text-5xl font-black text-red-500">{competitor.losses}</p>
                </div>
              </div>

              {/* Biography */}
              <div className="bg-card p-8 md:p-12 rounded-3xl border border-muted space-y-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-primary rounded-full"></span>
                  Sobre {competitor.name}
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {competitor.bio}
                  </p>
                </div>
              </div>

              {/* Performance Bar */}
              <div className="bg-card p-8 rounded-3xl border border-muted space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="font-bold uppercase text-sm tracking-widest text-muted-foreground">Tasa de Victoria</h3>
                  <p className="text-3xl font-bold text-primary">
                    {winRate}%
                  </p>
                </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-1000" 
                    style={{ width: `${winRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="container mx-auto px-4 py-10 border-t border-muted text-center mt-20">
        <Link 
          href="https://tablarolafree-ch2hev03x-blesssssssins-projects.vercel.app/" 
          target="_blank"
          className="text-sm font-bold text-muted-foreground uppercase tracking-[0.3em] hover:text-primary transition-colors"
        >
          Rola Free
        </Link>
      </footer>
    </div>
  );
}

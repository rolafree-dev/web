
"use client";

import React from "react";
import { TournamentForm } from "@/components/admin/TournamentForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewTournamentPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="icon"><ChevronLeft className="h-6 w-6" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nueva Llave de Competición</h1>
          <p className="text-muted-foreground">Configura los enfrentamientos para un nuevo torneo.</p>
        </div>
      </div>
      
      <div className="bg-card border border-muted rounded-2xl p-6 md:p-8 shadow-xl">
        <TournamentForm />
      </div>
    </div>
  );
}

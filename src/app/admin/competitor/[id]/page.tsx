"use client";

import React from "react";
import { useParams } from "next/navigation";
import { CompetitorForm } from "@/components/admin/CompetitorForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useDoc } from "@/hooks/use-db";

export default function EditCompetitorPage() {
  const { id } = useParams();

  const { data: initialData, isLoading } = useDoc(`/competitors/${id as string}`);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-muted-foreground">Cargando datos del competidor...</p>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">No se encontró al competidor</h2>
        <Link href="/admin/dashboard" className="text-primary hover:underline mt-4 inline-block">Volver al Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Competidor</h1>
          <p className="text-muted-foreground">Actualiza la información del perfil de {initialData.name}.</p>
        </div>
      </div>
      
      <div className="bg-card border border-muted rounded-2xl p-6 md:p-8">
        <CompetitorForm initialData={initialData} />
      </div>
    </div>
  );
}

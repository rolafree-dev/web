
"use client";

import React from "react";
import { CompetitorForm } from "@/components/admin/CompetitorForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewCompetitorPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Competidor</h1>
          <p className="text-muted-foreground">Completa los datos para crear un nuevo perfil público.</p>
        </div>
      </div>
      
      <div className="bg-card border border-muted rounded-2xl p-6 md:p-8">
        <CompetitorForm />
      </div>
    </div>
  );
}

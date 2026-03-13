"use client";

import React from "react";
import { RolaForm } from "@/components/admin/RolaForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Swords } from "lucide-react";
import Link from "next/link";

export default function NewRolaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nueva Batalla del Mes</h1>
          <p className="text-muted-foreground">Añade una batalla destacada para el ranking mensual.</p>
        </div>
      </div>
      
      <div className="bg-card border border-muted rounded-2xl p-6 md:p-8 shadow-xl">
        <RolaForm />
      </div>
    </div>
  );
}

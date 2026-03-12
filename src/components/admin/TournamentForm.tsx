"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2, Trophy, Swords } from "lucide-react";
import { addDocument, updateDocument } from "@/lib/db-helpers";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const mS = z.object({ p1: z.string().default("TBD"), p2: z.string().default("TBD"), winner: z.coerce.number().default(0) });
const fS = z.object({ name: z.string().min(1), date: z.string().min(1), status: z.string(), bracket: z.object({ octavos: z.array(mS).length(8), cuartos: z.array(mS).length(4), semis: z.array(mS).length(2), final: mS }) });

export function TournamentForm({ initialData }: { initialData?: any }) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const sP = useSearchParams();
  const pN = usePathname();
  const isAdminFechas = pN.includes("admin-fechas");

  const form = useForm<z.infer<typeof fS>>({
    resolver: zodResolver(fS),
    defaultValues: initialData || { name: "", date: "", status: "Próximamente", bracket: { octavos: Array(8).fill({p1: "TBD", p2: "TBD", winner: 0}), cuartos: Array(4).fill({p1: "TBD", p2: "TBD", winner: 0}), semis: Array(2).fill({p1: "TBD", p2: "TBD", winner: 0}), final: {p1: "TBD", p2: "TBD", winner: 0} } },
  });

  const onS = async (v: z.infer<typeof fS>) => {
    setSubmitting(true);
    const id = sP.get("id") || initialData?.id;
    
    try {
      if (id) {
        await updateDocument('/tournaments', id, { ...v, id });
      } else {
        await addDocument('/tournaments', v);
      }
      toast({ title: "Guardado" });
      router.back();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const Match = ({ s, i }: { s: any, i: number }) => (
    <div className={cn("p-3 rounded-lg border space-y-2", isAdminFechas ? "bg-zinc-900/50 border-zinc-800" : "bg-muted/20 border-muted")}>
      <div className="text-[8px] font-bold text-zinc-500 uppercase">M-{i + 1}</div>
      <FormField control={form.control} name={`bracket.${s}.${i}.p1` as any} render={({field}) => <Input {...field} className="h-7 text-[10px]"/>}/>
      <FormField control={form.control} name={`bracket.${s}.${i}.p2` as any} render={({field}) => <Input {...field} className="h-7 text-[10px]"/>}/>
      <FormField control={form.control} name={`bracket.${s}.${i}.winner` as any} render={({field}) => (
        <Select onValueChange={field.onChange} value={field.value.toString()}>
          <SelectTrigger className="h-6 text-[8px]"><SelectValue/></SelectTrigger>
          <SelectContent><SelectItem value="0">TBD</SelectItem><SelectItem value="1">P1</SelectItem><SelectItem value="2">P2</SelectItem></SelectContent>
        </Select>
      )}/>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onS)} className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <FormField control={form.control} name="name" render={({field}) => <Input {...field} placeholder="Torneo" className={cn(isAdminFechas && "bg-zinc-950 border-zinc-800")}/>}/>
          <FormField control={form.control} name="date" render={({field}) => <Input {...field} placeholder="Fecha" className={cn(isAdminFechas && "bg-zinc-950 border-zinc-800")}/>}/>
          <FormField control={form.control} name="status" render={({field}) => <Input {...field} placeholder="Estado" className={cn(isAdminFechas && "bg-zinc-950 border-zinc-800")}/>}/>
        </div>
        
        {["octavos", "cuartos", "semis"].map(s => (
          <div key={s} className="space-y-3">
            <h4 className="text-[10px] font-black uppercase text-primary tracking-widest">{s}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {Array.from({ length: s === "octavos" ? 8 : s === "cuartos" ? 4 : 2 }).map((_, i) => <Match key={i} s={s} i={i}/>)}
            </div>
          </div>
        ))}

        <div className="max-w-xs mx-auto text-center space-y-2 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <Trophy className="mx-auto w-6 h-6 text-primary mb-2"/>
          <FormField control={form.control} name="bracket.final.p1" render={({field}) => <Input {...field} placeholder="Finalista 1"/>}/>
          <FormField control={form.control} name="bracket.final.p2" render={({field}) => <Input {...field} placeholder="Finalista 2"/>}/>
          <FormField control={form.control} name="bracket.final.winner" render={({field}) => (
            <Select onValueChange={field.onChange} value={field.value.toString()}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="0">TBD</SelectItem><SelectItem value="1">P1 Gana</SelectItem><SelectItem value="2">P2 Gana</SelectItem></SelectContent></Select>
          )}/>
        </div>

        <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => router.back()}>Atrás</Button><Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Guardar</Button></div>
      </form>
    </Form>
  );
}
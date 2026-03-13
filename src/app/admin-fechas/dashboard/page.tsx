"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Loader2, Save, Edit, GitBranch, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useCollection } from "@/hooks/use-db";
import { addDocument, updateDocument, deleteDocument } from "@/lib/db-helpers";

export default function AdminFechasDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", date: "???", location: "???", status: "Próximamente", type: "Nacional", order: 0 });

  const { data: events, isLoading } = useCollection({ endpoint: '/events' });

  const sub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      toast({ variant: "destructive", title: "Error", description: "El título es requerido" });
      return;
    }
    setLoading(true);
    
    try {
      if (editId) {
        await updateDocument('/events', editId, form);
        toast({ title: "Actualizado" });
      } else {
        await addDocument('/events', form);
        toast({ title: "Añadido" });
      }
      setForm({ title: "", date: "???", location: "???", status: "Próximamente", type: "Nacional", order: (events?.length || 0) + 1 });
      setEditId(null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("¿Eliminar?")) return;
    try {
      await deleteDocument('/events', id);
      toast({ title: "Eliminado" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-black text-blue-400">Gestión Calendario</h1></div>
      
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader><CardTitle className="text-sm uppercase tracking-widest text-zinc-500">{editId ? "Editar Fecha" : "Nueva Fecha"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={sub} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Título" required className="bg-zinc-950 border-zinc-800"/>
            <Input value={form.date} onChange={e => setForm({...form, date: e.target.value})} placeholder="Fecha" className="bg-zinc-950 border-zinc-800"/>
            <Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Ubicación" className="bg-zinc-950 border-zinc-800"/>
            <div className="flex gap-2 col-span-full justify-end">
              {editId && <Button type="button" variant="ghost" onClick={() => {setEditId(null); setForm({title: "", date: "???", location: "???", status: "Próximamente", type: "Nacional", order: 0})}}>Cancelar</Button>}
              <Button type="submit" disabled={loading} className="bg-blue-600 font-bold">{loading ? <Loader2 className="animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} {editId ? "Actualizar" : "Guardar"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <Table>
          <TableBody>
            {isLoading ? <TableRow><TableCell className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-500"/></TableCell></TableRow> : events?.map(e => (
              <TableRow key={e.id} className="border-zinc-800">
                <TableCell className="font-black text-blue-400 w-12">{e.order}</TableCell>
                <TableCell><div className="font-bold">{e.title}</div><div className="text-[10px] text-zinc-500">{e.location} • {e.date}</div></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/tournament/${e.id}`}><Button variant="ghost" size="icon" className="text-blue-400"><GitBranch className="w-4 h-4"/></Button></Link>
                    <Button variant="ghost" size="icon" onClick={() => {setEditId(e.id); setForm(e);}}><Edit className="w-4 h-4"/></Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => del(e.id)}><Trash2 className="w-4 h-4"/></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus, Users, Loader2, Settings, Save, Mic, Target, Trophy, Music, Image as ImageIcon, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCollection, useDoc } from "@/hooks/use-db";
import { deleteDocument, updateDocument, addDocument } from "@/lib/db-helpers";

export default function DashboardPage() {
  const { toast } = useToast();
  const [isSavingStats, setIsSavingStats] = useState(false);
  const [copyId, setCopyId] = useState("");

  const { data: competitors, isLoading: isCompLoading } = useCollection({ endpoint: '/competitors' });
  const { data: rolas, isLoading: isRolasLoading } = useCollection({ endpoint: '/rolas' });
  const { data: gallery, isLoading: isGalleryLoading } = useCollection({ endpoint: '/gallery' });
  const { data: statsData } = useDoc('/settings');

  const [statsForm, setStatsForm] = useState({ battles: 0, tournaments: 0, champions: 0, competitors: 0 });

  useEffect(() => { 
    if (statsData) setStatsForm({ battles: statsData.battles || 0, tournaments: statsData.tournaments || 0, champions: statsData.champions || 0, competitors: statsData.competitors || 0 }); 
  }, [statsData]);

  const handleUpdateStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingStats(true);
    try {
      await updateDocument('/settings', 'global_stats', statsForm);
      toast({ title: "Guardado" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSavingStats(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData = await uploadRes.json();
      
      await addDocument('/gallery', { name: file.name, url: uploadData.url });
      toast({ title: "Imagen subida" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopyId(url);
    setTimeout(() => setCopyId(""), 2000);
    toast({ title: "URL Copiada" });
  };

  const del = async (endpoint: string, id: string) => {
    if (!confirm("¿Eliminar?")) return;
    try {
      await deleteDocument(endpoint, id);
      toast({ title: "Eliminado" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div><h1 className="text-3xl font-black">Panel Admin</h1><p className="text-muted-foreground text-sm">Gestión de RivalRanks</p></div>
        <div className="flex gap-2">
          <Link href="/admin/rola/new"><Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-2"/>Batalla</Button></Link>
          <Link href="/admin/competitor/new"><Button size="sm"><Plus className="w-4 h-4 mr-2"/>Competidor</Button></Link>
        </div>
      </div>

      <Card className="bg-card/50">
        <CardContent className="pt-6">
          <form onSubmit={handleUpdateStats} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(statsForm).map((key) => (
              <div key={key} className="space-y-1">
                <Label className="text-[10px] uppercase font-bold">{key}</Label>
                <Input type="number" value={(statsForm as any)[key]} onChange={e => setStatsForm({...statsForm, [key]: parseInt(e.target.value) || 0})} className="h-8"/>
              </div>
            ))}
            <Button type="submit" disabled={isSavingStats} className="col-span-full md:col-start-4 h-8 mt-4">
              {isSavingStats ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4 mr-2"/>} Guardar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="competitors">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          {["competitors", "rolas", "gallery"].map(t => <TabsTrigger key={t} value={t} className="capitalize px-6 rounded-lg font-bold">{t}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="competitors">
          <div className="bg-card rounded-xl border border-muted overflow-hidden">
            <Table>
              <TableHeader><TableRow><TableHead>Imagen</TableHead><TableHead>Nombre</TableHead><TableHead>W/L</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
              <TableBody>
                {isCompLoading ? <TableRow><TableCell colSpan={4} className="text-center py-10"><Loader2 className="animate-spin mx-auto"/></TableCell></TableRow> : competitors?.map(c => (
                  <TableRow key={c.id}>
                    <TableCell><Avatar><AvatarImage src={c.imageUrl}/><AvatarFallback>{c.name[0]}</AvatarFallback></Avatar></TableCell>
                    <TableCell className="font-bold">{c.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.wins} / {c.losses}</TableCell>
                    <TableCell className="text-right"><div className="flex justify-end gap-1">
                      <Link href={`/admin/competitor/${c.id}`}><Button variant="ghost" size="icon"><Edit className="w-4 h-4"/></Button></Link>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => del("/competitors", c.id)}><Trash2 className="w-4 h-4"/></Button>
                    </div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="rolas">
          <div className="bg-card rounded-xl border border-muted overflow-hidden">
            <Table>
              <TableBody>
                {isRolasLoading ? <TableRow><TableCell className="text-center py-10"><Loader2 className="animate-spin mx-auto"/></TableCell></TableRow> : rolas?.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-bold">{r.title}</TableCell>
                    <TableCell className="text-right"><div className="flex justify-end gap-1">
                      <Link href={`/admin/rola/${r.id}`}><Button variant="ghost" size="icon"><Edit className="w-4 h-4"/></Button></Link>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => del("/rolas", r.id)}><Trash2 className="w-4 h-4"/></Button>
                    </div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="gallery">
          <div className="space-y-4">
            <div className="flex justify-between items-center"><h3 className="font-bold">Media</h3><Input type="file" onChange={handleFileUpload} className="max-w-[200px] h-8 text-[10px]"/></div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {gallery?.map(g => (
                <div key={g.id} className="relative aspect-square rounded-lg border border-muted overflow-hidden group">
                  <img src={g.url} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                    <Button variant="ghost" size="icon" onClick={() => copyUrl(g.url)}>{copyId === g.url ? <Check className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4 text-white"/>}</Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => del("/gallery", g.id)}><Trash2 className="w-4 h-4"/></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
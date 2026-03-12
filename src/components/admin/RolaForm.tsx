
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { Save, Loader2 } from "lucide-react";
import { addDocument, updateDocument, getCollection } from "@/lib/db-helpers";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, "Título es requerido"),
  competitor1Id: z.string().min(1, "Selecciona el primer competidor"),
  competitor2Id: z.string().min(1, "Selecciona el segundo competidor"),
  date: z.string().min(1, "Fecha es requerida"),
  link: z.string().url("Debe ser un enlace válido"),
  points: z.coerce.number().min(0),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RolaFormProps {
  initialData?: any;
}

export function RolaForm({ initialData }: RolaFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [isLoadingCompetitors, setIsLoadingCompetitors] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Cargar competidores
  useEffect (() => {
    const loadCompetitors = async () => {
      try {
        const data = await getCollection('/competitors');
        setCompetitors(data.sort((a: any, b: any) => a.name.localeCompare(b.name)));
      } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los competidores." });
      } finally {
        setIsLoadingCompetitors(false);
      }
    };
    loadCompetitors();
  }, [toast]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      competitor1Id: initialData?.competitor1Id || "",
      competitor2Id: initialData?.competitor2Id || "",
      date: initialData?.date || "",
      link: initialData?.link || "",
      points: initialData?.points || 0,
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = values.imageUrl || "";

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error('Upload failed');
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      const comp1 = competitors.find(c => c.id === values.competitor1Id);
      const comp2 = competitors.find(c => c.id === values.competitor2Id);

      const rolaData = {
        ...values,
        competitor1Name: comp1?.name || "Desconocido",
        competitor2Name: comp2?.name || "Desconocido",
        imageUrl: finalImageUrl,
      };

      if (initialData?.id) {
        await updateDocument('/rolas', initialData.id, rolaData);
        toast({ title: "Actualizado", description: "Los cambios se han guardado." });
      } else {
        await addDocument('/rolas', rolaData);
        toast({ title: "Creado", description: "La batalla se ha registrado." });
      }
      
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Hubo un problema." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la Batalla</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Red Bull Batalla 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="competitor1Id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competidor 1</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {competitors?.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="competitor2Id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competidor 2</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {competitors?.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha o Evento</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Ej. Mayo 2024 o Final Nacional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enlace del Video</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puntos</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormLabel>Miniatura</FormLabel>
            <ImageUpload
              onImageSelect={setImageFile}
              currentImageUrl={initialData?.imageUrl}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Guardar Batalla
          </Button>
        </div>
      </form>
    </Form>
  );
}

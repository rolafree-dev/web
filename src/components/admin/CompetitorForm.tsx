"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageUpload } from "./ImageUpload";
import { generateCompetitorBio } from "@/ai/flows/generate-competitor-bio";
import { Sparkles, Save, Loader2, Instagram, Twitter, Youtube } from "lucide-react";
import { addDocument, updateDocument } from "@/lib/db-helpers";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "Nombre es requerido"),
  country: z.string().min(1, "País es requerido"),
  wins: z.coerce.number().min(0),
  losses: z.coerce.number().min(0),
  bio: z.string().min(10, "Bio es requerida"),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CompetitorFormProps {
  initialData?: any;
}

export function CompetitorForm({ initialData }: CompetitorFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      country: initialData?.country || "",
      wins: initialData?.wins || 0,
      losses: initialData?.losses || 0,
      bio: initialData?.bio || "",
      imageUrl: initialData?.imageUrl || "",
      isActive: initialData?.isActive ?? true,
      instagram: initialData?.instagram || "",
      twitter: initialData?.twitter || "",
      youtube: initialData?.youtube || "",
    },
  });

  const handleGenerateBio = async () => {
    const values = form.getValues();
    if (!values.name) {
      toast({ variant: "destructive", title: "Falta el nombre", description: "Por favor ingresa un nombre para generar la bio." });
      return;
    }
    
    setIsGeneratingBio(true);
    try {
      const result = await generateCompetitorBio({
        name: values.name,
        wins: values.wins,
        losses: values.losses,
      });
      form.setValue("bio", result.bio);
      toast({ title: "Bio generada", description: "La biografía ha sido creada por la IA." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo generar la biografía." });
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = values.imageUrl || "";

      if (imageFile) {
        // Upload to Vercel Blob
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const uploadRes = await fetch('/api/upload-vercel', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadRes.ok) {
          const error = await uploadRes.json();
          throw new Error(error.error || 'Upload failed');
        }
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      }

      const competitorData = {
        ...values,
        imageUrl: finalImageUrl,
      };

      if (initialData?.id) {
        await updateDocument('/competitors', initialData.id, competitorData);
        toast({ title: "Actualizado", description: "Los cambios se han guardado." });
      } else {
        await addDocument('/competitors', competitorData);
        toast({ title: "Creado", description: "El nuevo perfil se ha registrado." });
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Competidor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. El Misionero" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>País</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Chile" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="wins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Victorias</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? 0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="losses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Derrotas</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? 0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 p-4 bg-muted/20 rounded-2xl border border-muted">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Redes Sociales</h3>
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <FormLabel className="m-0 text-xs">Instagram (Usuario o URL)</FormLabel>
                      </div>
                      <FormControl>
                        <Input placeholder="@usuario" {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-blue-400" />
                        <FormLabel className="m-0 text-xs">Twitter / X (Usuario o URL)</FormLabel>
                      </div>
                      <FormControl>
                        <Input placeholder="@usuario" {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="youtube"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-500" />
                        <FormLabel className="m-0 text-xs">YouTube (URL del Canal)</FormLabel>
                      </div>
                      <FormControl>
                        <Input placeholder="https://youtube.com/..." {...field} value={field.value || ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-muted p-4 shadow-sm bg-card/50">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Competidor activo</FormLabel>
                    <FormDescription>
                      Indica si el competidor está participando actualmente en la liga.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Biografía</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateBio}
                      disabled={isGeneratingBio}
                      className="text-primary border-primary/20 hover:bg-primary/10"
                    >
                      {isGeneratingBio ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      IA Bio
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Cuéntanos sobre su trayectoria..."
                      className="h-32 resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormLabel>Imagen de Perfil</FormLabel>
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
          <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {initialData?.id ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Supabase database helper functions
 * Provides CRUD operations for all tables
 */

// ============== COMPETITORS ==============

export async function addCompetitor(data: any) {
  const { data: result, error } = await supabase
    .from('competitors')
    .insert([data])
    .select();

  if (error) throw new Error(error.message);
  return result?.[0];
}

export async function updateCompetitor(id: string, data: any) {
  const { data: result, error } = await supabase
    .from('competitors')
    .update({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  return result?.[0];
}

export async function deleteCompetitor(id: string) {
  const { error } = await supabase
    .from('competitors')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getCompetitor(id: string) {
  const { data, error } = await supabase
    .from('competitors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getCompetitors() {
  const { data, error } = await supabase
    .from('competitors')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// ============== ROLAS ==============

export async function addRola(data: any) {
  const { data: result, error } = await supabase
    .from('rolas')
    .insert([data])
    .select();

  if (error) throw new Error(error.message);
  return result?.[0];
}

export async function updateRola(id: string, data: any) {
  const { data: result, error } = await supabase
    .from('rolas')
    .update({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  return result?.[0];
}

export async function deleteRola(id: string) {
  const { error } = await supabase
    .from('rolas')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getRola(id: string) {
  const { data, error } = await supabase
    .from('rolas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getRolas() {
  const { data, error } = await supabase
    .from('rolas')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// ============== TOURNAMENTS ==============

export async function addTournament(data: any) {
  const tournamentData = {
    ...data,
    bracket: data.bracket ? JSON.stringify(data.bracket) : undefined,
  };

  const { data: result, error } = await supabase
    .from('tournaments')
    .insert([tournamentData])
    .select();

  if (error) throw new Error(error.message);
  const inserted = result?.[0];
  if (inserted?.bracket && typeof inserted.bracket === 'string') {
    inserted.bracket = JSON.parse(inserted.bracket);
  }
  return inserted;
}

export async function updateTournament(id: string, data: any) {
  const { data: result, error } = await supabase
    .from('tournaments')
    .update({
      ...data,
      bracket: data.bracket ? JSON.stringify(data.bracket) : undefined,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  const updated = result?.[0];
  if (updated?.bracket && typeof updated.bracket === 'string') {
    updated.bracket = JSON.parse(updated.bracket);
  }
  return updated;
}

export async function deleteTournament(id: string) {
  const { error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getTournament(id: string) {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (data?.bracket && typeof data.bracket === 'string') {
    data.bracket = JSON.parse(data.bracket);
  }
  return data;
}

export async function getTournaments() {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map((t: any) => ({
    ...t,
    bracket: t.bracket && typeof t.bracket === 'string' ? JSON.parse(t.bracket) : t.bracket,
  }));
}

// ============== EVENTS ==============

export async function addEvent(data: any) {
  const { data: result, error } = await supabase
    .from('events')
    .insert([data])
    .select();

  if (error) throw new Error(error.message);
  return result?.[0];
}

export async function updateEvent(id: string, data: any) {
  const { data: result, error } = await supabase
    .from('events')
    .update(data)
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  return result?.[0];
}

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getEvent(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

// ============== SETTINGS ==============

export async function getSetting(key: string) {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', key)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(error.message);
  }
  return data;
}

export async function updateSetting(key: string, value: any) {
  const existing = await getSetting(key);

  if (!existing) {
    const { data, error } = await supabase
      .from('settings')
      .insert([{ id: key, ...value }])
      .select();
    if (error) throw new Error(error.message);
    return data?.[0];
  }

  const { data, error } = await supabase
    .from('settings')
    .update(value)
    .eq('id', key)
    .select();

  if (error) throw new Error(error.message);
  return data?.[0];
}

// ============== GALLERY ==============

export async function addGalleryImage(data: any) {
  const { data: result, error } = await supabase
    .from('gallery')
    .insert([data])
    .select();

  if (error) throw new Error(error.message);
  return result?.[0];
}

export async function deleteGalleryImage(id: string) {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getGalleryImage(id: string) {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getGalleryImages() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// ============== GENERIC HELPERS ==============

export async function addDocument(endpoint: string, data: any) {
  const table = endpoint.replace('/api/db/', '');
  const functions: any = {
    competitors: addCompetitor,
    rolas: addRola,
    tournaments: addTournament,
    events: addEvent,
    gallery: addGalleryImage,
  };
  return functions[table]?.(data);
}

export async function updateDocument(endpoint: string, id: string, data: any) {
  const table = endpoint.replace('/api/db/', '');
  const functions: any = {
    competitors: updateCompetitor,
    rolas: updateRola,
    tournaments: updateTournament,
    events: updateEvent,
  };
  return functions[table]?.(id, data);
}

export async function deleteDocument(endpoint: string, id: string) {
  const table = endpoint.replace('/api/db/', '');
  const functions: any = {
    competitors: deleteCompetitor,
    rolas: deleteRola,
    tournaments: deleteTournament,
    events: deleteEvent,
    gallery: deleteGalleryImage,
  };
  return functions[table]?.(id);
}

export async function getDocument(endpoint: string, id: string) {
  const table = endpoint.replace('/api/db/', '');
  const functions: any = {
    competitors: getCompetitor,
    rolas: getRola,
    tournaments: getTournament,
    events: getEvent,
    gallery: getGalleryImage,
  };
  return functions[table]?.(id);
}

export async function getCollection(endpoint: string) {
  const table = endpoint.replace('/api/db/', '');
  const functions: any = {
    competitors: getCompetitors,
    rolas: getRolas,
    tournaments: getTournaments,
    events: getEvents,
    gallery: getGalleryImages,
  };
  return functions[table]?.() || [];
}

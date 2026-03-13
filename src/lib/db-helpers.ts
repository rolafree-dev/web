// Funciones helper para interactuar con la BD local

export async function addDocument(endpoint: string, data: any) {
  const response = await fetch(`/api/db${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add document');
  return response.json();
}

export async function updateDocument(endpoint: string, id: string, data: any) {
  const response = await fetch(`/api/db${endpoint}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update document');
  return response.json();
}

export async function deleteDocument(endpoint: string, id: string) {
  const response = await fetch(`/api/db${endpoint}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete document');
  return response.json();
}

export async function getDocument(endpoint: string, id: string) {
  const response = await fetch(`/api/db${endpoint}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch document');
  return response.json();
}

export async function getCollection(endpoint: string) {
  const response = await fetch(`/api/db${endpoint}`);
  if (!response.ok) throw new Error('Failed to fetch collection');
  return response.json();
}

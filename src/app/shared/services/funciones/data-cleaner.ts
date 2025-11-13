export function filterActiveIdAndTitle(data: any[]): { id: number; titulo: string }[] {
  if (!Array.isArray(data)) return [];

  return data
    .filter(item => item.estado === true)
    .map(item => ({
      id: item.id,
      titulo: item.titulo
    }));
}

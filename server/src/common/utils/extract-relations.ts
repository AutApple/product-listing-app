import { FindOptionsSelect } from 'typeorm';

export function extractRelationsFromSelect<T>(
  select: FindOptionsSelect<T> | undefined
): string[] {
  if (!select) return [];

  const relations: string[] = [];

  function walk(obj: any, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const relationPath = path.length ? `${path.join('.')}.${key}` : key;
        relations.push(relationPath);

        walk(value, [...path, key]);
      }
    }
  }

  walk(select);
  return relations;
}
export const parseJsonSafely = <T = any>(json: string | any): T => {
  if (!json) return {} as T;
  if (typeof json === 'string') {
    try {
      const data = JSON.parse(json ?? '');
      return data;
    } catch {
      return json as T;
    }
  }

  return json;
};

export function joinPath(...parts: string[]) {
  return (
    '/' +
    parts
      .map((p) => p.replace(/^\/+|\/+$/g, '')) // remove all leading/trailing slashes
      .filter(Boolean)
      .join('/')
  );
}

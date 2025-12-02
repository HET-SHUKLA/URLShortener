/**
 * Helper function to get header
 * @param v Header value
 * @returns Header string
 */
export const getHeaderString = (v?: string | string[] | undefined): string | undefined => {
  if (!v) return undefined;
  return Array.isArray(v) ? v[0] : v;
}
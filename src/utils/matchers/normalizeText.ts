/**
 * Normalizes a string or RegExp by applying the specified options.
 *
 * @param data The string or RegExp to normalize.
 * @param options The options to apply during normalization.
 */
export function normalizeText<T extends string | RegExp>(
  data: T,
  options: { ignoreCase?: boolean; trim?: boolean } = {},
): T {
  const { ignoreCase, trim } = options;

  if (typeof data === 'string') {
    let result: string = data;

    if (trim) result = result.trim();

    if (ignoreCase) result = result.toLowerCase();

    return result as T;
  }

  if (data instanceof RegExp) {
    const flags = data.flags.replace(/[gy]/g, '');
    const clearFlags = ignoreCase && !flags.includes('i') ? `${flags}i` : flags;

    return new RegExp(data.source, clearFlags) as T;
  }

  return data;
}

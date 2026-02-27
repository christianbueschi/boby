import en from './en.json';

type DotPath<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? Prefix extends ''
          ? DotPath<T[K], K>
          : DotPath<T[K], `${Prefix}.${K}`>
        : never;
    }[keyof T]
  : Prefix;

type TranslationKey = DotPath<typeof en>;

const getNestedValue = (obj: Record<string, unknown>, key: string): string => {
  const keys = key.split('.');
  let value: unknown = obj;
  for (const k of keys) {
    value = (value as Record<string, unknown>)[k];
  }
  return value as string;
};

export const t = (key: TranslationKey): string =>
  getNestedValue(en as unknown as Record<string, unknown>, key);
